# CreateTourRequestDto

## Properties

| Name               | Type                                                                   |
| ------------------ | ---------------------------------------------------------------------- |
| `slug`             | string                                                                 |
| `status`           | string                                                                 |
| `type`             | string                                                                 |
| `durationDays`     | number                                                                 |
| `durationNights`   | number                                                                 |
| `price`            | [MoneyRequestDto](MoneyRequestDto.md)                                  |
| `destinations`     | [Array&lt;TourDestinationRequestDto&gt;](TourDestinationRequestDto.md) |
| `departures`       | [Array&lt;TourDepartureRequestDto&gt;](TourDepartureRequestDto.md)     |
| `packageDetails`   | [TourPackageDetailsRequestDto](TourPackageDetailsRequestDto.md)        |
| `excursionDetails` | [TourExcursionDetailsRequestDto](TourExcursionDetailsRequestDto.md)    |
| `programDays`      | [Array&lt;TourProgramDayRequestDto&gt;](TourProgramDayRequestDto.md)   |
| `coverImage`       | [ImageRequestDto](ImageRequestDto.md)                                  |
| `galleryImages`    | [Array&lt;ImageRequestDto&gt;](ImageRequestDto.md)                     |
| `activeFrom`       | Date                                                                   |
| `activeTo`         | Date                                                                   |
| `isFeatured`       | boolean                                                                |
| `sortOrder`        | number                                                                 |
| `content`          | [TourContentRequestDto](TourContentRequestDto.md)                      |

## Example

```typescript
import type { CreateTourRequestDto } from "";

// TODO: Update the object below with actual values
const example = {
  slug: turkey - family - week,
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
} satisfies CreateTourRequestDto;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateTourRequestDto;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
