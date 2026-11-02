import React from 'react';
import { motion } from 'motion/react';
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

export interface BentoCardsProps {
  items?: BentoItem[];
  onSelectCard?: (categoryId: string) => void;
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.25, 1, 0.5, 1],
    },
  },
};

export const BentoCards: React.FC<BentoCardsProps> = ({
  items = mockBentoItems,
  onSelectCard,
  className = '',
}) => {
  const { isEnglish, formatTemperature, formatPrecipitation } = useApp();

  const getBentoDetails = (category: string) => {
    switch (category) {
      case 'drone':
        return {
          title: isEnglish ? 'Hyperspectral Drone Telemetry' : 'Гиперспектральные данные с дрона',
          subtitle: isEnglish ? 'Canopy & fruit health assessment' : 'Анализ состояния деревьев и плодов',
          metric: 'NDVI / NDRE 0.84',
          badge: isEnglish ? '8 spectral zones' : '8 спектральных зон',
          icon: Scan,
        };
      case 'agritech':
        return {
          title: isEnglish ? 'Agrotechnical Data' : 'Агротехнические данные',
          subtitle: isEnglish ? 'Irrigation, fertilizers, treatments' : 'Полив, удобрения, обработка',
          metric: isEnglish ? 'Humidity 68%' : 'Влажность 68%',
          badge: isEnglish ? 'Drip irrigation active' : 'Капельный полив активен',
          icon: Droplets,
        };
      case 'meteo':
        return {
          title: isEnglish ? 'Meteo & Climate' : 'Метеоданные',
          subtitle: isEnglish ? 'Temperature, rain, forecasts' : 'Температура, осадки, погода',
          metric: `${formatTemperature(18)} / ${formatPrecipitation(0)}`,
          badge: isEnglish ? 'Favorable for harvest' : 'Благоприятно для сбора',
          icon: CloudSun,
        };
      case 'ai':
        return {
          title: isEnglish ? 'AI Harvest Analytics' : 'AI-аналитика',
          subtitle: isEnglish ? 'Ripening map & harvest recommendations' : 'Карта зрелости и рекомендации',
          metric: isEnglish ? 'Accuracy 94.6%' : 'Точность 94.6%',
          badge: isEnglish ? 'Sector 4: ready for harvest (85%)' : 'Сектор 4: готов к сбору (85%)',
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
