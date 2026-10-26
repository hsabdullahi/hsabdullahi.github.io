# Hamza Sulayman Abdullahi

A Next.js 16 / TypeScript personal website with static export for GitHub Pages. The owner approved the representative designs on 24 October 2026 and authorised expansion. **The implementation is local; nothing has been published.**

## Start and review

Use Node.js 24 and the committed npm lockfile.

```sh
npm ci
npm run dev
```

For a production preview:

```sh
npm run build
npm start
```

Open the printed local URL. `npm start` serves the static `out/` directory, with gzip for text assets, immutable caching for fingerprinted assets, correct file MIME types and real 404 responses. It is a local preview server, not a production upload service.

For clearly labelled dummy content and working sample PDF actions:

```sh
npm run dev:review
```

Open `/review-preview/` for the review menu. It links to project index/detail, speaking detail, resource search, contact/CV slots and style reference. Examples are fictional and excluded from the production build. Real public contact details, CV, project evidence and speaking records remain to be supplied. The sample PDF identifies itself as a development example.

Stop the review server before production checks. Its temporary ignored routes are removed on exit. Validation refuses to build with review routes present, and exported-output checks reject leaked examples. If forcibly terminated, remove only the generated `app/review-preview/` folder before building. `npm run typecheck` regenerates framework route types so removed preview routes do not leave stale references.

## Implemented pages

- Home, Research, the complete supplied Publications index, Teaching, Materials, About and Contact.
- All 10 supplied courses and 12 distinct academic-session deliveries.
- Project and speaking index/detail templates. Public routes and navigation appear automatically once approved, published records exist. Until then their labelled examples remain in the development review menu.
- No writing section is generated without actual articles. No nonfunctional contact form, upload/admin screen, analytics or automatic presentation embeds are included.

Contact currently presents approved academic profiles. Setting an approved `profile.email` enables a mail link. An approved CV resource enables View/Download on About and the footer. Education, memberships and unsupported biographical facts are omitted.

## Architecture and content sources

- `content/profile.json`: shared profile, biography, appointments, portrait, academic links, nullable public email/CV.
- `content/publications.json`: 12-record dated website snapshot. The Publications spreadsheet tab remains the master.
- `content/courses/*.json`: catalogue entries, separated from deliveries.
- `content/course-sessions/deliveries.json`: 12 verified deliveries, each with its own semester, programme, resources and optional outcomes/syllabus/timetable.
- `content/projects.json` and `content/talks.json`: archive records; one substantiated research project and three draft candidates, with no published talks.
- `lib/schemas.ts`: the single Zod schema system. Draft records may contain just stable ID/status; they are excluded before rendering. Never put private drafts or private source files in this public repository.
- `lib/content.ts`: published content, byte-derived resource sizes and route manifest.
- `components/`: reusable editorial rows, resources, session selection, filters and page templates.
- `dev/`: fictional review fixtures, isolated from production routes/assets.
- `scripts/sync-routes.mjs`: generates ignored `app/(archives)/` wrappers only for nonempty published project/speaking archives. Run it again or restart dev after changing publication status for these archives. `build` and `typecheck` run it automatically.

Teaching was read from the Courses Taught tab on 24 October 2026. Student counts, supervision data and private evidence were not imported. The sheet uses **MEE308** for Analysis of Mechanisms and Machines; the guide uses **BUK-MEE308**. The owner confirmed **BUK-MEE308** as the display code on 26 October 2026; the stable course ID and URL remain `mee308`.

## Validation and CI

```sh
npm run lint
npm run typecheck
npm test
npm run validate:content
npm run build
npm run check:output
npm run test:integration
```

Validation rejects duplicate IDs/DOIs/slugs, unresolved published references, colliding session routes, invalid dates, unsupported types, unsafe paths/symlinks, missing files, mismatched signatures and orphaned/draft public assets. PDF and PPTX/ZIP signatures are checked where practical. Text patterns require review for likely private content; they cannot certify privacy. File sizes come from actual bytes, not manually supplied values.

