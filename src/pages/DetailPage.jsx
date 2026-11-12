import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  GraduationCap,
  Sparkles,
  Award,
  Image as ImageIcon,
  Clock,
  BookOpen,
  Share2,
  CheckCircle2,
  X,
  Globe,
  Languages,
  Check,
  MapPin,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ImageWithSkeleton from '../components/common/ImageWithSkeleton';
import { fetchDetailItem } from '../lib/api';

export default function DetailPage() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null); // Lightbox preview
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetchDetailItem(type, id).then((res) => {
      setItem(res);
      setLoading(false);
    });
  }, [type, id]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getBackLink = () => {
    if (type === 'program') return '/#about';
    if (type === 'teacher' || type === 'activity' || type === 'ekskul') return '/#academic';
    return '/';
  };

  const getTypeLabel = () => {
    if (type === 'program') return 'Program Unggulan';
    if (type === 'teacher' || type === 'faculty') return 'Direktori Guru';
    if (type === 'activity') return 'Laporan Kegiatan Siswa';
    if (type === 'ekskul') return 'Ekstrakurikuler';
    return 'Informasi';
  };

  const isLanguageOrPreuni = type === 'program' && (id === 'language-preuni' || id === 'bahasa' || id === 'preuni' || item?.slug === 'bahasa' || item?.slug === 'preuni' || item?.slug === 'language-preuni');
  const isInternational = type === 'program' && (id === 'international' || item?.slug === 'international');

  return (
    <div className="font-inter bg-slate-50 text-slate-800 min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Navigation & Breadcrumb */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <Link
              to={getBackLink()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-sm text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-blue-900 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Kembali ke Beranda</span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-sm text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                {copied ? <CheckCircle2 size={14} className="text-emerald-600" /> : <Share2 size={14} />}
                <span>{copied ? 'Link Disalin!' : 'Bagikan'}</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-16 text-center text-slate-400 text-sm bg-white rounded-3xl border border-slate-200">
              Memuat detail informasi...
            </div>
          ) : !item ? (
            <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Informasi Tidak Ditemukan</h3>
              <p className="text-xs text-slate-500">Data yang Anda cari mungkin telah diperbarui atau dipindahkan.</p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#002B66] text-white text-xs font-bold shadow"
              >
                Kembali ke Halaman Utama
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {/* TOP HEADER SECTION */}
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-orange-100 text-orange-700">
                    <Sparkles size={12} className="animate-pulse" />
                    {getTypeLabel()}
                  </span>
                  {item.badge_text && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                      {item.badge_text}
                    </span>
                  )}
                  {item.category && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      {item.category}
                    </span>
                  )}
                  {item.tag && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {item.tag}
                    </span>
                  )}
                  {item.event_date && (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-semibold ml-auto">
                      <Calendar size={13} /> {item.event_date}
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                    {item.title || item.name}
                  </h1>
                  {item.schedule && (
                    <p className="text-xs font-bold text-orange-600 flex items-center gap-1.5">
                      <Clock size={13} /> Jadwal: {item.schedule}
                    </p>
                  )}

                  {/* Main High-Res Cover */}
                  {item.image_url && (
                    <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-md border border-slate-100 bg-slate-900">
                      <ImageWithSkeleton
                        src={item.image_url}
                        alt={item.title || item.name}
                        className="w-full h-full"
                        imageClassName="object-cover w-full h-full"
                        fallbackClassName="bg-slate-800"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* DETAILED NARRATIVE CONTENT */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <BookOpen size={19} className="text-orange-500" />
                  <span>Penjelasan & Uraian Program</span>
                </h3>

                <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4 whitespace-pre-line">
                  {item.full_content || item.description || 'Belum ada penjelasan mendalam untuk saat ini.'}
                </div>
              </div>

              {/* =================================================================== */}
              {/* SPECIAL SECTION: SEKOLAH 5 BAHASA & PRE-UNIVERSITY PATHWAYS         */}
              {/* =================================================================== */}
              {isLanguageOrPreuni && (
                <>
                  {/* 1. LIST BAHASA YANG BISA DIPILIH */}
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-orange-600 mb-1">
                        <Languages size={16} /> Kurikulum Multi-Bahasa
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                        Daftar 5 Bahasa yang Dapat Dipilih
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Setiap peserta didik dibimbing untuk menguasai kompetensi bahasa internasional terapan sesuai dengan peminatan dan cita-cita perkuliahan.
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {(item.available_languages || []).map((lang, idx) => (
                        <div
                          key={idx}
                          className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 flex flex-col justify-between hover:border-orange-300 hover:shadow-md transition-all group"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <span className="w-8 h-8 rounded-xl bg-[#002B66] text-white flex items-center justify-center font-bold text-xs">
                                0{idx + 1}
                              </span>
                              <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                                {lang.target}
                              </span>
                            </div>
                            <h4 className="font-extrabold text-slate-900 text-base group-hover:text-orange-600 transition-colors">
                              {lang.name}
                            </h4>
                            <p className="text-xs font-semibold text-blue-600 mt-0.5">
                              {lang.level}
                            </p>
                            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                              {lang.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2. PROGRAM BAHASA & KULIAH YANG SEDANG BERJALAN */}
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-blue-600 mb-1">
                        <GraduationCap size={16} /> Jalur Kuliah & Kegiatan Aktif
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                        Program yang Sedang Berjalan
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Inisiatif program akademik berkelanjutan untuk mempersiapkan siswa tembus jurusan bahasa, sastra, hubungan internasional, dan universitas global.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {(item.ongoing_programs || []).map((prog, idx) => (
                        <div
                          key={idx}
                          className="rounded-2xl border border-blue-100 bg-blue-50/40 p-5 space-y-2 hover:bg-blue-50/80 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[0.68rem] font-bold px-2.5 py-1 rounded-full bg-blue-600 text-white">
                              {prog.status}
                            </span>
                          </div>
                          <h4 className="font-extrabold text-slate-900 text-sm leading-snug">
                            {prog.title}
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {prog.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* =================================================================== */}
              {/* SPECIAL SECTION: INTERNATIONAL PROGRAM - COMPLETED PROGRAMS LIST   */}
              {/* =================================================================== */}
              {isInternational && Array.isArray(item.completed_programs) && item.completed_programs.length > 0 && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-blue-600 mb-1">
                      <Globe size={16} /> Portofolio Kemitraan Global
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                      Daftar Program yang Sudah Terlaksana
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Dokumentasi program kerja sama Sister School, pertukaran pelajar, dan konferensi pemuda internasional yang telah berhasil dilaksanakan.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {item.completed_programs.map((program, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 flex flex-col sm:flex-row gap-5 items-start hover:border-blue-300 hover:bg-white transition-all shadow-sm"
                      >
                        <div className="w-full sm:w-44 h-32 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
                          {program.image_url ? (
                            <img src={program.image_url} alt={program.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <Globe size={28} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[0.65rem] font-bold bg-[#002B66] text-white">
                              {program.year}
                            </span>
                            {program.destination && (
                              <span className="flex items-center gap-1 text-[0.68rem] font-semibold text-slate-500">
                                <MapPin size={12} className="text-orange-500" />
                                {program.destination}
                              </span>
                            )}
                          </div>
                          <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                            {program.title}
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {program.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* EXCLUSIVE MOMENTS GALLERY (if available) */}
              {Array.isArray(item.moments) && item.moments.length > 0 && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                      <ImageIcon size={20} className="text-orange-500" />
                      <span>Galeri Momen & Dokumentasi Kegiatan</span>
                    </h3>
                    <span className="text-xs font-bold text-slate-400">
                      {item.moments.length} Foto
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {item.moments.map((moment, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedImage(moment)}
                        className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 hover:-translate-y-1 flex flex-col justify-end"
                        style={{ aspectRatio: '4/3' }}
                      >
                        <img
                          src={moment.url}
                          alt={moment.caption || ''}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                        {moment.caption && (
                          <div className="relative z-10 p-3.5 text-white">
                            <p className="text-xs font-semibold line-clamp-2 leading-snug drop-shadow">
                              {moment.caption}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* LIGHTBOX MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-orange-400 transition-colors"
            >
              <X size={26} />
            </button>
            <img
              src={selectedImage.url}
              alt={selectedImage.caption || ''}
              className="max-h-[80vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-white/10"
            />
            {selectedImage.caption && (
              <p className="mt-4 text-center text-sm font-medium text-white/90 bg-black/50 px-5 py-2 rounded-full border border-white/10">
                {selectedImage.caption}
              </p>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
