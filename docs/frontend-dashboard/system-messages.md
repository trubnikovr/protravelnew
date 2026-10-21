# System messages

## Route and permissions

The dashboard route is `/system-messages`. It is visible with `content.read`;
creating, editing, activating, deactivating and deleting messages requires
`content.write`.

## Behavior

The table displays active and inactive operational messages from
`GET /api/v1/admin/system-messages`. Administrators choose an `info` or `error`
variant and may publish immediately or keep the record inactive. Active records
appear on the mobile Home screen through the public system-messages endpoint.
