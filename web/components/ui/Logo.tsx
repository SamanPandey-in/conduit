// Auth-kit contract: each product exports `Logo` from components/ui/Logo.tsx.

/** The mark: a line of light entering a pane of amber glass and leaving it redirected. */
export function LogoMark({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true" className="shrink-0">
      <rect x="7" y="1.5" width="6" height="17" rx="2" className="fill-honey" />
      <path
        d="M1 12.5H7L13 7.5H19"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="inline-flex items-center gap-2 text-base font-semibold tracking-tight text-fg">
      <LogoMark />
      Conduit
    </span>
  );
}
