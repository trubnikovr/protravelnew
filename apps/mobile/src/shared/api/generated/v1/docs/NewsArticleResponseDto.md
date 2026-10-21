
# NewsArticleResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`createdAt` | Date
`updatedAt` | Date
`title` | string
`summary` | string
`content` | string
`category` | string
`publishedAt` | Date
`isRead` | boolean
`readAt` | Date

## Example

```typescript
import type { NewsArticleResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "createdAt": null,
  "updatedAt": null,
  "title": Дешёвые авиабилеты,
  "summary": Цены на выбранное направление снизились.,
  "content": Рассказываем, на какие даты доступны билеты и как оформить поездку.,
  "category": null,
  "publishedAt": null,
  "isRead": null,
  "readAt": null,
} satisfies NewsArticleResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as NewsArticleResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


