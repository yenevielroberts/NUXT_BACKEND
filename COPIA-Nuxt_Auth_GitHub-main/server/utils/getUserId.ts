import * as schema from '../db/schema'
import { eq } from 'drizzle-orm'
import type { H3Event } from 'h3'


//Función donde obtengo el id del usuario atraves del id de la session el email o login
export async function  getUserID(event: H3Event){

    //1) Obtengo la sesión y datos del usuario logeado 
  const session = await getUserSession(event)
  const sessionUser = session.user as { id?: number | string, login?: string, email?: string } | undefined


  // Log de depuración: fundamental para saber qué está llegando realmente
  //console.log("Datos de sesión recuperados:", sessionUser);

  let userId = Number(sessionUser?.id)// 2)Obtengo el id del usuario 

  // 2) Si la sesión no trae id, busco el usuario en BD por email o login.
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

    // 3) Si no se puedo identificar el usuario, se bloquea el insert.
  if (userId ===null || isNaN(userId)) {
    throw createError({ statusCode: 401, statusMessage: 'Usuario no autenticado o no encontrado en BD' })
  }

  return userId
}