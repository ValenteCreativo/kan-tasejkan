# 🧹 Limpieza Completa del Proyecto

## ✅ Archivos de caché eliminados:

- ✅ Carpeta `.next` (caché de Next.js)
- ✅ Carpetas `.cache` y `.turbo` en node_modules
- ✅ Scripts de prueba temporales

## 🌐 Limpieza del Navegador (IMPORTANTE - HAZLO AHORA)

### Opción 1: Limpiar solo localStorage (Recomendado)

1. Abre tu navegador en `http://localhost:3000` o `http://localhost:3001`
2. Abre la consola del navegador (F12 o clic derecho → Inspeccionar)
3. Ve a la pestaña **Console**
4. Pega este código y presiona Enter:

```javascript
localStorage.clear();
sessionStorage.clear();
console.log('✅ Storage limpiado');
location.reload();
```

### Opción 2: Limpiar todo (Cookies + Storage)

**Chrome/Brave/Edge:**
1. Presiona `Ctrl + Shift + Delete` (Windows) o `Cmd + Shift + Delete` (Mac)
2. Selecciona "Cookies y otros datos de sitios"
3. Selecciona "Imágenes y archivos almacenados en caché"
4. Rango de tiempo: "Desde siempre"
5. Click en "Borrar datos"

**Firefox:**
1. Presiona `Ctrl + Shift + Delete` (Windows) o `Cmd + Shift + Delete` (Mac)
2. Marca "Cookies" y "Caché"
3. Rango de tiempo: "Todo"
4. Click en "Limpiar ahora"

### Opción 3: Modo Incógnito (Más rápido para probar)

1. Abre una ventana de incógnito/privada
2. Ve a `http://localhost:3000` (o el puerto que uses)
3. Prueba signup/login desde cero

## 🔄 Reiniciar el servidor

Después de limpiar el navegador:

```bash
npm run dev
```

O si ya está corriendo, mátalo primero:

```bash
# Matar procesos en los puertos
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null

# Iniciar de nuevo
npm run dev
```

## 📋 Archivos preservados:

- ✅ `.env.local` (tus credenciales de Supabase)
- ✅ Todo el código fuente
- ✅ `node_modules`
- ✅ Configuración de Git

## ⚠️ Nota sobre la sesión de usuario

Después de limpiar localStorage:
- Se borrará cualquier usuario logueado
- Tendrás que hacer login de nuevo
- Esto es **bueno** porque empezarás limpio con la nueva base de datos

## 🎯 Próximos pasos:

1. ✅ Limpia el localStorage del navegador (usa Opción 1 arriba)
2. ✅ Ejecuta el script SQL que te di para arreglar la política RLS
3. ✅ Reinicia el servidor: `npm run dev`
4. ✅ Intenta signup con `hola1@martina.com`
5. ✅ Crea el bucket "artworks" manualmente en Supabase
6. ✅ ¡Debería funcionar!
