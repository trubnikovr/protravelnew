
# HealthComponentResponseDto


## Properties

Name | Type
------------ | -------------
`key` | string
`status` | string
`required` | boolean
`weight` | number
`latencyMs` | number
`details` | { [key: string]: any; }

## Example

```typescrip
import type { HealthComponentResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "key": null,
  "status": null,
  "required": null,
  "weight": null,
  "latencyMs": null,
  "details": null,
} satisfies HealthComponentResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an objec
const exampleParsed = JSON.parse(exampleJSON) as HealthComponentResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


