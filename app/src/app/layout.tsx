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
  title: 'Sonic Books — Votre Librairie Numérique',
  description:
    'Achetez vos livres en PDF sur l\'agriculture, l\'élevage, le développement personnel et bien plus. Livraison instantanée sur WhatsApp.',
  keywords: 'livres, PDF, Cameroun, agriculture, élevage, développement personnel, livres numériques',
  openGraph: {
    title: 'Sonic Books',
    description: 'Votre Librairie Numérique',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={outfit.variable}>
      <body className="bg-[#080b14] text-gray-900 antialiased">
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
