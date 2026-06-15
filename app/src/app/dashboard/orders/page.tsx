'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, CheckCircle, XCircle, Clock, Send, Eye, RefreshCw } from 'lucide-react';

function getAdminKey() {
  if (typeof window === 'undefined') return '';
  return sessionStorage.getItem('admin_key') || '';
}

type OrderStatus = 'pending' | 'verified' | 'sent' | 'cancelled';

function StatusBadge({ status }: { status: OrderStatus }) {
  const map: Record<OrderStatus, { label: string; cls: string }> = {
    pending: { label: '⏳ En attente', cls: 'badge-gold' },
    verified: { label: '✅ Vérifié', cls: 'badge-cyan' },
    sent: { label: '📤 Envoyé', cls: 'badge-green' },
    cancelled: { label: '❌ Annulé', cls: 'badge-red' },
  };
  const item = map[status];
  return <span className={`badge ${item.cls}`}>{item.label}</span>;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  async function loadOrders() {
    setLoading(true);
    const key = getAdminKey();
    const res = await fetch('/api/orders', { headers: { 'x-admin-key': key } });
    if (res.ok) {
      const data = await res.json();
      setOrders(data.orders || []);
    }
    setLoading(false);
  }

  useEffect(() => { loadOrders(); }, []);

  async function updateStatus(orderId: string, status: OrderStatus) {
    setActionLoading(orderId + status);
    const key = getAdminKey();
    await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': key },
      body: JSON.stringify({ status }),
    });
    await loadOrders();
    setActionLoading(null);
  }

  async function sendOrder(orderId: string) {
    setActionLoading(orderId + 'send');
    const key = getAdminKey();
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'POST',
      headers: { 'x-admin-key': key },
    });
    if (res.ok) {
      const data = await res.json();
      // Open WhatsApp link automatically
      window.open(data.whatsAppLink, '_blank');
    }
    await loadOrders();
    setActionLoading(null);
  }

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Commandes</h1>
          <p className="text-gray-600 text-sm mt-1">{orders.length} commande{orders.length > 1 ? 's' : ''} total</p>
        </div>
        <button
          onClick={loadOrders}
          className="btn-ghost flex items-center gap-2 text-sm"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Actualiser
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'pending', 'verified', 'sent', 'cancelled'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`badge py-1.5 px-3 text-xs cursor-pointer transition-all ${
              filter === f ? 'badge-purple' : 'text-green-600 border border-gray-700 hover:border-purple-500/50'
            }`}
          >
            {f === 'all' ? 'Toutes' : f === 'pending' ? 'En attente' : f === 'verified' ? 'Vérifiées' : f === 'sent' ? 'Envoyées' : 'Annulées'}
            {f !== 'all' && (
              <span className="ml-1 opacity-60">
                ({orders.filter((o) => o.status === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white shadow-sm border border-gray-100 rounded-2xl h-24 shimmer" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">📦</p>
          <p className="text-gray-600">Aucune commande dans cette catégorie</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <div key={order.id} className="bg-white shadow-sm border border-gray-100 rounded-2xl p-5">
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <StatusBadge status={order.status} />
                    <span className="text-xs text-green-600">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className="text-xs text-green-600">
                      {new Date(order.created_at).toLocaleDateString('fr-FR', {
                        day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-green-600">Client</p>
                      <p className="text-gray-900 font-medium text-sm">{order.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-green-600">WhatsApp</p>
                      <p className="text-gray-900 text-sm">{order.customer_phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-green-600">Total</p>
                      <p className="text-gray-900 font-bold">{order.total?.toLocaleString()} FCFA</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="flex flex-wrap gap-2">
                    {order.items?.map((item: any, i: number) => (
                      <span key={i} className="badge badge-purple text-xs">
                        {item.book_title} x{item.quantity}
                      </span>
                    ))}
                  </div>

                  {order.notes && (
                    <p className="text-xs text-gray-600 mt-2 italic">Note: {order.notes}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 shrink-0">
                  {order.status === 'pending' && (
                    <button
                      onClick={() => updateStatus(order.id, 'verified')}
                      disabled={actionLoading === order.id + 'verified'}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/20 text-blue-500 border border-cyan-500/30 hover:bg-cyan-500/30 transition-all disabled:opacity-50"
                    >
                      <CheckCircle size={12} />
                      Vérifier
                    </button>
                  )}
                  {(order.status === 'pending' || order.status === 'verified') && (
                    <button
                      onClick={() => sendOrder(order.id)}
                      disabled={actionLoading === order.id + 'send'}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whatsapp-btn text-gray-900 transition-all disabled:opacity-50"
                    >
                      <MessageCircle size={12} />
                      Envoyer WA
                    </button>
                  )}
                  {order.status !== 'cancelled' && order.status !== 'sent' && (
                    <button
                      onClick={() => updateStatus(order.id, 'cancelled')}
                      disabled={actionLoading === order.id + 'cancelled'}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all disabled:opacity-50"
                    >
                      <XCircle size={12} />
                      Annuler
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
