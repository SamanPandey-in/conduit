"use client";

import { useActionState } from "react";

import { type NameFormState, nameWorkspace } from "@/app/onboarding/actions";

const INITIAL: NameFormState = { error: null, value: "" };

export function NameWorkspaceForm({
  label,
  placeholder,
  defaultValue,
}: {
  label: string;
  placeholder: string;
  defaultValue: string;
}) {
  const [state, action, pending] = useActionState(nameWorkspace, {
    ...INITIAL,
    value: defaultValue,
  });

  return (
    <form action={action} className="flex flex-col gap-3" noValidate>
      <label htmlFor="workspace-name" className="text-sm font-medium text-fg">
        {label}
      </label>
      <input
        id="workspace-name"
        name="name"
        type="text"
        required
        maxLength={60}
        autoComplete="off"
        autoFocus
        defaultValue={state.value}
        placeholder={placeholder}
        aria-invalid={state.error ? true : undefined}
        aria-describedby={state.error ? "workspace-name-error" : undefined}
        className="h-11 rounded-sm border border-line bg-surface px-3 text-base text-fg placeholder:text-muted focus-visible:border-accent aria-invalid:border-danger"
      />
      <p id="workspace-name-error" role="alert" className="min-h-5 text-sm text-danger">
        {state.error}
      </p>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center justify-center rounded-sm bg-accent px-4 text-sm font-medium text-on-accent transition-colors duration-150 hover:bg-fg disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? "Saving…" : "Continue"}
      </button>
    </form>
  );
}
