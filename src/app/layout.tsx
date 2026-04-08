import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Discover — Events & Experiences",
  description: "Curated events worth your time",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
