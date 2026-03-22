import portableBodyBlocks from "./portableBodyBlocks";

export default {
  name: "sobreMi",
  title: "Sobre mí",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Título de la página",
      type: "string",
    },
    {
      name: "content",
      title: "Contenido",
      type: "array",
      of: portableBodyBlocks,
    },
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }: { title?: string }) {
      return {
        title: title || "Sobre mí",
      };
    },
  },
};
