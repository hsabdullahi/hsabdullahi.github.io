import { ActionIcon } from "@/components/action-icon";
import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="shell detail">
      <p className="eyebrow">404 / Page not found</p>
      <h1>A different path.</h1>
      <p>This page is not available.</p>
      <Link href="/" className="button">
        Return home <ActionIcon kind="internal" />
      </Link>
    </main>
  );
}
