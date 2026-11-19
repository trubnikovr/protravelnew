
# FlightPriceFilterResponseDto


## Properties

Name | Type
------------ | -------------
`min` | string
`max` | string
`minFormatted` | string
`maxFormatted` | string

## Example

```typescript
import type { FlightPriceFilterResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "min": 1200000,
  "max": 6800000,
  "minFormatted": 12 000 руб.,
  "maxFormatted": 68 000 руб.,
} satisfies FlightPriceFilterResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as FlightPriceFilterResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


