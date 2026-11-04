import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  BookOpen,
  Search,
  Clock,
  ChevronRight,
  CheckCircle2,
  Copy,
  Printer,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { GuideArticle } from './types';
import { useApp } from '../../context/AppContext';
import { getLocalizedGuides } from '../../context/localizedData';

export interface GuidesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialGuideId?: string;
}

export const GuidesModal: React.FC<GuidesModalProps> = ({
  isOpen,
  onClose,
  initialGuideId,
}) => {
  const { isEnglish } = useApp();
  const guides = getLocalizedGuides(isEnglish);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeGuideId, setActiveGuideId] = useState<string | null>(initialGuideId || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveGuideId(initialGuideId || null);
      setSearchQuery('');
      setSelectedCategory('all');
      setCopiedId(null);
    }
  }, [isOpen, initialGuideId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const categories = useMemo(() => {
    return [
      { id: 'all', label: isEnglish ? 'All Guides' : 'Все регламенты' },
      { id: 'uav', label: isEnglish ? 'UAV Survey' : 'БПЛА и съемка' },
      { id: 'spectral', label: isEnglish ? 'Spectral Analysis' : 'Спектральный анализ' },
      { id: 'map', label: isEnglish ? 'Garden Map' : 'Карта сада' },
      { id: 'hardware', label: isEnglish ? 'Hardware & IoT' : 'Оборудование и IoT' },
    ];
  }, [isEnglish]);

  const filteredGuides = useMemo(() => {
    return guides.filter((guide) => {
      const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        guide.title.toLowerCase().includes(q) ||
        guide.summary.toLowerCase().includes(q) ||
        guide.steps.some(
          (s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
        );
      return matchesCategory && matchesSearch;
    });
  }, [guides, selectedCategory, searchQuery]);

  const activeGuide = guides.find((g) => g.id === activeGuideId) || null;

  const handleCopyGuide = (guide: GuideArticle) => {
    const text = `${guide.title}\n\n${guide.summary}\n\n` +
      guide.steps.map((s) => `${s.stepNumber}. ${s.title}\n${s.description}${s.tip ? `\nСовет: ${s.tip}` : ''}`).join('\n\n');
    navigator.clipboard?.writeText(text);
    setCopiedId(guide.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="guides-modal-title"
      data-testid="guides-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        data-testid="guides-modal-backdrop"
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs cursor-pointer animate-in fade-in duration-200"
      />

      {/* Modal Dialog Card */}
      <div className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full p-4 sm:p-6 md:p-7 space-y-5 my-auto z-10 animate-in zoom-in-95 fade-in duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
              <BookOpen className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2
                id="guides-modal-title"
                data-testid="guides-modal-title"
                className="text-base sm:text-lg font-bold text-slate-900 tracking-tight"
              >
                {isEnglish ? 'Knowledge Base & Standard Procedures' : 'Инструкции и регламенты работы'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEnglish
                  ? 'Practical step-by-step SOPs for drone operations, spectral calibration, and harvest analytics'
                  : 'Пошаговые регламенты предполетной подготовки, калибровки спектра и работы с картой'}
              </p>
            </div>
          </div>

          <button
            type="button"
            data-testid="guides-modal-close"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label={isEnglish ? 'Close modal' : 'Закрыть окно'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Detailed Article View if active */}
        {activeGuide ? (
          <div data-testid="guide-detailed-view" className="space-y-4 overflow-y-auto flex-1 pr-1">
            {/* Back Button & Actions */}
            <div className="flex items-center justify-between gap-2 pb-2">
              <button
                type="button"
                data-testid="guide-back-button"
                onClick={() => setActiveGuideId(null)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{isEnglish ? 'Back to all guides' : 'Назад ко всем инструкциям'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-testid="guide-copy-button"
                  onClick={() => handleCopyGuide(activeGuide)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  {copiedId === activeGuide.id ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span className="text-emerald-800 font-semibold">
                        {isEnglish ? 'Copied' : 'Скопировано'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>{isEnglish ? 'Copy' : 'Копировать'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  data-testid="guide-print-button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  <span>{isEnglish ? 'Print' : 'Печать'}</span>
                </button>
              </div>
            </div>

            {/* Guide Title & Meta */}
            <div className="bg-emerald-50/70 border border-emerald-100/90 rounded-2xl p-4 sm:p-5 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  {activeGuide.categoryLabel}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {activeGuide.readTimeMinutes} {isEnglish ? 'min read' : 'мин чтения'}
                </span>
                <span className="text-xs text-slate-400">• {activeGuide.updatedAt}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">{activeGuide.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{activeGuide.summary}</p>
            </div>

            {/* Step-by-Step Sections */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {isEnglish ? 'Standard Operational Procedure' : 'Пошаговый регламент действий'}
              </h4>

              {activeGuide.steps.map((step) => (
                <div
                  key={step.stepNumber}
                  data-testid={`guide-step-${step.stepNumber}`}
                  className="p-4 rounded-2xl border border-slate-200/90 bg-white space-y-2 shadow-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#07503b] text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {step.stepNumber}
                    </span>
                    <h5 className="text-xs sm:text-sm font-bold text-slate-900">{step.title}</h5>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-8.5">{step.description}</p>
                  {step.tip && (
                    <div className="ml-8.5 mt-2 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/70 text-xs text-amber-900 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <span>{step.tip}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Guides List View with Search & Filters */
          <div className="space-y-4 overflow-y-auto flex-1 pr-1">
            {/* Search and Category Filters */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  data-testid="guides-search-input"
                  placeholder={
                    isEnglish
                      ? 'Search guides by keywords (drone, NDVI, calibration, sensors)...'
                      : 'Поиск по инструкциям (дрон, NDVI, калибровка, датчики)...'
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Categories Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    data-testid={`guides-category-${cat.id}`}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-[#07503b] text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Guides List */}
            {filteredGuides.length === 0 ? (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs">
                  {isEnglish ? 'No guides match your search.' : 'По вашему запросу инструкции не найдены.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {filteredGuides.map((guide) => (
                  <div
                    key={guide.id}
                    data-testid={`guide-item-${guide.id}`}
                    onClick={() => setActiveGuideId(guide.id)}
                    className="p-4 rounded-2xl border border-slate-200/90 hover:border-emerald-300/80 bg-white hover:bg-emerald-50/20 transition-all cursor-pointer shadow-xs flex flex-col justify-between group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100">
                          {guide.categoryLabel}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {guide.readTimeMinutes} {isEnglish ? 'min' : 'мин'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">
                        {guide.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {guide.summary}
                      </p>
                    </div>

                    <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-800 font-semibold">
                      <span>{isEnglish ? 'Read SOP' : 'Читать регламент'}</span>
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end pt-3 border-t border-slate-100 shrink-0">
          <button
            type="button"
            data-testid="guides-modal-done"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#07503b] hover:bg-[#096047] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            {isEnglish ? 'Close' : 'Закрыть'}
          </button>
        </div>
      </div>
    </div>
  );
};
