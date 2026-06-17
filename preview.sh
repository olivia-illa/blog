#!/bin/bash

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
echo "URL: http://localhost:4000/blog/"
echo "------------------------------------------------"
echo "(Note: You MUST include /blog/ at the end of the URL)"

# Ensure required directories exist for Docker mounting
mkdir -p .jekyll-cache _site
chmod 777 .jekyll-cache _site

docker run --rm $PLATFORM_FLAG \
  -v "$(pwd):/srv/jekyll$VOLUME_FLAGS" \
  -p 4000:4000 \
  -it docker.io/jekyll/jekyll:4.2.2 \
  jekyll serve --watch --force_polling
