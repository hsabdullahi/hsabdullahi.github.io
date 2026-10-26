import type { Metadata } from "next";
import { absoluteUrl } from "./site";
type ArchiveTitle = { title: string; slug: string; date?: string | null };
export function archivePageTitle(
  record: ArchiveTitle,
  records: ArchiveTitle[],
) {
  const peers = records.filter((item) => item.title === record.title);
  if (peers.length < 2) return record.title;
  const slugLabel = record.slug.replaceAll("-", " ");
  const suffix = record.date
    ? peers.some(
        (item) => item.slug !== record.slug && item.date === record.date,
      )
      ? `${record.date} · ${slugLabel}`
      : record.date
    : slugLabel;
  return `${record.title} · ${suffix}`;
}
export function pageMetadata(
  title: string,
  description: string,
  route: string,
): Metadata {
  const image = {
    url: absoluteUrl("/images/social.png"),
    width: 1200,
    height: 630,
    alt: "Hamza Sulayman Abdullahi · Engineering, education and systems",
  };
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(route) },
    openGraph: {
      type: "website",
      title,
      description,
      url: absoluteUrl(route),
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}
