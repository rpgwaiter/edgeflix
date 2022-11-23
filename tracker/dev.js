import { Miniflare } from 'miniflare'
import { CrossKV } from 'cross-cf'
import fetch from 'cross-fetch'

globalThis.fetch = fetch

const { PORT = 8787, EDGEFLIX_KV_ID } = process.env

const EDGEFLIX_KV = EDGEFLIX_KV_ID
  ? new CrossKV('EDGEFLIX-KV-TESTING', { target: 'remote', kvID: EDGEFLIX_KV_ID })
  : undefined

if (!EDGEFLIX_KV) {
  throw new error('KV is not setup properly. Be sure your Cloudflare credentials are in your env as mentioned in the readme.')
}

const mf = new Miniflare({
  name: 'store',
  sourceMap: true,
  modules: true,
  scriptPath: './dist/worker.js',
  buildCommand: 'npm run build',
  port: PORT,
  wranglerConfigPath: false,

  bindings: { EDGEFLIX_KV },

  globals: {
    EDGEFLIX_KV
  },

  kvPersist: true,
  doPersist: true
})

async function main () {
  await mf.startServer()
  console.log(`Edgeflix tracker dev server is live @ http://localhost:${PORT}`)
}
main()
