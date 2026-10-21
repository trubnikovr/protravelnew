
# FlightItineraryResponseDto


## Properties

Name | Type
------------ | -------------
`durationMinutes` | number
`segments` | [Array&lt;FlightSegmentResponseDto&gt;](FlightSegmentResponseDto.md)

## Example

```typescript
import type { FlightItineraryResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "durationMinutes": null,
  "segments": null,
} satisfies FlightItineraryResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as FlightItineraryResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


