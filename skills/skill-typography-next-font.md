# Skill: Typography with Next.js next/font

**Purpose**: Implement premium, performant typography using Next.js built-in font optimization.

**When to Use**: All text elements across the application to ensure brand consistency and zero layout shift.

---

## AG-Optimized Defaults

- **Font Choice**: **Outfit** (Geometric sans-serif, modern and premium feel).
- **Secondary (Monospace)**: **Geist Mono** (Clean, high-quality mono font).
- **Optimization**: Use `next/font/google` for automatic self-hosting.
- **Variable Fonts**: Prefer variable fonts to minimize bundle size.
- **Layout Shift**: Use `swap` display strategy.

---

## Installation

No installation required; `next/font` is built into Next.js.

---

## Usage Patterns

### 1. Initializing in Layout (`src/app/layout.tsx`)
```tsx
import { Outfit } from 'next/font/google'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="font-sans">
        {children}
      </body>
    </html>
  )
}
```

### 2. Tailwind Config
Add the variable to `tailwind.config.ts` (or CSS logic) to use `font-sans`.

---

## Do / Don't

### ✅ Do
- Use `variable` fonts whenever possible.
- Apply the font variable to `<html>` or `<body>`.
- Use responsive font sizing via Tailwind.

### ❌ Don't
- Import fonts via `<link>` or `@import` (prevents optimization).
- Load too many font weights (stick to variables or 400/500/700).
- Mix too many font families (one primary, one mono is enough).

---

## Verification

- [ ] Font class is applied to the root element.
- [ ] No external requests to `fonts.googleapis.com` in Network tab.
- [ ] Typography looks "Outfit" and premium.

---

## Evidence to Provide Nilhan

1. **Font Configuration**: Code snippet from `layout.tsx`.
2. **Typography Sample**: Screenshot of the "Skills Smoke" page headline.
3. **Performance confirmation**: Note that fonts are self-hosted (browser network check).

---

## Official Documentation

- Next.js Font Optimization: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Google Fonts (Outfit): https://fonts.google.com/specimen/Outfit
