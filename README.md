# Solace Healthcare Advocates

A production-ready healthcare advocate directory built with Next.js, featuring advanced filtering, search, and accessibility.

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up database**
   ```bash
   # Using Docker (recommended)
   docker compose up -d
   ```

3. **Configure environment**
   ```bash
   # Copy .env.example and update DATABASE_URL if needed
   cp .env.example .env
   ```

4. **Push database schema**
   ```bash
   npx drizzle-kit push
   ```

5. **Seed database**
   ```bash
   npm run dev
   # In another terminal:
   curl -X POST http://localhost:3000/api/seed
   ```

6. **Open application**
   ```
   http://localhost:3000
   ```

### Production Build

```bash
npm run build
npm start
```

## Features

- **Advanced Search & Filtering**: Multi-field search with city, degree, specialty, and experience filters
- **Performance**: React Query caching, prefetching, debounced search
- **Accessibility**: WCAG AA compliant, keyboard navigation, screen reader support
- **Security**: SQL injection prevention, input validation, production-hardened endpoints
- **Observability**: Structured logging, request tracking, performance monitoring

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS
- **Data Fetching**: TanStack React Query
- **Validation**: Zod
- **TypeScript**: Strict mode

## API Endpoints

- `GET /api/advocates` - List advocates with filters/pagination
- `GET /api/advocates/filters` - Get unique filter values
- `POST /api/seed` - Seed database (dev only)
- `POST /api/migrate` - Run migrations (dev only)

## Documentation

See `DISCUSSION.md` for detailed architecture, performance analysis, and accessibility audit.
