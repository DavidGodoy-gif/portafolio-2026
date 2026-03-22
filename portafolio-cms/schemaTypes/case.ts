import portableBodyBlocks from "./portableBodyBlocks";

export default {
  name: "case",
  title: "UX Case",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Título",
      type: "string",
    },
    {
      name: "order",
      title: "Orden (prioridad)",
      type: "number",
      description: "Menor número = más arriba",
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
      },
    },
    {
      name: "excerpt",
      title: "Descripción corta",
      type: "text",
    },
    {
      name: "thumbnail",
      title: "Imagen miniatura",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          title: "Texto alternativo",
          type: "string",
        },
      ],
    },
    {
      name: "problem",
      title: "Problema",
      type: "text",
    },
    {
      name: "process",
      title: "Proceso UX",
      type: "array",
      of: portableBodyBlocks,
    },
    {
      name: "metrics",
      title: "Métricas destacadas",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "label",
              title: "Etiqueta",
              type: "string",
            },
            {
              name: "value",
              title: "Valor",
              type: "number",
            },
          ],
        },
      ],
    },
  ],
};