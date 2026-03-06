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
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
      },
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
      of: [
        {
          type: "block",
        },
        {
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
            {
              name: "caption",
              title: "Caption",
              type: "string",
            },
          ],
        },
        {
          name: "chartBlock",
          title: "Bloque de gráfico",
          type: "object",
          fields: [
            {
              name: "title",
              title: "Título del gráfico",
              type: "string",
            },
            {
              name: "metrics",
              title: "Métricas",
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
        },
      ],
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