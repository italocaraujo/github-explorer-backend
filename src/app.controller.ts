import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('debug')
  async debug() {
  return {
    status: 'ok',
    nodeEnv: process.env.NODE_ENV,
    githubToken: process.env.GITHUB_TOKEN ? 'exists' : 'missing'
  };
}
  getHello(): string {
    return this.appService.getHello();
  }
}
