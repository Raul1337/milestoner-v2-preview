> Estado actual: la identidad V2.1 está aprobada. La decisión del propietario V2.1.1 sustituye únicamente el sistema de navegación descrito abajo por sidebar/drawer; el apartado V2.1 permanece como historial de procedencia visual.

# Milestoner Vision V2 — Web Visual Alignment V2.1

## Alcance

Alineación de presentación sobre el prototipo React/Vite existente. Se conservan los flujos Vision V2, fixtures, cálculos, hash routing y clave de localStorage. Sin servicios nuevos ni cambios de dependencias. El repositorio iOS se consultó sólo como referencia; su implementación y datos no se modifican ni se publican aquí.

## Correspondencia con la identidad nativa

| Referencia inspeccionada | Aplicación web |
| --- | --- |
| DesignTokens.swift | Azul #315BFF, secundario #1674FF, violeta #6A35EA, cian #55DFF3; texto, acción, foco y superficies semánticas Light/Dark. |
| VibrantSurfaceTokens.swift | Fondo azul atmosférico, gradiente vertical y halos azul/violeta; color contextual de tinta, gráficos y tiles. |
| DomainVisualPalette.swift | Travel usa la paleta Explore existente; Learning, Fitness y Finance conservan sus roles. El borde Finance sigue el acento teal original, mientras tinta/tile usan oro vibrante. |
| ChromaticBorderRecipe.swift | Separación entre superficie padre e hija, gradientes diagonales, borde padre de 1 px e hijo de 0.75 px, alfa distinto por apariencia. Mezclas sRGB precalculadas. |
| NavigationDock.swift | Dock flotante translúcido, cinco destinos existentes, M+ de 51 px con arte blanco original y degradado azul-violeta. |
| DomainCard.swift y MilestoneRow.swift | Tarjetas redondeadas con tiles de dominio y filas anidadas; Today cálido y acción al extremo derecho. |
| Recursos originales de marca | SVG Light existentes más wordmark Dark, M+ Dark y M+ blanco; copias exactas, sin trazados nuevos. |
| Capturas sintéticas nativas de Home, creación y componentes | Comparación visual de atmósfera, profundidad, cromatismo, jerarquía y dock. Son evidencia visual histórica, no una especificación de los flujos web. |

`src/tokens.css` centraliza estos roles; `src/style.css` los aplica a Home, Discover, Miles, proyectos, Progress, recordatorios, calendario y preferencias. Light/Dark responde a la preferencia del sistema. Los formularios mantienen controles HTML y los diálogos conservan su comportamiento existente.

## Diferencias explícitas para aceptación visual del propietario

- CSS aproxima el material translúcido y las sombras de SwiftUI; no reproduce físicamente Liquid Glass.
- Se conservan los iconos Lucide del prototipo. No se exportan SF Symbols ni se sustituye el M+ original.
- La tipografía usa la fuente de sistema disponible. Las métricas y el rasterizado varían entre sistemas; las medidas relativas no imponen el límite AX nativo a la web.
- El dock conserva etiquetas web y una señal de selección. En escritorio flota debajo de una composición de dos columnas; no existe una captura nativa equivalente a ese ancho.
- La creación conserva conversación y propuesta revisable de Vision V2. No adopta las tres etapas ni el sheet de la referencia nativa, porque eso cambiaría el flujo aprobado.
- Home conserva sus proyectos y métricas sintéticas; no copia el 64% de consistencia ni las cuadrículas de actividad de la referencia. No se añaden funcionalidades para imitar una captura.
- El teclado, los selectores de fecha y el foco se representan según el navegador. No se ha certificado equivalencia en iPhone físico, VoiceOver, WCAG ni todos los navegadores.

La comparación de capturas se entrega por separado al propietario. No se incorporan capturas ni documentos privados nativos a este repositorio público.

## Decisión del propietario V2.1.1

- Dock flotante retirado de todos los tamaños web. Sidebar de 224 px en escritorio, con marca, cinco destinos y selección explícita. Drawer móvil de hasta 320 px, sin niveles adicionales.
- Encabezado móvil compacto con menú, marca, selector de idioma y acceso M+ directo. Permanece accesible al desplazarse; formularios y propuesta reservan margen de desplazamiento para no quedar bajo el encabezado.
- Tokens, SVG originales, paletas, fondos atmosféricos y recetas cromáticas V2.1 conservados byte a byte.
- Today/Hoy es expandible; Your Life/Tu vida gana visibilidad inicial en móvil. La creación conserva conversación, propuesta revisable y alternativa manual.
- EN/ES consistente en interfaz y ejemplos. Datos escritos por el usuario no se traducen; los controles de fecha/hora y sus mensajes de validación nativos dependen del navegador/sistema.

### Revisión pendiente del propietario

Aceptar la densidad del resumen de Today, el tamaño del sidebar y el encabezado móvil. Los filtros de dominio siguen desplazándose dentro de su propia fila en pantallas estrechas; la página no desborda horizontalmente. Las preferencias de idioma se conservan en la URL, no se sincronizan entre dispositivos. No se añaden etapas a creación ni un nuevo sistema visual.

Validación realizada en navegador integrado. Quedan fuera la certificación WCAG/VoiceOver y la comprobación en dispositivos físicos, teclados virtuales y todos los motores de navegador. Las transiciones respetan la preferencia de movimiento reducido mediante CSS; su percepción en cada dispositivo requiere revisión del propietario.


## Decisión del propietario V2.1.2 — barra compacta expandible

Sustituye el ancho fijo de V2.1.1 por 72 px contraídos y 224 px expandidos. La expansión es explícita y persistida; no se activa por hover. Conserva los cinco destinos y la indicación activa. El estado compacto usa la variante original M+ de marca; el expandido conserva el wordmark. La entrada Miles mantiene su círculo de marca y arte blanco originales.

Paleta, tipografía, fondos, bordes cromáticos, tarjetas, temas y flujos permanecen aprobados y sin rediseño. El drawer móvil y su shortcut M+ se conservan. La actualización de ancho es inmediata para mantener alineados contenido y barra durante cualquier cambio de viewport. Capturas comparativas de Home escritorio (antes, contraído y expandido) y móvil en Light/Dark acompañan la entrega para revisión visual del propietario.
