# News

## Source

PDF page 67.

## Routes

- Bottom tab: `News`;
- News stack: `NewsFeed`;
- News stack: `NewsDetails`.

## Content

- published news loaded from `GET /api/v1/news`;
- promotion, security and general news categories;
- short `summary` text in feed cards and full `content` on the detail screen;
- loading, error, empty and content states.

The screen contains the section header and the news feed over a dedicated,
low-contrast travel-editorial background. The background uses a world map and
route-line motif, remains decorative and has no embedded text or promotional
copy. It is exclusive to the News feed.

Administrators create drafts and publish or unpublish feed items through the
dashboard `/news` route backed by `/api/v1/admin/news`.

Every card keeps full opacity. Its top-right status dot is purple when unread
and gray when read. Every card opens `NewsDetails`; opening an unread article
also calls `POST /api/v1/news/{newsId}/read`. The backend stores `readAt` for the reader
identified by its HTTP-only cookie. The bottom-tab badge displays the live
unread count. The badge polls
`GET /api/v1/news/unread-status`, whose `hasUnread` and `unreadCount` fields
avoid downloading the full feed just to update navigation.

All news requests use `credentials: include`; read state is never persisted in
mobile application storage.

The `news` TanStack Query caches the list, deduplicates consumers used by the
tab badge and screen, and refreshes it when the News screen receives focus.
Marking an article read is a mutation with an optimistic cache update and
rollback if the backend request fails.

The detail screen shows the category, publication date, title and full article
content in a vertically scrollable view.

## UI

Shared: `ScreenHeader`, `TravelStateCard`.

When the feed cannot load and no cached articles are available, show the same
centered white state card as flight search: travel icon, error title, connection
message and Retry action. The feed background and global bottom connection
banner remain visible. Cached articles remain accessible after refresh errors.
