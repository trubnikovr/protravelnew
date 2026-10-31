# CreateAdminNewsRequestDto

## Properties

| Name          | Type    |
| ------------- | ------- |
| `title`       | string  |
| `summary`     | string  |
| `content`     | string  |
| `category`    | string  |
| `isPublished` | boolean |

## Example

```typescript
import type { CreateAdminNewsRequestDto } from ''

// TODO: Update the object below with actual values
const example = {
  "title": Изменение расписания рейсов,
  "summary": Проверьте актуальное время вылета перед поездкой.,
  "content": Рассказываем, на какие даты доступны билеты и как оформить поездку.,
  "category": null,
  "isPublished": null,
} satisfies CreateAdminNewsRequestDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateAdminNewsRequestDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
