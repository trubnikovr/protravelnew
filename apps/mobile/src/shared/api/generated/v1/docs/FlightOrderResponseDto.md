
# FlightOrderResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`createdAt` | Date
`updatedAt` | Date
`status` | string
`provider` | string
`offer` | [FlightOrderOfferSnapshotResponseDto](FlightOrderOfferSnapshotResponseDto.md)
`recordLocator` | object
`bookingExpiresAt` | object
`providerStatus` | object
`failureCode` | object

## Example

```typescript
import type { FlightOrderResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "createdAt": null,
  "updatedAt": null,
  "status": null,
  "provider": null,
  "offer": null,
  "recordLocator": null,
  "bookingExpiresAt": null,
  "providerStatus": null,
  "failureCode": null,
} satisfies FlightOrderResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as FlightOrderResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


