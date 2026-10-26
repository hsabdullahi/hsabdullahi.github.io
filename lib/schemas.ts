import { z } from "zod";

const text = z.string().trim().min(1);
const slug = text.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
export const https = z
  .url()
  .refine((value) => value.startsWith("https://"), "HTTPS required");
const status = z.enum(["draft", "published"]);
const linkSchema = z.object({ label: text, url: https });
export const resourceCategories = [
  "lecture-notes",
  "lecture-slides",
  "practicals",
  "tutorials",
  "assignments",
  "reading-lists",
  "software-data",
  "past-questions",
  "solutions",
  "slides",
  "cv",
] as const;
export const categoryLabels: Record<
  (typeof resourceCategories)[number],
  string
> = {
  "lecture-notes": "Lecture notes",
  "lecture-slides": "Lecture slides",
  practicals: "Practicals",
  tutorials: "Tutorials",
  assignments: "Assignments",
  "reading-lists": "Reading lists",
  "software-data": "Software & data",
  "past-questions": "Past questions",
  solutions: "Solutions",
  slides: "Presentation slides",
  cv: "Curriculum vitae",
};
const resourceFields = {
  id: slug,
  status,
  ownerId: text,
  title: text,
  category: z.enum(resourceCategories),
  format: z.enum(["PDF", "PPTX", "ZIP", "URL"]),
  file: text.nullable(),
  externalUrl: https.nullable(),
  description: text.nullable().default(null),
  accessibilityNote: text.nullable().default(null),
  updatedAt: z.iso.date().nullable().default(null),
  publicRelease: z.boolean().default(false),
  externalCheckedAt: z.iso.date().nullable().default(null),
};
export const resourceSchema = z
  .object(resourceFields)
  .superRefine((resource, context) => {
    if (resource.status !== "published") return;
    const issue = (message: string) =>
      context.addIssue({ code: "custom", message });
    if (Number(!!resource.file) + Number(!!resource.externalUrl) !== 1)
      issue("Published resources need exactly one file or URL");
    if (
      ["past-questions", "solutions", "assignments"].includes(
        resource.category,
      ) &&
      !resource.publicRelease
    )
      issue("Assessment requires explicit public release");
    if (resource.externalUrl && !resource.externalCheckedAt)
      issue("External public-access check required");
    if (resource.file && resource.format === "URL")
      issue("A local file must declare its file format");
  });
export const draftSchema = z
  .object({ id: text, status: z.literal("draft") })
  .passthrough();

const educationSchema = z
  .object({
    qualification: text,
    institution: text,
    start: text.regex(/^\d{4}-(0[1-9]|1[0-2])$/),
    end: text.regex(/^\d{4}-(0[1-9]|1[0-2])$/),
    field: text,
    dissertation: text.nullable(),
  })
  .refine(
    (entry) => entry.start <= entry.end,
    "Education dates must be ordered",
  );

