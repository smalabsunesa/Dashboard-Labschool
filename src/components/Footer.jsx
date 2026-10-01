import React from 'react';
import { Phone, Instagram, Globe, GraduationCap, Mail, ArrowUpRight, ExternalLink } from 'lucide-react';

const contactChannels = [
  {
    id: 'whatsapp',
    title: 'WhatsApp Official',
    value: '+62 821-232-937-212',
    href: 'https://wa.me/62821232937212',
    description: 'Respon cepat untuk pertanyaan & layanan informasi',
    icon: Phone,
    iconBg: 'bg-emerald-500 text-white',
    hoverBorder: 'hover:border-emerald-400 hover:shadow-emerald-500/10',
    ctaText: 'Chat WhatsApp',
  },
  {
    id: 'instagram',
    title: 'Instagram Official',
    value: '@smalabschoolunesa.official',
    href: 'https://instagram.com/smalabschoolunesa.official',
    description: 'Dokumentasi acara, kegiatan & prestasi siswa',
    icon: Instagram,
    iconBg: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white',
    hoverBorder: 'hover:border-pink-400 hover:shadow-pink-500/10',
    ctaText: 'Kunjungi Instagram',
  },
  {
    id: 'website',
    title: 'Website Resmi',
    value: 'smalabschoolunesa1.sch.id',
    href: 'https://smalabschoolunesa1.sch.id',
    description: 'Portal informasi resmi SMA Labschool UNESA 1',
    icon: Globe,
    iconBg: 'bg-blue-600 text-white',
    hoverBorder: 'hover:border-blue-400 hover:shadow-blue-500/10',
    ctaText: 'Buka Website',
  },
  {
    id: 'ppdb',
    title: 'Pendaftaran PPDB',
    value: 'lynk.id/labschoolunesa',
    href: 'https://lynk.id/labschoolunesa/opj7kdqmrn7x',
    description: 'Portal resmi pendaftaran peserta didik baru 2026/2027',
    icon: GraduationCap,
    iconBg: 'bg-orange-500 text-white',
    hoverBorder: 'hover:border-orange-400 hover:shadow-orange-500/10',
    ctaText: 'Daftar PPDB Sekarang',
  },
  {
    id: 'email',
    title: 'Email Sekolah',
    value: 'smalabschoolunesa@gmail.com',
    href: 'mailto:smalabschoolunesa@gmail.com',
    description: 'Kirim surat resmi & administrasi sekolah',
    icon: Mail,
    iconBg: 'bg-indigo-600 text-white',
    hoverBorder: 'hover:border-indigo-400 hover:shadow-indigo-500/10',
    ctaText: 'Kirim Email',
  },
];

function BatikFooterBackground() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.07] pointer-events-none" aria-hidden="true">
      <defs>
        <pattern id="batikFooter" width="140" height="140" patternUnits="userSpaceOnUse">
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
      <rect width="100%" height="100%" fill="url(#batikFooter)" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-slate-200 bg-slate-900 text-slate-100" id="contact">
      <BatikFooterBackground />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <img
                src="/Labschool-UNESA-logo.svg"
                alt="Labschool Logo"
                className="h-10 w-auto bg-white p-1 rounded-md"
              />
              <span className="text-2xl font-extrabold text-white tracking-tight">
                SMA Labschool UNESA 1
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
              Pusat inovasi pendidikan berbasis digital yang menginspirasi peserta didik untuk tumbuh, berkarakter, dan berprestasi unggul.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>Jl. Citra Raya Unesa, Lakarsantri, Surabaya</span>
          </div>
        </div>

        {/* 5 Contact Cards Grid */}
        <div className="mb-14">
          <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Phone size={20} className="text-orange-500" /> Hubungi Saluran Resmi Kami
          </h4>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {contactChannels.map((channel) => {
              const IconComponent = channel.icon;
              return (
                <a
                  key={channel.id}
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative rounded-2xl border border-slate-800 bg-slate-800/60 backdrop-blur-sm p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 ${channel.hoverBorder}`}
                >
                  <div>
                    {/* Header Icon + Arrow */}
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2.5 rounded-xl shadow-md ${channel.iconBg}`}>
                        <IconComponent size={20} />
                      </div>
                      <ArrowUpRight size={16} className="text-slate-500 group-hover:text-white transition-colors" />
                    </div>

                    <h5 className="font-bold text-white text-sm group-hover:text-orange-400 transition-colors">
                      {channel.title}
                    </h5>
                    <p className="mt-1 text-xs font-semibold text-slate-300 break-all">
                      {channel.value}
                    </p>
                    <p className="mt-2 text-[0.7rem] text-slate-400 leading-relaxed line-clamp-2">
                      {channel.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-[0.7rem] font-bold text-orange-400 group-hover:text-orange-300">
                    <span>{channel.ctaText}</span>
                    <ExternalLink size={12} />
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Quick Links & Footer Bottom Copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-6">
            <a href="#home" className="hover:text-white transition-colors">Home</a>
            <a href="#news" className="hover:text-white transition-colors">News & Events</a>
            <a href="#about" className="hover:text-white transition-colors">About Us</a>
            <a href="#academic" className="hover:text-white transition-colors">Academic</a>
            <a href="#admissions" className="hover:text-white transition-colors">Admissions</a>
          </div>

          <p>© {new Date().getFullYear()} SMA Labschool UNESA 1. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
