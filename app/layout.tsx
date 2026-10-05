import type {Metadata} from 'next';
import { Cinzel, Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Atelier Kōhī | Artisanal Roastery & 3D Slow Bar',
  description: 'Artisanal specialty coffee roastery featuring interactive 3D drink craft, single-origin pour-overs, curated slow bar tasting, table reservations, and cafe ambience.',
  openGraph: {
    title: 'Atelier Kōhī | Artisanal Roastery & 3D Slow Bar',
    description: 'Artisanal specialty coffee roastery featuring interactive 3D drink craft, single-origin pour-overs, curated slow bar tasting, table reservations, and cafe ambience.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Atelier Kōhī | Artisanal Roastery & 3D Slow Bar',
    description: 'Artisanal specialty coffee roastery featuring interactive 3D drink craft, single-origin pour-overs, curated slow bar tasting, table reservations, and cafe ambience.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html
      lang="en"
      className={`scroll-smooth ${cinzel.variable} ${playfair.variable} ${plusJakarta.variable}`}
    >
      <body className="bg-[#121110] text-[#EDE8E1] antialiased selection:bg-[#C68A4C] selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

