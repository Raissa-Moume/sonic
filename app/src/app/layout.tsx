import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sonic Books — La Librairie Scolaire Numérique',
  description:
    'Achetez vos livres scolaires en PDF. Livraison instantanée sur WhatsApp. La librairie numérique #1 du Cameroun.',
  keywords: 'livres scolaires, PDF, Cameroun, éducation, livres numériques',
  openGraph: {
    title: 'Sonic Books',
    description: 'La Librairie Scolaire Numérique du Cameroun',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={outfit.variable}>
      <body className="bg-[#080b14] text-white antialiased">
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
