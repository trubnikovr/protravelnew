# TourProgramDayResponseDto

## Properties

| Name          | Type   |
| ------------- | ------ |
| `id`          | string |
| `dayNumber`   | number |
| `title`       | string |
| `description` | string |

## Example

```typescript
import type { TourProgramDayResponseDto } from "";

// TODO: Update the object below with actual values
const example = {
  id: null,
  dayNumber: null,
  title: null,
  description: null,
} satisfies TourProgramDayResponseDto;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TourProgramDayResponseDto;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
