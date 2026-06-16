import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import LayoutWrapper from '@/components/LayoutWrapper';
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
    <html lang="fr">
      <body className="bg-[#080b14] text-gray-100 antialiased">
        <CartProvider>
          <LayoutWrapper>
            <main>{children}</main>
          </LayoutWrapper>
        </CartProvider>
      </body>
    </html>
  );
}
