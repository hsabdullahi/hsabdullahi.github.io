import assert from "node:assert/strict";
import { demoPdf } from "../dev/sample-pdf.ts";
const origin = process.env.PREVIEW_ORIGIN || "http://127.0.0.1:3000";
const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
for (const name of ["sample-notes.pdf", "sample-slides.pdf"]) {
  const response = await fetch(
    `${origin}${base}/review-preview/files/${name}`,
    { signal: AbortSignal.timeout(10000) },
  );
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /application\/pdf/);
  const bytes = Buffer.from(await response.arrayBuffer());
  assert.equal(bytes.toString(), demoPdf);
  assert.equal(Number(response.headers.get("content-length")), bytes.length);
  console.log(
    `PASS ${name}: ${bytes.length} bytes, valid development PDF response at ${base || "/"} mode`,
  );
}
for (const route of [
  "/review-preview/",
  "/review-preview/work/",
  "/review-preview/work/example/",
  "/review-preview/speaking/",
  "/review-preview/resources/",
  "/review-preview/contact/",
  "/review-preview/styles/",
]) {
  const response = await fetch(`${origin}${base}${route}`, {
    signal: AbortSignal.timeout(15000),
  });
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<meta name="robots" content="noindex, nofollow"/);
  console.log(`PASS labelled noindex review page ${route}`);
}
