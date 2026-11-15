# Plugin notes

The site is built by `bundle exec jekyll build` in `.github/workflows/jekyll-gh-pages.yml`, not by GitHub Pages' own builder, so custom plugins in this directory run in production as well as in `preview.sh`.

- `clippings_title.rb`: titles `clippings_style` posts after their `source_title` unless they set `title:`.
- `thoughts_title.rb`: titles all `thoughts_style` posts by publication order within each Taipei day: `notes`, `more notes`, `even more notes`, then `even more notes (4)` and onward. This overrides explicit titles; filenames and post URLs are preserved.
- `recently_edited.rb`: sorts posts by the full last-modified timestamp for the recently edited page.

- `post_calendar.rb`: creates `/dates/YYYY-MM/` for every month containing posts. `/dates/` shows the latest month; duck links navigate between populated months. Weekday offsets, month lengths, and four-to-six-week grids are calculated automatically. On mobile, `/dates/` shows a library-card month index with each month’s post count and the month pages show only populated days, with dates beside post links.
