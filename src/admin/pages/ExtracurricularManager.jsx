import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Save, AlertCircle, Image, Trophy, Award } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { fetchExtracurriculars } from '../../lib/api';

const EMPTY_FORM = {
  name: '',
  category: '',
  description: '',
  full_content: '',
  schedule: '',
  image_url: '',
  achievements: [],
  moments: [],
};

export default function ExtracurricularManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
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
    if (useDemoMode) {
      const data = await fetchExtracurriculars();
      setItems(data || []);
      setLoading(false);
      return;
    }
    const { data } = await supabase.from('smal_extracurriculars').select('*').order('id', { ascending: true });
    setItems(data || []);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setModal('add');
  };

  const openEdit = (item) => {
    setForm({
      name: item.name || '',
      category: item.category || '',
      description: item.description || '',
      full_content: item.full_content || '',
      schedule: item.schedule || '',
      image_url: item.image_url || '',
      achievements: Array.isArray(item.achievements) ? item.achievements : [],
      moments: Array.isArray(item.moments) ? item.moments : [],
    });
    setEditId(item.id);
    setModal('edit');
  };

  const closeModal = () => {
    setModal(null);
    setForm(EMPTY_FORM);
    setEditId(null);
  };

  const handleChange = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  // Achievement Handlers (Max 3)
  const addAchievement = () => {
    if (form.achievements.length >= 3) {
      showToast('Maksimal 3 penghargaan terbaru', 'error');
      return;
    }
    setForm((p) => ({
      ...p,
      achievements: [...p.achievements, { title: '', year: new Date().getFullYear().toString(), event: '', image_url: '' }],
    }));
  };

  const updateAchievement = (index, field, value) => {
    setForm((p) => {
      const updated = [...p.achievements];
      updated[index] = { ...updated[index], [field]: value };
      return { ...p, achievements: updated };
    });
  };

  const removeAchievement = (index) => {
    setForm((p) => ({
      ...p,
      achievements: p.achievements.filter((_, idx) => idx !== index),
    }));
  };

  async function handleSave(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      showToast('Nama ekskul harus diisi', 'error');
      return;
    }
    setSaving(true);

    const payload = {
      ...form,
      achievements: form.achievements.filter((a) => a.title && a.title.trim() !== ''),
      moments: form.moments.filter((m) => m.url && m.url.trim() !== ''),
    };

    if (useDemoMode) {
      if (modal === 'add') setItems((p) => [...p, { ...payload, id: `demo-${Date.now()}` }]);
      else setItems((p) => p.map((i) => (i.id === editId ? { ...payload, id: editId } : i)));
      closeModal();
      setSaving(false);
      showToast(modal === 'add' ? 'Ekskul ditambahkan (mode demo)' : 'Ekskul diperbarui (mode demo)');
      return;
    }

    try {
      if (modal === 'add') {
        const { error } = await supabase.from('smal_extracurriculars').insert([payload]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('smal_extracurriculars').update(payload).eq('id', editId);
        if (error) throw error;
      }
      await load();
      closeModal();
      showToast(modal === 'add' ? 'Ekstrakurikuler ditambahkan!' : 'Ekstrakurikuler diperbarui!');
    } catch (err) {
      console.error(err);
      showToast(`Gagal menyimpan: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Hapus ekskul ini?')) return;
    if (useDemoMode) {
      setItems((p) => p.filter((i) => i.id !== id));
      showToast('Dihapus (mode demo)');
      return;
    }
    const { error } = await supabase.from('smal_extracurriculars').delete().eq('id', id);
    if (error) {
      showToast(`Gagal menghapus: ${error.message}`, 'error');
    } else {
      await load();
      showToast('Data dihapus.');
    }
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
          <AlertCircle size={15} /> Mode Demo — Supabase belum terkonfigurasi. Data tersimpan di memory.
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Ekstrakurikuler</h2>
          <p className="text-xs text-slate-400">Kelola daftar ekskul, jadwal, dan 3 penghargaan terbaru berserta fotonya untuk pop-up</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#002B66] text-white text-xs font-bold shadow hover:bg-blue-900 transition-colors">
          <Plus size={15} /> Tambah Ekskul
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Memuat data...</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">Belum ada data ekstrakurikuler.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-500 tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">Foto</th>
                  <th className="px-4 py-3 text-left">Nama Ekskul</th>
                  <th className="px-4 py-3 text-left">Kategori</th>
                  <th className="px-4 py-3 text-left">Jadwal</th>
                  <th className="px-4 py-3 text-left">3 Penghargaan</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                        {item.image_url ? (
                          <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Image size={16} className="text-slate-300" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-500 line-clamp-1">{item.description}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-[0.7rem] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                        {item.category || 'Pilihan'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{item.schedule || 'Sabtu'}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-slate-600">
                      {Array.isArray(item.achievements) ? (
                        <span className="flex items-center gap-1 text-amber-600">
                          <Trophy size={13} /> {item.achievements.length} Penghargaan
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(item)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL */}
      {modal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-extrabold text-slate-900 text-sm">
                {modal === 'add' ? 'Tambah Ekstrakurikuler' : 'Edit Ekstrakurikuler'}
              </h3>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Ekstrakurikuler *</label>
                  <input
                    value={form.name}
                    onChange={handleChange('name')}
                    placeholder="Contoh: Tim Basket Labschool Wolves"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori</label>
                  <input
                    value={form.category}
                    onChange={handleChange('category')}
                    placeholder="Contoh: Olahraga Prestasi / Seni Budaya"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jadwal Latihan</label>
                  <input
                    value={form.schedule}
                    onChange={handleChange('schedule')}
                    placeholder="Contoh: Setiap Selasa & Kamis pukul 16.00 WIB"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">URL Cover Image</label>
                  <input
                    type="url"
                    value={form.image_url}
                    onChange={handleChange('image_url')}
                    placeholder="https://images.unsplash.com/... atau link foto"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Ekskul *</label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={handleChange('description')}
                  placeholder="Ringkasan singkat profil ekskul yang tampil di pop-up..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>

              {/* 3 PENGHARGAAN TERBARU & FOTONYA (KHUSUS POP-UP) */}
              <div className="pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <label className="font-bold text-slate-900 block flex items-center gap-1.5">
                      <Trophy size={14} className="text-amber-500" />
                      3 Penghargaan Terbaru yang Pernah Diraih & Fotonya (Tampil di Pop-up)
                    </label>
                    <p className="text-[0.68rem] text-slate-400">Tambahkan maksimal 3 piala/penghargaan bergengsi ekskul ini</p>
                  </div>
                  {form.achievements.length < 3 && (
                    <button
                      type="button"
                      onClick={addAchievement}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 font-bold text-[0.7rem] transition-colors"
                    >
                      <Plus size={13} /> Tambah Penghargaan
                    </button>
                  )}
                </div>

                {form.achievements.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-slate-400 text-xs">
                    Belum ada penghargaan yang ditambahkan. Klik tombol "Tambah Penghargaan" di atas.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {form.achievements.map((achieve, idx) => (
                      <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-amber-50/30 flex gap-3 items-start">
                        <div className="w-16 h-16 rounded-lg bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
                          {achieve.image_url ? (
                            <img src={achieve.image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-amber-600">
                              <Award size={20} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="text"
                              value={achieve.title}
                              onChange={(e) => updateAchievement(idx, 'title', e.target.value)}
                              placeholder="Nama Penghargaan / Juara..."
                              className="col-span-2 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none text-xs"
                            />
                            <input
                              type="text"
                              value={achieve.year}
                              onChange={(e) => updateAchievement(idx, 'year', e.target.value)}
                              placeholder="Tahun (e.g. 2025)"
                              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none text-xs"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={achieve.event}
                              onChange={(e) => updateAchievement(idx, 'event', e.target.value)}
                              placeholder="Penyelenggara / Nama Turnamen..."
                              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none text-xs"
                            />
                            <input
                              type="url"
                              value={achieve.image_url}
                              onChange={(e) => updateAchievement(idx, 'image_url', e.target.value)}
                              placeholder="URL Foto Piala / Sertifikat..."
                              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none text-xs"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAchievement(idx)}
                          className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-[#002B66] text-white text-xs font-bold hover:bg-blue-900 disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
                >
                  <Save size={14} />
                  {saving ? 'Menyimpan...' : 'Simpan Ekskul'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
