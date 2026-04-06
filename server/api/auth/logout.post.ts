// server/api/auth/logout.post.ts
export default defineEventHandler(async (event) => {
  // clearUserSession proviene de `nuxt-auth-utils` y limpiará la cookie/session
  await clearUserSession(event)

  return {
    success: true,
    message: 'Sesión cerrada'
  }

})
