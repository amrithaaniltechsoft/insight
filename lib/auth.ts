/**
 * The customer session token.
 *
 * The customer API used to identify a caller by the email address they passed
 * in (`customer_email`), which meant that anyone who knew an address could read
 * — or edit — that account's saved people. Verifying an OTP now returns a
 * Sanctum token instead, and the API takes the identity from that token.
 *
 * The token is kept in localStorage (the app has no cookie session) and sent as
 * `Authorization: Bearer <token>` on the customer API calls that need it.
 */

export const AUTH_TOKEN_KEY = "customer_auth_token";

/** The stored token, or null when nobody is signed in. */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

/**
 * Stores a token returned by sign-in. A missing token is ignored rather than
 * written, so a response from an older server cannot store the string
 * "undefined" and shadow a token that is already there.
 */
export function setAuthToken(token: string | null | undefined): void {
  if (typeof window === "undefined" || !token) return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

/** Drops the token on sign-out, so the browser cannot keep acting as the user. */
export function clearAuthToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

/**
 * Headers for a customer API request. Spreading this into a fetch when nobody
 * is signed in contributes nothing, which keeps the legacy email-only call
 * working until every deployment sends a token.
 */
export function authHeaders(): Record<string, string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
