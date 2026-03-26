import {deleteGalaxia} from '../../api/galaxias'

//Handler de la peticion DELETE
//DELETE galaxia/id
export default defineEventHandler (async (event)=>{
     const id = getRouterParam(event, 'id')

    const newInsertGalaxia=await deleteGalaxia(Number(id))

    return newInsertGalaxia
})