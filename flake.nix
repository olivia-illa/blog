{
  description = "Making Utter Sense - Jekyll blog, local preview without Docker";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

  outputs = { self, nixpkgs }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forAllSystems = f: nixpkgs.lib.genAttrs systems (system: f nixpkgs.legacyPackages.${system});
    in
    {
      packages = forAllSystems (pkgs:
        let
          # The exact gems from Gemfile.lock, built by Nix. Regenerate
          # gemset.nix with `nix run .#bundix` after changing the Gemfile.
          gems = pkgs.bundlerEnv {
            name = "making-utter-sense-gems";
            ruby = pkgs.ruby;
            gemdir = ./.;
          };

          # jekyll-last-modified-at shells out to git, so keep it on PATH.
          preview = pkgs.writeShellApplication {
            name = "preview";
            runtimeInputs = [ gems gems.wrappedRuby pkgs.git ];
            text = ''
              echo "Starting 'Making Utter Sense' local preview..."
              echo "------------------------------------------------"
              echo "URL: http://localhost:4000/"
              echo "------------------------------------------------"
              exec jekyll serve --watch --livereload "$@"
            '';
          };

          build = pkgs.writeShellApplication {
            name = "build";
            runtimeInputs = [ gems gems.wrappedRuby pkgs.git ];
            text = ''
              exec jekyll build "$@"
            '';
          };
        in
        {
          inherit gems preview build;
          default = preview;
        });

      apps = forAllSystems (pkgs: {
        default = { type = "app"; program = "${self.packages.${pkgs.stdenv.hostPlatform.system}.preview}/bin/preview"; };
        preview = { type = "app"; program = "${self.packages.${pkgs.stdenv.hostPlatform.system}.preview}/bin/preview"; };
        build = { type = "app"; program = "${self.packages.${pkgs.stdenv.hostPlatform.system}.build}/bin/build"; };
        bundix = { type = "app"; program = "${pkgs.bundix}/bin/bundix"; };
      });

      devShells = forAllSystems (pkgs: {
        default = pkgs.mkShell {
          packages = with pkgs; [
            self.packages.${pkgs.stdenv.hostPlatform.system}.gems
            self.packages.${pkgs.stdenv.hostPlatform.system}.gems.wrappedRuby
            bundix
            git
          ];
        };
      });
    };
}
