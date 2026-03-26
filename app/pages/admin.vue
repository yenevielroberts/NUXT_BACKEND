<script setup lang="ts">
// Protege la ruta para usuarios autenticados.
definePageMeta({ middleware: ['auth'] })
    const { data: adminData } = useFetch("/api/admin",{
        lazy: true
    });

// Modelo base que llega desde la API de galaxias.
type Galaxia = {
    id: number
    nombre: string | null
    num_planetas_count: number | null
    curiosidades: string | null
    tipo: string | null
}

// Datos de sesión y endpoint protegido de admin.
const { user } = useUserSession()

// Consulta principal para pintar el dashboard.
const { data: galaxias, pending, error, refresh } = useFetch('/api/galaxia/get', {
    default: () => []
})

// KPIs del panel.
const totalGalaxias = computed(() => galaxias.value?.length ?? 0)
const totalPlanetas = computed(() =>
    (galaxias.value ?? []).reduce((sum, g) => sum + (Number(g.num_planetas_count) || 0), 0)
)


// Muestra solo las últimas 5 entradas (de más reciente a más antigua).
const ultimasGalaxias = computed(() => (galaxias.value ?? []).slice(-5).reverse())
</script>

<template>
    <!-- Contenedor principal de la home de administración -->
    <main class="admin-home">
        <!-- Cabecera con descripción y acciones rápidas -->
        <section class="hero">
            <div>
                <p class="tag">Panel de administración</p>
                <h1>Gestión de galaxias y planetas</h1>
                <p class="subtitle">
                    Controla tu catálogo espacial, añade nuevas galaxias y revisa rápidamente el estado de los datos.
                </p>
            </div>
            <div class="hero-actions">
                <UButton as-child>
                    <NuxtLink to="/galaxia/NewGalaxia">Nueva galaxia</NuxtLink>
                </UButton>
                <UButton color="neutral" variant="subtle" as-child>
                    <NuxtLink to="/galaxia/listado">Ver listado</NuxtLink>
                </UButton>
            </div>
        </section>

        <!-- Resumen de métricas clave -->
        <section class="stats-grid">
            <UCard>
                <p class="stat-label">Galaxias registradas</p>
                <p class="stat-value">{{ totalGalaxias }}</p>
            </UCard>
            <UCard>
                <p class="stat-label">Planetas estimados</p>
                <p class="stat-value">{{ totalPlanetas }}</p>
            </UCard>
        </section>

        <!-- Tabla con últimas galaxias y estados de carga -->
        <UCard class="content-card">
            <div class="content-header">
                <h2>Últimas galaxias añadidas</h2>
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
                                <UButton @click=" navigateTo(`planetas/listado/${galaxia.id}`)">
                                    Ver planetas({{ galaxia.num_planetas_count ?? 0 }})
                                </UButton>  
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </UCard>

        <!-- Información de sesión activa -->
        <p class="session-text">
            Usuario activo: <strong>{{ user?.login || user?.name || 'Sesión iniciada' }}</strong>
            <span v-if="adminData?.sensitive"> · {{ adminData.sensitive }}</span>
        </p>
    </main>
</template>

<style scoped>
/* ESTILOS ACCESIBLES - WCAG 2.1 AA */
/* Contraste mejorado: mínimo 4.5:1 para cumplir con WCAG */

/* Layout general del dashboard */
.admin-home {
    min-height: calc(100vh - 80px);
    max-width: 1100px;
    margin: 0 auto;
    padding: 2rem 1.25rem 3rem;
    display: grid;
    gap: 1.5rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    color: #1e293b;
}

/* Tarjeta principal (hero) */
.hero {
    background: #ffffff;
    border: 2px solid #7c3aed;
    border-radius: 12px;
    padding: 1.75rem;
    display: grid;
    gap: 1.5rem;
    box-shadow: 0 2px 8px rgba(124, 58, 237, 0.1);
}

.tag {
    color: #6d28d9;
    font-size: 0.875rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

h1 {
    color: #1e293b;
    margin: 0;
    font-size: 2rem;
    line-height: 1.2;
    font-weight: 700;
}

.subtitle {
    color: #475569;
    margin-top: 0.5rem;
    font-size: 1rem;
    line-height: 1.5;
}

.hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
}

/* Grid responsivo de métricas */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.stat-label {
    color: #475569;
    margin: 0;
    font-size: 0.875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.stat-value {
    color: #1e293b;
    font-weight: 700;
    font-size: 2.25rem;
    margin: 0.5rem 0 0;
    line-height: 1.2;
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
    margin-bottom: 1.25rem;
    flex-wrap: wrap;
    padding: 0;
}

h2 {
    margin: 0;
    color: #1e293b;
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1.2;
}

.status {
    color: #334155;
    margin: 1rem 0;
    padding: 0.75rem 1rem;
    border-radius: 6px;
    background: #f0f9ff;
    font-size: 1rem;
    line-height: 1.5;
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
    font-size: 1rem;
}

th {
    color: #ffffff;
    font-weight: 700;
    text-align: left;
    padding: 1rem;
    border-bottom: 2px solid #7c3aed;
    background: #7c3aed;
}

td {
    color: #334155;
    padding: 1rem;
    border-bottom: 1px solid #e2e8f0;
}

tbody tr:hover {
    background: #f8faff;
    transition: background-color 0.2s ease-in-out;
}

tbody tr:focus-within {
    background: #f0f9ff;
    outline: 2px solid #3b82f6;
    outline-offset: -2px;
}

.session-text {
    color: #475569;
    font-size: 1rem;
    margin: 2rem 0 0 0;
    padding: 1rem;
    border-top: 1px solid #e2e8f0;
    line-height: 1.5;
}

/* Estilos de accesibilidad para botones y elementos interactivos */
:deep(button),
:deep(a) {
    transition: all 0.2s ease-in-out;
    min-height: 44px;
    min-width: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

:deep(button:focus-visible),
:deep(a:focus-visible) {
    outline: 3px solid #7c3aed;
    outline-offset: 2px;
    border-radius: 4px;
}

:deep(button:hover),
:deep(a:hover) {
    opacity: 0.85;
    transform: translateY(-1px);
}

:deep(button:active),
:deep(a:active) {
    transform: translateY(0);
}

/* Modo de alto contraste */
@media (prefers-contrast: more) {
    .hero {
        border-width: 3px;
    }

    table th {
        border-bottom-width: 3px;
    }

    h1, h2, .stat-value {
        font-weight: 800;
    }

    .tag, .stat-label {
        font-weight: 800;
    }
}

/* Respetar preferencias de movimiento reducido */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}

/* Responsive para dispositivos móviles */
@media (max-width: 640px) {
    .admin-home {
        padding: 1.5rem 1rem 2rem;
        gap: 1.25rem;
    }

    h1 {
        font-size: 1.5rem;
    }

    h2 {
        font-size: 1.25rem;
    }

    .content-header {
        flex-direction: column;
        align-items: stretch;
    }

    .content-header button {
        width: 100%;
    }

    table {
        font-size: 0.875rem;
    }

    th, td {
        padding: 0.75rem 0.5rem;
    }

    .stat-value {
        font-size: 1.75rem;
    }
}
</style>