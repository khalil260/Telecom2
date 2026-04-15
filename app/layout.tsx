import type { Metadata } from "next";
import { Space_Grotesk, Tajawal } from "next/font/google";
import "./globals.css";

const displayFont = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = Tajawal({
  variable: "--font-body",
  subsets: ["latin", "arabic"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Tunisie Telecom BI Cockpit - PFE",
  description:
    "Plateforme PFE d'analyse Tunisie Telecom: consommation, offres, revenus et recommandation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
