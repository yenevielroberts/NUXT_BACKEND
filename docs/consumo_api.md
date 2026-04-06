# Consumir la API desde Web y desde un APK (Android)

Este documento resume los pasos y ejemplos para que la API de este repo pueda ser consumida por:
- Aplicaciones web (Quasar / Nuxt)
- Aplicaciones Android (APK) usando cliente nativo (Retrofit/OkHttp) o WebView/Capacitor

Resumen rápido del repositorio
- El middleware CORS está en `server/middleware/cors.ts` y usa la variable `CORS_ORIGIN` y `ALLOW_ALL_CORS`.
- La configuración del servidor (host públicamente accesible en desarrollo) está en `nuxt.config.ts` (devServer host: `0.0.0.0`).

Variables de entorno recomendadas
- `CORS_ORIGIN`: lista separada por comas de orígenes permitidos. Ejemplo:

  CORS_ORIGIN=https://miweb.com,capacitor://localhost

- `API_BASE` (o `NUXT_PUBLIC_API_BASE`): URL pública de la API que usarán frontends y apps móviles.

  API_BASE=https://api.mi-dominio.com

- `ALLOW_ALL_CORS`: `true` sólo en desarrollo; en producción dejar `false` o eliminar.

Backend / CORS
- El middleware en `server/middleware/cors.ts` ya hace:
  - Lee `CORS_ORIGIN` y permite `capacitor://localhost` si está configurado.
  - Devuelve `Access-Control-Allow-*` y soporta credenciales (`Access-Control-Allow-Credentials: true`).

- Recomendación:
  - En producción usar HTTPS y configurar `CORS_ORIGIN` sólo con los orígenes necesarios.
  - Mantener `ALLOW_ALL_CORS=true` solo para depuración local.

Web (Quasar / Nuxt)
- Usar la `apiBase` pública que expone `nuxt.config.ts` desde runtime config:

```js
const config = useRuntimeConfig()
const base = config.public.apiBase
// usando $fetch
const data = await $fetch('/api/galaxias', { baseURL: base })
// o con axios
import axios from 'axios'
const api = axios.create({ baseURL: base, withCredentials: true })
```

- Asegúrate de que el cliente web envíe el `Origin` (los navegadores lo hacen automáticamente). Si usas cookies, usa `withCredentials: true` y que el servidor permita credenciales.

Android (APK)
- Enfoques:
  1) Cliente nativo (Retrofit/OkHttp): NO requiere CORS (las restricciones CORS aplican a navegadores). Solo se necesita `INTERNET` y una URL accesible.
  2) WebView o Capacitor: el WebView se comporta como navegador -> CORS sí aplica. Asegúrate de incluir `capacitor://localhost` o el origen correcto en `CORS_ORIGIN`.

- Permisos Android (añadir en `AndroidManifest.xml`):

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

- Network security (solo para debug/local si necesitas HTTP o certificados auto-firmados): crea `res/xml/network_security_config.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
  <domain-config cleartextTrafficPermitted="true">
    <!-- Emulador Android accede al host de la máquina en 10.0.2.2 -->
    <domain includeSubdomains="true">10.0.2.2</domain>
  </domain-config>
  <base-config>
    <trust-anchors>
      <certificates src="system" />
      <certificates src="user" />
    </trust-anchors>
  </base-config>
</network-security-config>
```

- Vincular en el `application` del `AndroidManifest.xml` (solo para debug si usas cleartext):

```xml
<application
  android:networkSecurityConfig="@xml/network_security_config"
  ...>
```

- Ejemplo de cliente Retrofit (Kotlin):

```kotlin
val client = OkHttpClient.Builder()
  .addInterceptor { chain ->
    val req = chain.request().newBuilder()
      .addHeader("Authorization", "Bearer ${token}")
      .build()
    chain.proceed(req)
  }
  .build()

val retrofit = Retrofit.Builder()
  .baseUrl("https://api.mi-dominio.com/")
  .client(client)
  .addConverterFactory(GsonConverterFactory.create())
  .build()

interface ApiService {
  @GET("api/galaxia")
  suspend fun getGalaxias(): List<Galaxia>
}
```

Debug / pruebas
- Probar preflight CORS con `curl`:

```bash
curl -i -X OPTIONS https://api.mi-dominio.com/api/galaxia \
  -H "Origin: https://miweb.com" \
  -H "Access-Control-Request-Method: GET"
```

- Probar GET con Origin header:

```bash
curl -v -H "Origin: https://miweb.com" https://api.mi-dominio.com/api/galaxia
```

Notas de producción
- Siempre usar HTTPS con certificados válidos (Let's Encrypt u otro proveedor).
- Revisar y quitar `ALLOW_ALL_CORS=true` en producción.
- Si usas cookies para sesión, asegúrate de `SameSite=None; Secure` y `Access-Control-Allow-Credentials: true`.

Archivos clave en este repo
- `server/middleware/cors.ts` — manejo de CORS
- `nuxt.config.ts` — `devServer.host` y `runtimeConfig.public.apiBase` (se agregó `apiBase`)
- `.env` — variables `CORS_ORIGIN`, `API_BASE`, `ALLOW_ALL_CORS`

Si quieres, aplico ejemplos concretos para tu proyecto Android (Retrofit + build.gradle) o creo un pequeño script de prueba con `curl` y `ngrok` para exponer localhost y probar desde el APK.
