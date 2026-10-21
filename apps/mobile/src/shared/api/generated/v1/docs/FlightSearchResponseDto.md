
# FlightSearchResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`createdAt` | Date
`updatedAt` | Date
`status` | string
`progress` | number
`expiresAt` | Date
`nextPollAfterMs` | number
`errorCode` | object

## Example

```typescript
import type { FlightSearchResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "createdAt": null,
  "updatedAt": null,
  "status": null,
  "progress": null,
  "expiresAt": null,
  "nextPollAfterMs": 1000,
  "errorCode": null,
} satisfies FlightSearchResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as FlightSearchResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


