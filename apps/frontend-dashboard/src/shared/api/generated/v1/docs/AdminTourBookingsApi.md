# AdminTourBookingsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**adminTourBookingsChangeStatus**](AdminTourBookingsApi.md#admintourbookingschangestatus) | **PATCH** /api/v1/admin/tour-bookings/{id}/status | Change tour booking status |
| [**adminTourBookingsCreate**](AdminTourBookingsApi.md#admintourbookingscreate) | **POST** /api/v1/admin/tour-bookings | Create a tour booking |
| [**adminTourBookingsDeleteDocument**](AdminTourBookingsApi.md#admintourbookingsdeletedocument) | **DELETE** /api/v1/admin/tour-bookings/{bookingId}/documents/{documentId} | Delete a tour booking document |
| [**adminTourBookingsDownloadDocument**](AdminTourBookingsApi.md#admintourbookingsdownloaddocument) | **GET** /api/v1/admin/tour-bookings/{bookingId}/documents/{documentId}/download | Download a private tour booking document |
| [**adminTourBookingsGet**](AdminTourBookingsApi.md#admintourbookingsget) | **GET** /api/v1/admin/tour-bookings/{id} | Get a tour booking |
| [**adminTourBookingsList**](AdminTourBookingsApi.md#admintourbookingslist) | **GET** /api/v1/admin/tour-bookings | List tour bookings |
| [**adminTourBookingsUploadDocument**](AdminTourBookingsApi.md#admintourbookingsuploaddocument) | **POST** /api/v1/admin/tour-bookings/{id}/documents | Upload a private document to a tour booking |



## adminTourBookingsChangeStatus

> AdminTourBookingsCreate201Response adminTourBookingsChangeStatus(id, updateTourBookingStatusRequestDto)

Change tour booking status

### Example

```ts
import {
  Configuration,
  AdminTourBookingsApi,
} from '';
import type { AdminTourBookingsChangeStatusRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminTourBookingsApi(config);

  const body = {
    // string
    id: id_example,
    // UpdateTourBookingStatusRequestDto
    updateTourBookingStatusRequestDto: ...,
  } satisfies AdminTourBookingsChangeStatusRequest;

  try {
    const data = await api.adminTourBookingsChangeStatus(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |
| **updateTourBookingStatusRequestDto** | [UpdateTourBookingStatusRequestDto](UpdateTourBookingStatusRequestDto.md) |  | |

### Return type

[**AdminTourBookingsCreate201Response**](AdminTourBookingsCreate201Response.md)

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


## adminTourBookingsCreate

> AdminTourBookingsCreate201Response adminTourBookingsCreate(createTourBookingRequestDto)

Create a tour booking

### Example

```ts
import {
  Configuration,
  AdminTourBookingsApi,
} from '';
import type { AdminTourBookingsCreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminTourBookingsApi(config);

  const body = {
    // CreateTourBookingRequestDto
    createTourBookingRequestDto: ...,
  } satisfies AdminTourBookingsCreateRequest;

  try {
    const data = await api.adminTourBookingsCreate(body);
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
| **createTourBookingRequestDto** | [CreateTourBookingRequestDto](CreateTourBookingRequestDto.md) |  | |

### Return type

[**AdminTourBookingsCreate201Response**](AdminTourBookingsCreate201Response.md)

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


## adminTourBookingsDeleteDocument

> adminTourBookingsDeleteDocument(bookingId, documentId)

Delete a tour booking document

### Example

```ts
import {
  Configuration,
  AdminTourBookingsApi,
} from '';
import type { AdminTourBookingsDeleteDocumentRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminTourBookingsApi(config);

  const body = {
    // string
    bookingId: bookingId_example,
    // string
    documentId: documentId_example,
  } satisfies AdminTourBookingsDeleteDocumentRequest;

  try {
    const data = await api.adminTourBookingsDeleteDocument(body);
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
| **bookingId** | `string` |  | [Defaults to `undefined`] |
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


## adminTourBookingsDownloadDocument

> Blob adminTourBookingsDownloadDocument(bookingId, documentId)

Download a private tour booking document

### Example

```ts
import {
  Configuration,
  AdminTourBookingsApi,
} from '';
import type { AdminTourBookingsDownloadDocumentRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminTourBookingsApi(config);

  const body = {
    // string
    bookingId: bookingId_example,
    // string
    documentId: documentId_example,
  } satisfies AdminTourBookingsDownloadDocumentRequest;

  try {
    const data = await api.adminTourBookingsDownloadDocument(body);
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
| **bookingId** | `string` |  | [Defaults to `undefined`] |
| **documentId** | `string` |  | [Defaults to `undefined`] |

### Return type

**Blob**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/octet-stream`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminTourBookingsGet

> AdminTourBookingsCreate201Response adminTourBookingsGet(id)

Get a tour booking

### Example

```ts
import {
  Configuration,
  AdminTourBookingsApi,
} from '';
import type { AdminTourBookingsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminTourBookingsApi(config);

  const body = {
    // string
    id: id_example,
  } satisfies AdminTourBookingsGetRequest;

  try {
    const data = await api.adminTourBookingsGet(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |

### Return type

[**AdminTourBookingsCreate201Response**](AdminTourBookingsCreate201Response.md)

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


## adminTourBookingsList

> AdminTourBookingsList200Response adminTourBookingsList(page, limit, sortBy, sortDirection, search, status)

List tour bookings

### Example

```ts
import {
  Configuration,
  AdminTourBookingsApi,
} from '';
import type { AdminTourBookingsListRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminTourBookingsApi(config);

  const body = {
    // number (optional)
    page: 8.14,
    // number (optional)
    limit: 8.14,
    // string (optional)
    sortBy: sortBy_example,
    // 'asc' | 'desc' (optional)
    sortDirection: sortDirection_example,
    // string (optional)
    search: search_example,
    // 'pending' | 'confirmed' | 'awaiting_payment' | 'paid' | 'completed' | 'cancelled' (optional)
    status: status_example,
  } satisfies AdminTourBookingsListRequest;

  try {
    const data = await api.adminTourBookingsList(body);
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
| **sortBy** | `string` |  | [Optional] [Defaults to `&#39;createdAt&#39;`] |
| **sortDirection** | `asc`, `desc` |  | [Optional] [Defaults to `&#39;desc&#39;`] [Enum: asc, desc] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **status** | `pending`, `confirmed`, `awaiting_payment`, `paid`, `completed`, `cancelled` |  | [Optional] [Defaults to `undefined`] [Enum: pending, confirmed, awaiting_payment, paid, completed, cancelled] |

### Return type

[**AdminTourBookingsList200Response**](AdminTourBookingsList200Response.md)

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


## adminTourBookingsUploadDocument

> AdminTourBookingsUploadDocument201Response adminTourBookingsUploadDocument(id, file)

Upload a private document to a tour booking

### Example

```ts
import {
  Configuration,
  AdminTourBookingsApi,
} from '';
import type { AdminTourBookingsUploadDocumentRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminTourBookingsApi(config);

  const body = {
    // string
    id: id_example,
    // Blob
    file: BINARY_DATA_HERE,
  } satisfies AdminTourBookingsUploadDocumentRequest;

  try {
    const data = await api.adminTourBookingsUploadDocument(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |
| **file** | `Blob` |  | [Defaults to `undefined`] |

### Return type

[**AdminTourBookingsUploadDocument201Response**](AdminTourBookingsUploadDocument201Response.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: `multipart/form-data`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

