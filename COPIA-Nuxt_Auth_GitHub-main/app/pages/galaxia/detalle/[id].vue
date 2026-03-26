<script setup lang="ts">
// GET /galaxia/detalle/id
import type { Galaxia } from '~~/types'
// Protege la ruta para usuarios autenticados.
import {FetchError} from 'ofetch'
definePageMeta({ middleware: ['auth'] })

const route = useRoute()
const id = route.params.id
const toast = useToast()
const { loggedIn, user, session, fetch, clear, openInPopup } = useUserSession();




//Obtengo el detalle de una galaxia especifica
const {data:galaxia, pending, error, refresh}=useFetch<Galaxia | null>(`/api/galaxia/${id}`,{
    headers: useRequestHeaders(['cookie']),//Obtenemos las cabeceras de la petición actual (incluyendo la cookie de sesión)
    default: ()=> null,
    
})

const volver = () => navigateTo("/galaxia/listado");

async function deleteHandler(){

    const confirmacion= confirm("Seguro que quieres eliminar esta galaxia?")
    if(confirmacion){
        try {
            await $fetch(`/api/galaxia/${id}`, {
            method:'DELETE'
            })

            fetch()
            toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'error' })
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
}
</script>

<template>
    <section class="detalle-container">
        <p v-if="pending" class="status">Cargando datos...</p>
        <p v-else-if="error" class="status error">Error al cargar la galaxia.</p>
        <p v-else-if="!galaxia" class="status error">Galaxia no encontrada o no tienes acceso a ella.</p>
        <div v-else class="detalle-content">
            <h1>Galaxia {{ galaxia.nombre }}</h1>
            <button @click="volver" class="btn-back">← Volver al listado</button>
            <div class="galaxia-detalle">
                <p><strong>Tipo:</strong> {{ galaxia.tipo || 'No especificado' }}</p>
                <p><strong>Número de planetas:</strong> {{ galaxia.num_planetas_count || 0 }}</p>
                <p><strong>Curiosidades:</strong> {{ galaxia.curiosidades || 'Sin información' }}</p>
            </div> 
            <div class="container-action-btn">
                <UButton @click="navigateTo(`/galaxia/actualizar/${galaxia.id}`)">Actualizar</UButton>
                <UButton @click="deleteHandler">Eliminar</UButton>  
            </div>
        </div>
   
    </section>
</template>
<style scoped>
/* Contenedor */
.detalle-container {
    max-width: 860px;
    margin: 2rem auto;
    padding: 0 1rem;
}

.detalle-content {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
}

/* Botón de volver */
.btn-back {
    background: #ffffff;
    border: 2px solid #7c3aed;
    color: #6d28d9;
    padding: 0.65rem 1rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-bottom: 1.5rem;
    min-height: 44px;
}

.btn-back:hover {
    background: #f5f3ff;
    transform: translateX(-2px);
}

.btn-back:focus-visible {
    outline: 3px solid #7c3aed;
    outline-offset: 2px;
}

.status {
    text-align: center;
    padding: 2rem 1.25rem;
    font-size: 1rem;
    color: #334155;
    background: #f8fafc;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    border-left: 4px solid #3b82f6;
}

.status.error {
    color: #7f1d1d;
    background: #fee2e2;
    border-color: #fecaca;
    border-left-color: #dc2626;
}

/* Título principal */
h1 {
    color: #1e293b;
    font-size: 2rem;
    margin: 0 0 1.5rem 0;
    line-height: 1.2;
}

/*Tarjeta */
.galaxia-detalle {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 1.25rem;
}

.galaxia-detalle p {
    color: #334155;
    margin: 0 0 0.75rem;
    line-height: 1.6;
}

.galaxia-detalle p:last-child {
    margin-bottom: 0;
}

.galaxia-detalle strong {
    color: #1e293b;
}

.container-action-btn{
    display: flex;
    margin-top: 1rem;
    gap: 0.75rem;
    flex-wrap: wrap;
}

.container-action-btn :deep(button) {
    min-height: 44px;
}

.container-action-btn :deep(button:focus-visible) {
    outline: 3px solid #7c3aed;
    outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
    * {
        transition-duration: 0.01ms !important;
        animation-duration: 0.01ms !important;
    }
}

@media (max-width: 640px) {
    .detalle-container {
        margin: 1rem auto;
    }

    .detalle-content {
        padding: 1rem;
    }

    h1 {
        font-size: 1.55rem;
    }

    .container-action-btn {
        display: grid;
        grid-template-columns: 1fr;
    }
}
</style>