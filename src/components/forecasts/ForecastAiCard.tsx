import React from 'react';
import { Bot, Sparkles, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { getSimulationRiskNotice } from '../../utils/harvestSimulation';

interface ForecastAiCardProps {
  className?: string;
}

export const ForecastAiCard: React.FC<ForecastAiCardProps> = ({
  className = '',
}) => {
  const { isEnglish, tempAnomaly, rainCondition, isSimulationActive } = useApp();
  const { notice, isHighRisk } = getSimulationRiskNotice({ tempAnomaly, rainCondition }, isEnglish);

  return (
    <motion.div
      data-testid="forecast-ai-card"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`bg-white rounded-2xl border shadow-xs p-4 sm:p-5 flex items-center gap-3.5 sm:gap-4 transition-all duration-200 hover:shadow-md ${
        isHighRisk
          ? 'border-amber-300 bg-amber-50/30'
          : isSimulationActive
          ? 'border-emerald-300 bg-emerald-50/20'
          : 'border-slate-200/80 hover:border-emerald-200'
      } ${className}`}
    >
      {/* AI Circular Badge */}
      <div
        data-testid="forecast-ai-badge"
        className={`w-12 h-12 rounded-full flex flex-col items-center justify-center shrink-0 border shadow-xs ${
          isHighRisk
            ? 'bg-amber-100 text-amber-900 border-amber-300'
            : 'bg-emerald-100/90 text-emerald-800 border-emerald-300/60'
        }`}
        aria-hidden="true"
      >
        <div className="relative flex items-center justify-center -mb-0.5">
          {isHighRisk ? (
            <AlertTriangle className="w-4 h-4 text-amber-700" />
          ) : (
            <Bot className="w-4 h-4 text-emerald-700" />
          )}
          <span
            className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full animate-pulse ${
              isHighRisk ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
          />
        </div>
        <span className="text-xs font-black tracking-wider leading-none">
          AI
        </span>
      </div>

      {/* AI Info Text */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3
            data-testid="forecast-ai-heading"
            className="font-semibold text-slate-900 text-sm md:text-base tracking-tight"
          >
            {isSimulationActive
              ? isEnglish
                ? 'AI Dynamic Scenario Insight:'
                : 'Рекомендация AI по активному сценарию:'
              : isEnglish
              ? 'Artificial Intelligence:'
              : 'Искусственный интеллект:'}
          </h3>
          {isSimulationActive && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
              <Sparkles className="w-3 h-3 text-amber-600" />
              {isEnglish ? 'Simulated' : 'Модель'}
            </span>
          )}
        </div>
        <p
          data-testid="forecast-ai-description"
          className="text-xs md:text-sm text-slate-600 mt-0.5 leading-relaxed"
        >
          {isSimulationActive
            ? notice
            : isEnglish
            ? 'Incorporates drone telemetry, historical field treatments, and microclimate forecasts for precise harvest window prediction.'
            : 'Учитывает данные с дрона, историю агротехнических мероприятий и прогнозы погоды для точного расчёта срока сбора.'}
        </p>
      </div>
    </motion.div>
  );
};
