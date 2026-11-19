# FilesApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**imageTransformTransform**](FilesApi.md#imagetransformtransform) | **GET** /api/v1/files/image-transform | Render a named uploaded-image preset and return cached WebP |



## imageTransformTransform

> Blob imageTransformTransform(src, preset, acceptLanguage)

Render a named uploaded-image preset and return cached WebP

### Example

```ts
import {
  Configuration,
  FilesApi,
} from '';
import type { ImageTransformTransformRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new FilesApi();

  const body = {
    // string
    src: http://localhost:3000/api/v1/files/images/550e8400-e29b-41d4-a716-446655440000.jpg,
    // 'home-card'
    preset: home-card,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies ImageTransformTransformRequest;

  try {
    const data = await api.imageTransformTransform(body);
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
| **src** | `string` |  | [Defaults to `undefined`] |
| **preset** | `home-card` |  | [Defaults to `undefined`] [Enum: home-card] |
| **acceptLanguage** | `ru`, `uz`, `en` | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

### Return type

**Blob**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `image/webp`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |
| **404** | Source image was not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

