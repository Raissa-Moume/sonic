import { supabase } from '@/lib/supabase';
import HeroSection from '@/components/HeroSection';
import BookCard from '@/components/BookCard';
import { Book } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowRight, Zap, Shield, BookOpen, Users } from 'lucide-react';

export const revalidate = 60;

async function getFeaturedBooks(): Promise<Book[]> {
  const { data } = await supabase
    .from('books')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(6);
  return data || [];
}

async function getCategories(): Promise<string[]> {
  const { data } = await supabase.from('books').select('category').order('category');
  if (!data) return [];
  return [...new Set(data.map((b) => b.category))];
}

async function getTotalBooks(): Promise<number> {
  const { count } = await supabase.from('books').select('*', { count: 'exact', head: true });
  return count || 0;
}

export default async function HomePage() {
  const [featuredBooks, categories, totalBooks] = await Promise.all([
    getFeaturedBooks(),
    getCategories(),
    getTotalBooks(),
  ]);

  const features = [
    {
      icon: Zap,
      title: 'Livraison instantanée',
      desc: 'Recevez vos livres PDF directement sur WhatsApp en quelques minutes après validation de votre paiement.',
      color: '#f59e0b',
      emoji: '⚡',
    },
    {
      icon: Shield,
      title: 'Paiement sécurisé',
      desc: 'Vos transactions sont vérifiées manuellement. Aucun risque de fraude, satisfaction garantie.',
      color: '#10b981',
      emoji: '🔒',
    },
    {
      icon: BookOpen,
      title: 'Large catalogue',
      desc: `${totalBooks > 0 ? totalBooks + '+' : 'Des'} livres sur l'agriculture, l'élevage et le développement personnel.`,
      color: '#7c3aed',
      emoji: '📚',
    },
    {
      icon: Users,
      title: 'Communauté active',
      desc: 'Des milliers d\'étudiants camerounais font confiance à Sonic Books pour leurs études.',
      color: '#06b6d4',
      emoji: '🎓',
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero */}
      <HeroSection categories={categories} />

      {/* ── Features ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-12">
          <p className="text-[#25D366] text-sm font-bold uppercase tracking-widest mb-2">Pourquoi nous choisir</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            La bibliothèque numérique{' '}
            <span className="gradient-text">la plus simple</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className="feature-card bg-white border border-gray-100 rounded-2xl p-6 group animate-slide-up"
              style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'both' }}
            >
              <div className="text-4xl mb-4 group-hover:animate-float inline-block">{f.emoji}</div>
              <h3 className="font-bold text-gray-900 mb-2 text-base">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Livres populaires ── */}
      {featuredBooks.length > 0 && (
        <section className="bg-gradient-to-br from-gray-50 to-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[#25D366] text-sm font-bold uppercase tracking-widest mb-1">⭐ Sélection</p>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Livres populaires</h2>
                <p className="text-gray-500 mt-2 text-sm">Les plus demandés par nos lecteurs</p>
              </div>
              <Link
                href="/books"
                className="group hidden sm:flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#25D366] transition-colors"
              >
                Voir tout le catalogue
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {featuredBooks.map((book, i) => (
                <BookCard key={book.id} book={book} index={i} />
              ))}
            </div>
            <div className="text-center mt-8 sm:hidden">
              <Link href="/books" className="btn-ghost">
                Voir tout le catalogue <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Catégories ── */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-10">
            <p className="text-[#25D366] text-sm font-bold uppercase tracking-widest mb-2">Explorer</p>
            <h2 className="text-3xl font-extrabold text-gray-900">Parcourir par catégorie</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat, i) => (
              <Link
                key={cat}
                href={`/books?category=${encodeURIComponent(cat)}`}
                className="group flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 hover:border-[#25D366] hover:bg-green-50 rounded-2xl text-sm font-semibold text-gray-700 hover:text-[#128C7E] transition-all shadow-sm hover:shadow-md animate-slide-up"
                style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'both' }}
              >
                <BookOpen size={15} className="text-gray-400 group-hover:text-[#25D366] transition-colors" />
                {cat}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── CTA Banner ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div
          className="relative rounded-3xl overflow-hidden p-12 text-center"
          style={{
            background: 'linear-gradient(135deg, #064e3b 0%, #065f46 40%, #047857 70%, #059669 100%)',
          }}
        >
          {/* Décoration */}
          <div className="absolute top-4 left-8 text-6xl opacity-20 animate-float">📚</div>
          <div className="absolute bottom-4 right-8 text-5xl opacity-20" style={{ animation: 'float-book 7s ease-in-out infinite 1.5s' }}>📖</div>
          <div className="absolute top-8 right-20 text-3xl opacity-10" style={{ animation: 'float-book 5s ease-in-out infinite 0.5s' }}>🎓</div>

          <div className="relative z-10">
            <p className="text-green-300 text-sm font-bold uppercase tracking-widest mb-3">Rejoignez-nous</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Prêt à apprendre plus vite ? 🚀
            </h2>
            <p className="text-green-100 mb-8 max-w-xl mx-auto text-sm leading-relaxed">
              Rejoignez des milliers d&apos;étudiants camerounais qui font confiance à Sonic Books pour leurs études et leur réussite.
            </p>
            <Link
              href="/books"
              className="inline-flex items-center gap-2 bg-white text-[#065f46] hover:bg-green-50 px-8 py-3.5 rounded-2xl text-sm font-extrabold transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              Explorer le catalogue <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
