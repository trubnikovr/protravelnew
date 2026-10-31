# CustomerAuthApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**customerAuthLogin**](CustomerAuthApi.md#customerauthlogin) | **POST** /api/v1/auth/login | Request a customer login SMS code |
| [**customerAuthRefresh**](CustomerAuthApi.md#customerauthrefresh) | **POST** /api/v1/auth/refresh | Rotate customer access and refresh tokens |
| [**customerAuthVerify**](CustomerAuthApi.md#customerauthverify) | **POST** /api/v1/auth/verify | Verify customer login code and create a session |



## customerAuthLogin

> CustomerAuthLogin202Response customerAuthLogin(customerLoginRequestDto, acceptLanguage)

Request a customer login SMS code

### Example

```ts
import {
  Configuration,
  CustomerAuthApi,
} from '';
import type { CustomerAuthLoginRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new CustomerAuthApi();

  const body = {
    // CustomerLoginRequestDto
    customerLoginRequestDto: ...,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies CustomerAuthLoginRequest;

  try {
    const data = await api.customerAuthLogin(body);
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
| **customerLoginRequestDto** | [CustomerLoginRequestDto](CustomerLoginRequestDto.md) |  | |
| **acceptLanguage** | `ru`, `uz`, `en` | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

### Return type

[**CustomerAuthLogin202Response**](CustomerAuthLogin202Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **202** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## customerAuthRefresh

> CustomerAuthVerify200Response customerAuthRefresh(refreshCustomerTokenRequestDto, acceptLanguage)

Rotate customer access and refresh tokens

### Example

```ts
import {
  Configuration,
  CustomerAuthApi,
} from '';
import type { CustomerAuthRefreshRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new CustomerAuthApi();

  const body = {
    // RefreshCustomerTokenRequestDto
    refreshCustomerTokenRequestDto: ...,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies CustomerAuthRefreshRequest;

  try {
    const data = await api.customerAuthRefresh(body);
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
| **refreshCustomerTokenRequestDto** | [RefreshCustomerTokenRequestDto](RefreshCustomerTokenRequestDto.md) |  | |
| **acceptLanguage** | `ru`, `uz`, `en` | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

### Return type

[**CustomerAuthVerify200Response**](CustomerAuthVerify200Response.md)

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


## customerAuthVerify

> CustomerAuthVerify200Response customerAuthVerify(verifyCustomerLoginRequestDto, acceptLanguage)

Verify customer login code and create a session

### Example

```ts
import {
  Configuration,
  CustomerAuthApi,
} from '';
import type { CustomerAuthVerifyRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new CustomerAuthApi();

  const body = {
    // VerifyCustomerLoginRequestDto
    verifyCustomerLoginRequestDto: ...,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies CustomerAuthVerifyRequest;

  try {
    const data = await api.customerAuthVerify(body);
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
| **verifyCustomerLoginRequestDto** | [VerifyCustomerLoginRequestDto](VerifyCustomerLoginRequestDto.md) |  | |
| **acceptLanguage** | `ru`, `uz`, `en` | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

### Return type

[**CustomerAuthVerify200Response**](CustomerAuthVerify200Response.md)

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

