'use client';

import { Book } from '@/lib/supabase';
import { intelligentSearch } from '@/lib/search';
import BookCard from '@/components/BookCard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, X, BookOpen } from 'lucide-react';
import { useState, useMemo, useCallback, useRef } from 'react';

interface EnhancedBooksGridProps {
  books: Book[];
  categories: string[];
  currentCategory?: string;
  currentSearch?: string;
}

export default function EnhancedBooksGrid({
  books,
  categories,
  currentCategory,
  currentSearch,
}: EnhancedBooksGridProps) {
  const router = useRouter();
  const [search, setSearch] = useState(currentSearch || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Recherche fuzzy en temps réel avec tolérance aux fautes
  const filteredBooks = useMemo(() => {
    if (!search.trim()) return books;
    return intelligentSearch(books, search);
  }, [search, books]);

  // Suggestions auto-complète
  const suggestions = useMemo(() => {
    if (search.length < 2) return [];
    const seen = new Set<string>();
    const results: string[] = [];
    for (const book of filteredBooks.slice(0, 8)) {
      if (!seen.has(book.title)) { seen.add(book.title); results.push(book.title); }
      if (results.length >= 5) break;
    }
    return results;
  }, [search, filteredBooks]);

  const navigate = useCallback((q: string, cat?: string) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (cat) params.set('category', cat);
    router.push(`/books${params.size ? `?${params}` : ''}`);
  }, [router]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setShowSuggestions(false);
    navigate(search.trim(), currentCategory);
  }

  function handleSuggestionClick(s: string) {
    setSearch(s);
    setShowSuggestions(false);
    navigate(s, currentCategory);
  }

  function clearSearch() {
    setSearch('');
    setShowSuggestions(false);
    navigate('', currentCategory);
  }

  return (
    <div>
      {/* ── Filtres ── */}
      <div className="flex flex-col gap-4 mb-8">
        {/* Recherche */}
        <form onSubmit={handleSearch} className="relative">
          <div
            className={`flex items-center bg-white rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
              isFocused ? 'border-[#25D366] shadow-lg' : 'border-gray-200 shadow-sm'
            }`}
            style={isFocused ? { boxShadow: '0 0 0 4px rgba(37,211,102,0.12), 0 4px 20px rgba(37,211,102,0.15)' } : {}}
          >
            <Search
              size={17}
              className={`ml-4 shrink-0 transition-colors ${isFocused ? 'text-[#25D366]' : 'text-gray-400'}`}
            />
            <input
              ref={inputRef}
              type="text"
              placeholder="Rechercher par titre, auteur, catégorie… (fautes tolérées ✓)"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowSuggestions(e.target.value.length >= 2);
              }}
              onFocus={() => {
                setIsFocused(true);
                if (search.length >= 2) setShowSuggestions(true);
              }}
              onBlur={() => {
                setIsFocused(false);
                // Délai pour laisser le clic sur suggestion se déclencher
                setTimeout(() => setShowSuggestions(false), 200);
              }}
              className="flex-1 bg-transparent px-3 py-3.5 text-gray-900 placeholder-gray-400 outline-none text-sm"
            />
            {search && (
              <button
                type="button"
                onClick={clearSearch}
                className="mr-2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
              >
                <X size={15} />
              </button>
            )}
            <button
              type="submit"
              className="bg-[#25D366] hover:bg-[#128C7E] text-white px-5 py-3 text-sm font-bold transition-all m-1.5 rounded-xl shrink-0 flex items-center gap-1.5 active:scale-95"
            >
              <Search size={14} />
              Chercher
            </button>
          </div>

          {/* Dropdown de suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-slide-in"
            >
              <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                Suggestions
              </div>
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onMouseDown={() => handleSuggestionClick(s)}
                  className="w-full text-left px-4 py-3 hover:bg-green-50 flex items-center gap-3 text-sm text-gray-700 hover:text-green-700 transition-colors border-b border-gray-50 last:border-0"
                >
                  <Search size={13} className="text-gray-400 shrink-0" />
                  <span className="truncate">{s}</span>
                </button>
              ))}
            </div>
          )}
        </form>

        {/* Filtres par catégorie */}
        <div className="flex gap-2 flex-wrap items-center">
          <SlidersHorizontal size={15} className="text-gray-400 shrink-0" />
          <Link
            href="/books"
            className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all border ${
              !currentCategory
                ? 'bg-[#25D366] text-white border-transparent shadow-sm'
                : 'text-gray-600 border-gray-200 bg-white hover:border-[#25D366] hover:text-green-700'
            }`}
          >
            Tous
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/books?category=${encodeURIComponent(cat)}${search ? `&q=${encodeURIComponent(search)}` : ''}`}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all border whitespace-nowrap ${
                currentCategory === cat
                  ? 'bg-[#25D366] text-white border-transparent shadow-sm'
                  : 'text-gray-600 border-gray-200 bg-white hover:border-[#25D366] hover:text-green-700'
              }`}
              title={cat}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Résultats */}
      {search && (
        <div className="mb-6 flex items-center gap-2">
          <div className={`text-sm font-medium ${filteredBooks.length > 0 ? 'text-gray-600' : 'text-orange-600'}`}>
            {filteredBooks.length > 0
              ? `✓ ${filteredBooks.length} résultat${filteredBooks.length > 1 ? 's' : ''} pour "${search}"`
              : `Aucun résultat exact — essayons avec les mots approchants…`}
          </div>
          {filteredBooks.length > 0 && search !== currentSearch && (
            <span className="text-[10px] bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-semibold">
              Recherche intelligente ✓
            </span>
          )}
        </div>
      )}

      {/* Grid */}
      {books.length === 0 ? (
        <div className="text-center py-20 animate-fade-in">
          <div className="text-7xl mb-4 animate-float">📚</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Le catalogue est vide</h2>
          <p className="text-gray-500 text-sm">Les livres seront bientôt disponibles.</p>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="text-center py-20 animate-fade-in">
          <div className="text-7xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Aucun résultat trouvé</h2>
          <p className="text-gray-500 text-sm mb-6">
            Même avec la tolérance aux fautes, "{search}" ne correspond à aucun livre.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={clearSearch}
              className="btn-primary"
            >
              <BookOpen size={15} /> Voir tous les livres
            </button>
            {categories.slice(0, 3).map(cat => (
              <Link key={cat} href={`/books?category=${encodeURIComponent(cat)}`} className="btn-ghost text-sm">
                {cat}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredBooks.map((book, i) => (
            <BookCard key={book.id} book={book} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
