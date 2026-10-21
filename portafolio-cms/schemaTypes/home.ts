import {defineType, defineField} from 'sanity'
const text = (name: string, title: string, long = false) => defineField({name, title, type: long ? 'text' : 'string', ...(long ? {rows: 3} : {})})
export default defineType({
  name: 'home', title: 'Inicio', type: 'document',
  fields: [
    text('identity', 'Identificación y rol'), text('headline', 'Titular principal'),
    text('headlineAccent', 'Cierre destacado del titular'), text('description', 'Propuesta de valor', true),
    text('differentiator', 'Diferenciador'), text('primaryLabel', 'Acción principal'), text('aboutLabel', 'Etiqueta Sobre mí'),
    text('workLabel', 'Etiqueta Trabajo'), text('workTitle', 'Título de proyectos'), text('workIntro', 'Introducción de proyectos', true),
    defineField({name:'projects', title:'Proyectos destacados', type:'array', description:'Arrastra para cambiar el orden. El primero se destaca en escritorio. Los textos solo cambian la tarjeta del inicio.', validation:r=>r.required().length(3), of:[{type:'object', name:'homeProject', fields:[
      defineField({name:'case', title:'Caso existente', type:'reference', to:[{type:'case'}], validation:r=>r.required()}),
      text('title','Título de tarjeta'), text('context','Contexto'), text('summary','Bajada'), text('description','Descripción',true), text('contribution','Contribución'), text('linkLabel','Nombre descriptivo del enlace'),
      defineField({name:'image',title:'Imagen alternativa para el inicio',description:'Opcional. Si se omite se usa la miniatura del caso. Usa capturas reales.',type:'image',options:{hotspot:true},fields:[text('alt','Texto alternativo')]}),
    ], preview:{select:{title:'title', media:'image'}}}]}),
    text('processLabel','Etiqueta Proceso'), text('processTitle','Título de forma de trabajo'),
    defineField({name:'steps',title:'Forma de trabajo',type:'array',validation:r=>r.required().length(3),of:[{type:'object',name:'homeStep',fields:[text('title','Título'),text('description','Descripción',true)]}]}),
    defineField({name:'about',title:'Presentación existente',description:'Reutiliza su fotografía y CV.',type:'reference',to:[{type:'sobreMi'}],validation:r=>r.required()}),
    text('aboutTitle','Título de presentación'),text('aboutText','Presentación',true),text('aboutLinkLabel','Enlace a Sobre mí'),text('cvLabel','Etiqueta CV'),
    defineField({name:'contact',title:'Datos de contacto existentes',description:'Reutiliza correo y LinkedIn del pie de página.',type:'reference',to:[{type:'footer'}],validation:r=>r.required()}),
    text('contactLabel','Etiqueta Contacto'),text('contactTitle','Título de contacto'),text('contactText','Invitación de contacto',true),text('emailLabel','Acción de correo'),text('linkedinLabel','Acción LinkedIn'),
    text('seoTitle','Título SEO'),text('seoDescription','Descripción SEO',true),
  ],preview:{select:{title:'seoTitle'}}
})
