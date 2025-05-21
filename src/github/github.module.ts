import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { GithubService } from './github.service';
import { GithubController } from './github.controller';

@Module({
  imports: [
    HttpModule, 
    ConfigModule, 
  ],
  controllers: [GithubController],
  providers: [GithubService],
  exports: [GithubService], 
})
export class GithubModule {}