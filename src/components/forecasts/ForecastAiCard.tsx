import React from 'react';
import { Bot } from 'lucide-react';
import { motion } from 'motion/react';

interface ForecastAiCardProps {
  className?: string;
}

export const ForecastAiCard: React.FC<ForecastAiCardProps> = ({
  className = '',
}) => {
  return (
    <motion.div
      data-testid="forecast-ai-card"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5 flex items-center gap-3.5 sm:gap-4 transition-all duration-200 hover:shadow-md hover:border-emerald-200 ${className}`}
    >
      {/* AI Circular Badge matching reference photo */}
      <div
        data-testid="forecast-ai-badge"
        className="w-12 h-12 rounded-full bg-emerald-100/90 text-emerald-800 flex flex-col items-center justify-center shrink-0 border border-emerald-300/60 shadow-xs"
        aria-hidden="true"
      >
        <div className="relative flex items-center justify-center -mb-0.5">
          <Bot className="w-4 h-4 text-emerald-700" />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <span className="text-xs font-black tracking-wider leading-none text-emerald-900">
          AI
        </span>
      </div>

      {/* AI Info Text */}
      <div className="min-w-0 flex-1">
        <h3
          data-testid="forecast-ai-heading"
          className="font-semibold text-slate-900 text-sm md:text-base tracking-tight"
        >
          Искусственный интеллект:
        </h3>
        <p
          data-testid="forecast-ai-description"
          className="text-xs md:text-sm text-slate-600 mt-0.5 leading-relaxed"
        >
          Учитывает данные с дрона, историю агротехнических мероприятий и прогнозы погоды для точного расчёта срока сбора.
        </p>
      </div>
    </motion.div>
  );
};
