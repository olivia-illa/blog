# Making Utter Sense

A minimal, typography-focused static blog for Olivia Illa. Built with Jekyll and designed to be simple, responsive, and easy to maintain.

## Features

- **Minimal Design**: Inspired by Bear Blog, focusing on readability and whitespace.
- **Dark Mode**: Automatically respects your system preferences using CSS media queries.
- **Tag-based Homepage**: Posts are automatically organized into three sections:
  - **Internet Clippings**: Curated links and snippets from the web.
  - **Scattered Thoughts**: Personal reflections and musings.
  - **All Posts**: General blog entries.
- **Mobile Friendly**: Fully responsive layout that looks great on any device.
- **RSS Feed**: Built-in support for RSS subscribers.
- **Automated Deployment**: Powered by GitHub Actions for seamless updates.

## Local Development

You don't need to install Ruby or Jekyll on your machine. With [Nix](https://nixos.org/download/) installed, the flake in this repository builds the exact gems from `Gemfile.lock`; without Nix, `preview.sh` falls back to Docker.

### Running the Preview

1.  Clone the repository.
2.  Run the preview script (it uses Nix when available, otherwise Docker):
    ```bash
    ./preview.sh
    ```
    With Nix you can equally run `nix run` from the repository root.
3.  Open your browser to [http://localhost:4000](http://localhost:4000).

The preview watches for changes and live-reloads the page, so the site refreshes when you save changes to your Markdown files or CSS. Do not run `bundle install` manually; the flake (or Docker) manages dependencies.

Other flake commands:

- `nix run .#build` builds the site into `_site/` the same way CI does.
- `nix develop` opens a shell with `jekyll`, `bundle` and `bundix` on the PATH.
- After changing the `Gemfile`, run `bundle lock` followed by `nix run .#bundix` to refresh `Gemfile.lock` and `gemset.nix`.

## Adding New Content

To create a new blog post, add a Markdown file to the `_posts/` directory using the following naming convention: `YYYY-MM-DD-title.md`.

Each post should include front matter at the top:

```markdown
---
layout: post
title: "My Amazing Post"
date: 2026-06-17 12:00:00 +0000
tags: [scattered-thoughts]
---

Your content goes here...
```

### Tags
- Use `internet-clippings` to show the post in the "Internet Clippings" section.
- Use `scattered-thoughts` to show the post in the "Scattered Thoughts" section.
- Use any other tag (or none) to show it in the "All Posts" section.

## Deployment

This blog is configured to deploy automatically to GitHub Pages. When you push changes to the `main` branch, a GitHub Action will build the site and update the live version.

Ensure that your GitHub Repository settings for **Pages** are set to **"GitHub Actions"** as the build source.

## License

This project is open-source and available under the MIT License.
