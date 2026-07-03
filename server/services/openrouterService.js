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

  const languagesStr = languages.map(l => `${l.name} (${l.percentage}%)`).join(', ');
  const contributorLogins = contributors.map(c => c.login).join(', ');
  const readmeContent = readme.slice(0, 4000);

  const prompt = `You are analyzing a REAL GitHub repository. You must describe THIS SPECIFIC project only. Do NOT give generic software descriptions. Do NOT say things like 'Repository Metadata Aggregation' or 'Git Activity Tracking' — those are descriptions of GitHub itself, not this project.

Repository: ${owner}/${repo}
Description: ${info.description || 'No description provided.'}
Topics: ${(info.topics || []).join(', ')}
Stars: ${info.stars || 0} | Forks: ${info.forks || 0}
Primary Language: ${info.language || 'Unknown'}
Languages used: ${languagesStr}
Top Contributors: ${contributorLogins}

Last 15 commit messages (READ THESE CAREFULLY — they reveal what the project does):
${commits.map(c => '- ' + c.message).join('\n')}

Root files/folders (READ THESE — they reveal the project structure):
${contents.map(c => c.name).join(', ')}

README (this is the most important — read it carefully):
${readmeContent}

STRICT RULES:
- keyFeatures must describe what THIS app/tool ACTUALLY does for its users
- Do NOT describe what GitHub does or what any repo generically does
- If the README mentions specific features, use THOSE exact features
- techStack must only include technologies actually found in this codebase
- howItWorks must describe THIS project's actual workflow, not generic steps
- similarTo must reference a real well-known app this resembles
- If README is empty or unhelpful, use commit messages and folder names to infer purpose

Return ONLY this raw JSON, no markdown, no backticks:
{
  "tagline": "specific one-line description of what THIS project actually does",
  "whatItDoes": "3 paragraphs explaining THIS project to a non-technical person. Be specific about what it does, not generic.",
  "problemItSolves": "the REAL problem THIS specific project solves",
  "whoIsItFor": "the EXACT type of person who would use THIS tool",
  "realWorldUseCase": "a SPECIFIC realistic story of someone using THIS exact tool",
  "keyFeatures": [
    "Feature specific to this project",
    "Another real feature from the README or code",
    "Third specific feature",
    "Fourth specific feature", 
    "Fifth specific feature"
  ],
  "techStack": [
    {"name": "actual tech name", "role": "what it does in THIS project", "icon": "emoji", "category": "Frontend/Backend/Database/etc"}
  ],
  "howItWorks": [
    {"step": 1, "title": "Specific step title", "description": "What actually happens in THIS project"}
  ],
  "projectType": "Web App / CLI Tool / Library / API / Mobile App / DevOps Tool / AI Tool / Game / Other",
  "difficultyToUse": "Easy / Moderate / Technical",
  "maturityLevel": "Experimental / Active Development / Stable / Mature",
  "similarTo": "This is like [real well-known app] but [specific difference]",
  "gettingStarted": "How to actually start using THIS project in 2-3 sentences",
  "funFact": "one genuinely interesting or surprising thing about THIS specific project"
}`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'google/gemini-flash-1.5',
        messages: [
          { 
            role: 'system', 
            content: 'You are a technical analyst who explains real GitHub projects. You always read the README carefully and describe what the project ACTUALLY does. You never give generic descriptions. You never describe GitHub features. You only describe the specific project you are analyzing. Respond ONLY with raw valid JSON. No markdown. No backticks. No extra text.' 
          },
          { 
            role: 'user', 
            content: prompt 
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
