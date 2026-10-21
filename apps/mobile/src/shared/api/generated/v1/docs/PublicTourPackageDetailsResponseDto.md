
# PublicTourPackageDetailsResponseDto


## Properties

Name | Type
------------ | -------------
`hotelName` | string
`hotelCategory` | number
`mealType` | string
`transferIncluded` | boolean
`insuranceIncluded` | boolean

## Example

```typescript
import type { PublicTourPackageDetailsResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "hotelName": null,
  "hotelCategory": null,
  "mealType": null,
  "transferIncluded": null,
  "insuranceIncluded": null,
} satisfies PublicTourPackageDetailsResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PublicTourPackageDetailsResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


