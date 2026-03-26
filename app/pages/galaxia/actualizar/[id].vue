<script setup lang="ts">
//Endpoint /galaxia/actualizar/id
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import {FetchError} from 'ofetch'
import type { Galaxia } from '~~/types'
const { loggedIn, user, session, fetch, clear, openInPopup } = useUserSession();

definePageMeta({ middleware: ['auth'] })

const route = useRoute()
const id = route.params.id
const toast = useToast()

//Obtengo los datos actuales de una galaxia especifica
const {data:galaxia, pending, error, refresh}=useFetch<Galaxia>(`/api/galaxia/${id}`,{
    headers: useRequestHeaders(['cookie']),//Obtenemos las cabeceras de la petición actual (incluyendo la cookie de sesión)    
})

//Esquema de validación
const schema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  curiosidades: z.string().optional(),
  tipo: z.string()

})

type Schema = z.output<typeof schema>

//Estado inicial
const state = reactive<Partial<Schema>>({
  nombre:'',
  curiosidades:'',
  tipo:''
})

//Relleno el formulario cuando obtengo los detalles actuales
watch(galaxia, (newVal)=>{
    if(newVal){
        state.nombre = newVal.nombre || ''
        state.curiosidades = newVal.curiosidades || ''
        state.tipo = newVal.tipo || '' 
    }
},{immediate:true})

//Handler del formulario
async function onSubmit(event: FormSubmitEvent<Schema>) {
//Hago el insert
  try {
    await $fetch(`/api/galaxia/${id}`, {
      method:'PUT',
      body:event.data
    })

    fetch()
    toast.add({ title: 'Success', description: 'Galaxia actualizada correctamente', color: 'success' })
    navigateTo(`/galaxia/detalle/${id}`)

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

const volver = () => navigateTo(`/galaxia/detalle/${id}`);//
</script>


<template>
  <div class=" flex items-center justify-center px-4 ">
   
    <div class="w-full max-w-md space-y-4">
       <h1 class=" text-black text-xl" >Actualizar la galaxia: {{ state.nombre }}</h1>
      <button @click="volver" class="btn-back">← Volver a la página de detalle</button>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Nombre" name="nombre">
            <UInput v-model="state.nombre" type="text" />
        </UFormField>

        <UFormField label="Curisidades" name="num_planetas">
          <UInput v-model="state.curiosidades" type="text" />
        </UFormField>

        <UFormField label="Tipo de -glaxia" name="tipo">
          <UInput v-model="state.tipo" type="text" />
        </UFormField>

        <!--Login normal-->
        <UButton type="submit">
          Submit
        </UButton>
      </UForm>
    </div>
  </div>
</template>
