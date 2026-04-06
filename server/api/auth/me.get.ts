import { getAuthenticatedUser } from '~~/server/utils/auth'
// server/api/auth/me.get.ts
export default defineEventHandler(async (event) => {
  // getUserSession viene de nuxt-auth-utils
  const session = await getAuthenticatedUser(event)
  
  if (!session?.id) {
    throw createError({
      statusCode: 401,
      message: 'No hay sesión activa'
    })
  }
  
  const user= {
    id:session?.id,
    name:session?.name,
    email:session?.email
  }
  return user
})