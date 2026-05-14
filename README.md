# EUREKA · Tutor de Ciencias Exactas asistido por IA

Tutor interactivo de Física, Química, Fisicoquímica, Qca. del Carbono, Biofísica y Cursos de Ingreso universitario. Funciona como una Single Page Application (SPA) estática hospedada en GitHub Pages, con autenticación Firebase, cuota diaria en Firestore y un Cloudflare Worker como proxy seguro hacia la API de Groq.

---

## 🏺 Origen y Significado: ¡EUREKA!

El nombre EUREKA es una declaración de principios que evoca el clímax del entendimiento, haciendo referencia al concepto de "Knowledge Activo".

### La Leyenda de Arquímedes

La exclamación proviene del griego antiguo (εὕρηκα, héurēka), que significa "¡Lo he encontrado!" Según la leyenda, fue pronunciada por Arquímedes cuando descubrió el principio de flotación mientras se sumergía en una bañera.

### El Acrónimo E.U.R.E.K.A.

**Entorno de Unificación Racional Estimulando Knowledge Activo**

| Letra | Concepto | Explicación pedagógica |
|---|---|---|
| **E** | Entorno | No es una IA a la que se "consulta", es un espacio digital donde el estudiante explora conceptos |
| **U** | Unificación | Conecta la teoría abstracta (fórmulas) con los fenómenos del mundo real, unificando lo lógico con lo físico |
| **R** | Racional | Asegura que la explicación no solo es correcta, sino lógicamente consistente |
| **E** | Estimulando | Provee feedback constructivo para incentivar al estudiante a seguir explorando |
| **K** | Knowledge | Se enfoca en el conocimiento aplicado y profundo, en oposición a la memorización pasiva |
| **A** | Activo | El estudiante aplica, experimenta y construye activamente su comprensión |

> **Eslogan:** *"EUREKA: De la confusión, nace tu fórmula."*

---

## Arquitectura actual

```
Navegador (GitHub Pages)
    │
    ├── Firebase Auth      → Login con Google o email/contraseña
    ├── Firestore          → Cuota diaria + log de consultas + mensajes + config admins
    └── Cloudflare Worker  → Proxy CORS hacia Groq (oculta la API key)
                                └── Groq API (llama-3.3-70b-versatile, streaming SSE)
```

### Nota sobre la arquitectura original (RAG)

El proyecto inició como un sistema RAG (Retrieval-Augmented Generation) que indexaba PDFs del Serway con embeddings locales (Ollama + ChromaDB) y consultaba el modelo via FastAPI. Esa arquitectura está documentada pero **no está activa en el portal público actual**, que usa directamente la API de Groq sin base de conocimiento vectorial. La migración a RAG en producción es un objetivo futuro.

---

## Tecnologías y servicios

| Capa | Tecnología | Notas |
|---|---|---|
| Frontend | HTML5 + CSS3 + JS vanilla | Single file `index.html` |
| Tipografía | Google Fonts (DM Serif Display + DM Sans + Space Mono) | CDN, sin build step |
| Markdown | marked.js (CDN) | Render de respuestas |
| Fórmulas | KaTeX (CDN) | LaTeX inline `$...$` y bloque `$$...$$` |
| Auth | Firebase Authentication v10 | Google OAuth + Email/Contraseña |
| Base de datos | Cloud Firestore | Cuota diaria + log + mensajes alumno-profe + config admins |
| Hosting frontend | GitHub Pages | Rama `main`, archivo `index.html` en raíz |
| Proxy API | Cloudflare Workers (free tier) | Oculta `GROQ_API_KEY`, maneja CORS y streaming |
| Modelo IA | Groq · `llama-3.3-70b-versatile` | Streaming SSE, max_tokens variable por materia |

---

## Estructura del repositorio

```
eureka/
├── index.html       ← App completa (subir a GitHub Pages)
├── worker.js        ← Cloudflare Worker (NO se sube a GitHub)
├── .gitignore
└── README.md
```

> **`worker.js` NO se sube al repositorio público.** Guardarlo solo localmente como referencia.

---

## Configuración paso a paso

### 1. Firebase

#### 1a. Crear proyecto
1. Ir a [console.firebase.google.com](https://console.firebase.google.com)
2. **Add project** → nombre `eureka-tutor` → continuar
3. Desactivar Google Analytics si no se necesita → **Create project**

#### 1b. Autenticación
1. Build → **Authentication** → Get started
2. **Sign-in method** → habilitar **Google** y **Email/Password**
3. Pestaña **Settings** → **Authorized domains** → agregar `lemeit.github.io`

#### 1c. Firestore — Reglas

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    match /queries/{docId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null &&
        request.auth.token.email in get(/databases/$(database)/documents/config/admins).data.emails;
    }
    match /messages/{docId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && (
        resource.data.uid == request.auth.uid ||
        request.auth.token.email in get(/databases/$(database)/documents/config/admins).data.emails
      );
      allow update: if request.auth != null &&
        request.auth.token.email in get(/databases/$(database)/documents/config/admins).data.emails;
    }
    match /config/{docId} {
      allow read: if request.auth != null;
      allow write: if false;
    }
  }
}
```

#### 1d. Firestore — Colección `config/admins`

Crear manualmente en la consola de Firestore:
- Colección: `config`
- Documento ID: `admins`
- Campo: `emails` (tipo **array**)
- Elemento `0`: tu email de admin

Esto reemplaza el email hardcodeado en el código — el portal lo lee dinámicamente.

#### 1e. Índices compuestos requeridos

En Firestore → **Índices** → crear:

| Colección | Campo 1 | Campo 2 | Scope |
|---|---|---|---|
| `messages` | `uid` ↑ | `timestamp` ↓ | Collection |

#### 1f. Obtener credenciales
Project Overview → ⚙ **Project settings** → **General** → **Your apps** → copiar `firebaseConfig`.

---

### 2. Groq

1. Crear cuenta en [console.groq.com](https://console.groq.com)
2. **API Keys** → **Create API Key** → copiar (solo se muestra una vez, formato `gsk_...`)
3. **No pegar en ningún archivo del repo.** Configurar como secreto en Cloudflare (paso 3).

Límites del free tier de Groq:
- 14.400 tokens/minuto
- 500 requests/día
- 1.000.000 tokens/día

---

### 3. Cloudflare Workers

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create Worker**
2. Pegar el contenido de `worker.js` → **Deploy**
3. Pestaña **Settings** → **Variables and Secrets** → agregar secreto:
   - Nombre: `GROQ_API_KEY`
   - Valor: tu API key de Groq
4. URL del Worker: `https://nombre.subdominio.workers.dev` → actualizar `WORKER_URL` en `index.html`

