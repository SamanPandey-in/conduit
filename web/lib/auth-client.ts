import { anonymousClient, lastLoginMethodClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

// Same-origin: baseURL is inferred from the browser location.
export const authClient = createAuthClient({
  plugins: [anonymousClient(), lastLoginMethodClient()],
});
