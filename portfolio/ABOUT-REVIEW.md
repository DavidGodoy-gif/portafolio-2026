> Estado actualizado: la propuesta ya está guardada en borradores de Sanity y el frontend lee el CMS. Este informe conserva la revisión visual histórica. Consulta [CMS-INTEGRATION-REVIEW.md](CMS-INTEGRATION-REVIEW.md).

# Sobre mí — propuesta editorial local

Vista: http://127.0.0.1:3000/sobre-mi

## Cambios

Hero editorial con retrato original, identidad Senior Product Designer y acciones a trabajo/CV. Secciones de experiencia y aporte, proyectos en filas numeradas, criterio de diseño en dos columnas, diferenciador técnico y contacto. Mantiene un solo footer y los componentes compartidos de navegación.

Contenido editorial: `portfolio/content/about.json`.
Lectura de recursos: `portfolio/lib/about.ts`.
Presentación: `portfolio/components/AboutPreview.tsx`.
Estilos aislados: `portfolio/app/sobre-mi/about-preview.css`.

La fotografía, su crop/hotspot, el PDF, correo, LinkedIn y slugs de proyectos se resuelven por lectura de referencias existentes de Sanity (`lia9s4dq`, `production`). No se extraen recursos del mockup ni se crean antecedentes profesionales.

## Separación respecto de producción

El router muestra la propuesta solo con `NODE_ENV=development`, sin Draft Mode y sin `?preview=published`, siguiendo el criterio del home local. Incluye el aviso «Vista local · propuesta editorial sin guardar en Sanity» y noindex.

La implementación previa se conserva en `portfolio/components/PublishedAbout.tsx`, que mantiene su consulta y contenido. En producción se utiliza siempre ese renderizador, incluso si la URL lleva `?preview=local`. En desarrollo se puede comparar mediante `/sobre-mi?preview=published`. No se ejecutó ninguna carga o migración a Sanity.

## Verificaciones

- TypeScript, ESLint de archivos nuevos y compilación de Next.js: correctos.
- 360, 390, 768, 1024 y 1440 px: comprobados en navegador; sin desbordamientos horizontales ni elementos del contenido fuera del ancho disponible.
- Un solo H1, encabezados ordenados y fotografía cargada en todos los anchos; encuadre proporcionado.
- Apilado móvil y composición de tablet/escritorio revisados visualmente.
- Menú móvil: abre con aria-expanded; se conserva el comportamiento compartido.
- Navegación real de «Ver mi trabajo» a `/#trabajo`, con ancla a 112 px del borde superior. Regreso a Sobre mí y enlace al caso Login verificados en navegador.
- Todos los enlaces de casos se resuelven desde los documentos originales y conservan nombres accesibles específicos.
- CV apunta al PDF existente; correo y LinkedIn se resuelven desde footer, sin destinos inventados.
- `?preview=published` muestra el renderizador previo y no incluye `.about-preview`.
- Pruebas de regresión existentes: HTTP 200 en home, listado, Sobre mí y los cinco casos; índices y navegación de casos correctos. Los archivos del home, casos y navegación no fueron modificados en esta tarea.

## Capturas

- `output/about-redesign/desktop-1440.png`
- `output/about-redesign/mobile-390.png`
- `output/about-redesign/tablet-1024.png`

Sin cambios a documentos, borradores, assets ni esquemas de Sanity. Sin push, publicaciones ni despliegues. La propuesta está preparada para revisión local; su traslado editorial al CMS queda para una fase posterior.
