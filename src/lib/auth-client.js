import { createAuthClient } from "better-auth/react";

// Initialize the authentication client instance with custom base configuration
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
});

// Export standard functional methods extracted from the authenticated instance
export const { signIn, signUp, signOut } = authClient;