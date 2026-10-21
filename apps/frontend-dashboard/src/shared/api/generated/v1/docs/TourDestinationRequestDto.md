
# TourDestinationRequestDto


## Properties

Name | Type
------------ | -------------
`countryId` | string
`cityId` | string
`arrivalAirportId` | string
`nights` | number

## Example

```typescript
import type { TourDestinationRequestDto } from ''

// TODO: Update the object below with actual values
const example = {
  "countryId": null,
  "cityId": null,
  "arrivalAirportId": null,
  "nights": null,
} satisfies TourDestinationRequestDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TourDestinationRequestDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


