# Adding a side photo

The little photo windows in the left and right margins of the homepage all
come from one file: `_data/photos.yml`. Each photo is one entry (a block that
starts with `- side:`). They only show on the homepage, and only when the
browser window is at least 1200px wide.

## Adding a photo

1. Resize the photo to about 600px wide (on a Mac: open it in Preview →
   Tools → Adjust Size), save it as a `.jpg`, and upload it to
   `assets/images/side/`. Full-size camera files are several MB each and
   make the page slow; 600px is plenty for a window this small.

2. In `_data/photos.yml`, copy an existing entry and paste it under the
   right side's heading, then edit it:

   ```yaml
   - side: right          # left or right margin
     top: 70              # how far down the page, in percent
     x: 0.30              # how far in from the page edge (fraction of the margin)
     w: 0.44              # how wide (fraction of the margin)
     ratio: "2/3"         # width/height: "2/3" portrait, "3/2" landscape, "1/1" square
     speed: 0.31          # how slowly it drifts as you scroll
     title: lz_8.jpg      # the filename-style label in the title bar
     src: /assets/images/side/lz_8.jpg
     alt: Lily at the beach   # describes the photo for screen readers
   ```

   Keep the two-space indent and the `- ` at the start exactly like the
   other entries. Put `ratio` in quotes.

3. Commit. Wait a minute for GitHub Pages to rebuild, then hard-refresh.

## Moving a photo

- **Up or down:** change `top`. Within one side, leave roughly **28** below a
  portrait photo and **18** below a landscape one, or they'll bump into each
  other as they drift.
- **Closer to or further from the text:** change `x` (bigger = closer to the
  text). `x + w` must stay under 1, or the photo will run into the text column.
- **Bigger or smaller:** change `w`. Photos never get wider than 190px, so on
  very wide screens they stop growing (that's set in `assets/css/style.css`,
  look for `190px`).

Stagger the left and right sides so they don't mirror each other.

## Changing the drift

`speed` is how much the photo trails the page as you scroll. 0 means it
scrolls normally and higher means it lags more. Keep it between 0.27 and
0.32. **Within one side, speeds should go up from top to bottom** (e.g.
0.27, 0.29, 0.30, 0.32). If a photo higher up drifts faster than the one
below it, it'll catch up and overlap it.

Visitors who've turned on "reduce motion" in their system settings don't
get any drift.

## Changing how long a closed photo stays closed

Clicking × on a window fades it out, and it comes back by itself 45 seconds
later, even if the page is refreshed. (The close time is only stored in the
visitor's own browser.) To change the 45 seconds, edit this line near the top
of `assets/js/photos.js`:

```js
const REOPEN_MS = 45 * 1000;        // a closed photo comes back after 45 seconds
```

e.g. `2 * 60 * 1000` for 2 minutes, or `20 * 1000` for 20 seconds.

## Removing a photo

Delete its whole entry (from `- side:` down to its `alt:` line) from
`_data/photos.yml` and commit. You can delete the image from
`assets/images/side/` too, or leave it.

## If the whole site stops updating

A typo in `_data/photos.yml` (a missing space after a colon, a tab instead
of spaces, a misaligned line) breaks the entire GitHub Pages build without
any warning on the site. Check the repo's **Actions** tab for a red ✗, and
compare your entry against the others line by line.
