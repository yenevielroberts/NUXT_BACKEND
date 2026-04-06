// server/routes/auth/logout.ts
export default defineEventHandler(async (event) => {
  // Limpia la sesión del usuario (cookie/session) usando nuxt-auth-utils
  await clearUserSession(event)

  return {
    success: true,
    message: 'Sesión cerrada'
  }

})
