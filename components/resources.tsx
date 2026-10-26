import { ActionIcon } from "@/components/action-icon";
import Link from "next/link";
import { assetPath } from "@/lib/site";
import { categoryLabels, type Resource, type Session } from "@/lib/schemas";
import { formatSize } from "@/lib/format";

export function ResourceActions({ resource }: { resource: Resource }) {
  if (resource.status !== "published") return null;
  if (resource.file)
    return (
      <div className="resource-actions">
        {resource.format === "PDF" && (
          <a
            href={assetPath(resource.file)}
            aria-label={`View ${resource.title}`}
          >
            View <ActionIcon kind="internal" />
          </a>
        )}
        <a
          href={assetPath(resource.file)}
          download
          aria-label={`Download ${resource.title}`}
        >
          Download <ActionIcon kind="download" />
        </a>
      </div>
    );
  return resource.externalUrl ? (
    <a
      className="text-link"
      href={resource.externalUrl}
      aria-label={`${resource.category === "slides" ? `View slides (${resource.format})` : "Open resource"}: ${resource.title} (external site)`}
    >
      {resource.category === "slides"
        ? `View slides (${resource.format})`
        : "Open resource"}{" "}
      <ActionIcon kind="external" />
    </a>
  ) : null;
}
export function ResourceRow({
  resource,
  context,
  href,
  headingLevel = 3,
}: {
  resource: Resource;
  context?: string;
  href?: string;
  headingLevel?: 3 | 4;
}) {
  const size = formatSize(resource.sizeBytes);
  const Heading = headingLevel === 4 ? "h4" : "h3";
  return (
    <article className="resource-row">
      <div>
        <p className="resource-meta mono">
          {categoryLabels[resource.category]} · {resource.format}
          {size ? ` · ${size}` : ""}
          {resource.externalUrl ? " · External" : ""}
        </p>
        <Heading>{resource.title}</Heading>
        {context && (
          <p className="small">
            {href ? <Link href={href}>{context}</Link> : context}
          </p>
        )}
        {resource.description && <p>{resource.description}</p>}
        {resource.accessibilityNote && (
          <p className="small">Accessibility: {resource.accessibilityNote}</p>
        )}
        {resource.updatedAt && (
          <p className="small">
            Updated{" "}
            <time dateTime={resource.updatedAt}>{resource.updatedAt}</time>
          </p>
        )}
      </div>
      <ResourceActions resource={resource} />
    </article>
  );
}
export function ResourceGroups({ session }: { session: Session }) {
  if (!session.resources.length)
    return (
      <div className="empty-state">
        <span className="mono">Materials archive</span>
        <h3>No public materials yet</h3>
        <p>
          Approved lecture notes, slides and practical resources will be listed
          here when they are available.
        </p>
      </div>
    );
  const categories = Object.keys(
    categoryLabels,
  ) as (keyof typeof categoryLabels)[];
  return (
    <div>
      {categories.map((category) => {
        const resources = session.resources.filter(
          (resource) => resource.category === category,
        );
        return resources.length ? (
          <section key={category} className="resource-group">
            <h3 className="eyebrow">{categoryLabels[category]}</h3>
            {resources.map((resource) => (
              <ResourceRow
                key={resource.id}
                headingLevel={4}
                resource={resource}
                context={`${session.academicSession} · ${session.semester} semester`}
              />
            ))}
          </section>
        ) : null;
      })}
    </div>
  );
}
export function SessionSelector({
  sessions,
  currentId,
  hrefFor,
}: {
  sessions: Session[];
  currentId?: string;
  hrefFor: (session: Session) => string;
}) {
  return (
    <nav aria-label="Teaching sessions" className="session-selector">
      {sessions.map((session) => (
        <Link
          key={session.id}
          href={hrefFor(session)}
          aria-current={session.id === currentId ? "page" : undefined}
        >
          {session.academicSession} · {session.semester} semester
          <span className="sr-only"> · {session.programme}</span>
        </Link>
      ))}
    </nav>
  );
}
