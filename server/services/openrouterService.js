import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

/**
 * Fallback response when AI generation or JSON parsing fails
 */
function getDefaultAnalysis(repoData) {
  const owner = repoData.owner || 'unknown';
  const repoName = repoData.repo || 'unknown';
  const primaryLang = repoData.info?.language || 'Code';

  return {
    tagline: `An interactive explorer for the ${owner}/${repoName} codebase.`,
    whatItDoes: `This project, ${repoName}, is a software repository structured with files and folders to perform specific tasks. It is configured to run code primarily written in ${primaryLang}.\n\nIt aggregates dependency lists, licensing specifications, and configuration parameters to establish the project runtime.\n\nUsers can inspect the source code, review commit timelines, and explore active developers on GitHub.`,
    problemItSolves: "Organizes and structures project files for development tracking.",
    whoIsItFor: "Developers looking to study or integrate code examples from this project.",
    realWorldUseCase: "A software engineer clones the repository, checks the README file, and installs dependencies to build the project locally.",
    keyFeatures: [
      "Repository Metadata Aggregation",
      "Programming Language Distribution Analytics",
      "Git Activity Commit Timelines",
      "Developer Contributor Tracking",
      "Root Directory Navigation Structure"
    ],
    techStack: [
      { name: primaryLang, role: "Core programming language", icon: "💻", category: "Core" }
    ],
    howItWorks: [
      { step: 1, title: "Fetch Files", description: "The application requests repo details directly from the GitHub API." },
      { step: 2, title: "Process Statistics", description: "Calculates language percentages and parses recent commit entries." },
      { step: 3, title: "Display Summary", description: "Renders details in an interactive visual dashboard." }
    ],
    projectType: "Library",
    difficultyToUse: "Moderate",
    maturityLevel: "Active Development",
    similarTo: "This is like a typical project structure but specialized for this codebase.",
    gettingStarted: "Refer to the root README details to install requirements and run files.",
    funFact: "This repository has code assets actively tracked in a Git database."
  };
}

/**
 * Analyzes repository data using the OpenRouter AI completion service
 */
