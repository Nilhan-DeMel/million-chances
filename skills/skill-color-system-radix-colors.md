# Skill: Color System with Radix Colors

**Purpose**: Implement a professional, accessible color palette using Radix Colors, integrated into Tailwind CSS.

**When to Use**: Setting brand colors, component states (hover, focus, active), and semantic highlighting.

---

## AG-Optimized Defaults

- **Library**: `@radix-ui/colors`
- **Primary/Accent**: Orange scale (warm, high energy)
- **Destructive**: Tomato scale (softer, premium red)
- **Neutral**: Gray/Slate scale
- **Implementation**: CSS variables in `src/app/globals.css`
- **Contrast**: Follow Radix's recommended steps (step 9 for solid backgrounds, step 11 for high-contrast text)

---

## Installation

```bash
npm install @radix-ui/colors
```

---

## Usage Patterns

### 1. Wiring CSS Variables (`src/app/globals.css`)
```css
@import "@radix-ui/colors/orange.css";
@import "@radix-ui/colors/tomato.css";
@import "@radix-ui/colors/slate.css";

:root {
  --primary: var(--orange-9);
  --primary-foreground: white;
  --accent: var(--orange-3);
  --accent-foreground: var(--orange-11);
  --destructive: var(--tomato-9);
  --destructive-foreground: white;
}
```

### 2. Tailoring shadcn/ui Theme
Update the CSS variables used by shadcn to map to Radix scales.

---

## Do / Don't

### ✅ Do
- Use Radix's numbered scales (1-12) for consistent contrast.
- Use step 3 for subtle backgrounds, step 9 for primary actions.
- Use step 11/12 for text readability.

### ❌ Don't
- Use random hex codes.
- Mix unrelated color scales (stick to the chosen palette).
- Ignore dark mode variants (Radix provides `-dark` scales).

---

## Verification

- [ ] `@radix-ui/colors` is in `package.json`.
- [ ] CSS variables are defined in `globals.css`.
- [ ] UI reflects the warm orange/tomato palette.
- [ ] Color contrast passes basic checks.

---

## Evidence to Provide Nilhan

1. **CSS Variable Mapping**: Paste the `:root` section of `globals.css`.
2. **Visual Proof**: Screenshot of the "Skills Smoke" page with color chips.
3. **Contrast Verification**: A short note confirming step 9/11 usage.

---

## Official Documentation

- Radix Colors: https://www.radix-ui.com/colors
- Composing a Palette: https://www.radix-ui.com/colors/docs/palette-composition/composing-a-palette
