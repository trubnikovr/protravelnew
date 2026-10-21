# AdminSystemMessagesApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**adminSystemMessagesCreate**](AdminSystemMessagesApi.md#adminsystemmessagescreate) | **POST** /api/v1/admin/system-messages | Create a mobile system message |
| [**adminSystemMessagesDelete**](AdminSystemMessagesApi.md#adminsystemmessagesdelete) | **DELETE** /api/v1/admin/system-messages/{id} | Delete a mobile system message |
| [**adminSystemMessagesList**](AdminSystemMessagesApi.md#adminsystemmessageslist) | **GET** /api/v1/admin/system-messages | List all mobile system messages |
| [**adminSystemMessagesUpdate**](AdminSystemMessagesApi.md#adminsystemmessagesupdate) | **PATCH** /api/v1/admin/system-messages/{id} | Update or activate a mobile system message |



## adminSystemMessagesCreate

> AdminSystemMessagesCreate201Response adminSystemMessagesCreate(createSystemMessageRequestDto)

Create a mobile system message

### Example

```ts
import {
  Configuration,
  AdminSystemMessagesApi,
} from '';
import type { AdminSystemMessagesCreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminSystemMessagesApi(config);

  const body = {
    // CreateSystemMessageRequestDto
    createSystemMessageRequestDto: ...,
  } satisfies AdminSystemMessagesCreateRequest;

  try {
    const data = await api.adminSystemMessagesCreate(body);
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
| **createSystemMessageRequestDto** | [CreateSystemMessageRequestDto](CreateSystemMessageRequestDto.md) |  | |

### Return type

[**AdminSystemMessagesCreate201Response**](AdminSystemMessagesCreate201Response.md)

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


## adminSystemMessagesDelete

> adminSystemMessagesDelete(id)

Delete a mobile system message

### Example

```ts
import {
  Configuration,
  AdminSystemMessagesApi,
} from '';
import type { AdminSystemMessagesDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminSystemMessagesApi(config);

  const body = {
    // string
    id: id_example,
  } satisfies AdminSystemMessagesDeleteRequest;

  try {
    const data = await api.adminSystemMessagesDelete(body);
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


## adminSystemMessagesList

> AdminSystemMessagesList200Response adminSystemMessagesList()

List all mobile system messages

### Example

```ts
import {
  Configuration,
  AdminSystemMessagesApi,
} from '';
import type { AdminSystemMessagesListRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminSystemMessagesApi(config);

  try {
    const data = await api.adminSystemMessagesList();
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

[**AdminSystemMessagesList200Response**](AdminSystemMessagesList200Response.md)

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


## adminSystemMessagesUpdate

> AdminSystemMessagesCreate201Response adminSystemMessagesUpdate(id, updateSystemMessageRequestDto)

Update or activate a mobile system message

### Example

```ts
import {
  Configuration,
  AdminSystemMessagesApi,
} from '';
import type { AdminSystemMessagesUpdateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminSystemMessagesApi(config);

  const body = {
    // string
    id: id_example,
    // UpdateSystemMessageRequestDto
    updateSystemMessageRequestDto: ...,
  } satisfies AdminSystemMessagesUpdateRequest;

  try {
    const data = await api.adminSystemMessagesUpdate(body);
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
| **updateSystemMessageRequestDto** | [UpdateSystemMessageRequestDto](UpdateSystemMessageRequestDto.md) |  | |

### Return type

[**AdminSystemMessagesCreate201Response**](AdminSystemMessagesCreate201Response.md)

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

