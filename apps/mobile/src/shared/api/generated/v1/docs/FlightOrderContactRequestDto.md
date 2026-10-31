
# FlightOrderContactRequestDto


## Properties

Name | Type
------------ | -------------
`name` | string
`email` | string
`countryCode` | string
`areaCode` | string
`phone` | string

## Example

```typescrip
import type { FlightOrderContactRequestDto } from ''

// TODO: Update the object below with actual values
const example = {
  "name": null,
  "email": null,
  "countryCode": 998,
  "areaCode": 90,
  "phone": 1234567,
} satisfies FlightOrderContactRequestDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an objec
const exampleParsed = JSON.parse(exampleJSON) as FlightOrderContactRequestDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


