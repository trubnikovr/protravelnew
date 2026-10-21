# Profile

## Source

PDF pages 42 and 54–64.

## Routes

- Bottom tab: `Profile`.
- Profile stack: `ProfileOverview`.
- Profile stack: `EditProfile`.
- Profile stack: `Settings`.
- Profile stack: `Travelers`.
- Profile stack: `AddTraveler`.
- Profile stack: `Bookings`.

For a guest, the Profile tab renders the customer authorization stack instead
of profile routes. A successful phone/SMS login replaces it with
`ProfileOverview`; logout returns the same tab to phone login.

## Implemented

- profile overview with a generated initial badge and contact details;
- edit account details;
- currency and time-zone settings;
- personal travellers list;
- add-traveller form with document and contact data;
- bookings shortcut;
- logout action.

## Actions

- Profile menu items open their typed root-stack screens.
- “Бронирования” opens `Bookings` inside the authenticated Profile stack.
- “Добавить человека” opens `AddTraveler`.
- Save actions persist through the backend and return to the previous screen.
- First name and last name are required when the customer saves profile data.
- Customer photo uploads are not used. The badge displays the first letter of
  the first name or the last two phone digits while the name is not filled in.

All form colors, typography and controls must reuse the shared theme and UI
before introducing profile-specific components.

## UI

Shared: `ScreenHeader`, `PrimaryButton`, `AppTextField`.

Feature-owned: `TravelerCard`.
