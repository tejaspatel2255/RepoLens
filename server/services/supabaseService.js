import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('[Supabase] Warning: Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * 1. Save (or update) repository analysis
 */
export async function saveAnalysis(repoData, aiAnalysis) {
  const repoUrl = `https://github.com/${repoData.owner}/${repoData.repo}`;
  
  // Check if analysis exists
  const { data: existing, error: checkError } = await supabase
    .from('analyses')
    .select('*')
    .eq('repo_url', repoUrl)
    .order('created_at', { ascending: false })
    .limit(1);

  if (checkError) {
    throw checkError;
  }

  const mappedData = {
    repo_url: repoUrl,
    owner: repoData.owner,
    repo_name: repoData.repo,
    stars: repoData.info.stars,
    forks: repoData.info.forks,
    watchers: repoData.info.watchers,
    primary_language: repoData.info.language,
    description: repoData.info.description,
    topics: repoData.info.topics,
    languages: repoData.languages,
    contributors: repoData.contributors,
    commits: repoData.commits,
    contents: repoData.contents,
    readme: repoData.readme,
    ai_analysis: {
      ...aiAnalysis,
      repo_created_at: repoData.info.createdAt,
      homepage: repoData.info.homepage
    },
    updated_at: new Date().toISOString()
  };

  if (existing && existing.length > 0) {
    const record = existing[0];
    
    console.log(`[Supabase Cache] Updating existing record for ${repoUrl}.`);
    const { data: updated, error: updateError } = await supabase
      .from('analyses')
      .update(mappedData)
      .eq('id', record.id)
      .select()
      .single();

    if (updateError) throw updateError;
    return updated;
  }

  // Not exists: Insert new record
  console.log(`[Supabase Cache] Creating new analysis record for ${repoUrl}.`);
  const { data: inserted, error: insertError } = await supabase
    .from('analyses')
    .insert([mappedData])
    .select()
    .single();

  if (insertError) throw insertError;
  return inserted;
}

/**
 * 2. Retrieve analysis by database UUID and record a page view
 */
export async function getAnalysisById(id) {
  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found code
    throw error;
  }

  if (data) {
    // Record page view asynchronously
    supabase
      .from('repo_views')
      .insert([{ analysis_id: id }])
      .then(({ error: viewError }) => {
        if (viewError) console.error('[Supabase View Log Error]:', viewError.message);
      });
  }

  return data;
}

/**
 * 3. Retrieve analysis by URL
 */
export async function getAnalysisByUrl(repoUrl) {
  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('repo_url', repoUrl)
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) throw error;
  return data && data.length > 0 ? data[0] : null;
}

/**
 * 4. Retrieve recent analyses list
 */
export async function getRecentAnalyses(limit = 10) {
  const { data, error } = await supabase
    .from('analyses')
    .select('id, repo_url, owner, repo_name, stars, primary_language, description, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

/**
 * 5. Retrieve popular analyses sorted by page views count
 */
export async function getPopularAnalyses(limit = 6) {
  // Fetch analyses along with their views count relation
  const { data, error } = await supabase
    .from('analyses')
    .select('id, repo_url, owner, repo_name, stars, primary_language, description, repo_views(id)');

  if (error) throw error;

  const mapped = (data || []).map(a => ({
    id: a.id,
    repo_url: a.repo_url,
    owner: a.owner,
    repo_name: a.repo_name,
    stars: a.stars,
    primary_language: a.primary_language,
    description: a.description,
    view_count: a.repo_views ? a.repo_views.length : 0
  }));

  // Sort descending by view count
  mapped.sort((x, y) => y.view_count - x.view_count);
  return mapped.slice(0, limit);
}
