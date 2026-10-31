
# PaginationMetaResponseDto


## Properties

Name | Type
------------ | -------------
`page` | number
`limit` | number
`total` | number
`totalPages` | number

## Example

```typescrip
import type { PaginationMetaResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "page": 1,
  "limit": 20,
  "total": 125,
  "totalPages": 7,
} satisfies PaginationMetaResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an objec
const exampleParsed = JSON.parse(exampleJSON) as PaginationMetaResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


