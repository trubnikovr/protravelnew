# ToursApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**toursGet**](ToursApi.md#toursget) | **GET** /api/v1/tours/{id} | Get a published tour with full customer content |
| [**toursList**](ToursApi.md#tourslist) | **GET** /api/v1/tours | List published tours for mobile catalog |



## toursGet

> ToursGet200Response toursGet(id)

Get a published tour with full customer content

### Example

```ts
import {
  Configuration,
  ToursApi,
} from '';
import type { ToursGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ToursApi();

  const body = {
    // string
    id: id_example,
  } satisfies ToursGetRequest;

  try {
    const data = await api.toursGet(body);
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

[**ToursGet200Response**](ToursGet200Response.md)

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


## toursList

> ToursList200Response toursList(page, limit, destination, sort)

List published tours for mobile catalog

### Example

```ts
import {
  Configuration,
  ToursApi,
} from '';
import type { ToursListRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ToursApi();

  const body = {
    // number (optional)
    page: 8.14,
    // number (optional)
    limit: 8.14,
    // string | Country or city name (optional)
    destination: destination_example,
    // 'recommended' | 'price' (optional)
    sort: sort_example,
  } satisfies ToursListRequest;

  try {
    const data = await api.toursList(body);
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
| **destination** | `string` | Country or city name | [Optional] [Defaults to `undefined`] |
| **sort** | `recommended`, `price` |  | [Optional] [Defaults to `&#39;recommended&#39;`] [Enum: recommended, price] |

### Return type

[**ToursList200Response**](ToursList200Response.md)

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

