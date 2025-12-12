---
type: api_reference
product: zoho_creator
api_version: v2.1
last_updated: 2025-01-15
complexity: intermediate
auth_required: OAuth 2.0
rate_limit_daily: 5000-100000
common_use_cases: ["custom_apps", "database_operations", "workflow_automation", "zcql_queries"]
quick_start_available: true
ai_optimized: true
supports_deluge: true
---

# Zoho Creator API Reference

## Overview

Zoho Creator is a low-code application development platform that enables businesses to build custom applications without extensive programming knowledge. The API provides comprehensive access to create, read, update, and delete records, manage forms, execute workflows, and integrate with external systems.

**Current API Version**: v2.1
**Base URL**: `https://creator.zoho.com/api/v2.1/`
**Protocol**: REST
**Data Format**: JSON, XML
**Authentication**: OAuth 2.0

---

## ⚡ Quick Start

### Jump to Common Operations

| Operation | Time | Difficulty | Link |
|-----------|------|------------|------|
| Add Record | 3 min | ⚡ Easy | [→](#add-record) |
| Get Records | 2 min | ⚡ Easy | [→](#get-records) |
| Update Record | 3 min | ⚡ Easy | [→](#update-record) |
| Delete Record | 2 min | ⚡ Easy | [→](#delete-record) |
| ZCQL Query | 4 min | 🔧 Medium | [→](#zcql-queries) |
| Upload File | 5 min | 🔧 Medium | [→](#file-upload-api) |

### 60-Second Start

```javascript
// 1. Get access token from OAuth
const accessToken = 'YOUR_ACCESS_TOKEN';

// 2. Add your first record
const axios = require('axios');
const response = await axios.post(
  'https://creator.zoho.com/api/v2/account_owner/app_link_name/form/form_link_name',
  {
    data: {
      Customer_Name: 'John Smith',
      Email: 'john@example.com',
      Status: 'Active'
    }
  },
  { headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}` } }
);
console.log('Record created:', response.data.data.ID);
```

[Need OAuth token? → 60-second OAuth setup](../../guides/authentication/README.md#self-client-quickest-for-scripts) | [More examples →](../../QUICK-START.md#8-creator-add-record-3-minutes)

### Related Documentation

- 🔐 [Authentication Guide](../../guides/authentication/README.md) - OAuth 2.0 complete setup
- ⚡ [Quick Start Guide](../../QUICK-START.md) - Copy-paste examples for all products
- 📊 [Rate Limits Guide](../../guides/rate-limits/README.md) - Creator: 5,000-100,000 calls/day
- 🔧 [Error Handling Guide](../../guides/error-handling/README.md) - Common errors and solutions
- 🔗 [Integration Patterns](../../guides/integration-patterns/README.md) - Creator integration hub
- 📘 [API Cheat Sheet](../../quick-reference/api-cheatsheet.md) - Quick syntax reference
- 📝 [Deluge Reference](../../deluge/README.md) - Creator scripting language

---

## Quick Links

- [Authentication](#authentication)
- [Applications API](#applications-api)
- [Forms & Records API](#forms--records-api)
- [Reports API](#reports-api)
- [Views API](#views-api)
- [Workflows API](#workflows-api)
- [Deluge Integration](#deluge-integration)
- [File Upload API](#file-upload-api)
- [User Management](#user-management)
- [Error Codes](#error-codes)
- [Rate Limits](#rate-limits)
- [Code Examples](#code-examples)

---

## API Categories

### 1. Applications API

**Purpose**: List and manage Creator applications

**Endpoints**:
```http
GET    /api/v2.1/{account_owner}/applications   # List all applications
GET    /api/v2.1/{owner}/{app_name}/info        # Get application info
```

**Example - List Applications**:
```http
GET https://creator.zoho.com/api/v2.1/johndoe@company.com/applications
Authorization: Zoho-oauthtoken {access_token}
```

**Response**:
```json
{
  "applications": [
    {
      "link_name": "sales-tracker",
      "application_name": "Sales Tracker",
      "application_version": "1.0",
      "date_created": "15-Jan-2024 10:30:00",
      "shared_type": "Private"
    },
    {
      "link_name": "inventory-management",
      "application_name": "Inventory Management",
      "application_version": "2.1",
      "date_created": "10-Dec-2023 14:20:00",
      "shared_type": "Organization"
    }
  ]
}
```

---

### 2. Forms & Records API

**Purpose**: CRUD operations on form records

**Endpoints**:
```http
GET    /api/v2.1/{owner}/{app_name}/report/{report_name}     # Get records
GET    /api/v2.1/{owner}/{app_name}/report/{report_name}/{id} # Get specific record
POST   /api/v2.1/{owner}/{app_name}/form/{form_name}         # Add record
PUT    /api/v2.1/{owner}/{app_name}/report/{report_name}/{id} # Update record
DELETE /api/v2.1/{owner}/{app_name}/report/{report_name}/{id} # Delete record
```

**Example - Get All Records**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const getRecords = async (accessToken, owner, appName, reportName, filters = {}) => {
  const response = await axios.get(
    `https://creator.zoho.com/api/v2.1/${owner}/${appName}/report/${reportName}`,
    {
      params: {
        from: filters.from || 0,
        limit: filters.limit || 200,
        criteria: filters.criteria
      },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};

// Usage
const records = await getRecords(
  accessToken,
  'johndoe@company.com',
  'sales-tracker',
  'All_Sales',
  {
    limit: 100,
    criteria: '(Status == "Open")'
  }
);
```

**Example - Add Record**:
```python
# Python
import requests

def add_record(access_token, owner, app_name, form_name, record_data):
    url = f'https://creator.zoho.com/api/v2.1/{owner}/{app_name}/form/{form_name}'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'data': record_data
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()

# Usage - Add Sales Record
sales_record = {
    'Customer_Name': 'Acme Corporation',
    'Deal_Value': 50000,
    'Status': 'Open',
    'Expected_Close_Date': '31-Dec-2025',
    'Product': 'Enterprise License',
    'Sales_Rep': 'john.doe@company.com',
    'Notes': 'Follow up next week'
}

result = add_record(
    access_token,
    'johndoe@company.com',
    'sales-tracker',
    'Sales',
    sales_record
)
```

**Example - Update Record**:
```javascript
const updateRecord = async (accessToken, owner, appName, reportName, recordId, updates) => {
  const response = await axios.put(
    `https://creator.zoho.com/api/v2.1/${owner}/${appName}/report/${reportName}/${recordId}`,
    {
      data: updates
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

// Update sales status
await updateRecord(
  accessToken,
  'johndoe@company.com',
  'sales-tracker',
  'All_Sales',
  '12345',
  {
    Status: 'Closed Won',
    Actual_Close_Date: '15-Jan-2025'
  }
);
```

**Example - Delete Record**:
```python
def delete_record(access_token, owner, app_name, report_name, record_id):
    url = f'https://creator.zoho.com/api/v2.1/{owner}/{app_name}/report/{report_name}/{record_id}'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    response = requests.delete(url, headers=headers)
    return response.json()
```

**Criteria Query Examples**:
```javascript
// Single condition
criteria = '(Status == "Open")'

// Multiple conditions with AND
criteria = '(Status == "Open" && Deal_Value > 10000)'

// Multiple conditions with OR
criteria = '(Status == "Open" || Status == "In Progress")'

// Date comparison
criteria = '(Expected_Close_Date > "01-Jan-2025")'

// String contains
criteria = '(Customer_Name.contains("Corp"))'

// Multiple complex conditions
criteria = '((Status == "Open" || Status == "In Progress") && Deal_Value > 10000 && Sales_Rep == "john.doe@company.com")'
```

---

### 3. Reports API

**Purpose**: Retrieve data from Creator reports with filtering and sorting

**Endpoints**:
```http
GET    /api/v2.1/{owner}/{app_name}/report/{report_name}     # Get report data
```

**Parameters**:
- `from` - Starting index (default: 0)
- `limit` - Number of records (max: 200)
- `criteria` - Filter criteria
- `sort_by` - Field to sort by
- `sort_order` - `asc` or `desc`

**Example - Get Report with Advanced Filtering**:
```python
def get_filtered_report(access_token, owner, app_name, report_name, filters):
    url = f'https://creator.zoho.com/api/v2.1/{owner}/{app_name}/report/{report_name}'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'criteria': filters.get('criteria'),
        'from': filters.get('from', 0),
        'limit': filters.get('limit', 200),
        'sort_by': filters.get('sort_by'),
        'sort_order': filters.get('sort_order', 'asc')
    }

    response = requests.get(url, params=params, headers=headers)
    return response.json()

# Usage - Get high-value open deals
filters = {
    'criteria': '(Status == "Open" && Deal_Value > 50000)',
    'limit': 100,
    'sort_by': 'Deal_Value',
    'sort_order': 'desc'
}

high_value_deals = get_filtered_report(
    access_token,
    'johndoe@company.com',
    'sales-tracker',
    'All_Sales',
    filters
)
```

**Example - Paginated Report Retrieval**:
```javascript
const getAllRecordsPaginated = async (accessToken, owner, appName, reportName, criteria = null) => {
  const allRecords = [];
  let from = 0;
  const limit = 200; // Max limit per request
  let hasMore = true;

  while (hasMore) {
    const response = await axios.get(
      `https://creator.zoho.com/api/v2.1/${owner}/${appName}/report/${reportName}`,
      {
        params: {
          from: from,
          limit: limit,
          criteria: criteria
        },
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`
        }
      }
    );

    const records = response.data.data;
    allRecords.push(...records);

    if (records.length < limit) {
      hasMore = false;
    } else {
      from += limit;
    }
  }

  return allRecords;
};
```

---

### 4. Views API

**Purpose**: Get data from custom views

**Endpoints**:
```http
GET    /api/v2.1/{owner}/{app_name}/view/{view_name}     # Get view data
```

**Example**:
```javascript
const getViewData = async (accessToken, owner, appName, viewName) => {
  const response = await axios.get(
    `https://creator.zoho.com/api/v2.1/${owner}/${appName}/view/${viewName}`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

---

### 5. Workflows API

**Purpose**: Execute custom Deluge scripts via API

**Endpoints**:
```http
POST   /api/v2.1/{owner}/{app_name}/form/{form_name}/record/workflow    # Execute workflow
```

**Example - Execute Workflow**:
```python
def execute_workflow(access_token, owner, app_name, form_name, workflow_name, record_id, params=None):
    url = f'https://creator.zoho.com/api/v2.1/{owner}/{app_name}/form/{form_name}/record/workflow'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'workflow_name': workflow_name,
        'record_id': record_id
    }
    if params:
        data['params'] = params

    response = requests.post(url, json=data, headers=headers)
    return response.json()

# Execute a custom workflow
result = execute_workflow(
    access_token,
    'johndoe@company.com',
    'sales-tracker',
    'Sales',
    'send_followup_email',
    '12345',
    params={'email_template': 'standard_followup'}
)
```

---

### 6. Deluge Integration

**Purpose**: Use Deluge scripts within Creator for advanced logic

**Deluge Functions in Creator**:

**Example - Fetch External API Data**:
```deluge
// Fetch data from external API
response = invokeurl
[
    url: "https://api.example.com/customers"
    type: GET
    headers: {"Authorization": "Bearer " + external_api_token}
];

if (response.get("status") == "success")
{
    customers = response.get("data");
    for each customer in customers
    {
        // Add to Creator form
        insert into Customer_Form
        [
            Name = customer.get("name")
            Email = customer.get("email")
            Phone = customer.get("phone")
            Company = customer.get("company")
        ];
    }
}
```

**Example - Integration with Zoho CRM**:
```deluge
// Sync Creator record to CRM
void syncToCRM(int recordId)
{
    // Get Creator record
    sale = Customer_Sales[ID == recordId];

    if (sale.Status == "Closed Won")
    {
        // Check if deal already exists in CRM
        search_criteria = "(Deal_Name:equals:" + sale.Customer_Name + ")";
        existing_deals = zoho.crm.searchRecords("Deals", search_criteria);

        if (existing_deals.size() == 0)
        {
            // Create new deal in CRM
            deal_map = Map();
            deal_map.put("Deal_Name", sale.Customer_Name);
            deal_map.put("Amount", sale.Deal_Value);
            deal_map.put("Stage", "Closed Won");
            deal_map.put("Closing_Date", sale.Actual_Close_Date);
            deal_map.put("Description", sale.Notes);

            crm_response = zoho.crm.createRecord("Deals", deal_map);

            if (crm_response.get("id") != null)
            {
                // Update Creator record with CRM Deal ID
                sale.CRM_Deal_ID = crm_response.get("id");
                info "Deal synced to CRM: " + crm_response.get("id");
            }
        }
    }
}
```

**Example - Scheduled Automation**:
```deluge
// Scheduled script to send daily report
void sendDailyReport()
{
    // Get today's sales
    today = zoho.currentdate;
    sales_today = Customer_Sales[Date_field == today];

    // Calculate totals
    total_value = 0;
    sales_count = sales_today.count();

    for each sale in sales_today
    {
        total_value = total_value + sale.Deal_Value;
    }

    // Create email report
    email_body = "<h2>Daily Sales Report - " + today.toString("dd-MMM-yyyy") + "</h2>";
    email_body = email_body + "<p>Total Sales: " + sales_count + "</p>";
    email_body = email_body + "<p>Total Value: $" + total_value + "</p>";
    email_body = email_body + "<h3>Sales Details:</h3>";
    email_body = email_body + "<ul>";

    for each sale in sales_today
    {
        email_body = email_body + "<li>" + sale.Customer_Name + " - $" + sale.Deal_Value + "</li>";
    }

    email_body = email_body + "</ul>";

    // Send email
    sendmail
    [
        from: zoho.loginuserid
        to: "sales@company.com"
        subject: "Daily Sales Report - " + today.toString("dd-MMM-yyyy")
        message: email_body
    ];
}
```

**Example - Form Validation with Deluge**:
```deluge
// On form submission validation
void validateSalesRecord()
{
    // Validate deal value
    if (input.Deal_Value <= 0)
    {
        alert "Deal value must be greater than zero";
        cancel submit;
    }

    // Validate email format
    if (!input.Customer_Email.matches("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"))
    {
        alert "Please enter a valid email address";
        cancel submit;
    }

    // Check for duplicates
    existing_records = Customer_Sales[Customer_Email == input.Customer_Email && Status != "Closed Lost"];

    if (existing_records.count() > 0)
    {
        alert "An active record already exists for this customer email";
        cancel submit;
    }

    // Auto-populate fields
    if (input.Deal_Value > 100000)
    {
        input.Priority = "High";
        input.Requires_Approval = true;
    }
}
```

---

### 7. File Upload API

**Purpose**: Upload files and attachments to Creator records

**Endpoints**:
```http
POST   /api/v2.1/{owner}/{app_name}/form/{form_name}    # Upload with record creation
```

**Example - Upload File with Record**:
```javascript
const FormData = require('form-data');
const fs = require('fs');

const uploadFileWithRecord = async (accessToken, owner, appName, formName, recordData, filePath) => {
  const form = new FormData();

  // Add record data
  form.append('data', JSON.stringify(recordData));

  // Add file
  form.append('File_Upload_Field', fs.createReadStream(filePath));

  const response = await axios.post(
    `https://creator.zoho.com/api/v2.1/${owner}/${appName}/form/${formName}`,
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
await uploadFileWithRecord(
  accessToken,
  'johndoe@company.com',
  'document-manager',
  'Documents',
  {
    Document_Name: 'Contract Agreement',
    Document_Type: 'Contract',
    Status: 'Active'
  },
  './files/contract.pdf'
);
```

**Example - Upload Multiple Files with Python**:
```python
def upload_files_with_record(access_token, owner, app_name, form_name, record_data, file_paths):
    url = f'https://creator.zoho.com/api/v2.1/{owner}/{app_name}/form/{form_name}'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }

    # Prepare multipart data
    files = []
    for i, file_path in enumerate(file_paths):
        files.append(('File_Upload_Field', open(file_path, 'rb')))

    data = {'data': json.dumps(record_data)}

    response = requests.post(url, data=data, files=files, headers=headers)

    # Close file handles
    for _, file_handle in files:
        file_handle.close()

    return response.json()
```

---

### 8. User Management

**Purpose**: Manage application users and permissions

**Example - Add User via Deluge**:
```deluge
// Add user to Creator application
void addUserToApp(string user_email, string role)
{
    // Add user with specific role
    add_user_response = zoho.creator.addUser(user_email, role);

    if (add_user_response.get("status") == "success")
    {
        info "User added successfully: " + user_email;

        // Send welcome email
        sendmail
        [
            from: zoho.loginuserid
            to: user_email
            subject: "Welcome to Sales Tracker"
            message: "You have been granted access to the Sales Tracker application."
        ];
    }
}
```

---

## Authentication

### OAuth 2.0 Flow

**Step 1: Register Application**
- Go to [Zoho API Console](https://api-console.zoho.com/)
- Register application with redirect URI
- Note Client ID and Client Secret

**Step 2: Authorization URL**
```http
GET https://accounts.zoho.com/oauth/v2/auth?
  scope=ZohoCreator.form.ALL,ZohoCreator.report.ALL&
  client_id={client_id}&
  response_type=code&
  access_type=offline&
  redirect_uri={redirect_uri}
```

**Available Scopes**:
- `ZohoCreator.form.ALL` - Full access to forms
- `ZohoCreator.form.CREATE` - Create records
- `ZohoCreator.form.UPDATE` - Update records
- `ZohoCreator.form.READ` - Read records
- `ZohoCreator.form.DELETE` - Delete records
- `ZohoCreator.report.ALL` - Full access to reports
- `ZohoCreator.report.READ` - Read-only access to reports
- `ZohoCreator.meta.ALL` - Access to metadata
- `ZohoCreator.admin.ALL` - Admin operations

**Step 3: Get Access Token**
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
  "api_domain": "https://creator.zoho.com",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

**Step 4: Refresh Access Token**
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

---

## Rate Limits

### API Call Limits

| Edition | API Calls per Day | API Calls per Minute |
|---------|-------------------|----------------------|
| Free | 1,000 | 10 |
| Standard | 10,000 | 50 |
| Professional | 25,000 | 100 |
| Enterprise | 50,000 | 200 |
| Ultimate | 100,000 | 300 |

### Additional Limits
- Maximum 200 records per API call
- Maximum file upload size: 10 MB
- Maximum concurrent API requests: 10

### Rate Limit Headers
```http
X-RateLimit-Limit: 25000
X-RateLimit-Remaining: 24750
X-RateLimit-Reset: 1642147200
```

---

## Error Codes

| HTTP Status | Error Code | Description | Solution |
|-------------|------------|-------------|----------|
| 400 | INVALID_REQUEST | Invalid request format | Check parameters and format |
| 400 | MANDATORY_NOT_FOUND | Required field missing | Provide all mandatory fields |
| 400 | INVALID_CRITERIA | Invalid criteria syntax | Check criteria format |
| 401 | INVALID_TOKEN | Invalid or expired token | Refresh access token |
| 401 | INSUFFICIENT_SCOPE | Missing required scope | Update OAuth scopes |
| 403 | NO_PERMISSION | User lacks permission | Check user role and permissions |
| 404 | APPLICATION_NOT_FOUND | Application does not exist | Verify application name |
| 404 | FORM_NOT_FOUND | Form does not exist | Verify form link name |
| 404 | RECORD_NOT_FOUND | Record ID does not exist | Verify record ID |
| 429 | RATE_LIMIT_EXCEEDED | API rate limit exceeded | Implement rate limiting |
| 500 | INTERNAL_ERROR | Server error | Retry with exponential backoff |

**Error Response Format**:
```json
{
  "code": 3000,
  "message": "Invalid criteria format",
  "details": "Syntax error near 'Status = Open'"
}
```

---

## Code Examples

### Complete Creator Integration Example

```javascript
// JavaScript/Node.js - Creator Application Manager
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

class ZohoCreatorClient {
  constructor(accessToken, owner) {
    this.accessToken = accessToken;
    this.owner = owner;
    this.baseURL = 'https://creator.zoho.com/api/v2.1';
  }

  async request(method, endpoint, data = null, isFormData = false) {
    const config = {
      method,
      url: `${this.baseURL}${endpoint}`,
      headers: {
        'Authorization': `Zoho-oauthtoken ${this.accessToken}`
      }
    };

    if (data) {
      if (isFormData) {
        config.headers = { ...config.headers, ...data.getHeaders() };
        config.data = data;
      } else {
        config.headers['Content-Type'] = 'application/json';
        if (method === 'GET') {
          config.params = data;
        } else {
          config.data = data;
        }
      }
    }

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      console.error(`API Error: ${error.response.data.message}`);
      throw new Error(error.response.data.message);
    }
    throw error;
  }

  // Applications
  async getApplications() {
    return this.request('GET', `/${this.owner}/applications`);
  }

  async getApplicationInfo(appName) {
    return this.request('GET', `/${this.owner}/${appName}/info`);
  }

  // Records
  async getRecords(appName, reportName, filters = {}) {
    return this.request('GET', `/${this.owner}/${appName}/report/${reportName}`, filters);
  }

  async getRecord(appName, reportName, recordId) {
    return this.request('GET', `/${this.owner}/${appName}/report/${reportName}/${recordId}`);
  }

  async addRecord(appName, formName, recordData) {
    return this.request('POST', `/${this.owner}/${appName}/form/${formName}`, { data: recordData });
  }

  async updateRecord(appName, reportName, recordId, updates) {
    return this.request('PUT', `/${this.owner}/${appName}/report/${reportName}/${recordId}`, { data: updates });
  }

  async deleteRecord(appName, reportName, recordId) {
    return this.request('DELETE', `/${this.owner}/${appName}/report/${reportName}/${recordId}`);
  }

  // Advanced operations
  async getAllRecordsPaginated(appName, reportName, criteria = null) {
    const allRecords = [];
    let from = 0;
    const limit = 200;
    let hasMore = true;

    while (hasMore) {
      const response = await this.getRecords(appName, reportName, {
        from,
        limit,
        criteria
      });

      const records = response.data;
      allRecords.push(...records);

      if (records.length < limit) {
        hasMore = false;
      } else {
        from += limit;
      }
    }

    return allRecords;
  }

  async bulkAddRecords(appName, formName, recordsArray) {
    const results = [];
    const batchSize = 200;

    for (let i = 0; i < recordsArray.length; i += batchSize) {
      const batch = recordsArray.slice(i, i + batchSize);

      for (const record of batch) {
        try {
          const result = await this.addRecord(appName, formName, record);
          results.push({ success: true, data: result });
        } catch (error) {
          results.push({ success: false, error: error.message, record });
        }

        // Rate limiting - wait between requests
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return results;
  }

  async uploadFileWithRecord(appName, formName, recordData, filePath, fileFieldName) {
    const form = new FormData();
    form.append('data', JSON.stringify(recordData));
    form.append(fileFieldName, fs.createReadStream(filePath));

    return this.request('POST', `/${this.owner}/${appName}/form/${formName}`, form, true);
  }

  async searchRecords(appName, reportName, searchCriteria) {
    return this.getRecords(appName, reportName, {
      criteria: searchCriteria,
      limit: 200
    });
  }

  // Sync operation
  async syncWithExternalSystem(appName, formName, reportName, externalData) {
    const results = {
      created: 0,
      updated: 0,
      errors: []
    };

    for (const item of externalData) {
      try {
        // Check if record exists
        const criteria = `(External_ID == "${item.external_id}")`;
        const existing = await this.searchRecords(appName, reportName, criteria);

        if (existing.data && existing.data.length > 0) {
          // Update existing record
          const recordId = existing.data[0].ID;
          await this.updateRecord(appName, reportName, recordId, item.data);
          results.updated++;
        } else {
          // Create new record
          await this.addRecord(appName, formName, {
            ...item.data,
            External_ID: item.external_id
          });
          results.created++;
        }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        results.errors.push({
          item: item.external_id,
          error: error.message
        });
      }
    }

    return results;
  }
}

// Usage Example
(async () => {
  const client = new ZohoCreatorClient('your_access_token', 'johndoe@company.com');

  // Get all applications
  const apps = await client.getApplications();
  console.log('Applications:', apps.applications.length);

  // Add multiple records
  const newRecords = [
    {
      Customer_Name: 'ABC Corp',
      Deal_Value: 75000,
      Status: 'Open'
    },
    {
      Customer_Name: 'XYZ Inc',
      Deal_Value: 120000,
      Status: 'In Progress'
    }
  ];

  const bulkResults = await client.bulkAddRecords('sales-tracker', 'Sales', newRecords);
  console.log('Bulk add results:', bulkResults);

  // Get all records with criteria
  const openDeals = await client.getAllRecordsPaginated(
    'sales-tracker',
    'All_Sales',
    '(Status == "Open")'
  );
  console.log('Open deals:', openDeals.length);

  // Sync with external system
  const externalData = [
    {
      external_id: 'EXT-001',
      data: {
        Customer_Name: 'External Corp',
        Deal_Value: 95000,
        Status: 'Open'
      }
    }
  ];

  const syncResults = await client.syncWithExternalSystem(
    'sales-tracker',
    'Sales',
    'All_Sales',
    externalData
  );
  console.log('Sync results:', syncResults);
})();
```

### Python Complete Example

```python
# Python - Creator Data Management
import requests
import time
from typing import List, Dict, Optional

class ZohoCreatorManager:
    def __init__(self, access_token: str, owner: str):
        self.access_token = access_token
        self.owner = owner
        self.base_url = 'https://creator.zoho.com/api/v2.1'
        self.headers = {
            'Authorization': f'Zoho-oauthtoken {access_token}'
        }

    def _request(self, method: str, endpoint: str, data: Optional[Dict] = None,
                files: Optional[Dict] = None, params: Optional[Dict] = None) -> Dict:
        url = f'{self.base_url}{endpoint}'
        headers = self.headers.copy()

        if data and not files:
            headers['Content-Type'] = 'application/json'

        response = requests.request(
            method,
            url,
            json=data if data and not files else None,
            data=data if files else None,
            files=files,
            params=params,
            headers=headers
        )

        if response.status_code >= 400:
            error_data = response.json()
            raise Exception(f"API Error: {error_data.get('message')}")

        return response.json()

    # Applications
    def get_applications(self) -> List[Dict]:
        return self._request('GET', f'/{self.owner}/applications')

    # Records
    def get_records(self, app_name: str, report_name: str, **filters) -> Dict:
        return self._request('GET', f'/{self.owner}/{app_name}/report/{report_name}', params=filters)

    def add_record(self, app_name: str, form_name: str, record_data: Dict) -> Dict:
        return self._request('POST', f'/{self.owner}/{app_name}/form/{form_name}', data={'data': record_data})

    def update_record(self, app_name: str, report_name: str, record_id: str, updates: Dict) -> Dict:
        return self._request('PUT', f'/{self.owner}/{app_name}/report/{report_name}/{record_id}', data={'data': updates})

    def delete_record(self, app_name: str, report_name: str, record_id: str) -> Dict:
        return self._request('DELETE', f'/{self.owner}/{app_name}/report/{report_name}/{record_id}')

    # Advanced operations
    def get_all_records_paginated(self, app_name: str, report_name: str, criteria: str = None) -> List[Dict]:
        all_records = []
        from_index = 0
        limit = 200
        has_more = True

        while has_more:
            params = {
                'from': from_index,
                'limit': limit
            }
            if criteria:
                params['criteria'] = criteria

            response = self.get_records(app_name, report_name, **params)
            records = response.get('data', [])
            all_records.extend(records)

            if len(records) < limit:
                has_more = False
            else:
                from_index += limit

            time.sleep(0.1)  # Rate limiting

        return all_records

    def bulk_add_records(self, app_name: str, form_name: str, records: List[Dict]) -> Dict:
        results = {
            'success': 0,
            'failed': 0,
            'errors': []
        }

        for record in records:
            try:
                self.add_record(app_name, form_name, record)
                results['success'] += 1
            except Exception as e:
                results['failed'] += 1
                results['errors'].append({
                    'record': record,
                    'error': str(e)
                })

            time.sleep(0.1)  # Rate limiting

        return results

    def bulk_update_records(self, app_name: str, report_name: str, updates: List[Dict]) -> Dict:
        results = {
            'success': 0,
            'failed': 0,
            'errors': []
        }

        for update in updates:
            try:
                record_id = update.pop('ID')
                self.update_record(app_name, report_name, record_id, update)
                results['success'] += 1
            except Exception as e:
                results['failed'] += 1
                results['errors'].append({
                    'record_id': update.get('ID'),
                    'error': str(e)
                })

            time.sleep(0.1)  # Rate limiting

        return results

    def search_and_update(self, app_name: str, form_name: str, report_name: str,
                         search_field: str, search_value: str, updates: Dict) -> Dict:
        """Search for records and update them"""
        criteria = f'({search_field} == "{search_value}")'
        records = self.get_all_records_paginated(app_name, report_name, criteria)

        results = {
            'found': len(records),
            'updated': 0,
            'errors': []
        }

        for record in records:
            try:
                self.update_record(app_name, report_name, record['ID'], updates)
                results['updated'] += 1
            except Exception as e:
                results['errors'].append({
                    'record_id': record['ID'],
                    'error': str(e)
                })

            time.sleep(0.1)

        return results

    # Data analysis
    def aggregate_records(self, app_name: str, report_name: str, group_by: str, aggregate_field: str) -> Dict:
        """Group and aggregate records"""
        all_records = self.get_all_records_paginated(app_name, report_name)

        aggregation = {}
        for record in all_records:
            group_value = record.get(group_by, 'Unknown')
            aggregate_value = record.get(aggregate_field, 0)

            if group_value not in aggregation:
                aggregation[group_value] = {
                    'count': 0,
                    'total': 0,
                    'average': 0
                }

            aggregation[group_value]['count'] += 1
            aggregation[group_value]['total'] += float(aggregate_value) if aggregate_value else 0
            aggregation[group_value]['average'] = aggregation[group_value]['total'] / aggregation[group_value]['count']

        return aggregation

# Usage Example
if __name__ == '__main__':
    manager = ZohoCreatorManager('your_access_token', 'johndoe@company.com')

    # Add records
    new_sales = [
        {
            'Customer_Name': 'Tech Solutions Inc',
            'Deal_Value': 85000,
            'Status': 'Open',
            'Expected_Close_Date': '31-Mar-2025'
        },
        {
            'Customer_Name': 'Global Enterprises',
            'Deal_Value': 150000,
            'Status': 'In Progress',
            'Expected_Close_Date': '15-Apr-2025'
        }
    ]

    bulk_result = manager.bulk_add_records('sales-tracker', 'Sales', new_sales)
    print(f"Added {bulk_result['success']} records, {bulk_result['failed']} failed")

    # Get and analyze data
    all_sales = manager.get_all_records_paginated('sales-tracker', 'All_Sales', '(Status != "Closed Lost")')
    print(f"Total active sales: {len(all_sales)}")

    # Aggregate by status
    aggregation = manager.aggregate_records('sales-tracker', 'All_Sales', 'Status', 'Deal_Value')
    print("Sales by status:")
    for status, data in aggregation.items():
        print(f"  {status}: {data['count']} deals, Total: ${data['total']:,.2f}, Avg: ${data['average']:,.2f}")

    # Search and update
    update_result = manager.search_and_update(
        'sales-tracker',
        'Sales',
        'All_Sales',
        'Status',
        'Open',
        {'Priority': 'High'}
    )
    print(f"Updated {update_result['updated']} out of {update_result['found']} records")
```

---

## Best Practices

### 1. Data Management
- Use meaningful field names and link names
- Implement proper data validation
- Use lookup fields for relationships
- Index fields used in criteria queries
- Archive old records periodically

### 2. API Usage
- Implement pagination for large datasets
- Use criteria to filter data server-side
- Batch operations when possible
- Implement exponential backoff for retries
- Cache frequently accessed data

### 3. Performance
- Minimize API calls by batching operations
- Use reports with appropriate filters
- Avoid fetching unnecessary fields
- Implement client-side caching
- Use webhooks instead of polling

### 4. Security
- Store refresh tokens securely
- Implement proper access controls
- Validate all user inputs
- Use environment variables for credentials
- Regularly rotate access tokens

### 5. Error Handling
- Implement comprehensive error handling
- Log all API errors
- Provide user-friendly error messages
- Implement retry logic for transient errors
- Monitor API usage and errors

### 6. Deluge Best Practices
- Keep scripts modular and reusable
- Use try-catch for error handling
- Implement logging for debugging
- Optimize database queries
- Comment code thoroughly

---

## Data Centers

| Data Center | Base URL |
|-------------|----------|
| US | https://creator.zoho.com |
| EU | https://creator.zoho.eu |
| IN | https://creator.zoho.in |
| AU | https://creator.zoho.com.au |
| JP | https://creator.zoho.jp |
| CA | https://creator.zoho.ca |

---

## Additional Resources

- [Official Zoho Creator API Documentation](https://www.zoho.com/creator/help/api/v2/)
- [Deluge Script Documentation](https://www.zoho.com/deluge/help/)
- [Creator Help Documentation](https://www.zoho.com/creator/help/)
- [API Postman Collection](https://www.postman.com/zoho)
- [Developer Community](https://help.zoho.com/portal/en/community/creator)
- [Video Tutorials](https://www.zoho.com/creator/tutorials/)

---

**Last Updated**: December 2025
**API Version**: v2.1
