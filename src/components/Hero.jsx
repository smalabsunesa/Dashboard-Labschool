import React from 'react';
import { ArrowRight, GraduationCap, Globe, BookOpen, Users, BarChart3 } from 'lucide-react';
import ImageWithSkeleton from './common/ImageWithSkeleton';

const primaryBlue = '#007BFF';
const primaryOrange = '#FF7A00';

const programCards = [
  {
    id: 'sks',
    titleLines: ['SISTEM', 'KREDIT', 'SEMESTER'],
    icon: GraduationCap,
    circleBg: 'bg-[#002B66]', // Dark Navy Blue
  },
  {
    id: 'bahasa',
    titleLines: ['SEKOLAH', 'LIMA', 'BAHASA'],
    icon: Globe,
    circleBg: 'bg-[#F59E0B]', // Vibrant Amber / Orange
  },
  {
    id: 'digital',
    titleLines: ['DIGITAL', 'LEARNING'],
    icon: BookOpen,
    circleBg: 'bg-[#002B66]', // Dark Navy Blue
  },
  {
    id: 'international',
    titleLines: ['INTERNATIONAL', 'PROGRAM'],
    icon: Users,
    circleBg: 'bg-[#002B66]', // Dark Navy Blue
  },
  {
    id: 'preuni',
    titleLines: ['PRE-UNIVERSITY', 'CLASS'],
    icon: BarChart3,
    circleBg: 'bg-[#F59E0B]', // Vibrant Amber / Orange
  },
];

function BatikBackground() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" aria-hidden="true">
      <defs>
        <pattern id="batik" width="160" height="160" patternUnits="userSpaceOnUse">
          <rect width="160" height="160" fill="#fff7ed" />
          <g fill="none" stroke="#92400e" strokeWidth="1.2" strokeOpacity="0.9">
            <ellipse cx="80" cy="80" rx="26" ry="54" />
            <ellipse cx="80" cy="80" rx="54" ry="26" />
            <ellipse cx="80" cy="80" rx="26" ry="54" transform="rotate(45 80 80)" />
            <ellipse cx="80" cy="80" rx="54" ry="26" transform="rotate(45 80 80)" />
          </g>
          <g fill="#f97316" opacity="0.5">
            <circle cx="80" cy="80" r="8" />
            <circle cx="30" cy="30" r="5" />
            <circle cx="130" cy="30" r="5" />
            <circle cx="30" cy="130" r="5" />
            <circle cx="130" cy="130" r="5" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#batik)" />
    </svg>
  );
}

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-blue-50 pointer-events-none" />
      <BatikBackground />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Main Hero Header & Image */}
        <div className="grid md:grid-cols-2 gap-10 items-center mb-14">
          <div>
            <span
              className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border mb-4 shadow-sm"
              style={{ borderColor: primaryOrange, color: primaryOrange, background: '#FFF8F0' }}
            >
              School Of Charater
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              SMA Labschool UNESA 1
            </h1>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              Inspiring young minds to learn, grow, and lead with character through digital innovation & global perspectives.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#admissions"
                className="px-6 py-3 rounded-full text-white font-semibold shadow-md hover:shadow-orange-500/20 transition-transform active:scale-95"
                style={{ background: primaryOrange }}
              >
                Explore Admissions
              </a>
              <a
                href="#contact"
                className="px-6 py-3 rounded-full border font-semibold flex items-center gap-2 transition-colors hover:bg-blue-50"
                style={{ borderColor: primaryBlue, color: primaryBlue }}
              >
                Contact Us <ArrowRight size={18} />
              </a>
            </div>

            {/* Key Stats */}
            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                { label: 'Students', value: '500+' },
                { label: 'Clubs', value: '16+' },
                { label: 'Awards', value: '100+' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-white shadow-sm p-4 text-center border border-slate-100">
                  <p className="text-2xl font-extrabold text-slate-900">{stat.value}</p>
                  <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="relative h-72 md:h-[420px] rounded-3xl bg-gradient-to-br from-blue-50 to-orange-50 shadow-inner border border-white">
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full blur-2xl opacity-40 pointer-events-none" style={{ background: primaryBlue }} />
            <div className="absolute -left-8 -bottom-8 h-40 w-40 rounded-full blur-2xl opacity-40 pointer-events-none" style={{ background: primaryOrange }} />
            <div className="absolute inset-4 rounded-3xl border border-white/80 overflow-hidden flex items-center justify-center shadow-lg">
              <ImageWithSkeleton
                src="/hero-image.png"
                alt="Quote background"
                className="absolute inset-0 h-full w-full"
                imageClassName="object-cover"
                fallbackClassName="bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200"
                loading="eager"
              />
              <div className="relative text-center p-6 rounded-2xl bg-white/80 backdrop-blur-md shadow-lg border border-white/60 max-w-sm">
                <p className="text-sm font-medium text-slate-900">“Bila kaum muda yang telah belajar di sekolah dan menganggap dirinya terlalu tinggi dan pintar untuk melebur dengan masyarakat yang bekerja dengan cangkul dan hanya memiliki cita-cita yang sederhana, maka lebih baik pendidikan itu tidak diberikan sama sekali.”</p>
                <p className="mt-2 font-bold text-slate-900 text-xs">— Tan Malaka</p>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================= */}
        {/* 5 PROGRAM PILL CARDS (EXACT MATCH FROM USER REFERENCE IMAGE) */}
        {/* ============================================================= */}
        <div className="pt-6 border-t border-slate-200/60">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {programCards.map((card) => {
              const IconComponent = card.icon;
              return (
                <div
                  key={card.id}
                  className="rounded-[22px] bg-white border border-slate-200/90 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-3.5 flex items-center gap-3.5"
                >
                  {/* Left Circle Icon Badge */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm ${card.circleBg}`}>
                    <IconComponent size={24} strokeWidth={2.2} />
                  </div>

                  {/* Vertical Divider */}
                  <div className="h-10 w-[1.5px] bg-slate-300/80 shrink-0" />

                  {/* Right Text Container */}
                  <div className="flex flex-col justify-center">
                    {card.titleLines.map((line, idx) => (
                      <span
                        key={idx}
                        className="font-extrabold text-[#002B66] text-xs sm:text-[0.78rem] tracking-wider leading-[1.2] uppercase font-sans"
                      >
                        {line}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
