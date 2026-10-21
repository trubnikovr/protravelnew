
# CreateSystemMessageRequestDto


## Properties

Name | Type
------------ | -------------
`text` | string
`type` | string
`isActive` | boolean

## Example

```typescript
import type { CreateSystemMessageRequestDto } from ''

// TODO: Update the object below with actual values
const example = {
  "text": Некоторые функции временно недоступны.,
  "type": null,
  "isActive": null,
} satisfies CreateSystemMessageRequestDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateSystemMessageRequestDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


