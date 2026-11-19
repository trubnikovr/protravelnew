# Tour booking management

The dashboard exposes tour bookings under `/tour-bookings` and an individual
booking under `/tour-bookings/:bookingId`.

The list supports server-side search by booking number, customer, email, or
tour and filtering by status. An administrator can create a booking for an
active customer and a published tour, optionally choosing one of its listed
departure dates. The backend calculates and stores the total price snapshot
using the departure/base price and selected traveler count.

The booking card shows customer contact details, tour, departure date,
traveler count, total, payment timestamp, notes, and the current status.
Customer-created bookings additionally show immutable traveler snapshots with
name, birth date and citizenship. Only valid next statuses are offered by the
interface; the backend remains the authoritative validator.
When fewer traveler snapshots are supplied than the booked count, the detail
page shows how many travelers still need details and prompts manager follow-up.
Managers can add missing travelers and edit names, gender, birth date and
citizenship directly in the booking. Edits affect the booking snapshot only.

The documents panel uploads PDF, image, Word, and Excel files up to 25 MB.
Downloads use the generated authenticated API client rather than public file
links. Administrators can download or delete every attached document.
