
# FlightsSearch200ResponseMeta


## Properties

Name | Type
------------ | -------------
`timestamp` | Date
`path` | string
`statusCode` | number
`requestId` | string
`traceId` | string
`filters` | [FlightSearchFiltersResponseDto](FlightSearchFiltersResponseDto.md)
`highlights` | [Array&lt;FlightHighlightResponseDto&gt;](FlightHighlightResponseDto.md)
`pagination` | [PaginationMetaResponseDto](PaginationMetaResponseDto.md)

## Example

```typescrip
import type { FlightsSearch200ResponseMeta } from ''

// TODO: Update the object below with actual values
const example = {
  "timestamp": null,
  "path": null,
  "statusCode": null,
  "requestId": null,
  "traceId": null,
  "filters": null,
  "highlights": null,
  "pagination": null,
} satisfies FlightsSearch200ResponseMeta

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an objec
const exampleParsed = JSON.parse(exampleJSON) as FlightsSearch200ResponseMeta
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


