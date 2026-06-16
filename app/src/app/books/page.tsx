import { supabase } from '@/lib/supabase';
import { Book } from '@/lib/supabase';
import EnhancedBooksGrid from '@/components/EnhancedBooksGrid';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Catalogue — Sonic Books',
  description: 'Parcourez notre catalogue complet de livres scolaires PDF avec recherche intelligente tolérante aux fautes.',
};

export const revalidate = 60;

async function getBooks(category?: string): Promise<Book[]> {
  let query = supabase.from('books').select('*').order('created_at', { ascending: false });
  if (category) query = query.eq('category', category);
  const { data } = await query;
  return data || [];
}

async function getCategories(): Promise<string[]> {
  const { data } = await supabase.from('books').select('category');
  if (!data) return [];
  return [...new Set(data.map((b) => b.category))];
}

interface BooksPageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

export default async function BooksPage({ searchParams }: BooksPageProps) {
  const params = await searchParams;
  const [books, categories] = await Promise.all([
    getBooks(params.category),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gradient-to-br from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <p className="text-green-600 text-sm font-medium mb-1">📚 Catalogue</p>
          <h1 className="text-4xl font-bold text-gray-900">
            {params.category ? params.category : params.q ? `Résultats pour "${params.q}"` : 'Tous les livres'}
          </h1>
          <p className="text-gray-600 mt-2">
            {books.length} livre{books.length > 1 ? 's' : ''} disponible{books.length > 1 ? 's' : ''}
          </p>
        </div>

        <EnhancedBooksGrid books={books} categories={categories} currentCategory={params.category} currentSearch={params.q} />
      </div>
    </div>
  );
}
