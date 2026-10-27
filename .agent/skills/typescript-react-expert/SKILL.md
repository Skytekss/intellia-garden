---
name: typescript-react-expert
description: Best practices, architectural patterns, and strict typing standards for modern React 19 and TypeScript 5+ applications built with Vite. Use when writing, refactoring, or optimizing React components, custom hooks, and state management.
---

# TypeScript & React 19 Expert Guidelines

## Core Principles

1. **Strict Typing Without Any:**
   - Always define explicit interfaces or types for component props and data structures.
   - Avoid `any`. Use generics, union types, or `unknown` with type narrowing.
   - Example:
     ```typescript
     export interface GardenSector {
       id: string;
       name: string;
       appleVariety: 'Gala' | 'Golden' | 'Fuji' | 'Honeycrisp';
       maturityPercent: number;
       status: 'ready' | 'ripening' | 'early';
       optimalHarvestDays: number;
       coordinates: { x: number; y: number; width: number; height: number };
     }
     ```

2. **React 19 Modern Idioms:**
   - Use function components with explicit TypeScript interfaces.
   - Keep components modular: extract single-responsibility UI chunks (e.g. `Sidebar.tsx`, `HeroBanner.tsx`, `BentoGrid.tsx`, `GardenMap.tsx`, `WeatherWidget.tsx`).
   - Use custom hooks for interactive logic (`useGardenData`, `useWeather`, `useActiveSector`).

3. **Performance & Rendering:**
   - Memoize expensive calculations with `useMemo`.
   - Use `useCallback` for event handlers passed down to complex child components.
   - Lazy load heavy modules (like complex SVG maps or charts) with `React.lazy` and `Suspense`.

4. **File Structure Standards:**
   ```
   src/
   ├── components/
   │   ├── layout/       # Sidebar, Header, Container
   │   ├── dashboard/    # HeroBanner, BentoCards, CTABar
   │   ├── map/          # GardenMap, SectorTooltip, MaturityLegend
   │   └── ui/           # Button, Card, Badge, Modal
   ├── types/            # Shared TypeScript interfaces
   ├── hooks/            # Custom reusable hooks
   ├── data/             # Mock datasets (sectors, weather, drones)
   └── utils/            # Helper functions (date formatting, calculations)
   ```
