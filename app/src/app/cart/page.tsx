'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import OrderForm from '@/components/OrderForm';

export default function CartPage() {
  const { state, dispatch, itemCount } = useCart();
  const [showOrder, setShowOrder] = useState(false);

  if (itemCount === 0) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="text-7xl mb-6">🛒</div>
          <h1 className="text-2xl font-bold text-white mb-3">Votre panier est vide</h1>
          <p className="text-gray-400 mb-8">Parcourez notre catalogue et ajoutez des livres à votre panier.</p>
          <Link href="/books" className="btn-primary inline-flex items-center gap-2">
            <ShoppingBag size={16} />
            Explorer le catalogue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/books" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors mb-4">
            <ArrowLeft size={14} />
            Continuer mes achats
          </Link>
          <h1 className="text-3xl font-bold text-white">Votre panier</h1>
          <p className="text-gray-400 mt-1">{itemCount} article{itemCount > 1 ? 's' : ''}</p>
        </div>

        {showOrder ? (
          <OrderForm onBack={() => setShowOrder(false)} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              {state.items.map(({ book, quantity }) => (
                <div key={book.id} className="glass rounded-2xl p-4 flex gap-4 items-start">
                  <div className="relative w-16 h-20 rounded-xl overflow-hidden shrink-0">
                    <Image
                      src={book.cover_image || '/placeholder-book.jpg'}
                      alt={book.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-0.5">{book.category}</p>
                    <h3 className="font-semibold text-white text-sm line-clamp-2 mb-1">
                      {book.title}
                    </h3>
                    <p className="text-xs text-gray-400">{book.author}</p>
                  </div>
                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <p className="font-bold gradient-text">
                      {(book.price * quantity).toLocaleString()} FCFA
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => dispatch({ type: 'UPDATE_QUANTITY', bookId: book.id, quantity: quantity - 1 })}
                        className="w-7 h-7 rounded-lg glass flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-medium text-white w-4 text-center">{quantity}</span>
                      <button
                        onClick={() => dispatch({ type: 'UPDATE_QUANTITY', bookId: book.id, quantity: quantity + 1 })}
                        className="w-7 h-7 rounded-lg glass flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() => dispatch({ type: 'REMOVE_ITEM', bookId: book.id })}
                        className="w-7 h-7 rounded-lg glass flex items-center justify-center text-red-400 hover:text-red-300 transition-colors ml-1"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="glass rounded-2xl p-6 sticky top-24">
                <h2 className="font-semibold text-white mb-6">Résumé</h2>
                
                <div className="space-y-3 mb-6">
                  {state.items.map(({ book, quantity }) => (
                    <div key={book.id} className="flex justify-between text-sm">
                      <span className="text-gray-400 truncate flex-1 mr-2">{book.title}</span>
                      <span className="text-white shrink-0">{(book.price * quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="divider mb-6" />

                <div className="flex justify-between mb-6">
                  <span className="font-semibold text-white">Total</span>
                  <span className="text-2xl font-bold gradient-text">{state.total.toLocaleString()} FCFA</span>
                </div>

                <button
                  onClick={() => setShowOrder(true)}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  Commander maintenant <ArrowRight size={16} />
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  📱 Vous recevrez vos PDFs sur WhatsApp
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
