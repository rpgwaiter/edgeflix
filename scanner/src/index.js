import createTorrent from 'create-torrent'
import 'colors'
import { getTargetSize, uploadTorrentToKV } from './lib.js'
import Debug from 'debug'
import { readdir } from 'fs/promises'
import { program } from 'commander'
import path from 'path'
import pify from 'pify'
import parseTorrent from 'parse-torrent'

// Returns a buffer containing a .torrent file
export async function makeTorrent (target) {
  Debug('makeTorrent')('Making torrent:', `${target}`.green.bold)
  return pify(createTorrent)(target, { private: true, announceList: [] })
}

// Makes torrent files from all children of target
export async function makeTorrentsFromParent (target) {
  const debug = Debug('makeTorrentsFromParent')
  console.log('Making Torrent(s) from the contents of:', `${target}`.green.bold)
  const parentSize = await getTargetSize(target)
  debug('Total Size:', `${(parentSize / (1024 * 1024)).toFixed(1)}M`.green.bold)
  const TorrentCount = await readdir(target).then(r => r.length)
  debug('Total Torrents to be made:', `${TorrentCount}`.green.bold)
  const mainlist = await readdir(target).then(i => i.map(o => path.join(target, o)))

  mainlist.forEach(async item => {
    const torrent = await makeTorrent(item)
    const torrentInfo = parseTorrent(torrent)
    const name = torrentInfo.name
    delete torrentInfo.name
    uploadTorrentToKV(name, {
      originator: 'rpgwaiter', // TODO: user stuff
      ...torrentInfo
    })
  })
}


program
  .name('edgeflix scanner')
  .description('CLI to add content to edgeflix instance')
  .version('0.0.0')

program.command('parent')
  .description('Make torrents for all items in the provided path (1 layer deep)')
  .argument('<string>', 'path to content')
  // .option('--first', 'display just the first substring')
  // .option('-s, --separator <char>', 'separator character', ',')
  .action((path, options) => {
    // const limit = options.first ? 1 : undefined
    // console.log(str.split(options.separator, limit))
    makeTorrentsFromParent(path)
  })

program.parse()
