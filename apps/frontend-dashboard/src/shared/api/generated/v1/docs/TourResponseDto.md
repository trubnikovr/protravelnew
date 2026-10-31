# TourResponseDto

## Properties

| Name               | Type                                                                     |
| ------------------ | ------------------------------------------------------------------------ |
| `id`               | string                                                                   |
| `createdAt`        | Date                                                                     |
| `updatedAt`        | Date                                                                     |
| `slug`             | string                                                                   |
| `status`           | string                                                                   |
| `type`             | string                                                                   |
| `durationDays`     | number                                                                   |
| `durationNights`   | number                                                                   |
| `price`            | [MoneyResponseDto](MoneyResponseDto.md)                                  |
| `destinations`     | [Array&lt;TourDestinationResponseDto&gt;](TourDestinationResponseDto.md) |
| `departures`       | [Array&lt;TourDepartureResponseDto&gt;](TourDepartureResponseDto.md)     |
| `packageDetails`   | [TourPackageDetailsResponseDto](TourPackageDetailsResponseDto.md)        |
| `excursionDetails` | [TourExcursionDetailsResponseDto](TourExcursionDetailsResponseDto.md)    |
| `programDays`      | [Array&lt;TourProgramDayResponseDto&gt;](TourProgramDayResponseDto.md)   |
| `coverImage`       | [ImageResponseDto](ImageResponseDto.md)                                  |
| `galleryImages`    | [Array&lt;ImageResponseDto&gt;](ImageResponseDto.md)                     |
| `activeFrom`       | Date                                                                     |
| `activeTo`         | Date                                                                     |
| `isFeatured`       | boolean                                                                  |
| `sortOrder`        | number                                                                   |
| `content`          | [TourContentResponseDto](TourContentResponseDto.md)                      |
| `publishedAt`      | Date                                                                     |

## Example

```typescript
import type { TourResponseDto } from "";

// TODO: Update the object below with actual values
const example = {
  id: null,
  createdAt: null,
  updatedAt: null,
  slug: null,
  status: null,
  type: null,
  durationDays: null,
  durationNights: null,
  price: null,
  destinations: null,
  departures: null,
  packageDetails: null,
  excursionDetails: null,
  programDays: null,
  coverImage: null,
  galleryImages: null,
  activeFrom: null,
  activeTo: null,
  isFeatured: null,
  sortOrder: null,
  content: null,
  publishedAt: null,
} satisfies TourResponseDto;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TourResponseDto;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
