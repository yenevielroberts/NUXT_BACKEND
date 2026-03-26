import { eq } from 'drizzle-orm'
import { insertGalaxiasForUser } from '../../api/galaxias'
import * as schema from '../../db/schema'

// Handler POST para crear una galaxia asociada a un usuario autenticado.
export default defineEventHandler(async (event) => {
    // 1) Obtengo los datos enviados por el formulario.
    const { nombre, curiosidades, tipo } = await readBody(event)

    // 2) Obtengo la sesión y datos del usuario.
    const session = await getUserSession(event)
    const sessionUser = session.user as { id?: number | string, login?: string, email?: string } | undefined

    // 3) Obtengo el ID del usuario directamente desde la sesión.
    let userId = Number(sessionUser?.id)

    // 4) Si la sesión no trae id, busco el usuario en BD por email o login.
    if (!userId && (sessionUser?.login || sessionUser?.email)) {
        const userFromDb = await useDb().query.users.findFirst({
            where: sessionUser?.email
                ? eq(schema.users.email, sessionUser.email)
                : eq(schema.users.login, sessionUser!.login as string)
        })

        userId = Number(userFromDb?.id) //Guardo el id
    }

    // 5) Si no se puedo identificar el usuario, se bloquea el insert.
    if (!userId) {
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