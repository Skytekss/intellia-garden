import { StreifIndexResult } from '../types';

/**
 * Calculates Streif Ripening Index (SI):
 * SI = Firmness (kg/cm²) / (Brix (°Bx) * Starch Index (1-10))
 */
export function calculateStreifIndex(
  firmnessKgCm2: number,
  brix: number,
  starchIndex: number,
  _isEnglish: boolean = false
): StreifIndexResult {
  const safeFirmness = Math.max(0.1, firmnessKgCm2);
  const safeBrix = Math.max(1, brix);
  const safeStarch = Math.max(1, Math.min(10, starchIndex));

  const rawIndex = safeFirmness / (safeBrix * safeStarch);
  const index = Math.round(rawIndex * 1000) / 1000;

  if (index >= 0.09) {
    return {
      index,
      category: 'ulo-long',
      categoryLabel: 'Длительное хранение в РГС (ULO/DCA)',
      categoryLabelEn: 'Long-term CA Storage (ULO/DCA)',
      color: '#047857',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      recommendation:
        'Оптимальное предклимактерическое состояние. Плоды идеально подходят для глубокого охлаждения в камерах с ультранизким содержанием кислорода (0.8–1.2% O₂) на срок до 9–11 месяцев.',
      recommendationEn:
        'Optimal pre-climacteric condition. Fruits are prime for Ultra-Low Oxygen (0.8–1.2% O₂) cold storage for up to 9–11 months.',
      maxStorageMonths: 10,
    };
  }

  if (index >= 0.06) {
    return {
      index,
      category: 'medium-retail',
      categoryLabel: 'Среднесрочное хранение / Сети',
      categoryLabelEn: 'Medium-term Storage / Retail',
      color: '#d97706',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
      recommendation:
        'Потребительская зрелость наступает в течение 10–14 дней. Рекомендуется стандартная холодильная камера (2–3 месяца) и приоритетная отгрузка в торговые сети.',
      recommendationEn:
        'Consumer ripeness expected within 10–14 days. Recommend standard cold storage (2–3 months) and priority distribution to retail chains.',
      maxStorageMonths: 3,
    };
  }

  return {
    index,
    category: 'immediate-processing',
    categoryLabel: 'Срочная реализация / Переработка',
    categoryLabelEn: 'Immediate Sale / Processing',
    color: '#dc2626',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
    recommendation:
      'Крахмал практически полностью гидролизован, плотность снижена. Длительное хранение приведет к мучнистости и загару. Рекомендуется немедленная реализация или отправка на сок/пюре.',
    recommendationEn:
      'Starch is largely hydrolysed, firmness decreased. Long-term storage risks internal breakdown. Immediate consumption or juice processing recommended.',
    maxStorageMonths: 1,
  };
}
