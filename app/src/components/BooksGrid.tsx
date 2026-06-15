'use client';

import { Book } from '@/lib/supabase';
import BookCard from '@/components/BookCard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Filter } from 'lucide-react';
import { useState } from 'react';

interface BooksGridProps {
  books: Book[];
  categories: string[];
  currentCategory?: string;
  currentSearch?: string;
}

export default function BooksGrid({ books, categories, currentCategory, currentSearch }: BooksGridProps) {
  const router = useRouter();
  const [search, setSearch] = useState(currentSearch || '');

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set('q', search.trim());
    if (currentCategory) params.set('category', currentCategory);
    router.push(`/books?${params.toString()}`);
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search */}
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Rechercher un livre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </form>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap">
          <Link
            href="/books"
            className={`badge py-1.5 px-3 text-xs cursor-pointer transition-all ${
              !currentCategory ? 'badge-purple' : 'text-gray-500 border border-gray-700 hover:border-purple-500/50'
            }`}
          >
            Tous
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/books?category=${encodeURIComponent(cat)}`}
              className={`badge py-1.5 px-3 text-xs cursor-pointer transition-all ${
                currentCategory === cat
                  ? 'badge-purple'
                  : 'text-gray-500 border border-gray-700 hover:border-purple-500/50 hover:text-gray-300'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Grid */}
      {books.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-xl font-semibold text-white mb-2">Aucun livre trouvé</h2>
          <p className="text-gray-400 text-sm">Essayez de modifier votre recherche</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
