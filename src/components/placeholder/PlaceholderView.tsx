import React from 'react';
import {
  Map,
  Database,
  TrendingUp,
  Bell,
  Settings,
  Headphones,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { NavigationTab } from '../../types';

export interface PlaceholderViewProps {
  tab: NavigationTab;
  onNavigateBack: () => void;
}

interface PlaceholderInfo {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  badge: string;
}

const TAB_INFO: Record<NavigationTab, PlaceholderInfo> = {
  overview: {
    title: 'Главная панель',
    subtitle: 'Общая сводка по саду',
    description: 'Аналитическая панель мониторинга яблоневого сада.',
    icon: Sparkles,
    badge: 'Главная',
  },
  map: {
    title: 'Интерактивная карта сада',
    subtitle: 'Секторы A1, A2, B1, B2 и сорта плодов',
    description: 'Детальная визуализация участков с тепловой картой созревания, индексами NDVI и рекомендациями по сбору.',
    icon: Map,
    badge: 'Карта сада',
  },
  data: {
    title: 'Данные мониторинга',
    subtitle: 'Гиперспектральные срезы и телеметрия',
    description: 'Журнал измерений спектрозональных датчиков, влажности почвы, азотного индекса и метеостанций.',
    icon: Database,
    badge: 'Телеметрия',
  },
  forecasts: {
    title: 'AI-прогнозы созревания',
    subtitle: 'Динамика сахаристости и сроки уборки',
    description: 'Предиктивная модель даты технической и потребительской зрелости по сортам «Гала», «Фуджи», «Голден».',
    icon: TrendingUp,
    badge: 'Предиктивная аналитика',
  },
  notifications: {
    title: 'Центр уведомлений',
    subtitle: 'Срочные агрономические алерты',
    description: 'Оповещения об оптимальных окнах сбора, рисках осадков и результатах облёта дрона.',
    icon: Bell,
    badge: 'Оповещения',
  },
  settings: {
    title: 'Настройки системы',
    subtitle: 'Параметры сада, датчиков и профиля',
    description: 'Конфигурация порогов зрелости, подключение метеорологических станций и управление доступом.',
    icon: Settings,
    badge: 'Параметры',
  },
  support: {
    title: 'Агрономическая поддержка',
    subtitle: 'Консультации экспертов ИНТЕЛЛИЯ',
    description: 'Связь с ведущими агрономами-технологами и инженерами спектрального мониторинга.',
    icon: Headphones,
    badge: 'Поддержка',
  },
};

export const PlaceholderView: React.FC<PlaceholderViewProps> = ({
  tab,
  onNavigateBack,
}) => {
  const info = TAB_INFO[tab] || TAB_INFO.overview;
  const IconComponent = info.icon;

  return (
    <div
      data-testid="placeholder-view"
      className="bg-white rounded-[24px] border border-slate-200/80 p-8 sm:p-12 shadow-xs text-center flex flex-col items-center justify-center max-w-2xl mx-auto my-6 animate-in fade-in"
    >
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shadow-xs mb-5">
        <IconComponent className="w-8 h-8" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/60 text-emerald-800 border border-emerald-200/70 mb-3">
        <span>{info.badge}</span>
        <span>•</span>
        <span className="text-emerald-600 font-normal">Модуль в разработке</span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
        {info.title}
      </h2>
      <p className="text-emerald-700 font-medium text-sm mt-1">
        {info.subtitle}
      </p>
      <p className="text-slate-500 text-sm sm:text-base mt-3 max-w-md leading-relaxed">
        {info.description}
      </p>

      <button
        type="button"
        data-testid="placeholder-back-button"
        onClick={onNavigateBack}
        className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#07503b] hover:bg-[#096047] text-white text-sm font-semibold shadow-md shadow-emerald-950/10 transition-all cursor-pointer active:scale-95"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Вернуться на главную</span>
      </button>
    </div>
  );
};
