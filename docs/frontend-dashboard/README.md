# ProTravel Admin Dashboard documentation

The dashboard uses React, Vite, TypeScript, Tailwind CSS and shadcn-style owned
UI primitives. TanStack Router, Query and Form are the preferred application
libraries.

- [Development guide](development-guide.md) — dashboard ownership and API
  boundary rules.
- [Authentication](authentication.md) — admin session and protected-route flow.
- [Design system](design-system.md) — ProTravel Horizon tokens and UI rules.
- [Localization](localization.md) — Russian-only administrative UI behavior.
- [Deployment configuration](deployment.md) — local API URL and Kubernetes
  runtime configuration.
- [Tour management](tours.md) — Russian content form, dates, pricing and images.
- [Customer management](customers.md) — customer accounts, family members and
  encrypted documents.
- [Tour booking management](tour-bookings.md) — booking creation, statuses,
  payments and private document uploads.
- [News management](news.md) — mobile news drafts, categories and publishing.
- [System messages](system-messages.md) — operational mobile banners.

Future dashboard-owned documents belong here:

- information architecture and routes;
- role/permission matrix as represented in UI;
- API integration;
- tables, filters and form behavior;
- deployment.

Backend authorization remains documented by Backend API. The dashboard docs
describe only how those permissions are consumed and represented.
