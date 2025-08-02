# UI Package and Tailwind Configuration Setup

This document explains how the UI components and Tailwind CSS are configured in this monorepo.

## Architecture

### 1. Tailwind Configuration (`@repo/tailwind-config`)
- **Location**: `packages/tailwind-config/`
- **Purpose**: Shared Tailwind CSS configuration and styles
- **Key Files**:
  - `shared-styles.css`: Contains all Tailwind directives, CSS variables, and theme configuration
  - `postcss.config.js`: PostCSS configuration for Tailwind processing

### 2. UI Package (`@repo/ui`)
- **Location**: `packages/ui/`
- **Purpose**: Reusable React components with Tailwind styling
- **Key Files**:
  - `src/styles.css`: Imports shared styles from `@repo/tailwind-config`
  - `src/button.tsx`: Button component with variants
  - `src/card.tsx`: Card components (Card, CardHeader, CardTitle, etc.)
  - `src/index.ts`: Exports all components

### 3. Web App (`apps/web`)
- **Location**: `apps/web/`
- **Purpose**: Next.js application that uses UI components
- **Key Files**:
  - `app/globals.css`: Imports shared styles from `@repo/tailwind-config`
  - `app/layout.tsx`: Imports local `globals.css`
  - `app/page.tsx`: Demonstrates UI component usage

## Usage

### Installing Components in UI Package

1. Create new components in `packages/ui/src/`
2. Export them in `packages/ui/src/index.ts`
3. Build the package: `cd packages/ui && bun run build`

### Using Components in Web App

```tsx
import { Button, Card, CardContent, CardHeader, CardTitle } from '@repo/ui';

export default function MyPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Component</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  );
}
```

### Using Tailwind Classes

Both the UI package and web app can use Tailwind classes because they both import the shared styles:

```tsx
// In UI package components
<div className="bg-primary text-primary-foreground p-4 rounded-lg">
  Styled content
</div>

// In web app
<div className="bg-background text-foreground">
  App content
</div>
```

## Build Process

1. **UI Package**: Builds components and styles
   ```bash
   cd packages/ui && bun run build
   ```

2. **Web App**: Uses built UI components
   ```bash
   cd apps/web && bun run dev
   ```

3. **Full Monorepo**: Builds all packages
   ```bash
   bun run build
   ```

## Key Benefits

- **Shared Styling**: Consistent design tokens across all apps
- **Reusable Components**: UI components can be used in any app
- **Type Safety**: Full TypeScript support for components
- **Hot Reloading**: Development mode with watch for changes
- **Optimized Builds**: Tailwind purges unused styles in production

## File Structure

```
packages/
├── tailwind-config/
│   ├── shared-styles.css      # Shared Tailwind styles
│   ├── postcss.config.js      # PostCSS config
│   └── package.json
└── ui/
    ├── src/
    │   ├── styles.css         # Imports shared styles
    │   ├── button.tsx         # Button component
    │   ├── card.tsx           # Card components
    │   └── index.ts           # Component exports
    ├── dist/                  # Built components and styles
    └── package.json

apps/
└── web/
    ├── app/
    │   ├── globals.css        # Imports shared styles
    │   ├── layout.tsx         # Imports globals.css
    │   └── page.tsx           # Uses UI components
    └── package.json
``` 