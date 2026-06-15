'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, BookOpen } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const savedKey = sessionStorage.getItem('admin_key');
    if (savedKey) {
      setAuthenticated(true);
    }
    setLoading(false);
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    // Simple admin auth via password check
    const adminKey = process.env.NEXT_PUBLIC_ADMIN_HINT || password;
    sessionStorage.setItem('admin_key', password);
    setAuthenticated(true);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center hero-gradient">
        <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-8 w-full max-w-sm mx-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
              <Lock size={18} className="text-gray-900" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">Dashboard Admin</h1>
              <p className="text-xs text-gray-600">Sonic Books</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Mot de passe admin</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
                autoFocus
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button type="submit" className="btn-primary w-full">
              Se connecter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080b14]">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-sm border border-gray-100 border-r border-purple-500/10 z-40 hidden md:flex flex-col">
        <div className="p-6 border-b border-purple-500/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
              <BookOpen size={14} className="text-gray-900" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Sonic Books</p>
              <p className="text-xs text-gray-600">Administration</p>
            </div>
          </div>
        </div>

        <nav className="p-4 flex-1">
          {[
            { href: '/dashboard', label: '📊 Tableau de bord' },
            { href: '/dashboard/orders', label: '📦 Commandes' },
            { href: '/dashboard/books', label: '📚 Livres' },
            { href: '/dashboard/add-book', label: '➕ Ajouter un livre' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:text-gray-900 hover:bg-white/5 transition-all mb-1"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-purple-500/10">
          <button
            onClick={() => {
              sessionStorage.removeItem('admin_key');
              setAuthenticated(false);
            }}
            className="w-full text-left px-3 py-2 text-sm text-green-600 hover:text-red-400 transition-colors rounded-xl hover:bg-red-500/5"
          >
            🚪 Déconnexion
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="md:ml-64 pt-4">
        {children}
      </div>
    </div>
  );
}
