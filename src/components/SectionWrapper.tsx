
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SectionWrapperProps {
  id: string;
  title: string;
  children: React.ReactNode;
  forceOpen?: boolean;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ id, title, children, forceOpen }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
    }
  }, [forceOpen]);

  return (
    <section id={id} className="py-4 px-4 md:px-8 max-w-6xl mx-auto scroll-mt-24">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left flex items-center justify-between p-6 bg-white rounded-2xl shadow-sm border transition-all duration-300 ${
          isOpen ? 'border-blue-500 ring-1 ring-blue-500/20 mb-4' : 'border-slate-100 hover:border-blue-300'
        }`}
      >
        <div className="flex items-center gap-4">
          <span className={`w-2 h-8 rounded-full transition-colors duration-300 ${isOpen ? 'bg-blue-600' : 'bg-slate-300'}`}></span>
          <h2 className={`text-xl md:text-2xl font-bold transition-colors duration-300 ${isOpen ? 'text-slate-900' : 'text-slate-500'}`}>
            {title}
          </h2>
        </div>
        <div className={`p-2 rounded-full transition-colors ${isOpen ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
          {isOpen ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-[2000px] opacity-100 mb-12' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-10 leading-relaxed text-slate-700 animate-in fade-in slide-in-from-top-4 duration-500">
          {children}
        </div>
      </div>
    </section>
  );
};

export default SectionWrapper;
