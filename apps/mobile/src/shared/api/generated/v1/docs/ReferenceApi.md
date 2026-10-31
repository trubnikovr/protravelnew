# ReferenceApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**referenceCountries**](ReferenceApi.md#referencecountries) | **GET** /api/v1/reference/countries | List localized countries for citizenship selection |
| [**referenceFeaturedFlightLocations**](ReferenceApi.md#referencefeaturedflightlocations) | **GET** /api/v1/reference/featured-flight-locations | List featured flight locations |
| [**referenceSuggest**](ReferenceApi.md#referencesuggest) | **GET** /api/v1/reference/suggest | Suggest countries, cities and airports |



## referenceCountries

> ReferenceCountries200Response referenceCountries(page, limit, sortBy, sortDirection, search, acceptLanguage)

List localized countries for citizenship selection

### Example

```ts
import {
  Configuration,
  ReferenceApi,
} from '';
import type { ReferenceCountriesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ReferenceApi();

  const body = {
    // number (optional)
    page: 8.14,
    // number (optional)
    limit: 8.14,
    // 'name' | 'code' (optional)
    sortBy: sortBy_example,
    // 'asc' | 'desc' (optional)
    sortDirection: sortDirection_example,
    // string (optional)
    search: search_example,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies ReferenceCountriesRequest;

  try {
    const data = await api.referenceCountries(body);
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
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **limit** | `number` |  | [Optional] [Defaults to `20`] |
| **sortBy** | `name`, `code` |  | [Optional] [Defaults to `&#39;name&#39;`] [Enum: name, code] |
| **sortDirection** | `asc`, `desc` |  | [Optional] [Defaults to `&#39;desc&#39;`] [Enum: asc, desc] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **acceptLanguage** | `ru`, `uz`, `en` | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

### Return type

[**ReferenceCountries200Response**](ReferenceCountries200Response.md)

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


## referenceFeaturedFlightLocations

> ReferenceFeaturedFlightLocations200Response referenceFeaturedFlightLocations(acceptLanguage)

List featured flight locations

### Example

```ts
import {
  Configuration,
  ReferenceApi,
} from '';
import type { ReferenceFeaturedFlightLocationsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ReferenceApi();

  const body = {
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies ReferenceFeaturedFlightLocationsRequest;

  try {
    const data = await api.referenceFeaturedFlightLocations(body);
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
| **acceptLanguage** | `ru`, `uz`, `en` | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

### Return type

[**ReferenceFeaturedFlightLocations200Response**](ReferenceFeaturedFlightLocations200Response.md)

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


## referenceSugges

> ReferenceSuggest200Response referenceSuggest(q, types, countryId, limit, acceptLanguage)

Suggest countries, cities and airports

### Example

```ts
import {
  Configuration,
  ReferenceApi,
} from '';
import type { ReferenceSuggestRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ReferenceApi();

  const body = {
    // string
    q: q_example,
    // Array<'country' | 'city' | 'airport'> (optional)
    types: ...,
    // string (optional)
    countryId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // number (optional)
    limit: 8.14,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies ReferenceSuggestRequest;

  try {
    const data = await api.referenceSuggest(body);
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
| **q** | `string` |  | [Defaults to `undefined`] |
| **types** | `country`, `city`, `airport` |  | [Optional] [Enum: country, city, airport] |
| **countryId** | `string` |  | [Optional] [Defaults to `undefined`] |
| **limit** | `number` |  | [Optional] [Defaults to `20`] |
| **acceptLanguage** | `ru`, `uz`, `en` | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

### Return type

[**ReferenceSuggest200Response**](ReferenceSuggest200Response.md)

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

