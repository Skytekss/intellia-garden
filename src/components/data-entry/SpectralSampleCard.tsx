import React from 'react';
import spectralAppleSample from '../../assets/spectral_apple_sample.jpg';
import { useApp } from '../../context/AppContext';

interface SpectralSampleCardProps {
  className?: string;
}

const SCALE_MARKS = ['1.0', '0.8', '0.6', '0.4', '0.2', '0.0'] as const;

export const SpectralSampleCard: React.FC<SpectralSampleCardProps> = ({ className = '' }) => {
  const { isEnglish, t } = useApp();

  return (
    <div
      data-testid="spectral-sample-card"
      className={`bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 flex flex-col min-w-0 ${className}`}
    >
      <h4 className="text-xs font-semibold text-slate-700 mb-2">
        {t('data.sample.title') || 'Пример снимка'}
      </h4>

      <div className="flex items-center gap-3">
        {/* Sample Apple Spectral Image */}
        <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-lg overflow-hidden border border-slate-200 bg-slate-900 shadow-xs flex-shrink-0">
          <img
            src={spectralAppleSample}
            alt={isEnglish ? 'Spectral apple sample image' : 'Термоспектральный снимок яблока'}
            className="w-full h-full object-cover select-none"
            loading="lazy"
          />
        </div>

        {/* Maturity Index Scale */}
        <div className="flex flex-col items-center flex-shrink-0">
          <span className="text-xs font-medium text-slate-600 text-center leading-tight mb-1.5 select-none">
            {isEnglish ? (
              <>
                Maturity
                <br />
                Index
              </>
            ) : (
              <>
                Индекс
                <br />
                зрелости
              </>
            )}
          </span>

          <div className="flex items-stretch gap-2 h-28 sm:h-32">
            {/* Gradient vertical bar from 1.0 (emerald/cyan) to 0.0 (red) */}
            <div
              data-testid="maturity-gradient-bar"
              className="w-3 rounded-full bg-gradient-to-b from-[#dc2626] via-[#ea580c] via-[#d97706] via-[#059669] to-[#0284c7] shadow-inner"
              title={isEnglish ? 'Fruit ripening scale from 1.0 to 0.0' : 'Шкала зрелости плодов от 1.0 до 0.0'}
            />

            {/* Scale marks: 1.0, 0.8, 0.6, 0.4, 0.2, 0.0 */}
            <div className="flex flex-col justify-between text-xs font-medium text-slate-500 select-none py-0.5">
              {SCALE_MARKS.map((mark) => (
                <span key={mark} className="text-xs leading-none">
                  {mark}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpectralSampleCard;
