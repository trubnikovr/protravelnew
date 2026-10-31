
# UpdateCustomerProfileRequestDto


## Properties

Name | Type
------------ | -------------
`firstName` | string
`lastName` | string
`middleName` | string
`email` | string
`locale` | string
`currency` | string
`timeZone` | string

## Example

```typescrip
import type { UpdateCustomerProfileRequestDto } from ''

// TODO: Update the object below with actual values
const example = {
  "firstName": Rustam,
  "lastName": Trubnikov,
  "middleName": Рустамович,
  "email": rustam@example.com,
  "locale": null,
  "currency": null,
  "timeZone": Europe/Moscow,
} satisfies UpdateCustomerProfileRequestDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an objec
const exampleParsed = JSON.parse(exampleJSON) as UpdateCustomerProfileRequestDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


