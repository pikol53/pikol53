# Roblox portfolio

A one-page portfolio site. No build tools, no installs. It works as-is on GitHub Pages.

## Put it online with GitHub Pages (about 5 minutes)

1. Sign in at https://github.com (or create a free account).
2. Click **+** (top right) → **New repository**.
   - Name it exactly `YOUR-GITHUB-USERNAME.github.io` (for example `slidebuilder.github.io`).
     That gives you the cleanest address: `https://slidebuilder.github.io`.
   - Set it to **Public**, then click **Create repository**.
3. On the new repo page, click **uploading an existing file**.
4. Unzip `portfolio-site.zip` on your computer, open the folder, select **everything inside it**
   (`index.html`, `styles.css`, `main.js`, `projects.js`, `README.md` and the `assets` folder)
   and drag it all into the browser window. Click **Commit changes**.
   - Upload the *contents* of the folder, not the folder itself, so `index.html` sits at the top level.
5. Go to **Settings** → **Pages** (left sidebar).
   Under **Build and deployment**, set Source to **Deploy from a branch**, Branch to **main**, folder **/ (root)**, then **Save**.
6. Wait 1–2 minutes and open `https://YOUR-GITHUB-USERNAME.github.io`. That's the link to send to studios.

Any later change you commit goes live automatically within a minute or two.

> If you named the repo something else (e.g. `portfolio`), the address becomes
> `https://YOUR-GITHUB-USERNAME.github.io/portfolio/`.

## Editing

Everything you'll want to change is in **`projects.js`**. You can edit it right on GitHub:
open the file → click the pencil icon → edit → **Commit changes**.

- **Headline, intro, contact info:** the `SITE` block at the top.
  Set any contact value to `""` to hide it.
- **Reorder games:** they appear in the same order as in the `PROJECTS` list.
  Cut a whole game block (from its `{` to its matching `},`) and paste it higher or lower.
- **Hide a game:** add `hidden: true,` inside its block.
- **Update numbers:** change `stat` and `statLabel` (e.g. `"60M+"`, `"visits"`).

## Adding images and videos

**1. Upload the file.** On GitHub, open the `assets` folder → **Add file** → **Upload files** →
drag your files in → **Commit changes**.
Use simple file names without spaces, e.g. `epic-huge-slide-3.png` or `slide-run.mp4`.

**2. Add a line to the game's `media` list** in `projects.js`:

```js
media: [
  { src: "assets/epic-huge-slide-1.png", alt: "Rainbow slide over the clouds" },
  { src: "assets/epic-huge-slide-2.png", alt: "Inside the tube slide" },
  { src: "assets/epic-huge-slide-3.png", alt: "Players landing in the pool" },   // new image
  { video: "assets/slide-run.mp4", alt: "Full run down the slide" },             // new video
],
```

- Images use `src`, videos use `video`. Don't forget the comma at the end of each line.
- The **first** item is the big one shown on the page. Every other image becomes a clickable thumbnail.
- `alt` is a short description of what's in the picture (helps accessibility and search).
- Videos: use **.mp4**. They can go anywhere in the list and get a ▶ thumbnail.
  A video placed first plays muted on a loop when scrolled into view; others play when their thumbnail is clicked.
  Optional: add `poster: "assets/some-image.jpg"` to show a still image before it loads.

**Size limits:** GitHub's web uploader takes files up to 25 MB each. For bigger videos, shrink them first
(e.g. with HandBrake, preset "Fast 720p30") or upload them to YouTube.

## Notes

- Clicking an image opens it full size; arrow keys move between images, Esc closes.
