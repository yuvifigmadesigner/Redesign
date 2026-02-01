import React, { useState, useEffect } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import BentoItem from './components/BentoItem';
import FooterContact from './components/FooterContact';
import { REDESIGN_CASES, WEBSITE_CONTENT } from './constants';

const App = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Set Page Metadata
  useEffect(() => {
    document.title = WEBSITE_CONTENT.metadata.title;

    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', WEBSITE_CONTENT.metadata.description);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pb-12 bg-background relative selection:bg-neutral-200">

      {/* Hero Section */}
      <header className="pt-24 pb-24 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="max-w-4xl">
          <span className="inline-block mb-6 px-3 py-1 rounded-full border border-neutral-200 bg-white text-[10px] font-bold tracking-widest uppercase text-neutral-500 shadow-sm">
            {WEBSITE_CONTENT.hero.badge}
          </span>
          <h1 className="font-serif text-6xl md:text-8xl text-neutral-900 leading-[1.1] mb-8">
            {WEBSITE_CONTENT.hero.titleLine1} <br />
            <span className="italic text-neutral-400">{WEBSITE_CONTENT.hero.titleLine2}</span>
          </h1>
          <p className="font-sans text-lg md:text-xl text-neutral-500 leading-relaxed max-w-2xl mb-12">
            {WEBSITE_CONTENT.hero.description}
          </p>

          <div className="flex items-center gap-4 text-xs font-bold tracking-widest uppercase text-neutral-400">
            <div className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center animate-bounce">
              <ArrowDown size={14} />
            </div>
            {WEBSITE_CONTENT.hero.scrollText}
          </div>
        </div>
      </header>

      {/* Gallery Grid */}
      <main className="px-6 md:px-12 max-w-[1600px] mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 auto-rows-auto md:auto-rows-[320px]">
          {REDESIGN_CASES.map((item) => (
            <BentoItem key={item.id} item={item} />
          ))}
        </div>
      </main>

      {/* Footer Contact */}
      <FooterContact />

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 w-12 h-12 bg-black text-white rounded-full shadow-xl flex items-center justify-center transition-all duration-500 hover:bg-neutral-800 z-50 ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
          }`}
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} />
      </button>
    </div>
  );
};

export default App;