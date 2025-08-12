<template>
  <v-container>
    <h1>SpaceX Launches</h1>

    <v-row v-if="loading">
      <v-col cols="12">
        <v-progress-linear indeterminate color="blue" />
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col
        v-for="launch in launches"
        :key="launch.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card class="ma-2" outlined>
          <v-card-title>{{ launch.mission_name }}</v-card-title>
          <v-card-text>
            <p><strong>Launch Date:</strong> {{ launch.launch_date_utc }}</p>

            <p v-if="launch.launch_site">
              <strong>Launch Site:</strong> {{ launch.launch_site.site_name_long }}
            </p>
            <p v-else>
              <strong>Launch Site:</strong> Not available
            </p>

            <p v-if="launch.rocket">
              <strong>Rocket:</strong> {{ launch.rocket.rocket_name }}
            </p>
            <p v-else>
              <strong>Rocket:</strong> Not available
            </p>

            <p v-if="launch.details">
              <strong>Details:</strong> {{ launch.details }}
            </p>
            <p v-else>
              <em>No details available</em>
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

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

// Safe fallback if result is not yet loaded
const launches = computed(() => result.value?.launchesPast || [])
</script>
