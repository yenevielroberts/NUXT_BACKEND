import {updateGalaxia} from '../../api/galaxias'

//Handler de la peticion PUT
//PUT galaxia/id
export default defineEventHandler (async (event)=>{

    const id = getRouterParam(event, 'id')
    const {nombre, curiosidades,tipo}=await readBody(event)

    const newInsertGalaxia=await updateGalaxia({nombre:nombre, curiosidades:curiosidades,tipo:tipo},Number(id))

    return newInsertGalaxia
})