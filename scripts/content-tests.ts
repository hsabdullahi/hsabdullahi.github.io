import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import assert from "node:assert/strict";
import { resourceSchema, talkSchema, profileSchema } from "../lib/schemas.ts";
import { serializeStructuredData } from "../lib/structured-data.ts";
import { demoPdf } from "../dev/sample-pdf.ts";

const root = process.cwd(),
  directory = fs.mkdtempSync(path.join(os.tmpdir(), "personal-site-content-"));
let count = 0;
function test(name: string, run: () => void) {
  run();
  count++;
  console.log(`PASS ${name}`);
}
function reset() {
  fs.rmSync(path.join(directory, "content"), { recursive: true, force: true });
  fs.rmSync(path.join(directory, "public"), { recursive: true, force: true });
  fs.cpSync(path.join(root, "content"), path.join(directory, "content"), {
    recursive: true,
  });
  fs.cpSync(path.join(root, "public"), path.join(directory, "public"), {
    recursive: true,
  });
}
type Fixture = {
  id: string;
  status?: string;
  courseId?: string;
  sessionSlug?: string;
  resources?: unknown[];
  doi?: string;
};
function mutate(file: string, change: (value: Fixture[]) => void) {
  const location = path.join(directory, file),
    value = JSON.parse(fs.readFileSync(location, "utf8"));
  change(value);
  fs.writeFileSync(location, JSON.stringify(value));
}
function validate() {
  const result = spawnSync(
    process.execPath,
    [path.join(root, "scripts/validate-content.ts")],
    { cwd: directory, encoding: "utf8" },
  );
  return { ok: result.status === 0, output: result.stdout + result.stderr };
}
function expectValidation(success: boolean, pattern?: RegExp) {
  const result = validate();
  assert.equal(result.ok, success, result.output);
  if (pattern) assert.match(result.output, pattern);
}
const resource = {
  id: "test-notes",
  status: "published",
  ownerId: "C-006",
  title: "Sample notes",
  category: "lecture-notes",
  format: "PDF",
  file: "/materials/courses/mec3203/2024-2025/sample.pdf",
  externalUrl: null,
};
function addResource(value: unknown = resource) {
  mutate("content/course-sessions/deliveries.json", (entries) =>
    entries
      .find((s: { id: string }) => s.id === "C-006")!
      .resources!.push(value),
  );
}
function pdf() {
  const file = path.join(
    directory,
    "public/materials/courses/mec3203/2024-2025/sample.pdf",
  );
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, demoPdf);
}
const publicationHeaders = [
  "Publication ID",
  "Year",
  "Title",
  "Authors (ordered; separated by semicolons)",
  "Journal / Venue",
  "Publication Type",
  "Volume",
  "Issue",
  "Pages",
  "Article Number",
  "DOI",
  "DOI URL",
  "Source URL",
  "Publisher",
  "Website Status",
  "Approved Manuscript URL",
  "Source / Import",
  "Notes",
];
function importPublications(rows: string[][]) {
  const file = path.join(directory, "publications-import.csv");
  const csv = [publicationHeaders, ...rows]
    .map((row) =>
      row.map((value) => `"${value.replaceAll('"', '""')}"`).join(","),
    )
    .join("\r\n");
  fs.writeFileSync(file, csv);
  return spawnSync(
    process.execPath,
    [path.join(root, "scripts/import-publications.ts"), file],
    { cwd: directory, encoding: "utf8" },
  );
}
try {
  reset();
  test("supplied content validates", () => expectValidation(true));
  reset();
  test("missing required social image fails", () => {
    fs.rmSync(path.join(directory, "public/images/social.png"));
    expectValidation(false, /ENOENT/);
  });
  reset();
  test("incomplete draft CV validates without publishing a file", () => {
    const file = path.join(directory, "content/profile.json");
    const profile = JSON.parse(fs.readFileSync(file, "utf8"));
    profile.cv = { id: "draft-cv", status: "draft" };
    assert(profileSchema.safeParse(profile).success);
    fs.writeFileSync(file, JSON.stringify(profile));
    expectValidation(true);
  });
  test("structured data escapes script delimiters and round-trips", () => {
    const value = {
      name: "</script><script>reviewMarker()</script>",
      description: 'Less < more & quoted "text"',
    };
    const serialized = serializeStructuredData(value);
    assert(!serialized.includes("<"));
    assert.deepEqual(JSON.parse(serialized), value);
  });
  reset();
  test("CSV imports preserve incomplete drafts", () => {
    // This fixture replaces the publication snapshot; unrelated projects must
    // not retain references to records deliberately removed by the importer.
    fs.writeFileSync(path.join(directory, "content/projects.json"), "[]");
    const row = Array<string>(18).fill("");
    row[0] = "draft-import";
    row[14] = "draft";
    const result = importPublications([row]);
    assert.equal(result.status, 0, result.stderr);
    const records = JSON.parse(
      fs.readFileSync(
        path.join(directory, "content/publications.json"),
        "utf8",
      ),
    );
    assert.equal(records[0].status, "draft");
    assert.equal(records[0].year, null);
    expectValidation(true);
  });
  test("education preserves month precision and rejects invalid ranges", () => {
    const profile = JSON.parse(
      fs.readFileSync(path.join(root, "content/profile.json"), "utf8"),
    );
    const parsed = profileSchema.parse(profile);
    assert.equal(parsed.education[0].start, "2016-09");
    assert.equal(parsed.education[0].qualification, "Doctor of Engineering");
    assert.equal(parsed.researchTraining[0].end, "2023-07");
    for (const entry of [
      { ...parsed.education[0], start: "2016-13" },
      { ...parsed.education[0], start: "2022-01", end: "2021-03" },
    ])
      assert.equal(
        profileSchema.safeParse({ ...profile, education: [entry] }).success,
        false,
      );
  });
  reset();
  test("invalid published CSV preserves the previous snapshot", () => {
    const file = path.join(directory, "content/publications.json"),
      before = fs.readFileSync(file, "utf8");
    const row = Array<string>(18).fill("");
    row[0] = "bad-import";
    row[14] = "published";
    assert.notEqual(importPublications([row]).status, 0);
    assert.equal(fs.readFileSync(file, "utf8"), before);
  });
  reset();
  test("CSV imports preserve quoted multiline text and ordered authors", () => {
    const row = Array<string>(18).fill("");
    row[0] = "quoted-import";
    row[1] = "2026";
    row[2] = 'A "quoted", multiline\npublication';
    row[3] = "First, A.; Second, B.";
    row[4] = "Review venue";
    row[5] = "Article";
    row[14] = "published";
    row[16] = "Review fixture";
    const result = importPublications([row]);
    assert.equal(result.status, 0, result.stderr);
    const records = JSON.parse(
      fs.readFileSync(
        path.join(directory, "content/publications.json"),
        "utf8",
      ),
    );
    assert.equal(records[0].title, row[2]);
    assert.deepEqual(records[0].authors, ["First, A.", "Second, B."]);
  });
  reset();
  test("unknown CSV status preserves the previous snapshot", () => {
    const file = path.join(directory, "content/publications.json"),
      before = fs.readFileSync(file, "utf8");
    const row = Array<string>(18).fill("");
    row[0] = "bad-status";
    row[1] = "2026";
    row[14] = "ready";
    assert.notEqual(importPublications([row]).status, 0);
    assert.equal(fs.readFileSync(file, "utf8"), before);
  });
  reset();
  test("incomplete draft talk is allowed without a public route", () => {
    mutate("content/talks.json", (entries) =>
      entries.push({ id: "draft-example", status: "draft" }),
    );
    expectValidation(true);
  });
  reset();
  test("draft resource metadata does not require a public file", () => {
    addResource({
      id: "draft-notes",
      status: "draft",
      file: "/materials/courses/mec3203/2024-2025/not-present.pdf",
    });
    expectValidation(true);
  });
  reset();
  test("published local PDF validates with matching signature and owner", () => {
    addResource();
    pdf();
    expectValidation(true);
  });
  reset();
  test("missing published file fails", () => {
    addResource();
    expectValidation(false, /ENOENT/);
  });
  reset();
  test("orphaned public material fails", () => {
    pdf();
    expectValidation(false, /Orphaned or draft/);
  });
  reset();
  test("draft public file fails manifest", () => {
    addResource({ ...resource, status: "draft" });
    pdf();
    expectValidation(false, /Orphaned or draft/);
  });
  reset();
  test("path traversal fails", () => {
    addResource({
      ...resource,
      file: "/materials/courses/mec3203/2024-2025/../../private.pdf",
    });
    expectValidation(false, /Unsafe/);
  });
  reset();
  test("symlinked public files fail", () => {
    fs.symlinkSync(
      path.join(root, "package.json"),
      path.join(directory, "public/leak.json"),
    );
    expectValidation(false, /Symlink/);
  });
  reset();
  test("invalid PDF fails signature validation", () => {
    addResource();
    pdf();
    fs.writeFileSync(
      path.join(directory, "public", resource.file),
      "not a PDF",
    );
    expectValidation(false, /Invalid PDF/);
  });
  reset();
  test("unknown course reference fails", () => {
    mutate(
      "content/course-sessions/deliveries.json",
      (entries) => (entries[0].courseId = "unknown"),
    );
    expectValidation(false, /unpublished\/unknown/);
  });
  reset();
  test("colliding delivery slug fails", () => {
    mutate("content/course-sessions/deliveries.json", (entries) => {
      entries[5].sessionSlug = entries[1].sessionSlug;
    });
    expectValidation(false, /session route/);
  });
  reset();
  test("duplicate DOI fails", () => {
    mutate(
      "content/publications.json",
      (entries) => (entries[1].doi = entries[0].doi),
    );
    expectValidation(false, /DOI/);
  });
  reset();
  test("likely student identifier requires review", () => {
    const file = path.join(directory, "content/courses/mec3203.json");
    const course = JSON.parse(fs.readFileSync(file, "utf8"));
    course.summary = "BUK/24/123456";
    fs.writeFileSync(file, JSON.stringify(course));
    expectValidation(false, /Privacy review/);
  });
  test("assessment release must be explicit", () =>
    assert.equal(
      resourceSchema.safeParse({ ...resource, category: "past-questions" })
        .success,
      false,
    ));
  test("external resources require public access check date", () =>
    assert.equal(
      resourceSchema.safeParse({
        ...resource,
        file: null,
        externalUrl: "https://example.org/deck",
      }).success,
      false,
    ));
  test("external and local locations cannot coexist", () =>
    assert.equal(
      resourceSchema.safeParse({
        ...resource,
        externalUrl: "https://example.org/deck",
        externalCheckedAt: "2026-10-24",
      }).success,
      false,
    ));
  test("invalid calendar dates fail", () =>
    assert.equal(
      talkSchema.safeParse({
        id: "date-test",
        slug: "date-test",
        status: "published",
        title: "Test",
        summary: "Test",
        datePrecision: "day",
        date: "2025-02-30",
        resources: [],
      }).success,
      false,
    ));
  test("year-only dates remain year-only", () =>
    assert.equal(
      talkSchema.parse({
        id: "date-test",
        slug: "date-test",
        status: "published",
        title: "Test",
        summary: "Test",
        datePrecision: "year",
        date: "2025",
        resources: [],
      }).date,
      "2025",
    ));
  console.log(`${count} content contract tests passed.`);
} finally {
  fs.rmSync(directory, { recursive: true, force: true });
}
