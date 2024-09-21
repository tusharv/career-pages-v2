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
        <Head>
          {/* Primary Meta Tags */}
          <meta name="description" content="Discover CareerPages.dev — a fast and intuitive platform designed to simplify job searches for students and job seekers. Explore company engineering blogs, stay updated with company news, understand organizational structures, and effortlessly share job leads." />
          <meta name="keywords" content="job search, student jobs, career development, engineering blogs, company news, job insights, organizational structure, job opportunities, fast job search platform, job search tools, interview prep, job sharing, hacktoberfest, web dev, careerpages, job seekers" />
          <meta name="author" content="CareerPages.dev" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          
          {/* Open Graph / Facebook */}
          <meta property="og:title" content="CareerPages.dev - Simplifying Your Job Search" />
          <meta property="og:description" content="CareerPages.dev is designed to empower students and job seekers with tools to find their next opportunity fast. Discover company blogs, search news, and more." />
          <meta property="og:url" content="https://careerpages.dev/" />
          <meta property="og:image" content="https://careerpages.dev/logo.png" /> {/* Correct image URL */}
          <meta property="og:type" content="website" />

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="CareerPages.dev - Simplifying Your Job Search" />
          <meta name="twitter:description" content="Discover CareerPages.dev, the fast and efficient platform that helps students and job seekers find the right opportunity. Check out company blogs, news, and more." />
          <meta name="twitter:image" content="https://careerpages.dev/logo.png" /> {/* Correct image URL */}
          
          {/* Robots.txt (Meta Tag) */}
          <meta name="robots" content="index, follow" />

          {/* Canonical URL */}
          <link rel="canonical" href="https://careerpages.dev/" />
      </Head>
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
