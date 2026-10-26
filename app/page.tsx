import { ActionIcon } from "@/components/action-icon";
import { AcademicProfileLink } from "@/components/academic-profile-link";
import { pageMetadata } from "@/lib/metadata";
import Image from "next/image";
import Link from "next/link";
import { profile, publications, courses, projects, talks } from "@/lib/content";
import { assetPath } from "@/lib/site";
import { SelectedArchives } from "@/components/pages/selected-archives";
import { StructuredData } from "@/components/structured-data";
import {
  SectionHeading,
  PublicationRow,
  CourseRow,
} from "@/components/editorial";
const homeMetadata = pageMetadata(
  "Hamza Sulayman Abdullahi | Engineering, education & systems",
  "Applied engineering, digital manufacturing and engineering education. Dr. Hamza Sulayman Abdullahi, Lecturer I at Bayero University, Kano.",
  "/",
);
export const metadata = {
  ...homeMetadata,
  title: {
    absolute: "Hamza Sulayman Abdullahi | Engineering, education & systems",
  },
};
export default function Home() {
  const featuredCourses = ["mec3203", "get102", "ate5204"].flatMap((id) => {
    const course = courses.find((course) => course.id === id);
    return course ? [course] : [];
  });
  const academicProfile =
    profile.links.find((link) => link.label === "Google Scholar") ??
    profile.links[0];
  return (
    <main id="main">
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: profile.name,
          jobTitle: profile.rank,
          affiliation: {
            "@type": "Organization",
            name: profile.affiliations[0],
          },
          sameAs: profile.links.map((l) => l.url),
        }}
      />
      <section
        className={`hero shell${profile.portrait ? "" : " hero-without-portrait"}`}
      >
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="tiny-square" /> Engineer. Educator. Systems
            thinker.
          </p>
          <h1>
            Engineering ideas.
            <br />
            <em>Building capacity.</em>
          </h1>
          <p className="hero-summary">{profile.summary}</p>
          <div className="hero-actions">
            {projects.length > 0 && (
              <Link className="button" href="/work/">
                View selected work <ActionIcon kind="internal" />
              </Link>
            )}
            <Link
              className={projects.length ? "text-link" : "button"}
              href="/research/"
            >
              Explore research <ActionIcon kind="internal" />
            </Link>
            <Link className="text-link" href="/teaching/">
              Explore teaching <ActionIcon />
            </Link>
          </div>
          <div className="appointment">
            <span className="mono">Current appointment</span>
            <p>
              {profile.rank}
              <br />
              {profile.affiliations[0]}
            </p>
          </div>
        </div>
        {profile.portrait && (
          <figure className="portrait">
            <Image
              src={assetPath(profile.portrait)}
              alt={`Portrait of ${profile.name}`}
              width={960}
              height={1200}
              sizes="(max-width: 640px) 90vw, 38vw"
              loading="eager"
              fetchPriority="high"
              decoding="sync"
            />
            <figcaption>
              <span>01 / {profile.name}</span>
              <span>Kano, Nigeria</span>
            </figcaption>
          </figure>
        )}
        <div className="hero-bottom">
          <span>Applied engineering, with people in view.</span>
          <span className="mono">
            Scroll to explore <ActionIcon kind="scroll" />
          </span>
        </div>
      </section>
      <SelectedArchives
        projects={projects.slice(0, 3)}
        talks={talks.slice(0, 1)}
      />
      <section className="section shell" id="research">
        <SectionHeading number="01" title="Research">
          <h2>
            From material structures
            <br />
            to practical possibilities.
          </h2>
        </SectionHeading>
        <div className="research-intro">
          <p>
            My research sits within applied engineering and digital
            manufacturing. Selected publications explore lattice structures,
            computational design and mechanical behaviour.
          </p>
          {academicProfile && (
            <AcademicProfileLink className="text-link" link={academicProfile} />
          )}
        </div>
        <div className="publications">
          {publications.slice(0, 3).map((p) => (
            <PublicationRow key={p.id} publication={p} />
          ))}
        </div>
        <Link
          className="text-link section-action"
          href="/research/publications/"
        >
          View all publications <ActionIcon kind="internal" />
        </Link>
      </section>
      <section className="teaching-band" id="teaching">
        <div className="shell teaching-grid">
          <div>
            <p className="eyebrow">02 / Teaching & capacity building</p>
            <h2>
              Engineering knowledge.
              <br />
              <em>Shared and applied.</em>
            </h2>
            <p>
              Engineering drawing, computational tools and the mechanics of
              machines: teaching that connects technical ideas with engineering
              practice.
            </p>
            <span className="mono">Bayero University, Kano</span>
          </div>
          <div className="course-list">
            {featuredCourses.map((c) => {
              return (
                <CourseRow
                  key={c.id}
                  code={c.code}
                  title={c.title}
                  href={`/teaching/${c.slug}/`}
                />
              );
            })}
            <Link
              className="text-link teaching-action"
              href="/teaching/materials/"
            >
              Search course materials <ActionIcon kind="internal" />
            </Link>
            <p className="small">
              Explore course sessions and find approved learning materials in
              the teaching archive.
            </p>
          </div>
        </div>
      </section>
      <section className="section shell about-grid" id="about">
        <div>
          <p className="eyebrow">03 / About</p>
          <h2>
            Across the workshop,
            <br />
            classroom and institution.
          </h2>
        </div>
        <div>
          <p className="lead">
            I’m Hamza Sulayman Abdullahi, a mechanical engineer and{" "}
            {profile.rank} at Bayero University, Kano.
          </p>
          <p>{profile.biography}</p>
          <dl className="roles">
            {profile.appointments.map((a) => (
              <div key={a.label}>
                <dt>{a.label}</dt>
                <dd>{a.description}</dd>
              </div>
            ))}
          </dl>
          <Link className="text-link section-action-inline" href="/about/">
            More about my work <ActionIcon kind="internal" />
          </Link>
        </div>
      </section>
    </main>
  );
}
