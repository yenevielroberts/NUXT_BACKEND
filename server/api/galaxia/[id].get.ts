import { GalaxiaById } from '../galaxias'
import * as schema from '../../db/schema'
import { eq } from 'drizzle-orm'
import { getAuthenticatedUser } from '~~/server/utils/auth'


//GET /galaxia/id
export default defineEventHandler(async (event)=>{

    //console.log("Cookie Header:", getHeader(event, 'cookie'))
    
    //1) Obtengo el parametro enviado en la URL
    const id = getRouterParam(event, 'id')

     //2) Obtengo la sesión y datos del usuario logeado 
      const session = await getAuthenticatedUser(event)
    
    
      // 2) Extraemos el ID (ya sea del token o de la cookie)
      let userId =  Number(session?.id) 

    
      // 3)Busco el usuario en BD por email o login obtenido de la session.
       if (!userId) {
         const userEmail = session?.email;
         const userLogin = session?.login;
     
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