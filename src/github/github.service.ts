import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GithubService {
  constructor(private httpService: HttpService) {}

  async getProfile(username: string) {
    const url = `https://api.github.com/users/${username}`;
    const { data } = await firstValueFrom(this.httpService.get(url));
    return data;
  }

  async getRepos(username: string) {
  const url = `https://api.github.com/users/${username}/repos`;
  const { data } = await firstValueFrom(this.httpService.get(url));
  
  return data.map(repo => ({
    name: repo.name,
    description: repo.description,
    language: repo.language,
    stars: repo.stargazers_count,
    url: repo.html_url
  }));
  }

  async getReposByLanguage(username: string, language: string) {
    const url = `https://api.github.com/users/${username}/repos`;
    const { data } = await firstValueFrom(this.httpService.get(url));
    
    const filteredRepos = data.filter(repo => 
      repo.language && repo.language.toLowerCase() === language.toLowerCase()
    );

    return filteredRepos.map(repo => ({
      name: repo.name,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      url: repo.html_url,
      updated_at: repo.updated_at
    }));
  }

  private getAuthHeaders() {
  return {
    'User-Agent': 'GitHub-Explorer-Backend', 
    'Accept': 'application/vnd.github.v3+json',
    ...(process.env.GITHUB_TOKEN && { 
      'Authorization': `token ${process.env.GITHUB_TOKEN}` 
    })
  }
}
}