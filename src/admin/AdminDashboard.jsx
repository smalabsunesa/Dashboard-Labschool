import React, { useEffect, useState } from 'react';
import { Newspaper, HelpCircle, MessageSquare, TrendingUp, Users, Calendar } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className={`rounded-2xl border p-5 shadow-sm flex items-center gap-4 bg-white ${color}`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${color.replace('border-', 'bg-').split(' ')[0]}/10`}>
        <Icon size={22} className={color.split(' border-')[0].replace('border-', 'text-')} />
      </div>
      <div>
        <p className="text-2xl font-extrabold text-slate-900">{value}</p>
        <p className="text-xs font-semibold text-slate-500">{label}</p>
        {sub && <p className="text-[0.65rem] text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ news: '-', faqs: '-', inquiries: '-' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setStats({ news: 4, faqs: 3, inquiries: 0 });
      setLoading(false);
      return;
    }

    Promise.all([
      supabase.from('smal_updates').select('id', { count: 'exact', head: true }),
      supabase.from('smal_faqs').select('id', { count: 'exact', head: true }),
      supabase.from('smal_inquiries').select('id', { count: 'exact', head: true }),
    ]).then(([news, faqs, inquiries]) => {
      setStats({
        news: news.count ?? 0,
        faqs: faqs.count ?? 0,
        inquiries: inquiries.count ?? 0,
      });
      setLoading(false);
    }).catch(() => {
      setStats({ news: 4, faqs: 3, inquiries: 0 });
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#002B66] via-[#003580] to-[#002B66] p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <p className="text-orange-300 text-xs font-bold uppercase tracking-widest mb-1">Selamat Datang</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold">Panel Admin CMS</h2>
          <p className="mt-1 text-blue-100/70 text-sm">
            SMA Labschool UNESA 1 — Kelola konten website sekolah Anda di sini.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div>
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Ringkasan Konten</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <StatCard
            icon={Newspaper}
            label="Total Berita"
            value={loading ? '...' : stats.news}
            color="border-blue-200"
            sub="Artikel & update sekolah"
          />
          <StatCard
            icon={HelpCircle}
            label="Total FAQ"
            value={loading ? '...' : stats.faqs}
            color="border-amber-200"
            sub="Pertanyaan tersimpan"
          />
          <StatCard
            icon={MessageSquare}
            label="Pesan Masuk"
            value={loading ? '...' : stats.inquiries}
            color="border-emerald-200"
            sub="Pertanyaan calon siswa"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Aksi Cepat</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <a href="/admin/news" className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-400 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
              <Newspaper size={18} className="text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Tambah Berita Baru</p>
              <p className="text-xs text-slate-400">Tulis & publish artikel berita</p>
            </div>
          </a>
          <a href="/admin/faqs" className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-amber-400 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center group-hover:bg-amber-500 transition-colors">
              <HelpCircle size={18} className="text-amber-500 group-hover:text-white transition-colors" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Tambah FAQ Baru</p>
              <p className="text-xs text-slate-400">Kelola pertanyaan umum</p>
            </div>
          </a>
        </div>
      </div>

      {/* System Info */}
      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 text-xs text-slate-400 space-y-1">
        <p className="font-bold text-slate-600 text-sm mb-2">Informasi Sistem</p>
        <p>• Supabase: <span className={isSupabaseConfigured ? 'text-emerald-600 font-bold' : 'text-red-500 font-bold'}>{isSupabaseConfigured ? 'Terhubung ✓' : 'Tidak terkonfigurasi (mode demo)'}</span></p>
        <p>• Versi CMS: 1.0.0</p>
        <p>• Terakhir diakses: {new Date().toLocaleString('id-ID')}</p>
      </div>
    </div>
  );
}
