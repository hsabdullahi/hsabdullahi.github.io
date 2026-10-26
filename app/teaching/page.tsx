import { ActionIcon } from "@/components/action-icon";
import Link from "next/link";
import { courses, sessions, courseHref, profile } from "@/lib/content";
import { Breadcrumbs } from "@/components/editorial";
import { FilterBar, FilterEmptyState } from "@/components/filter-bar";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Teaching & course materials",
  "Engineering course catalogue, teaching sessions and approved learning materials from Dr. Hamza Sulayman Abdullahi.",
  "/teaching/",
);
export default function Teaching() {
  const years = [...new Set(sessions.map((session) => session.academicSession))]
    .sort()
    .reverse();
  return (
    <main id="main" className="shell detail">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Teaching" }]}
      />
      <p className="eyebrow">Teaching & capacity building</p>
      <h1>
        Engineering knowledge.
        <br />
        <em>Shared and applied.</em>
      </h1>
      <div className="intro-split">
        <p className="lead">
          Course information and session archives across engineering drawing,
          computational tools and the mechanics of machines.
        </p>
        <Link className="button" href="/teaching/materials/">
          Find course materials <ActionIcon kind="internal" />
        </Link>
      </div>
      {profile.teachingStatement && (
        <p className="teaching-statement reading-width">
          {profile.teachingStatement}
        </p>
      )}
      <FilterBar
        targetId="course-catalogue"
        noun="course"
        searchLabel="Search courses"
        fields={[
          {
            name: "session",
            label: "Academic session",
            options: years.map((year) => ({ value: year, label: year })),
          },
        ]}
      />
      <div id="course-catalogue" className="catalogue">
        {courses.map((course) => {
          const deliveries = sessions.filter(
            (session) => session.courseId === course.id,
          );
          return (
            <article
              key={course.id}
              className="catalogue-row"
              data-filter-item
              data-search={`${course.code} ${course.title} ${deliveries.map((s) => s.programme).join(" ")}`}
              data-session={deliveries.map((s) => s.academicSession).join("|")}
            >
              <span className="mono">{course.code}</span>
              <div>
                <h2>
                  <Link href={courseHref(course)}>{course.title}</Link>
                </h2>
                <p className="small">
                  {[...new Set(deliveries.map((s) => s.programme))].join(" · ")}
                  {course.level ? ` · ${course.level} level` : ""}
                </p>
                <p className="small">
                  {deliveries.length}{" "}
                  {deliveries.length === 1 ? "session" : "sessions"} ·{" "}
                  {deliveries.map((s) => s.academicSession).join(", ")}
                </p>
              </div>
              <Link
                className="text-link"
                href={courseHref(course)}
                aria-label={`Explore ${course.code}`}
              >
                Explore <ActionIcon kind="internal" />
              </Link>
            </article>
          );
        })}
      </div>
      <FilterEmptyState targetId="course-catalogue" />
    </main>
  );
}
