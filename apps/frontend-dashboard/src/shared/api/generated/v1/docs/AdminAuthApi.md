# AdminAuthApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**adminAuthLogin**](AdminAuthApi.md#adminauthlogin) | **POST** /api/v1/admin/auth/login | Sign in to the administrative API |
| [**adminAuthRevokeAll**](AdminAuthApi.md#adminauthrevokeall) | **POST** /api/v1/admin/auth/revoke-all | Revoke all access tokens of the current administrator |



## adminAuthLogin

> AdminAuthLogin200Response adminAuthLogin(adminLoginRequestDto)

Sign in to the administrative API

### Example

```ts
import {
  Configuration,
  AdminAuthApi,
} from '';
import type { AdminAuthLoginRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AdminAuthApi();

  const body = {
    // AdminLoginRequestDto
    adminLoginRequestDto: ...,
  } satisfies AdminAuthLoginRequest;

  try {
    const data = await api.adminAuthLogin(body);
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
| **adminLoginRequestDto** | [AdminLoginRequestDto](AdminLoginRequestDto.md) |  | |

### Return type

[**AdminAuthLogin200Response**](AdminAuthLogin200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminAuthRevokeAll

> AdminAuthRevokeAll200Response adminAuthRevokeAll()

Revoke all access tokens of the current administrator

### Example

```ts
import {
  Configuration,
  AdminAuthApi,
} from '';
import type { AdminAuthRevokeAllRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminAuthApi(config);

  try {
    const data = await api.adminAuthRevokeAll();
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

[**AdminAuthRevokeAll200Response**](AdminAuthRevokeAll200Response.md)

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

