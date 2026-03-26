<script setup lang="ts">
const { loggedIn, user, session, fetch, clear, openInPopup } = useUserSession();

// Rutas de navegación
const navLinks = [
    { label: 'Panel', to: '/admin', icon: '📊' },
    { label: 'Galaxias', to: '/galaxia/listado', icon: '🌌' },
    { label: 'Planetas', to: '/planetas/listado', icon: '🪐' }
];

function handleLogout() {
    clear();
    navigateTo('/login');
}
</script>
<template>
    <nav class="navbar" role="navigation" aria-label="Navegación principal">
        <div class="navbar-container">
            <!-- Logo/Home -->
            <NuxtLink to="/" class="navbar-brand" aria-label="Ir a inicio">
                <span class="brand-icon">🚀</span>
                <span class="brand-text">Space Explorer</span>
            </NuxtLink>

            <ul class="nav-menu" v-if="loggedIn">
                <li v-for="link in navLinks" :key="link.to">
                    <NuxtLink
                        :to="link.to"
                        class="nav-link"
                        active-class="active"
                        :aria-label="`Ir a ${link.label}`"
                    >
                        <span class="nav-icon">{{ link.icon }}</span>
                        <span class="nav-label">{{ link.label }}</span>
                    </NuxtLink>
                </li>
            </ul>

            <!-- Sección de usuario -->
            <div class="navbar-right">
                <div v-if="loggedIn" class="user-section">
                    <span class="user-name" :title="`Usuario: ${user?.login}`">
                        👤 {{ user?.login || 'Usuario' }}
                    </span>
                    <button
                        class="btn-logout"
                        @click="handleLogout()"
                        aria-label="Cerrar sesión"
                    >
                        Logout
                    </button>
                </div>
                <div v-else>
                    <NuxtLink to="/login" class="btn-login">
                        Iniciar sesión
                    </NuxtLink>
                </div>
            </div>
        </div>
    </nav>
</template>

<style scoped>

/* Navbar principal */
.navbar {
    background: #ffffff;
    border-bottom: 2px solid #7c3aed;
    box-shadow: 0 2px 8px rgba(124, 58, 237, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
}

.navbar-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0.75rem 1.25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
}

/* Logo/Brand */
.navbar-brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    font-weight: 700;
    color: #1e293b;
    font-size: 1.25rem;
    transition: color 0.2s ease-in-out;
    min-height: 44px;
    min-width: 44px;
}

.navbar-brand:hover {
    color: #7c3aed;
}

.navbar-brand:focus-visible {
    outline: 3px solid #7c3aed;
    outline-offset: 2px;
    border-radius: 4px;
}

.brand-icon {
    font-size: 1.5rem;
}

.brand-text {
    font-size: 1.1rem;
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: 0.5rem;
    margin: 0;
    padding: 0;
}

.nav-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #475569;
    text-decoration: none;
    padding: 0.75rem 1rem;
    border-radius: 6px;
    font-weight: 500;
    transition: all 0.2s ease-in-out;
    min-height: 44px;
    white-space: nowrap;
}

.nav-link:hover {
    color: #7c3aed;
    background: #f0f9ff;
}

.nav-link:focus-visible {
    outline: 3px solid #7c3aed;
    outline-offset: -2px;
}

.nav-link.active {
    color: #ffffff;
    background: #7c3aed;
}

.nav-link.active:focus-visible {
    outline-color: #3b82f6;
}

.nav-icon {
    font-size: 1.25rem;
    min-width: 1.25rem;
}

.nav-label {
    font-size: 0.95rem;
}

/* Sección derecha (usuario) */
.navbar-right {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-left: auto;
}

.user-section {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.user-name {
    color: #1e293b;
    font-weight: 600;
    font-size: 0.95rem;
    padding: 0.5rem 0.75rem;
    border-radius: 4px;
}

/* Botones de acción */
.btn-login,
.btn-logout {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.625rem 1.25rem;
    border-radius: 6px;
    font-weight: 600;
    font-size: 0.95rem;
    text-decoration: none;
    transition: all 0.2s ease-in-out;
    border: none;
    cursor: pointer;
    min-height: 44px;
    min-width: 44px;
}

.btn-login {
    background: #ffffff;
    color: #7c3aed;
    border: 2px solid #7c3aed;
}

.btn-login:hover {
    background: #f0f9ff;
}

.btn-login:focus-visible {
    outline: 3px solid #7c3aed;
    outline-offset: 2px;
}

.btn-logout {
    background: #7c3aed;
    color: #ffffff;
}

.btn-logout:hover {
    background: #6d28d9;
}

.btn-logout:focus-visible {
    outline: 3px solid #1e293b;
    outline-offset: 2px;
}

.btn-logout:active {
    transform: scale(0.98);
}

/* Modo de alto contraste */
@media (prefers-contrast: more) {
    .navbar {
        border-bottom-width: 3px;
    }

    .nav-link,
    .mobile-nav-link {
        font-weight: 700;
    }

    .user-name {
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

/* Responsive - Tablet y móviles */
@media (max-width: 768px) {
    .navbar-container {
        padding: 0.5rem 1rem;
        gap: 1rem;
    }

    .nav-menu {
        display: none;
    }

    .mobile-menu-btn {
        display: flex;
    }

    .mobile-menu {
        display: block;
    }

    .brand-text {
        display: none;
    }

    .brand-icon {
        font-size: 1.75rem;
    }

    .navbar-brand {
        font-size: 1.5rem;
    }

    .user-name {
        display: none;
    }

    .navbar-right {
        margin-left: 0;
    }

    .btn-login,
    .btn-logout {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
    }
}

@media (max-width: 480px) {
    .navbar-container {
        padding: 0.5rem 0.75rem;
        gap: 0.5rem;
    }

    .btn-logout {
        padding: 0.5rem 0.75rem;
    }

    .mobile-nav-link {
        padding: 0.5rem 0.75rem;
    }
}

</style>
