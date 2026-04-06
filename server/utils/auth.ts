import jwt from 'jsonwebtoken'

interface AuthUser {
  id: string | number;
  email?: string;
  login?: string;
  name?: string;
}

export const getAuthenticatedUser = async (event): Promise<AuthUser | null> => {
  try {
    // 1. Intentar por Cookie (Nuxt Auth Utils)
  const session = await getUserSession(event)
  if (session?.user) return session.user as AuthUser

  // 2. Intentar por Header (JWT)
  const authHeader = getRequestHeader(event, 'authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]
   
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_clave')
      // Castamos el resultado a nuestro tipo AuthUser
      return decoded as AuthUser
       }
    } catch (e) {
        console.error('Error validando JWT:', e)
      return null
    }
 
  return null
}