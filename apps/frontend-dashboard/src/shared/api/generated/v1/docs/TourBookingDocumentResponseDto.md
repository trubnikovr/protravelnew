
# TourBookingDocumentResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`createdAt` | Date
`updatedAt` | Date
`originalName` | string
`mimeType` | string
`size` | number
`uploadedByAdminId` | string
`downloadUrl` | string

## Example

```typescript
import type { TourBookingDocumentResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "createdAt": null,
  "updatedAt": null,
  "originalName": null,
  "mimeType": null,
  "size": null,
  "uploadedByAdminId": null,
  "downloadUrl": null,
} satisfies TourBookingDocumentResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TourBookingDocumentResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


