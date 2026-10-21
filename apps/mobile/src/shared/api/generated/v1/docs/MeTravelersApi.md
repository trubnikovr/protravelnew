# MeTravelersApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**customerTravelersAddDocument**](MeTravelersApi.md#customertravelersadddocument) | **POST** /api/v1/me/travelers/{travelerId}/documents | Add encrypted document to own traveler |
| [**customerTravelersCreate**](MeTravelersApi.md#customertravelerscreate) | **POST** /api/v1/me/travelers | Add current customer or a family traveler |
| [**customerTravelersDelete**](MeTravelersApi.md#customertravelersdelete) | **DELETE** /api/v1/me/travelers/{travelerId} | Delete own traveler and documents |
| [**customerTravelersDeleteDocument**](MeTravelersApi.md#customertravelersdeletedocument) | **DELETE** /api/v1/me/travelers/{travelerId}/documents/{documentId} | Delete own traveler document |
| [**customerTravelersList**](MeTravelersApi.md#customertravelerslist) | **GET** /api/v1/me/travelers | List current customer and family travelers |
| [**customerTravelersUpdate**](MeTravelersApi.md#customertravelersupdate) | **PATCH** /api/v1/me/travelers/{travelerId} | Update own traveler |
| [**customerTravelersUpdateDocument**](MeTravelersApi.md#customertravelersupdatedocument) | **PATCH** /api/v1/me/travelers/{travelerId}/documents/{documentId} | Update encrypted own traveler document |



## customerTravelersAddDocument

> CustomerTravelersCreate201Response customerTravelersAddDocument(travelerId, createTravelerDocumentRequestDto)

Add encrypted document to own traveler

### Example

```ts
import {
  Configuration,
  MeTravelersApi,
} from '';
import type { CustomerTravelersAddDocumentRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new MeTravelersApi(config);

  const body = {
    // string
    travelerId: travelerId_example,
    // CreateTravelerDocumentRequestDto
    createTravelerDocumentRequestDto: ...,
  } satisfies CustomerTravelersAddDocumentRequest;

  try {
    const data = await api.customerTravelersAddDocument(body);
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
| **travelerId** | `string` |  | [Defaults to `undefined`] |
| **createTravelerDocumentRequestDto** | [CreateTravelerDocumentRequestDto](CreateTravelerDocumentRequestDto.md) |  | |

### Return type

[**CustomerTravelersCreate201Response**](CustomerTravelersCreate201Response.md)

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


## customerTravelersCreate

> CustomerTravelersCreate201Response customerTravelersCreate(createTravelerRequestDto)

Add current customer or a family traveler

### Example

```ts
import {
  Configuration,
  MeTravelersApi,
} from '';
import type { CustomerTravelersCreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new MeTravelersApi(config);

  const body = {
    // CreateTravelerRequestDto
    createTravelerRequestDto: ...,
  } satisfies CustomerTravelersCreateRequest;

  try {
    const data = await api.customerTravelersCreate(body);
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
| **createTravelerRequestDto** | [CreateTravelerRequestDto](CreateTravelerRequestDto.md) |  | |

### Return type

[**CustomerTravelersCreate201Response**](CustomerTravelersCreate201Response.md)

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


## customerTravelersDelete

> customerTravelersDelete(travelerId)

Delete own traveler and documents

### Example

```ts
import {
  Configuration,
  MeTravelersApi,
} from '';
import type { CustomerTravelersDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new MeTravelersApi(config);

  const body = {
    // string
    travelerId: travelerId_example,
  } satisfies CustomerTravelersDeleteRequest;

  try {
    const data = await api.customerTravelersDelete(body);
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
| **travelerId** | `string` |  | [Defaults to `undefined`] |

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


## customerTravelersDeleteDocument

> customerTravelersDeleteDocument(travelerId, documentId)

Delete own traveler document

### Example

```ts
import {
  Configuration,
  MeTravelersApi,
} from '';
import type { CustomerTravelersDeleteDocumentRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new MeTravelersApi(config);

  const body = {
    // string
    travelerId: travelerId_example,
    // string
    documentId: documentId_example,
  } satisfies CustomerTravelersDeleteDocumentRequest;

  try {
    const data = await api.customerTravelersDeleteDocument(body);
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
| **travelerId** | `string` |  | [Defaults to `undefined`] |
| **documentId** | `string` |  | [Defaults to `undefined`] |

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


## customerTravelersList

> CustomerTravelersList200Response customerTravelersList(page, limit, sortBy, sortDirection)

List current customer and family travelers

### Example

```ts
import {
  Configuration,
  MeTravelersApi,
} from '';
import type { CustomerTravelersListRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new MeTravelersApi(config);

  const body = {
    // number (optional)
    page: 8.14,
    // number (optional)
    limit: 8.14,
    // 'createdAt' | 'updatedAt' | 'firstName' | 'lastName' (optional)
    sortBy: sortBy_example,
    // 'asc' | 'desc' (optional)
    sortDirection: sortDirection_example,
  } satisfies CustomerTravelersListRequest;

  try {
    const data = await api.customerTravelersList(body);
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
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **limit** | `number` |  | [Optional] [Defaults to `20`] |
| **sortBy** | `createdAt`, `updatedAt`, `firstName`, `lastName` |  | [Optional] [Defaults to `&#39;createdAt&#39;`] [Enum: createdAt, updatedAt, firstName, lastName] |
| **sortDirection** | `asc`, `desc` |  | [Optional] [Defaults to `&#39;desc&#39;`] [Enum: asc, desc] |

### Return type

[**CustomerTravelersList200Response**](CustomerTravelersList200Response.md)

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


## customerTravelersUpdate

> CustomerTravelersCreate201Response customerTravelersUpdate(travelerId, updateTravelerRequestDto)

Update own traveler

### Example

```ts
import {
  Configuration,
  MeTravelersApi,
} from '';
import type { CustomerTravelersUpdateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new MeTravelersApi(config);

  const body = {
    // string
    travelerId: travelerId_example,
    // UpdateTravelerRequestDto
    updateTravelerRequestDto: ...,
  } satisfies CustomerTravelersUpdateRequest;

  try {
    const data = await api.customerTravelersUpdate(body);
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
| **travelerId** | `string` |  | [Defaults to `undefined`] |
| **updateTravelerRequestDto** | [UpdateTravelerRequestDto](UpdateTravelerRequestDto.md) |  | |

### Return type

[**CustomerTravelersCreate201Response**](CustomerTravelersCreate201Response.md)

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


## customerTravelersUpdateDocument

> CustomerTravelersCreate201Response customerTravelersUpdateDocument(travelerId, documentId, updateTravelerDocumentRequestDto)

Update encrypted own traveler document

### Example

```ts
import {
  Configuration,
  MeTravelersApi,
} from '';
import type { CustomerTravelersUpdateDocumentRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new MeTravelersApi(config);

  const body = {
    // string
    travelerId: travelerId_example,
    // string
    documentId: documentId_example,
    // UpdateTravelerDocumentRequestDto
    updateTravelerDocumentRequestDto: ...,
  } satisfies CustomerTravelersUpdateDocumentRequest;

  try {
    const data = await api.customerTravelersUpdateDocument(body);
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
| **travelerId** | `string` |  | [Defaults to `undefined`] |
| **documentId** | `string` |  | [Defaults to `undefined`] |
| **updateTravelerDocumentRequestDto** | [UpdateTravelerDocumentRequestDto](UpdateTravelerDocumentRequestDto.md) |  | |

### Return type

[**CustomerTravelersCreate201Response**](CustomerTravelersCreate201Response.md)

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

