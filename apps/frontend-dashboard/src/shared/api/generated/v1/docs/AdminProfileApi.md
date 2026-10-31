# AdminProfileApi

All URIs are relative to _http://localhost_

| Method                                                  | HTTP request             | Description                       |
| ------------------------------------------------------- | ------------------------ | --------------------------------- |
| [**adminProfileMe**](AdminProfileApi.md#adminprofileme) | **GET** /api/v1/admin/me | Get current administrator profile |

## adminProfileMe

> AdminProfileMe200Response adminProfileMe(acceptLanguage)

Get current administrator profile

### Example

```ts
import { Configuration, AdminProfileApi } from "";
import type { AdminProfileMeRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminProfileApi(config);

  const body = {
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies AdminProfileMeRequest;

  try {
    const data = await api.adminProfileMe(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name               | Type             | Description                        | Notes                                                      |
| ------------------ | ---------------- | ---------------------------------- | ---------------------------------------------------------- |
| **acceptLanguage** | `ru`, `uz`, `en` | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

### Return type

[**AdminProfileMe200Response**](AdminProfileMe200Response.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     |             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
