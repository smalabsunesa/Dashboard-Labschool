import React, { useState } from 'react';
import {
  BookOpen, Cpu, Globe, Compass, Heart, Sparkles, Users, Award, Calendar,
  CheckCircle2, ChevronRight, GraduationCap, BrainCircuit, Monitor, Sigma,
  FunctionSquare, Zap, FlaskConical, Leaf, Languages, BookMarked, Scroll,
  Landmark, TrendingUp, Network, Map
} from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import ImageWithSkeleton from '../common/ImageWithSkeleton';

// 17 Subject Data Grouped into 3 Clusters — each subject has its own unique icon
const subjectClusters = [
  {
    clusterTitle: 'Sains, Teknologi & Matematika (STEM & AI)',
    clusterIcon: Cpu,
    iconBg: 'bg-blue-600 text-white',
    subjects: [
      { name: 'Koding & Kecerdasan Artifisial (AI)', tag: 'Teknologi Masa Depan', desc: 'Pemrograman dasar, logika komputer, algoritma, & dasar AI.', icon: BrainCircuit, iconColor: 'text-blue-600 bg-blue-50' },
      { name: 'Informatika', tag: 'Digital Competence', desc: 'Sistem komputer, jaringan data, & analisis data terapan.', icon: Monitor, iconColor: 'text-sky-600 bg-sky-50' },
      { name: 'Matematika', tag: 'Core STEM', desc: 'Konsep aljabar, geometri, kalkulus dasar, & penalaran logis.', icon: Sigma, iconColor: 'text-indigo-600 bg-indigo-50' },
      { name: 'Matematika Lanjut', tag: 'Advanced STEM', desc: 'Matematika tingkat lanjut untuk persiapan teknik & sains.', icon: FunctionSquare, iconColor: 'text-violet-600 bg-violet-50' },
      { name: 'Fisika', tag: 'Sains Alam', desc: 'Mekanika, gelombang, termodinamika, & fisika modern.', icon: Zap, iconColor: 'text-yellow-600 bg-yellow-50' },
      { name: 'Kimia', tag: 'Sains Alam', desc: 'Struktur materi, reaksi kimia, & lab eksperimen.', icon: FlaskConical, iconColor: 'text-orange-600 bg-orange-50' },
      { name: 'Biologi', tag: 'Sains Alam', desc: 'Anatomi, ekosistem, genetik, & bioteknologi terapan.', icon: Leaf, iconColor: 'text-green-600 bg-green-50' },
    ],
  },
  {
    clusterTitle: 'Bahasa & Literasi Global (Languages)',
    clusterIcon: Globe,
    iconBg: 'bg-purple-600 text-white',
    subjects: [
      { name: 'Bahasa Indonesia', tag: 'Literasi Nasional', desc: 'Penguasaan tata bahasa, karya sastra, & komunikasi publik.', icon: BookMarked, iconColor: 'text-red-600 bg-red-50' },
      { name: 'Bahasa Inggris', tag: 'Global Language', desc: 'Speaking, writing, TOEFL preparation, & public speaking.', icon: Globe, iconColor: 'text-blue-600 bg-blue-50' },
      { name: 'Bahasa Jepang', tag: 'Bahasa Asing', desc: 'Percakapan sehari-hari, huruf Hiragana, Katakana, & budaya.', icon: Languages, iconColor: 'text-pink-600 bg-pink-50' },
      { name: 'Bahasa Mandarin', tag: 'Bahasa Asing', desc: 'Keterampilan berbicara, karakter Hanzi, & komunikasi bisnis.', icon: Scroll, iconColor: 'text-rose-600 bg-rose-50' },
      { name: 'Bahasa Jawa', tag: 'Kearifan Lokal', desc: 'Bahasa ibu, unggah-ungguh basa, & pelestarian budaya Jawa.', icon: BookOpen, iconColor: 'text-amber-700 bg-amber-50' },
    ],
  },
  {
    clusterTitle: 'Ilmu Sosial & Humaniora (Social Sciences & History)',
    clusterIcon: Compass,
    iconBg: 'bg-emerald-600 text-white',
    subjects: [
      { name: 'Sejarah', tag: 'Humaniora', desc: 'Sejarah peradaban Indonesia & dinamika sejarah dunia.', icon: Landmark, iconColor: 'text-stone-600 bg-stone-50' },
      { name: 'Sejarah Lanjut', tag: 'Humaniora Lanjut', desc: 'Analisis historis kritis & perkembangan politik-ekonomi global.', icon: ChevronRight, iconColor: 'text-teal-700 bg-teal-50' },
      { name: 'Ekonomi', tag: 'Finansial & Bisnis', desc: 'Prinsip ekonomi, akuntansi dasar, & analisis pasar.', icon: TrendingUp, iconColor: 'text-emerald-600 bg-emerald-50' },
      { name: 'Sosiologi', tag: 'Ilmu Sosial', desc: 'Struktur sosial, interaksi masyarakat, & dinamika budaya.', icon: Network, iconColor: 'text-cyan-600 bg-cyan-50' },
      { name: 'Geografi', tag: 'Kebumian & Lingkungan', desc: 'Geospasial, pemetaan digital, & pengelolaan lingkungan.', icon: Map, iconColor: 'text-lime-700 bg-lime-50' },
    ],
  }
];

