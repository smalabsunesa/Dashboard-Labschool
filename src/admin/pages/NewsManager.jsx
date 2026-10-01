import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Save, Star, Image, AlertCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

const FALLBACK = [
  { id: 'update-1', title: 'PPDB T.A 2026/2027 Resmi Dibuka', caption: 'Pendaftaran gelombang pertama resmi dibuka!', hashtags: '#PPDB2026', tag: 'SPMB & BEASISWA', published_at: 'AUG 28, 2026', image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=400', is_spotlight: true },
  { id: 'update-2', title: 'Prestasi OSN 2026', caption: 'Medali emas untuk bidang Fisika dan Informatika.', hashtags: '#OSN2026', tag: 'PRESTASI', published_at: 'AUG 20, 2026', image_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=400', is_spotlight: true },
];

const EMPTY_FORM = { title: '', caption: '', hashtags: '', tag: '', published_at: '', image_url: '', is_spotlight: false };

function Badge({ spotlight }) {
  return spotlight ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.65rem] font-bold bg-amber-100 text-amber-700">
      <Star size={10} /> Spotlight
    </span>
  ) : (
    <span className="px-2 py-0.5 rounded-full text-[0.65rem] font-bold bg-slate-100 text-slate-500">Reguler</span>
  );
}

export default function NewsManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const useDemoMode = !isSupabaseConfigured || !supabase;

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  async function load() {
    setLoading(true);
    if (useDemoMode) { setItems(FALLBACK); setLoading(false); return; }
    const { data } = await supabase.from('smal_updates').select('*').order('id', { ascending: false });
    setItems(data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setModal('add'); };
  const openEdit = (item) => { setForm(item); setEditId(item.id); setModal('edit'); };
  const closeModal = () => { setModal(null); setForm(EMPTY_FORM); setEditId(null); };

  const handleChange = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  async function handleSave(e) {
    e.preventDefault();
    if (!form.title.trim()) { showToast('Judul harus diisi', 'error'); return; }
    setSaving(true);
    if (useDemoMode) {
      if (modal === 'add') setItems((p) => [{ ...form, id: `demo-${Date.now()}` }, ...p]);
      else setItems((p) => p.map((i) => (i.id === editId ? { ...form, id: editId } : i)));
      closeModal(); setSaving(false); showToast(modal === 'add' ? 'Berita ditambahkan (mode demo)' : 'Berita diperbarui (mode demo)');
      return;
    }
    const payload = { title: form.title, caption: form.caption, hashtags: form.hashtags, tag: form.tag, published_at: form.published_at, image_url: form.image_url, is_spotlight: form.is_spotlight };
    if (modal === 'add') await supabase.from('smal_updates').insert([payload]);
    else await supabase.from('smal_updates').update(payload).eq('id', editId);
    await load();
    closeModal(); setSaving(false); showToast(modal === 'add' ? 'Berita berhasil ditambahkan!' : 'Berita berhasil diperbarui!');
  }

  async function handleDelete(id) {
    if (!window.confirm('Hapus berita ini?')) return;
    if (useDemoMode) { setItems((p) => p.filter((i) => i.id !== id)); showToast('Dihapus (mode demo)'); return; }
    await supabase.from('smal_updates').delete().eq('id', id);
    await load(); showToast('Berita dihapus.');
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold text-white transition-all ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
          {toast.msg}
        </div>
      )}

      {useDemoMode && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
          <AlertCircle size={15} /> Mode Demo — Supabase belum terkonfigurasi. Data tidak disimpan ke database.
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Manajemen Berita</h2>
          <p className="text-xs text-slate-400">{items.length} artikel tersimpan</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#002B66] text-white text-xs font-bold shadow hover:bg-blue-900 transition-colors">
          <Plus size={15} /> Tambah Berita
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Memuat data...</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">Belum ada berita. Klik "Tambah Berita" untuk memulai.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                  <th className="px-4 py-3 text-left">Gambar</th>
                  <th className="px-4 py-3 text-left">Judul</th>
                  <th className="px-4 py-3 text-left">Tag</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Tanggal</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                        {item.image_url
                          ? <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center"><Image size={16} className="text-slate-300" /></div>
                        }
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900 line-clamp-1">{item.title}</p>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{item.caption}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-lg text-[0.65rem] font-bold bg-blue-50 text-blue-700">{item.tag || '—'}</span>
                    </td>
                    <td className="px-4 py-3"><Badge spotlight={item.is_spotlight} /></td>
                    <td className="px-4 py-3 text-xs text-slate-500">{item.published_at || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"><Pencil size={14} /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900">{modal === 'add' ? 'Tambah Berita Baru' : 'Edit Berita'}</h3>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {[
                { label: 'Judul Berita *', key: 'title', placeholder: 'Judul artikel berita...' },
                { label: 'Caption', key: 'caption', placeholder: 'Deskripsi singkat berita...' },
                { label: 'Hashtags', key: 'hashtags', placeholder: '#Tag1 #Tag2 ...' },
                { label: 'Tag/Kategori', key: 'tag', placeholder: 'Contoh: PRESTASI JUARA' },
                { label: 'URL Gambar', key: 'image_url', placeholder: 'https://...' },
                { label: 'Tanggal Terbit', key: 'published_at', placeholder: 'Contoh: SEP 01, 2026' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-bold text-slate-600 mb-1">{label}</label>
                  {key === 'caption' ? (
                    <textarea value={form[key]} onChange={handleChange(key)} placeholder={placeholder} rows={3} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                  ) : (
                    <input value={form[key]} onChange={handleChange(key)} placeholder={placeholder} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  )}
                </div>
              ))}
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.is_spotlight} onChange={handleChange('is_spotlight')} className="w-4 h-4 rounded accent-orange-500" />
                <span className="text-sm font-semibold text-slate-700">Tampilkan sebagai Spotlight (Slider Utama)</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">Batal</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-[#002B66] text-white text-sm font-bold hover:bg-blue-900 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors">
                  <Save size={14} /> {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
