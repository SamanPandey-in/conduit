// Every external URL on the site lives here. Kit components (footer, legal
// pages, robots, sitemap) read `name`, `url`, `links`, `author` and `legal`.
const githubRepo = "https://github.com/SamanPandey-in/conduit"; // TODO(user): confirm the repo name once it's public.
const origin = process.env.SITE_URL ?? "https://conduit.samanp.xyz"; // TODO(user): confirm the subdomain.

export const site = {
  name: "Conduit",
  // Canonical origin for metadataBase, Open Graph, sitemap and legal pages.
  url: origin,
  title: "Conduit: a governed MCP gateway",
  description:
    "Give agents your data without giving them the keys. A governed MCP gateway: cited retrieval, scoped tools, approvals and an audit log.",
  links: {
    demo: "/login",
    signIn: "/login",
    features: "/#surfaces-title",
    github: githubRepo,
    docs: `${githubRepo}#readme`,
    readme: `${githubRepo}#readme`,
    adrs: `${githubRepo}/tree/main/docs/adr`,
    contact: "mailto:conduit@samanp.xyz", // TODO(user): confirm this mailbox exists.
  },
  author: { name: "Saman Pandey", url: "https://github.com/SamanPandey-in" },
  // Bump when /privacy or /terms change materially (ISO date).
  legal: { updated: "2026-11-24", email: "conduit@samanp.xyz" },
  mcp: {
    // The gateway endpoint ships Day 5; until then this documents the shape.
    url: `${origin}/mcp`,
    authorization: "Bearer <token>",
  },
} as const;

export const mcpConfig = JSON.stringify(
  {
    mcpServers: {
      conduit: {
        type: "http",
        url: site.mcp.url,
        headers: { Authorization: site.mcp.authorization },
      },
    },
  },
  null,
  2,
);
