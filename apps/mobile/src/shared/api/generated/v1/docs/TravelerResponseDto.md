
# TravelerResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`createdAt` | Date
`updatedAt` | Date
`customerId` | string
`relationship` | string
`firstName` | string
`lastName` | string
`middleName` | string
`firstNameLatin` | string
`lastNameLatin` | string
`gender` | string
`birthDate` | Date
`citizenshipCountryCode` | string
`phone` | string
`email` | string
`documents` | [Array&lt;TravelerDocumentResponseDto&gt;](TravelerDocumentResponseDto.md)

## Example

```typescrip
import type { TravelerResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "createdAt": null,
  "updatedAt": null,
  "customerId": null,
  "relationship": null,
  "firstName": null,
  "lastName": null,
  "middleName": null,
  "firstNameLatin": null,
  "lastNameLatin": null,
  "gender": null,
  "birthDate": null,
  "citizenshipCountryCode": null,
  "phone": null,
  "email": null,
  "documents": null,
} satisfies TravelerResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an objec
const exampleParsed = JSON.parse(exampleJSON) as TravelerResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


