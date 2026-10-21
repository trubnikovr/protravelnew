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

The screen contains only the section header and the news feed. It does not use
a promotional illustration or introductory marketing copy.

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

Shared: `ScreenHeader`.
