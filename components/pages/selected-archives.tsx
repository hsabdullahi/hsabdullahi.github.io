import { ActionIcon } from "@/components/action-icon";
import Link from "next/link";
import Image from "next/image";
import { assetPath } from "@/lib/site";
import { type Project, type Talk } from "@/lib/schemas";
import { formatDate } from "@/lib/format";
export function SelectedArchives({
  projects,
  talks,
}: {
  projects: Project[];
  talks: Talk[];
}) {
  return (
    <>
      {!!projects.length && (
        <section className="section shell" id="work">
          <p className="eyebrow">Selected work</p>
          {projects.map((project) => (
            <article
              className={`project-feature${project.images.length ? "" : " project-feature-text"}`}
              key={project.id}
            >
              <div>
                <h2>
                  <Link href={`/work/${project.slug}/`}>{project.title}</Link>
                </h2>
                <p>{project.context}</p>
                <Link className="text-link" href={`/work/${project.slug}/`}>
                  Explore the work <ActionIcon kind="internal" />
                </Link>
              </div>
              {project.images[0] && (
                <figure>
                  <Image
                    src={assetPath(project.images[0].file)}
                    alt={project.images[0].alt}
                    width={project.images[0].width}
                    height={project.images[0].height}
                    sizes="(max-width:900px) 90vw, 45vw"
                  />
                  {project.images[0].caption && (
                    <figcaption>{project.images[0].caption}</figcaption>
                  )}
                </figure>
              )}
            </article>
          ))}
        </section>
      )}
      {!!talks.length && (
        <section className="section shell">
          <p className="eyebrow">Speaking & capacity building</p>
          {talks.map((talk) => (
            <article className="talk-feature" key={talk.id}>
              <span className="mono">
                {formatDate(talk.date, talk.datePrecision)}
              </span>
              <h2>
                <Link href={`/speaking/${talk.slug}/`}>{talk.title}</Link>
              </h2>
              <p>{talk.summary}</p>
              <Link className="text-link" href={`/speaking/${talk.slug}/`}>
                Engagement & resources <ActionIcon kind="internal" />
              </Link>
            </article>
          ))}
        </section>
      )}
    </>
  );
}
