import { Controller, Get, Post, Delete, Param } from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Get()
  getAll() {
    return this.favoritesService.getAll();
  }

  @Post(':username')
  addFavorite(@Param('username') username: string) {
    return this.favoritesService.addFavorite(username);
  }

  @Delete(':username')
  removeFavorite(@Param('username') username: string) {
    return this.favoritesService.removeFavorite(username);
  }
}