
# FlightRouteRequestDto


## Properties

Name | Type
------------ | -------------
`origin` | string
`destination` | string
`originAirports` | Array&lt;string&gt;
`destinationAirports` | Array&lt;string&gt;
`departureDate` | Date

## Example

```typescrip
import type { FlightRouteRequestDto } from ''

// TODO: Update the object below with actual values
const example = {
  "origin": MOW,
  "destination": IST,
  "originAirports": ["SVO","DME","VKO"],
  "destinationAirports": ["IST","SAW"],
  "departureDate": Tue Sep 15 05:00:00 GMT+05:00 2026,
} satisfies FlightRouteRequestDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an objec
const exampleParsed = JSON.parse(exampleJSON) as FlightRouteRequestDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


