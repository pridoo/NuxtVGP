import { defineStore } from 'pinia'

export interface Rocket {
  id: string
  name: string
  description: string
  first_flight: string
  height: { meters: number }
  diameter: { meters: number }
  mass: { kg: number }
  stages: number
}

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favorites: [] as Rocket[],
  }),
  actions: {
    isFavorite(rocketId: string): boolean {
      return this.favorites.some(r => r.id === rocketId)
    },
    addFavorite(rocket: Rocket) {
      if (!this.isFavorite(rocket.id)) {
        this.favorites.push(rocket)
      }
    },
    removeFavorite(rocketId: string) {
      this.favorites = this.favorites.filter(r => r.id !== rocketId)
    },
    toggleFavorite(rocket: Rocket) {
      if (this.isFavorite(rocket.id)) {
        this.removeFavorite(rocket.id)
      } else {
        this.addFavorite(rocket)
      }
    },
    clearFavorites() {
      this.favorites = []
    },
  },
  persist: true, // Use the persistence plugin configured globally
})
