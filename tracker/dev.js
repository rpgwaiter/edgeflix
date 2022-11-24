import { Miniflare } from 'miniflare'
import fetch from 'cross-fetch'
import * as dotenv from 'dotenv'

dotenv.config({ path: '../.env' })

globalThis.fetch = fetch

const { PORT = 8787 } = process.env

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
