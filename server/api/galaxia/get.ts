import { getGalaxiasByUserId } from '../galaxias'
import * as schema from '../../db/schema'
import { eq } from 'drizzle-orm'
import { getAuthenticatedUser } from '~~/server/utils/auth'


//Handle GET para obtener todas las galaxias de un usuario
//GET galaxia/get
export default defineEventHandler(async(event) =>{

//console.log("Cookie Header:", getHeader(event, 'cookie'))
const headers = getHeaders(event)
  console.log('Headers que llegan al servidor:', headers.authorization)
  //1) Obtengo la sesión y datos del usuario logeado 
  const sessionUser = await getAuthenticatedUser(event)


  // Log de depuración: fundamental para saber qué está llegando realmente
  //console.log("Datos de sesión recuperados:", sessionUser);

  // 2) Extraemos el ID (ya sea del token o de la cookie)
  let userId = sessionUser?.id ? Number(sessionUser.id) : null

  // 3) Si la sesión no trae id, busco el usuario en BD por email o login.
// 3) Si la sesión no trae id, busco el usuario en BD por email o login.
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

    // 4) Si no se puedo identificar el usuario, se bloquea el insert.
 if (!userId || isNaN(userId)) {
    throw createError({ 
      statusCode: 401, 
      statusMessage: 'Usuario no autenticado (Cookie/Token no encontrados)' 
    })
  }
  //5) Obtengo los datos de las galaxias
  return await getGalaxiasByUserId(userId)
  
})