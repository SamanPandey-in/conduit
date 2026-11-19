import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Signed-in and auth surfaces have nothing to index.
      disallow: ["/app", "/onboarding", "/auth", "/login", "/signup", "/forgot-password", "/reset-password", "/api"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
