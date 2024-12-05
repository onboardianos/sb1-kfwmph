# Project Starter Template

A modern React starter template with Material UI, TypeScript, and a comprehensive component library.

## Features

- 🎨 Material UI with customizable theming
- 📱 Responsive design out of the box
- 🚦 React Router setup with example routes
- 📦 Modular component architecture
- 🔧 TypeScript for type safety
- 🎯 Lucide icons included
- 🎨 Consistent styling and theming

## Project Structure

```
src/
  ├── components/         # Reusable UI components
  │   ├── core/          # Basic UI components
  │   ├── layout/        # Layout components
  │   └── metrics/       # Data visualization components
  ├── lib/               # Utilities and constants
  │   ├── constants/     # App-wide constants
  │   └── utils/         # Helper functions
  ├── pages/             # Page components
  └── theme.ts           # Material UI theme configuration
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Customization

### Adding New Routes

1. Create a new page component in `src/pages/`
2. Add the route to `src/lib/constants/routes.ts`
3. Add navigation item to `src/lib/constants/navigation.ts`
4. Add the route to `App.tsx`

### Theming

Customize the theme by modifying `src/lib/utils/theme.ts`:

```typescript
const theme = createAppTheme('#YOUR_PRIMARY_COLOR', '#YOUR_SECONDARY_COLOR');
```

### Adding New Components

1. Create component in appropriate directory under `src/components/`
2. Follow existing patterns for consistency
3. Use Material UI components and theme values

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

MIT