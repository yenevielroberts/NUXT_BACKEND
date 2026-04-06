import { eq } from 'drizzle-orm'
import { insertGalaxiasForUser } from '../galaxias'
import * as schema from '../../db/schema'
import { getAuthenticatedUser } from '~~/server/utils/auth'

// Handler POST para crear una galaxia asociada a un usuario autenticado.
export default defineEventHandler(async (event) => {
    // 1) Obtengo los datos enviados por el formulario.
    const { nombre, curiosidades, tipo } = await readBody(event)

    // 2) Obtengo la sesión y datos del usuario.
    const sessionUser = await getAuthenticatedUser(event)

    // 3) Obtengo el ID del usuario directamente desde la sesión.
     let userId = sessionUser?.id ? Number(sessionUser.id) : null

    // 4) Si la sesión no trae id, busco el usuario en BD por email o login.
    if (!userId) {
      const userEmail = sessionUser?.email;
      const userLogin = sessionUser?.login;
  
      // Solo entramos si alguno de los dos existe
      if (userEmail || userLogin) {
        const userFromDb = await useDb().query.users.findFirst({
          where: userEmail 
            ? eq(schema.users.email, userEmail) 
            : eq(schema.users.login, userLogin as string) // Forzamos que aquí ya no es undefined
        })
        
        if (userFromDb) {
          userId = Number(userFromDb.id)
        }
      }
    }

    // 5) Si no se puedo identificar el usuario, se bloquea el insert.
    if (!userId || isNaN(userId)) {
        throw createError({ statusCode: 401, statusMessage: 'Usuario no autenticado' })
    }

    // 6) Creo galaxia y guardo la relación con el usuario en la tabla auxiliar.
    const newInsertGalaxia = await insertGalaxiasForUser(
        nombre,
        curiosidades,
        tipo,
        userId
    )

    // 7) Respondo con la galaxia creada.
    return newInsertGalaxia
})