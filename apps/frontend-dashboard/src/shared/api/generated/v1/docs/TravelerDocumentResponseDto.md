# TravelerDocumentResponseDto

## Properties

| Name                 | Type   |
| -------------------- | ------ |
| `id`                 | string |
| `createdAt`          | Date   |
| `updatedAt`          | Date   |
| `type`               | string |
| `maskedNumber`       | string |
| `issuingCountryCode` | string |
| `issuedAt`           | Date   |
| `expiresAt`          | Date   |
| `firstNameLatin`     | string |
| `lastNameLatin`      | string |
| `fileId`             | string |

## Example

```typescript
import type { TravelerDocumentResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "createdAt": null,
  "updatedAt": null,
  "type": null,
  "maskedNumber": •••• 4567,
  "issuingCountryCode": null,
  "issuedAt": null,
  "expiresAt": null,
  "firstNameLatin": null,
  "lastNameLatin": null,
  "fileId": null,
} satisfies TravelerDocumentResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TravelerDocumentResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
