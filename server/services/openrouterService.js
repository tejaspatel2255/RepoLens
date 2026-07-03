import axios from 'axios';

/**
 * Analyze a repository using OpenRouter AI.
 * Uses a free model to avoid credit issues on Vercel.
 * Prompt is trimmed to stay within Vercel's 10s timeout.
 * Throws on any failure — no silent fallbacks.
 */
export async function analyzeRepo(repoData) {
  const {
    owner,
    repo,
    info = {},
    languages = [],
    contributors = [],
    commits = [],
    contents = [],
    readme = '',
    packageInfo = {},
    folderStructure = {}
  } = repoData;

  const apiKey = process.env.OPENROUTER_API_KEY;

  console.log('=== OPENROUTER CALLED ===');
  console.log('Key exists:', !!apiKey);
  console.log('Key preview:', apiKey ? apiKey.slice(0, 15) + '...' : 'NOT SET');
  console.log('Repo:', `${owner}/${repo}`);

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not set in environment variables.');
  }

  // ── Trim inputs to fit within Vercel's 10s function timeout ──
  const readmeSlice = readme ? readme.slice(0, 1500) : 'No README found';
  const pathsSlice = (folderStructure.allPaths || []).slice(0, 20).join(', ');
  const commitsSlice = (commits || []).slice(0, 10).map((c, i) => `${i + 1}. ${c.message}`).join('\n');
  const languagesStr = (languages || []).map(l => `${l.name}: ${l.percentage}%`).join(', ') || 'Unknown';
  const depsStr = Object.keys(packageInfo.dependencies || {}).slice(0, 20).join(', ') || 'unknown';
  const devDepsStr = Object.keys(packageInfo.devDependencies || {}).slice(0, 10).join(', ') || 'unknown';
  const scriptsStr = Object.keys(packageInfo.scripts || {}).join(', ') || 'unknown';
  const rootFiles = (contents || []).map(c => c.name).join(', ');

  const hasReadme = !!readme;
  const hasTests = folderStructure.hasTests ?? false;
  const hasCI = folderStructure.hasCI ?? false;
  const hasDocker = folderStructure.hasDocker ?? false;
  const hasLicense = !!info.license;
  const recentlyUpdated = info.pushedAt
    ? (new Date() - new Date(info.pushedAt) < 6 * 30 * 24 * 60 * 60 * 1000)
    : false;

  const prompt = `Analyze this GitHub repository and return ONLY a raw JSON object. No markdown. No backticks. No explanation. Just the JSON.

Repository: ${owner}/${repo}
Description: ${info.description || 'None'}
Stars: ${info.stars ?? 0} | Forks: ${info.forks ?? 0}
Language: ${info.language || 'Unknown'}
Topics: ${(info.topics || []).join(', ') || 'None'}
Created: ${info.createdAt || 'Unknown'} | Last Push: ${info.pushedAt || 'Unknown'}

Languages: ${languagesStr}
Dependencies: ${depsStr}
Dev Dependencies: ${devDepsStr}
Scripts: ${scriptsStr}

Folder flags: Tests=${hasTests} | CI=${hasCI} | Docker=${hasDocker}
Root files: ${rootFiles}
File tree: ${pathsSlice}

Last 10 commits:
${commitsSlice}

README (first 1500 chars):
${readmeSlice}

Return this exact JSON:
{
  "tagline": "specific one line what this project does",
  "whatItDoes": "3 paragraphs explaining this project to a non-technical person",
  "problemItSolves": "exact problem this project solves",
  "whoIsItFor": "specific target user",
  "realWorldUseCase": "realistic story of someone using this",
  "keyFeatures": ["feature 1", "feature 2", "feature 3", "feature 4", "feature 5"],
  "techStack": [
    {"name": "tech name", "role": "what it does", "icon": "emoji", "category": "Frontend/Backend/Database/DevOps/Testing/AI/Other", "learnMore": "why chosen"}
  ],
  "folderStructure": [
    {"name": "folder or file", "type": "folder or file", "purpose": "what this does"}
  ],
  "howItWorks": [
    {"step": 1, "title": "step title", "description": "what happens"}
  ],
  "architectureType": "Monolith/Microservices/Serverless/JAMstack/MVC/etc",
  "projectType": "Web App/CLI Tool/Library/API/Mobile App/DevOps Tool/AI Tool/Game/Other",
  "difficultyToUse": "Easy/Moderate/Technical",
  "difficultyToContribute": "Beginner Friendly/Intermediate/Expert Only",
  "maturityLevel": "Experimental/Active Development/Stable/Mature/Abandoned",
  "similarTo": "This is like [real app] but [specific difference]",
  "gettingStarted": "how to start using this project",
  "installCommand": "actual install command or null",
  "runCommand": "actual run command or null",
  "openSourceLicense": "${info.license || 'Unknown'}",
  "funFact": "one interesting specific thing about this project",
  "hasTests": ${hasTests},
  "hasDocker": ${hasDocker},
  "hasCICD": ${hasCI},
  "projectHealthScore": {
    "hasReadme": ${hasReadme},
    "hasTests": ${hasTests},
    "hasCICD": ${hasCI},
    "hasDocker": ${hasDocker},
    "hasLicense": ${hasLicense},
    "recentlyUpdated": ${recentlyUpdated},
    "score": "0/6",
    "rating": "Needs Work"
  }
}`;

  console.log('Model: meta-llama/llama-3.1-8b-instruct:free');
  console.log('Prompt length:', prompt.length, 'chars');

  let response;
  try {
    response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [
          {
            role: 'system',
            content: 'You are a software analyst. Respond ONLY with raw valid JSON. No markdown. No backticks. No explanation before or after the JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 3000,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://repo-lens-client.vercel.app',
          'X-Title': 'RepoLens'
        },
        timeout: 55000
      }
    );
  } catch (err) {
    console.error('=== OPENROUTER REQUEST FAILED ===');
    console.error('Message:', err.message);
    console.error('Status:', err.response?.status);
    console.error('Data:', JSON.stringify(err.response?.data));
    throw err;
  }

  console.log('=== OPENROUTER RESPONSE RECEIVED ===');
  console.log('Status:', response.status);
  console.log('Model used:', response.data.model);
  console.log('Usage:', JSON.stringify(response.data.usage));

  const content = response.data.choices?.[0]?.message?.content;

  if (!content) {
    console.error('Empty response from OpenRouter:', JSON.stringify(response.data));
    throw new Error('OpenRouter returned an empty response');
  }

  console.log('Response preview (first 300 chars):', content.slice(0, 300));

  // Strip any accidental markdown fences
  const cleaned = content
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  const jsonStart = cleaned.indexOf('{');
  const jsonEnd = cleaned.lastIndexOf('}');

  if (jsonStart === -1 || jsonEnd === -1) {
    console.error('Full AI response that failed to parse:', content);
    throw new Error('AI response did not contain valid JSON');
  }

  const jsonString = cleaned.slice(jsonStart, jsonEnd + 1);
  const parsed = JSON.parse(jsonString);

  // Compute actual health score from real booleans
  const health = parsed.projectHealthScore || {};
  const healthFields = [
    health.hasReadme,
    health.hasTests,
    health.hasCICD,
    health.hasDocker,
    health.hasLicense,
    health.recentlyUpdated
  ];
  const score = healthFields.filter(Boolean).length;
  parsed.projectHealthScore.score = `${score}/6`;
  parsed.projectHealthScore.rating =
    score >= 5 ? 'Excellent' : score >= 3 ? 'Good' : 'Needs Work';

  console.log('=== AI ANALYSIS COMPLETE ===');
  console.log('Health score:', parsed.projectHealthScore.score, '-', parsed.projectHealthScore.rating);

  return parsed;
}
