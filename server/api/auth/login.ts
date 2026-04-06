import { eq } from "drizzle-orm"
import * as schema from '../../db/schema'
// Importa una librería para JWT (ejemplo: jose o jsonwebtoken)
import jwt from 'jsonwebtoken' 

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)
  const config = useRuntimeConfig()

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: "Faltan campos por introducir" })
  }

  const user = await useDb().query.users.findFirst({
    where: eq(schema.users.email, email)
  })

  if (!user || !user.password) {
    throw createError({ statusCode: 400, statusMessage: "Credenciales inválidas" })
  }

  const isValid = await verifyPassword(user.password, password)
  if (!isValid) {
    throw createError({ statusCode: 400, statusMessage: 'Password incorrect!' })
  }

  const { password: _, ...userWithoutPassword } = user

  // --- ESTRATEGIA HÍBRIDA ---

 // 1. Sesión de Nuxt (Para Web/Cookies)
  await setUserSession(event, { 
    user: {
      id: String(userWithoutPassword.id),
      name: userWithoutPassword.name, // Ajusta a tus campos de DB
      login: userWithoutPassword.email
    }
  })

  // 2. Generar JWT (Para Móvil/Headers)
  // Usa una clave secreta desde tu .env
  const token = jwt.sign(
    { id: userWithoutPassword.id, email: userWithoutPassword.email },
    process.env.JWT_SECRET || 'clave_secreta_provisional',
    { expiresIn: '30d' }
  )

  // 3. Retornamos ambos
  return {
    user: userWithoutPassword,
    token: token 
  }
});