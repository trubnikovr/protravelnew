# CustomerProfileApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**customerProfileMe**](CustomerProfileApi.md#customerprofileme) | **GET** /api/v1/users/me | Get current customer profile |
| [**customerProfileUpdate**](CustomerProfileApi.md#customerprofileupdate) | **PATCH** /api/v1/users/me | Update current customer profile |



## customerProfileMe

> CustomerProfileMe200Response customerProfileMe()

Get current customer profile

### Example

```ts
import {
  Configuration,
  CustomerProfileApi,
} from '';
import type { CustomerProfileMeRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CustomerProfileApi(config);

  try {
    const data = await api.customerProfileMe();
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

[**CustomerProfileMe200Response**](CustomerProfileMe200Response.md)

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


## customerProfileUpdate

> CustomerProfileMe200Response customerProfileUpdate(updateCustomerProfileRequestDto)

Update current customer profile

### Example

```ts
import {
  Configuration,
  CustomerProfileApi,
} from '';
import type { CustomerProfileUpdateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CustomerProfileApi(config);

  const body = {
    // UpdateCustomerProfileRequestDto
    updateCustomerProfileRequestDto: ...,
  } satisfies CustomerProfileUpdateRequest;

  try {
    const data = await api.customerProfileUpdate(body);
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
| **updateCustomerProfileRequestDto** | [UpdateCustomerProfileRequestDto](UpdateCustomerProfileRequestDto.md) |  | |

### Return type

[**CustomerProfileMe200Response**](CustomerProfileMe200Response.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

