
# CreateTravelerDocumentRequestDto


## Properties

Name | Type
------------ | -------------
`type` | string
`number` | string
`issuingCountryCode` | string
`issuedAt` | Date
`expiresAt` | Date
`firstNameLatin` | string
`lastNameLatin` | string
`fileId` | string

## Example

```typescrip
import type { CreateTravelerDocumentRequestDto } from ''

// TODO: Update the object below with actual values
const example = {
  "type": null,
  "number": AA1234567,
  "issuingCountryCode": UZ,
  "issuedAt": null,
  "expiresAt": null,
  "firstNameLatin": null,
  "lastNameLatin": null,
  "fileId": null,
} satisfies CreateTravelerDocumentRequestDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an objec
const exampleParsed = JSON.parse(exampleJSON) as CreateTravelerDocumentRequestDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


