<script setup lang="ts">
import type { Galaxia } from '~~/types'
// Protege la ruta para usuarios autenticados.
definePageMeta({ middleware: ['auth'] })



// Datos de sesión y endpoint protegido de admin.
const { user } = useUserSession()

// Consulta principal para pintar el dashboard.
const { data: galaxias, pending, error, refresh } = useFetch<Galaxia[]>('/api/galaxia/get', {
    default: () => []
})

// KPIs del panel.
const totalGalaxias = computed(() => galaxias.value?.length ?? 0)


// Muestra solo las últimas 5 entradas (de más reciente a más antigua).
const ultimasGalaxias = computed(() => (galaxias.value ?? []))
</script>

<template>
    <!-- Contenedor principal de la home de administración -->
    <main class="admin-home">
        <!-- Cabecera con descripción y acciones rápidas -->
        <section class="hero">
            <div class="hero-actions">
                <h1>Tus galaxias</h1>
                <UButton as-child>
                    <NuxtLink to="/galaxia/NewGalaxia">Nueva galaxia</NuxtLink>
                </UButton>
            </div>
        </section>
        <!-- Tabla con últimas galaxias y estados de carga -->
        <UCard class="content-card">
            <div class="content-header">
                <h2>Galaxias</h2>
                <p class="total-count" aria-label="Total de galaxias">{{ totalGalaxias }}</p>
                <UButton color="neutral" variant="outline" size="sm" @click="refresh()">Actualizar</UButton>
            </div>

            <p v-if="pending" class="status">Cargando datos...</p>
            <p v-else-if="error" class="status error">No se pudieron cargar las galaxias.</p>
            <p v-else-if="!ultimasGalaxias.length" class="status">Aún no hay galaxias registradas.</p>

            <div v-else class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Tipo</th>
                            <th>Planetas</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="galaxia in ultimasGalaxias" :key="galaxia.id">
                            <td>
                                <UButton @click="navigateTo(`/galaxia/detalle/${galaxia.id}`)">
                                    {{ galaxia.nombre || 'Sin nombre' }}
                                </UButton>
                            </td>
                            <td>{{ galaxia.tipo || 'Sin tipo' }}</td>
                            <td>  
                                <UButton @click=" navigateTo(`/planetas/listado/${galaxia.id}`)">
                                    Ver planetas({{ galaxia.num_planetas_count ?? 0 }})
                                </UButton></td>
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
    display: grid;
    gap: 1rem;
}


.hero h1 {
    margin: 0;
    color: #1e293b;
    font-size: 1.8rem;
    line-height: 1.2;
}

.hero-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
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
    margin-bottom: 1rem;
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
        font-size: 1.5rem;
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