import fs from "node:fs";
import path from "node:path";
import {
  publicRoutes,
  sessions,
  talks,
  projects,
  profile,
} from "../lib/content.ts";
import { site, absoluteUrl } from "../lib/site.ts";
const files = (directory: string): string[] =>
  fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) =>
      entry.isDirectory()
        ? files(path.join(directory, entry.name))
        : [path.join(directory, entry.name)],
    );
const exported = files("out"),
  root = path.resolve("out");
const metadata = new Set<string>();
let links = 0;
const fail = (message: string) => {
  throw Error(message);
};
function fileFor(url: URL) {
  if (
    site.basePath &&
    url.pathname !== site.basePath &&
    !url.pathname.startsWith(site.basePath + "/")
  )
    fail(`Missing base path: ${url.pathname}`);
  const relative = decodeURIComponent(url.pathname.slice(site.basePath.length));
  let location = path.resolve(root, "." + relative);
  if (location !== root && !location.startsWith(root + path.sep))
    fail(`Output path escapes root: ${url.pathname}`);
  if (fs.existsSync(location) && fs.statSync(location).isDirectory())
    location = path.join(location, "index.html");
  return location;
}
for (const route of publicRoutes) {
  const file = fileFor(new URL(absoluteUrl(route)));
  if (!fs.existsSync(file)) fail(`Published route missing: ${route}`);
  const html = fs.readFileSync(file, "utf8");
  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1];
  if (!title || metadata.has(title)) fail(`Missing/duplicate title: ${route}`);
  metadata.add(title!);
  if (!html.includes(`<link rel="canonical" href="${absoluteUrl(route)}"`))
    fail(`Incorrect canonical: ${route}`);
  if (!/<meta name="description" content="[^"]+"/.test(html))
    fail(`Missing description: ${route}`);
  if (!html.includes('lang="en"') || !html.includes('id="main"'))
    fail(`Language or main landmark missing: ${route}`);
}
const origins = new Set([site.origin]);
for (const file of exported.filter((file) => file.endsWith(".html"))) {
  const html = fs.readFileSync(file, "utf8");
  if (
    /Development fixture|Style reference|fictional engagement|your-name@example\.invalid|SENTINEL_NOT_PUBLIC/i.test(
      html,
    )
  )
    fail(`Development content leaked: ${file}`);
  const routePath =
    "/" + path.relative(root, path.resolve(file)).replace(/index\.html$/, "");
  const source = new URL(absoluteUrl(routePath));
  for (const [tag] of html.matchAll(/<meta\b[^>]*>/g)) {
    const property = tag.match(/(?:property|name)="([^"]+)"/)?.[1];
    if (property !== "og:image" && property !== "twitter:image") continue;
    const value = tag.match(/content="([^"]+)"/)?.[1];
    if (!value) fail(`Missing social image URL in ${file}`);
    const url = new URL(value!.replaceAll("&amp;", "&"), source);
    if (origins.has(url.origin) && !fs.existsSync(fileFor(url)))
      fail(`Broken social image ${value} in ${file}`);
  }
  for (const [, raw] of html.matchAll(/(?:href|src)="([^"<>]+)"/g)) {
    const value = raw.replaceAll("&amp;", "&");
    if (/^(mailto:|tel:|data:)/.test(value)) continue;
    const url = new URL(value, source);
    if (!origins.has(url.origin)) continue;
    const target = fileFor(url);
    if (!fs.existsSync(target))
      fail(`Broken internal reference ${value} in ${file}`);
    if (url.hash && target.endsWith(".html")) {
      const id = decodeURIComponent(url.hash.slice(1));
      if (!fs.readFileSync(target, "utf8").includes(`id="${id}"`))
        fail(`Broken fragment ${value} in ${file}`);
    }
    links++;
  }
  const text = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, "")
    .replace(/<[^>]+>/g, " ");
  if (
    /\b(?:BUK|MEC|ATE)\/\d{2}\/\w{4,}|\b(?:student registration number|attendance sheet|referee telephone)\b/i.test(
      text,
    )
  )
    fail(`Public text privacy review required: ${file}`);
}
const manifest = new Set(
  sessions
    .flatMap((session) => session.resources)
    .concat(
      talks.flatMap((talk) => talk.resources),
      profile.cv?.status === "published"
        ? [{ ...profile.cv, sizeBytes: null }]
        : [],
    )
    .flatMap((resource) => (resource.file ? [resource.file] : [])),
);
const outputMaterials = exported.filter((file) =>
  file.startsWith("out/materials/"),
);
for (const file of outputMaterials)
  if (!manifest.has("/" + file.slice(4)))
    fail(`Unapproved exported material ${file}`);
const leakedSource = exported.find((file) =>
  [
    "out/review-preview/",
    "out/(archives)/",
    "out/_next/static/chunks/app/review-preview/",
  ].some((directory) => file.startsWith(directory)),
);
if (leakedSource)
  fail(`Preview/source directory leaked into export: ${leakedSource}`);
if (!talks.length && exported.some((file) => file.startsWith("out/speaking/")))
  fail("Empty speaking archive exported");
if (!projects.length && exported.some((file) => file.startsWith("out/work/")))
  fail("Empty work archive exported");
const sitemap = fs.readFileSync("out/sitemap.xml", "utf8");
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
  (match) => match[1],
);
if (
  urls.length !== publicRoutes.length ||
  publicRoutes.some((route) => !urls.includes(absoluteUrl(route)))
)
  fail("Sitemap differs from published route manifest");
console.log(
  `Checked ${publicRoutes.length} published routes, unique metadata, sitemap, material manifest and ${links} internal references across ${exported.filter((file) => file.endsWith(".html")).length} HTML files.`,
);
