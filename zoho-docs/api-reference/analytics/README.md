# Zoho Analytics API Reference

## Overview

Zoho Analytics is a comprehensive business intelligence and analytics platform that enables data visualization, reporting, and analysis. The API provides programmatic access to workspaces, reports, dashboards, and data manipulation capabilities.

**Current API Version**: v2
**Base URL**: `https://analyticsapi.zoho.com/restapi/v2/`
**Protocol**: REST
**Data Formats**: JSON, XML, CSV, PDF, HTML, Image (PNG, JPG)
**Authentication**: OAuth 2.0

---

## Quick Links

- [Authentication](#authentication)
- [Workspace APIs](#workspace-apis)
- [Report APIs](#report-apis)
- [Dashboard APIs](#dashboard-apis)
- [Data APIs](#data-apis)
- [SQL Query API](#sql-query-api)
- [Export APIs](#export-apis)
- [Rate Limits](#rate-limits)
- [Error Handling](#error-handling)
- [Code Examples](#code-examples)
- [Best Practices](#best-practices)

---

## API Categories

### 1. Workspace APIs
**Purpose**: Manage workspaces (previously called databases) and their metadata

**Endpoints**:
```http
GET    /workspaces                           # List all workspaces
GET    /workspaces/{workspace-id}            # Get workspace details
POST   /workspaces                           # Create workspace
PUT    /workspaces/{workspace-id}            # Update workspace
DELETE /workspaces/{workspace-id}            # Delete workspace
GET    /workspaces/{workspace-id}/tables     # List tables in workspace
GET    /workspaces/{workspace-id}/views      # List views in workspace
```

**Example - List All Workspaces**:
```http
GET https://analyticsapi.zoho.com/restapi/v2/workspaces
Authorization: Zoho-oauthtoken {access_token}
```

**Response**:
```json
{
  "status": "success",
  "data": {
    "workspaces": [
      {
        "workspaceId": "123456000000012345",
        "workspaceName": "Sales Analytics",
        "createdTime": "2025-01-15 10:30:00",
        "ownerId": "123456000000098765",
        "ownerName": "John Doe"
      },
      {
        "workspaceId": "123456000000012346",
        "workspaceName": "Marketing Dashboard",
        "createdTime": "2025-01-10 14:20:00",
        "ownerId": "123456000000098765",
        "ownerName": "John Doe"
      }
    ]
  }
}
```

**Example - Create Workspace**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const createWorkspace = async (accessToken, workspaceName, description) => {
  const response = await axios.post(
    'https://analyticsapi.zoho.com/restapi/v2/workspaces',
    {
      workspaceName: workspaceName,
      workspaceDescription: description
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
```

```python
# Python
import requests

def create_workspace(access_token, workspace_name, description):
    url = 'https://analyticsapi.zoho.com/restapi/v2/workspaces'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'workspaceName': workspace_name,
        'workspaceDescription': description
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

```deluge
// Deluge
workspace_data = {
    "workspaceName": "Q1 Sales Report",
    "workspaceDescription": "First quarter sales analytics"
};

response = invokeurl
[
    url: "https://analyticsapi.zoho.com/restapi/v2/workspaces"
    type: POST
    parameters: workspace_data.toString()
    connection: "zoho_analytics_connection"
];
info response;
```

---

### 2. Report APIs
**Purpose**: Create, manage, and retrieve reports from workspaces

**Endpoints**:
```http
GET    /workspaces/{workspace-id}/reports                    # List all reports
GET    /workspaces/{workspace-id}/reports/{report-id}        # Get report details
POST   /workspaces/{workspace-id}/reports                    # Create report
PUT    /workspaces/{workspace-id}/reports/{report-id}        # Update report
DELETE /workspaces/{workspace-id}/reports/{report-id}        # Delete report
GET    /workspaces/{workspace-id}/reports/{report-id}/data   # Fetch report data
```

**Example - Get Report Data**:
```http
GET https://analyticsapi.zoho.com/restapi/v2/workspaces/123456000000012345/reports/123456000000054321/data
Authorization: Zoho-oauthtoken {access_token}
```

**Response**:
```json
{
  "status": "success",
  "data": {
    "columns": [
      {
        "columnName": "Region",
        "dataType": "TEXT"
      },
      {
        "columnName": "Sales",
        "dataType": "NUMBER"
      },
      {
        "columnName": "Revenue",
        "dataType": "NUMBER"
      }
    ],
    "rows": [
      ["North America", 1500, 250000],
      ["Europe", 1200, 180000],
      ["Asia Pacific", 1800, 320000]
    ]
  }
}
```

**Example - Create Report with JavaScript**:
```javascript
const createReport = async (accessToken, workspaceId, reportConfig) => {
  const response = await axios.post(
    `https://analyticsapi.zoho.com/restapi/v2/workspaces/${workspaceId}/reports`,
    {
      reportName: reportConfig.name,
      reportType: reportConfig.type, // 'table', 'chart', 'pivot'
      criteria: reportConfig.criteria,
      chartType: reportConfig.chartType, // 'bar', 'line', 'pie', etc.
      xAxis: reportConfig.xAxis,
      yAxis: reportConfig.yAxis
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
```

---

### 3. Dashboard APIs
**Purpose**: Manage dashboards and their components

**Endpoints**:
```http
GET    /workspaces/{workspace-id}/dashboards                     # List all dashboards
GET    /workspaces/{workspace-id}/dashboards/{dashboard-id}      # Get dashboard details
POST   /workspaces/{workspace-id}/dashboards                     # Create dashboard
PUT    /workspaces/{workspace-id}/dashboards/{dashboard-id}      # Update dashboard
DELETE /workspaces/{workspace-id}/dashboards/{dashboard-id}      # Delete dashboard
GET    /workspaces/{workspace-id}/dashboards/{dashboard-id}/views # Get dashboard views
```

**Example - List Dashboards**:
```javascript
const listDashboards = async (accessToken, workspaceId) => {
  const response = await axios.get(
    `https://analyticsapi.zoho.com/restapi/v2/workspaces/${workspaceId}/dashboards`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

**Response**:
```json
{
  "status": "success",
  "data": {
    "dashboards": [
      {
        "dashboardId": "123456000000087654",
        "dashboardName": "Sales Overview",
        "createdTime": "2025-01-15 10:30:00",
        "modifiedTime": "2025-01-20 14:45:00",
        "viewCount": 245
      }
    ]
  }
}
```

---

### 4. Data APIs
**Purpose**: Import, add, update, and delete data in workspace tables

**Endpoints**:
```http
POST   /workspaces/{workspace-id}/tables/{table-name}/rows          # Add rows
PUT    /workspaces/{workspace-id}/tables/{table-name}/rows          # Update rows
DELETE /workspaces/{workspace-id}/tables/{table-name}/rows          # Delete rows
POST   /workspaces/{workspace-id}/data/import                       # Import data from file
GET    /workspaces/{workspace-id}/tables/{table-name}/data          # Fetch table data
POST   /workspaces/{workspace-id}/tables/{table-name}/truncate      # Truncate table
```

**Example - Add Rows**:
```http
POST https://analyticsapi.zoho.com/restapi/v2/workspaces/123456000000012345/tables/Sales_Data/rows
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "data": [
    {
      "Region": "North America",
      "Product": "Widget A",
      "Sales": 1500,
      "Revenue": 75000,
      "Date": "2025-01-15"
    },
    {
      "Region": "Europe",
      "Product": "Widget B",
      "Sales": 1200,
      "Revenue": 60000,
      "Date": "2025-01-15"
    }
  ]
}
```

**Response**:
```json
{
  "status": "success",
  "data": {
    "rowsAdded": 2,
    "importId": "123456000000098765"
  }
}
```

**Example - Update Rows with Python**:
```python
def update_rows(access_token, workspace_id, table_name, updates):
    url = f'https://analyticsapi.zoho.com/restapi/v2/workspaces/{workspace_id}/tables/{table_name}/rows'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'criteria': updates['criteria'],  # e.g., "Region='North America'"
        'updateInfo': updates['values']   # New values to set
    }
    response = requests.put(url, json=data, headers=headers)
    return response.json()
```

**Example - Import Data from CSV**:
```javascript
const importCSV = async (accessToken, workspaceId, tableName, csvData) => {
  const formData = new FormData();
  formData.append('file', csvData);
  formData.append('importType', 'append'); // or 'truncateadd', 'updateadd'

  const response = await axios.post(
    `https://analyticsapi.zoho.com/restapi/v2/workspaces/${workspaceId}/data/import`,
    formData,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'multipart/form-data'
      },
      params: {
        tableName: tableName
      }
    }
  );
  return response.data;
};
```

---

### 5. SQL Query API
**Purpose**: Execute custom SQL queries on workspace data

**Endpoint**:
```http
POST /workspaces/{workspace-id}/queries
```

**Supported SQL Commands**:
- SELECT (with JOINs, WHERE, GROUP BY, ORDER BY, LIMIT)
- Aggregate functions (SUM, AVG, COUNT, MIN, MAX)
- Date functions
- String functions
- Mathematical operations

**Example - Execute SQL Query**:
```http
POST https://analyticsapi.zoho.com/restapi/v2/workspaces/123456000000012345/queries
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "query": "SELECT Region, Product, SUM(Sales) as TotalSales, SUM(Revenue) as TotalRevenue FROM Sales_Data WHERE Date >= '2025-01-01' GROUP BY Region, Product ORDER BY TotalRevenue DESC LIMIT 10"
}
```

**Response**:
```json
{
  "status": "success",
  "data": {
    "columns": [
      {"columnName": "Region", "dataType": "TEXT"},
      {"columnName": "Product", "dataType": "TEXT"},
      {"columnName": "TotalSales", "dataType": "NUMBER"},
      {"columnName": "TotalRevenue", "dataType": "NUMBER"}
    ],
    "rows": [
      ["Asia Pacific", "Widget A", 3200, 160000],
      ["North America", "Widget B", 2800, 140000],
      ["Europe", "Widget A", 2400, 120000]
    ]
  }
}
```

**JavaScript Implementation**:
```javascript
const executeSQLQuery = async (accessToken, workspaceId, sqlQuery) => {
  const response = await axios.post(
    `https://analyticsapi.zoho.com/restapi/v2/workspaces/${workspaceId}/queries`,
    {
      query: sqlQuery
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

// Usage
const query = `
  SELECT
    Region,
    COUNT(*) as OrderCount,
    SUM(Revenue) as TotalRevenue,
    AVG(Revenue) as AvgRevenue
  FROM Sales_Data
  WHERE Date BETWEEN '2025-01-01' AND '2025-01-31'
  GROUP BY Region
  HAVING SUM(Revenue) > 100000
  ORDER BY TotalRevenue DESC
`;

const results = await executeSQLQuery(accessToken, workspaceId, query);
```

**Python Implementation**:
```python
def execute_sql_query(access_token, workspace_id, sql_query):
    url = f'https://analyticsapi.zoho.com/restapi/v2/workspaces/{workspace_id}/queries'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {'query': sql_query}
    response = requests.post(url, json=data, headers=headers)
    return response.json()

# Usage with complex query
query = """
    SELECT
        p.ProductName,
        c.CategoryName,
        SUM(s.Quantity) as TotalQuantity,
        SUM(s.Revenue) as TotalRevenue
    FROM Sales s
    JOIN Products p ON s.ProductId = p.ProductId
    JOIN Categories c ON p.CategoryId = c.CategoryId
    WHERE s.OrderDate >= '2025-01-01'
    GROUP BY p.ProductName, c.CategoryName
    ORDER BY TotalRevenue DESC
    LIMIT 20
"""

results = execute_sql_query(access_token, workspace_id, query)
```

**Deluge Implementation**:
```deluge
// Execute SQL query in Deluge
workspace_id = "123456000000012345";
sql_query = "SELECT Region, SUM(Sales) as Total FROM Sales_Data GROUP BY Region";

query_data = {
    "query": sql_query
};

response = invokeurl
[
    url: "https://analyticsapi.zoho.com/restapi/v2/workspaces/" + workspace_id + "/queries"
    type: POST
    parameters: query_data.toString()
    connection: "zoho_analytics_connection"
];

info response;

// Process results
if(response.get("status") == "success") {
    rows = response.get("data").get("rows");
    for each row in rows {
        info "Region: " + row.get(0) + ", Total Sales: " + row.get(1);
    }
}
```

---

### 6. Export APIs
**Purpose**: Export reports and data in various formats

**Supported Export Formats**:
- CSV
- JSON
- XML
- PDF
- HTML
- PNG (Image)
- JPG (Image)
- XLS/XLSX (Excel)

**Endpoints**:
```http
GET /workspaces/{workspace-id}/reports/{report-id}/export/{format}
GET /workspaces/{workspace-id}/dashboards/{dashboard-id}/export/{format}
```

**Export Formats Parameter**:
- `csv` - Comma-separated values
- `json` - JSON format
- `xml` - XML format
- `pdf` - PDF document
- `html` - HTML format
- `png` - PNG image
- `jpg` - JPG image
- `xls` - Excel spreadsheet

**Example - Export Report as CSV**:
```http
GET https://analyticsapi.zoho.com/restapi/v2/workspaces/123456000000012345/reports/123456000000054321/export/csv
Authorization: Zoho-oauthtoken {access_token}
```

**Example - Export Report as PDF with JavaScript**:
```javascript
const exportReportAsPDF = async (accessToken, workspaceId, reportId) => {
  const response = await axios.get(
    `https://analyticsapi.zoho.com/restapi/v2/workspaces/${workspaceId}/reports/${reportId}/export/pdf`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      },
      responseType: 'blob' // Important for binary data
    }
  );
  return response.data;
};
```

**Example - Export Dashboard as Image (PNG)**:
```python
def export_dashboard_as_image(access_token, workspace_id, dashboard_id, format='png'):
    url = f'https://analyticsapi.zoho.com/restapi/v2/workspaces/{workspace_id}/dashboards/{dashboard_id}/export/{format}'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    response = requests.get(url, headers=headers, stream=True)

    if response.status_code == 200:
        with open(f'dashboard.{format}', 'wb') as f:
            f.write(response.content)
        return f'Dashboard exported as dashboard.{format}'
    return None
```

**Example - Export Multiple Formats**:
```javascript
const exportReportMultipleFormats = async (accessToken, workspaceId, reportId) => {
  const formats = ['csv', 'json', 'pdf'];
  const exports = {};

  for (const format of formats) {
    const response = await axios.get(
      `https://analyticsapi.zoho.com/restapi/v2/workspaces/${workspaceId}/reports/${reportId}/export/${format}`,
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`
        },
        responseType: format === 'pdf' ? 'blob' : 'text'
      }
    );
    exports[format] = response.data;
  }

  return exports;
};
```

**Example - Export with Custom Options**:
```javascript
const exportWithOptions = async (accessToken, workspaceId, reportId) => {
  const response = await axios.get(
    `https://analyticsapi.zoho.com/restapi/v2/workspaces/${workspaceId}/reports/${reportId}/export/pdf`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      },
      params: {
        orientation: 'landscape',  // or 'portrait'
        paperSize: 'A4',           // A4, Letter, Legal
        includeHeader: true,
        includeFooter: true
      },
      responseType: 'blob'
    }
  );
  return response.data;
};
```

**Deluge - Export Report**:
```deluge
// Export report as CSV
workspace_id = "123456000000012345";
report_id = "123456000000054321";

response = invokeurl
[
    url: "https://analyticsapi.zoho.com/restapi/v2/workspaces/" + workspace_id + "/reports/" + report_id + "/export/csv"
    type: GET
    connection: "zoho_analytics_connection"
];

// Save or process the CSV data
info response;
```

---

## Authentication

### OAuth 2.0 Flow

Zoho Analytics uses OAuth 2.0 for secure API authentication.

**Step 1: Register Your Application**
- Go to [Zoho API Console](https://api-console.zoho.com/)
- Register your application
- Select the following scopes for Analytics:
  - `ZohoAnalytics.metadata.read`
  - `ZohoAnalytics.metadata.create`
  - `ZohoAnalytics.metadata.update`
  - `ZohoAnalytics.metadata.delete`
  - `ZohoAnalytics.data.read`
  - `ZohoAnalytics.data.create`
  - `ZohoAnalytics.data.update`
  - `ZohoAnalytics.data.delete`
- Note your Client ID and Client Secret

**Step 2: Generate Authorization Code**
```http
GET https://accounts.zoho.com/oauth/v2/auth?
  scope=ZohoAnalytics.metadata.read,ZohoAnalytics.data.read,ZohoAnalytics.data.create&
  client_id={client_id}&
  response_type=code&
  access_type=offline&
  redirect_uri={redirect_uri}
```

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
  "access_token": "1000.xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "refresh_token": "1000.yyyyyyyyyyyyyyyyyyyyyyyyyyyy",
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

**JavaScript OAuth Implementation**:
```javascript
const axios = require('axios');
const qs = require('querystring');

class ZohoAnalyticsAuth {
  constructor(clientId, clientSecret, redirectUri) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    this.accessToken = null;
    this.refreshToken = null;
  }

  getAuthorizationUrl() {
    const params = {
      scope: 'ZohoAnalytics.metadata.read,ZohoAnalytics.data.read,ZohoAnalytics.data.create',
      client_id: this.clientId,
      response_type: 'code',
      access_type: 'offline',
      redirect_uri: this.redirectUri
    };
    return `https://accounts.zoho.com/oauth/v2/auth?${qs.stringify(params)}`;
  }

  async getAccessToken(authorizationCode) {
    const response = await axios.post(
      'https://accounts.zoho.com/oauth/v2/token',
      qs.stringify({
        grant_type: 'authorization_code',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        code: authorizationCode
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    this.accessToken = response.data.access_token;
    this.refreshToken = response.data.refresh_token;
    return response.data;
  }

  async refreshAccessToken() {
    const response = await axios.post(
      'https://accounts.zoho.com/oauth/v2/token',
      qs.stringify({
        grant_type: 'refresh_token',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: this.refreshToken
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    this.accessToken = response.data.access_token;
    return response.data;
  }
}
```

**Python OAuth Implementation**:
```python
import requests
from urllib.parse import urlencode

class ZohoAnalyticsAuth:
    def __init__(self, client_id, client_secret, redirect_uri):
        self.client_id = client_id
        self.client_secret = client_secret
        self.redirect_uri = redirect_uri
        self.access_token = None
        self.refresh_token = None

    def get_authorization_url(self):
        params = {
            'scope': 'ZohoAnalytics.metadata.read,ZohoAnalytics.data.read,ZohoAnalytics.data.create',
            'client_id': self.client_id,
            'response_type': 'code',
            'access_type': 'offline',
            'redirect_uri': self.redirect_uri
        }
        return f'https://accounts.zoho.com/oauth/v2/auth?{urlencode(params)}'

    def get_access_token(self, authorization_code):
        data = {
            'grant_type': 'authorization_code',
            'client_id': self.client_id,
            'client_secret': self.client_secret,
            'redirect_uri': self.redirect_uri,
            'code': authorization_code
        }
        response = requests.post(
            'https://accounts.zoho.com/oauth/v2/token',
            data=data
        )
        result = response.json()
        self.access_token = result['access_token']
        self.refresh_token = result['refresh_token']
        return result

    def refresh_access_token(self):
        data = {
            'grant_type': 'refresh_token',
            'client_id': self.client_id,
            'client_secret': self.client_secret,
            'refresh_token': self.refresh_token
        }
        response = requests.post(
            'https://accounts.zoho.com/oauth/v2/token',
            data=data
        )
        result = response.json()
        self.access_token = result['access_token']
        return result
```

**Token Lifetime**:
- Access Token: 1 hour
- Refresh Token: Does not expire (store securely)

---

## Rate Limits

### API Call Limits

Zoho Analytics enforces rate limits to ensure fair usage and system stability.

| Plan | API Calls per Day | API Calls per Minute |
|------|-------------------|----------------------|
| Free | 2,500 | 5 |
| Standard | 10,000 | 15 |
| Professional | 25,000 | 30 |
| Enterprise | 50,000 | 60 |
| Custom | Custom limits | Custom limits |

### Data Operation Limits

| Operation | Limit |
|-----------|-------|
| Rows per add/update request | 10,000 |
| File upload size | 100 MB |
| Concurrent API calls | 10 |
| Query execution timeout | 5 minutes |
| Export file size (CSV/JSON) | 500 MB |
| Export file size (PDF) | 50 MB |

### Rate Limit Headers

When you make an API request, the response includes headers indicating your current rate limit status:

```http
X-RateLimit-Limit: 10000
X-RateLimit-Remaining: 9875
X-RateLimit-Reset: 1642147200
```

**Handling Rate Limits in Code**:

```javascript
const makeRequestWithRateLimit = async (accessToken, url, options) => {
  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        ...options.headers
      }
    });

    // Check rate limit headers
    const remaining = response.headers['x-ratelimit-remaining'];
    const reset = response.headers['x-ratelimit-reset'];

    if (remaining < 100) {
      console.warn(`Rate limit warning: Only ${remaining} calls remaining`);
    }

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      // Rate limit exceeded
      const resetTime = error.response.headers['x-ratelimit-reset'];
      const waitTime = (resetTime * 1000) - Date.now();
      console.log(`Rate limit exceeded. Waiting ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return makeRequestWithRateLimit(accessToken, url, options); // Retry
    }
    throw error;
  }
};
```

---

## Error Handling

### Common Error Codes

| HTTP Status | Error Code | Description | Solution |
|-------------|------------|-------------|----------|
| 400 | INVALID_REQUEST | Invalid request parameters | Check request format and required parameters |
| 401 | INVALID_TOKEN | Invalid or expired token | Refresh access token |
| 401 | OAUTH_SCOPE_MISMATCH | Insufficient permissions | Update OAuth scopes |
| 403 | NO_PERMISSION | User lacks workspace access | Grant workspace permissions |
| 404 | RESOURCE_NOT_FOUND | Workspace/report/dashboard not found | Verify resource ID |
| 429 | RATE_LIMIT_EXCEEDED | API rate limit exceeded | Implement rate limiting and backoff |
| 500 | INTERNAL_SERVER_ERROR | Server error | Retry with exponential backoff |
| 503 | SERVICE_UNAVAILABLE | Service temporarily unavailable | Retry after delay |

### Error Response Format

```json
{
  "status": "failure",
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Invalid workspace ID provided",
    "details": "The workspace ID '12345' does not exist or you don't have access to it"
  }
}
```

### Error Handling Implementation

**JavaScript**:
```javascript
class ZohoAnalyticsClient {
  async makeRequest(method, endpoint, data = null) {
    try {
      const config = {
        method: method,
        url: `https://analyticsapi.zoho.com/restapi/v2/${endpoint}`,
        headers: {
          'Authorization': `Zoho-oauthtoken ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      };

      if (data) {
        config.data = data;
      }

      const response = await axios(config);
      return response.data;

    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;

        switch (status) {
          case 401:
            // Token expired, refresh and retry
            await this.refreshToken();
            return this.makeRequest(method, endpoint, data);

          case 429:
            // Rate limit exceeded, wait and retry
            const retryAfter = error.response.headers['retry-after'] || 60;
            await this.sleep(retryAfter * 1000);
            return this.makeRequest(method, endpoint, data);

          case 500:
          case 503:
            // Server error, retry with exponential backoff
            await this.retryWithBackoff(() => this.makeRequest(method, endpoint, data));
            break;

          default:
            throw new Error(`API Error: ${errorData.error.message}`);
        }
      }
      throw error;
    }
  }

  async retryWithBackoff(fn, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        const delay = Math.pow(2, i) * 1000; // Exponential backoff
        await this.sleep(delay);
      }
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

**Python**:
```python
import time
import requests
from requests.exceptions import RequestException

class ZohoAnalyticsClient:
    def __init__(self, access_token):
        self.access_token = access_token
        self.base_url = 'https://analyticsapi.zoho.com/restapi/v2'

    def make_request(self, method, endpoint, data=None, max_retries=3):
        url = f'{self.base_url}/{endpoint}'
        headers = {
            'Authorization': f'Zoho-oauthtoken {self.access_token}',
            'Content-Type': 'application/json'
        }

        for attempt in range(max_retries):
            try:
                if method == 'GET':
                    response = requests.get(url, headers=headers)
                elif method == 'POST':
                    response = requests.post(url, json=data, headers=headers)
                elif method == 'PUT':
                    response = requests.put(url, json=data, headers=headers)
                elif method == 'DELETE':
                    response = requests.delete(url, headers=headers)

                # Check for errors
                if response.status_code == 401:
                    # Token expired, refresh and retry
                    self.refresh_token()
                    continue

                elif response.status_code == 429:
                    # Rate limit exceeded
                    retry_after = int(response.headers.get('Retry-After', 60))
                    print(f'Rate limit exceeded. Waiting {retry_after} seconds')
                    time.sleep(retry_after)
                    continue

                elif response.status_code >= 500:
                    # Server error, retry with exponential backoff
                    if attempt < max_retries - 1:
                        wait_time = (2 ** attempt)
                        print(f'Server error. Retrying in {wait_time} seconds')
                        time.sleep(wait_time)
                        continue

                response.raise_for_status()
                return response.json()

            except RequestException as e:
                if attempt == max_retries - 1:
                    raise Exception(f'API request failed after {max_retries} attempts: {str(e)}')
                time.sleep(2 ** attempt)

        raise Exception('Max retries exceeded')
```

**Deluge**:
```deluge
// Error handling in Deluge
response = invokeurl
[
    url: "https://analyticsapi.zoho.com/restapi/v2/workspaces"
    type: GET
    connection: "zoho_analytics_connection"
];

if(response.get("status") == "failure") {
    error_code = response.get("error").get("code");
    error_message = response.get("error").get("message");

    if(error_code == "INVALID_TOKEN") {
        // Handle token expiration
        info "Token expired, please refresh";
    }
    else if(error_code == "RATE_LIMIT_EXCEEDED") {
        // Handle rate limit
        info "Rate limit exceeded, please wait";
    }
    else {
        // Handle other errors
        info "Error: " + error_message;
    }
}
else {
    // Process successful response
    workspaces = response.get("data").get("workspaces");
    info workspaces;
}
```

---

## Code Examples

### Complete Workflow Examples

#### Example 1: Create Workspace and Import Data

**JavaScript**:
```javascript
const ZohoAnalytics = require('./zoho-analytics-client');

async function setupWorkspaceAndImportData() {
  const client = new ZohoAnalytics(accessToken);

  // 1. Create workspace
  const workspace = await client.createWorkspace({
    workspaceName: 'Sales Analytics 2025',
    workspaceDescription: 'Q1 Sales data and reports'
  });

  const workspaceId = workspace.data.workspaceId;
  console.log(`Workspace created: ${workspaceId}`);

  // 2. Create table structure
  const table = await client.createTable(workspaceId, {
    tableName: 'Sales_Data',
    columns: [
      { columnName: 'Date', dataType: 'DATE' },
      { columnName: 'Region', dataType: 'TEXT' },
      { columnName: 'Product', dataType: 'TEXT' },
      { columnName: 'Sales', dataType: 'NUMBER' },
      { columnName: 'Revenue', dataType: 'NUMBER' }
    ]
  });

  console.log('Table created');

  // 3. Import data
  const salesData = [
    { Date: '2025-01-15', Region: 'North America', Product: 'Widget A', Sales: 1500, Revenue: 75000 },
    { Date: '2025-01-15', Region: 'Europe', Product: 'Widget B', Sales: 1200, Revenue: 60000 },
    { Date: '2025-01-16', Region: 'Asia Pacific', Product: 'Widget A', Sales: 1800, Revenue: 90000 }
  ];

  const importResult = await client.addRows(workspaceId, 'Sales_Data', salesData);
  console.log(`Imported ${importResult.data.rowsAdded} rows`);

  // 4. Create a report
  const report = await client.createReport(workspaceId, {
    reportName: 'Sales by Region',
    reportType: 'chart',
    chartType: 'bar',
    tableName: 'Sales_Data',
    xAxis: 'Region',
    yAxis: 'Revenue'
  });

  console.log(`Report created: ${report.data.reportId}`);

  // 5. Export report as PDF
  const pdf = await client.exportReport(workspaceId, report.data.reportId, 'pdf');
  console.log('Report exported as PDF');

  return {
    workspaceId,
    reportId: report.data.reportId
  };
}
```

#### Example 2: Data Analysis with SQL Queries

**Python**:
```python
import pandas as pd
from zoho_analytics_client import ZohoAnalyticsClient

def analyze_sales_data(access_token, workspace_id):
    client = ZohoAnalyticsClient(access_token)

    # 1. Get top performing regions
    query1 = """
        SELECT
            Region,
            SUM(Sales) as TotalSales,
            SUM(Revenue) as TotalRevenue,
            AVG(Revenue) as AvgRevenue
        FROM Sales_Data
        WHERE Date >= '2025-01-01'
        GROUP BY Region
        ORDER BY TotalRevenue DESC
    """

    top_regions = client.execute_query(workspace_id, query1)
    print("Top Performing Regions:")
    print(pd.DataFrame(top_regions['data']['rows'],
                      columns=[col['columnName'] for col in top_regions['data']['columns']]))

    # 2. Product performance analysis
    query2 = """
        SELECT
            Product,
            COUNT(DISTINCT Date) as SalesDays,
            SUM(Sales) as TotalUnits,
            SUM(Revenue) as TotalRevenue,
            SUM(Revenue) / SUM(Sales) as AvgPricePerUnit
        FROM Sales_Data
        GROUP BY Product
        ORDER BY TotalRevenue DESC
    """

    product_analysis = client.execute_query(workspace_id, query2)
    print("\nProduct Performance:")
    print(pd.DataFrame(product_analysis['data']['rows'],
                      columns=[col['columnName'] for col in product_analysis['data']['columns']]))

    # 3. Time-based trends
    query3 = """
        SELECT
            DATE_FORMAT(Date, '%Y-%m') as Month,
            Region,
            SUM(Revenue) as MonthlyRevenue
        FROM Sales_Data
        GROUP BY DATE_FORMAT(Date, '%Y-%m'), Region
        ORDER BY Month, MonthlyRevenue DESC
    """

    trends = client.execute_query(workspace_id, query3)
    print("\nMonthly Trends by Region:")
    print(pd.DataFrame(trends['data']['rows'],
                      columns=[col['columnName'] for col in trends['data']['columns']]))

    return {
        'top_regions': top_regions,
        'product_analysis': product_analysis,
        'trends': trends
    }
```

#### Example 3: Automated Report Generation and Distribution

**JavaScript**:
```javascript
const nodemailer = require('nodemailer');

async function generateAndDistributeReports(accessToken, workspaceId) {
  const client = new ZohoAnalytics(accessToken);

  // 1. Get all reports in workspace
  const reports = await client.listReports(workspaceId);

  // 2. Export each report in multiple formats
  const exports = {};
  for (const report of reports.data.reports) {
    console.log(`Processing report: ${report.reportName}`);

    exports[report.reportId] = {
      name: report.reportName,
      pdf: await client.exportReport(workspaceId, report.reportId, 'pdf'),
      csv: await client.exportReport(workspaceId, report.reportId, 'csv'),
      json: await client.exportReport(workspaceId, report.reportId, 'json')
    };
  }

  // 3. Create dashboard snapshot
  const dashboards = await client.listDashboards(workspaceId);
  for (const dashboard of dashboards.data.dashboards) {
    const snapshot = await client.exportDashboard(
      workspaceId,
      dashboard.dashboardId,
      'png'
    );

    exports[`dashboard_${dashboard.dashboardId}`] = {
      name: dashboard.dashboardName,
      png: snapshot
    };
  }

  // 4. Send via email (using nodemailer)
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const attachments = Object.values(exports).map(exp => ({
    filename: `${exp.name}.pdf`,
    content: exp.pdf
  }));

  await transporter.sendMail({
    from: 'reports@company.com',
    to: 'management@company.com',
    subject: 'Weekly Analytics Report',
    text: 'Please find attached the weekly analytics reports.',
    attachments: attachments
  });

  console.log('Reports sent successfully');
  return exports;
}
```

#### Example 4: Real-time Data Sync

**Python**:
```python
import time
import schedule

class RealTimeDataSync:
    def __init__(self, access_token, workspace_id, table_name):
        self.client = ZohoAnalyticsClient(access_token)
        self.workspace_id = workspace_id
        self.table_name = table_name

    def fetch_data_from_source(self):
        """Fetch data from your source system (database, API, etc.)"""
        # This is a placeholder - implement your data source logic
        import random
        return [
            {
                'Date': time.strftime('%Y-%m-%d'),
                'Region': random.choice(['North America', 'Europe', 'Asia Pacific']),
                'Product': random.choice(['Widget A', 'Widget B', 'Widget C']),
                'Sales': random.randint(100, 2000),
                'Revenue': random.randint(5000, 100000)
            }
            for _ in range(10)
        ]

    def sync_data(self):
        """Sync data to Zoho Analytics"""
        try:
            print(f"Starting data sync at {time.strftime('%Y-%m-%d %H:%M:%S')}")

            # Fetch new data
            new_data = self.fetch_data_from_source()

            if new_data:
                # Add to Zoho Analytics
                result = self.client.add_rows(
                    self.workspace_id,
                    self.table_name,
                    new_data
                )

                print(f"Synced {result['data']['rowsAdded']} rows successfully")
            else:
                print("No new data to sync")

        except Exception as e:
            print(f"Error during sync: {str(e)}")

    def start_scheduled_sync(self, interval_minutes=15):
        """Start scheduled data sync"""
        schedule.every(interval_minutes).minutes.do(self.sync_data)

        print(f"Scheduled sync every {interval_minutes} minutes")
        print("Press Ctrl+C to stop")

        while True:
            schedule.run_pending()
            time.sleep(1)

# Usage
sync = RealTimeDataSync(access_token, workspace_id, 'Sales_Data')
sync.start_scheduled_sync(interval_minutes=15)
```

#### Example 5: Bulk Data Operations

**Deluge**:
```deluge
// Bulk data import and processing in Deluge
workspace_id = "123456000000012345";
table_name = "Sales_Data";

// 1. Fetch data from Zoho CRM
crm_deals = zoho.crm.getRecords("Deals", 1, 200);

// 2. Transform data for Analytics
analytics_data = List();

for each deal in crm_deals {
    row = Map();
    row.put("Date", deal.get("Closing_Date"));
    row.put("Region", deal.get("Account_Name").get("Region"));
    row.put("Product", deal.get("Product_Name"));
    row.put("Sales", 1);
    row.put("Revenue", deal.get("Amount"));
    analytics_data.add(row);
}

// 3. Import to Zoho Analytics
import_params = {
    "data": analytics_data
};

response = invokeurl
[
    url: "https://analyticsapi.zoho.com/restapi/v2/workspaces/" + workspace_id + "/tables/" + table_name + "/rows"
    type: POST
    parameters: import_params.toString()
    connection: "zoho_analytics_connection"
];

if(response.get("status") == "success") {
    rows_added = response.get("data").get("rowsAdded");
    info "Successfully imported " + rows_added + " rows";

    // 4. Run analysis query
    query = "SELECT Region, SUM(Revenue) as Total FROM " + table_name + " GROUP BY Region";
    query_params = {"query": query};

    query_response = invokeurl
    [
        url: "https://analyticsapi.zoho.com/restapi/v2/workspaces/" + workspace_id + "/queries"
        type: POST
        parameters: query_params.toString()
        connection: "zoho_analytics_connection"
    ];

    // 5. Process results
    if(query_response.get("status") == "success") {
        results = query_response.get("data").get("rows");
        for each result in results {
            region = result.get(0);
            total = result.get(1);
            info "Region: " + region + " - Total Revenue: " + total;
        }
    }
}
else {
    error_msg = response.get("error").get("message");
    info "Error: " + error_msg;
}
```

---

## Supported Programming Languages

Zoho Analytics API can be accessed from any programming language that supports HTTP requests. Official SDKs and community libraries are available for:

### 1. JavaScript / Node.js
```bash
npm install zoho-analytics-js
# or use axios for direct API calls
npm install axios
```

**Basic Setup**:
```javascript
const ZohoAnalytics = require('zoho-analytics-js');

const client = new ZohoAnalytics({
  accessToken: 'your_access_token',
  refreshToken: 'your_refresh_token',
  clientId: 'your_client_id',
  clientSecret: 'your_client_secret'
});
```

### 2. Python
```bash
pip install zoho-analytics-python
# or use requests for direct API calls
pip install requests
```

**Basic Setup**:
```python
from zoho_analytics import ZohoAnalytics

client = ZohoAnalytics(
    access_token='your_access_token',
    refresh_token='your_refresh_token',
    client_id='your_client_id',
    client_secret='your_client_secret'
)
```

### 3. Java
```xml
<!-- Maven dependency -->
<dependency>
    <groupId>com.zoho</groupId>
    <artifactId>zoho-analytics-java</artifactId>
    <version>1.0.0</version>
</dependency>
```

**Basic Setup**:
```java
import com.zoho.analytics.ZohoAnalytics;

ZohoAnalytics client = new ZohoAnalytics.Builder()
    .setAccessToken("your_access_token")
    .setRefreshToken("your_refresh_token")
    .setClientId("your_client_id")
    .setClientSecret("your_client_secret")
    .build();

// List workspaces
List<Workspace> workspaces = client.getWorkspaces();
```

### 4. C# / .NET
```bash
dotnet add package Zoho.Analytics
```

**Basic Setup**:
```csharp
using Zoho.Analytics;

var client = new ZohoAnalyticsClient(
    accessToken: "your_access_token",
    refreshToken: "your_refresh_token",
    clientId: "your_client_id",
    clientSecret: "your_client_secret"
);

// List workspaces
var workspaces = await client.GetWorkspacesAsync();
```

### 5. PHP
```bash
composer require zoho/analytics-php
```

**Basic Setup**:
```php
<?php
require 'vendor/autoload.php';

use Zoho\Analytics\ZohoAnalytics;

$client = new ZohoAnalytics([
    'access_token' => 'your_access_token',
    'refresh_token' => 'your_refresh_token',
    'client_id' => 'your_client_id',
    'client_secret' => 'your_client_secret'
]);

// List workspaces
$workspaces = $client->getWorkspaces();
```

### 6. Go (Golang)
```bash
go get github.com/zoho/analytics-go
```

**Basic Setup**:
```go
package main

import (
    "github.com/zoho/analytics-go"
)

func main() {
    client := analytics.NewClient(&analytics.Config{
        AccessToken:  "your_access_token",
        RefreshToken: "your_refresh_token",
        ClientID:     "your_client_id",
        ClientSecret: "your_client_secret",
    })

    // List workspaces
    workspaces, err := client.GetWorkspaces()
    if err != nil {
        panic(err)
    }
}
```

### 7. Deluge (Zoho Native)

Deluge scripts have built-in integration with Zoho Analytics:

```deluge
// Using built-in connection
response = invokeurl
[
    url: "https://analyticsapi.zoho.com/restapi/v2/workspaces"
    type: GET
    connection: "zoho_analytics_connection"
];

// Or using OAuth connection
response = invokeurl
[
    url: "https://analyticsapi.zoho.com/restapi/v2/workspaces"
    type: GET
    parameters: ""
    connection: "your_oauth_connection"
];
```

---

## Best Practices

### 1. Authentication & Security

**Store Credentials Securely**:
```javascript
// Good - Use environment variables
const config = {
  clientId: process.env.ZOHO_CLIENT_ID,
  clientSecret: process.env.ZOHO_CLIENT_SECRET,
  refreshToken: process.env.ZOHO_REFRESH_TOKEN
};

// Bad - Hardcoded credentials
const config = {
  clientId: '1000.ABCDEFG',
  clientSecret: 'secret123',
  refreshToken: '1000.xyz'
};
```

**Implement Token Auto-Refresh**:
```javascript
class ZohoAnalyticsClient {
  async makeRequest(url, options) {
    try {
      return await this.request(url, options);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        await this.refreshAccessToken();
        return await this.request(url, options);
      }
      throw error;
    }
  }
}
```

### 2. Error Handling & Retry Logic

**Implement Exponential Backoff**:
```python
def make_request_with_retry(url, max_retries=3):
    for attempt in range(max_retries):
        try:
            response = requests.get(url)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError as e:
            if e.response.status_code >= 500:
                wait_time = (2 ** attempt) + random.uniform(0, 1)
                time.sleep(wait_time)
            else:
                raise
    raise Exception('Max retries exceeded')
```

### 3. Performance Optimization

**Use Batch Operations**:
```javascript
// Good - Batch insert
await client.addRows(workspaceId, tableName, rowsArray); // Up to 10,000 rows

// Bad - Individual inserts
for (const row of rowsArray) {
  await client.addRows(workspaceId, tableName, [row]);
}
```

**Cache Metadata**:
```javascript
class ZohoAnalyticsClient {
  constructor() {
    this.metadataCache = new Map();
    this.cacheTimeout = 3600000; // 1 hour
  }

  async getWorkspaceMetadata(workspaceId) {
    const cached = this.metadataCache.get(workspaceId);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    const data = await this.fetchWorkspaceMetadata(workspaceId);
    this.metadataCache.set(workspaceId, {
      data: data,
      timestamp: Date.now()
    });
    return data;
  }
}
```

### 4. Data Management

**Validate Data Before Import**:
```python
def validate_and_import(client, workspace_id, table_name, data):
    # Validate data structure
    required_fields = ['Date', 'Region', 'Product', 'Sales', 'Revenue']

    for row in data:
        # Check required fields
        if not all(field in row for field in required_fields):
            raise ValueError(f'Missing required fields in row: {row}')

        # Validate data types
        if not isinstance(row['Sales'], (int, float)):
            raise ValueError(f'Sales must be numeric: {row["Sales"]}')

        # Validate ranges
        if row['Sales'] < 0:
            raise ValueError(f'Sales cannot be negative: {row["Sales"]}')

    # Import validated data
    return client.add_rows(workspace_id, table_name, data)
```

### 5. Rate Limit Management

**Implement Rate Limiting**:
```javascript
const Bottleneck = require('bottleneck');

// Limit to 30 requests per minute for Professional plan
const limiter = new Bottleneck({
  maxConcurrent: 5,
  minTime: 2000 // 2 seconds between requests
});

const makeThrottledRequest = limiter.wrap(async (url, options) => {
  return await axios(url, options);
});
```

### 6. Monitoring & Logging

**Track API Usage**:
```javascript
class ZohoAnalyticsClient {
  constructor() {
    this.requestLog = [];
  }

  async makeRequest(url, options) {
    const startTime = Date.now();

    try {
      const response = await axios(url, options);

      this.logRequest({
        url: url,
        method: options.method,
        status: response.status,
        duration: Date.now() - startTime,
        rateLimit: {
          limit: response.headers['x-ratelimit-limit'],
          remaining: response.headers['x-ratelimit-remaining']
        }
      });

      return response.data;
    } catch (error) {
      this.logRequest({
        url: url,
        method: options.method,
        status: error.response?.status,
        duration: Date.now() - startTime,
        error: error.message
      });
      throw error;
    }
  }

  logRequest(details) {
    this.requestLog.push({
      timestamp: new Date().toISOString(),
      ...details
    });

    // Log to monitoring service
    console.log(`API Request: ${details.method} ${details.url} - ${details.status} (${details.duration}ms)`);
  }
}
```

### 7. Data Synchronization

**Implement Incremental Sync**:
```python
class DataSynchronizer:
    def __init__(self, client, workspace_id):
        self.client = client
        self.workspace_id = workspace_id
        self.last_sync_timestamp = self.load_last_sync_timestamp()

    def sync_incremental_data(self, source_query):
        # Fetch only new/updated records since last sync
        new_data = self.fetch_data_since(self.last_sync_timestamp)

        if new_data:
            # Add new records
            result = self.client.add_rows(
                self.workspace_id,
                'Sales_Data',
                new_data
            )

            # Update sync timestamp
            self.last_sync_timestamp = datetime.now()
            self.save_last_sync_timestamp(self.last_sync_timestamp)

            return result

        return None
```

### 8. Query Optimization

**Optimize SQL Queries**:
```sql
-- Good - Use specific columns and filters
SELECT Region, Product, SUM(Revenue) as TotalRevenue
FROM Sales_Data
WHERE Date >= '2025-01-01'
  AND Region IN ('North America', 'Europe')
GROUP BY Region, Product
LIMIT 100;

-- Bad - Select all columns without filters
SELECT *
FROM Sales_Data;
```

### 9. Error Recovery

**Implement Checkpoint System**:
```javascript
class BulkDataImporter {
  async importLargeDataset(workspaceId, tableName, data, batchSize = 5000) {
    const checkpoints = [];

    for (let i = 0; i < data.length; i += batchSize) {
      try {
        const batch = data.slice(i, i + batchSize);
        const result = await this.client.addRows(workspaceId, tableName, batch);

        checkpoints.push({
          batchNumber: i / batchSize,
          rowsProcessed: i + batch.length,
          status: 'success'
        });

      } catch (error) {
        checkpoints.push({
          batchNumber: i / batchSize,
          rowsProcessed: i,
          status: 'failed',
          error: error.message
        });

        // Save checkpoint for recovery
        await this.saveCheckpoint(checkpoints);
        throw error;
      }
    }

    return checkpoints;
  }
}
```

### 10. Documentation & Comments

**Document Your Integration**:
```javascript
/**
 * Synchronizes sales data from CRM to Analytics
 *
 * @param {string} accessToken - OAuth access token
 * @param {string} workspaceId - Analytics workspace ID
 * @param {Date} startDate - Start date for data sync
 * @param {Date} endDate - End date for data sync
 * @returns {Promise<Object>} Sync results with row count and status
 *
 * @example
 * const result = await syncSalesData(
 *   token,
 *   '123456000000012345',
 *   new Date('2025-01-01'),
 *   new Date('2025-01-31')
 * );
 */
async function syncSalesData(accessToken, workspaceId, startDate, endDate) {
  // Implementation
}
```

---

## Data Centers

Zoho Analytics operates in multiple data centers. Use the appropriate base URL based on your account's data center:

| Data Center | Base URL |
|-------------|----------|
| US | https://analyticsapi.zoho.com |
| EU | https://analyticsapi.zoho.eu |
| IN | https://analyticsapi.zoho.in |
| AU | https://analyticsapi.zoho.com.au |
| JP | https://analyticsapi.zoho.jp |
| CA | https://analyticsapi.zoho.ca |
| CN | https://analyticsapi.zoho.com.cn |

**Detecting Data Center**:
```javascript
const getDataCenterUrl = (apiDomain) => {
  const domainMap = {
    'https://www.zohoapis.com': 'https://analyticsapi.zoho.com',
    'https://www.zohoapis.eu': 'https://analyticsapi.zoho.eu',
    'https://www.zohoapis.in': 'https://analyticsapi.zoho.in',
    'https://www.zohoapis.com.au': 'https://analyticsapi.zoho.com.au',
    'https://www.zohoapis.jp': 'https://analyticsapi.zoho.jp',
    'https://www.zohoapis.ca': 'https://analyticsapi.zoho.ca',
    'https://www.zohoapis.com.cn': 'https://analyticsapi.zoho.com.cn'
  };

  return domainMap[apiDomain] || 'https://analyticsapi.zoho.com';
};
```

---

## API v2 Features and Capabilities

### New in API v2

1. **Enhanced Workspace Management**
   - Support for workspace templates
   - Improved metadata operations
   - Better sharing and permissions API

2. **Advanced Query Capabilities**
   - Support for complex JOINs
   - Subqueries support
   - Enhanced SQL functions
   - Query result caching

3. **Improved Export Options**
   - Support for Excel with formatting
   - Enhanced PDF generation with custom layouts
   - Scheduled exports API
   - Streaming export for large datasets

4. **Real-time Data Operations**
   - Webhook support for data changes
   - Real-time dashboard refresh API
   - Live query execution

5. **Enhanced Security**
   - Row-level security API
   - Data encryption options
   - Audit log API

6. **Performance Improvements**
   - Faster query execution
   - Optimized bulk operations
   - Better pagination support

---

## Additional Resources

### Official Documentation
- [Zoho Analytics API Documentation](https://www.zoho.com/analytics/api/)
- [API v2 Migration Guide](https://www.zoho.com/analytics/api/v2/migration.html)
- [Zoho Analytics Help Center](https://help.zoho.com/portal/en/kb/analytics)

### Developer Tools
- [Open API Specification (OAS)](https://www.zoho.com/analytics/api/v2/openapi.json)
- [Postman Collection](https://www.postman.com/zoho/workspace/zoho-analytics-api)
- [API Console](https://api-console.zoho.com/)

### Community & Support
- [Developer Forums](https://help.zoho.com/portal/en/community/analytics)
- [Stack Overflow - Zoho Analytics](https://stackoverflow.com/questions/tagged/zoho-analytics)
- [GitHub Examples](https://github.com/zoho/analytics-api-examples)

### Video Tutorials
- [Getting Started with Zoho Analytics API](https://www.zoho.com/analytics/resources/videos/)
- [API Integration Webinars](https://www.zoho.com/analytics/webinars/)

### Related APIs
- [Zoho CRM API](https://www.zoho.com/crm/developer/docs/api/v8/)
- [Zoho Books API](https://www.zoho.com/books/api/v3/)
- [Zoho Creator API](https://www.zoho.com/creator/help/api/)

---

## Changelog

### v2.0 (Current)
- Complete API restructure with workspace-based architecture
- Enhanced SQL query capabilities
- Improved export functionality with multiple format support
- Better error handling and response structure
- Rate limit optimization
- Real-time data operation support

### v1.0 (Legacy)
- Basic CRUD operations
- Simple export functionality
- Database-based architecture (now called workspaces)
- Limited query capabilities

---

**Last Updated**: December 2025
**API Version**: v2
**Documentation Version**: 1.0
