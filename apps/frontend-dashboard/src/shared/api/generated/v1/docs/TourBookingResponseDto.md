# TourBookingResponseDto

## Properties

| Name             | Type                                                                             |
| ---------------- | -------------------------------------------------------------------------------- |
| `id`             | string                                                                           |
| `createdAt`      | Date                                                                             |
| `updatedAt`      | Date                                                                             |
| `bookingNumber`  | string                                                                           |
| `customerId`     | string                                                                           |
| `customerName`   | string                                                                           |
| `customerPhone`  | string                                                                           |
| `customerEmail`  | string                                                                           |
| `tourId`         | string                                                                           |
| `tourTitle`      | string                                                                           |
| `status`         | string                                                                           |
| `travelersCount` | number                                                                           |
| `departureDate`  | Date                                                                             |
| `totalPrice`     | [MoneyResponseDto](MoneyResponseDto.md)                                          |
| `notes`          | string                                                                           |
| `paidAt`         | Date                                                                             |
| `documents`      | [Array&lt;TourBookingDocumentResponseDto&gt;](TourBookingDocumentResponseDto.md) |
| `travelers`      | [Array&lt;TourBookingTravelerResponseDto&gt;](TourBookingTravelerResponseDto.md) |

## Example

```typescript
import type { TourBookingResponseDto } from "";

// TODO: Update the object below with actual values
const example = {
  id: null,
  createdAt: null,
  updatedAt: null,
  bookingNumber: null,
  customerId: null,
  customerName: null,
  customerPhone: null,
  customerEmail: null,
  tourId: null,
  tourTitle: null,
  status: null,
  travelersCount: null,
  departureDate: null,
  totalPrice: null,
  notes: null,
  paidAt: null,
  documents: null,
  travelers: null,
} satisfies TourBookingResponseDto;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TourBookingResponseDto;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
