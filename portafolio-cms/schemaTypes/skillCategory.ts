import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'skillCategory',
  title: 'Categorías de skills',
  type: 'document',
  orderings: [
    {
      title: 'Orden de aparición',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Orden',
      description: 'Un número menor aparece primero.',
      type: 'number',
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: 'icon',
      title: 'Icono',
      description: 'Valores permitidos: pen-tool, search, code-2 o box.',
      type: 'string',
      options: {
        list: [
          {title: 'Product Design', value: 'pen-tool'},
          {title: 'Research & Data', value: 'search'},
          {title: 'Frontend', value: 'code-2'},
          {title: 'Product & Delivery', value: 'box'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'skills',
      title: 'Skills',
      type: 'array',
      of: [{type: 'string'}],
      options: {sortable: true},
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'tools',
      title: 'Herramientas',
      type: 'array',
      of: [{type: 'string'}],
      options: {sortable: true},
    }),
    defineField({
      name: 'experienceLevel',
      title: 'Tipo de experiencia',
      type: 'string',
      options: {
        list: [
          {title: 'Aplicada', value: 'applied'},
          {title: 'En proyectos', value: 'project'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'active',
      title: 'Visible en el Home',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      skills: 'skills',
      active: 'active',
    },
    prepare({title, skills, active}: {title?: string; skills?: string[]; active?: boolean}) {
      const count = skills?.length ?? 0
      return {
        title: title || 'Categoría sin título',
        subtitle: `${count} ${count === 1 ? 'skill' : 'skills'} · ${active === false ? 'Inactiva' : 'Activa'}`,
      }
    },
  },
})
