import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class GithubService {
  constructor(private readonly httpService: HttpService) {}

 private getRequestConfig() {
  return {
    headers: {
      'User-Agent': 'GitHub-Explorer-Backend', // Obrigatório pela API do GitHub
      'Accept': 'application/vnd.github.v3+json',
      ...(process.env.GITHUB_TOKEN && {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`
      })
    },
    timeout: 10000
  };
}

  private getAuthHeaders() {
    return {
      'User-Agent': 'GitHub-Explorer-Backend',
      'Accept': 'application/vnd.github.v3+json',
      ...(process.env.GITHUB_TOKEN && {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`
      })
    };
  }

   private handleError(error: unknown) {
    const axiosError = error as AxiosError;
    
    console.error('GitHub API Error:', {
      status: axiosError.response?.status,
      data: axiosError.response?.data,
      headers: axiosError.config?.headers
    });

    const errorData = axiosError.response?.data as { message?: string } | undefined;
    const errorMessage = errorData?.message || 'GitHub API request failed';
    const statusCode = axiosError.response?.status || 500;

    throw new HttpException(errorMessage, statusCode);
  }

  async getProfile(username: string) {
    try {
      const url = `https://api.github.com/users/${username}`;
      const { data } = await firstValueFrom(
        this.httpService.get(url, this.getRequestConfig())
      );
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }
  
  async getRepos(username: string) {
    try {
      const url = `https://api.github.com/users/${username}/repos`;
      const { data } = await firstValueFrom(
        this.httpService.get(url, this.getRequestConfig())
      );
      
      return data.map(repo => ({
        id: repo.id, // Adicionado ID para uso como key no frontend
        name: repo.name,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        url: repo.html_url,
        updated_at: repo.updated_at
      }));
    } catch (error) {
      this.handleError(error);
    }
  }

  async getReposByLanguage(username: string, language: string) {
    try {
      const url = `https://api.github.com/users/${username}/repos`;
      const { data } = await firstValueFrom(
        this.httpService.get(url, this.getRequestConfig())
      );
      
      const filteredRepos = data.filter(repo => 
        repo.language && 
        repo.language.toLowerCase().includes(language.toLowerCase())
      );

      return filteredRepos.map(repo => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        url: repo.html_url,
        updated_at: repo.updated_at
      }));
    } catch (error) {
      this.handleError(error);
    }
  }
}