#!/bin/bash

# Run Jekyll blog locally using Docker
echo "Starting 'Making Utter Sense' local preview..."
echo "Open http://localhost:4000/blog in your browser"

docker run --rm \
  -v "$(pwd):/srv/jekyll:Z" \
  -p 4000:4000 \
  -it docker.io/jekyll/jekyll:4.2.2 \
  jekyll serve --watch --force_polling
