# edgeflix-tracker

Here's how all the data is stored in CF currently. This is subject to change all the time and may not be 1:1 with current code


### R2 layout

R2 currently stores a simple object key with the info hash of the torrent, and nothing else. This is mostly to keep a log of all infohashes that have passed through the tracker, as KV will forget about a torrent if there are no peers

Eventually registration info, like who made the torrent, could be stored in the `customMetadata` of the R2 object.

### KV

KV stores peer info, which is constantly changing and is mostly short lived.

