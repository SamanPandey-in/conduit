import Link from "next/link";

import { Logo } from "@/components/ui/Logo";
import { site } from "@/lib/site";

/**
 * Footer shared by every public page. Follows the owner's template:
 * logo, repository, features, docs, privacy, terms, contact, then "Built by".
 */
export function SiteFooter({ note }: { note?: string }) {
  const links = [
    { label: "GitHub Repository", href: site.links.github, external: true },
    { label: "Features", href: site.links.features },
    { label: "Documentation", href: site.links.docs, external: true },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Contact", href: site.links.contact, external: true },
  ];

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Link href="/" aria-label={`${site.name} home`} className="inline-flex min-h-11 items-center self-start rounded-sm">
            <Logo />
          </Link>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-1">
              {links.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a href={link.href} className={linkClass}>
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="flex flex-col gap-2 text-xs text-muted md:flex-row md:justify-between">
          <p>
            Built by{" "}
            <a href={site.author.url} className="text-fg underline-offset-4 hover:underline">
              {site.author.name}
            </a>
          </p>
          {note ? <p>{note}</p> : null}
        </div>
      </div>
      {/* Giant faded wordmark, cropped by the page edge. Decorative: the name is already in the logo. */}
      <div aria-hidden="true" className="pointer-events-none overflow-hidden select-none">
        <p className="-mb-[0.22em] text-center font-display text-[clamp(4.5rem,17vw,17rem)] leading-none font-medium tracking-[-0.06em] whitespace-nowrap text-fg/[0.07] [mask-image:linear-gradient(to_bottom,black_35%,transparent_95%)]">
          {site.name}
        </p>
      </div>
    </footer>
  );
}

const linkClass = "inline-flex min-h-11 items-center text-sm text-muted transition-colors duration-150 hover:text-fg";
