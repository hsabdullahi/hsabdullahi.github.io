import Image from "next/image";
import { Breadcrumbs, PublicationRow } from "@/components/editorial";
import { publications } from "@/lib/content";
import { assetPath } from "@/lib/site";
import { formatDate } from "@/lib/format";
import type { Project } from "@/lib/schemas";
export function ProjectDetail({
  project,
  preview = false,
}: {
  project: Project;
  preview?: boolean;
}) {
  const related = publications.filter((publication) =>
    project.publicationIds.includes(publication.id),
  );
  const hasContext = !!(
    project.start ||
    project.end ||
    project.partners.length
  );
  return (
    <main id="main" className="shell detail">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          ...(preview
            ? [{ label: "Development preview" }]
            : [{ label: "Work", href: "/work/" }]),
          { label: project.title },
        ]}
      />
      <p className="eyebrow">
        {preview ? "Development fixture / fictional project" : "Selected work"}
      </p>
      <h1>{project.title}</h1>
      <p className="lead reading-width">{project.context}</p>
      {preview && (
        <p className="preview-notice">
          Illustrative project structure only. This is not a claim about Hamza’s
          work or achievements.
        </p>
      )}
      <div className={`detail-grid${hasContext ? "" : " case-study-text"}`}>
        {hasContext && (
          <aside>
            <h2 className="aside-heading">Project context</h2>
            <dl className="metadata-list">
              {project.start && (
                <>
                  <dt>From</dt>
                  <dd>
                    {formatDate(
                      project.start.date,
                      project.start.datePrecision,
                    )}
                  </dd>
                </>
              )}
              {project.end && (
                <>
                  <dt>To</dt>
                  <dd>
                    {formatDate(project.end.date, project.end.datePrecision)}
                  </dd>
                </>
              )}
              {!!project.partners.length && (
                <>
                  <dt>Partners</dt>
                  <dd>{project.partners.join(", ")}</dd>
                </>
              )}
            </dl>
          </aside>
        )}
        <div className="case-study">
          <section>
            <h2>My contribution</h2>
            <p>{project.contribution}</p>
          </section>
          {project.problem && (
            <section>
              <h2>The problem</h2>
              <p>{project.problem}</p>
            </section>
          )}
          {project.approach && (
            <section>
              <h2>The approach</h2>
              <p>{project.approach}</p>
            </section>
          )}
          {project.outputs.length > 0 && (
            <section>
              <h2>Outputs</h2>
              <ul>
                {project.outputs.map((output) => (
                  <li key={output}>{output}</li>
                ))}
              </ul>
            </section>
          )}
          {project.outcomes.length > 0 && (
            <section>
              <h2>Outcomes</h2>
              <ul>
                {project.outcomes.map((outcome) => (
                  <li key={outcome}>{outcome}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
      {project.images.map((image) => (
        <figure className="project-figure" key={image.file}>
          <Image
            src={assetPath(image.file)}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="(max-width:900px) 90vw, 80vw"
          />
          {image.caption && <figcaption>{image.caption}</figcaption>}
        </figure>
      ))}
      {!!related.length && (
        <section className="archive-section">
          <h2>Related publications</h2>
          {related.map((publication) => (
            <PublicationRow key={publication.id} publication={publication} />
          ))}
        </section>
      )}
    </main>
  );
}
