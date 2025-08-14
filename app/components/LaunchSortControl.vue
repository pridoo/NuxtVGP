<template>
  <v-btn
    color="cyan lighten-3"
    @click="$emit('toggle-sort')"
    class="ml-4"
    outlined
  >
    Sort: {{ sortOrder.toUpperCase() }}
    <v-icon right>
      {{ sortOrder === 'asc' ? 'mdi-arrow-up' : 'mdi-arrow-down' }}
    </v-icon>
  </v-btn>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  sortOrder: {
    type: String,
    required: true,
  }
})

const emit = defineEmits(['toggle-sort'])
</script>
