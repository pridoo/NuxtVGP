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
  getters: {
    isFavorite: (state) => {
      return (rocketId: string) => state.favorites.some(r => r.id === rocketId)
    }
  },
  actions: {
    addFavorite(rocket: Rocket) {
      if (!this.favorites.find(r => r.id === rocket.id)) {
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
    }
  }
})
