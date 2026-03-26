<script setup lang="ts">
//Endpoint /galaxia/actualizar/id
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import {FetchError} from 'ofetch'
import type { Planeta,Galaxia } from '~~/types'
const { loggedIn, user, session, fetch, clear, openInPopup } = useUserSession();

definePageMeta({ middleware: ['auth'] })

const route = useRoute()
const id = route.params.id
const toast = useToast()

// Consulta principal para pintar el dashboard.
const { data: galaxias } = useFetch<Galaxia[]>('/api/galaxia/get', {
    default: () => []
})

// Transformamos las galaxias para el componente Select
// Nuxt UI espera objetos con 'label' (lo que se ve) y 'value' (lo que se guarda)
const opcionesGalaxias = computed(() => {
  return galaxias.value.map(g => ({
    label: g.nombre,
    value: g.id
  }))
})
//Obtengo los datos actuales de una galaxia especifica
const {data:planeta, pending, error, refresh}=useFetch<Planeta>(`/api/planetas/${id}`,{
    headers: useRequestHeaders(['cookie']),//Obtenemos las cabeceras de la petición actual (incluyendo la cookie de sesión)    
})


//Esquema de validación
const schema = z.object({
  id: z.number(),
  nombre: z.string().min(2,"El nombre es obligatorio"),
  anillos: z.number().optional(),
  satelites: z.number().optional(),
  habitabilidad: z.string(),
  orbita_dias: z.number(),
  galaxia_id: z.number({ required_error: "Debes seleccionar una galaxia" })
})

type Schema = z.output<typeof schema>

//Estado inicial
const state = reactive<Partial<Schema>>({
  id:undefined,
  nombre: undefined,
  anillos: undefined,
  satelites: undefined,
  habitabilidad: undefined,
  orbita_dias: undefined,
  galaxia_id:undefined
})

//Relleno el formulario cuando obtengo los detalles actuales
watch(planeta, (newVal)=>{
    if(newVal){
        state.id=newVal.id 
        state.nombre = newVal.nombre || ''
        state.anillos = newVal.anillos ?? undefined
        state.satelites = newVal.satelites ?? undefined
        state.habitabilidad = newVal.habitabilidad || ''
        state.orbita_dias = newVal.orbita_dias ?? undefined
        state.galaxia_id = newVal.galaxia_id ?? undefined
    }
},{immediate:true})

//Handler del formulario
async function onSubmit(event: FormSubmitEvent<Schema>) {
//Hago el insert
  try {
    await $fetch(`/api/planetas/${id}`, {
      method:'PUT',
      body:event.data
    })

    fetch()
    toast.add({ title: 'Success', description: 'Planeta actualizada correctamente', color: 'success' })
    navigateTo(`/planetas/detalle/${state.id}`)

  } catch (error) {
   
    if(error instanceof FetchError){
      //Error de fetch
      toast.add({ title: 'Error', description: error.data.message, color: 'error' })
    }else{
      //Error no controlado
      toast.add({ title: 'error', description: 'Error en la aplicación. Por favor contacte con el equipo técnico', color: 'error' })

    }
  }
}


const volver = () => navigateTo(`/planetas/detalle/${id}`);//
</script>


<template>

  <div class=" flex items-center justify-center px-4 ">
    <div class="w-full max-w-md space-y-4">
         <h1 class=" text-black text-xl" >Actualizar la galaxia: {{ state.nombre }}</h1>
        <button @click="volver" class="btn-back">← Volver a la página de detalle</button>

        <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
          <UFormField label="Nombre" name="nombre">
              <UInput v-model="state.nombre" />
          </UFormField>

              <UFormField label="Número de anillos" name="anillos">
              <UInput v-model="state.anillos" type="number"  />
          </UFormField>

          <UFormField label="Satelites" name="satelites">
              <UInput v-model="state.satelites" type="number"  />
          </UFormField>

          <UFormField label="Habitabilidad" name="habitabilidad">
              <UInput v-model="state.habitabilidad" type="text"  />
          </UFormField>

          <UFormField label="Orbita_dias" name="orbita_dias">
              <UInput v-model="state.orbita_dias" type="number"  />
          </UFormField>

          <UFormField label="Galaxias:" name="galaxias">
              <selectMenu>

              </selectMenu>
          </UFormField>
          <UFormField label="Seleciona una galaxia" name="galaxiaId">
              <!--Le paso un array de objectos que creen con el map. El Uselect busca la propieda label y los muestra el pantall y para el valor con la propieda value del objecto 
              falta poner un default
              -->
              <USelect v-model="state.galaxia_id" :items="opcionesGalaxias" class="w-48" />
          </UFormField>

          <!--Login normal-->
          <UButton type="submit">
          Submit
          </UButton>
    </UForm>
    </div>
  </div>
</template>
