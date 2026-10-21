import portableBodyBlocks from "./portableBodyBlocks";
import aboutPresentation from './aboutPresentation';

export default {
  name: "sobreMi",
  title: "Sobre mí",
  type: "document",
  fields: [
    aboutPresentation,
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
