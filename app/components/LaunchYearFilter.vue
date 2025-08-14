<template>
  <v-col cols="12" md="6" class="d-flex align-center justify-space-between">
    <v-select
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :items="['All', ...years]"
      label="Filter by Year"
      hide-details
      dense
      outlined
      style="max-width: 180px;"
    />
  </v-col>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  years: {
    type: Array as () => string[],
    required: true,
  }
})

const emit = defineEmits(['update:modelValue'])
</script>
