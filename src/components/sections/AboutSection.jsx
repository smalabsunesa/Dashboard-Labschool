import React from 'react';
import { Sparkles, GraduationCap, Globe, BookOpen, Users, BarChart3, Quote, Target, Flag } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import ImageWithSkeleton from '../common/ImageWithSkeleton';

const pilarUnggulan = [
  {
    id: 'sks',
    title: 'Sistem Kredit Semester (SKS)',
    desc: 'Sistem pembelajaran fleksibel yang memungkinkan peserta didik menyelesaikan masa studi sesuai kecepatan belajar individual.',
    icon: GraduationCap,
    circleBg: 'bg-[#002B66]', // Dark Navy
    badgeText: 'Kurikulum Fleksibel',
  },
  {
    id: 'bahasa',
    title: 'Sekolah 5 Bahasa',
    desc: 'Penguasaan Bahasa Indonesia, Inggris, Jepang, Mandarin, & Arab untuk komunikasi internasional unggul.',
    icon: Globe,
    circleBg: 'bg-[#F59E0B]', // Amber Gold
    badgeText: 'Komunikasi Global',
  },
  {
    id: 'digital',
    title: 'Digital Learning',
    desc: 'Ekosistem belajar modern terintegrasi platform digital, Smart Classroom, Lab Robotika, & penerapan AI.',
    icon: BookOpen,
    circleBg: 'bg-[#002B66]', // Dark Navy
    badgeText: 'Fasilitas Modern',
  },
  {
    id: 'international',
    title: 'International Program',
    desc: 'Sister School dengan sekolah internasional di Asia & Australia, mencakup pertukaran pelajar & budaya.',
    icon: Users,
    circleBg: 'bg-[#002B66]', // Dark Navy
    badgeText: 'Wawasan Internasional',
  },
  {
    id: 'preuni',
    title: 'Pre-University Class',
    desc: 'Bimbingan intensif persiapan tembus PTN favorit (SNBP/SNBT), olimpiade sains, & kuliah luar negeri.',
    icon: BarChart3,
    circleBg: 'bg-[#F59E0B]', // Amber Gold
    badgeText: 'Sukses PTN & Overseas',
  },
];

import { useQuery } from '@tanstack/react-query';
import { fetchSettings } from '../../lib/api';

export default function AboutSection() {
  const { data: settings = {} } = useQuery({ queryKey: ['settings'], queryFn: fetchSettings });
  return (
    <SectionWrapper id="about" title="About Us">
      <div className="space-y-16">
        {/* ============================================================== */}
        {/* ROW 1: SEKOLAH DAN KEPALA SEKOLAH (SIDE BY SIDE 2 CARDS GRID)   */}
        {/* ============================================================== */}
        <div className="pt-12 grid lg:grid-cols-2 gap-10 lg:gap-12 items-stretch">
          {/* CARD 1: PROFIL SEKOLAH (LOGO OFFSET DIPERBESAR) */}
          <div className="relative pt-20 sm:pt-24 pb-6 sm:pb-8 px-6 sm:px-8 rounded-3xl border border-slate-200/90 bg-white shadow-sm hover:shadow-md transition-all text-center flex flex-col justify-between">
            {/* Further Enlarged Centered Floating Offset Logo Badge */}
            <div className="absolute -top-16 sm:-top-18 left-1/2 -translate-x-1/2 w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-white p-3.5 border-4 border-slate-100 shadow-2xl flex items-center justify-center shrink-0">
              <img
                src="/Labschool-UNESA-logo.svg"
                alt="Logo SMA Labschool UNESA 1"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              {/* Lowered Label Badge */}
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wide bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm mb-3">
                <Sparkles size={14} className="animate-pulse" />
                School of Character
              </span>

              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {settings.school_name || 'SMA Labschool UNESA 1'}
              </h3>
              <p className="text-xs text-orange-600 font-semibold mt-1 mb-4">
                Trusted. Bright. Caring.
              </p>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed text-left bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-100">
                <p>{settings.profile_summary}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap justify-center gap-2 text-xs font-semibold text-slate-700">
              <span className="px-3 py-1 rounded-lg bg-orange-50 text-orange-700 border border-orange-100">
                ✓ Digital School
              </span>
              <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                ✓ Kurikulum Merdeka
              </span>
              <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
                ✓ Karakter & Adab
              </span>
            </div>
          </div>

          {/* CARD 2: SAMBUTAN KEPALA SEKOLAH (FOTO OFFSET DIPERBESAR) */}
          <div className="relative pt-20 sm:pt-24 pb-6 sm:pb-8 px-6 sm:px-8 rounded-3xl border border-slate-200/90 bg-white shadow-sm hover:shadow-md transition-all text-center flex flex-col justify-between">
            {/* Further Enlarged Centered Floating Offset Principal Photo Badge */}
            <div className="absolute -top-16 sm:-top-18 left-1/2 -translate-x-1/2 w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-white p-1 border-4 border-slate-100 shadow-2xl overflow-hidden shrink-0">
              <ImageWithSkeleton
                src="/about-us-2.png"
                alt="Kepala Sekolah SMA Labschool UNESA 1"
                className="w-full h-full"
                imageClassName="object-cover w-full h-full rounded-full"
                fallbackClassName="bg-slate-200"
              />
            </div>

            <div>
              {/* Lowered Label Badge */}
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wide bg-blue-600 text-white shadow-sm mb-3">
                Leadership & Vision
              </span>

              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Sambutan Kepala Sekolah
              </h3>
              <p className="text-xs text-blue-600 font-semibold mt-1 mb-4">
                {settings.principal_name || 'Kepala Sekolah'}
              </p>

              {/* Principal Quote Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-100 text-xs sm:text-sm text-slate-700 italic leading-relaxed text-left mb-4 whitespace-pre-wrap">
                “{settings.principal_message}”
              </div>

              {/* Visi & Misi Highlights */}
              <div className="grid sm:grid-cols-2 gap-3 text-xs text-left">
                <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100">
                  <div className="flex items-center gap-1.5 font-bold text-blue-900 text-xs mb-1">
                    <Target size={14} className="text-blue-600" />
                    <span>Visi Sekolah</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[0.75rem]">
                    Pusat inovasi pendidikan menyiapkan generasi beriman, beradab, berilmu, & berprestasi.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs mb-1">
                    <Flag size={14} className="text-amber-600" />
                    <span>Misi Sekolah</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[0.75rem]">
                    Inovasi inspiratif, penguatan religius & kebangsaan, serta lulusan berjiwa wirausaha.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* ROW 2: 5 PILAR UNGGULAN (GRID HORIZONTAL 5 CARDS)               */}
        {/* ============================================================== */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 bg-orange-100 px-3.5 py-1 rounded-full">
              Pilar Keunggulan Sekolah
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              5 Pilar Unggulan Akademik
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Program unggulan SMA Labschool UNESA 1 dalam mencetak lulusan berkarakter & kompeten.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {pilarUnggulan.map((prog) => {
              const IconComp = prog.icon;
              return (
                <div
                  key={prog.id}
                  className="group rounded-2xl bg-white border border-slate-200/90 p-5 shadow-sm hover:shadow-md hover:border-orange-300 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
                >
                  <div>
                    {/* Colored Circle Icon Badge */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md ${prog.circleBg} mb-3 group-hover:scale-105 transition-transform`}>
                      <IconComp size={24} />
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-orange-600 transition-colors leading-snug">
                      {prog.title}
                    </h4>
                    <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                      {prog.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-[0.65rem] font-extrabold text-orange-600">
                    {prog.badgeText}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
