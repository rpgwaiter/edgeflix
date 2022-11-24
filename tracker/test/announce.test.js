import { describe, it, expect, test, beforeAll, afterAll, beforeEach, vi } from 'vitest'
import createTorrent from 'create-torrent'
import * as dotenv from 'dotenv'
import { readFile, writeFile } from 'fs/promises'
import parseTorrent from 'parse-torrent'
import WebTorrent from 'webtorrent'
import { Miniflare } from 'miniflare'
import announce from '../src/announce.ts'

dotenv.config({ path: '../.env' })

const peers = []

const { CLOUDFLARE_API_TOKEN, EDGEFLIX_KV_ID, NODE_ENV } = process.env

const EDGEFLIX_KV = NODE_ENV === 'test'
  ? {
      list: async () => ({ keys: [{ name: 'torrents:016473599954c2357a2fe311e33826053320da2b:peers:192.192.192.192' }] }),
      get: async () => '{ "value": "{}" }',
      put: async (k, v) => true // TODO: somethin?
    }
  : CLOUDFLARE_API_TOKEN ? (new CrossKV('EDGEFLIX_KV', { target: 'remote', kvID: EDGEFLIX_KV_ID })) : {}


const mf = new Miniflare({
  name: 'edgeflix-tracker-tester',
  sourceMap: true,
  modules: true,
  scriptPath: './dist/worker.js',
  buildCommand: 'npm run build',
  port: 42069,
  wranglerConfigPath: false,
  bindings: { EDGEFLIX_KV },
  globals: { EDGEFLIX_KV },
  kvPersist: true
})

const torrentClient = new WebTorrent()

beforeAll(async () => {
  await mf.startServer()
})

// beforeEach(async () => {
//   torrentClient.destroy()
// })

afterAll(async () => {
  await mf.dispose()
})

describe('Tracker: /announce', async () => {
  const torrent = await new Promise((resolve) =>
    readFile('test/mti.jpg')
      .then(f => createTorrent(f, { announceList: [['http://localhost:42069/announce']] }, (_, t) => resolve(t)))
  ).then(r => parseTorrent(r))

  expect(torrent).toBeDefined()

  // TODO: finish this
  it('Can register a torrent', () => {
    expect(1).toEqual(1)
  })
})
