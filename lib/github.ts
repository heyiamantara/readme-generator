export interface GitHubRepoData {
  name: string;
  description: string;
  language: string;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  license: string | null;
  owner: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
}

export function extractRepoInfo(repoUrl: string): { owner: string; repo: string } {
  // Remove trailing slash if present
  const cleanUrl = repoUrl.trim().replace(/\/$/, '');
  
  // Extract owner and repo from GitHub URL
  // Supports: https://github.com/owner/repo or github.com/owner/repo
  const match = cleanUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  
  if (!match) {
    throw new Error('Invalid GitHub URL. Please use format: https://github.com/owner/repo');
  }
  
  return {
    owner: match[1],
    repo: match[2],
  };
}

export async function fetchRepoData(repoUrl: string): Promise<GitHubRepoData> {
  const { owner, repo } = extractRepoInfo(repoUrl);
  
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
  
  const response = await fetch(apiUrl, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      // Optional: Add GitHub token for higher rate limits
      // 'Authorization': `token ${process.env.GITHUB_TOKEN}`,
    },
  });
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Repository not found. Please check the URL and try again.');
    }
    throw new Error(`GitHub API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  return {
    name: data.name,
    description: data.description || 'No description provided',
    language: data.language || 'Not specified',
    topics: data.topics || [],
    stargazers_count: data.stargazers_count,
    forks_count: data.forks_count,
    license: data.license?.spdx_id || data.license?.name || null,
    owner: {
      login: data.owner.login,
      avatar_url: data.owner.avatar_url,
    },
    html_url: data.html_url,
  };
}
