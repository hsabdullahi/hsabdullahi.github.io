import { ActionIcon } from "@/components/action-icon";
import { AcademicProfileLink } from "@/components/academic-profile-link";
import Link from "next/link";
import { profile, cv } from "@/lib/content";
import { ResourceActions } from "@/components/resources";
import type { Publication } from "@/lib/schemas";
export function SectionHeading({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="section-heading">
      <p className="eyebrow">
        {number} / {title}
      </p>
      {children}
    </div>
  );
}
export function PublicationRow({
  publication: p,
}: {
  publication: Publication;
}) {
  return (
    <article className="publication-row">
      <span className="mono">{p.year}</span>
      <div>
        <h3>{p.title}</h3>
        <p className="authors">{p.authors.join("; ")}</p>
        <p className="citation">
          {p.venue}
          {p.volume ? `, ${p.volume}` : ""}
          {p.issue ? ` (${p.issue})` : ""}
          {p.pages ? `, pp. ${p.pages}` : ""}
          {p.articleNumber ? `, ${p.articleNumber}` : ""} · {p.publicationType}
        </p>
        {p.manuscriptUrl && (
          <a href={p.manuscriptUrl}>
            Manuscript <ActionIcon kind="external" />
          </a>
        )}
      </div>
      {p.doiUrl && (
        <a className="doi" href={p.doiUrl} aria-label={`DOI for ${p.title}`}>
          DOI <ActionIcon kind="external" />
        </a>
      )}
    </article>
  );
}
export function Footer() {
  return (
    <footer className="footer shell" id="connect">
      <div>
        <p className="eyebrow">Continue the conversation</p>
        <h2>
          Good work begins
          <br />
          with an exchange.
        </h2>
        <p>
          Find my research and academic profiles, or{" "}
          <Link href="/contact/">explore collaboration</Link>.
        </p>
        <div className="profile-links">
          {profile.links.map((l) => (
            <AcademicProfileLink key={l.label} link={l} />
          ))}
        </div>
        {cv && <ResourceActions resource={cv} />}
      </div>
      <div className="footer-bottom">
        <Link href="/">Hamza Sulayman Abdullahi</Link>
        <span>Kano, Nigeria</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
export function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      {items.map((i, index) => (
        <span key={i.label}>
          {index > 0 && " / "}
          {i.href ? <Link href={i.href}>{i.label}</Link> : i.label}
        </span>
      ))}
    </nav>
  );
}
export function CourseRow({
  code,
  title,
  href,
}: {
  code: string;
  title: string;
  href?: string;
}) {
  const content = (
    <>
      <span className="mono">{code}</span>
      <h3>{title}</h3>
      {href && <ActionIcon kind="internal" />}
    </>
  );
  return href ? (
    <Link className="course-row" href={href}>
      {content}
    </Link>
  ) : (
    <article className="course-row">{content}</article>
  );
}
