import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

// Build real Next routes with edge-case content, never changing the owner's records.
const root = process.cwd();
const directory = fs.realpathSync(
  fs.mkdtempSync(path.join(os.tmpdir(), "site-integration-")),
);
const read = (file) =>
  JSON.parse(fs.readFileSync(path.join(directory, file), "utf8"));
const write = (file, value) =>
  fs.writeFileSync(path.join(directory, file), JSON.stringify(value, null, 2));
try {
  for (const file of [
    "app",
    "components",
    "content",
    "dev",
    "lib",
    "scripts",
    "package.json",
    "package-lock.json",
    "next.config.ts",
    "tsconfig.json",
    "postcss.config.mjs",
    "tailwind.config.ts",
    "eslint.config.mjs",
  ]) {
    fs.cpSync(path.join(root, file), path.join(directory, file), {
      recursive: true,
      filter: (source) =>
        !source.startsWith(path.join(root, "app/review-preview")) &&
        !source.startsWith(path.join(root, "app/(archives)")),
    });
  }
  fs.symlinkSync(
    path.join(root, "node_modules"),
    path.join(directory, "node_modules"),
    "dir",
  );
  fs.mkdirSync(path.join(directory, "public/images"), { recursive: true });
  fs.copyFileSync(
    path.join(root, "public/images/social.png"),
    path.join(directory, "public/images/social.png"),
  );
  const profile = read("content/profile.json");
  const portrait = profile.portrait
    ? path.join(root, "public", profile.portrait)
    : path.join(root, "app/icon.png");
  const portraitUrl = `/images/review-portrait${path.extname(portrait)}`;
  fs.copyFileSync(portrait, path.join(directory, "public", portraitUrl));
  const name = "Review </script><script>window.reviewSentinel=1</script>";
  write("content/profile.json", {
    ...profile,
    name,
    rank: "Review rank",
    links: [],
    portrait: portraitUrl,
    cv: { id: "review-draft-cv", status: "draft" },
  });
  const course = read("content/courses/get102.json");
  write("content/courses/get102.json", { ...course, status: "draft" });
  write(
    "content/course-sessions/deliveries.json",
    read("content/course-sessions/deliveries.json").map((session) => ({
      ...session,
      status: session.courseId === "get102" ? "draft" : session.status,
      resources: [],
    })),
  );
  write(
    "content/projects.json",
    ["one", "two"].map((suffix) => ({
      id: `review-project-${suffix}`,
      slug: `review-project-${suffix}`,
      status: "published",
      title: "Repeated project title",
      context: "Integration test context",
      contribution: "Integration test contribution",
      disclosureApproved: true,
    })),
  );
  write(
    "content/talks.json",
    ["2024", "2025"].map((year) => ({
      id: `review-talk-${year}`,
      slug: `review-talk-${year}`,
      status: "published",
      title: "Repeated talk title",
      summary: "Integration test summary",
      datePrecision: "year",
      date: year,
      resources: [],
    })),
  );
  for (const command of ["build", "check:output"]) {
    const result = spawnSync("npm", ["run", command], {
      cwd: directory,
      encoding: "utf8",
      env: process.env,
    });
    assert.equal(
      result.status,
      0,
      `Isolated ${command} failed:\n${result.stdout}\n${result.stderr}`,
    );
  }
  const home = fs.readFileSync(path.join(directory, "out/index.html"), "utf8");
  const json = home.match(
    /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/,
  )?.[1];
  assert(json, "Person structured data missing");
  assert.equal(JSON.parse(json).name, name);
  assert(
    !home.includes("<script>window.reviewSentinel"),
    "Profile text escaped out of JSON-LD",
  );
  assert(home.includes(portraitUrl), "Homepage ignored configured portrait");
  assert(home.includes("Review rank"), "Homepage ignored configured rank");
  assert(
    !home.includes("/teaching/get102/"),
    "Draft featured course leaked into homepage",
  );
  assert(
    !fs.existsSync(path.join(directory, "out/teaching/get102")),
    "Draft course route exported",
  );
  for (const route of [
    "work",
    "speaking",
    "work/review-project-one",
    "work/review-project-two",
    "speaking/review-talk-2024",
    "speaking/review-talk-2025",
  ])
    assert(
      fs.existsSync(path.join(directory, "out", route, "index.html")),
      `Missing populated archive route ${route}`,
    );
  console.log(
    "PASS populated project/speaking archives, repeated titles, draft course/CV, empty academic links, configured profile and safe JSON-LD in a real static build.",
  );
} finally {
  fs.rmSync(directory, { recursive: true, force: true });
}
