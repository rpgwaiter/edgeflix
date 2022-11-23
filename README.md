# Edgeflix

Bittorrent tracker and file discovery frontend, designed to be efficient enough to run on Cloudflare free tier.

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)


## Description

The goal of this project is to (eventually) supplement or replace expensive infrastructure used by torrent site operators with something free-to-cheap and easy to work with. Anyone from large internet groups to local friends should be able to use edgeflix to setup a public or private file sharing site.


## Project goals

### tracker
[x] - working /announce
[ ] - working /scrape
[ ] - optional torrent registration/allowlisting

### frontend
[ ] - way to view list of torrents in KV
[ ] - search

### general
[ ] - auth
[ ] - logging
[ ] - use B2 to store metadata about torrents

 
## Getting Started

This project is in very early development. To run the dev server:

```sh
git clone https://github.com/rpgwaiter/edgeflix.git
cd ./edgeflix
npm i
npm start
```


### Dependencies

- Node (something recent probably)
- nix (optional, but nix is cool would recommend)
- a [Cloudflare account](https://dash.cloudflare.com/sign-up) (account ID, API key)
  - make a KV namespace for storing peer/torrent info
  - populate your wrangler.toml accordingly


### Using the tracker

Once the tracker is up and running (either locally or on CF), you can make a torrent and add 'https://your.ip/announce' as a tracker to start sharing files.


## Contribution

If you have ideas or contributions to add, feel free to make an issue or PR.


## Acknowledgments

* [webtorrent](https://github.com/webtorrent/bittorrent-tracker) the foundation of knowledge that makes edgeflix possible