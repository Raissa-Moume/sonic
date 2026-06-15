'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Trash2, RefreshCw, Star, Package } from 'lucide-react';
import Link from 'next/link';

function getAdminKey() {
  if (typeof window === 'undefined') return '';
  return sessionStorage.getItem('admin_key') || '';
}

export default function BooksManagementPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  async function loadBooks() {
    setLoading(true);
    const key = getAdminKey();
    const res = await fetch('/api/books', { headers: { 'x-admin-key': key } });
    if (res.ok) {
      const data = await res.json();
      setBooks(data.books || []);
    }
    setLoading(false);
  }

  useEffect(() => { loadBooks(); }, []);

  async function deleteBook(id: string) {
    if (!confirm('Supprimer ce livre définitivement ?')) return;
    setDeleteLoading(id);
    const key = getAdminKey();
    await fetch(`/api/books?id=${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-key': key },
    });
    await loadBooks();
    setDeleteLoading(null);
  }

  async function toggleFeatured(id: string, current: boolean) {
    const key = getAdminKey();
    await fetch('/api/books', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': key },
      body: JSON.stringify({ id, featured: !current }),
    });
    await loadBooks();
  }

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gérer les livres</h1>
          <p className="text-gray-600 text-sm mt-1">{books.length} livre{books.length > 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={loadBooks} className="btn-ghost flex items-center gap-2 text-sm">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Actualiser
          </button>
          <Link href="/dashboard/add-book" className="btn-primary text-sm flex items-center gap-2">
            ➕ Ajouter
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white shadow-sm border border-gray-100 rounded-2xl h-60 shimmer" />
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">📚</p>
          <p className="text-gray-600 mb-4">Aucun livre pour l'instant</p>
          <Link href="/dashboard/add-book" className="btn-primary inline-flex items-center gap-2">
            Ajouter le premier livre
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {books.map((book) => (
            <div key={book.id} className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden group">
              <div className="relative h-44">
                {book.cover_image ? (
                  <Image
                    src={book.cover_image}
                    alt={book.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-green-50">
                    <Package size={32} className="text-green-600" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1629] via-transparent" />
                {book.featured && (
                  <div className="absolute top-2 right-2">
                    <Star size={14} className="text-orange-500" fill="currentColor" />
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-gray-900 font-semibold text-xs line-clamp-2 mb-1">{book.title}</p>
                <p className="text-gray-600 text-xs mb-2">{book.price?.toLocaleString()} FCFA</p>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => toggleFeatured(book.id, book.featured)}
                    className={`flex-1 text-xs py-1 rounded-lg transition-all ${
                      book.featured
                        ? 'bg-amber-500/20 text-orange-500 border border-amber-500/30'
                        : 'bg-white/5 text-green-600 hover:text-orange-500'
                    }`}
                  >
                    {book.featured ? '★ Pop.' : '☆ Pop.'}
                  </button>
                  <button
                    onClick={() => deleteBook(book.id)}
                    disabled={deleteLoading === book.id}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
