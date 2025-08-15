export default defineNuxtRouteMiddleware((to) => {

  const validRoutes = ['/launches', '/favorites', '/rockets']


  if (!validRoutes.includes(to.path) && !to.path.startsWith('/rockets/')) {
    return navigateTo('/launches')
  }
})
