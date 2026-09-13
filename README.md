# Loop — GitHub Pages deployment

These are the real site files, loaded normally by the browser. There is **no
unpack step and no splash screen**: the page parses and paints the Home screen
directly.

## Upload all of this, keeping the folder structure

```
index.html
support.js
.nojekyll
_ds/
  nocturne-96102e14-558f-4cc7-b32b-9a489cd8414d/
    styles.css
    _ds_bundle.js
```

`.nojekyll` matters. GitHub Pages runs Jekyll by default, and Jekyll skips every
folder whose name starts with an underscore — without that file, `_ds/` is never
published and the site loads unstyled.

## Steps

1. Delete everything currently in the repository (the old `index.html`,
   `styles.css`, `script.js`).
2. Upload these files, preserving the `_ds/…` folder path exactly.
3. Settings → Pages → Source: **Deploy from a branch**, branch `main`, folder
   `/ (root)`.
4. Wait for the green tick on the Actions tab, then hard-reload
   (Ctrl/Cmd + Shift + R). Pages caches aggressively.

## Note

`index.html` here is the site itself, not a copy to edit. If the design changes,
this folder gets rebuilt from source; edits made directly to these files will be
overwritten.

An internet connection is required, for Google Fonts and Phosphor icons. The
single-file `The Loop (offline).html` is the version that works with no
connection — but that one does show an unpack splash, which is why it is not
used here.
