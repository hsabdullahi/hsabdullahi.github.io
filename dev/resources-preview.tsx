import { ResourceGroups } from "@/components/resources";
import { FilterBar, FilterEmptyState } from "@/components/filter-bar";
import { exampleSession } from "./fixtures";
export default function ResourcesPreview() {
  return (
    <main id="main" className="shell detail">
      <p className="eyebrow">
        Development fixture / fictional learning resource
      </p>
      <h1>
        Course materials
        <br />
        <em>in context.</em>
      </h1>
      <p className="preview-notice">
        Example delivery and PDF only. No actual course materials are
        represented.
      </p>
      <FilterBar
        targetId="example-resources"
        noun="resource"
        fields={[
          {
            name: "course",
            label: "Course",
            options: [
              { value: "example-course", label: "Illustrative course" },
            ],
          },
          {
            name: "session",
            label: "Academic session",
            options: [{ value: "2024/2025", label: "2024/2025" }],
          },
          {
            name: "type",
            label: "Resource type",
            options: [{ value: "lecture-notes", label: "Lecture notes" }],
          },
        ]}
      />
      <h2 className="sr-only">Example resources</h2>
      <div id="example-resources">
        <div
          data-filter-item
          data-course="example-course"
          data-session="2024/2025"
          data-type="lecture-notes"
        >
          <ResourceGroups session={exampleSession} />
        </div>
      </div>
      <FilterEmptyState targetId="example-resources" />
    </main>
  );
}
