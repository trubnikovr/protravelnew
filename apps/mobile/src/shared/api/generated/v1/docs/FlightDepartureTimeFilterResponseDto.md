
# FlightDepartureTimeFilterResponseDto


## Properties

Name | Type
------------ | -------------
`min` | string
`max` | string

## Example

```typescrip
import type { FlightDepartureTimeFilterResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "min": 01:20,
  "max": 23:45,
} satisfies FlightDepartureTimeFilterResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an objec
const exampleParsed = JSON.parse(exampleJSON) as FlightDepartureTimeFilterResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


