import React, { useEffect, useRef, useState } from 'react';
import { Menu, X, Phone, BookOpen, Users } from 'lucide-react';
import ImageWithSkeleton from './common/ImageWithSkeleton';

const primaryBlue = '#007BFF';
const primaryOrange = '#FF7A00';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'News & Events', href: '#news' },
  { label: 'About Us', href: '#about' },
  { label: 'Academic', href: '#academic' },
  { label: 'Admissions', href: '#admissions' },
  // { label: 'Students', href: '#students' },
  // { label: 'Teachers & Staff', href: '#teachers' },
  // { label: 'Parents', href: '#parents' },
  // { label: 'Alumni', href: '#alumni' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [menuHeight, setMenuHeight] = useState(0);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    if (!mobileMenuRef.current) return;

    const updateHeight = () => {
      if (mobileMenuRef.current) {
        setMenuHeight(mobileMenuRef.current.scrollHeight);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#home" className="flex items-center gap-2">
            <ImageWithSkeleton
              src="/Labschool-UNESA-logo.svg"
              alt="SMA Labschool logo"
              className="h-10 w-24 rounded-md bg-white"
              imageClassName="object-contain"
              fallbackClassName="bg-slate-200"
              loading="eager"
            />
          </a>

          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <a
              href="#admissions"
              className="px-4 py-2 text-sm font-medium rounded-full shadow-sm text-white"
              style={{ background: primaryOrange }}
            >
              Explore Admissions
            </a>
            <a
              href="#contact"
              className="px-4 py-2 text-sm font-medium rounded-full border"
              style={{ borderColor: primaryBlue, color: primaryBlue }}
            >
              Contact Us
            </a>
          </div>

          <button
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-md border text-slate-700"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div
        className={`lg:hidden border-t border-slate-100 bg-white overflow-hidden transition-all duration-300 ease-in-out ${
          open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
        style={{ maxHeight: open ? menuHeight : 0 }}
        aria-hidden={!open}
      >
        <div ref={mobileMenuRef} className="px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded-md text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {item.label}
            </a>
          ))}
          <div className="flex gap-2 pt-2">
            <a
              href="#admissions"
              className="flex-1 px-3 py-2 text-sm font-medium rounded-md text-white text-center transition-colors"
              style={{ background: primaryOrange }}
              onClick={() => setOpen(false)}
            >
              Admissions
            </a>
            <a
              href="#contact"
              className="flex-1 px-3 py-2 text-sm font-medium rounded-md text-center transition-colors"
              style={{ border: `1px solid ${primaryBlue}`, color: primaryBlue }}
              onClick={() => setOpen(false)}
            >
              Contact
            </a>
          </div>
        </div>
      </div>

      <div className="hidden md:block border-t border-slate-100 bg-slate-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 text-xs text-slate-600 flex items-center gap-6 overflow-x-auto">
          <div className="flex items-center gap-2"><BookOpen size={14} className="text-slate-500"/> Holistic Curriculum</div>
          <div className="flex items-center gap-2"><Users size={14} className="text-slate-500"/> Caring Community</div>
          <div className="flex items-center gap-2"><Phone size={14} className="text-slate-500"/> +62 821-232-937-212</div>
        </div>
      </div>
    </header>
  );
}
