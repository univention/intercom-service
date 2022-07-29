package org.openapitools.client.api;

import org.openapitools.client.ApiException;
import org.openapitools.client.ApiClient;
import org.openapitools.client.Configuration;
import org.openapitools.client.Pair;

import javax.ws.rs.core.GenericType;

import org.openapitools.client.model.UsersUser;
import org.openapitools.client.model.UsersUserList;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@javax.annotation.Generated(value = "org.openapitools.codegen.languages.JavaClientCodegen", date = "2021-10-25T17:17:28.719252+02:00[Europe/Berlin]")
public class UsersUserApi {
  private ApiClient apiClient;

  public UsersUserApi() {
    this(Configuration.getDefaultApiClient());
  }

  public UsersUserApi(ApiClient apiClient) {
    this.apiClient = apiClient;
  }

  public ApiClient getApiClient() {
    return apiClient;
  }

  public void setApiClient(ApiClient apiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Get a representation of the User object
   * 
   * @param dn The objects DN (urlencoded) (required)
   * @return a {@code UsersUser}
   * @throws ApiException if fails to make API call
   */
  public UsersUser udmUsersUserObject(String dn) throws ApiException {
    Object localVarPostBody = null;
    
    // verify the required parameter 'dn' is set
    if (dn == null) {
      throw new ApiException(400, "Missing the required parameter 'dn' when calling udmUsersUserObject");
    }
    
    // create path and map variables
    String localVarPath = "/users/user/{dn}".replaceAll("\\{dn\\}", apiClient.escapeString(dn.toString()));

    // query params
    List<Pair> localVarQueryParams = new ArrayList<Pair>();
    Map<String, String> localVarHeaderParams = new HashMap<String, String>();
    Map<String, String> localVarCookieParams = new HashMap<String, String>();
    Map<String, Object> localVarFormParams = new HashMap<String, Object>();


    
    
    
    final String[] localVarAccepts = {
      "application/json"
    };
    final String localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);

    final String[] localVarContentTypes = {
      
    };
    final String localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);

    String[] localVarAuthNames = new String[] { "basic" };

