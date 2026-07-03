import axios from 'axios';

/**
 * Analyze a repository using OpenRouter AI.
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

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not set in environment variables.');
  }

  const prompt = `Analyze this GitHub repository and return ONLY a raw JSON object. No markdown. No backticks. No explanation. Just the JSON.

Repository: ${owner}/${repo}
Description: ${info.description || 'None'}
Stars: ${info.stars ?? 0} | Forks: ${info.forks ?? 0}
Language: ${info.language || 'Unknown'}
Topics: ${(info.topics || []).join(', ') || 'None'}
Created: ${info.createdAt || 'Unknown'} | Last Push: ${info.pushedAt || 'Unknown'}

Languages: ${(languages || []).map(l => `${l.name}: ${l.percentage}%`).join(', ') || 'Unknown'}

Dependencies: ${Object.keys(packageInfo.dependencies || {}).join(', ') || 'unknown'}
Dev Dependencies: ${Object.keys(packageInfo.devDependencies || {}).join(', ') || 'unknown'}
Scripts: ${Object.keys(packageInfo.scripts || {}).join(', ') || 'unknown'}

Folder structure flags:
- Has Tests: ${folderStructure.hasTests ?? false}
- Has CI/CD: ${folderStructure.hasCI ?? false}
- Has Docker: ${folderStructure.hasDocker ?? false}
- Has Migrations: ${folderStructure.hasMigrations ?? false}

Root files: ${(contents || []).map(c => c.name).join(', ')}

File tree: ${(folderStructure.allPaths || []).slice(0, 40).join(', ')}

Last 15 commits:
${(commits || []).slice(0, 15).map((c, i) => `${i + 1}. ${c.message}`).join('\n')}

README:
${readme ? readme.slice(0, 4000) : 'No README found'}

Return this exact JSON (all fields required, all specific to THIS repo):
{
  "tagline": "specific one line what this project does",
  "whatItDoes": "3 paragraphs explaining this project to a non-technical person",
  "problemItSolves": "exact problem this project solves",
  "whoIsItFor": "specific target user",
  "realWorldUseCase": "realistic story of someone using this",
  "keyFeatures": ["real feature 1", "real feature 2", "real feature 3", "real feature 4", "real feature 5"],
  "techStack": [
    {"name": "tech name", "role": "what it does in this project", "icon": "emoji", "category": "Frontend/Backend/Database/DevOps/Testing/AI/Other", "learnMore": "why this tech was chosen"}
  ],
  "folderStructure": [
    {"name": "folder or file", "type": "folder or file", "purpose": "what this does in plain English"}
  ],
  "howItWorks": [
    {"step": 1, "title": "step title", "description": "what happens in this step"}
  ],
  "architectureType": "Monolith/Microservices/Serverless/JAMstack/MVC/etc",
  "projectType": "Web App/CLI Tool/Library/API/Mobile App/DevOps Tool/AI Tool/Game/Other",
  "difficultyToUse": "Easy/Moderate/Technical",
  "difficultyToContribute": "Beginner Friendly/Intermediate/Expert Only",
  "maturityLevel": "Experimental/Active Development/Stable/Mature/Abandoned",
  "similarTo": "This is like [real app] but [specific difference]",
  "gettingStarted": "how to actually start using this project",
  "installCommand": "actual install command or null",
  "runCommand": "actual run command or null",
  "openSourceLicense": "${info.license || 'Unknown'}",
  "funFact": "one interesting specific thing about this project",
  "hasTests": ${folderStructure.hasTests ?? false},
  "hasDocker": ${folderStructure.hasDocker ?? false},
  "hasCICD": ${folderStructure.hasCI ?? false},
  "projectHealthScore": {
    "hasReadme": ${!!readme},
    "hasTests": ${folderStructure.hasTests ?? false},
    "hasCICD": ${folderStructure.hasCI ?? false},
    "hasDocker": ${folderStructure.hasDocker ?? false},
    "hasLicense": ${!!info.license},
    "recentlyUpdated": ${info.pushedAt ? (new Date() - new Date(info.pushedAt) < 6 * 30 * 24 * 60 * 60 * 1000) : false},
    "score": "0/6",
    "rating": "Needs Work"
  }
}`;

  console.log('=== CALLING OPENROUTER API ===');
  console.log('Model: google/gemini-flash-1.5');
  console.log('Repo:', `${owner}/${repo}`);
  console.log('Key prefix:', apiKey.slice(0, 15) + '...');

  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: 'google/gemini-flash-1.5',
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
      temperature: 0.7,
      max_tokens: 3000
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://repo-lens-client.vercel.app',
        'X-Title': 'RepoLens'
      },
      timeout: 60000
    }
  );

  console.log('=== OPENROUTER RESPONSE RECEIVED ===');
  console.log('Status:', response.status);
  console.log('Usage:', JSON.stringify(response.data.usage));

  const content = response.data.choices[0].message.content;
  console.log('Raw AI response (first 300 chars):', content.slice(0, 300));

  // Strip any accidental markdown fences
  const cleaned = content
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  // Find JSON object in response
  const jsonStart = cleaned.indexOf('{');
  const jsonEnd = cleaned.lastIndexOf('}');

  if (jsonStart === -1 || jsonEnd === -1) {
    console.error('Full AI response that failed to parse:', content);
    throw new Error('AI response did not contain valid JSON');
  }

  const jsonString = cleaned.slice(jsonStart, jsonEnd + 1);
  const parsed = JSON.parse(jsonString);

  // Calculate actual health score from real boolean values
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
