
# ApiResponseMetaDto


## Properties

Name | Type
------------ | -------------
`timestamp` | Date
`path` | string
`statusCode` | number
`requestId` | string
`traceId` | string

## Example

```typescript
import type { ApiResponseMetaDto } from ''

// TODO: Update the object below with actual values
const example = {
  "timestamp": null,
  "path": null,
  "statusCode": null,
  "requestId": null,
  "traceId": null,
} satisfies ApiResponseMetaDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiResponseMetaDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


