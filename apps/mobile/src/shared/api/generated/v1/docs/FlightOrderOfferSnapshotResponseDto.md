
# FlightOrderOfferSnapshotResponseDto


## Properties

Name | Type
------------ | -------------
`carrierCode` | string
`carrierName` | string
`itineraries` | Array&lt;{ [key: string]: any; }&gt;
`totalAmount` | string
`currency` | string
`offerExpiresAt` | Date

## Example

```typescrip
import type { FlightOrderOfferSnapshotResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "carrierCode": null,
  "carrierName": null,
  "itineraries": null,
  "totalAmount": null,
  "currency": null,
  "offerExpiresAt": null,
} satisfies FlightOrderOfferSnapshotResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an objec
const exampleParsed = JSON.parse(exampleJSON) as FlightOrderOfferSnapshotResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


