import { describe, it, expect } from 'vitest';
import { calculateStreifIndex } from '../streifIndex';

describe('streifIndex utility', () => {
  it('correctly calculates SI and identifies long-term ULO storage when index >= 0.090', () => {
    // E.g., Firmness = 8.5 kg/cm², Brix = 11.5 °Bx, Starch = 3.0 -> 8.5 / (11.5 * 3) = 8.5 / 34.5 = 0.246
    const res = calculateStreifIndex(8.5, 11.5, 3.0);

    expect(res.index).toBe(0.246);
    expect(res.category).toBe('ulo-long');
    expect(res.categoryLabel).toContain('Длительное хранение');
    expect(res.maxStorageMonths).toBe(10);
    expect(res.color).toBe('#047857');
  });

  it('correctly identifies medium-term retail window when 0.060 <= index < 0.090', () => {
    // E.g., Firmness = 7.0 kg/cm², Brix = 14.0 °Bx, Starch = 7.0 -> 7.0 / (14.0 * 7.0) = 7.0 / 98.0 = 0.071
    const res = calculateStreifIndex(7.0, 14.0, 7.0);

    expect(res.index).toBe(0.071);
    expect(res.category).toBe('medium-retail');
    expect(res.categoryLabel).toContain('Среднесрочное');
    expect(res.maxStorageMonths).toBe(3);
    expect(res.color).toBe('#d97706');
  });

  it('correctly identifies immediate processing when index < 0.060', () => {
    // E.g., Firmness = 5.2 kg/cm², Brix = 14.5 °Bx, Starch = 8.5 -> 5.2 / (14.5 * 8.5) = 5.2 / 123.25 = 0.042
    const res = calculateStreifIndex(5.2, 14.5, 8.5);

    expect(res.index).toBe(0.042);
    expect(res.category).toBe('immediate-processing');
    expect(res.categoryLabel).toContain('Срочная реализация');
    expect(res.maxStorageMonths).toBe(1);
    expect(res.color).toBe('#dc2626');
  });

  it('safely handles edge values and zero inputs', () => {
    const res = calculateStreifIndex(0, 0, 0);
    expect(res.index).toBeDefined();
    expect(res.index).toBeGreaterThan(0);
  });
});
