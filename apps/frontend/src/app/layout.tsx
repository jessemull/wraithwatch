import type { Metadata } from 'next';
import { Roboto_Condensed } from 'next/font/google';
import './globals.css';

const robotoCondensed = Roboto_Condensed({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-roboto-condensed',
});

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://www.wraithwatch-demo.com',
  },
  description:
    'Adaptive, Intelligent Cyber Defense. Real-time entity monitoring and threat detection powered by advanced AI.',
  metadataBase: new URL('https://www.wraithwatch-demo.com'),
  openGraph: {
    description: 'Adaptive, Intelligent Cyber Defense.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Wraithwatch - Demo - Cyber Defense Command Center',
      },
    ],
    siteName: 'Wraithwatch Demo',
    title: 'Wraithwatch Demo',
    url: 'https://www.wraithwatch-demo.com',
    type: 'website',
  },
  title: 'Wraithwatch',
  twitter: {
    card: 'summary_large_image',
    title: 'Wraithwatch',
    description: 'Adaptive, Intelligent Cyber Defense.',
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
