# ProTravel — техническое задание для backend

## 1. Назначение документа

Этот документ описывает backend-модули, необходимые мобильному приложению
ProTravel. Основание:

- `design/Travel Mobile App.pdf`;
- текущая структура React Native приложения;
- реализованные экраны Home, Search, Profile, Notifications и Bookings;
- запланированные потоки поиска, оформления и оплаты путешествий.

Документ является стартовым контрактом для проектирования backend. Конкретные
поставщики авиабилетов, отелей, туров, переводов и платежей пока не выбраны.
Все такие места должны реализовываться через адаптеры.

## 2. Продуктовый контур

Пользователь должен иметь возможность:

1. Зарегистрироваться и войти в приложение.
2. Управлять профилем и сохранёнными путешественниками.
3. Найти авиабилет, отель, тур или трансфер.
4. Применить фильтры и сравнить предложения.
5. Посмотреть детальную информацию и актуальную стоимость.
6. Создать бронирование.
7. Заполнить данные пассажиров или туристов.
8. Оплатить заказ.
9. Получить билет, ваучер или подтверждение.
10. Просматривать свои активные и завершённые поездки.
11. Получать сервисные и маркетинговые уведомления.

Поддерживаемые языки интерфейса и контента:

- русский — `ru`, единственный язык интерфейса и контента на старте.

Основные валюты на старте:

- `RUB`;
- `USD`.
- `EUR`.

## 3. Рекомендуемый формат API

- REST API с префиксом `/api/v1`.
- JSON для запросов и ответов.
- OpenAPI 3.1 является обязательным контрактом.
- Авторизация: `Authorization: Bearer <access_token>`.
- Локаль: `Accept-Language: ru`.
- Валюта: `X-Currency: RUB|USD|EUR` или параметр `currency`.
- Временные значения: ISO 8601 в UTC.
- Локальные даты поездок: `YYYY-MM-DD`.
- Деньги передаются целым числом в минимальных единицах.
- Валюта всегда передаётся отдельным полем.
- Идентификаторы — UUID или непрозрачные строки.
- Для создания бронирования и платежа обязателен `Idempotency-Key`.

Пример денежного объекта:

```json
{
  "amount": 1173501100,
  "currency": "RUB",
  "formatted": "117 350,11 RUB"
}
```

Поле `formatted` может возвращаться для удобства клиента, но источником истины
остаются `amount` и `currency`.

