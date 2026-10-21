
# CreateFlightSearchRequestDto


## Properties

Name | Type
------------ | -------------
`routes` | [Array&lt;FlightRouteRequestDto&gt;](FlightRouteRequestDto.md)
`passengers` | [Array&lt;FlightPassengerRequestDto&gt;](FlightPassengerRequestDto.md)
`cabinClass` | string
`directOnly` | boolean
`baggageRequired` | boolean
`preferredAirlines` | Array&lt;string&gt;

## Example

```typescript
import type { CreateFlightSearchRequestDto } from ''

// TODO: Update the object below with actual values
const example = {
  "routes": null,
  "passengers": null,
  "cabinClass": null,
  "directOnly": null,
  "baggageRequired": null,
  "preferredAirlines": ["HY"],
} satisfies CreateFlightSearchRequestDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateFlightSearchRequestDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


