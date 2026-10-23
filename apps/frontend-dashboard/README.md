# ProTravel Admin Dashboard

Administrative frontend built with React, Vite, TanStack and the ProTravel
Horizon design system.

## Local development

```bash
cp apps/frontend-dashboard/.env.example apps/frontend-dashboard/.env
npm run dashboard:dev
```

The dashboard is available at `http://localhost:3001`. Its default API URL is
`http://localhost:3000`.

Implemented:

- administrator login;
- session restoration through `/admin/me`;
- protected routes and logout;
- light/dark ProTravel Horizon theme;
- initial authenticated application shell.

Documentation belongs to `docs/frontend-dashboard`.
