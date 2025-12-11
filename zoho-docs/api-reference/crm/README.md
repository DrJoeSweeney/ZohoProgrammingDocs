# Zoho CRM API Reference

## Overview

Zoho CRM is the centerpiece of Zoho's ecosystem, providing comprehensive customer relationship management capabilities. The API enables full programmatic access to CRM data and functionality.

**Current API Version**: v8 (v6 also available)
**Base URL**: `https://www.zohoapis.com/crm/v8/`
**Protocol**: REST
**Data Format**: JSON
**Authentication**: OAuth 2.0

---

## Quick Links

- [Authentication](./authentication.md)
- [Core APIs](./core-apis.md)
- [Metadata APIs](./metadata-apis.md)
- [Bulk APIs](./bulk-apis.md)
- [Query APIs](./query-apis.md)
- [Composite APIs](./composite-apis.md)
- [Notification APIs](./notification-apis.md)
- [Common Operations](./common-operations.md)
- [Error Codes](./error-codes.md)
- [Rate Limits](./rate-limits.md)
- [Webhooks](./webhooks.md)
- [Code Examples](./examples.md)

---

## API Categories

### 1. Core APIs
**Purpose**: CRUD operations on CRM module entities

**Common Modules**:
- Leads
- Contacts
- Accounts
- Deals
- Tasks
- Events
- Calls
- Notes
- Products
- Quotes
- Sales Orders
- Purchase Orders
- Invoices
- Campaigns
- Cases

**Operations**:
```http
GET    /crm/v8/{module_name}              # Get records
GET    /crm/v8/{module_name}/{record_id}  # Get specific record
POST   /crm/v8/{module_name}              # Create records
PUT    /crm/v8/{module_name}              # Update records
DELETE /crm/v8/{module_name}/{record_id}  # Delete record
```

**Example - Get All Leads**:
```http
GET https://www.zohoapis.com/crm/v8/Leads
Authorization: Zoho-oauthtoken {access_token}
```

**Response**:
```json
{
  "data": [
    {
      "Owner": {
        "name": "John Doe",
        "id": "12345000000123456"
      },
      "Company": "Acme Corp",
      "Email": "contact@acmecorp.com",
      "Last_Name": "Smith",
      "First_Name": "Jane",
      "Lead_Status": "Qualified",
      "id": "12345000000234567",
      "Created_Time": "2025-01-15T10:30:00+00:00"
    }
  ],
  "info": {
    "per_page": 200,
    "count": 1,
    "page": 1,
    "more_records": false
  }
}
```

