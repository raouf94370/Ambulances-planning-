import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ambulances Planning",
  description: "Planning et régulation des transports sanitaires",
  manifest: "/manifest.webmanifest"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="fr"><body>{children}</body></html>;
}
