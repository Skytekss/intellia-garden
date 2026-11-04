import React, { useEffect } from 'react';
import { X, Printer, Download, FileText, CheckCircle2 } from 'lucide-react';
import { SimulatedSectorForecast } from '../../types';
import { useApp } from '../../context/AppContext';
import { downloadForecastCsv } from '../../utils/exportUtils';

export interface HarvestReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  rows: SimulatedSectorForecast[];
}

export const HarvestReportModal: React.FC<HarvestReportModalProps> = ({
  isOpen,
  onClose,
  rows,
}) => {
  const { isEnglish, farmProfile, tempAnomaly, rainCondition, isSimulationActive } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handlePrint = () => {
    window.print();
  };

  const handleCsvExport = () => {
    downloadForecastCsv(rows, farmProfile, isEnglish);
  };

  const todayStr = new Date().toLocaleDateString(isEnglish ? 'en-US' : 'ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
      data-testid="harvest-report-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs cursor-pointer print:hidden animate-in fade-in duration-200"
      />

      {/* Modal Container */}
      <div
        className="relative bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-3xl w-full p-4 sm:p-7 space-y-6 my-auto max-h-[90vh] overflow-y-auto z-10 animate-in zoom-in-95 fade-in duration-200"
      >
            {/* Top Action Bar (hidden on print) */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-700" />
            <span className="text-sm font-bold text-slate-900">
              {isEnglish ? 'Agronomic Forecast Report Preview' : 'Предпросмотр агрономического отчета'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              data-testid="report-csv-download-btn"
              onClick={handleCsvExport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>CSV</span>
            </button>

            <button
              type="button"
              data-testid="report-print-btn"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isEnglish ? 'Print / PDF' : 'Печать / PDF'}</span>
            </button>

            <button
              type="button"
              data-testid="report-close-btn"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer ml-1"
              aria-label={isEnglish ? 'Close' : 'Закрыть'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Paper */}
        <div
          id="printable-harvest-report"
          className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-6 text-slate-900 font-sans"
        >
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b-2 border-emerald-900/80">
            <div>
              <div className="text-xs uppercase tracking-widest font-black text-emerald-800">
                «ИНТЕЛЛИЯ» • SMART ORCHARD SYSTEMS
              </div>
              <h1
                id="report-modal-title"
                className="text-lg sm:text-xl font-black text-slate-900 mt-1"
              >
                {isEnglish
                  ? 'Official Apple Ripening & Harvest Window Report'
                  : 'Агрономический отчет: Сроки уборки и зрелость плодов'}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {farmProfile.name} • {farmProfile.region} • {farmProfile.areaHa} {isEnglish ? 'ha' : 'га'}
              </p>
            </div>

            <div className="text-xs text-slate-500 text-left sm:text-right space-y-0.5 shrink-0 font-mono">
              <div>{isEnglish ? 'Date:' : 'Дата отчета:'} <span className="font-semibold text-slate-800">{todayStr}</span></div>
              <div>{isEnglish ? 'Survey UAV:' : 'Съемка БПЛА:'} <span className="font-semibold text-slate-800">{farmProfile.lastSurveyDate || '12.08.2025'}</span></div>
              {isSimulationActive && (
                <div className="text-amber-700 font-sans font-semibold">
                  {isEnglish ? 'Simulation:' : 'Сценарий:'} {tempAnomaly > 0 ? `+${tempAnomaly}` : tempAnomaly}°C / {rainCondition}
                </div>
              )}
            </div>
          </div>

          {/* Sector Table */}
          <div className="overflow-x-auto min-w-0">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider bg-slate-50">
                  <th className="py-2.5 px-3">{isEnglish ? 'Sector' : 'Участок'}</th>
                  <th className="py-2.5 px-3">{isEnglish ? 'Variety' : 'Сорт'}</th>
                  <th className="py-2.5 px-3">{isEnglish ? 'Readiness' : 'Зрелость'}</th>
                  <th className="py-2.5 px-3">{isEnglish ? 'Harvest Window' : 'Окно сбора'}</th>
                  <th className="py-2.5 px-3">{isEnglish ? 'Agronomic Verdict' : 'Вердикт агронома'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                      {row.name}
                    </td>
                    <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                      {row.variety}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="font-bold text-slate-900">{row.simulatedMaturityPercent}%</span>
                      {row.simulatedMaturityPercent !== row.maturityPercent && (
                        <span className="text-xs text-slate-400 ml-1">
                          ({isEnglish ? 'base' : 'баз.'} {row.maturityPercent}%)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="font-semibold text-emerald-900">{row.simulatedDate}</span>
                      {row.deltaDays !== 0 && (
                        <span className={`text-xs ml-1.5 font-bold ${
                          row.deltaDays < 0 ? 'text-emerald-700' : 'text-blue-700'
                        }`}>
                          ({row.deltaDays < 0 ? `${row.deltaDays}` : `+${row.deltaDays}`} {isEnglish ? 'd.' : 'дн.'})
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-600 text-xs max-w-xs leading-relaxed">
                      {row.riskNotice || (isEnglish ? 'Optimal harvest' : 'Оптимальный сбор')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signatures & Certification */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-600">
            <div>
              <div className="font-bold text-slate-900 mb-1">
                {isEnglish ? 'Verification & Compliance' : 'Верификация данных'}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isEnglish
                  ? 'Multispectral analysis verified against Streif Index and refractometer ground truth samples.'
                  : 'Мультиспектральные индексы откалиброваны по индексу Стрейфа и полевым замерам сахаристости.'}
              </p>
            </div>

            <div className="flex flex-col justify-end space-y-3 sm:text-right">
              <div>
                <span className="text-slate-400 text-xs block">
                  {isEnglish ? 'Chief Agronomist' : 'Главный агроном хозяйства'}:
                </span>
                <span className="font-bold text-slate-900 text-sm">
                  {isEnglish ? 'Elizaveta B. (Intellia Agritech)' : 'Елизавета Б. / «ИНТЕЛЛИЯ»'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 sm:justify-end text-emerald-800 font-semibold text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isEnglish ? 'Digitally Signed & Validated' : 'Цифровая подпись подтверждена'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
