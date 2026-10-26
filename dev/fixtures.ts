import type { Talk, Project, Resource, Session } from "@/lib/schemas";
import { demoPdf } from "./sample-pdf";
const sampleResource: Resource = {
  id: "example-notes",
  status: "published",
  ownerId: "example-session",
  title: "Illustrative lecture notes",
  category: "lecture-notes",
  format: "PDF",
  file: "/review-preview/files/sample-notes.pdf",
  externalUrl: null,
  description:
    "A development-only PDF that demonstrates the resource actions. Not actual course material.",
  accessibilityNote:
    "Contains selectable text identifying this as a development example.",
  updatedAt: null,
  publicRelease: false,
  externalCheckedAt: null,
  sizeBytes: Buffer.byteLength(demoPdf),
};
export const exampleSession: Session = {
  id: "example-session",
  status: "published",
  courseId: "example-course",
  academicSession: "2024/2025",
  sessionSlug: "2024-2025",
  semester: "First",
  programme: "Illustrative programme",
  creditUnits: null,
  role: null,
  learningOutcomes: [],
  syllabus: [],
  timetable: null,
  resources: [sampleResource],
};
export const exampleTalk: Talk = {
  id: "example-talk",
  status: "published",
  slug: "example-talk",
  title: "Engineering ideas, shared in practice.",
  summary:
    "Illustrative workshop page showing the structure for a future verified engagement.",
  datePrecision: "unknown",
  date: null,
  event: "Illustrative workshop",
  organiser: null,
  location: null,
  deliveryMode: null,
  role: null,
  topics: ["Example workshop topic", "Example practical discussion"],
  cover: null,
  recordingUrl: null,
  links: [],
  resources: [
    {
      ...sampleResource,
      id: "example-slides",
      ownerId: "example-talk",
      title: "Illustrative presentation resource",
      category: "slides",
      file: "/review-preview/files/sample-slides.pdf",
    },
  ],
};
export const exampleProject: Project = {
  id: "example-project",
  status: "published",
  slug: "example-project",
  title: "A project, from question to practice.",
  context:
    "A fictional example showing how an engineering case study will bring context, contribution and evidence together.",
  contribution:
    "Replace this example with a precise account of your own role and contribution.",
  problem:
    "Describe the practical problem, the people affected and the constraints.",
  approach:
    "Explain the methods and decisions, supported by authentic photographs, models or figures.",
  partners: [],
  outputs: ["Replace with verified outputs and supporting links."],
  outcomes: [
    "Replace with approved outcomes, separating evidence from expectations.",
  ],
  images: [],
  publicationIds: [],
  disclosureApproved: true,
  start: null,
  end: null,
};
