import { eq } from "drizzle-orm"
import * as schema from '../../db/schema'

export default defineEventHandler(async (event) => {

  //1 Accedo a los campos del formulario
  const { email, password } = await readBody(event)

  //comprueba si la información esta email y password
  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: "Faltan campos por introducir" })
  }

  //consulta a la base de datos para comprobar que existe
  const correctLogin = await useDb().query.users.findFirst({
    where: eq(schema.users.email, email)
  })

  if (!correctLogin) {
    throw createError({ statusCode: 400, statusMessage: "El email o password es incorrecta" })
  }


  if (!correctLogin.password) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid password github' })
  }

  //funcionalidad de Nust auth verifyPassword
  const isValid = await verifyPassword(correctLogin.password, password)

  if (!isValid) {
    throw createError({ statusCode: 400, statusMessage: 'Password incorrect!' })
  }

  const { password: repassword, ...userWithouthPassword } = correctLogin

  await setUserSession(event, {user: userWithouthPassword})

  return userWithouthPassword


});
