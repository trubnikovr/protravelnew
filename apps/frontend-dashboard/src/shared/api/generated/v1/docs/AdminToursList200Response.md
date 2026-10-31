# AdminToursList200Response

## Properties

| Name   | Type                                                                      |
| ------ | ------------------------------------------------------------------------- |
| `data` | [Array&lt;TourResponseDto&gt;](TourResponseDto.md)                        |
| `meta` | [ReferenceCountries200ResponseMeta](ReferenceCountries200ResponseMeta.md) |

## Example

```typescript
import type { AdminToursList200Response } from "";

// TODO: Update the object below with actual values
const example = {
  data: null,
  meta: null,
} satisfies AdminToursList200Response;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdminToursList200Response;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
