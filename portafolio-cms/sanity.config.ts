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
            ...S.documentTypeListItems().filter((item) => item.getId() !== 'skillCategory'),
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
  },
})
