# RepoLens - GitHub Repository Analyzer

RepoLens is a full-stack MERN (MongoDB/Express/React/Node -> here using Supabase/Express/React/Node) application that analyzes GitHub repositories. It provides repository snapshots, language distributions, contributor activity, commit timelines, and AI-powered repository summaries and feature analyses.

---

## Folder Structure

```text
repolens/
├── client/                  (React frontend - Vite)
│   ├── src/
│   │   ├── components/      (UI components - Hero, Navbar, Charts, etc.)
│   │   ├── pages/           (Home and Report pages)
│   │   ├── services/        (API communication)
│   │   ├── hooks/           (Custom React hooks)
│   │   ├── App.jsx          (Routes and core layout)
│   │   └── index.css        (Global styling & Design system)
│   └── package.json
│
├── server/                  (Node.js + Express backend)
│   ├── routes/              (GitHub, Analysis, and History routes)
│   ├── services/            (GitHub, OpenRouter, and Supabase service integrations)
│   └── index.js             (App entry point)
│
└── .env                     (Local environment secrets)
```

---

## Setup Instructions

Since you wanted to run terminal commands manually, follow these steps to install and start the project:

### 1. Root Configuration
Make sure the `.env` file in the root `repolens/` folder has your credentials:
```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
OPENROUTER_API_KEY=your_openrouter_key
GITHUB_TOKEN=optional_github_token
```

### 2. Install Server Dependencies
Navigate to the server directory and install standard dependencies (including security rate limiting):
```bash
cd server
npm install express cors dotenv axios @supabase/supabase-js express-rate-limit
npm install -D nodemon
```

### 3. Install Client Dependencies
Navigate to the client directory and install dependencies:
```bash
cd ../client
npm install
npm install axios react-router-dom
```

### 4. Running the Project
Open two terminals:

**Terminal 1 (Backend - Development mode):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend - Development mode):**
```bash
cd client
npm run dev
```

---

## Free Deployment Options ($0/month)

### Option A: Hosting on Vercel (Recommended)
Since Vercel configuration files (`vercel.json`) are already configured in this repository, you can deploy both backend and frontend directly on Vercel:

#### 1. Deploy Backend API
- Create a new project on Vercel, connect your repository.
- Set **Root Directory** to `repolens/server`.
- Set **Framework Preset** to `Other`.
- Add these **Environment Variables**:
  - `SUPABASE_URL` = your_supabase_url
  - `SUPABASE_ANON_KEY` = your_supabase_anon_key
  - `SUPABASE_SERVICE_KEY` = your_supabase_service_key
  - `OPENROUTER_API_KEY` = your_openrouter_api_key
  - `CLIENT_URL` = `*`
- Deploy. Copy your backend URL (e.g. `https://repolens-backend.vercel.app`).

#### 2. Deploy Frontend App
- Create another project on Vercel, connect the same repository.
- Set **Root Directory** to `repolens/client`.
- Set **Framework Preset** to `Vite`.
- Add this **Environment Variable**:
  - `VITE_API_URL` = `https://repolens-backend.vercel.app/api` (your Vercel backend URL + `/api`)
- Deploy.

---

### Option B: Hosting on Render + Netlify

#### 1. Database (Supabase)
- Create a free project on [Supabase](https://supabase.com).
- Run the commands in `schema.sql` inside the SQL Editor.

#### 2. Backend API (Render.com)
- Connect your GitHub repository to [Render](https://render.com).
- Create a new **Web Service**:
  - **Root Directory**: `server`
  - **Build Command**: `npm install`
  - **Start Command**: `node index.js`
- Add environment variables: `PORT=5000`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `OPENROUTER_API_KEY`, `CLIENT_URL`.

#### 3. Frontend App (Netlify)
- Connect your GitHub repository to [Netlify](https://netlify.com).
- Create a new site from Git:
  - **Base Directory**: `client`
  - **Build Command**: `npm run build`
  - **Publish Directory**: `dist`
- Add environment variable: `VITE_API_URL` pointing to your Render backend API URL.

**Total Cost**: $0.00 / month.


