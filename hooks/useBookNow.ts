"use client";

import { useRouter } from "next/navigation";

/**
 * useBookNow
 * 
 * A custom hook for all "Book Appointment" / "Book Now" buttons across the site.
 * 
 * Behaviour:
 * - If the user is already signed in → navigates directly to /book-appointment?service=...
 * - If the user is NOT signed in → fires a custom DOM event "open-signin-modal"
 *   that the Header listens to, opens the Sign In modal, and stores the pending
 *   booking URL so the user is redirected after successful sign-in.
 */
export function useBookNow() {
  const router = useRouter();

  const bookNow = (serviceSlug?: string) => {
    const isSignedIn = typeof window !== "undefined"
      ? localStorage.getItem("is_signed_in") === "true"
      : false;

    const bookingUrl = serviceSlug
      ? `/book-appointment?service=${serviceSlug}`
      : "/book-appointment";

    if (isSignedIn) {
      router.push(bookingUrl);
    } else {
      // Fire a global event that the Header's SignInModal listens to
      window.dispatchEvent(
        new CustomEvent("open-signin-modal", { detail: { redirectUrl: bookingUrl } })
      );
    }
  };

  return { bookNow };
}
