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
        of: [{ type: "block" }],
      },
      {
        name: "metrics",
        title: "Métricas",
        type: "array",
        of: [
          {
            type: "object",
            fields: [
              { name: "label", type: "string" },
              { name: "value", type: "number" },
            ],
          },
        ],
      },   
    ],
  };
  