# AdminFeaturedFlightLocationsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**adminFeaturedFlightLocationsList**](AdminFeaturedFlightLocationsApi.md#adminfeaturedflightlocationslist) | **GET** /api/v1/admin/featured-flight-locations |  |
| [**adminFeaturedFlightLocationsReplace**](AdminFeaturedFlightLocationsApi.md#adminfeaturedflightlocationsreplace) | **PUT** /api/v1/admin/featured-flight-locations | Replace mobile featured flight locations |



## adminFeaturedFlightLocationsList

> ReferenceFeaturedFlightLocations200Response adminFeaturedFlightLocationsList(acceptLanguage)



### Example

```ts
import {
  Configuration,
  AdminFeaturedFlightLocationsApi,
} from '';
import type { AdminFeaturedFlightLocationsListRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminFeaturedFlightLocationsApi(config);

  const body = {
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies AdminFeaturedFlightLocationsListRequest;

  try {
    const data = await api.adminFeaturedFlightLocationsList(body);
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
| **acceptLanguage** | `ru`, `uz`, `en` | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

### Return type

[**ReferenceFeaturedFlightLocations200Response**](ReferenceFeaturedFlightLocations200Response.md)

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


## adminFeaturedFlightLocationsReplace

> ReferenceFeaturedFlightLocations200Response adminFeaturedFlightLocationsReplace(featuredFlightLocationRequestDto, acceptLanguage)

Replace mobile featured flight locations

### Example

```ts
import {
  Configuration,
  AdminFeaturedFlightLocationsApi,
} from '';
import type { AdminFeaturedFlightLocationsReplaceRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AdminFeaturedFlightLocationsApi(config);

  const body = {
    // Array<FeaturedFlightLocationRequestDto>
    featuredFlightLocationRequestDto: ...,
    // 'ru' | 'uz' | 'en' | Response language. Defaults to ru. (optional)
    acceptLanguage: acceptLanguage_example,
  } satisfies AdminFeaturedFlightLocationsReplaceRequest;

  try {
    const data = await api.adminFeaturedFlightLocationsReplace(body);
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
| **featuredFlightLocationRequestDto** | `Array<FeaturedFlightLocationRequestDto>` |  | |
| **acceptLanguage** | `ru`, `uz`, `en` | Response language. Defaults to ru. | [Optional] [Defaults to `&#39;ru&#39;`] [Enum: ru, uz, en] |

### Return type

[**ReferenceFeaturedFlightLocations200Response**](ReferenceFeaturedFlightLocations200Response.md)

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

