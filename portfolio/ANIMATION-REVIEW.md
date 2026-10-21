# Revisión de animaciones

Comparación realizada contra los componentes anteriores del repositorio (`git show HEAD:...`) y los componentes de la propuesta local.

## Hallazgos y restauración

- `PortableImage`: anteriormente usaba Framer Motion y escalaba la imagen desde 0.1 en escritorio / 0.5 en móvil. En el modo artículo había sido sustituido por una imagen estática. Se restauró una entrada de escala y opacidad de 300 ms tanto para las imágenes del artículo como para el componente original. La escala inicial ahora es 0.94 para una aparición discreta sin alterar el encuadre ni dejar imágenes diminutas fuera de pantalla.
- Portada de casos: el renderizador anterior incluía `fade-in-up`; el nuevo no tenía animación. Se añadió la misma entrada compartida de imágenes.
- Retrato de Sobre mí: la propuesta había sustituido `PortableImage` por una imagen estática. Ahora usa la entrada compartida.
- `MetricsChart`: antes combinaba aparición vertical de 600 ms con interpolación de valores durante 1000 ms. La corrección de altura había desactivado ambos efectos. Se restauraron la aparición vertical y el crecimiento visual de las barras con esas duraciones. Los valores reales permanecen en el gráfico; no se reinician a cero.
- Se mantiene la altura explícita de 300 px y los gradientes únicos por gráfico. No se volvió al contenedor de altura porcentual que colapsaba.

## Respaldo y movimiento reducido

`components/MediaReveal.tsx` aplica animaciones finitas al entrar en pantalla una sola vez. El HTML base no tiene opacidad cero, transformaciones de ocultación ni atributos que requieran JavaScript para revelar contenido. Las animaciones no retienen estilos al finalizar.

Con `prefers-reduced-motion: reduce` no se inician animaciones. Si la preferencia cambia durante una animación, se cancela y se muestra el estado base. Se contemplan carga tardía de imágenes, aparición asíncrona del SVG de Recharts, ausencia de IntersectionObserver/animate y excepciones al iniciar una animación.

No se agregó ningún efecto de desaparición al salir de pantalla. El diseño, los recursos y los valores de Sanity se conservan.

## Verificación

- Compilación Next.js correcta; TypeScript y ESLint de los componentes nuevos/modificados comprobados.
- `node scripts/check-media-reveal.mjs`: pasa entrada de imágenes y gráficos, reproducción única, carga tardía, movimiento reducido, cambio de preferencia, fallo de animación y ausencia de observador.
- Navegador local: imágenes de Login cargadas y con estado final opacity 1 / transform none; dos gráficos con barras visibles y altura de 300 px.
- Buscador: tres gráficos renderizados.
- APV en 390 px: gráfico con dos barras, altura de 300 px y sin desbordamiento horizontal.
- Sobre mí: retrato con nueva entrada, conservando su proporción y composición.
- La comprobación de movimiento reducido se hizo de forma automatizada con preferencia simulada; no se modificó la configuración del usuario.

Capturas: `output/animation-review/charts-desktop.png` e `image-desktop.png`.

No se modificó Sanity. Sin push, publicación ni despliegue.
