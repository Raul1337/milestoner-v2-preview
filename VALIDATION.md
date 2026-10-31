# Validación original del prototipo · 30 de octubre de 2026

- Compilación Vite: PASS.
- Pruebas Node del modelo: **7/7 PASS**.
- Navegador integrado, tamaños 390×844 y 1440×1000: navegación por las cinco secciones y adaptación responsive revisadas.
- Creación asistida: plantilla francés editada, confirmada y abierta como proyecto nuevo con cero progreso.
- Discover: búsqueda francés deja una idea; envío a Miles y descarte de propuesta.
- Creación manual: proyecto Finance confirmado; registro ficticio de 250 MXN reflejado en Progress, desde el enlace de Insights.
- Calendario: revisión de evento, elección Google Calendar simulado, confirmación y aparición en Today verificadas.
- Recordatorio privado: título oculto, revelación explícita y marcado de ejemplo verificados.
- Recordatorio puntual: creado y visible en Home.
- Progress: Finance semana = 1,500 MXN; año = 10,500 MXN. Filtros cambian registros y totales. Estado vacío sin proyección.
- You: On Demand cambia Miles Brief. Contexto de proyecto se conserva entre pantallas.
- Settings/tareas: meta editada; tarea completada conservada tras recargar la página.
- Restablecimiento de los datos de prueba antes de la entrega.
- Sin errores de consola observados durante los recorridos revisados.
- Estado Git de iOS y diff de archivos versionados comparados antes/después: idénticos. Index sin cambios. No se ejecutaron pruebas iOS ni se modificaron SwiftUI/SQLite/Sync.

Estas comprobaciones validan el prototipo local. No equivalen a regresión productiva, auditoría de seguridad ni certificación WCAG. No se probó en un iPhone físico ni con VoiceOver; se revisaron tamaños de viewport, etiquetas, foco y diálogos nativos. La integración futura de backend, permisos, autenticación, sincronización y calendarios permanece fuera del alcance.

## Preparación para GitHub Pages · 30 de octubre de 2026

- Copia del prototipo existente; modelo, CSS, SVG, dependencias, lockfile, pruebas y HTML conservados byte a byte. El único cambio de interfaz son las cuatro referencias de imágenes con BASE_URL. Sin rediseño.
- Base de Vite: `/milestoner-v2-preview/`. Navegación hash conservada.
- Revisión de todos los archivos de publicación, fixtures, metadatos SVG y los cinco archivos del bundle: sin credenciales, tokens, endpoints privados, datos reales ni rutas del sistema local. README saneado y lanzador específico del equipo excluido.
- Los dos SVG contienen sólo geometría, gradientes y texto descriptivo; no scripts, imágenes incrustadas ni recursos externos.
- No hay llamadas de integración en el código de la aplicación. El único fetch del bundle es el polyfill de modulepreload de Vite para cargar módulos estáticos; los otros dominios son namespaces XML/SVG y documentación de React.
- Instalación desde lockfile, compilación Vite 6.4.5 y pruebas existentes: 7/7 PASS.
- Bundle servido bajo el subdirectorio de Pages: Home revisado a 1440×1000 y 390×844. En móvil, Home, Discover, Miles, Progress, You y los cuatro proyectos cargan con encabezados visibles, cero imágenes rotas y sin desbordamiento horizontal. Sin errores ni advertencias de consola observados.
- Repositorio público independiente previsto: `Raul1337/milestoner-v2-preview`. El repositorio iOS no se abrió ni modificó durante esta preparación.
- Publicación remota y URL pública: pendientes de ejecución y verificación; estas comprobaciones locales no acreditan un despliegue.


## Web Visual Alignment V2.1 · 30 de octubre de 2026 (hora local)

### Fuente y alcance

- Baseline web: `fb58a870bab385f089635ba6c917350514fce2d8`. Cambios limitados a CSS, presentación JSX, tres variantes de marca originales y documentación.
- Modelo, fixtures, pruebas, dependencias, lockfile, base de Vite y workflow conservados byte a byte. Revisión del diff JSX: sin cambios de handlers, formularios, cálculos, rutas o persistencia.
- Tokens contrastados con las fuentes nativas y las capturas sintéticas aportadas. Véase VISUAL_ALIGNMENT.md para las diferencias de plataforma y aceptación pendiente.

### Validación ejecutada en la compilación estática

