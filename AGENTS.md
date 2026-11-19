# Caravantur monorepo — Repository Guide

## Wiki Knowledge Base

Vault: `~/Documents/wiki/`.

Когда нужен контекст не из кода:

1. `_meta/hot.md`;
2. `_meta/index.md`;
3. `projects/<project>/index.md`;
4. `shared/`.

Если доступны MCP-инструменты Obsidian, используй их для чтения и поиска.

## Applications

- `apps/mobile` — React Native; документация находится в `docs/mobile`.
- `apps/backend-api` — backend API; документация находится в
  `docs/backend-api`.
- `apps/frontend-dashboard` — административный frontend; документация
  находится в `docs/frontend-dashboard`.

## Request routing

Перед началом работы определи владельца запроса:

- Mobile UI, React Native, навигация, iOS/Android, локализация или мобильная
  интеграция с API:
  1. `docs/mobile/README.md`;
  2. `docs/mobile/development-guide.md`;
  3. документ соответствующего экрана в `docs/mobile/screens/`.
- Backend, база данных, auth, API, бронирования, платежи, внешние поставщики,
  очереди или OpenAPI:
  1. `docs/backend-api/README.md`;
  2. `docs/backend-api/development-guide.md`;
  3. `docs/backend-api/summery-tz.md`.
- Admin dashboard, административные страницы, таблицы, фильтры или формы:
  1. `docs/frontend-dashboard/README.md`;
  2. `docs/frontend-dashboard/development-guide.md`;
  3. backend docs, если запрос затрагивает API или permissions.
- Общие контракты или изменение, затрагивающее несколько приложений:
  1. `docs/README.md`;
  2. `docs/architecture.md`;
  3. инструкции и документацию каждого затронутого приложения;
  4. `packages/README.md`.

Если запрос затрагивает несколько приложений, обновляй документацию каждого
владельца и общий контракт в одной задаче.

## Проверки

Не создавай и не запускай тесты и файлы `.spec` без отдельного указания
пользователя. Проверки типов, линтер и сборка остаются допустимыми.

## Shared repository areas

- `docs` — документация, разделённая по приложениям, и общие решения.
- `design` — исходные PDF/Figma материалы, не runtime-зависимости.
- `packages` — будущие общие контракты и конфигурации.

Не импортируй runtime-код напрямую между приложениями. Общие API-контракты,
схемы и генерируемые клиенты должны находиться в `packages`.
