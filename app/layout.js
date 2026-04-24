import { Roboto } from "next/font/google";

import "./globals.css";

import AppShell from "@/src/components/AppShell.jsx";
import Providers from "@/src/components/Providers.jsx";

export const metadata = {
  title: "FinAgent",
  description: "Secure spending intelligence routed through a single frontend edge.",
};

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={roboto.variable}>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
