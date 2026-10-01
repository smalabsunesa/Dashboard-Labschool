import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Sections from './components/Sections';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="font-inter bg-white text-slate-800">
      <Navbar />
      <main>
        <Hero />
        <Sections />
      </main>
      <Footer />
    </div>
  );
}
