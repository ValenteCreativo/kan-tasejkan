# Kan-Tasejkan — Lugar de Sombras

Sitio web para el Centro Ecoturístico Indígena **Kan-Tasejkan**, ubicado en la Sierra de Zongolica, Veracruz, México.

## Sobre el proyecto

Kan-Tasejkan ("Lugar de Sombras" en náhuatl) es un espacio ecoturístico comunitario que ofrece hospedaje en cabañas, restaurante con gastronomía regional, deportes de aventura, balneario, camping, talleres culturales y experiencias turísticas comunitarias.

Este sitio está diseñado para ser una vitrina visual del lugar — orientado a mostrar fotos y videos como activo principal.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Estilos:** Tailwind CSS 4
- **Animaciones:** Framer Motion
- **Base de datos:** Turso (SQLite en la nube) + Drizzle ORM
- **Storage:** Vercel Blob (fotos y videos)
- **Deploy:** Vercel

## Estructura del sitio

| Ruta | Contenido |
|------|-----------|
| `/` | Landing con logo + menú orbital (5 opciones) |
| `/quienes-somos` | Historia, misión, equipo |
| `/servicios` | Hospedaje, restaurante, aventura, balneario, camping (tabs) |
| `/talleres` | 6 talleres culturales (tabs) |
| `/experiencias` | Gastronómica, rituales, bodas tradicionales (tabs) |
| `/premios` | Premios y certificaciones |
| `/contacto` | Formulario, WhatsApp, mapa |
| `/admin` | Panel CMS para subir fotos/videos |

## Admin / CMS

El panel de administración (`/admin`) está diseñado mobile-first para que el cliente pueda subir fotos y videos directamente desde su teléfono:

1. Ir a `/login`
2. Ingresar con las credenciales de admin
3. Seleccionar la sección (Hospedaje, Restaurante, etc.)
4. Subir fotos/videos

Las fotos se organizan por sección y se muestran automáticamente en las páginas correspondientes.

## Desarrollo local

```bash
cd kan-tasejkan
npm install
npm run dev
```

## Variables de entorno

```env
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...
NEXT_PUBLIC_ADMIN_EMAIL=...
ADMIN_DEFAULT_PASSWORD=...
SESSION_SECRET=...
NEXT_PUBLIC_WHATSAPP_NUMBER=...
BLOB_READ_WRITE_TOKEN=...
```

## Base de datos

```bash
# Pushear schema a Turso
npx drizzle-kit push

# Generar migraciones
npx drizzle-kit generate

# Abrir studio
npx drizzle-kit studio
```

## Deploy

El proyecto está preparado para deploy en Vercel. Conectar el repo y agregar las variables de entorno.

---

Desarrollado con 🌿 para la comunidad indígena de Kan-Tasejkan.
