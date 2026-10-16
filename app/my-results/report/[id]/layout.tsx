import type { Metadata } from "next";

// The report page is meant to look like a clean clinical document, so it opts
// out of the site-wide favicon that the root layout adds via app/icon.png.
export const metadata: Metadata = {
  icons: { icon: "data:," },
};

export default function ReportLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
