
# CreateFlightOrderRequestDto


## Properties

Name | Type
------------ | -------------
`offerId` | string
`contact` | [FlightOrderContactRequestDto](FlightOrderContactRequestDto.md)
`travelers` | [Array&lt;FlightOrderTravelerRequestDto&gt;](FlightOrderTravelerRequestDto.md)

## Example

```typescript
import type { CreateFlightOrderRequestDto } from ''

// TODO: Update the object below with actual values
const example = {
  "offerId": null,
  "contact": null,
  "travelers": null,
} satisfies CreateFlightOrderRequestDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateFlightOrderRequestDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


