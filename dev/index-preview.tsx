import { ActionIcon } from "@/components/action-icon";
import Link from "next/link";
export default function ReviewIndex() {
  return (
    <main id="main" className="shell detail">
      <p className="eyebrow">Development only / Content slots</p>
      <h1>
        A place for
        <br />
        <em>what comes next.</em>
      </h1>
      <p className="lead reading-width">
        These clearly labelled examples preserve space for future project
        evidence, engagements, materials and public contact details.
      </p>
      <div className="contact-profiles">
        {[
          { href: "/review-preview/work/", label: "Selected work example" },
          {
            href: "/review-preview/work/example/",
            label: "Project case study example",
          },
          {
            href: "/review-preview/speaking/",
            label: "Speaking detail & sample PDF",
          },
          {
            href: "/review-preview/resources/",
            label: "Course resource filters & sample PDF",
          },
          {
            href: "/review-preview/contact/",
            label: "Public email & CV slots",
          },
          {
            href: "/review-preview/styles/",
            label: "Typography, tokens & component states",
          },
        ].map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
            <ActionIcon kind="internal" />
          </Link>
        ))}
      </div>
    </main>
  );
}
