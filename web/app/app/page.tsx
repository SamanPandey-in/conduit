import { redirect } from "next/navigation";
import { Suspense } from "react";

import { WorkspaceHome } from "@/components/app/WorkspaceHome";
import { product } from "@/lib/product";
import { requireUser } from "@/lib/session";

/** Kit shell for /app. The body is product-specific: components/app/WorkspaceHome. */
export default function AppHome({ searchParams }: PageProps<"/app">) {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <Home searchParams={searchParams} />
    </Suspense>
  );
}

async function Home({ searchParams }: Pick<PageProps<"/app">, "searchParams">) {
  const user = await requireUser("/app");
  if (!user.workspaceId) redirect("/onboarding");
  const { sample } = await searchParams;

  return (
    <div className="flex flex-col gap-10">
      <div>
        <p className="text-sm text-muted">
          {user.isDemo ? "Demo workspace. Resets every night." : capitalize(product.workspaceNoun)}
        </p>
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-fg">{user.workspaceName}</h1>
      </div>

      <WorkspaceHome user={user} sampleRequested={sample === "requested"} />
    </div>
  );
}

function HomeSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-10">
      <div className="h-12 w-48 rounded-sm bg-surface" />
      <div className="h-56 rounded-md border border-dashed border-line" />
    </div>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