## 4. Общий формат ошибок

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "fields": {
      "travelers.0.birth_date": "INVALID_DATE"
    },
    "request_id": "req_01..."
  }
}
```

Backend должен возвращать стабильный машинный `code`. Мобильное приложение
самостоятельно переводит известные ошибки. Не следует использовать текст
ошибки как программный контракт.

Базовые коды:

- `VALIDATION_ERROR`;
- `UNAUTHORIZED`;
- `FORBIDDEN`;
- `NOT_FOUND`;
- `CONFLICT`;
- `RATE_LIMITED`;
- `OFFER_EXPIRED`;
- `PRICE_CHANGED`;
- `SOLD_OUT`;
- `PAYMENT_FAILED`;
- `PROVIDER_UNAVAILABLE`;
- `INTERNAL_ERROR`.

## 5. Модули backend

### 5.1. Authentication

Ответственность:

- вход по номеру телефона без отдельной регистрации;
- запрос и подтверждение SMS-кода;
- автоматическое создание клиента при первом успешном входе;
- обновление access token;
- управление активными сессиями;
- блокировка после подозрительных попыток входа.

Основные сущности:

- `Customer`;
- `CustomerLoginChallenge`;
- `Session`;
- `RefreshToken`;

Предлагаемые endpoints:

```text
POST   /auth/login
POST   /auth/verify
POST   /auth/refresh
POST   /auth/logout
GET    /auth/sessions
DELETE /auth/sessions/{session_id}
```

Access token должен быть короткоживущим. Refresh token должен поддерживать
ротацию и отзыв.

### 5.2. Customers and profile

Ответственность:

- данные владельца аккаунта;
- имя, фамилия и отчество;
- телефон и e-mail;
- предпочитаемые язык и валюта;
- настройки уведомлений;
- согласия с политиками.

Сущности:

- `CustomerProfile`;
- `CustomerPreference`;
- `CustomerConsent`;

Endpoints:

```text
GET    /me
PATCH  /me
GET    /me/preferences
PATCH  /me/preferences
GET    /me/consents
POST   /me/consents
DELETE /me
```

Пример preferences:

```json
{
  "language": "uz",
  "currency": "RUB",
  "notifications": {
    "booking_updates": true,
    "price_alerts": true,
    "marketing": false
  }
}
```

### 5.3. Travelers and documents

Сохранённые путешественники используются при оформлении авиабилетов и туров.

Сущность `Traveler`:

- `id`;
- `customer_id`;
- `first_name`;
- `last_name`;
- `middle_name`;
- `gender`;
- `birth_date`;
- `citizenship_country_code`;
- `phone`;
- `email`;
- `is_account_owner`;
- `created_at`;
- `updated_at`.

Сущность `TravelerDocument`:

- `id`;
- `traveler_id`;
- `type`;
- `number`;
- `issuing_country_code`;
- `issued_at`;
- `expires_at`;
- `first_name_latin`;
- `last_name_latin`.

Endpoints:

```text
GET    /me/travelers
POST   /me/travelers
GET    /me/travelers/{traveler_id}
PATCH  /me/travelers/{traveler_id}
DELETE /me/travelers/{traveler_id}
POST   /me/travelers/{traveler_id}/documents
PATCH  /me/travelers/{traveler_id}/documents/{document_id}
DELETE /me/travelers/{traveler_id}/documents/{document_id}
```

Номер документа и другие чувствительные данные должны храниться в
зашифрованном виде. В обычных списках номер возвращается маскированным.

### 5.4. Reference data

Общие справочники:

- страны;
- города;
- аэропорты;
- гражданства;
- типы документов;
- авиакомпании;
- категории отелей;
- типы питания;
- классы обслуживания;
- валюты;
- языки.

Endpoints:

```text
GET /reference/countries
GET /reference/cities
GET /reference/airports
GET /reference/airlines
GET /reference/document-types
GET /reference/meal-types
GET /reference/currencies
```

Справочники должны поддерживать поиск и локализованные названия:

```json
{
  "code": "SVO",
  "name": "Шереметьево",
  "city": {
    "code": "MOW",
    "name": "Москва"
  },
  "country_code": "RU"
}
```

Ответ зависит от `Accept-Language`.

### 5.5. Home and content

Модуль формирует главную страницу без жёсткой привязки мобильного клиента к
порядку секций.

Секции:

- категории продукта;
- рекомендуемые предложения;
- популярные направления;
- выгодные авиаперелёты;
- горячие туры;
- промобаннеры;
- редакционные материалы.

Сущности:

- `HomeSection`;
- `Banner`;
- `Promotion`;
- `Destination`;
- `ContentArticle`.

Endpoints:

```text
GET /home
GET /system-messages
GET /news
GET /news/unread-status
POST /news/{news_id}/read
GET /me/tour-bookings
GET /me/tour-bookings/{booking_id}
POST /me/tour-bookings
GET /admin/news
POST /admin/news
PATCH /admin/news/{news_id}
DELETE /admin/news/{news_id}
GET /promotions
GET /promotions/{promotion_id}
GET /destinations
GET /articles
GET /articles/{article_id}
```

`GET /system-messages` возвращает только активные оперативные сообщения.
Тип `info` используется для нейтральной информации, тип `error` — для
временной недоступности или проблемы сервиса. Административный API позволяет
создавать, редактировать, включать и выключать эти сообщения.

`GET /news` возвращает только опубликованные материалы, короткий `summary`,
полный `content` и поля `isRead` / `readAt`.
`GET /news/unread-status` возвращает `hasUnread` и `unreadCount` для
лёгкого обновления индикатора в нижней навигации без загрузки всей ленты.
Пока мобильное приложение запускается без обязательной авторизации,
backend идентифицирует читателя долгоживущей HTTP-only cookie и хранит отметки
в `news_reads`. После возврата обязательного входа reader должен привязываться
к customer, чтобы история чтения синхронизировалась между устройствами.

Административные endpoints новостей возвращают также черновики и позволяют
создавать, редактировать, публиковать, снимать с публикации и удалять материалы.
Чтение требует `content.read`, изменения — `content.write`.

`GET /home` реализован как публичная витрина существующего каталога туров и
возвращает три коллекции:

```json
{
  "recommended": [],
  "popularDestinations": [],
  "hotTours": []
}
```

- `recommended` — первые два опубликованных тура с `isFeatured=true`,
  упорядоченные по `sortOrder`;
- `popularDestinations` — два направления с максимальным количеством
  опубликованных туров; `fromPrice` и обложка берутся у самого дешёвого тура
  этого направления;
- `hotTours` — два опубликованных тура с минимальной базовой ценой.

Элементы содержат готовые для мобильной карточки заголовок, направление,
продолжительность, денежный объект и nullable `imageUrl`. Мобильный клиент
запрашивает серверный пресет `home-card` через `GET /files/image-transform`;
произвольные размеры клиент не передаёт.
Отдельные таблицы главной страницы не создаются: источником истины остаётся
каталог туров. Для будущей ручной редакционной подборки горячих предложений
потребуется отдельный признак или merchandising-модель.

Тексты контента хранятся отдельно для `ru`, `uz` и `en`. Если перевода нет,
используется согласованный fallback, предпочтительно русский.

### 5.6. Search orchestration

Единая точка поиска принимает запрос, вызывает нужного поставщика и
нормализует результаты.

Поддерживаемые продукты:

- `flight`;
- `hotel`;
- `tour`;
- `transfer`.

Задачи:

- валидация критериев;
- создание `search_id`;
- кэширование результатов;
- пагинация;
- сортировка;
- фильтрация;
- дедупликация;
- нормализация предложений;
- контроль срока жизни предложения;
- повторная проверка цены перед бронированием.

Общие endpoints:

```text
POST /searches
GET  /searches/{search_id}
GET  /searches/{search_id}/results
GET  /searches/{search_id}/filters
POST /offers/{offer_id}/revalidate
```

Для долгого поиска допустимы:

- polling;
- Server-Sent Events;
- WebSocket.

На MVP достаточно polling с полями `status`, `progress` и `next_poll_after_ms`.

Статусы поиска:

```text
created -> running -> completed
                   -> partial
                   -> failed
                   -> expired
