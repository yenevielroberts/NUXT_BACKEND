# Aplicación de Gestión de Galaxias y Planetas - Nuxt + Auth GitHub

Una aplicación web construida con **Nuxt** que permite gestionar galaxias y planetas con autenticación mediante GitHub. Incluye un sistema de API backend, base de datos con Drizzle ORM y panel de administración.

## Requisitos Previos

- **Node.js** versión 18 o superior
- **npm**

## Instalación de Dependencias

Instala las dependencias del proyecto usando uno de los siguientes comandos:

```bash
npm install

```

### Dependencias Principales

- **nuxt**: ^3.x - Marco de trabajo basado en Vue 3
- **vue**: ^3.x - Framework progresivo para interfaces de usuario
- **drizzle-orm**: ORM para gestionar la base de datos
- **@nuxt/ui**: ^3.0.2 - Componentes UI preconstruidos para Nuxt
- **h3**: Servidor HTTP de alto rendimiento

### Dependencias de Desarrollo

- **drizzle-kit**: Herramientas de migración y gestión de esquemas para Drizzle
- **typescript**: Soporte para tipado estático

## Ejecución del Proyecto

### Servidor de Desarrollo

Para iniciar el servidor de desarrollo en `http://localhost:3000`:

```bash
npm run dev

```

### Compilación para Producción

Para compilar la aplicación para producción:

```bash
npm run build

```

## Estructura del Proyecto

```

├── app/                              # Código de la aplicación frontend
│   ├── app.vue                       # Componente raíz de la aplicación
│   ├── components/
│   ├── middleware/                 # Middleware de autenticación
│   └── pages/                         # Páginas de la aplicación
│
├── server/                           # Código del backend/servidor
│   ├── routes/
│   │   └── auth/                     # Rutas de autenticación
│   ├── api/                          # Rutas API
│   ├── db/                           # Configuración de la base de datos          
│   └── auth.d.ts                     # Definiciones de tipos para autenticación

```

## Configuración Clave

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto (usa `ejemplo.env` como referencia) con las siguientes variables:

```env
NUXT_SESSION_PASSWORD= obtener del repositiorio de Nuxt  
# Esta info se obtiene creando una Ouths app en github
NUXT_OAUTH_GITHUB_CLIENT_ID=
NUXT_OAUTH_GITHUB_CLIENT_SECRET=
```

### Base de Datos con Drizzle

#### Crear/Actualizar Esquema

```bash
# Generar migraciones
npx drizzle-kit generate:sqlite

# Aplicar migraciones a la base de datos
npx drizzle-kit push
```

#### Interfaz Gráfica de la Base de Datos

Para visualizar y gestionar los datos en la base de datos:

```bash
npx drizzle-kit studio
```

## Funcionalidades Principales

- ✅ **Autenticación con GitHub**: Login/Registro seguro mediante OAuth
- ✅ **Panel de Administración**: Página protegida solo para usuarios autenticados
- ✅ **Gestión de Galaxias**: CRUD completo (Crear, Leer, Actualizar, Eliminar)
- ✅ **Gestión de Planetas**: CRUD completo con asociación a galaxias
- ✅ **API REST**: Endpoints para todas las operaciones
- ✅ **Middleware de Autenticación**: Protección de rutas privadas
- ✅ **UI Moderna**: Componentes con Nuxt UI

## Algunas de las rutas Disponibles

| Ruta | Descripción |
|------|-------------|
| `/` | Página de inicio |
| `/login` | Login con GitHub |
| `/register` | Página de registro |
| `/admin` | Panel de administración (protegido) |
| `/galaxia/listado` | Listado de galaxias |
| `/galaxia/NewGalaxia` | Crear nueva galaxia |
| `/planetas/listado/:id` | Listado de planetas de una galaxia |
| `/planetas/NewPlaneta` | Crear nuevo planeta |



