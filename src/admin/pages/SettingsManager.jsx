import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, Settings } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

// Setting fallbacks
const FALLBACK_SETTINGS = {
  school_name: 'SMA Labschool UNESA 1',
  principal_name: 'Kepala Sekolah',
  principal_message: 'Mendidik dengan karakter, menginspirasi dengan inovasi.',
  profile_summary: 'Kami adalah institusi pendidikan menengah tingkat atas yang berada di bawah naungan Yayasan Universitas Negeri Surabaya (UNESA).'
};

export default function SettingsManager() {
  const [settings, setSettings] = useState(FALLBACK_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const useDemoMode = !isSupabaseConfigured || !supabase;

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  async function load() {
    setLoading(true);
    if (useDemoMode) { setSettings(FALLBACK_SETTINGS); setLoading(false); return; }

    const { data } = await supabase.from('smal_settings').select('key, value');
    if (data && data.length > 0) {
      const merged = { ...FALLBACK_SETTINGS };
      data.forEach(item => {
         if (merged[item.key] !== undefined) {
             merged[item.key] = item.value;
         }
      });
      setSettings(merged);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const handleChange = (k) => (e) => setSettings((p) => ({ ...p, [k]: e.target.value }));

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    if (useDemoMode) {
      setTimeout(() => {
        setSaving(false);
        showToast('Pengaturan tersimpan (mode demo)');
      }, 500);
      return;
    }

    // Upsert each setting key independently for simplicity
    const updates = Object.keys(settings).map((key) => ({
      key, value: settings[key]
    }));

    // Because 'key' might be primary key or unique index in smal_settings table
    const { error } = await supabase.from('smal_settings').upsert(updates, { onConflict: 'key' });

    if (error) {
      showToast('Gagal menyimpan: ' + error.message, 'error');
    } else {
      showToast('Seluruh konfigurasi tersimpan!');
    }
    setSaving(false);
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold text-white ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
          {toast.msg}
        </div>
      )}
      {useDemoMode && (
         <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
           <AlertCircle size={15} /> Mode Demo — Supabase belum terkonfigurasi. Konfigurasi tidak disimpan.
         </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Settings size={22} className="text-blue-500" />
            General Settings (Profil Sekolah)
          </h2>
          <p className="text-xs text-slate-400">Atur teks profil sekolah dan sambutan kepala sekolah untuk halaman utama.</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Memuat konfigurasi...</div>
        ) : (
          <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-6">

            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-sm border-b pb-2">Identitas Sekolah</h3>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Nama Sekolah</label>
                <input value={settings.school_name} onChange={handleChange('school_name')} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Ringkasan Profil Sekolah</label>
                <textarea value={settings.profile_summary} onChange={handleChange('profile_summary')} rows={4} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-slate-700 leading-relaxed" />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm border-b pb-2">Kepemimpinan</h3>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Nama Kepala Sekolah</label>
                <input value={settings.principal_name} onChange={handleChange('principal_name')} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Pesan & Sambutan Kepala Sekolah</label>
                <textarea value={settings.principal_message} onChange={handleChange('principal_message')} rows={4} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-slate-700 leading-relaxed" />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
                <button type="submit" disabled={saving} className="px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-extrabold shadow-lg hover:shadow-blue-500/30 hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all active:scale-95">
                  <Save size={16} /> {saving ? 'Menyimpan Konfigurasi...' : 'Simpan Semua Konfigurasi'}
                </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
