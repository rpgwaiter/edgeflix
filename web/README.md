# edgeflix-web

Web frontend for discovering and searching for torrents. Powered by Astro, Svelte, and the Cloudflare network.

The idea for organizing torrents is via structured tagging. Torrent info is stored in R2, and we have the `customMetadata` option. We can have `type: "movie"` as an example, which can have different metadata fields than `type: "software"` as an example.

Doing it this way should make edgeflix easily adaptable to any data type, with a new stub defining the shape of the metadata for that type being all you need to add support.



