import { Metadata } from "next";
import "./globals.css";
import ThemeProviderClient from "./components/ThemeProviderClient";

export const metadata: Metadata = {
  title: "Landing Page",
  description: "A landing page with theme and language toggles",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProviderClient>
          <main>{children}</main>
        </ThemeProviderClient>
      </body>
    </html>
  );
}
