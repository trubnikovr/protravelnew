# NewsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**newsList**](NewsApi.md#newslist) | **GET** /api/v1/news | List published news for the mobile application |
| [**newsMarkRead**](NewsApi.md#newsmarkread) | **POST** /api/v1/news/{newsId}/read | Mark a news article as read for this reader |
| [**newsUnreadStatus**](NewsApi.md#newsunreadstatus) | **GET** /api/v1/news/unread-status | Get unread news status for this reader |



## newsLis

> NewsList200Response newsList(acceptLanguage)

List published news for the mobile application

### Example

```ts
import {
  Configuration,
  NewsApi,
} from '';
import type { NewsListRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new NewsApi();

  const body = {
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies NewsListRequest;

  try {
    const data = await api.newsList(body);
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

[**NewsList200Response**](NewsList200Response.md)

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


## newsMarkRead

> NewsMarkRead200Response newsMarkRead(newsId, acceptLanguage)

Mark a news article as read for this reader

### Example

```ts
import {
  Configuration,
  NewsApi,
} from '';
import type { NewsMarkReadRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new NewsApi();

  const body = {
    // string
    newsId: newsId_example,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies NewsMarkReadRequest;

  try {
    const data = await api.newsMarkRead(body);
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
| **newsId** | `string` |  | [Defaults to `undefined`] |
| **acceptLanguage** | `ru`, `uz`, `en` | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

### Return type

[**NewsMarkRead200Response**](NewsMarkRead200Response.md)

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


## newsUnreadStatus

> NewsUnreadStatus200Response newsUnreadStatus(acceptLanguage)

Get unread news status for this reader

### Example

```ts
import {
  Configuration,
  NewsApi,
} from '';
import type { NewsUnreadStatusRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new NewsApi();

  const body = {
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies NewsUnreadStatusRequest;

  try {
    const data = await api.newsUnreadStatus(body);
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

[**NewsUnreadStatus200Response**](NewsUnreadStatus200Response.md)

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

