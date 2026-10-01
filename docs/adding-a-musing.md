# Adding a new musing

A musing is one file in `_posts/`. Its title, date, and type live at the top
of the file (the "front matter," between the `---` lines); everything below
that is the piece itself, in plain Markdown.

## Steps

1. In `_posts/`, create a new file named:

   ```
   YYYY-MM-DD-a-short-slug.md
   ```

   The date in the filename sets the sort order (newest first on the
   Musings page). The slug (the part after the date) becomes part of the
   URL, so keep it short and use hyphens, no spaces.

   Example: `2026-10-03-notes-on-rain.md`

2. Paste this at the top of the file and fill it in:

   ```yaml
   ---
   layout: musing
   title: notes on rain
   kind: essay
   note: a short one-line subtitle, or leave it blank
   ---
   ```

   `kind` is just a label shown next to the date (`essay`, `photos`,
   whatever you use). It's not fixed to those two words — this note
   ships written this way to match the site's other categories.

3. Below the second `---`, write the piece in Markdown:

   ```markdown
   Regular paragraphs just work.

   *italic*, **bold**, and [links](https://example.com) work too.

   ![a caption-worthy photo](https://your-image-host.com/photo.jpg)

   > A blockquote renders as a quiet pull-quote.
   ```

   For a photo-heavy post, just drop in several `![](url)` image lines —
   the layout is a normal reading column, so images stack full-width.
   Images need to be hosted somewhere with a URL (see the note on images
   in `docs/editing-text.md`).

4. Commit the file. It appears on `/musings/` automatically, and its
   own page (title links there) is generated at
   `/musings/a-short-slug/`.

## Removing a musing

Delete the file from `_posts/` and commit. It disappears from the site.