**Example - Create Lead**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const createLead = async (accessToken) => {
  const response = await axios.post(
    'https://www.zohoapis.com/crm/v8/Leads',
    {
      data: [{
        Last_Name: 'Johnson',
        First_Name: 'Mike',
        Company: 'TechCo Inc',
        Email: 'mike@techco.com',
        Phone: '555-0123',
        Lead_Status': 'New',
        Lead_Source': 'Website'
      }]
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

def create_lead(access_token):
    url = 'https://www.zohoapis.com/crm/v8/Leads'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'data': [{
            'Last_Name': 'Johnson',
            'First_Name': 'Mike',
            'Company': 'TechCo Inc',
            'Email': 'mike@techco.com',
            'Phone': '555-0123',
            'Lead_Status': 'New',
            'Lead_Source': 'Website'
        }]
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

```deluge
// Deluge
lead_data = {
    "Last_Name": "Johnson",
    "First_Name": "Mike",
    "Company": "TechCo Inc",
    "Email": "mike@techco.com",
    "Phone": "555-0123",
    "Lead_Status": "New",
    "Lead_Source": "Website"
};

response = zoho.crm.createRecord("Leads", lead_data);
info response;
```

---

### 2. Metadata APIs
**Purpose**: Fetch metadata about modules, fields, layouts, and custom views

**Endpoints**:
```http
GET /crm/v8/settings/modules              # Get all modules
GET /crm/v8/settings/modules/{module}     # Get module metadata
GET /crm/v8/settings/fields               # Get all fields
GET /crm/v8/settings/fields/{module}      # Get module fields
GET /crm/v8/settings/layouts              # Get all layouts
GET /crm/v8/settings/custom_views         # Get custom views
GET /crm/v8/settings/related_lists        # Get related lists
```

**Example - Get Lead Fields**:
```javascript
const getLeadFields = async (accessToken) => {
  const response = await axios.get(
    'https://www.zohoapis.com/crm/v8/settings/fields?module=Leads',
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data.fields;
};
```

---

### 3. Bulk APIs
**Purpose**: Asynchronous operations for large data volumes

**Operations**:
- Bulk Read - Export records
- Bulk Write - Create/update records in bulk
- Bulk Upsert - Insert or update based on duplicate check

**Example - Bulk Read**:
```http
POST /crm/v8/bulk/read
Content-Type: application/json
Authorization: Zoho-oauthtoken {access_token}

{
  "query": {
    "module": "Leads",
    "fields": ["First_Name", "Last_Name", "Email", "Company"],
    "criteria": {
      "field": "Lead_Status",
      "comparator": "equal",
      "value": "Qualified"
    }
  }
}
```

**Response**:
```json
{
  "data": [{
    "status": "queued",
    "operation": "read",
    "id": "12345000000567890",
    "created_by": {
      "id": "12345000000123456",
      "name": "John Doe"
    },
    "created_time": "2025-01-15T10:30:00+00:00"
  }],
  "info": {}
}
```

---

### 4. Query APIs (COQL)
**Purpose**: SQL-like queries for complex data retrieval

**Endpoint**:
```http
GET /crm/v8/coql
```

**Example - COQL Query**:
```sql
SELECT First_Name, Last_Name, Email, Annual_Revenue
FROM Leads
WHERE Lead_Status = 'Qualified'
  AND Annual_Revenue > 100000
ORDER BY Annual_Revenue DESC
LIMIT 50
```

**JavaScript Implementation**:
```javascript
const queryLeads = async (accessToken) => {
  const coql = `
    SELECT First_Name, Last_Name, Email, Annual_Revenue
    FROM Leads
    WHERE Lead_Status = 'Qualified'
      AND Annual_Revenue > 100000
    ORDER BY Annual_Revenue DESC
    LIMIT 50
  `;

  const response = await axios.get(
    'https://www.zohoapis.com/crm/v8/coql',
    {
      params: { select_query: coql },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

---

### 5. Composite APIs
**Purpose**: Combine up to 5 API calls in a single request

**Limit**: Maximum 5 API calls per composite request

**Example**:
```javascript
const compositeRequest = async (accessToken) => {
  const response = await axios.post(
    'https://www.zohoapis.com/crm/v8/composite',
    {
      composite_request: [
        {
          method: 'GET',
          url: '/crm/v8/Leads?per_page=5',
          headers: {}
        },
        {
          method: 'GET',
          url: '/crm/v8/Contacts?per_page=5',
          headers: {}
        },
        {
          method: 'GET',
          url: '/crm/v8/Deals?per_page=5',
          headers: {}
        }
      ]
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

### 6. Notification APIs
**Purpose**: Get notified of data changes in CRM

**Types**:
- Webhooks - Real-time HTTP callbacks
- Notifications API - Poll for changes

**Example - Configure Webhook**:
```http
POST /crm/v8/settings/actions/watch
Content-Type: application/json
Authorization: Zoho-oauthtoken {access_token}

{
  "watch": [{
    "channel_id": "10000000068001",
    "events": ["Leads.create", "Leads.update", "Leads.delete"],
    "channel_expiry": "2025-12-31T23:59:59+00:00",
    "token": "your_verification_token",
    "notify_url": "https://yourdomain.com/webhook/zoho-crm"
  }]
}
```

---

## Authentication

### OAuth 2.0 Flow

**Step 1: Register Your Application**
- Go to [Zoho API Console](https://api-console.zoho.com/)
- Register your application
- Note your Client ID and Client Secret

**Step 2: Generate Authorization Code**
```http
GET https://accounts.zoho.com/oauth/v2/auth?
  scope=ZohoCRM.modules.ALL,ZohoCRM.settings.ALL&
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

**Token Lifetime**:
- Access Token: 1 hour
- Refresh Token: Does not expire (store securely)

---

## Rate Limits

### API Call Limits

| Edition | API Calls per Day | API Calls per Minute |
|---------|-------------------|----------------------|
| Free | 5,000 | N/A |
| Standard | 10,000 | N/A |
| Professional | 25,000 | N/A |
| Enterprise | 50,000 | N/A |
| Ultimate | 100,000 | N/A |

### Concurrent Connections
- Maximum 10 concurrent API calls per organization

### Bulk API Limits
- Maximum 200,000 records per bulk operation
- Maximum 25,000 records for bulk write per API call

### Rate Limit Headers
```http
X-RateLimit-Limit: 10000
X-RateLimit-Remaining: 9875
X-RateLimit-Reset: 1642147200
```

---

## Common Operations

### Search Records
```javascript
const searchLeads = async (accessToken, searchTerm) => {
  const response = await axios.get(
    'https://www.zohoapis.com/crm/v8/Leads/search',
    {
      params: {
        criteria: `(Email:equals:${searchTerm})`
      },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

### Update Record
```javascript
const updateLead = async (accessToken, leadId, updates) => {
  const response = await axios.put(
    `https://www.zohoapis.com/crm/v8/Leads/${leadId}`,
    {
      data: [updates]
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

### Delete Record
```javascript
const deleteLead = async (accessToken, leadId) => {
  const response = await axios.delete(
    `https://www.zohoapis.com/crm/v8/Leads/${leadId}`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

### Convert Lead
```javascript
const convertLead = async (accessToken, leadId, contactId, accountId) => {
  const response = await axios.post(
    `https://www.zohoapis.com/crm/v8/Leads/${leadId}/actions/convert`,
    {
      data: [{
        overwrite: true,
        notify_lead_owner: true,
        notify_new_entity_owner: true,
        Accounts: accountId,
        Contacts: contactId,
        Deals: {
          Deal_Name: 'New Deal',
          Closing_Date: '2025-03-01',
          Stage: 'Qualification',
          Amount: 50000
        }
      }]
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

## Error Codes

| HTTP Status | Error Code | Description | Solution |
|-------------|------------|-------------|----------|
| 400 | INVALID_REQUEST_METHOD | Invalid HTTP method | Use correct method (GET, POST, PUT, DELETE) |
| 401 | INVALID_TOKEN | Invalid or expired token | Refresh access token |
| 401 | OAUTH_SCOPE_MISMATCH | Insufficient permissions | Update OAuth scopes |
| 403 | NO_PERMISSION | User lacks module access | Grant module permissions |
| 404 | RECORD_NOT_FOUND | Record ID does not exist | Verify record ID |
| 429 | RATE_LIMIT_EXCEEDED | API rate limit exceeded | Implement rate limiting |
| 500 | INTERNAL_ERROR | Server error | Retry with exponential backoff |

---

## Data Centers

Zoho CRM operates in multiple data centers. Use the appropriate base URL:

| Data Center | Base URL |
|-------------|----------|
| US | https://www.zohoapis.com |
| EU | https://www.zohoapis.eu |
| IN | https://www.zohoapis.in |
| AU | https://www.zohoapis.com.au |
| JP | https://www.zohoapis.jp |
| CA | https://www.zohoapis.ca |
| CN | https://www.zohoapis.com.cn |
| SA | https://www.zohoapis.sa |

---

## SDKs Available

- Java
- PHP
- Python
- Node.js
- C#
- Ruby

**Installation (Node.js)**:
```bash
npm install @zohocrm/nodejs-sdk-6.0
```

**Installation (Python)**:
```bash
pip install zohocrmsdk6
```

---

## Best Practices

1. **Token Management**
   - Store refresh tokens securely
   - Implement automatic token refresh
   - Never expose tokens in client-side code

2. **Error Handling**
   - Implement retry logic with exponential backoff
   - Handle rate limit errors (429) appropriately
   - Log all API errors for debugging

3. **Performance**
   - Use bulk APIs for large operations
   - Implement pagination for list endpoints
   - Cache metadata when possible
   - Use composite APIs to reduce round trips

4. **Data Integrity**
   - Validate data before sending
   - Use field-level validation
   - Handle duplicate detection
   - Implement idempotency for critical operations

5. **Monitoring**
   - Track API usage against limits
   - Monitor error rates
   - Set up alerts for critical failures

---

## Changelog

### v8 (Current)
- Enhanced COQL support
- Improved composite API
- Better error messages
- Additional metadata endpoints

### v6
- Bulk API improvements
- Notification APIs
- Custom views API
- Blueprint support

---

## Additional Resources

- [Official Zoho CRM API Documentation](https://www.zoho.com/crm/developer/docs/api/v8/)
- [API Directory](https://www.zoho.com/crm/developer/docs/api-directory.html)
- [Postman Collection](https://www.postman.com/postman/integration-flows/documentation/0s51720/zoho-crm-rest-apis)
- [Developer Forums](https://help.zoho.com/portal/en/community/crm)

---

**Last Updated**: December 2025
**API Version**: v8
