<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import {FetchError} from 'ofetch'
const { loggedIn, user, session, fetch, clear, openInPopup } = useUserSession();

const schema = z.object({
  name:z.string(),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  name:undefined,
  email: undefined,
  password: undefined
})

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {

  try {
    await $fetch('/auth/register', {
      method:'POST',
      body:event.data
    })

    fetch()
    toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'error' })

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

watch(loggedIn,()=>{
  if(loggedIn.value) {
    navigateTo('/admin')
  }
})
</script>

<template>
 <UCard class="max-w-md m-auto my-10"> 
    <template #header>
        <h1 class="text-2xl text-center"> Registro</h1>
    </template>
     <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="nom" name="name">
            <UInput v-model="state.name" class="w-full" />
        </UFormField>
       
        <UFormField label="Email" name="email">
            <UInput v-model="state.email" />
        </UFormField>

        <UFormField label="Password" name="password">
            <UInput v-model="state.password" type="password" />
        </UFormField>

        <!--Login normal-->
        <UButton type="submit">
        Submit
        </UButton>
  </UForm>
    <UButton type="submit" class="mt-4" @click="openInPopup('/auth/github')">
        Log in with Github
    </UButton>
</UCard>
</template>

