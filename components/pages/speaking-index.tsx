import { ActionIcon } from "@/components/action-icon";
import Link from "next/link";
import { talks } from "@/lib/content";
import { Breadcrumbs } from "@/components/editorial";
import { ResourceActions } from "@/components/resources";
import { formatDate } from "@/lib/format";
import type { Talk } from "@/lib/schemas";
export function SpeakingIndex({
  entries = talks,
  preview = false,
}: {
  entries?: Talk[];
  preview?: boolean;
}) {
  const dated = entries.filter((talk) => talk.datePrecision !== "unknown");
  const undated = entries.filter((talk) => talk.datePrecision === "unknown");
  return (
    <main id="main" className="shell detail">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Speaking" }]}
      />
      <p className="eyebrow">
        {preview
          ? "Development fixture / fictional engagements"
          : "Speaking & capacity building"}
      </p>
      <h1>
        Ideas in conversation.
        <br />
        <em>Knowledge in practice.</em>
      </h1>
      <p className="lead reading-width">
        Talks, workshops and seminars, with presentation resources where
        available.
      </p>
      {preview && (
        <p className="preview-notice">
          These are labelled examples for future content, excluded from
          production.
        </p>
      )}
      {[
        { title: "Engagements", items: dated },
        { title: "Undated engagements", items: undated },
      ].map((group) =>
        group.items.length ? (
          <section key={group.title} className="archive-section">
            <h2>{group.title}</h2>
            {group.items.map((talk) => (
              <article className="talk-row" key={talk.id}>
                <span className="mono">
                  {formatDate(talk.date, talk.datePrecision)}
                </span>
                <div>
                  <h3>
                    <Link
                      href={
                        preview
                          ? "/review-preview/speaking/"
                          : `/speaking/${talk.slug}/`
                      }
                    >
                      {talk.title}
                    </Link>
                  </h3>
                  {talk.event && <p className="small">{talk.event}</p>}
                  <p>{talk.summary}</p>
                  {talk.resources
                    .filter((resource) => resource.category === "slides")
                    .map((resource) => (
                      <div key={resource.id}>
                        <ResourceActions resource={resource} />
                      </div>
                    ))}
                </div>
                <Link
                  className="text-link"
                  href={
                    preview
                      ? "/review-preview/speaking/"
                      : `/speaking/${talk.slug}/`
                  }
                >
                  Details <ActionIcon kind="internal" />
                </Link>
              </article>
            ))}
          </section>
        ) : null,
      )}
    </main>
  );
}
