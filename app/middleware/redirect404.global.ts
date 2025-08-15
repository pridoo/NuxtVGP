export default defineNuxtRouteMiddleware((to) => {
  // list of valid routes - add your existing page routes here
  const validRoutes = ['/launches', '/favorites', '/rockets']

  // Allow dynamic rocket routes, e.g. /rockets/:id
  if (!validRoutes.includes(to.path) && !to.path.startsWith('/rockets/')) {
    return navigateTo('/launches')
  }
})
