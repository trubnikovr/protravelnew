# FlightOrdersApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**flightOrdersBook**](FlightOrdersApi.md#flightordersbook) | **POST** /api/v1/flight-orders/{id}/book | Create provider booking for a draft flight order |
| [**flightOrdersCancel**](FlightOrdersApi.md#flightorderscancel) | **POST** /api/v1/flight-orders/{id}/cancel | Cancel a booked flight order |
| [**flightOrdersCreate**](FlightOrdersApi.md#flightorderscreate) | **POST** /api/v1/flight-orders | Create draft flight order from validated offer |
| [**flightOrdersGet**](FlightOrdersApi.md#flightordersget) | **GET** /api/v1/flight-orders/{id} | Get current customer flight order |
| [**flightOrdersRefresh**](FlightOrdersApi.md#flightordersrefresh) | **POST** /api/v1/flight-orders/{id}/refresh | Refresh provider booking status |



## flightOrdersBook

> FlightOrdersCreate201Response flightOrdersBook(id)

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

### Return type

[**FlightOrdersCreate201Response**](FlightOrdersCreate201Response.md)

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

> FlightOrdersCreate201Response flightOrdersCancel(id)

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

### Return type

[**FlightOrdersCreate201Response**](FlightOrdersCreate201Response.md)

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

> FlightOrdersCreate201Response flightOrdersCreate(idempotencyKey, createFlightOrderRequestDto)

Create draft flight order from validated offer

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

### Return type

[**FlightOrdersCreate201Response**](FlightOrdersCreate201Response.md)

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

> FlightOrdersCreate201Response flightOrdersGet(id)

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

### Return type

[**FlightOrdersCreate201Response**](FlightOrdersCreate201Response.md)

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

> FlightOrdersCreate201Response flightOrdersRefresh(id)

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

### Return type

[**FlightOrdersCreate201Response**](FlightOrdersCreate201Response.md)

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

