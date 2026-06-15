'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, MessageCircle, ArrowRight } from 'lucide-react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id') || '';

  return (
    <div className="min-h-screen pt-24 pb-20 flex flex-col items-center justify-center hero-gradient">
      <div className="max-w-lg mx-auto px-4 text-center">
        {/* Success icon */}
        <div className="relative mx-auto w-24 h-24 mb-8">
          <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
          <div className="relative w-24 h-24 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
            <CheckCircle size={44} className="text-emerald-600" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-emerald-950 mb-4">
          Commande confirmée ! 🎉
        </h1>

        <p className="text-emerald-800 text-lg mb-2">
          Merci pour votre commande.
        </p>

        {orderId && (
          <p className="text-pink-500 font-medium mb-6">
            N° {orderId.slice(0, 8).toUpperCase()}
          </p>
        )}

        <div className="glass rounded-2xl p-6 mb-8 text-left">
          <h2 className="font-semibold text-emerald-950 mb-4">Que se passe-t-il maintenant ?</h2>
          {[
            { emoji: '📋', step: 'Votre commande est enregistrée dans notre système.' },
            { emoji: '🔍', step: 'Nous vérifions votre paiement sous peu.' },
            { emoji: '📱', step: 'Vous recevez vos livres PDF directement sur WhatsApp.' },
            { emoji: '📚', step: 'Bonne lecture et bon succès dans vos études !' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
              <span className="text-xl shrink-0">{item.emoji}</span>
              <p className="text-emerald-700 text-sm leading-relaxed">{item.step}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-ghost flex items-center justify-center gap-2">
            Retour à l&apos;accueil
          </Link>
          <Link href="/books" className="btn-primary flex items-center justify-center gap-2">
            Continuer mes achats <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
