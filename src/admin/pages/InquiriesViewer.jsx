import React, { useState, useEffect } from 'react';
import { Mail, User, MessageSquare, Calendar, AlertCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

const FALLBACK = [
  { id: 1, name: 'Budi Santoso', email: 'budi@email.com', message: 'Apakah ada jalur prestasi untuk pendaftaran PPDB tahun ini?', created_at: '2026-10-01T08:00:00Z' },
  { id: 2, name: 'Sari Dewi', email: 'sari@email.com', message: 'Berapa uang gedung dan biaya bulanan untuk tahun ajaran 2026/2027?', created_at: '2026-10-01T10:30:00Z' },
];

export default function InquiriesViewer() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const useDemoMode = !isSupabaseConfigured || !supabase;

  useEffect(() => {
    if (useDemoMode) { setItems(FALLBACK); setLoading(false); return; }
    supabase.from('smal_inquiries').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setItems(data || []); setLoading(false); });
  }, []);

  const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      {useDemoMode && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
          <AlertCircle size={15} /> Mode Demo — Menampilkan data contoh.
        </div>
      )}

      <div>
        <h2 className="text-lg font-extrabold text-slate-900">Pesan Masuk</h2>
        <p className="text-xs text-slate-400">{items.length} pesan diterima (hanya baca)</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-400 text-sm">Memuat data...</div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-400 text-sm">Belum ada pesan masuk.</div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-4">
          {/* List */}
          <div className="lg:col-span-1 space-y-3">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelected(item)}
                className={`w-full text-left rounded-2xl border p-4 transition-all shadow-sm ${selected?.id === item.id ? 'border-blue-400 bg-blue-50' : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-full bg-[#002B66] text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                    {item.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <p className="font-bold text-slate-900 text-sm truncate">{item.name || '—'}</p>
                </div>
                <p className="text-xs text-slate-400 truncate">{item.message}</p>
                <p className="text-[0.65rem] text-slate-300 mt-1">{formatDate(item.created_at)}</p>
              </button>
            ))}
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-2">
            {selected ? (
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-5">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="w-12 h-12 rounded-full bg-[#002B66] text-white text-lg font-extrabold flex items-center justify-center shrink-0">
                    {selected.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="font-extrabold text-slate-900">{selected.name}</p>
                    <p className="text-xs text-slate-400">{selected.email}</p>
                  </div>
                  <span className="ml-auto text-[0.65rem] font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                    {formatDate(selected.created_at)}
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { icon: User, label: 'Nama', value: selected.name },
                    { icon: Mail, label: 'Email', value: selected.email },
                    { icon: Calendar, label: 'Waktu Masuk', value: formatDate(selected.created_at) },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3">
                      <Icon size={15} className="text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wide">{label}</p>
                        <p className="text-sm text-slate-700 font-medium">{value || '—'}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-start gap-3">
                    <MessageSquare size={15} className="text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wide">Pesan</p>
                      <p className="text-sm text-slate-700 leading-relaxed mt-0.5 whitespace-pre-wrap">{selected.message || '—'}</p>
                    </div>
                  </div>
                </div>

                <a
                  href={`mailto:${selected.email}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#002B66] text-white text-xs font-bold hover:bg-blue-900 transition-colors"
                >
                  <Mail size={14} /> Balas via Email
                </a>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-400 text-sm h-full flex items-center justify-center">
                Pilih pesan di sebelah kiri untuk melihat detailnya.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
