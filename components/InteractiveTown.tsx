import React, { useRef, useState } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';

const InteractiveTown = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - top) / height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Helper for calculating transform styles
  const parallax = (depth: number, type: 'move' | 'rotate' = 'move') => {
    const x = mousePos.x * depth * 50; // Max movement in px
    const y = mousePos.y * depth * 20;
    
    if (type === 'rotate') {
        return { transform: `rotateX(${mousePos.y * depth * 10}deg) rotateY(${mousePos.x * depth * 10}deg)` };
    }
    return { transform: `translate3d(${x}px, ${y}px, 0)` };
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[600px] overflow-hidden bg-gradient-to-b from-[#FAFAFA] via-[#F5F5F5] to-[#EAEAEA] flex items-center justify-center mt-32 perspective-1000"
    >
      {/* --- LAYER 1: Background Elements (Sky) --- */}
      <div 
        className="absolute top-10 right-20 w-32 h-32 rounded-full bg-gradient-to-tr from-yellow-100 to-transparent opacity-50 blur-3xl transition-transform duration-100 ease-out"
        style={parallax(-0.5)}
      />
      
      {/* Clouds */}
      <div className="absolute top-20 left-1/4 opacity-30" style={parallax(-1)}>
         <div className="w-24 h-8 bg-neutral-200 rounded-full blur-md" />
      </div>
      <div className="absolute top-40 right-1/4 opacity-20" style={parallax(-0.8)}>
         <div className="w-32 h-10 bg-neutral-200 rounded-full blur-md" />
      </div>

      {/* --- LAYER 2: Background Mountains (Silhouettes) --- */}
      <div className="absolute bottom-0 w-full h-64 flex items-end justify-center pointer-events-none opacity-20 text-neutral-400" style={parallax(0.2)}>
         <svg viewBox="0 0 1000 300" className="w-full h-full preserve-3d" preserveAspectRatio="none">
             <path d="M0,300 L0,150 C150,150 200,50 400,100 C600,150 700,50 1000,120 L1000,300 Z" fill="currentColor" />
         </svg>
      </div>

      {/* --- LAYER 3: The Town (Houses) --- */}
      <div className="relative z-10 flex items-end gap-4 mb-20 pointer-events-none transition-transform duration-100 ease-out origin-bottom" style={parallax(0.6)}>
        
        {/* House 1: The Tall Tower */}
        <div className="relative group">
           <div className="w-24 h-64 bg-white border border-neutral-200 shadow-sm rounded-t-lg flex flex-col items-center pt-4 gap-4">
              <div className="w-12 h-12 bg-neutral-100 rounded-full border border-neutral-50" />
              <div className="w-12 h-24 bg-neutral-50 rounded border border-neutral-100" />
           </div>
           {/* Roof */}
           <div className="absolute -top-8 left-0 w-24 h-8 bg-neutral-100 clip-triangle" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
        </div>

        {/* House 2: The Main Hub (Wide) */}
        <div className="relative -ml-4 z-10">
           <div className="w-48 h-40 bg-white border border-neutral-300 shadow-xl rounded-t-xl flex flex-wrap p-4 gap-2 justify-center content-start">
              {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-8 h-8 bg-neutral-50 border border-neutral-100 rounded-sm" />
              ))}
           </div>
           {/* Decorative awning */}
           <div className="absolute top-10 -left-2 -right-2 h-2 bg-blue-500/10 rounded-full" />
        </div>

        {/* House 3: The Studio (Small) */}
        <div className="relative -ml-2">
           <div className="w-28 h-32 bg-neutral-50 border border-neutral-200 shadow-md rounded-t-lg flex items-center justify-center">
              <div className="w-12 h-16 border-2 border-neutral-200 rounded-t-full border-b-0" />
           </div>
           <div className="absolute -top-6 left-0 w-28 h-6 bg-neutral-200 rounded-sm skew-x-12" />
        </div>

      </div>

      {/* --- LAYER 4: The Interface Overlay (CTA) --- */}
      <div 
        className="absolute z-20 flex flex-col items-center justify-center transform transition-transform duration-75"
        style={parallax(1.2)}
      >
        <div className="bg-white/80 backdrop-blur-md p-1 rounded-full shadow-2xl border border-white mb-6 animate-float">
            <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center text-white">
                <MapPin size={24} />
            </div>
        </div>

        <a 
            href="https://pinterest.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-4 bg-neutral-900 text-white pl-8 pr-2 py-2 rounded-full shadow-2xl hover:bg-black transition-all hover:scale-105 hover:pr-8"
        >
            <span className="font-serif text-lg tracking-wide">Enter the Archive</span>
            <span className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center transition-all group-hover:rotate-45">
                <ArrowRight size={16} />
            </span>
        </a>
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">
            Interactive Portfolio
        </p>
      </div>

      {/* Ground Fade */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#FAFAFA] to-transparent z-10 pointer-events-none" />
    </section>
  );
};

export default InteractiveTown;