Output checks verify every published route, unique page titles, descriptions, canonical URLs, sitemap membership, fragments, internal assets/links and exported-material manifest. Public HTML is server-rendered; navigation and content remain in HTML. Filters enhance those rows in the browser. Course/resource/publication search supports query parameters, live-announced counts, clear filters and no-results states.

The integration test builds an isolated temporary copy with populated archives, repeated titles, incomplete drafts and profile edge cases. It leaves the owner's content and export unchanged. Set `NEXT_PUBLIC_BASE_PATH=/portfolio` to exercise repository hosting paths.

CI runs lockfile installation, lint, type checks, contract tests, content validation, build, output checks and integration tests on pull requests and main pushes. The existing Pages deployment workflow is manual-only and runs the same checks. Do not dispatch it without explicit publication authorisation.

## Publication updates

Export **only the Publications tab** as CSV. Keep private workbook exports outside this repository.

```sh
npm run import:publications -- /absolute/path/to/publications.csv
```

The importer requires the exact 18 supplied headers and uses `csv-parse` for commas, quoting and multiline fields. It preserves IDs, title spelling, author order and publication types; maps blank optional fields to null; validates the candidate and duplicate IDs/DOIs; then replaces the snapshot atomically. A failed import preserves the previous file. Record export/import dates in CHANGELOG.md, run checks and inspect the index, filters and DOI links.

The supplied snapshot was exported 14 September 2026 and imported 24 October 2026. No citation counts or live publisher verification are claimed. An approved manuscript URL requires redistribution permission; DOI/profile links do not imply a local manuscript download.

## Add course material

1. Confirm the course, academic session, semester/programme, rights and public release intent. Preserve existing delivery records. If multiple semesters/programmes would collide, extend `sessionSlug` to make the route unique.
2. Review the file and metadata for privacy. Never publish current/unreleased examinations, marks, attendance or identifiers. Keep private drafts outside this repository entirely.
3. Place the approved file in `public/materials/courses/<courseSlug>/<sessionSlug>/`, using lowercase ASCII hyphenated names. No public asset may be orphaned from a published resource manifest.
4. Add metadata to the correct delivery. Example starting draft:

```json
{
  "id": "mec3203-notes-2024-2025-01",
  "ownerId": "C-006",
  "status": "draft",
  "title": "Chapter 1 lecture notes",
  "category": "lecture-notes",
  "format": "PDF",
  "file": null,
  "externalUrl": null,
  "description": null,
  "updatedAt": null,
  "accessibilityNote": null,
  "publicRelease": false,
  "externalCheckedAt": null
}
```

5. Set exactly one approved local `file` or HTTPS `externalUrl` before setting published. External resources need a successful signed-out public-access check date in `externalCheckedAt`. Past questions, solutions and assignments additionally require `publicRelease: true`. Never treat that flag as permission to release a current exam.
6. Run checks, open the actual file and inspect its session page and the materials library on desktop/mobile. Record the update in CHANGELOG.md and keep private permission evidence outside the repository.

Categories: lecture-notes, lecture-slides, practicals, tutorials, assignments, reading-lists, software-data, past-questions and solutions. Formats: PDF, PPTX, ZIP or URL. Local files offer View/Download; external resources offer an explicit external action and never masquerade as a local download.

Library parameters: `q`, `course` (stable course ID), `session` (academic session such as `2024/2025`) and `type` (category). Example: `/teaching/materials/?course=mec3203&session=2024%2F2025&type=lecture-notes`.

## Add an engagement or slide deck

Create a record in `content/talks.json` with stable ID, slug, `status: published`, verified title/summary, truthful `datePrecision` (`day`, `month`, `year`, `unknown`) and a matching ISO value or null. Optional fields include event, organiser, location, role, deliveryMode, topics, cover, recordingUrl, links and resources. Use null/empty arrays for unknown optional facts.

Place approved PDF/PPTX files under `public/materials/talks/<talkSlug>/`. A slide resource has category `slides` and ownerId equal to the engagement ID. Review rights, notes, hidden slides, comments, embedded objects and document metadata manually. External decks need a signed-out public access check and check date. The page renders direct Open slides/View/Download actions, without automatically loading an iframe. Add an accessible summary for image-based slides.

