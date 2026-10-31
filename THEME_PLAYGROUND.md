# Milestoner V2.2 — Dark Theme Exploration

Exploración aislada para evaluación del propietario. **Ninguna opción está aprobada ni aplicada como tema global.**

URL: https://raul1337.github.io/milestoner-v2-preview/theme-playground/

La aplicación principal conserva V2.1.2 en su URL habitual. Sus ocho archivos compilados son idénticos al baseline `756059f770ac88e06e33fe6e0f66b3a86be560bb`.

## Cinco direcciones

| Dirección | Atmósfera | Superficies y hero |
|---|---|---|
| Electric Night | Azul eléctrico, indigo, violeta y luz cian alta | Tarjetas azul profundo; hero cobalto/violeta/cian |
| Ember Glow | Ciruela cálida, coral y horizonte de brasas | Superficies vino; hero ciruela/coral/naranja/oro |
| Emerald Night | Teal profundo y luz botánica lateral | Jade, menta y un acento lima contenido |
| Copper Night | Espresso, terracota y reflejos de miel | Superficies tostadas, hero cobre y texto crema |
| Velvet Dusk | Berenjena y bruma rosa con reflejos periwinkle | Superficies lavanda oscura; hero rosa/lavanda/azul |

Colores seleccionados de **The Color Bears Dictionary**, mezclando distintas paletas numeradas. `theme-playground/themes.js` registra únicamente nombres, valores HEX y números de los colores utilizados. Las superficies y sombras de interfaz son derivadas; no se redistribuyen el PDF comprado, sus páginas, imágenes, descripciones o paletas completas. La marca y los cinco SVG originales se conservan.

## Evaluar

- Comparar cinco o explorar una dirección. La selección nunca cambia el tema principal.
- Pantallas idénticas: Inicio/Hoy/Tu vida, resumen del proyecto Japón y creación Miles con la propuesta existente de francés.
- Cambiar viewport móvil (390 px) o escritorio (1280 px); abrir una pantalla aparte para verla a tamaño real.
- Intensidad 0–100: modifica halos y mezclas del hero, conservando legibilidad y jerarquía. No anima ni altera geometría.
- Light muestra los tokens aprobados originales, sin nuevas variantes claras. Contraste aumentado y movimiento reducido pueden probarse explícitamente; también se respetan las preferencias del sistema.
- Los cambios de color/intensidad mantienen el formulario y scroll. Cambiar de escena/viewport o recargar reinicia sus datos sintéticos. Los cinco ejemplos están aislados entre sí y viven en memoria.

## Aislamiento y construcción

`npm run build` sigue construyendo exclusivamente la aplicación aprobada. `npm run build:playground` usa `playground.vite.config.js` y genera `playground-dist/`. GitHub Actions añade esa carpeta bajo `dist/theme-playground/`, sin cambiar el entrypoint principal ni sus permisos.

El build aislado importa los componentes originales, sin editar `src/`, e intercambia sólo los adaptadores de lectura/escritura por adaptadores temporales de memoria. El modelo, sus fixtures, handlers, claves y contrato de localStorage de producción permanecen intactos. El bundle de exploración no contiene accesos a localStorage/sessionStorage. El controlador usa parámetros URL y mensajes del mismo origen, comprobando además la ventana emisora; no hay API, backend ni datos reales.

No se cambian dependencias, lockfile, rutas originales ni iOS. La escena Miles activa la plantilla existente para presentar un ejemplo revisable, sin confirmar creación automáticamente.

## Validación V2.2

- **19/19 tests PASS**: 15 anteriores y cuatro enfocados en contraste, separación de superficies, fuentes numeradas y saneamiento de parámetros.
- Build principal y Playground: PASS. Los ocho hashes del build principal coinciden con V2.1.2.
- **120 vistas PASS**: cinco temas × tres escenas × dos viewports × intensidad Dark 0/60/100, más Light a 60. Mismos tamaños de elementos entre temas, sin imágenes rotas ni desbordamiento horizontal.
- Contenedor de revisión a 320, 390, 768, 1024 y 1440 px, en comparación y vista individual: sin desbordamiento; controles visibles. La comparación se apila en pantallas estrechas. Las miniaturas de escritorio se escalan; la vista individual o pantalla aparte permite evaluar texto a tamaño real.
- **680 elementos de texto renderizados** medidos a intensidad 100 en las tres escenas de escritorio; cero fallos respecto de 4.5:1 para texto normal o 3:1 para texto grande. Mínimo observado: 4.686:1. Se consideran los extremos de la primera capa opaca del gradiente; no es un muestreo exhaustivo de píxeles ni una certificación WCAG.
- **210 configuraciones de tokens** (cinco temas × 21 intensidades × contraste normal/aumentado): texto semántico mínimo ≥4.72:1; texto de acción ≥8.72:1; foco ≥7.44:1; límites de campos ≥3.23:1. Los halos también se evalúan con una composición conservadora.
- Contraste aumentado elimina halos y suaviza el hero a una superficie sólida; movimiento reducido desactiva transiciones. Ambos comprobados en las cinco opciones. Preferencias del sistema revisadas en código; no se cambió la configuración del equipo.
- Teclado: foco visible, rango con Home/flechas, drawer móvil con Enter/Escape y devolución del foco. Formulario conserva un texto sintético al cambiar intensidad y Light/Dark.
- Aislamiento: crear un proyecto ficticio en la exploración no aparece en la app principal (cuatro proyectos); recargar el Playground restablece cuatro. No se modifica el contrato existente de persistencia.
- Primera prueba de separación de superficies detectó demasiada proximidad entre Ember/Copper. Ember se reforzó hacia ciruela/vino y la prueba enfocada pasó; la suite final incorpora esa corrección.
- El inspector emite un error MutationObserver en contenedores iframe: reproducido en un control vacío sin JavaScript. Una escena directa nueva, incluida creación, no muestra errores/advertencias. No se atribuye el aviso del inspector a la aplicación.
- Fuentes y bundle revisados antes de publicar: sólo datos sintéticos; sin secretos, rutas locales, endpoints privados o contenido del PDF. Se conservan HEAD, estado y hashes de 1,231 archivos de iOS.

Los resultados de GitHub Actions y HTTPS se verifican después del commit final y se entregan con las capturas. Pendiente: evaluación visual del propietario; lectores de pantalla y dispositivos físicos no certificados. **No aplicar globalmente ni publicar un nuevo tema predeterminado sin aprobación.**
