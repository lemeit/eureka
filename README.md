# EUREKA · Tutor de Ciencias Exactas asistido por IA

Tutor interactivo de Física, Química, Fisicoquímica, Qca. del Carbono, Biofísica y Cursos de Ingreso universitario. Funciona como una Single Page Application (SPA) estática hospedada en GitHub Pages, con autenticación Firebase, cuota diaria en Firestore y un Cloudflare Worker como proxy seguro hacia la API de Groq.

---

## Arquitectura

```
Navegador (GitHub Pages)
    │
    ├── Firebase Auth      → Login con Google o email/contraseña
    ├── Firestore          → Cuota diaria por usuario + log de consultas
    └── Cloudflare Worker  → Proxy CORS hacia Groq (oculta la API key)
                                └── Groq API (llama-3.3-70b-versatile, streaming)
```

## Tecnologías y servicios

| Capa | Tecnología | Notas |
|---|---|---|
| Frontend | HTML5 + CSS3 + JS vanilla | Single file `index.html` |
| Tipografía | Google Fonts (Space Mono + DM Sans) | CDN, sin build step |
| Markdown | marked.js (CDN) | Render de respuestas |
| Fórmulas | KaTeX (CDN) | LaTeX inline `$...$` y bloque `$$...$$` |
| Auth | Firebase Authentication v10 | Google OAuth + Email/Contraseña |
| Base de datos | Cloud Firestore | Cuota diaria + log de consultas admin |
| Hosting frontend | GitHub Pages | Rama `main`, archivo `index.html` en raíz |
| Proxy API | Cloudflare Workers (free tier) | Oculta `GROQ_API_KEY`, maneja CORS y streaming |
| Modelo IA | Groq · `llama-3.3-70b-versatile` | Streaming SSE, max 1024 tokens/respuesta |

---

## Estructura del repositorio

```
eureka/
├── index.html       ← App completa (subir a GitHub Pages)
├── worker.js        ← Cloudflare Worker (NO se sube a GitHub, se pega en Cloudflare)
├── .gitignore
└── README.md
```

> **`worker.js` NO se sube al repositorio público** porque aunque no contiene la API key (está en variables de entorno de Cloudflare), exponer el código del Worker es innecesario. Guardalo localmente como referencia.

---

## Configuración paso a paso

### 1. Firebase

#### 1a. Crear proyecto
1. Ir a [console.firebase.google.com](https://console.firebase.google.com)
2. **Add project** → nombre `eureka-tutor` → continuar
3. Desactivar Google Analytics si no se necesita → **Create project**

#### 1b. Autenticación
1. Build → **Authentication** → Get started
2. **Sign-in method** → habilitar:
   - **Google** → activar → guardar
   - **Email/Password** → activar → guardar
3. Pestaña **Settings** → **Authorized domains** → **Add domain** → `lemeit.github.io`

#### 1c. Firestore
1. Build → **Firestore Database** → **Create database**
2. Elegir región (ej. `us-east1`) → modo **Production**
3. Ir a pestaña **Rules** y reemplazar con:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /queries/{docId} {
      allow create: if request.auth != null;
      allow read, list: if request.auth != null
        && request.auth.token.email == "TU_EMAIL_ADMIN@gmail.com";
    }
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    match /messages/{docId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null &&
        (resource.data.uid == request.auth.uid ||
         request.auth.token.email == "TU_EMAIL_ADMIN@gmail.com");
      allow update: if request.auth != null &&
        request.auth.token.email == "TU_EMAIL_ADMIN@gmail.com";
    }
  }
}
```

Reemplazar `TU_EMAIL_ADMIN@gmail.com` con tu correo real. **Publicar**.

#### 1d. Obtener credenciales
1. Project Overview → ⚙ **Project settings** → pestaña **General**
2. Bajar a **Your apps** → **Add app** → Web (`</>`)
3. Nombre: `eureka-web` → registrar (sin Firebase Hosting)
4. Copiar el objeto `firebaseConfig` — ya está integrado en `index.html`; si recreás el proyecto, actualizarlo allí.

---

### 2. Groq

1. Crear cuenta en [console.groq.com](https://console.groq.com)
2. **API Keys** → **Create API Key** → copiar (solo se muestra una vez)
3. La key tiene el formato `gsk_...`
4. **No pegar en ningún archivo del repo.** Se configura como variable de entorno en Cloudflare (paso 3).
5. El modelo en uso es `llama-3.3-70b-versatile`. Para ver modelos disponibles: [console.groq.com/docs/models](https://console.groq.com/docs/models)

Límites del free tier de Groq (mayo 2025):
- 14.400 tokens/minuto
- 500 requests/día
- 1.000.000 tokens/día

---

### 3. Cloudflare Workers

#### 3a. Crear el Worker
1. Ir a [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages**
2. **Create** → **Create Worker**
3. Nombre: `eureka-proxy` (o el que prefieras)
4. **Deploy** → luego **Edit code**
5. Borrar el código de ejemplo y pegar el contenido completo de `worker.js`
6. **Deploy**

#### 3b. Configurar la API key como secreto
1. En el Worker → pestaña **Settings** → **Variables and Secrets**
2. **Add variable** → tipo **Secret**:
   - Variable name: `GROQ_API_KEY`
   - Value: tu API key de Groq (`gsk_...`)
3. **Save**

#### 3c. Obtener la URL del Worker
- Está en la parte superior del Worker: `https://eureka-proxy.TU-SUBDOMINIO.workers.dev`
- Actualizar la constante `WORKER_URL` en `index.html` si es diferente a la actual

