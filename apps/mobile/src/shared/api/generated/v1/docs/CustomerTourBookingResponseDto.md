
# CustomerTourBookingResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`createdAt` | Date
`updatedAt` | Date
`bookingNumber` | string
`tourId` | string
`tourTitle` | string
`status` | string
`travelersCount` | number
`departureDate` | Date
`totalPrice` | [MoneyResponseDto](MoneyResponseDto.md)
`notes` | string
`travelers` | [Array&lt;CustomerTourBookingTravelerResponseDto&gt;](CustomerTourBookingTravelerResponseDto.md)

## Example

```typescript
import type { CustomerTourBookingResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "createdAt": null,
  "updatedAt": null,
  "bookingNumber": null,
  "tourId": null,
  "tourTitle": null,
  "status": null,
  "travelersCount": null,
  "departureDate": null,
  "totalPrice": null,
  "notes": null,
  "travelers": null,
} satisfies CustomerTourBookingResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CustomerTourBookingResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


