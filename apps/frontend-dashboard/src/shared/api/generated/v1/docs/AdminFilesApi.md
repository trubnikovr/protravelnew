# AdminFilesApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**adminFilesUploadImage**](AdminFilesApi.md#adminfilesuploadimage) | **POST** /api/v1/admin/files/images | Upload an image for administrative content |



## adminFilesUploadImage

> AdminFilesUploadImage201Response adminFilesUploadImage(file)

Upload an image for administrative content

### Example

```ts
import {
  Configuration,
  AdminFilesApi,
} from '';
import type { AdminFilesUploadImageRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminFilesApi(config);

  const body = {
    // Blob
    file: BINARY_DATA_HERE,
  } satisfies AdminFilesUploadImageRequest;

  try {
    const data = await api.adminFilesUploadImage(body);
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
| **file** | `Blob` |  | [Defaults to `undefined`] |

### Return type

[**AdminFilesUploadImage201Response**](AdminFilesUploadImage201Response.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: `multipart/form-data`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

