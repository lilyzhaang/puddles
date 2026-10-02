# Adding a new project

A project is one file in `_projects/`. Same idea as a musing: front matter
at the top for the structured fields (status, year, links...), Markdown
below for the full writeup.

## Steps

1. In `_projects/`, create a new file named after the project, e.g.
   `weather-app.md`. The filename becomes the URL slug.

2. Paste this at the top and fill it in:

   ```yaml
   ---
   layout: project
   title: weather-app
   slug: weather-app
   status: live       # live / wip / archived — shown as a small label
   year: "2026"
   role: solo build
   order: 4            # controls left-to-right / top-to-bottom position on the grid
   summary: One or two sentences — this is what shows on the project card.
   stack: [swift, coreml]
   links:
     - label: live site
       url: "https://example.com"
     - label: source
       url: "https://github.com/you/weather-app"
   ---
   ```

   Leave `links: []` if there's nothing to link to yet.

3. Below the second `---`, write the longer story in Markdown — this only
   shows on the project's own page, not on the card:

   ```markdown
   The problem you were solving, the constraints, and the decision
   you're most glad you made. As many paragraphs as you like.
   ```

4. Commit. The card appears in the Projects grid on the homepage; clicking
   "open →" goes to `/projects/weather-app/`, styled the same way as the
   About and Musings headings, with the expanded card holding the full
   writeup, tech stack, and links.

## Adding screenshots

To show images side by side inside the project's window (each one opens
big when clicked, like the homepage photos), upload them to
`assets/images/projects/` and list them in the front matter under
`gallery:`:

```yaml
gallery:
  - src: /assets/images/projects/weather-app-home.png
    title: weather-app-home.png      # label in the little window's title bar
    alt: The weather app's home screen showing a 5-day forecast
  - src: /assets/images/projects/weather-app-settings.png
    title: weather-app-settings.png
    alt: The settings screen
```

Two fit side by side; more wrap onto the next row, and on phones they
stack. Screenshots up to about 1600px wide are fine.

## Removing a project

Delete its file from `_projects/` and commit.
