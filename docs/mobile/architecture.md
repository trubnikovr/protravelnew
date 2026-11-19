# Mobile architecture

Repository-wide boundaries are documented in `../architecture.md`.

## Directory map

```text
apps/mobile/src/
├── app/
│   └── navigation/
│       ├── AppNavigator.tsx
│       ├── AuthNavigator.tsx
│       ├── MainTabNavigator.tsx
│       ├── HomeNavigator.tsx
│       ├── AviaNavigator.tsx
│       ├── ProfileNavigator.tsx
│       └── types.ts
├── features/
│   ├── auth/
│   ├── home/
│   ├── avia/
│   ├── bookings/
│   ├── news/
│   └── profile/
└── shared/
    ├── assets/
    ├── theme/
    └── ui/
```

## Responsibilities

### `app`

Application composition: root providers, stack/tab navigation and route
parameter types. It can import public feature entry points and shared modules.

### `features`

Each folder owns one user capability. Screens, feature-only components, data,
state and API adapters stay together. Other features should not reach into its
internal directories.

### `shared`

Framework-level building blocks with no product workflow knowledge:

- global theme and typography;
- generic buttons and headers;
- common icons and image assets;
- utilities used by more than one feature.

## Navigation

`AppNavigator` always opens the main application. `MainTabNavigator` owns the
five primary destinations: Home, News, Flights, Tours and Profile. The
Profile tab switches between `AuthNavigator` and the authenticated profile
stack according to the in-memory customer session. Switching primary tabs uses
React Navigation's short `shift` transition; nested native-stack transitions
remain independent.

Home, Flights, Tours and Profile each have a nested native-stack navigator. A feature
stack owns its overview screen and every detail/form screen in that flow.
News remains a direct tab screen. Bookings belongs to the authenticated Profile
stack.

All route names and parameters are typed in
`apps/mobile/src/app/navigation/types.ts`.

`ServerStateProvider` owns the TanStack Query client and connects React Native
`AppState` to its focus manager. Cached queries are retained for 30 minutes,
become stale after one minute and refetch after the application returns to the
foreground. Data screens can additionally refresh on navigation focus.

`AuthSessionProvider` owns the current customer tokens and phone, persists them
through the native keychain and refreshes expired access tokens.

## State and data

Static design fixtures initially live in each feature's `data/` directory.
When backend integration starts, keep API DTOs and adapters inside the owning
feature and map them to view models before rendering.

Home uses this integrated structure: `features/home/api` owns the `/home`
contract, the `home` TanStack Query owns loading/error/content state, and
local data is limited to category navigation and fallback images.

The shared API transport publishes connection failures to `connection-state`.
`MainTabNavigator` renders a single `ConnectionBanner` above its tab bar for all
nested screens. Both normal requests and token refresh use the transport;
connection failures preserve the stored session. Only rejected refresh
credentials (401/403) clear it. Caller cancellation does not display a connection
warning. A subsequent reachable API response clears the warning.
