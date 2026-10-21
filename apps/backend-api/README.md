# ProTravel Backend API

Модульный монолит на NestJS 11 для мобильного приложения и административной
панели ProTravel.

## Запуск

```bash
cp apps/backend-api/.env.example apps/backend-api/.env
npm run backend:dev
```

На текущем этапе PostgreSQL и Redis запускаются локально. Docker Compose не
является частью рабочего процесса и может быть подключён позже при подготовке
окружений.

API: `http://localhost:3000/api/v1`  
Mobile Swagger: `http://localhost:3000/api/mobile/docs`  
Health Score: `http://localhost:3000/api/v1/health`  
Liveness: `http://localhost:3000/api/v1/health/live`

OpenAPI-контракты автоматически обновляются при старте NestJS из Swagger
decorators, указанных в controllers и DTO. Результаты сохраняются в
`packages/api-contract/mobile.openapi.json` и
`packages/api-contract/admin.openapi.json`.

Техническое задание и правила разработки:

- [`../../docs/backend-api/README.md`](../../docs/backend-api/README.md)
- [`../../docs/backend-api/development-guide.md`](../../docs/backend-api/development-guide.md)
- [`../../docs/backend-api/summery-tz.md`](../../docs/backend-api/summery-tz.md)
