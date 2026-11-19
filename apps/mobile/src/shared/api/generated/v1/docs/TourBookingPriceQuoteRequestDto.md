
# TourBookingPriceQuoteRequestDto


## Properties

Name | Type
------------ | -------------
`tourId` | string
`travelersCount` | number
`departureDate` | Date

## Example

```typescript
import type { TourBookingPriceQuoteRequestDto } from ''

// TODO: Update the object below with actual values
const example = {
  "tourId": null,
  "travelersCount": null,
  "departureDate": null,
} satisfies TourBookingPriceQuoteRequestDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TourBookingPriceQuoteRequestDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


