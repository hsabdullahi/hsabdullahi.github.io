import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import {
  profileSchema,
  publicationSchema,
  courseSchema,
  sessionSchema,
  talkSchema,
  projectSchema,
  draftSchema,
  resourceSchema,
  type Resource,
} from "../lib/schemas.ts";

const read = (file: string) => JSON.parse(fs.readFileSync(file, "utf8"));
function records<T extends z.ZodType>(
  schema: T,
  values: unknown,
): z.output<T>[] {
  const entries = z.array(z.union([schema, draftSchema])).parse(values);
  unique(
    entries.map((entry) => (entry as { id: string }).id),
    "record ids",
  );
  return entries
    .filter((entry) => (entry as { status: string }).status === "published")
    .map((entry) => schema.parse(entry));
}
function unique(values: string[], label: string) {
  if (new Set(values).size !== values.length) throw Error(`Duplicate ${label}`);
}
const profile = profileSchema.parse(read("content/profile.json"));
const publications = records(
  publicationSchema,
  read("content/publications.json"),
);
const rawCourses = fs
  .readdirSync("content/courses")
  .filter((file) => file.endsWith(".json"))
  .map((file) => read(`content/courses/${file}`));
const courses = records(courseSchema, rawCourses);
const rawSessions = read("content/course-sessions/deliveries.json");
const sessions = records(sessionSchema, rawSessions);
const rawTalks = read("content/talks.json"),
  rawProjects = read("content/projects.json");
const talks = records(talkSchema, rawTalks),
  projects = records(projectSchema, rawProjects);
const allIds = [
  profile.id,
  ...rawCourses.map((c) => (c as { id: string }).id),
  ...rawSessions.map((s: { id: string }) => s.id),
  ...read("content/publications.json").map((p: { id: string }) => p.id),
  ...rawTalks.map((t: { id: string }) => t.id),
  ...rawProjects.map((p: { id: string }) => p.id),
];
unique(allIds, "global record ids");
unique(
  publications.flatMap((p) => (p.doi ? [p.doi.toLowerCase()] : [])),
  "DOIs",
);
unique(
  courses.map((course) => course.slug),
  "course slugs",
);
unique(
  talks.map((talk) => talk.slug),
  "talk slugs",
);
unique(
  projects.map((project) => project.slug),
  "project slugs",
);
unique(
  sessions.map((session) => `${session.courseId}/${session.sessionSlug}`),
  "session route slugs; extend the slug to include semester/programme if needed",
);
if (courses.some((course) => course.slug === "materials"))
  throw Error("Course slug 'materials' is reserved for the library");
const resources: { resource: Resource; ownerId: string; directory: string }[] =
  [];
function collect(values: unknown[], ownerId: string, directory: string) {
  for (const value of values) {
    if ((value as { status: string }).status !== "published") continue;
    const resource = resourceSchema.parse(value);
    resources.push({
      resource: { ...resource, sizeBytes: null },
      ownerId,
      directory,
    });
  }
}
for (const session of sessions) {
  const course = courses.find((course) => course.id === session.courseId);
  if (!course)
    throw Error(
      `Published session ${session.id} refers to an unpublished/unknown course`,
    );
  const [start, end] = session.academicSession.split("/").map(Number);
  if (end !== start + 1) throw Error(`Invalid academic session ${session.id}`);
  collect(
    session.resources,
    session.id,
    `/materials/courses/${course.slug}/${session.sessionSlug}/`,
  );
}
for (const talk of talks)
  collect(talk.resources, talk.id, `/materials/talks/${talk.slug}/`);
if (profile.cv?.status === "published")
  collect([profile.cv], profile.id, "/materials/profile/");
