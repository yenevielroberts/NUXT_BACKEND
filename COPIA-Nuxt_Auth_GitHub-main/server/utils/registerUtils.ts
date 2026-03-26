import {eq} from "drizzle-orm"
import * as schema from '../db/schema'

export async function throwIfUserExists(email:string,) {
    
       //guardará la consulta
   const existingUser =await useDb().query.users.findFirst({
    where:eq(schema.users.email, email)
   })

   if(existingUser){
      throw createError({statusCode: 400, statusMessage:"el usuario ya existe"})
   }
}

export async function registerUSer(name:string, email:string, password:string) {
    const res=await useDb().insert(schema.users).values({
        name,
        email, 
        password: await hashPassword(password),
        login:email
    }).returning()
    const newUser=res.at(0)
    if (!newUser){
        throw createError ({statusCode:500, statusMessage:"Error al registrar el usuario"})
    }

    return newUser
    
}