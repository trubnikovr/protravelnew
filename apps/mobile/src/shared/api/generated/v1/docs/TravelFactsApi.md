# TravelFactsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**travelFactsList**](TravelFactsApi.md#travelfactslist) | **GET** /api/v1/travel-facts | Get published travel facts for rotation |
| [**travelFactsRandom**](TravelFactsApi.md#travelfactsrandom) | **GET** /api/v1/travel-facts/random | Get a random published travel fact |



## travelFactsLis

> TravelFactsList200Response travelFactsList(destinationCode, limit, acceptLanguage)

Get published travel facts for rotation

### Example

```ts
import {
  Configuration,
  TravelFactsApi,
} from '';
import type { TravelFactsListRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new TravelFactsApi();

  const body = {
    // string (optional)
    destinationCode: PQC,
    // number (optional)
    limit: 8.14,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies TravelFactsListRequest;

  try {
    const data = await api.travelFactsList(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the tes
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **destinationCode** | `string` |  | [Optional] [Defaults to `undefined`] |
| **limit** | `number` |  | [Optional] [Defaults to `5`] |
| **acceptLanguage** | `ru`, `uz`, `en` | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

### Return type

[**TravelFactsList200Response**](TravelFactsList200Response.md)

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


## travelFactsRandom

> TravelFactsRandom200Response travelFactsRandom(destinationCode, acceptLanguage)

Get a random published travel fac

### Example

```ts
import {
  Configuration,
  TravelFactsApi,
} from '';
import type { TravelFactsRandomRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new TravelFactsApi();

  const body = {
    // string (optional)
    destinationCode: PQC,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies TravelFactsRandomRequest;

  try {
    const data = await api.travelFactsRandom(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the tes
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **destinationCode** | `string` |  | [Optional] [Defaults to `undefined`] |
| **acceptLanguage** | `ru`, `uz`, `en` | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

### Return type

[**TravelFactsRandom200Response**](TravelFactsRandom200Response.md)

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

