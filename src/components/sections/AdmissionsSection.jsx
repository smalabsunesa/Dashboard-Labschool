import React from 'react';
import {
  HelpCircle, ChevronDown, CheckCircle2, Sparkles, ArrowRight, Star,
  Gift, ClipboardList, UserCheck, FileText, CreditCard, GraduationCap,
  ExternalLink, BadgePercent, Trophy, Users, Building2
} from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import Skeleton from '../common/Skeleton';
import ImageWithSkeleton from '../common/ImageWithSkeleton';
import useFaqs from '../../hooks/useFaqs';

const admissionsPosterSrc = '/spmb.png';
const registerNowHref = 'https://lynk.id/labschoolunesa/opj7kdqmrn7x';

const whyChooseUs = [
  { icon: GraduationCap, title: 'Kurikulum SKS Fleksibel', desc: 'Selesaikan studi sesuai kemampuan dengan Sistem Kredit Semester yang inovatif.' },
  { icon: Users, title: 'Sekolah 5 Bahasa', desc: 'Kuasai Bahasa Inggris, Jepang, Mandarin, Arab & Indonesia sejak dini.' },
  { icon: Building2, title: 'Fasilitas Digital & Modern', desc: 'Smart Classroom, Lab AI & Robotika, serta ekosistem belajar berbasis teknologi.' },
  { icon: Trophy, title: 'Prestasi Berkarakter', desc: 'Ratusan prestasi akademik, sains, seni, & olahraga di kancah nasional-internasional.' },
  { icon: Star, title: 'Sister School Internasional', desc: 'Program pertukaran pelajar & kolaborasi dengan sekolah mitra di Australia & Asia.' },
  { icon: Sparkles, title: 'School of Character', desc: 'Pembentukan akhlak mulia, jiwa kepemimpinan, dan etos wirausaha sejak tahap awal.' },
];

const registrationFlow = [
  { step: '01', icon: FileText, title: 'Isi Formulir Online', desc: 'Daftarkan diri melalui portal PPDB resmi SMA Labschool UNESA 1.' },
  { step: '02', icon: ClipboardList, title: 'Unggah Dokumen', desc: 'Upload rapor, sertifikat prestasi, & dokumen persyaratan yang dibutuhkan.' },
  { step: '03', icon: UserCheck, title: 'Seleksi & Tes', desc: 'Ikuti tes potensi & wawancara untuk penjurusan dan program khusus.' },
  { step: '04', icon: CreditCard, title: 'Pengumuman & Daftar Ulang', desc: 'Cek pengumuman hasil seleksi dan selesaikan proses daftar ulang.' },
];

