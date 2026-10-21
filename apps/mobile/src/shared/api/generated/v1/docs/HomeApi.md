# HomeApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**homeGet**](HomeApi.md#homeget) | **GET** /api/v1/home | Get curated content for the mobile home screen |



## homeGet

> HomeGet200Response homeGet()

Get curated content for the mobile home screen

### Example

```ts
import {
  Configuration,
  HomeApi,
} from '';
import type { HomeGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new HomeApi();

  try {
    const data = await api.homeGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**HomeGet200Response**](HomeGet200Response.md)

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

