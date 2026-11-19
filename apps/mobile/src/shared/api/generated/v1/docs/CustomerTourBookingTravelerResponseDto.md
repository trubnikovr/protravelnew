
# CustomerTourBookingTravelerResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`travelerId` | string
`firstName` | string
`lastName` | string
`middleName` | string
`gender` | string
`birthDate` | Date
`citizenshipCountryCode` | string

## Example

```typescript
import type { CustomerTourBookingTravelerResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "travelerId": null,
  "firstName": null,
  "lastName": null,
  "middleName": null,
  "gender": null,
  "birthDate": null,
  "citizenshipCountryCode": null,
} satisfies CustomerTourBookingTravelerResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CustomerTourBookingTravelerResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


