# OpenChuspa — Landing (Astro)

Landing de **openchuspa.xyz**, el motor caleño de almacenamiento de objetos compatible con AWS S3 / MinIO, migrada a [Astro](https://astro.build) y lista para desplegar en [Vercel](https://vercel.com).

## Stack

- **Astro 5** (output estático)
- **Tailwind CSS v4** (vía `@tailwindcss/vite`, sin CDN)
- **lucide** (iconos, importados como módulo)
- **@astrojs/vercel** (adaptador de despliegue)

## Desarrollo local

```bash
npm install
npm run dev
```

Abre http://localhost:4321

## Build de producción

```bash
npm run build      # genera dist/
npm run preview    # previsualiza el build
```

## Desplegar en Vercel

### Opción A — Dashboard (recomendada)

1. Sube este repo a GitHub/GitLab/Bitbucket.
2. En Vercel: **Add New → Project** e importa el repo.
3. Vercel detecta Astro automáticamente. Deja los valores por defecto:
   - Build Command: `astro build`
   - Output Directory: lo gestiona el adaptador `@astrojs/vercel`
4. **Deploy**.

### Opción B — CLI

```bash
npm i -g vercel
vercel         # primer deploy (preview)
vercel --prod  # deploy a producción
```

## Estructura

```
src/
  layouts/Layout.astro   # <head>, fuentes, iconos Lucide, CSS global
  pages/index.astro      # markup de la landing + script interactivo (TS)
  styles/global.css      # Tailwind v4 + tema "salsa" + estilos custom
astro.config.mjs         # adaptador Vercel + plugin Tailwind
```

## Notas de la migración

- El `tailwind.config` inline del HTML original se trasladó a `@theme` en `src/styles/global.css` (colores `salsa-*`, fuentes y animaciones `pulse-glow` / `float`).
- Los `onclick="..."` inline se reemplazaron por `addEventListener` con atributos `data-*` (mejor práctica y compatible con el bundling de Astro).
- `document.execCommand('copy')` ahora usa `navigator.clipboard` con fallback.
- Tailwind y Lucide dejan de cargarse por CDN; se empaquetan en el build para producción.
```
