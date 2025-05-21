import { Controller, Get, Param, Query } from '@nestjs/common';
import { GithubService } from './github.service';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('profile/:username')
  getProfile(@Param('username') username: string) {
    return this.githubService.getProfile(username);
  }

  @Get('repos/:username')
  getRepos(@Param('username') username: string) {
    return this.githubService.getRepos(username);
  }

  @Get('repos/:username/by-language')
  getReposByLanguage(
    @Param('username') username: string,
    @Query('language') language: string
  ) {
    if (!language) {
      return { error: 'O parâmetro "language" é obrigatório' };
    }
    return this.githubService.getReposByLanguage(username, language);
  }
}