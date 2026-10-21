import {defineField} from 'sanity'
const text=(name:string,title:string,long=false)=>defineField({name,title,type:long?'text':'string',...(long?{rows:3}:{})})
export default defineField({
 name:'presentation',title:'Presentación editorial',type:'object',
 description:'Contenido del diseño actual de Sobre mí. La fotografía y el CV se reutilizan del contenido existente de este documento. Los campos vacíos son opcionales.',
 fields:[
  text('label','Etiqueta de página'),text('identity','Identificación y rol'),
  defineField({name:'headline',title:'Titular principal',type:'string',validation:r=>r.required()}),
  text('headlineAccent','Cierre destacado del titular'),text('description','Presentación breve',true),text('workLabel','Acción Ver mi trabajo'),text('cvLabel','Acción Ver CV'),
  text('experienceLabel','Etiqueta Experiencia'),text('experienceTitle','Título de experiencia'),text('experienceText','Texto de experiencia',true),text('contributionTitle','Título del aporte'),
  defineField({name:'contributions',title:'Aportes',type:'array',of:[{type:'string'}],description:'Se muestran en el orden de esta lista.'}),
  text('projectsLabel','Etiqueta Trabajo destacado'),text('projectsTitle','Título de proyectos'),text('caseAction','Texto visible del enlace a casos'),
  defineField({name:'projects',title:'Proyectos de respaldo',type:'array',description:'Referencias a casos existentes. Los textos solo afectan Sobre mí. Arrastra para cambiar el orden.',of:[{type:'object',name:'aboutProject',fields:[
   defineField({name:'case',title:'Caso existente',type:'reference',to:[{type:'case'}],validation:r=>r.required()}),text('context','Contexto'),text('title','Título de presentación'),text('description','Descripción breve',true),text('linkLabel','Nombre accesible del enlace'),
  ],preview:{select:{title:'title'}}}]}),
  text('criteriaLabel','Etiqueta Criterio'),text('criteriaTitle','Título de criterios'),
  defineField({name:'criteria',title:'Criterios de decisión',type:'array',of:[{type:'object',name:'aboutCriterion',fields:[text('title','Título'),text('description','Descripción',true)]}]}),
  text('differentiatorLabel','Etiqueta del diferenciador'),text('differentiatorTitle','Título del diferenciador'),text('differentiatorText','Descripción del diferenciador',true),
  text('contactLabel','Etiqueta Contacto'),text('contactTitle','Título de contacto'),text('contactText','Texto de contacto',true),text('emailLabel','Acción de correo'),text('linkedinLabel','Acción LinkedIn'),
  defineField({name:'contact',title:'Datos de contacto verificados',description:'Reutiliza correo y LinkedIn del pie de página. No duplica los datos.',type:'reference',to:[{type:'footer'}],validation:r=>r.required()}),
  text('seoTitle','Título SEO'),
 ]
})
