import { ref, computed, type ComputedRef } from 'vue'

export function useLaunchFilter(launches: ComputedRef<any[]>) {
  const selectedYear = ref<string>('All') 

  const years = computed(() => {
    const rawLaunches = launches.value ?? []
    const allYears = rawLaunches
      .map(launch => new Date(launch.launch_date_utc).getFullYear().toString())
    return Array.from(new Set(allYears)).sort((a, b) => parseInt(b) - parseInt(a))
  })

  const filteredLaunches = computed(() => {
    const rawLaunches = launches.value ?? []

    if (!selectedYear.value || selectedYear.value === 'All') {
      return rawLaunches
    }

    return rawLaunches.filter(launch => {
      const launchYear = new Date(launch.launch_date_utc).getFullYear().toString()
      return launchYear === selectedYear.value
    })
  })

  function clearFilter() {
    selectedYear.value = 'All'
  }

  return {
    selectedYear,
    years,
    filteredLaunches,
    clearFilter
  }
}
