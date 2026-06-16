'use client';

import { useState, useEffect } from 'react';
import { BookOpen, ShoppingBag, Clock, XCircle, Send, TrendingUp, ArrowUpRight, RefreshCw } from 'lucide-react';

interface Stats {
  totalBooks: number;
  totalOrders: number;
  pendingOrders: number;
  verifiedOrders: number;
  sentOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  recentOrders: any[];
}

function getAdminKey() {
  if (typeof window === 'undefined') return '';
  return sessionStorage.getItem('admin_key') || '';
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  pending:   { label: 'En attente', color: '#d97706', bg: 'rgba(245,158,11,0.1)',   dot: '#f59e0b' },
  verified:  { label: 'Vérifié',    color: '#0891b2', bg: 'rgba(6,182,212,0.1)',    dot: '#06b6d4' },
  sent:      { label: 'Envoyé',     color: '#059669', bg: 'rgba(16,185,129,0.1)',   dot: '#10b981' },
  cancelled: { label: 'Annulé',     color: '#dc2626', bg: 'rgba(239,68,68,0.1)',    dot: '#ef4444' },
};

function StatusPill({ status }: { status: string }) {
  const s = STATUS_MAP[status] || { label: status, color: '#6b7280', bg: 'rgba(107,114,128,0.1)', dot: '#9ca3af' };
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: s.bg, color: s.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.dot }} />
      {s.label}
    </span>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  async function load(silent = false) {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError('');
    const key = getAdminKey();
    if (!key) {
      setError('Clé admin manquante. Veuillez vous reconnecter.');
      setLoading(false);
      setRefreshing(false);
      return;
    }
    try {
      const res = await fetch('/api/dashboard', { headers: { 'x-admin-key': key } });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Erreur chargement'); return; }
      setStats(data.stats);
    } catch {
      setError('Erreur réseau. Réessayez.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { load(); }, []);

  const statCards = stats ? [
    { label: 'Livres en catalogue',  value: stats.totalBooks,       icon: BookOpen,   color: '#7c3aed', bg: 'rgba(124,58,237,0.08)',  border: 'rgba(124,58,237,0.15)', trend: null },
    { label: 'Commandes totales',    value: stats.totalOrders,      icon: ShoppingBag,color: '#06b6d4', bg: 'rgba(6,182,212,0.08)',    border: 'rgba(6,182,212,0.15)',  trend: null },
    { label: 'En attente',           value: stats.pendingOrders,    icon: Clock,      color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',   border: 'rgba(245,158,11,0.15)', trend: stats.pendingOrders > 0 ? 'warn' : null },
    { label: 'Envoyées',             value: stats.sentOrders,       icon: Send,       color: '#10b981', bg: 'rgba(16,185,129,0.08)',   border: 'rgba(16,185,129,0.15)', trend: null },
    { label: 'Annulées',             value: stats.cancelledOrders,  icon: XCircle,    color: '#ef4444', bg: 'rgba(239,68,68,0.08)',    border: 'rgba(239,68,68,0.15)',  trend: null },
    { label: 'Revenus générés',      value: `${stats.totalRevenue.toLocaleString()} FCFA`, icon: TrendingUp, color: '#25D366', bg: 'rgba(37,211,102,0.08)', border: 'rgba(37,211,102,0.2)', trend: 'up' },
  ] : [];

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[#25D366] text-xs font-bold uppercase tracking-widest mb-1">Vue d'ensemble</p>
          <h1 className="text-2xl font-extrabold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-500 text-sm mt-1">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button
          onClick={() => load(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 rounded-xl text-sm font-semibold transition-all shadow-sm"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          Actualiser
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700 mb-6 flex items-center gap-2">
          <span className="text-lg">⚠️</span> {error}
        </div>
      )}

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl shimmer" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {statCards.map((card, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 animate-slide-up"
              style={{ borderColor: card.border, animationDelay: `${i * 0.06}s`, animationFillMode: 'both' }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">{card.label}</p>
                  <p className="text-2xl font-extrabold text-gray-900">{card.value}</p>
                  {card.trend === 'warn' && (
                    <p className="text-xs text-amber-600 font-medium mt-1">● À traiter</p>
                  )}
                  {card.trend === 'up' && (
                    <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
                      <ArrowUpRight size={11} /> Ce mois
                    </p>
                  )}
                </div>
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ml-3"
                  style={{ background: card.bg }}
                >
                  <card.icon size={20} style={{ color: card.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Orders */}
      {!loading && stats && (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-900">Commandes récentes</h2>
              <p className="text-xs text-gray-500 mt-0.5">Les 10 dernières commandes</p>
            </div>
            <a
              href="/dashboard/orders"
              className="text-xs font-semibold text-[#25D366] hover:text-[#128C7E] flex items-center gap-1 transition-colors"
            >
              Voir toutes <ArrowUpRight size={12} />
            </a>
          </div>

          {!stats.recentOrders?.length ? (
            <div className="p-12 text-center">
              <div className="text-4xl mb-3">📦</div>
              <p className="text-gray-500 text-sm">Aucune commande pour l'instant</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {stats.recentOrders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-900">{order.customer_name}</p>
                        <p className="text-xs text-[#25D366] mt-0.5">{order.customer_phone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-gray-900">{order.total?.toLocaleString()}</span>
                        <span className="text-xs text-gray-400 ml-1">FCFA</span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusPill status={order.status} />
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
