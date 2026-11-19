# MePaymentsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**customerPaymentsCreate**](MePaymentsApi.md#customerpaymentscreate) | **POST** /api/v1/me/payments | Create hosted payment for an owned order |
| [**customerPaymentsGet**](MePaymentsApi.md#customerpaymentsget) | **GET** /api/v1/me/payments/{id} | Get owned payment status |



## customerPaymentsCreate

> CustomerPaymentsCreate201Response customerPaymentsCreate(idempotencyKey, createPaymentRequestDto, acceptLanguage)

Create hosted payment for an owned order

### Example

```ts
import {
  Configuration,
  MePaymentsApi,
} from '';
import type { CustomerPaymentsCreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new MePaymentsApi(config);

  const body = {
    // string
    idempotencyKey: idempotencyKey_example,
    // CreatePaymentRequestDto
    createPaymentRequestDto: ...,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies CustomerPaymentsCreateRequest;

  try {
    const data = await api.customerPaymentsCreate(body);
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
| **idempotencyKey** | `string` |  | [Defaults to `undefined`] |
| **createPaymentRequestDto** | [CreatePaymentRequestDto](CreatePaymentRequestDto.md) |  | |
| **acceptLanguage** | `ru`, `uz`, `en` | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

### Return type

[**CustomerPaymentsCreate201Response**](CustomerPaymentsCreate201Response.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## customerPaymentsGet

> CustomerPaymentsCreate201Response customerPaymentsGet(id, acceptLanguage)

Get owned payment status

### Example

```ts
import {
  Configuration,
  MePaymentsApi,
} from '';
import type { CustomerPaymentsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new MePaymentsApi(config);

  const body = {
    // string
    id: id_example,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies CustomerPaymentsGetRequest;

  try {
    const data = await api.customerPaymentsGet(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |
| **acceptLanguage** | `ru`, `uz`, `en` | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

### Return type

[**CustomerPaymentsCreate201Response**](CustomerPaymentsCreate201Response.md)

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

