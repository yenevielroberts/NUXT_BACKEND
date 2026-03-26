import { eq } from "drizzle-orm";
import * as schema from "../../db/schema"
import login from "./login";

export default defineOAuthGitHubEventHandler({
  config: {
    emailRequired: true
  },
  async onSuccess(event, { user, tokens }) {
    await setUserSession(event, {
      user: {
        login: user.login
      }
    })

    //user.email lo que recibo del github
    if (!user.email){
      throw createError({
        status: 500, 
        statusMessage: "No s'ha proporsionat l'email"
      })
    }
    //Comprueba si el usuario que autentico con github existe en la base de datos
    const db= useDb();
    let existingUser=await db.query.users.findFirst({
      where: eq(schema.users.email,user.email)
    });

    //Si no existe el usuario lo inserto en la base de datos
    if (!existingUser){
      //Hago un insert dentro de la base de datos
      const result = db.insert(schema.users).values({
        name:user.name,
        email:user.email,
        login:user.login
      }).returning()//Retorna el resultado. retornal un []

      existingUser = (await result).at(0)
    }
   
    //Error al hacer la autenticación con git hub
      if (!existingUser){
      throw createError({
        status: 500, 
        statusMessage: "Error de autenticación GitHub"
      })
    }

    const {password,...userWithoutPassword}=existingUser
    //setUserSession() API de NUXT
    await setUserSession(event, {
      user:{
        login:user.login
      }
    })
    return sendRedirect(event, '/')
    
  },

  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    console.error('GitHub OAuth error:', error)
    return sendRedirect(event, '/')
  },
})