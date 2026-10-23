# CreateFlightSearchRequestDto

## Properties

| Name                 | Type                                                                   |
| -------------------- | ---------------------------------------------------------------------- |
| `routes`             | [Array&lt;FlightRouteRequestDto&gt;](FlightRouteRequestDto.md)         |
| `passengers`         | [Array&lt;FlightPassengerRequestDto&gt;](FlightPassengerRequestDto.md) |
| `cabinClass`         | string                                                                 |
| `directOnly`         | boolean                                                                |
| `baggageRequired`    | boolean                                                                |
| `preferredAirlines`  | Array&lt;string&gt;                                                    |
| `departureTimeFrom`  | string                                                                 |
| `departureTimeTo`    | string                                                                 |
| `arrivalTimeFrom`    | string                                                                 |
| `arrivalTimeTo`      | string                                                                 |
| `maxStops`           | number                                                                 |
| `maxDurationMinutes` | number                                                                 |
| `minPrice`           | string                                                                 |
| `maxPrice`           | string                                                                 |
| `sortBy`             | string                                                                 |

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
  "departureTimeFrom": 06:00,
  "departureTimeTo": 12:00,
  "arrivalTimeFrom": 06:00,
  "arrivalTimeTo": 23:00,
  "maxStops": null,
  "maxDurationMinutes": 720,
  "minPrice": 1000000,
  "maxPrice": 5000000,
  "sortBy": null,
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
