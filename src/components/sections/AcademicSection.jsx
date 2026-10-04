import React, { useState } from 'react';
import { Users, Award, Calendar, Sparkles, BookOpen, GraduationCap, Globe, Cpu, BarChart3 } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import ImageWithSkeleton from '../common/ImageWithSkeleton';
import { useQuery } from '@tanstack/react-query';
import { fetchFaculty, fetchActivities, fetchExtracurriculars } from '../../lib/api';

export default function AcademicSection() {
  const [activeTab, setActiveTab] = useState('report');

  const { data: facultyMembers = [] } = useQuery({ queryKey: ['faculty'], queryFn: fetchFaculty });
  const { data: activityReports = [] } = useQuery({ queryKey: ['activities'], queryFn: fetchActivities });
  const { data: extracurriculars = [] } = useQuery({ queryKey: ['extracurriculars'], queryFn: fetchExtracurriculars });

  return (
    <SectionWrapper id="academic" title="Academic">

      {/* ============================== */}
      {/* BRIDGING BANNER — Intro        */}
      {/* ============================== */}
      <div className="mb-10 rounded-3xl bg-gradient-to-br from-[#002B66] via-blue-900 to-slate-900 p-7 sm:p-10 text-white shadow-xl relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-8">
          {/* Left: Text */}
          <div className="flex-1 space-y-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wide bg-orange-500 text-white shadow-sm">
              <Sparkles size={13} /> Keunggulan Akademik
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight">
              Ekosistem Belajar yang <br className="hidden sm:block" />
              <span className="text-amber-400">Inovatif & Berkarakter</span>
            </h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              SMA Labschool UNESA 1 menerapkan <strong className="text-white">Sistem Kredit Semester (SKS)</strong> dan Kurikulum Merdeka secara penuh — memadukan keunggulan teknologi, literasi global 5 bahasa, program internasional, serta pembinaan karakter yang holistik untuk mencetak generasi emas Indonesia.
            </p>
          </div>

          {/* Right: Stats pills */}
          <div className="grid grid-cols-2 gap-3 shrink-0 lg:w-64">
            {[
              { icon: BookOpen, label: '17 Mata Pelajaran', desc: 'Kurikulum Adaptif SKS', bg: 'bg-white/10' },
              { icon: Globe, label: '5 Bahasa Dunia', desc: 'Literasi Global', bg: 'bg-amber-500/20' },
              { icon: Cpu, label: 'AI & Coding', desc: 'Tech-Forward Learning', bg: 'bg-blue-400/20' },
              { icon: BarChart3, label: 'Pre-University', desc: 'Persiapan PTN/LN', bg: 'bg-emerald-500/20' },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className={`${stat.bg} backdrop-blur-sm rounded-2xl p-3 border border-white/10`}>
                  <Icon size={18} className="text-amber-400 mb-1" />
                  <p className="text-xs font-extrabold text-white leading-tight">{stat.label}</p>
                  <p className="text-[0.65rem] text-slate-400 mt-0.5">{stat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Filter Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 border-b border-slate-200 scrollbar-none">
        {[
          { id: 'report', label: 'Activity Report', icon: Calendar },
          { id: 'ekskul', label: 'Ekstrakurikuler', icon: Award },
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
