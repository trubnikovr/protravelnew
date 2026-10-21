
# FlightSegmentResponseDto


## Properties

Name | Type
------------ | -------------
`carrierCode` | string
`carrierName` | string
`flightNumber` | string
`origin` | [FlightLocationResponseDto](FlightLocationResponseDto.md)
`destination` | [FlightLocationResponseDto](FlightLocationResponseDto.md)
`departureLocal` | string
`arrivalLocal` | string
`durationMinutes` | number
`cabinClass` | string
`bookingClass` | object
`baggage` | object

## Example

```typescript
import type { FlightSegmentResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "carrierCode": null,
  "carrierName": null,
  "flightNumber": null,
  "origin": null,
  "destination": null,
  "departureLocal": 2026-09-15T08:00:00,
  "arrivalLocal": 2026-09-15T11:00:00,
  "durationMinutes": null,
  "cabinClass": null,
  "bookingClass": null,
  "baggage": null,
} satisfies FlightSegmentResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as FlightSegmentResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


