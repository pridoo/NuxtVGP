<template>
  <v-dialog
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    max-width="600px"
    transition="dialog-bottom-transition"
  >
    <v-card class="rocket-modal-card glass-card pa-5">
      <v-card-title class="modal-title d-flex align-center mb-2">
        <v-icon left color="cyan lighten-3" large>mdi-rocket</v-icon>
        <span>{{ rocket?.name }}</span>
        <v-spacer />
        <v-btn
          icon
          :color="isFavorite ? 'red' : 'grey'"
          @click="toggleFavorite"
          :title="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
        >
          <v-icon>{{ isFavorite ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-subtitle class="modal-subtitle mb-4">
        {{ rocket?.description }}
      </v-card-subtitle>

      <v-card-text class="modal-body-text">
        <v-row dense>
          <v-col cols="6">
            <strong>First Flight:</strong><br />
            {{ formatDate(rocket?.first_flight) }}
          </v-col>
          <v-col cols="6">
            <strong>Stages:</strong><br />
            {{ rocket?.stages }}
          </v-col>
          <v-col cols="6">
            <strong>Height:</strong><br />
            {{ rocket?.height?.meters }} m
          </v-col>
          <v-col cols="6">
            <strong>Diameter:</strong><br />
            {{ rocket?.diameter?.meters }} m
          </v-col>
          <v-col cols="12">
            <strong>Mass:</strong><br />
            {{ rocket?.mass?.kg }} kg
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn color="red lighten-2" text @click="$emit('update:modelValue', false)">
          <v-icon left>mdi-close</v-icon>Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<script setup lang="ts">
import { computed } from 'vue'
import { useFavoritesStore } from '@/stores/favorites'

const props = defineProps({
  modelValue: Boolean,
  rocket: Object as () => Rocket | null
})
const emit = defineEmits(['update:modelValue'])

const favoritesStore = useFavoritesStore()

const isFavorite = computed(() => {
  if (!props.rocket) return false
  return favoritesStore.isFavorite(props.rocket.id)
})

function toggleFavorite() {
  if (props.rocket) {
    favoritesStore.toggleFavorite(props.rocket)
  }
}

function formatDate(dateString: string | undefined) {
  if (!dateString) return 'Unknown date'
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
  return new Date(dateString).toLocaleDateString(undefined, options)
}
</script>
