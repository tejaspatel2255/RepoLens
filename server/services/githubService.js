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
    this.client = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        ...(GITHUB_TOKEN && { Authorization: `token ${GITHUB_TOKEN}` })
      }
    });
  }

  /**
   * 1. Parse repository URL or slug into owner and repo name
   */
  parseRepoUrl(url) {
    if (!url || typeof url !== 'string') {
      throw new Error('Invalid repository URL');
    }
    
    let clean = url.trim().replace(/\/$/, '').replace(/\.git$/, '');
    
    // Match github.com/owner/repo
    const githubRegex = /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/]+)\/([^\/]+)(?:\/.*)?$/i;
    const githubMatch = clean.match(githubRegex);
    if (githubMatch) {
      return { owner: githubMatch[1], repo: githubMatch[2] };
    }

    // Match owner/repo
    const parts = clean.split('/');
    if (parts.length === 2 && parts[0] && parts[1]) {
      return { owner: parts[0], repo: parts[1] };
    }

    throw new Error('Invalid GitHub repository URL or slug format');
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
   * 8. Fetch all data in parallel using Promise.allSettled()
   */
  async getAllRepoData(url) {
    const { owner, repo } = this.parseRepoUrl(url);

    const [infoRes, languagesRes, contributorsRes, commitsRes, contentsRes, readmeRes] = await Promise.allSettled([
      this.getRepoInfo(owner, repo),
      this.getLanguages(owner, repo),
      this.getContributors(owner, repo),
      this.getCommits(owner, repo),
      this.getContents(owner, repo),
      this.getReadme(owner, repo)
    ]);

    // If base repo info fails, throw that error since we cannot proceed without repository info
    if (infoRes.status === 'rejected') {
      throw infoRes.reason;
    }

    return {
      owner,
      repo,
      info: infoRes.value,
      languages: languagesRes.status === 'fulfilled' ? languagesRes.value : [],
      contributors: contributorsRes.status === 'fulfilled' ? contributorsRes.value : [],
      commits: commitsRes.status === 'fulfilled' ? commitsRes.value : [],
      contents: contentsRes.status === 'fulfilled' ? contentsRes.value : [],
      readme: readmeRes.status === 'fulfilled' ? readmeRes.value : ''
    };
  }
}

const githubService = new GitHubService();
export default githubService;
