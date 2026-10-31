# AdminAuthResponseDto

## Properties

| Name          | Type                                    |
| ------------- | --------------------------------------- |
| `accessToken` | string                                  |
| `tokenType`   | string                                  |
| `expiresIn`   | number                                  |
| `admin`       | [AdminResponseDto](AdminResponseDto.md) |

## Example

```typescript
import type { AdminAuthResponseDto } from "";

// TODO: Update the object below with actual values
const example = {
  accessToken: null,
  tokenType: Bearer,
  expiresIn: 900,
  admin: null,
} satisfies AdminAuthResponseDto;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdminAuthResponseDto;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
