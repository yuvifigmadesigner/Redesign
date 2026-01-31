import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, Loader2, Wind, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const FooterGame = () => {
  const [scrollPos, setScrollPos] = useState(20);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [feedback, setFeedback] = useState("");
  
  const WORLD_WIDTH = 140; 

  const handleScroll = (direction: 'left' | 'right') => {
    setScrollPos(prev => {
      const delta = 10;
      if (direction === 'left') return Math.max(0, prev - delta);
      return Math.min(100, prev + delta);
    });
  };

  const handleZoomIn = async () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      setFeedback("API Key missing");
      return;
    }

    setIsGenerating(true);
    setFeedback("Dreaming...");

    try {
      const ai = new GoogleGenAI({ apiKey });
      
      let locationContext = "a cozy cluttered living room with plants and books";
      if (scrollPos < 30) locationContext = "a magical herbalist kitchen with hanging dried flowers";
      else if (scrollPos > 60) locationContext = "a sun-drenched attic artist studio overlooking green hills";

      const prompt = `Studio Ghibli style animation background art of ${locationContext}, watercolor style, peaceful, lush green nature, blue sky, cumulus clouds, highly detailed, cozy atmosphere, anime scenery.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }],
        },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          setGeneratedImage(`data:image/png;base64,${base64EncodeString}`);
          break;
        }
      }
      setFeedback("");
    } catch (e) {
      console.error(e);
      setFeedback("Try again!");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative w-full h-[500px] rounded-[2.5rem] overflow-hidden bg-[#87CEEB] shadow-2xl border border-white/50 ring-1 ring-black/5 group selection:bg-teal-200 isolate">
      
      {/* --- UI LAYER (Controls) --- */}
      <div className="absolute inset-0 z-50 pointer-events-none flex flex-col justify-between p-8">
        <div className="flex justify-between items-start">
            <div className="bg-white/80 backdrop-blur-md border border-white/60 px-5 py-2 rounded-full shadow-sm pointer-events-auto transition-transform hover:scale-105">
                <h3 className="font-serif italic font-bold text-lg text-[#5D4037] flex items-center gap-2">
                    <Wind size={18} className="text-teal-600 animate-pulse" />
                    Valley of Calm
                </h3>
            </div>
            
            <div className="flex items-center gap-3">
                {/* Status/Feedback */}
                {(isGenerating || feedback) && (
                    <div className="bg-[#5D4037] text-[#FFF8E1] px-6 py-2 rounded-full flex items-center gap-3 shadow-lg animate-in fade-in slide-in-from-top-2">
                        {isGenerating && <Loader2 size={16} className="animate-spin" />}
                        <span className="text-sm font-medium tracking-wide">{feedback}</span>
                    </div>
                )}
                
                {/* Pinterest Hint Badge */}
                <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="bg-[#E60023] text-white px-4 py-2 rounded-full shadow-lg pointer-events-auto flex items-center gap-2 hover:bg-[#ad081b] transition-colors font-bold text-xs tracking-wider uppercase">
                    Pinterest
                </a>
            </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-end justify-center gap-6 pointer-events-auto pb-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-8 group-hover:translate-y-0">
            <button 
                onClick={() => handleScroll('left')}
                className="w-12 h-12 bg-white/90 backdrop-blur text-neutral-800 border border-white/50 rounded-full flex items-center justify-center hover:scale-110 transition-transform active:bg-white disabled:opacity-50 disabled:scale-100 shadow-lg"
                disabled={scrollPos <= 0}
                aria-label="Scroll Left"
            >
                <ArrowLeft size={20} />
            </button>
            <button 
                onClick={handleZoomIn}
                className="group/btn relative w-16 h-16 bg-[#8BC34A] text-white border-4 border-white rounded-full flex items-center justify-center shadow-xl hover:-translate-y-2 transition-all hover:bg-[#7CB342] overflow-hidden"
                aria-label="Dream / Zoom In"
            >
                <ArrowUp size={28} className="relative z-10" />
                <div className="absolute inset-0 bg-white/20 scale-0 group-hover/btn:scale-100 rounded-full transition-transform duration-500" />
            </button>
            <button 
                onClick={() => handleScroll('right')}
                className="w-12 h-12 bg-white/90 backdrop-blur text-neutral-800 border border-white/50 rounded-full flex items-center justify-center hover:scale-110 transition-transform active:bg-white disabled:opacity-50 disabled:scale-100 shadow-lg"
                aria-label="Scroll Right"
                disabled={scrollPos >= 100}
            >
                <ArrowRight size={20} />
            </button>
        </div>
      </div>

      {/* --- SCENE LAYER --- */}
      <div 
        className="absolute inset-0 h-full flex transition-transform duration-1000 cubic-bezier(0.2, 0.8, 0.2, 1)"
        style={{ 
            width: `${WORLD_WIDTH}%`,
            transform: `translateX(-${scrollPos * (WORLD_WIDTH - 100) / 100}%)`
        }}
      >
        {/* SVG SCENERY */}
        <svg className="w-full h-full" viewBox="0 0 1400 600" preserveAspectRatio="xMidYMax slice">
            <defs>
                <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#4FC3F7" />
                    <stop offset="100%" stopColor="#E1F5FE" />
                </linearGradient>
                <linearGradient id="grassGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#AED581" />
                    <stop offset="100%" stopColor="#7CB342" />
                </linearGradient>
                <filter id="cloudBlur">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
                </filter>
            </defs>

            {/* 1. SKY */}
            <rect width="100%" height="100%" fill="url(#skyGradient)" />
            
            {/* Distant Mountains */}
            <path d="M0,600 L200,350 L500,600 Z" fill="#90CAF9" opacity="0.6" />
            <path d="M300,600 L600,300 L900,600 Z" fill="#64B5F6" opacity="0.5" />
            <path d="M800,600 L1100,250 L1400,600 Z" fill="#42A5F5" opacity="0.4" />

            {/* Clouds (Big, Fluffy, Ghibli style) */}
            <g fill="white" opacity="0.9" filter="url(#cloudBlur)">
                <circle cx="200" cy="150" r="80" />
                <circle cx="280" cy="180" r="60" />
                <circle cx="150" cy="180" r="60" />
                
                <circle cx="800" cy="100" r="90" />
                <circle cx="900" cy="150" r="70" />
                <circle cx="720" cy="150" r="60" />

                <circle cx="1200" cy="200" r="100" />
                <circle cx="1300" cy="150" r="80" />
            </g>

            {/* 2. HILLS (Rolling Green) */}
            <path d="M0,450 C300,400 500,550 800,480 C1100,420 1300,500 1400,450 L1400,600 L0,600 Z" fill="url(#grassGradient)" />
            <path d="M-100,600 C200,500 600,550 900,600 Z" fill="#558B2F" opacity="0.3" />

            {/* 3. ELEMENTS */}

            {/* LEFT HOUSE: Cozy Cottage */}
            <g transform="translate(150, 280)">
                {/* Main Body */}
                <rect x="20" y="100" width="160" height="140" fill="#FFF9C4" stroke="#5D4037" strokeWidth="2" />
                {/* Roof */}
                <path d="M0,100 L100,20 L200,100" fill="#EF5350" stroke="#5D4037" strokeWidth="2" />
                <path d="M10,90 L100,18 L190,90" fill="none" stroke="white" strokeWidth="2" opacity="0.3" />
                
                {/* Round Window */}
                <circle cx="100" cy="70" r="20" fill="#B3E5FC" stroke="#5D4037" strokeWidth="2" />
                <line x1="80" y1="70" x2="120" y2="70" stroke="#5D4037" strokeWidth="2" />
                <line x1="100" y1="50" x2="100" y2="90" stroke="#5D4037" strokeWidth="2" />

                {/* Door */}
                <rect x="80" y="160" width="40" height="80" fill="#8D6E63" stroke="#5D4037" strokeWidth="2" />
                <circle cx="110" cy="200" r="3" fill="#FFD54F" />

                {/* Ivy/Bushes */}
                <circle cx="30" cy="230" r="20" fill="#2E7D32" />
                <circle cx="50" cy="240" r="25" fill="#388E3C" />
                <circle cx="170" cy="230" r="20" fill="#2E7D32" />
            </g>

            {/* MIDDLE: Wooden Bridge & Stream */}
            <g transform="translate(500, 480)">
                 {/* Stream Water */}
                 <path d="M0,50 C50,40 150,60 200,50 L220,120 L-20,120 Z" fill="#4FC3F7" opacity="0.8" />
                 {/* Bridge */}
                 <path d="M20,60 Q100,20 180,60" fill="none" stroke="#8D6E63" strokeWidth="8" strokeLinecap="round" />
                 <line x1="40" y1="55" x2="40" y2="75" stroke="#5D4037" strokeWidth="3" />
                 <line x1="160" y1="55" x2="160" y2="75" stroke="#5D4037" strokeWidth="3" />
            </g>

            {/* RIGHT HOUSE: The Pinterest Shop */}
            <g transform="translate(850, 200)">
                 {/* Tall Structure */}
                 <rect x="50" y="100" width="180" height="250" fill="#EFEBE9" stroke="#5D4037" strokeWidth="2" />
                 {/* Roof */}
                 <path d="M40,100 L140,40 L240,100" fill="#5D4037" stroke="#3E2723" strokeWidth="2" />
                 
                 {/* Balcony */}
                 <rect x="40" y="200" width="200" height="10" fill="#8D6E63" stroke="#5D4037" strokeWidth="2" />
                 <rect x="60" y="140" width="40" height="60" fill="#B2DFDB" stroke="#5D4037" strokeWidth="2" />
                 <rect x="180" y="140" width="40" height="60" fill="#B2DFDB" stroke="#5D4037" strokeWidth="2" />

                 {/* Shop Awning */}
                 <path d="M50,280 L230,280 L240,310 L40,310 Z" fill="#E53935" stroke="#5D4037" strokeWidth="1" />
                 <path d="M50,280 L65,310 M80,280 L95,310 M110,280 L125,310 M140,280 L155,310 M170,280 L185,310 M200,280 L215,310" stroke="#B71C1C" strokeWidth="1" />

                 {/* Shop Window */}
                 <rect x="70" y="320" width="140" height="80" fill="#FFF3E0" stroke="#5D4037" strokeWidth="2" />
                 
                 {/* Chimney smoke */}
                 <g opacity="0.6">
                    <circle cx="200" cy="40" r="10" fill="white" className="animate-[ping_3s_infinite]" />
                    <circle cx="210" cy="20" r="15" fill="white" className="animate-[ping_4s_infinite]" />
                 </g>
            </g>

            {/* PINTEREST SIGNPOST (Interactive) */}
            <foreignObject x="1100" y="400" width="160" height="200">
                <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="group block w-full h-full cursor-pointer hover:-translate-y-1 transition-transform">
                    <div className="relative flex flex-col items-center">
                        {/* Sign Board */}
                        <div className="w-32 h-20 bg-[#8D6E63] rounded-lg border-2 border-[#5D4037] shadow-lg flex items-center justify-center relative z-10 group-hover:bg-[#795548] transition-colors">
                            {/* Nail */}
                            <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-[#3E2723] rounded-full" />
                            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#3E2723] rounded-full" />
                            
                            <div className="text-center">
                                <span className="block font-serif text-[#FFE0B2] text-xs font-bold tracking-widest uppercase mb-0.5">Visit</span>
                                <span className="block font-serif text-white text-lg font-bold tracking-wide drop-shadow-md">Pinterest</span>
                            </div>
                        </div>
                        {/* Post */}
                        <div className="w-4 h-32 bg-[#6D4C41] border-x border-[#3E2723] -mt-2" />
                        
                        {/* Grass at base */}
                        <div className="absolute bottom-0 w-24 h-8 bg-[#558B2F] rounded-full blur-sm -z-10" />
                    </div>
                </a>
            </foreignObject>

            {/* Foreground Grass/Flowers */}
            <g transform="translate(0, 560)">
                <circle cx="100" cy="20" r="5" fill="#F06292" />
                <circle cx="120" cy="30" r="4" fill="#FFEB3B" />
                <circle cx="400" cy="10" r="6" fill="#FFFFFF" />
                <circle cx="950" cy="25" r="5" fill="#BA68C8" />
                <circle cx="1250" cy="15" r="5" fill="#F06292" />
            </g>
        </svg>
      </div>

      {/* --- GENERATED IMAGE MODAL --- */}
      {generatedImage && (
        <div className="absolute inset-0 z-[60] bg-[#5D4037]/90 flex items-center justify-center p-8 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative bg-[#FFF8E1] p-2 rounded-lg shadow-2xl max-w-4xl w-full max-h-full flex flex-col transform transition-all scale-100">
                <button 
                    onClick={() => setGeneratedImage(null)}
                    className="absolute -top-4 -right-4 w-10 h-10 bg-[#EF5350] text-white border-2 border-white rounded-full flex items-center justify-center font-bold hover:rotate-90 transition-transform shadow-md"
                >
                    ✕
                </button>
                <div className="w-full h-full rounded border-2 border-[#5D4037]/20 overflow-hidden bg-white">
                    <img src={generatedImage} alt="Ghibli Scene" className="w-full h-full object-cover" />
                </div>
                <div className="py-3 text-center">
                    <p className="font-serif italic text-[#5D4037]">"A quiet moment..."</p>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default FooterGame;