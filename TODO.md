# Solace Advocates - Optimization TODO

## Staff-Level Analysis Summary
This app has **critical scaling issues** that will fail at 100k+ advocates. Current architecture fetches all data to client and filters in browser - this is a **showstopper**. Multiple type bugs will cause runtime errors.

---

## Phase 1: Critical Bugs & Type Safety ⚠️
**Impact**: App is currently broken/will break in production

- [ ] 1. **Fix search type bugs** (page.tsx:32-33)
  - Fix `yearsOfExperience.includes()` - number doesn't have includes method
  - Fix `specialties.includes()` - array includes won't match partial strings
  - Add proper type conversion and case-insensitive search

- [ ] 2. **Remove DOM manipulation anti-pattern** (page.tsx:22)
  - Replace `getElementById("search-term")` with React state
  - Use controlled component pattern

- [ ] 3. **Add TypeScript interfaces**
  - Create `Advocate` interface in src/types/advocate.ts
  - Export and use throughout the app
  - Add proper typing to all event handlers

- [ ] 4. **Fix missing React keys** (page.tsx:70, 78)
  - Add unique keys to advocate rows using `advocate.id` or index
  - Add keys to specialty mappings

- [ ] 5. **Add error boundaries and loading states**
  - Add try-catch for fetch API calls
  - Add loading state with spinner
  - Add error state with user-friendly message
  - Add AbortController to prevent memory leaks

---

## Phase 2: Performance Architecture (100k+ Scale) 🚀
**Impact**: Make app production-ready for large datasets

- [ ] 6. **Server-side search API**
  - Create src/app/api/advocates/search/route.ts
  - Accept query params: `?search=...&page=...&limit=...`
  - Return paginated results only (20 per page)
  - Implement SQL ILIKE search across firstName, lastName, city, degree
  - Add array search for specialties using Postgres array operators

- [ ] 7. **Add database indexes** (schema.ts)
  - Add index on firstName for faster queries
  - Add index on lastName for faster queries
  - Add index on city for faster queries
  - Add GIN index on specialties (JSONB) for array searches

- [ ] 8. **Implement pagination**
  - Backend: Use LIMIT/OFFSET in SQL query
  - Frontend: Add pagination controls (Previous/Next + page numbers)
  - Show "Showing X-Y of Z results"
  - Default page size: 20 results

- [ ] 9. **Add debounced search**
  - Install or create debounce utility
  - Add 300ms delay before API call
  - Cancel pending requests on new input

- [ ] 10. **Optimize data transfer**
  - Ensure only necessary fields returned
  - Add gzip compression middleware if needed
  - Consider adding response caching headers

---

## Phase 3: UI/UX Redesign (Solace Design Standards) 🎨
**Impact**: Professional, patient-friendly experience

- [ ] 11. **Modern card-based layout**
  - Replace table with responsive card grid
  - Design professional healthcare aesthetic
  - Add avatar placeholders (initials in circles)
  - Make cards clickable/hoverable

- [ ] 12. **Search experience improvements**
  - Add search icon (magnifying glass)
  - Add clear button (X) when text entered
  - Add placeholder: "Search by name, location, specialty..."
  - Show active search term in results header
  - Add "No results found" empty state with suggestions

- [ ] 13. **Loading & error states**
  - Add skeleton loaders for cards during fetch
  - Create error boundary with retry button
  - Add toast notifications for actions
  - Show loading indicator on search

- [ ] 14. **Responsive design**
  - Mobile-first approach (320px+)
  - Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
  - Stack cards on mobile, grid on desktop
  - Touch-friendly tap targets (min 44px)

- [ ] 15. **Design system with Tailwind**
  - Define color palette (healthcare blues/teals/greens)
  - Create typography scale (headings, body, small)
  - Establish spacing system (consistent padding/margins)
  - Create reusable component classes

---

## Phase 4: Advanced Features & Polish ✨
**Impact**: Competitive feature set

- [ ] 16. **Multi-select filters**
  - Add specialty filter with checkboxes/tags
  - Add degree filter (dropdown or chips)
  - Add city filter (searchable dropdown)
  - Update API to accept multiple filter params

- [ ] 17. **Experience range filter**
  - Add min/max year inputs
  - Consider range slider component
  - Update API to filter by experience range

- [ ] 18. **Sort functionality**
  - Add sort dropdown
  - Options: Experience (high/low), Name (A-Z, Z-A), Recently added
  - Update API to accept sort params
  - Implement SQL ORDER BY

- [ ] 19. **Accessibility (WCAG 2.1 AA)**
  - Add ARIA labels on all inputs and buttons
  - Implement keyboard navigation (Tab, Enter, Escape)
  - Add screen reader announcements for search results
  - Ensure proper focus indicators
  - Add semantic HTML (nav, main, section)
  - Minimum color contrast ratio 4.5:1

- [ ] 20. **Performance monitoring**
  - Add console timing for API requests
  - Log slow queries (>500ms)
  - Monitor bundle size
  - Add performance.mark/measure for critical paths

---

## Implementation Notes

### File Structure
```
src/
├── types/
│   └── advocate.ts          # TypeScript interfaces
├── lib/
│   ├── debounce.ts          # Utility functions
│   └── db.ts                # Database helpers
├── components/
│   ├── AdvocateCard.tsx     # Reusable card component
│   ├── SearchBar.tsx        # Search input component
│   ├── Pagination.tsx       # Pagination controls
│   └── LoadingState.tsx     # Skeleton loaders
├── app/
│   ├── api/
│   │   └── advocates/
│   │       ├── route.ts     # Original endpoint (deprecated)
│   │       └── search/
│   │           └── route.ts # New paginated search
│   └── page.tsx             # Main page (refactored)
```

### Database Setup
To test with real data:
1. Uncomment DATABASE_URL in .env
2. Run `docker compose up -d`
3. Run `npx drizzle-kit push`
4. Run `curl -X POST http://localhost:3000/api/seed`

### Testing Strategy
- Test each phase on localhost:3000 before moving to next
- Verify mobile responsiveness with DevTools
- Test with large dataset (seed multiple times or generate more data)
- Check browser console for errors/warnings
- Validate TypeScript with `npm run build`

### Simplicity Rules
- Each change impacts minimal code
- No massive refactors - incremental improvements
- Keep backwards compatibility where possible
- Every function should consider 100k+ scale from day one

---

## Review Section
_Add notes here after completing each phase_

### Phase 1 Complete
- Changes made:
- Issues encountered:
- Performance impact:

### Phase 2 Complete
- Changes made:
- Issues encountered:
- Performance impact:

### Phase 3 Complete
- Changes made:
- Issues encountered:
- Performance impact:

### Phase 4 Complete
- Changes made:
- Issues encountered:
- Performance impact:

---

**Estimated Total Effort**: 8-12 hours
**Priority**: Phase 1 (critical bugs) → Phase 2 (scaling) → Phase 3 (UX) → Phase 4 (features)
