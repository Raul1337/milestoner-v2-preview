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
