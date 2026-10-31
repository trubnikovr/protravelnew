
# FlightOfferResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`createdAt` | Date
`updatedAt` | Date
`baggageLabel` | string
`provider` | string
`validatingCarrierCode` | string
`validatingCarrierName` | string
`itineraries` | [Array&lt;FlightItineraryResponseDto&gt;](FlightItineraryResponseDto.md)
`totalAmount` | string
`currency` | string
`electronicTicket` | boolean
`requiresLatinNames` | boolean
`expiresAt` | Date

## Example

```typescrip
import type { FlightOfferResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "createdAt": null,
  "updatedAt": null,
  "baggageLabel": до 20 кг · 1 место багажа,
  "provider": null,
  "validatingCarrierCode": null,
  "validatingCarrierName": null,
  "itineraries": null,
  "totalAmount": 2500000,
  "currency": null,
  "electronicTicket": null,
  "requiresLatinNames": null,
  "expiresAt": null,
} satisfies FlightOfferResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an objec
const exampleParsed = JSON.parse(exampleJSON) as FlightOfferResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


