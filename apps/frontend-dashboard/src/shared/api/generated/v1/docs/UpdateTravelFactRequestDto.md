# UpdateTravelFactRequestDto

## Properties

| Name              | Type                |
| ----------------- | ------------------- |
| `text`            | string              |
| `countryCode`     | string              |
| `destinationCode` | string              |
| `tags`            | Array&lt;string&gt; |
| `isPublished`     | boolean             |

## Example

```typescript
import type { UpdateTravelFactRequestDto } from "";

// TODO: Update the object below with actual values
const example = {
  text: null,
  countryCode: VN,
  destinationCode: PQC,
  tags: ["еда", "культура"],
  isPublished: null,
} satisfies UpdateTravelFactRequestDto;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UpdateTravelFactRequestDto;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
