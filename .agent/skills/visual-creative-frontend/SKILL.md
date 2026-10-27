---
name: visual-creative-frontend
description: Master guide for building high-aesthetic visual frontend interfaces, AgroTech / Eco-Tech dashboards, Bento grid layouts, smooth animations with Motion (Framer Motion), and Tailwind CSS v4. Use when designing, styling, animating, or refining UI components and interactive views.
---

# Visual & Creative Frontend Guide (AgroTech Aesthetic)

## Design Identity & Theme ("ИНТЕЛЛИЯ")

The project follows a premium, organic-meets-high-tech aesthetic (AgroTech / Eco-Tech SaaS Dashboard).

### Color Tokens
- **Dark Emerald / Forest Green:**
  - Sidebar base: `#05382b` / `bg-[#05382b]`
  - Sidebar border: `border-emerald-900/40`
  - Active nav item: `bg-emerald-700/60`
  - Primary CTA button: `bg-[#07503b] hover:bg-[#096047]`
  - Dark container / Weather widget: `bg-emerald-950/60`
- **Light Workspace Background:**
  - Canvas surface: `#f4f7f6` / `bg-[#f4f7f6]`
  - Card background: `#ffffff` / `bg-white`
  - Subtle borders: `border-neutral-200/80`
- **Accent Indicators:**
  - Drone & Plant telemetry: Emerald green (`#10b981`)
  - Agronomic tasks: Teal (`#14b8a6`)
  - Weather: Sky Blue (`#0284c7`) & Sun Amber (`#f59e0b`)
  - AI Analytics: Purple/Violet (`#8b5cf6`)

---

## Key UI Components & Layout Guidelines

1. **Floating Container Frame:**
   - The entire dashboard should float inside a central container with smooth rounded corners (`rounded-[32px]`), subtle glass border (`border border-white/20`), and deep drop shadow (`shadow-2xl`).
   - Outer backdrop: lush, sunlit, warm apple orchard with soft blur.

2. **Sidebar Structure:**
   - Logo: Leaf/sprout glyph inside a rounded gradient pill + bold uppercase "ИНТЕЛЛИЯ" + subtitle "Умные решения для вашего сада".
   - Navigation links:
     - `Главная` (Overview)
     - `Карта сада` (Interactive Orchard Map)
     - `Данные` (Raw telemetry)
     - `Прогнозы` (Ripening & harvest forecasts)
     - `Уведомления` (Alerts)
     - `Настройки` (Settings)
   - Bottom: "Поддержка" button + Live weather card (`18°C`, `Ясно, без осадков`).

3. **Main Content Area:**
   - **Header:** Farm selector dropdown ("Ферма «Золотой Сад» ⌵") + User profile avatar.
   - **Hero Banner:** Full-width image card of apple orchard at golden hour with drone flying, bold title, subtitle and description.
   - **Bento Grid:** 4 equal-width data source cards:
     1. Гиперспектральные данные с дрона (icon in light green circle)
     2. Агротехнические данные (icon in light teal circle)
     3. Метеоданные (icon in light sky-blue circle)
     4. AI-аналитика (icon in light purple circle)
   - **CTA Button:** Full-width dark emerald button with leaf badge: *"Перейти к карте сада"* + arrow icon.

---

## Animation Standards (Motion / Framer Motion)

- **FPS Guarantee:** Only animate `transform` and `opacity`. Never animate `top`, `left`, `width`, or `height`.
- **Screen Transitions:** Use `<AnimatePresence mode="wait">` for seamless cross-fades and slide-morphs between "Главная" and "Карта сада".
- **Hover Micro-interactions:**
  - Cards: `whileHover={{ y: -4, transition: { duration: 0.2 } }}` with subtle shadow elevation.
  - Buttons: Smooth scale or slight nudge (`whileTap={{ scale: 0.98 }}`).
  - Drone badge: Subtle floating bounce or breathing pulse.
