# Mobile news

Published news is returned by `GET /api/v1/news`. Each reader is identified by
the existing long-lived HTTP-only cookie, and read state is stored separately
from the article. `GET /api/v1/news/unread-status` returns `hasUnread` and
`unreadCount`; `POST /api/v1/news/:newsId/read` marks one article as read.

## Administration

Authenticated administrators manage the complete feed, including drafts:

- `GET /api/v1/admin/news` — list all articles;
- `POST /api/v1/admin/news` — create a draft or published article;
- `PATCH /api/v1/admin/news/:id` — edit, publish or unpublish;
- `DELETE /api/v1/admin/news/:id` — delete the article and its read records.

Read operations require `content.read`; mutations require `content.write`.
Titles are limited to 180 characters, short feed summaries to 300 characters
and full article content to 20,000 characters. Both mobile and administrative
responses expose `summary` and `content`.

The `content` database column was introduced after the initial news feed. Its
migration copies every existing `summary` into `content`, preserving already
published articles while administrators replace their summaries with shorter
announcements.
