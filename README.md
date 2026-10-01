# lily zhang — personal site

A Jekyll site: About + Projects on one scroll (`index.html`), Musings as a
separate long-form section. GitHub Pages builds Jekyll sites automatically —
you don't need to run a build step yourself. Pushing a file to `main` *is*
publishing.

## One-time setup

1. Create a new GitHub repository and push everything in this folder to it.
2. In the repo, go to **Settings → Pages**. Under "Build and deployment,"
   set Source to **Deploy from a branch**, branch **main**, folder **/ (root)**.
3. Wait a minute or two, then your site is live at
   `https://<your-username>.github.io/<repo-name>/`.
4. Edit `_config.yml`: change `title` to your name.

## Everyday use

- **Add a new musing (essay or photo post):** see `docs/adding-a-musing.md`.
- **Add a new project:** see `docs/adding-a-project.md`.
- **Edit existing text (hero, resume, tags, project or musing copy):** see `docs/editing-text.md`.

All three just mean: add or edit a file in the GitHub web UI (or locally with
git) and commit. GitHub Pages rebuilds the live site automatically, usually
within a minute of the commit.

## Previewing changes before they're live (optional)

If you want to see a change before pushing it, you need Ruby and Bundler
installed once:

```
bundle install
bundle exec jekyll serve
```

Then open `http://localhost:4000`. Not required — you can also just push and
check the live site.

## File map

```
_config.yml          site title + URL structure
_data/home.yml        hero text, resume rows, tag list — the "about" content
_posts/               one file per musing (essay or photo post)
_projects/             one file per project
_layouts/             page templates (default, musing, project)
assets/css/style.css  all visual styling (colors, gradient, fonts, layout)
assets/js/theme.js    light/dark toggle
index.html            the About + Projects scroll
musings.html          the Musings index/listing page
```
