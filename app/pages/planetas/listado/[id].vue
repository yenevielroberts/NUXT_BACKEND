<script setup lang="ts">
// GET /planetas/listado/id (id de la galaxia)

import type { Planeta } from '~~/types'
// Protege la ruta para usuarios autenticados.
definePageMeta({ middleware: ['auth'] })

const route = useRoute()
const galaxia_id = route.params.id

const volver = () => navigateTo("/galaxia/listado");

// Datos de sesión y endpoint protegido de admin.
const { user } = useUserSession()

// Consulta principal para pintar el dashboard.
const { data: planetas, pending, error, refresh } = useFetch<Planeta[]>(`/api/planetas/galaxia/${galaxia_id}`)

// Modelo base que llega desde la API de galaxias.
type Galaxia = {
    id: number
    nombre: string | null
    num_planetas_count: number | null
    curiosidades: string | null
    tipo: string | null
}
const {data: galaxia, error: galaxia_error,refresh: galaxia_refresh}= useFetch<Galaxia | null >(`/api/galaxia/${galaxia_id}`)

// KPIs del panel.
const totalplanetas = computed(() => planetas.value?.length ?? 0)


// Muestra solo las últimas 5 entradas (de más reciente a más antigua).
const listaPlanetas = computed(() => (planetas.value ?? []))
</script>

<template>
    <!-- Contenedor principal de la home de administración -->
    <main class="admin-home">
        <!-- Cabecera con descripción y acciones rápidas -->
        <section class="hero">
            <h1>Los planetas de la galaxia: {{ galaxia?.nombre }}</h1>
            <div class="hero-actions">
                
                <UButton as-child>
                    <NuxtLink to="/planetas/NewPlaneta">Nuevo Planeta</NuxtLink>
                </UButton>
            </div>
        </section>
        <!-- Tabla con últimas galaxias y estados de carga -->
        <UCard class="content-card">
            <div class="content-header">
                <h2>Planetas</h2>
                <p class="total-count" aria-label="Total de planetas" v-if="!listaPlanetas.length">0</p>
                <p class="total-count" aria-label="Total de planetas" v-else>{{ listaPlanetas.length }}</p>
                <UButton color="neutral" variant="outline" size="sm" @click="refresh()">Actualizar</UButton>
            </div>
            <button @click="volver" class="btn-back">← Volver al listado</button>
            <p v-if="pending" class="status">Cargando datos...</p>
            <p v-else-if="error" class="status error">No se pudieron cargar los planetas.</p>
            <p v-else-if="!listaPlanetas.length" class="status">No hay planetas registrados en esta galaxia.</p>

            <div v-else class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>habitabilidad</th>
                            <th>Orbita en días</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="planeta in listaPlanetas" :key="planeta.id">
                            <td>
                                <UButton @click="navigateTo(`/planetas/detalle/${planeta.id}`)">
                                    {{ planeta.nombre }}
                                </UButton>
                            </td>
                            <td>{{ planeta.habitabilidad || 'Sin tipo' }}</td>
                            <td>{{ planeta.orbita_dias ?? 0 }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </UCard>
    </main>
</template>

<style scoped>
/* Layout general del dashboard */
.admin-home {
    min-height: calc(100vh - 80px);
    max-width: 1100px;
    margin: 0 auto;
    padding: 2rem 1.25rem 3rem;
    display: grid;
    gap: 1.25rem;
    color: #1e293b;
}

/* Tarjeta principal (hero) */
.hero {
    background: #ffffff;
    border: 2px solid #7c3aed;
    border-radius: 12px;
    padding: 1.25rem;
}

.hero h1 {
    margin: 0;
    color: #1e293b;
    font-size: 1.7rem;
    line-height: 1.2;
}

.hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
}

/* Bloque de contenido con tabla */
.content-card {
    overflow: hidden;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
}

.content-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 0.9rem;
    flex-wrap: wrap;
}

h2 {
    margin: 0;
    color: #1e293b;
    font-size: 1.35rem;
}

.total-count {
    margin: 0;
    color: #ffffff;
    background: #7c3aed;
    min-width: 2rem;
    height: 2rem;
    padding: 0 0.65rem;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
}

.btn-back {
    background: #ffffff;
    border: 2px solid #7c3aed;
    color: #6d28d9;
    padding: 0.65rem 1rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
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
    color: #334155;
    margin: 0.75rem 0;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    background: #f8fafc;
    border-left: 4px solid #3b82f6;
}

.status.error {
    color: #7f1d1d;
    background: #fee2e2;
    border-left-color: #dc2626;
}

.table-wrap {
    overflow-x: auto;
    border-radius: 8px;
}

/* Tabla de últimas galaxias */
table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    text-align: left;
    padding: 0.9rem 0.65rem;
    border-bottom: 1px solid #e2e8f0;
}

th {
    color: #ffffff;
    background: #7c3aed;
    font-weight: 700;
}

td {
    color: #334155;
}

tbody tr:hover {
    background: #f8faff;
}

tbody tr:focus-within {
    background: #f0f9ff;
}

.session-text {
    color: #475569;
    font-size: 0.92rem;
    margin: 0;
}

@media (prefers-reduced-motion: reduce) {
    * {
        transition-duration: 0.01ms !important;
        animation-duration: 0.01ms !important;
    }
}

@media (max-width: 640px) {
    .admin-home {
        padding: 1.5rem 1rem 2rem;
    }

    .hero h1 {
        font-size: 1.45rem;
    }

    .content-header {
        align-items: stretch;
    }

    th,
    td {
        padding: 0.75rem 0.5rem;
    }
}
</style>