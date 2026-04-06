/** Subconjunto del builder de validación de Sanity (sin importar el paquete `sanity`). */
type SanityValidationChain = {
  error: (message: string) => SanityValidationChain;
};

type SanityFileFieldRule = {
  required: () => SanityValidationChain;
};

/** Mismos bloques que el campo `process` de UX Case — compartido con Sobre mí. */
export default [
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
  {
    name: "tableBlock",
    title: "Tabla",
    type: "object",
    preview: {
      select: {
        title: "title",
      },
      prepare({ title }: { title?: string }) {
        return {
          title: title || "Tabla",
          subtitle: "Tabla de datos",
        };
      },
    },
    fields: [
      {
        name: "title",
        title: "Título de la tabla",
        type: "string",
      },
      {
        name: "headers",
        title: "Encabezados",
        type: "array",
        of: [{ type: "string" }],
      },
      {
        name: "rows",
        title: "Filas",
        type: "array",
        of: [
          {
            type: "object",
            fields: [
              {
                name: "cells",
                title: "Celdas",
                type: "array",
                of: [{ type: "string" }],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "embedBlock",
    title: "Embed",
    type: "object",
    preview: {
      select: {
        title: "title",
        url: "url",
      },
      prepare({ title, url }: { title?: string; url?: string }) {
        return {
          title: title || "Embed",
          subtitle: url || "Sin URL",
        };
      },
    },
    fields: [
      {
        name: "title",
        title: "Título",
        type: "string",
      },
      {
        name: "url",
        title: "URL del embed",
        type: "url",
      },
    ],
  },
  {
    name: "pdfBlock",
    title: "Archivo PDF",
    type: "object",
    preview: {
      select: {
        title: "title",
        filename: "file.asset.originalFilename",
      },
      prepare({
        title,
        filename,
      }: {
        title?: string;
        filename?: string;
      }) {
        return {
          title: title || "PDF",
          subtitle: filename || "Sin archivo",
        };
      },
    },
    fields: [
      {
        name: "title",
        title: "Título o descripción",
        type: "string",
        description: "Texto que verá el visitante encima del documento.",
      },
      {
        name: "file",
        title: "PDF",
        type: "file",
        options: {
          accept: ".pdf",
        },
        validation: (rule: SanityFileFieldRule) =>
          rule.required().error("Sube un archivo PDF"),
      },
    ],
  },
  {
    name: "codeBlock",
    title: "Código",
    type: "object",
    preview: {
      select: {
        title: "title",
        language: "language",
      },
      prepare({
        title,
        language,
      }: {
        title?: string;
        language?: string;
      }) {
        return {
          title: title || "Código",
          subtitle: language || "Sin lenguaje",
        };
      },
    },
    fields: [
      {
        name: "title",
        title: "Título",
        type: "string",
      },
      {
        name: "language",
        title: "Lenguaje",
        type: "string",
        options: {
          list: [
            { title: "HTML", value: "html" },
            { title: "CSS", value: "css" },
            { title: "JavaScript", value: "javascript" },
            { title: "TypeScript", value: "typescript" },
            { title: "JSON", value: "json" },
            { title: "Mermaid", value: "mermaid" },
            { title: "Vue.js", value: "VueJs" },
          ],
        },
      },
      {
        name: "code",
        title: "Código",
        type: "text",
      },
    ],
  },
];
