// composables/useLaunchFilter.ts
import { ref, computed } from 'vue'

export function useLaunchFilter(launches: any[]) {
  const selectedYear = ref<string | null>(null)

  
  const years = computed(() => {
    const allYears = launches.map(launch => new Date(launch.launch_date_utc).getFullYear())
    return Array.from(new Set(allYears)).sort((a, b) => b - a) 
  })

 
  const filteredLaunches = computed(() => {
    if (!selectedYear.value) return launches
    return launches.filter(launch => {
      const launchYear = new Date(launch.launch_date_utc).getFullYear()
      return launchYear.toString() === selectedYear.value
    })
  })

  
  function clearFilter() {
    selectedYear.value = null
  }

  return {
    selectedYear,
    years,
    filteredLaunches,
    clearFilter
  }
}
