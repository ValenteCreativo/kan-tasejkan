# Mindfulverso

**Bienestar Universal** — Plataforma web para un centro holístico de bienestar.

## Sobre el proyecto

Mindfulverso es la plataforma digital de Verónica, un centro holístico que ofrece psicoterapia, mindfulness, ceremonias, círculos, retiros, talleres, diplomado y más. El sitio funciona como una experiencia inmersiva donde el logo del proyecto cobra vida como sistema de navegación orbital.

## Stack

- **Framework**: Next.js 16 (App Router)
- **Lenguaje**: TypeScript
- **Base de datos**: Turso (libSQL)
- **ORM**: Drizzle
- **Estilos**: Tailwind CSS v4
- **3D**: Three.js + React Three Fiber
- **Animaciones**: Framer Motion
- **Storage**: Vercel Blob
- **Iconos**: Lucide React

## Features

- Intro cósmico 3D (universo estilo James Webb con estrellas, galaxias, nebulosas y planetas)
- Sistema de navegación orbital basado en el isotipo del logo
- CMS completo para gestionar servicios, eventos, productos, blog, testimonios y equipo
- Panel de administración con dashboard, formularios CRUD y upload de imágenes
- Sistema de reservas con formulario público multi-step
- Páginas dinámicas que leen contenido de la base de datos
- Diseño responsive (orbital en desktop, grid en mobile)
- Paleta basada en el logo: morado profundo, turquesa, amarillo cálido

## Estructura

```
src/
├── app/                    # Rutas (App Router)
│   ├── admin/              # Panel CMS (servicios, eventos, productos, blog, equipo, testimonios)
│   ├── servicios/          # Páginas públicas de servicios
│   ├── calendario/         # Eventos próximos
│   ├── tienda/             # Productos
│   ├── blog/               # Blog
│   ├── testimonios/        # Testimonios
│   ├── nosotros/           # Historia, filosofía, equipo
│   ├── contacto/           # Formulario de contacto
│   ├── reservar/           # Formulario de reservas (multi-step)
│   └── login/              # Auth admin
├── components/
│   ├── orbital/            # CosmicIntro (Three.js) + OrbitalSystem (isotipo + nav)
│   └── ui/                 # Navigation, RichTextEditor
├── actions/                # Server actions (CRUD para todos los módulos)
├── db/                     # Schema Drizzle (SQLite/Turso) + conexión
└── lib/                    # Constants, auth helpers
```

## Setup local

```bash
npm install --legacy-peer-deps
cp .env.local.example .env.local  # agregar TURSO_DATABASE_URL y TURSO_AUTH_TOKEN
npm run db:push                    # crear tablas en Turso
npm run dev                        # http://localhost:3000
```

## Variables de entorno

```
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=eyJ...
BLOB_READ_WRITE_TOKEN=vercel_blob_...  # para upload de imágenes
```

## Admin

Acceder a `/login` con el email configurado en `src/lib/constants.ts`. Desde el panel se puede gestionar todo el contenido del sitio.

## Desarrollado por

[Valente Creativo](https://github.com/ValenteCreativo)
