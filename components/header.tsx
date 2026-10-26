"use client";
import { ActionIcon } from "@/components/action-icon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
export type NavigationItem = { href: string; label: string };
export function Header({ links }: { links: NavigationItem[] }) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);
  const pathname = usePathname();
  function close() {
    if (open && nav.current?.contains(document.activeElement))
      button.current?.focus();
    setOpen(false);
  }
  return (
    <header className="header shell">
      <noscript>
        <style>{`@media(max-width:900px){.header{flex-wrap:wrap;padding-top:20px}.menu-toggle{display:none}.nav{display:flex;position:static;flex-direction:row;flex-wrap:wrap;width:100%;padding:12px 0;border:0}}`}</style>
      </noscript>
      <Link href="/" className="wordmark">
        <span className="wordmark-name-full">Hamza Sulayman Abdullahi</span>
        <span className="wordmark-name-short">Hamza S. Abdullahi</span>
        <span className="wordmark-tagline">Engineering · Education · Systems</span>
      </Link>
      <button
        ref={button}
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="main-nav"
        onClick={() => {
          setOpen(!open);
          if (!open)
            requestAnimationFrame(() =>
              nav.current?.querySelector<HTMLAnchorElement>("a")?.focus(),
            );
        }}
      >
        Menu {open ? "−" : "+"}
      </button>
      <nav
        ref={nav}
        id="main-nav"
        aria-label="Main navigation"
        className={open ? "nav open" : "nav"}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            close();
          }
        }}
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={close}
            aria-current={
              pathname === link.href || pathname.startsWith(link.href)
                ? "page"
                : undefined
            }
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/contact/"
          className="contact-link"
          onClick={close}
          aria-current={pathname === "/contact/" ? "page" : undefined}
        >
          Contact <ActionIcon kind="internal" />
        </Link>
      </nav>
    </header>
  );
}
