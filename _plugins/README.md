# Plugin notes

The site is built by `bundle exec jekyll build` in `.github/workflows/jekyll-gh-pages.yml`, not by GitHub Pages' own builder, so custom plugins in this directory run in production as well as in `preview.sh`.

- `clippings_title.rb`: titles `clippings_style` posts after their `source_title` unless they set `title:`.
