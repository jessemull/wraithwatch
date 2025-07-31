import type { Metadata } from 'next';
import { Roboto_Condensed } from 'next/font/google';
import './globals.css';
import { config } from '../config';

const robotoCondensed = Roboto_Condensed({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-roboto-condensed',
});

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://www.wraithwatch-demo.com',
  },
  description: `${config.app.description}. Real-time entity monitoring and threat detection powered by advanced AI.`,
  metadataBase: new URL('https://www.wraithwatch-demo.com'),
  openGraph: {
    description: config.app.description,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${config.app.name} - Demo - Cyber Defense Command Center`,
      },
    ],
    siteName: `${config.app.name} Demo`,
    title: `${config.app.name} Demo`,
    url: 'https://www.wraithwatch-demo.com',
    type: 'website',
  },
  title: config.app.name,
  twitter: {
    card: 'summary_large_image',
    title: config.app.name,
    description: config.app.description,
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${robotoCondensed.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
