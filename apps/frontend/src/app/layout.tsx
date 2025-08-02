import type { Metadata } from 'next';
import { Roboto_Condensed } from 'next/font/google';
import './globals.css';
import { config } from '../config';
import ChatBot from '../components/ChatBot';

const robotoCondensed = Roboto_Condensed({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-roboto-condensed',
});

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://www.wraithwatch-demo.com',
  },
  description: config.app.description,
  metadataBase: new URL('https://www.wraithwatch-demo.com'),
  keywords:
    'cyber defense, threat detection, AI security, real-time monitoring, cybersecurity, entity monitoring, security analytics',
  authors: [{ name: 'Wraithwatch Team' }],
  creator: 'Wraithwatch',
  publisher: 'Wraithwatch',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
        <ChatBot />
      </body>
    </html>
  );
}
