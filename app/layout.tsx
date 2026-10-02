import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://adpage-builder.xyz"),
  title: "AdPage Builder — Trending Stories, Tools & Ideas",
  description: "Mixed content website featuring trending stories, technology, lifestyle, travel, entertainment and free online tools.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>
      {children}
      <Script id="adsterra-popunder" src="https://movementssubscriptionobjection.com/bd/69/05/bd6905d20fbe6ac804838a3fa363f603.js" strategy="afterInteractive" />
      <Script id="adsterra-social-bar" src="https://movementssubscriptionobjection.com/7a/ca/c5/7acac5cbced8ea7996ed9070cf78d54f.js" strategy="afterInteractive" />
    </body></html>;
}