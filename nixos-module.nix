# NixOS module: builds the blog from git on the server and serves it.
#
# The site is not built inside a Nix derivation on purpose: the
# last-modified dates (jekyll-last-modified-at, _plugins/catalogue_edit_date.rb)
# come from `git log`, and Nix sources have no .git. So Nix provides the
# pinned Jekyll toolchain, and a systemd timer clones the repo, builds it into
# /var/lib/<stateDir>/releases/<rev> and atomically points `current` at it.
#
# Usage in a host flake:
#   inputs.blog.url = "github:olivia-illa/blog";
#   imports = [ inputs.blog.nixosModules.default ];
#   services.making-utter-sense.enable = true;
self:
{ config, lib, pkgs, ... }:
let
  cfg = config.services.making-utter-sense;
  stateDir = "/var/lib/making-utter-sense";
in
{
  options.services.making-utter-sense = {
    enable = lib.mkEnableOption "the Making Utter Sense blog";

    domain = lib.mkOption {
      type = lib.types.str;
      default = "oliviailla.blog";
      description = "Domain Caddy serves the blog on (HTTPS certificate is obtained automatically).";
    };

    repo = lib.mkOption {
      type = lib.types.str;
      default = "https://github.com/olivia-illa/blog.git";
      description = "Git URL the server clones and builds from.";
    };

    branch = lib.mkOption {
      type = lib.types.str;
      default = "main";
      description = "Branch to build.";
    };

    interval = lib.mkOption {
      type = lib.types.str;
      default = "5m";
      description = "How often to check the repo for new commits (systemd time span).";
    };

    keepReleases = lib.mkOption {
      type = lib.types.ints.positive;
      default = 3;
      description = "Number of past builds to keep in the releases directory.";
    };

    package = lib.mkOption {
      type = lib.types.package;
      default = self.packages.${pkgs.stdenv.hostPlatform.system}.build;
      defaultText = lib.literalExpression "blog.packages.\${system}.build";
      description = "The `build` wrapper (Jekyll with the blog's gems).";
    };

    caddy = lib.mkOption {
      type = lib.types.bool;
      default = true;
      description = ''
        Serve the site with Caddy and open ports 80/443. Disable to serve
        `${stateDir}/current` with a web server of your choice.
      '';
    };
  };

  config = lib.mkIf cfg.enable {
    users.users.making-utter-sense = {
      isSystemUser = true;
      group = "making-utter-sense";
    };
    users.groups.making-utter-sense = { };

    systemd.services.making-utter-sense-build = {
      description = "Build the Making Utter Sense blog from git";
      wants = [ "network-online.target" ];
      after = [ "network-online.target" ];
      path = [ pkgs.git pkgs.coreutils pkgs.findutils cfg.package ];
      environment = {
        LANG = "C.UTF-8"; # Jekyll fails on non-ASCII content without a UTF-8 locale
        JEKYLL_ENV = "production";
      };
      serviceConfig = {
        Type = "oneshot";
        User = "making-utter-sense";
        Group = "making-utter-sense";
        StateDirectory = "making-utter-sense";
        StateDirectoryMode = "0755"; # the web server needs to read it
        WorkingDirectory = stateDir;
        UMask = "0022";
        NoNewPrivileges = true;
        PrivateTmp = true;
        ProtectSystem = "strict";
        ProtectHome = true;
      };
      script = ''
        set -euo pipefail
        if [ ! -d src/.git ]; then
          rm -rf src
          git clone --branch ${lib.escapeShellArg cfg.branch} ${lib.escapeShellArg cfg.repo} src
        fi
        git -C src fetch --quiet origin ${lib.escapeShellArg cfg.branch}
        git -C src reset --hard --quiet FETCH_HEAD
        rev=$(git -C src rev-parse --short=12 HEAD)

        if [ "$(readlink current 2>/dev/null || true)" = "releases/$rev" ]; then
          exit 0
        fi

        mkdir -p releases
        rm -rf "releases/$rev"
        build --source src --destination "releases/$rev"
        ln -sfn "releases/$rev" current.tmp
        mv -T current.tmp current

        # Drop old builds, never the live one.
        ls -1dt releases/* | { grep -vx "releases/$rev" || true; } \
          | tail -n +${toString cfg.keepReleases} | xargs -r rm -rf
      '';
    };

    systemd.timers.making-utter-sense-build = {
      wantedBy = [ "timers.target" ];
      timerConfig = {
        OnBootSec = "1m";
        OnUnitActiveSec = cfg.interval;
      };
    };

    services.caddy = lib.mkIf cfg.caddy {
      enable = true;
      virtualHosts.${cfg.domain}.extraConfig = ''
        root * ${stateDir}/current
        encode zstd gzip
        file_server
      '';
    };

    networking.firewall.allowedTCPPorts = lib.mkIf cfg.caddy [ 80 443 ];
  };
}
