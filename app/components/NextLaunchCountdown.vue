<template>
  <div>
    <h2>Next Launch: {{ nextLaunch?.mission_name || 'No upcoming launches' }}</h2>
    <p>Countdown: {{ countdown }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

interface Launch {
  id: string
  mission_name: string
  launch_date_utc: string
}

const GET_NEXT_LAUNCH = gql`
  query GetNextLaunch {
    launchesUpcoming(limit: 1, sort: "launch_date_utc", order: "asc") {
      id
      mission_name
      launch_date_utc
    }
  }
`

const { result } = useQuery(GET_NEXT_LAUNCH)

const nextLaunch = computed<Launch | null>(() => result.value?.launchesUpcoming?.[0] || null)

const countdown = ref('Loading...')

let countdownInterval: number | null = null

function updateCountdown() {
  if (!nextLaunch.value) {
    countdown.value = 'No upcoming launches'
    return
  }

  const launchTime = new Date(nextLaunch.value.launch_date_utc).getTime()
  const now = Date.now()
  const diff = launchTime - now

  if (diff <= -60000) { // 1 minute past launch
    countdown.value = 'Launch already happened'
    if (countdownInterval) clearInterval(countdownInterval)
    return
  } else if (diff <= 0) {
    countdown.value = 'Launching now!'
    return
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  countdown.value = `${days}d ${hours}h ${minutes}m ${seconds}s`
}

onMounted(() => {
  updateCountdown()
  countdownInterval = window.setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval)
})
</script>