    GenericType<UsersUser> localVarReturnType = new GenericType<UsersUser>() {};
    return apiClient.invokeAPI(localVarPath, "GET", localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localVarReturnType);
      }
  /**
   * Create a new User object
   * 
   * @param usersUser  (required)
   * @return a {@code UsersUser}
   * @throws ApiException if fails to make API call
   */
  public UsersUser udmUsersUserObjectCreate(UsersUser usersUser) throws ApiException {
    Object localVarPostBody = usersUser;
    
    // verify the required parameter 'usersUser' is set
    if (usersUser == null) {
      throw new ApiException(400, "Missing the required parameter 'usersUser' when calling udmUsersUserObjectCreate");
    }
    
    // create path and map variables
    String localVarPath = "/users/user/";

    // query params
    List<Pair> localVarQueryParams = new ArrayList<Pair>();
    Map<String, String> localVarHeaderParams = new HashMap<String, String>();
    Map<String, String> localVarCookieParams = new HashMap<String, String>();
    Map<String, Object> localVarFormParams = new HashMap<String, Object>();


    
    
    
    final String[] localVarAccepts = {
      "application/json"
    };
    final String localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);

    final String[] localVarContentTypes = {
      "application/json"
    };
    final String localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);

    String[] localVarAuthNames = new String[] { "basic" };

    GenericType<UsersUser> localVarReturnType = new GenericType<UsersUser>() {};
    return apiClient.invokeAPI(localVarPath, "POST", localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localVarReturnType);
      }
  /**
   * Modify or move an User object
   * 
   * @param dn The objects DN (urlencoded) (required)
   * @param usersUser  (required)
   * @param ifMatch provide entity tag to make a condition request to not overwrite any values in a race condition (optional)
   * @param ifUnmodifiedSince provide last modified time to make a condition request to not overwrite any values in a race condition (optional)
   * @param userAgent The user agent (optional)
   * @param acceptLanguage The accepted response languages (optional)
   * @param ifNoneMatch  (optional)
   * @param ifModifiedSince  (optional)
   * @return a {@code UsersUser}
   * @throws ApiException if fails to make API call
   */
  public UsersUser udmUsersUserObjectModify(String dn, UsersUser usersUser, String ifMatch, String ifUnmodifiedSince, String userAgent, String acceptLanguage, String ifNoneMatch, String ifModifiedSince) throws ApiException {
    Object localVarPostBody = usersUser;
    
    // verify the required parameter 'dn' is set
    if (dn == null) {
      throw new ApiException(400, "Missing the required parameter 'dn' when calling udmUsersUserObjectModify");
    }
    
    // verify the required parameter 'usersUser' is set
    if (usersUser == null) {
      throw new ApiException(400, "Missing the required parameter 'usersUser' when calling udmUsersUserObjectModify");
    }
    
    // create path and map variables
    String localVarPath = "/users/user/{dn}".replaceAll("\\{dn\\}", apiClient.escapeString(dn.toString()));

    // query params
    List<Pair> localVarQueryParams = new ArrayList<Pair>();
    Map<String, String> localVarHeaderParams = new HashMap<String, String>();
    Map<String, String> localVarCookieParams = new HashMap<String, String>();
    Map<String, Object> localVarFormParams = new HashMap<String, Object>();


    if (ifMatch != null)
      localVarHeaderParams.put("If-Match", apiClient.parameterToString(ifMatch));
if (ifUnmodifiedSince != null)
      localVarHeaderParams.put("If-Unmodified-Since", apiClient.parameterToString(ifUnmodifiedSince));
if (userAgent != null)
      localVarHeaderParams.put("User-Agent", apiClient.parameterToString(userAgent));
if (acceptLanguage != null)
      localVarHeaderParams.put("Accept-Language", apiClient.parameterToString(acceptLanguage));
if (ifNoneMatch != null)
      localVarHeaderParams.put("If-None-Match", apiClient.parameterToString(ifNoneMatch));
if (ifModifiedSince != null)
      localVarHeaderParams.put("If-Modified-Since", apiClient.parameterToString(ifModifiedSince));

    
    
    final String[] localVarAccepts = {
      "application/json"
    };
    final String localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);

    final String[] localVarContentTypes = {
      "application/json"
    };
    final String localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);

    String[] localVarAuthNames = new String[] { "basic" };

    GenericType<UsersUser> localVarReturnType = new GenericType<UsersUser>() {};
    return apiClient.invokeAPI(localVarPath, "PUT", localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localVarReturnType);
      }
  /**
   * Remove a Users object
   * 
   * @param dn The objects DN (urlencoded) (required)
   * @param cleanup Whether to perform a cleanup (e.g. of temporary objects, locks, etc). (optional, default to true)
   * @param recursive Whether to remove referring objects (e.g. DNS or DHCP references). (optional, default to true)
   * @param userAgent The user agent (optional)
   * @param acceptLanguage The accepted response languages (optional)
   * @param ifNoneMatch  (optional)
   * @param ifModifiedSince  (optional)
   * @throws ApiException if fails to make API call
   */
  public void udmUsersUserObjectRemove(String dn, Boolean cleanup, Boolean recursive, String userAgent, String acceptLanguage, String ifNoneMatch, String ifModifiedSince) throws ApiException {
    Object localVarPostBody = null;
    
    // verify the required parameter 'dn' is set
    if (dn == null) {
      throw new ApiException(400, "Missing the required parameter 'dn' when calling udmUsersUserObjectRemove");
    }
    
    // create path and map variables
    String localVarPath = "/users/user/{dn}".replaceAll("\\{dn\\}", apiClient.escapeString(dn.toString()));

    // query params
    List<Pair> localVarQueryParams = new ArrayList<Pair>();
    Map<String, String> localVarHeaderParams = new HashMap<String, String>();
    Map<String, String> localVarCookieParams = new HashMap<String, String>();
    Map<String, Object> localVarFormParams = new HashMap<String, Object>();

    localVarQueryParams.addAll(apiClient.parameterToPairs("", "cleanup", cleanup));
    localVarQueryParams.addAll(apiClient.parameterToPairs("", "recursive", recursive));

    if (userAgent != null)
      localVarHeaderParams.put("User-Agent", apiClient.parameterToString(userAgent));
if (acceptLanguage != null)
      localVarHeaderParams.put("Accept-Language", apiClient.parameterToString(acceptLanguage));
if (ifNoneMatch != null)
      localVarHeaderParams.put("If-None-Match", apiClient.parameterToString(ifNoneMatch));
if (ifModifiedSince != null)
      localVarHeaderParams.put("If-Modified-Since", apiClient.parameterToString(ifModifiedSince));

    
    
    final String[] localVarAccepts = {
      
    };
    final String localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);

    final String[] localVarContentTypes = {
      
    };
    final String localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);

    String[] localVarAuthNames = new String[] { "basic" };


    apiClient.invokeAPI(localVarPath, "DELETE", localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, null);
  }
  /**
   * Search for Users
   * Information about the object type and links to search for objects. The found objects are either referenced as HAL links or embedded via HAL embedded resources.
   * @param filter A ldap filter which may contain &#x60;UDM&#x60; property names instead of &#x60;LDAP&#x60; attribute names. (optional, default to )
   * @param position Position which is used as search base. (optional, default to null)
   * @param scope The &#x60;LDAP&#x60; search scope (sub, base, one). (optional, default to sub)
   * @param query The values to search for (propertyname and search filter value). Alternatively with &#x60;filter&#x60; a raw ldap filter can be given. (optional)
   * @param hidden Include hidden/system objects in the response. (optional, default to true)
   * @param userAgent The user agent (optional)
   * @param acceptLanguage The accepted response languages (optional)
   * @param ifNoneMatch  (optional)
   * @param ifModifiedSince  (optional)
   * @return a {@code UsersUserList}
   * @throws ApiException if fails to make API call
   */
  public UsersUserList udmUsersUserObjectSearch(String filter, String position, String scope, Object query, Boolean hidden, String userAgent, String acceptLanguage, String ifNoneMatch, String ifModifiedSince) throws ApiException {
    Object localVarPostBody = null;
    
    // create path and map variables
    String localVarPath = "/users/user/";

    // query params
    List<Pair> localVarQueryParams = new ArrayList<Pair>();
    Map<String, String> localVarHeaderParams = new HashMap<String, String>();
    Map<String, String> localVarCookieParams = new HashMap<String, String>();
    Map<String, Object> localVarFormParams = new HashMap<String, Object>();

	if (filter != "")
    	localVarQueryParams.addAll(apiClient.parameterToPairs("", "filter", filter));
    if (position != "")
    	localVarQueryParams.addAll(apiClient.parameterToPairs("", "position", position));
    localVarQueryParams.addAll(apiClient.parameterToPairs("", "scope", scope));
    localVarQueryParams.addAll(apiClient.parameterToPairs("deepObject", "query", query));
    localVarQueryParams.addAll(apiClient.parameterToPairs("", "hidden", hidden));

    if (userAgent != null)
      localVarHeaderParams.put("User-Agent", apiClient.parameterToString(userAgent));
    if (acceptLanguage != null)
      localVarHeaderParams.put("Accept-Language", apiClient.parameterToString(acceptLanguage));
    if (ifNoneMatch != null)
      localVarHeaderParams.put("If-None-Match", apiClient.parameterToString(ifNoneMatch));
    if (ifModifiedSince != null)
      localVarHeaderParams.put("If-Modified-Since", apiClient.parameterToString(ifModifiedSince));

    
    
    final String[] localVarAccepts = {
      "application/json"
    };
    final String localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);

    final String[] localVarContentTypes = {
      
    };
    final String localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);

    String[] localVarAuthNames = new String[] { "basic" };

    GenericType<UsersUserList> localVarReturnType = new GenericType<UsersUserList>() {};
    return apiClient.invokeAPI(localVarPath, "GET", localVarQueryParams, localVarPostBody,
                               localVarHeaderParams, localVarCookieParams, localVarFormParams,
                               localVarAccept, localVarContentType, localVarAuthNames, localVarReturnType);
      }

  /**
   * Get a template for creating an object. Contains all properties and their default values.
   * 
   * @param userAgent The user agent (optional)
   * @param acceptLanguage The accepted response languages (optional)
   * @param ifNoneMatch  (optional)
   * @param ifModifiedSince  (optional)
   * @return a {@code UsersUser}
   * @throws ApiException if fails to make API call
   */
  public UsersUser udmUsersUserObjectTemplate(String userAgent, String acceptLanguage, String ifNoneMatch, String ifModifiedSince) throws ApiException {
    Object localVarPostBody = null;
    
    // create path and map variables
    String localVarPath = "/users/user/add";

    // query params
    List<Pair> localVarQueryParams = new ArrayList<Pair>();
    Map<String, String> localVarHeaderParams = new HashMap<String, String>();
    Map<String, String> localVarCookieParams = new HashMap<String, String>();
    Map<String, Object> localVarFormParams = new HashMap<String, Object>();


    if (userAgent != null)
      localVarHeaderParams.put("User-Agent", apiClient.parameterToString(userAgent));
    if (acceptLanguage != null)
      localVarHeaderParams.put("Accept-Language", apiClient.parameterToString(acceptLanguage));
    if (ifNoneMatch != null)
      localVarHeaderParams.put("If-None-Match", apiClient.parameterToString(ifNoneMatch));
    if (ifModifiedSince != null)
      localVarHeaderParams.put("If-Modified-Since", apiClient.parameterToString(ifModifiedSince));

    
    
    final String[] localVarAccepts = {
      "application/json"
    };
    final String localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);

    final String[] localVarContentTypes = {
      
    };
    final String localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);

    String[] localVarAuthNames = new String[] { "basic" };

    GenericType<UsersUser> localVarReturnType = new GenericType<UsersUser>() {};
    return apiClient.invokeAPI(localVarPath, "GET", localVarQueryParams, localVarPostBody,
                               localVarHeaderParams, localVarCookieParams, localVarFormParams,
                               localVarAccept, localVarContentType, localVarAuthNames, localVarReturnType);
    }

  /**
   * Modify or move an User object
   * 
   * @param dn The objects DN (urlencoded) (required)
   * @param usersUser  (required)
   * @param ifMatch provide entity tag to make a condition request to not overwrite any values in a race condition (optional)
   * @param ifUnmodifiedSince provide last modified time to make a condition request to not overwrite any values in a race condition (optional)
   * @param userAgent The user agent (optional)
   * @param acceptLanguage The accepted response languages (optional)
   * @param ifNoneMatch  (optional)
   * @param ifModifiedSince  (optional)
   * @return a {@code UsersUser}
   * @throws ApiException if fails to make API call
   */
  public UsersUser udmUsersUserObjectUpdate(String dn, UsersUser usersUser, String ifMatch, String ifUnmodifiedSince, String userAgent, String acceptLanguage, String ifNoneMatch, String ifModifiedSince) throws ApiException {
    Object localVarPostBody = usersUser;
    
    // verify the required parameter 'dn' is set
    if (dn == null) {
      throw new ApiException(400, "Missing the required parameter 'dn' when calling udmUsersUserObjectUpdate");
    }
    
    // verify the required parameter 'usersUser' is set
    if (usersUser == null) {
      throw new ApiException(400, "Missing the required parameter 'usersUser' when calling udmUsersUserObjectUpdate");
    }
    
    // create path and map variables
    String localVarPath = "/users/user/{dn}".replaceAll("\\{dn\\}", apiClient.escapeString(dn.toString()));

    // query params
    List<Pair> localVarQueryParams = new ArrayList<Pair>();
    Map<String, String> localVarHeaderParams = new HashMap<String, String>();
    Map<String, String> localVarCookieParams = new HashMap<String, String>();
    Map<String, Object> localVarFormParams = new HashMap<String, Object>();


    if (ifMatch != null)
      localVarHeaderParams.put("If-Match", apiClient.parameterToString(ifMatch));
if (ifUnmodifiedSince != null)
      localVarHeaderParams.put("If-Unmodified-Since", apiClient.parameterToString(ifUnmodifiedSince));
if (userAgent != null)
      localVarHeaderParams.put("User-Agent", apiClient.parameterToString(userAgent));
if (acceptLanguage != null)
      localVarHeaderParams.put("Accept-Language", apiClient.parameterToString(acceptLanguage));
if (ifNoneMatch != null)
      localVarHeaderParams.put("If-None-Match", apiClient.parameterToString(ifNoneMatch));
if (ifModifiedSince != null)
      localVarHeaderParams.put("If-Modified-Since", apiClient.parameterToString(ifModifiedSince));

    
    
    final String[] localVarAccepts = {
      "application/json"
    };
    final String localVarAccept = apiClient.selectHeaderAccept(localVarAccepts);

    final String[] localVarContentTypes = {
      "application/json"
    };
    final String localVarContentType = apiClient.selectHeaderContentType(localVarContentTypes);

    String[] localVarAuthNames = new String[] { "basic" };

    GenericType<UsersUser> localVarReturnType = new GenericType<UsersUser>() {};
    return apiClient.invokeAPI(localVarPath, "PATCH", localVarQueryParams, localVarPostBody, localVarHeaderParams, localVarCookieParams, localVarFormParams, localVarAccept, localVarContentType, localVarAuthNames, localVarReturnType);
      }
}
