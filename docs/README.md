# ProTravel shared documentation

Документация разделена по приложениям внутри единой корневой директории.

Для локального запуска backend и админки из корня выполните `npm run dev`.
Логи обоих процессов выводятся в один терминал с префиксами `backend` и
`dashboard`; Ctrl+C останавливает оба. Мобильное приложение не запускается.
Необходимую backend-инфраструктуру запускайте отдельно: `npm run infra:local:up`.

## Маршрутизация

- Mobile: [`mobile/README.md`](mobile/README.md)
- Backend API:
  [`backend-api/README.md`](backend-api/README.md)
- Admin dashboard:
  [`frontend-dashboard/README.md`](frontend-dashboard/README.md)
- Общая архитектура: [`architecture.md`](architecture.md)
- Production Kubernetes: [`production-kubernetes.md`](production-kubernetes.md)

Новые документы размещаются в `docs/<app>`. Непосредственно в `docs` остаются
только общие решения, которые одновременно используют два или более
приложений.
