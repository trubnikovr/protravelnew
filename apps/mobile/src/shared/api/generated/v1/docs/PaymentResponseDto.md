
# PaymentResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`createdAt` | Date
`updatedAt` | Date
`payableType` | string
`payableId` | string
`status` | string
`amount` | [MoneyResponseDto](MoneyResponseDto.md)
`provider` | string
`paymentUrl` | string
`paymentMethod` | string
`expiresAt` | Date
`paidAt` | Date

## Example

```typescrip
import type { PaymentResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "createdAt": null,
  "updatedAt": null,
  "payableType": null,
  "payableId": null,
  "status": null,
  "amount": null,
  "provider": raiffeisen,
  "paymentUrl": null,
  "paymentMethod": null,
  "expiresAt": null,
  "paidAt": null,
} satisfies PaymentResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an objec
const exampleParsed = JSON.parse(exampleJSON) as PaymentResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