- Pruebas existentes del modelo: 7/7 PASS; compilación Vite: PASS.
- Matriz de 36 vistas: Home, Discover, Miles, Progress, You y cuatro proyectos × Light/Dark × 390×844 y 1440×1000. Encabezados visibles, cero imágenes rotas y sin desbordamiento horizontal.
- Light/Dark comprobados con media queries reales, heredadas desde un contenedor de revisión local con color-scheme. Los contenedores no forman parte del bundle publicado.
- Revisión de capturas: Home, proyectos, Progress y creación, además de propuesta editable y diálogo. Correspondencia visual cualitativa; no se afirma igualdad de píxeles entre SwiftUI y navegador.
- Recorrido interactivo: completar tarea y conservarla tras recarga; Discover busca francés y abre propuesta; descarte; creación asistida y manual; registro Finance de 250 MXN reflejado en Progress.
- Calendario simulado: revisar, volver a editar lugar, confirmar Google Calendar simulado, aparecer en Today y quitar el evento con confirmación.
- Recordatorio privado: revelar ejemplo y marcarlo; recordatorio puntual creado y visible en Home.
- Preferencias: On Demand persiste tras recarga y modifica Miles Brief; Settings guarda meta de proyecto. Restablecimiento de los datos de prueba comprobado.
- App abierta directamente: sin errores ni advertencias de consola observados durante el recorrido. El entorno de inspección emite un error MutationObserver al navegar iframes; se reprodujo en un control vacío sin JavaScript, separado de la app.
- Revisión previa a publicación de todos los archivos candidatos y los ocho archivos del bundle: sólo fixtures y recursos estáticos. Sin credenciales, claves privadas, endpoints privados, datos reales ni rutas del sistema local. Los cinco SVG contienen únicamente geometría y estilos, sin recursos externos ni scripts. No se publican capturas nativas, archivos de entorno, cachés o dependencias instaladas.

No se ejecutan builds o tests iOS, pues el alcance nativo es sólo lectura. Esta validación web no equivale a certificación de accesibilidad ni regresión productiva. El despliegue remoto del commit final se verifica por separado después de publicar; un build local no acredita ese resultado.


## Responsive Sidebar & UX Refinement V2.1.1

Baseline web: `62df7b58c32520c36e73cf45d744ad0f0ffcefde`. Publicación de preview autorizada por el propietario; aceptación UX final pendiente.

- Pruebas finales: **12/12 PASS** (7 originales y 5 enfocadas en idioma, fixtures y texto personalizado); build Vite 6.4.5: PASS. Sin dependencias nuevas en la aplicación.
- Matriz: 72 vistas, nueve rutas × EN/ES × Light/Dark × 390×844 y 1440×1000. Dimensiones efectivas verificadas, títulos y selección de idioma correctos, sin imágenes rotas ni desbordamiento de página. Sidebar/menú corresponden al breakpoint.
- Tamaños adicionales: 320, 768, 901 y 1024 px en Home, Miles y proyecto Japón. En 320 px se repitió EN/ES tras corregir el ancho mínimo que causaba desbordamiento junto a la barra de scroll.
- Drawer: apertura con Enter, foco inicial, ciclo Tab/Shift+Tab, Escape, cierre por fondo y botón, retorno al menú; cierre al navegar con foco en main; cierre al crecer a escritorio y restauración del scroll. El primer recorrido detectó salida de foco con Shift+Tab; corregida y revalidada.
- Home: Today expandido conserva tareas, recordatorios y eventos. Con los ejemplos iniciales, Tu vida comienza aproximadamente a 456 px en ES y 427 px en EN a 390×844. El conteo y las fechas del modelo permanecen iguales.
- Creación asistida y manual confirmadas en EN y ES. Registro Learning de 2 sesiones y Finance de 250 MXN reflejados en Progress. Texto personalizado `Home {0}` conservado literalmente tras recarga y cambio de idioma.
- Calendario EN: edición, revisión y confirmación de Google Calendar simulado; evento visible en Today. Recordatorio privado revelado/marcado y recordatorio independiente creado. Preferencia On Demand persiste tras recarga y se refleja en Home; Settings guarda meta y las pestañas responden a flechas del teclado.
- Navegación directa y por drawer/encabezado verificadas. Restablecimiento de los ejemplos de prueba completado. App abierta directamente: sin errores ni advertencias de consola observados.
- Capturas antes/después de Home móvil, Home escritorio, creación Miles móvil y escritorio, en Light y Dark; capturas posteriores adicionales en EN. La baseline V2.1 tenía textos mezclados, conservados en las capturas anteriores como evidencia.
- Incidencia de entorno: al alternar pestañas, el control de viewport actuó sobre la pestaña activa. Esa pasada no se contó como validación móvil; se repitió con anchura DOM comprobada. El error de inspección MutationObserver de iframes ya documentado no aparece en la app abierta directamente.
- `src/model.js`, `src/tokens.css`, cinco SVG, dependencias, lockfile, workflow, base Vite y siete pruebas originales sin cambios. Persistencia mantiene clave, esquema y comportamiento local; no se guarda idioma ni expansión en el estado de dominio.
- Revisión de los 23 archivos fuente candidatos y los ocho archivos de dist: sin secretos, datos personales reales, endpoints privados ni rutas del sistema local. Sólo datos sintéticos. Sin APIs nuevas, fuentes remotas o recursos externos.
- iOS: HEAD, estado Git y hashes de 1,231 archivos comparados con el inicio; sin cambios. No se ejecutaron builds/tests nativos porque no forman parte de este alcance.

