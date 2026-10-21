import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import {homePatch,aboutPatch} from './editorial-patch.mjs'
const home=JSON.parse(await readFile(new URL('../content/home.json',import.meta.url),'utf8'))
const about=JSON.parse(await readFile(new URL('../content/about.json',import.meta.url),'utf8'))
const image={asset:{_ref:'preserved-image'},crop:{left:0.2},alt:'Preservado'}
const priorHome={_id:'drafts.home',_type:'home',unknown:'keep',about:home.about,contact:home.contact,projects:[{...home.projects[0],_key:'existing-key',title:'Anterior',image,unknown:'keep-project'},{_key:'extra',case:{_ref:'another-case'},title:'Otro'}],steps:[{_key:'understand',title:'Anterior',extra:'keep-step'}]}
const patch=homePatch(priorHome,home)
assert.equal(patch.projects[0].title,home.projects[0].title)
assert.equal(patch.projects[0]._key,'existing-key')
assert.deepEqual(patch.projects[0].image,image)
assert.equal(patch.projects[0].unknown,'keep-project')
assert.equal(patch.projects.at(-1).title,'Otro')
assert.equal(patch.steps[0].extra,'keep-step')
assert.deepEqual(patch.about,priorHome.about)
assert.deepEqual(patch.contact,priorHome.contact)
assert.equal(Object.hasOwn(patch,'unknown'),false,'patch must not touch unrelated root fields')
assert.deepEqual(homePatch({...priorHome,...patch},home),patch,'repeated execution must be idempotent')
const oldContent=[{_key:'photo',_type:'image',asset:{_ref:'photo'}},{_key:'cv',_type:'pdfBlock',file:{asset:{_ref:'cv'}}}]
const priorAbout={_id:`drafts.${about.aboutRef}`,_type:'sobreMi',title:'Sobre mí',content:oldContent,presentation:{unknown:'keep',projects:[{_key:'keep-key',case:{_ref:about.projects[0].caseRef},unknown:'keep-row'}],contact:{_type:'reference',_ref:about.contactRef}}}
const aboutResult=aboutPatch(priorAbout,about)
assert.equal(aboutResult.presentation.unknown,'keep')
assert.equal(aboutResult.presentation.projects[0]._key,'keep-key')
assert.equal(aboutResult.presentation.projects[0].unknown,'keep-row')
assert.equal(aboutResult.presentation.headline,about.headline)
assert.deepEqual(priorAbout.content,oldContent)
assert.deepEqual(Object.keys(aboutResult),['presentation'])
assert.deepEqual(aboutPatch({...priorAbout,...aboutResult},about),aboutResult)
assert.equal(new Set(aboutResult.presentation.projects.map(p=>p.case._ref)).size,about.projects.length)
console.log('Passed: text replacement, preservation of images/references/unknown fields/legacy content, deterministic keys, no duplicates and idempotent merges.')
