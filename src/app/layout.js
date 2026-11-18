import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import { Cinzel_Decorative, Libre_Baskerville, Lato } from 'next/font/google';

// Title Font
const cinzel = Cinzel_Decorative({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

// Subtitle Font
const libreBaskerville = Libre_Baskerville({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-baskerville',
  display: 'swap',
});

// Body Font
// 3. Font Isi & Tombol (Sangat Mudah Dibaca)
const lato = Lato({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-lato',
  display: 'swap',
});

export const metadata = {
  title: 'PEMIRA IKM FF UI 2026',
  description: 'Website Resmi Pemilihan Raya Ikatan Keluarga Mahasiswa Fakultas Farmasi Universitas Indonesia 2026',
  icons: {
    icon: '/logo_pemira_2nd.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${cinzel.variable} ${libreBaskerville.variable} ${lato.variable}`}
    >
      <body className="min-h-screen flex flex-col font-lato bg-gradient-to-b from-[#2A6570] via-[#5C6E78] to-[#B38787] text-slate-800 antialiased selection:bg-[#E78F81] selection:text-white">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}