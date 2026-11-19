# AdminCustomersTravelersApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**adminCustomerTravelersAddDocument**](AdminCustomersTravelersApi.md#admincustomertravelersadddocument) | **POST** /api/v1/admin/customers/{customerId}/travelers/{travelerId}/documents | Add an encrypted traveler document |
| [**adminCustomerTravelersCreate**](AdminCustomersTravelersApi.md#admincustomertravelerscreate) | **POST** /api/v1/admin/customers/{customerId}/travelers | Add the customer or a related traveler |
| [**adminCustomerTravelersDelete**](AdminCustomersTravelersApi.md#admincustomertravelersdelete) | **DELETE** /api/v1/admin/customers/{customerId}/travelers/{travelerId} | Delete a traveler and their documents |
| [**adminCustomerTravelersDeleteDocument**](AdminCustomersTravelersApi.md#admincustomertravelersdeletedocument) | **DELETE** /api/v1/admin/customers/{customerId}/travelers/{travelerId}/documents/{documentId} | Delete a traveler document |
| [**adminCustomerTravelersList**](AdminCustomersTravelersApi.md#admincustomertravelerslist) | **GET** /api/v1/admin/customers/{customerId}/travelers | List customer and family travelers with masked documents |
| [**adminCustomerTravelersUpdate**](AdminCustomersTravelersApi.md#admincustomertravelersupdate) | **PATCH** /api/v1/admin/customers/{customerId}/travelers/{travelerId} | Update a customer traveler |
| [**adminCustomerTravelersUpdateDocument**](AdminCustomersTravelersApi.md#admincustomertravelersupdatedocument) | **PATCH** /api/v1/admin/customers/{customerId}/travelers/{travelerId}/documents/{documentId} | Update an encrypted traveler document |



## adminCustomerTravelersAddDocument

> AdminCustomerTravelersCreate201Response adminCustomerTravelersAddDocument(customerId, travelerId, createTravelerDocumentRequestDto, acceptLanguage)

Add an encrypted traveler document

### Example

```ts
import {
  Configuration,
  AdminCustomersTravelersApi,
} from '';
import type { AdminCustomerTravelersAddDocumentRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminCustomersTravelersApi(config);

  const body = {
    // string
    customerId: customerId_example,
    // string
    travelerId: travelerId_example,
    // CreateTravelerDocumentRequestDto
    createTravelerDocumentRequestDto: ...,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies AdminCustomerTravelersAddDocumentRequest;

  try {
    const data = await api.adminCustomerTravelersAddDocument(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **customerId** | `string` |  | [Defaults to `undefined`] |
| **travelerId** | `string` |  | [Defaults to `undefined`] |
| **createTravelerDocumentRequestDto** | [CreateTravelerDocumentRequestDto](CreateTravelerDocumentRequestDto.md) |  | |
| **acceptLanguage** | `ru`, `uz`, `en` | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

### Return type

[**AdminCustomerTravelersCreate201Response**](AdminCustomerTravelersCreate201Response.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminCustomerTravelersCreate

> AdminCustomerTravelersCreate201Response adminCustomerTravelersCreate(customerId, createTravelerRequestDto, acceptLanguage)

Add the customer or a related traveler

### Example

```ts
import {
  Configuration,
  AdminCustomersTravelersApi,
} from '';
import type { AdminCustomerTravelersCreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminCustomersTravelersApi(config);

  const body = {
    // string
    customerId: customerId_example,
    // CreateTravelerRequestDto
    createTravelerRequestDto: ...,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies AdminCustomerTravelersCreateRequest;

  try {
    const data = await api.adminCustomerTravelersCreate(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **customerId** | `string` |  | [Defaults to `undefined`] |
| **createTravelerRequestDto** | [CreateTravelerRequestDto](CreateTravelerRequestDto.md) |  | |
| **acceptLanguage** | `ru`, `uz`, `en` | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

### Return type

[**AdminCustomerTravelersCreate201Response**](AdminCustomerTravelersCreate201Response.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminCustomerTravelersDelete

> adminCustomerTravelersDelete(customerId, travelerId, acceptLanguage)

Delete a traveler and their documents

### Example

```ts
import {
  Configuration,
  AdminCustomersTravelersApi,
} from '';
import type { AdminCustomerTravelersDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminCustomersTravelersApi(config);

  const body = {
    // string
    customerId: customerId_example,
    // string
    travelerId: travelerId_example,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies AdminCustomerTravelersDeleteRequest;

  try {
    const data = await api.adminCustomerTravelersDelete(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **customerId** | `string` |  | [Defaults to `undefined`] |
| **travelerId** | `string` |  | [Defaults to `undefined`] |
| **acceptLanguage** | `ru`, `uz`, `en` | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

### Return type

`void` (Empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminCustomerTravelersDeleteDocument

> adminCustomerTravelersDeleteDocument(customerId, travelerId, documentId, acceptLanguage)

Delete a traveler document

### Example

```ts
import {
  Configuration,
  AdminCustomersTravelersApi,
} from '';
import type { AdminCustomerTravelersDeleteDocumentRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminCustomersTravelersApi(config);

  const body = {
    // string
    customerId: customerId_example,
    // string
    travelerId: travelerId_example,
    // string
    documentId: documentId_example,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies AdminCustomerTravelersDeleteDocumentRequest;

  try {
    const data = await api.adminCustomerTravelersDeleteDocument(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **customerId** | `string` |  | [Defaults to `undefined`] |
| **travelerId** | `string` |  | [Defaults to `undefined`] |
| **documentId** | `string` |  | [Defaults to `undefined`] |
| **acceptLanguage** | `ru`, `uz`, `en` | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

### Return type

`void` (Empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminCustomerTravelersList

> AdminCustomerTravelersList200Response adminCustomerTravelersList(customerId, page, limit, sortBy, sortDirection, acceptLanguage)

List customer and family travelers with masked documents

### Example

```ts
import {
  Configuration,
  AdminCustomersTravelersApi,
} from '';
import type { AdminCustomerTravelersListRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminCustomersTravelersApi(config);

  const body = {
    // string
    customerId: customerId_example,
    // number (optional)
    page: 8.14,
    // number (optional)
    limit: 8.14,
    // 'createdAt' | 'updatedAt' | 'firstName' | 'lastName' (optional)
    sortBy: sortBy_example,
    // 'asc' | 'desc' (optional)
    sortDirection: sortDirection_example,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies AdminCustomerTravelersListRequest;

  try {
    const data = await api.adminCustomerTravelersList(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **customerId** | `string` |  | [Defaults to `undefined`] |
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **limit** | `number` |  | [Optional] [Defaults to `20`] |
| **sortBy** | `createdAt`, `updatedAt`, `firstName`, `lastName` |  | [Optional] [Defaults to `&#39;createdAt&#39;`] [Enum: createdAt, updatedAt, firstName, lastName] |
| **sortDirection** | `asc`, `desc` |  | [Optional] [Defaults to `&#39;desc&#39;`] [Enum: asc, desc] |
| **acceptLanguage** | `ru`, `uz`, `en` | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

### Return type

[**AdminCustomerTravelersList200Response**](AdminCustomerTravelersList200Response.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminCustomerTravelersUpdate

> AdminCustomerTravelersCreate201Response adminCustomerTravelersUpdate(customerId, travelerId, updateTravelerRequestDto, acceptLanguage)

Update a customer traveler

### Example

```ts
import {
  Configuration,
  AdminCustomersTravelersApi,
} from '';
import type { AdminCustomerTravelersUpdateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminCustomersTravelersApi(config);

  const body = {
    // string
    customerId: customerId_example,
    // string
    travelerId: travelerId_example,
    // UpdateTravelerRequestDto
    updateTravelerRequestDto: ...,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies AdminCustomerTravelersUpdateRequest;

  try {
    const data = await api.adminCustomerTravelersUpdate(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **customerId** | `string` |  | [Defaults to `undefined`] |
| **travelerId** | `string` |  | [Defaults to `undefined`] |
| **updateTravelerRequestDto** | [UpdateTravelerRequestDto](UpdateTravelerRequestDto.md) |  | |
| **acceptLanguage** | `ru`, `uz`, `en` | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

### Return type

[**AdminCustomerTravelersCreate201Response**](AdminCustomerTravelersCreate201Response.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminCustomerTravelersUpdateDocument

> AdminCustomerTravelersCreate201Response adminCustomerTravelersUpdateDocument(customerId, travelerId, documentId, updateTravelerDocumentRequestDto, acceptLanguage)

Update an encrypted traveler document

### Example

```ts
import {
  Configuration,
  AdminCustomersTravelersApi,
} from '';
import type { AdminCustomerTravelersUpdateDocumentRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminCustomersTravelersApi(config);

  const body = {
    // string
    customerId: customerId_example,
    // string
    travelerId: travelerId_example,
    // string
    documentId: documentId_example,
    // UpdateTravelerDocumentRequestDto
    updateTravelerDocumentRequestDto: ...,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies AdminCustomerTravelersUpdateDocumentRequest;

  try {
    const data = await api.adminCustomerTravelersUpdateDocument(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **customerId** | `string` |  | [Defaults to `undefined`] |
| **travelerId** | `string` |  | [Defaults to `undefined`] |
| **documentId** | `string` |  | [Defaults to `undefined`] |
| **updateTravelerDocumentRequestDto** | [UpdateTravelerDocumentRequestDto](UpdateTravelerDocumentRequestDto.md) |  | |
| **acceptLanguage** | `ru`, `uz`, `en` | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

### Return type

[**AdminCustomerTravelersCreate201Response**](AdminCustomerTravelersCreate201Response.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

