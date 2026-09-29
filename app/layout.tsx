import "./globals.css";

export const metadata = {
  title: "ReelPilot AI",
  description: "Facebook Reel publishing and monetized link management.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}