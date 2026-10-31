# AdminTravelFactsApi

All URIs are relative to _http://localhost_

| Method                                                                      | HTTP request                               | Description           |
| --------------------------------------------------------------------------- | ------------------------------------------ | --------------------- |
| [**adminTravelFactsCreate**](AdminTravelFactsApi.md#admintravelfactscreate) | **POST** /api/v1/admin/travel-facts        | Create a travel fact  |
| [**adminTravelFactsDelete**](AdminTravelFactsApi.md#admintravelfactsdelete) | **DELETE** /api/v1/admin/travel-facts/{id} | Delete a travel fact  |
| [**adminTravelFactsList**](AdminTravelFactsApi.md#admintravelfactslist)     | **GET** /api/v1/admin/travel-facts         | List all travel facts |
| [**adminTravelFactsUpdate**](AdminTravelFactsApi.md#admintravelfactsupdate) | **PATCH** /api/v1/admin/travel-facts/{id}  | Update a travel fact  |

## adminTravelFactsCreate

> AdminTravelFactsCreate201Response adminTravelFactsCreate(createTravelFactRequestDto, acceptLanguage)

Create a travel fact

### Example

```ts
import {
  Configuration,
  AdminTravelFactsApi,
} from '';
import type { AdminTravelFactsCreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminTravelFactsApi(config);

  const body = {
    // CreateTravelFactRequestDto
    createTravelFactRequestDto: ...,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies AdminTravelFactsCreateRequest;

  try {
    const data = await api.adminTravelFactsCreate(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                           | Type                                                        | Description                        | Notes                                                      |
| ------------------------------ | ----------------------------------------------------------- | ---------------------------------- | ---------------------------------------------------------- |
| **createTravelFactRequestDto** | [CreateTravelFactRequestDto](CreateTravelFactRequestDto.md) |                                    |                                                            |
| **acceptLanguage**             | `ru`, `uz`, `en`                                            | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

### Return type

[**AdminTravelFactsCreate201Response**](AdminTravelFactsCreate201Response.md)

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

## adminTravelFactsDelete

> adminTravelFactsDelete(id, acceptLanguage)

Delete a travel fact

### Example

```ts
import { Configuration, AdminTravelFactsApi } from "";
import type { AdminTravelFactsDeleteRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminTravelFactsApi(config);

  const body = {
    // string
    id: id_example,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies AdminTravelFactsDeleteRequest;

  try {
    const data = await api.adminTravelFactsDelete(body);
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
| **id**             | `string`         |                                    | [Defaults to `undefined`]                                  |
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

## adminTravelFactsList

> AdminTravelFactsList200Response adminTravelFactsList(acceptLanguage)

List all travel facts

### Example

```ts
import { Configuration, AdminTravelFactsApi } from "";
import type { AdminTravelFactsListRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminTravelFactsApi(config);

  const body = {
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies AdminTravelFactsListRequest;

  try {
    const data = await api.adminTravelFactsList(body);
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

[**AdminTravelFactsList200Response**](AdminTravelFactsList200Response.md)

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

## adminTravelFactsUpdate

> AdminTravelFactsCreate201Response adminTravelFactsUpdate(id, updateTravelFactRequestDto, acceptLanguage)

Update a travel fact

### Example

```ts
import {
  Configuration,
  AdminTravelFactsApi,
} from '';
import type { AdminTravelFactsUpdateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminTravelFactsApi(config);

  const body = {
    // string
    id: id_example,
    // UpdateTravelFactRequestDto
    updateTravelFactRequestDto: ...,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies AdminTravelFactsUpdateRequest;

  try {
    const data = await api.adminTravelFactsUpdate(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                           | Type                                                        | Description                        | Notes                                                      |
| ------------------------------ | ----------------------------------------------------------- | ---------------------------------- | ---------------------------------------------------------- |
| **id**                         | `string`                                                    |                                    | [Defaults to `undefined`]                                  |
| **updateTravelFactRequestDto** | [UpdateTravelFactRequestDto](UpdateTravelFactRequestDto.md) |                                    |                                                            |
| **acceptLanguage**             | `ru`, `uz`, `en`                                            | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

### Return type

[**AdminTravelFactsCreate201Response**](AdminTravelFactsCreate201Response.md)

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
