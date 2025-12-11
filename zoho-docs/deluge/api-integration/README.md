# Deluge API Integration

Comprehensive guide to integrating external APIs and web services using Deluge's `invokeUrl` function and Connections.

## Table of Contents

- [Overview](#overview)
- [invokeUrl Function](#invokeurl-function)
- [HTTP Methods](#http-methods)
- [Connections](#connections)
- [Authentication](#authentication)
- [Request Handling](#request-handling)
- [Response Handling](#response-handling)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)
- [Limitations](#limitations)

## Overview

Deluge provides powerful capabilities for integrating with external APIs and web services. The primary method for API calls is the `invokeUrl` function, which supports RESTful API operations.

### Key Features

- **HTTP Methods**: GET, POST, PUT, PATCH, DELETE
- **Authentication**: API Key, Basic Auth, OAuth 1.0/2.0, AWS Signature
- **Connections**: Pre-configured authentication for popular services
- **Custom Headers**: Full control over request headers
- **Response Parsing**: Automatic JSON/XML parsing
- **Timeout**: 40-second maximum per request

## invokeUrl Function

The `invokeUrl` function is the primary method for making HTTP API calls in Deluge.

### Basic Syntax

```javascript
response = invokeurl
[
    url: "<api_endpoint>"
    type: <HTTP_METHOD>
    parameters: <request_body>
    headers: <header_map>
    connection: "<connection_name>"
];
```

### Alternative Syntax (Legacy)

```javascript
response = invokeUrl(<stringUrl>, <type>, [<body>], [<headerMap>], [<boolean>]);
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | Text | Yes | API endpoint URL |
| `type` | Text | Yes | HTTP method (GET, POST, PUT, PATCH, DELETE) |
| `parameters` | Map/Text | No | Request body data |
| `headers` | Map | No | Custom HTTP headers |
| `connection` | Text | No | Connection link name for authentication |
| `detailed` | Boolean | No | Include HTTP status code in response (false) |

### Simple GET Request

```javascript
// Basic GET request
response = invokeurl
[
    url: "https://api.example.com/users"
    type: GET
];

info response;
```

### GET with Parameters

```javascript
// GET with query parameters
params = {"page": "1", "limit": "10", "status": "active"};

response = invokeurl
[
    url: "https://api.example.com/products"
    type: GET
    parameters: params
];

// URL becomes: https://api.example.com/products?page=1&limit=10&status=active
```

## HTTP Methods

### GET - Retrieve Data

Used to fetch data from an API.

```javascript
// Get user by ID
userId = "12345";
response = invokeurl
[
    url: "https://api.example.com/users/" + userId
    type: GET
];

userName = response.get("name");
userEmail = response.get("email");

// Get with headers
headers = {"Authorization": "Bearer YOUR_TOKEN", "Accept": "application/json"};

response = invokeurl
[
    url: "https://api.example.com/data"
    type: GET
    headers: headers
];
```

### POST - Create Data

Used to create new resources.

```javascript
// Create new user
newUser = {
    "name": "John Smith",
    "email": "john@example.com",
    "role": "user"
};

response = invokeurl
[
    url: "https://api.example.com/users"
    type: POST
    parameters: newUser.toString()
    headers: {"Content-Type": "application/json"}
];

createdId = response.get("id");
info "Created user with ID: " + createdId;

// POST with form data
formData = {
    "username": "jsmith",
    "password": "secure123",
    "email": "john@example.com"
};

response = invokeurl
[
    url: "https://api.example.com/register"
    type: POST
    parameters: formData
];
```

### PUT - Update Data (Full Replace)

Used to completely replace a resource.

```javascript
// Update user (full replacement)
userId = "12345";
updatedUser = {
    "name": "John Smith Jr.",
    "email": "john.smith@example.com",
    "role": "admin",
    "status": "active"
};

response = invokeurl
[
    url: "https://api.example.com/users/" + userId
    type: PUT
    parameters: updatedUser.toString()
    headers: {"Content-Type": "application/json"}
];
```

### PATCH - Partial Update

Used to partially update a resource.

```javascript
// Partial update
userId = "12345";
updates = {
    "status": "inactive",
    "last_login": now.toString("yyyy-MM-dd HH:mm:ss")
};

response = invokeurl
[
    url: "https://api.example.com/users/" + userId
    type: PATCH
    parameters: updates.toString()
    headers: {"Content-Type": "application/json"}
];
```

### DELETE - Remove Data

Used to delete a resource.

```javascript
// Delete user
userId = "12345";

response = invokeurl
[
    url: "https://api.example.com/users/" + userId
    type: DELETE
    headers: {"Authorization": "Bearer YOUR_TOKEN"}
];

info "User deleted successfully";

// Delete with confirmation
if(response.get("success") == true)
{
    info "Deletion confirmed";
}
```

## Connections

Connections simplify authentication by storing credentials and handling token refresh automatically.

### Benefits of Connections

- No need to manually manage access tokens
- Automatic token refresh for OAuth
- Secure credential storage
- Reusable across scripts
- Support for popular services (Gmail, Dropbox, Salesforce, etc.)

### Creating a Connection

1. Navigate to **Setup > Connections**
2. Click **Create Connection**
3. Select service (default or custom)
4. Provide connection name and link name
5. Authenticate with service
6. Use link name in invokeUrl

### Using Connections

```javascript
// Using a connection for authentication
response = invokeurl
[
    url: "https://www.googleapis.com/drive/v3/files"
    type: GET
    connection: "googledrive"
];

// Connection handles authentication automatically
```

### Custom Service Connection

```javascript
// Using custom service connection
response = invokeurl
[
    url: "https://api.customservice.com/v1/data"
    type: GET
    connection: "my_custom_api"
];
```

## Authentication

### API Key Authentication

```javascript
// API Key in header
headers = {
    "X-API-Key": "your_api_key_here",
    "Content-Type": "application/json"
};

response = invokeurl
[
    url: "https://api.example.com/data"
    type: GET
    headers: headers
];

// API Key in query parameter
apiKey = "your_api_key_here";
url = "https://api.example.com/data?api_key=" + apiKey;

response = invokeurl
[
    url: url
    type: GET
];
```

### Bearer Token Authentication

```javascript
// Bearer token in Authorization header
accessToken = "your_access_token";
headers = {
    "Authorization": "Bearer " + accessToken,
    "Content-Type": "application/json"
};

response = invokeurl
[
    url: "https://api.example.com/protected/data"
    type: GET
    headers: headers
];
```

### Basic Authentication

```javascript
// Basic Auth (username:password encoded in base64)
username = "api_user";
password = "api_password";

// Deluge may have built-in encoding, or use connection
authString = username + ":" + password;
encodedAuth = authString.toBase64();  // If supported

headers = {
    "Authorization": "Basic " + encodedAuth,
    "Content-Type": "application/json"
};

response = invokeurl
[
    url: "https://api.example.com/data"
    type: GET
    headers: headers
];
```

### OAuth 2.0 (via Connection)

```javascript
// Best practice: Use Connections for OAuth
response = invokeurl
[
    url: "https://api.oauth-service.com/v1/user"
    type: GET
    connection: "oauth_connection_name"
];

// Connection automatically handles:
// - Access token
// - Token refresh
// - Token expiration
```

## Request Handling

### JSON Request Body

```javascript
// Sending JSON data
requestData = {
    "customer": {
        "name": "John Smith",
        "email": "john@example.com",
        "phone": "+1-555-0123"
    },
    "order": {
        "items": {"product_id": "123", "quantity": 2},
        "total": 99.99
    }
};

response = invokeurl
[
    url: "https://api.example.com/orders"
    type: POST
    parameters: requestData.toString()
    headers: {"Content-Type": "application/json"}
];
```

### Form Data

```javascript
// Sending form-urlencoded data
formData = {
    "username": "jsmith",
    "email": "john@example.com",
    "subscribe": "true"
};

response = invokeurl
[
    url: "https://api.example.com/subscribe"
    type: POST
    parameters: formData
];
// Automatically sent as application/x-www-form-urlencoded
```

### Custom Headers

```javascript
// Multiple custom headers
headers = {
    "Authorization": "Bearer token123",
    "Content-Type": "application/json",
    "Accept": "application/json",
    "X-Custom-Header": "CustomValue",
    "User-Agent": "Zoho-Deluge/1.0"
};

response = invokeurl
[
    url: "https://api.example.com/data"
    type: GET
    headers: headers
];
```

### Query Parameters

```javascript
// Building URL with query parameters
baseUrl = "https://api.example.com/search";
queryParams = {
    "q": "deluge programming",
    "limit": "20",
    "offset": "0",
    "sort": "relevance"
};

// Option 1: Manual URL building
url = baseUrl + "?q=" + queryParams.get("q") + "&limit=" + queryParams.get("limit");

// Option 2: Use parameters with GET
response = invokeurl
[
    url: baseUrl
    type: GET
    parameters: queryParams
];
```

## Response Handling

### Parsing JSON Response

```javascript
// API returns JSON
response = invokeurl
[
    url: "https://api.example.com/user/123"
    type: GET
];

// Access response data
userId = response.get("id");
userName = response.get("name");
userEmail = response.get("email");

// Nested data
address = response.get("address");
city = address.get("city");
state = address.get("state");

// Array data
orders = response.get("orders");
for each order in orders
{
    orderId = order.get("id");
    orderTotal = order.get("total");
    info "Order: " + orderId + " - $" + orderTotal;
}
```

### Getting HTTP Status Code

```javascript
// Get detailed response with status code
response = invokeurl
[
    url: "https://api.example.com/data"
    type: GET
    detailed: false
];

statusCode = response.get("statusCode");
responseBody = response.get("responseText");

info "Status Code: " + statusCode;

if(statusCode == 200)
{
    // Success
    data = responseBody;
}
else if(statusCode == 404)
{
    // Not found
    info "Resource not found";
}
else if(statusCode == 401)
{
    // Unauthorized
    info "Authentication failed";
}
```

### Response Types

```javascript
// JSON response (default)
jsonResponse = invokeurl
[
    url: "https://api.example.com/data.json"
    type: GET
];

// Text response
textResponse = invokeurl
[
    url: "https://api.example.com/data.txt"
    type: GET
];

// XML response (parsed automatically)
xmlResponse = invokeurl
[
    url: "https://api.example.com/data.xml"
    type: GET
];
```

## Error Handling

### Try-Catch with API Calls

```javascript
try
{
    response = invokeurl
    [
        url: "https://api.example.com/data"
        type: GET
        headers: {"Authorization": "Bearer token"}
    ];

    // Process successful response
    data = response.get("data");
    info "Data retrieved successfully";
}
catch(e)
{
    // Handle API errors
    info "API Error: " + e.message;
    info "Error on line: " + e.lineNo;

    // Log error or take corrective action
    sendErrorNotification(e.message);
}
```

### Checking Response Status

```javascript
response = invokeurl
[
    url: "https://api.example.com/users"
    type: POST
    parameters: userData.toString()
    headers: {"Content-Type": "application/json"}
    detailed: false
];

statusCode = response.get("statusCode");

if(statusCode >= 200 && statusCode < 300)
{
    // Success (2xx codes)
    info "Operation successful";
    data = response.get("responseText");
}
else if(statusCode == 400)
{
    // Bad request
    error = response.get("responseText");
    info "Bad request: " + error;
}
else if(statusCode == 401)
{
    // Unauthorized
    info "Authentication failed";
}
else if(statusCode == 404)
{
    // Not found
    info "Resource not found";
}
else if(statusCode >= 500)
{
    // Server error
    info "Server error occurred";
}
```

### Timeout Handling

```javascript
// API calls timeout after 40 seconds
try
{
    response = invokeurl
    [
        url: "https://slow-api.example.com/data"
        type: GET
    ];
}
catch(e)
{
    if(e.message.contains("timeout") || e.message.contains("socket"))
    {
        info "Request timed out after 40 seconds";
        // Implement retry logic or alternative action
    }
    else
    {
        info "Other error: " + e.message;
    }
}
```

## Best Practices

### 1. Use Connections for Authentication

```javascript
// Good: Use connection
response = invokeurl
[
    url: "https://api.service.com/data"
    type: GET
    connection: "service_connection"
];

// Avoid: Hardcoded credentials
response = invokeurl
[
    url: "https://api.service.com/data"
    type: GET
    headers: {"Authorization": "Bearer hardcoded_token"}
];
```

### 2. Handle Errors Gracefully

```javascript
// Good: Comprehensive error handling
try
{
    response = invokeurl
    [
        url: apiUrl
        type: GET
    ];

    if(response != null)
    {
        processData(response);
    }
}
catch(e)
{
    info "API call failed: " + e.message;
    // Fallback logic
}

// Poor: No error handling
response = invokeurl [url: apiUrl type: GET];
processData(response);  // May fail if request errors
```

### 3. Check Response Status

```javascript
// Good: Validate response
response = invokeurl
[
    url: apiUrl
    type: POST
    parameters: data
    detailed: false
];

if(response.get("statusCode") == 201)
{
    info "Resource created successfully";
}
else
{
    info "Creation failed";
}
```

### 4. Use Appropriate HTTP Methods

```javascript
// Good: Correct methods
getResponse = invokeurl [url: apiUrl type: GET];  // Retrieve
postResponse = invokeurl [url: apiUrl type: POST parameters: newData];  // Create
putResponse = invokeurl [url: apiUrl type: PUT parameters: fullUpdate];  // Replace
patchResponse = invokeurl [url: apiUrl type: PATCH parameters: partialUpdate];  // Update
deleteResponse = invokeurl [url: apiUrl type: DELETE];  // Remove
```

### 5. Set Proper Content-Type

```javascript
// Good: Specify content type
headers = {"Content-Type": "application/json"};

response = invokeurl
[
    url: apiUrl
    type: POST
    parameters: jsonData.toString()
    headers: headers
];
```

### 6. Monitor API Limits

```javascript
// Track API call usage
apiCallCount = 0;
maxAPICalls = 2000;  // Daily limit

if(apiCallCount < maxAPICalls)
{
    response = invokeurl [url: apiUrl type: GET];
    apiCallCount = apiCallCount + 1;
}
else
{
    info "API limit reached for today";
}
```

### 7. Implement Retry Logic

```javascript
// Retry on failure
maxRetries = 3;
retryCount = 0;
success = false;

while(retryCount < maxRetries && !success)
{
    try
    {
        response = invokeurl [url: apiUrl type: GET];
        success = true;
    }
    catch(e)
    {
        retryCount = retryCount + 1;
        info "Retry " + retryCount + " after error";

        if(retryCount >= maxRetries)
        {
            info "Max retries reached, operation failed";
        }
    }
}
```

## Limitations

### API Call Limits

- **Daily invokeUrl Limit**: 2,000 calls per day (varies by plan)
- **Timeout**: 40 seconds maximum per request
- **Response Size**: Maximum 5 MB response content length
- **Concurrent Calls**: Limited by organization concurrency limits

### Request Constraints

```javascript
// Response size limit
// API responses larger than 5 MB will fail
response = invokeurl
[
    url: "https://api.example.com/large-dataset"
    type: GET
];
// May throw error if response > 5 MB
```

### Timeout Example

```javascript
// Calls exceeding 40 seconds will timeout
try
{
    response = invokeurl
    [
        url: "https://very-slow-api.com/data"
        type: GET
    ];
}
catch(e)
{
    // "socket timeout error" after 40 seconds
    info "Request timed out";
}
```

## Common Integration Examples

### Slack Notification

```javascript
// Send message to Slack
slackWebhook = "https://hooks.slack.com/services/YOUR/WEBHOOK/URL";

message = {
    "text": "New lead created: John Smith",
    "channel": "#sales",
    "username": "Zoho Bot"
};

response = invokeurl
[
    url: slackWebhook
    type: POST
    parameters: message.toString()
    headers: {"Content-Type": "application/json"}
];
```

### Stripe Payment

```javascript
// Create Stripe charge
stripeKey = "sk_test_your_key";
headers = {
    "Authorization": "Bearer " + stripeKey,
    "Content-Type": "application/x-www-form-urlencoded"
};

chargeData = {
    "amount": "2000",
    "currency": "usd",
    "source": "tok_visa",
    "description": "Order payment"
};

response = invokeurl
[
    url: "https://api.stripe.com/v1/charges"
    type: POST
    parameters: chargeData
    headers: headers
];
```

### Twilio SMS

```javascript
// Send SMS via Twilio
accountSid = "YOUR_ACCOUNT_SID";
authToken = "YOUR_AUTH_TOKEN";

smsData = {
    "To": "+15555551234",
    "From": "+15555556789",
    "Body": "Your verification code is: 123456"
};

response = invokeurl
[
    url: "https://api.twilio.com/2010-04-01/Accounts/" + accountSid + "/Messages.json"
    type: POST
    parameters: smsData
    connection: "twilio"
];
```

## Summary

### Quick Reference

```javascript
// GET Request
response = invokeurl [url: apiUrl type: GET];

// POST Request
response = invokeurl [url: apiUrl type: POST parameters: data];

// With Headers
response = invokeurl [url: apiUrl type: GET headers: headerMap];

// With Connection
response = invokeurl [url: apiUrl type: GET connection: "conn_name"];

// Error Handling
try {
    response = invokeurl [url: apiUrl type: GET];
} catch(e) {
    info "Error: " + e.message;
}
```

## Additional Resources

- [Error Handling](../error-handling/README.md) - Try-catch patterns
- [Data Types](../data-types/README.md) - Working with response data
- [Examples](../examples/README.md) - More integration examples

## References

- [Zoho Deluge invokeUrl Function](https://www.zoho.com/deluge/help/web-data/invokeurl-function.html)
- [invokeURL Task](https://www.zoho.com/deluge/help/webhook/invokeurl-api-task.html)
- [Connections](https://www.zoho.com/deluge/help/connections.html)
