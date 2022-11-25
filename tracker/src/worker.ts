import announce from './announce'

export default {
  async fetch(request: Request, env) {
    const url = new URL(request.url)

    if (url.pathname.startsWith('/announce')) {
      return announce(request, env)
    } 
      // TODO: Site name from env
      return new Response(`This is a bittorrent tracker. To use this service, add ${env.EDGEFLIX_TRACKER_URL || 'https://tracker.based.zone/announce'} as a tracker to your torrent of choice`)
  }
}
