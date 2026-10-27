import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import { FaqItem } from './types';
import { FAQ_ITEMS } from './supportData';

export interface FaqAccordionProps {
  items?: FaqItem[];
  className?: string;
  defaultExpandedIds?: string[];
}

export const FaqAccordion: React.FC<FaqAccordionProps> = ({
  items = FAQ_ITEMS,
  className = '',
  defaultExpandedIds = ['faq-1'],
}) => {
  const [expandedIds, setExpandedIds] = useState<string[]>(defaultExpandedIds);

  const toggleItem = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const areAllExpanded = items.length > 0 && expandedIds.length === items.length;

  const handleToggleAll = () => {
    if (areAllExpanded) {
      setExpandedIds([]);
    } else {
      setExpandedIds(items.map((i) => i.id));
    }
  };

  return (
    <div
      data-testid="faq-accordion"
      id="faq-section"
      className={`bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-xs flex flex-col min-w-0 ${className}`}
    >
      {/* Header matching reference */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
          Популярные вопросы
        </h2>

        <button
          type="button"
          onClick={handleToggleAll}
          data-testid="faq-toggle-all-button"
          className="text-xs font-medium text-slate-500 hover:text-emerald-700 hover:bg-slate-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
        >
          {areAllExpanded ? 'Свернуть все' : 'Смотреть все'}
        </button>
      </div>

      {/* FAQ Items List */}
      <div className="divide-y divide-slate-100">
        {items.map((item) => {
          const isExpanded = expandedIds.includes(item.id);

          return (
            <div key={item.id} className="py-2.5 first:pt-3 last:pb-1">
              <button
                type="button"
                data-testid={`faq-item-toggle-${item.id}`}
                aria-expanded={isExpanded}
                aria-controls={`faq-answer-${item.id}`}
                onClick={() => toggleItem(item.id)}
                className="w-full flex items-center justify-between gap-4 py-2 text-left group cursor-pointer rounded-lg hover:bg-slate-50/70 px-2 -mx-2 transition-colors"
              >
                <span className="text-sm sm:text-base font-semibold text-slate-800 group-hover:text-emerald-800 transition-colors break-words">
                  {item.question}
                </span>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-slate-400 group-hover:text-emerald-700 transition-all shrink-0 ${
                    isExpanded ? 'rotate-90 text-emerald-700' : ''
                  }`}
                >
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? '' : '-rotate-90'}`} />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    id={`faq-answer-${item.id}`}
                    data-testid={`faq-item-answer-${item.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="pt-2 pb-3 px-3 text-xs sm:text-sm text-slate-600 leading-relaxed break-words bg-emerald-50/30 rounded-xl my-1 border border-emerald-100/50">
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <p>{item.answer}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