import { useQuery } from '@tanstack/react-query';
import { fetchFaculty, fetchActivities, fetchExtracurriculars } from '../../lib/api';

export default function AcademicSection() {
  const [activeTab, setActiveTab] = useState('mapel');

  const { data: facultyMembers = [] } = useQuery({ queryKey: ['faculty'], queryFn: fetchFaculty });
  const { data: activityReports = [] } = useQuery({ queryKey: ['activities'], queryFn: fetchActivities });
  const { data: extracurriculars = [] } = useQuery({ queryKey: ['extracurriculars'], queryFn: fetchExtracurriculars });

  return (
    <SectionWrapper id="academic" title="Academic">
      {/* Tab Filter Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 border-b border-slate-200 scrollbar-none">
        {[
          { id: 'mapel', label: 'Mata Pelajaran (17 Mapel)', icon: BookOpen },
          { id: 'ekskul', label: 'Ekstrakurikuler', icon: Award },
          { id: 'report', label: 'Activity Report', icon: Calendar },
          { id: 'guru', label: 'Direktori Guru', icon: Users },
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-extrabold transition-all duration-300 whitespace-nowrap shadow-sm ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md scale-105'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <IconComp size={16} className={isActive ? 'text-orange-400' : 'text-slate-500'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ===================================== */}
      {/* TAB 1: MATA PELAJARAN (17 MAPEL + BK) */}
      {/* ===================================== */}
      {activeTab === 'mapel' && (
        <div className="space-y-10">
          {/* Bridging Intro Banner */}
          <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-r from-blue-900 via-slate-900 to-slate-900 p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide bg-orange-500 text-white shadow-sm mb-3">
                <Sparkles size={14} /> Kurikulum Adaptif & Fleksibel SKS
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Pendidikan Unggul Berbasis Karakter & Teknologi
              </h3>
              <p className="mt-3 text-sm sm:text-base text-slate-200 leading-relaxed max-w-4xl">
                Di SMA Labschool UNESA 1, kami meyakini bahwa setiap siswa memiliki potensi keunggulan yang unik. Melalui penerapan Sistem Kredit Semester (SKS) dan Kurikulum Merdeka yang adaptif, kami menyediakan spektrum 17 mata pelajaran unggulan—mulai dari Koding & Kecerdasan Artifisial (AI), 5 bahasa dunia, hingga pendampingan karakter dan layanan Bimbingan Konseling (BK) yang komprehensif.
              </p>
            </div>
          </div>

          {/* 17 Subject Cards Grouped in 3 Clusters */}
          <div className="space-y-8">
            {subjectClusters.map((cluster, cIdx) => {
              const ClusterIcon = cluster.clusterIcon;
              return (
                <div key={cIdx} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl shadow-sm ${cluster.iconBg}`}>
                      <ClusterIcon size={20} />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900">
                      {cluster.clusterTitle}
                    </h4>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {cluster.subjects.map((subj, sIdx) => {
                      const SubjIcon = subj.icon;
                      return (
                        <div
                          key={sIdx}
                          className="group rounded-2xl bg-white border border-slate-200/90 p-4 shadow-sm hover:shadow-md hover:border-blue-400 transition-all duration-300 flex flex-col justify-between"
                        >
                          <div>
                            {/* Per-subject colored icon */}
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 ${subj.iconColor}`}>
                              <SubjIcon size={18} />
                            </div>
                            <span className="text-[0.65rem] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 w-fit block mb-1.5">
                              {subj.tag}
                            </span>
                            <h5 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                              {subj.name}
                            </h5>
                            <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                              {subj.desc}
                            </p>
                          </div>
                          <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[0.7rem] font-bold text-blue-600">
                            <span>Modul SKS Available</span>
                            <ChevronRight size={12} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Kartu Khusus Layanan BK */}
          <div className="rounded-3xl border-2 border-emerald-300/80 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/60 p-6 sm:p-8 shadow-md relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide bg-emerald-600 text-white shadow-sm">
                  <Heart size={14} className="fill-white" /> Kartu Khusus Layanan Siswa
                </div>
                <h4 className="text-2xl font-extrabold text-slate-900">
                  Layanan Bimbingan & Konseling (BK)
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Layanan pendampingan psikologis, konsultasi karir, dan bimbingan akademik yang inklusif untuk membantu siswa mengenali potensi diri, mengatasi kendala belajar, serta merencanakan masa depan pendidikan dengan percaya diri.
                </p>

                <div className="pt-2 grid sm:grid-cols-2 gap-3 text-xs font-semibold text-slate-700">
                  {[
                    'Konsultasi Pribadi & Kesehatan Mental',
                    'Pemetaan Minat, Bakat, & Karir PTN',
                    'Bimbingan Motivasi & Karakter Siswa',
                    'Kerjasama Orang Tua & Pendidik',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 bg-white/80 p-2.5 rounded-xl border border-emerald-200">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Counseling Illustration Image */}
              <div className="shrink-0 w-full lg:w-72 h-44 sm:h-52 rounded-2xl overflow-hidden shadow-md border-2 border-emerald-200 relative">
                <ImageWithSkeleton
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop"
                  alt="Layanan Bimbingan & Konseling"
                  className="w-full h-full"
                  imageClassName="object-cover w-full h-full"
                  fallbackClassName="bg-slate-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-xs font-bold text-white drop-shadow">
                  Layanan Konseling & Mentorship Siswa
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================= */}
      {/* TAB 2: EKSTRAKURIKULER  */}
      {/* ========================= */}
      {activeTab === 'ekskul' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {extracurriculars.map((ekskul, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
            >
              {/* Ekskul Image */}
              <div className="h-44 w-full relative overflow-hidden">
                <ImageWithSkeleton
                  src={ekskul.image_url}
                  alt={ekskul.name}
                  className="w-full h-full"
                  imageClassName="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  fallbackClassName="bg-slate-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[0.65rem] font-bold bg-slate-900/70 backdrop-blur-sm text-white">
                  {ekskul.category}
                </span>
              </div>

              <div className="p-5">
                <h4 className="font-bold text-slate-900 text-base group-hover:text-orange-600 transition-colors">{ekskul.name}</h4>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">{ekskul.description}</p>
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-orange-600">
                  Jadwal: Setiap Sabtu / Sepulang Sekolah
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================= */}
      {/* TAB 3: ACTIVITY REPORT   */}
      {/* ========================= */}
      {activeTab === 'report' && (
        <div className="grid md:grid-cols-3 gap-6">
          {activityReports.map((report) => (
            <div key={report.id} className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-44 w-full relative">
                <ImageWithSkeleton
                  src={report.image_url}
                  alt={report.title}
                  className="w-full h-full"
                  imageClassName="object-cover w-full h-full"
                  fallbackClassName="bg-slate-200"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[0.65rem] font-bold uppercase bg-slate-900/80 backdrop-blur-md text-white">
                  {report.tag}
                </span>
              </div>
              <div className="p-5">
                <p className="text-[0.7rem] text-slate-400 font-semibold mb-1">{report.event_date}</p>
                <h4 className="font-bold text-slate-900 text-base">{report.title}</h4>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">{report.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============================= */}
      {/* TAB 4: DIREKTORI GURU        */}
      {/* ============================= */}
      {activeTab === 'guru' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {facultyMembers.map((teacher, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-orange-500 shadow-md mb-4">
                <ImageWithSkeleton
                  src={teacher.image_url}
                  alt={teacher.name}
                  className="w-full h-full"
                  imageClassName="object-cover w-full h-full"
                  fallbackClassName="bg-slate-200"
                />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">{teacher.name}</h4>
              <p className="text-xs text-orange-600 font-semibold mt-1">{teacher.role}</p>
              <p className="text-[0.75rem] text-slate-500 mt-2">{teacher.subject}</p>
            </div>
          ))}
        </div>
      )}
    </SectionWrapper>
  );
}
