import type { Metadata } from "next";
import Head from 'next/head';
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
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "CareerPages.dev - Simplifying Your Job Search",
  description: "Discover CareerPages.dev — a fast and intuitive platform designed to simplify job searches for students and job seekers. Explore company engineering blogs, stay updated with company news, understand organizational structures, and effortlessly share job leads.",
  keywords: "job search, student jobs, career development, engineering blogs, company news, job insights, organizational structure, job opportunities, fast job search platform, job search tools, interview prep, job sharing, hacktoberfest, web dev, careerpages, job seekers",
  authors: [{ name: "CareerPages.dev" }],
  viewport: "width=device-width, initial-scale=1.0",
  openGraph: {
    title: "CareerPages.dev - Simplifying Your Job Search",
    description: "CareerPages.dev is designed to empower students and job seekers with tools to find their next opportunity fast. Discover company blogs, search news, and more.",
    url: "https://careerpages.dev/",
    images: [{ url: "https://careerpages.dev/social.png" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CareerPages.dev - Simplifying Your Job Search",
    description: "Discover CareerPages.dev, the fast and efficient platform that helps students and job seekers find the right opportunity. Check out company blogs, news, and more.",
    images: ["https://careerpages.dev/social.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://careerpages.dev/",
  },
};

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
