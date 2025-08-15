import { createStatePersistence } from 'pinia-plugin-state-persistence'
import localforage from 'localforage'
import { getActivePinia } from 'pinia'

export default defineNuxtPlugin(() => {
  const pinia = getActivePinia()
  if (!pinia) {
    throw new Error('Pinia instance not found')
  }

  pinia.use(createStatePersistence({
    storage: localforage,
    key: 'pinia_favorites',
  }))

  localforage.config({
    name: 'myApp',
    storeName: 'pinia_favorites',
  })
})
