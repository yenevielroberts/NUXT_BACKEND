import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

export const users = sqliteTable("users", {
    id: integer("id").primaryKey(),
    name: text("name"),
    email: text("email").notNull(),
    login: text("login"),
    password: text("password"),
});

export const galaxias=sqliteTable ("galaxias",{
  id: integer("id").primaryKey(),
  nombre: text("nombre"),
  curiosidades: text("curiosidades"),
  tipo: text("tipo"),
  id_user: integer ("user_id").references(()=>users.id),

})

export const planetas=sqliteTable ("planetas",{
  id: integer("id").primaryKey(),
  nombre: text("name"),
  anillos:integer("anillos"),
  satelites: integer("satelites"),
  habitabilidad: text("habitabilidad"),
  orbita_dias: integer("orbita_dias"),
  galaxia_id: integer("galaxia_id").references(()=>galaxias.id),
})

