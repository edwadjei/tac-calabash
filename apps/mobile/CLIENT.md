# Mobile Application

React Native member-facing app for church members.

## Approach

The mobile app is designed for church members (not admins). It provides a simple, read-focused interface for members to view their profile, church information, events, and receive notifications. Built with React Native and Expo for cross-platform deployment.

### Design Principles

- **Member-Focused** - No admin features, simple UI
- **Read-Heavy** - Primarily viewing information
- **Notification-Driven** - Push notifications for announcements
- **Lightweight** - Fast load, minimal data usage

## Features

### Home
- Welcome message
- Upcoming events (next 7 days)
- Recent announcements
- Quick links

### My Profile
- View personal information
- Update contact details (phone, email, address)
- View family members
- View ministry involvement
- View giving history (own contributions only)

### Events
- Church calendar view
- Event details
- Add to phone calendar
- Event reminders

### Ministries
- Browse all ministries
- Ministry details and leadership
- Ministry announcements
- Contact ministry leaders

### Announcements
- Church-wide announcements
- Ministry-specific announcements
- Mark as read
- Share announcements

### Giving History
- Personal giving records
- Annual giving statement
- Giving trends chart

### Settings
- Notification preferences
- Update password
- Contact church
- About app

## What's NOT Included

Admin features remain on web/desktop only:
- Member management (add/edit/delete others)
- Attendance recording
- Financial administration
- Report generation
- Ministry management
- User administration

## Screen Structure

```
app/
├── (tabs)/
│   ├── index.tsx           # Home
│   ├── events.tsx          # Events list
│   ├── ministries.tsx      # Ministries list
│   ├── profile.tsx         # My profile
│   └── _layout.tsx         # Tab navigation
├── (auth)/
│   ├── login.tsx
│   └── forgot-password.tsx
├── events/
│   └── [id].tsx            # Event detail
├── ministries/
│   └── [id].tsx            # Ministry detail
├── announcements/
│   ├── index.tsx           # All announcements
│   └── [id].tsx            # Announcement detail
├── giving/
│   └── index.tsx           # Giving history
└── settings/
    └── index.tsx           # Settings
```

## Packages

| Package | Purpose |
|---------|---------|
| `expo` | React Native toolchain |
| `expo-router` | File-based navigation |
| `expo-notifications` | Push notifications |
| `expo-secure-store` | Secure token storage |
| `expo-calendar` | Add events to calendar |
| `@tanstack/react-query` | Data fetching |
| `axios` | HTTP client |
| `nativewind` | Tailwind for React Native |
| `react-hook-form` | Form handling |
| `zod` | Validation |
| `date-fns` | Date utilities |
| `zustand` | Client state |

## Authentication

- Login with email/password
- JWT stored in expo-secure-store
- Auto-refresh tokens
- Biometric login (optional future feature)

## Push Notifications

### Notification Types
| Type | Trigger |
|------|---------|
| Announcement | New church-wide announcement |
| Ministry Update | Ministry-specific announcement |
| Event Reminder | Upcoming event (configurable timing) |
| Personal | Direct message from church |

### Implementation
- Expo Push Notifications service
- Device token registered on login
- Token sent to backend
- Backend sends via Expo Push API

## Offline Support

Limited offline capability:
- Cached profile data viewable
- Cached events viewable
- Queue profile updates when offline
- Sync when connectivity restored

Not cached (requires connection):
- Announcements (always fresh)
- Giving history
- Ministry updates

## Project Structure

```
apps/mobile/
├── app/                    # Expo Router pages
├── components/             # Shared components
├── hooks/                  # Custom hooks
├── services/               # API services
├── store/                  # Zustand stores
├── constants/              # App constants
├── assets/                 # Images, fonts
├── app.json               # Expo config
└── eas.json               # EAS Build config
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_API_URL` | Backend API URL |

## Scripts

```bash
pnpm dev          # Start Expo dev server
pnpm ios          # Run on iOS simulator
pnpm android      # Run on Android emulator
pnpm build:ios    # EAS Build for iOS
pnpm build:android # EAS Build for Android
pnpm submit       # Submit to app stores
```

## Build & Distribution

### Development
- Expo Go app for quick testing
- Development builds for full native features

### Production
- EAS Build for cloud builds
- iOS: TestFlight → App Store
- Android: Internal testing → Play Store

## Design Guidelines

- Follow platform conventions (iOS/Android)
- Bottom tab navigation (max 5 tabs)
- Pull-to-refresh for lists
- Skeleton loaders for async content
- Haptic feedback for interactions
- Support dark mode (follows system)
