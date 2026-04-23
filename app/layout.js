import "./globals.css";

import AppShell from "@/src/components/AppShell.jsx";
import Providers from "@/src/components/Providers.jsx";

export const metadata = {
  title: "FinAgent",
  description: "Secure spending intelligence routed through a single frontend edge.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
