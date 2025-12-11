# Zoho Sign API Reference

## Overview

Zoho Sign is a comprehensive electronic signature solution that enables businesses to send, sign, and manage documents digitally. The API provides full programmatic access to document management, signature workflows, templates, and more.

**Current API Version**: v1
**Base URL**: `https://sign.zoho.com/api/v1/`
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

### 1. Requests
**Purpose**: Create, manage, and track signature requests

**Endpoints**:
```http
GET    /requests                           # List all requests
GET    /requests/{request_id}              # Get request details
POST   /requests                           # Create signature request
PUT    /requests/{request_id}              # Update request
DELETE /requests/{request_id}              # Delete request
POST   /requests/{request_id}/submit       # Submit request
POST   /requests/{request_id}/remind       # Send reminder
POST   /requests/{request_id}/recall       # Recall request
GET    /requests/{request_id}/document     # Download signed document
GET    /requests/{request_id}/audit-trail  # Get audit trail
```

**Request Statuses**:
- Draft
- In Progress
- Completed
- Expired
- Declined
- Recalled

**Example - Create Signature Request**:
```javascript
// JavaScript/Node.js
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const createSignatureRequest = async (accessToken) => {
  const form = new FormData();

  // Add document
  form.append('file', fs.createReadStream('contract.pdf'));

  // Request configuration
  const requestData = {
    request_name: 'Employment Contract - John Doe',
    expiration_days: 15,
    is_sequential: false,
    email_reminders: true,
    actions: [
      {
        action_type: 'SIGN',
        action_id: 'sign_1',
        recipient_name: 'John Doe',
        recipient_email: 'john.doe@example.com',
        private_notes: 'Please sign the employment contract',
        signing_order: 1,
        fields: [
          {
            field_type_name: 'Signature',
            field_name: 'Employee Signature',
            page_no: 1,
            x_coord: 100,
            y_coord: 500,
            width: 200,
            height: 50,
            is_mandatory: true
          },
          {
            field_type_name: 'Date Signed',
            field_name: 'Date',
            page_no: 1,
            x_coord: 320,
            y_coord: 500,
            width: 120,
            height: 30,
            is_mandatory: true
          }
        ]
      },
      {
        action_type: 'SIGN',
        action_id: 'sign_2',
        recipient_name: 'HR Manager',
        recipient_email: 'hr@company.com',
        signing_order: 2
      }
    ],
    notes: 'Please review and sign the employment contract.'
  };

  form.append('data', JSON.stringify(requestData));

  const response = await axios.post(
    'https://sign.zoho.com/api/v1/requests',
    form,
    {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );

  return response.data;
};
```

```python
# Python
import requests

def create_signature_request(access_token):
    url = 'https://sign.zoho.com/api/v1/requests'

    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }

    # Document file
    files = {
        'file': ('contract.pdf', open('contract.pdf', 'rb'), 'application/pdf')
    }

    # Request configuration
    request_data = {
        'request_name': 'Employment Contract - John Doe',
        'expiration_days': 15,
        'is_sequential': False,
        'email_reminders': True,
        'actions': [
            {
                'action_type': 'SIGN',
                'action_id': 'sign_1',
                'recipient_name': 'John Doe',
                'recipient_email': 'john.doe@example.com',
                'private_notes': 'Please sign the employment contract',
                'signing_order': 1,
                'fields': [
                    {
                        'field_type_name': 'Signature',
                        'field_name': 'Employee Signature',
                        'page_no': 1,
                        'x_coord': 100,
                        'y_coord': 500,
                        'width': 200,
                        'height': 50,
                        'is_mandatory': True
                    },
                    {
                        'field_type_name': 'Date Signed',
                        'field_name': 'Date',
                        'page_no': 1,
                        'x_coord': 320,
                        'y_coord': 500,
                        'width': 120,
                        'height': 30,
                        'is_mandatory': True
                    }
                ]
            },
            {
                'action_type': 'SIGN',
                'action_id': 'sign_2',
                'recipient_name': 'HR Manager',
                'recipient_email': 'hr@company.com',
                'signing_order': 2
            }
        ],
        'notes': 'Please review and sign the employment contract.'
    }

    data = {
        'data': str(request_data)
    }

    response = requests.post(url, headers=headers, files=files, data=data)
    return response.json()
```

