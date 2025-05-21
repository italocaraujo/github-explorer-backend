import { Injectable } from '@nestjs/common';

@Injectable()
export class FavoritesService {
  private favorites: string[] = []; 

  addFavorite(username: string) {
    if (!this.favorites.includes(username)) {
      this.favorites.push(username);
    }
    return this.favorites;
  }

  removeFavorite(username: string) {
    this.favorites = this.favorites.filter(u => u !== username);
    return this.favorites;
  }

  getAll() {
    return this.favorites;
  }
}