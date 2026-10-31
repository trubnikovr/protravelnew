# AdminCustomersApi

All URIs are relative to _http://localhost_

| Method                                                                            | HTTP request                                          | Description                             |
| --------------------------------------------------------------------------------- | ----------------------------------------------------- | --------------------------------------- |
| [**adminCustomersCreate**](AdminCustomersApi.md#admincustomerscreate)             | **POST** /api/v1/admin/customers                      | Create a customer account               |
| [**adminCustomersDelete**](AdminCustomersApi.md#admincustomersdelete)             | **DELETE** /api/v1/admin/customers/{customerId}       | Delete a customer without order history |
| [**adminCustomersGet**](AdminCustomersApi.md#admincustomersget)                   | **GET** /api/v1/admin/customers/{customerId}          | Get a customer                          |
| [**adminCustomersList**](AdminCustomersApi.md#admincustomerslist)                 | **GET** /api/v1/admin/customers                       | List customers                          |
| [**adminCustomersUpdate**](AdminCustomersApi.md#admincustomersupdate)             | **PATCH** /api/v1/admin/customers/{customerId}        | Update a customer account               |
| [**adminCustomersUpdateStatus**](AdminCustomersApi.md#admincustomersupdatestatus) | **PATCH** /api/v1/admin/customers/{customerId}/status | Block or activate a customer            |

## adminCustomersCreate

> AdminCustomersCreate201Response adminCustomersCreate(createCustomerRequestDto, acceptLanguage)

Create a customer account

### Example

```ts
import {
  Configuration,
  AdminCustomersApi,
} from '';
import type { AdminCustomersCreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminCustomersApi(config);

  const body = {
    // CreateCustomerRequestDto
    createCustomerRequestDto: ...,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies AdminCustomersCreateRequest;

  try {
    const data = await api.adminCustomersCreate(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                         | Type                                                    | Description                        | Notes                                                      |
| ---------------------------- | ------------------------------------------------------- | ---------------------------------- | ---------------------------------------------------------- |
| **createCustomerRequestDto** | [CreateCustomerRequestDto](CreateCustomerRequestDto.md) |                                    |                                                            |
| **acceptLanguage**           | `ru`, `uz`, `en`                                        | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

### Return type

[**AdminCustomersCreate201Response**](AdminCustomersCreate201Response.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **201**     |             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## adminCustomersDelete

> adminCustomersDelete(customerId, acceptLanguage)

Delete a customer without order history

### Example

```ts
import { Configuration, AdminCustomersApi } from "";
import type { AdminCustomersDeleteRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminCustomersApi(config);

  const body = {
    // string
    customerId: customerId_example,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies AdminCustomersDeleteRequest;

  try {
    const data = await api.adminCustomersDelete(body);
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
| **customerId**     | `string`         |                                    | [Defaults to `undefined`]                                  |
| **acceptLanguage** | `ru`, `uz`, `en` | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

### Return type

`void` (Empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **204**     |             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## adminCustomersGet

> AdminCustomersCreate201Response adminCustomersGet(customerId, acceptLanguage)

Get a customer

### Example

```ts
import { Configuration, AdminCustomersApi } from "";
import type { AdminCustomersGetRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminCustomersApi(config);

  const body = {
    // string
    customerId: customerId_example,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies AdminCustomersGetRequest;

  try {
    const data = await api.adminCustomersGet(body);
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
| **customerId**     | `string`         |                                    | [Defaults to `undefined`]                                  |
| **acceptLanguage** | `ru`, `uz`, `en` | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

### Return type

[**AdminCustomersCreate201Response**](AdminCustomersCreate201Response.md)

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

## adminCustomersList

> AdminCustomersList200Response adminCustomersList(page, limit, sortBy, sortDirection, search, status, acceptLanguage)

List customers

### Example

```ts
import { Configuration, AdminCustomersApi } from "";
import type { AdminCustomersListRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminCustomersApi(config);

  const body = {
    // number (optional)
    page: 8.14,
    // number (optional)
    limit: 8.14,
    // 'createdAt' | 'updatedAt' | 'email' | 'firstName' (optional)
    sortBy: sortBy_example,
    // 'asc' | 'desc' (optional)
    sortDirection: sortDirection_example,
    // string (optional)
    search: search_example,
    // 'active' | 'blocked' (optional)
    status: status_example,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies AdminCustomersListRequest;

  try {
    const data = await api.adminCustomersList(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name               | Type                                           | Description                        | Notes                                                                                         |
| ------------------ | ---------------------------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------- |
| **page**           | `number`                                       |                                    | [Optional] [Defaults to `1`]                                                                  |
| **limit**          | `number`                                       |                                    | [Optional] [Defaults to `20`]                                                                 |
| **sortBy**         | `createdAt`, `updatedAt`, `email`, `firstName` |                                    | [Optional] [Defaults to `&#39;createdAt&#39;`] [Enum: createdAt, updatedAt, email, firstName] |
| **sortDirection**  | `asc`, `desc`                                  |                                    | [Optional] [Defaults to `&#39;desc&#39;`] [Enum: asc, desc]                                   |
| **search**         | `string`                                       |                                    | [Optional] [Defaults to `undefined`]                                                          |
| **status**         | `active`, `blocked`                            |                                    | [Optional] [Defaults to `undefined`] [Enum: active, blocked]                                  |
| **acceptLanguage** | `ru`, `uz`, `en`                               | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en]                                    |

### Return type

[**AdminCustomersList200Response**](AdminCustomersList200Response.md)

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

## adminCustomersUpdate

> AdminCustomersCreate201Response adminCustomersUpdate(customerId, updateCustomerRequestDto, acceptLanguage)

Update a customer account

### Example

```ts
import {
  Configuration,
  AdminCustomersApi,
} from '';
import type { AdminCustomersUpdateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminCustomersApi(config);

  const body = {
    // string
    customerId: customerId_example,
    // UpdateCustomerRequestDto
    updateCustomerRequestDto: ...,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies AdminCustomersUpdateRequest;

  try {
    const data = await api.adminCustomersUpdate(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                         | Type                                                    | Description                        | Notes                                                      |
| ---------------------------- | ------------------------------------------------------- | ---------------------------------- | ---------------------------------------------------------- |
| **customerId**               | `string`                                                |                                    | [Defaults to `undefined`]                                  |
| **updateCustomerRequestDto** | [UpdateCustomerRequestDto](UpdateCustomerRequestDto.md) |                                    |                                                            |
| **acceptLanguage**           | `ru`, `uz`, `en`                                        | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

### Return type

[**AdminCustomersCreate201Response**](AdminCustomersCreate201Response.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     |             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## adminCustomersUpdateStatus

> AdminCustomersCreate201Response adminCustomersUpdateStatus(customerId, updateCustomerStatusRequestDto, acceptLanguage)

Block or activate a customer

### Example

```ts
import {
  Configuration,
  AdminCustomersApi,
} from '';
import type { AdminCustomersUpdateStatusRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminCustomersApi(config);

  const body = {
    // string
    customerId: customerId_example,
    // UpdateCustomerStatusRequestDto
    updateCustomerStatusRequestDto: ...,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies AdminCustomersUpdateStatusRequest;

  try {
    const data = await api.adminCustomersUpdateStatus(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                               | Type                                                                | Description                        | Notes                                                      |
| ---------------------------------- | ------------------------------------------------------------------- | ---------------------------------- | ---------------------------------------------------------- |
| **customerId**                     | `string`                                                            |                                    | [Defaults to `undefined`]                                  |
| **updateCustomerStatusRequestDto** | [UpdateCustomerStatusRequestDto](UpdateCustomerStatusRequestDto.md) |                                    |                                                            |
| **acceptLanguage**                 | `ru`, `uz`, `en`                                                    | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

### Return type

[**AdminCustomersCreate201Response**](AdminCustomersCreate201Response.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     |             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
