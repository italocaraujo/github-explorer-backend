import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GithubModule } from './github/github.module';
import { FavoritesService } from './favorites/favorites.service';
import { FavoritesController } from './favorites/favorites.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
      headers: {
        'User-Agent': 'GitHub-Explorer-Backend'
      }
    }),
    GithubModule,
  ],
  controllers: [AppController, FavoritesController],
  providers: [AppService, FavoritesService]
})
export class AppModule {}