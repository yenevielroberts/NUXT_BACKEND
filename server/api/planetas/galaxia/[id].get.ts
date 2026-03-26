//GET /planetas/galaxia/:id
import { getPlanetas } from '../../../api/planetas'

export default defineEventHandler(async (event)=>{

    //1) Obtengo el id de la galaxia enviando por la url
    const galaxia_id=getRouterParam(event, 'id')

    const planetas = await getPlanetas(Number(galaxia_id))

    if(!planetas){
        throw createError({
            statusCode: 404,
            statusMessage: 'planetas no encontrados o sin acceso'
        })
    }

    return planetas
})