# Implementation and verification

24 October 2026. The owner approved the representative designs and authorised expansion. **Nothing has been committed, pushed or deployed.** Dummy content slots remain development-only at the owner’s request.

## Result

29 published-content routes export as static HTML: Home, Research, Publications, Teaching, Materials, About, Contact, 10 course overviews and 12 distinct deliveries. This route count excludes generated error/metadata endpoints. The export contains 32 HTML files including error pages.

Project and speaking index/detail templates are implemented. Their public routes/navigation are generated only when approved published records exist. With the current empty datasets they return proper 404s. Development examples preserve the requested project, speaking, resource, contact and CV slots under a temporary `/review-preview/` menu.

## Deterministic checks

- ESLint, TypeScript, 19 content contract tests, schema/content validation, production build and exported-output checks passed.
- Output checks cover all 29 published routes, unique metadata, canonical URLs, sitemap, asset/material manifest and 792 internal references. No source placeholders or draft files enter the export.
- Test coverage includes missing/invalid PDFs, orphaned/draft public files, unsafe paths/symlinks, unknown course references, delivery slug collisions, duplicate DOIs, likely student identifiers, explicit assessment release, external access-check dates and date precision.
- CSV importer was exercised with commas, embedded quotes, multiline text and author order; an invalid status preserved the previous snapshot. Original supplied snapshot was restored after testing.
- Both root and `/portfolio` exports passed output checks. Local static HTTP tests confirmed nested routes, images and real 404 responses under `/portfolio`. Browser inspection confirmed the nested session’s canonical and navigation prefixes.
- Development sample notes and slide PDFs were checked in root and `/portfolio` modes. Each returned application/pdf, the expected selectable-text PDF bytes and matching 742-byte Content-Length. A real browser download also completed.
- All seven development preview pages returned noindex/nofollow metadata. They were removed before final production export.
- Dependency updates remained within the existing major/dependency ranges: Next.js 16.4.3, Zod 4.6.7 and affected transitive dependencies. npm audit/install reported **zero vulnerabilities** after updates. No type/lint rules were disabled.

## Browser and accessibility checks

Nine real page types were captured at 360, 390, 768, 1024 and 1440px: Home, Research, Publications, Teaching, Materials, About, Contact, course overview and course session. Three development page types (resources, speaking detail, project detail) were also captured at all five widths. No horizontal overflow was observed in those 60 layout checks. Screenshots are local ignored artefacts under `review-evidence/expanded/`.

Course query/session direct links returned the expected two drawing courses; a nonmatching session produced the explicit empty state; Clear filters restored all 10. Publication direct type links restored the supplied Review entry; a nonmatching search showed zero results. Filters update URL parameters and announce counts. The mobile menu focused its first link on opening; Escape closed it and returned focus to Menu. Exported HTML contains all course/publication content and semantic links. A separate full JavaScript-disabled browser session was not performed.

Semantic landmarks, skip link, visible focus indicators, truthful resource actions, dimensioned images and reduced-motion support are implemented. A masthead accessible-name mismatch and a skipped publication heading level found during audit were corrected. Lighthouse accessibility was 100 on all three final audited page types. This is automated evidence, not a claim of comprehensive assistive-technology certification.

Text contrast ratios: ink/paper 14.63:1; steel/paper 5.48:1; blue/paper 6.47:1; oxide/paper 5.07:1; white/ink 16.51:1; light secondary text/ink 11.60:1. Fine rules are non-text separators.

## Performance measurements

Lighthouse **13.5.0**, Headless Chrome **155**, macOS, production static export served locally with gzip text compression. Each page used three separate fresh-profile, cold-cache runs, extensions disabled, 390 × 844 mobile emulation, 1× device scale, simulated 150ms network RTT / 1638.4 Kbps throughput and 4× CPU slowdown. Defaults reset storage between runs. Reports are under `review-evidence/performance/`; `scripts/performance.mjs` reproduces the process. The median is computed independently for each metric.

| Route                     | Median LCP | CLS | Performance | Accessibility | SEO | Total measured transfer |
| ------------------------- | ---------- | --- | ----------- | ------------- | --- | ----------------------- |
| Home                      | 2.31s      | 0   | 98          | 100           | 100 | 238.9 KiB               |
| MEC3203 2024/2025 session | 1.99s      | 0   | 98          | 100           | 100 | 175.4 KiB               |
| Publications              | 1.98s      | 0   | 98          | 100           | 100 | 168.5 KiB               |

