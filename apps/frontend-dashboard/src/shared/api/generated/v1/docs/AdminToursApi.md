# AdminToursApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**adminToursCreate**](AdminToursApi.md#admintourscreate) | **POST** /api/v1/admin/tours | Create a typed tour with route and departures |
| [**adminToursDelete**](AdminToursApi.md#admintoursdelete) | **DELETE** /api/v1/admin/tours/{id} | Delete a tour and all related records |
| [**adminToursGet**](AdminToursApi.md#admintoursget) | **GET** /api/v1/admin/tours/{id} | Get an administrative tour |
| [**adminToursList**](AdminToursApi.md#admintourslist) | **GET** /api/v1/admin/tours | List tours for administration |
| [**adminToursUpdate**](AdminToursApi.md#admintoursupdate) | **PATCH** /api/v1/admin/tours/{id} | Update a typed tour |



## adminToursCreate

> AdminToursCreate201Response adminToursCreate(createTourRequestDto, acceptLanguage)

Create a typed tour with route and departures

### Example

```ts
import {
  Configuration,
  AdminToursApi,
} from '';
import type { AdminToursCreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminToursApi(config);

  const body = {
    // CreateTourRequestDto
    createTourRequestDto: ...,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies AdminToursCreateRequest;

  try {
    const data = await api.adminToursCreate(body);
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
| **createTourRequestDto** | [CreateTourRequestDto](CreateTourRequestDto.md) |  | |
| **acceptLanguage** | `ru`, `uz`, `en` | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

### Return type

[**AdminToursCreate201Response**](AdminToursCreate201Response.md)

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


## adminToursDelete

> adminToursDelete(id, acceptLanguage)

Delete a tour and all related records

### Example

```ts
import {
  Configuration,
  AdminToursApi,
} from '';
import type { AdminToursDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminToursApi(config);

  const body = {
    // string
    id: id_example,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies AdminToursDeleteRequest;

  try {
    const data = await api.adminToursDelete(body);
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

`void` (Empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminToursGet

> AdminToursCreate201Response adminToursGet(id, acceptLanguage)

Get an administrative tour

### Example

```ts
import {
  Configuration,
  AdminToursApi,
} from '';
import type { AdminToursGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminToursApi(config);

  const body = {
    // string
    id: id_example,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies AdminToursGetRequest;

  try {
    const data = await api.adminToursGet(body);
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

[**AdminToursCreate201Response**](AdminToursCreate201Response.md)

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


## adminToursList

> AdminToursList200Response adminToursList(page, limit, sortBy, sortDirection, status, type, search, acceptLanguage)

List tours for administration

### Example

```ts
import {
  Configuration,
  AdminToursApi,
} from '';
import type { AdminToursListRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminToursApi(config);

  const body = {
    // number (optional)
    page: 8.14,
    // number (optional)
    limit: 8.14,
    // 'createdAt' | 'updatedAt' | 'sortOrder' | 'price' | 'durationDays' (optional)
    sortBy: sortBy_example,
    // 'asc' | 'desc' (optional)
    sortDirection: sortDirection_example,
    // 'draft' | 'published' | 'archived' (optional)
    status: status_example,
    // 'package' | 'excursion' (optional)
    type: type_example,
    // string (optional)
    search: search_example,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies AdminToursListRequest;

  try {
    const data = await api.adminToursList(body);
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
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **limit** | `number` |  | [Optional] [Defaults to `20`] |
| **sortBy** | `createdAt`, `updatedAt`, `sortOrder`, `price`, `durationDays` |  | [Optional] [Defaults to `&#39;createdAt&#39;`] [Enum: createdAt, updatedAt, sortOrder, price, durationDays] |
| **sortDirection** | `asc`, `desc` |  | [Optional] [Defaults to `&#39;desc&#39;`] [Enum: asc, desc] |
| **status** | `draft`, `published`, `archived` |  | [Optional] [Defaults to `undefined`] [Enum: draft, published, archived] |
| **type** | `package`, `excursion` |  | [Optional] [Defaults to `undefined`] [Enum: package, excursion] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **acceptLanguage** | `ru`, `uz`, `en` | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

### Return type

[**AdminToursList200Response**](AdminToursList200Response.md)

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


## adminToursUpdate

> AdminToursCreate201Response adminToursUpdate(id, updateTourRequestDto, acceptLanguage)

Update a typed tour

### Example

```ts
import {
  Configuration,
  AdminToursApi,
} from '';
import type { AdminToursUpdateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminToursApi(config);

  const body = {
    // string
    id: id_example,
    // UpdateTourRequestDto
    updateTourRequestDto: ...,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies AdminToursUpdateRequest;

  try {
    const data = await api.adminToursUpdate(body);
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
| **updateTourRequestDto** | [UpdateTourRequestDto](UpdateTourRequestDto.md) |  | |
| **acceptLanguage** | `ru`, `uz`, `en` | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

### Return type

[**AdminToursCreate201Response**](AdminToursCreate201Response.md)

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

