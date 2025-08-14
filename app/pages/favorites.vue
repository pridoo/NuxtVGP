<template>
  <v-container>
    <v-toolbar flat class="mb-4">
      <v-toolbar-title>
        <v-icon left large>mdi-heart</v-icon>
        Favorite Rockets
      </v-toolbar-title>
      <v-spacer />
      <v-btn
        color="red lighten-2"
        text
        :disabled="favorites.length === 0"
        @click="clearFavorites"
      >
        Clear Favorites
      </v-btn>
    </v-toolbar>

    <v-row v-if="favorites.length === 0" justify="center">
      <v-col cols="12" md="6" class="text-center">
        <p>No favorite rockets added yet.</p>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col
        v-for="rocket in favorites"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card elevation="4" outlined>
          <v-card-title>
            <v-icon left color="cyan lighten-3">mdi-rocket</v-icon>
            {{ rocket.name }}
          </v-card-title>
          <v-card-text>
            <p>{{ truncateText(rocket.description, 140) }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useFavoritesStore } from '@/stores/favorites'
import { computed } from 'vue'

const favoritesStore = useFavoritesStore()
const favorites = computed(() => favoritesStore.favorites)

function clearFavorites() {
  favoritesStore.clearFavorites()
}

function truncateText(text: string, length: number) {
  if (!text) return ''
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}
</script>
