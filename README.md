# OpenChuspa — Landing (Astro)

Landing de **openchuspa.xyz**, el motor caleño de almacenamiento de objetos compatible con AWS S3, migrada a [Astro](https://astro.build) y lista para desplegar en [Vercel](https://vercel.com).

## Stack

- **Astro 5** (output estático)
- **Tailwind CSS v4** (vía `@tailwindcss/vite`, sin CDN)
- **lucide** (iconos renderizados como SVG en el build, sin JS en el navegador)
- **Fontsource** (Plus Jakarta Sans y JetBrains Mono autoalojadas, sin Google Fonts)
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
public/favicon.svg
src/
  layouts/Layout.astro     # <head>, metadatos y CSS global
  pages/index.astro        # compone las secciones de la landing
  components/              # una sección por archivo; cada una trae su propio <script>
    Header.astro           #   banner + reproductor de salsa + navegación y menú móvil
    Hero.astro             #   incluye a El Parchao, la mascota (src/assets/el-parchao.webp)
    Playground.astro       #   terminal simulada (estado en memoria)
    Commands.astro, Glossary.astro, Generator.astro, Sdks.astro, SelfHosted.astro
    Footer.astro, Toast.astro, Icon.astro, SectionHeader.astro
  data/
    constants.ts           # endpoint, región y valores compartidos con los scripts
    site.ts                # contenido: navegación, comandos, glosario y snippets de SDK
  styles/global.css        # Tailwind v4, tema "salsa" y utilidades propias
astro.config.mjs           # site, adaptador Vercel y plugin Tailwind
```

## Convenciones

- El contenido se edita en `src/data/site.ts`; los componentes solo lo recorren.
- Paleta: blanco y negro (`zinc-*`) con `salsa-orange` como único acento.
- La salida de la terminal se construye con `textContent`, nunca con `innerHTML`, para que lo que escriba el usuario no se interprete como HTML.
- Botones de copiar: `data-copy="texto"` o `data-copy-target="selector"`; los gestiona `Toast.astro`.
- Responsive: la cabecera fija mide `--header-h` (definida en `global.css`); los anclajes la descuentan con `scroll-padding-top`.
