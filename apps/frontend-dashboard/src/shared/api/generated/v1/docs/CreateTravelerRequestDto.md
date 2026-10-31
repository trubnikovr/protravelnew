# CreateTravelerRequestDto

## Properties

| Name                     | Type   |
| ------------------------ | ------ |
| `relationship`           | string |
| `firstName`              | string |
| `lastName`               | string |
| `middleName`             | string |
| `firstNameLatin`         | string |
| `lastNameLatin`          | string |
| `gender`                 | string |
| `birthDate`              | Date   |
| `citizenshipCountryCode` | string |
| `phone`                  | string |
| `email`                  | string |

## Example

```typescript
import type { CreateTravelerRequestDto } from "";

// TODO: Update the object below with actual values
const example = {
  relationship: null,
  firstName: null,
  lastName: null,
  middleName: null,
  firstNameLatin: null,
  lastNameLatin: null,
  gender: null,
  birthDate: null,
  citizenshipCountryCode: UZ,
  phone: null,
  email: null,
} satisfies CreateTravelerRequestDto;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateTravelerRequestDto;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
