# SystemHealthApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**healthLive**](SystemHealthApi.md#healthlive) | **GET** /api/v1/health/live | Check whether the API process is alive |
| [**healthScore**](SystemHealthApi.md#healthscore) | **GET** /api/v1/health | Get the overall weighted system health score |



## healthLive

> HealthLive200Response healthLive(acceptLanguage)

Check whether the API process is alive

### Example

```ts
import {
  Configuration,
  SystemHealthApi,
} from '';
import type { HealthLiveRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SystemHealthApi();

  const body = {
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies HealthLiveRequest;

  try {
    const data = await api.healthLive(body);
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

[**HealthLive200Response**](HealthLive200Response.md)

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


## healthScore

> HealthScore200Response healthScore(acceptLanguage)

Get the overall weighted system health score

### Example

```ts
import {
  Configuration,
  SystemHealthApi,
} from '';
import type { HealthScoreRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SystemHealthApi();

  const body = {
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies HealthScoreRequest;

  try {
    const data = await api.healthScore(body);
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

[**HealthScore200Response**](HealthScore200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |
| **503** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

