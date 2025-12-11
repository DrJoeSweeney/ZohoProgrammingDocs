# Zoho WorkDrive API Reference

## Overview

Zoho WorkDrive is a cloud-based file storage and collaboration platform designed for teams. The API provides comprehensive access to manage files, folders, team folders, sharing, permissions, and collaboration features programmatically.

**Current API Version**: v1
**Base URL**: `https://www.zohoapis.com/workdrive/api/v1/`
**Protocol**: REST
**Data Format**: JSON
**Authentication**: OAuth 2.0

---

## Quick Links

- [Authentication](#authentication)
- [Files API](#files-api)
- [Folders API](#folders-api)
- [Team Folders API](#team-folders-api)
- [Upload & Download](#upload--download)
- [Sharing & Permissions](#sharing--permissions)
- [Search API](#search-api)
- [Trash Management](#trash-management)
- [Metadata API](#metadata-api)
- [Error Codes](#error-codes)
- [Rate Limits](#rate-limits)
- [Code Examples](#code-examples)

---

## API Categories

### 1. Files API

**Purpose**: Manage individual files - upload, download, update, delete

**Endpoints**:
```http
GET    /api/v1/files/{file_id}                 # Get file metadata
POST   /api/v1/upload                          # Upload file
GET    /api/v1/download/{file_id}              # Download file
PUT    /api/v1/files/{file_id}                 # Update file metadata
DELETE /api/v1/files/{file_id}                 # Delete file (move to trash)
POST   /api/v1/files/{file_id}/copy            # Copy file
POST   /api/v1/files/{file_id}/move            # Move file
POST   /api/v1/files/{file_id}/rename          # Rename file
GET    /api/v1/files/{file_id}/revisions       # Get file revisions
```

**Example - Get File Metadata**:
```http
GET https://www.zohoapis.com/workdrive/api/v1/files/a1b2c3d4e5f6g7h8
Authorization: Zoho-oauthtoken {access_token}
```

**Response**:
```json
{
  "data": {
    "id": "a1b2c3d4e5f6g7h8",
    "attributes": {
      "name": "Project Proposal.pdf",
      "type": "files",
      "size": 2458624,
      "mime_type": "application/pdf",
      "created_time": "2025-01-15T10:30:00+00:00",
      "modified_time": "2025-01-16T14:20:00+00:00",
      "created_by": {
        "id": "user_123",
        "name": "John Doe",
        "email": "john.doe@company.com"
      },
      "parent_id": "folder_456",
      "is_shared": true,
      "permission_type": "edit",
      "storage_info": {
        "resource_id": "resource_789"
      }
    }
  }
}
```

**Example - Get File Metadata with JavaScript**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const getFileMetadata = async (accessToken, fileId) => {
  const response = await axios.get(
    `https://www.zohoapis.com/workdrive/api/v1/files/${fileId}`,
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

### 2. Folders API

**Purpose**: Manage folder structure and organization

**Endpoints**:
```http
GET    /api/v1/folders/{folder_id}             # Get folder details
POST   /api/v1/folders                         # Create folder
PUT    /api/v1/folders/{folder_id}             # Update folder
DELETE /api/v1/folders/{folder_id}             # Delete folder
GET    /api/v1/folders/{folder_id}/files       # List files in folder
POST   /api/v1/folders/{folder_id}/copy        # Copy folder
POST   /api/v1/folders/{folder_id}/move        # Move folder
```

**Example - Create Folder**:
```javascript
const createFolder = async (accessToken, parentId, folderName) => {
  const response = await axios.post(
    'https://www.zohoapis.com/workdrive/api/v1/folders',
    {
      data: {
        attributes: {
          name: folderName,
          parent_id: parentId
        },
        type: 'folders'
      }
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
const newFolder = await createFolder(accessToken, 'parent_folder_id', 'Q1 Reports');
```

**Example - List Folder Contents**:
```python
# Python
import requests

def list_folder_contents(access_token, folder_id, page=1, per_page=50):
    url = f'https://www.zohoapis.com/workdrive/api/v1/folders/{folder_id}/files'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'page': page,
        'per_page': per_page
    }
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Usage
contents = list_folder_contents(access_token, 'folder_123', page=1, per_page=100)
for item in contents['data']:
    print(f"{item['attributes']['type']}: {item['attributes']['name']}")
```

**Folder Contents Response**:
```json
{
  "data": [
    {
      "id": "file_001",
      "type": "files",
      "attributes": {
        "name": "Report.pdf",
        "size": 1024000,
        "created_time": "2025-01-15T10:30:00+00:00"
      }
    },
    {
      "id": "folder_002",
      "type": "folders",
      "attributes": {
        "name": "Subfolder",
        "created_time": "2025-01-14T09:00:00+00:00"
      }
    }
  ],
  "info": {
    "page": 1,
    "per_page": 50,
    "count": 2,
    "has_more": false
  }
}
```

---

### 3. Team Folders API

**Purpose**: Manage team folders and team-level permissions

**Endpoints**:
```http
GET    /api/v1/teamfolders                     # List all team folders
GET    /api/v1/teamfolders/{team_folder_id}    # Get team folder details
POST   /api/v1/teamfolders                     # Create team folder
PUT    /api/v1/teamfolders/{team_folder_id}    # Update team folder
GET    /api/v1/teamfolders/{team_folder_id}/members # Get team members
POST   /api/v1/teamfolders/{team_folder_id}/members # Add team member
DELETE /api/v1/teamfolders/{team_folder_id}/members/{user_id} # Remove member
```

**Example - List Team Folders**:
```javascript
const listTeamFolders = async (accessToken) => {
  const response = await axios.get(
    'https://www.zohoapis.com/workdrive/api/v1/teamfolders',
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

**Team Folder Response**:
```json
{
  "data": [
    {
      "id": "tf_123",
      "type": "teamfolders",
      "attributes": {
        "name": "Marketing Team",
        "description": "Marketing department files",
        "created_time": "2024-12-01T10:00:00+00:00",
        "members_count": 12,
        "storage_used": 5368709120,
        "storage_limit": 107374182400
      }
    }
  ]
}
```

**Example - Create Team Folder**:
```python
def create_team_folder(access_token, name, description):
    url = 'https://www.zohoapis.com/workdrive/api/v1/teamfolders'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'data': {
            'type': 'teamfolders',
            'attributes': {
                'name': name,
                'description': description
            }
        }
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()

# Usage
team_folder = create_team_folder(
    access_token,
    'Product Development',
    'Shared space for product development team'
)
```

**Example - Add Team Member**:
```python
def add_team_member(access_token, team_folder_id, email, role='member'):
    url = f'https://www.zohoapis.com/workdrive/api/v1/teamfolders/{team_folder_id}/members'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'data': {
            'type': 'members',
            'attributes': {
                'email': email,
                'role': role  # 'admin', 'member', or 'viewer'
            }
        }
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()

# Add member with admin role
add_team_member(access_token, 'tf_123', 'jane.smith@company.com', 'admin')
```

---

### 4. Upload & Download

**Purpose**: Upload new files and download existing files

**Upload Endpoint**:
```http
POST   /api/v1/upload                          # Upload file
```

**Download Endpoint**:
```http
GET    /api/v1/download/{file_id}              # Download file
```

**Example - Upload File**:
```javascript
const FormData = require('form-data');
const fs = require('fs');

const uploadFile = async (accessToken, parentId, filePath) => {
  const form = new FormData();
  const fileName = filePath.split('/').pop();

  form.append('filename', fileName);
  form.append('parent_id', parentId);
  form.append('content', fs.createReadStream(filePath));
  form.append('override-name-exist', 'true');

  const response = await axios.post(
    'https://www.zohoapis.com/workdrive/api/v1/upload',
    form,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        ...form.getHeaders()
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    }
  );

  return response.data;
};

// Usage
const uploadedFile = await uploadFile(
  accessToken,
  'folder_456',
  './documents/report.pdf'
);
console.log('Uploaded file ID:', uploadedFile.data.id);
```

**Example - Upload with Python**:
```python
def upload_file(access_token, parent_id, file_path):
    url = 'https://www.zohoapis.com/workdrive/api/v1/upload'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }

    with open(file_path, 'rb') as file:
        files = {
            'content': file
        }
        data = {
            'filename': os.path.basename(file_path),
            'parent_id': parent_id,
            'override-name-exist': 'true'
        }
        response = requests.post(url, headers=headers, files=files, data=data)

    return response.json()

# Usage
import os
uploaded = upload_file(access_token, 'folder_456', './documents/presentation.pptx')
print(f"File uploaded: {uploaded['data']['attributes']['name']}")
```

**Example - Download File**:
```javascript
const downloadFile = async (accessToken, fileId, savePath) => {
  const response = await axios.get(
    `https://www.zohoapis.com/workdrive/api/v1/download/${fileId}`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      },
      responseType: 'stream'
    }
  );

  const writer = fs.createWriteStream(savePath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

// Usage
await downloadFile(accessToken, 'file_123', './downloads/report.pdf');
```

**Example - Download with Python**:
```python
def download_file(access_token, file_id, save_path):
    url = f'https://www.zohoapis.com/workdrive/api/v1/download/{file_id}'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    response = requests.get(url, headers=headers, stream=True)

    with open(save_path, 'wb') as file:
        for chunk in response.iter_content(chunk_size=8192):
            file.write(chunk)

    return save_path

# Usage
download_file(access_token, 'file_123', './downloads/document.pdf')
```

**Example - Bulk Upload with Deluge**:
```deluge
// Deluge - Upload multiple files to WorkDrive
void uploadFilesToWorkDrive(string folderId, list fileList)
{
    for each filePath in fileList
    {
        // Read file content
        file_content = zoho.encryption.base64Encode(filePath);

        // Upload to WorkDrive
        upload_response = invokeurl
        [
            url: "https://www.zohoapis.com/workdrive/api/v1/upload"
            type: POST
            files: file_content
            parameters: {
                "parent_id": folderId,
                "filename": filePath.getSuffix("/"),
                "override-name-exist": "true"
            }
            headers: {"Authorization": "Zoho-oauthtoken " + zoho.oauth.getToken("zoho_workdrive")}
            connection: "zoho_workdrive"
        ];

        if (upload_response.get("data") != null)
        {
            file_id = upload_response.get("data").get("id");
            info "File uploaded: " + filePath + " -> " + file_id;
        }
        else
        {
            info "Upload failed: " + filePath;
        }
    }
}
```

---

### 5. Sharing & Permissions

**Purpose**: Manage file and folder sharing and access permissions

**Endpoints**:
```http
POST   /api/v1/files/{file_id}/share           # Share file
POST   /api/v1/folders/{folder_id}/share       # Share folder
GET    /api/v1/files/{file_id}/permissions     # Get file permissions
PUT    /api/v1/files/{file_id}/permissions/{permission_id} # Update permission
DELETE /api/v1/files/{file_id}/permissions/{permission_id} # Remove permission
POST   /api/v1/files/{file_id}/publiclink      # Create public link
DELETE /api/v1/files/{file_id}/publiclink      # Remove public link
```

**Permission Roles**:
- `read` - View only
- `edit` - View and edit
- `comment` - View and comment
- `organize` - Full control (move, delete, share)

**Example - Share File with User**:
```javascript
const shareFile = async (accessToken, fileId, userEmail, role = 'read') => {
  const response = await axios.post(
    `https://www.zohoapis.com/workdrive/api/v1/files/${fileId}/share`,
    {
      data: {
        type: 'permissions',
        attributes: {
          email: userEmail,
          role: role,
          notify: true,
          message: 'Sharing this file with you for review'
        }
      }
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

// Share with edit permissions
await shareFile(accessToken, 'file_123', 'colleague@company.com', 'edit');
```

**Example - Create Public Link**:
```python
def create_public_link(access_token, file_id, expiry_date=None, password=None):
    url = f'https://www.zohoapis.com/workdrive/api/v1/files/{file_id}/publiclink'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'data': {
            'type': 'links',
            'attributes': {
                'link_type': 'public'
            }
        }
    }

    if expiry_date:
        data['data']['attributes']['expiry_date'] = expiry_date
    if password:
        data['data']['attributes']['password'] = password

    response = requests.post(url, json=data, headers=headers)
    return response.json()

# Create public link with 7-day expiration
from datetime import datetime, timedelta
expiry = (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%dT%H:%M:%S+00:00')
link = create_public_link(access_token, 'file_123', expiry_date=expiry)
print(f"Public link: {link['data']['attributes']['link']}")
```

**Example - Get File Permissions**:
```javascript
const getFilePermissions = async (accessToken, fileId) => {
  const response = await axios.get(
    `https://www.zohoapis.com/workdrive/api/v1/files/${fileId}/permissions`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};

// List all users with access
const permissions = await getFilePermissions(accessToken, 'file_123');
permissions.data.forEach(perm => {
  console.log(`${perm.attributes.email}: ${perm.attributes.role}`);
});
```

**Permissions Response**:
```json
{
  "data": [
    {
      "id": "perm_001",
      "type": "permissions",
      "attributes": {
        "email": "john.doe@company.com",
        "role": "organize",
        "user_id": "user_123",
        "granted_time": "2025-01-15T10:30:00+00:00"
      }
    },
    {
      "id": "perm_002",
      "type": "permissions",
      "attributes": {
        "email": "jane.smith@company.com",
        "role": "edit",
        "user_id": "user_456",
        "granted_time": "2025-01-16T14:20:00+00:00"
      }
    }
  ]
}
```

---

### 6. Search API

**Purpose**: Search for files and folders

**Endpoints**:
```http
GET    /api/v1/search                          # Search files and folders
```

**Search Parameters**:
- `query` - Search term
- `type` - Filter by type (`files`, `folders`)
- `parent_id` - Search within specific folder
- `page` - Page number
- `per_page` - Results per page

**Example - Search Files**:
```javascript
const searchFiles = async (accessToken, query, options = {}) => {
  const response = await axios.get(
    'https://www.zohoapis.com/workdrive/api/v1/search',
    {
      params: {
        query: query,
        type: options.type || 'files',
        parent_id: options.parentId,
        page: options.page || 1,
        per_page: options.perPage || 50
      },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};

// Search for PDF files
const results = await searchFiles(accessToken, 'report', {
  type: 'files',
  perPage: 100
});

results.data.forEach(file => {
  console.log(`${file.attributes.name} (${file.attributes.size} bytes)`);
});
```

**Example - Advanced Search with Python**:
```python
def search_files_advanced(access_token, query, file_type=None, modified_after=None):
    url = 'https://www.zohoapis.com/workdrive/api/v1/search'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'query': query,
        'type': 'files',
        'per_page': 100
    }

    response = requests.get(url, headers=headers, params=params)
    results = response.json()

    # Client-side filtering
    filtered_results = []
    for item in results.get('data', []):
        attrs = item['attributes']

        # Filter by file type
        if file_type and not attrs['name'].endswith(file_type):
            continue

        # Filter by modification date
        if modified_after:
            mod_time = datetime.fromisoformat(attrs['modified_time'].replace('Z', '+00:00'))
            if mod_time < modified_after:
                continue

        filtered_results.append(item)

    return filtered_results

# Search for Excel files modified in last 7 days
from datetime import datetime, timedelta
week_ago = datetime.now() - timedelta(days=7)
excel_files = search_files_advanced(
    access_token,
    'budget',
    file_type='.xlsx',
    modified_after=week_ago
)
```

---

### 7. Trash Management

**Purpose**: Manage deleted files and folders

**Endpoints**:
```http
GET    /api/v1/trash                           # List trash items
POST   /api/v1/trash/{item_id}/restore         # Restore from trash
DELETE /api/v1/trash/{item_id}                 # Permanently delete
DELETE /api/v1/trash                           # Empty trash
```

**Example - List Trash Items**:
```javascript
const listTrashItems = async (accessToken) => {
  const response = await axios.get(
    'https://www.zohoapis.com/workdrive/api/v1/trash',
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

**Example - Restore from Trash**:
```python
def restore_from_trash(access_token, item_id):
    url = f'https://www.zohoapis.com/workdrive/api/v1/trash/{item_id}/restore'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    response = requests.post(url, headers=headers)
    return response.json()

# Restore file
restore_from_trash(access_token, 'file_123')
```

---

### 8. Metadata API

**Purpose**: Get file metadata and properties

**Example - Get Extended Metadata**:
```javascript
const getFileMetadataExtended = async (accessToken, fileId) => {
  const response = await axios.get(
    `https://www.zohoapis.com/workdrive/api/v1/files/${fileId}`,
    {
      params: {
        fields: 'all'
      },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

---

## Authentication

### OAuth 2.0 Flow

**Step 1: Register Application**
- Go to [Zoho API Console](https://api-console.zoho.com/)
- Register application
- Note Client ID and Client Secret

**Step 2: Authorization URL**
```http
GET https://accounts.zoho.com/oauth/v2/auth?
  scope=WorkDrive.files.ALL,WorkDrive.teamfolders.ALL&
  client_id={client_id}&
  response_type=code&
  access_type=offline&
  redirect_uri={redirect_uri}
```

**Available Scopes**:
- `WorkDrive.files.ALL` - Full access to files
- `WorkDrive.files.READ` - Read-only access to files
- `WorkDrive.files.CREATE` - Create files
- `WorkDrive.files.UPDATE` - Update files
- `WorkDrive.files.DELETE` - Delete files
- `WorkDrive.folders.ALL` - Full access to folders
- `WorkDrive.teamfolders.ALL` - Full access to team folders
- `WorkDrive.workspace.ALL` - Full workspace access

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
  "api_domain": "https://www.zohoapis.com",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

**Step 4: Refresh Token**
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

| Plan | API Calls per Day | API Calls per Minute | Upload Size Limit |
|------|-------------------|----------------------|-------------------|
| Free | 5,000 | 20 | 50 MB |
| Standard | 25,000 | 100 | 500 MB |
| Professional | 50,000 | 200 | 1 GB |
| Enterprise | 100,000 | 500 | 5 GB |

### Additional Limits
- Maximum 100 items per page in list operations
- Maximum file size: 5 GB (Enterprise)
- Maximum folder depth: 20 levels
- Maximum concurrent uploads: 5

### Rate Limit Headers
```http
X-RateLimit-Limit: 25000
X-RateLimit-Remaining: 24850
X-RateLimit-Reset: 1642147200
```

---

## Error Codes

| HTTP Status | Error Code | Description | Solution |
|-------------|------------|-------------|----------|
| 400 | INVALID_REQUEST | Invalid request format | Check request parameters |
| 400 | INVALID_INPUT | Invalid input data | Validate input data |
| 401 | INVALID_TOKEN | Invalid or expired token | Refresh access token |
| 401 | INSUFFICIENT_SCOPE | Missing required scope | Update OAuth scopes |
| 403 | ACCESS_DENIED | Insufficient permissions | Check user permissions |
| 404 | RESOURCE_NOT_FOUND | File or folder not found | Verify resource ID |
| 409 | DUPLICATE_NAME | Name already exists | Use different name or override |
| 413 | FILE_TOO_LARGE | File exceeds size limit | Reduce file size |
| 422 | STORAGE_EXCEEDED | Storage limit exceeded | Free up space or upgrade |
| 429 | RATE_LIMIT_EXCEEDED | Too many requests | Implement rate limiting |
| 500 | INTERNAL_ERROR | Server error | Retry with exponential backoff |
| 503 | SERVICE_UNAVAILABLE | Service temporarily unavailable | Retry after delay |

**Error Response Format**:
```json
{
  "errors": [
    {
      "code": "RESOURCE_NOT_FOUND",
      "message": "The requested file does not exist",
      "details": {
        "resource_id": "file_123"
      }
    }
  ]
}
```

---

## Code Examples

### Complete WorkDrive Integration

```javascript
// JavaScript/Node.js - WorkDrive Manager
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

class ZohoWorkDriveClient {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseURL = 'https://www.zohoapis.com/workdrive/api/v1';
  }

  async request(method, endpoint, data = null, isFormData = false, isDownload = false) {
    const config = {
      method,
      url: `${this.baseURL}${endpoint}`,
      headers: {
        'Authorization': `Zoho-oauthtoken ${this.accessToken}`
      }
    };

    if (isDownload) {
      config.responseType = 'stream';
    }

    if (data) {
      if (isFormData) {
        config.headers = { ...config.headers, ...data.getHeaders() };
        config.data = data;
        config.maxContentLength = Infinity;
        config.maxBodyLength = Infinity;
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
      return response;
    } catch (error) {
      this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      const errorData = error.response.data;
      console.error(`API Error:`, errorData);
      throw new Error(errorData.errors?.[0]?.message || 'API Error');
    }
    throw error;
  }

  // Files
  async getFileMetadata(fileId) {
    const response = await this.request('GET', `/files/${fileId}`);
    return response.data;
  }

  async uploadFile(parentId, filePath, overrideExisting = true) {
    const form = new FormData();
    const fileName = path.basename(filePath);

    form.append('filename', fileName);
    form.append('parent_id', parentId);
    form.append('content', fs.createReadStream(filePath));
    form.append('override-name-exist', overrideExisting.toString());

    const response = await this.request('POST', '/upload', form, true);
    return response.data;
  }

  async downloadFile(fileId, savePath) {
    const response = await this.request('GET', `/download/${fileId}`, null, false, true);
    const writer = fs.createWriteStream(savePath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(savePath));
      writer.on('error', reject);
    });
  }

  async deleteFile(fileId) {
    const response = await this.request('DELETE', `/files/${fileId}`);
    return response.data;
  }

  async moveFile(fileId, newParentId) {
    const response = await this.request('POST', `/files/${fileId}/move`, {
      data: {
        type: 'files',
        attributes: {
          parent_id: newParentId
        }
      }
    });
    return response.data;
  }

  async copyFile(fileId, newParentId, newName = null) {
    const data = {
      data: {
        type: 'files',
        attributes: {
          parent_id: newParentId
        }
      }
    };
    if (newName) {
      data.data.attributes.name = newName;
    }
    const response = await this.request('POST', `/files/${fileId}/copy`, data);
    return response.data;
  }

  // Folders
  async createFolder(parentId, folderName) {
    const response = await this.request('POST', '/folders', {
      data: {
        type: 'folders',
        attributes: {
          name: folderName,
          parent_id: parentId
        }
      }
    });
    return response.data;
  }

  async listFolderContents(folderId, page = 1, perPage = 50) {
    const response = await this.request('GET', `/folders/${folderId}/files`, {
      page,
      per_page: perPage
    });
    return response.data;
  }

  async getAllFolderContents(folderId) {
    const allItems = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await this.listFolderContents(folderId, page, 100);
      allItems.push(...response.data);

      if (response.info.has_more) {
        page++;
      } else {
        hasMore = false;
      }
    }

    return allItems;
  }

  // Team Folders
  async listTeamFolders() {
    const response = await this.request('GET', '/teamfolders');
    return response.data;
  }

  async createTeamFolder(name, description) {
    const response = await this.request('POST', '/teamfolders', {
      data: {
        type: 'teamfolders',
        attributes: {
          name,
          description
        }
      }
    });
    return response.data;
  }

  async addTeamMember(teamFolderId, email, role = 'member') {
    const response = await this.request('POST', `/teamfolders/${teamFolderId}/members`, {
      data: {
        type: 'members',
        attributes: {
          email,
          role
        }
      }
    });
    return response.data;
  }

  // Sharing
  async shareFile(fileId, email, role = 'read', notify = true, message = null) {
    const data = {
      data: {
        type: 'permissions',
        attributes: {
          email,
          role,
          notify
        }
      }
    };
    if (message) {
      data.data.attributes.message = message;
    }
    const response = await this.request('POST', `/files/${fileId}/share`, data);
    return response.data;
  }

  async createPublicLink(fileId, expiryDate = null, password = null) {
    const data = {
      data: {
        type: 'links',
        attributes: {
          link_type: 'public'
        }
      }
    };
    if (expiryDate) {
      data.data.attributes.expiry_date = expiryDate;
    }
    if (password) {
      data.data.attributes.password = password;
    }
    const response = await this.request('POST', `/files/${fileId}/publiclink`, data);
    return response.data;
  }

  async getFilePermissions(fileId) {
    const response = await this.request('GET', `/files/${fileId}/permissions`);
    return response.data;
  }

  // Search
  async search(query, type = 'files', page = 1, perPage = 50) {
    const response = await this.request('GET', '/search', {
      query,
      type,
      page,
      per_page: perPage
    });
    return response.data;
  }

  // Bulk operations
  async bulkUpload(parentId, filePaths) {
    const results = [];
    for (const filePath of filePaths) {
      try {
        const result = await this.uploadFile(parentId, filePath);
        results.push({ success: true, file: filePath, data: result });
      } catch (error) {
        results.push({ success: false, file: filePath, error: error.message });
      }
    }
    return results;
  }

  async syncFolder(localPath, workdriveFolderId) {
    const results = {
      uploaded: 0,
      skipped: 0,
      errors: []
    };

    // Get existing files in WorkDrive folder
    const existingFiles = await this.getAllFolderContents(workdriveFolderId);
    const existingNames = new Set(existingFiles.map(f => f.attributes.name));

    // Get local files
    const localFiles = fs.readdirSync(localPath).filter(f =>
      fs.statSync(path.join(localPath, f)).isFile()
    );

    for (const file of localFiles) {
      try {
        if (existingNames.has(file)) {
          results.skipped++;
          console.log(`Skipped (exists): ${file}`);
        } else {
          await this.uploadFile(workdriveFolderId, path.join(localPath, file));
          results.uploaded++;
          console.log(`Uploaded: ${file}`);
        }
      } catch (error) {
        results.errors.push({ file, error: error.message });
      }
    }

    return results;
  }
}

// Usage Example
(async () => {
  const client = new ZohoWorkDriveClient('your_access_token');

  // List team folders
  const teamFolders = await client.listTeamFolders();
  console.log('Team Folders:', teamFolders.data.length);

  // Create folder structure
  const projectFolder = await client.createFolder('parent_id', 'Q1 2025 Project');
  const projectFolderId = projectFolder.data.id;

  const subfolders = ['Documents', 'Images', 'Reports'];
  for (const name of subfolders) {
    await client.createFolder(projectFolderId, name);
  }

  // Upload files
  const uploadResults = await client.bulkUpload(projectFolderId, [
    './files/report1.pdf',
    './files/report2.pdf',
    './files/presentation.pptx'
  ]);
  console.log(`Uploaded ${uploadResults.filter(r => r.success).length} files`);

  // Share file
  const fileId = uploadResults[0].data.data.id;
  await client.shareFile(fileId, 'colleague@company.com', 'edit', true, 'Please review this report');

  // Create public link
  const link = await client.createPublicLink(fileId);
  console.log('Public link:', link.data.attributes.link);

  // Search files
  const searchResults = await client.search('report', 'files');
  console.log(`Found ${searchResults.data.length} files`);

  // Download file
  await client.downloadFile(fileId, './downloads/report.pdf');
  console.log('File downloaded');
})();
```

### Python Complete Example

```python
# Python - WorkDrive Complete Integration
import requests
import os
from typing import List, Dict, Optional
from datetime import datetime, timedelta

class ZohoWorkDriveManager:
    def __init__(self, access_token: str):
        self.access_token = access_token
        self.base_url = 'https://www.zohoapis.com/workdrive/api/v1'
        self.headers = {
            'Authorization': f'Zoho-oauthtoken {access_token}'
        }

    def _request(self, method: str, endpoint: str, data: Optional[Dict] = None,
                files: Optional[Dict] = None, params: Optional[Dict] = None,
                stream: bool = False) -> requests.Response:
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
            headers=headers,
            stream=stream
        )

        if response.status_code >= 400 and not stream:
            error_data = response.json()
            raise Exception(f"API Error: {error_data.get('errors', [{}])[0].get('message')}")

        return response

    # Files
    def get_file_metadata(self, file_id: str) -> Dict:
        response = self._request('GET', f'/files/{file_id}')
        return response.json()

    def upload_file(self, parent_id: str, file_path: str, override_existing: bool = True) -> Dict:
        with open(file_path, 'rb') as file:
            files = {'content': file}
            data = {
                'filename': os.path.basename(file_path),
                'parent_id': parent_id,
                'override-name-exist': str(override_existing).lower()
            }
            response = self._request('POST', '/upload', data=data, files=files)

        return response.json()

    def download_file(self, file_id: str, save_path: str) -> str:
        response = self._request('GET', f'/download/{file_id}', stream=True)

        with open(save_path, 'wb') as file:
            for chunk in response.iter_content(chunk_size=8192):
                file.write(chunk)

        return save_path

    def delete_file(self, file_id: str) -> Dict:
        response = self._request('DELETE', f'/files/{file_id}')
        return response.json()

    def move_file(self, file_id: str, new_parent_id: str) -> Dict:
        data = {
            'data': {
                'type': 'files',
                'attributes': {
                    'parent_id': new_parent_id
                }
            }
        }
        response = self._request('POST', f'/files/{file_id}/move', data=data)
        return response.json()

    # Folders
    def create_folder(self, parent_id: str, folder_name: str) -> Dict:
        data = {
            'data': {
                'type': 'folders',
                'attributes': {
                    'name': folder_name,
                    'parent_id': parent_id
                }
            }
        }
        response = self._request('POST', '/folders', data=data)
        return response.json()

    def list_folder_contents(self, folder_id: str, page: int = 1, per_page: int = 50) -> Dict:
        params = {
            'page': page,
            'per_page': per_page
        }
        response = self._request('GET', f'/folders/{folder_id}/files', params=params)
        return response.json()

    def get_all_folder_contents(self, folder_id: str) -> List[Dict]:
        all_items = []
        page = 1
        has_more = True

        while has_more:
            response = self.list_folder_contents(folder_id, page, 100)
            all_items.extend(response.get('data', []))

            if response.get('info', {}).get('has_more'):
                page += 1
            else:
                has_more = False

        return all_items

    # Team Folders
    def list_team_folders(self) -> List[Dict]:
        response = self._request('GET', '/teamfolders')
        return response.json().get('data', [])

    def create_team_folder(self, name: str, description: str) -> Dict:
        data = {
            'data': {
                'type': 'teamfolders',
                'attributes': {
                    'name': name,
                    'description': description
                }
            }
        }
        response = self._request('POST', '/teamfolders', data=data)
        return response.json()

    # Sharing
    def share_file(self, file_id: str, email: str, role: str = 'read',
                  notify: bool = True, message: str = None) -> Dict:
        data = {
            'data': {
                'type': 'permissions',
                'attributes': {
                    'email': email,
                    'role': role,
                    'notify': notify
                }
            }
        }
        if message:
            data['data']['attributes']['message'] = message

        response = self._request('POST', f'/files/{file_id}/share', data=data)
        return response.json()

    def create_public_link(self, file_id: str, days_valid: int = 7) -> Dict:
        expiry = (datetime.now() + timedelta(days=days_valid)).isoformat() + 'Z'
        data = {
            'data': {
                'type': 'links',
                'attributes': {
                    'link_type': 'public',
                    'expiry_date': expiry
                }
            }
        }
        response = self._request('POST', f'/files/{file_id}/publiclink', data=data)
        return response.json()

    # Search
    def search(self, query: str, type: str = 'files') -> List[Dict]:
        params = {
            'query': query,
            'type': type,
            'per_page': 100
        }
        response = self._request('GET', '/search', params=params)
        return response.json().get('data', [])

    # Bulk operations
    def bulk_upload(self, parent_id: str, file_paths: List[str]) -> Dict:
        results = {
            'success': 0,
            'failed': 0,
            'errors': []
        }

        for file_path in file_paths:
            try:
                self.upload_file(parent_id, file_path)
                results['success'] += 1
                print(f"Uploaded: {os.path.basename(file_path)}")
            except Exception as e:
                results['failed'] += 1
                results['errors'].append({
                    'file': file_path,
                    'error': str(e)
                })

        return results

    def sync_local_folder(self, local_path: str, workdrive_folder_id: str) -> Dict:
        results = {
            'uploaded': 0,
            'skipped': 0,
            'errors': []
        }

        # Get existing files
        existing_files = self.get_all_folder_contents(workdrive_folder_id)
        existing_names = {f['attributes']['name'] for f in existing_files}

        # Upload new files
        for filename in os.listdir(local_path):
            file_path = os.path.join(local_path, filename)

            if not os.path.isfile(file_path):
                continue

            if filename in existing_names:
                results['skipped'] += 1
                print(f"Skipped (exists): {filename}")
            else:
                try:
                    self.upload_file(workdrive_folder_id, file_path)
                    results['uploaded'] += 1
                    print(f"Uploaded: {filename}")
                except Exception as e:
                    results['errors'].append({
                        'file': filename,
                        'error': str(e)
                    })

        return results

# Usage Example
if __name__ == '__main__':
    manager = ZohoWorkDriveManager('your_access_token')

    # Create project structure
    team_folders = manager.list_team_folders()
    if team_folders:
        team_folder_id = team_folders[0]['id']

        # Create main project folder
        project = manager.create_folder(team_folder_id, 'Q1 2025 Marketing Campaign')
        project_id = project['data']['id']

        # Create subfolders
        subfolders = ['Assets', 'Documents', 'Reports', 'Presentations']
        for name in subfolders:
            manager.create_folder(project_id, name)

        print(f"Created project structure with {len(subfolders)} subfolders")

    # Upload files
    files_to_upload = [
        './files/campaign_brief.pdf',
        './files/budget.xlsx',
        './files/timeline.pdf'
    ]

    if os.path.exists('./files'):
        upload_results = manager.bulk_upload(project_id, files_to_upload)
        print(f"Upload results: {upload_results['success']} successful, {upload_results['failed']} failed")

    # Share with team
    contents = manager.get_all_folder_contents(project_id)
    for item in contents:
        if item['type'] == 'files':
            manager.share_file(
                item['id'],
                'team@company.com',
                'edit',
                message='Shared project file'
            )

    # Search and download
    search_results = manager.search('budget', 'files')
    if search_results:
        file_id = search_results[0]['id']
        manager.download_file(file_id, './downloads/budget.xlsx')
        print('File downloaded')
```

### Deluge Integration Example

```deluge
// Deluge - WorkDrive Integration with Creator/CRM

// Function to upload CRM attachment to WorkDrive
void uploadCRMAttachmentToWorkDrive(string recordId, string moduleName, string workdriveFolderId)
{
    // Get CRM record with attachments
    record = zoho.crm.getRecordById(moduleName, recordId);

    // Get attachments
    attachments = zoho.crm.getRelatedRecords("Attachments", moduleName, recordId);

    for each attachment in attachments
    {
        // Download from CRM
        file_content = invokeurl
        [
            url: attachment.get("$file_id")
            type: GET
            connection: "crm"
        ];

        // Upload to WorkDrive
        upload_response = invokeurl
        [
            url: "https://www.zohoapis.com/workdrive/api/v1/upload"
            type: POST
            files: file_content
            parameters: {
                "parent_id": workdriveFolderId,
                "filename": attachment.get("File_Name"),
                "override-name-exist": "true"
            }
            headers: {"Authorization": "Zoho-oauthtoken " + zoho.oauth.getToken("zoho_workdrive")}
            connection: "zoho_workdrive"
        ];

        if (upload_response.get("data") != null)
        {
            file_id = upload_response.get("data").get("id");
            info "Uploaded to WorkDrive: " + attachment.get("File_Name") + " -> " + file_id;

            // Update CRM record with WorkDrive link
            update_map = {"WorkDrive_File_ID": file_id};
            zoho.crm.updateRecord(moduleName, recordId, update_map);
        }
    }
}

// Function to create team folder for new project
void createProjectWorkspace(string projectName, string projectId, list teamEmails)
{
    // Create team folder
    team_folder_data = {
        "data": {
            "type": "teamfolders",
            "attributes": {
                "name": projectName,
                "description": "Workspace for project: " + projectName
            }
        }
    };

    folder_response = invokeurl
    [
        url: "https://www.zohoapis.com/workdrive/api/v1/teamfolders"
        type: POST
        parameters: team_folder_data.toString()
        headers: {"Authorization": "Zoho-oauthtoken " + zoho.oauth.getToken("zoho_workdrive")}
        connection: "zoho_workdrive"
    ];

    if (folder_response.get("data") != null)
    {
        team_folder_id = folder_response.get("data").get("id");

        // Create subfolders
        subfolders = ["Documents", "Deliverables", "Resources", "Archive"];
        for each subfolder in subfolders
        {
            subfolder_data = {
                "data": {
                    "type": "folders",
                    "attributes": {
                        "name": subfolder,
                        "parent_id": team_folder_id
                    }
                }
            };

            invokeurl
            [
                url: "https://www.zohoapis.com/workdrive/api/v1/folders"
                type: POST
                parameters: subfolder_data.toString()
                headers: {"Authorization": "Zoho-oauthtoken " + zoho.oauth.getToken("zoho_workdrive")}
                connection: "zoho_workdrive"
            ];
        }

        // Add team members
        for each email in teamEmails
        {
            member_data = {
                "data": {
                    "type": "members",
                    "attributes": {
                        "email": email,
                        "role": "member"
                    }
                }
            };

            invokeurl
            [
                url: "https://www.zohoapis.com/workdrive/api/v1/teamfolders/" + team_folder_id + "/members"
                type: POST
                parameters: member_data.toString()
                headers: {"Authorization": "Zoho-oauthtoken " + zoho.oauth.getToken("zoho_workdrive")}
                connection: "zoho_workdrive"
            ];
        }

        info "Project workspace created: " + team_folder_id;
    }
}

// Scheduled function to backup Creator data to WorkDrive
void backupCreatorDataToWorkDrive()
{
    // Get all records from Creator form
    records = Customer_Sales[ID != 0];

    // Create CSV content
    csv_content = "ID,Customer Name,Deal Value,Status,Date\n";

    for each record in records
    {
        csv_content = csv_content + record.ID + "," + record.Customer_Name + "," + record.Deal_Value + "," + record.Status + "," + record.Date_field + "\n";
    }

    // Upload to WorkDrive
    backup_filename = "Creator_Backup_" + zoho.currentdate.toString("yyyy-MM-dd") + ".csv";

    upload_response = invokeurl
    [
        url: "https://www.zohoapis.com/workdrive/api/v1/upload"
        type: POST
        files: csv_content
        parameters: {
            "parent_id": "backup_folder_id",
            "filename": backup_filename,
            "override-name-exist": "true"
        }
        headers: {"Authorization": "Zoho-oauthtoken " + zoho.oauth.getToken("zoho_workdrive")}
        connection: "zoho_workdrive"
    ];

    info "Backup created: " + backup_filename;
}
```

---

## Best Practices

### 1. File Management
- Use descriptive file and folder names
- Organize files into logical folder structures
- Implement consistent naming conventions
- Archive old files periodically
- Use team folders for collaborative work

### 2. Performance Optimization
- Implement pagination for large file lists
- Use batch operations when possible
- Cache file metadata when appropriate
- Implement parallel uploads for multiple files
- Use streaming for large file downloads

### 3. Security
- Store access tokens securely
- Implement proper permission controls
- Use expiring public links
- Regularly audit file sharing
- Encrypt sensitive files before upload

### 4. Error Handling
- Implement retry logic with exponential backoff
- Handle network timeouts gracefully
- Validate file sizes before upload
- Check storage limits before operations
- Log all errors for debugging

### 5. Collaboration
- Set appropriate permission levels
- Use team folders for departmental files
- Notify users when sharing files
- Document folder structures
- Implement file naming standards

### 6. Storage Management
- Monitor storage usage
- Clean up trash regularly
- Archive completed projects
- Compress large files when possible
- Use external storage for backups

---

## Data Centers

| Data Center | Base URL |
|-------------|----------|
| US | https://www.zohoapis.com |
| EU | https://www.zohoapis.eu |
| IN | https://www.zohoapis.in |
| AU | https://www.zohoapis.com.au |
| JP | https://www.zohoapis.jp |
| CA | https://www.zohoapis.ca |

---

## Additional Resources

- [Official Zoho WorkDrive API Documentation](https://www.zoho.com/workdrive/api/)
- [WorkDrive Help Documentation](https://www.zoho.com/workdrive/help/)
- [API Postman Collection](https://www.postman.com/zoho)
- [Developer Community](https://help.zoho.com/portal/en/community/workdrive)
- [WorkDrive Blog](https://www.zoho.com/workdrive/blog/)

---

**Last Updated**: December 2025
**API Version**: v1
