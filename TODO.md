# Website todo

## Contact form

- [ ] Add a contact form that keeps the receiving email out of public site source. Deferred at the owner's request on 26 October 2026.
  - Proposed setup: Formspree with Cloudflare Turnstile and a honeypot.
  - Fields: name, email, subject and message.
  - Configure the receiving address privately with the provider; obtain the form endpoint and public Turnstile site key. Keep the secret key in provider settings, never in the repository.
  - Add accessible validation, submission/error feedback and a short notice explaining how messages are processed.
  - Verify bot protection, successful delivery and mobile/keyboard use before enabling the form publicly.

## Content to collect

- [x] Add the substantiated multi-topology lattice research case study.
- [ ] Confirm Klastra, EDDY and laboratory project scope, personal contributions, dates, outcomes and approved imagery.
- [ ] First approved course materials, matched to course and academic session.
- [ ] Optional public CV without referees or private contact details.
- [x] Add education history and postdoctoral institution/month dates from the 26 October handoff.
- [ ] Reconcile MEC3207/BUK-MEE308 levels and sessions, GET102 programme applicability, and CDL appointment start date.
- [ ] Speaking details when available; slides can follow later.

## Release

- [ ] Verify GitHub Pages settings for the confirmed address, hsabdullahi.github.io.
- [ ] Complete final content approval, commit/push, pass CI and obtain publication authorisation before manual deployment.
- [ ] Check the live site after deployment.

Confirmed: BUK-MEE308 is the display code; the stable course ID and URL remain mee308. Existing publications, portrait and course catalogue are supplied. Development-only dummy examples stay excluded from production.
