import { Geist } from "next/font/google";

import "./globals.css";

import AppShell from "@/src/components/AppShell.jsx";
import Providers from "@/src/components/Providers.jsx";

export const metadata = {
  title: "FinAgent",
  description: "Secure spending intelligence routed through a single frontend edge.",
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={geist.variable}>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
