import { eq, inArray, and } from 'drizzle-orm';
import * as schema from '../db/schema'

//Devuelve todos los planetas de una galaxia
export async function getPlanetas(galaxia_id: number) {

    const planetas = await useDb().select({
        id: schema.planetas.id,
        nombre: schema.planetas.nombre,
        satelites: schema.planetas.satelites,
        anillos: schema.planetas.anillos,
        habitabilidad: schema.planetas.habitabilidad,
        orbita_dias: schema.planetas.orbita_dias,
        galaxia_id: schema.planetas.galaxia_id,
        nombre_galaxia: schema.galaxias.nombre
    })
        .from(schema.planetas)
        .innerJoin(schema.galaxias, eq(schema.galaxias.id, schema.planetas.galaxia_id))
        .where(eq(schema.planetas.galaxia_id, galaxia_id));
    return planetas
}

// Inserta un planeta.
export async function insertPlaneta(planeta: {
    nombre: string,
    anillos: number,
    satelites: number,
    habitabilidad: string,
    orbita_dias: number,
}, galaxia_id: number) {

    const res = await useDb()
        .insert(schema.planetas)
        .values({
            nombre: planeta.nombre,
            anillos: planeta.anillos,
            satelites: planeta.satelites,
            habitabilidad: planeta.habitabilidad,
            orbita_dias: planeta.orbita_dias,
            galaxia_id
        }).returning()
    const newPlaneta = res.at(0)

    if (!newPlaneta) {
        throw createError({ statusCode: 500, statusMessage: "Error al registrar un nuevo planeto" })
    }

    return newPlaneta
}

//Obtengo una galaxia en especifico
export async function planetaById(id_planeta: number) {

    const planeta = await useDb().select({
        id: schema.planetas.id,
        nombre: schema.planetas.nombre,
        satelites: schema.planetas.satelites,
        anillos: schema.planetas.anillos,
        habitabilidad: schema.planetas.habitabilidad,
        orbita_dias: schema.planetas.orbita_dias,
        galaxia_id: schema.planetas.galaxia_id,
        nombre_galaxia: schema.galaxias.nombre
    })
        .from(schema.planetas)
        .innerJoin(schema.galaxias, eq(schema.galaxias.id, schema.planetas.galaxia_id))
        .where(eq(schema.planetas.id, id_planeta))

    return planeta.at(0)
}

// Elimina una galaxia por su ID y devuelve datos mínimos de confirmación.
export async function deletePlaneta(id: number) {

    try {

        // Elimino la galaxia
        const res = await useDb()
            .delete(schema.planetas)
            .where(eq(schema.planetas.id, id))
            .returning({ deletedId: schema.planetas.id, nombre: schema.planetas.nombre });

        const deletedPlaneta = res.at(0)

        if (!deletedPlaneta) {
            throw createError({ statusCode: 500, statusMessage: "Error al eliminar el planeta" })
        }

        return deletedPlaneta
    } catch (error: any) {

        // Si el error ya es un createError de Nuxt, lo relanzamos
        if (error.statusCode) throw error;

        throw createError({
            statusCode: 500,
            statusMessage: error.message || "Error al eliminar el planeta"
        });
    }

}


// Actualiza un planeta por ID y devuelve el registro actualizado.
export async function updatePlanetas(planeta: { nombre: string, anillos: number, satelites: number, habitabilidad: string, orbita_dias: number }, id: number,) {

    const res = await useDb().update(schema.planetas).set({ nombre: planeta.nombre, anillos: planeta.anillos, satelites: planeta.satelites, habitabilidad: planeta.habitabilidad, orbita_dias: planeta.orbita_dias }).where(eq(schema.planetas.id, id)).returning();

    const updatedPlaneta = res.at(0)

    if (!updatedPlaneta) {
        throw createError({ statusCode: 500, statusMessage: "Error al actualizar el planeta" })
    }

    return updatedPlaneta
}