Dated engagements sort newest first; undated ones have their own group. No full date is fabricated from a year. Event structured data is emitted only when a real day-precision date, event and location are supplied.

## Add a project

Use `content/projects.json`. Published projects require ID, slug, title, context, personal contribution and `disclosureApproved: true`. Optional fields are problem, approach, partners, outputs, outcomes, images, publicationIds and start/end with precision. The case study separates contribution, outputs and outcomes. Link only supplied publications and approved local images; include alt text, caption and actual dimensions. Identify group/PI roles accurately; never imply sole receipt of group funding.

Approved local images referenced by published projects/talks join the public asset manifest. The narrowly reviewed shared asset allowlist is in the validator. New files in public storage are rejected until approved/referenced.

## Contact and CV slots

Replace `profile.email: null` with an approved public address to enable mailto. For CV, use a resource object with category `cv`, ownerId `hamza`, an approved file under `/materials/profile/` and status published. Remove all referees and private contact/student data before adding a CV. Unknown appointment dates stay omitted. No dummy email or CV download enters production.

## Portrait, fonts and design

Action icons use a local Lucide SVG subset: Arrow Right for internal navigation and local document viewing, External Link for external websites, Download for file downloads, Arrow Down for scroll prompts, and Mail for email links. They are decorative beside visible labels and do not indicate new-tab behaviour. Profile brand logos remain separate. See THIRD_PARTY_NOTICES.md for sources and licenses; `/review-preview/styles/` includes a development-only legend.

The supplied glasses portrait is a 960 × 1200 WebP crop, 68.1 KiB. No AI editing was applied. The LCP image is eager with high fetch priority and explicit dimensions. Other images are dimensioned and lazy by default. Static export uses unoptimised Next Image, with no server image optimiser.

The approved prototype uses documented Georgia, Arial/Helvetica and Courier New fallbacks. Licensed preferred Literata, Archivo and IBM Plex Mono WOFF2 files have not been supplied. There are no remote font requests. Design tokens are centralised in CSS, with darker steel text (#56636C) for contrast. Motion respects reduced-motion preferences, and print styles remove navigation/filter clutter.

## Deployment paths

`lib/site.ts` is the single origin/base-path source. Default origin is `https://hsabdullahi.github.io`, with empty base path, following the configured user-site Git remote. The owner confirmed `hsabdullahi.github.io` as the launch address on 26 October 2026. No custom domain is planned. GitHub Pages account settings still need verification before release.

Override `NEXT_PUBLIC_SITE_ORIGIN` with an HTTP(S) origin without a trailing slash and `NEXT_PUBLIC_BASE_PATH` with empty string or `/repository`. Next Link handles framework paths; raw images/files use `assetPath`; canonical/sitemap URLs use `absoluteUrl`. Do not prefix Link targets manually or use assetPrefix as a substitute.

```sh
NEXT_PUBLIC_BASE_PATH=/portfolio npm run build
NEXT_PUBLIC_BASE_PATH=/portfolio npm run check:output
NEXT_PUBLIC_BASE_PATH=/portfolio npm start
# Stop the server, then restore the root export:
npm run build
npm run check:output
```

Every nested route exports an index.html via trailingSlash. There are no server actions, runtime APIs, authentication or protected storage in the production site. Uploads would require a separately approved future service. Host videos/large files externally with approved stable public links.

## Performance and evidence

```sh
# With a production export running via npm start:
CHROME_PATH='/path/to/chrome' node scripts/performance.mjs
```

This records Lighthouse 13.5.0 mobile reports, three fresh-profile/cold-cache runs per real representative route, no extensions, 390 × 844 emulation, default simulated mobile network and 4× CPU slowdown. Results and local screenshots/print PDFs are ignored under `review-evidence/`. The preview server uses gzip; actual hosting behaviour must be checked after authorisation to release. These are lab results, not field INP claims.

See REVIEW_NOTES.md for actual measurements and verification limits; CONTENT_STATUS.md lists source facts and missing assets. Remaining content is real project evidence, speaking facts/slides, course material files, public email/CV. The dummy examples preserve those slots in development. Nothing has been committed, pushed or deployed by this implementation.
