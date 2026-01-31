import React from 'react';
import { RedesignCase } from '../types';

interface Props {
  data: RedesignCase['designThinking'];
}

const DesignThinkingCard: React.FC<Props> = ({ data }) => {
  return (
    <div className="mt-8 space-y-8">
      
      <div className="grid grid-cols-1 gap-6">
        {/* Problem */}
        <div>
            <h4 className="font-sans text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">The Challenge</h4>
            <p className="font-serif text-lg text-neutral-800 leading-relaxed italic border-l-2 border-red-200 pl-4">
                "{data.problem}"
            </p>
        </div>

        {/* Solution */}
        <div>
            <h4 className="font-sans text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">The Solution</h4>
            <p className="font-sans text-sm text-neutral-600 leading-relaxed pl-4">
                {data.solution}
            </p>
        </div>
      </div>

      {/* Key Decision Highlight */}
      <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-100">
        <h4 className="font-sans text-xs font-bold text-neutral-900 uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
            Key Strategic Decision
        </h4>
        <p className="font-sans text-sm font-medium text-neutral-700 leading-relaxed">
            {data.keyDecision}
        </p>
      </div>
    </div>
  );
};

export default DesignThinkingCard;
