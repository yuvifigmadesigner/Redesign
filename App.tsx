import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import BentoItem from './components/BentoItem';
import FooterContact from './components/FooterContact';
import { REDESIGN_CASES, WEBSITE_CONTENT } from './constants';

const App = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
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
    <div className="min-h-screen pb-12 bg-background relative selection:bg-brand-100">

      {/* Hero Section */}
      <header className="pt-20 md:pt-28 pb-16 md:pb-24 px-6 md:px-12 max-w-[1600px] mx-auto flex flex-col items-center text-center">

        {/* Eyebrow */}
        <span className="hero-fade inline-flex items-center gap-2.5 mb-8 px-3.5 py-1.5 rounded-full border border-cream-300 bg-white text-[10px] font-bold tracking-widest uppercase text-muted shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
          {WEBSITE_CONTENT.hero.badge}
        </span>

        {/* Headline — each line slides up from behind its own mask */}
        <h1 className="font-serif text-[3.25rem] sm:text-7xl lg:text-8xl xl:text-[7.5rem] text-ink leading-[0.95] tracking-[-0.02em] max-w-6xl mb-8 md:mb-10">
          <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
            <span className="hero-line block" style={{ animationDelay: '0.08s' }}>
              {WEBSITE_CONTENT.hero.titleLine1}
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
            <span className="hero-line block text-brand" style={{ animationDelay: '0.18s' }}>
              {WEBSITE_CONTENT.hero.titleLine2}
            </span>
          </span>
        </h1>

        {/* Short centred rule — a full-width line fights a centred column */}
        <div className="hero-fade h-px w-16 bg-cream-400 mb-8 md:mb-10" style={{ animationDelay: '0.34s' }}></div>

        <p className="hero-fade font-sans text-lg md:text-xl text-muted leading-relaxed max-w-2xl" style={{ animationDelay: '0.4s' }}>
          {WEBSITE_CONTENT.hero.description}
        </p>

      </header>

      {/* Gallery Grid */}
      <main className="px-6 md:px-12 max-w-[1600px] mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 auto-rows-auto md:auto-rows-[320px]">
          {REDESIGN_CASES.map((item, index) => (
            <BentoItem key={item.id} item={item} index={index} />
          ))}
        </div>
      </main>

      {/* Footer Contact */}
      <FooterContact />

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 w-12 h-12 bg-ink text-white rounded-full shadow-sm flex items-center justify-center transition-all duration-500 hover:bg-ink-700 z-50 ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
          }`}
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} />
      </button>
    </div>
  );
};

export default App;