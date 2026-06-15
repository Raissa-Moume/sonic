'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Loader2, CheckCircle } from 'lucide-react';
import Image from 'next/image';

function getAdminKey() {
  if (typeof window === 'undefined') return '';
  return sessionStorage.getItem('admin_key') || '';
}

export default function AddBookPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [coverPreview, setCoverPreview] = useState('');
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  const [form, setForm] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    category: '',
    cover_image: '',
    pdf_url: '',
    stock: '999',
    featured: false,
  });

  const categories = [
    'Agriculture', 'Élevage', 'Psychologie & Cerveau', 'Développement Personnel',
    'Business & Finance', 'Santé & Bien-être', 'Technologie', 'Scolaire', 'Romans', 'Divers'
  ];

  async function uploadFile(file: File, resourceType: string) {
    const key = getAdminKey();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'sonic-books');
    formData.append('resource_type', resourceType);

    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'x-admin-key': key },
      body: formData,
    });

    if (!res.ok) throw new Error('Erreur upload');
    return res.json();
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const data = await uploadFile(file, 'image');
      setForm((prev) => ({ ...prev, cover_image: data.url }));
      setCoverPreview(data.url);
    } catch {
      setError('Erreur upload image');
    } finally {
      setUploadingCover(false);
    }
  }

  async function handlePdfUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPdf(true);
    try {
      const data = await uploadFile(file, 'raw');
      setForm((prev) => ({ ...prev, pdf_url: data.url }));
    } catch {
      setError('Erreur upload PDF');
    } finally {
      setUploadingPdf(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const key = getAdminKey();
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': key },
        body: JSON.stringify({
          ...form,
          price: parseInt(form.price),
          stock: parseInt(form.stock),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      setSuccess(true);
      setTimeout(() => router.push('/dashboard/books'), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="p-6 md:p-8 flex flex-col items-center justify-center min-h-64">
        <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mb-4">
          <CheckCircle size={32} className="text-green-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Livre ajouté !</h2>
        <p className="text-gray-400 text-sm">Redirection vers la liste...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Ajouter un livre</h1>
        <p className="text-gray-400 text-sm mt-1">Remplissez tous les champs requis</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Titre *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Mathématiques Terminale C"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Auteur *</label>
            <input
              type="text"
              required
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              placeholder="Nom de l'auteur"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Catégorie *</label>
            <select
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="input-field"
            >
              <option value="">Choisir...</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Prix (FCFA) *</label>
            <input
              type="number"
              required
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="2000"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Stock</label>
            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description du livre..."
            className="input-field resize-none"
          />
        </div>

        {/* Cover upload */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Image de couverture</label>
          <div className="flex items-start gap-4">
            {coverPreview && (
              <div className="relative w-20 h-28 rounded-xl overflow-hidden shrink-0">
                <Image src={coverPreview} alt="Cover" fill className="object-cover" />
              </div>
            )}
            <div className="flex-1">
              <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-purple-500/30 rounded-xl cursor-pointer hover:border-purple-500/60 transition-colors">
                {uploadingCover ? (
                  <Loader2 size={20} className="animate-spin text-purple-400" />
                ) : (
                  <>
                    <Upload size={20} className="text-gray-400 mb-1" />
                    <span className="text-xs text-gray-400">Cliquer pour uploader (JPG, PNG)</span>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
              </label>
              <p className="text-xs text-gray-500 mt-1">Ou coller un URL direct :</p>
              <input
                type="url"
                value={form.cover_image}
                onChange={(e) => { setForm({ ...form, cover_image: e.target.value }); setCoverPreview(e.target.value); }}
                placeholder="https://..."
                className="input-field mt-1 text-xs"
              />
            </div>
          </div>
        </div>

        {/* PDF upload */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Fichier PDF *</label>
          <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-purple-500/30 rounded-xl cursor-pointer hover:border-purple-500/60 transition-colors">
            {uploadingPdf ? (
              <Loader2 size={20} className="animate-spin text-purple-400" />
            ) : form.pdf_url ? (
              <>
                <CheckCircle size={20} className="text-green-400 mb-1" />
                <span className="text-xs text-green-400">PDF uploadé ✓</span>
              </>
            ) : (
              <>
                <Upload size={20} className="text-gray-400 mb-1" />
                <span className="text-xs text-gray-400">Cliquer pour uploader le PDF</span>
              </>
            )}
            <input type="file" accept=".pdf" onChange={handlePdfUpload} className="hidden" />
          </label>
          <p className="text-xs text-gray-500 mt-1">Ou coller l'URL Google Drive (lien de partage direct) :</p>
          <input
            type="url"
            value={form.pdf_url}
            onChange={(e) => setForm({ ...form, pdf_url: e.target.value })}
            placeholder="https://drive.google.com/..."
            className="input-field mt-1 text-xs"
          />
        </div>

        {/* Featured */}
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 h-5 rounded-full bg-gray-700 peer-checked:bg-purple-600 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-5"></div>
          </label>
          <span className="text-sm text-gray-300">Marquer comme livre populaire</span>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.push('/dashboard/books')}
            className="btn-ghost flex-1"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading || uploadingCover || uploadingPdf}
            className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            {loading ? 'Enregistrement...' : 'Ajouter le livre'}
          </button>
        </div>
      </form>
    </div>
  );
}