for (const project of projects) {
  for (const id of project.publicationIds)
    if (!publications.some((p) => p.id === id))
      throw Error(
        `Project ${project.id} refers to unknown/unpublished publication ${id}`,
      );
  if (project.start?.date && project.end?.date) {
    const lower = (value: string) =>
      value.length === 4
        ? `${value}-01-01`
        : value.length === 7
          ? `${value}-01`
          : value;
    const upper = (value: string) =>
      value.length === 4
        ? `${value}-12-31`
        : value.length === 7
          ? `${value}-31`
          : value;
    if (lower(project.start.date) > upper(project.end.date))
      throw Error(`Project ${project.id} has a reversed date range`);
  }
}
unique(
  resources.map(({ resource }) => resource.id),
  "published resource ids",
);
const publicRoot = fs.realpathSync("public");
function checkedFile(url: string) {
  if (!/^\/[a-z0-9][a-z0-9/.-]*$/.test(url) || url.includes(".."))
    throw Error(`Unsafe public path ${url}`);
  const location = path.resolve("public", `.${url}`);
  if (
    !location.startsWith(publicRoot + path.sep) ||
    !fs.realpathSync(location).startsWith(publicRoot + path.sep)
  )
    throw Error(`Public path escapes public directory: ${url}`);
  if (!fs.statSync(location).isFile())
    throw Error(`Not a regular public file: ${url}`);
  return fs.readFileSync(location);
}
const manifest = new Set<string>();
for (const { resource, ownerId, directory } of resources) {
  if (resource.ownerId !== ownerId)
    throw Error(`Unresolved resource owner: ${resource.id}`);
  if (!resource.file) continue;
  if (!resource.file.startsWith(directory))
    throw Error(`Resource ${resource.id} must be under ${directory}`);
  const buffer = checkedFile(resource.file);
  if (path.extname(resource.file).slice(1).toUpperCase() !== resource.format)
    throw Error(`Format mismatch ${resource.id}`);
  if (
    resource.format === "PDF" &&
    (buffer.subarray(0, 5).toString() !== "%PDF-" ||
      !buffer.subarray(-1024).includes(Buffer.from("%%EOF")))
  )
    throw Error(`Invalid PDF signature ${resource.id}`);
  if (
    ["ZIP", "PPTX"].includes(resource.format) &&
    (buffer.subarray(0, 2).toString() !== "PK" ||
      !buffer.includes(Buffer.from([0x50, 0x4b, 0x05, 0x06])))
  )
    throw Error(`Invalid ZIP container ${resource.id}`);
  if (
    resource.format === "PPTX" &&
    (!["[Content_Types].xml", "ppt/presentation.xml"].every((name) =>
      buffer.includes(Buffer.from(name)),
    ) ||
      buffer.includes(Buffer.from("vbaProject.bin")))
  )
    throw Error(`Invalid/macro-enabled PPTX ${resource.id}`);
  manifest.add(resource.file);
}
const imageFiles = [
  profile.portrait,
  ...talks.flatMap((talk) => (talk.cover ? [talk.cover.file] : [])),
  ...projects.flatMap((project) => project.images.map((image) => image.file)),
].filter((value): value is string => !!value);
for (const file of imageFiles) {
  checkedFile(file);
  manifest.add(file);
}
const requiredSharedAssets = ["/images/social.png"];
for (const file of requiredSharedAssets) checkedFile(file);
const sharedAssets = new Set(["/.nojekyll", ...requiredSharedAssets]);
function publicFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const location = path.join(directory, entry.name);
    if (entry.isSymbolicLink())
      throw Error(`Symlinks are not allowed in public storage: ${location}`);
    return entry.isDirectory() ? publicFiles(location) : [location];
  });
}
for (const file of publicFiles("public")) {
  const url = "/" + file.slice(7);
  if (!manifest.has(url) && !sharedAssets.has(url))
    throw Error(`Orphaned or draft public asset: ${url}`);
}
const publicText = JSON.stringify({
  profile: {
    ...profile,
    cv: profile.cv?.status === "published" ? profile.cv : null,
  },
  publications,
  courses,
  sessions: sessions.map((s) => ({
    ...s,
    resources: s.resources.filter((r) => r.status === "published"),
  })),
  talks: talks.map((t) => ({
    ...t,
    resources: t.resources.filter((r) => r.status === "published"),
  })),
  projects,
});
for (const pattern of [
  /\b(?:BUK|MEC|ATE)\/\d{2}\/\w{4,}/i,
  /\b(?:student registration number|attendance sheet|current examination|referee telephone)\b/i,
  /\+234[\s\d-]{9,}/,
])
  if (pattern.test(publicText))
    throw Error(`Privacy review required: ${pattern}`);
if (fs.existsSync("app/review-preview"))
  throw Error(
    "Stop review server before production build: app/review-preview must not exist",
  );
console.log(
  `Validated ${publications.length} publications, ${courses.length} courses, ${sessions.length} deliveries, ${talks.length} talks, ${projects.length} projects; ${resources.length} approved resources; public asset manifest clean.`,
);
