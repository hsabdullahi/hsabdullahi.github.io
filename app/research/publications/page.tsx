import { StructuredData } from "@/components/structured-data";
import { publications } from "@/lib/content";
import { PublicationRow, Breadcrumbs } from "@/components/editorial";
import { FilterBar, FilterEmptyState } from "@/components/filter-bar";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Publications",
  "The supplied publication record of Dr. Hamza Sulayman Abdullahi, with ordered authors and DOI links.",
  "/research/publications/",
);
export default function Publications() {
  return (
    <main id="main" className="shell detail">
      <StructuredData
        data={publications.map((publication) => ({
          "@context": "https://schema.org",
          "@type": "ScholarlyArticle",
          name: publication.title,
          author: publication.authors.map((name) => ({
            "@type": "Person",
            name,
          })),
          datePublished: String(publication.year),
          isPartOf: { "@type": "Periodical", name: publication.venue },
          ...(publication.doiUrl ? { url: publication.doiUrl } : {}),
          ...(publication.doi
            ? {
                identifier: {
                  "@type": "PropertyValue",
                  propertyID: "DOI",
                  value: publication.doi,
                },
              }
            : {}),
        }))}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Research", href: "/research/" },
          { label: "Publications" },
        ]}
      />
      <p className="eyebrow">Research / Publication record</p>
      <h1>Ideas, investigated.</h1>
      <p className="lead">
        Publications in applied engineering, computational design and
        manufacturing.
      </p>
      <p className="small">
        Supplied Scopus export, 14 September 2026. This record contains{" "}
        {publications.length} publications; it may not include every
        publication.
      </p>
      <FilterBar
        targetId="publication-list"
        noun="publication"
        searchLabel="Search publications"
        fields={[
          {
            name: "year",
            label: "Year",
            options: [...new Set(publications.map((p) => p.year))].map(
              (year) => ({ value: String(year), label: String(year) }),
            ),
          },
          {
            name: "type",
            label: "Publication type",
            options: [
              ...new Set(publications.map((p) => p.publicationType)),
            ].map((type) => ({ value: type, label: type })),
          },
        ]}
      />
      <h2 className="sr-only">Publication record</h2>
      <div id="publication-list">
        {publications.map((p) => (
          <div
            key={p.id}
            data-filter-item
            data-year={p.year}
            data-type={p.publicationType}
          >
            <PublicationRow publication={p} />
          </div>
        ))}
      </div>
      <FilterEmptyState targetId="publication-list" />
    </main>
  );
}
