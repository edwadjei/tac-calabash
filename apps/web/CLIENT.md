# Web Admin Portal

Next.js application for church administrators and ministry leaders.

## Approach

The web portal is the primary admin interface for managing all church data. Built with Next.js 14 App Router for server-side rendering and optimal performance. Uses shadcn/ui for consistent, accessible components and Tailwind for styling.

### Design Principles

- **Server Components First** - Leverage RSC for data fetching where possible
- **Progressive Enhancement** - Core functionality works without JS
- **Responsive Design** - Works on tablets for on-the-go admin tasks
- **Role-Based UI** - Interface adapts to user permissions

## Features

### Dashboard
- Membership statistics and growth trends
- Recent attendance summary
- Upcoming events
- Quick actions (add member, record attendance, etc.)
- Financial overview (monthly giving, budget status)

### Membership Management
- Member directory with search, filter, sort
- Member profile view/edit
- Family/household management
- Membership status tracking
- Bulk import from CSV/Excel
- Export member lists

### Ministry Management
- Ministry listing and details
- Member assignments
- Leadership roles
- Ministry-specific announcements
- Meeting schedules

### Attendance
- Service attendance recording
- Ministry meeting attendance
- Attendance history and trends
- Absence alerts configuration

### Events & Calendar
- Church-wide calendar view
- Create/edit events
- Recurring event support
- Ministry-specific calendars
- Event reminders

### Finances
- Record contributions (tithes, offerings)
- Pledge management
- Generate giving statements
- Financial reports
- Budget tracking
- Export for accounting

### Reports
- Pre-built report templates
- Custom report builder
- Data visualizations (charts, graphs)
- Export to PDF, Excel, CSV
- Scheduled report generation

### Settings
- User management (admin accounts)
- Role permissions
- Church profile settings
- Notification preferences
- System configuration

## Page Structure

```
app/
├── (auth)/
│   ├── login/
│   └── forgot-password/
├── (dashboard)/
│   ├── layout.tsx          # Sidebar + header layout
│   ├── page.tsx            # Dashboard home
│   ├── members/
│   │   ├── page.tsx        # Member list
│   │   ├── [id]/page.tsx   # Member detail
│   │   └── new/page.tsx    # Add member
│   ├── ministries/
│   ├── attendance/
│   ├── events/
│   ├── finances/
│   ├── reports/
│   └── settings/
└── api/                    # API routes (if needed for BFF)
```

## Packages

| Package | Purpose |
|---------|---------|
| `next` | React framework |
| `tailwindcss` | Utility-first CSS |
| `shadcn/ui` | Accessible component library |
| `@tanstack/react-query` | Server state management |
| `axios` | HTTP client |
| `react-hook-form` | Form handling |
| `zod` | Schema validation |
| `zustand` | Client state (auth, UI) |
| `recharts` | Data visualization |
| `date-fns` | Date utilities |
| `next-auth` | Authentication |
| `@tanstack/react-table` | Data tables |
| `sonner` | Toast notifications |
| `lucide-react` | Icons |

## State Management

### Server State (React Query)
- All API data fetching
- Caching and background refresh
- Optimistic updates
- Pagination and infinite scroll

### Client State (Zustand)
- Auth session
- UI preferences (sidebar, theme)
- Form drafts

## Authentication

- JWT stored in httpOnly cookies
- next-auth for session management
- Middleware protects dashboard routes
- Role-based route guards
- Auto-refresh of tokens

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |
| `NEXTAUTH_SECRET` | Next-auth encryption key |
| `NEXTAUTH_URL` | App URL for callbacks |

## Scripts

```bash
pnpm dev          # Start dev server (port 3001)
pnpm build        # Production build
pnpm start        # Run production build
pnpm lint         # Run ESLint
```

## Responsive Breakpoints

| Breakpoint | Target |
|------------|--------|
| `sm` (640px) | Mobile landscape |
| `md` (768px) | Tablets |
| `lg` (1024px) | Small laptops |
| `xl` (1280px) | Desktop |

Primary admin use on desktop/laptop, but tablet-friendly for on-site use.
