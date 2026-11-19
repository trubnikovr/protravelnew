
# AdminResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`createdAt` | Date
`updatedAt` | Date
`email` | string
`login` | string
`firstName` | string
`lastName` | string
`role` | string
`isSuperAdmin` | boolean
`permissions` | Array&lt;string&gt;
`status` | string

## Example

```typescript
import type { AdminResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "createdAt": null,
  "updatedAt": null,
  "email": null,
  "login": admin,
  "firstName": null,
  "lastName": null,
  "role": null,
  "isSuperAdmin": null,
  "permissions": null,
  "status": null,
} satisfies AdminResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdminResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


