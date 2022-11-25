{
  inputs = {
    nixpkgs.url = "nixpkgs/nixpkgs-unstable";
    devshell.url = "github:numtide/devshell";
    flake-utils.url = "github:numtide/flake-utils";
    flake-compat = { url = github:edolstra/flake-compat; flake = false; };

  };

  outputs =
  { self
  , flake-compat
  , flake-utils
  , devshell
  , nixpkgs
  }: with flake-utils.lib;
  flake-utils.lib.eachSystem [ "x86_64-linux" "aarch64-linux" ] (system: # TODO: "aarch64-darwin" 
  let
    pkgs = nixpkgs.legacyPackages.${system} // {
      overlays = [
        devshell.overlay
        self.overlay
      ];
    };
  in
  rec {
    # devShell = pkgs.devshell.mkShell { imports = [ (pkgs.devshell.importTOML ./devshell.toml) ]; };
    packages = flake-utils.lib.flattenTree rec {

      edgeflix = pkgs.callPackage ./scanner {
      };

    };
  }) 
  // rec {
    overlay = final: prev: {
        inherit (self.outputs.packages.x86_64-linux) 
        rutorrent
        # frida
        cyberpunk-neon;
    };
  };
}