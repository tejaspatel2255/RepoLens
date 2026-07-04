import axios from 'axios';

export const analyzeRepo = async (repoData) => {
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

  console.log('=== OPENROUTER CALLED ===');
  console.log('Repo:', owner + '/' + repo);
  console.log('Key exists:', !!process.env.OPENROUTER_API_KEY);
  console.log('Key preview:', process.env.OPENROUTER_API_KEY?.slice(0, 20));

  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not configured on the server');
  }

  // Build context strings
  const languageStr = languages.length
    ? languages.map(l => `${l.name}: ${l.percentage}%`).join(', ')
    : info.language || 'Unknown';

  const commitStr = commits.length
    ? commits.slice(0, 10).map((c, i) => `${i + 1}. [${(c.date || '').slice(0, 10)}] ${c.message}`).join('\n')
    : 'No commits available';

  const depsStr = packageInfo.dependencies
    ? Object.keys(packageInfo.dependencies).slice(0, 20).join(', ')
    : 'Not detected';

  const devDepsStr = packageInfo.devDependencies
    ? Object.keys(packageInfo.devDependencies).slice(0, 15).join(', ')
    : 'Not detected';

  const scriptsStr = packageInfo.scripts
    ? Object.keys(packageInfo.scripts).join(', ')
    : 'Not detected';

  const rootFiles = contents.length
    ? contents.map(c => c.type === 'dir' ? c.name + '/' : c.name).join(', ')
    : 'Not available';

  const fileTreeStr = folderStructure.allPaths
    ? folderStructure.allPaths.slice(0, 30).join('\n')
    : 'Not available';

  const readmeSnippet = readme
    ? readme.slice(0, 2000)
    : 'No README found - infer from structure and commits';

  const contributorStr = contributors.length
    ? contributors.map(c => `${c.login} (${c.contributions} commits)`).join(', ')
    : 'Not available';

  const prompt = `You are analyzing a real GitHub repository. 
Read ALL the data carefully before responding.
Your response must be 100% specific to THIS repository only.
NEVER say generic things like "Repository Metadata Aggregation" or describe GitHub features.
Respond ONLY with a raw JSON object. No markdown. No backticks. No text outside the JSON.

=== REPOSITORY DATA ===

Name: ${owner}/${repo}
Description: ${info.description || 'No description provided'}
Topics: ${(info.topics || []).join(', ') || 'None'}
Stars: ${info.stars || 0} | Forks: ${info.forks || 0} | Watchers: ${info.watchers || 0}
Open Issues: ${info.openIssues || 0}
Primary Language: ${info.language || 'Unknown'}
License: ${info.license || 'Not specified'}
Created: ${info.createdAt || 'Unknown'}
Last Push: ${info.pushedAt || 'Unknown'}
Homepage: ${info.homepage || 'None'}
Is Fork: ${info.isFork || false}
Is Archived: ${info.isArchived || false}

Language Breakdown:
${languageStr}

Top Contributors:
${contributorStr}

Root Files and Folders:
${rootFiles}

Full File Tree (read carefully - reveals project structure):
${fileTreeStr}

Project Structure Flags:
- Has Tests: ${folderStructure.hasTests || false}
- Has CI/CD: ${folderStructure.hasCI || false}
- Has Docker: ${folderStructure.hasDocker || false}
- Has Database Migrations: ${folderStructure.hasMigrations || false}
- Has React Components: ${folderStructure.hasComponents || false}
- Has API Routes: ${folderStructure.hasAPI || false}
- Has Docs: ${folderStructure.hasDocs || false}

Package Info:
- Name: ${packageInfo.name || 'Unknown'}
- Version: ${packageInfo.version || 'Unknown'}
- Main Dependencies: ${depsStr}
- Dev Dependencies: ${devDepsStr}
- Available Scripts: ${scriptsStr}

Last 10 Commits (VERY IMPORTANT - reveals what was built):
${commitStr}

README Content (MOST IMPORTANT - read every word):
${readmeSnippet}

=== YOUR TASK ===
Based on all the above data, return this exact JSON.
Every single field must describe THIS specific repository.
Do NOT use generic descriptions.
Do NOT describe GitHub or version control in general.
Only describe what THIS project actually does.

{
  "tagline": "One specific sentence (max 15 words) about what THIS project does for users",

  "whatItDoes": "Write exactly 3 paragraphs. Paragraph 1: what this specific project is and its main purpose. Paragraph 2: what real problem it solves and for whom. Paragraph 3: how a typical user interacts with it day to day. Be completely specific to this repo.",

  "problemItSolves": "The exact real-world problem THIS project addresses in 1-2 sentences",

  "whoIsItFor": "The precise type of person or team who would use THIS tool specifically",

  "realWorldUseCase": "Tell a specific story: A [type of person] uses [repo name] to [do specific thing] so that [specific result]. Must be realistic and specific.",

  "keyFeatures": [
    "Specific feature 1 found in README or codebase",
    "Specific feature 2 found in README or codebase", 
    "Specific feature 3 found in README or codebase",
    "Specific feature 4 found in README or codebase",
    "Specific feature 5 found in README or codebase"
  ],

  "techStack": [
    {
      "name": "Exact technology name",
      "role": "What this technology specifically does in THIS project",
      "icon": "relevant emoji",
      "category": "Frontend or Backend or Database or DevOps or Testing or AI or Other",
      "learnMore": "One sentence on why this tech was likely chosen for this project"
    }
  ],

  "folderStructure": [
    {
      "name": "actual folder or file name from the tree",
      "type": "folder or file",
      "purpose": "plain English explanation of what this does in the project"
    }
  ],

  "howItWorks": [
    {
      "step": 1,
      "title": "Specific step title for THIS project",
      "description": "Exactly what happens in this step in THIS project specifically"
    }
  ],

  "architectureType": "Monolith or Microservices or Serverless or JAMstack or MVC or REST API or Other",

  "projectType": "Web App or CLI Tool or Library or API or Mobile App or DevOps Tool or AI Tool or Game or Browser Extension or Other",

  "difficultyToUse": "Easy or Moderate or Technical",

  "difficultyToContribute": "Beginner Friendly or Intermediate or Expert Only",

  "maturityLevel": "Experimental or Active Development or Stable or Mature or Abandoned",

  "similarTo": "This is like [real well-known app or tool] but [specific difference based on this repo]",

  "gettingStarted": "Exact steps to start using this project based on README and package scripts. Plain English.",

  "installCommand": "actual npm install or pip install command if found, otherwise null",

  "runCommand": "actual npm start or npm run dev command if found, otherwise null",

  "openSourceLicense": "${info.license || 'Not specified'}",

  "funFact": "One genuinely interesting or surprising fact specific to THIS project based on commits, structure, or README",

  "hasTests": ${folderStructure.hasTests || false},
  "hasDocker": ${folderStructure.hasDocker || false},
  "hasCICD": ${folderStructure.hasCI || false},

  "projectHealthScore": {
    "hasReadme": ${!!readme},
    "hasTests": ${folderStructure.hasTests || false},
    "hasCICD": ${folderStructure.hasCI || false},
    "hasDocker": ${folderStructure.hasDocker || false},
    "hasLicense": ${!!info.license},
    "recentlyUpdated": ${!!info.pushedAt},
    "score": "0/6",
    "rating": "Needs Work"
  }
}`

  console.log('Prompt length (chars):', prompt.length);

  const modelsToTry = [
    'google/gemini-2.5-flash',
    'google/gemini-2.5-flash-lite',
    'google/gemma-4-31b-it:free',
    'google/gemma-3-27b-it:free',
    'openrouter/free'
  ];

  let response = null;
  let lastError = null;

  for (const model of modelsToTry) {
    try {
      console.log(`Sending to OpenRouter with model: ${model}...`);
      response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: model,
          messages: [
            {
              role: 'system',
              content: 'You are a software analyst. Respond ONLY with raw valid JSON. No markdown. No backticks. No text before or after the JSON object.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 4000,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://repo-lens-client.vercel.app',
            'X-Title': 'RepoLens'
          },
          timeout: 55000
        }
      );
      console.log(`Successfully received response from model: ${model}`);
      break;
    } catch (apiError) {
      console.error(`=== OPENROUTER API CALL FAILED for model: ${model} ===`);
      console.error('Status:', apiError.response?.status);
      console.error('Data:', JSON.stringify(apiError.response?.data));
      console.error('Message:', apiError.message);

      lastError = apiError;

      // If it's a 401 Unauthorized, fail immediately as credentials are bad
      if (apiError.response?.status === 401) {
        throw apiError;
      }
      console.log('Trying next fallback model...');
    }
  }

  if (!response) {
    throw lastError || new Error('All OpenRouter models failed to respond.');
  }

  console.log('OpenRouter response status:', response.status);
  console.log('Model used:', response.data.model);
  console.log('Usage:', JSON.stringify(response.data.usage));

  const content = response.data.choices[0].message.content;
  console.log('Raw AI response (first 400 chars):', content.slice(0, 400));

  // Clean response
  const cleaned = content
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  const jsonStart = cleaned.indexOf('{');
  const jsonEnd = cleaned.lastIndexOf('}');

  if (jsonStart === -1 || jsonEnd === -1) {
    console.error('No valid JSON in response. Full content:', cleaned);
    throw new Error('AI response did not contain valid JSON');
  }

  const jsonString = cleaned.slice(jsonStart, jsonEnd + 1);
  let parsed;

  try {
    parsed = JSON.parse(jsonString);
  } catch (parseError) {
    console.error('JSON parse failed:', parseError.message);
    console.error('Full JSON string:');
    console.error(jsonString);
    const match = parseError.message.match(/at position (\d+)/);
    if (match) {
      const pos = parseInt(match[1], 10);
      const start = Math.max(0, pos - 150);
      const end = Math.min(jsonString.length, pos + 150);
      console.error('--- ERROR CONTEXT ---');
      console.error(jsonString.slice(start, pos) + ' >>>HERE>>> ' + jsonString.slice(pos, end));
      console.error('----------------------');
    }
    throw new Error('Failed to parse AI response as JSON: ' + parseError.message);
  }

  // Calculate real health score
  const healthChecks = [
    parsed.projectHealthScore?.hasReadme,
    parsed.projectHealthScore?.hasTests,
    parsed.projectHealthScore?.hasCICD,
    parsed.projectHealthScore?.hasDocker,
    parsed.projectHealthScore?.hasLicense,
    parsed.projectHealthScore?.recentlyUpdated
  ];
  const score = healthChecks.filter(Boolean).length;
  parsed.projectHealthScore.score = `${score}/6`;
  parsed.projectHealthScore.rating =
    score >= 5 ? 'Excellent' :
    score >= 3 ? 'Good' :
    'Needs Work';

  console.log('=== ANALYSIS COMPLETE ===');
  console.log('Health score:', parsed.projectHealthScore.score);
  return parsed;
};
