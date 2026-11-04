# Детальный план реализации «Фазы 1: Стабилизация базы и ликвидация дефектов»
Ветка: `feature/phase1-stabilization-and-fixes`

Формат каждого шага:
**Шаг -> Перепроверка -> Тесты -> Исправление ошибок (если найдены) -> Перепроверка -> Следующий шаг**

---

## Шаг 1. Пакет 1.1: Исправление инверсии шкалы зрелости (Agro Heatmap)
- **Целевые файлы:**
  - `src/data/mockData.ts`
  - `src/components/map/GardenMapView.tsx`
  - `src/components/data-entry/SpectralSampleCard.tsx`
  - `src/components/data-entry/StreifIndexCalculator.tsx`
  - `src/components/forecasts/ForecastTable.tsx`
  - `src/components/map/__tests__/GardenMapView.test.tsx` (и др. тесты, проверяющие цвета)
- **Задачи шага:**
  1. `getMaturityColor`: $\ge 75\%$ -> `#059669` / `#10b981` (изумрудный), $60–74\%$ -> `#84cc16` / `#eab308` (салатово-желтый), $45–59\%$ -> `#f59e0b` / `#ea580c` (янтарный), $<45\%$ -> `#ef4444` / `#dc2626` (красный).
  2. `getMaturityMetadata`: согласовать бейджи (`bg-emerald-50 text-emerald-700` для зрелых, `bg-rose-50 text-rose-700` для незрелых).
  3. Градиент легенды в `GardenMapView.tsx`: от `#ef4444` (слева, «Ниже») через оранжевый/желтый к `#10b981` (справа, «Выше»).
  4. Градиент в `SpectralSampleCard.tsx`: сверху 1.0 изумрудный, снизу 0.0 красный.
  5. Цвета зон в `StreifIndexCalculator.tsx`: $<0.06$ красный, $0.06–0.09$ янтарный, $\ge 0.09$ зеленый.
- **Перепроверка и тесты:**
  - `cmd /c "npx tsc -b"`
  - `cmd /c "npm test -- --run"`
  - Обновление снапшотов/ассертов в тестах, если они проверяли старые цвета `#dc2626` на спелых участках.

---

## Шаг 2. Пакет 1.2: Целостность состояния, навигации и данных
- **Целевые файлы:**
  - `src/components/layout/Header.tsx`
  - `src/components/layout/Sidebar.tsx`
  - `src/components/map/GardenMapView.tsx`
  - `src/components/map/SectorDetailPanel.tsx`
  - `src/components/map/SectorDetailModal.tsx`
  - `src/components/forecasts/ForecastTable.tsx`
  - `src/components/forecasts/ForecastsView.tsx`
  - `src/components/support/SupportView.tsx`
  - `src/data/mockNotifications.ts`
  - `src/components/data-entry/MeteoWidget.tsx`
  - `src/components/notifications/NotificationCard.tsx`
- **Задачи шага:**
  1. `Header.tsx`: При выборе фермы в выпадающем списке вызывать `app.setCurrentFarmId(targetFarm.id)`.
  2. `Sidebar.tsx`: Заменить `badge: 3` на динамический `app.unreadNotificationsCount` (показывать только при $>0$).
  3. `onNavigate`:
     - Деструктурировать в `GardenMapView.tsx` и передать в `SectorDetailPanel` и `SectorDetailModal`.
     - Добавить в `SectorDetailPanel` быстрые кнопки: «Внести агрозамеры» (`onNavigate('data')`) и «Смоделировать сбор» (`onNavigate('forecasts')`).
     - Передать `onNavigate` в `ForecastTable.tsx` и добавить переход на карту сектора при клике на строку/аккордеон.
     - Деструктурировать `onNavigate` в `SupportView.tsx`.
  4. `mockNotifications.ts`: Добавить `'system'` в `filterCategories` для `notif-4`.
  5. `MeteoWidget.tsx`: Заменить условия с `isEnglish` на `isImperial` при форматировании температуры и осадков.
  6. `NotificationCard.tsx`: При клике на кнопку действия помечать уведомление как прочитанное (`markNotificationRead(notification.id)`).
- **Перепроверка и тесты:**
  - `cmd /c "npx tsc -b"`
  - `cmd /c "npm test -- --run"`

---

## Шаг 3. Пакет 1.3: Типографика и ликвидация микрошрифтов
- **Целевые файлы:**
  - `src/components/layout/Header.tsx` (L145)
  - `src/components/map/GardenMapView.tsx` (L151, 174, 176)
  - `src/components/data-entry/StreifIndexCalculator.tsx` (L174, 204, 234, 268)
  - `src/components/forecasts/ForecastTable.tsx` (L352, 367, 452)
  - `src/components/forecasts/WhatIfSimulatorWidget.tsx` (L158, 167, 279)
  - `src/components/forecasts/ForecastAiCard.tsx` (L75)
  - `src/components/forecasts/HarvestReportModal.tsx` (L146, 154, 161, 176, 185, 192)
- **Задачи шага:**
  - Заменить все классы `text-[11px]` на `text-xs` (12px), сохранив визуальную иерархию через `font-medium`, `font-semibold` и тональность текста (`text-slate-400`/`text-slate-500`).
  - Поиск grep по всему проекту `text-[10px]` и `text-[11px]`, убедиться, что осталось 0 вхождений.
- **Перепроверка и тесты:**
  - `cmd /c "npx tsc -b"`
  - `cmd /c "npm test -- --run"`

---

## Шаг 4. Пакет 1.4: Адаптивность, тач-панорамирование и анимации
- **Целевые файлы:**
  - `src/components/map/GardenMap.tsx`
  - `src/components/settings/SettingsView.tsx`
  - `src/components/support/FaqAccordion.tsx`
  - `src/components/data-entry/StreifIndexCalculator.tsx`
- **Задачи шага:**
  1. `GardenMap.tsx`:
     - Добавить сенсорные события `onTouchStart`, `onTouchMove`, `onTouchEnd` для свободного перемещения увеличенной карты пальцем на мобильных и планшетах.
     - На экранах `<640px` (`sm:hidden`) сворачивать кнопки тулбара карты в компактные иконки без длинного текста, чтобы тулбар не перекрывал верхние секторы сада.
  2. `SettingsView.tsx`:
     - Заменить класс `lg:grid-cols-2` на `md:grid-cols-2` для аккуратного двухколоночного макета на iPad (768–1023px).
  3. `FaqAccordion.tsx`:
     - Устранить вращение на родительском контейнере, оставить вращение `rotate-180` строго на иконке `ChevronDown` при раскрытии.
  4. `StreifIndexCalculator.tsx`:
     - Добавить `flex-wrap` на блок математической формулы `SI = F / (R × S) = ...`, устранив микроскролл на экранах 375px.
- **Перепроверка и тесты:**
  - `cmd /c "npx tsc -b"`
  - `cmd /c "npm test -- --run"`

---

## Шаг 5. Финальный регрессионный аудит и запуск локального dev-сервера
- Запуск полной сборки: `cmd /c "npm run build"`
- Запуск всех 116+ тестов: `cmd /c "npm test -- --run"`
- Запуск локального сервера разработки: `npm run dev` в фоновом режиме.
- Формирование отчета с точными инструкциями и ссылками для проверки пользователем.