---

### 4. GitHub Pages

1. Crear repositorio público (ej. `lemeit/eureka`)
2. Subir `index.html` y `README.md`
3. **Settings** → **Pages** → rama `main` → carpeta `/root`
4. URL resultante: `https://lemeit.github.io/eureka/`
5. Agregar ese dominio en Firebase Auth → Authorized domains

---

## Variables en `index.html`

| Constante | Descripción | Valor actual |
|---|---|---|
| `WORKER_URL` | URL del Cloudflare Worker | `https://eureka-proxy.fisicai-eureka-01.workers.dev` |
| `MAX_QUERIES` | Consultas de texto por usuario por día | `5` |
| `MAX_UPLOADS` | Archivos subidos por usuario por día | `1` |
| `ADMIN_EMAILS` | Array cargado dinámicamente desde `config/admins` en Firestore | — |

> El email de admin ya **no está hardcodeado** en el código. Se gestiona desde Firestore en `config/admins.emails`.

---

## Panel de administración

Accesible solo para emails listados en `config/admins`. Muestra:
- Consultas y tokens del día vs. total
- Usuarios únicos
- Uso por materia (con barras)
- Top 10 usuarios
- Log de las últimas 50 consultas
- Panel de mensajes de alumnos con respuesta inline

Para acceder: iniciar sesión con el email admin → menú de usuario → **⚙ Panel Admin**.

---

## Sistema de mensajería alumno ↔ profe

- El alumno puede enviar mensajes al profe desde el chat (panel verde)
- El profe responde desde el Panel Admin → sección "Mensajes de alumnos"
- Cuando hay respuesta no leída, aparece un **badge rojo** en el ícono de mensajes del header
- Al hacer clic en el ícono, se abre el historial de mensajes directamente

---

## Materias y system prompts

| Materia | max_tokens | Foco |
|---|---|---|
| Física | 1024 | Cinemática, dinámica, termodinámica, ondas — secundario y universitario |
| Química | 1024 | Estequiometría, nomenclatura IUPAC, reacciones — secundario y CBC |
| Fisicoquímica | 1024 | Termodinámica, cinética, equilibrio |
| Qca. del Carbono | 2048 | Química orgánica, grupos funcionales, nomenclatura IUPAC orgánica |
| Biofísica | 1536 | Física aplicada a sistemas biológicos |
| Curso de ingreso | 1024 | CBC UBA, UBA XXI, UTN, UNLP, UNICEN |

Todas las materias usan el **estilo socrático obligatorio**:
1. Concepto clave en 2-3 oraciones
2. Desarrollo paso a paso numerado
3. Una pregunta socrática al final para verificar comprensión

---

## Flujo de una consulta

```
1. Usuario escribe pregunta y presiona Enter
2. index.html verifica cuota en Firestore (users/{uid})
3. Si hay cuota: incrementa contador y hace POST al Worker
4. Worker recibe { question, system, max_tokens } y llama a Groq con stream:true
5. Groq devuelve tokens SSE → Worker los pasa al navegador
6. index.html lee el ReadableStream y renderiza token a token (marked.js)
7. Al finalizar: aplica KaTeX para fórmulas, loguea en Firestore (queries/)
```

---

## Límites y control de costos

- La cuota (`MAX_QUERIES`, `MAX_UPLOADS`) se guarda en Firestore por UID + fecha → aplica desde cualquier dispositivo
- `max_tokens` varía por materia (ver tabla arriba) para balancear calidad vs. consumo
- Groq devuelve HTTP 429 si se superan los límites del free tier → el portal muestra mensaje amigable al usuario
- El panel admin permite monitorear el consumo sin entrar a la consola de Groq

---

## Qué subir a GitHub y qué no

| Archivo | ¿Subir? | Razón |
|---|---|---|
| `index.html` | ✅ Sí | Es la app pública |
| `README.md` | ✅ Sí | Documentación |
| `.gitignore` | ✅ Sí | Buenas prácticas |
| `worker.js` | ❌ No | Código del proxy; guardar solo local |
| `flyer_*.html` | ❌ No | Archivos de diseño/impresión |
| `.env` / secretos | ❌ Nunca | Las API keys van solo en Cloudflare |
