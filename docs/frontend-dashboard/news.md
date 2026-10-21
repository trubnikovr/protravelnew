# News management

## Route and permissions

The dashboard route is `/news`. It is visible to administrators with
`content.read`; creating, editing, publishing, unpublishing and deleting
articles requires `content.write`.

## Behavior

The table loads all records from `GET /api/v1/admin/news`, including drafts.
The form owns the Russian title, short summary (up to 300 characters), full
article content (up to 20,000 characters), `general`/`promotion`/`security`
category and publication state. Publishing makes the article available through
the mobile `GET /api/v1/news` feed; unpublishing hides it without deleting it.

All calls use the generated admin v1 client. The dashboard does not duplicate
backend DTOs.
