# CustomerResponseDto

## Properties

| Name        | Type   |
| ----------- | ------ |
| `id`        | string |
| `createdAt` | Date   |
| `updatedAt` | Date   |
| `phone`     | string |
| `email`     | string |
| `firstName` | string |
| `lastName`  | string |
| `locale`    | string |
| `currency`  | string |
| `timeZone`  | string |
| `status`    | string |

## Example

```typescript
import type { CustomerResponseDto } from "";

// TODO: Update the object below with actual values
const example = {
  id: null,
  createdAt: null,
  updatedAt: null,
  phone: null,
  email: null,
  firstName: null,
  lastName: null,
  locale: null,
  currency: null,
  timeZone: Europe / Moscow,
  status: null,
} satisfies CustomerResponseDto;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CustomerResponseDto;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
