# Popular flight locations

The `/featured-flight-locations` admin page manages the ordered popular cities and destinations shown
in the mobile flight selector before a search query is entered. Content readers
can view the list; content writers can add, remove, reorder, activate and
deactivate up to 30 three-letter IATA or metropolitan location codes.

Saving replaces the list atomically through
`PUT /api/v1/admin/featured-flight-locations`. Inactive rows remain visible in
admin but are excluded from the public mobile endpoint.
