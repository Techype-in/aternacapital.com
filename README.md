# Aterna Capital — Marketing site

Public-facing website for **Aterna Capital**, the brand under which **Blue Jay Finlease Private Limited** (an NBFC registered with the Reserve Bank of India · Reg. No. **B-14.01415**) operates.

This is a static HTML/CSS/JS site. No build step. No backend. Hosted on GitHub Pages, served from the `main` branch via a custom domain configured by the `CNAME` file at repo root.

Live: <https://aternacapital.com/>

---

## Repository layout

```
.
├── index.html              # Home page
├── pages/
│   ├── about.html
│   ├── apply.html          # Lead-capture form (Formspree)
│   ├── contact.html        # Info-only contact page
│   ├── corporates.html
│   ├── fair-practices.html # RBI-mandated Fair Practices Code
│   ├── grievance.html      # RBI-mandated Grievance Redressal
│   ├── products.html
│   └── sme.html
├── assets/
│   └── motion.js           # SVG motion graphics controller
├── CNAME                   # Custom domain pin — do NOT delete
├── .gitignore
├── SECURITY.md             # Responsible disclosure policy
└── README.md               # This file
```

## Local preview

Open `index.html` directly in a browser. Everything is static — no server, no compile.

To preview cross-page links from a clean URL space, use any small static server, e.g.:

```bash
python3 -m http.server 8000
# open http://localhost:8000/
```

## Editing

- Each HTML page is self-contained: its own `<style>` block and inline JS, then the shared motion library is loaded from `assets/motion.js` on `index.html` and `pages/products.html`.
- When you change a page, keep the **canonical footer legal paragraph** identical across all files. Search for `RBI Reg. No. B-14.01415` to find it.
- When you add a new page, copy the nav + footer block from an existing page so navigation stays consistent.

---

## Deploying

GitHub Pages auto-deploys every push to `main`.

1. Push (or upload via web UI) to `main`.
2. Watch the **Actions** tab — wait for `pages build and deployment` to go green.
3. Open <https://aternacapital.com/> with a hard refresh (`Ctrl+Shift+R`) to bust the cache.

The `CNAME` file at the root pins the domain. **If you delete or rename it, the custom domain breaks** and the site reverts to the `github.io` URL until restored. Always keep `CNAME` exactly as committed.

---

## Configuring the Apply form

The form on `pages/apply.html` submits to **Formspree**. The endpoint URL lives in the HTML as a placeholder:

```html
<form id="applyForm" action="[FORMSPREE_ENDPOINT]" method="POST" novalidate>
```

### One-time setup

1. Sign up at <https://formspree.io/> with the inbox you want leads delivered to (typically `care@aternacapital.com`).
2. Create a new form. Formspree gives you an endpoint URL of the shape `https://formspree.io/f/xxxxxxxx`.
3. In `pages/apply.html`, replace the literal text `[FORMSPREE_ENDPOINT]` (one occurrence) with the URL.
4. Commit and push.

### Recommended Formspree dashboard settings

- **Allowed origins:** `aternacapital.com` (and `www.aternacapital.com`). Blocks form abuse from other sites.
- **reCAPTCHA / hCaptcha:** turn on the bot challenge. The form already includes an invisible honeypot field (`_gotcha`), so this is belt-and-braces.
- **Notification rules:** route inbound submissions to the right team inbox.
- **Auto-reply:** optional — send a confirmation email back to the applicant.

### Fallback behaviour

Until the placeholder is replaced, the form falls back to opening the user's default mail client with a pre-filled message to `care@aternacapital.com`. Leads are never silently dropped.

---

## Security posture

A short summary; see `SECURITY.md` for the disclosure policy.

### What is _not_ a secret

- `care@aternacapital.com`, `grievance@aternacapital.com`, `nodal@aternacapital.com` — published contact addresses.
- The Formspree endpoint URL once added. Formspree endpoints are scoped per form, can be rotated from the dashboard, and are rate-limited.
- RBI registration number `B-14.01415` and the registered office address — public regulatory disclosures.

### What must never be committed

- Any API key, OAuth credential, database connection string, or password.
- Internal employee mailbox addresses, phone numbers, or home addresses.
- Customer PII, lead exports, KYC documents, or financial data.

The `.gitignore` already excludes `.env`, `secrets/`, `credentials.json`, and common editor / OS junk.

### Defence-in-depth measures already in place

- A **Content Security Policy** meta tag on every HTML file whitelists only the origins this site actually loads from (`fonts.googleapis.com`, `fonts.gstatic.com`, `cdnjs.cloudflare.com`, `formspree.io`). Anything else is blocked by the browser, which limits the blast radius of any future XSS bug.
- External script tags use `crossorigin="anonymous"` and `referrerpolicy="no-referrer"`.
- The form has an invisible honeypot field (`_gotcha`) and requires an explicit consent checkbox before submission.
- URL parameters on `apply.html` (`?product=<slug>`) are validated against an allow-list before being used; arbitrary values are ignored.

### Outstanding manual step

The Three.js library is loaded from cdnjs:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
        crossorigin="anonymous" referrerpolicy="no-referrer"></script>
```

For maximum supply-chain protection, add a Subresource Integrity hash:

1. Visit <https://cdnjs.com/libraries/three.js/r128>.
2. Find `three.min.js` and click the SRI button to copy its `sha512-…` hash.
3. Add the attribute `integrity="sha512-…"` to the `<script>` tag in `index.html`.

If cdnjs is ever compromised, a modified script will fail the hash check and the browser will refuse to load it.

---

## Compliance notes (NBFC)

Two RBI-mandated pages are published and linked from every footer:

- `pages/grievance.html` — four-level escalation path including the RBI Integrated Ombudsman (<https://cms.rbi.org.in>).
- `pages/fair-practices.html` — Board-approved Fair Practices Code.

When you appoint a Grievance Redressal Officer or Principal Nodal Officer, edit `pages/grievance.html` and replace the `[Name to be appointed]` slots with the actual names.

Update the `Last reviewed: 2026` line on `pages/fair-practices.html` every calendar year after Board review.

---

## License

All content (text, design, logo) is © Blue Jay Finlease Private Limited. The source code in this repository may be referenced but not redistributed without permission.
