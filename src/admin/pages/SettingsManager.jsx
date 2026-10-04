import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, Settings, Building2, GraduationCap, Share2, Plus, Trash2, Image, ExternalLink } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

const FALLBACK_SETTINGS = {
  school_name: 'SMA Labschool UNESA 1',
  school_address: 'Jl. Citra Raya Unesa, Lakarsantri, Surabaya',
  principal_name: 'Kepala Sekolah',
  principal_message: 'Mendidik dengan karakter, menginspirasi dengan inovasi. Selamat datang di portal resmi SMA Labschool UNESA 1.',
  profile_summary: 'Kami adalah institusi pendidikan menengah tingkat atas yang berada di bawah naungan Yayasan Universitas Negeri Surabaya (UNESA).',
  
  // Admissions (PPDB)
  admission_bridging_title: 'Investasi Terbaik untuk Masa Depan Anak Anda',
  admission_bridging_desc: 'Bergabunglah dengan komunitas pelajar unggulan yang tidak hanya cerdas secara akademik, tetapi juga berkarakter, berdaya saing global, dan siap memimpin di era digital.',
  admission_poster_url: '/spmb.png',
  admission_flow_image_url: '',
  admission_register_url: 'https://lynk.id/labschoolunesa/opj7kdqmrn7x',
  admission_discounts_json: JSON.stringify([
    { label: 'Alumni SMP Labschool UNESA', value: '25%', color: 'bg-blue-50 border-blue-200 text-blue-700' },
    { label: 'Mendaftar 2 anak kandung / bersaudara di Labschool UNESA', value: '25%', color: 'bg-purple-50 border-purple-200 text-purple-700' },
    { label: 'Anak kandung Dosen / Karyawan UNESA', value: '20%', color: 'bg-slate-50 border-slate-200 text-slate-700' },
    { label: 'Juara Internasional (Peringkat 1–3)', value: '30%', color: 'bg-amber-50 border-amber-200 text-amber-700' },
    { label: 'Juara Nasional (Peringkat 1–3)', value: '20%', color: 'bg-orange-50 border-orange-200 text-orange-700' },
    { label: 'Juara Daerah / Propinsi (Peringkat 1–3)', value: '10%', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
  ], null, 2),

  // Social Media & Contact
  contact_whatsapp_num: '+62 821-232-937-212',
  contact_whatsapp_url: 'https://wa.me/62821232937212',
  contact_instagram_handle: '@smalabschoolunesa.official',
  contact_instagram_url: 'https://instagram.com/smalabschoolunesa.official',
  contact_email: 'smalabschoolunesa@gmail.com',
  contact_website_url: 'https://smalabschoolunesa1.sch.id',
  contact_tiktok_url: 'https://tiktok.com/@smalabschoolunesa',
};

export default function SettingsManager() {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'admissions' | 'social'
  const [settings, setSettings] = useState(FALLBACK_SETTINGS);
  const [loading, setLoading] = useState(true);
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
      setSettings(FALLBACK_SETTINGS);
      setLoading(false);
      return;
    }

    const { data } = await supabase.from('smal_settings').select('key, value');
    if (data && data.length > 0) {
      const merged = { ...FALLBACK_SETTINGS };
      data.forEach(item => {
        if (item.key) {
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

    const updates = Object.keys(settings).map((key) => ({
      key,
      value: typeof settings[key] === 'string' ? settings[key] : JSON.stringify(settings[key])
    }));

    const { error } = await supabase.from('smal_settings').upsert(updates, { onConflict: 'key' });

    if (error) {
      showToast('Gagal menyimpan: ' + error.message, 'error');
    } else {
      showToast('Seluruh pengaturan berhasil disimpan!');
    }
    setSaving(false);
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold text-white ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
          {toast.msg}
        </div>
      )}

      {useDemoMode && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
          <AlertCircle size={15} /> Mode Demo — Supabase belum terkonfigurasi. Perubahan tidak tersimpan ke database.
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Settings size={24} className="text-blue-600" />
            Pengaturan Website & CMS
          </h2>
          <p className="text-xs text-slate-400">Kelola identitas sekolah, informasi PPDB/Admissions, serta link sosial media & kontak.</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-[#002B66] text-white text-xs font-extrabold shadow hover:bg-blue-900 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Save size={15} /> {saving ? 'Menyimpan...' : 'Simpan Semua'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto scrollbar-none pb-2">
        {[
          { id: 'profile', label: 'Identitas Sekolah', icon: Building2 },
          { id: 'admissions', label: 'Admissions & PPDB', icon: GraduationCap },
          { id: 'social', label: 'Sosial Media & Kontak', icon: Share2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Memuat pengaturan...</div>
        ) : (
          <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-6">

            {/* TAB 1: IDENTITAS SEKOLAH */}
            {activeTab === 'profile' && (
              <div className="space-y-5">
                <h3 className="font-extrabold text-slate-900 text-sm border-b pb-2">Profil & Kepala Sekolah</h3>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Sekolah</label>
                  <input value={settings.school_name || ''} onChange={handleChange('school_name')} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Sekolah</label>
                  <input value={settings.school_address || ''} onChange={handleChange('school_address')} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ringkasan Profil Sekolah</label>
                  <textarea value={settings.profile_summary || ''} onChange={handleChange('profile_summary')} rows={4} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-slate-700 leading-relaxed" />
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nama Kepala Sekolah</label>
                    <input value={settings.principal_name || ''} onChange={handleChange('principal_name')} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Pesan / Sambutan Kepala Sekolah</label>
                    <textarea value={settings.principal_message || ''} onChange={handleChange('principal_message')} rows={4} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-slate-700 leading-relaxed" />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ADMISSIONS & PPDB */}
            {activeTab === 'admissions' && (
              <div className="space-y-5">
                <h3 className="font-extrabold text-slate-900 text-sm border-b pb-2">Konten Halaman Admissions (PPDB)</h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Judul Bridging (Kenapa Harus Pilih Kami)</label>
                    <input value={settings.admission_bridging_title || ''} onChange={handleChange('admission_bridging_title')} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Bridging</label>
                    <textarea value={settings.admission_bridging_desc || ''} onChange={handleChange('admission_bridging_desc')} rows={3} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-slate-700" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">URL Direct Link Pendaftaran PPDB</label>
                    <input value={settings.admission_register_url || ''} onChange={handleChange('admission_register_url')} placeholder="https://lynk.id/..." className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">URL Poster PPDB</label>
                    <input value={settings.admission_poster_url || ''} onChange={handleChange('admission_poster_url')} placeholder="/spmb.png atau https://..." className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">URL Gambar Alur Pendaftaran (Infografis)</label>
                    <input value={settings.admission_flow_image_url || ''} onChange={handleChange('admission_flow_image_url')} placeholder="Opsional: Kosongkan untuk memakai 4 diagram langkah default, atau masukkan URL gambar/poster alur PPDB" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <p className="text-[0.7rem] text-slate-400 mt-1">*Jika diisi, section Alur Pendaftaran akan menampilkan gambar poster alur pendaftaran ini.</p>
                  </div>
                </div>

                {/* Preview Images if available */}
                {(settings.admission_poster_url || settings.admission_flow_image_url) && (
                  <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    {settings.admission_poster_url && (
                      <div>
                        <p className="text-[0.7rem] font-bold text-slate-500 mb-2">Preview Poster PPDB:</p>
                        <img src={settings.admission_poster_url} alt="Poster Preview" className="h-40 object-cover rounded-xl border border-slate-300" onError={(e) => { e.target.style.display = 'none'; }} />
                      </div>
                    )}
                    {settings.admission_flow_image_url && (
                      <div>
                        <p className="text-[0.7rem] font-bold text-slate-500 mb-2">Preview Gambar Alur Pendaftaran:</p>
                        <img src={settings.admission_flow_image_url} alt="Flow Preview" className="h-40 object-cover rounded-xl border border-slate-300" onError={(e) => { e.target.style.display = 'none'; }} />
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Data Diskon & Beasiswa (Format JSON Array)</label>
                  <textarea value={settings.admission_discounts_json || ''} onChange={handleChange('admission_discounts_json')} rows={5} className="w-full rounded-xl border border-slate-200 p-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            )}

            {/* TAB 3: SOSIAL MEDIA & KONTAK */}
            {activeTab === 'social' && (
              <div className="space-y-5">
                <h3 className="font-extrabold text-slate-900 text-sm border-b pb-2">Saluran Komunikasi & Sosial Media</h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nomor WhatsApp Official</label>
                    <input value={settings.contact_whatsapp_num || ''} onChange={handleChange('contact_whatsapp_num')} placeholder="+62 821-xxxx-xxxx" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">URL WhatsApp Chat (https://wa.me/...)</label>
                    <input value={settings.contact_whatsapp_url || ''} onChange={handleChange('contact_whatsapp_url')} placeholder="https://wa.me/62821232937212" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Handle Instagram</label>
                    <input value={settings.contact_instagram_handle || ''} onChange={handleChange('contact_instagram_handle')} placeholder="@smalabschoolunesa.official" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">URL Profile Instagram</label>
                    <input value={settings.contact_instagram_url || ''} onChange={handleChange('contact_instagram_url')} placeholder="https://instagram.com/..." className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Resmi Sekolah</label>
                    <input value={settings.contact_email || ''} onChange={handleChange('contact_email')} placeholder="smalabschoolunesa@gmail.com" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">URL Website Resmi</label>
                    <input value={settings.contact_website_url || ''} onChange={handleChange('contact_website_url')} placeholder="https://smalabschoolunesa1.sch.id" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">URL TikTok (Opsional)</label>
                    <input value={settings.contact_tiktok_url || ''} onChange={handleChange('contact_tiktok_url')} placeholder="https://tiktok.com/@..." className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-xl bg-[#002B66] text-white text-xs font-extrabold shadow-lg hover:bg-blue-900 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
              >
                <Save size={16} /> {saving ? 'Menyimpan...' : 'Simpan Semua Pengaturan'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
