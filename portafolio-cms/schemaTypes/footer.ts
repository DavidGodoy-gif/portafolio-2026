export default {
  name: "footer",
  title: "Pie de página",
  type: "document",
  fields: [
    {
      name: "copyrightLine",
      title: "Párrafo (copyright)",
      type: "text",
      rows: 3,
      description: "Texto del pie, ej. © 2026 Nombre. Todos los derechos reservados.",
    },
    {
      name: "linkedinLabel",
      title: "Texto — LinkedIn",
      type: "string",
    },
    {
      name: "linkedinUrl",
      title: "Enlace — LinkedIn (URL)",
      type: "url",
    },
    {
      name: "githubLabel",
      title: "Texto — GitHub",
      type: "string",
    },
    {
      name: "githubUrl",
      title: "Enlace — GitHub (URL)",
      type: "url",
    },
    {
      name: "emailLabel",
      title: "Texto — Correo",
      type: "string",
      description: "Texto visible junto al icono de correo.",
    },
    {
      name: "email",
      title: "Correo (para mailto)",
      type: "string",
      description: "Dirección usada en el enlace mailto:",
    },
    {
      name: "phoneLabel",
      title: "Texto — Teléfono",
      type: "string",
      description: "Texto visible junto al icono.",
    },
    {
      name: "phone",
      title: "Teléfono (para enlace tel:)",
      type: "string",
      description: "Número para el href tel: (puede incluir espacios).",
    },
  ],
  preview: {
    select: {
      copyright: "copyrightLine",
    },
    prepare({
      copyright,
    }: {
      copyright?: string;
    }) {
      return {
        title: "Pie de página",
        subtitle: copyright || "Editar textos y enlaces",
      };
    },
  },
};
