import {deletePlaneta} from '../../api/planetas'

//Handler de la peticion DELETE
//DELETE planetas/id
export default defineEventHandler (async (event)=>{
     const id_planeta= getRouterParam(event, 'id')

    const newInsertGalaxia=await deletePlaneta(Number(id_planeta))

    return newInsertGalaxia
})