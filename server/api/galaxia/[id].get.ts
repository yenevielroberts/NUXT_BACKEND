import { GalaxiaById } from '../../api/galaxias'
import * as schema from '../../db/schema'
import { eq } from 'drizzle-orm'

//GET /galaxia/id
export default defineEventHandler(async (event)=>{

    //console.log("Cookie Header:", getHeader(event, 'cookie'))
    
    //1) Obtengo el parametro enviado en la URL
    const id = getRouterParam(event, 'id')

     //2) Obtengo la sesión y datos del usuario logeado 
      const session = await getUserSession(event)
      const sessionUser = session.user as { id?: number | string, login?: string, email?: string } | undefined
    
      // Log de depuración: fundamental para saber qué está llegando realmente
      //console.log("Datos de sesión recuperados:", session);
    
      let userId = null 
    
      // 3)Busco el usuario en BD por email o login obtenido de la session.
      if (sessionUser?.login || sessionUser?.email) {
        const userFromDb = await useDb().query.users.findFirst({
          where: sessionUser?.email
            ? eq(schema.users.email, sessionUser.email)
            : eq(schema.users.login, sessionUser!.login as string)
        })
    
        if (userFromDb) {
          userId = Number(userFromDb.id)//Solo convierto a numero si existe
        }
      }
    
        // 4) Si no se puedo identificar el usuario, se bloquea el insert.
      if (userId ===null || isNaN(userId)) {
        throw createError({ statusCode: 401, statusMessage: 'Usuario no autenticado o no encontrado en BD' })
      }

    const galaxia=await GalaxiaById(userId, Number(id))

    //5) Si no se encuentra la galaxia o el usuario no tiene acceso, retornar error 404
    if (!galaxia) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Galaxia no encontrada o sin acceso'
        })
    }

    return galaxia
})