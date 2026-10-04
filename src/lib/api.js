import { markdownToHtml } from './markdown';
import { fetcher } from './react-query/fetcher';
import { supabase, isSupabaseConfigured } from './supabase';

export const API_BASE = import.meta.env.VITE_API_BASE || '';
export const API_TOKEN = import.meta.env.VITE_SOFTEASE_TOKEN || '';
export const AUTH_HEADERS = API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {};

const FAQ_ENDPOINT = API_BASE ? `${API_BASE}/api/smal-faqs` : '';
const NEWS_ENDPOINT = API_BASE ? `${API_BASE}/api/smal-updates?populate=*` : '';
const INQUIRY_ENDPOINT = API_BASE ? `${API_BASE}/api/smal-inquiries` : '';

// Built-in fallback data for zero-downtime deployment previews
const FALLBACK_FAQS = [
  {
    id: 'faq-1',
    question: 'Bagaimana cara mendaftar di SMA Labschool Unesa 1?',
    answerHtml: '<p>Pendaftaran dapat dilakukan secara online melalui website resmi atau langsung datang ke bagian Pendaftaran Peserta Didik Baru (PPDB) di kampus SMA Labschool Unesa 1.</p>',
  },
  {
    id: 'faq-2',
    question: 'Apa saja program keunggulan sekolah?',
    answerHtml: '<p>Kami menyediakan program pembelajaran berbasis digital, kurikulum internasional, bimbingan persiapan PTN unggulan, serta berbagai kegiatan ekstrakurikuler prestasi.</p>',
  },
  {
    id: 'faq-3',
    question: 'Apakah tersedia fasilitas beasiswa?',
    answerHtml: '<p>Ya, SMA Labschool Unesa 1 menyediakan jalur beasiswa prestasi akademik, non-akademik, serta beasiswa bantuan pendidikan.</p>',
  },
];

const FALLBACK_NEWS = [
  {
    id: 'update-1',
    title: 'Penerimaan Peserta Didik Baru (PPDB) T.A 2026/2027',
    caption: 'Pendaftaran gelombang pertama resmi dibuka! Dapatkan jalur khusus beasiswa prestasi dan potongan biaya pendidikan bagi pendaftar awal.',
    hashtags: '#PPDB2026 #SMALabschoolUnesa #PrestasiJuara #BeasiswaUnggulan',
    publishedAt: 'AUG 28, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'PPDB SMA Labschool Unesa',
    tag: 'SPMB & BEASISWA',
    isSpotlight: true,
  },
  {
    id: 'update-2',
    title: 'Prestasi Gemilang Siswa di Olimpiade Sains Nasional 2026',
    caption: 'Selamat kepada tim sains SMA Labschool Unesa 1 yang berhasil memboyong medali emas dalam OSN 2026 bidang Fisika dan Informatika.',
    hashtags: '#OSN2026 #SiswaBerprestasi #LabschoolJuara #GenerasiEmas',
    publishedAt: 'AUG 20, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Siswa Berprestasi OSN',
    tag: 'PRESTASI JUARA',
    isSpotlight: true,
  },
  {
    id: 'update-3',
    title: 'Peresmian Smart Digital Hub & Laboratorium AI Robotik',
    caption: 'SMA Labschool UNESA 1 resmi meluncurkan fasilitas pembelajaran kecerdasan buatan (AI) dan robotika canggih untuk mendukung Kurikulum Merdeka.',
    hashtags: '#DigitalLearning #Robotik #AIinEducation #InnovateWithLabschool',
    publishedAt: 'SEP 10, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Laboratorium Digital Hub',
    tag: 'INNOVATION HUB',
    isSpotlight: true,
  },
  {
    id: 'update-4',
    title: 'Program Cultural Exchange Sister School Australia',
    caption: 'Delegasi siswa SMA Labschool UNESA 1 berpartisipasi dalam program pertukaran budaya dan pembelajaran global bersama sekolah mitra di Melbourne.',
    hashtags: '#SisterSchool #GlobalExchange #InternationalProgram',
    publishedAt: 'SEP 18, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Pertukaran Pelajar Australia',
    tag: 'GLOBAL EXPERIENCE',
    isSpotlight: false,
  },
];

