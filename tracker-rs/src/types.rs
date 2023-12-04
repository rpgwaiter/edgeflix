use serde::{Deserialize, Serialize};
use std::net::Ipv4Addr; // TODO: support ipv6

#[derive(Serialize, Deserialize)]
pub struct AnnounceResponse {
  pub complete: u32,
  pub incomplete: u32,
  pub peers: Vec<Peer>
}

#[derive(Serialize, Deserialize)]
pub struct Peer {
  peer_id: u32,
  ip: Ipv4Addr,
  port: u32
}