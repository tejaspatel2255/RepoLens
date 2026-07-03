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

  // Build the prompt matching your specifications
  const prompt = `You are analyzing a GitHub repository for non-technical users.

Repository: ${owner}/${repo}
Description: ${info.description || 'No description provided.'}
Topics: ${(info.topics || []).join(', ')}
Stars: ${info.stars || 0} | Forks: ${info.forks || 0} | Watchers: ${info.watchers || 0}
Primary Language: ${info.language || 'Unknown'}
Created: ${info.createdAt || 'Unknown'} | Last Push: ${info.pushedAt || 'Unknown'}
Size: ${info.size || 0}KB | Open Issues: ${info.openIssues || 0}
Homepage: ${info.homepage || 'None'}

Language breakdown:
${languages.map(l => `${l.name}: ${l.percentage}%`).join('\n')}

Top Contributors: ${contributors.map(c => c.login).join(', ')}

Last 15 commit messages:
${commits.map(c => `- ${c.message}`).join('\n')}

Root files/folders: ${contents.map(c => c.name).join(', ')}

README (first 4000 chars):
${readme}

Return ONLY a valid JSON object with NO markdown formatting, NO backticks, 
NO extra text. Just the raw JSON:
{
  "tagline": "one punchy sentence (max 15 words) describing what this does",
  "whatItDoes": "explain in 3 paragraphs what this project does for someone who has never coded",
  "problemItSolves": "1-2 sentences on the real world problem this fixes",
  "whoIsItFor": "describe the exact type of person who would use this",
  "realWorldUseCase": "give a specific story example of someone using this tool",
  "keyFeatures": ["feature 1", "feature 2", "feature 3", "feature 4", "feature 5"],
  "techStack": [
    {"name": "React", "role": "Builds the user interface", "icon": "⚛️", "category": "Frontend"}
  ],
  "howItWorks": [
    {"step": 1, "title": "Short title", "description": "Plain English explanation of this step"}
  ],
  "projectType": "Web App / CLI Tool / Library / API / Mobile App / DevOps Tool / AI Tool / Other",
  "difficultyToUse": "Easy / Moderate / Technical",
  "maturityLevel": "Experimental / Active Development / Stable / Mature",
  "similarTo": "This is like [well-known app] but for [specific purpose]",
  "gettingStarted": "How would a beginner start using or contributing to this in 2-3 sentences",
  "funFact": "one interesting or surprising thing about this project"
}`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'google/gemini-flash-1.5',
        messages: [
          { 
            role: 'system', 
            content: 'You are a technical analyst. Respond ONLY with raw valid JSON. No markdown. No backticks. No explanation.' 
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
