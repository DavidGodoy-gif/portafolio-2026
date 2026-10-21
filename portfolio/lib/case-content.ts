export type CaseBlock = {
  _key: string
  _type: string
  style?: string
  children?: {text?: string}[]
  [key: string]: unknown
}
export type CaseHeading = {id: string; text: string; level: number}
export function headingText(block: CaseBlock) {
  return block.children?.map(child => child.text || '').join('').trim() || ''
}
export function headingId(block: {_key?: string}) {
  return `seccion-${encodeURIComponent(block._key || '')}`
}
export function caseOutline(blocks: CaseBlock[]): CaseHeading[] {
  return blocks.flatMap(block => {
    if (block._type !== 'block' || !/^h[1-6]$/.test(block.style || '')) return []
    const text = headingText(block)
    return text ? [{id:headingId(block),text,level:Math.max(2,Number(block.style!.slice(1)))}] : []
  })
}
export function caseBlocks(value: unknown): CaseBlock[] {
  if (!Array.isArray(value)) return []
  return value.filter((b): b is CaseBlock => !!b && typeof b === 'object' && typeof b._type === 'string')
    .map((b,i) => ({...b,_key:b._key || `block-${i}`}))
    .filter(b => b._type !== 'block' || headingText(b).length > 0)
}
