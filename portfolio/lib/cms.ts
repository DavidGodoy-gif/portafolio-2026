import 'server-only'
import './trust-system-ca'
import {draftMode} from 'next/headers'
import {client} from './sanity'
import {cliSessionToken} from '../scripts/editorial-session.mjs'

export function getContentToken() {
  return process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN
    || (process.env.NODE_ENV === 'development' && process.env.SANITY_USE_CLI_SESSION === '1' ? cliSessionToken() : undefined)
}
export async function getContentContext(published=false) {
  const drafts=(await draftMode()).isEnabled || (process.env.NODE_ENV==='development'&&!published)
  const token=getContentToken()
  return {
    drafts,
    available:!drafts || !!token,
    reader:drafts ? (token ? client.withConfig({token,perspective:'drafts',apiVersion:'2025-02-19',useCdn:false}) : null) : client.withConfig({perspective:'published'}),
    notice:drafts ? (token ? 'Vista previa · contenido de Sanity' : 'Vista previa de Sanity pendiente: falta una credencial de lectura en el entorno. Se muestra el contenido publicado.') : undefined,
  }
}
