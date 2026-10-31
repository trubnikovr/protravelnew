# Travel facts management

The `/travel-facts` page is available to administrators with `content.read`.
It lists the fact text, scope, tags and publication status.

Administrators with `content.write` can create, edit, publish, unpublish and
delete facts. A fact can target an ISO country code, a more specific IATA
airport code, or all destinations when both fields are empty. Tags are entered
as a comma-separated list and are normalized by the backend.
