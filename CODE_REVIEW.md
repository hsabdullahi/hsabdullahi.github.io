# Code review — 26 October 2026

## Content handoff follow-up

### [P2] Let homepage actions wrap on narrow screens — app/globals.css:203

Adding the real Work action created three links in a non-wrapping flex row. At 320px and 375px the primary action shrank enough to break its label across three lines, while adjacent links also fragmented. Confirmed in the browser before fixing. Actions now wrap as whole links without shrinking, preserving readable labels. The review also checked the handoff facts, education month ranges and degree wording, project publication reference, draft exclusion, affected templates, schema changes and test changes. No other qualifying findings were confirmed in this change.

The source discrepancies recorded in CONTENT_STATUS.md remain editorial questions, not newly inferred facts. This follow-up does not verify live external profile/publisher availability or grant publication authorisation.

After the fix, lint, TypeScript, all 27 content tests, the production build and the 31-route/876-reference output check passed. Browser checks at 320, 375, 640, 901 and 1280px confirmed unbroken action labels and no horizontal overflow. The supplied publication snapshot remains unchanged, and the three draft project candidates remain excluded from public listings.

## Earlier full implementation review

Reviewed the complete uncommitted implementation using the review-agent skill. Findings below were reproduced before fixes. All are now fixed; locations refer to the corrected source. Fixes followed the read-only review under the owner's explicit request to fix issues.

## Findings

### [P1] Wrap archive indexes in valid Next pages — scripts/sync-routes.mjs:26

Publishing the first project or talk made the generated page export a component with unsupported custom page props. A real Next production build failed its generated PageProps check. Generated pages now wrap the reusable component in a prop-free page function.

### [P2] Allow legitimate archive JavaScript chunks — scripts/check-output.ts:119

Populated archive builds generated JavaScript filenames containing `(archives)`. The preview-leak check rejected these legitimate framework assets. It now checks explicit forbidden output directories while allowing archive chunks.

### [P2] Escape JSON-LD before embedding it — lib/structured-data.ts:1

The homepage's original replacement string evaluated to a literal less-than character. A profile name containing a closing script tag could escape the JSON script. Home now uses the shared serializer, which emits a literal Unicode escape and preserves JSON round-tripping.

### [P2] Skip unpublished featured courses — app/page.tsx:25

Setting a featured course and its deliveries to draft was valid content but crashed Home through a non-null assertion. The featured selection now includes only available published courses.

### [P2] Honour the configured homepage portrait and rank — app/page.tsx:48

Home hardcoded the portrait path and appointment text while About followed the profile. Replacing or removing the portrait could leave Home broken or stale. Home now uses the profile fields and supports a portrait-free layout.

### [P2] Resolve academic links by their labels — app/page.tsx:29

An empty valid link list crashed Home, and reordered links could label another destination as Google Scholar. Home now selects the labelled Scholar entry with a correctly labelled fallback and omits the action when no link exists.

### [P2] Accept an incomplete draft CV — lib/schemas.ts:90

A CV containing only its stable ID and draft status failed validation despite the documented draft contract. The profile now accepts the same minimal draft schema as other resources; unpublished CVs remain excluded.

### [P2] Accept draft publication rows without published fields — scripts/import-publications.ts:59

CSV import enforced published year and record requirements on draft rows. Draft rows now follow the draft schema, while published records retain full validation. Failed imports preserve the previous snapshot.

### [P2] Close the mobile navigation on current-page selection — components/header.tsx:11

Selecting the current page set aria-expanded to false while focus-within CSS kept the menu visible. Closing now returns focus to the menu button and visibility follows the open state. Keyboard browser verification confirmed the menu is hidden and focus is restored.

### [P2] Require the shared social image — scripts/validate-content.ts:193

Removing the mandatory social image passed validation; output checks also missed images referenced through metadata. Source validation now requires the shared image and exported metadata images are checked for missing targets.

### [P2] Disambiguate repeated archive page titles — lib/metadata.ts:4

Two valid talks with the same title, or two same-title projects, failed the unique-title output check. Metadata now distinguishes repeat records using date and/or slug labels. Visible titles remain unchanged.

## Assessment and verification

No unresolved qualifying findings remain in the reviewed paths. Validation includes lint, TypeScript, 26 contract/regression tests, a real populated-archive integration build, the normal static export and link checks. The normal export retains 29 content routes and 792 checked internal references. Dependency audit reported zero vulnerabilities.

The integration test passed at both the root path and `/portfolio`. The fixtures exercise future content states without changing the owner's records. This review did not repeat the earlier Lighthouse runs or verify live publisher links, GitHub Pages settings, or redistribution rights for future uploads. Nothing was committed, pushed or deployed.
