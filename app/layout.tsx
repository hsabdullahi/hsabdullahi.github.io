import type { Metadata } from "next";
import { Header } from "@/components/header";
import { projects, talks } from "@/lib/content";
import { Footer } from "@/components/editorial";
import { absoluteUrl } from "@/lib/site";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  title: {
    default: "Hamza Sulayman Abdullahi | Engineering, education & systems",
    template: "%s | Hamza S. Abdullahi",
  },
  description:
    "Applied engineering, digital manufacturing and engineering education. Dr. Hamza Sulayman Abdullahi, Lecturer I at Bayero University, Kano.",
  openGraph: {
    type: "website",
    images: [
      {
        url: absoluteUrl("/images/social.png"),
        width: 1200,
        height: 630,
        alt: "Hamza Sulayman Abdullahi · Engineering, education and systems",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <noscript>
          <style>{`.filter-bar{display:none}`}</style>
        </noscript>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header
          links={[
            ...(projects.length ? [{ href: "/work/", label: "Work" }] : []),
            { href: "/research/", label: "Research" },
            { href: "/teaching/", label: "Teaching" },
            ...(talks.length
              ? [{ href: "/speaking/", label: "Speaking" }]
              : []),
            { href: "/about/", label: "About" },
          ]}
        />
        {children}
        <Footer />
      </body>
    </html>
  );
}
