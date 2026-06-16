'use client';

import Link from 'next/link';
import { Search, BookOpen, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface HeroSectionProps {
  categories: string[];
}

const BOOK_EMOJIS = ['📚', '📖', '📕', '📗', '📘', '📙', '🔖', '✏️', '📝', '🎓'];

function FloatingParticle({ emoji, style }: { emoji: string; style: React.CSSProperties }) {
  return (
    <div
      className="absolute pointer-events-none select-none"
      style={{
        fontSize: '1.4rem',
        opacity: 0,
        animation: `drift ${style.animationDuration || '12s'} linear ${style.animationDelay || '0s'} infinite`,
        ...style,
      }}
    >
      {emoji}
    </div>
  );
}

export default function HeroSection({ categories }: HeroSectionProps) {
  const [search, setSearch] = useState('');
  const [focused, setFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [particles] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      emoji: BOOK_EMOJIS[i % BOOK_EMOJIS.length],
      left: `${(i * 8.5) % 100}%`,
      animationDuration: `${10 + (i * 3.7) % 10}s`,
      animationDelay: `${(i * 2.1) % 8}s`,
    }))
  );
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = search.trim();
    router.push(`/books${q ? `?q=${encodeURIComponent(q)}` : ''}`);
  }

  return (
    <section className="relative pt-28 pb-16 overflow-hidden bg-white border-b border-gray-100">
      {/* ── Background layers ── */}
      {/* Radial glow spots */}
      <div className="absolute inset-0 hero-bg-pattern pointer-events-none" />

      {/* Lignes de cahier / parchemin */}
      <div className="absolute inset-0 lines-pattern opacity-100 pointer-events-none" />

      {/* Grid dots subtils */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#128C7E 1.2px, transparent 1.2px)', backgroundSize: '28px 28px' }}
      />

      {/* Livre ouvert décoratif - droite */}
      {mounted && (
        <>
          <div
            className="absolute right-4 top-20 text-[7rem] pointer-events-none hidden lg:block"
            style={{ animation: 'float-book 7s ease-in-out infinite', filter: 'drop-shadow(0 8px 24px rgba(37,211,102,0.25))' }}
          >
            📖
          </div>
          <div
            className="absolute left-6 bottom-16 text-[5rem] pointer-events-none hidden lg:block"
            style={{ animation: 'float-book 9s ease-in-out infinite 2s', filter: 'drop-shadow(0 4px 16px rgba(124,58,237,0.2))' }}
          >
            📚
          </div>
          <div
            className="absolute right-24 bottom-10 text-[3rem] pointer-events-none hidden xl:block"
            style={{ animation: 'float-book 5s ease-in-out infinite 1s' }}
          >
            🎓
          </div>
        </>
      )}

      {/* Particules de livres flottantes */}
      {mounted && particles.map((p, i) => (
        <FloatingParticle
          key={i}
          emoji={p.emoji}
          style={{ left: p.left, bottom: '-2rem', animationDuration: p.animationDuration, animationDelay: p.animationDelay }}
        />
      ))}

      {/* ── Content ── */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">

        {/* Badge de confiance */}
        <div
          className="inline-flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 rounded-full px-4 py-1.5 mb-8 shadow-sm animate-slide-in"
          style={{ animationFillMode: 'both' }}
        >
          <ShieldCheck size={14} className="text-green-600 animate-pulse-soft" />
          <span className="text-xs font-semibold tracking-wide">Livraison instantanée sur WhatsApp · Paiement sécurisé</span>
        </div>

        {/* Titre principal */}
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-5 max-w-3xl animate-slide-up"
          style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
        >
          Votre{' '}
          <span className="relative inline-block">
            <span className="text-gradient">Bibliothèque</span>
            {/* Soulignement animé */}
            <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" preserveAspectRatio="none">
              <path d="M0,3 Q50,6 100,3 Q150,0 200,3" stroke="#25D366" strokeWidth="2.5" fill="none" strokeLinecap="round"
                style={{ strokeDasharray: 220, strokeDashoffset: 220, animation: 'typewriter 1s ease-out 0.8s forwards' }} />
            </svg>
          </span>
          {' '}Numérique
        </h1>

        <p
          className="text-gray-500 text-base md:text-lg mb-10 max-w-xl leading-relaxed animate-fade-in"
          style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
        >
          Accédez à des centaines de livres PDF sur l&apos;agriculture, l&apos;élevage et le développement personnel — livrés directement sur WhatsApp.
        </p>

        {/* Barre de recherche premium */}
        <form
          onSubmit={handleSearch}
          className="w-full max-w-xl mb-8 animate-slide-up"
          style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
        >
          <div
            className={`flex items-center bg-white rounded-2xl overflow-hidden border-2 transition-all duration-300 shadow-md search-glow ${
              focused ? 'border-[#25D366] shadow-lg' : 'border-gray-200'
            }`}
          >
            <Search
              size={18}
              className={`ml-4 shrink-0 transition-colors duration-200 ${focused ? 'text-[#25D366]' : 'text-gray-400'}`}
            />
            <input
              ref={inputRef}
              type="text"
              placeholder="Titre, auteur, catégorie… (fautes tolérées)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="flex-1 bg-transparent px-3 py-3.5 text-gray-900 placeholder-gray-400 outline-none text-sm"
            />
            <button
              type="submit"
              className="bg-[#25D366] hover:bg-[#128C7E] text-white px-5 py-3 text-sm font-bold transition-all m-1.5 rounded-xl shrink-0 flex items-center gap-1.5 active:scale-95"
            >
              <Search size={14} />
              Chercher
            </button>
          </div>
        </form>

        {/* Boutons d'action */}
        <div
          className="flex flex-wrap items-center justify-center gap-3 mb-10 animate-fade-in"
          style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
        >
          <Link
            href="/books"
            className="group bg-[#111b21] hover:bg-gray-800 text-white px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-sm hover:shadow-md active:scale-95"
          >
            <BookOpen size={16} className="group-hover:animate-page-turn" />
            Voir le catalogue
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/about"
            className="group bg-white hover:bg-green-50 text-gray-700 hover:text-green-700 border border-gray-200 hover:border-green-300 px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-sm"
          >
            <Sparkles size={14} className="text-[#25D366]" />
            Comment ça marche
          </Link>
        </div>

        {/* Catégories populaires */}
        {categories.length > 0 && (
          <div
            className="flex flex-wrap justify-center items-center gap-2 animate-fade-in"
            style={{ animationDelay: '0.6s', animationFillMode: 'both' }}
          >
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-1">Populaire :</span>
            {categories.slice(0, 5).map((cat, i) => (
              <Link
                key={cat}
                href={`/books?category=${encodeURIComponent(cat)}`}
                className="text-xs px-3 py-1.5 bg-white text-gray-600 hover:bg-green-50 hover:text-green-700 hover:border-green-300 rounded-lg border border-gray-200 transition-all font-medium shadow-sm hover:shadow"
                style={{ animationDelay: `${0.7 + i * 0.1}s` }}
              >
                {cat}
              </Link>
            ))}
          </div>
        )}

        {/* Stats */}
        <div
          className="mt-12 flex items-center gap-8 text-center animate-fade-in"
          style={{ animationDelay: '0.8s', animationFillMode: 'both' }}
        >
          {[
            { value: '500+', label: 'Livres PDF' },
            { value: '24h', label: 'Livraison WhatsApp' },
            { value: '100%', label: 'Sécurisé' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-2xl font-extrabold text-gray-900">{stat.value}</span>
              <span className="text-xs text-gray-500 font-medium">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
