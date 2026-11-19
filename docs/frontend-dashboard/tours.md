# Tour management

Creation and editing offer optional minimum and maximum traveler counts per
booking. Empty fields remove the bound; values must be between 1 and 100 and
the minimum must not exceed the maximum.
New tours default to a minimum of one and a maximum of two travelers.

The `/tours` administration module provides paginated catalog CRUD through the
generated Admin OpenAPI client.

List search, status and sorting filters are persisted in browser local storage
and restored when the administrator returns to the module. Pagination is not
persisted. The reset action clears both the visible filters and their stored
values.

## Form behavior

- Tour content is entered in Russian. The form has no language tabs.
- Saving validates the visible Russian fields. Individual fields show an
  inline message and a summary is rendered below the action buttons.
- Required content fields are title, short description and description.
  Common required fields are slug, at least one destination, duration and
  price. Required strings are also rejected as empty by the backend DTO.
- The destination suggest searches normalized countries and cities. An
  administrator may add multiple country/city pairs from different countries;
  selecting a country without a city means the whole country.
- Duplicate country/city pairs are rejected. The backend also verifies that a
  selected city belongs to the selected country.
- When `slug` is empty, leaving the Russian title field generates a
  transliterated slug in JavaScript. A manually entered slug is preserved.
- Changing the number of days suggests `days - 1` nights. Nights remain
  editable for non-standard itineraries.
- Supported currencies are `RUB`, `USD` and `EUR`; amounts use minor units.
- `activeFrom` and `activeTo` define the calendar period in which a published
  tour is active. They do not replace the draft/published/archived status.
- Package tours capture hotel, meal, transfer and insurance details. Excursion
  tours capture guide language, group size and a day-by-day program.

## Images

An administrator uploads one main image and up to 12 additional gallery
images. Accepted formats are JPEG, PNG and WebP, up to 10 MB per file. Uploads
are sent to `POST /api/v1/admin/files/images`; the returned URLs are persisted
in the tour contract. The dashboard never reads local backend filesystem paths.
