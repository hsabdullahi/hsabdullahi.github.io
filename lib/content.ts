import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import {
  courseSchema,
  sessionSchema,
  profileSchema,
  publicationSchema,
  talkSchema,
  projectSchema,
  draftSchema,
  resourceSchema,
  type Resource,
  type Session,
  type Talk,
} from "./schemas.ts";

const read = (file: string) =>
  JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "content", file), "utf8"),
  );
function published<T extends z.ZodType>(
  schema: T,
  values: unknown,
): z.output<T>[] {
  return z
    .array(z.union([schema, draftSchema]))
    .parse(values)
    .filter((value) => (value as { status: string }).status === "published")
    .map((value) => schema.parse(value));
}
function publicResources(values: unknown[]): Resource[] {
  return values
    .filter((value) => (value as { status: string }).status === "published")
    .map((value) => {
      const resource = resourceSchema.parse(value);
      return {
        ...resource,
        sizeBytes: resource.file
          ? fs.statSync(path.join(process.cwd(), "public", resource.file)).size
          : null,
      };
    });
}
export const profile = profileSchema.parse(read("profile.json"));
export const cv =
  profile.cv?.status === "published" ? publicResources([profile.cv])[0] : null;
export const publications = published(
  publicationSchema,
  read("publications.json"),
).sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
export const courses = fs
  .readdirSync("content/courses")
  .filter((file) => file.endsWith(".json"))
  .flatMap((file) => published(courseSchema, [read(`courses/${file}`)]))
  .sort((a, b) => a.code.localeCompare(b.code));
export const sessions: Session[] = published(
  sessionSchema,
  read("course-sessions/deliveries.json"),
).map((session) => ({
  ...session,
  resources: publicResources(session.resources),
}));
export const talks: Talk[] = published(talkSchema, read("talks.json"))
  .map((talk) => ({ ...talk, resources: publicResources(talk.resources) }))
  .sort(
    (a, b) =>
      (b.date || "").localeCompare(a.date || "") ||
      a.title.localeCompare(b.title),
  );
export const projects = published(projectSchema, read("projects.json"));
export const courseHref = (course: { slug: string }) =>
  `/teaching/${course.slug}/`;
export const sessionHref = (
  session: Pick<Session, "courseId" | "sessionSlug">,
) =>
  `${courseHref(courses.find((course) => course.id === session.courseId)!)}${session.sessionSlug}/`;
export const libraryResources = sessions.flatMap((session) =>
  session.resources.map((resource) => ({
    resource,
    session,
    course: courses.find((course) => course.id === session.courseId)!,
  })),
);
export const publicRoutes = [
  "/",
  "/research/",
  "/research/publications/",
  "/teaching/",
  "/teaching/materials/",
  "/about/",
  "/contact/",
  ...courses.map(courseHref),
  ...sessions.map(sessionHref),
  ...(talks.length
    ? ["/speaking/", ...talks.map((talk) => `/speaking/${talk.slug}/`)]
    : []),
  ...(projects.length
    ? ["/work/", ...projects.map((project) => `/work/${project.slug}/`)]
    : []),
];