El despliegue remoto se verifica después del commit final; su resultado se entrega por separado. Esta validación de preview no certifica accesibilidad ni funcionamiento en todos los dispositivos o navegadores.


## Slim Expandable Sidebar V2.1.2

Baseline: `f6b227103bf3c2372fc8ac7c4f10dd109ef11f44`. Alcance: navegación de escritorio y preferencia visual independiente. Publicación de preview autorizada; aceptación visual pendiente.

- Suite completa web final: **15/15 PASS**, incluidos los 12 tests anteriores y tres de preferencia/idioma. Build Vite: PASS. Sin dependencias nuevas.
- Matriz final sobre el bundle corregido: **124 vistas PASS**. Nueve rutas × EN/ES × Light/Dark × contraído/expandido a 1440×1000 (72); Home/Miles × Light/Dark × ambos estados a 901 y 1024 px (16); nueve rutas × EN/ES × Light/Dark a 390×844 (36). Títulos, idioma, selección activa, imágenes y ausencia de desbordamiento comprobados. En escritorio, margen y barra coinciden a 72/224 px; en móvil ambos son cero y M+ permanece disponible.
- Teclado: Tab recorre los cinco enlaces con nombres accesibles, tooltip asociado y contorno de 3 px. Enter navega y expande/contrae. Escape cierra el tooltip sin cambiar el ancho. En expandido se muestran nombres y no aparecen tooltips redundantes. Hover no modifica el estado por diseño; se revisaron sus handlers. No se certifica interacción con lector de pantalla físico.
- Preferencia expandida y contraída conservada tras recargar. Tests comprueban fallback ante almacenamiento ausente, inválido o bloqueado, y que la clave de datos existentes no se escribe al cambiar la barra.
- Drawer móvil: apertura por Enter, foco inicial, ciclo Tab/Shift+Tab, Escape y retorno al menú; navegación cierra y enfoca main. Crecer a escritorio cierra el drawer y restaura scroll. Cambiar entre 901 y 320 px conserva la preferencia de escritorio sin mostrar barra móvil.
- Se detectó desbordamiento transitorio al cruzar de escritorio expandido a móvil con animación de margen. Se eliminó la animación de redimensionamiento, manteniendo una actualización simultánea de barra y contenido; se repitió la prueba. El drawer conserva su transición y su regla de movimiento reducido. Movimiento reducido revisado en código; no se modificó la preferencia del sistema durante esta sesión.
- Creación asistida ES desde M+ móvil y manual EN desde sidebar: confirmación y navegación al proyecto, cinco proyectos tras recarga en el caso asistido, datos sintéticos restablecidos después. Los flujos de negocio y sus handlers se conservan byte a byte fuera de la conexión de navegación.
- Capturas antes/después de Home escritorio y móvil en Light/Dark, más estados contraído/expandido y tooltip con foco. No es una certificación visual de todos los navegadores o dispositivos.
- Privacidad: 25 archivos fuente y ocho archivos del bundle revisados; sólo fixtures sintéticos. Sin secretos, endpoints privados, rutas locales, APIs nuevas ni recursos remotos. SVG originales sin scripts ni referencias externas; sus referencias internas a gradientes son válidas. Los únicos URL del bundle son namespaces XML y documentación de errores de React.
- Preservación: modelo, tokens, cinco assets, dependencias/lockfile, base, workflow y pruebas anteriores sin cambios. iOS: HEAD, estado Git y hashes de 1,231 archivos idénticos al inicio; sin builds/tests nativos.

El estado y la preferencia son locales a cada navegador, sin sincronización. La verificación remota del despliegue y la consola directa se entrega después de publicar el commit final. Los avisos del inspector en iframes, ya documentados en V2.1.1, se separan de la app directa.
