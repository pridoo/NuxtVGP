<template>
  <v-container class="launches-container" fluid>
   
    <v-toolbar flat class="toolbar">
      <v-toolbar-title>
        <v-icon left large>mdi-rocket-launch</v-icon>
        <span class="title-text">SpaceX Launches</span>
      </v-toolbar-title>
    </v-toolbar>


    <v-row v-if="loading" justify="center" class="status-row">
      <v-col cols="12" md="6" class="text-center">
        <v-progress-circular indeterminate color="cyan lighten-3" size="64" />
        <div class="mt-4 subtitle-1">Fetching launches...</div>
      </v-col>
    </v-row>

 
    <v-row v-else-if="error" justify="center" class="status-row">
      <v-col cols="12" md="6" class="text-center error-text">
        <v-icon x-large>mdi-alert-circle-outline</v-icon>
        <div class="mt-2 headline">Oops! Could not load launches</div>
        <div>{{ error.message }}</div>
      </v-col>
    </v-row>


    <v-row v-else dense>
      <v-col
        v-for="launch in launches"
        :key="launch.id"
        cols="12"
        sm="6"
        md="4"
        class="d-flex"
      >
        <v-card
          class="launch-card flex-grow-1 d-flex flex-column"
          elevation="6"
          hover
          outlined
        >
          <v-card-title class="card-header">
            <v-icon left color="cyan lighten-3" large>mdi-earth</v-icon>
            <span>{{ launch.mission_name }}</span>
          </v-card-title>

          <v-card-subtitle class="launch-date">
            {{ formatDate(launch.launch_date_utc) }}
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
              @click="openDetails(launch)"
            >
              View More
              <v-icon right>mdi-arrow-right</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>


    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title class="headline">{{ selectedLaunch?.mission_name }}</v-card-title>
        <v-card-subtitle>{{ formatDate(selectedLaunch?.launch_date_utc) }}</v-card-subtitle>
        <v-card-text>
          <p><strong>Launch Site:</strong> {{ selectedLaunch?.launch_site?.site_name_long || 'Unknown Site' }}</p>
          <p><strong>Rocket:</strong> {{ selectedLaunch?.rocket?.rocket_name || 'Unknown Rocket' }}</p>
          <p><strong>Details:</strong></p>
          <p>{{ selectedLaunch?.details || 'No details available.' }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">

import '@/assets/css/LaunchesPage.css'  
import { ref, computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'


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

// GraphQL query
const GET_LAUNCHES = gql`
  query GetLaunches {
    launchesPast(limit: 20) {
      id
      mission_name
      launch_date_utc
      launch_site {
        site_name_long
      }
      rocket {
        rocket_name
      }
      details
    }
  }
`

const { result, loading, error } = useQuery(GET_LAUNCHES)

const launches = computed<Launch[]>(() => result.value?.launchesPast || [])

// Dialog state and selected launch with proper typing
const dialog = ref(false)
const selectedLaunch: Ref<Launch | null> = ref(null)

function openDetails(launch: Launch) {
  selectedLaunch.value = launch
  dialog.value = true
}

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
