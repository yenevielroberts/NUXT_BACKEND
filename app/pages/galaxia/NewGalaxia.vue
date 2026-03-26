<script setup lang="ts">
//Endpoint /galaxia/NewGalaxia
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import {FetchError} from 'ofetch'
const { loggedIn, user, session, fetch, clear, openInPopup } = useUserSession();

definePageMeta({ middleware: ['auth'] })

const schema = z.object({
  nombre: z.string(),
  curiosidades: z.string(),
  tipo: z.string()

})


type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  nombre: undefined,
  curiosidades: undefined,
  tipo: undefined
})

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
//Hago el insert
  try {
    await $fetch('/api/galaxia/post', {
      method:'POST',
      body:event.data
    })

    fetch()
    toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
    navigateTo('/admin')

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

</script>


<template>

<div class=" flex items-center justify-center px-4 ">

  <div class="w-full max-w-md space-y-4">
     <h1 class=" text-black text-xl" >Agregar una nueva Galaxia</h1>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="Nombre" name="nombre">
          <UInput v-model="state.nombre" />
      </UFormField>

        <UFormField label="Curisidades" name="num_planetas">
          <UInput v-model="state.curiosidades" type="text"  />
      </UFormField>

        <UFormField label="Tipo de galaxia" name="tipo">
          <UInput v-model="state.tipo" type="text"  />
      </UFormField>

      <!--Login normal-->
      <UButton type="submit">
      Submit
      </UButton>
  </UForm>
  </div>
</div>

</template>
