
# TourDestinationResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`position` | number
`countryId` | string
`countryCode` | string
`countryName` | string
`cityId` | string
`cityName` | string
`arrivalAirportId` | string
`nights` | number

## Example

```typescript
import type { TourDestinationResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "position": null,
  "countryId": null,
  "countryCode": null,
  "countryName": null,
  "cityId": null,
  "cityName": null,
  "arrivalAirportId": null,
  "nights": null,
} satisfies TourDestinationResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TourDestinationResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


