# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Solace Health Advocates Directory** - a Next.js 14 application for browsing and searching healthcare advocates. It features a modern, accessible UI with Solace Health branding, pagination, sorting, and search capabilities.

## Development Commands

### Running the Application
```bash
npm i                    # Install dependencies
npm run dev             # Start development server (http://localhost:3000)
npm run build           # Production build
npm start               # Start production server
npm run lint            # Run ESLint
```

### Database Operations (Optional)
The app works without a database by default (uses static seed data). To enable database:

```bash
docker compose up -d              # Start PostgreSQL container
# Create 'solaceassignment' database manually
npx drizzle-kit push             # Push schema migrations
curl -X POST http://localhost:3000/api/seed  # Seed database
```

Database management:
```bash
npm run generate        # Generate Drizzle migrations
npm run migrate:up      # Run migrations
npm run seed           # Seed database (programmatic)
```

## Architecture

### Data Flow
1. **Default Mode (No DB)**: `/api/advocates` returns static data from `src/db/seed/advocates.ts`
2. **Database Mode**: Uncomment line in `src/app/api/advocates/route.ts` to query Postgres via Drizzle ORM

### UI Structure
- **Fixed Header Layout**: 60px header (`#265b4e` green) with white Solace logo
- **Scrollable Content**: Main content scrolls within viewport (not page-level scroll)
- **Sticky Table Headers**: Column headers stick to top of scroll container when scrolling table
- **Responsive**: Desktop uses data table, mobile uses card layout

### Component Library (`/src/components`)
Custom-built, accessible components with Solace Health branding:
- **Card** (3 variants): default, elevated, outlined
- **Button** (4 variants): primary, secondary, outline, ghost
- **Input**: With label, error states, helper text, icon support
- **Badge** (6 variants): For credentials and specialties
- **Pagination**: Full-featured with items-per-page selector

All components use Tailwind CSS with custom healthcare/solace color palettes.

### Design System

**Typography:**
- Body: Lato (Google Fonts)
- Headings (H1-H6): Mollie Gibson (display font)
- Apply `font-heading` class to headings explicitly

**Colors:**
- Brand Blue: `#4d65ff` (primary - Solace brand color)
- Header Green: `#265b4e` (fixed header background)
- Use `healthcare-*` or `solace-*` Tailwind classes
- Both palettes are identical (healthcare is alias for backwards compatibility)

**Key Design Patterns:**
- White backgrounds throughout
- Soft shadows for depth (`shadow-soft`, `shadow-soft-lg`)
- 12px border radius (`rounded-healthcare`)
- Smooth transitions on interactive elements

### Path Aliases
`@/*` maps to `./src/*` (e.g., `@/components`, `@/db`)

### Database Schema (Drizzle ORM)
Table: `advocates`
- firstName, lastName, city, degree (text)
- specialties (jsonb array)
- yearsOfExperience (integer)
- phoneNumber (bigint)

### Key Features Implementation
- **Search**: Client-side filtering across all advocate fields
- **Sorting**: Click column headers to sort (asc → desc → unsorted)
- **Pagination**: 10/25/50/100 items per page, smart page navigation
- **Responsive Tables**: Sticky headers at `top-0` within scroll container

### Layout Constraints
- Application is `h-screen` with `flex flex-col`
- Header is `flex-shrink-0` (60px fixed)
- Main is `flex-1 overflow-y-auto` (scrollable content)
- Body and HTML have `overflow: hidden` to prevent page-level scrolling


Claude Code Rules:

1. First think through the problem, read the codebase for relevant files, and write a plan to tasks/todo.md.
2. The plan should have a list of todo items that you can check off as you complete them
3. Before you begin working, check in with me and I will verify the plan.
4. Then, begin working on the todo items, marking them as complete as you go.
5. Please every step of the way just give me a high level explanation of what changes you made
6. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.
7. Finally, add a review section to the todo.md file with a summary of the changes you made and any other relevant information.
8. DO NOT BE LAZY. NEVER BE LAZY. IF THERE IS A BUG FIND THE ROOT CAUSE AND FIX IT. NO TEMPORARY FIXES. YOU ARE A SENIOR DEVELOPER. NEVER BE LAZY
9. MAKE ALL FIXES AND CODE CHANGES AS SIMPLE AS HUMANLY POSSIBLE. THEY SHOULD ONLY IMPACT NECESSARY CODE RELEVANT TO THE TASK AND NOTHING ELSE. IT SHOULD IMPACT AS LITTLE CODE AS POSSIBLE. YOUR GOAL IS TO NOT INTRODUCE ANY BUGS. IT'S ALL ABOUT SIMPLICITY
10. Keep performance in mind.  All our functions need to keep scaling in mind.   The end goal is to scale and monetize this application.  
10. Dont try to iniitate the dev server because I have it running and tailing the logs in a separate terminal window and it will just cause port conflictions and then we will be running on two different instances. PORT 3000 is the only port we want to test on. Assume it is running. 

CRITICAL: When debugging, you MUST trace through the ENTIRE code flow step by step. No assumptions. No shortcuts.