## Project Summary
A comprehensive logistics platform (Delhivery Clone) that allows users to book, track, and manage shipments. The project features a modern, mobile-first frontend with an integrated dashboard for customers, employees, and admins.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: JavaScript
- **Styling**: CSS Modules with Neo-Brutalism aesthetic
- **Backend/Auth**: Supabase
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Architecture
- `src/app`: App Router pages and layouts
- `src/components`: Reusable UI components (layout, features)
- `src/lib`: Supabase client and utility functions
- `public`: Static assets

## User Preferences
- Use Neo-Brutalism design aesthetic (sharp borders, bold colors, strong typography)
- Prioritize mobile-first responsiveness (375px-428px range)
- Prefer functional components and React hooks
- Avoid unnecessary comments in code

## Project Guidelines
- Follow Neo-Brutalism CSS patterns using variables in `globals.css`
- Use `brutal-btn` and `brutal-card` classes for consistent UI elements
- Ensure all interactive elements have sufficient touch targets for mobile (min-height: 44px)
- Wrap `useSearchParams()` in `Suspense` boundaries in client components

## Common Patterns
- **Multi-step forms**: Used in the booking flow with `framer-motion` for transitions
- **Status Badges**: Standardized classes like `status_DELIVERED`, `status_IN_TRANSIT` in CSS modules
- **Mobile Navigation**: Bottom tab bar for authenticated dashboard views
