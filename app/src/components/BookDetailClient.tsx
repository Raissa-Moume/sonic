'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, ArrowLeft, Star, BookOpen } from 'lucide-react';
import { Book } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import BookCard from './BookCard';

interface BookDetailClientProps {
  book: Book;
  related: Book[];
}

export default function BookDetailClient({ book, related }: BookDetailClientProps) {
  const { dispatch } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    dispatch({ type: 'ADD_ITEM', book });
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  }

  return (
    <div>
      <Link href="/books" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm mb-8 transition-colors">
        <ArrowLeft size={14} />
        Retour au catalogue
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        {/* Cover */}
        <div className="relative">
          <div className="relative h-[500px] rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100 glow-purple">
            <Image
              src={book.cover_image || '/placeholder-book.jpg'}
              alt={book.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          {book.featured && (
            <div className="absolute top-4 left-4">
              <span className="badge badge-gold flex items-center gap-1">
                <Star size={10} fill="currentColor" />
                Populaire
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          <span className="badge badge-purple w-fit mb-4">{book.category}</span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
            {book.title}
          </h1>
          <p className="text-gray-600 mb-6">par <span className="text-green-600">{book.author}</span></p>

          <p className="text-gray-500 leading-relaxed mb-8">{book.description}</p>

          {/* Price */}
          <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-600 text-sm mb-1">Prix</p>
                <span className="text-4xl font-bold gradient-text">{book.price.toLocaleString()}</span>
                <span className="text-gray-600 ml-2">FCFA</span>
              </div>
              <div className="text-right">
                <p className="text-gray-600 text-xs mb-1">Disponibilité</p>
                {book.stock > 0 ? (
                  <span className="badge badge-green">En stock</span>
                ) : (
                  <span className="badge badge-red">Rupture</span>
                )}
              </div>
            </div>

            <button
              onClick={handleAdd}
              disabled={book.stock === 0}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-gray-900 transition-all duration-300 ${
                added
                  ? 'bg-green-500/20 border border-green-500/40 text-green-600'
                  : book.stock === 0
                  ? 'opacity-50 cursor-not-allowed bg-white'
                  : 'btn-primary'
              }`}
            >
              <ShoppingCart size={18} />
              {added ? '✓ Ajouté au panier !' : 'Ajouter au panier'}
            </button>
          </div>

          {/* How it works */}
          <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
              Comment recevoir ce livre ?
            </p>
            {[
              '1. Ajoutez au panier et commandez',
              '2. Nous vérifions votre paiement',
              '3. Recevez le PDF sur WhatsApp 📱',
            ].map((step) => (
              <p key={step} className="text-sm text-gray-500 mb-1">{step}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Related books */}
      {related.length > 0 && (
        <div>
          <div className="divider mb-10" />
          <h2 className="text-xl font-bold text-gray-900 mb-6">Livres similaires</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
