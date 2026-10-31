# Milestoner Vision V2 · preview estática

Preview responsive de la visión aprobada, con identidad visual V2.1 aprobada y navegación compacta V2.1.2. React + Vite y CSS con tokens, sin backend. Todos los datos son ficticios; el día de demostración está fijado en **30 de octubre de 2026**. No representa actividad del usuario.

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
- `src/Navigation.jsx`: barra lateral de escritorio y drawer móvil modal con foco y teclado.
- `src/style.css`: layouts responsive, encabezado móvil con M+, foco visible y densidad de Home.
- `src/language.jsx` y `src/translations.js`: presentación EN/ES, sin cambios al contrato de datos.
- `tests/model.test.js`: periodos, agregación por unidad, exclusión de fechas futuras/recordatorios, estado vacío y persistencia/fallback.
- `public/`: cinco SVG originales de marca, incluyendo variantes Dark y M+ blanco, sin redibujar.
- `VISUAL_ALIGNMENT.md`: correspondencia visual con iOS y límites de la adaptación web.

## GitHub Pages

Repositorio independiente `Raul1337/milestoner-v2-preview`. La preview y su código son públicos. Sólo contiene ejemplos ficticios. Cada navegador guarda su propio estado en localStorage: no hay cuentas ni sincronización entre navegadores o dispositivos. No introducir datos personales, médicos ni credenciales.

La base de Vite es `/milestoner-v2-preview/`; las vistas conservan navegación por hash, incluido `#home`. En Settings → Pages, seleccionar GitHub Actions como fuente. El workflow ejecuta las pruebas existentes, compila y publica únicamente `dist/` al recibir un push a `main` o un lanzamiento manual. Los permisos de publicación se limitan al trabajo de despliegue.

No se modifica la aplicación iOS ni se conectan servicios productivos.

Configuración basada en las guías oficiales de [Vite](https://vite.dev/guide/static-deploy.html#github-pages) y [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Responsive Sidebar & UX Refinement V2.1.1

La decisión del propietario sustituye el dock web: barra lateral persistente a partir de 901 px y drawer desde el encabezado hasta 900 px. M+ permanece visible en el encabezado móvil, con el arte original. Escape, botón de cierre y fondo cierran el drawer y devuelven el foco al menú; navegar lo cierra y lleva el foco al contenido. Tab/Shift+Tab permanecen dentro del drawer. Al pasar a escritorio se cierra y libera el desplazamiento.

Home reduce la introducción a su título. Today/Hoy presenta las dos primeras tareas y permite mostrar el día completo, conservando el conteo, tareas, recordatorios y eventos existentes. En móvil, Your Life/Tu vida aparece antes del resumen de Miles. No cambia la definición de lo programado ni se filtran datos de forma nueva.

El selector EN/ES traduce navegación, etiquetas, mensajes, fechas y ejemplos originales. La URL conserva `?lang=en` o `?lang=es` al recargar; sin selección explícita, se usa inglés si el navegador solicita inglés y español en los demás casos. Esto no añade claves a localStorage. Los textos personalizados se conservan literalmente, incluidos los escritos antes de esta actualización. Milestoner, Miles, M+, Apple Calendar y Google Calendar son nombres de marca sin traducir.


## Slim Expandable Sidebar V2.1.2

En escritorio (desde 901 px), la barra comienza contraída a 72 px. El botón de expansión permite mostrar los nombres a 224 px; el hover sólo muestra el nombre del destino, nunca expande la barra. Los cinco destinos mantienen iconos, selección activa y nombres accesibles en EN/ES. Los tooltips aparecen también al recibir foco y Escape los oculta. El arte M+ original identifica la marca compacta y la entrada de creación.

La preferencia se guarda por navegador en `milestoner-vision-v2-sidebar-expanded-v1`, separada del estado de la demo. Sin preferencia válida, comienza contraída. Si localStorage no está disponible, el cambio funciona mientras la página siga abierta. Restablecer los ejemplos no borra esta preferencia de navegación.

El contenido utiliza el mismo ancho de barra para su margen y se reajusta de forma inmediata, evitando solapamientos al cruzar el breakpoint. En móvil permanecen el drawer y el acceso M+ del encabezado; no aparece una barra permanente. Se conserva la regla de movimiento reducido del drawer. No se añaden dependencias ni cambian el modelo, tokens, assets o contratos de datos.

## V2.2 · paleta fija y fondos personalizables

[Theme Playground](https://raul1337.github.io/milestoner-v2-preview/theme-playground/) ofrece System/Light/Dark, cinco fondos Light y Gray/Blue en Dark. Las identidades de categoría quedan fijadas a los tokens nativos aprobados; elegir un fondo no las recolorea. La aplicación principal continúa en V2.1.2 y la exploración usa ejemplos temporales sin acceso a su almacenamiento. Véase [decisión, colores precisos, alcance y validación](THEME_PLAYGROUND.md). Pendiente de aprobación visual; ningún nuevo fondo se aplica globalmente.

## Vision V2.3A · Miles-first creation

M+ ofrece tres guiones locales declarados (Japón, francés y dentista), propuestas editables y confirmación explícita. La alternativa manual permanece visible. Los nuevos planes no exigen una meta numérica; las actividades sin fecha no aparecen en Today. Un recordatorio simple no crea proyecto. Los datos anteriores y su clave local se conservan. Véase [cambios, compatibilidad y validación](CREATION_V23A.md). Comportamiento funcional aceptado por el propietario; no hay IA o servicios reales.

## Vision V2.3A.1 · creación conversacional compacta

Un único compositor, propuestas en modo resumen y edición contextual sustituyen los formularios siempre visibles. Japón, francés y dentista conservan confirmación explícita y las mismas reglas de datos. Los detalles confirmados reutilizan las listas compactas. B1 es una sugerencia descriptiva; las ideas de agenda siguen sin programar. Véase [cambios, pruebas y límites de revisión](CREATION_V23A1.md). Publicación de preview para revisión visual del propietario; no implica aceptación final.

## Vision V2.3A.2 · Miles sobre tu contexto

M+ abre un modal de escritorio o una hoja móvil sobre la pantalla actual. Compositor, revisión y edición comparten una sola superficie, con descarte protegido y confirmación explícita. `#miles` conserva compatibilidad con marcadores y Atrás. Tras guardar se ofrece abrir el proyecto o recordatorio. Véase [alcance, validación y límites](OVERLAY_V23A2.md). Diseño provisional, pendiente de aprobación visual; la semántica aceptada V2.3A.1 y el almacenamiento se conservan.

## Vision V2.3A.3 · geometría estable

Miles mantiene su tamaño entre etapas: 78% del viewport útil en móvil, con expansión explícita, y 660 × 680 px en escritorio con límite de viewport. Encabezado y acciones fijos; contenido central desplazable. El Theme Playground conserva su geometría anterior. Véase [medidas, regresión y límites](GEOMETRY_V23A3.md). Pendiente de aprobación visual del propietario.
