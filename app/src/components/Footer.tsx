import Link from 'next/link';
import { BookOpen, Github, MessageCircle, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-purple-500/10 bg-[#080b14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
                <BookOpen size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">Sonic Books</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Votre librairie numérique préférée. Achetez vos livres PDF en toute sécurité et recevez-les instantanément sur WhatsApp.
            </p>
            <div className="flex items-center gap-2 mt-6">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-xs text-green-400 font-medium">Service disponible 7j/7</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-white mb-4">Navigation</h3>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Accueil' },
                { href: '/books', label: 'Catalogue' },
                { href: '/cart', label: 'Panier' },
                { href: '/about', label: 'À propos' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <MessageCircle size={14} className="text-green-400" />
                WhatsApp disponible
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin size={14} className="text-purple-400" />
                Cameroun 🇨🇲
              </li>
            </ul>
          </div>
        </div>

        <div className="divider my-10" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © 2025 Sonic Books. Tous droits réservés.
          </p>
          <p className="text-xs text-gray-500">
            Fait avec ❤️ pour l&apos;éducation en Afrique
          </p>
        </div>
      </div>
    </footer>
  );
}
