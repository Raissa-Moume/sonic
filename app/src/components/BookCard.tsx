'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Eye, Star } from 'lucide-react';
import { Book } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const { dispatch } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    dispatch({ type: 'ADD_ITEM', book });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="book-card glass rounded-2xl overflow-hidden group">
      {/* Cover */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={book.cover_image || '/placeholder-book.jpg'}
          alt={book.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1629] via-transparent to-transparent" />
        {book.featured && (
          <div className="absolute top-3 left-3">
            <span className="badge badge-gold flex items-center gap-1">
              <Star size={10} fill="currentColor" />
              Populaire
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className="badge badge-purple">{book.category}</span>
        </div>
        {/* Quick view overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link
            href={`/books/${book.id}`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-emerald-950 glass"
          >
            <Eye size={14} />
            Voir détails
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-emerald-600 mb-1 truncate">{book.author}</p>
        <h3 className="font-semibold text-emerald-950 line-clamp-2 text-sm leading-tight mb-3">
          {book.title}
        </h3>

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold gradient-text">
              {book.price.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-600 ml-1">FCFA</span>
          </div>
          <button
            onClick={handleAdd}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
              added
                ? 'bg-green-500/20 text-emerald-600 border border-green-500/30'
                : 'btn-primary'
            }`}
          >
            <ShoppingCart size={12} />
            {added ? 'Ajouté ✓' : 'Ajouter'}
          </button>
        </div>

        {/* Stock indicator */}
        {book.stock <= 5 && book.stock > 0 && (
          <p className="text-xs text-orange-500 mt-2">
            ⚡ Plus que {book.stock} disponible{book.stock > 1 ? 's' : ''}
          </p>
        )}
        {book.stock === 0 && (
          <p className="text-xs text-red-400 mt-2">Rupture de stock</p>
        )}
      </div>
    </div>
  );
}
