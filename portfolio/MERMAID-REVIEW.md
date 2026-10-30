# Revisión local de Mermaid — 30 de octubre de 2026

Se conservaron el aislamiento de párrafos y el factor de encuadre 0.9 que ya estaban modificados localmente. Se completó el aislamiento dentro del propio SVG mediante `themeCSS`, aplicado tanto durante la medición temporal de Mermaid como en su destino final. Nodos, decisiones y etiquetas de conexiones usan la misma fuente Inter local, tamaño de 16 px e interlineado de 24 px. El render espera la carga de la fuente.

El encuadre usa el viewBox original, sin depender del zoom actual. Se recalcula al cambiar el tamaño disponible. Se corrigió además la altura del wrapper del zoom: antes podía medir 414 px dentro de un espacio real de 337 px y recortar la base del mapa. Ahora queda contenido en el área disponible. Se conservan los controles y el factor 0.9; no se modificaron textos ni diagramas de Sanity.

## Verificación

Siete diagramas publicados, en cinco rutas, comprobados mediante el navegador local a 1440×1000 y 390×844:

- `/casos/login-and-cambio-de-clave`: tres mapas.
- `/casos/factor-de-sensibilidad-apv`: un mapa.
- `/casos/buscador-afp-modelo`: un mapa.
- `/casos/sistema-de-componentes`: un mapa.
- `/casos/formularios-digitalizados`: un mapa con decisión y conexiones etiquetadas.

Se compararon las dimensiones renderizadas de cada etiqueta con el ancho y alto de su foreignObject, compensando la escala. Ninguna desborda con tolerancia de 1 px. Todos los SVG caben en el visor al cargar. Emails Santander no contiene Mermaid en el documento publicado consultado.

También se probó un ejemplo temporal de frases largas en nodos, rombo de decisión y conexiones. Las alturas calculadas de 48, 72 y 96 px coinciden con el texto final. Se retiró la ruta temporal de prueba después de verificarla. No se acortaron frases.

Evidencias en `output/mermaid-review/`: `verification.json`, `long-labels.json`, capturas de escritorio y móvil y comprobación de controles. Estos archivos permanecen locales.

TypeScript y `git diff --check` pasan. ESLint conserva el error previo `react-hooks/set-state-in-effect` en `setMounted(true)` de PortableCode; no es introducido por la corrección. No se cambió el ciclo de montaje para ocultar ese aviso.

Se reutilizó el servidor activo del puerto 3000. No se borró `.next/dev/lock`, no se cerraron procesos, no se modificó Sanity ni se hizo push o despliegue.

Los mapas extensos se reducen para caber completos en móvil; sus controles de zoom permiten ampliar la lectura. La revisión cubre los siete mapas actuales y el ejemplo de regresión, no todos los futuros tipos de diagrama de Mermaid.
