import express from 'express';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const router = express.Router();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const SALT = 'repolens_secret_salt_123!';
const JWT_SECRET = 'repolens_jwt_secret_987!';

// Password Hashing Helper (Vanilla SHA-256 for zero-dependency portability)
function hashPassword(password) {
  return crypto.createHmac('sha256', SALT).update(password).digest('hex');
}

// Signed session token helpers
function generateToken(user) {
  const payload = JSON.stringify({
    id: user.id,
    email: user.email,
    name: user.name,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days expiration
  });
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('hex');
  return Buffer.from(payload).toString('base64') + '.' + signature;
}

function verifyToken(token) {
  try {
    const [payloadBase64, signature] = token.split('.');
    const payloadStr = Buffer.from(payloadBase64, 'base64').toString('utf8');
    const expectedSignature = crypto.createHmac('sha256', JWT_SECRET).update(payloadStr).digest('hex');
    
    if (signature !== expectedSignature) return null;
    
    const payload = JSON.parse(payloadStr);
    if (payload.exp < Date.now()) return null; // expired
    
    return payload;
  } catch (e) {
    return null;
  }
}

// Middleware to authenticate user via Authorization header
export function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No session token provided.' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired session.' });
  }

  req.user = decoded;
  next();
}

// 1. POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Please provide email, password, and name.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const hashedPassword = hashPassword(password);

    // Insert user into Supabase
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([
        {
          email: email.toLowerCase().trim(),
          password_hash: hashedPassword,
          name: name.trim()
        }
      ])
      .select()
      .single();

    if (insertError) {
      // Check if table missing error (42P01 in postgres)
      if (insertError.code === '42P01') {
        return res.status(500).json({
          error: "Database table 'users' does not exist in Supabase. Please copy and execute the SQL commands in schema.sql inside your Supabase dashboard's SQL Editor first, then try again."
        });
      }
      // Check if duplicate key violation
      if (insertError.code === '23505' || insertError.message?.includes('duplicate')) {
        return res.status(400).json({ error: 'An account with this email address already exists.' });
      }
      throw insertError;
    }

    // Generate token
    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      }
    });

  } catch (error) {
    console.error('Registration error:', error.message);
    return res.status(500).json({ error: error.message || 'Registration failed.' });
  }
});

// 2. POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password.' });
    }

    const hashedPassword = hashPassword(password);

    // Query user in Supabase
    const { data: user, error: queryError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (queryError || !user) {
      if (queryError && queryError.code === '42P01') {
        return res.status(500).json({
          error: "Database table 'users' does not exist in Supabase. Please copy and execute the SQL commands in schema.sql inside your Supabase dashboard's SQL Editor first, then try again."
        });
      }
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // Compare hash
    if (user.password_hash !== hashedPassword) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // Generate token
    const token = generateToken(user);

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ error: error.message || 'Login failed.' });
  }
});

// 3. GET /api/auth/me
router.get('/me', authenticateUser, async (req, res) => {
  return res.json({
    success: true,
    user: req.user
  });
});

export default router;
