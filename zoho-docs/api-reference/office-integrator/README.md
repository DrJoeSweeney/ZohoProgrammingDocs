# Zoho Office Integrator API Reference

## Overview

Zoho Office Integrator enables embedding Zoho Writer, Sheet, and Show editors into third-party applications. The API provides document creation, editing, collaboration, and management capabilities.

**Current API Version**: v1
**Base URL**: `https://api.office-integrator.zoho.com/v1/`
**Protocol**: REST
**Data Format**: JSON
**Authentication**: OAuth 2.0 / API Key

---

## Quick Links

- [Authentication](#authentication)
- [Rate Limits](#rate-limits)
- [API Modules](#api-modules)
- [Editor Integration](#editor-integration)
- [Common Operations](#common-operations)
- [Error Codes](#error-codes)
- [Code Examples](#code-examples)

---

## Authentication

### OAuth 2.0 Setup

**Authorization URL**:
```
https://accounts.zoho.com/oauth/v2/auth
```

**Token URL**:
```
https://accounts.zoho.com/oauth/v2/token
```

**Required Scopes**:
- `ZohoOfficeIntegrator.documents.ALL` - Full document access
- `ZohoOfficeIntegrator.documents.READ` - Read-only access
- `ZohoOfficeIntegrator.sessions.CREATE` - Create editor sessions

**API Key Authentication** (Alternative):
```http
Authorization: Zoho-oauthtoken {api_key}
```

---

## Rate Limits

- **API Calls**: 5,000 calls per day per organization
- **Document Sessions**: 100 concurrent sessions
- **File Size Limit**: 50 MB per document
- **Burst Limit**: 60 calls per minute

---

## API Modules

### 1. Writer API (Document Editor)

**Purpose**: Embed word processor functionality

**Create Writer Session**:
```http
POST /v1/writer/document
```

**Example - Create New Document**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const createWriterSession = async (apiKey, documentData) => {
  const response = await axios.post(
    'https://api.office-integrator.zoho.com/v1/writer/document',
    {
      document: {
        content: documentData.content || '',
        format: 'html'
      },
      editor_settings: {
        language: 'en',
        unit: 'in'
      },
      document_info: {
        document_name: documentData.name || 'Untitled Document'
      },
      permissions: {
        document: {
          print: true,
          export: true,
          edit: true
        }
      },
      callback_settings: {
        save_url: documentData.saveUrl,
        save_format: 'docx'
      },
      ui_options: {
        save_button: 'show',
        chat_panel: 'show'
      }
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

// Usage
const session = await createWriterSession(apiKey, {
  name: 'Project Proposal',
  content: '<h1>Project Proposal</h1><p>Content here...</p>',
  saveUrl: 'https://myapp.com/api/save-document'
});

// Returns: { document_url: '...', session_id: '...', document_id: '...' }
```

**Response**:
```json
{
  "document_url": "https://writer.zoho.com/writer/officeapi/v1/document/abc123",
  "session_id": "session_abc123",
  "document_id": "doc_xyz789",
  "session_delete_url": "https://api.office-integrator.zoho.com/v1/writer/session/session_abc123",
  "expires_in": 3600
}
```

**Example - Open Existing Document**:
```python
# Python
import requests

def open_writer_document(api_key, document_url):
    url = 'https://api.office-integrator.zoho.com/v1/writer/document'
    headers = {
        'Authorization': f'Zoho-oauthtoken {api_key}',
        'Content-Type': 'application/json'
    }
    data = {
        'document': {
            'url': document_url
        },
        'editor_settings': {
            'language': 'en'
        },
        'permissions': {
            'document': {
                'edit': True,
                'print': True,
                'export': True
            }
        },
        'callback_settings': {
            'save_url': 'https://myapp.com/api/save'
        }
    }

    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

**Writer Embed Code**:
```html
<!DOCTYPE html>
<html>
<head>
  <title>Document Editor</title>
</head>
<body>
  <iframe
    id="writer-editor"
    src="https://writer.zoho.com/writer/officeapi/v1/document/abc123"
    width="100%"
    height="800px"
    frameborder="0">
  </iframe>
</body>
</html>
```

---

### 2. Sheet API (Spreadsheet Editor)

**Purpose**: Embed spreadsheet functionality

**Create Sheet Session**:
```http
POST /v1/sheet
```

**Example - Create New Spreadsheet**:
```javascript
// JavaScript/Node.js
const createSheetSession = async (apiKey, sheetData) => {
  const response = await axios.post(
    'https://api.office-integrator.zoho.com/v1/sheet',
    {
      sheet_data: {
        data_json: sheetData.data || {},
        sheet_name: sheetData.name || 'Sheet1'
      },
      editor_settings: {
        language: 'en',
        country: 'US'
      },
      permissions: {
        sheet: {
          edit: true,
          print: true,
          export: true
        }
      },
      callback_settings: {
        save_url: sheetData.saveUrl,
        save_format: 'xlsx'
      }
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

// Create spreadsheet with initial data
const session = await createSheetSession(apiKey, {
  name: 'Sales Report Q1',
  data: {
    'Sheet1': [
      ['Product', 'Q1 Sales', 'Q2 Sales'],
      ['Product A', 15000, 18000],
      ['Product B', 12000, 14000]
    ]
  },
  saveUrl: 'https://myapp.com/api/save-sheet'
});
```

**Example - Import Existing Spreadsheet**:
```python
# Python
def open_sheet(api_key, file_url):
    url = 'https://api.office-integrator.zoho.com/v1/sheet'
    headers = {
        'Authorization': f'Zoho-oauthtoken {api_key}',
        'Content-Type': 'application/json'
    }
    data = {
        'document': {
            'url': file_url
        },
        'editor_settings': {
            'language': 'en'
        },
        'permissions': {
            'sheet': {
                'edit': True,
                'export': ['xlsx', 'csv', 'pdf']
            }
        }
    }

    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

---

### 3. Show API (Presentation Editor)

**Purpose**: Embed presentation functionality

**Create Show Session**:
```http
POST /v1/show
```

**Example - Create New Presentation**:
```javascript
// JavaScript/Node.js
const createShowSession = async (apiKey, presentationData) => {
  const response = await axios.post(
    'https://api.office-integrator.zoho.com/v1/show',
    {
      show_data: {
        slides: presentationData.slides || []
      },
      document_info: {
        document_name: presentationData.name || 'Untitled Presentation'
      },
      editor_settings: {
        language: 'en'
      },
      permissions: {
        presentation: {
          edit: true,
          print: true,
          export: true,
          present: true
        }
      },
      callback_settings: {
        save_url: presentationData.saveUrl,
        save_format: 'pptx'
      }
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};
```

---

### 4. Document Operations

**Purpose**: Perform operations on documents

**Merge Documents**:
```http
POST /v1/writer/document/merge
```

**Example - Merge Multiple Documents**:
```python
# Python
def merge_documents(api_key, document_urls):
    url = 'https://api.office-integrator.zoho.com/v1/writer/document/merge'
    headers = {
        'Authorization': f'Zoho-oauthtoken {api_key}',
        'Content-Type': 'application/json'
    }
    data = {
        'documents': document_urls,
        'output_format': 'docx'
    }

    response = requests.post(url, json=data, headers=headers)
    return response.json()

# Merge three documents
result = merge_documents(api_key, [
    'https://example.com/doc1.docx',
    'https://example.com/doc2.docx',
    'https://example.com/doc3.docx'
])
```

**Convert Document**:
```http
POST /v1/writer/document/convert
```

**Example - Convert Document Format**:
```javascript
// JavaScript/Node.js
const convertDocument = async (apiKey, documentUrl, targetFormat) => {
  const response = await axios.post(
    'https://api.office-integrator.zoho.com/v1/writer/document/convert',
    {
      document: {
        url: documentUrl
      },
      output_format: targetFormat  // pdf, docx, html, txt, odt
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

// Convert DOCX to PDF
const result = await convertDocument(
  apiKey,
  'https://example.com/document.docx',
  'pdf'
);
// Returns: { download_url: '...' }
```

**Compare Documents**:
```http
POST /v1/writer/document/compare
```

**Example - Compare Two Documents**:
```python
# Python
def compare_documents(api_key, doc1_url, doc2_url):
    url = 'https://api.office-integrator.zoho.com/v1/writer/document/compare'
    headers = {
        'Authorization': f'Zoho-oauthtoken {api_key}',
        'Content-Type': 'application/json'
    }
    data = {
        'original': {
            'url': doc1_url
        },
        'modified': {
            'url': doc2_url
        },
        'output_format': 'docx'
    }

    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

---

### 5. Session Management

**Purpose**: Manage editor sessions

**Get Session Info**:
```http
GET /v1/writer/session/{session_id}
```

**Delete Session**:
```http
DELETE /v1/writer/session/{session_id}
```

**Example - Close Editor Session**:
```javascript
// JavaScript/Node.js
const closeSession = async (apiKey, sessionId) => {
  const response = await axios.delete(
    `https://api.office-integrator.zoho.com/v1/writer/session/${sessionId}`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${apiKey}`
      }
    }
  );
  return response.data;
};
```

---

### 6. Collaboration Features

**Purpose**: Enable real-time collaboration

**Example - Enable Co-Editing**:
```javascript
// JavaScript/Node.js
const createCollaborativeSession = async (apiKey, documentData) => {
  const response = await axios.post(
    'https://api.office-integrator.zoho.com/v1/writer/document',
    {
      document: {
        url: documentData.url
      },
      document_info: {
        document_name: documentData.name
      },
      user_info: {
        user_id: documentData.userId,
        display_name: documentData.userName
      },
      permissions: {
        document: {
          edit: true
        },
        collaboration: {
          comments: 'show',
          changes: 'show'
        }
      },
      ui_options: {
        chat_panel: 'show',
        dark_mode: 'show'
      }
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};
```

---

### 7. Webhooks

**Purpose**: Receive document events

**Webhook Events**:
- `document.save` - Document saved
- `document.export` - Document exported
- `session.start` - Session started
- `session.end` - Session ended

**Webhook Payload Example**:
```json
{
  "event": "document.save",
  "session_id": "session_abc123",
  "document_id": "doc_xyz789",
  "user_id": "user123",
  "timestamp": 1704124800000,
  "document_url": "https://example.com/saved-document.docx"
}
```

**Example - Handle Save Webhook**:
```python
# Python Flask example
from flask import Flask, request
import requests

app = Flask(__name__)

@app.route('/api/save-document', methods=['POST'])
def save_document():
    data = request.json
    session_id = data.get('session_id')
    document_url = data.get('document_url')

    # Download the saved document
    doc_response = requests.get(document_url)

    # Save to your storage
    with open(f'documents/{session_id}.docx', 'wb') as f:
        f.write(doc_response.content)

    return {'status': 'success'}, 200
```

---

## Editor Integration

### Full-Featured Integration

```html
<!DOCTYPE html>
<html>
<head>
  <title>Document Editor</title>
  <style>
    body, html { margin: 0; padding: 0; height: 100%; }
    #editor-container { height: 100vh; }
  </style>
</head>
<body>
  <div id="editor-container"></div>

  <script>
    async function initializeEditor() {
      // Get session from your backend
      const response = await fetch('/api/create-editor-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentName: 'My Document',
          userId: 'user123'
        })
      });

      const session = await response.json();

      // Create iframe
      const iframe = document.createElement('iframe');
      iframe.src = session.document_url;
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.frameBorder = '0';

      document.getElementById('editor-container').appendChild(iframe);
    }

    initializeEditor();
  </script>
</body>
</html>
```

### Backend Session Creation

```javascript
// Node.js Express
app.post('/api/create-editor-session', async (req, res) => {
  const { documentName, userId } = req.body;

  const session = await createWriterSession(apiKey, {
    name: documentName,
    content: '<p>Start writing...</p>',
    saveUrl: `${process.env.APP_URL}/api/save-document`,
    userId: userId
  });

  res.json(session);
});
```

---

## Common Operations

### 1. Create Read-Only View

```javascript
// JavaScript/Node.js
const createReadOnlySession = async (apiKey, documentUrl) => {
  const response = await axios.post(
    'https://api.office-integrator.zoho.com/v1/writer/document',
    {
      document: { url: documentUrl },
      permissions: {
        document: {
          edit: false,
          print: true,
          export: true
        }
      },
      ui_options: {
        save_button: 'hide'
      }
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};
```

### 2. Generate PDF Preview

```python
# Python
def generate_pdf_preview(api_key, document_url):
    url = 'https://api.office-integrator.zoho.com/v1/writer/document/convert'
    headers = {
        'Authorization': f'Zoho-oauthtoken {api_key}',
        'Content-Type': 'application/json'
    }
    data = {
        'document': {
            'url': document_url
        },
        'output_format': 'pdf'
    }

    response = requests.post(url, json=data, headers=headers)
    result = response.json()

    return result['download_url']
```

### 3. Extract Document Text

```javascript
// JavaScript/Node.js
const extractText = async (apiKey, documentUrl) => {
  const response = await axios.post(
    'https://api.office-integrator.zoho.com/v1/writer/document/convert',
    {
      document: { url: documentUrl },
      output_format: 'txt'
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );

  // Download the text file
  const textResponse = await axios.get(response.data.download_url);
  return textResponse.data;
};
```

---

## Deluge Integration

### Create Writer Session from Deluge

```javascript
// Deluge Script
documentData = {
  "document": {
    "content": "<h1>Contract Agreement</h1><p>This agreement...</p>",
    "format": "html"
  },
  "document_info": {
    "document_name": "Contract - " + customer_name
  },
  "permissions": {
    "document": {
      "edit": true,
      "print": true
    }
  }
};

response = invokeurl
[
  url: "https://api.office-integrator.zoho.com/v1/writer/document"
  type: POST
  parameters: documentData.toString()
  connection: "zoho_office_integrator"
];

editorUrl = response.get("document_url");
info "Editor URL: " + editorUrl;
```

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 200 | Success | Request completed successfully |
| 400 | Bad Request | Invalid parameters |
| 401 | Unauthorized | Invalid API key or token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Document not found |
| 413 | Payload Too Large | File size exceeds limit |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

**Error Response Format**:
```json
{
  "error": {
    "code": "INVALID_DOCUMENT_URL",
    "message": "The provided document URL is not accessible"
  }
}
```

---

## Best Practices

### 1. Security
- Use HTTPS for all document URLs
- Implement proper access controls
- Validate webhook signatures
- Secure API keys

### 2. Performance
- Cache session data
- Pre-generate document URLs
- Implement timeout handling
- Clean up expired sessions

### 3. User Experience
- Show loading indicators
- Handle errors gracefully
- Provide save notifications
- Implement auto-save

---

## Data Centers

| Region | API Base URL |
|--------|-------------|
| US | `https://api.office-integrator.zoho.com/` |
| EU | `https://api.office-integrator.zoho.eu/` |
| IN | `https://api.office-integrator.zoho.in/` |
| AU | `https://api.office-integrator.zoho.com.au/` |

---

## Additional Resources

- **Official Documentation**: https://www.zoho.com/officeplatform/integrator/api/
- **Developer Console**: https://api-console.zoho.com/
- **SDK Downloads**: https://www.zoho.com/officeplatform/integrator/sdk/
