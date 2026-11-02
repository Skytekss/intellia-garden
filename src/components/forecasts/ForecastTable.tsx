import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  Calendar,
  ChevronRight,
  X,
  Truck,
  Download,
  Printer,
} from 'lucide-react';
import { motion } from 'motion/react';
import { ForecastSectorRow, SimulatedSectorForecast } from '../../types';
import { useApp } from '../../context/AppContext';
import { mockForecastRows, getMaturityColor, getMaturityMetadata } from '../../data/mockData';
import { downloadForecastCsv } from '../../utils/exportUtils';
import { HarvestLogisticsModal } from './HarvestLogisticsModal';
import { HarvestReportModal } from './HarvestReportModal';

interface ForecastTableProps {
  rows?: Array<ForecastSectorRow | SimulatedSectorForecast>;
  onSelectRow?: (row: ForecastSectorRow) => void;
  className?: string;
}

type SortField = 'name' | 'variety' | 'maturityPercent' | 'recommendedDate';
type SortOrder = 'asc' | 'desc';

const getStatusDotColor = (
  _color: ForecastSectorRow['statusColor'],
  percent: number
): string => {
  return getMaturityColor(percent);
};

const getStatusLabel = (percent: number): string => {
  return getMaturityMetadata(percent).label;
};

export const ForecastTable: React.FC<ForecastTableProps> = ({
  rows = mockForecastRows,
  onSelectRow,
  className = '',
}) => {
  const { isEnglish, t, sectors, farmProfile } = useApp();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [varietyFilter, setVarietyFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  // Modals
  const [isLogisticsModalOpen, setIsLogisticsModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // Available unique varieties
  const varieties = useMemo(() => {
    const list = Array.from(new Set(rows.map((r) => r.variety)));
    return ['all', ...list];
  }, [rows]);

  // Filtering and Sorting
  const filteredAndSortedRows = useMemo(() => {
    let result = [...rows];

    // Filter by search query (sector name or variety)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (row) =>
          row.name.toLowerCase().includes(q) ||
          row.variety.toLowerCase().includes(q) ||
          (row as SimulatedSectorForecast).simulatedDate?.toLowerCase().includes(q) ||
          row.recommendedDate.toLowerCase().includes(q)
      );
    }

    // Filter by variety
    if (varietyFilter !== 'all') {
      result = result.filter((row) => row.variety === varietyFilter);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      const aPercent = (a as SimulatedSectorForecast).simulatedMaturityPercent ?? a.maturityPercent;
      const bPercent = (b as SimulatedSectorForecast).simulatedMaturityPercent ?? b.maturityPercent;

      if (sortField === 'maturityPercent') {
        comparison = aPercent - bPercent;
      } else if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name, 'ru');
      } else if (sortField === 'variety') {
        comparison = a.variety.localeCompare(b.variety, 'ru');
      } else if (sortField === 'recommendedDate') {
        const aDate = (a as SimulatedSectorForecast).simulatedDate || a.recommendedDate;
        const bDate = (b as SimulatedSectorForecast).simulatedDate || b.recommendedDate;
        comparison = aDate.localeCompare(bDate, 'ru');
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [rows, searchQuery, varietyFilter, sortField, sortOrder]);

  const handleSortToggle = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleRowClick = (row: ForecastSectorRow | SimulatedSectorForecast) => {
    setSelectedRowId((prev) => (prev === row.id ? null : row.id));
    if (onSelectRow) {
      onSelectRow(row);
    }
  };

  const selectedRow = rows.find((r) => r.id === selectedRowId) || null;

  // Normalized simulated rows for CSV / Report export
  const normalizedSimulatedRows: SimulatedSectorForecast[] = useMemo(() => {
    return rows.map((r) => {
      const sim = r as SimulatedSectorForecast;
      return {
        ...r,
        originalDate: sim.originalDate || r.recommendedDate,
        simulatedDate: sim.simulatedDate || r.recommendedDate,
        deltaDays: sim.deltaDays ?? 0,
        simulatedMaturityPercent: sim.simulatedMaturityPercent ?? r.maturityPercent,
        riskNotice: sim.riskNotice || (isEnglish ? 'Optimal harvest' : 'Оптимальный сбор'),
        riskNoticeEn: sim.riskNoticeEn || (isEnglish ? 'Optimal harvest' : 'Оптимальный сбор'),
      };
    });
  }, [rows, isEnglish]);

  const handleExportCsv = () => {
    downloadForecastCsv(normalizedSimulatedRows, farmProfile, isEnglish);
  };

  return (
    <div
      data-testid="forecast-table-container"
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-6 transition-all duration-200 w-full min-w-0 overflow-hidden ${className}`}
    >
      {/* Table Header with Title, Actions & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-5 border-b border-slate-100">
        <div>
          <h2
            data-testid="forecast-table-title"
            className="text-base sm:text-lg font-bold text-slate-800 tracking-tight"
          >
            {t('forecasts.table.title') || 'Рекомендованные даты сбора'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isEnglish
              ? 'Operational calculation of sector maturity based on multispectral analysis'
              : 'Оперативный расчет зрелости по участкам на основе мультиспектрального анализа'}
          </p>
        </div>

        {/* Actions & Filters */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Action: Logistics Calculator */}
          <button
            type="button"
            data-testid="btn-open-logistics"
            onClick={() => setIsLogisticsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            title={t('forecasts.logistics.btn')}
          >
            <Truck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="hidden sm:inline">{t('forecasts.logistics.btn')}</span>
          </button>

          {/* Action: Export CSV */}
          <button
            type="button"
            data-testid="btn-export-csv"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            title={t('forecasts.export.btn')}
          >
            <Download className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="hidden sm:inline">{t('forecasts.export.btn')}</span>
          </button>

          {/* Action: Print Report */}
          <button
            type="button"
            data-testid="btn-print-report"
            onClick={() => setIsReportModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            title={t('forecasts.print.btn')}
          >
            <Printer className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="hidden sm:inline">{t('forecasts.print.btn')}</span>
          </button>

          {/* Search Input */}
          <div className="relative min-w-[150px] sm:min-w-[180px] flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              data-testid="forecast-table-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEnglish ? 'Search...' : 'Поиск...'}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                aria-label={isEnglish ? 'Clear search' : 'Очистить поиск'}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Variety Filter Dropdown */}
          <div className="relative inline-flex items-center">
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <select
              data-testid="forecast-table-variety-filter"
              value={varietyFilter}
              onChange={(e) => setVarietyFilter(e.target.value)}
              className="pl-8 pr-7 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white cursor-pointer appearance-none transition-all"
            >
              <option value="all">{isEnglish ? 'All varieties' : 'Все сорта'}</option>
              {varieties.filter((v) => v !== 'all').map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Responsive Table Container */}
      <div className="relative w-full max-w-full overflow-x-auto min-w-0 mt-3 sm:mt-4">
        <table
          data-testid="forecast-table"
          className="w-full min-w-[540px] text-left border-collapse"
        >
          <thead>
            <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-3 sm:px-4">
                <button
                  type="button"
                  onClick={() => handleSortToggle('name')}
                  className="inline-flex items-center gap-1.5 hover:text-slate-700 cursor-pointer transition-colors"
                >
                  <span>{isEnglish ? 'Sector' : 'Участок'}</span>
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </th>
              <th className="py-3 px-3 sm:px-4">
                <button
                  type="button"
                  onClick={() => handleSortToggle('variety')}
                  className="inline-flex items-center gap-1.5 hover:text-slate-700 cursor-pointer transition-colors"
                >
                  <span>{isEnglish ? 'Variety' : 'Сорт'}</span>
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </th>
              <th className="py-3 px-3 sm:px-4">
                <button
                  type="button"
                  onClick={() => handleSortToggle('maturityPercent')}
                  className="inline-flex items-center gap-1.5 hover:text-slate-700 cursor-pointer transition-colors"
                >
                  <span>{isEnglish ? 'Maturity Degree' : 'Степень зрелости'}</span>
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </th>
              <th className="py-3 px-3 sm:px-4">
                <button
                  type="button"
                  onClick={() => handleSortToggle('recommendedDate')}
                  className="inline-flex items-center gap-1.5 hover:text-slate-700 cursor-pointer transition-colors"
                >
                  <span>{isEnglish ? 'Recommended Date' : 'Рекомендуемая дата'}</span>
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </th>
              <th className="py-3 px-2 sm:px-3 text-right">
                <span className="sr-only">{isEnglish ? 'Actions' : 'Действия'}</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAndSortedRows.length > 0 ? (
              filteredAndSortedRows.map((row) => {
                const isSelected = selectedRowId === row.id;
                const simRow = row as SimulatedSectorForecast;
                const displayMaturity = simRow.simulatedMaturityPercent ?? row.maturityPercent;
                const displayDate = simRow.simulatedDate || row.recommendedDate;
                const deltaDays = simRow.deltaDays ?? 0;
                const dotColor = getStatusDotColor(row.statusColor, displayMaturity);

                return (
                  <tr
                    key={row.id}
                    data-testid={`forecast-row-${row.id}`}
                    onClick={() => handleRowClick(row)}
                    className={`group cursor-pointer transition-colors duration-150 ${
                      isSelected
                        ? 'bg-emerald-50/70'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    {/* 1. Участок */}
                    <td className="py-3.5 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span>{row.name}</span>
                        {isSelected && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            {isEnglish ? 'Selected' : 'Выбран'}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 2. Сорт */}
                    <td className="py-3.5 px-3 sm:px-4 text-xs sm:text-sm font-medium text-slate-700 whitespace-nowrap">
                      {row.variety}
                    </td>

                    {/* 3. Степень зрелости */}
                    <td className="py-3.5 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-slate-800 whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <span
                          data-testid={`maturity-dot-${row.id}`}
                          className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                          style={{ backgroundColor: dotColor }}
                          aria-hidden="true"
                        />
                        <span>{displayMaturity}%</span>
                        {simRow.simulatedMaturityPercent !== undefined &&
                          simRow.simulatedMaturityPercent !== row.maturityPercent && (
                            <span className="text-[11px] text-slate-400 font-normal">
                              ({row.maturityPercent}%)
                            </span>
                          )}
                      </div>
                    </td>

                    {/* 4. Рекомендуемая дата со сдвигом */}
                    <td className="py-3.5 px-3 sm:px-4 text-xs sm:text-sm font-medium text-slate-700 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-semibold text-slate-800">{displayDate}</span>
                        {deltaDays !== 0 && (
                          <span
                            data-testid={`row-delta-${row.id}`}
                            className={`px-1.5 py-0.5 rounded-md text-[11px] font-bold ${
                              deltaDays < 0
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {deltaDays < 0 ? `${deltaDays} дн.` : `+${deltaDays} дн.`}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Arrow Action indicator */}
                    <td className="py-3.5 px-2 sm:px-3 text-right whitespace-nowrap">
                      <ChevronRight
                        className={`w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all ${
                          isSelected ? 'rotate-90 text-emerald-700' : ''
                        }`}
                      />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="py-8 text-center text-xs text-slate-500 font-medium"
                >
                  {isEnglish
                    ? `No sectors found matching "${searchQuery}".`
                    : `Участки не найдены по запросу «${searchQuery}».`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Expanded Row Detail Summary */}
      {selectedRow && (
        <motion.div
          key={selectedRow.id}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          data-testid="forecast-row-detail-summary"
          className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200/90 text-xs text-slate-700 space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{isEnglish ? 'Details:' : 'Детализация:'} {selectedRow.name} ({selectedRow.variety})</span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedRowId(null)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              aria-label={isEnglish ? 'Collapse details' : 'Свернуть детализацию'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200/60">
            <div>
              <span className="text-slate-500 block">{isEnglish ? 'Current maturity:' : 'Текущая зрелость:'}</span>
              <span className="font-semibold text-slate-900 text-sm">
                {(selectedRow as SimulatedSectorForecast).simulatedMaturityPercent ?? selectedRow.maturityPercent}% ({
                  isEnglish
                    ? (((selectedRow as SimulatedSectorForecast).simulatedMaturityPercent ?? selectedRow.maturityPercent) >= 75
                        ? 'Ready for harvest'
                        : ((selectedRow as SimulatedSectorForecast).simulatedMaturityPercent ?? selectedRow.maturityPercent) >= 55
                        ? 'Ripening'
                        : 'Early phase')
                    : getStatusLabel((selectedRow as SimulatedSectorForecast).simulatedMaturityPercent ?? selectedRow.maturityPercent)
                })
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">{isEnglish ? 'Harvest window:' : 'Окно сбора:'}</span>
              <span className="font-semibold text-emerald-800 text-sm">
                {(selectedRow as SimulatedSectorForecast).simulatedDate || selectedRow.recommendedDate}
              </span>
              {(selectedRow as SimulatedSectorForecast).deltaDays ? (
                <span className="text-[11px] text-slate-500 block">
                  {isEnglish ? 'Baseline:' : 'Базовое:'} {(selectedRow as SimulatedSectorForecast).originalDate}
                </span>
              ) : null}
            </div>
            <div>
              <span className="text-slate-500 block">{isEnglish ? 'Agro-recommendation:' : 'Агро-рекомендация:'}</span>
              <span className="font-medium text-slate-800">
                {(selectedRow as SimulatedSectorForecast).riskNotice ||
                  (((selectedRow as SimulatedSectorForecast).simulatedMaturityPercent ?? selectedRow.maturityPercent) >= 75
                    ? (isEnglish ? 'Priority harvest in dry weather' : 'Приоритетный сбор в сухую погоду')
                    : (isEnglish ? 'Control drone flight in 5 days' : 'Контрольный облет через 5 дней'))}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Logistics Modal */}
      <HarvestLogisticsModal
        isOpen={isLogisticsModalOpen}
        onClose={() => setIsLogisticsModalOpen(false)}
        sectors={sectors}
      />

      {/* Print Report Modal */}
      <HarvestReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        rows={normalizedSimulatedRows}
      />
    </div>
  );
};
