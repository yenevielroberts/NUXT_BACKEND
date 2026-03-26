import { drizzle } from "drizzle-orm/libsql"
import { createClient } from "@libsql/client"
import config from "../../drizzle.config"
import * as schema from "./schema"

const client = createClient({url: config.dbCredentials.url});

export const db = drizzle(client, {schema});//Tranforma la base de datos en un objecto
//Exporto la base de datos  para usarlo siempre que quiera sin tener que repetir código
//Cada vez que quiero conectarme a la base de datos tengo que escribir todo este código