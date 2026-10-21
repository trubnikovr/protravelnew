# MeTourBookingsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**customerTourBookingsCreate**](MeTourBookingsApi.md#customertourbookingscreate) | **POST** /api/v1/me/tour-bookings | Create a tour booking request |
| [**customerTourBookingsGet**](MeTourBookingsApi.md#customertourbookingsget) | **GET** /api/v1/me/tour-bookings/{id} | Get own tour booking |
| [**customerTourBookingsList**](MeTourBookingsApi.md#customertourbookingslist) | **GET** /api/v1/me/tour-bookings | List current customer tour bookings |



## customerTourBookingsCreate

> CustomerTourBookingsCreate201Response customerTourBookingsCreate(createCustomerTourBookingRequestDto)

Create a tour booking request

### Example

```ts
import {
  Configuration,
  MeTourBookingsApi,
} from '';
import type { CustomerTourBookingsCreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new MeTourBookingsApi(config);

  const body = {
    // CreateCustomerTourBookingRequestDto
    createCustomerTourBookingRequestDto: ...,
  } satisfies CustomerTourBookingsCreateRequest;

  try {
    const data = await api.customerTourBookingsCreate(body);
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
| **createCustomerTourBookingRequestDto** | [CreateCustomerTourBookingRequestDto](CreateCustomerTourBookingRequestDto.md) |  | |

### Return type

[**CustomerTourBookingsCreate201Response**](CustomerTourBookingsCreate201Response.md)

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


## customerTourBookingsGet

> CustomerTourBookingsCreate201Response customerTourBookingsGet(id)

Get own tour booking

### Example

```ts
import {
  Configuration,
  MeTourBookingsApi,
} from '';
import type { CustomerTourBookingsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new MeTourBookingsApi(config);

  const body = {
    // string
    id: id_example,
  } satisfies CustomerTourBookingsGetRequest;

  try {
    const data = await api.customerTourBookingsGet(body);
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

[**CustomerTourBookingsCreate201Response**](CustomerTourBookingsCreate201Response.md)

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


## customerTourBookingsList

> CustomerTourBookingsList200Response customerTourBookingsList(page, limit, sortBy, sortDirection)

List current customer tour bookings

### Example

```ts
import {
  Configuration,
  MeTourBookingsApi,
} from '';
import type { CustomerTourBookingsListRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new MeTourBookingsApi(config);

  const body = {
    // number (optional)
    page: 8.14,
    // number (optional)
    limit: 8.14,
    // string (optional)
    sortBy: sortBy_example,
    // 'asc' | 'desc' (optional)
    sortDirection: sortDirection_example,
  } satisfies CustomerTourBookingsListRequest;

  try {
    const data = await api.customerTourBookingsList(body);
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
| **sortBy** | `string` |  | [Optional] [Defaults to `&#39;createdAt&#39;`] |
| **sortDirection** | `asc`, `desc` |  | [Optional] [Defaults to `&#39;desc&#39;`] [Enum: asc, desc] |

### Return type

[**CustomerTourBookingsList200Response**](CustomerTourBookingsList200Response.md)

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

