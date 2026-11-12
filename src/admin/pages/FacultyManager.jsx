import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Save, AlertCircle, Image, GraduationCap, HeartHandshake } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { fetchFaculty } from '../../lib/api';

const EMPTY_FORM = {
  name: '',
  role: '',
  subject: '',
  image_url: '',
  education_history: '',
  teaching_principles: '',
  bio: '',
};

export default function FacultyManager() {
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
      const data = await fetchFaculty();
      setItems(data || []);
      setLoading(false);
      return;
    }
    const { data } = await supabase.from('smal_faculty').select('*').order('id', { ascending: true });
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
    let edu = '';
    if (Array.isArray(item.education_history)) {
      edu = item.education_history.join('\n');
    } else if (typeof item.education_history === 'string') {
      edu = item.education_history;
    }

    let principles = '';
    if (Array.isArray(item.teaching_principles)) {
      principles = item.teaching_principles.join('\n');
    } else if (typeof item.teaching_principles === 'string') {
      principles = item.teaching_principles;
    }

    setForm({
      name: item.name || '',
      role: item.role || '',
      subject: item.subject || '',
      image_url: item.image_url || '',
      education_history: edu,
      teaching_principles: principles,
      bio: item.bio || '',
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

  async function handleSave(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.role.trim()) {
      showToast('Nama & Jabatan harus diisi', 'error');
      return;
    }
    setSaving(true);

    const payload = { ...form };

    if (useDemoMode) {
      if (modal === 'add') setItems((p) => [...p, { ...payload, id: `demo-${Date.now()}` }]);
      else setItems((p) => p.map((i) => (i.id === editId ? { ...payload, id: editId } : i)));
      closeModal();
      setSaving(false);
      showToast(modal === 'add' ? 'Guru ditambahkan (mode demo)' : 'Diperbarui (mode demo)');
      return;
    }

    try {
      if (modal === 'add') {
        const { error } = await supabase.from('smal_faculty').insert([payload]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('smal_faculty').update(payload).eq('id', editId);
        if (error) throw error;
      }
      await load();
      closeModal();
      showToast(modal === 'add' ? 'Data guru ditambahkan!' : 'Data guru diperbarui!');
    } catch (err) {
      console.error(err);
      showToast(`Gagal menyimpan: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Hapus profil guru ini?')) return;
    if (useDemoMode) {
      setItems((p) => p.filter((i) => i.id !== id));
      showToast('Dihapus (mode demo)');
      return;
    }
    const { error } = await supabase.from('smal_faculty').delete().eq('id', id);
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
          <h2 className="text-lg font-extrabold text-slate-900">Manajemen Guru / Faculty</h2>
          <p className="text-xs text-slate-400">{items.length} guru & staf tersimpan (Lengkap dengan Riwayat Lulusan & Prinsip Mengajar)</p>
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
                <tr>
                  <th className="px-4 py-3 text-left">Foto</th>
                  <th className="px-4 py-3 text-left">Nama</th>
                  <th className="px-4 py-3 text-left">Jabatan</th>
                  <th className="px-4 py-3 text-left">Mapel</th>
                  <th className="px-4 py-3 text-left">Lulusan</th>
                  <th className="px-4 py-3 text-left">Prinsip Mengajar</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                        {item.image_url ? (
                          <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#002B66] text-white font-bold">
                            {item.name?.charAt(0)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{item.name}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold">{item.role}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{item.subject || '-'}</td>
                    <td className="px-4 py-3 text-xs text-slate-500 max-w-[160px] truncate">
                      {item.education_history ? (
                        <span className="flex items-center gap-1 text-blue-600 font-medium">
                          <GraduationCap size={13} /> Terisi
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 max-w-[160px] truncate">
                      {item.teaching_principles ? (
                        <span className="flex items-center gap-1 text-orange-600 font-medium">
                          <HeartHandshake size={13} /> Terisi
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
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

      {modal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-extrabold text-slate-900 text-sm">
                {modal === 'add' ? 'Tambah Guru & Prinsip Mengajar' : 'Edit Profil Guru & Prinsip Mengajar'}
              </h3>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Lengkap *</label>
                  <input
                    value={form.name}
                    onChange={handleChange('name')}
                    placeholder="Contoh: Dr. Budi Santoso, M.Pd"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jabatan *</label>
                  <input
                    value={form.role}
                    onChange={handleChange('role')}
                    placeholder="Contoh: Kepala Sekolah / Guru Penggerak"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mata Pelajaran</label>
                  <input
                    value={form.subject}
                    onChange={handleChange('subject')}
                    placeholder="Contoh: Biologi / Koding & Robotika"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">URL Foto Profil</label>
                  <input
                    value={form.image_url}
                    onChange={handleChange('image_url')}
                    placeholder="https://images.unsplash.com/... atau link foto"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
              </div>

              {/* LULUSAN & RIWAYAT PENDIDIKAN */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Lulusan / Riwayat Pendidikan (1 baris per jenjang)
                </label>
                <textarea
                  rows={3}
                  value={form.education_history}
                  onChange={handleChange('education_history')}
                  placeholder="Contoh:&#10;S1 Pendidikan Fisika - Universitas Negeri Surabaya&#10;S2 Magister Pendidikan Sains - ITB"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-mono"
                />
              </div>

              {/* BEBERAPA PRINSIP DALAM MENGAJAR */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Beberapa Prinsip Guru dalam Mengajar (1 baris per prinsip)
                </label>
                <textarea
                  rows={4}
                  value={form.teaching_principles}
                  onChange={handleChange('teaching_principles')}
                  placeholder="Contoh:&#10;Mendidik dengan keteladanan budi pekerti luhur&#10;Membimbing setiap siswa menemukan potensi terbaiknya&#10;Mengedepankan penalaran kritis dan eksperimen aktif"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/30 font-mono"
                />
                <p className="text-[0.68rem] text-slate-400 mt-0.5">
                  Prinsip-prinsip ini akan otomatis ditampilkan rapi dengan centang di pop-up direktori guru.
                </p>
              </div>

              {/* BIO / PENGANTAR SINGKAT */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kata Pengantar / Kutipan Guru</label>
                <textarea
                  rows={2}
                  value={form.bio}
                  onChange={handleChange('bio')}
                  placeholder="Pesan singkat atau kutipan dedikasi guru..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
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
                  {saving ? 'Menyimpan...' : 'Simpan Profil Guru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