```deluge
// Deluge
// Upload document and create signature request
file_path = "/path/to/contract.pdf";

request_data = {
    "request_name": "Employment Contract - John Doe",
    "expiration_days": 15,
    "is_sequential": false,
    "email_reminders": true,
    "actions": [
        {
            "action_type": "SIGN",
            "action_id": "sign_1",
            "recipient_name": "John Doe",
            "recipient_email": "john.doe@example.com",
            "private_notes": "Please sign the employment contract",
            "signing_order": 1,
            "fields": [
                {
                    "field_type_name": "Signature",
                    "field_name": "Employee Signature",
                    "page_no": 1,
                    "x_coord": 100,
                    "y_coord": 500,
                    "width": 200,
                    "height": 50,
                    "is_mandatory": true
                }
            ]
        }
    ],
    "notes": "Please review and sign the employment contract."
};

response = zoho.sign.createRequest(file_path, request_data);
info response;
```

**Response**:
```json
{
  "code": 0,
  "message": "Request created successfully",
  "requests": {
    "request_id": "12345000000123456",
    "request_name": "Employment Contract - John Doe",
    "request_status": "draft",
    "expiration_days": 15,
    "is_sequential": false,
    "owner_id": "12345000000098765",
    "owner_email": "admin@company.com",
    "created_time": 1704067200000,
    "modified_time": 1704067200000,
    "actions": [
      {
        "action_id": "12345000000234567",
        "action_type": "SIGN",
        "recipient_name": "John Doe",
        "recipient_email": "john.doe@example.com",
        "action_status": "pending",
        "signing_order": 1
      },
      {
        "action_id": "12345000000234568",
        "action_type": "SIGN",
        "recipient_name": "HR Manager",
        "recipient_email": "hr@company.com",
        "action_status": "pending",
        "signing_order": 2
      }
    ],
    "document_ids": [
      {
        "document_id": "12345000000345678",
        "document_name": "contract.pdf",
        "total_pages": 5
      }
    ]
  }
}
```

---

### 2. Templates
**Purpose**: Create and manage reusable document templates

**Endpoints**:
```http
GET    /templates                     # List all templates
GET    /templates/{template_id}       # Get template details
POST   /templates                     # Create template
PUT    /templates/{template_id}       # Update template
DELETE /templates/{template_id}       # Delete template
POST   /templates/{template_id}/createrequest  # Create request from template
```

**Example - Create Template**:
```javascript
// JavaScript/Node.js
const createTemplate = async (accessToken) => {
  const form = new FormData();

  form.append('file', fs.createReadStream('nda-template.pdf'));

  const templateData = {
    template_name: 'Standard NDA Template',
    description: 'Non-disclosure agreement for contractors',
    actions: [
      {
        action_type: 'SIGN',
        role: 'Contractor',
        signing_order: 1,
        fields: [
          {
            field_type_name: 'Signature',
            field_name: 'Contractor Signature',
            page_no: 1,
            x_coord: 100,
            y_coord: 650,
            width: 200,
            height: 50,
            is_mandatory: true
          },
          {
            field_type_name: 'Textfield',
            field_name: 'Contractor Name',
            page_no: 1,
            x_coord: 100,
            y_coord: 600,
            width: 200,
            height: 30,
            is_mandatory: true
          }
        ]
      },
      {
        action_type: 'SIGN',
        role: 'Company Representative',
        signing_order: 2,
        fields: [
          {
            field_type_name: 'Signature',
            field_name: 'Company Signature',
            page_no: 1,
            x_coord: 350,
            y_coord: 650,
            width: 200,
            height: 50,
            is_mandatory: true
          }
        ]
      }
    ]
  };

  form.append('data', JSON.stringify(templateData));

  const response = await axios.post(
    'https://sign.zoho.com/api/v1/templates',
    form,
    {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );

  return response.data;
};
```

