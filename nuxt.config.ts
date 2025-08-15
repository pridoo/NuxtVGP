import vuetify from 'vite-plugin-vuetify'

export default defineNuxtConfig({

  future: { compatibilityVersion: 4 },


  build: {
    transpile: ['vuetify'],
  },

  
  imports: {
    dirs: ['./stores'],
  },

  // Apollo client setup
  apollo: {
    autoImports: true,
    proxyCookies: true,
    clients: {
      default: {
        httpEndpoint: 'https://spacex-production.up.railway.app/',
      },
    },
  },

  vite: {
    optimizeDeps: {
      include: ['graphql-tag'], 
    },
    plugins: [
      vuetify(), 
    ],
  },

  // Modules
  modules: [
    '@nuxtjs/apollo',
    [
      '@pinia/nuxt',
      {
        autoImports: ['defineStore', 'acceptHMRUpdate'],
      },
    ],
  ],


  compatibilityDate: '2024-11-11',
})
