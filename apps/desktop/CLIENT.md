# Desktop Application

Electron-based desktop app with offline capability for church administrators.

## Approach

The desktop app provides the same admin functionality as the web portal but with offline support. Uses Electron to wrap a React application with local SQLite storage for offline operations. A sync engine reconciles local and server data when connectivity is restored.

### Design Principles

- **Offline-First** - Core operations work without internet
- **Seamless Sync** - Background synchronization when online
- **Conflict Resolution** - Clear handling of sync conflicts
- **Native Feel** - System notifications, menu bar, keyboard shortcuts

## Features

### All Web Portal Features
- Dashboard, membership, ministries, attendance, events, finances, reports
- Same UI/UX as web for consistency

### Offline Capabilities
- View all cached member data
- Record attendance offline
- Add/edit member information
- Create events
- Record contributions
- Queue changes for sync

### Sync Engine
- Automatic background sync when online
- Manual sync trigger
- Sync status indicator
- Conflict detection and resolution
- Sync history log

### Desktop-Specific
- System tray icon with quick actions
- Native notifications for reminders
- Keyboard shortcuts
- Auto-launch on startup (optional)
- Automatic updates

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  Electron Main                   │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────┐ │
│  │   IPC Main  │  │ Auto Update │  │  Tray    │ │
│  └─────────────┘  └─────────────┘  └──────────┘ │
├─────────────────────────────────────────────────┤
│                 Electron Renderer                │
│  ┌─────────────────────────────────────────────┐│
│  │              React Application              ││
│  │  ┌─────────┐  ┌─────────┐  ┌─────────────┐ ││
│  │  │   UI    │  │  State  │  │ Sync Engine │ ││
│  │  └─────────┘  └─────────┘  └─────────────┘ ││
│  └─────────────────────────────────────────────┘│
├─────────────────────────────────────────────────┤
│                   Local Storage                  │
│  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   SQLite    │  │    Electron Store       │  │
│  │  (app data) │  │  (settings, auth)       │  │
│  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

## Offline Strategy

### Data Caching
| Data Type | Cache Strategy |
|-----------|----------------|
| Members | Full sync on login, incremental updates |
| Ministries | Full sync, rarely changes |
| Attendance | Last 3 months cached |
| Events | Next 6 months cached |
| Finances | Current year cached |

### Mutation Queue
When offline, mutations are queued locally:
```json
{
  "id": "uuid",
  "type": "CREATE_MEMBER",
  "payload": { ... },
  "timestamp": "2024-01-15T10:30:00Z",
  "status": "pending"
}
```

### Sync Process
1. Check connectivity
2. Pull server changes since last sync
3. Apply remote changes to local DB
4. Push queued local mutations
5. Handle conflicts (server wins by default, prompt for critical conflicts)
6. Update last sync timestamp

### Conflict Resolution
| Scenario | Resolution |
|----------|------------|
| Same field edited | Server wins, notify user |
| Record deleted on server | Remove local, notify user |
| Record created offline exists on server | Merge or prompt |

## Packages

| Package | Purpose |
|---------|---------|
| `electron` | Desktop framework |
| `electron-builder` | App packaging |
| `electron-updater` | Auto-updates |
| `electron-store` | Settings persistence |
| `better-sqlite3` | Local SQLite database |
| `react` | UI framework |
| `tailwindcss` | Styling |
| `@tanstack/react-query` | State management |
| `zustand` | Client state |
| `date-fns` | Date utilities |

## Project Structure

```
apps/desktop/
├── electron/
│   ├── main.ts             # Main process
│   ├── preload.ts          # Preload script
│   ├── ipc/                # IPC handlers
│   ├── database/           # SQLite operations
│   ├── sync/               # Sync engine
│   └── updater.ts          # Auto-update logic
├── src/
│   ├── components/         # React components
│   ├── pages/              # App pages
│   ├── hooks/              # Custom hooks
│   ├── services/           # API + local DB services
│   └── store/              # Zustand stores
├── resources/              # Icons, assets
└── electron-builder.yml    # Build config
```

## Build Targets

| Platform | Format |
|----------|--------|
| Windows | NSIS installer (.exe) |
| macOS | DMG + notarized |
| Linux | AppImage, deb (optional) |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL |
| `AUTO_UPDATE_URL` | Update server URL |

## Scripts

```bash
pnpm dev          # Start in dev mode
pnpm build        # Build React app
pnpm package      # Package for current platform
pnpm package:all  # Package for all platforms
pnpm publish      # Build + publish update
```

## Auto-Updates

- Uses electron-updater with GitHub Releases (or custom server)
- Checks for updates on launch and periodically
- Downloads in background
- Prompts user to restart and apply
- Supports differential updates