**Example - Create Request from Template**:
```python
# Python
def create_request_from_template(access_token, template_id):
    url = f'https://sign.zoho.com/api/v1/templates/{template_id}/createrequest'

    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }

    data = {
        'request_name': 'NDA - Contractor John Doe',
        'expiration_days': 10,
        'actions': [
            {
                'role': 'Contractor',
                'recipient_name': 'John Doe',
                'recipient_email': 'john.doe@example.com',
                'private_notes': 'Please sign the NDA'
            },
            {
                'role': 'Company Representative',
                'recipient_name': 'Jane Smith',
                'recipient_email': 'jane.smith@company.com'
            }
        ],
        'notes': 'Standard NDA for contractor engagement'
    }

    response = requests.post(url, headers=headers, json=data)
    return response.json()
```

---

### 3. Documents
**Purpose**: Manage documents in signature requests

**Endpoints**:
```http
GET    /requests/{request_id}/documents              # List documents
GET    /requests/{request_id}/documents/{document_id} # Get document
POST   /requests/{request_id}/documents              # Add document
DELETE /requests/{request_id}/documents/{document_id} # Remove document
GET    /requests/{request_id}/documents/{document_id}/download # Download document
```

**Document Operations**:
- Upload additional documents to existing requests
- Download signed documents
- Download audit trail
- Get document preview

