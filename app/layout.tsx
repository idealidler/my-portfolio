import type { Metadata } from "next";
import { ScrollReset } from "@/components/site/scroll-reset";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.akshayjain.vip";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Akshay Jain | Analytics Engineer",
  description:
    "Premium portfolio experience for Akshay Jain, showcasing analytics engineering, data products, featured GitHub projects, and AkshayGPT.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/icon",
    apple: "/apple-icon",
  },
  openGraph: {
    title: "Akshay Jain | Analytics Engineer",
    description:
      "Portfolio for Akshay Jain, featuring analytics engineering impact, modern data products, AkshayGPT, and recruiter-ready job-fit analysis.",
    url: siteUrl,
    siteName: "Akshay Jain Portfolio",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Akshay Jain Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Akshay Jain | Analytics Engineer",
    description:
      "Analytics engineering portfolio with recruiter-fit analysis, AkshayGPT, and enterprise BI impact.",
    images: ["/twitter-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ScrollReset />
        {children}
      </body>
    </html>
  );
}
