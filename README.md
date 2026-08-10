# Sembrando Huellas Perú — Edu y Acción

Página web institucional de la **Asociación Sembrando Huellas Perú** que presenta el proyecto **"Circuito Educativo Ambiental para la Conservación Biocultural"** (Ucayali 2026), desarrollado en sinergia con la **Dirección Regional de Educación de Ucayali (DREU)** y el **Zoológico Parque Natural de Pucallpa**.

Sitio *one-page* con 12 secciones, juegos educativos interactivos y traducción a 5 idiomas (incluidos shipibo-konibo y ashaninka).

## Características

- **One-page** con lazy-loading por sección (código dividido por chunks).
- **Multilingüe**: español, inglés, shipibo-konibo, ashaninka y asheninka. La selección se guarda en `localStorage`.
- **Juegos educativos**: Circuito Ecológico y Guardianes de la Amazonía.
- **Galería** con fotos, videos y soporte de medios.
- **Mapa interactivo** (Leaflet) con la ubicación del circuito en Pucallpa.
- **Formulario de contacto** vía EmailJS con fallback a `mailto:`.
- Animaciones con Framer Motion, hojas flotantes en el Hero y contadores animados.

## Stack técnico

| Tecnología | Uso |
| --- | --- |
| React 19 + Vite 8 | Framework y bundler |
| Tailwind CSS 4 | Estilos |
| Framer Motion | Animaciones |
| Swiper | Sliders de la galería |
| Leaflet / react-leaflet | Mapa |
| EmailJS | Envío del formulario de contacto |
| react-helmet-async | SEO / meta tags |
| oxlint | Linter |

## Requisitos previos

- Node.js **20+** y npm.

## Puesta en marcha

```bash
# 1. Instalar dependencias
npm install

# 2. Servidor de desarrollo (http://localhost:5173)
npm run dev

# 3. Lint (solo revisa src/, ignora node_modules y dist)
npm run lint

# 4. Tests unitarios
npm run test

# 5. Checklist completa: lint + tests + build
npm run verify

# 6. Build de producción (genera dist/)
npm run build

# 7. Previsualizar el build (http://localhost:4173)
npm run preview
```

## Configuración del formulario de contacto (EmailJS)

El formulario usa [EmailJS](https://www.emailjs.com) para enviar los mensajes. Abre `src/config/emailjs.js` y reemplaza los placeholders:

```js
export const EMAILJS_CONFIG = {
  serviceId: 'TU_SERVICE_ID',
  templateId: 'TU_TEMPLATE_ID',
  publicKey: 'TU_PUBLIC_KEY',
}
```

Para configurarlo:

1. Crea una cuenta gratuita en emailjs.com.
2. Conecta un *Email Service* (Gmail, Outlook, etc.).
3. Crea un *Email Template* que use las variables `{{from_name}}`, `{{reply_to}}` y `{{message}}`.
4. Copia los IDs y la Public Key al archivo anterior.

> Si las claves no están configuradas, el formulario cae automáticamente a `mailto:` (abre el cliente de correo del visitante), por lo que nunca queda inoperante.

## Estructura del proyecto

```
src/
├── animations/        # Variantes y animaciones (Framer Motion)
├── assets/            # Imágenes y videos
├── components/
│   ├── layout/        # Navbar, Footer, Loader, MetaTags...
│   ├── sections/      # 11 secciones de la landing
│   └── games/         # Juegos educativos interactivos
├── config/            # Configuración del proyecto (EmailJS)
├── constants/         # SITE_CONFIG, NAV_LINKS, colores
├── contexts/          # LanguageContext (idioma)
├── data/              # Contenido y datos de las secciones
├── hooks/             # useScrollReveal, useTheme
└── i18n/              # Traducciones (5 idiomas)
```

## Despliegue

El build genera una SPA estática en `dist/`. Se puede publicar en cualquier hosting estático (Netlify, Vercel, GitHub Pages) o en cualquier servidor web:

- **Netlify / Vercel (recomendado)**: conectar el repo. Comando de build `npm run build`, directorio de salida `dist`.
- **GitHub Pages**: compilar con `npm run build` y publicar la carpeta `dist`.

Por ser SPA, asegúrate de redirigir cualquier ruta desconocida a `index.html` (no aplica si se aloja el `dist` directamente).

## Idiomas

- El idioma seleccionado se guarda en `localStorage` bajo la clave `shp-lang`.
- Las traducciones viven en `src/i18n/translations.js`.
- Para agregar un idioma: añade la entrada en `LANGUAGES` y la carpeta de traducciones correspondiente, con fallback a español en `useT`.