**Example - Download Signed Document**:
```javascript
// JavaScript/Node.js
const downloadSignedDocument = async (accessToken, requestId, documentId) => {
  const response = await axios.get(
    `https://sign.zoho.com/api/v1/requests/${requestId}/documents/${documentId}/download`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      },
      responseType: 'arraybuffer'
    }
  );

  // Save to file
  fs.writeFileSync('signed-document.pdf', response.data);
  return 'Document downloaded successfully';
};
```

---

### 4. Actions
**Purpose**: Manage signing and approval actions

**Endpoints**:
```http
GET    /requests/{request_id}/actions              # List actions
GET    /requests/{request_id}/actions/{action_id}  # Get action details
PUT    /requests/{request_id}/actions/{action_id}  # Update action
POST   /requests/{request_id}/actions/{action_id}/remind # Send reminder
```

**Action Types**:
- SIGN - Signature required
- APPROVE - Approval required
- VIEW - View only access

**Example - Send Reminder**:
```javascript
// JavaScript/Node.js
const sendReminder = async (accessToken, requestId, actionId) => {
  const response = await axios.post(
    `https://sign.zoho.com/api/v1/requests/${requestId}/actions/${actionId}/remind`,
    {},
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

### 5. Fields
**Purpose**: Manage form fields in documents

**Field Types**:
- Signature - Electronic signature
- Initial - Initials
- Textfield - Single line text
- Textarea - Multi-line text
- Checkbox - Checkbox selection
- Radio - Radio button group
- Dropdown - Dropdown menu
- Date - Date picker
- Image - Image upload
- Attachment - File attachment
- Date Signed - Auto-filled date
- Name - Signer name
- Email - Signer email
- Company - Company name

**Example - Add Fields to Request**:
```python
# Python
def add_fields_to_action(access_token, request_id, action_id):
    url = f'https://sign.zoho.com/api/v1/requests/{request_id}/actions/{action_id}'

    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }

    data = {
        'fields': [
            {
                'field_type_name': 'Signature',
                'field_name': 'Signature',
                'page_no': 1,
                'x_coord': 100,
                'y_coord': 500,
                'width': 200,
                'height': 50,
                'is_mandatory': True
            },
            {
                'field_type_name': 'Textfield',
                'field_name': 'Job Title',
                'page_no': 1,
                'x_coord': 100,
                'y_coord': 450,
                'width': 200,
                'height': 30,
                'is_mandatory': True,
                'default_value': ''
            },
            {
                'field_type_name': 'Checkbox',
                'field_name': 'Accept Terms',
                'page_no': 1,
                'x_coord': 100,
                'y_coord': 400,
                'width': 20,
                'height': 20,
                'is_mandatory': True
            }
        ]
    }

    response = requests.put(url, headers=headers, json=data)
    return response.json()
```

---

### 6. Webhooks
**Purpose**: Receive real-time notifications about request events

**Supported Events**:
- request.submitted
- request.completed
- request.declined
- request.expired
- request.recalled
- action.completed
- action.declined

**Example - Configure Webhook**:
```javascript
// JavaScript/Node.js
const configureWebhook = async (accessToken) => {
  const response = await axios.post(
    'https://sign.zoho.com/api/v1/webhooks',
    {
      webhook_url: 'https://yourdomain.com/webhook/zoho-sign',
      events: [
        'request.submitted',
        'request.completed',
        'action.completed'
      ],
      webhook_name: 'Production Webhook'
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

**Webhook Payload Example**:
```json
{
  "event": "request.completed",
  "timestamp": 1704067200000,
  "request_id": "12345000000123456",
  "request_name": "Employment Contract - John Doe",
  "request_status": "completed",
  "owner_email": "admin@company.com",
  "actions": [
    {
      "action_id": "12345000000234567",
      "recipient_email": "john.doe@example.com",
      "action_status": "completed",
      "completed_time": 1704067100000
    }
  ]
}
```

---

## Authentication

### OAuth 2.0 Flow

**Step 1: Register Your Application**
- Go to [Zoho API Console](https://api-console.zoho.com/)
- Create a new Client
- Client Type: Server-based Applications
- Note your Client ID and Client Secret
- Set authorized redirect URI

**Step 2: Generate Authorization Code**
```http
GET https://accounts.zoho.com/oauth/v2/auth?
  scope=ZohoSign.documents.ALL,ZohoSign.templates.ALL&
  client_id={client_id}&
  response_type=code&
  access_type=offline&
  redirect_uri={redirect_uri}
```

**Available Scopes**:
- `ZohoSign.documents.ALL` - Full access to documents
- `ZohoSign.documents.READ` - Read-only access to documents
- `ZohoSign.documents.CREATE` - Create documents
- `ZohoSign.documents.UPDATE` - Update documents
- `ZohoSign.documents.DELETE` - Delete documents
- `ZohoSign.templates.ALL` - Full access to templates
- `ZohoSign.templates.READ` - Read-only access to templates
- `ZohoSign.templates.CREATE` - Create templates
- `ZohoSign.templates.UPDATE` - Update templates
- `ZohoSign.templates.DELETE` - Delete templates

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

| Plan | API Calls per Day | API Calls per Minute | Concurrent Calls |
|------|------------------|---------------------|------------------|
| Free | 100 | 10 | 2 |
| Standard | 1,000 | 20 | 5 |
| Professional | 5,000 | 30 | 10 |
| Enterprise | 10,000 | 50 | 20 |

### Rate Limit Headers

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 875
X-RateLimit-Reset: 1704067200
```

### Handling Rate Limits

**JavaScript Example**:
```javascript
const makeRequestWithRetry = async (url, options, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await axios(url, options);
      return response.data;
    } catch (error) {
      if (error.response?.status === 429) {
        const resetTime = error.response.headers['x-ratelimit-reset'];
        const waitTime = (resetTime * 1000) - Date.now();

        if (i < maxRetries - 1 && waitTime > 0) {
          console.log(`Rate limit hit. Waiting ${waitTime}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
      }
      throw error;
    }
  }
};
```

---

## Data Centers

Zoho Sign operates in multiple data centers. Use the appropriate base URL:

| Data Center | Base URL |
|-------------|----------|
| US | https://sign.zoho.com |
| EU | https://sign.zoho.eu |
| IN | https://sign.zoho.in |
| AU | https://sign.zoho.com.au |
| JP | https://sign.zoho.jp |

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

### Zoho Sign Error Codes

| Code | Message | Description | Solution |
|------|---------|-------------|----------|
| 0 | Success | Operation completed successfully | N/A |
| 6001 | Invalid request | Invalid request parameters | Verify request structure |
| 6002 | Authentication failed | Invalid access token | Refresh access token |
| 6003 | Permission denied | Insufficient permissions | Check OAuth scopes |
| 6004 | Resource not found | Request or document not found | Verify resource ID |
| 6005 | Invalid document | Document format not supported | Use PDF format |
| 6006 | Duplicate request | Request already exists | Check existing requests |
| 6007 | Invalid recipient | Recipient email is invalid | Verify email address |
| 6008 | Request expired | Signature request has expired | Create new request |
| 6009 | Rate limit exceeded | Too many API calls | Implement rate limiting |

### Error Response Format

```json
{
  "code": 6007,
  "message": "Invalid recipient email address",
  "details": "The email address 'invalid-email' is not valid."
}
```

---

## Common Operations

### 1. Complete Signature Workflow

```javascript
// JavaScript/Node.js - Complete Signature Workflow
const completeSignatureWorkflow = async (accessToken) => {
  try {
    // 1. Create template for reuse
    const template = await createTemplate(accessToken);
    console.log('Template created:', template.templates.template_id);

    // 2. Create request from template
    const request = await createRequestFromTemplate(
      accessToken,
      template.templates.template_id
    );
    console.log('Request created:', request.requests.request_id);

    // 3. Submit request (sends to recipients)
    await axios.post(
      `https://sign.zoho.com/api/v1/requests/${request.requests.request_id}/submit`,
      {},
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`
        }
      }
    );
    console.log('Request submitted to recipients');

    // 4. Check request status
    const status = await axios.get(
      `https://sign.zoho.com/api/v1/requests/${request.requests.request_id}`,
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`
        }
      }
    );
    console.log('Request status:', status.data.requests.request_status);

    return {
      success: true,
      request_id: request.requests.request_id
    };

  } catch (error) {
    console.error('Workflow error:', error.response?.data || error.message);
    throw error;
  }
};
```

### 2. Bulk Send Documents

```python
# Python - Bulk Send Documents
import time

def bulk_send_documents(access_token, recipients, template_id):
    results = {
        'successful': [],
        'failed': []
    }

    for recipient in recipients:
        try:
            response = requests.post(
                f'https://sign.zoho.com/api/v1/templates/{template_id}/createrequest',
                headers={
                    'Authorization': f'Zoho-oauthtoken {access_token}',
                    'Content-Type': 'application/json'
                },
                json={
                    'request_name': f'Document for {recipient["name"]}',
                    'expiration_days': 10,
                    'actions': [
                        {
                            'role': 'Signer',
                            'recipient_name': recipient['name'],
                            'recipient_email': recipient['email']
                        }
                    ]
                }
            )

            request_id = response.json()['requests']['request_id']

            # Submit request
            requests.post(
                f'https://sign.zoho.com/api/v1/requests/{request_id}/submit',
                headers={
                    'Authorization': f'Zoho-oauthtoken {access_token}'
                }
            )

            results['successful'].append({
                'name': recipient['name'],
                'email': recipient['email'],
                'request_id': request_id
            })

            print(f"Sent to: {recipient['name']}")

            # Rate limiting: wait between requests
            time.sleep(3)

        except Exception as e:
            results['failed'].append({
                'name': recipient['name'],
                'error': str(e)
            })
            print(f"Failed: {recipient['name']} - {str(e)}")

    return results

# Usage
recipients = [
    {'name': 'John Doe', 'email': 'john@example.com'},
    {'name': 'Jane Smith', 'email': 'jane@example.com'},
    # ... more recipients
]

results = bulk_send_documents(access_token, recipients, template_id)
print(f"Successful: {len(results['successful'])}")
print(f"Failed: {len(results['failed'])}")
```

### 3. Download All Completed Documents

```javascript
// JavaScript/Node.js
const downloadAllCompletedDocuments = async (accessToken) => {
  // Get all completed requests
  const response = await axios.get(
    'https://sign.zoho.com/api/v1/requests',
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      },
      params: {
        status: 'completed'
      }
    }
  );

  const requests = response.data.requests;

  for (const request of requests) {
    for (const document of request.document_ids) {
      try {
        const docResponse = await axios.get(
          `https://sign.zoho.com/api/v1/requests/${request.request_id}/documents/${document.document_id}/download`,
          {
            headers: {
              'Authorization': `Zoho-oauthtoken ${accessToken}`
            },
            responseType: 'arraybuffer'
          }
        );

        const filename = `${request.request_name}-${document.document_name}`;
        fs.writeFileSync(`downloads/${filename}`, docResponse.data);
        console.log(`Downloaded: ${filename}`);

      } catch (error) {
        console.error(`Failed to download: ${document.document_name}`);
      }
    }
  }
};
```

---

## Best Practices

### 1. Security

**Protect Access Tokens**:
```javascript
// Good: Use environment variables
const config = {
  clientId: process.env.ZOHO_SIGN_CLIENT_ID,
  clientSecret: process.env.ZOHO_SIGN_CLIENT_SECRET,
  refreshToken: process.env.ZOHO_SIGN_REFRESH_TOKEN
};

