# FlightsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**flightsCreate**](FlightsApi.md#flightscreate) | **POST** /api/v1/flights/searches | Start an asynchronous flight search |
| [**flightsFareRules**](FlightsApi.md#flightsfarerules) | **GET** /api/v1/flights/offers/{offerId}/fare-rules | Get provider fare rules for a flight offer |
| [**flightsOffer**](FlightsApi.md#flightsoffer) | **GET** /api/v1/flights/offers/{offerId} | Get a normalized flight offer |
| [**flightsResults**](FlightsApi.md#flightsresults) | **GET** /api/v1/flights/searches/{searchId}/results | Get normalized flight search results |
| [**flightsRevalidate**](FlightsApi.md#flightsrevalidate) | **POST** /api/v1/flights/offers/{offerId}/revalidate | Revalidate availability and price before booking |
| [**flightsStatus**](FlightsApi.md#flightsstatus) | **GET** /api/v1/flights/searches/{searchId} | Get flight search status |



## flightsCreate

> FlightsCreate201Response flightsCreate(createFlightSearchRequestDto)

Start an asynchronous flight search

### Example

```ts
import {
  Configuration,
  FlightsApi,
} from '';
import type { FlightsCreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new FlightsApi();

  const body = {
    // CreateFlightSearchRequestDto
    createFlightSearchRequestDto: ...,
  } satisfies FlightsCreateRequest;

  try {
    const data = await api.flightsCreate(body);
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
| **createFlightSearchRequestDto** | [CreateFlightSearchRequestDto](CreateFlightSearchRequestDto.md) |  | |

### Return type

[**FlightsCreate201Response**](FlightsCreate201Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## flightsFareRules

> FlightsFareRules200Response flightsFareRules(offerId)

Get provider fare rules for a flight offer

### Example

```ts
import {
  Configuration,
  FlightsApi,
} from '';
import type { FlightsFareRulesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new FlightsApi();

  const body = {
    // string
    offerId: offerId_example,
  } satisfies FlightsFareRulesRequest;

  try {
    const data = await api.flightsFareRules(body);
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
| **offerId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**FlightsFareRules200Response**](FlightsFareRules200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## flightsOffer

> FlightsOffer200Response flightsOffer(offerId)

Get a normalized flight offer

### Example

```ts
import {
  Configuration,
  FlightsApi,
} from '';
import type { FlightsOfferRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new FlightsApi();

  const body = {
    // string
    offerId: offerId_example,
  } satisfies FlightsOfferRequest;

  try {
    const data = await api.flightsOffer(body);
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
| **offerId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**FlightsOffer200Response**](FlightsOffer200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## flightsResults

> FlightsResults200Response flightsResults(searchId, page, limit, sortBy, sortDirection)

Get normalized flight search results

### Example

```ts
import {
  Configuration,
  FlightsApi,
} from '';
import type { FlightsResultsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new FlightsApi();

  const body = {
    // string
    searchId: searchId_example,
    // number (optional)
    page: 8.14,
    // number (optional)
    limit: 8.14,
    // 'createdAt' | 'price' | 'duration' | 'departure' (optional)
    sortBy: sortBy_example,
    // 'asc' | 'desc' (optional)
    sortDirection: sortDirection_example,
  } satisfies FlightsResultsRequest;

  try {
    const data = await api.flightsResults(body);
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
| **searchId** | `string` |  | [Defaults to `undefined`] |
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **limit** | `number` |  | [Optional] [Defaults to `20`] |
| **sortBy** | `createdAt`, `price`, `duration`, `departure` |  | [Optional] [Defaults to `&#39;price&#39;`] [Enum: createdAt, price, duration, departure] |
| **sortDirection** | `asc`, `desc` |  | [Optional] [Defaults to `&#39;desc&#39;`] [Enum: asc, desc] |

### Return type

[**FlightsResults200Response**](FlightsResults200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## flightsRevalidate

> FlightsOffer200Response flightsRevalidate(offerId)

Revalidate availability and price before booking

### Example

```ts
import {
  Configuration,
  FlightsApi,
} from '';
import type { FlightsRevalidateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new FlightsApi();

  const body = {
    // string
    offerId: offerId_example,
  } satisfies FlightsRevalidateRequest;

  try {
    const data = await api.flightsRevalidate(body);
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
| **offerId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**FlightsOffer200Response**](FlightsOffer200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## flightsStatus

> FlightsCreate201Response flightsStatus(searchId)

Get flight search status

### Example

```ts
import {
  Configuration,
  FlightsApi,
} from '';
import type { FlightsStatusRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new FlightsApi();

  const body = {
    // string
    searchId: searchId_example,
  } satisfies FlightsStatusRequest;

  try {
    const data = await api.flightsStatus(body);
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
| **searchId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**FlightsCreate201Response**](FlightsCreate201Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

