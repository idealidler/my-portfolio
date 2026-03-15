import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Akshay Jain | Analytics Engineer",
  description:
    "Premium portfolio experience for Akshay Jain, showcasing analytics engineering, data products, featured GitHub projects, and AkshayGPT.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
