import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Newspaper, HelpCircle, MessageSquare, ChevronLeft, ChevronRight, School,
  Users, Activity, Trophy, Settings
} from 'lucide-react';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/news', label: 'Berita', icon: Newspaper },
  { to: '/admin/faqs', label: 'FAQ', icon: HelpCircle },
  { to: '/admin/inquiries', label: 'Pesan Masuk', icon: MessageSquare },
  { to: '/admin/faculty', label: 'Direktori Guru', icon: Users },
  { to: '/admin/activities', label: 'Kegiatan Siswa', icon: Activity },
  { to: '/admin/extracurriculars', label: 'Ekstrakurikuler', icon: Trophy },
  { to: '/admin/settings', label: 'General Settings', icon: Settings },
];

export default function AdminSidebar({ collapsed, onToggle }) {
  return (
    <aside
      className={`relative flex flex-col bg-[#002B66] text-white transition-all duration-300 ease-in-out shrink-0 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
      style={{ minHeight: '100vh' }}
    >
      {/* Logo & School Name */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
          <img src="/Labschool-UNESA-logo.svg" alt="Logo" className="w-6 h-6 object-contain" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-xs font-extrabold leading-tight">Labschool UNESA 1</p>
            <p className="text-[0.6rem] text-white/50 font-medium">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              } ${collapsed ? 'justify-center' : ''}`
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={18} className="shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors z-10"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Version Footer */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-white/10 text-[0.6rem] text-white/30 font-medium">
          SMA Labschool UNESA 1 © 2026
        </div>
      )}
    </aside>
  );
}