#### 3d. Verificar CORS
El Worker ya incluye los headers CORS necesarios. Para testearlo desde la consola del navegador:

```javascript
fetch("https://eureka-proxy.TU-SUBDOMINIO.workers.dev", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ question: "¿Qué es la velocidad?" })
}).then(r => r.text()).then(console.log)
```

Debería devolver un stream de eventos SSE (`data: {...}`).

---

### 4. GitHub Pages

1. Crear repositorio público en GitHub (ej. `lemeit/eureka`)
2. Subir únicamente `index.html` y `README.md` (y `.gitignore`)
3. **Settings** → **Pages** → Source: **Deploy from a branch** → rama `main` → carpeta `/root`
4. La URL será `https://lemeit.github.io/eureka/`
5. Verificar que ese dominio esté en **Firebase Auth → Authorized domains**

---

## Variables que pueden necesitar actualización

Todas están en `index.html` como constantes JS al inicio del `<script>`:

| Constante | Descripción | Valor actual |
|---|---|---|
| `WORKER_URL` | URL del Cloudflare Worker | `https://eureka-proxy.fisicai-eureka-01.workers.dev` |
| `MAX_QUERIES` | Consultas de texto por usuario por día | `3` |
| `MAX_UPLOADS` | Archivos subidos por usuario por día | `1` |
| `ADMIN_EMAIL` | Email con acceso al panel admin | `user@gmail.com` |

---

## Panel de administración

Accesible solo con el email definido en `ADMIN_EMAIL`. Muestra:
- Consultas y tokens del día vs. total
- Usuarios únicos
- Uso por materia (con barras)
- Top 10 usuarios
- Log de las últimas 50 consultas con hora, materia, texto y tokens

Para acceder: iniciar sesión con el email admin → menú de usuario (foto) → **⚙ Panel Admin**.

---

## Límites y control de costos

- El límite de consultas (`MAX_QUERIES`) y subidas (`MAX_UPLOADS`) se guarda en Firestore por UID + fecha, por lo que aplica desde cualquier dispositivo.
- El Worker tiene `max_tokens: 1024` para limitar el largo de cada respuesta.
- Groq tiene rate limiting propio; si se superan los límites del free tier, devuelve HTTP 429.
- El panel admin permite monitorear el consumo sin necesidad de entrar a la consola de Groq.

---

## Qué subir a GitHub y qué no

| Archivo | ¿Subir? | Razón |
|---|---|---|
| `index.html` | ✅ Sí | Es la app pública |
| `README.md` | ✅ Sí | Documentación |
| `.gitignore` | ✅ Sí | Buenas prácticas |
| `worker.js` | ❌ No | Código del proxy; guardarlo solo local |
| `flyer_*.html` | ❌ No | Archivos de diseño/impresión, no son parte de la app |
| `.env` / secretos | ❌ Nunca | Las API keys van solo en Cloudflare como secrets |

---

## Flujo de una consulta

```
1. Usuario escribe pregunta y presiona Enter
2. index.html verifica cuota en Firestore (users/{uid})
3. Si hay cuota: incrementa contador y hace POST al Worker
4. Worker recibe { question, system } y llama a Groq con stream:true
5. Groq devuelve tokens SSE → Worker los pasa al navegador
6. index.html lee el ReadableStream y va renderizando token a token
7. Al finalizar: aplica KaTeX para fórmulas, loguea en Firestore (queries/)
```

---

## Materias y system prompts

Cada materia envía un system prompt específico a Groq:

| Materia | Foco del prompt |
|---|---|
| Física | Cinemática, dinámica, termodinámica, ondas — nivel secundario y universitario |
| Química | Estequiometría, nomenclatura IUPAC, reacciones — nivel secundario y CBC |
| Fisicoquímica | Termodinámica, cinética, equilibrio — integración física+química |
| Qca. del Carbono | Química orgánica, grupos funcionales, nomenclatura IUPAC orgánica |
| Biofísica | Física aplicada a sistemas biológicos |
| Curso de ingreso | Temas típicos de CBC UBA, UBA XXI, UTN, UNLP, UNICEN |

