
# PublicTourResponseDto


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
`departures` | [Array&lt;PublicTourDepartureResponseDto&gt;](PublicTourDepartureResponseDto.md)
`packageDetails` | [PublicTourPackageDetailsResponseDto](PublicTourPackageDetailsResponseDto.md)
`excursionDetails` | [PublicTourExcursionDetailsResponseDto](PublicTourExcursionDetailsResponseDto.md)
`programDays` | [Array&lt;PublicTourProgramDayResponseDto&gt;](PublicTourProgramDayResponseDto.md)
`galleryImages` | [Array&lt;ImageResponseDto&gt;](ImageResponseDto.md)
`activeFrom` | Date
`activeTo` | Date

## Example

```typescript
import type { PublicTourResponseDto } from ''

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
  "departures": null,
  "packageDetails": null,
  "excursionDetails": null,
  "programDays": null,
  "galleryImages": null,
  "activeFrom": null,
  "activeTo": null,
} satisfies PublicTourResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PublicTourResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


