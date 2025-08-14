<template>
  <v-dialog v-model="show" max-width="600px" transition="dialog-bottom-transition">
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
          @click="close"
        >
          <v-icon left>mdi-close</v-icon>Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, watch, ref } from 'vue'

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

const props = defineProps<{ rocket: Rocket | null, modelValue: boolean }>()
const emit = defineEmits(['update:modelValue'])

const show = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  show.value = val
})

watch(show, (val) => {
  emit('update:modelValue', val)
})

function formatDate(dateString: string | undefined) {
  if (!dateString) return 'Unknown date'
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

function close() {
  show.value = false
}
</script>
