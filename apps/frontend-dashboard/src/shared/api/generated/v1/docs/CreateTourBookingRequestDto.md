
# CreateTourBookingRequestDto


## Properties

Name | Type
------------ | -------------
`customerId` | string
`tourId` | string
`travelersCount` | number
`departureDate` | Date
`notes` | string

## Example

```typescript
import type { CreateTourBookingRequestDto } from ''

// TODO: Update the object below with actual values
const example = {
  "customerId": null,
  "tourId": null,
  "travelersCount": null,
  "departureDate": null,
  "notes": null,
} satisfies CreateTourBookingRequestDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateTourBookingRequestDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


