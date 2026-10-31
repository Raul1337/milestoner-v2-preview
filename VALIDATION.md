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
