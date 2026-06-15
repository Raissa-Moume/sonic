'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, BookOpen, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const links = [
    { href: '/', label: 'Accueil' },
    { href: '/books', label: 'Catalogue' },
    { href: '/about', label: 'À propos' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass shadow-2xl' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center pulse-glow"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
            <BookOpen size={18} className="text-emerald-950" />
          </div>
          <span className="text-xl font-bold gradient-text">Sonic Books</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                pathname === link.href
                  ? 'text-pink-500 bg-pink-100'
                  : 'text-emerald-800 hover:text-emerald-950 hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="relative p-2.5 rounded-xl transition-all duration-300 hover:bg-pink-100 group"
          >
            <ShoppingCart size={20} className="text-emerald-800 group-hover:text-pink-500 transition-colors" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 text-xs font-bold rounded-full flex items-center justify-center text-emerald-950"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-emerald-800 hover:text-emerald-950 hover:bg-white/5 transition-all"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-pink-200">
          <div className="px-4 py-4 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  pathname === link.href
                    ? 'text-pink-500 bg-pink-100'
                    : 'text-emerald-800 hover:text-emerald-950 hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
