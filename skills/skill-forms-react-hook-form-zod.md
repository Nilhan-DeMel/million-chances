# Skill: Forms with React Hook Form + Zod

**Purpose**: Build type-safe forms with validation using React Hook Form and Zod schema validation.

**When to Use**: Any form - login, signup, create/edit data, settings, multi-step forms.

---

## AG-Optimized Defaults

- **Form Library**: React Hook Form (performance-focused, minimal re-renders)
- **Validation**: Zod (TypeScript-first schema validation)
- **Integration**: `@hookform/resolvers/zod` for seamless integration
- **UI**: shadcn/ui Form components (accessible, pre-styled)
- **Error Display**: Real-time validation with clear error messages
- **Accessibility**: ARIA attributes, error announcements

---

## Installation

```bash
npm install react-hook-form zod @hookform/resolvers
```

---

## Setup

### 1. Define Schema with Zod
```ts
import { z } from "zod"

export const workMemorySchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z.string().optional(),
  imageUrl: z.string().url("Must be a valid URL").optional(),
  tags: z.array(z.string()).min(1, "At least one tag required"),
})

export type WorkMemoryFormData = z.infer<typeof workMemorySchema>
```

### 2. Create Form Component
```tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { workMemorySchema, WorkMemoryFormData } from "@/schemas/workMemory"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function WorkMemoryForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WorkMemoryFormData>({
    resolver: zodResolver(workMemorySchema),
    defaultValues: {
      title: "",
      description: "",
      tags: [],
    },
  })

  const onSubmit = async (data: WorkMemoryFormData) => {
    console.log("Form data:", data)
    // Submit to Firebase, API, etc.
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          {...register("title")}
          aria-invalid={errors.title ? "true" : "false"}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input id="description" {...register("description")} />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  )
}
```

### 3. Using shadcn/ui Form Components (Recommended)
```tsx
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

export default function WorkMemoryFormWithShadcn() {
  const form = useForm<WorkMemoryFormData>({
    resolver: zodResolver(workMemorySchema),
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

---

## Common Patterns

### Async Validation
```ts
const emailSchema = z.string().email().refine(
  async (email) => {
    // Check if email is available
    const response = await fetch(`/api/check-email?email=${email}`)
    return response.ok
  },
  { message: "Email already exists" }
)
```

### Conditional Fields
```ts
const schema = z.object({
  hasImage: z.boolean(),
  imageUrl: z.string().url().optional(),
}).refine(
  (data) => !data.hasImage || data.imageUrl,
  { message: "Image URL required when 'Has Image' is checked", path: ["imageUrl"] }
)
```

### Dynamic Arrays
```tsx
const { fields, append, remove } = useFieldArray({
  control: form.control,
  name: "tags",
})

return (
  <>
    {fields.map((field, index) => (
      <div key={field.id}>
        <Input {...register(`tags.${index}`)} />
        <Button onClick={() => remove(index)}>Remove</Button>
      </div>
    ))}
    <Button onClick={() => append("")}>Add Tag</Button>
  </>
)
```

---

## Do / Don't

### ✅ Do
- Define schemas with Zod for type safety
- Use `zodResolver` to integrate with React Hook Form
- Show validation errors in real-time
- Disable submit button while submitting
- Use `defaultValues` to prevent uncontrolled inputs
- Leverage shadcn/ui Form components for accessibility

### ❌ Don't
- Mix controlled and uncontrolled inputs
- Forget to handle async validation properly
- Skip error message display
- Allow form submission during pending state
- Validate on every keystroke (use `onBlur` or `onChange` mode strategically)
- Hardcode validation logic - always use Zod schemas

---

## Verification

- [ ] React Hook Form is installed
- [ ] Zod is installed
- [ ] At least one form uses `useForm` with `zodResolver`
- [ ] Validation errors display correctly
- [ ] Form submission works (console.log or Firebase save)
- [ ] Submit button disables during submission
- [ ] TypeScript has no errors

---

## Evidence to Provide Nilhan

1. **Installation**: `package.json` snippet showing react-hook-form and zod
2. **Schema**: Paste one Zod schema from the app
3. **Form component**: Paste one form using React Hook Form
4. **Validation**: Screenshot showing validation error messages
5. **Submission**: Screenshot or console log showing form data on submit

---

## Official Documentation

- React Hook Form: https://react-hook-form.com/
- Zod: https://zod.dev/
- shadcn/ui Form: https://ui.shadcn.com/docs/components/form
