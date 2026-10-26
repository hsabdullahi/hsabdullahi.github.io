import fs from "node:fs";
import { parse } from "csv-parse/sync";
import { z } from "zod";
import { publicationSchema, draftSchema } from "../lib/schemas.ts";
const expected = [
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
const input = process.argv[2];
if (!input)
  throw Error(
    "Usage: npm run import:publications -- /absolute/path/to/publications.csv",
  );
const rows: string[][] = parse(fs.readFileSync(input, "utf8"), {
  bom: true,
  skip_empty_lines: true,
});
if (JSON.stringify(rows.shift()) !== JSON.stringify(expected))
  throw Error("Unexpected CSV headers. Export the Publications tab only.");
const nullable = (v: string) => v.trim() || null;
const candidate = rows.map((r, i) => {
  if (r.length !== 18) throw Error(`Row ${i + 2}: expected 18 columns`);
  const [
    id,
    year,
    title,
    authors,
    venue,
    publicationType,
    volume,
    issue,
    pages,
    articleNumber,
    doi,
    doiUrl,
    sourceUrl,
    publisher,
    status,
    manuscriptUrl,
    source,
    verificationNote,
  ] = r.map((v) => v.trim());
  if (status !== "draft" && !/^\d{4}$/.test(year))
    throw Error(`Invalid year row ${i + 2}`);
  return {
    id,
    year: /^\d{4}$/.test(year) ? Number(year) : nullable(year),
    title,
    authors: authors ? authors.split(";").map((a) => a.trim()) : [],
    venue,
    publicationType,
    volume: nullable(volume),
    issue: nullable(issue),
    pages: nullable(pages),
    articleNumber: nullable(articleNumber),
    doi: nullable(doi),
    doiUrl: nullable(doiUrl),
    sourceUrl: nullable(sourceUrl),
    publisher: nullable(publisher),
    status,
    manuscriptUrl: nullable(manuscriptUrl),
    source,
    verificationNote,
  };
});
const validated = z
  .array(z.union([publicationSchema, draftSchema]))
  .parse(candidate);
for (const field of ["id", "doi"] as const) {
  const values = validated.flatMap((record) => {
    const value = record[field];
    return typeof value === "string" && value ? [value.toLowerCase()] : [];
  });
  if (new Set(values).size !== values.length) throw Error(`Duplicate ${field}`);
}
const temp = "content/publications.json.tmp";
fs.writeFileSync(temp, JSON.stringify(validated, null, 2) + "\n");
fs.renameSync(temp, "content/publications.json");
console.log(
  `Imported ${validated.length} publications. Review the diff and update CHANGELOG.md with the snapshot date.`,
);