const discounts = [
  { label: 'Alumni SMP Labschool UNESA', value: '25%', icon: GraduationCap, color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { label: 'Mendaftar 2 anak kandung / bersaudara di Labschool UNESA', value: '25%', icon: Users, color: 'bg-purple-50 border-purple-200 text-purple-700' },
  { label: 'Anak kandung Dosen / Karyawan UNESA', value: '20%', icon: Building2, color: 'bg-slate-50 border-slate-200 text-slate-700' },
  { label: 'Juara Internasional (Peringkat 1–3)', value: '30%', icon: Trophy, color: 'bg-amber-50 border-amber-200 text-amber-700' },
  { label: 'Juara Nasional (Peringkat 1–3)', value: '20%', icon: Trophy, color: 'bg-orange-50 border-orange-200 text-orange-700' },
  { label: 'Juara Daerah / Propinsi (Peringkat 1–3)', value: '10%', icon: Trophy, color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
];

const fallbackFaqs = [
  { id: 1, question: 'Apa saja syarat pendaftaran PPDB SMA Labschool UNESA 1?', answerHtml: '<p>Calon peserta didik wajib menyerahkan: ijazah/SKL SMP, rapor semester 1–5, pas foto 3×4, akta kelahiran, dan kartu keluarga. Sertifikat prestasi (jika ada) dapat dilampirkan untuk memperoleh diskon biaya.</p>' },
  { id: 2, question: 'Apakah ada jalur selain reguler (rapor)?', answerHtml: '<p>Ya! Tersedia jalur <strong>Prestasi</strong> bagi siswa berprestasi di bidang akademik, sains, seni, maupun olahraga di tingkat regional hingga internasional. Hubungi panitia PPDB untuk informasi lebih lanjut.</p>' },
  { id: 3, question: 'Kapan batas waktu pendaftaran PPDB?', answerHtml: '<p>Pendaftaran PPDB gelombang 1 dibuka mulai <strong>1 November 2025</strong> dan ditutup <strong>31 Januari 2026</strong>. Gelombang 2 dibuka pada Februari–Maret 2026 (tergantung kuota yang tersedia).</p>' },
  { id: 4, question: 'Apakah ada biaya pendaftaran?', answerHtml: '<p>Biaya pendaftaran bersifat terjangkau dan dapat dibayarkan melalui transfer bank atau metode pembayaran digital yang tersedia di portal resmi PPDB. Detail nominal dapat ditanyakan kepada panitia PPDB.</p>' },
  { id: 5, question: 'Apakah diskon biaya bisa digabungkan?', answerHtml: '<p>Diskon bersifat <strong>tidak kumulatif</strong> — hanya satu diskon tertinggi yang berlaku. Pastikan melampirkan bukti/dokumen yang relevan saat pendaftaran.</p>' },
];

function FAQItem({ item, index, isOpen, onToggle }) {
  const contentRef = React.useRef(null);
  const [contentHeight, setContentHeight] = React.useState(0);

  React.useEffect(() => {
    if (!contentRef.current) return;
    const updateHeight = () => setContentHeight(contentRef.current.scrollHeight);
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [item.answerHtml]);

  React.useEffect(() => {
    if (!contentRef.current) return;
    setContentHeight(contentRef.current.scrollHeight);
  }, [isOpen]);

  return (
    <div className={`border-b border-slate-100 last:border-b-0 transition-colors ${isOpen ? 'bg-orange-50/40' : 'hover:bg-slate-50/70'}`}>
      <dt>
        <button
          type="button"
          className="w-full px-6 py-4 flex items-center justify-between text-left text-sm font-semibold text-slate-800 transition-colors"
          aria-expanded={isOpen}
          aria-controls={`faq-panel-${index}`}
          onClick={onToggle}
        >
          <span className="flex items-center gap-3">
            <span className={`w-6 h-6 rounded-full text-[0.65rem] font-extrabold flex items-center justify-center shrink-0 ${isOpen ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
              {index + 1}
            </span>
            {item.question}
          </span>
          <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 shrink-0 ml-3 ${isOpen ? 'rotate-180 text-orange-500' : ''}`} />
        </button>
      </dt>
      <dd
        id={`faq-panel-${index}`}
        aria-hidden={!isOpen}
        className="px-6 overflow-hidden text-sm text-slate-600 transition-all duration-300 ease-in-out"
        style={{ maxHeight: isOpen ? `${contentHeight}px` : '0px', paddingBottom: isOpen ? '1rem' : '0rem' }}
      >
        <div
          ref={contentRef}
          className="pb-4 pl-9 space-y-2 text-sm leading-relaxed text-slate-600"
          dangerouslySetInnerHTML={{ __html: item.answerHtml }}
        />
      </dd>
    </div>
  );
}

export default function AdmissionsSection() {
  const { data: faqItemsRaw, loading: faqLoading, error: faqError } = useFaqs();
  const faqItems = faqItemsRaw && faqItemsRaw.length > 0 ? faqItemsRaw : fallbackFaqs;
  const [openFaq, setOpenFaq] = React.useState(0);

  return (
    <SectionWrapper id="admissions" title="Admissions (PPDB)">
      <div className="space-y-14">

        {/* ========================================================= */}
        {/* 1. BRIDGING — KENAPA HARUS PILIH KAMI?                    */}
        {/* ========================================================= */}
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide bg-orange-100 text-orange-600 mb-3">
              <Sparkles size={13} /> Mengapa SMA Labschool UNESA 1?
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Investasi Terbaik untuk Masa Depan Anak Anda
            </h3>
            <p className="mt-2 text-sm sm:text-base text-slate-500 leading-relaxed">
              Bergabunglah dengan komunitas pelajar unggulan yang tidak hanya cerdas secara akademik, tetapi juga berkarakter, berdaya saing global, dan siap memimpin di era digital.
            </p>
          </div>

          {/* Why Choose Us Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyChooseUs.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-orange-300 transition-all duration-300 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 group-hover:bg-orange-500 group-hover:border-orange-500 transition-colors">
                    <Icon size={20} className="text-orange-500 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. PPDB POSTER + DIRECT LINK BUTTON                       */}
        {/* ========================================================= */}
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Poster */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-slate-100 aspect-[4/5] max-h-[600px]">
            <ImageWithSkeleton
              src={admissionsPosterSrc}
              alt="Poster PPDB SMA Labschool UNESA 1"
              className="w-full h-full"
              imageClassName="object-cover w-full h-full"
              fallbackClassName="bg-slate-200"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent" />
          </div>

          {/* CTA & Info */}
          <div className="space-y-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide bg-blue-100 text-blue-700 mb-3">
                PPDB 2025 / 2026
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Daftarkan Putra-Putri Anda Sekarang
              </h3>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                Jumlah kursi terbatas! Segera daftarkan putra-putri Anda melalui portal PPDB resmi kami dan pastikan posisi mereka di sekolah terbaik Surabaya.
              </p>
            </div>

            {/* Checklist */}
            <div className="space-y-2.5">
              {[
                'Proses pendaftaran 100% online & mudah',
                'Tersedia jalur Reguler, Prestasi & Beasiswa',
                'Pengumuman hasil cepat & transparan',
                'Layanan informasi siap setiap hari kerja',
              ].map((point) => (
                <div key={point} className="flex items-center gap-3 text-sm text-slate-700">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={registerNowHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-sm shadow-lg hover:shadow-orange-300/50 hover:-translate-y-0.5 transition-all"
              >
                <ExternalLink size={16} />
                Daftar PPDB Sekarang
                <ArrowRight size={16} />
              </a>
              <a
                href="https://wa.me/6282132937212"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white border-2 border-slate-200 text-slate-800 font-extrabold text-sm hover:border-orange-400 hover:text-orange-600 transition-all"
              >
                Tanya via WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. ALUR PENDAFTARAN (FLOW DIAGRAM VISUAL)                 */}
        {/* ========================================================= */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide bg-slate-900 text-white mb-3">
              Alur Pendaftaran PPDB
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900">4 Langkah Mudah Bergabung</h3>
          </div>

          <div className="relative">
            {/* Connector line (desktop) */}
            <div className="hidden lg:block absolute top-14 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-orange-200 via-orange-400 to-orange-200 z-0" />

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {registrationFlow.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-200">
                        <Icon size={28} className="text-white" />
                      </div>
                      <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-slate-900 text-white text-[0.6rem] font-extrabold flex items-center justify-center shadow">
                        {step.step}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{step.title}</h4>
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4. INFORMASI DISKON & BEASISWA                            */}
        {/* ========================================================= */}
        <div className="rounded-3xl border-2 border-amber-200/80 bg-gradient-to-br from-amber-50/60 via-white to-orange-50/40 p-6 sm:p-8 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide bg-amber-500 text-white mb-2">
                <BadgePercent size={14} /> Diskon & Keringanan Biaya
              </span>
              <h3 className="text-xl font-extrabold text-slate-900">Program Diskon SPP & Uang Gedung</h3>
              <p className="text-xs text-slate-500 mt-0.5">*Diskon tidak bersifat kumulatif. Berlaku untuk satu kategori tertinggi.</p>
            </div>
            <Gift size={40} className="text-amber-400 shrink-0 hidden sm:block" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {discounts.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className={`flex items-center gap-4 p-4 rounded-2xl border ${item.color}`}>
                  <div className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center shrink-0 shadow-sm">
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold leading-tight">{item.label}</p>
                  </div>
                  <span className="text-lg font-extrabold shrink-0">{item.value}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 5. FAQ — PERTANYAAN YANG SERING DITANYAKAN                */}
        {/* ========================================================= */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-5 bg-slate-50/60">
            <p className="font-extrabold text-slate-900 flex items-center gap-2 text-lg">
              <HelpCircle size={20} className="text-orange-500" />
              Pertanyaan yang Sering Ditanyakan (FAQ)
            </p>
            <p className="text-sm text-slate-500 mt-0.5">Jawaban cepat untuk orang tua & calon peserta didik SMA Labschool UNESA 1.</p>
          </div>
          <dl>
            {faqLoading && (
              <div className="px-6 py-5 space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={`faq-skeleton-${index}`} className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ))}
              </div>
            )}
            {!faqLoading && faqItems.map((item, index) => (
              <FAQItem
                key={item.id}
                item={item}
                index={index}
                isOpen={openFaq === index}
                onToggle={() => setOpenFaq(openFaq === index ? null : index)}
              />
            ))}
          </dl>
        </div>

      </div>
    </SectionWrapper>
  );
}
