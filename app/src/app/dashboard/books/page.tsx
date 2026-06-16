'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Trash2, RefreshCw, Star, PlusCircle, BookOpen, Search } from 'lucide-react';
import Link from 'next/link';

function getAdminKey() {
  if (typeof window === 'undefined') return '';
  return sessionStorage.getItem('admin_key') || '';
}

const COVER_COLORS = [
  { from: '#667eea', to: '#764ba2' }, { from: '#11998e', to: '#38ef7d' },
  { from: '#f093fb', to: '#f5576c' }, { from: '#4facfe', to: '#00f2fe' },
  { from: '#43e97b', to: '#38f9d7' }, { from: '#fa709a', to: '#fee140' },
  { from: '#a18cd1', to: '#fbc2eb' }, { from: '#ffecd2', to: '#fcb69f' },
];

export default function BooksManagementPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  async function loadBooks(silent = false) {
    if (!silent) setLoading(true);
    setError('');
    const key = getAdminKey();
    if (!key) { setError('Clé admin manquante.'); setLoading(false); return; }
    try {
      const res = await fetch('/api/books', { headers: { 'x-admin-key': key } });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Erreur chargement'); return; }
      setBooks(data.books || []);
    } catch { setError('Erreur réseau.'); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadBooks(); }, []);

  async function deleteBook(id: string) {
    setDeleteLoading(id);
    setConfirmDelete(null);
    const key = getAdminKey();
    try {
      await fetch(`/api/books?id=${id}`, { method: 'DELETE', headers: { 'x-admin-key': key } });
    } finally { await loadBooks(true); setDeleteLoading(null); }
  }

  async function toggleFeatured(id: string, current: boolean) {
    const key = getAdminKey();
    try {
      await fetch('/api/books', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': key },
        body: JSON.stringify({ id, featured: !current }),
      });
    } finally { await loadBooks(true); }
  }

  const filtered = books.filter(b =>
    !search || b.title?.toLowerCase().includes(search.toLowerCase()) || b.author?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[#25D366] text-xs font-bold uppercase tracking-widest mb-1">Catalogue</p>
          <h1 className="text-2xl font-extrabold text-gray-900">Mes livres</h1>
          <p className="text-gray-500 text-sm mt-1">{books.length} livre{books.length > 1 ? 's' : ''} dans le catalogue</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => loadBooks()} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-gray-300 transition-all shadow-sm">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <Link href="/dashboard/add-book"
            className="flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl text-sm font-bold transition-all shadow-sm">
            <PlusCircle size={15} /> Ajouter
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700 mb-6">⚠️ {error}</div>
      )}

      {/* Search */}
      {books.length > 0 && (
        <div className="relative mb-6">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un livre par titre ou auteur…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/10 transition-all shadow-sm"
          />
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl animate-book-open">
            <div className="text-4xl text-center mb-4">⚠️</div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Supprimer ce livre ?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">Cette action est irréversible.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">
                Annuler
              </button>
              <button onClick={() => deleteBook(confirmDelete)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition-all">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => <div key={i} className="h-64 rounded-2xl shimmer" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-100 rounded-2xl">
          {books.length === 0 ? (
            <>
              <div className="text-6xl mb-4 animate-float">📚</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Aucun livre</h2>
              <p className="text-gray-500 text-sm mb-6">Commencez à alimenter votre catalogue.</p>
              <Link href="/dashboard/add-book" className="btn-primary inline-flex">
                <PlusCircle size={15} /> Ajouter le premier livre
              </Link>
            </>
          ) : (
            <>
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-gray-500">Aucun résultat pour "{search}"</p>
              <button onClick={() => setSearch('')} className="mt-3 text-sm text-[#25D366] font-semibold">Effacer</button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((book, idx) => (
            <div key={book.id}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden group hover:shadow-md hover:-translate-y-1 transition-all duration-300 animate-slide-up flex flex-col"
              style={{ animationDelay: `${idx * 0.05}s`, animationFillMode: 'both' }}>
              {/* Cover */}
              <div className="relative h-44 overflow-hidden">
                {book.cover_image ? (
                  <Image src={book.cover_image} alt={book.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center"
                    style={{ background: `linear-gradient(135deg, ${COVER_COLORS[idx % COVER_COLORS.length].from}, ${COVER_COLORS[idx % COVER_COLORS.length].to})` }}>
                    <BookOpen size={28} className="text-white/80 mb-2" />
                    <p className="text-white text-xs font-bold line-clamp-2 leading-tight">{book.title}</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {/* Featured badge */}
                {book.featured && (
                  <div className="absolute top-2 right-2 w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center shadow-sm">
                    <Star size={13} className="text-white" fill="white" />
                  </div>
                )}
                {/* Category */}
                <div className="absolute bottom-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-black/50 text-white backdrop-blur-sm">
                  {book.category}
                </div>
              </div>

              {/* Info */}
              <div className="p-3 flex flex-col flex-1">
                <p className="text-xs text-[#128C7E] font-semibold truncate mb-0.5">{book.author}</p>
                <h3 className="text-xs font-bold text-gray-900 line-clamp-2 leading-tight mb-2 flex-1">{book.title}</h3>
                <p className="text-sm font-extrabold text-gray-900 mb-3">{book.price?.toLocaleString()} <span className="text-[10px] font-normal text-gray-400">FCFA</span></p>

                {/* Actions */}
                <div className="flex gap-1.5">
                  <button onClick={() => toggleFeatured(book.id, book.featured)}
                    title={book.featured ? 'Retirer des populaires' : 'Marquer comme populaire'}
                    className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl text-[10px] font-bold transition-all border ${
                      book.featured
                        ? 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100'
                        : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-amber-200 hover:text-amber-600'
                    }`}>
                    <Star size={10} fill={book.featured ? 'currentColor' : 'none'} />
                    {book.featured ? 'Populaire' : 'Mettre en avant'}
                  </button>
                  <button onClick={() => setConfirmDelete(book.id)}
                    disabled={deleteLoading === book.id}
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 transition-all disabled:opacity-40">
                    <Trash2 size={12} />
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
