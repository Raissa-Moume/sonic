'use client';

import Link from 'next/link';
import { Search, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface HeroSectionProps {
  categories: string[];
}

export default function HeroSection({ categories }: HeroSectionProps) {
  const [search, setSearch] = useState('');
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/books?q=${encodeURIComponent(search.trim())}`);
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute top-3/4 left-1/3 w-60 h-60 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)', filter: 'blur(30px)' }} />
        {/* Dot grid */}
        <div className="absolute inset-0 dot-grid opacity-40" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8">
          <Sparkles size={14} className="text-amber-400" />
          <span className="text-xs font-medium text-gray-300">La librairie scolaire #1 du Cameroun 🇨🇲</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-6">
          <span className="text-white">Vos livres </span>
          <br />
          <span className="gradient-text">PDF en 1 clic</span>
          <br />
          <span className="text-white">sur </span>
          <span className="text-green-400">WhatsApp</span>
        </h1>

        <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
          Commandez vos livres scolaires, nous vérifions votre paiement et vous envoyons les PDF
          directement sur WhatsApp. Rapide, sécurisé, africain.
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="relative max-w-xl mx-auto mb-10">
          <div className="glass rounded-2xl overflow-hidden flex items-center p-1.5 glow-purple transition-all duration-300 focus-within:glow-purple">
            <Search size={18} className="text-gray-500 ml-3 shrink-0" />
            <input
              type="text"
              placeholder="Rechercher un livre, un auteur..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent px-3 py-2 text-white placeholder-gray-500 outline-none text-sm"
            />
            <button type="submit" className="btn-primary px-4 py-2 text-sm flex items-center gap-1.5 shrink-0">
              <Search size={14} />
              Chercher
            </button>
          </div>
        </form>

        {/* Quick categories */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <span className="text-xs text-gray-500 self-center">Catégories :</span>
            {categories.slice(0, 5).map((cat) => (
              <Link
                key={cat}
                href={`/books?category=${encodeURIComponent(cat)}`}
                className="badge badge-purple hover:bg-purple-500/20 transition-colors cursor-pointer"
              >
                {cat}
              </Link>
            ))}
          </div>
        )}

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/books" className="btn-primary flex items-center gap-2">
            <BookOpen size={16} />
            Explorer le catalogue
          </Link>
          <Link href="/about" className="btn-ghost flex items-center gap-2 text-sm">
            Comment ça marche <ArrowRight size={14} />
          </Link>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 mt-16 pt-8 border-t border-white/5">
          {[
            { value: '500+', label: 'Livres disponibles' },
            { value: '2k+', label: 'Étudiants satisfaits' },
            { value: '< 5min', label: 'Délai de livraison' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-bold gradient-text">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
