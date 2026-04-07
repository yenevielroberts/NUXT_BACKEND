import {eq} from "drizzle-orm"
import { registerUSer, throwIfUserExists } from "~~/server/utils/registerUtils";
import jwt from 'jsonwebtoken'

export default defineEventHandler(async(event) =>{
    //1 Accedo a los campos del formulario
   const {name, email, password}= await readBody(event)

   if(!name || !email || !password){
    throw createError({statusCode: 400, statusMessage:"Faltan campos por introducir"})
   }
   

  await throwIfUserExists(email);
  const newUser = await registerUSer(name,email, password)
  const {password:repassword, ...userWithouthPassword} = newUser

  // Establece la sesión (cookies) igual que el login
  await setUserSession(event, {
    user: {
      id: String(userWithouthPassword.id),
      name: userWithouthPassword.name,
      login: userWithouthPassword.email
    }
  })

  // Genera y devuelve un JWT para clientes móviles o headers
  const token = jwt.sign(
    { id: userWithouthPassword.id, email: userWithouthPassword.email },
    process.env.JWT_SECRET || 'clave_secreta_provisional',
    { expiresIn: '30d' }
  )

  return { user: userWithouthPassword, token }
  
})

