import {
  courses,
  sessions,
  libraryResources,
  sessionHref,
} from "@/lib/content";
import { Breadcrumbs } from "@/components/editorial";
import { FilterBar, FilterEmptyState } from "@/components/filter-bar";
import { ResourceRow } from "@/components/resources";
import { categoryLabels } from "@/lib/schemas";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Course materials library",
  "Search approved engineering lecture notes, slides, practicals and reading resources by course, academic session and resource type.",
  "/teaching/materials/",
);
export default function Materials() {
  const years = [...new Set(sessions.map((session) => session.academicSession))]
    .sort()
    .reverse();
  return (
    <main id="main" className="shell detail">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Teaching", href: "/teaching/" },
          { label: "Course materials" },
        ]}
      />
      <p className="eyebrow">Teaching / Materials library</p>
      <h1>
        Resources for
        <br />
        <em>engineering practice.</em>
      </h1>
      <p className="lead reading-width">
        Find the approved materials for your course and academic session. Each
        resource belongs to a specific delivery.
      </p>
      <FilterBar
        targetId="resource-library"
        noun="resource"
        fields={[
          {
            name: "course",
            label: "Course",
            options: courses.map((course) => ({
              value: course.id,
              label: `${course.code} · ${course.title}`,
            })),
          },
          {
            name: "session",
            label: "Academic session",
            options: years.map((year) => ({ value: year, label: year })),
          },
          {
            name: "type",
            label: "Resource type",
            options: Object.entries(categoryLabels)
              .filter(([key]) => key !== "slides" && key !== "cv")
              .map(([value, label]) => ({ value, label })),
          },
        ]}
      />
      {libraryResources.length === 0 && (
        <div className="empty-state">
          <p className="eyebrow">Materials archive</p>
          <h2>No public materials yet</h2>
          <p>
            The course catalogue and delivery records are available. Approved
            files and external resources will appear here as they are added.
          </p>
        </div>
      )}
      <h2 className="sr-only">Resource list</h2>
      <div id="resource-library">
        {libraryResources.map(({ resource, course, session }) => (
          <div
            key={resource.id}
            data-filter-item
            data-course={course.id}
            data-session={session.academicSession}
            data-type={resource.category}
            data-search={`${resource.title} ${resource.description || ""} ${course.code} ${course.title} ${session.academicSession} ${session.semester}`}
          >
            <ResourceRow
              resource={resource}
              context={`${course.code} · ${session.academicSession} · ${session.semester} semester`}
              href={sessionHref(session)}
            />
          </div>
        ))}
      </div>
      {libraryResources.length > 0 && (
        <FilterEmptyState targetId="resource-library" />
      )}
    </main>
  );
}
