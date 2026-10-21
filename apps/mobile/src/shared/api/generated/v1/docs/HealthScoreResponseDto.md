
# HealthScoreResponseDto


## Properties

Name | Type
------------ | -------------
`status` | string
`score` | number
`checkedAt` | Date
`uptimeSeconds` | number
`components` | [Array&lt;HealthComponentResponseDto&gt;](HealthComponentResponseDto.md)

## Example

```typescript
import type { HealthScoreResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "status": null,
  "score": 100,
  "checkedAt": null,
  "uptimeSeconds": null,
  "components": null,
} satisfies HealthScoreResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as HealthScoreResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


