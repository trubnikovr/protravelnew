
# TravelFactResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`createdAt` | Date
`updatedAt` | Date
`text` | string
`countryCode` | string
`destinationCode` | string
`tags` | Array&lt;string&gt;

## Example

```typescrip
import type { TravelFactResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "createdAt": null,
  "updatedAt": null,
  "text": В Японии чаевые обычно не приняты.,
  "countryCode": JP,
  "destinationCode": NRT,
  "tags": ["культура","этикет"],
} satisfies TravelFactResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an objec
const exampleParsed = JSON.parse(exampleJSON) as TravelFactResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


