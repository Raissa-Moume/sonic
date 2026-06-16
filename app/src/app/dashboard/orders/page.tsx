'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, CheckCircle, XCircle, Send, RefreshCw, Search, Filter } from 'lucide-react';

function getAdminKey() {
  if (typeof window === 'undefined') return '';
  return sessionStorage.getItem('admin_key') || '';
}

type OrderStatus = 'pending' | 'verified' | 'sent' | 'cancelled';

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; dot: string }> = {
  pending:   { label: 'En attente', color: '#d97706', bg: 'rgba(245,158,11,0.1)',   dot: '#f59e0b' },
  verified:  { label: 'Vérifié',    color: '#0891b2', bg: 'rgba(6,182,212,0.1)',    dot: '#06b6d4' },
  sent:      { label: 'Envoyé',     color: '#059669', bg: 'rgba(16,185,129,0.1)',   dot: '#10b981' },
  cancelled: { label: 'Annulé',     color: '#dc2626', bg: 'rgba(239,68,68,0.1)',    dot: '#ef4444' },
};

const FILTERS = [
  { key: 'all', label: 'Toutes' },
  { key: 'pending', label: 'En attente' },
  { key: 'verified', label: 'Vérifiées' },
  { key: 'sent', label: 'Envoyées' },
  { key: 'cancelled', label: 'Annulées' },
];

function StatusPill({ status }: { status: OrderStatus }) {
  const s = STATUS_CONFIG[status] || { label: status, color: '#6b7280', bg: 'rgba(107,114,128,0.1)', dot: '#9ca3af' };
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: s.bg, color: s.color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
      {s.label}
    </span>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function loadOrders(silent = false) {
    if (!silent) setLoading(true);
    setError('');
    const key = getAdminKey();
    if (!key) { setError('Clé admin manquante.'); setLoading(false); return; }
    try {
      const res = await fetch('/api/orders', { headers: { 'x-admin-key': key } });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Erreur chargement'); return; }
      setOrders(data.orders || []);
    } catch { setError('Erreur réseau.'); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadOrders(); }, []);

  async function updateStatus(orderId: string, status: OrderStatus) {
    setActionLoading(orderId + status);
    const key = getAdminKey();
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': key },
        body: JSON.stringify({ status }),
      });
    } finally { await loadOrders(true); setActionLoading(null); }
  }

  async function sendOrder(orderId: string) {
    setActionLoading(orderId + 'send');
    const key = getAdminKey();
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: 'POST', headers: { 'x-admin-key': key } });
      if (res.ok) {
        const data = await res.json();
        if (data.whatsAppLink) window.open(data.whatsAppLink, '_blank');
      }
    } finally { await loadOrders(true); setActionLoading(null); }
  }

  const filtered = orders
    .filter(o => filter === 'all' || o.status === filter)
    .filter(o => !search || o.customer_name?.toLowerCase().includes(search.toLowerCase()) || o.customer_phone?.includes(search));

  const counts: Record<string, number> = { all: orders.length };
  for (const o of orders) counts[o.status] = (counts[o.status] || 0) + 1;

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[#25D366] text-xs font-bold uppercase tracking-widest mb-1">Gestion</p>
          <h1 className="text-2xl font-extrabold text-gray-900">Commandes</h1>
          <p className="text-gray-500 text-sm mt-1">{orders.length} commande{orders.length > 1 ? 's' : ''} au total</p>
        </div>
        <button onClick={() => loadOrders()} disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-gray-300 transition-all shadow-sm">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Actualiser
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700 mb-6 flex items-center gap-2">
          ⚠️ {error}
        </div>
      )}

      {/* Filter tabs + Search */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-6 shadow-sm space-y-3">
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === f.key
                  ? 'bg-[#25D366] text-white shadow-sm'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}>
              {f.label}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${filter === f.key ? 'bg-white/30 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {counts[f.key] || 0}
              </span>
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom ou téléphone…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/10 transition-all"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-32 rounded-2xl shimmer" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-100 rounded-2xl">
          <div className="text-5xl mb-3">📦</div>
          <p className="text-gray-500 font-medium">Aucune commande trouvée</p>
          {search && <button onClick={() => setSearch('')} className="mt-3 text-sm text-[#25D366] hover:text-[#128C7E] font-semibold">Effacer la recherche</button>}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => (
            <div key={order.id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-gray-200 hover:shadow-sm transition-all animate-slide-up">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <StatusPill status={order.status as OrderStatus} />
                    <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(order.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    <div className="bg-gray-50 rounded-xl p-2.5">
                      <p className="text-[10px] text-gray-500 font-semibold uppercase mb-0.5">Client</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{order.customer_name}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-2.5">
                      <p className="text-[10px] text-gray-500 font-semibold uppercase mb-0.5">WhatsApp</p>
                      <p className="text-sm text-[#25D366] font-semibold">{order.customer_phone}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-2.5">
                      <p className="text-[10px] text-gray-500 font-semibold uppercase mb-0.5">Total</p>
                      <p className="text-sm font-extrabold text-gray-900">{order.total?.toLocaleString()} <span className="font-normal text-gray-400 text-xs">FCFA</span></p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-2.5">
                      <p className="text-[10px] text-gray-500 font-semibold uppercase mb-0.5">Articles</p>
                      <p className="text-sm font-bold text-gray-900">{order.items?.length || 0} livre{(order.items?.length || 0) > 1 ? 's' : ''}</p>
                    </div>
                  </div>

                  {order.items?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {order.items.map((item: any, i: number) => (
                        <span key={i} className="text-xs px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-lg font-medium">
                          {item.book_title} ×{item.quantity}
                        </span>
                      ))}
                    </div>
                  )}

                  {order.notes && (
                    <p className="text-xs text-gray-500 mt-2 italic bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                      📝 {order.notes}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-wrap md:flex-col md:items-stretch shrink-0 md:min-w-[120px]">
                  {order.status === 'pending' && (
                    <button onClick={() => updateStatus(order.id, 'verified')}
                      disabled={actionLoading === order.id + 'verified'}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-cyan-50 text-cyan-700 border border-cyan-200 hover:bg-cyan-100 transition-all disabled:opacity-50">
                      <CheckCircle size={13} /> Vérifier
                    </button>
                  )}
                  {(order.status === 'pending' || order.status === 'verified') && (
                    <button onClick={() => sendOrder(order.id)}
                      disabled={actionLoading === order.id + 'send'}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#25D366] text-white hover:bg-[#128C7E] transition-all disabled:opacity-50 shadow-sm">
                      <MessageCircle size={13} /> WhatsApp
                    </button>
                  )}
                  {order.status !== 'cancelled' && order.status !== 'sent' && (
                    <button onClick={() => updateStatus(order.id, 'cancelled')}
                      disabled={actionLoading === order.id + 'cancelled'}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition-all disabled:opacity-50">
                      <XCircle size={13} /> Annuler
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
