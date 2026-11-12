import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Save, AlertCircle, Image, Sparkles, ExternalLink, Globe } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { FALLBACK_PROGRAMS } from '../../lib/api';

const EMPTY_FORM = {
  title: '',
  slug: '',
  badge_text: '',
  description: '',
  full_content: '',
  image_url: '',
  latest_activity_title: '',
  latest_activity_date: '',
  latest_activity_desc: '',
  moments: [],
};

export default function ProgramManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // 'add' | 'edit'
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
      setItems(FALLBACK_PROGRAMS);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.from('smal_programs').select('*').order('id', { ascending: true });
    if (error || !data || data.length === 0) {
      setItems(FALLBACK_PROGRAMS);
    } else {
      setItems(data);
    }
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
      title: item.title || '',
      slug: item.slug || '',
      badge_text: item.badge_text || '',
      description: item.description || '',
      full_content: item.full_content || '',
      image_url: item.image_url || '',
      latest_activity_title: item.latest_activity?.title || '',
      latest_activity_date: item.latest_activity?.date || '',
      latest_activity_desc: item.latest_activity?.description || '',
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

  // Moments Handler
  const addMoment = () => {
    setForm((p) => ({
      ...p,
      moments: [...p.moments, { url: '', caption: '' }],
    }));
  };

  const updateMoment = (index, field, value) => {
    setForm((p) => {
      const updated = [...p.moments];
      updated[index] = { ...updated[index], [field]: value };
      return { ...p, moments: updated };
    });
  };

  const removeMoment = (index) => {
    setForm((p) => ({
      ...p,
      moments: p.moments.filter((_, idx) => idx !== index),
    }));
  };

  async function handleSave(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      showToast('Judul program harus diisi', 'error');
      return;
    }
    const slug = form.slug.trim() || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    setSaving(true);

    const payload = {
      title: form.title,
      slug,
      badge_text: form.badge_text,
      description: form.description,
      full_content: form.full_content,
      image_url: form.image_url,
      moments: form.moments.filter((m) => m.url && m.url.trim() !== ''),
    };

    if (form.latest_activity_title) {
      payload.latest_activity = {
        title: form.latest_activity_title,
        date: form.latest_activity_date,
        description: form.latest_activity_desc,
      };
    }

    if (useDemoMode) {
      if (modal === 'add') {
        setItems((p) => [{ ...payload, id: `demo-${Date.now()}` }, ...p]);
      } else {
        setItems((p) => p.map((i) => (i.id === editId ? { ...payload, id: editId } : i)));
      }
      closeModal();
      setSaving(false);
      showToast(modal === 'add' ? 'Ditambahkan (mode demo)' : 'Diperbarui (mode demo)');
      return;
    }

    try {
      if (modal === 'add') {
        const { error } = await supabase.from('smal_programs').insert([payload]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('smal_programs').update(payload).eq('id', editId);
        if (error) throw error;
      }
      await load();
      closeModal();
      showToast(modal === 'add' ? 'Program berhasil ditambahkan!' : 'Program berhasil diperbarui!');
    } catch (err) {
      console.error(err);
      showToast(`Gagal menyimpan: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Hapus program ini?')) return;
    if (useDemoMode) {
      setItems((p) => p.filter((i) => i.id !== id));
      showToast('Dihapus (mode demo)');
      return;
    }
    const { error } = await supabase.from('smal_programs').delete().eq('id', id);
    if (error) {
      showToast(`Gagal menghapus: ${error.message}`, 'error');
    } else {
      await load();
      showToast('Program dihapus.');
    }
  }

  const getDetailPageUrl = (slug) => {
    if (slug === 'bahasa' || slug === 'preuni') return '/detail/program/language-preuni';
    if (slug === 'international') return '/detail/program/international';
    return null;
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold text-white ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
          {toast.msg}
        </div>
      )}

      {useDemoMode && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
          <AlertCircle size={15} /> Mode Demo — Supabase belum terkonfigurasi. Perubahan disimpan secara lokal.
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Program Unggulan</h2>
          <p className="text-xs text-slate-400">Kelola 5 program unggulan sekolah, deskripsi pop-up, materi kurikulum & dokumentasi</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#002B66] text-white text-xs font-bold shadow hover:bg-blue-900 transition-colors"
        >
          <Plus size={15} /> Tambah Program
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Memuat data...</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">Belum ada data program.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-500 tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">Cover</th>
                  <th className="px-4 py-3 text-left">Nama Program</th>
                  <th className="px-4 py-3 text-left">Slug</th>
                  <th className="px-4 py-3 text-left">Badge</th>
                  <th className="px-4 py-3 text-left">Tipe Tampilan</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => {
                  const detailUrl = getDetailPageUrl(item.slug);
                  return (
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
                        <p className="font-bold text-slate-900">{item.title}</p>
                        <p className="text-xs text-slate-500 line-clamp-1">{item.description}</p>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-slate-600 bg-slate-50/50">
                        {item.slug || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-1 rounded-full text-[0.7rem] font-bold bg-orange-50 text-orange-600 border border-orange-100">
                          {item.badge_text || 'Unggulan'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold">
                        {detailUrl ? (
                          <span className="px-2 py-0.5 rounded-full text-[0.68rem] bg-blue-50 text-blue-700 font-bold">
                            Pop-up + Halaman Detail
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[0.68rem] bg-slate-100 text-slate-600 font-bold">
                            Cukup Pop-up Saja
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          {detailUrl && (
                            <a
                              href={detailUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Lihat Halaman Detail"
                            >
                              <ExternalLink size={15} />
                            </a>
                          )}
                          <button
                            onClick={() => openEdit(item)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL FORM */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-orange-500" />
                <h3 className="font-extrabold text-slate-900 text-sm">
                  {modal === 'add' ? 'Tambah Program Unggulan' : 'Edit Program Unggulan'}
                </h3>
              </div>
              <button onClick={closeModal} className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-400">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Program *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={handleChange('title')}
                  placeholder="Contoh: Sistem Kredit Semester (SKS)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Slug / Identifier</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={handleChange('slug')}
                    placeholder="Contoh: sks, bahasa, digital, international, preuni"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Badge Text</label>
                  <input
                    type="text"
                    value={form.badge_text}
                    onChange={handleChange('badge_text')}
                    placeholder="Contoh: Kurikulum Fleksibel"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">URL Cover Image</label>
                <input
                  type="url"
                  value={form.image_url}
                  onChange={handleChange('image_url')}
                  placeholder="https://images.unsplash.com/... atau link gambar"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Deskripsi Singkat (Tampil di Pop-up Modal) *</label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={handleChange('description')}
                  placeholder="Ringkasan singkat yang informatif dan menarik untuk pop-up..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-xs"
                />
              </div>

              {/* SPECIAL FOR INTERNATIONAL PROGRAM */}
              {form.slug === 'international' && (
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3">
                  <div className="flex items-center gap-1.5 font-bold text-blue-900 text-xs">
                    <Globe size={14} className="text-blue-600" />
                    <span>Kegiatan Internasional Terbaru (Tampil Khusus di Pop-up)</span>
                  </div>
                  <div>
                    <label className="block text-[0.7rem] font-semibold text-slate-700 mb-1">Judul Kegiatan Terbaru</label>
                    <input
                      type="text"
                      value={form.latest_activity_title}
                      onChange={handleChange('latest_activity_title')}
                      placeholder="Contoh: Study Excursion & Cultural Exchange Sister School ke Tokyo"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[0.7rem] font-semibold text-slate-700 mb-1">Waktu / Tanggal</label>
                      <input
                        type="text"
                        value={form.latest_activity_date}
                        onChange={handleChange('latest_activity_date')}
                        placeholder="Contoh: Oktober 2026"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[0.7rem] font-semibold text-slate-700 mb-1">Keterangan Singkat</label>
                      <input
                        type="text"
                        value={form.latest_activity_desc}
                        onChange={handleChange('latest_activity_desc')}
                        placeholder="Ringkasan capaian atau tujuan kegiatan terbaru ini..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Konten Lengkap (Halaman Detail)</label>
                <textarea
                  rows={5}
                  value={form.full_content}
                  onChange={handleChange('full_content')}
                  placeholder="Narasi komprehensif..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-xs"
                />
              </div>

              {/* SECTION: MOMEN (Disembunyikan jika SKS) */}
              {form.slug !== 'sks' && (
                <div className="pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <label className="font-bold text-slate-900 block">Dokumentasi Foto Momen</label>
                      <p className="text-[0.68rem] text-slate-400">Tambahkan dokumentasi foto kegiatan</p>
                    </div>
                    <button
                      type="button"
                      onClick={addMoment}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 font-bold text-[0.7rem] transition-colors"
                    >
                      <Plus size={13} /> Tambah Foto Momen
                    </button>
                  </div>

                  {form.moments.length === 0 ? (
                    <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-slate-400 text-xs">
                      Belum ada momen foto.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {form.moments.map((moment, idx) => (
                        <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 flex gap-3 items-start">
                          <div className="w-16 h-16 rounded-lg bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
                            {moment.url ? (
                              <img src={moment.url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <Image size={18} />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 space-y-2">
                            <input
                              type="url"
                              value={moment.url}
                              onChange={(e) => updateMoment(idx, 'url', e.target.value)}
                              placeholder="URL Gambar Foto Momen..."
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none text-xs"
                            />
                            <input
                              type="text"
                              value={moment.caption}
                              onChange={(e) => updateMoment(idx, 'caption', e.target.value)}
                              placeholder="Keterangan singkat momen ini..."
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none text-xs"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeMoment(idx)}
                            className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md disabled:opacity-50"
                >
                  <Save size={14} />
                  {saving ? 'Menyimpan...' : 'Simpan Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
