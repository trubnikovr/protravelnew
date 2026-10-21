
# PublicTourDestinationResponseDto


## Properties

Name | Type
------------ | -------------
`position` | number
`countryCode` | string
`countryName` | string
`cityName` | string
`nights` | number

## Example

```typescript
import type { PublicTourDestinationResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "position": null,
  "countryCode": null,
  "countryName": null,
  "cityName": null,
  "nights": null,
} satisfies PublicTourDestinationResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PublicTourDestinationResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


