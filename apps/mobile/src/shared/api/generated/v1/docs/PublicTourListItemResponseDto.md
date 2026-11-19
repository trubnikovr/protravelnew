
# PublicTourListItemResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`slug` | string
`type` | string
`minTravelers` | number
`maxTravelers` | number
`durationDays` | number
`durationNights` | number
`price` | [MoneyResponseDto](MoneyResponseDto.md)
`destinations` | [Array&lt;PublicTourDestinationResponseDto&gt;](PublicTourDestinationResponseDto.md)
`coverImage` | [ImageResponseDto](ImageResponseDto.md)
`isFeatured` | boolean
`content` | [PublicTourContentResponseDto](PublicTourContentResponseDto.md)

## Example

```typescript
import type { PublicTourListItemResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "slug": null,
  "type": null,
  "minTravelers": null,
  "maxTravelers": null,
  "durationDays": null,
  "durationNights": null,
  "price": null,
  "destinations": null,
  "coverImage": null,
  "isFeatured": null,
  "content": null,
} satisfies PublicTourListItemResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PublicTourListItemResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


