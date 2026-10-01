import React from 'react';

export default function SectionWrapper({ id, title, children }) {
  return (
    <section id={id} className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{title}</h2>
        <div className="mt-8 space-y-6 text-slate-600">
          {children}
        </div>
      </div>
    </section>
  );
}
