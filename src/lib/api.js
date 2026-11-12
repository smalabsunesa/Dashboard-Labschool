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
  
  // Auto-convert any Google Drive link format to direct image CDN URLs
  const gDriveMatch = path.match(/(?:drive|docs)\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:[^&]+&)*id=|thumbnail\?id=)([a-zA-Z0-9_-]+)/);
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

// Built-in 5 Featured Programs Fallback Data
export const FALLBACK_PROGRAMS = [
  {
    id: 'prog-1',
    slug: 'sks',
    title: 'Sistem Kredit Semester (SKS)',
    badge_text: 'Kurikulum Fleksibel & Akseleratif',
    description: 'Sistem pembelajaran adaptif yang memungkinkan siswa cerdas istimewa menyelesaikan masa studi dalam 4-5 semester (2 tahun) atau 6 semester (3 tahun reguler), sesuai bakat dan kecepatan belajar mandiri.',
    full_content: `Program Sistem Kredit Semester (SKS) di SMA Labschool UNESA 1 dirancang khusus untuk mengakomodasi keberagaman ritme belajar setiap siswa. Melalui kurikulum berbasis unit kegiatan belajar mandiri (UKBM), peserta didik yang memiliki kecepatan belajar tinggi dapat mengambil beban studi lebih cepat tanpa mengabaikan pemahaman konsep.\n\nSiswa didampingi oleh Guru Pembimbing Akademik (GPA) berpengalaman yang memetakan perkembangan kompetensi secara berkala. Siswa tidak perlu khawatir terbebani karena sistem penugasan dan evaluasi bersifat personal sesuai kapasitas masing-masing siswa.`,
    image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200',
    circle_bg: 'bg-[#002B66]',
    moments: [],
  },
  {
    id: 'prog-2',
    slug: 'bahasa',
    title: 'Sekolah 5 Bahasa & Pre-University',
    badge_text: 'Komunikasi Global & Jalur Kuliah Bahasa',
    description: 'Penguasaan 5 bahasa strategis (Indonesia, Inggris, Jepang, Mandarin, Arab) yang terintegrasi dengan bimbingan persiapan masuk PTN & Beasiswa Luar Negeri untuk rumpun ilmu bahasa dan humaniora.',
    full_content: `Program Sekolah 5 Bahasa dan Pre-University Class dipadukan secara terpadu di SMA Labschool UNESA 1. Karena jalur kuliah dan karier global bidang bahasa memerlukan persiapan yang matang, kurikulum kami memfasilitasi penguasaan bahasa secara bertahap lengkap dengan sertifikasi resmi internasional (TOEFL, JLPT, HSK).\n\nSiswa dibimbing memilih bahasa peminatan, dilatih langsung oleh pengajar berpengalaman dan penutur asli (native speaker), serta mendapatkan pendampingan portofolio dan wawancara untuk tembus perguruan tinggi impian.`,
    image_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1200',
    circle_bg: 'bg-[#F59E0B]',
    available_languages: [
      { name: 'Bahasa Inggris', level: 'EAP, TOEFL & IELTS Preparation', target: 'Skor TOEFL 550+ / IELTS 6.5+', desc: 'Fokus pada academic writing, presentasi ilmiah, debate, dan persiapan kuliah luar negeri.' },
      { name: 'Bahasa Jepang', level: 'JLPT N5 - N3 & Budaya Jepang', target: 'Sertifikasi Resmi JLPT N4/N3', desc: 'Penguasaan huruf Hiragana, Katakana, Kanji, tata bahasa, dan persiapan beasiswa studi ke Jepang.' },
      { name: 'Bahasa Mandarin', level: 'HSK Level 1 - 4 & Percakapan', target: 'Sertifikasi Resmi HSK 3 - 4', desc: 'Percakapan praktis, penulisan Hanzi, etika bisnis Tionghoa, dan peluang beasiswa di Taiwan/Tiongkok.' },
      { name: 'Bahasa Arab', level: 'Komunikasi Fusha & Kaidah Linguistik', target: 'Kecakapan Berbicara & Literasi', desc: 'Pemahaman kaidah bahasa Arab komunikatif modern dan persiapan studi Timur Tengah.' },
      { name: 'Bahasa Indonesia', level: 'Jurnalistik, Riset & Karya Sastra', target: 'Penulisan Kritis & Lomba Debat', desc: 'Pengasahan retorika pidato, esai ilmiah seleksi SNBP PTN, dan apresiasi karya sastra tingkat lanjut.' },
    ],
    ongoing_programs: [
      { title: 'Kelas Intensif Sertifikasi Bahasa Resmi (TOEFL / JLPT / HSK)', status: 'Berjalan Setiap Semester', desc: 'Bimbingan terstruktur bersama lembaga sertifikasi terakreditasi sehingga setiap siswa mengantongi sertifikat bahasa internasional sebelum kelulusan.' },
      { title: 'Pre-University Pathway: Bimbingan Jurusan Bahasa & Hubungan Internasional', status: 'Aktif Sepanjang Tahun', desc: 'Bimbingan khusus pemetaan program studi sastra, linguistik, hubungan internasional, komunikasi, dan diplomasi di PTN favorit serta kampus luar negeri.' },
      { title: 'Language Immersion Camp & Native Speaker Days', status: 'Agenda Semesteran', desc: 'Kemah pembelajaran bahasa selama 3 hari dengan aturan 100% berbahasa asing, didampingi oleh relawan dan akademisi penutur asli.' },
      { title: 'Model United Nations & Global Debate Society', status: 'Klub Mingguan', desc: 'Simulasi sidang diplomasi PBB berbahasa Inggris guna melatih kemampuan negosiasi, riset isu geopolitik dunia, dan pemecahan masalah global.' },
    ],
    moments: [
      { url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800', caption: 'Pentas budaya dan pidato multi-bahasa siswa' },
      { url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800', caption: 'Workshop interaktif bersama penutur asli (Native Speaker)' },
      { url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800', caption: 'Simulasi konferensi internasional Model UN berbahasa asing' },
    ],
  },
  {
    id: 'prog-3',
    slug: 'digital',
    title: 'Digital Learning & AI Hub',
    badge_text: 'Fasilitas Modern & Kurikulum AI',
    description: 'Ekosistem belajar modern terintegrasi platform digital, Smart Classroom, Lab Robotika, Coding, IoT, serta literasi pemanfaatan Artificial Intelligence (AI) secara etis dan kreatif.',
    full_content: `Mempersiapkan generasi masa depan di era digital, sekolah menyediakan sarana Smart Classroom interaktif, Laboratorium Robotika & AI, serta sistem Learning Management System (LMS) modern. Siswa diajarkan dasar-dasar computational thinking, algoritma pemrograman, dan etika kecerdasan buatan.\n\nSiswa aktif menciptakan berbagai proyek berbasis teknologi, mulai dari sistem automasi sekolah, robot pendeteksi bencana, hingga aplikasi ramah lingkungan yang berhasil meraih medali di tingkat nasional.`,
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200',
    circle_bg: 'bg-[#002B66]',
    moments: [
      { url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800', caption: 'Praktikum perakitan robotik dan sensor IoT di Laboratorium' },
      { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800', caption: 'Pembelajaran interaktif menggunakan panel layar sentuh digital' },
    ],
  },
  {
    id: 'prog-4',
    slug: 'international',
    title: 'International Program & Sister School',
    badge_text: 'Wawasan Global & Kemitraan Internasional',
    description: 'Kemitraan Sister School dengan institusi pendidikan di Australia & Asia, mencakup pertukaran pelajar, proyek riset bersama, dan partisipasi delegasi pemuda dunia.',
    latest_activity: {
      title: 'Study Excursion & Cultural Exchange Sister School ke Tokyo & Kyoto High School',
      date: 'Oktober 2026',
      description: 'Sebanyak 25 delegasi siswa Labschool telah sukses menyelesaikan program pertukaran budaya, riset sains laboratorium, dan homestay bersama sekolah mitra di Jepang.',
      image_url: 'https://images.unsplash.com/photo-1542013861-12a843e9900c?q=80&w=800',
    },
    completed_programs: [
      {
        title: 'Study Excursion & Pertukaran Budaya di Kyoto High School',
        year: 'Oktober 2026',
        destination: 'Kyoto, Jepang',
        description: 'Kunjungan akademik delegasi siswa Labschool meliputi kolaborasi kelas bersama, kunjungan ke laboratorium antariksa Miraikan, dan homestay di Kyoto.',
        image_url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800',
      },
      {
        title: 'Sakura Science High School Exchange Program di Tokyo University of Science',
        year: 'Mei 2025',
        destination: 'Tokyo, Jepang',
        description: 'Partisipasi riset sains eksperimental siswa dalam bidang nanoteknologi dan robotika bersama ilmuwan Jepang.',
        image_url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800',
      },
      {
        title: 'Sister School Student Exchange di Melbourne High School',
        year: 'November 2025',
        destination: 'Melbourne, Australia',
        description: 'Program pertukaran siswa selama 14 hari, mencakup pemahaman multikultural, kurikulum STEM Australia, dan pameran seni budaya Nusantara.',
        image_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800',
      },
      {
        title: 'Asia-Pacific Young Leaders Summit di National University of Singapore',
        year: 'September 2024',
        destination: 'Singapura',
        description: 'Konferensi kepemimpinan pemuda membahas tantangan perubahan iklim global, delegasi Labschool berhasil meraih penghargaan delegasi terbaik.',
        image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800',
      },
      {
        title: 'Global Classroom Online Collaborative Learning with Osaka High School',
        year: 'Maret 2024',
        destination: 'Online / Hybrid',
        description: 'Pembelajaran sains dan kebudayaan kolaboratif daring secara berkala antara siswa SMA Labschool UNESA 1 dan mitra sekolah di Osaka.',
        image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800',
      },
    ],
    full_content: `International Program menghubungkan siswa SMA Labschool UNESA 1 dengan dunia internasional secara nyata. Melalui program kerja sama Sister School di Australia, Jepang, dan Asia Tenggara, delegasi siswa berkesempatan mengikuti program pertukaran pelajar (Student Exchange), homestay, dan *joint classroom project*.\n\nPengalaman ini membuka cakrawala global, melatih kepemimpinan, dan membangun jejaring persahabatan internasional sejak bangku sekolah menengah atas.`,
    image_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200',
    circle_bg: 'bg-[#002B66]',
    moments: [
      { url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800', caption: 'Kunjungan delegasi siswa ke kampus mitra di Australia' },
      { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800', caption: 'Kolaborasi riset budaya dan presentasi bersama siswa internasional' },
      { url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800', caption: 'Penerimaan kunjungan balasan sekolah mitra luar negeri' },
    ],
  },
  {
    id: 'prog-5',
    slug: 'preuni',
    title: 'Pre-University Class (Jalur Bahasa & PTN)',
    badge_text: 'Sukses PTN & Kuliah Bahasa',
    description: 'Bimbingan intensif persiapan tembus PTN favorit dan beasiswa luar negeri, terkhusus bagi peminat jurusan bahasa, diplomasi, sastra, dan humaniora.',
    full_content: `Pre-University Class di SMA Labschool UNESA 1 berfokus pada kelas bahasa dan rumpun ilmu humaniora internasional, mengantarkan siswa masuk ke PTN favorit dan beasiswa luar negeri impian.`,
    image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200',
    circle_bg: 'bg-[#F59E0B]',
    moments: [],
  },
];

export async function fetchPrograms() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('smal_programs').select('*').order('order_index', { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((item) => ({
          ...item,
          moments: Array.isArray(item.moments) ? item.moments : typeof item.moments === 'string' ? JSON.parse(item.moments || '[]') : [],
        }));
      }
    } catch (e) {
      console.warn('Supabase fetchPrograms fallback:', e);
    }
  }
  return FALLBACK_PROGRAMS;
}

export async function fetchFaculty() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('smal_faculty').select('*').order('id', { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map(item => ({
          ...item,
          moments: Array.isArray(item.moments) ? item.moments : typeof item.moments === 'string' ? JSON.parse(item.moments || '[]') : [],
        }));
      }
    } catch (e) {
      console.warn('Supabase fetchFaculty fallback:', e);
    }
  }
  return [
    {
      id: 'fac-1',
      name: 'Dr. Budi Santoso, M.Pd.',
      role: 'Kepala Sekolah',
      subject: 'Manajemen Pendidikan & Kepemimpinan',
      education_history: 'S1 Pendidikan Universitas Negeri Surabaya (UNESA)\nS2 Manajemen Pendidikan Universitas Negeri Malang (UM)\nS3 Kebijakan Pendidikan Universitas Pendidikan Indonesia (UPI)',
      bio: 'Berdedikasi lebih dari 20 tahun dalam transformasi pendidikan berkarakter dan inovasi kurikulum digital di Indonesia.',
      teaching_principles: '• Mendidik dengan keteladanan watak & budi pekerti luhur.\n• Mengintegrasikan inovasi teknologi mutakhir dengan nilai-nilai luhur kebangsaan.\n• Membimbing setiap siswa mengenali dan mengembangkan potensi kepemimpinan terbaiknya.',
      image_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600',
      moments: [],
    },
    {
      id: 'fac-2',
      name: 'Siti Aminah, M.Pd.',
      role: 'Wakil Kepala Sekolah Bidang Kurikulum',
      subject: 'Biologi & Sains Terapan',
      education_history: 'S1 Pendidikan Biologi Universitas Negeri Surabaya (UNESA)\nS2 Magister Pendidikan Sains Universitas Airlangga (UNAIR)',
      bio: 'Penggerak Kurikulum Merdeka dan pembina tim olimpiade biologi peraih medali emas OSN tingkat nasional.',
      teaching_principles: '• Belajar sains melalui eksperimen langsung dan penalaran kritis.\n• Memberi ruang aman bagi siswa untuk berani bertanya dan menguji hipotesis baru.\n• Menghargai keberagaman gaya belajar dan mendampingi dengan pendekatan personal.',
      image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600',
      moments: [],
    },
    {
      id: 'fac-3',
      name: 'Ahmad Faisal, S.T., M.Kom.',
      role: 'Koordinator Digital Learning & AI',
      subject: 'Informatika, Coding & Robotika',
      education_history: 'S1 Teknik Elektro Institut Teknologi Sepuluh Nopember (ITS)\nS2 Magister Teknik Informatika Institut Teknologi Bandung (ITB)',
      bio: 'Praktisi teknologi dan mentor kompetisi robotika internasional dengan fokus implementasi AI untuk pendidikan.',
      teaching_principles: '• Belajar coding adalah belajar memecahkan masalah kehidupan nyata secara sistematis.\n• Mendorong siswa bertransformasi dari konsumen konten menjadi kreator inovasi teknologi.\n• Menanamkan etika digital dan tanggung jawab moral dalam pemanfaatan kecerdasan buatan.',
      image_url: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=600',
      moments: [],
    },
  ];
}

export async function fetchActivities() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('smal_activities').select('*').order('id', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map(item => ({
          ...item,
          moments: Array.isArray(item.moments) ? item.moments : typeof item.moments === 'string' ? JSON.parse(item.moments || '[]') : [],
        }));
      }
    } catch (e) {
      console.warn('Supabase fetchActivities fallback:', e);
    }
  }
  return [
    {
      id: 'act-1',
      title: 'Study Excursion & International Exchange ke Jepang',
      tag: 'Kunjungan Internasional',
      event_date: 'Okt 2026',
      description: 'Program pembelajaran luar negeri dan pertukaran budaya delegasi siswa SMA Labschool UNESA 1 di Tokyo & Kyoto.',
      full_content: `Sebanyak 25 delegasi siswa SMA Labschool UNESA 1 mengikuti program Study Excursion ke Jepang selama 10 hari. Program ini mencakup kunjungan akademis ke Tokyo University, eksplorasi laboratorium teknologi tinggi Miraikan, serta pertukaran budaya langsung bersama siswa mitra di Kyoto High School.\n\nKegiatan ini mengasah kemandirian, kemampuan komunikasi lintas budaya, dan memperluas wawasan akademis siswa dalam memahami ekosistem sains dunia.`,
      image_url: 'https://images.unsplash.com/photo-1542013861-12a843e9900c?q=80&w=800',
      moments: [
        { url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', caption: 'Kunjungan budaya ke situs bersejarah di Kyoto' },
        { url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800', caption: 'Diskusi ilmiah bersama dosen tamu di Tokyo University' },
        { url: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?q=80&w=800', caption: 'Foto bersama keluarga angkat (homestay program)' },
      ],
    },
    {
      id: 'act-2',
      title: 'Prestasi Juara 1 Kompetisi Debat Parlemen Nasional 2026',
      tag: 'Prestasi Akademik',
      event_date: 'Sep 2026',
      description: 'Tim debat SMA Labschool UNESA 1 berhasil memboyong piala bergilir juara pertama kompetisi debat nasional.',
      full_content: `Tim debat SMA Labschool UNESA 1 kembali menorehkan prestasi gemilang dengan menjuarai Kompetisi Debat Parlemen Nasional 2026 yang diikuti oleh lebih dari 120 sekolah unggulan di seluruh Indonesia.\n\nDengan argumentasi kritis dan data riset yang kuat, perwakilan kami dinobatkan sebagai Best Speaker dan Juara 1 Nasional.`,
      image_url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800',
      moments: [
        { url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800', caption: 'Sesi babak final debat dengan mosi ekonomi digital' },
        { url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800', caption: 'Penyerahan piala juara 1 dan sertifikat penghargaan' },
      ],
    },
  ];
}

export async function fetchExtracurriculars() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('smal_extracurriculars').select('*').order('id', { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map(item => ({
          ...item,
          moments: Array.isArray(item.moments) ? item.moments : typeof item.moments === 'string' ? JSON.parse(item.moments || '[]') : [],
          achievements: Array.isArray(item.achievements) ? item.achievements : typeof item.achievements === 'string' ? JSON.parse(item.achievements || '[]') : [],
        }));
      }
    } catch (e) {
      console.warn('Supabase fetchExtracurriculars fallback:', e);
    }
  }
  return [
    {
      id: 'ex-1',
      name: 'Pramuka Garuda Labschool',
      category: 'Kepemimpinan & Wajib',
      description: 'Ekstrakurikuler pembinaan karakter disiplin, kemandirian, dan kepanduan kepemimpinan.',
      full_content: `Pramuka SMA Labschool UNESA 1 merupakan wadah pembinaan watak, keterampilan hidup (survival skill), kedisiplinan, serta cinta tanah air. Didukung pelatih bersertifikasi pembina nasional, anggota dilatih navigasi darat, pionering, bakti sosial, dan kepemimpinan beregu.\n\nEkskul ini aktif mengirimkan kontingen ke Jambore Daerah, Raimuna Nasional, hingga perkemahan bakti kemasyarakatan.`,
      schedule: 'Setiap Jumat sore pukul 15.30 - 17.00 WIB',
      image_url: 'https://images.unsplash.com/photo-1576135245831-7bcab06b4ff0?q=80&w=800',
      achievements: [
        {
          title: 'Juara 1 Lomba Tingkat Regu Prestasi Jawa Timur',
          year: '2025',
          event: 'Kwarda Gerakan Pramuka Jawa Timur',
          image_url: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=400',
        },
        {
          title: 'Juara Umum Pionering Kreatif & Ketangkasan Sandi',
          year: '2024',
          event: 'Giat Prestasi Penegak Surabaya',
          image_url: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=400',
        },
        {
          title: 'Kontingen Terdisiplin Kemah Bakti Pelajar UNESA',
          year: '2024',
          event: 'Dies Natalis Universitas Negeri Surabaya',
          image_url: 'https://images.unsplash.com/photo-1576135245831-7bcab06b4ff0?q=80&w=400',
        },
      ],
      moments: [
        { url: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=800', caption: 'Kegiatan orientasi lapangan dan penjelajahan alam' },
        { url: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=800', caption: 'Latihan pionering dan tali-temali beregu' },
      ],
    },
    {
      id: 'ex-2',
      name: 'Sanggar Seni Tari & Karawitan',
      category: 'Seni & Budaya',
      description: 'Eksplorasi kreasi seni tari tradisional Nusantara dan modern kontemporer.',
      full_content: `Sanggar tari SMA Labschool mewadahi kreativitas seni gerak tari tradisional Jawa Timur, Nusantara, hingga koreografi kontemporer. Siswa rutin tampil dalam upacara kehormatan, festival seni antarsekolah, dan muhibah seni mancanegara.`,
      schedule: 'Setiap Rabu & Sabtu pukul 15.30 WIB',
      image_url: 'https://images.unsplash.com/photo-1508700922718-d4567acfa2d0?q=80&w=800',
      achievements: [
        {
          title: 'Juara 1 FLS2N Festival Seni Tari Tradisional Jawa Timur',
          year: '2025',
          event: 'Dinas Pendidikan Provinsi Jawa Timur',
          image_url: 'https://images.unsplash.com/photo-1508700922718-d4567acfa2d0?q=80&w=400',
        },
        {
          title: 'Penyaji Terbaik Parade Seni Tari Nusantara',
          year: '2024',
          event: 'Festival Budaya Pelajar Surabaya',
          image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=400',
        },
        {
          title: 'Juara 2 Koreografi Tari Kontemporer Pelajar',
          year: '2024',
          event: 'Pentas Seni Kreasi Muda Jawa Timur',
          image_url: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?q=80&w=400',
        },
      ],
      moments: [
        { url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800', caption: 'Penampilan tari Remo kolosal pada acara wisuda' },
        { url: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?q=80&w=800', caption: 'Latihan gerak tari kontemporer di studio seni' },
      ],
    },
    {
      id: 'ex-3',
      name: 'Tim Basket Labschool Wolves',
      category: 'Olahraga Prestasi',
      description: 'Klub basket unggulan dengan pelatih profesional, aktif berkompetisi di DBL dan kejuaraan nasional.',
      full_content: `Tim Basket Labschool Wolves merupakan salah satu tim basket sekolah paling disegani di Surabaya. Dengan fasilitas lapangan indoor berstandar FIBA dan pelatih lisensi nasional, tim rutin meloloskan pemain ke kejuaraan tingkat provinsi dan DBL.`,
      schedule: 'Setiap Selasa & Kamis pukul 16.00 WIB',
      image_url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800',
      achievements: [
        {
          title: 'Champion DBL East Java Series (Surabaya North Region)',
          year: '2025',
          event: 'Developmental Basketball League (DBL)',
          image_url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=400',
        },
        {
          title: 'Juara 1 Turnamen Invitasi Walikota Cup Surabaya',
          year: '2024',
          event: 'Perbasi Surabaya',
          image_url: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?q=80&w=400',
        },
        {
          title: 'Runner-up Kejuaraan Basket Pelajar Antar SMA se-Jawa Timur',
          year: '2024',
          event: 'Piala Rektor UNESA',
          image_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=400',
        },
      ],
      moments: [
        { url: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?q=80&w=800', caption: 'Pertandingan sengit babak playoff turnamen DBL' },
        { url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800', caption: 'Latihan taktik fisik dan shooting di lapangan indoor' },
      ],
    },
    {
      id: 'ex-4',
      name: 'Robotics & IoT Innovators',
      category: 'Teknologi & Riset',
      description: 'Klub perakitan robot line follower, soccer robot, IoT controller, dan inovasi automasi.',
      full_content: `Klub robotika menjadi wadah riset terapan bagi siswa yang tertarik pada elektronika, mikroprosesor Arduino, ESP32, dan kecerdasan buatan. Tim rutin meraih medali juara pada Kontes Robot Indonesia tingkat pelajar dan lomba karya ilmiah remaja.`,
      schedule: 'Setiap Sabtu pukul 09.00 - 12.00 WIB',
      image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800',
      achievements: [
        {
          title: 'Medali Emas Kontes Robot Pintar Indonesia (KRPI)',
          year: '2025',
          event: 'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi',
          image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=400',
        },
        {
          title: 'Juara 1 National IoT Hackathon Pelajar Inovatif',
          year: '2025',
          event: 'Institut Teknologi Sepuluh Nopember (ITS)',
          image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=400',
        },
        {
          title: 'Juara 2 Autonomous Line Follower Challenge',
          year: '2024',
          event: 'Robotics Olympiad Jawa Timur',
          image_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=400',
        },
      ],
      moments: [
        { url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800', caption: 'Uji coba lintasan robot line follower berkecepatan tinggi' },
        { url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800', caption: 'Presentasi prototipe sistem pendeteksi kebocoran gas IoT' },
      ],
    },
  ];
}

export async function fetchDetailItem(type, id) {
  if (type === 'program') {
    const list = await fetchPrograms();
    // Special mapping: if bahasa, preuni, or language-preuni, map to the combined language & preuni program
    if (id === 'language-preuni' || id === 'bahasa' || id === 'preuni') {
      const combined = list.find((item) => item.slug === 'bahasa');
      if (combined) {
        return {
          ...combined,
          slug: 'language-preuni',
          title: 'Sekolah 5 Bahasa & Pre-University Pathways',
          badge_text: 'Komunikasi Global & Jalur Kuliah Bahasa',
        };
      }
    }
    return list.find((item) => String(item.id) === String(id) || String(item.slug) === String(id));
  }
  if (type === 'faculty' || type === 'teacher') {
    const list = await fetchFaculty();
    return list.find((item) => String(item.id) === String(id));
  }
  if (type === 'activity') {
    const list = await fetchActivities();
    return list.find((item) => String(item.id) === String(id));
  }
  if (type === 'ekskul' || type === 'extracurricular') {
    const list = await fetchExtracurriculars();
    return list.find((item) => String(item.id) === String(id));
  }
  return null;
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
    contact_youtube_url: 'https://youtube.com/@smalabschoolunesa?si=PYjRCOl00B_9gM-L',
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