export const profileSchema = z.object({
  id: text,
  status: z.literal("published"),
  name: text,
  rank: text,
  affiliations: z.array(text).min(1),
  summary: text,
  links: z.array(linkSchema),
  appointments: z.array(z.object({ label: text, description: text })),
  biography: text,
  postnominalName: text.optional(),
  teachingStatement: text.optional(),
  researchThemes: z.array(text).default([]),
  education: z.array(educationSchema).default([]),
  researchTraining: z.array(educationSchema).default([]),
  portrait: text.nullable(),
  email: z.email().nullable(),
  cv: z.union([resourceSchema, draftSchema]).nullable(),
});
export const publicationSchema = z.object({
  id: text,
  title: text,
  authors: z.array(text).min(1),
  year: z.number().int().min(1900).max(2100),
  venue: text,
  volume: text.nullable(),
  issue: text.nullable(),
  pages: text.nullable(),
  articleNumber: text.nullable(),
  doi: text.nullable(),
  doiUrl: https.nullable(),
  sourceUrl: https.nullable(),
  publicationType: z.enum(["Article", "Review", "Conference paper"]),
  publisher: text.nullable(),
  status,
  manuscriptUrl: https.nullable(),
  source: text,
  verificationNote: z.string(),
});
export const courseSchema = z.object({
  id: slug,
  status: z.literal("published"),
  slug,
  code: text,
  title: text,
  programme: text,
  level: z.number().int().positive().nullable(),
  summary: text.nullable(),
  learningOutcomes: z.array(text).default([]),
  teachingApproach: text.nullable().default(null),
});
export const sessionSchema = z.object({
  id: text,
  status: z.literal("published"),
  courseId: slug,
  academicSession: text.regex(/^\d{4}\/\d{4}$/),
  sessionSlug: slug,
  semester: z.enum(["First", "Second", "Third"]),
  programme: text,
  creditUnits: z.number().int().positive().nullable(),
  role: text.nullable(),
  learningOutcomes: z.array(text).default([]),
  syllabus: z.array(text).default([]),
  timetable: text.nullable().default(null),
  resources: z.array(z.union([resourceSchema, draftSchema])),
});
const dateFields = {
  datePrecision: z.enum(["day", "month", "year", "unknown"]),
  date: text.nullable(),
};
function validateDate(
  value: { datePrecision: string; date: string | null },
  context: z.RefinementCtx,
) {
  const { date, datePrecision } = value;
  const patterns: Record<string, RegExp> = {
    day: /^\d{4}-\d{2}-\d{2}$/,
    month: /^\d{4}-(0[1-9]|1[0-2])$/,
    year: /^\d{4}$/,
  };
  const valid =
    datePrecision === "unknown"
      ? date === null
      : !!date && patterns[datePrecision].test(date);
  if (!valid)
    context.addIssue({
      code: "custom",
      message: "Date must match its precision",
    });
  if (
    datePrecision === "day" &&
    date &&
    (!Number.isFinite(Date.parse(date)) ||
      new Date(date).toISOString().slice(0, 10) !== date)
  )
    context.addIssue({ code: "custom", message: "Invalid calendar date" });
}
export const imageSchema = z.object({
  file: text,
  alt: text,
  caption: text.nullable(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});
export const talkSchema = z
  .object({
    id: slug,
    status: z.literal("published"),
    slug,
    title: text,
    summary: text,
    ...dateFields,
    event: text.nullable().default(null),
    organiser: text.nullable().default(null),
    location: text.nullable().default(null),
    deliveryMode: z
      .enum(["In person", "Online", "Hybrid"])
      .nullable()
      .default(null),
    role: z
      .enum(["Speaker", "Facilitator", "Panellist"])
      .nullable()
      .default(null),
    topics: z.array(text).default([]),
    cover: imageSchema.nullable().default(null),
    recordingUrl: https.nullable().default(null),
    links: z.array(linkSchema).default([]),
    resources: z.array(z.union([resourceSchema, draftSchema])),
  })
  .superRefine(validateDate);
export const projectSchema = z.object({
  id: slug,
  status: z.literal("published"),
  slug,
  title: text,
  context: text,
  contribution: text,
  problem: text.nullable().default(null),
  approach: text.nullable().default(null),
  partners: z.array(text).default([]),
  outputs: z.array(text).default([]),
  outcomes: z.array(text).default([]),
  images: z.array(imageSchema).default([]),
  publicationIds: z.array(text).default([]),
  disclosureApproved: z.literal(true),
  start: z
    .object(dateFields)
    .superRefine(validateDate)
    .nullable()
    .default(null),
  end: z.object(dateFields).superRefine(validateDate).nullable().default(null),
});
export type Publication = z.infer<typeof publicationSchema>;
export type Course = z.infer<typeof courseSchema>;
export type Resource = z.infer<typeof resourceSchema> & {
  sizeBytes: number | null;
};
export type Session = Omit<z.infer<typeof sessionSchema>, "resources"> & {
  resources: Resource[];
};
export type Talk = Omit<z.infer<typeof talkSchema>, "resources"> & {
  resources: Resource[];
};
export type Project = z.infer<typeof projectSchema>;
