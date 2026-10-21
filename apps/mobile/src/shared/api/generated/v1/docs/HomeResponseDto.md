
# HomeResponseDto


## Properties

Name | Type
------------ | -------------
`recommended` | [Array&lt;HomeTourResponseDto&gt;](HomeTourResponseDto.md)
`popularDestinations` | [Array&lt;HomeDestinationResponseDto&gt;](HomeDestinationResponseDto.md)
`hotTours` | [Array&lt;HomeTourResponseDto&gt;](HomeTourResponseDto.md)

## Example

```typescript
import type { HomeResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "recommended": null,
  "popularDestinations": null,
  "hotTours": null,
} satisfies HomeResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as HomeResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


