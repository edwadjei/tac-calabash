# Backend API

NestJS REST API serving all TAC Calabash client applications.

## Approach

The backend follows a modular architecture using NestJS. Each domain (members, ministries, finances, etc.) is encapsulated in its own module with controllers, services, and DTOs. Prisma ORM handles database operations with PostgreSQL.

### Design Principles

- **Modular Structure** - Each feature is a self-contained NestJS module
- **Repository Pattern** - Prisma services abstract database operations
- **DTO Validation** - class-validator ensures request/response integrity
- **JWT Authentication** - Access + refresh token pattern
- **Role-Based Access** - Guards protect routes based on user roles

## Module Structure

```
src/
├── modules/
│   ├── auth/               # Authentication & authorization
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/     # Passport strategies (local, jwt)
│   │   ├── guards/         # Auth guards, role guards
│   │   └── dto/            # Login, register, token DTOs
│   │
│   ├── users/              # Admin/staff user accounts
│   ├── members/            # Church member management
│   ├── ministries/         # Ministry management
│   ├── attendance/         # Service & meeting attendance
│   ├── events/             # Calendar & event management
│   ├── finances/           # Tithes, offerings, pledges
│   ├── notifications/      # Email & push notifications
│   ├── reports/            # Report generation
│   └── follow-up/          # Visitor & absence tracking
│
├── common/
│   ├── decorators/         # @CurrentUser, @Roles, @Public
│   ├── filters/            # Exception filters
│   ├── guards/             # Global guards
│   ├── interceptors/       # Logging, transform
│   └── pipes/              # Validation pipes
│
├── config/                 # Configuration module
├── database/
│   └── prisma/             # Schema, migrations, seeds
│
├── app.module.ts
└── main.ts
```

## API Design

### Authentication Flow

```
POST /auth/login          → Returns access_token + refresh_token
POST /auth/register       → Admin creates new user
POST /auth/refresh        → Exchange refresh_token for new access_token
POST /auth/logout         → Invalidate refresh_token
POST /auth/forgot-password → Send password reset email
POST /auth/reset-password  → Reset password with token
```

### Resource Endpoints Pattern

Each resource follows REST conventions:

```
GET    /members           → List (paginated, filterable)
GET    /members/:id       → Get single
POST   /members           → Create
PATCH  /members/:id       → Update
DELETE /members/:id       → Soft delete
```

### Pagination & Filtering

```
GET /members?page=1&limit=20&search=john&status=active&ministryId=uuid
```

Response format:
```json
{
  "data": [...],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

## Database Schema

### Core Entities

| Entity | Description |
|--------|-------------|
| User | Admin/staff accounts (login credentials) |
| Member | Church member profiles |
| Family | Family/household groupings |
| Ministry | Ministry definitions |
| MinistryMember | Member-ministry assignments |
| Attendance | Service/meeting attendance records |
| Event | Calendar events |
| Contribution | Tithes, offerings, donations |
| Pledge | Giving pledges |
| Notification | System notifications |

### Key Relationships

- Member → Family (many-to-one)
- Member ↔ Ministry (many-to-many via MinistryMember)
- Member → Attendance (one-to-many)
- Member → Contribution (one-to-many)
- Event → Ministry (many-to-one, optional)

## Packages

| Package | Purpose |
|---------|---------|
| `@nestjs/common`, `core`, `platform-express` | NestJS framework |
| `@nestjs/config` | Environment configuration |
| `@nestjs/jwt`, `@nestjs/passport` | JWT authentication |
| `passport-local`, `passport-jwt` | Passport strategies |
| `@prisma/client`, `prisma` | Database ORM |
| `class-validator`, `class-transformer` | DTO validation |
| `@nestjs/swagger` | OpenAPI documentation |
| `@nestjs/schedule` | Cron jobs (reminders, reports) |
| `@nestjs/throttler` | Rate limiting |
| `bcrypt` | Password hashing |
| `nodemailer` | Email dispatch |
| `helmet` | Security headers |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Access token signing secret |
| `JWT_EXPIRES_IN` | Access token TTL (e.g., 15m) |
| `JWT_REFRESH_SECRET` | Refresh token signing secret |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token TTL (e.g., 7d) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Email config |
| `WEB_APP_URL` | Frontend URL for CORS & emails |

## Scripts

```bash
pnpm dev              # Start with hot reload
pnpm build            # Build for production
pnpm start:prod       # Run production build
pnpm test             # Run unit tests
pnpm test:e2e         # Run e2e tests
pnpm prisma:migrate   # Run database migrations
pnpm prisma:studio    # Open Prisma Studio
pnpm prisma:seed      # Seed initial data
```

## Security

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with short-lived access + long-lived refresh
- Rate limiting on auth endpoints
- Helmet for security headers
- Input validation on all endpoints
- Soft deletes preserve audit trail
- Role-based access control on all protected routes
