import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Save, AlertCircle, Image } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

const FALLBACK = [
  { id: 'fac-1', name: 'Dr. Budi Santoso', role: 'Kepala Sekolah', subject: 'Manajemen Pendidikan', image_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400' },
  { id: 'fac-2', name: 'Siti Aminah, M.Pd', role: 'Wakil Kepala Sekolah', subject: 'Biologi', image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400' },
  { id: 'fac-3', name: 'Ahmad Faisal, S.T', role: 'Guru Penggerak', subject: 'Koding & AI', image_url: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=400' },
];

const EMPTY_FORM = { name: '', role: '', subject: '', image_url: '' };

export default function FacultyManager() {
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
    const { data } = await supabase.from('smal_faculty').select('*').order('id', { ascending: true });
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
    if (!form.name.trim() || !form.role.trim()) { showToast('Nama & Jabatan harus diisi', 'error'); return; }
    setSaving(true);
    if (useDemoMode) {
      if (modal === 'add') setItems((p) => [...p, { ...form, id: `demo-${Date.now()}` }]);
      else setItems((p) => p.map((i) => (i.id === editId ? { ...form, id: editId } : i)));
      closeModal(); setSaving(false); showToast(modal === 'add' ? 'Guru ditambahkan (mode demo)' : 'Diperbarui (mode demo)'); return;
    }
    const payload = { ...form };
    if (modal === 'add') await supabase.from('smal_faculty').insert([payload]);
    else await supabase.from('smal_faculty').update(payload).eq('id', editId);
    await load(); closeModal(); setSaving(false); showToast(modal === 'add' ? 'Data ditambahkan!' : 'Data diperbarui!');
  }

  async function handleDelete(id) {
    if (!window.confirm('Hapus profil ini?')) return;
    if (useDemoMode) { setItems((p) => p.filter((i) => i.id !== id)); showToast('Dihapus (mode demo)'); return; }
    await supabase.from('smal_faculty').delete().eq('id', id);
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
          <h2 className="text-lg font-extrabold text-slate-900">Manajemen Guru / Faculty</h2>
          <p className="text-xs text-slate-400">{items.length} guru & staf tersimpan</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#002B66] text-white text-xs font-bold shadow hover:bg-blue-900 transition-colors">
          <Plus size={15} /> Tambah Data
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
           <div className="p-8 text-center text-slate-400 text-sm">Memuat data...</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">Belum ada data guru.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-500 tracking-wider">
                <tr><th className="px-4 py-3 text-left">Foto</th><th className="px-4 py-3 text-left">Nama</th><th className="px-4 py-3 text-left">Jabatan</th><th className="px-4 py-3 text-left">Mapel</th><th className="px-4 py-3 text-right">Aksi</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                       <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100">
                          {item.image_url ? <img src={item.image_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-[#002B66] text-white font-bold">{item.name?.charAt(0)}</div>}
                       </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{item.name}</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold">{item.role}</span></td>
                    <td className="px-4 py-3 text-slate-500">{item.subject || '-'}</td>
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

      {modal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900">{modal === 'add' ? 'Tambah Guru' : 'Edit Profil Guru'}</h3>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {[{l: 'Nama Lengkap *', k: 'name', p: 'Dr. Budi Santoso'}, {l: 'Jabatan *', k: 'role', p: 'Kepala Sekolah'}, {l: 'Mata Pelajaran', k: 'subject', p: 'Biologi'}, {l: 'URL Foto', k: 'image_url', p: 'https://...'}].map((inp) => (
                <div key={inp.k}>
                  <label className="block text-xs font-bold text-slate-600 mb-1">{inp.l}</label>
                  <input value={form[inp.k]} onChange={handleChange(inp.k)} placeholder={inp.p} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              ))}
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
