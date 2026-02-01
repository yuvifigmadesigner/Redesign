import React, { useState } from 'react';
import { RedesignCase } from '../types';
import CompareSlider from './CompareSlider';
import DesignThinkingCard from './DesignThinkingCard';
import { Plus, X, ArrowUpRight } from 'lucide-react';

interface Props {
    item: RedesignCase;
}

const BentoItem: React.FC<Props> = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);
    const isExternal = !!item.externalLink;

    // Determine span classes
    const getSpanClasses = (area: string) => {
        switch (area) {
            case 'large': return 'md:col-span-2 md:row-span-2';
            case 'wide': return 'md:col-span-2 md:row-span-1';
            case 'tall': return 'md:col-span-1 md:row-span-2';
            case 'small': default: return 'md:col-span-1 md:row-span-1';
        }
    };

    const handleClick = () => {
        if (isExternal && item.externalLink) {
            window.open(item.externalLink, '_blank', 'noopener,noreferrer');
        } else {
            setIsOpen(true);
        }
    };

    return (
        <div className={`relative flex flex-col ${getSpanClasses(item.gridArea)} ${(item.gridArea === 'tall' || item.id === 'web-3') ? 'h-[85vh]' : 'h-[320px]'} md:h-full group rounded-3xl bg-white shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-neutral-100`}>

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
                />

                {/* External Link Overlay Hint */}
                {isExternal && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10 flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur text-black px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-300 font-medium text-sm flex items-center gap-2">
                            View on Pinterest <ArrowUpRight size={14} />
                        </div>
                    </div>
                )}
            </div>

            {/* Card Info Footer */}
            <div className="relative z-20 bg-white px-6 py-5 border-t border-neutral-50 flex justify-between items-center transition-colors duration-300">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold tracking-widest uppercase ${isExternal ? 'text-red-600' : 'text-blue-600'}`}>
                            {item.category}
                        </span>
                    </div>
                    <h3 className="font-serif text-xl text-neutral-900 leading-none">
                        {item.title}
                    </h3>
                </div>

                {/* Action Button */}
                <button
                    onClick={handleClick}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${isExternal ? 'bg-red-50 hover:bg-red-600 hover:text-white text-red-600' : 'bg-neutral-50 hover:bg-black hover:text-white text-black'}`}
                    aria-label={isExternal ? "Open Link" : "View Details"}
                >
                    {isExternal ? <ArrowUpRight size={18} /> : <Plus size={18} />}
                </button>
            </div>

            {/* Detail View Overlay (Only renders if not external) */}
            {!isExternal && (
                <div className={`
            absolute inset-0 z-30 bg-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col
            ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        `}>
                    {/* Detail Header */}
                    <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-white sticky top-0 z-10">
                        <h3 className="font-serif text-lg text-neutral-900">Case Analysis</h3>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen(false);
                            }}
                            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors"
                        >
                            <X size={16} className="text-neutral-600" />
                        </button>
                    </div>

                    {/* Content Scroll */}
                    <div className="flex-1 overflow-y-auto p-8 bg-white">
                        <div className="max-w-xl mx-auto">
                            <div className="mb-8">
                                <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-2 block">
                                    Project Overview
                                </span>
                                <h2 className="font-serif text-3xl text-neutral-900 mb-4">{item.title}</h2>
                                <p className="text-neutral-600 leading-relaxed font-sans">{item.description}</p>
                            </div>

                            <div className="h-px w-full bg-neutral-100 mb-8"></div>

                            <DesignThinkingCard data={item.designThinking} />

                            <div className="mt-10 flex flex-wrap gap-2">
                                {item.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 rounded-full bg-neutral-100 text-[11px] font-semibold text-neutral-600 uppercase tracking-wide">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BentoItem;
