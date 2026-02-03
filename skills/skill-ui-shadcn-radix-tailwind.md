# Skill: UI with shadcn/ui + Radix UI + Tailwind CSS

**Purpose**: Build accessible, beautiful UI components using shadcn/ui (Radix primitives) with Tailwind CSS v4.

**When to Use**: Any time you need UI components - buttons, forms, dialogs, dropdowns, cards, navigation, etc.

---

## AG-Optimized Defaults

- **Component Library**: shadcn/ui (copy-paste components, not npm package)
- **Primitives**: Radix UI (accessible headless components)
- **Styling**: Tailwind CSS v4 (configured via PostCSS)
- **Theme**: Use CSS variables in `globals.css` for theming
- **Icons**: lucide-react
- **Dark Mode**: Support via `next-themes` (optional, add if needed)

---

## Installation

### Detect Package Manager
```bash
# Package manager already determined by lockfile (npm)
npm install lucide-react
npx shadcn@latest init
```

### shadcn/ui Init Prompts (Our Choices)
- TypeScript: **Yes** ✓
- Style: **New York** (modern, sophisticated)
- Base color: **Zinc** (neutral, professional)
- CSS variables: **Yes** ✓
- Import alias: **@/*** ✓ (already configured in tsconfig)

---

## Usage Patterns

### Adding a Component
```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

### Using a Component
```tsx
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Million Chances</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="default">Get Started</Button>
      </CardContent>
    </Card>
  )
}
```

### Using Icons
```tsx
import { Heart, Star, Upload } from "lucide-react"

<Button>
  <Heart className="mr-2 h-4 w-4" />
  Save
</Button>
```

---

## Do / Don't

### ✅ Do
- Use shadcn CLI to add components (keeps them in sync)
- Customize components in `/components/ui` as needed
- Follow Tailwind's utility-first approach
- Use CSS variables for consistent theming
- Keep components accessible (Radix provides ARIA attributes)

### ❌ Don't
- Install shadcn as an npm package (it's not distributed that way)
- Mix other UI libraries (stick to shadcn/Radix)
- Override Radix accessibility features
- Use inline styles - always use Tailwind classes
- Forget to add components to git (they're source code, not dependencies)

---

## Verification

- [ ] `components/ui/` directory exists with shadcn components
- [ ] `components.json` file exists in repo root
- [ ] Tailwind config uses CSS variables from `globals.css`
- [ ] At least one UI component renders without errors
- [ ] lucide-react icons work in components
- [ ] TypeScript has no errors related to component imports

---

## Evidence to Provide Nilhan

1. **File structure**: Screenshot or tree output showing `/components/ui/` directory
2. **components.json**: Paste the file contents
3. **Working component**: Screenshot of a page using shadcn Button/Card
4. **No errors**: Dev server output showing clean build

---

## Official Documentation

- shadcn/ui: https://ui.shadcn.com/
- Radix UI: https://www.radix-ui.com/
- Tailwind CSS: https://tailwindcss.com/
- lucide-react: https://lucide.dev/guide/packages/lucide-react
