<template>
  <v-container class="launches-container" fluid>
      <v-row justify="center" class="mb-8">
      <v-col cols="12" md="6" class="d-flex justify-center">
        <v-btn
          color="cyan lighten-1"
          dark
          large
          @click="showCountdown = true"
          class="text-uppercase font-weight-bold"
          elevation="6"
        >
          See Next Launch Countdown
        </v-btn>
      </v-col>
    </v-row>

    <v-dialog v-model="showCountdown" max-width="460" persistent>
      <v-card class="glass-card pa-6 text-center">
        <v-card-title class="modal-title justify-center">
          Next Launch Countdown
        </v-card-title>

        <v-card-text>
          <NextLaunchCountdown />
        </v-card-text>

        <v-card-actions class="justify-center">
          <v-btn color="cyan lighten-1" dark @click="showCountdown = false" elevation="3">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  
    <v-row justify="center" class="mb-4" align="center" dense>
      <v-col cols="12" md="3" class="d-flex justify-center">
        <LaunchYearFilter
          v-model="selectedYear"
          :years="years"
          @clear-filter="clearFilter"
        />
      </v-col>

      <v-col cols="12" md="3" class="d-flex justify-center">
        <LaunchSortControl
          :sortOrder="sortOrder"
          @toggle-sort="toggleSortOrder"
        />
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
        <LaunchCard
          :launch="launch"
          @view-details="openDetails"
        />
      </v-col>
    </v-row>

    <RocketDetailsDialog
      v-model="showDialog"
      :rocket="rocket"
    />
  </v-container>
</template>

<script setup lang="ts">
import '@/assets/css/LaunchesPage.css'
import { ref, computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

import NextLaunchCountdown from '@/components/NextLaunchCountdown.vue' 

import LaunchYearFilter from '@/components/LaunchYearFilter.vue'
import LaunchSortControl from '@/components/LaunchSortControl.vue'
import LaunchCard from '@/components/LaunchCard.vue'
import RocketDetailsDialog from '@/components/RocketDetailsDialog.vue'

import { useLaunchFilter } from '../../composables/useLaunchFilter'
import { useLaunchSort } from '../../composables/useLaunchSort'

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

const showCountdown = ref(false)
</script>
