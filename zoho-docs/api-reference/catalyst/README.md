# Zoho Catalyst API Reference

## Overview

Zoho Catalyst is a comprehensive serverless platform that enables developers to build, deploy, and scale cloud applications without managing infrastructure. The API provides programmatic access to functions, data storage, file storage, caching, and more.

**Current API Version**: v2
**Base URL**: `https://api.catalyst.zoho.com/baas/v1/`
**Protocol**: REST
**Data Format**: JSON
**Authentication**: OAuth 2.0

---

## Quick Links

- [Authentication](#authentication)
- [Rate Limits](#rate-limits)
- [Data Centers](#data-centers)
- [API Modules](#api-modules)
- [Common Operations](#common-operations)
- [Error Codes](#error-codes)
- [Best Practices](#best-practices)
- [Code Examples](#code-examples)

---

## API Modules

### 1. Functions

**Purpose**: Execute serverless functions and manage function lifecycle

**Endpoints**:
```http
POST   /project/{project_id}/function/{function_id}/execute  # Execute function
GET    /project/{project_id}/function                        # List functions
GET    /project/{project_id}/function/{function_id}          # Get function details
GET    /project/{project_id}/function/{function_id}/logs     # Get function logs
```

**Function Execution Types**:
- Event Functions - Triggered by events
- Cron Functions - Scheduled execution
- Integration Functions - Third-party integrations
- Web Functions - HTTP endpoints

**Example - Execute Function**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const executeFunction = async (accessToken, projectId, functionId, data) => {
  const response = await axios.post(
    `https://api.catalyst.zoho.com/baas/v1/project/${projectId}/function/${functionId}/execute`,
    data,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

// Usage
const result = await executeFunction(
  accessToken,
  '123456000000012345',
  '123456000000012346',
  {
    userId: 'user123',
    action: 'processOrder',
    orderId: 'ORD-001'
  }
);
console.log('Function result:', result);
```

```python
# Python
import requests

def execute_function(access_token, project_id, function_id, data):
    url = f'https://api.catalyst.zoho.com/baas/v1/project/{project_id}/function/{function_id}/execute'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()

# Usage
result = execute_function(
    access_token,
    '123456000000012345',
    '123456000000012346',
    {
        'userId': 'user123',
        'action': 'processOrder',
        'orderId': 'ORD-001'
    }
)
print('Function result:', result)
```

```deluge
// Deluge
project_id = "123456000000012345";
function_id = "123456000000012346";

// Prepare function data
function_data = {
    "userId": "user123",
    "action": "processOrder",
    "orderId": "ORD-001"
};

// Execute Catalyst function
response = invokeurl
[
    url: "https://api.catalyst.zoho.com/baas/v1/project/" + project_id + "/function/" + function_id + "/execute"
    type: POST
    parameters: function_data.toString()
    connection: "catalyst_connection"
];

info response;
```

**Response**:
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "executionId": "123456000000098765",
    "result": {
      "orderId": "ORD-001",
      "status": "processed",
      "timestamp": "2025-01-15T10:30:00Z"
    },
    "executionTime": 245
  }
}
```

---

### 2. Data Store

**Purpose**: NoSQL database operations for storing and querying structured data

**Endpoints**:
```http
GET    /project/{project_id}/table/{table_id}/row            # Get all rows
GET    /project/{project_id}/table/{table_id}/row/{row_id}   # Get specific row
POST   /project/{project_id}/table/{table_id}/row            # Create row
PUT    /project/{project_id}/table/{table_id}/row/{row_id}   # Update row
DELETE /project/{project_id}/table/{table_id}/row/{row_id}   # Delete row
GET    /project/{project_id}/table/{table_id}/query          # Query with filters
POST   /project/{project_id}/table/{table_id}/bulk           # Bulk operations
```

**Data Types Supported**:
- Text
- Number
- Boolean
- Date/Time
- Email
- URL
- JSON
- File Reference

**Example - Create Row**:
```javascript
// JavaScript/Node.js
const createRow = async (accessToken, projectId, tableId, rowData) => {
  const response = await axios.post(
    `https://api.catalyst.zoho.com/baas/v1/project/${projectId}/table/${tableId}/row`,
    rowData,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

// Usage - Create user record
const userData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  age: 30,
  status: 'active',
  registrationDate: '2025-01-15',
  metadata: {
    source: 'web',
    campaign: 'spring2025'
  }
};

const result = await createRow(accessToken, projectId, tableId, userData);
console.log('Created row:', result);
```

```python
# Python
def create_row(access_token, project_id, table_id, row_data):
    url = f'https://api.catalyst.zoho.com/baas/v1/project/{project_id}/table/{table_id}/row'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    response = requests.post(url, json=row_data, headers=headers)
    return response.json()

# Usage - Create user record
user_data = {
    'firstName': 'John',
    'lastName': 'Doe',
    'email': 'john.doe@example.com',
    'age': 30,
    'status': 'active',
    'registrationDate': '2025-01-15',
    'metadata': {
        'source': 'web',
        'campaign': 'spring2025'
    }
}

result = create_row(access_token, project_id, table_id, user_data)
print('Created row:', result)
```

```deluge
// Deluge
project_id = "123456000000012345";
table_id = "123456000000012347";

// Create row data
row_data = {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "age": 30,
    "status": "active",
    "registrationDate": "2025-01-15",
    "metadata": {
        "source": "web",
        "campaign": "spring2025"
    }
};

// Create row in Catalyst data store
response = invokeurl
[
    url: "https://api.catalyst.zoho.com/baas/v1/project/" + project_id + "/table/" + table_id + "/row"
    type: POST
    parameters: row_data.toString()
    connection: "catalyst_connection"
];

info response;
```

**Response**:
```json
{
  "status": "success",
  "code": 201,
  "data": {
    "ROWID": "123456000000098765",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "age": 30,
    "status": "active",
    "registrationDate": "2025-01-15",
    "metadata": {
      "source": "web",
      "campaign": "spring2025"
    },
    "CREATEDTIME": "2025-01-15T10:30:00Z",
    "MODIFIEDTIME": "2025-01-15T10:30:00Z",
    "CREATORID": "123456000000012340"
  }
}
```

**Example - Query with Filters**:
```javascript
// JavaScript/Node.js
const queryRows = async (accessToken, projectId, tableId, query) => {
  const response = await axios.get(
    `https://api.catalyst.zoho.com/baas/v1/project/${projectId}/table/${tableId}/query`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      },
      params: {
        where: query,
        orderBy: 'CREATEDTIME DESC',
        limit: 50
      }
    }
  );
  return response.data;
};

// Usage - Find active users
const activeUsers = await queryRows(
  accessToken,
  projectId,
  tableId,
  "status='active' AND age>=18"
);
console.log('Active users:', activeUsers);
```

---

### 3. File Store

**Purpose**: Object storage for files and media

**Endpoints**:
```http
POST   /project/{project_id}/folder/{folder_id}/file         # Upload file
GET    /project/{project_id}/folder/{folder_id}/file         # List files
GET    /project/{project_id}/folder/{folder_id}/file/{file_id} # Download file
DELETE /project/{project_id}/folder/{folder_id}/file/{file_id} # Delete file
GET    /project/{project_id}/folder                          # List folders
POST   /project/{project_id}/folder                          # Create folder
```

**Supported Operations**:
- File upload (multipart/form-data)
- File download
- Folder management
- File metadata
- Access control

**Example - Upload File**:
```javascript
// JavaScript/Node.js
const FormData = require('form-data');
const fs = require('fs');

const uploadFile = async (accessToken, projectId, folderId, filePath) => {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));
  form.append('metadata', JSON.stringify({
    description: 'User uploaded document',
    tags: ['invoice', 'Q1-2025']
  }));

  const response = await axios.post(
    `https://api.catalyst.zoho.com/baas/v1/project/${projectId}/folder/${folderId}/file`,
    form,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        ...form.getHeaders()
      }
    }
  );
  return response.data;
};

// Usage
const result = await uploadFile(
  accessToken,
  projectId,
  folderId,
  './documents/invoice.pdf'
);
console.log('File uploaded:', result);
```

```python
# Python
def upload_file(access_token, project_id, folder_id, file_path):
    url = f'https://api.catalyst.zoho.com/baas/v1/project/{project_id}/folder/{folder_id}/file'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }

    with open(file_path, 'rb') as f:
        files = {
            'file': f
        }
        data = {
            'metadata': json.dumps({
                'description': 'User uploaded document',
                'tags': ['invoice', 'Q1-2025']
            })
        }
        response = requests.post(url, headers=headers, files=files, data=data)

    return response.json()

# Usage
result = upload_file(
    access_token,
    project_id,
    folder_id,
    './documents/invoice.pdf'
)
print('File uploaded:', result)
```

**Response**:
```json
{
  "status": "success",
  "code": 201,
  "data": {
    "fileId": "123456000000098766",
    "fileName": "invoice.pdf",
    "fileSize": 245678,
    "fileType": "application/pdf",
    "folderId": "123456000000012348",
    "uploadedBy": "123456000000012340",
    "uploadedTime": "2025-01-15T10:30:00Z",
    "metadata": {
      "description": "User uploaded document",
      "tags": ["invoice", "Q1-2025"]
    }
  }
}
```

**Example - Download File**:
```javascript
// JavaScript/Node.js
const downloadFile = async (accessToken, projectId, folderId, fileId) => {
  const response = await axios.get(
    `https://api.catalyst.zoho.com/baas/v1/project/${projectId}/folder/${folderId}/file/${fileId}`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      },
      responseType: 'arraybuffer'
    }
  );

  // Save to disk
  fs.writeFileSync('downloaded_file.pdf', response.data);
  return response.headers;
};
```

---

### 4. Cache

**Purpose**: In-memory caching for high-performance data access

**Endpoints**:
```http
POST   /project/{project_id}/cache/{segment}/key             # Set cache value
GET    /project/{project_id}/cache/{segment}/key/{key}       # Get cache value
DELETE /project/{project_id}/cache/{segment}/key/{key}       # Delete cache value
DELETE /project/{project_id}/cache/{segment}                 # Clear segment
GET    /project/{project_id}/cache/{segment}/keys            # List all keys
```

**Cache Segments**:
- User sessions
- API responses
- Computed results
- Temporary data

**Example - Set Cache**:
```javascript
// JavaScript/Node.js
const setCache = async (accessToken, projectId, segment, key, value, ttl = 3600) => {
  const response = await axios.post(
    `https://api.catalyst.zoho.com/baas/v1/project/${projectId}/cache/${segment}/key`,
    {
      key: key,
      value: value,
      ttl: ttl  // Time to live in seconds
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

// Usage - Cache user session
const sessionData = {
  userId: 'user123',
  email: 'user@example.com',
  role: 'admin',
  loginTime: '2025-01-15T10:30:00Z'
};

await setCache(accessToken, projectId, 'sessions', 'session_abc123', sessionData, 7200);
```

```python
# Python
def set_cache(access_token, project_id, segment, key, value, ttl=3600):
    url = f'https://api.catalyst.zoho.com/baas/v1/project/{project_id}/cache/{segment}/key'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'key': key,
        'value': value,
        'ttl': ttl
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()

# Usage - Cache API response
cache_data = {
    'data': [{'id': 1, 'name': 'Item 1'}],
    'timestamp': '2025-01-15T10:30:00Z'
}

set_cache(access_token, project_id, 'api_cache', 'products_list', cache_data, 300)
```

**Example - Get Cache**:
```javascript
// JavaScript/Node.js
const getCache = async (accessToken, projectId, segment, key) => {
  const response = await axios.get(
    `https://api.catalyst.zoho.com/baas/v1/project/${projectId}/cache/${segment}/key/${key}`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};

// Usage
const sessionData = await getCache(accessToken, projectId, 'sessions', 'session_abc123');
console.log('Session data:', sessionData);
```

---

### 5. API Gateway

**Purpose**: Manage and monitor API endpoints with rate limiting and authentication

**Endpoints**:
```http
POST   /project/{project_id}/gateway/endpoint                # Create endpoint
GET    /project/{project_id}/gateway/endpoint                # List endpoints
GET    /project/{project_id}/gateway/endpoint/{endpoint_id}  # Get endpoint details
PUT    /project/{project_id}/gateway/endpoint/{endpoint_id}  # Update endpoint
DELETE /project/{project_id}/gateway/endpoint/{endpoint_id}  # Delete endpoint
GET    /project/{project_id}/gateway/analytics               # Get analytics
```

**Gateway Features**:
- Rate limiting
- Authentication
- CORS configuration
- Request/response transformation
- Analytics and monitoring

**Example - Create API Endpoint**:
```javascript
// JavaScript/Node.js
const createAPIEndpoint = async (accessToken, projectId, endpointConfig) => {
  const response = await axios.post(
    `https://api.catalyst.zoho.com/baas/v1/project/${projectId}/gateway/endpoint`,
    endpointConfig,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

// Usage
const endpoint = {
  name: 'Users API',
  path: '/api/v1/users',
  method: 'GET',
  functionId: '123456000000012346',
  authentication: {
    type: 'oauth',
    required: true
  },
  rateLimit: {
    requests: 100,
    period: 60  // per minute
  },
  cors: {
    enabled: true,
    allowedOrigins: ['https://example.com'],
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE']
  }
};

const result = await createAPIEndpoint(accessToken, projectId, endpoint);
console.log('API endpoint created:', result);
```

---

### 6. ZCQL (Zoho Catalyst Query Language)

**Purpose**: SQL-like queries across multiple data store tables

**Endpoint**:
```http
POST   /project/{project_id}/query                           # Execute ZCQL query
```

**Query Features**:
- SELECT with JOINs
- WHERE clauses
- ORDER BY
- GROUP BY
- Aggregate functions
- LIMIT and OFFSET

**Example - ZCQL Query**:
```javascript
// JavaScript/Node.js
const executeZCQL = async (accessToken, projectId, query) => {
  const response = await axios.post(
    `https://api.catalyst.zoho.com/baas/v1/project/${projectId}/query`,
    {
      query: query
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

// Usage - Join users with orders
const query = `
  SELECT
    u.firstName,
    u.lastName,
    u.email,
    COUNT(o.ROWID) as orderCount,
    SUM(o.total) as totalSpent
  FROM Users u
  LEFT JOIN Orders o ON u.ROWID = o.userId
  WHERE u.status = 'active'
  GROUP BY u.ROWID
  HAVING orderCount > 0
  ORDER BY totalSpent DESC
  LIMIT 10
`;

const result = await executeZCQL(accessToken, projectId, query);
console.log('Top customers:', result);
```

```python
# Python
def execute_zcql(access_token, project_id, query):
    url = f'https://api.catalyst.zoho.com/baas/v1/project/{project_id}/query'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'query': query
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()

# Usage - Complex query with aggregation
query = """
  SELECT
    DATE(orderDate) as day,
    COUNT(*) as orderCount,
    SUM(total) as revenue
  FROM Orders
  WHERE orderDate >= '2025-01-01'
  GROUP BY DATE(orderDate)
  ORDER BY day DESC
"""

result = execute_zcql(access_token, project_id, query)
print('Daily revenue:', result)
```

**Response**:
```json
{
  "status": "success",
  "code": 200,
  "data": [
    {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "orderCount": 15,
      "totalSpent": 4567.89
    },
    {
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane@example.com",
      "orderCount": 12,
      "totalSpent": 3890.45
    }
  ]
}
```

---

### 7. Cron Jobs

**Purpose**: Schedule recurring tasks and automated workflows

**Endpoints**:
```http
GET    /project/{project_id}/cron                            # List cron jobs
GET    /project/{project_id}/cron/{cron_id}                  # Get cron details
PUT    /project/{project_id}/cron/{cron_id}/status           # Enable/disable cron
GET    /project/{project_id}/cron/{cron_id}/executions       # Get execution history
```

**Cron Expression Format**:
```
* * * * *
│ │ │ │ │
│ │ │ │ └─── Day of week (0-6, Sunday=0)
│ │ │ └───── Month (1-12)
│ │ └─────── Day of month (1-31)
│ └───────── Hour (0-23)
└─────────── Minute (0-59)
```

**Example - Schedule Daily Report**:
```javascript
// JavaScript/Node.js
// Cron jobs are typically configured via Catalyst console
// but can be managed programmatically

const getCronJobs = async (accessToken, projectId) => {
  const response = await axios.get(
    `https://api.catalyst.zoho.com/baas/v1/project/${projectId}/cron`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};

// Usage
const cronJobs = await getCronJobs(accessToken, projectId);
console.log('Scheduled jobs:', cronJobs);
```

---

### 8. Event Listeners

**Purpose**: Trigger functions based on data store events

**Event Types**:
- INSERT - New row created
- UPDATE - Row updated
- DELETE - Row deleted

**Configuration**:
Event listeners are configured through the Catalyst console to trigger specific functions when data store events occur.

**Example - Event Handler Function**:
```javascript
// JavaScript/Node.js - Catalyst Function
// This runs when a row is inserted into Users table

module.exports = async (context, eventData) => {
  const { table, action, data } = eventData;

  if (action === 'INSERT' && table === 'Users') {
    // Send welcome email
    const user = data;
    await sendWelcomeEmail(user.email, user.firstName);

    // Log the event
    await logEvent('user_registration', {
      userId: user.ROWID,
      email: user.email,
      timestamp: new Date().toISOString()
    });
  }

  return {
    status: 'success',
    message: 'Event processed'
  };
};
```

---

### 9. Authentication

**Purpose**: User authentication and session management

**Endpoints**:
```http
POST   /project/{project_id}/auth/signup                     # User signup
POST   /project/{project_id}/auth/login                      # User login
POST   /project/{project_id}/auth/logout                     # User logout
POST   /project/{project_id}/auth/forgot-password            # Password reset
GET    /project/{project_id}/auth/user                       # Get current user
PUT    /project/{project_id}/auth/user                       # Update user profile
```

**Authentication Methods**:
- Email/Password
- OAuth (Google, Facebook, etc.)
- SAML SSO
- Custom authentication

**Example - User Signup**:
```javascript
// JavaScript/Node.js
const signupUser = async (accessToken, projectId, userData) => {
  const response = await axios.post(
    `https://api.catalyst.zoho.com/baas/v1/project/${projectId}/auth/signup`,
    userData,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

// Usage
const newUser = {
  email: 'newuser@example.com',
  password: 'SecurePass123!',
  firstName: 'Jane',
  lastName: 'Smith',
  metadata: {
    source: 'web',
    termsAccepted: true
  }
};

const result = await signupUser(accessToken, projectId, newUser);
console.log('User created:', result);
```

**Example - User Login**:
```javascript
// JavaScript/Node.js
const loginUser = async (projectId, email, password) => {
  const response = await axios.post(
    `https://api.catalyst.zoho.com/baas/v1/project/${projectId}/auth/login`,
    {
      email: email,
      password: password
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

// Usage
const session = await loginUser(projectId, 'user@example.com', 'password123');
console.log('Session token:', session.token);
```

---

## Authentication

### OAuth 2.0 Flow

**Step 1: Register Your Application**
- Go to [Zoho API Console](https://api-console.zoho.com/)
- Create a new Client
- Client Type: Server-based Applications
- Note your Client ID and Client Secret

**Step 2: Generate Authorization Code**
```http
GET https://accounts.zoho.com/oauth/v2/auth?
  scope=ZohoCatalyst.functions.ALL,ZohoCatalyst.datastore.ALL,ZohoCatalyst.filestore.ALL&
  client_id={client_id}&
  response_type=code&
  access_type=offline&
  redirect_uri={redirect_uri}
```

**Available Scopes**:
- `ZohoCatalyst.functions.ALL` - Full access to functions
- `ZohoCatalyst.datastore.ALL` - Full access to data store
- `ZohoCatalyst.filestore.ALL` - Full access to file store
- `ZohoCatalyst.cache.ALL` - Full access to cache
- `ZohoCatalyst.gateway.ALL` - Full access to API gateway
- `ZohoCatalyst.auth.ALL` - Full access to authentication

**Step 3: Generate Access Token**
```http
POST https://accounts.zoho.com/oauth/v2/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&
client_id={client_id}&
client_secret={client_secret}&
redirect_uri={redirect_uri}&
code={authorization_code}
```

**Response**:
```json
{
  "access_token": "1000.xxx",
  "refresh_token": "1000.yyy",
  "api_domain": "https://www.zohoapis.com",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

**Step 4: Refresh Access Token**
```http
POST https://accounts.zoho.com/oauth/v2/token
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token&
client_id={client_id}&
client_secret={client_secret}&
refresh_token={refresh_token}
```

**JavaScript Token Refresh Example**:
```javascript
const refreshAccessToken = async (clientId, clientSecret, refreshToken) => {
  const response = await axios.post(
    'https://accounts.zoho.com/oauth/v2/token',
    null,
    {
      params: {
        grant_type: 'refresh_token',
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken
      }
    }
  );
  return response.data.access_token;
};
```

**Token Lifetime**:
- Access Token: 1 hour
- Refresh Token: Does not expire (store securely)

---

## Rate Limits

### API Call Limits

| Plan | API Calls per Hour | Function Executions per Day | Storage |
|------|-------------------|----------------------------|---------|
| Free | 5,000 | 10,000 | 1 GB |
| Standard | 25,000 | 100,000 | 10 GB |
| Professional | 100,000 | 500,000 | 50 GB |
| Enterprise | Custom | Custom | Custom |

### Resource Limits

**Functions**:
- Maximum execution time: 30 seconds
- Maximum memory: 512 MB
- Maximum deployment size: 50 MB

**Data Store**:
- Maximum row size: 1 MB
- Maximum table columns: 250
- Maximum query results: 5,000 rows

**File Store**:
- Maximum file size: 100 MB
- Maximum files per folder: 10,000

**Cache**:
- Maximum value size: 1 MB
- Maximum TTL: 7 days
- Maximum keys per segment: 10,000

### Rate Limit Headers

```http
X-RateLimit-Limit: 25000
X-RateLimit-Remaining: 24850
X-RateLimit-Reset: 1673827200
```

### Handling Rate Limits

**JavaScript Example**:
```javascript
const makeRequestWithRetry = async (fn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.response?.status === 429 && i < maxRetries - 1) {
        const resetTime = error.response.headers['x-ratelimit-reset'];
        const waitTime = (resetTime * 1000) - Date.now();
        console.log(`Rate limit hit. Waiting ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else {
        throw error;
      }
    }
  }
};
```

---

## Data Centers

Zoho Catalyst operates in multiple data centers. Use the appropriate base URL:

| Data Center | Base URL | Accounts URL |
|-------------|----------|--------------|
| US | https://api.catalyst.zoho.com | https://accounts.zoho.com |
| EU | https://api.catalyst.zoho.eu | https://accounts.zoho.eu |
| IN | https://api.catalyst.zoho.in | https://accounts.zoho.in |
| AU | https://api.catalyst.zoho.com.au | https://accounts.zoho.com.au |
| JP | https://api.catalyst.zoho.jp | https://accounts.zoho.jp |

---

## Error Codes

### HTTP Status Codes

| Status | Meaning | Common Causes |
|--------|---------|---------------|
| 200 | Success | Request completed successfully |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid parameters or request format |
| 401 | Unauthorized | Invalid or expired access token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource does not exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |
| 503 | Service Unavailable | Service temporarily unavailable |

### Catalyst Error Codes

| Code | Message | Description | Solution |
|------|---------|-------------|----------|
| 1001 | Invalid project ID | Project does not exist | Verify project ID |
| 1002 | Invalid table ID | Table does not exist | Verify table ID |
| 1003 | Invalid row ID | Row does not exist | Verify row ID |
| 1004 | Duplicate entry | Row with unique key exists | Update instead of create |
| 1005 | Invalid query syntax | ZCQL syntax error | Check query syntax |
| 1006 | Function execution failed | Function threw error | Check function logs |
| 1007 | Insufficient storage | Storage quota exceeded | Upgrade plan or clean up |
| 1008 | Invalid file type | File type not allowed | Check allowed file types |
| 1009 | Cache key not found | Key does not exist or expired | Check key and TTL |
| 1010 | Authentication failed | Invalid credentials | Verify credentials |

### Error Response Format

```json
{
  "status": "error",
  "code": 1002,
  "message": "Invalid table ID",
  "details": {
    "tableId": "invalid_table_123",
    "suggestion": "Please verify the table ID exists in your project"
  }
}
```

---

## Common Operations

### 1. Complete CRUD Workflow

```javascript
// JavaScript/Node.js - Complete data store workflow
const performCRUDOperations = async (accessToken, projectId, tableId) => {
  try {
    // CREATE
    const newRow = await createRow(accessToken, projectId, tableId, {
      name: 'John Doe',
      email: 'john@example.com',
      status: 'active'
    });
    console.log('Created:', newRow);

    const rowId = newRow.data.ROWID;

    // READ
    const row = await axios.get(
      `https://api.catalyst.zoho.com/baas/v1/project/${projectId}/table/${tableId}/row/${rowId}`,
      {
        headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}` }
      }
    );
    console.log('Read:', row.data);

    // UPDATE
    const updated = await axios.put(
      `https://api.catalyst.zoho.com/baas/v1/project/${projectId}/table/${tableId}/row/${rowId}`,
      { status: 'inactive' },
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Updated:', updated.data);

    // DELETE
    await axios.delete(
      `https://api.catalyst.zoho.com/baas/v1/project/${projectId}/table/${tableId}/row/${rowId}`,
      {
        headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}` }
      }
    );
    console.log('Deleted successfully');

  } catch (error) {
    console.error('CRUD operation failed:', error.response?.data || error.message);
  }
};
```

### 2. Bulk Data Operations

```javascript
// JavaScript/Node.js - Bulk insert
const bulkInsertRows = async (accessToken, projectId, tableId, rows) => {
  const response = await axios.post(
    `https://api.catalyst.zoho.com/baas/v1/project/${projectId}/table/${tableId}/bulk`,
    {
      operation: 'insert',
      data: rows
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

// Usage - Insert 100 rows
const rows = Array.from({ length: 100 }, (_, i) => ({
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  status: 'active'
}));

const result = await bulkInsertRows(accessToken, projectId, tableId, rows);
console.log(`Inserted ${result.data.insertedCount} rows`);
```

### 3. Function with Data Store Integration

```javascript
// JavaScript/Node.js - Catalyst Function
const catalystSDK = require('zcatalyst-sdk-node');

module.exports = async (context, basicIO) => {
  const app = catalystSDK.initialize(context);

  try {
    // Get request data
    const requestData = basicIO.getArgument();

    // Query data store
    const datastore = app.datastore();
    const table = datastore.table('Users');

    const rows = await table.getRows({
      where: `email='${requestData.email}'`
    });

    if (rows.length > 0) {
      // Update existing user
      const user = rows[0];
      user.lastLogin = new Date().toISOString();
      await table.updateRow(user);

      basicIO.write({
        status: 'success',
        message: 'User login recorded',
        user: user
      });
    } else {
      basicIO.write({
        status: 'error',
        message: 'User not found'
      });
    }
  } catch (error) {
    basicIO.write({
      status: 'error',
      message: error.message
    });
  }
};
```

### 4. File Upload with Metadata

```python
# Python - Upload file with custom metadata
def upload_file_with_metadata(access_token, project_id, folder_id, file_path, metadata):
    url = f'https://api.catalyst.zoho.com/baas/v1/project/{project_id}/folder/{folder_id}/file'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }

    with open(file_path, 'rb') as f:
        files = {'file': f}
        data = {
            'metadata': json.dumps(metadata)
        }
        response = requests.post(url, headers=headers, files=files, data=data)

    return response.json()

# Usage
metadata = {
    'category': 'invoice',
    'year': 2025,
    'customer': 'Acme Corp',
    'amount': 5000.00,
    'tags': ['paid', 'Q1']
}

result = upload_file_with_metadata(
    access_token,
    project_id,
    folder_id,
    './invoice_001.pdf',
    metadata
)
print('File uploaded with metadata:', result)
```

---

## Best Practices

### 1. Security

**Secure Token Storage**:
```javascript
// Good: Use environment variables
const config = {
  clientId: process.env.CATALYST_CLIENT_ID,
  clientSecret: process.env.CATALYST_CLIENT_SECRET,
  projectId: process.env.CATALYST_PROJECT_ID
};

// Bad: Hard-coded credentials
const config = {
  clientId: '1000.ABC123',
  clientSecret: 'secret123'
};
```

### 2. Error Handling

**Comprehensive Error Handling**:
```javascript
const executeFunctionSafely = async (accessToken, projectId, functionId, data) => {
  try {
    const result = await executeFunction(accessToken, projectId, functionId, data);
    return { success: true, data: result };
  } catch (error) {
    console.error('Function execution failed:', {
      status: error.response?.status,
      code: error.response?.data?.code,
      message: error.response?.data?.message
    });

    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
};
```

### 3. Performance Optimization

**Use Caching**:
```javascript
// Cache frequently accessed data
const getCachedData = async (accessToken, projectId, key) => {
  try {
    // Try cache first
    const cached = await getCache(accessToken, projectId, 'api_cache', key);
    return cached.data;
  } catch (error) {
    // Cache miss - fetch from data store
    const fresh = await fetchFromDataStore(accessToken, projectId);

    // Store in cache for 5 minutes
    await setCache(accessToken, projectId, 'api_cache', key, fresh, 300);

    return fresh;
  }
};
```

### 4. Monitoring and Logging

**Function Logging**:
```javascript
// Catalyst Function with comprehensive logging
module.exports = async (context, basicIO) => {
  const app = catalystSDK.initialize(context);
  const logger = app.logger();

  logger.info('Function started', {
    timestamp: new Date().toISOString(),
    requestData: basicIO.getArgument()
  });

  try {
    // Function logic
    const result = await processData();

    logger.info('Function completed', {
      timestamp: new Date().toISOString(),
      result: result
    });

    basicIO.write(result);
  } catch (error) {
    logger.error('Function failed', {
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack
    });

    basicIO.write({
      status: 'error',
      message: error.message
    });
  }
};
```

---

## SDKs and Libraries

### Official Catalyst SDKs

**Node.js**:
```bash
npm install zcatalyst-sdk-node
```

**Python**:
```bash
pip install zcatalyst-sdk
```

**Java**:
```xml
<dependency>
    <groupId>com.zoho</groupId>
    <artifactId>zcatalyst-sdk-java</artifactId>
    <version>1.0.0</version>
</dependency>
```

### SDK Usage Examples

**Node.js SDK**:
```javascript
const catalystSDK = require('zcatalyst-sdk-node');

// In Catalyst Function
module.exports = async (context, basicIO) => {
  const app = catalystSDK.initialize(context);

  // Data Store
  const datastore = app.datastore();
  const table = datastore.table('Users');
  const rows = await table.getAllRows();

  // File Store
  const filestore = app.filestore();
  const folder = filestore.folder('Documents');
  const files = await folder.getAllFiles();

  // Cache
  const cache = app.cache();
  const segment = cache.segment('sessions');
  await segment.put('key1', { data: 'value' }, 3600);

  basicIO.write({ success: true });
};
```

---

## Additional Resources

- [Official Catalyst Documentation](https://catalyst.zoho.com/docs/)
- [Catalyst Console](https://catalyst.zoho.com/console/)
- [API Console](https://api-console.zoho.com/)
- [Developer Forums](https://help.zoho.com/portal/en/community/catalyst)
- [GitHub Examples](https://github.com/zoho/catalyst-samples)

---

**Last Updated**: December 2025
**API Version**: v2
