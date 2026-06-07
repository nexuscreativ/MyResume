import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://idjai.dev"
  ),
  title: "Efemena Derek Idjai – Senior Systems Programmer",
  description:
    "Portfolio and CV of Efemena Derek Idjai – Senior Systems Programmer, Full‑Stack & AI Engineer, and Cybersecurity Advocate.",
  keywords: [
    "Efemena Derek Idjai",
    "Senior Systems Programmer",
    "Full‑Stack Engineer",
    "AI Engineer",
    "Cybersecurity",
    "Portfolio",
    "CV"
  ],
  authors: [{ name: "Efemena Derek Idjai" }],
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/avatar-apple.jpg", sizes: "180x180", type: "image/jpeg" },
    ],
  },
  openGraph: {
    title: "Efemena Derek Idjai – Senior Systems Programmer",
    description:
      "Portfolio and CV of Efemena Derek Idjai – Senior Systems Programmer, Full‑Stack & AI Engineer, and Cybersecurity Advocate.",
    type: "profile",
    locale: "en_US",
    images: [
      { url: "/og-image.jpg", width: 1200, height: 630, alt: "Efemena Derek Idjai" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Efemena Derek Idjai – Senior Systems Programmer",
    description:
      "Portfolio and CV of Efemena Derek Idjai – Senior Systems Programmer, Full‑Stack & AI Engineer, and Cybersecurity Advocate.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased dark:bg-slate-900 dark:text-slate-50">
        {children}
      </body>
    </html>
  );
}