```

### 5.7. Flights

Критерии поиска:

- origin;
- destination;
- departure date;
- return date;
- one-way/round-trip/multi-city;
- adults;
- children;
- infants;
- infants with seat;
- cabin class;
- baggage preference;
- direct flights only.

Сущности нормализованного предложения:

- `FlightOffer`;
- `FlightItinerary`;
- `FlightSegment`;
- `FareOption`;
- `BaggageAllowance`;
- `FareRule`.

Endpoints:

```text
POST /flights/searches
GET  /flights/searches/{search_id}/results
GET  /flights/offers/{offer_id}
POST /flights/offers/{offer_id}/revalidate
GET  /flights/offers/{offer_id}/fare-rules
```

Ответ предложения должен включать:

- авиакомпанию;
- номер рейса;
- аэропорты;
- локальные время и дату;
- часовой пояс;
- длительность;
- пересадки;
- класс;
- багаж;
- возвратность;
- доступные места;
- итоговую стоимость;
- комиссии;
- срок действия предложения.

Поставщик должен быть скрыт за интерфейсом `FlightProvider`.

### 5.8. Hotels

Критерии поиска:

- страна/город/курорт;
- даты заезда и выезда;
- количество номеров;
- взрослые и дети по номерам;
- категория;
- рейтинг;
- питание;
- удобства;
- диапазон цены.

Сущности:

- `Hotel`;
- `HotelImage`;
- `HotelAmenity`;
- `Room`;
- `RoomRate`;
- `MealPlan`;
- `CancellationPolicy`;
- `HotelOffer`.

Endpoints:

```text
POST /hotels/searches
GET  /hotels/searches/{search_id}/results
GET  /hotels/{hotel_id}
GET  /hotels/{hotel_id}/offers
POST /hotels/offers/{offer_id}/revalidate
```

Детали отеля:

- локализованные название и описание;
- адрес и координаты;
- изображения;
- рейтинг;
- категория;
- удобства;
- доступные номера;
- тип питания;
- правила отмены;
- время check-in/check-out.

### 5.9. Tours

Тур является пакетным предложением и может включать:

- перелёт;
- трансфер;
- проживание;
- питание;
- страховку;
- услуги гида.

Критерии:

- город вылета;
- направление;
- диапазон дат;
- продолжительность;
- туристы;
- категория отеля;
- питание;
- диапазон цены;
- рейтинг;
- пляж/линия;
- удобства.

Сущности:

- `TourPackage`;
- `TourDeparture`;
- `TourOffer`;
- `TourInclusion`;
- `TourExclusion`;
- `TourAccommodation`;
- `TourOperator`.

Endpoints:

```text
GET  /tours
GET  /tours/{tour_id}
POST /tours/searches
GET  /tours/searches/{search_id}/results
GET  /tours/offers/{offer_id}
POST /tours/offers/{offer_id}/revalidate
GET  /tours/offers/{offer_id}/availability
```

Первые две ручки реализуют каталог собственных опубликованных туров:
направление и сортировка применяются на backend, а детальная ручка возвращает
маршрут, даты выезда, размещение, питание, программу, состав стоимости и
галерею. Search/offer endpoints остаются целевым контрактом для будущего
динамического поставщика туров.

### 5.10. Transfers

Типы:

- аэропорт → отель;
- отель → аэропорт;
- адрес → адрес;
- индивидуальный;
- групповой.

Сущности:

- `TransferOffer`;
- `VehicleClass`;
- `PickupPoint`;
- `TransferProvider`.

Endpoints:

```text
POST /transfers/searches
GET  /transfers/searches/{search_id}/results
GET  /transfers/offers/{offer_id}
POST /transfers/offers/{offer_id}/revalidate
```

### 5.11. Pricing and currency

Ответственность:

- базовая цена поставщика;
- markup;
- скидки;
- промокоды;
- сервисные сборы;
- налоги;
- конвертация валют;
- детализация итоговой стоимости.

Сущности:

- `Price`;
- `PriceComponent`;
- `MarkupRule`;
- `PromotionRule`;
- `PromoCode`;
- `ExchangeRate`.

Endpoints:

```text
GET  /currencies/rates
POST /pricing/quote
POST /promo-codes/validate
```

Каждая цена должна содержать breakdown:

```json
{
  "base": {},
  "taxes": {},
  "service_fee": {},
  "discount": {},
  "total": {}
}
```

Цена из поисковой выдачи не считается гарантированной. Перед созданием заказа
обязательна revalidation.

### 5.12. Bookings and orders

Единый модуль бронирований должен работать с любым продуктом.

Сущности:

- `Order`;
- `Booking`;
- `BookingItem`;
- `BookingTraveler`;
- `BookingContact`;
- `PriceSnapshot`;
- `ProviderReservation`;
- `BookingDocument`;
- `BookingStatusHistory`.

`Order` объединяет коммерческую операцию и оплату. `Booking` представляет
резервацию конкретного продукта.

Endpoints:

```text
POST   /orders
GET    /orders/{order_id}
POST   /orders/{order_id}/travelers
POST   /orders/{order_id}/confirm
POST   /orders/{order_id}/cancel
GET    /me/bookings
GET    /me/bookings/{booking_id}
POST   /me/bookings/{booking_id}/cancel
GET    /me/bookings/{booking_id}/documents
GET    /me/bookings/{booking_id}/documents/{document_id}
```

Фильтры списка:

- `upcoming`;
- `completed`;
- `cancelled`;
- тип продукта;
- диапазон дат.

Статусы заказа:

```text
draft
pending_revalidation
price_changed
awaiting_payment
payment_processing
paid
booking_processing
confirmed
partially_confirmed
failed
cancelled
refunded
partially_refunded
expired
```

Каждая смена статуса записывается в историю. Повторный запрос с тем же
`Idempotency-Key` должен возвращать исходный результат.

### 5.13. Payments

Платёжные способы MVP через hosted-форму Raiffeisen:

- СБП;
- банковская карта (`ACQUIRING`).

Click, Payme и наличные в текущую реализацию не входят.

Сущности:

- `Payment`;
- `PaymentAttempt`;
- `PaymentMethod`;
- `Refund`;
- `PaymentWebhook`;

Endpoints:

```text
POST /me/payments
GET  /me/payments/{payment_id}
POST /webhooks/payments/raiffeisen
```

Требования:

- мобильное приложение не отправляет backend полный номер карты, если
  используется hosted/tokenized checkout;
- webhook проверяется по подписи;
- webhook обрабатывается идемпотентно;
- статус оплаты нельзя подтверждать только по ответу мобильного клиента;
- payment и booking должны быть согласованы через фоновые задачи;
- поддерживаются полный и частичный возврат.

### 5.14. Notifications

Каналы:

- push;
- in-app inbox;
- e-mail;
- SMS.

Типы:

- OTP;
- изменение статуса бронирования;
- успешная или неуспешная оплата;
- выпуск билета/ваучера;
- изменение времени рейса;
- напоминание о поездке;
- изменение цены;
- маркетинговая акция.

Сущности:

- `Device`;
- `Notification`;
- `NotificationTemplate`;
- `NotificationDelivery`;
- `NotificationPreference`.

Endpoints:

```text
POST  /me/devices
DELETE /me/devices/{device_id}
GET   /me/notifications
GET   /me/notifications/unread-count
POST  /me/notifications/{notification_id}/read
POST  /me/notifications/read-all
```

Шаблоны должны иметь версии на `ru`, `uz` и `en`.

### 5.15. Favorites and price alerts

В дизайн-референсах присутствуют закладки и уведомления о снижении цены.
Рекомендуется выделить модуль, даже если он войдёт после MVP.

Сущности:

- `Favorite`;
- `SavedSearch`;
- `PriceAlert`.

Endpoints:

```text
GET    /me/favorites
POST   /me/favorites
DELETE /me/favorites/{favorite_id}
GET    /me/saved-searches
POST   /me/saved-searches
DELETE /me/saved-searches/{saved_search_id}
POST   /me/price-alerts
PATCH  /me/price-alerts/{alert_id}
DELETE /me/price-alerts/{alert_id}
```

### 5.16. Reviews

На карточках отображается рейтинг. Источник рейтинга должен быть определён:

- поставщик;
- собственные отзывы;
- смешанный рейтинг.

Если отзывы собственные:

```text
GET  /hotels/{hotel_id}/reviews
POST /bookings/{booking_id}/review
PATCH /reviews/{review_id}
DELETE /reviews/{review_id}
```

Оставить отзыв может только пользователь с завершённым бронированием.

### 5.17. Files and media

Используется для:

- аватара;
- изображений отелей и туров;
- билетов;
- ваучеров;
- страховых документов;
- счетов;
- вложений службы поддержки.

Требования:

- хранение в S3-совместимом object storage;
- CDN для публичных изображений;
- private bucket для документов;
- signed URL с коротким сроком жизни;
- проверка MIME type и размера;
- антивирусная проверка пользовательских файлов.

### 5.18. Support

Рекомендуемый минимальный модуль:

- обращение пользователя;
- связь обращения с order/booking;
- сообщения и вложения;
- статус и ответственный оператор.

Endpoints:

```text
GET  /me/support/tickets
POST /me/support/tickets
GET  /me/support/tickets/{ticket_id}
POST /me/support/tickets/{ticket_id}/messages
POST /me/support/tickets/{ticket_id}/close
```

### 5.19. Admin and back office

Нужна отдельная защищённая административная зона.

Возможности:

- просмотр пользователей;
- просмотр заказов, оплат и статусов провайдеров;
- ручная повторная обработка зависших операций;
- возвраты с подтверждением;
- управление banners/promotions/home sections;
- управление локализованным контентом;
- управление markup и promo rules;
- просмотр уведомлений;
- блокировка пользователя;
- журнал административных действий.

Роли:

- `customer`;
- `support`;
- `content_manager`;
- `booking_operator`;
- `finance`;
- `admin`;
- `super_admin`.

Права должны проверяться на backend, а не только скрываться в интерфейсе.

### 5.20. Audit and security

Аудит обязателен для:

- изменения персональных данных;
- просмотра немаскированных документов;
- изменения бронирования;
- изменения платежа или возврата;
- административных действий;
- изменения ролей;
- ручной смены статуса.

Сущность `AuditEvent`:

- actor;
- action;
- target type/id;
- before/after без секретных данных;
- IP;
- user agent;
- request id;
- timestamp.

## 6. Ключевые пользовательские процессы

### 6.1. Поиск и бронирование

```text
Mobile
  -> create search
  -> poll results
  -> open offer
  -> revalidate offer
  -> create draft order
  -> attach travelers
  -> confirm order
  -> create payment
  -> payment webhook
  -> reserve with provider
  -> issue ticket/voucher
  -> notify user
