# Zoho Notebook API Reference

## Overview

Zoho Notebook is a note-taking application for organizing ideas, tasks, and information. The API provides programmatic access to notebooks, notes, tags, and sharing capabilities.

**Current API Version**: v1
**Base URL**: `https://notebook.zoho.com/api/v1/`
**Protocol**: REST
**Data Format**: JSON
**Authentication**: OAuth 2.0

---

## Quick Links

- [Authentication](#authentication)
- [Rate Limits](#rate-limits)
- [API Modules](#api-modules)
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

**Required Scopes**:
- `ZohoNotebook.notebooks.ALL` - Full access to notebooks
- `ZohoNotebook.notebooks.READ` - Read-only access
- `ZohoNotebook.notes.ALL` - Manage notes
- `ZohoNotebook.notes.READ` - Read notes

---

## Rate Limits

- **API Calls**: 3,000 calls per day
- **Burst Limit**: 50 calls per minute
- **File Attachments**: 25 MB per file

---

## API Modules

### 1. Notebooks

**Endpoints**:
```http
GET    /api/v1/notebooks              # List notebooks
GET    /api/v1/notebooks/{notebookId} # Get notebook
POST   /api/v1/notebooks              # Create notebook
PUT    /api/v1/notebooks/{notebookId} # Update notebook
DELETE /api/v1/notebooks/{notebookId} # Delete notebook
```

**Example - List Notebooks**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const listNotebooks = async (accessToken) => {
  const response = await axios.get(
    'https://notebook.zoho.com/api/v1/notebooks',
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
  "notebooks": [
    {
      "notebookId": "1234567890",
      "name": "Project Ideas",
      "color": "#FF6B6B",
      "noteCount": 15,
      "createdTime": "2025-01-15T10:30:00Z",
      "modifiedTime": "2025-01-20T14:45:00Z",
      "isDefault": false,
      "isFavorite": true
    }
  ]
}
```

**Example - Create Notebook**:
```python
# Python
import requests

def create_notebook(access_token, notebook_data):
    url = 'https://notebook.zoho.com/api/v1/notebooks'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'name': notebook_data['name'],
        'color': notebook_data.get('color', '#4A90E2'),
        'description': notebook_data.get('description', '')
    }

    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

---

### 2. Notes

**Endpoints**:
```http
GET    /api/v1/notebooks/{notebookId}/notes           # List notes
GET    /api/v1/notebooks/{notebookId}/notes/{noteId}  # Get note
POST   /api/v1/notebooks/{notebookId}/notes           # Create note
PUT    /api/v1/notebooks/{notebookId}/notes/{noteId}  # Update note
DELETE /api/v1/notebooks/{notebookId}/notes/{noteId}  # Delete note
```

**Note Types**:
- `text` - Text note
- `checklist` - Checklist/todo
- `audio` - Audio recording
- `photo` - Image note
- `sketch` - Drawing/sketch
- `file` - File attachment

**Example - Create Text Note**:
```javascript
// JavaScript/Node.js
const createNote = async (accessToken, notebookId, noteData) => {
  const response = await axios.post(
    `https://notebook.zoho.com/api/v1/notebooks/${notebookId}/notes`,
    {
      title: noteData.title,
      content: noteData.content,
      noteType: 'text',
      tags: noteData.tags || []
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

// Create note
await createNote(accessToken, notebookId, {
  title: 'Meeting Notes',
  content: '<h2>Team Meeting</h2><p>Discussed Q1 objectives...</p>',
  tags: ['meetings', 'q1-2025']
});
```

**Example - Create Checklist**:
```python
# Python
def create_checklist(access_token, notebook_id, checklist_data):
    url = f'https://notebook.zoho.com/api/v1/notebooks/{notebook_id}/notes'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'title': checklist_data['title'],
        'noteType': 'checklist',
        'items': checklist_data['items']
    }

    response = requests.post(url, json=data, headers=headers)
    return response.json()

# Create todo list
create_checklist(access_token, notebook_id, {
    'title': 'Project Tasks',
    'items': [
        {'text': 'Review design mockups', 'completed': False},
        {'text': 'Write API documentation', 'completed': True},
        {'text': 'Schedule team meeting', 'completed': False}
    ]
})
```

**Get Note Response**:
```json
{
  "noteId": "987654321",
  "notebookId": "1234567890",
  "title": "Meeting Notes",
  "content": "<h2>Team Meeting</h2><p>Discussed Q1 objectives...</p>",
  "noteType": "text",
  "tags": ["meetings", "q1-2025"],
  "createdTime": "2025-01-15T10:30:00Z",
  "modifiedTime": "2025-01-15T11:45:00Z",
  "isPinned": false,
  "isFavorite": true,
  "attachments": []
}
```

---

### 3. Tags

**Endpoints**:
```http
GET    /api/v1/tags                    # List all tags
GET    /api/v1/tags/{tagName}/notes    # Get notes by tag
POST   /api/v1/notes/{noteId}/tags     # Add tag to note
DELETE /api/v1/notes/{noteId}/tags/{tagName} # Remove tag
```

**Example - Get Notes by Tag**:
```javascript
// JavaScript/Node.js
const getNotesByTag = async (accessToken, tagName) => {
  const response = await axios.get(
    `https://notebook.zoho.com/api/v1/tags/${encodeURIComponent(tagName)}/notes`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};

// Get all notes tagged "important"
const notes = await getNotesByTag(accessToken, 'important');
```

---

### 4. Search

**Endpoints**:
```http
GET /api/v1/search/notes
```

**Query Parameters**:
- `query` - Search query
- `notebookId` - Limit to notebook
- `tags` - Filter by tags
- `noteType` - Filter by type

**Example - Search Notes**:
```python
# Python
def search_notes(access_token, query, filters=None):
    url = 'https://notebook.zoho.com/api/v1/search/notes'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {'query': query}

    if filters:
        if 'notebookId' in filters:
            params['notebookId'] = filters['notebookId']
        if 'tags' in filters:
            params['tags'] = ','.join(filters['tags'])

    response = requests.get(url, params=params, headers=headers)
    return response.json()

# Search for notes containing "API"
results = search_notes(access_token, 'API', {
    'tags': ['development', 'documentation']
})
```

---

### 5. Attachments

**Endpoints**:
```http
GET    /api/v1/notes/{noteId}/attachments           # List attachments
POST   /api/v1/notes/{noteId}/attachments           # Add attachment
DELETE /api/v1/notes/{noteId}/attachments/{attachId} # Remove attachment
```

**Example - Add Attachment**:
```javascript
// JavaScript/Node.js
const FormData = require('form-data');
const fs = require('fs');

const addAttachment = async (accessToken, noteId, filePath) => {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));

  const response = await axios.post(
    `https://notebook.zoho.com/api/v1/notes/${noteId}/attachments`,
    formData,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        ...formData.getHeaders()
      }
    }
  );
  return response.data;
};
```

---

### 6. Sharing

**Endpoints**:
```http
GET    /api/v1/notebooks/{notebookId}/share    # Get sharing settings
POST   /api/v1/notebooks/{notebookId}/share    # Share notebook
DELETE /api/v1/notebooks/{notebookId}/share/{userId} # Revoke access
```

**Example - Share Notebook**:
```python
# Python
def share_notebook(access_token, notebook_id, share_data):
    url = f'https://notebook.zoho.com/api/v1/notebooks/{notebook_id}/share'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'users': share_data['users'],
        'permission': share_data.get('permission', 'view')  # view, edit
    }

    response = requests.post(url, json=data, headers=headers)
    return response.json()