// Bad: Hard-coded credentials
const config = {
  clientId: '1000.ABC123',
  clientSecret: 'secret123'
};
```

### 2. Document Management

**Use Templates for Recurring Documents**:
- Create templates for frequently used documents
- Reduces setup time and ensures consistency
- Easier to maintain and update

**Set Appropriate Expiration**:
```javascript
const requestData = {
  expiration_days: 7,  // Set reasonable expiration
  email_reminders: true  // Enable automatic reminders
};
```

### 3. Error Handling

**Implement Comprehensive Error Handling**:
```python
def create_request_safe(access_token, data):
    try:
        response = requests.post(
            'https://sign.zoho.com/api/v1/requests',
            headers={'Authorization': f'Zoho-oauthtoken {access_token}'},
            files=data['files'],
            data=data['request_data']
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 401:
            # Refresh token and retry
            pass
        elif e.response.status_code == 429:
            # Rate limit - wait and retry
            pass
        else:
            # Log error
            print(f"Error: {e.response.json()}")
            raise
```

### 4. Webhook Implementation

**Verify Webhook Signatures**:
```javascript
const crypto = require('crypto');

const verifyWebhook = (payload, signature, secret) => {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  return hash === signature;
};

app.post('/webhook/zoho-sign', (req, res) => {
  const signature = req.headers['x-zoho-sign-signature'];

  if (!verifyWebhook(req.body, signature, WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }

  // Process webhook
  const { event, request_id } = req.body;
  console.log(`Event: ${event}, Request: ${request_id}`);

  res.status(200).send('OK');
});
```

### 5. Monitoring

**Track Request Status**:
```javascript
const monitorRequestStatus = async (accessToken, requestId) => {
  const maxChecks = 20;
  const checkInterval = 60000; // 1 minute

  for (let i = 0; i < maxChecks; i++) {
    const response = await axios.get(
      `https://sign.zoho.com/api/v1/requests/${requestId}`,
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`
        }
      }
    );

    const status = response.data.requests.request_status;
    console.log(`Check ${i + 1}: Status = ${status}`);

    if (status === 'completed' || status === 'declined' || status === 'expired') {
      return status;
    }

    await new Promise(resolve => setTimeout(resolve, checkInterval));
  }

  return 'timeout';
};
```

---

## Code Examples

### Deluge Integration

```deluge
// Deluge - Send Contract from CRM Deal
// This can be used in Zoho CRM workflow

dealId = "12345000000567890";

// Get deal details
dealMap = zoho.crm.getRecordById("Deals", dealId);

// Get contact details
contactId = dealMap.get("Contact_Name").get("id");
contactMap = zoho.crm.getRecordById("Contacts", contactId);

// Prepare contract request
request_data = {
    "request_name": "Contract - " + dealMap.get("Deal_Name"),
    "expiration_days": 15,
    "is_sequential": false,
    "actions": [
        {
            "action_type": "SIGN",
            "recipient_name": contactMap.get("Full_Name"),
            "recipient_email": contactMap.get("Email"),
            "private_notes": "Please review and sign the contract"
        }
    ],
    "notes": "Contract for: " + dealMap.get("Deal_Name")
};

// Create signature request using template
template_id = "12345000000456789";
response = zoho.sign.createRequestFromTemplate(template_id, request_data);

// Update CRM deal
if(response.get("code") == 0) {
    request_id = response.get("requests").get("request_id");

    updateMap = Map();
    updateMap.put("Sign_Request_ID", request_id);
    updateMap.put("Contract_Status", "Sent for Signature");

    zoho.crm.updateRecord("Deals", dealId, updateMap);

    info "Contract sent: " + request_id;
}
```

---

## Additional Resources

- [Official Zoho Sign API Documentation](https://www.zoho.com/sign/api/)
- [API Console](https://api-console.zoho.com/)
- [Zoho Sign Help Documentation](https://www.zoho.com/sign/help/)
- [Developer Forums](https://help.zoho.com/portal/en/community/sign)

---

**Last Updated**: December 2025
**API Version**: v1
