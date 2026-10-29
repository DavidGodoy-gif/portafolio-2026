// Accept only Sanity image asset IDs, including expanded assets returned by GROQ.
// An alt/crop/hotspot object alone is not an image source.
export function hasImageAsset(image: unknown): boolean {
  if (!image || typeof image !== 'object' || !('asset' in image)) return false
  const asset = image.asset
  if (!asset || typeof asset !== 'object') return false
  const id = ('_ref' in asset && asset._ref) || ('_id' in asset && asset._id)
  if (typeof id !== 'string') return false
  const match = /^image-[a-zA-Z0-9]+-([1-9]\d*)x([1-9]\d*)-[a-zA-Z0-9]+$/.exec(id)
  return !!match && Number.isSafeInteger(Number(match[1])) && Number.isSafeInteger(Number(match[2]))
}
