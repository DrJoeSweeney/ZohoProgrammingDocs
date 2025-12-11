# Zoho Writer API Reference

## Overview

Zoho Writer is a powerful word processing application that allows you to create, edit, and collaborate on documents online. The Writer API provides programmatic access to document creation, editing, collaboration features, templates, and Zoho Sign integration.

**Current API Version**: v1
**Base URL**: `https://www.zohoapis.com/writer/api/v1/`
**Office Integrator URL**: `https://api.office-integrator.com/v1/`
**Protocol**: REST
**Data Format**: JSON
**Authentication**: OAuth 2.0

---

## Quick Links

- [Authentication](#authentication)
- [Documents API](#documents-api)
- [Office Integrator](#office-integrator)
- [Collaboration](#collaboration)
- [Templates](#templates)
- [Sign Integration](#sign-integration)
- [Rate Limits](#rate-limits)
- [Error Codes](#error-codes)
- [Code Examples](#code-examples)

---

## Authentication

### OAuth 2.0 Setup

**Step 1: Register Your Application**
1. Go to [Zoho API Console](https://api-console.zoho.com/)
2. Create a new client
3. Note your `Client ID` and `Client Secret`
4. Set redirect URI

**Step 2: Authorization Code Flow**

```http
GET https://accounts.zoho.com/oauth/v2/auth?
  response_type=code&
  client_id={client_id}&
  scope=ZohoWriter.documents.ALL,ZohoWriter.templates.READ&
  redirect_uri={redirect_uri}&
  access_type=offline
```

**Step 3: Exchange Code for Token**

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
  "access_token": "1000.xxx.xxx",
  "refresh_token": "1000.yyy.yyy",
  "api_domain": "https://www.zohoapis.com",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

**Available Scopes**:
- `ZohoWriter.documents.ALL` - Full document access
- `ZohoWriter.documents.READ` - Read-only document access
- `ZohoWriter.documents.CREATE` - Create documents
- `ZohoWriter.documents.UPDATE` - Update documents
- `ZohoWriter.documents.DELETE` - Delete documents
- `ZohoWriter.templates.ALL` - Full template access
- `ZohoWriter.templates.READ` - Read-only template access
- `ZohoWriter.share.ALL` - Sharing and collaboration
- `ZohoWriter.comments.ALL` - Comment management

---

## Documents API

### List Documents

Retrieve all documents from your Zoho Writer account.

**Endpoint**: `GET /documents`

**Query Parameters**:
- `page` (integer): Page number (default: 1)
- `per_page` (integer): Results per page, max 200 (default: 50)
- `sort_by` (string): Sort field - `name`, `created_time`, `modified_time`
- `sort_order` (string): `asc` or `desc`
- `folder_id` (string): Filter by folder ID
- `search` (string): Search documents by name

**Request**:
```http
GET https://www.zohoapis.com/writer/api/v1/documents?page=1&per_page=50
Authorization: Zoho-oauthtoken {access_token}
```

**Response**:
```json
{
  "data": [
    {
      "document_id": "abc123xyz789",
      "document_name": "Project Proposal.zdoc",
      "document_url": "https://writer.zoho.com/writer/open/abc123xyz789",
      "created_time": "2025-01-15T10:30:00Z",
      "modified_time": "2025-01-16T14:20:00Z",
      "owner": {
        "user_id": "12345",
        "email": "user@example.com",
        "name": "John Doe"
      },
      "folder_id": "folder_001",
      "file_size": 245760,
      "status": "active",
      "is_public": false
    }
  ],
  "info": {
    "page": 1,
    "per_page": 50,
    "count": 25,
    "total_count": 125,
    "more_records": true
  }
}
```

### Get Document

Retrieve details of a specific document.

**Endpoint**: `GET /documents/{document_id}`

**Request**:
```http
GET https://www.zohoapis.com/writer/api/v1/documents/abc123xyz789
Authorization: Zoho-oauthtoken {access_token}
```

**Response**:
```json
{
  "data": {
    "document_id": "abc123xyz789",
    "document_name": "Project Proposal.zdoc",
    "document_url": "https://writer.zoho.com/writer/open/abc123xyz789",
    "created_time": "2025-01-15T10:30:00Z",
    "modified_time": "2025-01-16T14:20:00Z",
    "owner": {
      "user_id": "12345",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "shared_with": [
      {
        "user_id": "67890",
        "email": "collaborator@example.com",
        "permission": "write"
      }
    ],
    "file_size": 245760,
    "word_count": 1250,
    "page_count": 5,
    "status": "active"
  }
}
```

### Create Document

Create a new document from content or template.

**Endpoint**: `POST /documents`

**Request Body**:
```json
{
  "document_name": "New Document.zdoc",
  "content": "<html><body><h1>Hello World</h1><p>This is a test document.</p></body></html>",
  "content_type": "html",
  "folder_id": "folder_001",
  "tags": ["project", "draft"]
}
```

**Alternative - Create from Template**:
```json
{
  "document_name": "Q1 Report.zdoc",
  "template_id": "template_123",
  "merge_data": {
    "company_name": "Acme Corp",
    "report_date": "2025-01-15",
    "revenue": "$1,250,000"
  },
  "folder_id": "folder_001"
}
```

**Request**:
```http
POST https://www.zohoapis.com/writer/api/v1/documents
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{body}
```

**Response**:
```json
{
  "data": {
    "document_id": "def456uvw123",
    "document_name": "New Document.zdoc",
    "document_url": "https://writer.zoho.com/writer/open/def456uvw123",
    "created_time": "2025-01-17T09:15:00Z",
    "status": "active"
  },
  "message": "Document created successfully"
}
```

### Update Document

Update document content or metadata.

**Endpoint**: `PUT /documents/{document_id}`

**Request Body**:
```json
{
  "document_name": "Updated Document Name.zdoc",
  "content": "<html><body><h1>Updated Content</h1></body></html>",
  "content_type": "html"
}
```

**Response**:
```json
{
  "data": {
    "document_id": "abc123xyz789",
    "modified_time": "2025-01-17T10:30:00Z"
  },
  "message": "Document updated successfully"
}
```

### Delete Document

Move document to trash or permanently delete.

**Endpoint**: `DELETE /documents/{document_id}`

**Query Parameters**:
- `permanent` (boolean): Permanently delete (default: false - moves to trash)

**Request**:
```http
DELETE https://www.zohoapis.com/writer/api/v1/documents/abc123xyz789
Authorization: Zoho-oauthtoken {access_token}
```

**Response**:
```json
{
  "message": "Document moved to trash successfully"
}
```

### Download Document

Export document in various formats.

**Endpoint**: `GET /documents/{document_id}/download`

**Query Parameters**:
- `format` (string): Export format - `pdf`, `docx`, `html`, `txt`, `odt`, `rtf`

**Request**:
```http
GET https://www.zohoapis.com/writer/api/v1/documents/abc123xyz789/download?format=pdf
Authorization: Zoho-oauthtoken {access_token}
```

**Response**: Binary file stream

### Upload Document

Upload a document from local file.

**Endpoint**: `POST /documents/upload`

**Request**:
```http
POST https://www.zohoapis.com/writer/api/v1/documents/upload
Authorization: Zoho-oauthtoken {access_token}
Content-Type: multipart/form-data

file={binary_data}
document_name=Uploaded Document.docx
folder_id=folder_001
```

**Response**:
```json
{
  "data": {
    "document_id": "ghi789rst456",
    "document_name": "Uploaded Document.docx",
    "document_url": "https://writer.zoho.com/writer/open/ghi789rst456",
    "created_time": "2025-01-17T11:00:00Z"
  },
  "message": "Document uploaded successfully"
}
```

---

## Office Integrator

Office Integrator enables embedding Zoho Writer editor in your application.

### Create Editor Session

Generate an editor session URL for embedding.

**Endpoint**: `POST /writer/document/create`

**Request**:
```http
POST https://api.office-integrator.com/v1/writer/document/create
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "document": {
    "document_name": "Untitled Document",
    "document_info": {
      "author": "John Doe"
    }
  },
  "editor_settings": {
    "language": "en",
    "toolbar": ["bold", "italic", "underline", "alignment"],
    "unit": "in"
  },
  "permissions": {
    "document.edit": true,
    "document.export": true,
    "document.print": true,
    "document.download": true,
    "comment.edit": true,
    "review.changes.resolve": true
  },
  "callback_settings": {
    "save_url": "https://yourapp.com/api/save",
    "save_format": "zdoc"
  },
  "ui_options": {
    "save_button": "visible",
    "chat_panel": "show"
  }
}
```

**Response**:
```json
{
  "document_id": "jkl012mno345",
  "session_id": "session_abc123",
  "session_url": "https://writer.zoho.com/writer/officeintegrator/jkl012mno345?session_id=session_abc123",
  "session_delete_url": "https://api.office-integrator.com/v1/writer/session/session_abc123",
  "document_delete_url": "https://api.office-integrator.com/v1/writer/document/jkl012mno345",
  "expires_in": 3600
}
```

### Edit Existing Document

Open existing document in editor.

**Endpoint**: `POST /writer/document/edit`

**Request Body**:
```json
{
  "document": {
    "document_id": "abc123xyz789",
    "mode": "edit"
  },
  "editor_settings": {
    "language": "en",
    "track_changes": "enabled"
  },
  "permissions": {
    "document.edit": true,
    "document.export": true
  },
  "callback_settings": {
    "save_url": "https://yourapp.com/api/save",
    "save_format": "zdoc"
  }
}
```

**Response**:
```json
{
  "document_id": "abc123xyz789",
  "session_id": "session_def456",
  "session_url": "https://writer.zoho.com/writer/officeintegrator/abc123xyz789?session_id=session_def456",
  "expires_in": 3600
}
```

### Co-Editing Session

Enable real-time collaboration for multiple users.

**Request Body**:
```json
{
  "document": {
    "document_id": "abc123xyz789"
  },
  "editor_settings": {
    "collaborative_editing": "enabled",
    "presence": "show"
  },
  "user": {
    "user_id": "user_123",
    "display_name": "Jane Smith",
    "email": "jane@example.com",
    "avatar_url": "https://example.com/avatar.jpg"
  },
  "permissions": {
    "document.edit": true,
    "comment.add": true
  }
}
```

---

## Collaboration

### Share Document

Share document with users or groups.

**Endpoint**: `POST /documents/{document_id}/share`

**Request Body**:
```json
{
  "users": [
    {
      "email": "collaborator@example.com",
      "permission": "write",
      "notify": true
    },
    {
      "email": "viewer@example.com",
      "permission": "read",
      "notify": true
    }
  ],
  "message": "Please review this document",
  "allow_download": true,
  "allow_print": true
}
```

**Permissions**:
- `read` - View only
- `write` - Edit document
- `comment` - Add comments only

**Response**:
```json
{
  "data": [
    {
      "email": "collaborator@example.com",
      "permission": "write",
      "share_id": "share_001",
      "status": "invited"
    }
  ],
  "message": "Document shared successfully"
}
```

### Get Share Settings

**Endpoint**: `GET /documents/{document_id}/shares`

**Response**:
```json
{
  "data": [
    {
      "share_id": "share_001",
      "user": {
        "email": "collaborator@example.com",
        "name": "Alice Johnson"
      },
      "permission": "write",
      "shared_time": "2025-01-15T10:00:00Z",
      "status": "accepted"
    }
  ]
}
```

### Revoke Access

**Endpoint**: `DELETE /documents/{document_id}/shares/{share_id}`

**Response**:
```json
{
  "message": "Access revoked successfully"
}
```

### Public Link

Generate public sharing link.

**Endpoint**: `POST /documents/{document_id}/public-link`

**Request Body**:
```json
{
  "permission": "read",
  "password": "secure123",
  "expiry_date": "2025-02-15T23:59:59Z",
  "allow_download": false
}
```

**Response**:
```json
{
  "data": {
    "public_url": "https://writer.zoho.com/public/abc123xyz789",
    "link_id": "link_001",
    "expires_at": "2025-02-15T23:59:59Z"
  }
}
```

### Comments

**Add Comment**:
```http
POST /documents/{document_id}/comments
```

**Request Body**:
```json
{
  "comment_text": "Please review this section",
  "position": {
    "paragraph_id": "p_12",
    "offset": 150
  },
  "mention_users": ["user_456"]
}
```

**Response**:
```json
{
  "data": {
    "comment_id": "comment_001",
    "comment_text": "Please review this section",
    "author": {
      "user_id": "user_123",
      "name": "John Doe"
    },
    "created_time": "2025-01-17T12:30:00Z"
  }
}
```

**List Comments**:
```http
GET /documents/{document_id}/comments
```

**Delete Comment**:
```http
DELETE /documents/{document_id}/comments/{comment_id}
```

---

## Templates

### List Templates

**Endpoint**: `GET /templates`

**Response**:
```json
{
  "data": [
    {
      "template_id": "template_001",
      "template_name": "Business Proposal",
      "category": "Business",
      "thumbnail_url": "https://writer.zoho.com/templates/thumb/template_001.png",
      "created_time": "2025-01-10T08:00:00Z"
    }
  ]
}
```

### Get Template

**Endpoint**: `GET /templates/{template_id}`

**Response**:
```json
{
  "data": {
    "template_id": "template_001",
    "template_name": "Business Proposal",
    "description": "Professional business proposal template",
    "merge_fields": [
      {
        "field_name": "company_name",
        "field_type": "text",
        "required": true
      },
      {
        "field_name": "proposal_date",
        "field_type": "date",
        "required": true
      }
    ],
    "preview_url": "https://writer.zoho.com/templates/preview/template_001"
  }
}
```

### Create Document from Template

**Endpoint**: `POST /templates/{template_id}/document`

**Request Body**:
```json
{
  "document_name": "Acme Corp Proposal",
  "merge_data": {
    "company_name": "Acme Corporation",
    "proposal_date": "2025-01-20",
    "contact_person": "Jane Smith",
    "amount": "$50,000"
  },
  "folder_id": "folder_001"
}
```

**Response**:
```json
{
  "data": {
    "document_id": "pqr345stu678",
    "document_name": "Acme Corp Proposal",
    "document_url": "https://writer.zoho.com/writer/open/pqr345stu678"
  }
}
```

---

## Sign Integration

Integrate Zoho Sign for document signing workflows.

### Send Document for Signature

**Endpoint**: `POST /documents/{document_id}/sign`

**Request Body**:
```json
{
  "recipients": [
    {
      "email": "signer1@example.com",
      "name": "John Smith",
      "action": "sign",
      "order": 1,
      "signature_fields": [
        {
          "field_type": "signature",
          "page_number": 1,
          "x_coordinate": 100,
          "y_coordinate": 500,
          "width": 200,
          "height": 50
        }
      ]
    },
    {
      "email": "signer2@example.com",
      "name": "Jane Doe",
      "action": "approve",
      "order": 2
    }
  ],
  "email_subject": "Please sign: Project Agreement",
  "email_message": "Please review and sign the attached document",
  "expiry_days": 15,
  "reminder_period": 3
}
```

**Response**:
```json
{
  "data": {
    "request_id": "sign_req_001",
    "document_id": "abc123xyz789",
    "status": "sent",
    "recipients": [
      {
        "email": "signer1@example.com",
        "status": "pending",
        "recipient_id": "recip_001"
      }
    ],
    "sign_url": "https://sign.zoho.com/requests/sign_req_001"
  }
}
```

### Check Signature Status

**Endpoint**: `GET /documents/{document_id}/sign/status`

**Response**:
```json
{
  "data": {
    "request_id": "sign_req_001",
    "status": "completed",
    "recipients": [
      {
        "email": "signer1@example.com",
        "status": "signed",
        "signed_time": "2025-01-18T14:30:00Z"
      },
      {
        "email": "signer2@example.com",
        "status": "signed",
        "signed_time": "2025-01-19T09:15:00Z"
      }
    ],
    "completed_time": "2025-01-19T09:15:00Z",
    "signed_document_id": "abc123xyz789_signed"
  }
}
```

### Download Signed Document

**Endpoint**: `GET /documents/{document_id}/sign/download`

**Response**: Binary PDF file with signatures

---

## Rate Limits

### API Rate Limits

| Tier | Requests per Minute | Daily Limit |
|------|---------------------|-------------|
| Free | 20 | 1,000 |
| Standard | 60 | 10,000 |
| Professional | 120 | 50,000 |
| Enterprise | 300 | 200,000 |

### Rate Limit Headers

```http
X-RateLimit-Limit: 120
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705587600
```

### Handling Rate Limits

When rate limit is exceeded:

**Response (429)**:
```json
{
  "code": "RATE_LIMIT_EXCEEDED",
  "message": "API rate limit exceeded",
  "details": {
    "retry_after": 45
  }
}
```

**Best Practices**:
- Implement exponential backoff
- Cache frequently accessed data
- Use batch operations when available
- Monitor rate limit headers

---

## Error Codes

### Common HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 204 | No Content | Request successful, no content returned |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Invalid or expired access token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource conflict (e.g., duplicate name) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Service temporarily unavailable |

### Error Response Format

```json
{
  "code": "INVALID_TOKEN",
  "message": "The access token is invalid or has expired",
  "details": {
    "error_type": "authentication",
    "suggestion": "Please refresh your access token"
  }
}
```

### Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| INVALID_TOKEN | Access token is invalid or expired | Refresh access token |
| INSUFFICIENT_SCOPE | Missing required OAuth scope | Request proper scopes |
| DOCUMENT_NOT_FOUND | Document does not exist | Verify document ID |
| PERMISSION_DENIED | User lacks permission | Check user permissions |
| INVALID_FORMAT | Invalid file format | Use supported formats |
| DOCUMENT_LOCKED | Document is locked by another user | Wait or request unlock |
| QUOTA_EXCEEDED | Storage quota exceeded | Upgrade plan or delete files |
| INVALID_PARAMETER | Invalid request parameter | Check API documentation |
| DUPLICATE_NAME | Document name already exists | Use unique name |
| TEMPLATE_ERROR | Template processing error | Verify merge fields |

---

## Code Examples

### JavaScript/Node.js

**Initialize Client**:
```javascript
const axios = require('axios');

class ZohoWriterClient {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseURL = 'https://www.zohoapis.com/writer/api/v1';
  }

  async request(method, endpoint, data = null) {
    const config = {
      method,
      url: `${this.baseURL}${endpoint}`,
      headers: {
        'Authorization': `Zoho-oauthtoken ${this.accessToken}`,
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      config.data = data;
    }

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(`API Error: ${error.response.data.message}`);
      }
      throw error;
    }
  }

  // List documents
  async listDocuments(options = {}) {
    const params = new URLSearchParams(options).toString();
    const endpoint = params ? `/documents?${params}` : '/documents';
    return await this.request('GET', endpoint);
  }

  // Create document
  async createDocument(documentData) {
    return await this.request('POST', '/documents', documentData);
  }

  // Get document
  async getDocument(documentId) {
    return await this.request('GET', `/documents/${documentId}`);
  }

  // Update document
  async updateDocument(documentId, updateData) {
    return await this.request('PUT', `/documents/${documentId}`, updateData);
  }

  // Delete document
  async deleteDocument(documentId, permanent = false) {
    const endpoint = `/documents/${documentId}${permanent ? '?permanent=true' : ''}`;
    return await this.request('DELETE', endpoint);
  }

  // Share document
  async shareDocument(documentId, shareData) {
    return await this.request('POST', `/documents/${documentId}/share`, shareData);
  }

  // Download document
  async downloadDocument(documentId, format = 'pdf') {
    const url = `${this.baseURL}/documents/${documentId}/download?format=${format}`;
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Zoho-oauthtoken ${this.accessToken}`
      },
      responseType: 'arraybuffer'
    });
    return response.data;
  }
}

// Usage
const client = new ZohoWriterClient('1000.xxx.xxx');

// List documents
client.listDocuments({ page: 1, per_page: 50 })
  .then(response => {
    console.log('Documents:', response.data);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });

// Create document
client.createDocument({
  document_name: 'New Document.zdoc',
  content: '<html><body><h1>Hello World</h1></body></html>',
  content_type: 'html'
})
  .then(response => {
    console.log('Created:', response.data);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });

// Create from template
client.createDocument({
  document_name: 'Q1 Report.zdoc',
  template_id: 'template_123',
  merge_data: {
    company_name: 'Acme Corp',
    report_date: '2025-01-15'
  }
})
  .then(response => {
    console.log('Created from template:', response.data);
  });

// Share document
client.shareDocument('abc123xyz789', {
  users: [
    {
      email: 'colleague@example.com',
      permission: 'write',
      notify: true
    }
  ],
  message: 'Please review this document'
})
  .then(response => {
    console.log('Shared:', response.data);
  });
```

### Python

**Initialize Client**:
```python
import requests
import json

class ZohoWriterClient:
    def __init__(self, access_token):
        self.access_token = access_token
        self.base_url = 'https://www.zohoapis.com/writer/api/v1'
        self.headers = {
            'Authorization': f'Zoho-oauthtoken {access_token}',
            'Content-Type': 'application/json'
        }

    def request(self, method, endpoint, data=None):
        url = f'{self.base_url}{endpoint}'

        try:
            if method == 'GET':
                response = requests.get(url, headers=self.headers)
            elif method == 'POST':
                response = requests.post(url, headers=self.headers, json=data)
            elif method == 'PUT':
                response = requests.put(url, headers=self.headers, json=data)
            elif method == 'DELETE':
                response = requests.delete(url, headers=self.headers)

            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f'API Error: {str(e)}')

    def list_documents(self, **kwargs):
        params = '&'.join([f'{k}={v}' for k, v in kwargs.items()])
        endpoint = f'/documents?{params}' if params else '/documents'
        return self.request('GET', endpoint)

    def create_document(self, document_data):
        return self.request('POST', '/documents', document_data)

    def get_document(self, document_id):
        return self.request('GET', f'/documents/{document_id}')

    def update_document(self, document_id, update_data):
        return self.request('PUT', f'/documents/{document_id}', update_data)

    def delete_document(self, document_id, permanent=False):
        endpoint = f'/documents/{document_id}'
        if permanent:
            endpoint += '?permanent=true'
        return self.request('DELETE', endpoint)

    def share_document(self, document_id, share_data):
        return self.request('POST', f'/documents/{document_id}/share', share_data)

    def download_document(self, document_id, format='pdf'):
        url = f'{self.base_url}/documents/{document_id}/download?format={format}'
        response = requests.get(url, headers=self.headers)
        response.raise_for_status()
        return response.content

# Usage
client = ZohoWriterClient('1000.xxx.xxx')

# List documents
response = client.list_documents(page=1, per_page=50)
print('Documents:', response['data'])

# Create document
response = client.create_document({
    'document_name': 'New Document.zdoc',
    'content': '<html><body><h1>Hello World</h1></body></html>',
    'content_type': 'html'
})
print('Created:', response['data'])

# Create from template
response = client.create_document({
    'document_name': 'Q1 Report.zdoc',
    'template_id': 'template_123',
    'merge_data': {
        'company_name': 'Acme Corp',
        'report_date': '2025-01-15'
    }
})
print('Created from template:', response['data'])

# Share document
response = client.share_document('abc123xyz789', {
    'users': [
        {
            'email': 'colleague@example.com',
            'permission': 'write',
            'notify': True
        }
    ],
    'message': 'Please review this document'
})
print('Shared:', response['data'])

# Download document
pdf_content = client.download_document('abc123xyz789', format='pdf')
with open('document.pdf', 'wb') as f:
    f.write(pdf_content)
print('Downloaded document.pdf')
```

### Deluge

**List Documents**:
```deluge
// Get access token (assuming stored in variable)
accessToken = "1000.xxx.xxx";

// List documents
response = invokeurl
[
    url: "https://www.zohoapis.com/writer/api/v1/documents?page=1&per_page=50"
    type: GET
    headers: {"Authorization": "Zoho-oauthtoken " + accessToken}
];

if(response.get("data") != null)
{
    for each document in response.get("data")
    {
        info "Document: " + document.get("document_name");
        info "ID: " + document.get("document_id");
    }
}
```

**Create Document**:
```deluge
accessToken = "1000.xxx.xxx";

// Create document data
documentData = {
    "document_name": "New Document.zdoc",
    "content": "<html><body><h1>Hello World</h1><p>This is a test document.</p></body></html>",
    "content_type": "html",
    "folder_id": "folder_001"
};

// Create document
response = invokeurl
[
    url: "https://www.zohoapis.com/writer/api/v1/documents"
    type: POST
    parameters: documentData.toString()
    headers: {"Authorization": "Zoho-oauthtoken " + accessToken}
];

if(response.get("data") != null)
{
    documentId = response.get("data").get("document_id");
    info "Created document: " + documentId;
}
```

**Create from Template**:
```deluge
accessToken = "1000.xxx.xxx";

// Template data
templateData = {
    "document_name": "Q1 Report.zdoc",
    "template_id": "template_123",
    "merge_data": {
        "company_name": "Acme Corp",
        "report_date": "2025-01-15",
        "revenue": "$1,250,000"
    }
};

// Create document from template
response = invokeurl
[
    url: "https://www.zohoapis.com/writer/api/v1/documents"
    type: POST
    parameters: templateData.toString()
    headers: {"Authorization": "Zoho-oauthtoken " + accessToken}
];

info "Document created: " + response.get("data").get("document_id");
```

**Share Document**:
```deluge
accessToken = "1000.xxx.xxx";
documentId = "abc123xyz789";

// Share data
shareData = {
    "users": [
        {
            "email": "colleague@example.com",
            "permission": "write",
            "notify": true
        }
    ],
    "message": "Please review this document"
};

// Share document
response = invokeurl
[
    url: "https://www.zohoapis.com/writer/api/v1/documents/" + documentId + "/share"
    type: POST
    parameters: shareData.toString()
    headers: {"Authorization": "Zoho-oauthtoken " + accessToken}
];

info "Document shared successfully";
```

**Download Document**:
```deluge
accessToken = "1000.xxx.xxx";
documentId = "abc123xyz789";

// Download as PDF
response = invokeurl
[
    url: "https://www.zohoapis.com/writer/api/v1/documents/" + documentId + "/download?format=pdf"
    type: GET
    headers: {"Authorization": "Zoho-oauthtoken " + accessToken}
];

// Response contains binary PDF data
info "Document downloaded";
```

---

## Best Practices

### Performance Optimization

1. **Use Pagination**: Always paginate large result sets
2. **Cache Data**: Cache frequently accessed documents
3. **Batch Operations**: Group related operations
4. **Minimal Fields**: Request only needed fields
5. **Webhooks**: Use webhooks for real-time updates instead of polling

### Security

1. **Secure Token Storage**: Never expose access tokens in client-side code
2. **Use HTTPS**: Always use secure connections
3. **Token Refresh**: Implement automatic token refresh
4. **Scope Limitation**: Request minimum required scopes
5. **Password Protection**: Use passwords for sensitive public links

### Error Handling

```javascript
async function safeAPICall(apiFunction) {
  try {
    return await apiFunction();
  } catch (error) {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Refresh token
          await refreshAccessToken();
          return await apiFunction();
        case 429:
          // Rate limit - wait and retry
          const retryAfter = error.response.headers['retry-after'] || 60;
          await sleep(retryAfter * 1000);
          return await apiFunction();
        case 503:
          // Service unavailable - retry with backoff
          await exponentialBackoff();
          return await apiFunction();
        default:
          throw error;
      }
    }
    throw error;
  }
}
```

---

## Support and Resources

- **API Documentation**: https://www.zoho.com/writer/help/api/
- **Developer Forum**: https://help.zoho.com/portal/community
- **API Console**: https://api-console.zoho.com/
- **Status Page**: https://status.zoho.com/
- **Support Email**: support@zohowriter.com

---

**Last Updated**: January 2025
**API Version**: v1
