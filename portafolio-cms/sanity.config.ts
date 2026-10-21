import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Portafolio-cms',

  projectId: 'lia9s4dq',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Contenido')
          .items([
            S.listItem().title('Inicio').child(S.document().schemaType('home').documentId('home')),
            S.listItem().title('Sobre mí').child(S.document().schemaType('sobreMi').documentId('88f18267-98ff-476c-88bb-1be7e3250ca9')),
            ...S.documentTypeListItems().filter((item) => !['skillCategory', 'home', 'sobreMi'].includes(item.getId() || '')),
            S.divider(),
            S.listItem()
              .title('Categorías de skills')
              .schemaType('skillCategory')
              .child(
                S.documentTypeList('skillCategory')
                  .title('Categorías de skills')
                  .defaultOrdering([{field: 'order', direction: 'asc'}]),
              ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter((template) => !['home','sobreMi'].includes(template.schemaType)),
  },
  document: {
    actions: (actions, context) => ['home','sobreMi'].includes(context.schemaType)
      ? actions.filter((action) => action.action !== 'duplicate')
      : actions,
    productionUrl: async (previous, {document}) => document._type === 'home'
      ? 'http://127.0.0.1:3000/'
      : document._type === 'sobreMi' ? 'http://127.0.0.1:3000/sobre-mi' : previous,
  },
})
