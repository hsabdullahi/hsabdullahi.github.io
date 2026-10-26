import { ActionIcon } from "@/components/action-icon";
import { StructuredData } from "@/components/structured-data";
import Image from "next/image";
import { Breadcrumbs } from "@/components/editorial";
import { ResourceRow } from "@/components/resources";
import { formatDate } from "@/lib/format";
import { assetPath } from "@/lib/site";
import type { Talk } from "@/lib/schemas";
export function TalkDetail({
  talk,
  preview = false,
}: {
  talk: Talk;
  preview?: boolean;
}) {
  const slides = talk.resources.filter(
    (resource) => resource.category === "slides",
  );
  const other = talk.resources.filter(
    (resource) => resource.category !== "slides",
  );
  return (
    <main id="main" className="shell detail">
      {!preview &&
        talk.datePrecision === "day" &&
        talk.date &&
        talk.event &&
        talk.location && (
          <StructuredData
            data={{
              "@context": "https://schema.org",
              "@type": "Event",
              name: talk.title,
              description: talk.summary,
              startDate: talk.date,
              location: { "@type": "Place", name: talk.location },
              ...(talk.organiser
                ? {
                    organizer: {
                      "@type": "Organization",
                      name: talk.organiser,
                    },
                  }
                : {}),
            }}
          />
        )}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          ...(preview
            ? [{ label: "Development preview" }]
            : [{ label: "Speaking", href: "/speaking/" }]),
          { label: talk.title },
        ]}
      />
      <p className="eyebrow">
        {preview
          ? "Development fixture / fictional engagement"
          : "Speaking & capacity building"}
      </p>
      <h1>{talk.title}</h1>
      <p className="lead reading-width">{talk.summary}</p>
      {preview && (
        <p className="preview-notice">
          Development example: names, context and resources here are
          illustrative. This is not a record of an actual engagement.
        </p>
      )}
      {talk.cover && (
        <figure className="talk-cover">
          <Image
            src={assetPath(talk.cover.file)}
            alt={talk.cover.alt}
            width={talk.cover.width}
            height={talk.cover.height}
            sizes="(max-width:900px) 90vw, 80vw"
          />
          {talk.cover.caption && <figcaption>{talk.cover.caption}</figcaption>}
        </figure>
      )}
      <div className="detail-grid">
        <aside>
          <h2 className="aside-heading">Engagement information</h2>
          <dl className="metadata-list">
            <dt>Date</dt>
            <dd>
              {talk.date ? (
                <time dateTime={talk.date}>
                  {formatDate(talk.date, talk.datePrecision)}
                </time>
              ) : (
                "Undated"
              )}
            </dd>
            {talk.event && (
              <>
                <dt>Event</dt>
                <dd>{talk.event}</dd>
              </>
            )}
            {talk.organiser && (
              <>
                <dt>Organiser</dt>
                <dd>{talk.organiser}</dd>
              </>
            )}
            {talk.location && (
              <>
                <dt>Location</dt>
                <dd>{talk.location}</dd>
              </>
            )}
            {talk.deliveryMode && (
              <>
                <dt>Delivery</dt>
                <dd>{talk.deliveryMode}</dd>
              </>
            )}
            {talk.role && (
              <>
                <dt>Role</dt>
                <dd>{talk.role}</dd>
              </>
            )}
          </dl>
        </aside>
        <section>
          {!!talk.topics.length && (
            <>
              <h2>Topics</h2>
              <ul className="topic-list">
                {talk.topics.map((topic) => (
                  <li key={topic}>{topic}</li>
                ))}
              </ul>
            </>
          )}
          <h2>Slides & resources</h2>
          {slides.length ? (
            slides.map((resource) => (
              <ResourceRow
                key={resource.id}
                resource={resource}
                context={formatDate(talk.date, talk.datePrecision)}
              />
            ))
          ) : (
            <div className="empty-state">
              <h3>No public slides for this engagement</h3>
              <p>Approved slides will appear here when available.</p>
            </div>
          )}
          {other.map((resource) => (
            <ResourceRow key={resource.id} resource={resource} />
          ))}
          {talk.recordingUrl && (
            <p>
              <a className="text-link" href={talk.recordingUrl}>
                Open recording on external site <ActionIcon kind="external" />
              </a>
            </p>
          )}
          {!!talk.links.length && (
            <>
              <h3>Related links</h3>
              <ul>
                {talk.links.map((link) => (
                  <li key={link.url}>
                    <a href={link.url}>
                      {link.label} <ActionIcon kind="external" />
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