# Share with team members
share_notebook(access_token, notebook_id, {
    'users': ['user1@example.com', 'user2@example.com'],
    'permission': 'edit'
})
```

---

## Common Operations

### 1. Pin/Unpin Note

```javascript
// JavaScript/Node.js
const pinNote = async (accessToken, notebookId, noteId, isPinned = true) => {
  const response = await axios.put(
    `https://notebook.zoho.com/api/v1/notebooks/${notebookId}/notes/${noteId}`,
    {
      isPinned: isPinned
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

### 2. Move Note to Different Notebook

```python
# Python
def move_note(access_token, note_id, current_notebook_id, target_notebook_id):
    url = f'https://notebook.zoho.com/api/v1/notebooks/{current_notebook_id}/notes/{note_id}/move'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'targetNotebookId': target_notebook_id
    }

    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

### 3. Export Notebook

```javascript
// JavaScript/Node.js
const exportNotebook = async (accessToken, notebookId, format = 'pdf') => {
  const response = await axios.post(
    `https://notebook.zoho.com/api/v1/notebooks/${notebookId}/export`,
    {
      format: format  // pdf, html, markdown
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      },
      responseType: 'arraybuffer'
    }
  );
  return response.data;
};
```

---

## Deluge Integration

### Create Note from Deluge

```javascript
// Deluge Script
notebookId = "1234567890";

noteData = {
  "title": "Customer Feedback - " + customer_name,
  "content": "<p>Feedback: " + feedback_text + "</p>",
  "noteType": "text",
  "tags": ["customer-feedback", "important"]
};

response = invokeurl
[
  url: "https://notebook.zoho.com/api/v1/notebooks/" + notebookId + "/notes"
  type: POST
  parameters: noteData.toString()
  connection: "zoho_notebook"
];

info "Created note: " + response.get("noteId");
```

### Search and Tag Notes

```javascript
// Deluge Script
searchQuery = "project review";

response = invokeurl
[
  url: "https://notebook.zoho.com/api/v1/search/notes?query=" + searchQuery
  type: GET
  connection: "zoho_notebook"
];

notes = response.get("notes");
for each note in notes
{
  noteId = note.get("noteId");

  // Add "reviewed" tag
  tagResponse = invokeurl
  [
    url: "https://notebook.zoho.com/api/v1/notes/" + noteId + "/tags"
    type: POST
    parameters: {"tag": "reviewed"}
    connection: "zoho_notebook"
  ];
}
```

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 200 | Success | Request completed successfully |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid parameters |
| 401 | Unauthorized | Invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

---

## Best Practices

### 1. Organization
- Use descriptive notebook names
- Tag notes consistently
- Archive old notebooks
- Regular backups via API

### 2. Performance
- Batch operations when possible
- Cache notebook structure
- Use search instead of iterating

### 3. Collaboration
- Set appropriate permissions
- Use tags for team coordination
- Regular sync for shared notebooks

---

## Data Centers

| Region | API Base URL |
|--------|-------------|
| US | `https://notebook.zoho.com/api/v1/` |
| EU | `https://notebook.zoho.eu/api/v1/` |
| IN | `https://notebook.zoho.in/api/v1/` |
| AU | `https://notebook.zoho.com.au/api/v1/` |

---

## Additional Resources

- **Official Documentation**: https://www.zoho.com/notebook/help/api/
- **Developer Console**: https://api-console.zoho.com/
