# Integración editorial con Sanity — completada en borradores

## Destinos y estado

Proyecto: **Portafolio-cms** (`lia9s4dq`). Dataset: **production**.

Creación realizada en una única transacción después del respaldo:

- `drafts.home`, tipo `home`: no existían borrador ni documento Home publicado.
- `drafts.88f18267-98ff-476c-88bb-1be7e3250ca9`, tipo `sobreMi`: no existía borrador; se creó a partir del documento publicado existente.

No se sobrescribió un borrador previo porque ninguno existía. Se aplicaron los textos actuales de la propuesta local a los campos correspondientes. Ningún documento publicado fue sobrescrito o publicado.

## Campos guardados

**Home:** `identity`, `headline`, `headlineAccent`, `description`, `differentiator`, `primaryLabel`, `aboutLabel`, `workLabel`, `workTitle`, `workIntro`, `projects`, `processLabel`, `processTitle`, `steps`, `aboutTitle`, `aboutText`, `aboutLinkLabel`, `cvLabel`, `contactLabel`, `contactTitle`, `contactText`, `emailLabel`, `linkedinLabel`, `seoTitle`, `seoDescription`, `about`, `contact`.

Las tarjetas de `projects` incluyen referencias a los casos existentes y textos propios del Home; sus imágenes y recortes son los de la propuesta revisada. Los casos no se modificaron.

**Sobre mí:** objeto `presentation` con `label`, `identity`, `headline`, `headlineAccent`, `description`, `workLabel`, `cvLabel`, `experienceLabel`, `experienceTitle`, `experienceText`, `contributionTitle`, `contributions`, `projectsLabel`, `projectsTitle`, `caseAction`, `projects`, `criteriaLabel`, `criteriaTitle`, `criteria`, `differentiatorLabel`, `differentiatorTitle`, `differentiatorText`, `contactLabel`, `contactTitle`, `contactText`, `emailLabel`, `linkedinLabel`, `seoTitle` y referencia `contact`.

El documento conserva literalmente `title` y `content`: biografía anterior, imagen con crop/hotspot, CV y otros bloques. Los datos de contacto siguen referenciados desde footer. No se inventó ni completó contenido no definido.

## Copia recuperable

Carpeta: `portfolio/backups/sanity/2026-10-21T19-36-03-804Z/`.

- `before.json`: documentos completos anteriores y assets consultados, documentos publicados de destino y estado de borradores (`previousDrafts: [null, null]`). Se escribió antes de la transacción.
- `after.json`: ambos borradores resultantes e ID de la transacción.
- `verification.json`: campos aplicados y hashes de documentos que debían permanecer intactos.
- `frontend-verification.json`: resultado de la comprobación autenticada de páginas y recursos.
- `validation.ndjson`: copia local usada para validar contra el esquema del Studio.

La carpeta y `.env.local` están excluidos de Git. No contienen la credencial de CLI. Para recuperar el estado previo, la copia permite reconstruir los campos originales; como antes no existían borradores, volver exactamente al estado anterior implica retirar únicamente esos dos borradores, conservando los publicados. Esa reversión no se ha ejecutado. No importar el respaldo completo de forma indiscriminada: contiene publicados como evidencia y no deben sobrescribirse.

## Fuente del frontend y credenciales

`lib/home.ts` y `lib/about.ts` leen de Sanity. Ya no importan `content/home.json` ni `content/about.json`; esos archivos solo quedan como entrada de migración y referencia histórica.

En desarrollo se lee `perspective: drafts`, sin CDN ni caché. El aviso ahora es «Vista previa · contenido de Sanity». Producción usa solo publicados salvo Draft Mode autenticado. `?preview=published` permite comprobar la separación.

Se utilizó la sesión guardada de Sanity CLI después de la autorización explícita del usuario. El helper solo la lee cuando se pasa `--cli-session` a los scripts o, en el frontend, cuando `NODE_ENV=development` y está habilitado `SANITY_USE_CLI_SESSION=1`. `.env.local` guarda únicamente ese indicador, no el token. En producción no se lee la sesión de CLI. Se comprobó que el token no aparece en el HTML servido.

## Studio

Studio local: **http://localhost:3333/**. Ese origen ya estaba autorizado en Sanity; no se ampliaron permisos ni se registró un Studio nuevo.

Los esquemas tienen entradas singleton Inicio y Sobre mí, campos editables para las secciones actuales, referencias a casos y contacto y las validaciones pertinentes. El Studio compila y la validación oficial de Sanity sobre la copia de documentos devuelve **cero errores** (`[]`).

El 21 de octubre de 2026, con autorización del usuario, se desplegó el Studio existente `z6yqizjc9azf9rstxzkl3rah` en https://davidgodoy.sanity.studio/. Despliegue activo: `qsqbuz4c1pl41bh3u41f6v5c`, con un esquema desplegado correctamente para `lia9s4dq/production`. Se corrigió `sanity.cli.ts` para apuntar explícitamente a ese Studio; no se creó otra aplicación. El otro Studio registrado previamente, `david-godoy-portafolio`, no se modificó.

El navegador autenticado muestra las entradas Inicio y Sobre mí y el formulario de Inicio con los textos reales de su borrador. No se hicieron ediciones de prueba ni se pulsó Publicar. Captura: `output/sanity-integration/studio-deployed-home.png`. Después del deploy se repitió la verificación de borradores, recursos, documentos publicados y casos: sin alteraciones; Home y Sobre mí locales devuelven HTTP 200 y coinciden con Sanity.

## Verificado

- Plan autenticado: proyecto, dataset, IDs, tipos, referencias y assets correctos.
- Respaldo antes de escribir, transacción limitada exclusivamente a los dos IDs de borrador y control de revisiones.
- Comparación exacta de todos los campos previstos con los borradores guardados.
- Conservación literal del contenido previo de Sobre mí y de los recursos compartidos.
- Hashes de todos los documentos publicados/de casos/footer consultados: sin cambios.
- Home y Sobre mí: HTTP 200, títulos y textos correspondientes a Sanity, aviso de origen CMS, recursos y slugs resueltos correctamente.
- Vistas publicadas: sin aviso de borradores, separación intacta.
- Vista previa local comprobada en navegador; diseño y animaciones conservados. Sin desbordamiento en el ancho disponible. La herramienta ignoró los cambios de viewport solicitados (reportó 772 px), por lo que no se atribuye a esta ejecución una nueva validación de cinco anchos; las composiciones se verificaron en tareas anteriores.
- TypeScript, ESLint, compilaciones Next.js y Studio y pruebas de conservación/idempotencia: correctos.

Capturas: `output/sanity-integration/home-draft-preview.png`, `home-draft-desktop.png`, `about-draft-desktop.png` y `about-draft-current.png`.

## Pendiente

No falta trasladar textos de las dos propuestas. Los cambios editoriales posteriores se pueden realizar en el Studio local autenticado. Los campos opcionales vacíos se omiten. No se modificaron los textos de los casos ni se agregaron contenidos que no estuvieran definidos.

Los formularios ya pueden editarse también en el Studio alojado actualizado. Publicar borradores y desplegar el frontend requieren autorización posterior. No se hizo push, publicación de documentos ni despliegue del frontend; únicamente se desplegó Sanity Studio por solicitud del usuario.
