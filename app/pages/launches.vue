<template>
  <v-container class="launches-container" fluid>
    <v-toolbar flat class="toolbar">
      <v-toolbar-title>
        <v-icon left large>mdi-rocket-launch</v-icon>
        <span class="title-text">SpaceX Launches</span>
      </v-toolbar-title>
    </v-toolbar>

    <v-row justify="center" class="mb-4">
      <v-col cols="12" md="6" class="d-flex align-center justify-space-between">
        <v-select
          v-model="selectedYear"
          :items="['All', ...years]"
          label="Filter by Year"
          hide-details
          dense
          outlined
          style="max-width: 180px;"
        />
        <v-btn text color="cyan lighten-3" @click="clearFilter">Clear Filter</v-btn>

        <v-btn
          color="cyan lighten-3"
          @click="toggleSortOrder"
          class="ml-4"
          outlined
        >
          Sort: {{ sortOrder.toUpperCase() }}
          <v-icon right>{{ sortOrder === 'asc' ? 'mdi-arrow-up' : 'mdi-arrow-down' }}</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-if="loading || rocketsLoading" justify="center" class="status-row">
      <v-col cols="12" md="6" class="text-center">
        <v-progress-circular indeterminate color="cyan lighten-3" size="64" />
        <div class="mt-4 subtitle-1">Fetching launches and rockets...</div>
      </v-col>
    </v-row>

    <v-row v-else-if="error || rocketsError" justify="center" class="status-row">
      <v-col cols="12" md="6" class="text-center error-text">
        <v-icon x-large>mdi-alert-circle-outline</v-icon>
        <div class="mt-2 headline">Oops! Could not load data</div>
        <div>{{ error?.message || rocketsError?.message }}</div>
      </v-col>
    </v-row>

    <v-row v-else dense>
      <v-col
        v-for="launch in sortedLaunches"
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
              @click="openDetails(launch)"
            >
              View More
              <v-icon right>mdi-arrow-right</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>



    <v-dialog v-model="showDialog" max-width="600px" transition="dialog-bottom-transition">
      <v-card class="rocket-modal-card glass-card pa-5">
        <v-card-title class="modal-title d-flex align-center mb-2">
          <v-icon left color="cyan lighten-3" large>mdi-rocket</v-icon>
          <span>{{ rocket?.name }}</span>
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
          <v-btn
            color="red lighten-2"
            text
            @click="showDialog = false"
          >
            <v-icon left>mdi-close</v-icon>Close
          </v-btn>
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

import { useLaunchFilter } from '../../composables/useLaunchFilter'
import { useLaunchSort } from '../../composables/useLaunchSort'
import { useRouter } from 'vue-router'

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

interface Rocket {
  id: string
  name: string
  description: string
  first_flight: string
  height: { meters: number }
  diameter: { meters: number }
  mass: { kg: number }
  stages: number
}

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

const GET_ALL_ROCKETS = gql`
  query GetAllRockets {
    rockets {
      id
      name
      description
      first_flight
      height {
        meters
      }
      diameter {
        meters
      }
      mass {
        kg
      }
      stages
    }
  }
`


const { result, loading, error } = useQuery(GET_LAUNCHES)
const launches = computed<Launch[]>(() => result.value?.launchesPast || [])


const { result: rocketsResult, loading: rocketsLoading, error: rocketsError } = useQuery(GET_ALL_ROCKETS)
const rocketsByName = computed(() => {
  const rockets = rocketsResult.value?.rockets || []
  const map = new Map<string, Rocket>()
  rockets.forEach((r: Rocket) => {
    map.set(r.name, r)
  })
  return map
})

const { selectedYear, years, filteredLaunches, clearFilter } = useLaunchFilter(launches)
const { sortOrder, sortedLaunches, toggleSortOrder } = useLaunchSort(filteredLaunches)

const router = useRouter()

// Modal control and selected rocket data
const showDialog = ref(false)
const rocket = ref<Rocket | null>(null)

function openDetails(launch: Launch) {
  if (!launch.rocket?.rocket_name) {
    alert('Rocket data not available')
    return
  }
  const r = rocketsByName.value.get(launch.rocket.rocket_name)
  if (!r) {
    alert('Rocket details not found')
    return
  }
  rocket.value = r
  showDialog.value = true
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


