import assert from "node:assert/strict";
const origin = process.env.PREVIEW_ORIGIN || "http://127.0.0.1:3000";
const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
for (const route of [
  "/",
  "/teaching/",
  "/teaching/mec3203/2024-2025/",
  "/research/publications/",
  "/about/",
  "/contact/",
]) {
  const response = await fetch(origin + base + route, {
    signal: AbortSignal.timeout(10000),
  });
  assert.equal(response.status, 200);
  const html = await response.text();
  assert(html.includes(`https://hsabdullahi.github.io${base}${route}`));
  console.log(`PASS static HTTP ${base}${route}`);
}
for (const file of ["/images/hamza.webp", "/images/social.png"]) {
  const response = await fetch(origin + base + file, {
    signal: AbortSignal.timeout(10000),
  });
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /^image\//);
  console.log(`PASS image ${base}${file}`);
}
for (const route of [
  "/does-not-exist/",
  "/speaking/",
  "/work/",
  "/review-preview/",
]) {
  const response = await fetch(origin + base + route, {
    signal: AbortSignal.timeout(10000),
  });
  assert.equal(response.status, 404);
  console.log(`PASS proper 404 ${base}${route}`);
}
