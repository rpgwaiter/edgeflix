# edgeflix-tracker

Lightweight and (soon to be) feature-filled bittorrent tracker made for Cloudflare infrastructure

Hosted: https://tracker.based.zone

## Config

Config is handled by environment variables, and supports a `.env` file placed in the `tracker/` directory.

```env
# tracker/.env example
CLOUDFLARE_ACCOUNT_ID=****
CLOUDFLARE_NAMESPACE_ID=****
CLOUDFLARE_API_TOKEN=****

DEFAULT_ANNOUNCE_PEERS=25 ## Default num of peers to return if unspecified by client
PEER_TTL=1200 ## Time in seconds to keep peer in KV storage

MAX_ANNOUNCE_PEERS=30 ## Max amount of peers to send to a client
LOG_TORRENTS_TO_R2=false ## Should all torrents be logged to R2 storage?
```

## Deploy your own instance to Cloudflare

You'll want to make a `tracker/wrangler.toml` with your instance information filled out to deploy this to your CF account

```toml
name = "edgeflix-tracker"
workers_dev = true
compatibility_date = "2022-11-30"
account_id = "your-account-id"
main = "./dist/worker.js"

[build]
command = "npm install && npm run build"

[[rules]]
type = "ESModule"
globs = ["**/*.js"]

[[kv_namespaces]]
binding = "EDGEFLIX_KV"
id = "your-kv-id"

[[r2_buckets]]
binding = "TORRENTS_BUCKET"
bucket_name = "your-r2-bucket-name"
```

Once you make this file, you can run `npm run deploy` while in the tracker dir and you'll have your own instance of edgeflix in the cloud


## Data Storage

Here's how all the data is stored in CF currently. This is subject to change all the time and may not be 1:1 with current code

### R2 layout

R2 currently stores a simple object key with the info hash of the torrent, and nothing else. This is mostly to keep a log of all infohashes that have passed through the tracker, as KV will forget about a torrent if there are no peers

Eventually registration info, like who made the torrent, could be stored in the `customMetadata` of the R2 object.

### KV

KV stores peer info, which is constantly changing and is mostly short lived.