Best practices scored 100 for all three. Initial compressed script-src asset sums were 178.8, 173.4 and 174.6 KiB respectively, measured from deduplicated exported script references with Node zlib gzip defaults. These are below the 200 KiB initial-JavaScript budget. The homepage image transfer was 68.3 KiB; the portrait file is 68.1 KiB, below the 500 KiB image budget. Total measured transfers were below 1 MiB.

An initial uncompressed-server run had homepage LCP 4.53s. The final measurements use a production-like gzip preview server and an eager, high-priority hero image. Actual host compression and live performance still need verification after an authorised release. Print-only layout adjustments after the final Lighthouse series do not affect screen composition. No field INP or real-user performance is claimed.

## Print review

Chrome print-to-PDF and Poppler PNG review completed for About, the representative course session and Publications. Biography and session each fit on one A4 page. Publications span three readable pages with whole entries and horizontal visible DOI URLs. Navigation, menus, filters and session-selection clutter are hidden. Fixes addressed an almost empty biography continuation page, a course navigation link stranded on another page and DOI URLs wrapping vertically in a narrow column.

Local evidence: `review-evidence/print/about.pdf`, `course.pdf`, `publications.pdf`, and their final rendered PNGs. They are review artefacts, not public downloads or an approved CV.

## Code review follow-up — 26 October 2026

See CODE_REVIEW.md for 11 reproduced and corrected findings. The follow-up adds 26 passing contract/regression tests and an isolated production-build integration test covering populated archives, repeated titles, incomplete drafts, an empty academic-link list, configured profile values and safely embedded JSON-LD. The normal export still passes 29-route and 792-reference checks. Dependency audit reports zero vulnerabilities. Mobile keyboard verification confirms closing the current-page menu hides it and returns focus to the menu button.

The Lighthouse measurements above belong to the earlier design review; they were not rerun for these corrections. No content fixtures were added to production and nothing was committed, pushed or deployed.

## Privacy and content provenance

Only the supplied Courses Taught and Publications header ranges were read. The supervision tab was not read. Student counts, identifiers, private evidence, referees and raw source documents were not imported. Publication titles, author order, year precision and publication types follow the supplied export, including the historical author spelling and the word “tubal”. No manuscript redistribution rights, metrics, fictional achievements or speaking dates are implied.

Public resource/asset manifests and text scans provide automated checks. Manual rights/privacy review remains mandatory for each real PDF/PPTX, including notes, hidden slides, comments, attachments and metadata. An editorial draft flag is not access control.

## Remaining content and release decisions

- Action icon update: replaced ambiguous text arrows with local Lucide SVGs. Verified destination/icon matching in representative exported pages, hidden decorative semantics, development sample View/Download actions and a 320px homepage with no horizontal overflow. The icon legend remains development-only.
- 26 October content handoff: added education/research training, profile updates, research interests, teaching statement and one real research case study. Verified lint, TypeScript, 27 contract tests, populated-archive integration, production build and 31 content routes with 876 internal references. Mobile Home and case-study views have no horizontal overflow. Source discrepancies are recorded in CONTENT_STATUS.md and TODO.md.
- Contact form deferred to TODO.md at the owner's request; no public email address is needed while that work remains pending.
- Supply approved project evidence/images, real engagement facts/slides, course resources, public email and referee-free CV when ready. Development placeholders are ready to replace.
- Owner confirmed BUK-MEE308 as the display code on 26 October 2026.
- System typography fallbacks remain as approved; licensed preferred WOFF2 assets were not supplied.
- Live publisher/DOI availability and signed-out access checks for future external resources remain separate from deterministic builds.
- Owner confirmed hsabdullahi.github.io as the launch address on 26 October 2026. Verify GitHub Pages settings before publication. The remote is the user-site repository and no CNAME was found, but GitHub CLI was not signed in, so private Pages settings could not be read.
- Publication requires explicit authorisation. The deployment workflow is manual-only. No analytics, heavy automatic embeds, backend uploads or protected storage are included.
