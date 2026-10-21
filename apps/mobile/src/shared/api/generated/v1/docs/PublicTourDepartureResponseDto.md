
# PublicTourDepartureResponseDto


## Properties

Name | Type
------------ | -------------
`departureDate` | Date
`returnDate` | Date
`price` | [MoneyResponseDto](MoneyResponseDto.md)
`seatsTotal` | number
`seatsAvailable` | number

## Example

```typescript
import type { PublicTourDepartureResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "departureDate": null,
  "returnDate": null,
  "price": null,
  "seatsTotal": null,
  "seatsAvailable": null,
} satisfies PublicTourDepartureResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PublicTourDepartureResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


