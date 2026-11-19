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
- Profile stack: `TravelerDetails`.
- Profile stack: `Bookings`.
- Profile stack: `FlightBookings`.

For a guest, the Profile tab renders the customer authorization stack instead
of profile routes. A successful phone/SMS login replaces it with
`ProfileOverview`; logout returns the same tab to phone login.

## Implemented

- profile overview with contact details and account menu;
- overview has no screen header, avatar badge or displayed customer name;
- edit account details without a circular avatar; the form is vertically centered;
- currency and time-zone settings;
- personal travelers list with add, edit and delete actions;
- traveler details with encrypted passport/document data management;
- add-traveller form with document and contact data; citizenship is selected from the country reference and saved as its ISO alpha-2 code;
- separate shortcuts to flight orders and tour bookings;
- logout action.

The overview contact details, account menu beginning with “Изменить данные”
and logout action are grouped vertically in the center of the available screen
above the bottom navigation. Content remains scrollable on smaller screens.

The Profile tab uses a light airport travel illustration behind both the guest
phone-login card and the authenticated profile overview, matching the Flights
screen art direction. The phone-login screen keeps request and validation logic
in its screen component while `PhoneLoginView` owns the layout. The form sits
in a centered surface card so its description, field, action and terms share
the same alignment. Profile forms, travellers and bookings retain their
standard backgrounds.

## Actions

- Profile menu items open their typed root-stack screens.
- “Авиабилеты” opens `FlightBookings`; “Брони туров” opens `Bookings` inside
  the authenticated Profile stack.
- “Персональные данные” opens the traveler list. Each traveler can be edited,
  removed, and given encrypted document records.
- “Добавить человека” opens `AddTraveler`.
- Save actions persist through the backend and return to the previous screen.
- First name and last name are required when the customer saves profile data.
- Customer photo uploads are not used. The overview shows phone and email
  without an avatar or customer name. Names remain editable in account details.

All form colors, typography and controls must reuse the shared theme and UI
before introducing profile-specific components.

## UI

Shared: `ScreenHeader`, `PrimaryButton`, `AppTextField`.

Feature-owned: `TravelerCard`.

In development (`__DEV__`), AddTraveler starts with editable sample data
from `features/profile/data/traveler.mock.json`, including when opened from
tour booking. Production keeps the empty form and default UZ citizenship.
Prefilling does not save anything until the user submits the form.

API failures use the shared [error-message catalog](../api-errors.md) in the
existing error UI, preserving backend machine codes for specific guidance.
