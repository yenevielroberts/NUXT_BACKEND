import {eq} from "drizzle-orm"
import { registerUSer, throwIfUserExists } from "~~/server/utils/registerUtils";
export default defineEventHandler(async(event) =>{
    //1 Accedo a los campos del formulario
   const {name, email, password}= await readBody(event)

   if(!name || !email || !password){
    throw createError({statusCode: 400, statusMessage:"Faltan campos por introducir"})
   }
   

  await throwIfUserExists(email);
  const newUser = await registerUSer(name,email, password)
  const {password:repassword, ...userWithouthPassword} = newUser

  await setUserSession(event, {
    user:userWithouthPassword
  })

  return userWithouthPassword
  
})

