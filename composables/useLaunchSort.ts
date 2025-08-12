import { ref, computed, type ComputedRef } from 'vue'

export function useLaunchSort(launches: ComputedRef<any[]>) {
  const sortOrder = ref<'asc' | 'desc'>('desc')

  const sortedLaunches = computed(() => {
    const list = launches.value ?? []
    return list.slice().sort((a, b) => {
      const dateA = new Date(a.launch_date_utc).getTime()
      const dateB = new Date(b.launch_date_utc).getTime()
      return sortOrder.value === 'asc' ? dateA - dateB : dateB - dateA
    })
  })

  function toggleSortOrder() {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  }

  return {
    sortOrder,
    sortedLaunches,
    toggleSortOrder,
  }
}
