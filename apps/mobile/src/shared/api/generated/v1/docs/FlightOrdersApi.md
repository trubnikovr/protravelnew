# FlightOrdersApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**flightOrdersBook**](FlightOrdersApi.md#flightordersbook) | **POST** /api/v1/flight-orders/{id}/book | Create provider booking for a draft flight order |
| [**flightOrdersCancel**](FlightOrdersApi.md#flightorderscancel) | **POST** /api/v1/flight-orders/{id}/cancel | Cancel a booked flight order |
| [**flightOrdersCreate**](FlightOrdersApi.md#flightorderscreate) | **POST** /api/v1/flight-orders/create-flight-order | Book a flight and create the flight order |
| [**flightOrdersCreateLegacy**](FlightOrdersApi.md#flightorderscreatelegacy) | **POST** /api/v1/flight-orders | Book a flight and create the flight order (legacy route) |
| [**flightOrdersGet**](FlightOrdersApi.md#flightordersget) | **GET** /api/v1/flight-orders/{id} | Get current customer flight order |
| [**flightOrdersList**](FlightOrdersApi.md#flightorderslist) | **GET** /api/v1/flight-orders | List current customer flight orders |
| [**flightOrdersRefresh**](FlightOrdersApi.md#flightordersrefresh) | **POST** /api/v1/flight-orders/{id}/refresh | Refresh provider booking status |



## flightOrdersBook

> FlightOrdersCreateLegacy201Response flightOrdersBook(id, acceptLanguage)

Create provider booking for a draft flight order

### Example

```ts
import {
  Configuration,
  FlightOrdersApi,
} from '';
import type { FlightOrdersBookRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new FlightOrdersApi(config);

  const body = {
    // string
    id: id_example,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies FlightOrdersBookRequest;

  try {
    const data = await api.flightOrdersBook(body);
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
| **acceptLanguage** | `ru`, `uz`, `en` | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

### Return type

[**FlightOrdersCreateLegacy201Response**](FlightOrdersCreateLegacy201Response.md)

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


## flightOrdersCancel

> FlightOrdersCreateLegacy201Response flightOrdersCancel(id, acceptLanguage)

Cancel a booked flight order

### Example

```ts
import {
  Configuration,
  FlightOrdersApi,
} from '';
import type { FlightOrdersCancelRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new FlightOrdersApi(config);

  const body = {
    // string
    id: id_example,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies FlightOrdersCancelRequest;

  try {
    const data = await api.flightOrdersCancel(body);
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
| **acceptLanguage** | `ru`, `uz`, `en` | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

### Return type

[**FlightOrdersCreateLegacy201Response**](FlightOrdersCreateLegacy201Response.md)

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


## flightOrdersCreate

> FlightOrdersCreateLegacy201Response flightOrdersCreate(idempotencyKey, createFlightOrderRequestDto, acceptLanguage)

Book a flight and create the flight order

### Example

```ts
import {
  Configuration,
  FlightOrdersApi,
} from '';
import type { FlightOrdersCreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new FlightOrdersApi(config);

  const body = {
    // string
    idempotencyKey: idempotencyKey_example,
    // CreateFlightOrderRequestDto
    createFlightOrderRequestDto: ...,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies FlightOrdersCreateRequest;

  try {
    const data = await api.flightOrdersCreate(body);
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
| **idempotencyKey** | `string` |  | [Defaults to `undefined`] |
| **createFlightOrderRequestDto** | [CreateFlightOrderRequestDto](CreateFlightOrderRequestDto.md) |  | |
| **acceptLanguage** | `ru`, `uz`, `en` | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

### Return type

[**FlightOrdersCreateLegacy201Response**](FlightOrdersCreateLegacy201Response.md)

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


## flightOrdersCreateLegacy

> FlightOrdersCreateLegacy201Response flightOrdersCreateLegacy(idempotencyKey, createFlightOrderRequestDto, acceptLanguage)

Book a flight and create the flight order (legacy route)

### Example

```ts
import {
  Configuration,
  FlightOrdersApi,
} from '';
import type { FlightOrdersCreateLegacyRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new FlightOrdersApi(config);

  const body = {
    // string
    idempotencyKey: idempotencyKey_example,
    // CreateFlightOrderRequestDto
    createFlightOrderRequestDto: ...,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies FlightOrdersCreateLegacyRequest;

  try {
    const data = await api.flightOrdersCreateLegacy(body);
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
| **idempotencyKey** | `string` |  | [Defaults to `undefined`] |
| **createFlightOrderRequestDto** | [CreateFlightOrderRequestDto](CreateFlightOrderRequestDto.md) |  | |
| **acceptLanguage** | `ru`, `uz`, `en` | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

### Return type

[**FlightOrdersCreateLegacy201Response**](FlightOrdersCreateLegacy201Response.md)

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


## flightOrdersGet

> FlightOrdersCreateLegacy201Response flightOrdersGet(id, acceptLanguage)

Get current customer flight order

### Example

```ts
import {
  Configuration,
  FlightOrdersApi,
} from '';
import type { FlightOrdersGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new FlightOrdersApi(config);

  const body = {
    // string
    id: id_example,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies FlightOrdersGetRequest;

  try {
    const data = await api.flightOrdersGet(body);
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
| **acceptLanguage** | `ru`, `uz`, `en` | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

### Return type

[**FlightOrdersCreateLegacy201Response**](FlightOrdersCreateLegacy201Response.md)

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


## flightOrdersList

> FlightOrdersList200Response flightOrdersList(page, limit, sortBy, sortDirection, acceptLanguage)

List current customer flight orders

### Example

```ts
import {
  Configuration,
  FlightOrdersApi,
} from '';
import type { FlightOrdersListRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new FlightOrdersApi(config);

  const body = {
    // number (optional)
    page: 8.14,
    // number (optional)
    limit: 8.14,
    // string (optional)
    sortBy: sortBy_example,
    // 'asc' | 'desc' (optional)
    sortDirection: sortDirection_example,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies FlightOrdersListRequest;

  try {
    const data = await api.flightOrdersList(body);
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
| **acceptLanguage** | `ru`, `uz`, `en` | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

### Return type

[**FlightOrdersList200Response**](FlightOrdersList200Response.md)

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


## flightOrdersRefresh

> FlightOrdersCreateLegacy201Response flightOrdersRefresh(id, acceptLanguage)

Refresh provider booking status

### Example

```ts
import {
  Configuration,
  FlightOrdersApi,
} from '';
import type { FlightOrdersRefreshRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new FlightOrdersApi(config);

  const body = {
    // string
    id: id_example,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies FlightOrdersRefreshRequest;

  try {
    const data = await api.flightOrdersRefresh(body);
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
| **acceptLanguage** | `ru`, `uz`, `en` | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

### Return type

[**FlightOrdersCreateLegacy201Response**](FlightOrdersCreateLegacy201Response.md)

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

