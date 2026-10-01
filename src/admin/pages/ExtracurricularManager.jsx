import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Save, AlertCircle, Image } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

const FALLBACK = [
  { id: 'ex-1', name: 'Pramuka', category: 'Wajib', description: 'Ekstrakurikuler wajib untuk seluruh siswa.', image_url: 'https://images.unsplash.com/photo-1576135245831-7bcab06b4ff0?q=80&w=400' },
  { id: 'ex-2', name: 'Tari', category: 'Seni', description: 'Mengembangkan bakat seni tari tradisional.', image_url: 'https://images.unsplash.com/photo-1508700922718-d4567acfa2d0?q=80&w=400' },
  { id: 'ex-3', name: 'Basket', category: 'Olahraga', description: 'Tim basket SMA Labschool meraih juara nasional.', image_url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=400' },
];

const EMPTY_FORM = { name: '', category: '', description: '', image_url: '' };

export default function ExtracurricularManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const useDemoMode = !isSupabaseConfigured || !supabase;

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  async function load() {
    setLoading(true);
    if (useDemoMode) { setItems(FALLBACK); setLoading(false); return; }
    const { data } = await supabase.from('smal_extracurriculars').select('*').order('id', { ascending: true });
    setItems(data || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setModal('add'); };
  const openEdit = (item) => { setForm(item); setEditId(item.id); setModal('edit'); };
  const closeModal = () => { setModal(null); setForm(EMPTY_FORM); setEditId(null); };
  const handleChange = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  async function handleSave(e) {
    e.preventDefault();
    if (!form.name.trim()) { showToast('Nama ekskul harus diisi', 'error'); return; }
    setSaving(true);
    if (useDemoMode) {
      if (modal === 'add') setItems((p) => [...p, { ...form, id: `demo-${Date.now()}` }]);
      else setItems((p) => p.map((i) => (i.id === editId ? { ...form, id: editId } : i)));
      closeModal(); setSaving(false); showToast(modal === 'add' ? 'Ekskul ditambahkan (mode demo)' : 'Ekskul diperbarui'); return;
    }
    const payload = { ...form };
    if (modal === 'add') await supabase.from('smal_extracurriculars').insert([payload]);
    else await supabase.from('smal_extracurriculars').update(payload).eq('id', editId);
    await load(); closeModal(); setSaving(false); showToast(modal === 'add' ? 'Data ditambahkan!' : 'Data diperbarui!');
  }

  async function handleDelete(id) {
    if (!window.confirm('Hapus ekskul ini?')) return;
    if (useDemoMode) { setItems((p) => p.filter((i) => i.id !== id)); showToast('Dihapus (mode demo)'); return; }
    await supabase.from('smal_extracurriculars').delete().eq('id', id);
    await load(); showToast('Data dihapus.');
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold text-white ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
          {toast.msg}
        </div>
      )}
      {useDemoMode && (
         <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
           <AlertCircle size={15} /> Mode Demo — Supabase belum terkonfigurasi. Data tidak disimpan.
         </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Manajemen Ekstrakurikuler</h2>
          <p className="text-xs text-slate-400">Total {items.length} ekskul terdaftar</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#002B66] text-white text-xs font-bold shadow hover:bg-blue-900 transition-colors">
          <Plus size={15} /> Tambah Ekskul
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Memuat data...</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">Belum ada data ekskul.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {items.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 bg-white overflow-hidden group hover:shadow-md hover:border-blue-300 transition-all flex flex-col">
                 <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                   {item.image_url ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Image size={24} className="text-slate-300" /></div>}
                   <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded-xl bg-white text-blue-600 shadow hover:bg-blue-50"><Pencil size={13} /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-xl bg-white text-red-500 shadow hover:bg-red-50"><Trash2 size={13} /></button>
                   </div>
                 </div>
                 <div className="p-4 flex-1 flex flex-col">
                    <span className="inline-block px-2 py-0.5 rounded text-[0.65rem] font-bold bg-amber-100 text-amber-700 w-fit mb-1">{item.category || 'Umum'}</span>
                    <h3 className="font-extrabold text-slate-900 text-sm mb-1">{item.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-auto">{item.description}</p>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900">{modal === 'add' ? 'Tambah Ekskul' : 'Edit Ekskul'}</h3>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
               {[{l: 'Nama Ekstrakurikuler *', k: 'name', p: 'Pramuka'}, {l: 'Kategori', k: 'category', p: 'Seni / Olahraga / Wajib'}, {l: 'URL Gambar', k: 'image_url', p: 'https://...'}].map((inp) => (
                <div key={inp.k}>
                  <label className="block text-xs font-bold text-slate-600 mb-1">{inp.l}</label>
                  <input value={form[inp.k]} onChange={handleChange(inp.k)} placeholder={inp.p} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              ))}
              <div>
                 <label className="block text-xs font-bold text-slate-600 mb-1">Deskripsi & Prestasi</label>
                 <textarea value={form.description} onChange={handleChange('description')} rows={3} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">Batal</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-[#002B66] text-white text-sm font-bold hover:bg-blue-900 disabled:opacity-50">
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
