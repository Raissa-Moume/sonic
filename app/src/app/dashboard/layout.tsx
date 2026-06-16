'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Lock, BookOpen, LayoutDashboard, ShoppingBag, Library, PlusCircle, LogOut, BookMarked, Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/dashboard/orders', label: 'Commandes', icon: ShoppingBag },
  { href: '/dashboard/books', label: 'Mes livres', icon: Library },
  { href: '/dashboard/add-book', label: 'Ajouter un livre', icon: PlusCircle },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const savedKey = sessionStorage.getItem('admin_key');
    if (savedKey) setAuthenticated(true);
    setLoading(false);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Mot de passe invalide'); return; }
      sessionStorage.setItem('admin_key', password);
      setAuthenticated(true);
    } catch {
      setError('Erreur de connexion. Réessayez.');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="text-5xl animate-float">📖</div>
          <div className="w-8 h-8 border-2 border-[#25D366] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 lines-pattern opacity-50 pointer-events-none" />
        <div className="absolute top-10 left-10 text-6xl animate-float pointer-events-none opacity-30">📚</div>
        <div className="absolute bottom-10 right-10 text-5xl pointer-events-none opacity-20" style={{ animation: 'float-book 8s ease-in-out infinite 1s' }}>📖</div>

        <div className="relative bg-white shadow-xl border border-gray-100 rounded-3xl p-8 w-full max-w-sm mx-4 animate-book-open">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
              style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}>
              <BookMarked size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-gray-900 text-lg">Sonic Books</h1>
              <p className="text-xs text-gray-500">Espace Administration</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-6">
            <Lock size={13} className="text-amber-600 shrink-0" />
            <p className="text-xs text-amber-700 font-medium">Accès réservé aux administrateurs</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mot de passe admin</label>
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
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                ⚠️ {error}
              </div>
            )}
            <button type="submit" className="btn-primary w-full py-3 text-base rounded-xl">
              Accéder au tableau de bord
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex">
      {/* ── Mobile Header ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 z-30 flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#25D366] to-[#128C7E]">
            <BookOpen size={14} className="text-white" />
          </div>
          <div>
            <p className="font-extrabold text-gray-900 text-sm leading-none">Sonic Books</p>
            <p className="text-[10px] text-gray-500 mt-0.5 font-medium">Administration</p>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 -mr-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ── Sidebar ── */}
      <aside className={`fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100 z-40 flex flex-col shadow-sm transition-transform duration-300 md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo (Desktop) */}
        <div className="p-6 border-b border-gray-100 hidden md:block">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
              style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
            >
              <BookOpen size={16} className="text-white" />
            </div>
            <div>
              <p className="font-extrabold text-gray-900 text-sm leading-none">Sonic Books</p>
              <p className="text-[10px] text-gray-500 mt-0.5 font-medium">Administration</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1 space-y-1 overflow-y-auto mt-16 md:mt-0">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <a
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#25D366]/10 text-[#128C7E] border border-[#25D366]/20'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon
                  size={17}
                  className={`shrink-0 transition-colors ${isActive ? 'text-[#25D366]' : 'text-gray-400 group-hover:text-gray-600'}`}
                />
                {label}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#25D366]" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Déconnexion */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => { sessionStorage.removeItem('admin_key'); setAuthenticated(false); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all rounded-xl group"
          >
            <LogOut size={16} className="text-gray-400 group-hover:text-red-500 transition-colors" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-30 md:hidden transition-opacity" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* ── Contenu principal ── */}
      <main className="flex-1 min-w-0 md:ml-64 pt-16 md:pt-0 bg-gray-50">
        {children}
      </main>
    </div>
  );
}
