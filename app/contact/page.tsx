import { ActionIcon } from "@/components/action-icon";
import { AcademicProfileLink } from "@/components/academic-profile-link";
import { profile } from "@/lib/content";
import { Breadcrumbs } from "@/components/editorial";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Contact & collaboration",
  "Academic profiles and collaboration interests in applied engineering, digital manufacturing, engineering education and institutional digital systems.",
  "/contact/",
);
export default function Contact() {
  return (
    <main id="main" className="shell detail">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <p className="eyebrow">Contact / Collaboration</p>
      <h1>
        Good work begins
        <br />
        <em>with an exchange.</em>
      </h1>
      <div className="detail-grid">
        <aside>
          <p className="mono">Academic affiliation</p>
          {profile.affiliations.map((affiliation) => (
            <p key={affiliation}>{affiliation}</p>
          ))}
        </aside>
        <section>
          <h2>
            Shared questions.
            <br />
            Practical possibilities.
          </h2>
          <p>
            I welcome conversations around applied engineering, digital
            manufacturing, engineering education and institutional digital
            systems.
          </p>
          {profile.email && (
            <p>
              <a className="button" href={`mailto:${profile.email}`}>
                {profile.email} <ActionIcon kind="email" />
              </a>
            </p>
          )}
          <section
            className="contact-booking"
            aria-labelledby="booking-heading"
          >
            <h3 id="booking-heading">Book a session</h3>
            <p>
              Choose an available time to discuss research, collaboration or
              engineering education.
            </p>
            <a
              className="button"
              href="https://calendar.app.google/7QWTx7pnDyit965i9"
            >
              Choose a time <ActionIcon kind="external" />
            </a>
            <p className="small">Book through Google Calendar.</p>
          </section>
          <h3>Academic & professional profiles</h3>
          <div className="contact-profiles">
            {profile.links.map((link) => (
              <AcademicProfileLink key={link.label} link={link} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
