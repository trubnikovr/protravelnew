# SystemMessageResponseDto

## Properties

| Name        | Type    |
| ----------- | ------- |
| `id`        | string  |
| `createdAt` | Date    |
| `updatedAt` | Date    |
| `text`      | string  |
| `type`      | string  |
| `isActive`  | boolean |

## Example

```typescript
import type { SystemMessageResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "createdAt": null,
  "updatedAt": null,
  "text": Некоторые функции временно недоступны.,
  "type": null,
  "isActive": null,
} satisfies SystemMessageResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SystemMessageResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
