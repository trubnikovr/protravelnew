
# AdminTravelFactResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`createdAt` | Date
`updatedAt` | Date
`text` | string
`countryCode` | string
`destinationCode` | string
`tags` | Array&lt;string&gt;
`isPublished` | boolean

## Example

```typescript
import type { AdminTravelFactResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "createdAt": null,
  "updatedAt": null,
  "text": В Японии чаевые обычно не приняты.,
  "countryCode": JP,
  "destinationCode": NRT,
  "tags": ["культура","этикет"],
  "isPublished": null,
} satisfies AdminTravelFactResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdminTravelFactResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


