# Skill: Motion & Animations

**Purpose**: Add smooth, performant animations and micro-interactions using Motion (formerly Framer Motion).

**When to Use**: Page transitions, component animations, gestures, scroll-based effects, interactive elements.

---

## AG-Optimized Defaults

- **Library**: Motion (v11+, optimized fork of Framer Motion)
- **Animation Style**: Subtle, professional (not distracting)
- **Performance**: Use `transform` and `opacity` for 60fps animations
- **Variants**: Define reusable animation variants for consistency
- **Accessibility**: Respect `prefers-reduced-motion`

---

## Installation

```bash
npm install motion
```

---

## Usage Patterns

### Basic Fade/Slide In
```tsx
import { motion } from "motion/react"

export default function Example() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1>Welcome to Million Chances</h1>
    </motion.div>
  )
}
```

### Reusable Variants
```tsx
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

<motion.div
  variants={fadeInUp}
  initial="hidden"
  animate="visible"
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

### Button Hover/Tap
```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>
  Click Me
</motion.button>
```

### Stagger Children
```tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

<motion.ul variants={container} initial="hidden" animate="show">
  <motion.li variants={item}>Item 1</motion.li>
  <motion.li variants={item}>Item 2</motion.li>
  <motion.li variants={item}>Item 3</motion.li>
</motion.ul>
```

---

## Do / Don't

### ✅ Do
- Use `transform` and `opacity` for best performance
- Define variants for consistency across the app
- Test animations on slower devices
- Use spring animations for interactive elements
- Respect `prefers-reduced-motion` setting

### ❌ Don't
- Animate `width`, `height`, or `top`/`left` (use `scale`/`translate`)
- Overuse animations - keep it subtle and purposeful
- Animate on every interaction (it becomes distracting)
- Forget to add keys to animated lists
- Use overly long durations (0.3-0.5s is usually enough)

---

## Verification

- [ ] Motion is installed in package.json
- [ ] At least one animation works in the app
- [ ] No console errors related to motion
- [ ] Animations are smooth (60fps)
- [ ] Components render correctly without JavaScript (progressive enhancement)

---

## Evidence to Provide Nilhan

1. **Installation proof**: `package.json` snippet showing motion
2. **Working animation**: Screen recording or GIF showing animation in action
3. **Code example**: Paste one animated component from the app
4. **Performance**: DevTools Performance tab showing 60fps during animation (optional)

---

## Official Documentation

- Motion: https://motion.dev/
- Framer Motion (legacy): https://www.framer.com/motion/
- Web Animations Performance: https://web.dev/animations-guide/
