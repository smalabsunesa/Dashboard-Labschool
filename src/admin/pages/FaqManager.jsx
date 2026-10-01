import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Save, AlertCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

const FALLBACK = [
  { id: 'faq-1', question: 'Bagaimana cara mendaftar di SMA Labschool UNESA 1?', answer: 'Pendaftaran dilakukan secara online melalui portal PPDB resmi.' },
  { id: 'faq-2', question: 'Apa saja program keunggulan sekolah?', answer: 'Program SKS, Sekolah 5 Bahasa, Pre-University, Digital Learning, dan Sister School.' },
  { id: 'faq-3', question: 'Apakah tersedia fasilitas beasiswa?', answer: 'Ya, tersedia jalur beasiswa prestasi akademik dan non-akademik.' },
];
const EMPTY_FORM = { question: '', answer: '' };

export default function FaqManager() {
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
    const { data } = await supabase.from('smal_faqs').select('*').order('id', { ascending: true });
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
    if (!form.question.trim() || !form.answer.trim()) { showToast('Pertanyaan & jawaban harus diisi', 'error'); return; }
    setSaving(true);
    if (useDemoMode) {
      if (modal === 'add') setItems((p) => [...p, { ...form, id: `demo-${Date.now()}` }]);
      else setItems((p) => p.map((i) => (i.id === editId ? { ...form, id: editId } : i)));
      closeModal(); setSaving(false); showToast(modal === 'add' ? 'FAQ ditambahkan (mode demo)' : 'FAQ diperbarui (mode demo)'); return;
    }
    const payload = { question: form.question, answer: form.answer };
    if (modal === 'add') await supabase.from('smal_faqs').insert([payload]);
    else await supabase.from('smal_faqs').update(payload).eq('id', editId);
    await load(); closeModal(); setSaving(false); showToast(modal === 'add' ? 'FAQ ditambahkan!' : 'FAQ diperbarui!');
  }

  async function handleDelete(id) {
    if (!window.confirm('Hapus FAQ ini?')) return;
    if (useDemoMode) { setItems((p) => p.filter((i) => i.id !== id)); showToast('Dihapus (mode demo)'); return; }
    await supabase.from('smal_faqs').delete().eq('id', id);
    await load(); showToast('FAQ dihapus.');
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
          <AlertCircle size={15} /> Mode Demo — Supabase belum terkonfigurasi. Data tidak disimpan ke database.
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Manajemen FAQ</h2>
          <p className="text-xs text-slate-400">{items.length} pertanyaan tersimpan</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-white text-xs font-bold shadow hover:bg-amber-600 transition-colors">
          <Plus size={15} /> Tambah FAQ
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Memuat data...</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">Belum ada FAQ. Klik "Tambah FAQ" untuk memulai.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {items.map((item, idx) => (
              <div key={item.id} className="flex items-start gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm">{item.question}</p>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{item.answer}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900">{modal === 'add' ? 'Tambah FAQ Baru' : 'Edit FAQ'}</h3>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Pertanyaan *</label>
                <input value={form.question} onChange={handleChange('question')} placeholder="Tulis pertanyaan di sini..." className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Jawaban *</label>
                <textarea value={form.answer} onChange={handleChange('answer')} placeholder="Tulis jawaban di sini..." rows={5} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">Batal</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors">
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
