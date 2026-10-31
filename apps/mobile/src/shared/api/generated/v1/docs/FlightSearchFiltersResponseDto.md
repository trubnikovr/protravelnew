
# FlightSearchFiltersResponseDto


## Properties

Name | Type
------------ | -------------
`price` | [FlightPriceFilterResponseDto](FlightPriceFilterResponseDto.md)
`stops` | [Array&lt;FlightStopsFilterOptionResponseDto&gt;](FlightStopsFilterOptionResponseDto.md)
`airlines` | [Array&lt;FlightAirlineFilterOptionResponseDto&gt;](FlightAirlineFilterOptionResponseDto.md)
`baggage` | [FlightBaggageFilterResponseDto](FlightBaggageFilterResponseDto.md)
`duration` | [FlightDurationFilterResponseDto](FlightDurationFilterResponseDto.md)
`departureTime` | [FlightDepartureTimeFilterResponseDto](FlightDepartureTimeFilterResponseDto.md)

## Example

```typescrip
import type { FlightSearchFiltersResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "price": null,
  "stops": null,
  "airlines": null,
  "baggage": null,
  "duration": null,
  "departureTime": null,
} satisfies FlightSearchFiltersResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an objec
const exampleParsed = JSON.parse(exampleJSON) as FlightSearchFiltersResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


