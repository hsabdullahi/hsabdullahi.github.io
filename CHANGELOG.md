# Changelog

## 26 October 2026

- Updated validation and manual Pages deployment actions to Node 24 runtimes, including the composite Pages uploader and its nested artifact action. Pinned the deployment build runtime to Node 24 to match CI.

- Standardised action icons using a local Lucide SVG subset: right arrow for internal navigation, external-link icon for external websites, arrow-and-tray for downloads, down arrow for scrolling and envelope for email. Academic profile brand glyphs remain separate.
- Content-handoff review fixed narrow-screen homepage actions: links now wrap without squeezing their labels. Verified at phone, tablet and desktop widths.
- Incorporated Website_Content_Handoff.md: education/research training, fuller profile and appointments, research interests, teaching statement, professional links and one collaborative research case study. Kept three unsupported project candidates draft and recorded teaching-source discrepancies for verification.

- Owner confirmed hsabdullahi.github.io as the launch address and BUK-MEE308 as the course display code. Stable course ID and URL retained.

- Added compact academic-profile SVG icons with visible labels across Home, Research, About, Contact and the footer. Source and license details are in THIRD_PARTY_NOTICES.md.
- Completed a defect-first review and fixed 11 issues covering archive builds, metadata escaping, draft handling, profile settings, mobile navigation and output validation. See CODE_REVIEW.md.
- Expanded regression coverage to 26 tests and added an isolated real-build integration test to CI for populated archives and content edge cases.
- Preserved supplied content and kept dummy examples outside the production export. No publication action taken.

## 24 October 2026

- Built initial representative-page design for review, without publication.
- Imported 12 publication records from owner's Scopus snapshot exported 14 September 2026; preserved titles, author order, types and null fields.
- Imported 10 course catalogue entries and 12 deliveries from the Courses Taught tab. No student counts, supervision data or private evidence copied.
- Prepared WebP portrait from the owner-supplied glasses photograph.
- Changed existing GitHub Pages automatic main-push deployment to manual-only. No workflow dispatched.

### Expansion after design approval

- Owner approved the three representative designs and authorised continuation.
- Generalised the catalogue and all 12 verified teaching deliveries; added Research, About, Contact and a searchable materials library.
- Added data-driven project/speaking templates and labelled development examples for projects, resources, contact and CV. No real project, engagement, contact email or CV was supplied.
- Dependency audit fixes applied within declared version ranges: Next.js 16.4.3, Zod 4.6.7 and affected transitive dependencies. The audit then reported zero vulnerabilities.
- Verified 29 published routes and 792 internal references in root and repository-subpath exports; development PDFs and noindex previews work in both modes.
- Completed responsive, keyboard, filter, Lighthouse and print review. Final lab median LCP is 2.31s for Home, 1.99s for the course session and 1.98s for Publications; CLS 0 for all three.
- Retained all requested dummy content outside production and restored a clean root-path export for handoff.
