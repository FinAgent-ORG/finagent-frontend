import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";

import "./globals.css";

import AppShell from "@/src/components/AppShell.jsx";
import Providers from "@/src/components/Providers.jsx";
import { BRAND } from "@/src/constants/branding.js";

export const metadata = {
  title: BRAND.name,
  description: BRAND.description,
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetBrainsMono.variable} ${spaceGrotesk.variable}`}>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
