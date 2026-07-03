import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Helper to format/standardize GitHub API errors
function wrapError(error) {
  const status = error.response?.status || 500;
  let message = error.message;
  
  if (status === 404) {
    message = 'Repository not found';
  } else if (status === 403) {
    message = 'GitHub API rate limit exceeded or access forbidden';
  } else if (status === 401) {
    message = 'Invalid GitHub API token (Unauthorized)';
  } else if (error.response?.data?.message) {
    message = error.response.data.message;
  }
  
  const err = new Error(message);
  err.statusCode = status;
  return err;
}

export class GitHubService {
  constructor() {
    // axios client is kept for individual method calls
    this.client = axios.create({
      baseURL: 'https://api.github.com',
      headers: this.getHeaders()
    });
  }

  /**
   * Build GitHub API headers, including auth token if available
   */
  getHeaders() {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'RepoLens-App'
    };
    const token = process.env.GITHUB_TOKEN;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  /**
   * 1. Parse repository URL or slug into owner and repo name.
   * Supports all common formats:
   *   https://github.com/owner/repo
   *   https://github.com/owner/repo/tree/main
   *   github.com/owner/repo
   *   owner/repo
   */
  parseRepoUrl(url) {
    if (!url || typeof url !== 'string') {
      throw new Error('Please enter a GitHub repository URL');
    }

    let cleaned = url.trim();
    cleaned = cleaned.replace(/\/$/, '');
    cleaned = cleaned.replace(/\.git$/, '');

    // Pattern 1: full URL with protocol (handles extra paths like /tree/main)
    let match = cleaned.match(/^https?:\/\/github\.com\/([^\/\s]+)\/([^\/\?\#\s]+)/);
    if (match) return { owner: match[1], repo: match[2] };

    // Pattern 2: URL without protocol
    match = cleaned.match(/^(?:www\.)?github\.com\/([^\/\s]+)\/([^\/\?\#\s]+)/);
    if (match) return { owner: match[1], repo: match[2] };

    // Pattern 3: plain owner/repo shorthand
    match = cleaned.match(/^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/);
    if (match) return { owner: match[1], repo: match[2] };

    // Pattern 4: github.com anywhere in the string (e.g. copied from address bar)
    match = cleaned.match(/github\.com\/([^\/\s]+)\/([^\/\?\#\s]+)/);
    if (match) return { owner: match[1], repo: match[2] };

    throw new Error(
      'Invalid GitHub URL. Please use format: https://github.com/owner/repo'
    );
  }

  /**
   * 2. Fetch repository base info
   */
  async getRepoInfo(owner, repo) {
    try {
      const res = await this.client.get(`/repos/${owner}/${repo}`);
      const data = res.data;
      
      return {
        name: data.name,
        description: data.description,
        stars: data.stargazers_count,
        forks: data.forks_count,
        watchers: data.watchers_count,
        openIssues: data.open_issues_count,
        language: data.language,
        license: data.license?.name || null,
        createdAt: data.created_at,
        pushedAt: data.pushed_at,
        homepage: data.homepage,
        topics: data.topics || [],
        defaultBranch: data.default_branch,
        size: data.size,
        isArchived: data.archived,
        isFork: data.fork,
        networkCount: data.network_count,
        subscribersCount: data.subscribers_count
      };
    } catch (error) {
      throw wrapError(error);
    }
  }

  /**
   * 3. Fetch programming languages list and compute percentages
   */
  async getLanguages(owner, repo) {
    try {
      const res = await this.client.get(`/repos/${owner}/${repo}/languages`);
      const languages = res.data || {};
      
      const colors = {
        JavaScript: '#f1e05a',
        TypeScript: '#2b7489',
        Python: '#3572A5',
        Java: '#b07219',
        Go: '#00ADD8',
        Rust: '#dea584',
        'C++': '#f34b7d',
        'C#': '#178600',
        PHP: '#4F5D95',
        Ruby: '#701516',
        Swift: '#ffac45',
        Kotlin: '#A97BFF',
        CSS: '#563d7c',
        HTML: '#e34c26',
        Shell: '#89e051',
        Vue: '#41b883',
        Dart: '#00B4AB',
        default: '#8b949e'
      };

      const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);

      return Object.keys(languages).map(name => {
        const bytes = languages[name];
        const percentage = totalBytes > 0 ? (bytes / totalBytes) * 100 : 0;
        const color = colors[name] || colors['default'];
        
        return {
          name,
          bytes,
          percentage,
          color
        };
      });
    } catch (error) {
      throw wrapError(error);
    }
  }

  /**
   * 4. Fetch list of contributors
   */
  async getContributors(owner, repo) {
    try {
      const res = await this.client.get(`/repos/${owner}/${repo}/contributors?per_page=6`);
      const list = res.data || [];
      
      return list.map(c => ({
        login: c.login,
        avatarUrl: c.avatar_url,
        contributions: c.contributions,
        profileUrl: c.html_url
      }));
    } catch (error) {
      throw wrapError(error);
    }
  }

  /**
   * 5. Fetch recent commits list
   */
  async getCommits(owner, repo) {
    try {
      const res = await this.client.get(`/repos/${owner}/${repo}/commits?per_page=15`);
      const list = res.data || [];
      
      return list.map(c => ({
        sha: c.sha.slice(0, 7),
        message: c.commit.message.split('\n')[0],
        author: c.commit.author.name,
        date: c.commit.author.date,
        url: c.html_url
      }));
    } catch (error) {
      throw wrapError(error);
    }
  }

  /**
   * 6. Fetch root files and directories
   */
  async getContents(owner, repo) {
    try {
      const res = await this.client.get(`/repos/${owner}/${repo}/contents/`);
      const list = res.data || [];
      
      return list.map(item => ({
        name: item.name,
        type: item.type === 'dir' ? 'dir' : 'file',
        size: item.size
      }));
    } catch (error) {
      throw wrapError(error);
    }
  }

  /**
   * 7. Fetch and decode README content
   */
  async getReadme(owner, repo) {
    try {
      const res = await this.client.get(`/repos/${owner}/${repo}/readme`);
      const data = res.data || {};
      
      if (!data.content) return '';
      
      const decoded = Buffer.from(data.content, 'base64').toString('utf-8');
      return decoded.slice(0, 4000);
    } catch (error) {
      // If README doesn't exist, GitHub returns 404. We handle it gracefully.
      if (error.response?.status === 404) {
        return '';
      }
      throw wrapError(error);
    }
  }

  /**
   * Fetch and parse package.json or equivalent manifest
   */
  async getPackageJson(owner, repo) {
    const filesToTry = [
      { path: 'package.json', pm: 'npm' },
      { path: 'requirements.txt', pm: 'pip' },
      { path: 'go.mod', pm: 'go' },
      { path: 'Cargo.toml', pm: 'cargo' },
      { path: 'pubspec.yaml', pm: 'pub' },
      { path: 'composer.json', pm: 'composer' },
      { path: 'pom.xml', pm: 'maven' }
    ];

    for (const file of filesToTry) {
      try {
        const res = await this.client.get(`/repos/${owner}/${repo}/contents/${file.path}`);
        if (res.data && res.data.content) {
          const decoded = Buffer.from(res.data.content, 'base64').toString('utf-8');
          
          if (file.path === 'package.json') {
            const parsed = JSON.parse(decoded);
            return {
              name: parsed.name || repo,
              version: parsed.version || '0.0.0',
              scripts: parsed.scripts || {},
              dependencies: parsed.dependencies || {},
              devDependencies: parsed.devDependencies || {},
              packageManager: file.pm
            };
          } else if (file.path === 'composer.json') {
            const parsed = JSON.parse(decoded);
            return {
              name: parsed.name || repo,
              version: parsed.version || '1.0.0',
              scripts: parsed.scripts || {},
              dependencies: parsed.require || {},
              devDependencies: parsed['require-dev'] || {},
              packageManager: file.pm
            };
          } else if (file.path === 'requirements.txt') {
            const deps = {};
            decoded.split('\n').forEach(line => {
              const clean = line.trim().split('==')[0].split('>=')[0].trim();
              if (clean && !clean.startsWith('#')) {
                deps[clean] = '*';
              }
            });
            return {
              name: repo,
              version: '1.0.0',
              scripts: {},
              dependencies: deps,
              devDependencies: {},
              packageManager: file.pm
            };
          } else {
            return {
              name: repo,
              version: '1.0.0',
              scripts: {},
              dependencies: { [file.path]: 'present' },
              devDependencies: {},
              packageManager: file.pm
            };
          }
        }
      } catch (err) {
        // Continue to the next file if not found
      }
    }

    return {
      name: repo,
      version: '1.0.0',
      scripts: {},
      dependencies: {},
      devDependencies: {},
      packageManager: 'Unknown'
    };
  }

  /**
   * Fetch recursive tree and build structural information
   */
  async getFolderStructure(owner, repo) {
    try {
      const res = await this.client.get(`/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`);
      const tree = res.data?.tree || [];
      
      const filteredTree = tree.filter(item => {
        const parts = item.path.split('/');
        return parts.length <= 2;
      });

      const hasTests = tree.some(item => /test|spec|__tests__/i.test(item.path));
      const hasDocs = tree.some(item => /docs|documentation/i.test(item.path));
      const hasCI = tree.some(item => /\.github\/workflows|\.travis\.yml|Jenkinsfile/i.test(item.path));
      const hasDocker = tree.some(item => /Dockerfile|docker-compose/i.test(item.path));
      const hasConfig = tree.some(item => /\.env\.example|config\//i.test(item.path));
      const hasMigrations = tree.some(item => /migrations\/|prisma\//i.test(item.path));
      const hasComponents = tree.some(item => /components\/|src\/components/i.test(item.path));
      const hasAPI = tree.some(item => /api\/|routes\/|controllers\//i.test(item.path));
      
      const allPaths = filteredTree.map(item => item.path).slice(0, 50);

      return {
        hasTests,
        hasDocs,
        hasCI,
        hasDocker,
        hasConfig,
        hasMigrations,
        hasComponents,
        hasAPI,
        allPaths
      };
    } catch (error) {
      return {
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
    }
  }

  /**
   * 8. Fetch all data in parallel using Promise.allSettled()
   */
  async getAllRepoData(url) {
    console.log('=== PARSING URL ===', url);
    const { owner, repo } = this.parseRepoUrl(url);
    console.log('=== PARSED ===', { owner, repo });

    // Pre-validate that the repo is accessible before firing all parallel calls
    try {
      const testRes = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}`,
        { headers: this.getHeaders() }
      );
      console.log('=== REPO EXISTS ===', testRes.data.full_name);
    } catch (testErr) {
      const status = testErr.response?.status;
      console.log('=== REPO CHECK FAILED === status:', status);
      if (status === 404) {
        throw new Error(`Repository "${owner}/${repo}" not found. Make sure it is public and the URL is correct.`);
      }
      if (status === 403) {
        throw new Error('GitHub API rate limit reached. Please wait 60 minutes or add a GitHub token.');
      }
      if (status === 401) {
        throw new Error('GitHub API token is invalid or expired.');
      }
      throw new Error(`GitHub API error: ${status} — ${testErr.response?.data?.message || testErr.message}`);
    }

    const [
      infoRes,
      languagesRes,
      contributorsRes,
      commitsRes,
      contentsRes,
      readmeRes,
      packageInfoRes,
      folderStructureRes
    ] = await Promise.allSettled([
      this.getRepoInfo(owner, repo),
      this.getLanguages(owner, repo),
      this.getContributors(owner, repo),
      this.getCommits(owner, repo),
      this.getContents(owner, repo),
      this.getReadme(owner, repo),
      this.getPackageJson(owner, repo),
      this.getFolderStructure(owner, repo)
    ]);

    // If base repo info fails, surface the error
    if (infoRes.status === 'rejected') {
      throw infoRes.reason;
    }

    const result = {
      owner,
      repo,
      repoUrl: `https://github.com/${owner}/${repo}`,
      info: infoRes.value,
      languages: languagesRes.status === 'fulfilled' ? languagesRes.value : [],
      contributors: contributorsRes.status === 'fulfilled' ? contributorsRes.value : [],
      commits: commitsRes.status === 'fulfilled' ? commitsRes.value : [],
      contents: contentsRes.status === 'fulfilled' ? contentsRes.value : [],
      readme: readmeRes.status === 'fulfilled' ? readmeRes.value : '',
      packageInfo: packageInfoRes.status === 'fulfilled' ? packageInfoRes.value : {
        name: repo, version: '1.0.0', scripts: {}, dependencies: {}, devDependencies: {}, packageManager: 'Unknown'
      },
      folderStructure: folderStructureRes.status === 'fulfilled' ? folderStructureRes.value : {
        hasTests: false, hasDocs: false, hasCI: false, hasDocker: false,
        hasConfig: false, hasMigrations: false, hasComponents: false, hasAPI: false, allPaths: []
      }
    };

    console.log('=== ALL DATA FETCHED ===');
    console.log('Languages:', result.languages.length);
    console.log('Contributors:', result.contributors.length);
    console.log('Commits:', result.commits.length);
    console.log('Readme length:', result.readme.length);

    return result;
  }
}

const githubService = new GitHubService();
export default githubService;
