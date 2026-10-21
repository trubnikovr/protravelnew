# SystemMessagesApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**systemMessagesList**](SystemMessagesApi.md#systemmessageslist) | **GET** /api/v1/system-messages | List active messages displayed by mobile clients |



## systemMessagesList

> SystemMessagesList200Response systemMessagesList()

List active messages displayed by mobile clients

### Example

```ts
import {
  Configuration,
  SystemMessagesApi,
} from '';
import type { SystemMessagesListRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SystemMessagesApi();

  try {
    const data = await api.systemMessagesList();
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

[**SystemMessagesList200Response**](SystemMessagesList200Response.md)

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

