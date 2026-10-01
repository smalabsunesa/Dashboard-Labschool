import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Sparkles } from 'lucide-react';

// Default admin password — can be overridden via VITE_ADMIN_PASSWORD env var
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'labschool2025';

export default function AdminLogin({ onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('admin_auth', 'true');
        onLoginSuccess();
      } else {
        setError('Password salah. Silakan coba lagi.');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001a3d] via-[#002B66] to-[#00357a] flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-white p-2.5 shadow-xl mb-4">
              <img src="/Labschool-UNESA-logo.svg" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Admin Panel</h1>
            <p className="text-blue-200/70 text-sm mt-1">SMA Labschool UNESA 1</p>
            <span className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.65rem] font-bold bg-orange-500/20 text-orange-300 uppercase tracking-wide">
              <Sparkles size={11} /> Area Terbatas — Staf Resmi
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-blue-200/70 uppercase tracking-wider mb-1.5">
                Password Admin
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-300/50" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Masukkan password..."
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-blue-300/50 hover:text-white transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-xs font-semibold bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 text-white font-extrabold text-sm shadow-lg hover:shadow-orange-500/30 disabled:opacity-50 transition-all active:scale-95"
            >
              {loading ? 'Memverifikasi...' : 'Masuk ke Panel Admin'}
            </button>
          </form>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          Akses ini hanya untuk staf & admin SMA Labschool UNESA 1
        </p>
      </div>
    </div>
  );
}
