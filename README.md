# TAC Calabash

Church Management Solution - A comprehensive platform for membership management, ministry coordination, financial tracking, and communication.

## Overview

TAC Calabash is a hybrid church management system consisting of:

- **Backend API** - NestJS REST API with PostgreSQL
- **Web Portal** - Admin dashboard for church staff
- **Desktop App** - Offline-capable Electron application
- **Mobile App** - Member-facing React Native app

## Project Structure

```
tac-calabash/
├── main/               # NestJS backend API
├── apps/
│   ├── web/            # Next.js admin portal
│   ├── desktop/        # Electron desktop app
│   └── mobile/         # React Native member app
├── packages/
│   └── shared/         # Shared types, constants, utilities
├── turbo.json          # Turborepo configuration
└── pnpm-workspace.yaml # PNPM workspace config
```

## Tech Stack

| Component | Technology |
|-----------|------------|
| Backend | NestJS, Prisma, PostgreSQL |
| Web | Next.js 14, Tailwind, shadcn/ui |
| Desktop | Electron, SQLite (offline) |
| Mobile | React Native, Expo |
| Monorepo | PNPM, Turborepo |

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- PNPM 9.x
- PostgreSQL 15+

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp main/.env.example main/.env

# Run database migrations
pnpm --filter main prisma migrate dev

# Start development servers
pnpm dev
```

### Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps |
| `pnpm lint` | Lint all packages |
| `pnpm test` | Run tests |
| `pnpm clean` | Clean build artifacts |

## Documentation

- [Backend Documentation](./main/BACKEND.md)
- [Web App Documentation](./apps/web/CLIENT.md)
- [Desktop App Documentation](./apps/desktop/CLIENT.md)
- [Mobile App Documentation](./apps/mobile/CLIENT.md)

## Core Features

- **Membership Management** - Member profiles, family linking, attendance tracking
- **Ministry Management** - Ministry rosters, leadership, schedules
- **Financial Tracking** - Tithes, offerings, pledges, statements
- **Events & Calendar** - Church-wide and ministry calendars
- **Communications** - Announcements, notifications, email
- **Reporting** - Analytics, custom reports, exports

## License

Private - All rights reserved
