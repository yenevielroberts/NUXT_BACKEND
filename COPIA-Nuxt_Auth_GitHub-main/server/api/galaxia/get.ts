import { getGalaxiasByUserId } from '../../api/galaxias'
import * as schema from '../../db/schema'
import { eq } from 'drizzle-orm'


//Handle GET para obtener todas las galaxias de un usuario
//GET galaxia/get
export default defineEventHandler(async(event) =>{

//console.log("Cookie Header:", getHeader(event, 'cookie'))

  //1) Obtengo la sesión y datos del usuario logeado 
  const session = await getUserSession(event)
  const sessionUser = session.user as { id?: number | string, login?: string, email?: string } | undefined


  // Log de depuración: fundamental para saber qué está llegando realmente
  //console.log("Datos de sesión recuperados:", sessionUser);

  let userId = Number(sessionUser?.id)// 2)Obtengo el id del usuario 

  // 3) Si la sesión no trae id, busco el usuario en BD por email o login.
  if (!userId &&(sessionUser?.login || sessionUser?.email)) {
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
  //5) Obtengo los datos de las galaxias
  const galaxias = await getGalaxiasByUserId(userId)

  return galaxias
  
})