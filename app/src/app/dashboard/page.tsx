'use client';

import { useState, useEffect } from 'react';
import { BookOpen, ShoppingBag, Clock, CheckCircle, XCircle, Send, TrendingUp } from 'lucide-react';

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

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const key = getAdminKey();
      const res = await fetch('/api/dashboard', {
        headers: { 'x-admin-key': key },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
      setLoading(false);
    }
    load();
  }, []);

  const statCards = stats
    ? [
        { label: 'Livres', value: stats.totalBooks, icon: BookOpen, color: '#7c3aed', bg: 'rgba(124,58,237,0.15)' },
        { label: 'Commandes total', value: stats.totalOrders, icon: ShoppingBag, color: '#06b6d4', bg: 'rgba(6,182,212,0.15)' },
        { label: 'En attente', value: stats.pendingOrders, icon: Clock, color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
        { label: 'Envoyées', value: stats.sentOrders, icon: Send, color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
        { label: 'Annulées', value: stats.cancelledOrders, icon: XCircle, color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
        {
          label: 'Revenus',
          value: `${stats.totalRevenue.toLocaleString()} F`,
          icon: TrendingUp,
          color: '#a78bfa',
          bg: 'rgba(167,139,250,0.15)',
        },
      ]
    : [];

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-emerald-950">Tableau de bord</h1>
        <p className="text-emerald-800 text-sm mt-1">Vue d'ensemble de votre librairie</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="stat-card shimmer h-28" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {statCards.map((card, i) => (
              <div key={i} className="stat-card">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-emerald-800 uppercase tracking-wider mb-1">{card.label}</p>
                    <p className="text-2xl font-bold text-emerald-950">{card.value}</p>
                  </div>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: card.bg }}
                  >
                    <card.icon size={18} style={{ color: card.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent orders */}
          <div className="glass rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-purple-500/10">
              <h2 className="font-semibold text-emerald-950">Commandes récentes</h2>
            </div>
            <div className="overflow-x-auto">
              {stats?.recentOrders?.length === 0 ? (
                <div className="p-8 text-center text-emerald-800">Aucune commande pour l'instant</div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left px-6 py-3 text-xs font-medium text-emerald-800 uppercase">Client</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-emerald-800 uppercase">Total</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-emerald-800 uppercase">Statut</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-emerald-800 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.recentOrders?.map((order: any) => (
                      <tr key={order.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                        <td className="px-6 py-3">
                          <p className="text-emerald-950 font-medium">{order.customer_name}</p>
                          <p className="text-emerald-600 text-xs">{order.customer_phone}</p>
                        </td>
                        <td className="px-6 py-3 text-emerald-950 font-medium">
                          {order.total?.toLocaleString()} FCFA
                        </td>
                        <td className="px-6 py-3">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-6 py-3 text-emerald-800 text-xs">
                          {new Date(order.created_at).toLocaleDateString('fr-FR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; class: string }> = {
    pending: { label: 'En attente', class: 'badge-gold' },
    verified: { label: 'Vérifié', class: 'badge-cyan' },
    sent: { label: 'Envoyé', class: 'badge-green' },
    cancelled: { label: 'Annulé', class: 'badge-red' },
  };
  const item = map[status] || { label: status, class: 'badge-purple' };
  return <span className={`badge ${item.class}`}>{item.label}</span>;
}
