import { Miniflare } from 'miniflare'
import { CrossKV } from 'cross-cf'
import fetch from 'cross-fetch'
import * as dotenv from 'dotenv'

dotenv.config({ path: '../.env' })

globalThis.fetch = fetch

const { PORT = 8787, EDGEFLIX_KV_ID } = process.env

const EDGEFLIX_KV = EDGEFLIX_KV_ID
  ? new CrossKV('EDGEFLIX-KV-TESTING', { target: 'remote', kvID: EDGEFLIX_KV_ID })
  : undefined

if (!EDGEFLIX_KV) {
  throw new Error('KV is not setup properly. Be sure your Cloudflare credentials are in your env as mentioned in the readme.')
}

const mf = new Miniflare({
  name: 'edgeflix-tracker',
  sourceMap: true,
  modules: true,
  scriptPath: './dist/worker.js',
  buildCommand: 'npm run build',
  port: PORT,
  wranglerConfigPath: './wrangler.toml',
  kvPersist: true,
  r2Persist: true
})

export async function main () {
  await mf.startServer()
  console.log(`Edgeflix tracker dev server is live @ http://localhost:${PORT}`)
}
main()
