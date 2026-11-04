import React from 'react';
import { motion, Variants } from 'motion/react';
import {
  Scan,
  Droplets,
  CloudSun,
  BrainCircuit,
  ArrowRight,
} from 'lucide-react';
import { BentoItem } from '../../types';
import { mockBentoItems } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import { getLocalizedSectors, getLocalizedAgroRecords } from '../../context/localizedData';

export interface BentoCardsProps {
  items?: BentoItem[];
  onSelectCard?: (categoryId: string) => void;
  className?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: 'easeOut',
    },
  },
};

export const BentoCards: React.FC<BentoCardsProps> = ({
  items = mockBentoItems,
  onSelectCard,
  className = '',
}) => {
  const {
    isEnglish,
    formatTemperature,
    formatPrecipitation,
    currentFarm,
    sectors: rawSectors,
    surveyHistory,
    agroRecords,
  } = useApp();

  const sectors = getLocalizedSectors(isEnglish, rawSectors);

  // Dynamic urgent sector calculation
  const urgentSector = sectors.length > 0
    ? [...sectors].sort((a, b) => b.maturityPercent - a.maturityPercent)[0]
    : null;

  // Drone survey & NDVI
  const latestSurvey = surveyHistory && surveyHistory.length > 0 ? surveyHistory[0] : null;
  const avgNdvi = latestSurvey
    ? latestSurvey.ndviAvg
    : (sectors.length > 0 ? sectors.reduce((acc, s) => acc + s.ndviIndex, 0) / sectors.length : 0.84);

  // Dynamic soil moisture calculation
  const avgSoilMoisture = sectors.length > 0
    ? Math.round(sectors.reduce((acc, s) => acc + s.soilMoisturePercent, 0) / sectors.length)
    : 68;

  // Latest agro record (localized)
  const localizedAgroRecords = getLocalizedAgroRecords(isEnglish, agroRecords);
  const latestAgro = localizedAgroRecords && localizedAgroRecords.length > 0 ? localizedAgroRecords[0] : null;

  // Current farm weather
  const farmTemp = currentFarm?.weather?.temperature ?? 18;
  const farmRain = currentFarm?.weather?.precipitationMm ?? 0;

  const getBentoDetails = (category: string) => {
    switch (category) {
      case 'drone':
        return {
          title: isEnglish ? 'Hyperspectral Drone Telemetry' : 'Гиперспектральные данные с дрона',
          subtitle: isEnglish ? 'Canopy & fruit health assessment' : 'Анализ состояния деревьев и плодов',
          metric: `NDVI / NDRE ${avgNdvi.toFixed(2)}`,
          badge: latestSurvey ? `${latestSurvey.droneModel}` : (isEnglish ? '8 spectral zones' : '8 спектральных зон'),
          icon: Scan,
        };
      case 'agritech':
        return {
          title: isEnglish ? 'Agrotechnical Data' : 'Агротехнические данные',
          subtitle: isEnglish ? 'Irrigation, fertilizers, treatments' : 'Полив, удобрения, обработка',
          metric: isEnglish ? `Soil Moisture ${avgSoilMoisture}%` : `Влажность почвы ${avgSoilMoisture}%`,
          badge: latestAgro
            ? (isEnglish ? `Last: ${latestAgro.type}` : `Посл.: ${latestAgro.type}`)
            : (isEnglish ? 'Drip irrigation active' : 'Капельный полив активен'),
          icon: Droplets,
        };
      case 'meteo':
        return {
          title: isEnglish ? 'Meteo & Climate' : 'Метеоданные',
          subtitle: isEnglish ? 'Temperature, rain, forecasts' : 'Температура, осадки, погода',
          metric: `${formatTemperature(farmTemp)} / ${formatPrecipitation(farmRain)}`,
          badge: farmRain > 1
            ? (isEnglish ? 'Precipitation detected' : 'Осадки в саду')
            : (isEnglish ? 'Favorable for harvest' : 'Благоприятно для сбора'),
          icon: CloudSun,
        };
      case 'ai':
        return {
          title: isEnglish ? 'AI Harvest Analytics' : 'AI-аналитика',
          subtitle: isEnglish ? 'Ripening map & harvest recommendations' : 'Карта зрелости и рекомендации',
          metric: isEnglish ? 'Accuracy 94.6%' : 'Точность 94.6%',
          badge: urgentSector
            ? (isEnglish
                ? `${urgentSector.name}: ready (${urgentSector.maturityPercent}%)`
                : `${urgentSector.name}: готов (${urgentSector.maturityPercent}%)`)
            : (isEnglish ? 'Sector 4: ready for harvest (85%)' : 'Сектор 4: готов к сбору (85%)'),
          icon: BrainCircuit,
        };
      default:
        return {
          title: isEnglish ? 'Monitoring' : 'Мониторинг',
          subtitle: isEnglish ? 'Garden telemetry' : 'Телеметрия сада',
          metric: isEnglish ? 'Active' : 'Активно',
          badge: isEnglish ? 'Telemetry' : 'Телеметрия',
          icon: Scan,
        };
    }
  };

  return (
    <motion.div
      data-testid="bento-grid"
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 ${className}`}
    >
      {items.map((item) => {
        const detail = getBentoDetails(item.category);
        const IconComponent = detail.icon;

        return (
          <motion.div
            key={item.id}
            data-testid={`bento-card-${item.id}`}
            variants={cardVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectCard?.(item.id)}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-shadow duration-300 flex flex-col justify-between cursor-pointer group text-left relative overflow-hidden"
          >
            {/* Top Row: Circular Icon Badge & Category indicator */}
            <div className="flex items-start justify-between gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs transition-transform duration-200 group-hover:scale-105 ${item.iconBg}`}
              >
                <IconComponent className="w-6 h-6 transition-transform duration-200 group-hover:rotate-3" style={{ color: item.iconColor }} />
              </div>

              <span className="text-xs font-semibold text-slate-400 group-hover:text-emerald-700 transition-colors flex items-center gap-1">
                {isEnglish ? 'Details' : 'Подробнее'}
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

            {/* Middle: Title & Subtitle */}
            <div className="mt-4 flex-1">
              <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-emerald-900 transition-colors">
                {detail.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-normal">
                {detail.subtitle}
              </p>
            </div>

            {/* Bottom Row: Metrics & Status tag */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="font-semibold text-slate-700">{detail.metric}</span>
              </div>
              <span className="text-slate-400 group-hover:text-emerald-700 transition-colors font-medium">
                {detail.badge}
              </span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
