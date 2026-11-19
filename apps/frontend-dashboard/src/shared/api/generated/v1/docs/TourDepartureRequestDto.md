
# TourDepartureRequestDto


## Properties

Name | Type
------------ | -------------
`departureDate` | Date
`returnDate` | Date
`departureCityId` | string
`departureAirportId` | string
`arrivalAirportId` | string
`price` | [MoneyRequestDto](MoneyRequestDto.md)
`seatsTotal` | number
`seatsAvailable` | number

## Example

```typescript
import type { TourDepartureRequestDto } from ''

// TODO: Update the object below with actual values
const example = {
  "departureDate": null,
  "returnDate": null,
  "departureCityId": null,
  "departureAirportId": null,
  "arrivalAirportId": null,
  "price": null,
  "seatsTotal": null,
  "seatsAvailable": null,
} satisfies TourDepartureRequestDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TourDepartureRequestDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


