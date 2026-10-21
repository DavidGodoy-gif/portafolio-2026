> Estado actualizado: la propuesta ya está guardada en borradores de Sanity y el frontend lee el CMS. Este informe conserva la revisión visual histórica. Consulta [CMS-INTEGRATION-REVIEW.md](CMS-INTEGRATION-REVIEW.md).

# Revisión local del inicio

Vista: http://127.0.0.1:3000/

Desde `portfolio`, ejecutar `npm run dev -- --hostname 127.0.0.1` si el servidor ya no está activo. En desarrollo, la propuesta editorial se muestra por defecto en `/`, también al regresar desde el logo o la navegación. `?preview=local` sigue funcionando; `?preview=published` permite comparar con el contenido publicado. Draft Mode tiene prioridad para revisar borradores reales. En producción no se carga la propuesta local. Se resuelven referencias, imágenes, fotografía, CV, correo y LinkedIn desde el dataset público real. La banda de estado distingue esta propuesta de un borrador guardado.

## Sanity

Proyecto: `lia9s4dq`. Dataset: `production`.

Nuevo singleton `home`, editable desde **Inicio** en Studio. Incluye identificación, titular y acento, propuesta, diferenciador, etiquetas de acciones, proyectos ordenables, proceso, presentación, contacto y SEO. Las tarjetas referencian los casos existentes y tienen textos de presentación independientes. La imagen opcional permite alt, crop y hotspot; de lo contrario se usa la miniatura existente. Presentación y contacto reutilizan documentos `sobreMi` y `footer`.

No se han escrito ni publicado documentos remotos: no hay `SANITY_API_WRITE_TOKEN` disponible. El contenido propuesto está en `portfolio/content/home.json`, no en los componentes.

Carga reproducible, desde `portfolio`, con una credencial de editor ya configurada en el entorno:

```powershell
node --use-system-ca scripts/prepare-home-draft.mjs
```

El script verifica las referencias y crea únicamente `drafts.home`. Si ya existe `home` o `drafts.home`, conserva el documento y no sobrescribe cambios editoriales. Nunca publica. No modifica casos, documentos compartidos ni assets.

## Vista previa de borradores reales

Configurar solo en el servidor `SANITY_API_READ_TOKEN` (lector) y `SANITY_PREVIEW_SECRET` (secreto aleatorio). No usar variables NEXT_PUBLIC para estas credenciales. Visitar `/api/preview?secret=<secreto>` para habilitar la cookie de Draft Mode y abrir `/`. Salir con `/api/preview/exit`. La vista previa usa perspectiva `drafts`, sin CDN, sin caché e indica su estado. La propuesta local no requiere estas credenciales y no demuestra que exista un borrador remoto.

Sin configuración, `/api/preview` devuelve 503. Una credencial de vista previa inválida devuelve 401. El contenido publicado se consulta independientemente; mientras no exista un documento `home` publicado, el inicio conserva su implementación anterior. Antes de un despliegue autorizado deben coordinarse el borrador revisado y el código; este trabajo no realiza ninguno de esos pasos finales.

## Verificación realizada

- TypeScript frontend y CMS: correcto.
- Compilación de Next.js: correcta, incluidas rutas de vista previa.
- Compilación de Sanity Studio: correcta. El CLI advierte que Studio tiene autoactualizaciones y la versión remota difiere de la instalada; no se cambiaron dependencias.
- 360, 390, 768, 1024 y 1440 px: ningún elemento del inicio desborda horizontalmente.
- Un H1 y jerarquía H2/H3; enlaces descriptivos; foco visible; salto al contenido y movimiento reducido.
- Menú móvil: apertura, estado aria-expanded y cierre con Escape verificados.
- Imágenes cargadas; fotografía y CV existentes reutilizados. APV usa un recorte de la captura «Antes vs Después» del caso, sin recrear interfaces ni datos.
- HTTP 200: propuesta local, los tres casos, listado de casos y Sobre mí.
- Correo y LinkedIn coinciden con el documento footer. Los enlaces de CV apuntan al PDF existente en Sanity.
- Pendiente: crear y revisar un borrador remoto autenticado, incluyendo su vista previa. No verificado sin credenciales.

Capturas: `output/home-redesign/desktop-1440.png`, `desktop-projects-1440.png` y `mobile-390.png`.

No se hizo push, publicación de contenido ni despliegue.
