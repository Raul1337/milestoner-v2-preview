# Milestoner Vision V2 · preview estática

Preview responsive de la visión aprobada, con alineación visual nativa V2.1. React + Vite y CSS con tokens, sin backend. Todos los datos son ficticios; el día de demostración está fijado en **30 de octubre de 2026**. No representa actividad del usuario.

## Ejecutar

Requiere Node.js 20.19+ o 22.12+. Desde esta carpeta:

```sh
npm ci
npm run dev -- --port 4173
```

Abrir http://127.0.0.1:4173/milestoner-v2-preview/#home. `npm run build` genera `dist/`; `npm run preview` sirve esa compilación. `npm test` ejecuta las pruebas del modelo.

## Recorrido

- **Home:** Today, tareas con estado reversible, recordatorios compactos, Miles Brief y Your Life con filtros por categoría.
- **Discover:** búsqueda de cuatro ideas de ejemplo y paso a propuesta editable.
- **M+ / Miles:** intención libre con plantilla explícita, propuestas revisables, descarte, confirmación y alternativa manual. Elegir categoría y ajustar meta, fecha y primer paso. No se llama a una IA.
- **Proyectos:** Japón, francés, 5 km y ahorro de $30,000 MXN. Overview opera tareas y registros; Insights describe el presente; Settings cambia nombre, fecha y meta. Los proyectos nuevos comienzan en cero.
- **Japón:** itinerario ilustrativo, presupuesto editable, tareas, agenda y evento con revisión/edición antes de confirmación. Selección Apple/Google puramente simulada; eventos del día demo aparecen en Today. La agenda permite quitar eventos con confirmación y evita duplicados con mismo proyecto, título, fecha y hora.
- **Recordatorios:** ejemplo privado con revelación explícita y marcado reversible; creación puntual desde Today o Miles, también para fechas futuras. El marcado diario es solo un estado de la demo, sin motor de recurrencia.
- **Progress:** Overall y por proyecto, filtros de semana/mes/año con recálculo real sobre registros ficticios. Finance suma aportaciones, Learning sesiones, Travel avances registrados y Fitness muestra la mayor distancia. Las tareas se gestionan aparte: completar una tarea no inventa una sesión, distancia o aportación. No hay puntuación global de vida ni inclusión de información médica.
- **You:** On Demand, Balanced y Proactive modifican Miles Brief. Contexto del último proyecto abierto o creado, persistido localmente y eliminable. Restablecimiento limitado a la demo con confirmación.

## Límites

No hay autenticación, claves, Supabase, IA real, reservas, pagos, calendarios conectados ni notificaciones. Ninguna acción llama a servicios externos. Los recursos de marca y dependencias de interfaz se sirven localmente. Vite utiliza su conexión de desarrollo local; la compilación estática no la necesita.

El estado se guarda en `localStorage` bajo `milestoner-vision-v2-demo-v1`. No introducir datos personales reales. La etiqueta Privado oculta el título de un ejemplo en Home; **no implementa cifrado, control de acceso ni seguridad médica**. Si el almacenamiento está deshabilitado, se informa y la demo continúa en memoria. El borrador de creación dura durante la sesión de página; los proyectos confirmados y el contexto sobreviven a la recarga.

## Arquitectura

- `src/model.js`: fixtures, cálculos deterministas y adaptador de almacenamiento de demo. Punto de sustitución futuro para datos validados, sin implementar backend.
- `src/main.jsx`: navegación por hash, componentes de tarjetas, diálogo nativo, formularios y pantallas React.
- `src/tokens.css`: roles semánticos nativos, superficies y bordes de dominio, Light/Dark según el sistema.
- `src/style.css`: layouts responsive, jerarquía tipográfica, foco visible y dock flotante en móvil y escritorio.
- `tests/model.test.js`: periodos, agregación por unidad, exclusión de fechas futuras/recordatorios, estado vacío y persistencia/fallback.
- `public/`: cinco SVG originales de marca, incluyendo variantes Dark y M+ blanco, sin redibujar.
- `VISUAL_ALIGNMENT.md`: correspondencia visual con iOS y límites de la adaptación web.

## GitHub Pages

Repositorio independiente `Raul1337/milestoner-v2-preview`. La preview y su código son públicos. Sólo contiene ejemplos ficticios. Cada navegador guarda su propio estado en localStorage: no hay cuentas ni sincronización entre navegadores o dispositivos. No introducir datos personales, médicos ni credenciales.

La base de Vite es `/milestoner-v2-preview/`; las vistas conservan navegación por hash, incluido `#home`. En Settings → Pages, seleccionar GitHub Actions como fuente. El workflow ejecuta las pruebas existentes, compila y publica únicamente `dist/` al recibir un push a `main` o un lanzamiento manual. Los permisos de publicación se limitan al trabajo de despliegue.

No se modifica la aplicación iOS ni se conectan servicios productivos.

Configuración basada en las guías oficiales de [Vite](https://vite.dev/guide/static-deploy.html#github-pages) y [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
