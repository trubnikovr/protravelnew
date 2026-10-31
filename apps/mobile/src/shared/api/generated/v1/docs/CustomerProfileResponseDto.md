
# CustomerProfileResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`createdAt` | Date
`updatedAt` | Date
`phone` | string
`email` | string
`firstName` | string
`lastName` | string
`middleName` | string
`locale` | string
`currency` | string
`timeZone` | string
`status` | string

## Example

```typescrip
import type { CustomerProfileResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "createdAt": null,
  "updatedAt": null,
  "phone": null,
  "email": null,
  "firstName": null,
  "lastName": null,
  "middleName": null,
  "locale": null,
  "currency": null,
  "timeZone": Asia/Tashkent,
  "status": null,
} satisfies CustomerProfileResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an objec
const exampleParsed = JSON.parse(exampleJSON) as CustomerProfileResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


