# love2love

A tiny romantic "will you go on a date with me?" site — pure HTML/CSS/JS, no build step, no backend to run.

**Live site (the actual link to share):** https://kadirovhabibjon.github.io/love2love/

## Personalize it

Open [script.js](script.js) and edit the `CONFIG` block at the top:

- `herName` — shown in the opening question
- `signatureName` — shown at the bottom
- `openingLine` — a single line shown before the question, to build anticipation; leave it `""` to skip straight to the question

## Add background music (optional)

Music starts automatically on her first tap anywhere on the page (browsers block autoplay-with-sound before any interaction, so this is as close to "instant" as is possible). To make it play something:

1. Drop an audio file you have the rights to use next to `index.html` and name it `song.mp3` (or change the `src` on `#bg-audio` in [index.html](index.html) to point at your file).
2. That's it — no code changes needed.

## Get her answer by email (optional but recommended)

The site can email you the day/time/food she picks:

1. Go to [web3forms.com](https://web3forms.com), enter your email, and copy the free Access Key it sends you (no password needed).
2. Paste it into `CONFIG.web3formsAccessKey` in [script.js](script.js).

If you skip this step, the flow still works end to end — you just won't get an email.

## Run it locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploy

Any static host works — no build step, no environment variables. Easiest options:

- **GitHub Pages**: push this repo, enable Pages on the `main` branch.
- **Vercel / Netlify**: import the repo, framework preset "Other", no build command needed.
