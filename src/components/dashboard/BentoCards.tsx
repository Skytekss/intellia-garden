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

export interface BentoCardsProps {
  items?: BentoItem[];
  onSelectCard?: (categoryId: string) => void;
  className?: string;
}

interface BentoMetaDetail {
  metric: string;
  badge: string;
  icon: React.ElementType;
}

const CATEGORY_DETAILS: Record<string, BentoMetaDetail> = {
  drone: {
    metric: 'NDVI / NDRE 0.84',
    badge: '8 спектральных зон',
    icon: Scan,
  },
  agritech: {
    metric: 'Влажность 68%',
    badge: 'Капельный полив активен',
    icon: Droplets,
  },
  meteo: {
    metric: '+18°C / 0 мм',
    badge: 'Благоприятно для сбора',
    icon: CloudSun,
  },
  ai: {
    metric: 'Точность 94.6%',
    badge: 'Сектор 4: готов к сбору (85%)',
    icon: BrainCircuit,
  },
};

export const BentoCards: React.FC<BentoCardsProps> = ({
  items = mockBentoItems,
  onSelectCard,
  className = '',
}) => {
  return (
    <div
      data-testid="bento-grid"
      className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 ${className}`}
    >
      {items.map((item) => {
        const detail = CATEGORY_DETAILS[item.category] || {
          metric: 'Активно',
          badge: 'Мониторинг',
          icon: Scan,
        };
        const IconComponent = detail.icon;

        return (
          <motion.div
            key={item.id}
            data-testid={`bento-card-${item.id}`}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            onClick={() => onSelectCard?.(item.id)}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-shadow duration-300 flex flex-col justify-between cursor-pointer group text-left relative overflow-hidden"
          >
            {/* Top Row: Circular Icon Badge & Category indicator */}
            <div className="flex items-start justify-between gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${item.iconBg}`}
              >
                <IconComponent className="w-6 h-6" style={{ color: item.iconColor }} />
              </div>

              <span className="text-xs font-semibold text-slate-400 group-hover:text-emerald-700 transition-colors flex items-center gap-1">
                Подробнее
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>

            {/* Middle: Title & Subtitle */}
            <div className="mt-4 flex-1">
              <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-emerald-900 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-normal">
                {item.subtitle}
              </p>
            </div>

            {/* Bottom Row: Metrics & Status tag */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800">
                {detail.metric}
              </span>
              <span className="text-xs text-slate-500 truncate text-right">
                {detail.badge}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
