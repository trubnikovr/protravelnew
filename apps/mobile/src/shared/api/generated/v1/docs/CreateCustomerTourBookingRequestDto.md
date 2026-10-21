
# CreateCustomerTourBookingRequestDto


## Properties

Name | Type
------------ | -------------
`tourId` | string
`travelerIds` | Array&lt;string&gt;
`departureDate` | Date
`notes` | string

## Example

```typescript
import type { CreateCustomerTourBookingRequestDto } from ''

// TODO: Update the object below with actual values
const example = {
  "tourId": null,
  "travelerIds": null,
  "departureDate": null,
  "notes": null,
} satisfies CreateCustomerTourBookingRequestDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateCustomerTourBookingRequestDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


