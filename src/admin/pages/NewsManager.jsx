import React, { useState, useEffect } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Star,
  Image as ImageIcon,
  AlertCircle,
  Clock,
  Infinity as InfinityIcon,
  Instagram,
  Video,
  Play,
  Calendar,
  CheckCircle2,
  Search,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import {
  resolveMediaInfo,
  getDeadlineInfo,
  extractInstagramId,
  extractYouTubeId,
  isNewsActiveOnPublic,
} from '../../lib/media';

const FALLBACK = [
  {
    id: 'update-1',
    title: 'PPDB T.A 2026/2027 Resmi Dibuka',
    caption: 'Pendaftaran gelombang pertama resmi dibuka! Dapatkan fasilitas beasiswa & diskon pendaftar awal.',
    hashtags: '#PPDB2026 #SMALabschool',
    published_at: 'AUG 28, 2026',
    image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600',
    is_spotlight: true,
    post_type: 'forever',
    deadline_at: null,
    media_type: 'image',
  },
  {
    id: 'update-2',
    title: 'Pendaftaran Beasiswa Prestasi Talenta Emas 2026',
    caption: 'Batas akhir pengumpulan berkas portofolio beasiswa jalur akademik dan olahraga.',
    hashtags: '#BeasiswaTalenta #LabschoolJuara',
    published_at: 'OCT 20, 2026',
    image_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600',
    is_spotlight: true,
    post_type: 'deadline',
    deadline_at: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    media_type: 'image',
  },
  {
    id: 'update-3',
    title: 'Keseruan Labschool Science & Art Festival 2026',
    caption: 'Repost video recap keseruan pameran sains dan pentas seni karya murid di Instagram.',
    hashtags: '#LabschoolFestival #ReelsInstagram',
    published_at: 'OCT 12, 2026',
    image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600',
    instagram_url: 'https://www.instagram.com/p/DAc7wS9yABC/',
    is_spotlight: true,
    post_type: 'forever',
    deadline_at: null,
    media_type: 'instagram',
  },
  {
    id: 'update-4',
    title: 'Virtual Tour Smart Digital Hub & Laboratorium Robotik',
    caption: 'Tonton video profil ruang laboratorium digital dan studio AI Labschool UNESA 1.',
    hashtags: '#VideoTour #RoboticLab #DigitalHub',
    published_at: 'SEP 28, 2026',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    is_spotlight: false,
    post_type: 'forever',
    deadline_at: null,
    media_type: 'video',
  },
];

const EMPTY_FORM = {
  title: '',
  caption: '',
  hashtags: '',
  published_at: '',
  image_url: '',
  video_url: '',
  instagram_url: '',
  is_spotlight: false,
  post_type: 'forever', // 'forever' | 'deadline'
  deadline_at: '', // YYYY-MM-DDTHH:mm
  media_type: 'image', // 'image' | 'video' | 'instagram'
};

function StatusBadge({ postType, deadlineAt }) {
  const info = getDeadlineInfo(deadlineAt, postType);

  if (info.isForever) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.7rem] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <InfinityIcon size={12} className="text-emerald-600" />
        Selamanya
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.7rem] font-bold bg-amber-50 text-amber-800 border border-amber-200">
      <Clock size={12} className="text-amber-600 animate-pulse" />
      {info.badgeText} ({info.formattedDate})
    </span>
  );
}

