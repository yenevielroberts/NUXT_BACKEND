import {updatePlanetas} from '../../api/planetas'

//Handler de la peticion PUT
//PUT planetas/id
export default defineEventHandler (async (event)=>{

    const id = getRouterParam(event, 'id')
    const {nombre, anillos,satelites,habitabilidad,orbita_dias}=await readBody(event)

    const newInsertGalaxia=await updatePlanetas({nombre, anillos,satelites,habitabilidad,orbita_dias},Number(id))

    return newInsertGalaxia
})