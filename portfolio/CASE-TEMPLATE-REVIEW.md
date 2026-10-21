# Plantilla global de casos — revisión local

## Implementación

La ruta común `app/casos/[slug]/page.tsx` sirve todos los documentos publicados de tipo `case`, sin listas de proyectos ni condiciones por slug. Los casos nuevos reciben la misma presentación automáticamente.

- Cabecera con `title`, `excerpt`, `problem` e imagen existente. Los campos ausentes no generan secciones vacías. No se extraen ni deducen responsabilidades del texto.
- Contenido `process` en el orden original mediante el renderizador Portable Text compartido, en modo `article`. Sobre mí conserva su modo anterior. Se omiten únicamente párrafos vacíos de presentación; no se reescribe el documento.
- Imágenes sin recorte destructivo, proporciones reservadas y enlace para ampliarlas. Captions en magenta; navegación y enlaces en cian. Comparaciones contenidas en imágenes se muestran con sus assets originales.
- Se reutilizan los renderizadores de tablas, gráficos, código, Mermaid, PDF y embeds. Las tablas y el código tienen desplazamiento interno en pantallas pequeñas.
- Índice desde los encabezados reales de Portable Text, respetando su jerarquía, con IDs basados en las claves de los bloques. Encabezados repetidos tienen destinos distintos. Un eventual H1 interno se presenta como H2 para mantener un solo H1 de página.
- Índice lateral con solo encabezados principales y desplazamiento propio en escritorio; desplegable nativo con la jerarquía completa en móvil. Los enlaces del índice desplazan explícitamente la página con window.scrollTo y actualizan el hash sin el salto inmediato del ancla. Se respeta el espacio del header y movimiento reducido. Se retiró la regla de scroll suave del panel lateral. Pendiente de verificación visual en navegador. El índice se omite cuando no hay encabezados.
- Metadatos SEO desde el documento. Las métricas raíz, cuando existen, se muestran con sus etiquetas y valores exactos, sin añadir unidades ni inferir resultados.
- Los casos inexistentes utilizan `notFound()`.

## Orden de navegación

`order` ascendente (el esquema existente define menor número = mayor prioridad), seguido por `slug.current` ascendente y `_id` ascendente. Valores de `order` ausentes se sitúan al final. Los empates de prioridad se resuelven de forma estable, sin depender de fechas de edición.

Orden publicado consultado durante esta revisión:

1. `/casos/login-and-cambio-de-clave` — order 0.
2. `/casos/sistema-de-componentes` — order 1.
3. `/casos/buscador-afp-modelo` — order 2.
4. `/casos/emails-santander` — order 2.
5. `/casos/factor-de-sensibilidad-apv` — order 2.

La consulta de navegación incluye todos los documentos con slug definido. No se alteró el listado de proyectos.

## Verificación

- Compilación de Next.js: correcta.
- TypeScript: correcto.
- ESLint de la ruta común, índice y utilidades nuevas: correcto.
- Script reproducible de solo lectura: `node --use-system-ca scripts/check-case-template.mjs`, ejecutado desde `portfolio`.
- Cinco rutas con HTTP 200 y un único H1.
- Índices: Login 21 encabezados; Sistema 30; Buscador 30; Emails 24; APV 17. Todos sus destinos existen en el HTML servido.
- Anterior/siguiente verificado para toda la secuencia, incluidos los extremos.
- Pruebas adicionales de encabezados repetidos, claves ausentes, H1 interno y documento sin encabezados: correctas.
- Home, listado y Sobre mí: HTTP 200 y sin adoptar la plantilla de artículo.

## Limitaciones pendientes

La herramienta de navegador rechazó el acceso a la pestaña local por su política de acceso. No se intentó eludir el bloqueo. Por tanto, esta entrega NO acredita revisión visual desktop/mobile, carga cliente de Mermaid/gráficos, ni capturas nuevas. Las reglas responsive están implementadas, pero falta verificarlas visualmente en los cinco casos.

El servidor previo ya no respondía; se reactivó el mismo proyecto y puerto `http://127.0.0.1:3000`.

PDF y embeds conservan sus renderizadores, pero no aparecen en los cinco documentos publicados consultados; no se añadieron bloques ficticios para probarlos. Su funcionamiento depende también de permisos de incrustación y del visor del navegador.

Observaciones editoriales para una fase posterior (sin cambios en Sanity):

- Las métricas raíz del Buscador no especifican unidades ni período; se mantienen literalmente.
- El título de un gráfico APV contiene «Taza de retención en minutos / simulador de pensiones». Se mantiene el texto original para revisión editorial.
- Los encabezados incluyen frases largas, mayúsculas y saltos de línea originales. El índice los usa sin resumirlos ni inventar etiquetas.
- Algunas comparaciones son imágenes compuestas: en móvil puede ser necesario abrirlas para leer el detalle. No se separaron ni recrearon sus contenidos.

No se modificaron documentos, borradores, assets ni esquemas de Sanity durante esta ampliación. Los cambios previos de Sanity que ya estaban en el directorio de trabajo pertenecen a la tarea anterior y se conservaron. Sin push, publicación ni despliegue.
