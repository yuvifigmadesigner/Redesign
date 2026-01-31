import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronsLeftRight } from 'lucide-react';

interface CompareSliderProps {
  beforeImage: string;
  afterImage: string;
  alt: string;
  className?: string;
  backgroundColor?: string;
  imageFit?: 'cover' | 'contain';
}

const CompareSlider: React.FC<CompareSliderProps> = ({ beforeImage, afterImage, alt, className = '', backgroundColor, imageFit = 'contain' }) => {
  const [percentage, setPercentage] = useState(0); // Default to Redesign state (0% mask)
  const [isHovering, setIsHovering] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Measure container width for correct image sizing inside the mask
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const width = rect.width;
      const p = Math.max(0, Math.min(100, (x / width) * 100));
      setPercentage(p);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const width = rect.width;
      const p = Math.max(0, Math.min(100, (x / width) * 100));
      setPercentage(p);
    }
  }, []);

  const handleTouchStart = () => setIsHovering(true);

  const handleTouchEnd = () => {
    setIsHovering(false);
    setPercentage(0);
  };

  const handleMouseEnter = () => setIsHovering(true);

  const handleMouseLeave = () => {
    setIsHovering(false);
    setPercentage(0); // Reset to Redesign state
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden cursor-ew-resize select-none group touch-pan-y ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* After Image (Background - Redesign) */}
      <img
        src={afterImage}
        alt={`Redesign: ${alt}`}
        className={`absolute top-0 left-0 w-full h-full object-${imageFit} object-center pointer-events-none ${!backgroundColor ? 'bg-[#F4F4F5]' : ''}`}
        style={{ backgroundColor: backgroundColor }}
      />

      {/* Before Image (Foreground Mask - Original) */}
      <div
        className="absolute top-0 left-0 h-full overflow-hidden bg-white/5 shadow-[2px_0_20px_rgba(0,0,0,0.1)] pointer-events-none z-20"
        style={{
          width: `${percentage}%`,
          // Instant update when hovering (no lag), smooth reset when leaving
          transition: isHovering ? 'none' : 'width 0.6s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
      >
        <img
          src={beforeImage}
          alt={`Original: ${alt}`}
          className={`absolute top-0 left-0 max-w-none h-full object-${imageFit} object-center pointer-events-none ${!backgroundColor ? 'bg-[#E4E4E5]' : ''}`}
          style={{ width: containerWidth || '100%', backgroundColor: backgroundColor }}
        />

        {/* Badge: Original */}
        <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm z-10">
          <span className="text-[10px] font-bold tracking-widest text-black uppercase">Original</span>
        </div>
      </div>

      {/* Badge: Redesign (Always in DOM, covered by mask) */}
      <div className="absolute top-6 right-6 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm pointer-events-none z-10">
        <span className="text-[10px] font-bold tracking-widest text-white uppercase">Redesign</span>
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white z-20 pointer-events-none shadow-[0_0_15px_rgba(0,0,0,0.2)]"
        style={{
          left: `${percentage}%`,
          transition: isHovering ? 'none' : 'left 0.6s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-white/30 backdrop-blur-lg border border-white/60 rounded-full flex items-center justify-center shadow-lg">
          <ChevronsLeftRight size={16} className="text-white drop-shadow-md" />
        </div>
      </div>

      {/* Interaction Hint */}
      <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 transition-all duration-500 pointer-events-none z-30 ${isHovering || percentage > 5 ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
        <span className="text-white/90 text-xs font-medium bg-black/40 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full shadow-lg">
          Hover to compare
        </span>
      </div>
    </div>
  );
};

export default CompareSlider;
