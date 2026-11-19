
# FeaturedFlightLocationResponseDto


## Properties

Name | Type
------------ | -------------
`cityId` | string
`name` | string
`countryName` | string
`airportCodes` | Array&lt;string&gt;
`sortOrder` | number
`isActive` | boolean

## Example

```typescript
import type { FeaturedFlightLocationResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "cityId": null,
  "name": Ташкент,
  "countryName": Узбекистан,
  "airportCodes": ["TAS","UGC"],
  "sortOrder": null,
  "isActive": null,
} satisfies FeaturedFlightLocationResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as FeaturedFlightLocationResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


