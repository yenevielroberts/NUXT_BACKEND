// server/api/auth/me.get.ts
export default defineEventHandler(async (event) => {
  // getUserSession viene de nuxt-auth-utils
  const session = await getUserSession(event)
  
  if (!session.user) {
    throw createError({
      statusCode: 401,
      message: 'No hay sesión activa'
    })
  }
  
  return session.user
})