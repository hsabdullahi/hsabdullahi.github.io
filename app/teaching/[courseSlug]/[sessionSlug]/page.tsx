import { ActionIcon } from "@/components/action-icon";
import { notFound } from "next/navigation";
import Link from "next/link";
import { courses, sessions, courseHref, sessionHref } from "@/lib/content";
import { Breadcrumbs } from "@/components/editorial";
import { ResourceGroups, SessionSelector } from "@/components/resources";
import { pageMetadata } from "@/lib/metadata";
type Params = Promise<{ courseSlug: string; sessionSlug: string }>;
export const dynamicParams = false;
export function generateStaticParams() {
  return sessions.map((session) => ({
    courseSlug: courses.find((course) => course.id === session.courseId)!.slug,
    sessionSlug: session.sessionSlug,
  }));
}
function delivery(courseSlug: string, sessionSlug: string) {
  const course = courses.find((course) => course.slug === courseSlug);
  const session = sessions.find(
    (session) =>
      session.courseId === course?.id && session.sessionSlug === sessionSlug,
  );
  return { course, session };
}
export async function generateMetadata({ params }: { params: Params }) {
  const { courseSlug, sessionSlug } = await params;
  const { course, session } = delivery(courseSlug, sessionSlug);
  if (!course || !session) return {};
  return pageMetadata(
    `${course.code} · ${session.academicSession} · ${session.semester} semester · ${session.programme}`,
    `${course.title}, ${session.academicSession}, ${session.semester} semester. ${session.programme}: session information and approved learning resources.`,
    sessionHref(session),
  );
}
export default async function SessionPage({ params }: { params: Params }) {
  const { courseSlug, sessionSlug } = await params;
  const { course, session } = delivery(courseSlug, sessionSlug);
  if (!course || !session) notFound();
  return (
    <main id="main" className="shell detail">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Teaching", href: "/teaching/" },
          { label: course.code, href: courseHref(course) },
          { label: session.academicSession },
        ]}
      />
      <p className="eyebrow">
        {course.code} / {session.academicSession}
      </p>
      <h1>
        {course.id === "mec3203" ? (
          <>
            Engineering
            <br />
            <em>Drawing II.</em>
          </>
        ) : (
          course.title
        )}
      </h1>
      <p className="lead">
        {session.programme} · {session.semester} semester
      </p>
      <div className="detail-grid">
        <aside>
          <h2 className="aside-heading">Session information</h2>
          <dl className="metadata-list">
            <dt>Academic session</dt>
            <dd>{session.academicSession}</dd>
            <dt>Semester</dt>
            <dd>{session.semester}</dd>
            {session.creditUnits && (
              <>
                <dt>Credit units</dt>
                <dd>{session.creditUnits}</dd>
              </>
            )}
            {session.role && (
              <>
                <dt>Lecturer role</dt>
                <dd>{session.role}</dd>
              </>
            )}
          </dl>
          <SessionSelector
            sessions={sessions
              .filter((s) => s.courseId === course.id)
              .sort((a, b) =>
                b.academicSession.localeCompare(a.academicSession),
              )}
            currentId={session.id}
            hrefFor={sessionHref}
          />
        </aside>
        <section>
          {!!session.learningOutcomes.length && (
            <>
              <h2>Learning outcomes</h2>
              <ul>
                {session.learningOutcomes.map((outcome) => (
                  <li key={outcome}>{outcome}</li>
                ))}
              </ul>
            </>
          )}
          {!!session.syllabus.length && (
            <>
              <h2>Syllabus</h2>
              <ul>
                {session.syllabus.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          )}
          {session.timetable && <p>{session.timetable}</p>}
          <p className="eyebrow">Learning resources</p>
          <h2>
            A place for the work
            <br />
            of learning.
          </h2>
          <p>
            This archive keeps materials connected to the academic session and
            semester in which they were used.
          </p>
          <ResourceGroups session={session} />
          <Link className="text-link" href="/teaching/materials/">
            Search the materials library <ActionIcon kind="internal" />
          </Link>
        </section>
      </div>
    </main>
  );
}
