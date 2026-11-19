
# FlightSearchMetaResponseDto


## Properties

Name | Type
------------ | -------------
`filters` | [FlightSearchFiltersResponseDto](FlightSearchFiltersResponseDto.md)
`highlights` | [Array&lt;FlightHighlightResponseDto&gt;](FlightHighlightResponseDto.md)

## Example

```typescript
import type { FlightSearchMetaResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "filters": null,
  "highlights": null,
} satisfies FlightSearchMetaResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as FlightSearchMetaResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