export function buildMediaUrl(path = '') {
  if (!path) return null;
  
  // Auto-convert Google Drive file view links to direct image CDN URLs
  const gDriveMatch = path.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/);
  if (gDriveMatch && gDriveMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${gDriveMatch[1]}`;
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return API_BASE ? `${API_BASE}${path}` : path;
}

export function formatPublishedDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export async function fetchFaqs(signal) {
  // Option 1: Supabase Integration
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('smal_faqs')
        .select('*')
        .order('id', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((entry, index) => ({
          id: entry.id ?? `faq-${index}`,
          question: entry.question?.trim() || 'Untitled question',
          answerHtml: markdownToHtml(entry.answer || ''),
        }));
      }
    } catch (err) {
      console.warn('Supabase fetchFaqs failed, checking REST API fallback...', err);
    }
  }

  // Option 2: REST API / Strapi Integration
  if (FAQ_ENDPOINT) {
    try {
      const payload = await fetcher(FAQ_ENDPOINT, { signal });
      if (payload?.data && payload.data.length > 0) {
        return payload.data.map((entry, index) => {
          const attributes = entry?.attributes ?? {};
          return {
            id: entry?.id ?? `faq-${index}`,
            question: attributes.question?.trim() || 'Untitled question',
            answerHtml: markdownToHtml(attributes.answer ?? ''),
          };
        });
      }
    } catch (err) {
      if (err.name === 'AbortError') throw err;
      console.warn('REST API fetchFaqs failed, using fallback data...', err);
    }
  }

  // Option 3: Fallback Data
  return FALLBACK_FAQS;
}

export async function fetchNews(signal) {
  // Option 1: Supabase Integration
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('smal_updates')
        .select('*')
        .order('id', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((entry, index) => ({
          id: entry.id ?? `update-${index}`,
          title: entry.title?.trim() || 'Latest update',
          caption: entry.caption?.trim() || '',
          hashtags: entry.hashtags?.trim() || '',
          publishedAt: entry.published_at || formatPublishedDate(entry.created_at),
          imageUrl: entry.image_url || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop',
          imageAlt: entry.image_alt || entry.title || 'School news update',
        }));
      }
    } catch (err) {
      console.warn('Supabase fetchNews failed, checking REST API fallback...', err);
    }
  }

  // Option 2: REST API / Strapi Integration
  if (NEWS_ENDPOINT) {
    try {
      const payload = await fetcher(NEWS_ENDPOINT, { signal });
      if (payload?.data && payload.data.length > 0) {
        return payload.data.map((entry, index) => {
          const attributes = entry?.attributes ?? {};
          const mediaAttr = attributes.imageSrc?.data?.attributes ?? {};
          const imageUrl = buildMediaUrl(
            mediaAttr?.formats?.small?.url ||
            mediaAttr?.formats?.thumbnail?.url ||
            mediaAttr?.url
          );

          return {
            id: entry?.id ?? `update-${index}`,
            title: attributes.title?.trim() || 'Latest update',
            caption: attributes.caption?.trim() || '',
            hashtags: attributes.hashtags?.trim() || '',
            publishedAt: formatPublishedDate(attributes.publishedAt),
            imageUrl,
            imageAlt: mediaAttr?.alternativeText || attributes.title || 'School news update',
          };
        });
      }
    } catch (err) {
      if (err.name === 'AbortError') throw err;
      console.warn('REST API fetchNews failed, using fallback data...', err);
    }
  }

  // Option 3: Fallback Data
  return FALLBACK_NEWS;
}

export async function createInquiry(payload) {
  // Option 1: Supabase Integration
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('smal_inquiries')
      .insert([{ name: payload.name, email: payload.email, message: payload.message }]);

    if (error) {
      throw new Error(error.message || 'Failed to submit inquiry to Supabase.');
    }
    return { success: true, data };
  }

  // Option 2: REST API / Strapi Integration
  if (INQUIRY_ENDPOINT) {
    if (!API_TOKEN) {
      throw new Error('API token is not configured.');
    }

    const result = await fetcher(INQUIRY_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...AUTH_HEADERS,
      },
      body: JSON.stringify({ data: payload }),
    });

    if (result?.error) {
      const message = result?.error?.message || 'Failed to submit your request. Please try again later.';
      throw new Error(message);
    }

    return result;
  }

  // Option 3: Demo fallback success
  return { success: true, message: 'Inquiry received in demo mode.' };
}

export async function fetchFaculty() {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('smal_faculty').select('*').order('id', { ascending: true });
    if (!error && data) return data;
  }
  return [
    { id: 'fac-1', name: 'Dr. Budi Santoso', role: 'Kepala Sekolah', subject: 'Manajemen Pendidikan', image_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400' },
    { id: 'fac-2', name: 'Siti Aminah, M.Pd', role: 'Wakil Kepala Sekolah', subject: 'Biologi', image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400' },
    { id: 'fac-3', name: 'Ahmad Faisal, S.T', role: 'Guru Penggerak', subject: 'Koding & AI', image_url: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=400' },
  ];
}

export async function fetchActivities() {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('smal_activities').select('*').order('id', { ascending: false });
    if (!error && data) return data;
  }
  return [
    { id: 'act-1', title: 'Study Excursion ke Jepang', tag: 'Kunjungan Internasional', event_date: 'Okt 2026', description: 'Kunjungan siswa SKS ke Universitas di Tokyo.', image_url: 'https://images.unsplash.com/photo-1542013861-12a843e9900c?q=80&w=400' },
    { id: 'act-2', title: 'Kompetisi Debat Nasional', tag: 'Prestasi Akademik', event_date: 'Sep 2026', description: 'Tim debat SMA Labschool meraih juara nasional.', image_url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=400' },
  ];
}

export async function fetchExtracurriculars() {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('smal_extracurriculars').select('*').order('id', { ascending: true });
    if (!error && data) return data;
  }
  return [
    { id: 'ex-1', name: 'Pramuka', category: 'Wajib', description: 'Ekstrakurikuler wajib untuk seluruh binaan sekolah.', image_url: 'https://images.unsplash.com/photo-1576135245831-7bcab06b4ff0?q=80&w=400' },
    { id: 'ex-2', name: 'Tari', category: 'Seni', description: 'Mengembangkan bakat seni tari tradisional dan modern.', image_url: 'https://images.unsplash.com/photo-1508700922718-d4567acfa2d0?q=80&w=400' },
    { id: 'ex-3', name: 'Basket', category: 'Olahraga', description: 'Tim bola basket kebanggaan SMA Labschool.', image_url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=400' },
    { id: 'ex-4', name: 'Robotika', category: 'Teknologi', description: 'Eksplorasi pembuatan robot dan IoT.', image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=400' },
  ];
}

export async function fetchSettings() {
  const FALLBACK_SETTINGS = {
    school_name: 'SMA Labschool UNESA 1',
    school_address: 'Jl. Citra Raya Unesa, Lakarsantri, Surabaya',
    principal_name: 'Kepala Sekolah',
    principal_message: 'Mendidik dengan karakter, menginspirasi dengan inovasi. Selamat datang di portal resmi SMA Labschool UNESA 1. Kami berkomitmen mencetak generasi cerdas, berkarakter unggul, dan siap menghadapi tantangan masa depan melalui program pendidikan inovatif dan bertaraf global.',
    profile_summary: 'Kami adalah institusi pendidikan menengah tingkat atas yang berada di bawah naungan Yayasan Universitas Negeri Surabaya (UNESA). Dikenal dengan sebutan "School of Character", kami tidak hanya mengedepankan prestasi akademik, namun juga menjunjung tinggi nilai-nilai budi pekerti luhur.',
    
    // Admissions (PPDB) Settings
    admission_bridging_title: 'Investasi Terbaik untuk Masa Depan Anak Anda',
    admission_bridging_desc: 'Bergabunglah dengan komunitas pelajar unggulan yang tidak hanya cerdas secara akademik, tetapi juga berkarakter, berdaya saing global, dan siap memimpin di era digital.',
    admission_poster_url: '/spmb.png',
    admission_flow_image_url: '',
    admission_register_url: 'https://lynk.id/labschoolunesa/opj7kdqmrn7x',
    admission_discounts_json: JSON.stringify([
      { label: 'Alumni SMP Labschool UNESA', value: '25%', color: 'bg-blue-50 border-blue-200 text-blue-700' },
      { label: 'Mendaftar 2 anak kandung / bersaudara di Labschool UNESA', value: '25%', color: 'bg-purple-50 border-purple-200 text-purple-700' },
      { label: 'Anak kandung Dosen / Karyawan UNESA', value: '20%', color: 'bg-slate-50 border-slate-200 text-slate-700' },
      { label: 'Juara Internasional (Peringkat 1–3)', value: '30%', color: 'bg-amber-50 border-amber-200 text-amber-700' },
      { label: 'Juara Nasional (Peringkat 1–3)', value: '20%', color: 'bg-orange-50 border-orange-200 text-orange-700' },
      { label: 'Juara Daerah / Propinsi (Peringkat 1–3)', value: '10%', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
    ]),

    // Social Media & Contact Settings
    contact_whatsapp_num: '+62 821-232-937-212',
    contact_whatsapp_url: 'https://wa.me/62821232937212',
    contact_instagram_handle: '@smalabschoolunesa.official',
    contact_instagram_url: 'https://instagram.com/smalabschoolunesa.official',
    contact_email: 'smalabschoolunesa@gmail.com',
    contact_website_url: 'https://smalabschoolunesa1.sch.id',
    contact_tiktok_url: 'https://tiktok.com/@smalabschoolunesa',
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('smal_settings').select('key, value');
    if (!error && data && data.length > 0) {
      const merged = { ...FALLBACK_SETTINGS };
      data.forEach(item => {
        if (item.key && merged[item.key] !== undefined) {
          merged[item.key] = item.value;
        } else if (item.key) {
          merged[item.key] = item.value;
        }
      });
      return merged;
    }
  }
  return FALLBACK_SETTINGS;
}