```

Если цена изменилась, backend не должен автоматически списывать новую сумму.
Он возвращает `PRICE_CHANGED` и новую цену для подтверждения пользователем.

### 6.2. Отмена

```text
request cancellation quote
  -> show penalty/refund amount
  -> user confirms
  -> cancel with provider
  -> create refund
  -> update booking
  -> notify user
```

Желательно добавить отдельный endpoint предварительного расчёта отмены:

```text
POST /me/bookings/{booking_id}/cancellation-quote
```

### 6.3. Асинхронная обработка

Через очередь должны выполняться:

- запросы к медленным поставщикам;
- подтверждение бронирования;
- выпуск документов;
- обработка payment webhooks;
- push/e-mail/SMS;
- синхронизация статусов;
- повторные попытки;
- обновление exchange rates;
- обработка price alerts.

Каждая задача должна иметь retry policy и dead-letter queue.

## 7. Хранилище данных

Рекомендуемое разделение:

- PostgreSQL — пользователи, заказы, оплаты, настройки и история;
- Redis — sessions, rate limits, search cache, distributed locks;
- S3-compatible storage — изображения и документы;
- очередь сообщений — фоновые задачи и интеграционные события;
- аналитическое хранилище — позднее, для продуктовой аналитики.

Поисковые предложения поставщиков не обязательно хранить постоянно. Они
могут жить в Redis до истечения `expires_at`. При создании заказа обязательный
snapshot предложения сохраняется в PostgreSQL.

## 8. Интеграционная архитектура

Каждый внешний сервис должен иметь внутренний интерфейс:

```text
FlightProvider
HotelProvider
TourProvider
TransferProvider
PaymentProvider
SmsProvider
EmailProvider
PushProvider
ExchangeRateProvider
```

Нормализованные доменные модели не должны содержать provider-specific поля.
Оригинальный payload допустимо хранить отдельно для диагностики с ограниченным
доступом и сроком хранения.

Для каждого вызова провайдера нужны:

- timeout;
- circuit breaker;
- retry только для безопасных операций;
- correlation id;
- метрики latency/error rate;
- маскирование чувствительных данных в логах.

## 9. Безопасность и персональные данные

Обязательные требования:

- TLS для всех соединений;
- шифрование чувствительных полей в базе;
- секреты только через secret manager;
- customer не использует пароль; пароль admin хэшируется Argon2id;
- OTP имеет срок действия и лимит попыток;
- rate limiting по IP, account и device;
- документы не попадают в application logs;
- номера документов маскируются;
- минимизация данных в API;
- проверка доступа к каждому traveler/booking/document;
- регулярное удаление просроченных токенов и временных поисков;
- процедура удаления аккаунта и персональных данных;
- backup и проверяемое восстановление.

Необходимо отдельно подтвердить применимые требования законодательства
России по персональным данным, локализации данных, платежам и туристическим
услугам.

## 10. Наблюдаемость

Каждый запрос получает `request_id`.

Нужны:

- структурированные JSON logs;
- метрики HTTP и внешних провайдеров;
- distributed tracing;
- error monitoring;
- dashboard по поискам, заказам и оплатам;
- алерты на рост ошибок;
- бизнес-метрики конверсии.

Критические метрики:

- search success rate;
- provider latency;
- offer revalidation failure rate;
- price change rate;
- payment success rate;
- booking confirmation time;
- booking failure rate;
- refund completion time;
- notification delivery rate.

## 11. Нефункциональные требования

Начальные ориентиры, которые нужно подтвердить нагрузочным профилем:

- API availability не ниже 99.9%;
- p95 обычного API запроса до 500 ms без учёта внешнего поиска;
- таймаут внешнего поставщика задаётся отдельно;
- поиск возвращает progress, если не готов быстро;
- все mutating endpoints идемпотентны там, где возможен повтор;
- миграции базы выполняются версионированно;
- breaking API changes выпускаются новой версией;
- production имеет отдельные окружения staging и development;
- персональные данные не копируются в development.

## 12. Рекомендуемые события

Внутренние события:

```text
customer.created
profile.updated
search.completed
offer.revalidated
order.created
order.price_changed
payment.started
payment.succeeded
payment.failed
booking.confirmed
booking.failed
booking.cancelled
refund.completed
document.issued
notification.requested
```

События должны иметь `event_id`, версию схемы и обрабатываться идемпотентно.

## 13. Приоритеты реализации

### Этап 1 — фундамент

- Authentication;
- Users/Profile;
- Travelers/Documents;
- Reference Data;
- OpenAPI;
- audit basics;
- локализация контента.

### Этап 2 — каталог и поиск

- Home/Content;
- Search Orchestration;
- один реальный flight provider;
- Flight Search;
- offer revalidation;
- pricing/currency.

### Этап 3 — оформление

- Orders/Bookings;
- Payments;
- payment webhooks;
- booking status history;
- Notifications;
- документы билета/ваучера.

### Этап 4 — остальные продукты

- Hotels;
- Tours;
- Transfers;
- отмены и возвраты;
- Support.

### Этап 5 — развитие

- Favorites;
- Saved Searches;
- Price Alerts;
- Reviews;
- расширенный Admin;
- продуктовая аналитика.

## 14. Definition of Done для backend endpoint

Endpoint считается завершённым, если:

1. Он присутствует в OpenAPI.
2. Есть request/response schema.
3. Определены authorization rules.
4. Добавлена валидация.
5. Определены машинные error codes.
6. Есть unit и integration tests.
7. Логи не содержат персональные или платёжные секреты.
8. Добавлены метрики.
9. Для mutation определена идемпотентность.
10. Обновлена документация мобильной команды.

## 15. Открытые продуктовые вопросы

Перед окончательным проектированием необходимо определить:

1. Какие поставщики используются для flights, hotels, tours и transfers?
2. Является ProTravel агентом, marketplace или merchant of record?
3. Кто принимает деньги и формирует фискальный чек?
4. Какие способы оплаты точно входят в MVP?
5. Разрешена ли оплата наличными?
6. Какая система markup и комиссий?
7. Кто отвечает за отмены и поддержку?
8. Нужны ли гостевые бронирования без регистрации?
9. Нужна ли обязательная верификация телефона и e-mail?
10. Нужно ли хранить сканы документов или только реквизиты?
11. Откуда берутся рейтинги и отзывы?
12. Какие языки должны поддерживать внешние документы?
13. Какая валюта является расчётной?
14. Как часто обновляются курсы валют?
15. Требуются ли промокоды и программа лояльности в MVP?
16. Нужен ли отдельный web admin в первой версии?
17. Какие SLA согласованы для подтверждения бронирования и возврата?

## 16. Минимальный контракт для начала mobile-backend интеграции

Чтобы мобильная команда могла уйти от fixtures, backend сначала должен отдать:

```text
POST /api/v1/auth/login
POST /api/v1/auth/refresh
GET  /api/v1/me
PATCH /api/v1/me
GET  /api/v1/me/preferences
PATCH /api/v1/me/preferences
GET  /api/v1/me/travelers
POST /api/v1/me/travelers
GET  /api/v1/home
GET  /api/v1/reference/airports
POST /api/v1/flights/searches
GET  /api/v1/flights/searches/{search_id}/results
GET  /api/v1/flights/offers/{offer_id}
POST /api/v1/flights/offers/{offer_id}/revalidate
POST /api/v1/orders
GET  /api/v1/orders/{order_id}
GET  /api/v1/me/bookings
GET  /api/v1/me/notifications
```

Вместе с первым endpoint backend-разработчик должен предоставить:

- OpenAPI файл;
- URL development окружения;
- тестовые credentials;
- список error codes;
- Postman/Bruno collection при необходимости;
- описание mock provider или sandbox внешнего поставщика.
