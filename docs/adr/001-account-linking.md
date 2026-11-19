# ADR-001: Link accounts on a verified email

- **Status:** accepted (2026-11-23)
- **Context:** users can sign in with Google or GitHub. The same person may use both, and the plan's test matrix includes "same email via Google then GitHub".
- **Decision:** Better Auth `account.accountLinking` with `trustedProviders: ["google", "github"]`. A second provider whose email matches an existing user is linked automatically. Both providers only return verified emails for these scopes.
- **Consequences:** one user per verified email across providers. An email change at the provider does not move the account. Failed links land on `/auth/error` with `account_not_linked` copy. Demo (anonymous) users are separate and never linked.
- **Amendment (2026-11-24):** email + password sign-in was added, which creates accounts with unverified emails. Linking stays safe because Better Auth's `requireLocalEmailVerified` (on by default) refuses to link Google or GitHub into a local account whose email isn't confirmed yet, so a stranger can't pre-register a victim's email and capture their OAuth login. That case shows `account_not_linked` on `/auth/error`.
- **Revisit if:** a provider is added that can return unverified emails, or orgs need SSO.
