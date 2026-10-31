
# ReferenceSuggestionResponseDto


## Properties

Name | Type
------------ | -------------
`type` | string
`id` | string
`code` | string
`name` | string
`countryId` | string
`countryCode` | string
`countryName` | string
`cityId` | string
`airportCodes` | Array&lt;string&gt;

## Example

```typescrip
import type { ReferenceSuggestionResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "type": null,
  "id": null,
  "code": null,
  "name": null,
  "countryId": null,
  "countryCode": null,
  "countryName": null,
  "cityId": null,
  "airportCodes": ["SVO","DME","VKO"],
} satisfies ReferenceSuggestionResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an objec
const exampleParsed = JSON.parse(exampleJSON) as ReferenceSuggestionResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


