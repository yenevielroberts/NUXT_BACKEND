Consumo de la API (Nuxt) desde un proyecto Quasar

1) Configuración clave en Nuxt
- Asegúrate de poner el origen del frontend Quasar en la variable de entorno `CORS_ORIGIN` (p.ej. `http://localhost:8080`).
- En desarrollo hemos añadido `server/middleware/cors.ts` que usa `CORS_ORIGIN` (puede ser una lista separada por comas) y responde a preflights.

2) Recomendación para Quasar (cliente)

- Usando Axios (recomendado si necesitas cookies/credenciales):

```js
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.API_BASE_URL || 'http://localhost:3000/api',
  withCredentials: true // IMPORTANTE para cookies/session
})

export default api
```

Ejemplo de login:

```js
await api.post('/auth/login', { email, password })
```

- Usando fetch nativo (con credenciales):

```js
await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  credentials: 'include', // importante
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
})
```

3) Notas sobre cookies y credenciales
- Si la API devuelve cookies de sesión, el servidor debe responder `Access-Control-Allow-Credentials: true` y `Access-Control-Allow-Origin` debe ser el origen exacto (no `*`). El middleware implementado hace esto usando `CORS_ORIGIN`.

4) Modo de producción
- Ajusta `CORS_ORIGIN` a la URL real de tu frontend (p.ej. `https://misitio.com`). Puedes pasar varias orígenes separados por comas si necesitas más de uno.

5) Buenas prácticas
- Usa `withCredentials: true` en Axios o `credentials:'include'` en fetch si trabajas con cookies.
- Si usas tokens Bearer, envía el token en `Authorization: Bearer <token>` header y no necesitas `Allow-Credentials`.
