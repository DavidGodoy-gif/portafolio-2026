// Pure merge functions. Never rewrite existing case documents, resources or unrelated fields.
export function mergeRows(existing=[],incoming=[],reference=false){
 const used=new Set()
 const rows=incoming.map((row,index)=>{
  const match=existing.findIndex((old,i)=>!used.has(i)&&(reference?old.case?._ref===row.case?._ref:old._key===row._key))
  const selected=match>=0?match:(!reference&&existing[index]&&!used.has(index)?index:-1)
  const prior=selected>=0?existing[selected]:{}
  if(selected>=0)used.add(selected)
  const merged={...prior,...row,_key:prior._key||row._key}
  for(const field of ['case','image','asset','crop','hotspot'])if(Object.hasOwn(prior,field))merged[field]=prior[field]
  return merged
 })
 return [...rows,...existing.filter((_,index)=>!used.has(index))]
}
export function homePatch(existing,seed){
 const {_id,_type,projects,steps,about,contact,...texts}=seed
 return {...texts,projects:mergeRows(existing?.projects,projects,true),steps:mergeRows(existing?.steps,steps),about:existing?.about||about,contact:existing?.contact||contact}
}
export function aboutPatch(existing,seed){
 const {aboutRef,contactRef,projects,criteria,contributions,...texts}=seed
 const prior=existing?.presentation||{}
 return {presentation:{...prior,...texts,_type:prior._type||'presentation',
  contact:prior.contact||{_type:'reference',_ref:contactRef},
  contributions:[...contributions,...(prior.contributions||[]).slice(contributions.length)],
  projects:mergeRows(prior.projects,projects.map((p,i)=>{const {caseRef,...text}=p;return {...text,_key:`about-project-${i+1}`,_type:'aboutProject',case:{_type:'reference',_ref:caseRef}}}),true),
  criteria:mergeRows(prior.criteria,criteria.map((c,i)=>({...c,_key:`criterion-${i+1}`,_type:'aboutCriterion'}))),
 }}
}
