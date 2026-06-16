'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Loader2, CheckCircle, BookOpen, ArrowLeft, Image as ImageIcon, FileText } from 'lucide-react';
import Image from 'next/image';

function getAdminKey() {
  if (typeof window === 'undefined') return '';
  return sessionStorage.getItem('admin_key') || '';
}

const CATEGORIES = [
  'Agriculture', 'Élevage', 'Psychologie & Cerveau', 'Développement Personnel',
  'Business & Finance', 'Santé & Bien-être', 'Technologie', 'Scolaire', 'Romans', 'Divers',
];

export default function AddBookPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [coverPreview, setCoverPreview] = useState('');
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  const [form, setForm] = useState({
    title: '', author: '', description: '', price: '',
    category: '', cover_image: '', pdf_url: '', stock: '999', featured: false,
  });

  const set = (key: string, val: any) => setForm(p => ({ ...p, [key]: val }));

  async function uploadFile(file: File, resourceType: string) {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', 'sonic-books');
    fd.append('resource_type', resourceType);
    const res = await fetch('/api/upload', { method: 'POST', headers: { 'x-admin-key': getAdminKey() }, body: fd });
    if (!res.ok) throw new Error('Erreur upload');
    return res.json();
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setUploadingCover(true);
    try {
      const data = await uploadFile(file, 'image');
      set('cover_image', data.url); setCoverPreview(data.url);
    } catch { setError('Erreur upload image.'); }
    finally { setUploadingCover(false); }
  }

  async function handlePdfUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setUploadingPdf(true);
    try {
      const data = await uploadFile(file, 'raw');
      set('pdf_url', data.url);
    } catch { setError('Erreur upload PDF.'); }
    finally { setUploadingPdf(false); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.author || !form.price || !form.category) {
      setError('Veuillez remplir tous les champs requis (*).');
      return;
    }
    if (!form.pdf_url) { setError('Veuillez uploader ou coller le lien du PDF.'); return; }
    setLoading(true); setError('');
    try {
      const key = getAdminKey();
      if (!key) { setError('Clé admin manquante.'); return; }
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': key },
        body: JSON.stringify({ ...form, price: parseInt(form.price), stock: parseInt(form.stock) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur serveur');
      setSuccess(true);
      setTimeout(() => router.push('/dashboard/books'), 2000);
    } catch (err: any) { setError(err.message || 'Erreur serveur'); }
    finally { setLoading(false); }
  }

  if (success) {
    return (
      <div className="p-6 md:p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center animate-book-open">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={40} className="text-[#25D366]" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Livre ajouté ! 🎉</h2>
          <p className="text-gray-500 text-sm">Redirection vers le catalogue…</p>
        </div>
      </div>
    );
  }

  const progress = [form.title, form.author, form.price, form.category, form.pdf_url].filter(Boolean).length;

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <button onClick={() => router.push('/dashboard/books')}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4 transition-colors group">
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Retour aux livres
        </button>
        <p className="text-[#25D366] text-xs font-bold uppercase tracking-widest mb-1">Nouveau</p>
        <h1 className="text-2xl font-extrabold text-gray-900">Ajouter un livre</h1>

        {/* Progress indicator */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
            <span className="font-semibold">Progression du formulaire</span>
            <span className="font-bold text-[#25D366]">{progress}/5 champs</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#25D366] to-[#128C7E] rounded-full transition-all duration-500"
              style={{ width: `${(progress / 5) * 100}%` }} />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section: Informations */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <BookOpen size={15} className="text-[#25D366]" /> Informations du livre
          </h2>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Titre *</label>
            <input type="text" required value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="ex: Mathématiques Terminale C"
              className="input-field" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Auteur *</label>
              <input type="text" required value={form.author}
                onChange={e => set('author', e.target.value)}
                placeholder="Nom de l'auteur" className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Catégorie *</label>
              <select required value={form.category} onChange={e => set('category', e.target.value)} className="input-field">
                <option value="">Choisir…</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Prix (FCFA) *</label>
              <input type="number" required min="0" value={form.price}
                onChange={e => set('price', e.target.value)}
                placeholder="2000" className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Stock</label>
              <input type="number" min="0" value={form.stock}
                onChange={e => set('stock', e.target.value)}
                className="input-field" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Description</label>
            <textarea rows={3} value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Décrivez le contenu du livre…"
              className="input-field resize-none" />
          </div>

          {/* Featured toggle */}
          <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-100 rounded-xl">
            <div>
              <p className="text-sm font-bold text-amber-800">⭐ Livre populaire</p>
              <p className="text-xs text-amber-600 mt-0.5">Apparaît en vedette sur la page d'accueil</p>
            </div>
            <button type="button" onClick={() => set('featured', !form.featured)}
              className={`relative w-12 h-6 rounded-full transition-all duration-300 ${form.featured ? 'bg-[#25D366]' : 'bg-gray-300'}`}>
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${form.featured ? 'translate-x-6' : ''}`} />
            </button>
          </div>
        </div>

        {/* Section: Couverture */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <ImageIcon size={15} className="text-[#25D366]" /> Image de couverture
          </h2>

          <div className="flex items-start gap-4">
            {coverPreview && (
              <div className="relative w-20 h-28 rounded-xl overflow-hidden shrink-0 border border-gray-200 shadow-sm">
                <Image src={coverPreview} alt="Aperçu" fill className="object-cover" />
              </div>
            )}
            <div className="flex-1 space-y-3">
              <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#25D366] hover:bg-green-50 transition-all group">
                {uploadingCover ? (
                  <Loader2 size={22} className="animate-spin text-[#25D366]" />
                ) : (
                  <>
                    <Upload size={20} className="text-gray-400 group-hover:text-[#25D366] mb-1.5 transition-colors" />
                    <span className="text-xs font-semibold text-gray-500 group-hover:text-[#25D366]">Cliquer pour uploader (JPG, PNG)</span>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
              </label>
              <div>
                <p className="text-xs text-gray-500 mb-1 font-medium">Ou coller un URL direct :</p>
                <input type="url" value={form.cover_image}
                  onChange={e => { set('cover_image', e.target.value); setCoverPreview(e.target.value); }}
                  placeholder="https://…" className="input-field text-xs" />
              </div>
            </div>
          </div>
        </div>

        {/* Section: PDF */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <FileText size={15} className="text-[#25D366]" /> Fichier PDF *
          </h2>

          <label className={`flex flex-col items-center justify-center h-28 border-2 border-dashed rounded-xl cursor-pointer transition-all group ${
            form.pdf_url ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-[#25D366] hover:bg-green-50'
          }`}>
            {uploadingPdf ? (
              <Loader2 size={24} className="animate-spin text-[#25D366]" />
            ) : form.pdf_url ? (
              <>
                <CheckCircle size={28} className="text-[#25D366] mb-2" />
                <span className="text-sm font-bold text-green-700">PDF chargé avec succès ✓</span>
                <span className="text-xs text-green-600 mt-0.5">Cliquer pour remplacer</span>
              </>
            ) : (
              <>
                <Upload size={24} className="text-gray-400 group-hover:text-[#25D366] mb-2 transition-colors" />
                <span className="text-sm font-semibold text-gray-600 group-hover:text-[#25D366]">Cliquer pour uploader le PDF</span>
                <span className="text-xs text-gray-400 mt-0.5">Format .pdf uniquement</span>
              </>
            )}
            <input type="file" accept=".pdf" onChange={handlePdfUpload} className="hidden" />
          </label>

          <div>
            <p className="text-xs text-gray-500 mb-1.5 font-medium">Ou coller un lien Google Drive / URL direct :</p>
            <input type="url" value={form.pdf_url}
              onChange={e => set('pdf_url', e.target.value)}
              placeholder="https://drive.google.com/…"
              className="input-field text-xs" />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700 flex items-start gap-2">
            <span className="text-base">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pb-8">
          <button type="button" onClick={() => router.push('/dashboard/books')}
            className="flex-1 py-3 rounded-2xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">
            Annuler
          </button>
          <button type="submit" disabled={loading || uploadingCover || uploadingPdf}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-extrabold bg-[#25D366] hover:bg-[#128C7E] text-white transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <BookOpen size={16} />}
            {loading ? 'Enregistrement…' : 'Publier le livre'}
          </button>
        </div>
      </form>
    </div>
  );
}
