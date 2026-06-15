'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { MessageCircle, ArrowLeft, Loader2 } from 'lucide-react';

interface OrderFormProps {
  onBack: () => void;
}

export default function OrderForm({ onBack }: OrderFormProps) {
  const { state, dispatch } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: form.name,
          customer_phone: form.phone,
          customer_email: form.email,
          notes: form.notes,
          items: state.items.map((i) => ({
            book_id: i.book.id,
            book_title: i.book.title,
            quantity: i.quantity,
            price: i.book.price,
            pdf_url: i.book.pdf_url,
          })),
          total: state.total,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur lors de la commande');
      }

      const data = await res.json();
      dispatch({ type: 'CLEAR_CART' });
      router.push(`/order-success?id=${data.orderId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-emerald-800 hover:text-emerald-950 text-sm transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        Retour au panier
      </button>

      <div className="glass rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
            <MessageCircle size={20} className="text-emerald-950" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-emerald-950">Finaliser la commande</h2>
            <p className="text-xs text-emerald-800">Vous recevrez vos livres sur WhatsApp</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-emerald-700 mb-1.5">
              Nom complet *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Jean Dupont"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-700 mb-1.5">
              Numéro WhatsApp * <span className="text-emerald-600 font-normal">(avec indicatif pays)</span>
            </label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+237 6XX XX XX XX"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-700 mb-1.5">
              Email <span className="text-emerald-600 font-normal">(optionnel)</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="jean@exemple.com"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-700 mb-1.5">
              Notes <span className="text-emerald-600 font-normal">(optionnel)</span>
            </label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Informations supplémentaires..."
              className="input-field resize-none"
            />
          </div>

          {/* Summary */}
          <div className="bg-black/20 rounded-xl p-4 border border-white/5">
            <p className="text-xs text-emerald-800 uppercase tracking-wider mb-3 font-semibold">Récapitulatif</p>
            {state.items.map(({ book, quantity }) => (
              <div key={book.id} className="flex justify-between text-sm mb-1">
                <span className="text-emerald-800 truncate mr-2">{book.title} x{quantity}</span>
                <span className="text-emerald-950 shrink-0">{(book.price * quantity).toLocaleString()} FCFA</span>
              </div>
            ))}
            <div className="divider mt-3 mb-3" />
            <div className="flex justify-between">
              <span className="font-semibold text-emerald-950">Total</span>
              <span className="font-bold gradient-text">{state.total.toLocaleString()} FCFA</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Traitement en cours...
              </>
            ) : (
              <>
                <MessageCircle size={16} />
                Confirmer la commande
              </>
            )}
          </button>

          <p className="text-xs text-emerald-600 text-center">
            Après confirmation, vous recevrez un message WhatsApp avec les instructions de paiement.
          </p>
        </form>
      </div>
    </div>
  );
}
