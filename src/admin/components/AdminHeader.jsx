import React from 'react';
import { LogOut, Bell } from 'lucide-react';

export default function AdminHeader({ pageTitle, onLogout }) {
  const now = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <header className="flex items-center justify-between bg-white border-b border-slate-200 px-6 py-3.5 shadow-sm">
      <div>
        <h1 className="text-lg font-extrabold text-slate-900">{pageTitle}</h1>
        <p className="text-xs text-slate-400 font-medium">{now}</p>
      </div>

      <div className="flex items-center gap-3">
        <button className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center relative transition-colors">
          <Bell size={17} className="text-slate-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 border-2 border-white" />
        </button>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
          <div className="w-7 h-7 rounded-full bg-[#002B66] flex items-center justify-center text-white text-xs font-extrabold shrink-0">
            A
          </div>
          <div className="text-xs">
            <p className="font-bold text-slate-900">Administrator</p>
            <p className="text-slate-400">Labschool UNESA 1</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-colors border border-red-100"
        >
          <LogOut size={14} />
          Keluar
        </button>
      </div>
    </header>
  );
}
