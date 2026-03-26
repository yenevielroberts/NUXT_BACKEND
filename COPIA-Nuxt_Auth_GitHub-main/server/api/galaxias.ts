import { eq, inArray, and, count } from 'drizzle-orm';
import * as schema from '../db/schema'

// Devuelve todas las galaxias (sin filtrar por usuario).
export async function getGalaxias( ){
    const galaxias= await useDb().query.galaxias.findMany();
 return galaxias
};

// Devuelve solo las galaxias asociadas a un usuario concreto.
export async function getGalaxiasByUserId(userId: number) {

    // Recupera únicamente las galaxias vinculadas al usuario.
    // Esta consulta trae la galaxia y el número de planetas en un solo array
    const resultado = await useDb()
        .select({
            id: schema.galaxias.id,
            nombre: schema.galaxias.nombre,
            tipo: schema.galaxias.tipo,
            curiosidades:schema.galaxias.curiosidades,
            num_planetas_count: count(schema.planetas.id) 
        })
        .from(schema.galaxias)
        .leftJoin(schema.planetas, eq(schema.galaxias.id, schema.planetas.galaxia_id))
        .where(eq(schema.galaxias.id_user, userId))
        .groupBy(schema.galaxias.id);

    return resultado
}

//Obtengo una galaxia en especifico
export async function GalaxiaById(userId:number, galaxiaId:number) {
    
  const userGalaxia = await useDb()
        .select({
            id: schema.galaxias.id,
            nombre: schema.galaxias.nombre,
            tipo: schema.galaxias.tipo,
            curiosidades: schema.galaxias.curiosidades,
            num_planetas_count: count(schema.planetas.id) 
        })
        .from(schema.galaxias)
        .leftJoin(
            schema.planetas, 
            eq(schema.galaxias.id, schema.planetas.galaxia_id)
        )
        .where(
            and(
                eq(schema.galaxias.id_user, userId),
                eq(schema.galaxias.id, galaxiaId)
            )
        )
        .groupBy(
            schema.galaxias.id,
            schema.galaxias.nombre,
            schema.galaxias.tipo,
            schema.galaxias.curiosidades
        );

    // .at(0) obtener el primer elemento o undefined
    return userGalaxia.at(0);
}



// Inserta una galaxia y la relaciona con el usuario autenticado.
export async function insertGalaxiasForUser(
    nombre: string,
    curiosidades: string,
    tipo: string,
    id_user: number
) {
    
    // 1) Crea el registro de galaxia.
    const res = await useDb()
    .insert(schema.galaxias)
    .values({
        nombre,
        curiosidades,
        tipo,
        id_user

    }).returning()

    const newGalaxia = res.at(0)

    if (!newGalaxia?.id) {
        throw createError({ statusCode: 500, statusMessage: 'Error al registrar una nueva galaxia' })
    }

    return newGalaxia
}


// Elimina una galaxia por su ID y devuelve datos mínimos de confirmación.
export async function deleteGalaxia(id:number) {
    
    try{

        // Elimino la galaxia
        const res= await useDb()
        .delete(schema.galaxias)
        .where(eq(schema.galaxias.id, id))
        .returning({deletedId:schema.galaxias.id, nombre:schema.galaxias.nombre});

        const deletedGalaxia=res.at(0)

        if (!deletedGalaxia){
            throw createError ({statusCode:500, statusMessage:"Error al eliminar la galaxia"})
        }
    
        return deletedGalaxia 
    }catch(error:any){

        // Si el error ya es un createError de Nuxt, lo relanzamos
        if (error.statusCode) throw error;
        
        throw createError({ 
            statusCode: 500, 
            statusMessage: error.message || "Error al eliminar la galaxia" 
        });
    }

}


// Actualiza una galaxia por ID y devuelve el registro actualizado.
export async function updateGalaxia(galaxia:{nombre:string, curiosidades:string, tipo:string}, id:number,){

    const res=await useDb().update(schema.galaxias).set({nombre:galaxia.nombre,curiosidades:galaxia.curiosidades,tipo:galaxia.tipo}).where(eq(schema.galaxias.id, id)).returning();  

    const updatedGalaxia=res.at(0)

       if (!updatedGalaxia){
        throw createError ({statusCode:500, statusMessage:"Error al actualizar la galaxia"})
    }
    
    return updatedGalaxia
}