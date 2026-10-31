# Milestoner V2.2 — paleta fija, fondos personalizables

Exploración aislada, pendiente de aprobación visual del propietario. La decisión actual reemplaza las cinco atmósferas oscuras anteriores. **No se aplican cambios al tema publicado de la aplicación principal.**

URL: https://raul1337.github.io/milestoner-v2-preview/theme-playground/

## Decisión aprobada y fuentes

La imagen Light/Dark adjunta por el propietario es la referencia visual de las seis categorías. Los HEX proceden de `VibrantSurfaceTokens.swift`, cotejados en la implementación nativa; no se estiman de los píxeles comprimidos. Este perfil sustituye al catálogo anterior de `DomainVisualPalette`, donde Finance/Wellbeing tenían colores distintos. La elección del perfil vibrante coincide con la decisión explícita actual: dorado y naranja.

| Categoría | Texto Light / Dark | Gráfico Light / Dark | Tile Light / Dark |
|---|---|---|---|
| Fitness | #00734C / #2AE9AB | #009B6A / #2AE9AB | #D8FAEB / #123F34 |
| Learning | #7436C9 / #C197FF | #8C44E8 / #B77CFF | #F0E4FF / #3C285C |
| Career | #005EC9 / #65B4FF | #0079F2 / #48A8FF | #E0EFFF / #163D64 |
| Personal / Social | #B52C4E / #FF8AA0 | #E44365 / #FF6C89 | #FFE5EB / #512936 |
| Finance | #805300 / #FFD447 | #AE7900 / #F6C638 | #FFF0C6 / #473B20 |
| Wellbeing | #A1480A / #FFAC66 | #C96812 / #FF9D47 | #FFEAD8 / #4B3326 |

`native-palette.js` fija estos 36 valores. El gráfico se usa para iconos/indicadores; el ink mantiene legibilidad del texto y el borde cromático. Las mezclas de tiles/superficies siguen `FidelityPresentation`; opacidades/grosores de borde siguen `ChromaticBorderRecipe` (padre Light 48/32%, Dark 45/25%; hijo Light 30/20%, Dark 28/16%). Las superficies neutras Dark pueden ser carbón o navy; la identidad, el tile y el pigmento del borde no cambian entre fondos. El contraste aumentado usa contorno neutro opaco, conservando los acentos internos.

Los tokens originales de las demás categorías web, incluido Travel, se preservan. Today conserva su tratamiento Wellbeing/naranja. Se mantienen los cinco assets originales de marca y el arte M+.

## Fondos y uso

- Apariencia: System, Light o Dark. System sigue el esquema del navegador y escucha sus cambios.
- Light: Clean White, Soft Sky Blue, Soft Blush Pink, Pastel Lavender, Warm Pastel Peach. Superficies blancas y acentos idénticos.
- Dark: Dark Gray (grafito/carbón) y Dark Blue (canvas nativo navy). Ambos contienen todos los acentos cálidos y fríos aprobados.
- Comparación de fondos o vista individual; móvil de 390 px / escritorio de 1280 px. “Abrir pantalla” permite ver la app a tamaño real.
- Mismos componentes/fixtures de Home, detalles de Japón y propuesta existente de Miles. La muestra cromática de seis categorías está fuera de la app y no añade categorías, proyectos o comportamiento de dominio.
- Los selects de fondos conservan ambas elecciones en la URL; sólo se habilita el de la apariencia actual. No se escribe localStorage.
- Contraste aumentado, movimiento reducido y superficies opacas se pueden probar explícitamente. Se respetan también las media queries del sistema, incluidos colores forzados.

## Arquitectura y límites

Una sola aplicación reutilizada en todos los fondos, con tokens compartidos y una capa de personalización del canvas/superficies. Se conserva el build separado y sus adaptadores temporales en memoria. Los cambios de color no sustituyen handlers ni contratos de la app. Cambiar de escena o recargar restablece los ejemplos. La aplicación principal mantiene V2.1.2, sus archivos compilados y su almacenamiento.

El PDF comprado de Color Bears no se usa para definir identidades de categoría ni se incluye en fuente, bundle o capturas. Las propuestas anteriores dejaron de ser el diseño activo del Playground; siguen recuperables en Git como evidencia histórica.

## Validación final

- 19/19 tests web: 15 de modelo/idioma/sidebar conservados y cuatro actualizados para la decisión actual. Se prueban HEX congelados, invariancia entre fondos/fallbacks, contraste y selección System.
- Build principal y Playground aprobados. Los ocho archivos del build principal coinciden con V2.1.2; fuentes, dependencias/lockfile, assets y workflow originales preservados.
- 84 escenas: siete fondos × Home/Project/Miles × móvil/escritorio × normal/fallbacks. Sin imágenes rotas ni desbordamiento; dimensiones y acentos iguales entre fondos de cada apariencia.
- System comprobado en sus dos ramas con media queries reales de un contenedor local. Controles/contendor comprobados a 320, 390, 768, 1024 y 1440 px.
- 952 elementos de texto renderizados medidos contra fondos sólidos/extremos de gradientes: cero fallos, mínimo final 5.022:1. No es una certificación WCAG exhaustiva ni un análisis de todos los píxeles.
- Se detectó primero contraste insuficiente en texto neutro y después 14 enlaces Light. Se corrigieron sólo los neutros y la acción de canvas al #2445CE nativo accesible; se repitió la medición completa. Logo y acentos de categorías conservados.
- Los 36 HEX se compararon directamente con Swift. La captura aprobada se cotejó cualitativamente: verde/violeta/azul/rosa/dorado/naranja, tiles coloreados, indicadores y bordes consistentes. Los iconos web usan Lucide y no reproducen los SF Symbols ni el renderizado SwiftUI al píxel.
- Casos enfocados: drawer y foco, creación sintética aislada, selección/recarga por URL, fondos y contraste/movimiento/transparencia sin recoloración de categorías.
- iOS: HEAD, estado y hashes de 1,231 archivos idénticos al inicio. Sin builds/tests nativos ni cambios de backend, autenticación o Sync.

Se entregan capturas de comparación de los cinco Light y dos Dark para las tres pantallas, más muestras de las seis categorías. Pendientes: aprobación visual del propietario, lector de pantalla y dispositivo físico. El despliegue remoto se verifica por separado tras el commit final.
