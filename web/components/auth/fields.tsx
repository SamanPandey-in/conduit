"use client";

import { type InputHTMLAttributes, type ReactNode, useId, useState } from "react";

/**
 * Form primitives for the auth screens. Kit tokens only (see README "Kit
 * contract"), so they look native in both products.
 */

const INPUT =
  "h-11 w-full rounded-sm border border-line bg-surface px-3 text-base text-fg placeholder:text-muted focus-visible:border-accent aria-invalid:border-danger";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className">;

type FieldProps = InputProps & {
  label: string;
  hint?: ReactNode;
  /** Rendered at the right of the label row, e.g. a "Forgot password?" link. */
  labelAside?: ReactNode;
};

export function TextField({ label, hint, labelAside, ...input }: FieldProps) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel id={id} label={label} aside={labelAside} />
      <input id={id} aria-describedby={hint ? `${id}-hint` : undefined} className={INPUT} {...input} />
      {hint ? <FieldHint id={id}>{hint}</FieldHint> : null}
    </div>
  );
}

/** Password input with a Show/Hide toggle, which replaces a "confirm password" field. */
export function PasswordField({ label, hint, labelAside, ...input }: FieldProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel id={id} label={label} aside={labelAside} />
      <div className="relative">
        <input
          id={id}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className={`${INPUT} pr-16`}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          {...input}
          type={visible ? "text" : "password"}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-controls={id}
          aria-pressed={visible}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-0 inline-flex min-w-14 items-center justify-center rounded-sm px-3 text-xs text-muted transition-colors duration-150 hover:text-fg"
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
      {hint ? <FieldHint id={id}>{hint}</FieldHint> : null}
    </div>
  );
}

function FieldLabel({ id, label, aside }: { id: string; label: string; aside?: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <label htmlFor={id} className="text-sm font-medium text-fg">
        {label}
      </label>
      {aside}
    </div>
  );
}

function FieldHint({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={`${id}-hint`} className="text-xs text-muted">
      {children}
    </p>
  );
}

export function SubmitButton({
  pending,
  pendingLabel,
  hint,
  children,
}: {
  pending: boolean;
  pendingLabel: string;
  /** Small text at the right edge, e.g. "Last used". Hidden while pending. */
  hint?: string | null;
  children: ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="relative inline-flex h-11 items-center justify-center gap-2 rounded-sm bg-accent px-4 text-sm font-medium text-on-accent transition-colors duration-150 hover:bg-fg disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? <Spinner /> : null}
      {pending ? pendingLabel : children}
      {hint && !pending ? (
        <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-normal opacity-75">{hint}</span>
      ) : null}
    </button>
  );
}

/**
 * Error line. The live region is always mounted so screen readers announce a new
 * error, but it takes no space until there is one: no blank gap under the button.
 */
export function FormError({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="text-sm text-danger empty:hidden">
      {children}
    </p>
  );
}

/** Neutral confirmation ("We sent a link to …"). */
export function Notice({ children }: { children: ReactNode }) {
  return (
    <p role="status" className="rounded-sm border border-line bg-surface px-3 py-2.5 text-sm text-fg">
      {children}
    </p>
  );
}

export function OrDivider() {
  return (
    <div className="flex items-center gap-3 text-xs text-muted">
      <span aria-hidden="true" className="h-px flex-1 bg-line" />
      or
      <span aria-hidden="true" className="h-px flex-1 bg-line" />
    </div>
  );
}

export function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none"
    />
  );
}
