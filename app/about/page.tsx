import { AcademicProfileLink } from "@/components/academic-profile-link";
import Image from "next/image";
import { profile, cv } from "@/lib/content";
import { Breadcrumbs } from "@/components/editorial";
import { ResourceActions } from "@/components/resources";
import { assetPath } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";
import { formatDate } from "@/lib/format";
export const metadata = pageMetadata(
  "About",
  "Biography and confirmed appointments of Dr. Hamza Sulayman Abdullahi, Lecturer I in Mechanical Engineering at Bayero University, Kano.",
  "/about/",
);
export default function About() {
  return (
    <main id="main" className="shell detail">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
      <p className="eyebrow">About / Hamza Sulayman Abdullahi</p>
      <h1>
        Across engineering,
        <br />
        <em>education and systems.</em>
      </h1>
      <div className="about-detail-grid">
        <div className="reading-width">
          <p className="lead">
            I’m Hamza Sulayman Abdullahi, a mechanical engineer and{" "}
            {profile.rank} at Bayero University, Kano.
          </p>
          <p>{profile.summary}</p>
          <p>{profile.biography}</p>
          {profile.postnominalName && (
            <p className="mono">{profile.postnominalName}</p>
          )}
          {[
            { title: "Education", entries: profile.education },
            { title: "Research training", entries: profile.researchTraining },
          ].map(
            ({ title, entries }) =>
              entries.length > 0 && (
                <section className="bio-section" key={title}>
                  <h2>{title}</h2>
                  {entries.map((entry) => (
                    <article
                      className="education-entry"
                      key={`${entry.qualification}-${entry.start}`}
                    >
                      <h3>{entry.qualification}</h3>
                      <p>{entry.institution}</p>
                      <p className="small">
                        {formatDate(entry.start, "month")} to{" "}
                        {formatDate(entry.end, "month")}
                      </p>
                      <p>{entry.field}</p>
                      {entry.dissertation && (
                        <p className="small">
                          Dissertation: {entry.dissertation}
                        </p>
                      )}
                    </article>
                  ))}
                </section>
              ),
          )}
          <section className="bio-section">
            <h2>Appointments & recognition</h2>
            <dl className="roles">
              {profile.appointments.map((appointment) => (
                <div key={appointment.label}>
                  <dt>{appointment.label}</dt>
                  <dd>{appointment.description}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section className="bio-section">
            <h2>Academic & professional profiles</h2>
            <div className="profile-links">
              {profile.links.map((link) => (
                <AcademicProfileLink key={link.label} link={link} />
              ))}
            </div>
            {cv && (
              <div className="cv-actions">
                <h3>Curriculum vitae</h3>
                <ResourceActions resource={cv} />
              </div>
            )}
          </section>
        </div>
        {profile.portrait && (
          <figure className="about-portrait">
            <Image
              src={assetPath(profile.portrait)}
              alt={profile.name}
              width={960}
              height={1200}
              sizes="(max-width: 640px) 90vw, 30vw"
            />
            <figcaption>{profile.name}</figcaption>
          </figure>
        )}
      </div>
    </main>
  );
}
