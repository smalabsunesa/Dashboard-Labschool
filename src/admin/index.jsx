import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import AdminDashboard from './AdminDashboard';
import NewsManager from './pages/NewsManager';
import FaqManager from './pages/FaqManager';
import InquiriesViewer from './pages/InquiriesViewer';
import FacultyManager from './pages/FacultyManager';
import ActivityManager from './pages/ActivityManager';
import ExtracurricularManager from './pages/ExtracurricularManager';
import SettingsManager from './pages/SettingsManager';

const PAGE_TITLES = {
  '/admin': 'Dashboard',
  '/admin/news': 'Manajemen Berita',
  '/admin/faqs': 'Manajemen FAQ',
  '/admin/inquiries': 'Pesan Masuk',
  '/admin/faculty': 'Direktori Guru',
  '/admin/activities': 'Kegiatan Siswa',
  '/admin/extracurriculars': 'Ekstrakurikuler',
  '/admin/settings': 'General Settings',
};

function AdminLayout({ onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'Admin Panel';

  return (
    <div className="flex min-h-screen bg-slate-50 font-inter">
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed((p) => !p)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader pageTitle={title} onLogout={onLogout} />

        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/news" element={<NewsManager />} />
            <Route path="/faqs" element={<FaqManager />} />
            <Route path="/inquiries" element={<InquiriesViewer />} />
            <Route path="/faculty" element={<FacultyManager />} />
            <Route path="/activities" element={<ActivityManager />} />
            <Route path="/extracurriculars" element={<ExtracurricularManager />} />
            <Route path="/settings" element={<SettingsManager />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function AdminApp() {
  const [isAuth, setIsAuth] = useState(() => sessionStorage.getItem('admin_auth') === 'true');

  const handleLogin = () => setIsAuth(true);
  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    setIsAuth(false);
  };

  if (!isAuth) {
    return <AdminLogin onLoginSuccess={handleLogin} />;
  }

  return <AdminLayout onLogout={handleLogout} />;
}
