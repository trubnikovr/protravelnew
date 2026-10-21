# ProTravel monorepo

Общий репозиторий продуктов ProTravel.

## Структура

```text
apps/
  mobile/             React Native приложение для iOS и Android
  backend-api/        NestJS API, Drizzle ORM и PostgreSQL
  frontend-dashboard/ React/Vite административная панель
packages/
  api-contract/       Swagger/OpenAPI-контракты backend
http-clients/         локальные HTTP-сценарии
design/               исходники дизайна
docs/                 продуктовая и техническая документация
```

## Требования

- Node.js 24 (`nvm use`);
- PostgreSQL на `127.0.0.1:5432`;
- Java для OpenAPI Generator;
- Redis понадобится для полного запуска backend.

Установка зависимостей:

```sh
nvm use
npm install
```

## Backend: первый локальный запуск

Настройки находятся в `apps/backend-api/.env`. Шаблон — `.env.example`.

```sh
# применить миграции
npm run backend:db:migrate

# создать первого super-admin
npm run backend:seed:admin

# импортировать страны, города и аэропорты
npm run backend:seed:reference

# запустить NestJS в dev-режиме
npm run backend:dev
```

Оба seed-сценария идемпотентны. Справочники читаются из
`apps/backend-api/seeds/reference` и обновляются через upsert. Существующий
администратор с таким email не изменяется.
Email, пароль и имя берутся из переменных `ADMIN_SEED_*` в backend `.env`.
Административный вход использует отдельный уникальный login, а не email.
Локальный super-admin создаётся с login `admin`.

При старте backend обновляет контракты:

- `packages/api-contract/v1/mobile.openapi.json`;
- `packages/api-contract/v1/admin.openapi.json`.

После изменения admin API перегенерируйте TypeScript-клиент:

```sh
npm run admin:api:generate
```

Swagger UI:

- mobile: `http://localhost:3000/api/mobile/docs`;
- admin: `http://localhost:3000/api/admin/docs`.

Проверить авторизацию можно через
[`http-clients/admin-auth.http`](http-clients/admin-auth.http).
Перед выполнением выберите HTTP Client environment `local`. Общие переменные
лежат в `http-client.env.json`, пароль — в локальном исключённом из Git
`http-client.private.env.json`.

## Admin dashboard

```sh
npm run admin:dev
```

Dashboard доступен по адресу `http://localhost:3001` и использует
сгенерированный OpenAPI-клиент.

## Mobile

```sh
npm run mobile:start
npm run mobile:ios
# или
npm run mobile:android
```

## Проверки

```sh
npm run typecheck
npm run lint
npm test
```

Документация разделена по приложениям в `docs/`.
