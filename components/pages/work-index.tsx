import { ActionIcon } from "@/components/action-icon";
import Link from "next/link";
import { projects } from "@/lib/content";
import { Breadcrumbs } from "@/components/editorial";
import { SelectedArchives } from "./selected-archives";
import type { Project } from "@/lib/schemas";
export function WorkIndex({
  entries = projects,
  preview = false,
}: {
  entries?: Project[];
  preview?: boolean;
}) {
  return (
    <main id="main">
      <div className="shell detail work-intro">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Work" }]}
        />
        <p className="eyebrow">
          {preview
            ? "Development fixture / fictional projects"
            : "Selected work"}
        </p>
        <h1>
          Engineering in context.
          <br />
          <em>Ideas put to work.</em>
        </h1>
        <p className="lead reading-width">
          Engineering, education and institutional systems, explored through the
          work itself.
        </p>
        {preview && (
          <>
            <p className="preview-notice">
              Placeholder project summaries below are fictional and ready to
              replace with approved evidence.
            </p>
            {entries.map((project) => (
              <article className="project-feature" key={project.id}>
                <div>
                  <h2>
                    <Link href="/review-preview/work/example/">
                      {project.title}
                    </Link>
                  </h2>
                  <p>{project.context}</p>
                  <Link
                    className="text-link"
                    href="/review-preview/work/example/"
                  >
                    View example structure <ActionIcon kind="internal" />
                  </Link>
                </div>
              </article>
            ))}
          </>
        )}
      </div>
      {!preview && <SelectedArchives projects={entries} talks={[]} />}
    </main>
  );
}
