import type { ReactNode } from "react";

type SectionHeaderProps = {
  /** Sets the heading id so the section can use aria-labelledby. */
  id: string;
  /** Mono micro-label: a real identifier from the product (method, tool, error code). */
  micro: string;
  title: ReactNode;
  lede?: ReactNode;
  as?: "h2" | "h3";
  className?: string;
};

/** Section pattern: mono micro-label, serif title, one short paragraph. */
export function SectionHeader({ id, micro, title, lede, as: Heading = "h2", className = "" }: SectionHeaderProps) {
  const size =
    Heading === "h2" ? "text-[clamp(2.125rem,4.6vw,3.5rem)]" : "text-[clamp(1.875rem,3.4vw,2.625rem)]";
  return (
    <header className={`reveal ${className}`}>
      <p className="micro">{micro}</p>
      <Heading id={id} className={`display mt-4 ${size}`}>
        {title}
      </Heading>
      {lede ? <p className="mt-5 max-w-[34rem] text-[1.0625rem] leading-7 text-muted">{lede}</p> : null}
    </header>
  );
}
