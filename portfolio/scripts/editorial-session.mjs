import {readFileSync} from 'node:fs'
import {homedir} from 'node:os'
import {join} from 'node:path'

// Explicitly authorized CLI-session access. Never log or serialize the credential.
export function cliSessionToken(){
  try{
    const config=JSON.parse(readFileSync(join(homedir(),'.config','sanity','config.json'),'utf8'))
    return typeof config.authToken==='string' ? config.authToken : undefined
  }catch{return undefined}
}
export function editorialToken(){
 return process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN
   || (process.argv.includes('--cli-session') ? cliSessionToken() : undefined)
}
