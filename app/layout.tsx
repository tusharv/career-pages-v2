import type { Metadata, Viewport } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import "./globals.css";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Toaster } from "@/components/ui/toaster"


import { CompaniesProvider } from './CompaniesContext';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  adjustFontFallback: "Arial",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  adjustFontFallback: "Times New Roman",
});

export const metadata: Metadata = {
  title: "careerpages.co.in - Simplifying Your Job Search",
  description: "Discover careerpages.co.in — a fast and intuitive platform designed to simplify job searches for students and job seekers. Explore company engineering blogs, stay updated with company news, understand organizational structures, and effortlessly share job leads.",
  keywords: "job search, student jobs, career development, engineering blogs, company news, job insights, organizational structure, job opportunities, fast job search platform, job search tools, interview prep, job sharing, hacktoberfest, web dev, careerpages, job seekers",
  authors: [{ name: "careerpages.co.in" }],
  openGraph: {
    title: "careerpages.co.in - Simplifying Your Job Search",
    description: "careerpages.co.in is designed to empower students and job seekers with tools to find their next opportunity fast. Discover company blogs, search news, and more.",
    url: "https://careerpages.co.in/",
    images: [{ url: "https://careerpages.co.in/social.png" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "careerpages.co.in - Simplifying Your Job Search",
    description: "Discover careerpages.co.in, the fast and efficient platform that helps students and job seekers find the right opportunity. Check out company blogs, news, and more.",
    images: ["https://careerpages.co.in/social.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://careerpages.co.in/",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Script id="google-analytics">
        {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-W67MJ95D');
          `}
      </Script>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <CompaniesProvider>
          {children}
          <Toaster />
        </CompaniesProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
