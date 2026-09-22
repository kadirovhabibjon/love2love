# love2love

A tiny romantic "will you go on a date with me?" site — pure HTML/CSS/JS, no build step, no backend to run.

## Personalize it

Open [script.js](script.js) and edit the `CONFIG` block at the top:

- `herName` — shown in the opening question
- `signatureName` — shown at the bottom
- `pickupHint` — the line on the final confirmation card

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
