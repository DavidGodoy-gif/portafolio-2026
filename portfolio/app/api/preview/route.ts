import {draftMode} from 'next/headers'
import {NextRequest, NextResponse} from 'next/server'
import {timingSafeEqual} from 'node:crypto'
import {getContentToken} from '@/lib/cms'
export async function GET(req: NextRequest) {
  const expected = process.env.SANITY_PREVIEW_SECRET
  const supplied = req.nextUrl.searchParams.get('secret') || ''
  if (!expected || !getContentToken()) return new NextResponse('Vista previa no configurada', {status:503})
  const a = Buffer.from(expected), b = Buffer.from(supplied)
  if (a.length !== b.length || !timingSafeEqual(a,b)) return new NextResponse('No autorizado',{status:401})
  ;(await draftMode()).enable()
  return NextResponse.redirect(new URL('/',req.url))
}
