import path from 'path'
import { readdir, stat, lstat } from 'fs/promises'
import Debug from 'debug'
import getFolderSize from 'get-folder-size'
import { CrossKV } from 'cross-cf'

const KV = new CrossKV('edgeflix-kv', {
  target: 'remote'
}) // TODO: DO NOT COMMIT THIS

// Gets the size of the target path, works with files and dirs
export async function getTargetSize (target) {
  const debug = Debug('getTargetSize')
  const isDir = await lstat(target).then(r => r.isDirectory())
  debug(`Target ${`${target}`.green.bold} is${isDir ? '' : ' NOT'} a folder.`)

  return isDir
    ? getFolderSize.loose(target)
    : stat(target).then(r => r.size)
}

// TODO: Add user id as prefix
export async function uploadTorrentToKV(k, v) {
  Debug('uploadTorrentToKV')('Uploading to KV:', k.green.bold)
  return KV.put(encodeURIComponent(k), JSON.stringify(v))
}