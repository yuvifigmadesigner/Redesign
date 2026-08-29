import React, { useState, useRef, useCallback, useEffect } from 'react';

// How far across the visitor must sweep before we treat the difference as "seen"
const EXPLORED_THRESHOLD = 90;

// Idle hint: how far the divider peeks in to show itself, and the beat of the demo
const PEEK_PERCENT = 16;
const PEEK_STEPS: Array<[percent: number, atMs: number]> = [
  [PEEK_PERCENT, 400],
  [0, 1100],
  [PEEK_PERCENT, 1500],
  [0, 2200],
];

interface CompareSliderProps {
  beforeImage: string;
  afterImage: string;
  alt: string;
  className?: string;
  backgroundColor?: string;
  imageFit?: 'cover' | 'contain';
  /** Fires when the visitor has swept far enough to have seen the whole original */
  onExplored?: () => void;
  /** Fires when the pointer leaves the picture, so the cue can wind back down */
  onInteractionEnd?: () => void;
  /** The first card is the LCP image — it loads eagerly, everything below waits */
  priority?: boolean;
}

const CompareSlider: React.FC<CompareSliderProps> = ({ beforeImage, afterImage, alt, className = '', backgroundColor, imageFit = 'contain', onExplored, onInteractionEnd, priority = false }) => {
  const [percentage, setPercentage] = useState(0); // Default to Redesign state (0% mask)
  const [isHovering, setIsHovering] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasExploredRef = useRef(false);
  const isHoveringRef = useRef(false);
  const peekTimersRef = useRef<number[]>([]);
  // Latches on first touch/hover. Once the visitor has driven the slider themselves,
  // the idle demo must never move it again — including any steps already queued.
  const hasInteractedRef = useRef(false);

  const cancelPeek = () => {
    peekTimersRef.current.forEach(window.clearTimeout);
    peekTimersRef.current = [];
  };

  // Track how far the visitor has swept; announce once they've crossed the threshold
  const trackProgress = useCallback((p: number) => {
    if (hasExploredRef.current || p < EXPLORED_THRESHOLD) return;
    hasExploredRef.current = true;
    onExplored?.();
  }, [onExplored]);

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

  // Once the card scrolls into view, the divider peeks in twice — it shows there are
  // two images here and that the handle moves, without spelling it out in words.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        // They beat the demo to it — leave the slider alone entirely
        if (hasInteractedRef.current) return;

        PEEK_STEPS.forEach(([percent, atMs]) => {
          peekTimersRef.current.push(
            window.setTimeout(() => {
              // Never fight the pointer, and never undo a position they chose
              if (isHoveringRef.current || hasInteractedRef.current) return;
              setPercentage(percent);
            }, atMs)
          );
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelPeek();
    };
  }, []);

  // Wherever the visitor parked the divider, it stays there while the card is on screen.
  // Reset only once the card is fully out of view, so it's fresh when they scroll back.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) return;
        cancelPeek();
        isHoveringRef.current = false;
        hasExploredRef.current = false;
        hasInteractedRef.current = false;
        setIsHovering(false);
        setPercentage(0);
      },
      // threshold 0 → fires only when nothing of the card is left on screen
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const width = rect.width;
      const p = Math.max(0, Math.min(100, (x / width) * 100));
      setPercentage(p);
      trackProgress(p);
    }
  }, [trackProgress]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const width = rect.width;
      const p = Math.max(0, Math.min(100, (x / width) * 100));
      setPercentage(p);
      trackProgress(p);
    }
  }, [trackProgress]);

  // The pointer takes over from the idle demo the moment it arrives
  const startInteraction = () => {
    cancelPeek();
    hasInteractedRef.current = true;
    isHoveringRef.current = true;
    setIsHovering(true);
  };

  const handleTouchStart = startInteraction;
  const handleMouseEnter = startInteraction;

  // The divider stays exactly where they left it. It only returns to the redesign
  // once the card has scrolled out of view — see the reset observer below.
  const endInteraction = () => {
    isHoveringRef.current = false;
    setIsHovering(false);
    hasExploredRef.current = false;
    onInteractionEnd?.();
  };

  const handleTouchEnd = endInteraction;
  const handleMouseLeave = endInteraction;

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
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        className={`absolute top-0 left-0 w-full h-full object-${imageFit} object-center pointer-events-none ${!backgroundColor ? 'bg-cream-100' : ''}`}
        style={{ backgroundColor: backgroundColor }}
      />

      {/* Before Image (Foreground Mask - Original) */}
      <div
        className="absolute top-0 left-0 h-full overflow-hidden bg-white/5 shadow-[2px_0_8px_rgba(0,0,0,0.06)] pointer-events-none z-20"
        style={{
          width: `${percentage}%`,
          // Instant update when hovering (no lag), smooth reset when leaving
          transition: isHovering ? 'none' : 'width 0.6s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
      >
        <img
          src={beforeImage}
          alt={`Original: ${alt}`}
          // The "before" image is hidden behind a 0-width mask at rest — never eager
          loading="lazy"
          decoding="async"
          className={`absolute top-0 left-0 max-w-none h-full object-${imageFit} object-center pointer-events-none ${!backgroundColor ? 'bg-cream-300' : ''}`}
          style={{ width: containerWidth || '100%', backgroundColor: backgroundColor }}
        />

        {/* Badge: Original — only while comparing, so it never sits on top of the screen at rest */}
        <div
          className={`absolute top-4 left-4 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm z-10 transition-all duration-300 ${isHovering ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}
        >
          <span className="text-[9px] font-bold tracking-widest text-ink uppercase">Original</span>
        </div>
      </div>

      {/* Badge: Redesign (Always in DOM, covered by mask) */}
      <div
        className={`absolute top-4 right-4 bg-ink/75 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm pointer-events-none z-10 transition-all duration-300 ${isHovering ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}
      >
        <span className="text-[9px] font-bold tracking-widest text-white uppercase">Redesign</span>
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white z-20 pointer-events-none shadow-[0_0_6px_rgba(0,0,0,0.10)]"
        style={{
          left: `${percentage}%`,
          transition: isHovering ? 'none' : 'left 0.6s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
      >
        {/* Grip: six dots in three rows, inside a vertical pill */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[26px] h-12 bg-white/60 backdrop-blur-md border border-white/60 rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.10)] flex items-center justify-center">
          <div className="grid grid-cols-2 gap-x-[5px] gap-y-[5px]">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="block w-[3px] h-[3px] rounded-full bg-ink/70" />
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default CompareSlider;
