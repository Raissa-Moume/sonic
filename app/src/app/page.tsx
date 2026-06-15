import { supabase } from '@/lib/supabase';
import HeroSection from '@/components/HeroSection';
import BookCard from '@/components/BookCard';
import { Book } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowRight, Zap, Shield, BookOpen } from 'lucide-react';

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
  const { data } = await supabase
    .from('books')
    .select('category')
    .order('category');
  if (!data) return [];
  const unique = [...new Set(data.map((b) => b.category))];
  return unique;
}

export default async function HomePage() {
  const [featuredBooks, categories] = await Promise.all([
    getFeaturedBooks(),
    getCategories(),
  ]);

  const features = [
    {
      icon: Zap,
      title: 'Livraison instantanée',
      desc: 'Recevez vos livres PDF directement sur WhatsApp après validation.',
      color: '#f59e0b',
    },
    {
      icon: Shield,
      title: 'Paiement sécurisé',
      desc: 'Vos transactions sont sécurisées et vérifiées manuellement.',
      color: '#10b981',
    },
    {
      icon: BookOpen,
      title: 'Large catalogue',
      desc: 'Des centaines de livres scolaires pour tous les niveaux.',
      color: '#7c3aed',
    },
  ];

  return (
    <div className="hero-gradient">
      {/* Hero */}
      <HeroSection categories={categories} />

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="glass rounded-2xl p-6 group hover:border-purple-500/40 transition-all duration-300">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${f.color}20`, border: `1px solid ${f.color}30` }}
              >
                <f.icon size={22} style={{ color: f.color }} />
              </div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Books */}
      {featuredBooks.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-purple-400 text-sm font-medium mb-1">⭐ Sélection</p>
              <h2 className="text-3xl font-bold text-white">Livres populaires</h2>
            </div>
            <Link href="/books" className="btn-ghost flex items-center gap-2 text-sm">
              Voir tout <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="divider mb-12" />
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Parcourir par catégorie
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/books?category=${encodeURIComponent(cat)}`}
                className="btn-ghost text-sm"
              >
                {cat}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="relative glass rounded-3xl overflow-hidden p-10 text-center glow-purple">
          <div className="absolute inset-0 dot-grid opacity-30" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Prêt à apprendre plus vite ? 🚀
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Rejoignez des milliers d&apos;étudiants camerounais qui font confiance à Sonic Books pour leurs études.
            </p>
            <Link href="/books" className="btn-primary inline-flex items-center gap-2">
              Explorer le catalogue <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
