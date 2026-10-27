import React from 'react';
import {
  Sparkles,
  ThermometerSnowflake,
  Truck,
  CalendarCheck,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'motion/react';
import { NavigationTab } from '../../types';

interface ForecastRecommendationsProps {
  onNavigate?: (tab: NavigationTab) => void;
  className?: string;
}

export const ForecastRecommendations: React.FC<ForecastRecommendationsProps> = ({
  onNavigate,
  className = '',
}) => {
  const recommendations = [
    {
      id: 'rec-1',
      priority: 'Высокий приоритет',
      priorityColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      title: 'Участок 1 (Гала) — старт сбора 10 – 12 сентября',
      description:
        'Зрелость плодов достигла 85%, сахаристость 14.5 °Bx, плотность оптимальна для закладки на длительное хранение. Задержка более 5 дней может привести к перезреванию и падению лежкости.',
      actionText: 'Перейти к карте сектора',
      targetTab: 'map' as NavigationTab,
      icon: CalendarCheck,
    },
    {
      id: 'rec-2',
      priority: 'Средний приоритет',
      priorityColor: 'bg-amber-100 text-amber-800 border-amber-200',
      title: 'Участок 5 (Гала) — подготовка тары и бригад на 18 сентября',
      description:
        'Зрелость 78%. Рекомендуется прекратить внекорневые подкормки за 7 дней до начала сбора и зарезервировать калиброванные деревянные контейнеры.',
      actionText: 'Просмотреть агро-данные',
      targetTab: 'data' as NavigationTab,
      icon: Truck,
    },
    {
      id: 'rec-3',
      priority: 'Плановый контроль',
      priorityColor: 'bg-sky-100 text-sky-800 border-sky-200',
      title: 'Участки 2, 3 и 4 (Фуджи, Голден, Ред Делишес) — контроль полива',
      description:
        'Степень зрелости от 45% до 72%. Оптимальный режим влажности почвы — 65–70%. Рекомендуется повторный мониторинг дроном 5 сентября для уточнения динамики накопления антоцианов.',
      actionText: 'Открыть карту сада',
      targetTab: 'map' as NavigationTab,
      icon: Sparkles,
    },
  ];

  const storageAdvice = [
    {
      title: 'Температурный режим',
      value: '+0.5°C … +1.5°C',
      detail: 'Предотвращает преждевременное дыхание тканей',
    },
    {
      title: 'Влажность воздуха в камере',
      value: '90 – 95%',
      detail: 'Минимизирует увядание и потерю веса яблок',
    },
    {
      title: 'Контролируемая атмосфера (CA)',
      value: '1.2% O₂ / 1.0% CO₂',
      detail: 'Увеличивает срок реализации до 7–9 месяцев',
    },
  ];

  return (
    <div
      data-testid="forecast-recommendations-panel"
      className={`space-y-4 sm:space-y-6 ${className}`}
    >
      {/* AI Recommendation Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Агрорекомендации</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            Оптимальный календарный план уборки и логистики
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Сформирован нейросетью на основе метеопрогноза Тульской области, динамики созревания и лабораторных анализов плотности мякоти.
          </p>
        </div>
      </div>

      {/* Recommendations Cards */}
      <div className="space-y-3 sm:space-y-4">
        {recommendations.map((rec, index) => {
          const Icon = rec.icon;
          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.08 }}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 hover:shadow-md transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200/80">
                    <Icon className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${rec.priorityColor}`}
                      >
                        {rec.priority}
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900">
                      {rec.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      {rec.description}
                    </p>
                  </div>
                </div>

                {onNavigate && (
                  <button
                    type="button"
                    onClick={() => onNavigate(rec.targetTab)}
                    className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:text-emerald-800 hover:border-emerald-300 hover:bg-slate-50 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <span>{rec.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Storage & Post-Harvest Advice */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <ThermometerSnowflake className="w-5 h-5 text-sky-600" />
          <h4 className="text-base font-bold text-slate-900">
            Регламент закладки урожая на хранение (Холодильные камеры)
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {storageAdvice.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs text-slate-500 font-medium block">
                  {item.title}
                </span>
                <span className="text-base font-bold text-slate-900 mt-1 block">
                  {item.value}
                </span>
              </div>
              <span className="text-xs text-slate-400 mt-2 block">
                {item.detail}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
