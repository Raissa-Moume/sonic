'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Eye, Star, Zap } from 'lucide-react';
import { Book } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

interface BookCardProps {
  book: Book;
  index?: number;
}

export default function BookCard({ book, index = 0 }: BookCardProps) {
  const { dispatch } = useCart();
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: 'ADD_ITEM', book });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div
      className="book-card bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col h-full animate-slide-up"
      style={{ animationDelay: `${index * 0.07}s`, animationFillMode: 'both' }}
    >
      {/* Cover */}
      <div className="book-spine relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {!imgError && book.cover_image ? (
          <Image
            src={book.cover_image}
            alt={book.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
            onError={() => setImgError(true)}
          />
        ) : (
          /* Fallback cover généré en CSS */
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center"
            style={{
              background: `linear-gradient(135deg, ${COVER_COLORS[index % COVER_COLORS.length].from}, ${COVER_COLORS[index % COVER_COLORS.length].to})`,
            }}
          >
            <div className="text-5xl mb-2">📖</div>
            <p className="text-white text-xs font-bold leading-tight line-clamp-3">{book.title}</p>
            <p className="text-white/70 text-[10px] mt-1">{book.author}</p>
          </div>
        )}

        {/* Overlay hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-10">
          {book.featured ? (
            <span className="glass text-yellow-600 border border-yellow-200/50 text-[9px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
              <Star size={9} fill="currentColor" /> Populaire
            </span>
          ) : <span />}
          <span className="glass text-[#128C7E] border border-green-200/50 text-[9px] font-bold px-2 py-1 rounded-lg shadow-sm truncate max-w-[70px]">
            {book.category}
          </span>
        </div>

        {/* Quick view - apparaît au hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <Link
            href={`/books/${book.id}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-gray-900 bg-white/95 shadow-lg hover:bg-white transition-all transform translate-y-3 group-hover:translate-y-0 duration-300 hover:scale-105"
          >
            <Eye size={15} /> Voir le livre
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5 flex flex-col flex-1">
        <p className="text-[10px] font-bold text-[#128C7E] mb-1 uppercase tracking-wider truncate">{book.author}</p>
        <h3 className="font-bold text-gray-900 text-sm leading-tight mb-2 flex-1 line-clamp-2 group-hover:text-[#25D366] transition-colors duration-200">
          {book.title}
        </h3>

        <div className="mt-auto">
          <div className="flex items-baseline mb-2.5">
            <span className="text-xl font-extrabold text-gray-900">{book.price.toLocaleString()}</span>
            <span className="text-[11px] font-semibold text-gray-400 ml-1">FCFA</span>
          </div>

          <button
            onClick={handleAdd}
            disabled={book.stock === 0}
            className={`w-full flex justify-center items-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 ${
              book.stock === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : added
                ? 'bg-green-50 border border-green-200 text-[#25D366]'
                : 'bg-[#25D366] hover:bg-[#128C7E] text-white shadow-sm hover:shadow-md'
            }`}
          >
            {book.stock === 0 ? (
              'Rupture de stock'
            ) : added ? (
              <>✓ Ajouté au panier</>
            ) : (
              <><ShoppingCart size={13} /> Ajouter au panier</>
            )}
          </button>

          {book.stock > 0 && book.stock <= 5 && (
            <p className="text-[10px] font-semibold text-orange-500 text-center mt-1.5 flex items-center justify-center gap-1">
              <Zap size={10} /> Plus que {book.stock} exemplaire{book.stock > 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const COVER_COLORS = [
  { from: '#667eea', to: '#764ba2' },
  { from: '#11998e', to: '#38ef7d' },
  { from: '#f093fb', to: '#f5576c' },
  { from: '#4facfe', to: '#00f2fe' },
  { from: '#43e97b', to: '#38f9d7' },
  { from: '#fa709a', to: '#fee140' },
  { from: '#a18cd1', to: '#fbc2eb' },
  { from: '#fad0c4', to: '#ffd1ff' },
];
