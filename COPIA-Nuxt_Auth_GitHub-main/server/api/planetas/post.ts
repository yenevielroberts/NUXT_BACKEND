import {insertPlaneta} from '../../api/planetas'

//Handler de la peticion PUT
//POST planetas/post
export default defineEventHandler (async (event)=>{

    const body=await readBody(event)

    const newInsertGalaxia=await insertPlaneta({nombre:body.nombre,anillos:body.anillos, satelites:body.satelites,habitabilidad:body.habitabilidad,orbita_dias:body.orbita_dias},body.galaxiaId)

    return newInsertGalaxia
})