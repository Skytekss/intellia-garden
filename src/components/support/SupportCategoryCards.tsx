import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { SupportCategoryItem, SupportCategoryId } from './types';
import { SUPPORT_CATEGORIES } from './supportData';
import { useApp } from '../../context/AppContext';
import { getLocalizedSupportCategories } from '../../context/localizedData';

export interface SupportCategoryCardsProps {
  categories?: SupportCategoryItem[];
  onSelectCategory: (categoryId: SupportCategoryId) => void;
  className?: string;
}

export const SupportCategoryCards: React.FC<SupportCategoryCardsProps> = ({
  categories = SUPPORT_CATEGORIES,
  onSelectCategory,
  className = '',
}) => {
  const { isEnglish } = useApp();
  const items = categories !== SUPPORT_CATEGORIES ? categories : getLocalizedSupportCategories(isEnglish);
  return (
    <div
      data-testid="support-category-cards"
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 ${className}`}
    >
      {items.map((category) => {
        const IconComponent = category.icon;

        return (
          <motion.div
            key={category.id}
            data-testid={`support-category-card-${category.id}`}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            onClick={() => onSelectCategory(category.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectCategory(category.id);
              }
            }}
            className="group bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-xs hover:shadow-md hover:border-emerald-200/80 transition-all cursor-pointer flex flex-col justify-between min-w-0 outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          >
            <div>
              {/* Circular emerald badge matching reference */}
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-4 shadow-sm shadow-emerald-700/20 shrink-0 group-hover:scale-105 transition-transform duration-200">
                <IconComponent className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug">
                {category.title}
              </h3>

              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed break-words">
                {category.description}
              </p>
            </div>

            {/* Bottom arrow matching reference */}
            <div className="pt-4 mt-2 flex items-center">
              <ArrowRight className="w-4 h-4 text-emerald-700 transition-transform duration-200 group-hover:translate-x-1.5 shrink-0" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
