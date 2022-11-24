import { Buffer } from 'buffer'
import { encode } from '../lib/bencode'


export default async function announce (request: Request, env) {
  const url = new URL(request.url)

  const DEFAULT_ANNOUNCE_PEERS = env.DEFAULT_ANNOUNCE_PEERS || 25 // Default peers if unspecified by client
  const DEFAULT_PEER_TTL = env.DEFAULT_PEER_TTL || 360 // Time in seconds to keep peer in KV
  const MAX_ANNOUNCE_PEERS = env.MAX_ANNOUNCE_PEERS || 82 // Max amount of peers to send to a client

  const params = url.searchParams
  const headers = request.headers

  const data = {
    compact: Number(params.get('compact')) || 0,
    info_hash: params.get('info_hash')?.length === 19
      ? Buffer.from(String(params.get('info_hash')), 'binary').toString('hex')
      : null,
    ip: headers.get('x-forwarded-for') || headers.get('CF-Connecting-IP'),
    left: Number.isNaN(params.get('left')) ? Infinity : Number(params.get('left')),
    numwant: Math.min((Number(params.get('numwant')) || DEFAULT_ANNOUNCE_PEERS), MAX_ANNOUNCE_PEERS),
    peer_id: params.get('peer_id') && Buffer.from(String(params.get('peer_id')), 'binary')?.toString('hex'),
    port: Number(params.get('port')),
    addr: '',
    headers,
    failure_reason: null
  }

  if (!data.info_hash) {
    data.failure_reason = data.failure_reason ? `${data.failure_reason} | invalid info_hash` : 'invalid info_hash'
  }

  if (typeof params.get('peer_id') !== 'string' || params.get('peer_id').length !== 20) {
    data.failure_reason = data.failure_reason ? `${data.failure_reason} | invalid peer_id` : 'invalid peer_id'
  }

  if (!params.get('port')) {
    data.failure_reason = data.failure_reason ? `${data.failure_reason} | invalid port` : 'invalid port'
  }

  data.addr = `${/^[\da-fA-F:]+$/.test(data.ip) ? `[${data.ip}]` : data.ip}:${data.port}`

  const ret = {
    complete: 0,
    incomplete: 0,
    peers: []
  }

  if (data.failure_reason) {
    // TODO: use 'debug'
    console.warn('Failure exit')

    return new Response(encode({ ...ret, failure_reason: data.failure_reason }), {
      headers: { 'content-type': 'application/json' }
    })
  }

  delete data.failure_reason

  await env.EDGEFLIX_KV.put(`torrents:${data['info_hash']}:peers:${data.ip}`, JSON.stringify(data))

  const peers = await env.EDGEFLIX_KV.list({
      prefix: `torrents:${data['info_hash']}:peers:`,
      limit: DEFAULT_ANNOUNCE_PEERS
    })
    .then(r => r.keys?.length > 0
      ? Promise.all(
          r.keys.map(t => env.EDGEFLIX_KV?.get(t.name).then(r => JSON.parse(r)))
        )
      : {}
    )

  ret.complete = peers.filter(peer => peer.left === 0)?.length || 0
  ret.incomplete = (peers?.length - ret.complete) || 0
  ret.peers = peers.map(peer => ({
    peer_id: peer.peer_id,
    ip: peer.ip,
    port: peer.port
  }))

  // TODO: Optional debug output based on env
  // console.log(`Successfully registered peer: ${data.ip} for torrent: ${data.info_hash}`)

  return new Response(encode(ret), {
    headers: { 'content-type': 'application/json' }
  })
}