export async function analyzeRepo(repoData) {
  if (!OPENROUTER_API_KEY) {
    console.warn('[OpenRouter] Warning: Missing OPENROUTER_API_KEY. Using fallback analysis.');
    return {
      analysis: getDefaultAnalysis(repoData),
      usage: null
    };
  }

  const owner = repoData.owner || 'unknown';
  const repo = repoData.repo || 'unknown';
  const info = repoData.info || {};
  const languages = repoData.languages || [];
  const contributors = repoData.contributors || [];
  const commits = repoData.commits || [];
  const contents = repoData.contents || [];
  const readme = repoData.readme || 'No README file available.';

  const packageInfo = repoData.packageInfo || { name: repo, version: '1.0.0', scripts: {}, dependencies: {}, devDependencies: {}, packageManager: 'Unknown' };
  const folderStructure = repoData.folderStructure || {
    hasTests: false,
    hasDocs: false,
    hasCI: false,
    hasDocker: false,
    hasConfig: false,
    hasMigrations: false,
    hasComponents: false,
    hasAPI: false,
    allPaths: []
  };

  const languagesStr = languages.map(l => `${l.name} (${l.percentage}%)`).join(', ');
  const contributorLogins = contributors.map(c => `${c.login} (${c.contributions || 0} commits)`).join(', ');
  const readmeContent = readme.slice(0, 4000);

  const topicsStr = (info.topics || []).join(', ') || 'None';
  const homepageStr = info.homepage || 'None';
  const descriptionStr = info.description || 'No description provided';
  const isForkStr = info.isFork !== undefined ? info.isFork.toString() : 'false';
  const isArchivedStr = info.isArchived !== undefined ? info.isArchived.toString() : 'false';

  const systemPrompt = "You are an expert software analyst. Your job is to deeply analyze a GitHub repository and explain it clearly to someone who has never coded. You MUST base your analysis ONLY on the actual data provided — the README, folder structure, package dependencies, and commit messages. NEVER give generic answers. NEVER describe what GitHub does. NEVER say things like 'Repository Metadata Aggregation'. Every single field in your response must be specific to THIS repository. Respond ONLY with raw valid JSON. No markdown. No backticks. No extra text.";

  const userPrompt = `Analyze this GitHub repository deeply and return a detailed JSON report.

=== REPOSITORY IDENTITY ===
Name: ${owner}/${repo}
Description: ${descriptionStr}
Topics/Tags: ${topicsStr}
Homepage: ${homepageStr}
Stars: ${info.stars || 0} | Forks: ${info.forks || 0} | Watchers: ${info.watchers || 0}
Open Issues: ${info.openIssues || 0}
Primary Language: ${info.language || 'Unknown'}
Repo Size: ${info.size || 0} KB
Created: ${info.createdAt || 'Unknown'} | Last Updated: ${info.pushedAt || 'Unknown'}
Is Fork: ${isForkStr} | Is Archived: ${isArchivedStr}

=== LANGUAGE BREAKDOWN ===
${languages.map(l => `${l.name}: ${l.percentage}%`).join('\n')}

=== FOLDER & FILE STRUCTURE ===
Root level files/folders: ${contents.map(c => c.type === 'dir' ? c.name+'/' : c.name).join(', ')}

Full file tree (first 50 paths):
${(folderStructure.allPaths || []).join('\n')}

Structure flags:
- Has Tests: ${folderStructure.hasTests}
- Has Documentation: ${folderStructure.hasDocs}
- Has CI/CD Pipeline: ${folderStructure.hasCI}
- Has Docker: ${folderStructure.hasDocker}
- Has Database Migrations: ${folderStructure.hasMigrations}
- Has React Components: ${folderStructure.hasComponents}
- Has API Routes: ${folderStructure.hasAPI}

=== DEPENDENCIES (from package.json / equivalent) ===
Package Name: ${packageInfo.name || repo}
Version: ${packageInfo.version || '1.0.0'}
Scripts available: ${Object.keys(packageInfo.scripts || {}).join(', ')}

Main dependencies:
${Object.keys(packageInfo.dependencies || {}).join(', ')}

Dev dependencies:
${Object.keys(packageInfo.devDependencies || {}).join(', ')}

=== TOP CONTRIBUTORS ===
${contributors.map(c => c.login + ' (' + c.contributions + ' commits)').join(', ')}

=== LAST 15 COMMIT MESSAGES (read carefully — reveals what was built) ===
${commits.map((c, i) => `${i+1}. [${c.date ? c.date.slice(0,10) : 'Unknown'}] ${c.message}`).join('\n')}

=== README (most important — read every word) ===
${readmeContent || 'No README found — infer from structure and commits'}

=== YOUR ANALYSIS TASK ===
Based on ALL the above data, return this EXACT JSON structure.
Every field must reflect THIS specific repository. Be precise and detailed.

{
  "tagline": "One punchy sentence (max 15 words) describing what THIS project does. Must be specific.",

  "whatItDoes": "Write 3 full paragraphs explaining what this project does for a non-technical person. Paragraph 1: what the project is. Paragraph 2: what problem it solves. Paragraph 3: how someone would use it day to day. Be specific to this repo.",

  "problemItSolves": "The exact real-world problem THIS project addresses in 2 sentences.",

  "whoIsItFor": "The specific type of person or team who would use this. Be precise.",

  "realWorldUseCase": "Tell a specific story: A [type of person] uses this to [do what] so that [result]. Make it realistic and specific to this project.",

  "keyFeatures": [
    "Feature 1 — must be a real feature from the README or codebase",
    "Feature 2 — must be a real feature from the README or codebase",
    "Feature 3 — must be a real feature from the README or codebase",
    "Feature 4 — must be a real feature from the README or codebase",
    "Feature 5 — must be a real feature from the README or codebase"
  ],

  "techStack": [
    {
      "name": "exact technology name",
      "role": "what this technology specifically does in THIS project",
      "icon": "relevant emoji",
      "category": "Frontend / Backend / Database / DevOps / Testing / AI / Other",
      "learnMore": "one sentence why this technology was likely chosen"
    }
  ],

  "folderStructure": [
    {
      "name": "folder or file name",
      "type": "folder or file",
      "purpose": "what this folder/file does in plain English"
    }
  ],

  "howItWorks": [
    {
      "step": 1,
      "title": "Short specific title",
      "description": "Plain English explanation of THIS step in THIS project specifically"
    }
  ],

  "architectureType": "Monolith / Microservices / Serverless / JAMstack / MVC / etc",

  "projectType": "Web App / CLI Tool / Library / API / Mobile App / DevOps Tool / AI Tool / Game / Browser Extension / Other",

  "difficultyToUse": "Easy / Moderate / Technical",

  "difficultyToContribute": "Beginner Friendly / Intermediate / Expert Only",

  "maturityLevel": "Experimental / Active Development / Stable / Mature / Abandoned",

  "hasTests": ${folderStructure.hasTests},

  "hasDocker": ${folderStructure.hasDocker},

  "hasCICD": ${folderStructure.hasCI},

  "similarTo": "This is like [real well-known app/tool] but [specific difference based on actual repo]",

  "gettingStarted": "Exactly how to start using or running this project based on the README and scripts. Step by step in plain English.",

  "installCommand": "the actual install command from README or package.json scripts if available, else null",

  "runCommand": "the actual run/start command from scripts or README if available, else null",

  "openSourceLicense": "${info.license || 'Unknown'}",

  "funFact": "One genuinely interesting or surprising specific thing about THIS project based on its commits, structure, or README.",

  "projectHealthScore": {
    "hasReadme": ${readmeContent ? 'true' : 'false'},
    "hasTests": ${folderStructure.hasTests},
    "hasCICD": ${folderStructure.hasCI},
    "hasDocker": ${folderStructure.hasDocker},
    "hasLicense": ${info.license ? 'true' : 'false'},
    "recentlyUpdated": ${info.pushedAt ? (new Date() - new Date(info.pushedAt) < 6 * 30 * 24 * 60 * 60 * 1000 ? 'true' : 'false') : 'false'},
    "score": "calculate: each true = 1 point, max 6, return as X/6",
    "rating": "Excellent (5-6) / Good (3-4) / Needs Work (1-2)"
  }
}`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'google/gemini-flash-1.5',
        messages: [
          { 
            role: 'system', 
            content: systemPrompt
          },
          { 
            role: 'user', 
            content: userPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://repolens.app',
          'X-Title': 'RepoLens'
        },
        timeout: 30000 // 30s timeout
      }
    );

    const usage = response.data.usage || null;
    let content = response.data.choices?.[0]?.message?.content || '';

    // Strip any accidental markdown fences (e.g. ```json ... ```)
    content = content.trim();
    if (content.startsWith('```')) {
      content = content.replace(/^```[a-zA-Z0-9]*\n/, '').replace(/\n```$/, '');
    }
    content = content.trim();

    try {
      const parsed = JSON.parse(content);
      return {
        analysis: parsed,
        usage
      };
    } catch (parseErr) {
      console.error('[OpenRouter] JSON Parse Error. Raw content received:', content);
      return {
        analysis: getDefaultAnalysis(repoData),
        usage,
        error: 'JSON parse failure'
      };
    }
  } catch (error) {
    console.error('[OpenRouter] API Error:', error.response?.data || error.message);
    return {
      analysis: getDefaultAnalysis(repoData),
      usage: null,
      error: error.message
    };
  }
}
