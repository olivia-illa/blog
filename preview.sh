#!/usr/bin/env bash

# Local preview at http://localhost:4000/
#
# With Nix installed this runs Jekyll straight from the flake (no Docker,
# no Ruby setup; `nix run` on its own does the same thing). Without Nix it
# falls back to the Docker image.

cd "$(dirname "$0")"

if command -v nix >/dev/null 2>&1; then
    exec nix run . -- "$@"
fi

# Detect OS and Architecture
OS="$(uname)"
ARCH="$(uname -m)"
VOLUME_FLAGS=""
PLATFORM_FLAG=""

if [ "$OS" = "Linux" ]; then
    VOLUME_FLAGS=":Z"
fi

if [ "$ARCH" = "arm64" ]; then
    PLATFORM_FLAG="--platform linux/amd64"
fi

echo "Starting 'Making Utter Sense' local preview..."
echo "------------------------------------------------"
echo "URL: http://localhost:4000/"
echo "------------------------------------------------"

# Ensure required directories exist for Docker mounting
mkdir -p .jekyll-cache _site

docker run --rm $PLATFORM_FLAG \
  -e JEKYLL_ROOTLESS=1 \
  -v "$(pwd):/srv/jekyll$VOLUME_FLAGS" \
  -p 4000:4000 \
  -it docker.io/jekyll/jekyll:4.2.2 \
  jekyll serve --watch --force_polling --drafts
