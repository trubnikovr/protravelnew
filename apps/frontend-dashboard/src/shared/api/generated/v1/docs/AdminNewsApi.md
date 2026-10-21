# AdminNewsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**adminNewsCreate**](AdminNewsApi.md#adminnewscreate) | **POST** /api/v1/admin/news | Create a news article |
| [**adminNewsDelete**](AdminNewsApi.md#adminnewsdelete) | **DELETE** /api/v1/admin/news/{id} | Delete a news article |
| [**adminNewsList**](AdminNewsApi.md#adminnewslist) | **GET** /api/v1/admin/news | List all news articles |
| [**adminNewsUpdate**](AdminNewsApi.md#adminnewsupdate) | **PATCH** /api/v1/admin/news/{id} | Update or publish a news article |



## adminNewsCreate

> AdminNewsCreate201Response adminNewsCreate(createAdminNewsRequestDto)

Create a news article

### Example

```ts
import {
  Configuration,
  AdminNewsApi,
} from '';
import type { AdminNewsCreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminNewsApi(config);

  const body = {
    // CreateAdminNewsRequestDto
    createAdminNewsRequestDto: ...,
  } satisfies AdminNewsCreateRequest;

  try {
    const data = await api.adminNewsCreate(body);
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
| **createAdminNewsRequestDto** | [CreateAdminNewsRequestDto](CreateAdminNewsRequestDto.md) |  | |

### Return type

[**AdminNewsCreate201Response**](AdminNewsCreate201Response.md)

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


## adminNewsDelete

> adminNewsDelete(id)

Delete a news article

### Example

```ts
import {
  Configuration,
  AdminNewsApi,
} from '';
import type { AdminNewsDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminNewsApi(config);

  const body = {
    // string
    id: id_example,
  } satisfies AdminNewsDeleteRequest;

  try {
    const data = await api.adminNewsDelete(body);
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


## adminNewsList

> AdminNewsList200Response adminNewsList()

List all news articles

### Example

```ts
import {
  Configuration,
  AdminNewsApi,
} from '';
import type { AdminNewsListRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminNewsApi(config);

  try {
    const data = await api.adminNewsList();
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

[**AdminNewsList200Response**](AdminNewsList200Response.md)

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


## adminNewsUpdate

> AdminNewsCreate201Response adminNewsUpdate(id, updateAdminNewsRequestDto)

Update or publish a news article

### Example

```ts
import {
  Configuration,
  AdminNewsApi,
} from '';
import type { AdminNewsUpdateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminNewsApi(config);

  const body = {
    // string
    id: id_example,
    // UpdateAdminNewsRequestDto
    updateAdminNewsRequestDto: ...,
  } satisfies AdminNewsUpdateRequest;

  try {
    const data = await api.adminNewsUpdate(body);
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
| **updateAdminNewsRequestDto** | [UpdateAdminNewsRequestDto](UpdateAdminNewsRequestDto.md) |  | |

### Return type

[**AdminNewsCreate201Response**](AdminNewsCreate201Response.md)

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

