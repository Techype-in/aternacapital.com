# Security Policy

## Reporting a vulnerability

If you discover a security issue with the Aterna Capital website or have any concern about how customer data is handled, please email **care@aternacapital.com** with the subject `Security disclosure`. Do not file a public GitHub issue.

Please include:

- A description of the issue and where you found it (URL, page, or file).
- Steps to reproduce, if applicable.
- Any logs, screenshots, or proof-of-concept that help us understand the impact.

We will acknowledge your report within 3 working days and aim to provide a status update within 14 days. We do not currently run a paid bug-bounty programme, but we are grateful for responsible disclosure and will credit researchers (with consent) in release notes.

## Scope

- `https://aternacapital.com/` and any path served from this repository.
- The lead-capture form submission endpoint configured on `pages/apply.html`.
- Information disclosure via static assets (HTML, JS, SVG, CSS).

## Out of scope

- Third-party services we link to (e.g., RBI Ombudsman portal, Google Fonts, Formspree). Report those directly to the operator.
- Issues that require attacker control of the victim's device, network, or browser.
- Findings derived from automated scanners without a working proof of concept.

## Supported versions

Only the current `main` branch of this repository is supported. Older commits are not patched.

## Our commitments

- We do not embed third-party tracking or advertising scripts.
- We do not store form submissions in this repository. Submissions are sent directly from the user's browser to our forms provider.
- Customer-data confidentiality is governed by our Fair Practices Code, published at `/pages/fair-practices.html`.
