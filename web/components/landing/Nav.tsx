import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { site } from "@/lib/site";
import { GitHubIcon } from "./icons";

const links = [
  { label: "Pipeline", href: "#pipeline" },
  { label: "Why a gateway", href: "#injection" },
  { label: "Product", href: "#surfaces" },
  { label: "Connect", href: "#connect" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-10 px-4 md:px-8">
        <Link href="/" aria-label={`${site.name} home`} className="inline-flex min-h-11 items-center rounded-sm">
          <Logo />
        </Link>
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-7">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="inline-flex min-h-11 items-center text-sm text-muted transition-colors duration-150 hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-1.5">
          <a
            href={site.links.github}
            className="hidden min-h-11 items-center gap-2 rounded-full px-3.5 text-sm text-muted transition-colors duration-150 hover:text-ink sm:inline-flex"
          >
            <GitHubIcon />
            GitHub
          </a>
          <Link
            href={site.links.signIn}
            className="inline-flex min-h-11 items-center rounded-full px-3.5 text-sm text-muted transition-colors duration-150 hover:text-ink"
          >
            Sign in
          </Link>
          <Link
            href={site.links.demo}
            className="inline-flex h-10 items-center rounded-full bg-ink px-4.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-ink/85"
          >
            Run the demo
          </Link>
        </div>
      </div>
    </header>
  );
}
