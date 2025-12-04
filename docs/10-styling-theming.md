# التنسيق والثيمات - Styling & Theming

## التقنيات المستخدمة

- **Tailwind CSS 4** - Framework CSS
- **next-themes** - إدارة الثيمات (فاتح/داكن)
- **tailwind-merge** - دمج Classes
- **clsx** - Classes conditionals
- **class-variance-authority (CVA)** - Variants للمكونات

---

## إعداد Tailwind

### PostCSS Config
```javascript
// postcss.config.mjs
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

### CSS Entry Point
```css
/* app/globals.css */
@import "tailwindcss";

/* Custom CSS Variables */
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --primary: 0 0% 9%;
  --primary-foreground: 0 0% 98%;
  /* ... */
}

.dark {
  --background: 0 0% 3.9%;
  --foreground: 0 0% 98%;
  --primary: 0 0% 98%;
  --primary-foreground: 0 0% 9%;
  /* ... */
}
```

---

## الدالة المساعدة cn()

```javascript
// lib/utils.js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
```

### استخدام cn()
```jsx
import { cn } from "@/lib/utils";

// دمج classes
<div className={cn("p-4 bg-white", className)} />

// Classes شرطية
<button className={cn(
  "px-4 py-2 rounded",
  isActive && "bg-primary text-white",
  isDisabled && "opacity-50 cursor-not-allowed"
)} />

// تجاوز classes
<div className={cn("text-sm", "text-lg")} />
// النتيجة: "text-lg" (الأخير يفوز)
```

---

## إدارة الثيمات

### ThemeProvider

```jsx
// components/Theme/ThemeProvider.jsx
"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function ThemeProvider({ children, ...props }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

### استخدام في Layout

```jsx
// app/[locale]/layout.jsx
import ThemeProvider from "@/components/Theme/ThemeProvider";

export default function Layout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### تبديل الثيم

```jsx
// components/ui app/ToggleThemeMode.jsx
"use client";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ToggleThemeMode() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </button>
  );
}
```

---

## أنماط Tailwind الشائعة

### التخطيط (Layout)
```jsx
// Flexbox
<div className="flex items-center justify-between gap-4">

// Grid
<div className="grid grid-cols-3 gap-4">

// Container
<div className="container mx-auto px-4">
```

### التباعد (Spacing)
```jsx
// Padding
<div className="p-4 px-6 py-2">

// Margin
<div className="m-4 mx-auto mt-8">

// Gap
<div className="flex gap-4">
```

### الألوان
```jsx
// Background
<div className="bg-primary bg-secondary bg-background">

// Text
<p className="text-primary text-muted-foreground">

// Border
<div className="border border-border">
```

### الحجم
```jsx
// Width/Height
<div className="w-full h-screen max-w-md min-h-[200px]">

// Font Size
<p className="text-sm text-base text-lg text-xl">
```

### الاستجابة (Responsive)
```jsx
// Mobile First
<div className="text-sm md:text-base lg:text-lg">

// Grid Responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// Hide/Show
<div className="hidden md:block">
<div className="block md:hidden">
```

### RTL Support
```jsx
// استخدم start/end بدل left/right
<div className="ms-4">      {/* margin-start */}
<div className="me-4">      {/* margin-end */}
<div className="ps-4">      {/* padding-start */}
<div className="pe-4">      {/* padding-end */}
<div className="text-start"> {/* text-align */}
<div className="text-end">

// الاتجاه
<div className="flex-row-reverse rtl:flex-row">
```

---

## مكونات Shadcn/ui

### Button Variants

```jsx
import { Button } from "@/components/ui/button";

<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
```

### Input Styling

```jsx
import { Input } from "@/components/ui/input";

<Input
  className="border-input bg-background"
  placeholder="Enter text"
/>
```

### Card Pattern

```jsx
<div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
  <h3 className="text-lg font-semibold">Title</h3>
  <p className="text-muted-foreground">Description</p>
</div>
```

---

## Class Variance Authority (CVA)

### تعريف Variants

```jsx
import { cva } from "class-variance-authority";

const buttonVariants = cva(
  // Base classes
  "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input bg-background hover:bg-accent",
        secondary: "bg-secondary text-secondary-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// استخدام
<button className={buttonVariants({ variant: "outline", size: "lg" })}>
  Click
</button>
```

---

## أنماط التصميم المستخدمة

### Form Section
```jsx
<div className="space-y-6">
  <div className="border rounded-lg p-6">
    <h3 className="text-lg font-semibold mb-4">Section Title</h3>
    <div className="grid grid-cols-2 gap-4">
      {/* Form Fields */}
    </div>
  </div>
</div>
```

### Table Container
```jsx
<div className="rounded-md border">
  <table className="w-full">
    <thead className="bg-muted">
      <tr>
        <th className="p-4 text-start font-medium">Header</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-t hover:bg-muted/50">
        <td className="p-4">Data</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Card Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => (
    <div key={item.id} className="rounded-lg border p-6 hover:shadow-md transition-shadow">
      {/* Card Content */}
    </div>
  ))}
</div>
```

### Dialog/Modal
```jsx
<div className="fixed inset-0 bg-black/50 flex items-center justify-center">
  <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4">
    <h2 className="text-xl font-semibold">Title</h2>
    <p className="text-muted-foreground mt-2">Content</p>
    <div className="flex justify-end gap-2 mt-6">
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </div>
  </div>
</div>
```

---

## ألوان CSS Variables

```css
:root {
  /* Backgrounds */
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;

  /* Card */
  --card: 0 0% 100%;
  --card-foreground: 0 0% 3.9%;

  /* Primary */
  --primary: 0 0% 9%;
  --primary-foreground: 0 0% 98%;

  /* Secondary */
  --secondary: 0 0% 96.1%;
  --secondary-foreground: 0 0% 9%;

  /* Muted */
  --muted: 0 0% 96.1%;
  --muted-foreground: 0 0% 45.1%;

  /* Accent */
  --accent: 0 0% 96.1%;
  --accent-foreground: 0 0% 9%;

  /* Destructive */
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;

  /* Border */
  --border: 0 0% 89.8%;
  --input: 0 0% 89.8%;
  --ring: 0 0% 3.9%;

  /* Radius */
  --radius: 0.5rem;
}
```

### استخدام في Tailwind
```jsx
<div className="bg-background text-foreground">
<div className="bg-primary text-primary-foreground">
<div className="bg-muted text-muted-foreground">
<div className="border-border">
<div className="rounded-[--radius]">
```

---

## نصائح

### 1. ترتيب Classes
```jsx
// الترتيب المقترح:
// Layout → Sizing → Spacing → Typography → Colors → Effects

<div className="flex w-full p-4 text-lg text-primary bg-background shadow-md">
```

### 2. تجنب Styles Inline
```jsx
// ❌
<div style={{ marginTop: 20 }}>

// ✅
<div className="mt-5">
```

### 3. استخدام @apply للأنماط المتكررة
```css
/* في globals.css */
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-primary text-primary-foreground rounded-md;
  }
}
```

### 4. Dark Mode
```jsx
// يتغير تلقائياً مع الثيم
<div className="bg-white dark:bg-gray-900">
<p className="text-black dark:text-white">
```
