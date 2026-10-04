import React from 'react';
import { Phone, Instagram, Globe, GraduationCap, Mail, ExternalLink, ArrowUpRight } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import { useQuery } from '@tanstack/react-query';
import { fetchSettings } from '../../lib/api';

export default function ContactSection() {
  const { data: settings = {} } = useQuery({ queryKey: ['settings'], queryFn: fetchSettings });

  const contactChannels = [
    {
      id: 'whatsapp',
      title: 'WhatsApp Official',
      value: settings.contact_whatsapp_num || '+62 821-232-937-212',
      href: settings.contact_whatsapp_url || 'https://wa.me/62821232937212',
      description: 'Respon cepat untuk pertanyaan & layanan informasi sekolah',
      icon: Phone,
      badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
      iconBg: 'bg-emerald-500 text-white',
      hoverBorder: 'hover:border-emerald-300 hover:shadow-emerald-500/10',
      ctaText: 'Chat WhatsApp',
    },
    {
      id: 'instagram',
      title: 'Instagram Official',
      value: settings.contact_instagram_handle || '@smalabschoolunesa.official',
      href: settings.contact_instagram_url || 'https://instagram.com/smalabschoolunesa.official',
      description: 'Update kegiatan, dokumentasi acara & prestasi siswa',
      icon: Instagram,
      badgeColor: 'bg-pink-500/10 text-pink-600 border-pink-200',
      iconBg: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white',
      hoverBorder: 'hover:border-pink-300 hover:shadow-pink-500/10',
      ctaText: 'Kunjungi Instagram',
    },
    {
      id: 'website',
      title: 'Website Resmi',
      value: settings.contact_website_url ? settings.contact_website_url.replace(/^https?:\/\//, '') : 'smalabschoolunesa1.sch.id',
      href: settings.contact_website_url || 'https://smalabschoolunesa1.sch.id',
      description: 'Portal informasi resmi SMA Labschool UNESA 1',
      icon: Globe,
      badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-200',
      iconBg: 'bg-blue-600 text-white',
      hoverBorder: 'hover:border-blue-300 hover:shadow-blue-500/10',
      ctaText: 'Buka Website',
    },
    {
      id: 'ppdb',
      title: 'Pendaftaran PPDB',
      value: settings.admission_register_url ? settings.admission_register_url.replace(/^https?:\/\//, '') : 'lynk.id/labschoolunesa',
      href: settings.admission_register_url || 'https://lynk.id/labschoolunesa/opj7kdqmrn7x',
      description: 'Portal resmi pendaftaran peserta didik baru 2026/2027',
      icon: GraduationCap,
      badgeColor: 'bg-orange-500/10 text-orange-600 border-orange-200',
      iconBg: 'bg-orange-500 text-white',
      hoverBorder: 'hover:border-orange-300 hover:shadow-orange-500/10',
      ctaText: 'Daftar PPDB Sekarang',
    },
    {
      id: 'email',
      title: 'Email Sekolah',
      value: settings.contact_email || 'smalabschoolunesa@gmail.com',
      href: `mailto:${settings.contact_email || 'smalabschoolunesa@gmail.com'}`,
      description: 'Kirim surat resmi, penawaran kerjasama, & administrasi',
      icon: Mail,
      badgeColor: 'bg-indigo-500/10 text-indigo-600 border-indigo-200',
      iconBg: 'bg-indigo-600 text-white',
      hoverBorder: 'hover:border-indigo-300 hover:shadow-indigo-500/10',
      ctaText: 'Kirim Email',
    },
  ];

  return (
    <SectionWrapper id="contact" title="Contact Us">
      <div className="mb-8 max-w-2xl">
        <h3 className="text-xl font-bold text-slate-900">Hubungi {settings.school_name || 'SMA Labschool UNESA 1'}</h3>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          Silakan hubungi kami melalui saluran komunikasi resmi di bawah ini untuk konsultasi pendaftaran, pertanyaan akademik, maupun informasi sekolah.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {contactChannels.map((channel) => {
          const IconComponent = channel.icon;
          return (
            <a
              key={channel.id}
              href={channel.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between ${channel.hoverBorder}`}
            >
              <div>
                {/* Header Icon + External Arrow */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl shadow-sm ${channel.iconBg}`}>
                    <IconComponent size={24} />
                  </div>
                  <span className="p-2 rounded-full text-slate-400 group-hover:text-slate-900 group-hover:bg-slate-100 transition-all">
                    <ArrowUpRight size={18} />
                  </span>
                </div>

                {/* Channel Title & Value */}
                <h4 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                  {channel.title}
                </h4>
                <p className="mt-1 text-sm font-semibold text-slate-800 break-all">
                  {channel.value}
                </p>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  {channel.description}
                </p>
              </div>

              {/* Action Link Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700 group-hover:text-slate-900">
                <span>{channel.ctaText}</span>
                <ExternalLink size={14} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
              </div>
            </a>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
