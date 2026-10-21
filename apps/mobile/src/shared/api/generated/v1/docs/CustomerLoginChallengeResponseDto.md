
# CustomerLoginChallengeResponseDto


## Properties

Name | Type
------------ | -------------
`verificationId` | string
`expiresIn` | number
`developmentCode` | string

## Example

```typescript
import type { CustomerLoginChallengeResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "verificationId": null,
  "expiresIn": 300,
  "developmentCode": 4322,
} satisfies CustomerLoginChallengeResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CustomerLoginChallengeResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


