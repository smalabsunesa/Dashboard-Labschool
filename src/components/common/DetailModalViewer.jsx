import React, { useEffect } from 'react';
import { X, ArrowRight, Calendar, GraduationCap, Award, Sparkles, BookOpen, Globe, HeartHandshake, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ImageWithSkeleton from './ImageWithSkeleton';

export default function DetailModalViewer({ isOpen, onClose, data, type = 'program' }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !data) return null;

  const isTeacher = type === 'teacher' || type === 'faculty';
  const isEkskul = type === 'ekskul' || type === 'extracurricular';
  const isActivity = type === 'activity';
  const isProgram = type === 'program';

  const slug = data.slug || data.id;
  const isSks = isProgram && (slug === 'sks' || data.title?.toLowerCase().includes('kredit semester'));
  const isDigital = isProgram && (slug === 'digital' || data.title?.toLowerCase().includes('digital learning'));
  const isLanguageOrPreuni = isProgram && (slug === 'bahasa' || slug === 'preuni' || slug === 'language-preuni');
  const isInternational = isProgram && slug === 'international';

  // Determine if this item has a dedicated detail page
  // Rules:
  // - SKS: Pop-up only (no detail page)
  // - Digital: Pop-up only (no detail page)
  // - Activity Report: Pop-up only (no detail page)
  // - Teacher: Pop-up only (no detail page)
  // - Bahasa & Pre-University: Navigates to combined page /detail/program/language-preuni
  // - International: Navigates to /detail/program/international (List of completed programs)
  // - Ekskul: Pop-up with 3 latest awards
  const hasDetailPage = isLanguageOrPreuni || isInternational;

  let detailUrl = '';
  let ctaLabel = 'Buka Detail Lengkap';

  if (isLanguageOrPreuni) {
    detailUrl = '/detail/program/language-preuni';
    ctaLabel = 'Lihat Pilihan Bahasa & Program Berjalan';
  } else if (isInternational) {
    detailUrl = '/detail/program/international';
    ctaLabel = 'Lihat Program Terlaksana Lainnya';
  }

  const handleOpenDetailPage = () => {
    onClose();
    navigate(detailUrl);
  };

  // Parse Education History for Teacher
  const educationList = isTeacher && data.education_history
    ? (Array.isArray(data.education_history) ? data.education_history : String(data.education_history).split('\n')).filter(Boolean)
    : [];

  // Parse Teaching Principles for Teacher
  const teachingPrinciplesList = isTeacher && data.teaching_principles
    ? (Array.isArray(data.teaching_principles) ? data.teaching_principles : String(data.teaching_principles).split('\n')).filter(Boolean)
    : [];

  // 3 Latest Achievements for Ekskul
  const achievementsList = isEkskul && Array.isArray(data.achievements)
    ? data.achievements.slice(0, 3)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-y-auto z-10 flex flex-col">
        {/* Modal Header Bar with Close Button */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-5 sm:px-6 py-3.5 border-b border-slate-100 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.7rem] font-extrabold uppercase tracking-wider bg-orange-100 text-orange-700">
              <Sparkles size={12} className="animate-pulse" />
              {isProgram ? 'Program Unggulan' : isTeacher ? 'Direktori Guru' : isActivity ? 'Activity Report' : 'Ekstrakurikuler'}
            </span>
            {data.badge_text && (
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[0.65rem] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                {data.badge_text}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
            aria-label="Tutup pop-up"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-5 text-slate-800">

          {/* ======================================================== */}
          {/* TEACHER POP-UP VIEW                                      */}
          {/* ======================================================== */}
          {isTeacher ? (
            <div className="space-y-4">
              {/* Header profile card */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-gradient-to-br from-slate-50 to-orange-50/40 p-4 rounded-2xl border border-slate-200/80">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-orange-500 shadow-md shrink-0">
                  <ImageWithSkeleton
                    src={data.image_url}
                    alt={data.name}
                    className="w-full h-full"
                    imageClassName="object-cover w-full h-full"
                    fallbackClassName="bg-slate-200"
                  />
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">{data.name}</h3>
                  <p className="text-xs font-bold text-orange-600 mt-1">{data.role}</p>
                  {data.subject && (
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">{data.subject}</p>
                  )}
                  {data.bio && (
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed italic bg-white/70 p-2.5 rounded-xl border border-slate-100">
                      "{data.bio}"
                    </p>
                  )}
                </div>
              </div>

              {/* Lulusan / Riwayat Pendidikan */}
              {educationList.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <GraduationCap size={15} className="text-blue-600" />
                    Riwayat Lulusan & Pendidikan
                  </h4>
                  <div className="space-y-1.5">
                    {educationList.map((edu, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-blue-50/50 border border-blue-100/80 text-xs font-medium text-slate-800">
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[0.65rem] font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{edu.replace(/^[•\-*]\s*/, '')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prinsip Mengajar Guru */}
              {teachingPrinciplesList.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <HeartHandshake size={15} className="text-orange-500" />
                    Prinsip dalam Mengajar
                  </h4>
                  <div className="space-y-1.5">
                    {teachingPrinciplesList.map((principle, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-50/50 border border-amber-100/80 text-xs font-medium text-slate-800">
                        <span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[0.65rem] font-bold shrink-0 mt-0.5">
                          ✓
                        </span>
                        <span className="leading-relaxed">{principle.replace(/^[•\-*]\s*/, '')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ======================================================== */
            /* PROGRAM / ACTIVITY / EKSKUL POP-UP VIEW                  */
            /* ======================================================== */
            <div className="space-y-4">
              {/* Cover Banner */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-md bg-slate-900 border border-slate-100">
                <ImageWithSkeleton
                  src={data.image_url}
                  alt={data.title || data.name}
                  className="w-full h-full"
                  imageClassName="object-cover w-full h-full"
                  fallbackClassName="bg-slate-800"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  {data.event_date && (
                    <span className="text-[0.65rem] font-bold text-orange-300 flex items-center gap-1 mb-1">
                      <Calendar size={11} /> {data.event_date}
                    </span>
                  )}
                  <h3 className="text-base sm:text-lg font-black leading-tight drop-shadow">
                    {data.title || data.name}
                  </h3>
                </div>
              </div>

              {/* General Description Overview */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {isSks ? 'Tentang Sistem SKS' : isDigital ? 'Pilar Digital Learning' : 'Penjelasan Informasi'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {data.description || data.full_content || 'Tidak ada deskripsi.'}
                </p>
              </div>

              {/* SPECIAL: INTERNATIONAL PROGRAM - LATEST ACTIVITY SLOT */}
              {isInternational && data.latest_activity && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/80 to-indigo-50/60 border border-blue-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.65rem] font-extrabold uppercase bg-blue-600 text-white">
                      <Globe size={11} /> Kegiatan Internasional Terbaru
                    </span>
                    <span className="text-[0.65rem] font-bold text-blue-700">
                      {data.latest_activity.date}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">
                    {data.latest_activity.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {data.latest_activity.description}
                  </p>
                </div>
              )}

              {/* SPECIAL: EKSKUL - 3 PENGHARGAAN TERBARU & FOTONYA */}
              {isEkskul && achievementsList.length > 0 && (
                <div className="space-y-2.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Trophy size={14} className="text-amber-500" />
                      3 Penghargaan Terbaru yang Pernah Diraih
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {achievementsList.map((achieve, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-slate-200 bg-slate-50/80 overflow-hidden flex flex-col justify-between"
                      >
                        <div className="h-24 w-full relative bg-slate-200 overflow-hidden">
                          {achieve.image_url ? (
                            <img src={achieve.image_url} alt={achieve.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-amber-100 text-amber-700">
                              <Award size={24} />
                            </div>
                          )}
                          <span className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-md text-[0.6rem] font-bold bg-slate-900/80 text-white backdrop-blur-sm">
                            {achieve.year}
                          </span>
                        </div>
                        <div className="p-2.5">
                          <p className="font-bold text-slate-900 text-xs line-clamp-2 leading-snug">
                            {achieve.title}
                          </p>
                          {achieve.event && (
                            <p className="text-[0.65rem] text-slate-500 mt-1 line-clamp-1">
                              {achieve.event}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PHOTO MOMENTS (Only displayed if allowed, explicitly NOT shown for SKS or Teacher) */}
              {!isSks && !isTeacher && Array.isArray(data.moments) && data.moments.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Dokumentasi Foto Kegiatan
                    </h4>
                    <span className="text-[0.65rem] text-orange-600 font-bold">
                      {data.moments.length} foto
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {data.moments.slice(0, 3).map((moment, idx) => (
                      <div key={idx} className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                        <img src={moment.url} alt={moment.caption || ''} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Action CTA Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={onClose}
            className={`py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors ${
              hasDetailPage ? 'flex-1' : 'w-full'
            }`}
          >
            Tutup
          </button>

          {/* Dedicated Page Button: Only rendered for Bahasa/Pre-University and International Program */}
          {hasDetailPage && (
            <button
              onClick={handleOpenDetailPage}
              className="flex-1 py-2.5 rounded-xl bg-[#002B66] hover:bg-blue-900 text-white text-xs font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95"
            >
              <span>{ctaLabel}</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
