
# HomeTourResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`title` | string
`location` | string
`duration` | string
`price` | [MoneyResponseDto](MoneyResponseDto.md)
`imageUrl` | object

## Example

```typescript
import type { HomeTourResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "title": null,
  "location": null,
  "duration": null,
  "price": null,
  "imageUrl": null,
} satisfies HomeTourResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as HomeTourResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


