import React, { useEffect, useRef, useState } from 'react';
import { RedesignCase } from '../types';
import CompareSlider from './CompareSlider';
import DesignThinkingCard from './DesignThinkingCard';
import { Plus, ArrowUpRight, Crown } from 'lucide-react';
import { useInView } from '../hooks/useInView';

// How long the attention cue lingers after the pointer leaves the picture
const CUE_RESET_MS = 4000;

interface Props {
    item: RedesignCase;
    /** Position in the grid — staggers the reveal across each row */
    index?: number;
}

const BentoItem: React.FC<Props> = ({ item, index = 0 }) => {
    const { ref: revealRef, inView } = useInView<HTMLDivElement>();
    const [isOpen, setIsOpen] = useState(false);
    // Set once the visitor has swept the whole before/after difference — cues the action button
    const [hasExplored, setHasExplored] = useState(false);
    const isExternal = !!item.externalLink;

    // Cue is spent as soon as they act on it
    const showCue = hasExplored && !isOpen;

    const cueTimerRef = useRef<number | null>(null);

    const clearCueTimer = () => {
        if (cueTimerRef.current !== null) {
            window.clearTimeout(cueTimerRef.current);
            cueTimerRef.current = null;
        }
    };

    const handleExplored = () => {
        clearCueTimer();
        setHasExplored(true);
    };

    // Pointer left the picture — let the cue fade back to neutral if they don't come back
    const handleInteractionEnd = () => {
        clearCueTimer();
        cueTimerRef.current = window.setTimeout(() => setHasExplored(false), CUE_RESET_MS);
    };

    useEffect(() => clearCueTimer, []);

    // Determine span classes
    const getSpanClasses = (area: string) => {
        switch (area) {
            case 'large': return 'md:col-span-2 md:row-span-2';
            case 'wide': return 'md:col-span-2 md:row-span-1';
            case 'tall': return 'md:col-span-1 md:row-span-2';
            case 'small': default: return 'md:col-span-1 md:row-span-1';
        }
    };

    // Clicking the picture only ever opens; the button below toggles both ways
    const handleClick = () => {
        if (isExternal && item.externalLink) {
            window.open(item.externalLink, '_blank', 'noopener,noreferrer');
        } else {
            setIsOpen(true);
        }
    };

    const handleToggle = () => {
        if (isExternal && item.externalLink) {
            window.open(item.externalLink, '_blank', 'noopener,noreferrer');
            return;
        }
        setIsOpen((open) => !open);
    };

    return (
        <div
            ref={revealRef}
            style={{ animationDelay: `${(index % 3) * 0.09}s` }}
            className={`card-reveal ${inView ? 'is-revealed' : ''} relative flex flex-col ${getSpanClasses(item.gridArea)} ${(item.gridArea === 'tall' || item.id === 'web-3') ? 'h-[85vh]' : 'h-[320px]'} md:h-full group rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-500 overflow-hidden border border-cream-300`}
        >

            {/* Image Area - Clickable */}
            <div className="flex-1 relative w-full overflow-hidden cursor-pointer" onClick={handleClick}>
                {/* If it's an external link, we can just show one image or still use the slider for consistency. 
             Using slider maintains the interactive feel of the grid even for static links. */}
                <CompareSlider
                    beforeImage={item.beforeImage}
                    afterImage={item.afterImage}
                    alt={item.title}
                    className="w-full h-full"
                    backgroundColor={item.backgroundColor}
                    imageFit={item.imageFit}
                    onExplored={handleExplored}
                    onInteractionEnd={handleInteractionEnd}
                    priority={index === 0}
                />

                {/* External Link Overlay Hint */}
                {isExternal && (
                    <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors z-10 flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur text-ink px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-300 font-medium text-sm flex items-center gap-2">
                            View on Pinterest <ArrowUpRight size={14} />
                        </div>
                    </div>
                )}

                {/* Detail View Overlay — lives inside the picture so the info bar,
                    and with it the toggle button, never moves. */}
                {!isExternal && (
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className={`absolute inset-0 z-30 bg-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
                    >
                        {/* Detail Header */}
                        <div className="px-6 py-4 border-b border-cream-300 bg-white sticky top-0 z-10">
                            <h3 className="font-serif text-lg text-ink">Case Analysis</h3>
                        </div>

                        {/* Content Scroll */}
                        <div className="flex-1 overflow-y-auto p-8 bg-white">
                            <div className="max-w-xl mx-auto">
                                <div className="mb-8">
                                    <span className="text-[10px] font-bold tracking-widest uppercase text-muted-400 mb-2 block">
                                        Project Overview
                                    </span>
                                    <h2 className="font-serif text-3xl text-ink mb-4">{item.title}</h2>
                                    <p className="text-muted leading-relaxed font-sans">{item.description}</p>
                                </div>

                                <div className="h-px w-full bg-cream-100 mb-8"></div>

                                <DesignThinkingCard data={item.designThinking} />

                                <div className="mt-10 flex flex-wrap gap-2">
                                    {item.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 rounded-full bg-cream-100 text-[11px] font-semibold text-muted uppercase tracking-wide">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Card Info Footer */}
            <div className="relative z-20 bg-white px-6 py-5 border-t border-cream-200 flex justify-between items-center transition-colors duration-300">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold tracking-widest uppercase ${isExternal ? 'text-brand-700' : 'text-brand'}`}>
                            {item.category}
                        </span>
                    </div>
                    <h3 className="font-serif text-xl text-ink leading-none flex items-center gap-1.5">
                        {item.title}
                        {item.featured && (
                            <Crown
                                size={15}
                                fill="currentColor"
                                strokeWidth={1.5}
                                role="img"
                                aria-label="Featured"
                                className="text-[#EAB308] shrink-0 -translate-y-px"
                            />
                        )}
                    </h3>
                </div>

                {/* One button for both open and close — it never moves, the + just
                    rotates 45° into an ×. Fills in and pings once the difference is explored. */}
                <button
                    onClick={handleToggle}
                    className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${isExternal
                        ? (showCue ? 'bg-brand text-white shadow-sm shadow-brand/25' : 'bg-brand-50 hover:bg-brand hover:text-white text-brand-700')
                        : isOpen
                            ? 'bg-ink text-white'
                            : (showCue ? 'bg-brand text-white shadow-sm shadow-brand/25' : 'bg-cream-100 hover:bg-ink hover:text-white text-ink')}`}
                    aria-label={isExternal ? 'Open Link' : isOpen ? 'Close Details' : 'View Details'}
                    aria-expanded={isExternal ? undefined : isOpen}
                >
                    {showCue && (
                        <span
                            aria-hidden="true"
                            className="cta-ring absolute inset-0 rounded-full border-2 border-brand pointer-events-none"
                        />
                    )}
                    <span className={showCue ? 'cta-nudge' : undefined}>
                        {isExternal
                            ? <ArrowUpRight size={18} />
                            : <Plus size={18} className={`transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />}
                    </span>
                </button>
            </div>

        </div>
    );
};

export default BentoItem;