function MediaBadge({ item }) {
  const resolved = resolveMediaInfo(item);

  if (resolved.type === 'instagram') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[0.65rem] font-bold bg-gradient-to-r from-pink-500/10 to-purple-500/10 text-pink-700 border border-pink-200">
        <Instagram size={11} className="text-pink-600" />
        Instagram
      </span>
    );
  }

  if (resolved.type === 'video' || resolved.type === 'youtube') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[0.65rem] font-bold bg-blue-50 text-blue-700 border border-blue-200">
        <Video size={11} className="text-blue-600" />
        Video
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[0.65rem] font-bold bg-slate-100 text-slate-600">
      <ImageIcon size={11} />
      Gambar
    </span>
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
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'forever' | 'deadline' | 'media'
  const [searchQuery, setSearchQuery] = useState('');

  const useDemoMode = !isSupabaseConfigured || !supabase;

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  /**
   * Automatically deletes expired deadline posts permanently from database
   */
  async function purgeExpiredPosts() {
    if (useDemoMode) {
      setItems((prev) => prev.filter((i) => isNewsActiveOnPublic(i)));
      return;
    }
    try {
      const nowIso = new Date().toISOString();
      await supabase
        .from('smal_updates')
        .delete()
        .eq('post_type', 'deadline')
        .lte('deadline_at', nowIso);
    } catch (err) {
      console.warn('Purge expired posts failed:', err);
    }
  }

  async function load() {
    setLoading(true);
    // 1. Purge expired deadline posts permanently first
    await purgeExpiredPosts();

    if (useDemoMode) {
      setItems(FALLBACK.filter((i) => isNewsActiveOnPublic(i)));
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('smal_updates')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.warn('Error loading smal_updates:', error);
        setItems(FALLBACK.filter((i) => isNewsActiveOnPublic(i)));
      } else {
        // Double-check no expired post slipped through
        setItems((data || []).filter((i) => isNewsActiveOnPublic(i)));
      }
    } catch (e) {
      console.warn('Load failed:', e);
      setItems(FALLBACK.filter((i) => isNewsActiveOnPublic(i)));
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    const todayStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).toUpperCase();

    setForm({
      ...EMPTY_FORM,
      published_at: todayStr,
    });
    setEditId(null);
    setModal('add');
  };

  const openEdit = (item) => {
    let formattedDeadline = '';
    if (item.deadline_at || item.deadlineAt) {
      try {
        const d = new Date(item.deadline_at || item.deadlineAt);
        if (!isNaN(d.getTime())) {
          formattedDeadline = d.toISOString().slice(0, 16);
        }
      } catch {
        formattedDeadline = '';
      }
    }

    setForm({
      title: item.title || '',
      caption: item.caption || '',
      hashtags: item.hashtags || '',
      published_at: item.published_at || item.publishedAt || '',
      image_url: item.image_url || item.imageUrl || '',
      video_url: item.video_url || item.videoUrl || '',
      instagram_url: item.instagram_url || item.instagramUrl || '',
      is_spotlight: Boolean(item.is_spotlight || item.isSpotlight),
      post_type: item.post_type || item.postType || 'forever',
      deadline_at: formattedDeadline,
      media_type: item.media_type || item.mediaType || 'image',
    });
    setEditId(item.id);
    setModal('edit');
  };

  const closeModal = () => {
    setModal(null);
    setForm(EMPTY_FORM);
    setEditId(null);
  };

  const handleInputChange = (field, value) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };

      if (field === 'image_url' || field === 'instagram_url' || field === 'video_url') {
        const urlToCheck = value;
        if (extractInstagramId(urlToCheck)) {
          updated.media_type = 'instagram';
          updated.instagram_url = urlToCheck;
        } else if (extractYouTubeId(urlToCheck) || /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(urlToCheck)) {
          updated.media_type = 'video';
          updated.video_url = urlToCheck;
        }
      }

      return updated;
    });
  };

  const setPresetDeadline = (days) => {
    const target = new Date();
    target.setDate(target.getDate() + days);
    target.setHours(23, 59, 0, 0);
    const isoLocal = new Date(target.getTime() - target.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setForm((prev) => ({
      ...prev,
      post_type: 'deadline',
      deadline_at: isoLocal,
    }));
  };

  async function handleSave(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      showToast('Judul berita wajib diisi', 'error');
      return;
    }

    if (form.post_type === 'deadline' && !form.deadline_at) {
      showToast('Pilih tanggal & batas waktu deadline berita', 'error');
      return;
    }

    setSaving(true);

    let finalImageUrl = form.image_url.trim();
    let finalVideoUrl = form.video_url.trim();
    let finalInstagramUrl = form.instagram_url.trim();

    if (form.media_type === 'instagram' && !finalInstagramUrl && finalImageUrl) {
      finalInstagramUrl = finalImageUrl;
    }
    if (form.media_type === 'video' && !finalVideoUrl && finalImageUrl) {
      finalVideoUrl = finalImageUrl;
    }

    const payload = {
      title: form.title.trim(),
      caption: form.caption.trim(),
      hashtags: form.hashtags.trim(),
      published_at: form.published_at.trim(),
      image_url: finalImageUrl || (form.media_type === 'instagram' ? finalInstagramUrl : ''),
      video_url: finalVideoUrl,
      instagram_url: finalInstagramUrl,
      is_spotlight: Boolean(form.is_spotlight),
      post_type: form.post_type,
      deadline_at: form.post_type === 'deadline' && form.deadline_at ? new Date(form.deadline_at).toISOString() : null,
      media_type: form.media_type,
    };

    if (useDemoMode) {
      if (modal === 'add') {
        setItems((prev) => [{ ...payload, id: `demo-${Date.now()}` }, ...prev]);
      } else {
        setItems((prev) => prev.map((item) => (item.id === editId ? { ...payload, id: editId } : item)));
      }
      closeModal();
      setSaving(false);
      showToast(modal === 'add' ? 'Berita ditambahkan (Demo Mode)' : 'Berita diperbarui (Demo Mode)');
      return;
    }

    try {
      if (modal === 'add') {
        const { error } = await supabase.from('smal_updates').insert([payload]);
        if (error) {
          if (error.message && (error.message.includes('post_type') || error.message.includes('media_type'))) {
            const fallbackPayload = {
              title: payload.title,
              caption: payload.caption,
              hashtags: payload.hashtags,
              published_at: payload.published_at,
              image_url: payload.image_url || payload.video_url || payload.instagram_url,
            };
            const retry = await supabase.from('smal_updates').insert([fallbackPayload]);
            if (retry.error) throw retry.error;
            showToast('Tersimpan! (Catatan: Jalankan migration SQL di Supabase)', 'success');
          } else {
            throw error;
          }
        } else {
          showToast('Berita berhasil ditambahkan!');
        }
      } else {
        const { error } = await supabase.from('smal_updates').update(payload).eq('id', editId);
        if (error) {
          if (error.message && (error.message.includes('post_type') || error.message.includes('media_type'))) {
            const fallbackPayload = {
              title: payload.title,
              caption: payload.caption,
              hashtags: payload.hashtags,
              published_at: payload.published_at,
              image_url: payload.image_url || payload.video_url || payload.instagram_url,
            };
            const retry = await supabase.from('smal_updates').update(fallbackPayload).eq('id', editId);
            if (retry.error) throw retry.error;
            showToast('Diperbarui! (Perlu eksekusi migration SQL di Supabase)', 'success');
          } else {
            throw error;
          }
        } else {
          showToast('Berita berhasil diperbarui!');
        }
      }

      await load();
      closeModal();
    } catch (err) {
      console.error('Save error:', err);
      showToast(err.message || 'Gagal menyimpan berita', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Yakin ingin menghapus berita ini secara permanen?')) return;

    if (useDemoMode) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      showToast('Berita berhasil dihapus permanen.');
      return;
    }

    try {
      const { error } = await supabase.from('smal_updates').delete().eq('id', id);
      if (error) throw error;
      await load();
      showToast('Berita berhasil dihapus permanen.');
    } catch (err) {
      showToast(err.message || 'Gagal menghapus berita', 'error');
    }
  }

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.caption?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.hashtags?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    const info = getDeadlineInfo(item.deadline_at || item.deadlineAt, item.post_type || item.postType);

    if (activeTab === 'forever') return info.isForever;
    if (activeTab === 'deadline') return !info.isForever && !info.isExpired;
    if (activeTab === 'media') {
      const type = item.media_type || item.mediaType || (item.instagram_url ? 'instagram' : item.video_url ? 'video' : 'image');
      return type === 'instagram' || type === 'video' || type === 'youtube';
    }

    return true;
  });

  const foreverCount = items.filter((i) => getDeadlineInfo(i.deadline_at || i.deadlineAt, i.post_type || i.postType).isForever).length;
  const activeDeadlines = items.filter((i) => {
    const info = getDeadlineInfo(i.deadline_at || i.deadlineAt, i.post_type || i.postType);
    return !info.isForever && !info.isExpired;
  }).length;
  const mediaCount = items.filter((i) => {
    const type = i.media_type || i.mediaType || (i.instagram_url ? 'instagram' : i.video_url ? 'video' : 'image');
    return type === 'instagram' || type === 'video' || type === 'youtube';
  }).length;

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-bold text-white transition-all transform flex items-center gap-2 ${
            toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
          }`}
        >
          {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          {toast.msg}
        </div>
      )}

      {useDemoMode && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
          <AlertCircle size={16} className="text-amber-600 shrink-0" />
          <span>Mode Demo aktif — Data disimpan secara lokal di sesi saat ini.</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Manajemen Berita & Publikasi
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
              {items.length} Post Aktif
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Berita Selamanya & Berita dengan Deadline (otomatis terhapus permanen saat lewat waktu). Mendukung Repost Instagram & Video.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#002B66] text-white text-xs font-bold shadow-md hover:bg-blue-900 transition-colors shrink-0"
        >
          <Plus size={16} /> Buat Berita Baru
        </button>
      </div>

      {/* Quick Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Semua ({items.length})
          </button>
          <button
            onClick={() => setActiveTab('forever')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'forever'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <InfinityIcon size={13} />
            Selamanya ({foreverCount})
          </button>
          <button
            onClick={() => setActiveTab('deadline')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'deadline'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock size={13} />
            Deadline Aktif ({activeDeadlines})
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'media'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Instagram size={13} />
            Instagram & Video ({mediaCount})
          </button>
        </div>

        {/* Search Field */}
        <div className="relative min-w-[200px] w-full sm:w-auto">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berita..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Memuat daftar berita...</div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            Tidak ada berita yang sesuai dengan filter. Klik <b>"Buat Berita Baru"</b> untuk menambahkan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-[0.7rem] uppercase font-bold text-slate-500 tracking-wider">
                  <th className="px-4 py-3.5">Media</th>
                  <th className="px-4 py-3.5">Judul & Cuplikan</th>
                  <th className="px-4 py-3.5">Tipe & Status Deadline</th>
                  <th className="px-4 py-3.5">Format Media</th>
                  <th className="px-4 py-3.5">Tanggal</th>
                  <th className="px-4 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => {
                  const media = resolveMediaInfo(item);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Media Thumbnail */}
                      <td className="px-4 py-3">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shrink-0 flex items-center justify-center">
                          {media.type === 'instagram' ? (
                            <div className="w-full h-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white">
                              <Instagram size={22} />
                            </div>
                          ) : media.type === 'video' || media.type === 'youtube' ? (
                            <div className="relative w-full h-full">
                              {media.thumbnailUrl ? (
                                <img src={media.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white">
                                  <Video size={20} />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                                <Play size={14} className="fill-white" />
                              </div>
                            </div>
                          ) : item.image_url || item.imageUrl ? (
                            <img
                              src={item.image_url || item.imageUrl}
                              alt=""
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <ImageIcon size={18} className="text-slate-400" />
                          )}
                        </div>
                      </td>

                      {/* Title & Caption */}
                      <td className="px-4 py-3 max-w-xs md:max-w-md">
                        <div className="flex items-center gap-1.5">
                          {item.is_spotlight && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[0.6rem] font-bold bg-amber-100 text-amber-700 shrink-0">
                              <Star size={9} className="fill-amber-500" /> Spotlight
                            </span>
                          )}
                          <p className="font-bold text-slate-900 text-sm line-clamp-1">{item.title}</p>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{item.caption || '—'}</p>
                        {item.hashtags && <p className="text-[0.65rem] text-blue-500 mt-0.5 truncate">{item.hashtags}</p>}
                      </td>

                      {/* Post Type & Deadline */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge
                          postType={item.post_type || item.postType}
                          deadlineAt={item.deadline_at || item.deadlineAt}
                        />
                      </td>

                      {/* Media Format */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <MediaBadge item={item} />
                      </td>

                      {/* Published Date */}
                      <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                        {item.published_at || item.publishedAt || '—'}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(item)}
                            className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                            title="Edit Berita"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                            title="Hapus Berita Permanen"
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

      {/* Modal Add / Edit Form */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <div>
                <h3 className="font-black text-slate-900 text-lg">
                  {modal === 'add' ? 'Tambah Berita / Publikasi Baru' : 'Edit Berita & Publikasi'}
                </h3>
                <p className="text-xs text-slate-400">
                  Pilih tipe berita (Selamanya vs Deadline) dan format media (Gambar, Video, atau Instagram).
                </p>
              </div>
              <button onClick={closeModal} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
              {/* 1. Tipe Berita: Forever vs Deadline */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
                  Tipe Publikasi Berita *
                </label>
                <div className="grid sm:grid-cols-2 gap-3">
                  {/* Option 1: Forever */}
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      form.post_type === 'forever'
                        ? 'border-emerald-500 bg-emerald-50/50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="post_type"
                      value="forever"
                      checked={form.post_type === 'forever'}
                      onChange={() => handleInputChange('post_type', 'forever')}
                      className="mt-1 accent-emerald-600"
                    />
                    <div>
                      <p className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                        <InfinityIcon size={15} className="text-emerald-600" /> Berita Selamanya (Forever)
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Aktif permanen tanpa batas waktu. Cocok untuk berita sekolah, prestasi, profil, dan dokumentasi umum.
                      </p>
                    </div>
                  </label>

                  {/* Option 2: Deadline */}
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      form.post_type === 'deadline'
                        ? 'border-amber-500 bg-amber-50/50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="post_type"
                      value="deadline"
                      checked={form.post_type === 'deadline'}
                      onChange={() => handleInputChange('post_type', 'deadline')}
                      className="mt-1 accent-amber-600"
                    />
                    <div>
                      <p className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                        <Clock size={15} className="text-amber-600" /> Berita dengan Deadline
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Memiliki tanggal batas akhir. <strong className="text-amber-700">Otomatis terhapus permanen dari sistem dan database</strong> saat batas waktu habis.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Deadline Datepicker (Visible if deadline selected) */}
                {form.post_type === 'deadline' && (
                  <div className="pt-2 mt-2 border-t border-slate-200 space-y-2">
                    <label className="block text-xs font-bold text-slate-700">
                      Pilih Tanggal & Waktu Batas Akhir (Deadline) *
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="datetime-local"
                        value={form.deadline_at}
                        onChange={(e) => handleInputChange('deadline_at', e.target.value)}
                        required={form.post_type === 'deadline'}
                        className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white font-medium"
                      />
                      {/* Presets */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPresetDeadline(3)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700"
                        >
                          +3 Hari
                        </button>
                        <button
                          type="button"
                          onClick={() => setPresetDeadline(7)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700"
                        >
                          +7 Hari
                        </button>
                        <button
                          type="button"
                          onClick={() => setPresetDeadline(14)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700"
                        >
                          +14 Hari
                        </button>
                        <button
                          type="button"
                          onClick={() => setPresetDeadline(30)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700"
                        >
                          +30 Hari
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Format Media: Gambar / Video / Instagram */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
                  Format Media Berita *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleInputChange('media_type', 'image')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 text-xs font-bold transition-all ${
                      form.media_type === 'image'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <ImageIcon size={20} className="mb-1" />
                    Gambar / Drive
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInputChange('media_type', 'video')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 text-xs font-bold transition-all ${
                      form.media_type === 'video'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Video size={20} className="mb-1" />
                    Video (MP4/YT)
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInputChange('media_type', 'instagram')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 text-xs font-bold transition-all ${
                      form.media_type === 'instagram'
                        ? 'border-pink-500 bg-pink-50 text-pink-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Instagram size={20} className="mb-1 text-pink-600" />
                    Repost Instagram
                  </button>
                </div>

                {/* Media URL inputs based on selection */}
                {form.media_type === 'instagram' ? (
                  <div className="space-y-2 pt-2">
                    <label className="block text-xs font-bold text-slate-700">
                      Link Post atau Reels Instagram *
                    </label>
                    <input
                      type="url"
                      value={form.instagram_url || form.image_url}
                      onChange={(e) => {
                        handleInputChange('instagram_url', e.target.value);
                        handleInputChange('image_url', e.target.value);
                      }}
                      placeholder="Contoh: https://www.instagram.com/reel/C-xyz/ atau https://www.instagram.com/p/..."
                      required
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
                    />
                    <p className="text-[0.7rem] text-slate-500">
                      Mendukung link post foto, carousel, dan reels Instagram. Konten akan otomatis di-embed dengan rapi di story & detail berita.
                    </p>
                  </div>
                ) : form.media_type === 'video' ? (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700">
                        URL Video (MP4 / WebM / YouTube / Google Drive Video) *
                      </label>
                      <input
                        type="url"
                        value={form.video_url || form.image_url}
                        onChange={(e) => {
                          handleInputChange('video_url', e.target.value);
                          if (!form.image_url) handleInputChange('image_url', e.target.value);
                        }}
                        placeholder="https://...file.mp4 ATAU https://youtube.com/watch?v=... ATAU Google Drive link"
                        required
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700">
                        Thumbnail / Cover Video (Opsional)
                      </label>
                      <input
                        type="url"
                        value={form.image_url}
                        onChange={(e) => handleInputChange('image_url', e.target.value)}
                        placeholder="Link gambar cover (bisa link Google Drive atau Unsplash)..."
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 pt-2">
                    <label className="block text-xs font-bold text-slate-700">
                      URL Gambar (Link Google Drive atau URL Gambar Umum) *
                    </label>
                    <input
                      type="url"
                      value={form.image_url}
                      onChange={(e) => handleInputChange('image_url', e.target.value)}
                      placeholder="https://drive.google.com/file/d/... ATAU https://images.unsplash.com/..."
                      required
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                    <p className="text-[0.7rem] text-slate-500">
                      Link Google Drive otomatis dikonversi menjadi URL gambar CDN berkecepatan tinggi.
                    </p>
                  </div>
                )}
              </div>

              {/* 3. Text Fields: Judul, Caption, Hashtag */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Judul Berita / Pengumuman *
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Contoh: Penerimaan Peserta Didik Baru (PPDB) 2026/2027"
                    required
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Caption / Isi Ringkas *
                  </label>
                  <textarea
                    value={form.caption}
                    onChange={(e) => handleInputChange('caption', e.target.value)}
                    placeholder="Tuliskan keterangan lengkap atau poin penting berita di sini..."
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tanggal Tampil (Published At)
                  </label>
                  <input
                    type="text"
                    value={form.published_at}
                    onChange={(e) => handleInputChange('published_at', e.target.value)}
                    placeholder="Contoh: OCT 28, 2026"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hashtags
                  </label>
                  <input
                    type="text"
                    value={form.hashtags}
                    onChange={(e) => handleInputChange('hashtags', e.target.value)}
                    placeholder="#SMALabschoolUnesa #PrestasiJuara #PPDB2026"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-amber-50/60 border border-amber-200">
                  <input
                    type="checkbox"
                    checked={form.is_spotlight}
                    onChange={(e) => handleInputChange('is_spotlight', e.target.checked)}
                    className="w-4 h-4 rounded accent-amber-500"
                  />
                  <div>
                    <span className="text-sm font-bold text-slate-800">
                      Tampilkan sebagai Spotlight (Slider Berita Utama)
                    </span>
                    <p className="text-xs text-slate-500">
                      Berita ini akan tampil di bagian atas slider/banner utama pada halaman depan.
                    </p>
                  </div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-[#002B66] text-white text-sm font-bold hover:bg-blue-900 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                  <Save size={15} />
                  {saving ? 'Menyimpan...' : 'Simpan Berita'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
