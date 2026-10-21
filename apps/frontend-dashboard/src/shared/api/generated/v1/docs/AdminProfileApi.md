# AdminProfileApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**adminProfileMe**](AdminProfileApi.md#adminprofileme) | **GET** /api/v1/admin/me | Get current administrator profile |



## adminProfileMe

> AdminProfileMe200Response adminProfileMe()

Get current administrator profile

### Example

```ts
import {
  Configuration,
  AdminProfileApi,
} from '';
import type { AdminProfileMeRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminProfileApi(config);

  try {
    const data = await api.adminProfileMe();
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

[**AdminProfileMe200Response**](AdminProfileMe200Response.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

