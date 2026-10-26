import { ActionIcon } from "@/components/action-icon";
import { AcademicProfileLink } from "@/components/academic-profile-link";
import Link from "next/link";
import { publications, profile } from "@/lib/content";
import { Breadcrumbs, PublicationRow } from "@/components/editorial";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Research",
  "Research in lattice structures, computational design, structural mechanics and digital manufacturing, with selected publications.",
  "/research/",
);
const themes = [
  {
    number: "01",
    title: "Lattice structures & computational design",
    text: "My published work examines lattice structures, plate microstructures and computational methods for engineering design.",
    ids: ["Liao2026", "Zhuo2025", "Abdullahi202410046"],
  },
  {
    number: "02",
    title: "Structural mechanics & numerical methods",
    text: "Other publications investigate the mechanical behaviour of cellular and thin-walled structures, alongside numerical methods for structural analysis.",
    ids: [],
  },
];
export default function Research() {
  return (
    <main id="main" className="shell detail">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Research" }]}
      />
      <p className="eyebrow">Research / Applied engineering</p>
      <h1>
        Structures, methods
        <br />
        <em>and possibilities.</em>
      </h1>
      <p className="lead reading-width">
        My research connects computational design with questions about how
        engineering structures behave.
      </p>
      <div className="theme-list">
        {themes.map((theme) => (
          <section className="theme-row" key={theme.number}>
            <span className="mono">{theme.number}</span>
            <div>
              <h2>{theme.title}</h2>
              <p>{theme.text}</p>
            </div>
          </section>
        ))}
      </div>
      {profile.researchThemes.length > 0 && (
        <section className="research-interests">
          <h2>Research interests</h2>
          <ul>
            {profile.researchThemes.map((theme) => (
              <li key={theme}>{theme}</li>
            ))}
          </ul>
        </section>
      )}
      <section className="research-selected">
        <div className="index-heading">
          <h2>Selected publications</h2>
          <Link className="text-link" href="/research/publications/">
            Complete supplied record <ActionIcon kind="internal" />
          </Link>
        </div>
        {publications.slice(0, 4).map((publication) => (
          <PublicationRow key={publication.id} publication={publication} />
        ))}
      </section>
      <section className="research-profiles">
        <h2>Academic & professional profiles</h2>
        <p>Explore my academic record through these profiles.</p>
        <div className="profile-links">
          {profile.links.map((link) => (
            <AcademicProfileLink key={link.label} link={link} />
          ))}
        </div>
      </section>
    </main>
  );
}
