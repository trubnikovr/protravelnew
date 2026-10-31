# AdminNewsArticleResponseDto

## Properties

| Name          | Type    |
| ------------- | ------- |
| `id`          | string  |
| `createdAt`   | Date    |
| `updatedAt`   | Date    |
| `title`       | string  |
| `summary`     | string  |
| `content`     | string  |
| `category`    | string  |
| `isPublished` | boolean |
| `publishedAt` | Date    |

## Example

```typescript
import type { AdminNewsArticleResponseDto } from "";

// TODO: Update the object below with actual values
const example = {
  id: null,
  createdAt: null,
  updatedAt: null,
  title: null,
  summary: null,
  content: null,
  category: null,
  isPublished: null,
  publishedAt: null,
} satisfies AdminNewsArticleResponseDto;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdminNewsArticleResponseDto;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
