# TourContentRequestDto

## Properties

| Name               | Type                |
| ------------------ | ------------------- |
| `title`            | string              |
| `shortDescription` | string              |
| `description`      | string              |
| `inclusions`       | Array&lt;string&gt; |
| `exclusions`       | Array&lt;string&gt; |

## Example

```typescript
import type { TourContentRequestDto } from "";

// TODO: Update the object below with actual values
const example = {
  title: null,
  shortDescription: null,
  description: null,
  inclusions: null,
  exclusions: null,
} satisfies TourContentRequestDto;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TourContentRequestDto;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
