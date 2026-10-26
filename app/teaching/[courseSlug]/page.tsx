import { ActionIcon } from "@/components/action-icon";
import Link from "next/link";
import { notFound } from "next/navigation";
import { courses, sessions, courseHref, sessionHref } from "@/lib/content";
import { Breadcrumbs } from "@/components/editorial";
import { pageMetadata } from "@/lib/metadata";
export const dynamicParams = false;
export function generateStaticParams() {
  return courses.map((course) => ({ courseSlug: course.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  const course = courses.find((course) => course.slug === courseSlug);
  if (!course) return {};
  return pageMetadata(
    `${course.code} · ${course.title}`,
    `${course.title}: teaching sessions and approved materials for ${course.programme} at Bayero University, Kano.`,
    courseHref(course),
  );
}
export default async function CoursePage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  const course = courses.find((course) => course.slug === courseSlug);
  if (!course) notFound();
  const deliveries = sessions
    .filter((session) => session.courseId === course.id)
    .sort((a, b) => b.academicSession.localeCompare(a.academicSession));
  const programmes = [
    ...new Set(deliveries.map((session) => session.programme)),
  ];
  return (
    <main id="main" className="shell detail">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Teaching", href: "/teaching/" },
          { label: course.code },
        ]}
      />
      <p className="eyebrow">Course overview / {course.code}</p>
      <h1>{course.title}</h1>
      <p className="lead">
        {programmes.length > 1
          ? "Multiple programme deliveries"
          : course.programme}
        {course.level ? ` · ${course.level} level` : ""}
      </p>
      {course.summary && <p className="reading-width">{course.summary}</p>}
      <div className="detail-grid">
        <aside>
          <p className="mono">Course catalogue</p>
          <p>Bayero University, Kano</p>
          <p>Dr. Hamza Sulayman Abdullahi</p>
          <Link className="text-link" href="/teaching/materials/">
            Find course materials <ActionIcon kind="internal" />
          </Link>
        </aside>
        <section>
          {course.teachingApproach && (
            <>
              <h2>Teaching approach</h2>
              <p>{course.teachingApproach}</p>
            </>
          )}
          {!!course.learningOutcomes.length && (
            <>
              <h2>Learning outcomes</h2>
              <ul>
                {course.learningOutcomes.map((outcome) => (
                  <li key={outcome}>{outcome}</li>
                ))}
              </ul>
            </>
          )}
          <h2>Teaching sessions</h2>
          <p>
            Each delivery has its own record. Select an academic session to view
            its information and approved materials.
          </p>
          {deliveries.map((session) => (
            <Link
              className="session-row"
              key={session.id}
              href={sessionHref(session)}
            >
              <span>
                <strong>{session.academicSession}</strong>
                <br />
                <span className="small">
                  {session.semester} semester
                  {session.creditUnits
                    ? ` · ${session.creditUnits} credit units`
                    : ""}
                  <br />
                  {session.programme}
                </span>
              </span>
              <span>
                View session <ActionIcon kind="internal" />
              </span>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
