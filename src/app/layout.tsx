import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Faculty Desk - HOD Dashboard",
  description: "A comprehensive dashboard for Head of Department to track faculty status and manage academic operations efficiently.",
  keywords: ["faculty management", "HOD dashboard", "academic administration", "faculty tracking"],
  authors: [{ name: "Faculty Desk Team" }],
  creator: "Faculty Desk",
  publisher: "Faculty Desk",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://facultydesk.vercel.app",
    title: "Faculty Desk - HOD Dashboard",
    description: "Streamline faculty management with our comprehensive HOD dashboard.",
    siteName: "Faculty Desk",
  },
  twitter: {
    card: "summary_large_image",
    title: "Faculty Desk - HOD Dashboard",
    description: "Streamline faculty management with our comprehensive HOD dashboard.",
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100`}
      >
        <div id="root" className="min-h-full">
          {children}
        </div>
      </body>
    </html>
  );
}
