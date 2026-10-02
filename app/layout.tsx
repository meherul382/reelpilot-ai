import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://adpage-builder.xyz"),
  title: "AdPage Builder — Trending Stories, Tools & Ideas",
  description: "Mixed content website featuring trending stories, technology, lifestyle, travel, entertainment and free online tools.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}