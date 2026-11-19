# FlightsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**flightsFareRules**](FlightsApi.md#flightsfarerules) | **GET** /api/v1/flights/offers/{offerId}/fare-rules | Get provider fare rules for a flight offer |
| [**flightsOffer**](FlightsApi.md#flightsoffer) | **GET** /api/v1/flights/offers/{offerId} | Get a normalized flight offer |
| [**flightsSearch**](FlightsApi.md#flightssearch) | **POST** /api/v1/flights/search | Search flights and return normalized offers |
| [**flightsSearchLegacy**](FlightsApi.md#flightssearchlegacy) | **POST** /api/v1/flights/searches | Search flights (legacy route) |
| [**flightsShare**](FlightsApi.md#flightsshare) | **POST** /api/v1/flights/offers/{offerId}/share | Create a public flight share link |



## flightsFareRules

> FlightsFareRules200Response flightsFareRules(offerId, acceptLanguage)

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
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
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
| **acceptLanguage** | `ru`, `uz`, `en` | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

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

> FlightsOffer200Response flightsOffer(offerId, acceptLanguage)

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
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
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
| **acceptLanguage** | `ru`, `uz`, `en` | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

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


## flightsSearch

> FlightsSearch200Response flightsSearch(createFlightSearchRequestDto, acceptLanguage)

Search flights and return normalized offers

### Example

```ts
import {
  Configuration,
  FlightsApi,
} from '';
import type { FlightsSearchRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new FlightsApi();

  const body = {
    // CreateFlightSearchRequestDto
    createFlightSearchRequestDto: ...,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies FlightsSearchRequest;

  try {
    const data = await api.flightsSearch(body);
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
| **acceptLanguage** | `ru`, `uz`, `en` | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

### Return type

[**FlightsSearch200Response**](FlightsSearch200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## flightsSearchLegacy

> FlightsSearch200Response flightsSearchLegacy(createFlightSearchRequestDto, acceptLanguage)

Search flights (legacy route)

### Example

```ts
import {
  Configuration,
  FlightsApi,
} from '';
import type { FlightsSearchLegacyRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new FlightsApi();

  const body = {
    // CreateFlightSearchRequestDto
    createFlightSearchRequestDto: ...,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies FlightsSearchLegacyRequest;

  try {
    const data = await api.flightsSearchLegacy(body);
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
| **acceptLanguage** | `ru`, `uz`, `en` | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

### Return type

[**FlightsSearch200Response**](FlightsSearch200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## flightsShare

> FlightsShare201Response flightsShare(offerId, acceptLanguage)

Create a public flight share link

### Example

```ts
import {
  Configuration,
  FlightsApi,
} from '';
import type { FlightsShareRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new FlightsApi();

  const body = {
    // string
    offerId: offerId_example,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies FlightsShareRequest;

  try {
    const data = await api.flightsShare(body);
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
| **acceptLanguage** | `ru`, `uz`, `en` | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

### Return type

[**FlightsShare201Response**](FlightsShare201Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

