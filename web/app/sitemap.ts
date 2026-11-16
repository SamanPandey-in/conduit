import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const legalUpdated = new Date(`${site.legal.updated}T00:00:00Z`);
  return [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/privacy`, lastModified: legalUpdated, changeFrequency: "yearly", priority: 0.3 },
    { url: `${site.url}/terms`, lastModified: legalUpdated, changeFrequency: "yearly", priority: 0.3 },
  ];
}
