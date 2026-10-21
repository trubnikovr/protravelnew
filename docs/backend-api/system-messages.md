# Mobile system messages

System messages are short operational banners controlled by the backend.
They are independent from user news and notifications.

## Contract

`GET /api/v1/system-messages` is public and returns active messages ordered by
the most recently updated first. Supported types are:

- `info` — informational purple banner;
- `error` — service problem or outage shown as a red banner.

Inactive messages are never returned to mobile clients. The mobile cache is
fresh for 30 seconds and refreshes when Home receives navigation focus or the
application returns to the foreground.

## Administration

Authenticated administrators manage records through:

- `GET /api/v1/admin/system-messages` — all records;
- `POST /api/v1/admin/system-messages` — create;
- `PATCH /api/v1/admin/system-messages/:id` — edit or activate/deactivate;
- `DELETE /api/v1/admin/system-messages/:id` — delete.

Read and write operations require `content.read` and `content.write`
respectively. Message text is limited to 500 characters.

The demo seed creates one active `info` record. Change its type to `error` to
verify the red mobile variant.
