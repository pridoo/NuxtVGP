<template>
  <v-card
    class="launch-card flex-grow-1 d-flex flex-column"
    elevation="6"
    hover
    outlined
  >
    <v-card-title class="card-header">
      <v-icon left color="cyan lighten-3" large>mdi-earth</v-icon>
      <span>{{ launch.mission_name || 'No Mission Name' }}</span>
    </v-card-title>

    <v-card-subtitle class="launch-date">
      {{ formatDate(launch.launch_date_utc) || 'Unknown Date' }}
    </v-card-subtitle>

    <v-card-text class="card-content flex-grow-1 d-flex flex-column justify-space-between">
      <div>
        <v-chip
          small
          class="ma-1"
          color="cyan lighten-3"
          text-color="cyan darken-4"
          label
        >
          <v-icon left small>mdi-map-marker-radius</v-icon>
          {{ launch.launch_site?.site_name_long || 'Unknown Site' }}
        </v-chip>

        <v-chip
          small
          class="ma-1"
          color="purple lighten-3"
          text-color="purple darken-4"
          label
        >
          <v-icon left small>mdi-rocket</v-icon>
          {{ launch.rocket?.rocket_name || 'Unknown Rocket' }}
        </v-chip>
      </div>

      <div class="details-text mt-3" v-if="launch.details">
        {{ truncateText(launch.details, 140) }}
      </div>
      <div class="details-text mt-3 no-details" v-else>
        <em>No details available</em>
      </div>
    </v-card-text>

    <v-card-actions class="actions">
      <v-btn
        text
        small
        color="cyan lighten-2"
        @click="$emit('view-details', launch)"
      >
        View More
        <v-icon right>mdi-arrow-right</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface Launch {
  id: string
  mission_name: string
  launch_date_utc: string
  launch_site?: {
    site_name_long: string
  }
  rocket?: {
    rocket_name: string
  }
  details?: string
}

const props = defineProps<{ launch: Launch }>()
const emit = defineEmits(['view-details'])

function formatDate(dateString: string | undefined) {
  if (!dateString) return 'Unknown date'
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

function truncateText(text: string, length: number) {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}
</script>
