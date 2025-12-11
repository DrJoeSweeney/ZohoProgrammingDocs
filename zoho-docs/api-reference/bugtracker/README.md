# Zoho BugTracker API Reference

## Overview

Zoho BugTracker is a comprehensive bug tracking and project management solution designed for development teams. The API provides programmatic access to projects, bugs, portals, users, and all bug tracking functionality.

**Current API Version**: v3
**Base URL**: `https://bugtracker.zoho.com/api/v3/`
**Protocol**: REST
**Data Format**: JSON, XML
**Authentication**: OAuth 2.0

---

## Quick Links

- [Authentication](#authentication)
- [Rate Limits](#rate-limits)
- [API Modules](#api-modules)
- [Common Operations](#common-operations)
- [Error Codes](#error-codes)
- [Code Examples](#code-examples)
- [Best Practices](#best-practices)

---

## API Modules

### 1. Projects
**Purpose**: Manage bug tracking projects and project settings

**Endpoints**:
```http
GET    /portal/{portal_id}/projects                    # List all projects
GET    /portal/{portal_id}/projects/{project_id}       # Get project details
POST   /portal/{portal_id}/projects                    # Create project
PUT    /portal/{portal_id}/projects/{project_id}       # Update project
DELETE /portal/{portal_id}/projects/{project_id}       # Delete project
GET    /portal/{portal_id}/projects/{project_id}/users # Get project users
POST   /portal/{portal_id}/projects/{project_id}/users # Add users to project
```

**Project Fields**:
- `name` - Project name (required)
- `description` - Project description
- `status` - Project status (active, archived)
- `key` - Project key/prefix for bug IDs
- `owner_id` - Project owner user ID
- `default_assignee` - Default assignee for new bugs
- `classification` - Project type/classification

**Example - Create Project**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const createProject = async (accessToken, portalId) => {
  const response = await axios.post(
    `https://bugtracker.zoho.com/api/v3/portal/${portalId}/projects`,
    {
      name: 'Mobile App Development',
      description: 'Bug tracking for iOS and Android apps',
      key: 'MOBILE',
      status: 'active',
      classification: 'Mobile'
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

def create_project(access_token, portal_id):
    url = f'https://bugtracker.zoho.com/api/v3/portal/{portal_id}/projects'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'name': 'Mobile App Development',
        'description': 'Bug tracking for iOS and Android apps',
        'key': 'MOBILE',
        'status': 'active',
        'classification': 'Mobile'
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

```deluge
// Deluge
project_data = {
    "name": "Mobile App Development",
    "description": "Bug tracking for iOS and Android apps",
    "key": "MOBILE",
    "status": "active",
    "classification": "Mobile"
};

response = invokeurl
[
    url: "https://bugtracker.zoho.com/api/v3/portal/" + portal_id + "/projects"
    type: POST
    parameters: project_data.toString()
    connection: "zoho_oauth"
];
info response;
```

**Response**:
```json
{
  "projects": [{
    "id": 123456000000123456,
    "name": "Mobile App Development",
    "description": "Bug tracking for iOS and Android apps",
    "key": "MOBILE",
    "status": "active",
    "classification": "Mobile",
    "owner": {
      "id": 123456000000098765,
      "name": "John Doe",
      "email": "john@company.com"
    },
    "created_time": "2025-01-15T10:30:00Z",
    "modified_time": "2025-01-15T10:30:00Z"
  }]
}
```

---

### 2. Bugs
**Purpose**: Create, track, and manage bugs

**Endpoints**:
```http
GET    /portal/{portal_id}/projects/{project_id}/bugs          # List bugs
GET    /portal/{portal_id}/projects/{project_id}/bugs/{bug_id} # Get bug details
POST   /portal/{portal_id}/projects/{project_id}/bugs          # Create bug
PUT    /portal/{portal_id}/projects/{project_id}/bugs/{bug_id} # Update bug
DELETE /portal/{portal_id}/projects/{project_id}/bugs/{bug_id} # Delete bug
GET    /portal/{portal_id}/projects/{project_id}/bugs/{bug_id}/comments # Get comments
POST   /portal/{portal_id}/projects/{project_id}/bugs/{bug_id}/comments # Add comment
GET    /portal/{portal_id}/projects/{project_id}/bugs/{bug_id}/attachments # Get attachments
POST   /portal/{portal_id}/projects/{project_id}/bugs/{bug_id}/attachments # Add attachment
```

**Bug Fields**:
- `title` - Bug title (required)
- `description` - Detailed description
- `priority` - Priority level (Low, Medium, High, Critical)
- `severity` - Bug severity (Minor, Major, Critical, Blocker)
- `status` - Current status (Open, In Progress, Fixed, Closed, etc.)
- `assignee` - Assigned user ID
- `reporter` - Reporter user ID
- `classification` - Bug classification/category
- `reproducible` - Is bug reproducible (Always, Sometimes, Never)
- `module` - Project module/component
- `milestone` - Associated milestone
- `affected_version` - Version where bug was found
- `fix_version` - Version where bug was fixed
- `flag` - Bug flag (Bug, Feature, Enhancement, Task)
- `due_date` - Due date for resolution

**Bug Statuses**:
- Open
- In Progress
- Fixed
- Verified
- Closed
- Reopened
- Won't Fix
- Duplicate
- Cannot Reproduce

**Priority Levels**:
- Low
- Medium
- High
- Critical

**Severity Levels**:
- Minor
- Major
- Critical
- Blocker

**Example - Create Bug**:
```javascript
// JavaScript/Node.js
const createBug = async (accessToken, portalId, projectId) => {
  const response = await axios.post(
    `https://bugtracker.zoho.com/api/v3/portal/${portalId}/projects/${projectId}/bugs`,
    {
      title: 'App crashes on login with invalid credentials',
      description: 'When entering invalid credentials on the login screen, the app crashes instead of showing an error message.',
      priority: 'High',
      severity: 'Critical',
      status: 'Open',
      flag: 'Bug',
      reproducible: 'Always',
      classification: 'Login',
      module: 'Authentication',
      affected_version: '2.1.0',
      assignee: 123456000000098765,
      reporter: 123456000000098766,
      due_date: '2025-01-25'
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
def create_bug(access_token, portal_id, project_id):
    url = f'https://bugtracker.zoho.com/api/v3/portal/{portal_id}/projects/{project_id}/bugs'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'title': 'App crashes on login with invalid credentials',
        'description': 'When entering invalid credentials on the login screen, the app crashes instead of showing an error message.',
        'priority': 'High',
        'severity': 'Critical',
        'status': 'Open',
        'flag': 'Bug',
        'reproducible': 'Always',
        'classification': 'Login',
        'module': 'Authentication',
        'affected_version': '2.1.0',
        'assignee': 123456000000098765,
        'reporter': 123456000000098766,
        'due_date': '2025-01-25'
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

```deluge
// Deluge
bug_data = {
    "title": "App crashes on login with invalid credentials",
    "description": "When entering invalid credentials on the login screen, the app crashes instead of showing an error message.",
    "priority": "High",
    "severity": "Critical",
    "status": "Open",
    "flag": "Bug",
    "reproducible": "Always",
    "classification": "Login",
    "module": "Authentication",
    "affected_version": "2.1.0",
    "assignee": 123456000000098765,
    "due_date": "2025-01-25"
};

response = invokeurl
[
    url: "https://bugtracker.zoho.com/api/v3/portal/" + portal_id + "/projects/" + project_id + "/bugs"
    type: POST
    parameters: bug_data.toString()
    connection: "zoho_oauth"
];
info response;
```

**Response**:
```json
{
  "bugs": [{
    "id": 123456000000234567,
    "title": "App crashes on login with invalid credentials",
    "description": "When entering invalid credentials on the login screen, the app crashes instead of showing an error message.",
    "key": "MOBILE-127",
    "priority": "High",
    "severity": "Critical",
    "status": "Open",
    "flag": "Bug",
    "reproducible": "Always",
    "classification": {
      "id": 123456000000345678,
      "name": "Login"
    },
    "module": {
      "id": 123456000000456789,
      "name": "Authentication"
    },
    "affected_version": "2.1.0",
    "assignee": {
      "id": 123456000000098765,
      "name": "Jane Smith",
      "email": "jane@company.com"
    },
    "reporter": {
      "id": 123456000000098766,
      "name": "John Doe",
      "email": "john@company.com"
    },
    "due_date": "2025-01-25",
    "created_time": "2025-01-15T10:30:00Z",
    "modified_time": "2025-01-15T10:30:00Z"
  }]
}
```

**Example - Update Bug Status**:
```javascript
// JavaScript/Node.js
const updateBugStatus = async (accessToken, portalId, projectId, bugId) => {
  const response = await axios.put(
    `https://bugtracker.zoho.com/api/v3/portal/${portalId}/projects/${projectId}/bugs/${bugId}`,
    {
      status: 'Fixed',
      fix_version: '2.1.1',
      resolution_comments: 'Added proper error handling for invalid credentials'
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

### 3. Comments
**Purpose**: Add comments and discussions to bugs

**Endpoints**:
```http
GET    /portal/{portal_id}/projects/{project_id}/bugs/{bug_id}/comments           # Get all comments
GET    /portal/{portal_id}/projects/{project_id}/bugs/{bug_id}/comments/{comment_id} # Get comment
POST   /portal/{portal_id}/projects/{project_id}/bugs/{bug_id}/comments           # Add comment
PUT    /portal/{portal_id}/projects/{project_id}/bugs/{bug_id}/comments/{comment_id} # Update comment
DELETE /portal/{portal_id}/projects/{project_id}/bugs/{bug_id}/comments/{comment_id} # Delete comment
```

**Example - Add Comment**:
```javascript
// JavaScript/Node.js
const addComment = async (accessToken, portalId, projectId, bugId) => {
  const response = await axios.post(
    `https://bugtracker.zoho.com/api/v3/portal/${portalId}/projects/${projectId}/bugs/${bugId}/comments`,
    {
      content: 'I was able to reproduce this issue. Looking into the authentication module code now.',
      is_private: false
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

### 4. Attachments
**Purpose**: Upload and manage bug attachments

**Endpoints**:
```http
GET    /portal/{portal_id}/projects/{project_id}/bugs/{bug_id}/attachments              # List attachments
POST   /portal/{portal_id}/projects/{project_id}/bugs/{bug_id}/attachments              # Upload attachment
DELETE /portal/{portal_id}/projects/{project_id}/bugs/{bug_id}/attachments/{attachment_id} # Delete attachment
```

**Example - Upload Attachment**:
```javascript
// JavaScript/Node.js
const FormData = require('form-data');
const fs = require('fs');

const uploadAttachment = async (accessToken, portalId, projectId, bugId, filePath) => {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));

  const response = await axios.post(
    `https://bugtracker.zoho.com/api/v3/portal/${portalId}/projects/${projectId}/bugs/${bugId}/attachments`,
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

```python
# Python
def upload_attachment(access_token, portal_id, project_id, bug_id, file_path):
    url = f'https://bugtracker.zoho.com/api/v3/portal/{portal_id}/projects/{project_id}/bugs/{bug_id}/attachments'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    files = {
        'file': open(file_path, 'rb')
    }
    response = requests.post(url, headers=headers, files=files)
    return response.json()
```

---

### 5. Portals
**Purpose**: Manage bug tracker portals

**Endpoints**:
```http
GET    /portals              # List all portals
GET    /portals/{portal_id}  # Get portal details
POST   /portals              # Create portal
PUT    /portals/{portal_id}  # Update portal
DELETE /portals/{portal_id}  # Delete portal
```

**Example - Get All Portals**:
```javascript
// JavaScript/Node.js
const getPortals = async (accessToken) => {
  const response = await axios.get(
    'https://bugtracker.zoho.com/api/v3/portals',
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

### 6. Users
**Purpose**: Manage users and team members

**Endpoints**:
```http
GET    /portal/{portal_id}/users              # List all users
GET    /portal/{portal_id}/users/{user_id}    # Get user details
POST   /portal/{portal_id}/users              # Add user
PUT    /portal/{portal_id}/users/{user_id}    # Update user
DELETE /portal/{portal_id}/users/{user_id}    # Remove user
GET    /portal/{portal_id}/users/current      # Get current user
```

**Example - Get Current User**:
```javascript
// JavaScript/Node.js
const getCurrentUser = async (accessToken, portalId) => {
  const response = await axios.get(
    `https://bugtracker.zoho.com/api/v3/portal/${portalId}/users/current`,
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

### 7. Milestones
**Purpose**: Track project milestones and releases

**Endpoints**:
```http
GET    /portal/{portal_id}/projects/{project_id}/milestones              # List milestones
GET    /portal/{portal_id}/projects/{project_id}/milestones/{milestone_id} # Get milestone
POST   /portal/{portal_id}/projects/{project_id}/milestones              # Create milestone
PUT    /portal/{portal_id}/projects/{project_id}/milestones/{milestone_id} # Update milestone
DELETE /portal/{portal_id}/projects/{project_id}/milestones/{milestone_id} # Delete milestone
```

**Example - Create Milestone**:
```javascript
// JavaScript/Node.js
const createMilestone = async (accessToken, portalId, projectId) => {
  const response = await axios.post(
    `https://bugtracker.zoho.com/api/v3/portal/${portalId}/projects/${projectId}/milestones`,
    {
      name: 'Version 2.1.1 Release',
      description: 'Critical bug fixes for mobile app',
      start_date: '2025-01-15',
      end_date: '2025-02-15',
      status: 'active'
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

### 8. Modules
**Purpose**: Organize bugs by project modules/components

**Endpoints**:
```http
GET    /portal/{portal_id}/projects/{project_id}/modules           # List modules
GET    /portal/{portal_id}/projects/{project_id}/modules/{module_id} # Get module
POST   /portal/{portal_id}/projects/{project_id}/modules           # Create module
PUT    /portal/{portal_id}/projects/{project_id}/modules/{module_id} # Update module
DELETE /portal/{portal_id}/projects/{project_id}/modules/{module_id} # Delete module
```

**Example - Create Module**:
```python
# Python
def create_module(access_token, portal_id, project_id):
    url = f'https://bugtracker.zoho.com/api/v3/portal/{portal_id}/projects/{project_id}/modules'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'name': 'User Authentication',
        'description': 'Login, signup, password reset functionality',
        'owner': 123456000000098765
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

---

### 9. Search & Filters
**Purpose**: Search and filter bugs

**Endpoints**:
```http
GET /portal/{portal_id}/projects/{project_id}/bugs/search  # Search bugs
```

**Query Parameters**:
- `status` - Filter by status
- `priority` - Filter by priority
- `severity` - Filter by severity
- `assignee` - Filter by assignee ID
- `reporter` - Filter by reporter ID
- `module` - Filter by module
- `milestone` - Filter by milestone
- `classification` - Filter by classification
- `flag` - Filter by flag (Bug, Feature, Task, Enhancement)
- `from_date` - Start date filter
- `to_date` - End date filter
- `search_text` - Text search in title/description

**Example - Search Bugs**:
```javascript
// JavaScript/Node.js
const searchBugs = async (accessToken, portalId, projectId) => {
  const response = await axios.get(
    `https://bugtracker.zoho.com/api/v3/portal/${portalId}/projects/${projectId}/bugs/search`,
    {
      params: {
        status: 'Open',
        priority: 'High,Critical',
        assignee: 123456000000098765,
        from_date: '2025-01-01',
        to_date: '2025-01-31'
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

### 10. Time Tracking
**Purpose**: Log time spent on bugs

**Endpoints**:
```http
GET    /portal/{portal_id}/projects/{project_id}/bugs/{bug_id}/timelogs        # Get time logs
POST   /portal/{portal_id}/projects/{project_id}/bugs/{bug_id}/timelogs        # Add time log
PUT    /portal/{portal_id}/projects/{project_id}/bugs/{bug_id}/timelogs/{log_id} # Update time log
DELETE /portal/{portal_id}/projects/{project_id}/bugs/{bug_id}/timelogs/{log_id} # Delete time log
```

**Example - Log Time**:
```javascript
// JavaScript/Node.js
const logTime = async (accessToken, portalId, projectId, bugId) => {
  const response = await axios.post(
    `https://bugtracker.zoho.com/api/v3/portal/${portalId}/projects/${projectId}/bugs/${bugId}/timelogs`,
    {
      hours: 3.5,
      date: '2025-01-15',
      description: 'Investigated issue and implemented fix',
      billable: true
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
  scope=ZohoBugTracker.projects.ALL,ZohoBugTracker.bugs.ALL&
  client_id={client_id}&
  response_type=code&
  access_type=offline&
  redirect_uri={redirect_uri}
```

**Available Scopes**:
- `ZohoBugTracker.projects.ALL` - Full access to projects
- `ZohoBugTracker.projects.READ` - Read-only access to projects
- `ZohoBugTracker.projects.CREATE` - Create projects
- `ZohoBugTracker.projects.UPDATE` - Update projects
- `ZohoBugTracker.projects.DELETE` - Delete projects
- `ZohoBugTracker.bugs.ALL` - Full access to bugs
- `ZohoBugTracker.bugs.READ` - Read-only access to bugs
- `ZohoBugTracker.bugs.CREATE` - Create bugs
- `ZohoBugTracker.bugs.UPDATE` - Update bugs
- `ZohoBugTracker.bugs.DELETE` - Delete bugs
- `ZohoBugTracker.portals.ALL` - Full access to portals
- `ZohoBugTracker.users.READ` - Read user information

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
const axios = require('axios');

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

**Python Token Refresh Example**:
```python
import requests

def refresh_access_token(client_id, client_secret, refresh_token):
    url = 'https://accounts.zoho.com/oauth/v2/token'
    params = {
        'grant_type': 'refresh_token',
        'client_id': client_id,
        'client_secret': client_secret,
        'refresh_token': refresh_token
    }
    response = requests.post(url, params=params)
    return response.json()['access_token']
```

**Token Lifetime**:
- Access Token: 1 hour
- Refresh Token: Does not expire (store securely)

---

## Rate Limits

### API Call Limits

| Plan | API Calls per Day | API Calls per Minute |
|------|-------------------|----------------------|
| Free | 5,000 | 100 |
| Premium | 25,000 | 200 |
| Enterprise | 100,000 | 500 |

### Rate Limit Details

**Per Minute Limit**:
- Varies by plan (100-500 calls/minute)
- Resets every 60 seconds

**Daily Limit**:
- Varies by plan (5,000-100,000 calls/day)
- Resets at midnight UTC

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1673827200
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

        if (i < maxRetries - 1) {
          console.log(`Rate limit hit. Waiting ${waitTime}ms...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
      }
      throw error;
    }
  }
};
```

**Python Example**:
```python
import time
import requests

def make_request_with_retry(url, headers, max_retries=3):
    for i in range(max_retries):
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 429:
                reset_time = int(e.response.headers.get('X-RateLimit-Reset', 0))
                wait_time = reset_time - int(time.time())

                if i < max_retries - 1 and wait_time > 0:
                    print(f'Rate limit hit. Waiting {wait_time}s...')
                    time.sleep(wait_time)
                    continue
            raise
```

---

## Error Codes

### HTTP Status Codes

| Status | Meaning | Common Causes |
|--------|---------|---------------|
| 200 | Success | Request completed successfully |
| 201 | Created | Resource created successfully |
| 204 | No Content | Request successful, no data returned |
| 400 | Bad Request | Invalid parameters or request format |
| 401 | Unauthorized | Invalid or expired access token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource does not exist |
| 405 | Method Not Allowed | Invalid HTTP method |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |
| 503 | Service Unavailable | Service temporarily unavailable |

### Zoho BugTracker Error Codes

| Code | Message | Description | Solution |
|------|---------|-------------|----------|
| 6001 | Invalid URL | API endpoint is incorrect | Verify endpoint URL |
| 6002 | Invalid Method | HTTP method not allowed | Use correct method (GET, POST, PUT, DELETE) |
| 6003 | Invalid Data | Request data format is invalid | Check JSON format |
| 6004 | Authentication Failed | Invalid access token | Refresh access token |
| 6005 | Access Denied | Insufficient permissions | Check OAuth scopes |
| 6006 | Resource Not Found | Requested resource doesn't exist | Verify resource ID |
| 6007 | Duplicate Entry | Resource already exists | Update existing resource |
| 6008 | Validation Failed | Required field missing or invalid | Check required fields |
| 6009 | Rate Limit Exceeded | Too many API calls | Implement rate limiting |
| 6010 | Portal Access Denied | User lacks portal access | Grant portal permissions |

### Error Response Format

```json
{
  "code": 6008,
  "message": "Validation Failed",
  "details": {
    "field": "title",
    "error": "Title is required and cannot be empty"
  }
}
```

### Error Handling Example

**JavaScript**:
```javascript
const handleBugTrackerError = (error) => {
  if (error.response) {
    const { status, data } = error.response;

    switch (status) {
      case 401:
        console.error('Authentication failed. Refreshing token...');
        // Refresh token logic
        break;

      case 429:
        console.error('Rate limit exceeded.');
        const resetTime = error.response.headers['x-ratelimit-reset'];
        // Wait logic
        break;

      case 400:
        console.error(`Bad request: ${data.message}`);
        if (data.details) {
          console.error(`Field error: ${data.details.field} - ${data.details.error}`);
        }
        break;

      case 404:
        console.error('Resource not found');
        break;

      case 500:
      case 503:
        console.error('Server error. Retrying...');
        // Retry logic
        break;

      default:
        console.error(`Error ${status}: ${data.message}`);
    }
  }
};
```

---

## Common Operations

### 1. Complete Bug Workflow

```javascript
// JavaScript/Node.js - Complete Bug Workflow
const completeBugWorkflow = async (accessToken, portalId, projectId) => {
  try {
    // 1. Create bug
    const bug = await createBug(accessToken, portalId, projectId);
    console.log('Bug created:', bug.bugs[0].key);

    const bugId = bug.bugs[0].id;

    // 2. Add comment
    await addComment(accessToken, portalId, projectId, bugId);
    console.log('Comment added');

    // 3. Upload screenshot
    await uploadAttachment(accessToken, portalId, projectId, bugId, './screenshot.png');
    console.log('Screenshot attached');

    // 4. Update status to In Progress
    await axios.put(
      `https://bugtracker.zoho.com/api/v3/portal/${portalId}/projects/${projectId}/bugs/${bugId}`,
      { status: 'In Progress' },
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Status updated to In Progress');

    // 5. Log time spent
    await logTime(accessToken, portalId, projectId, bugId);
    console.log('Time logged');

    // 6. Update status to Fixed
    await axios.put(
      `https://bugtracker.zoho.com/api/v3/portal/${portalId}/projects/${projectId}/bugs/${bugId}`,
      {
        status: 'Fixed',
        fix_version: '2.1.1'
      },
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Bug marked as Fixed');

    return { success: true, bug_id: bugId };

  } catch (error) {
    console.error('Workflow error:', error.response?.data || error.message);
    throw error;
  }
};
```

### 2. Bulk Create Bugs

```python
# Python - Bulk Create Bugs
import requests
import time

def bulk_create_bugs(access_token, portal_id, project_id, bugs_data):
    results = {
        'successful': [],
        'failed': []
    }

    for bug_data in bugs_data:
        try:
            url = f'https://bugtracker.zoho.com/api/v3/portal/{portal_id}/projects/{project_id}/bugs'
            headers = {
                'Authorization': f'Zoho-oauthtoken {access_token}',
                'Content-Type': 'application/json'
            }
            response = requests.post(url, json=bug_data, headers=headers)
            response.raise_for_status()

            bug = response.json()['bugs'][0]
            results['successful'].append({
                'title': bug_data['title'],
                'bug_key': bug['key']
            })

            print(f"Created: {bug['key']} - {bug_data['title']}")

            # Rate limiting: wait 0.6 seconds (100/min = 1 per 0.6s)
            time.sleep(0.6)

        except requests.exceptions.HTTPError as e:
            results['failed'].append({
                'title': bug_data['title'],
                'error': str(e)
            })
            print(f"Failed: {bug_data['title']} - {str(e)}")

    return results

# Usage
bugs_to_create = [
    {
        'title': 'Login button not responsive',
        'priority': 'High',
        'severity': 'Major',
        'status': 'Open'
    },
    {
        'title': 'Profile image not loading',
        'priority': 'Medium',
        'severity': 'Minor',
        'status': 'Open'
    }
    # ... more bugs
]

results = bulk_create_bugs(access_token, portal_id, project_id, bugs_to_create)
print(f"Successful: {len(results['successful'])}")
print(f"Failed: {len(results['failed'])}")
```

### 3. Get Bug Statistics

```javascript
// JavaScript/Node.js - Get Bug Statistics
const getBugStatistics = async (accessToken, portalId, projectId) => {
  const response = await axios.get(
    `https://bugtracker.zoho.com/api/v3/portal/${portalId}/projects/${projectId}/bugs`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );

  const bugs = response.data.bugs;

  const stats = {
    total: bugs.length,
    by_status: {},
    by_priority: {},
    by_severity: {},
    open_bugs: 0,
    critical_bugs: 0
  };

  bugs.forEach(bug => {
    // Count by status
    stats.by_status[bug.status] = (stats.by_status[bug.status] || 0) + 1;

    // Count by priority
    stats.by_priority[bug.priority] = (stats.by_priority[bug.priority] || 0) + 1;

    // Count by severity
    stats.by_severity[bug.severity] = (stats.by_severity[bug.severity] || 0) + 1;

    // Count open bugs
    if (bug.status === 'Open' || bug.status === 'In Progress') {
      stats.open_bugs++;
    }

    // Count critical bugs
    if (bug.priority === 'Critical' || bug.severity === 'Critical') {
      stats.critical_bugs++;
    }
  });

  return stats;
};
```

### 4. Sync Bugs from External System

```deluge
// Deluge - Sync Bugs from CRM
// This can be used to sync issues reported in CRM to BugTracker

portal_id = "123456000000000099";
project_id = "123456000000001234";

// Get cases from Zoho CRM
cases = zoho.crm.getRecords("Cases");

for each caseRecord in cases {
    // Check if case is marked as bug
    if(caseRecord.get("Type") == "Bug") {
        // Check if already synced
        bug_tracker_id = caseRecord.get("BugTracker_ID");

        if(bug_tracker_id == null || bug_tracker_id == "") {
            // Create bug in BugTracker
            bug_data = {
                "title": caseRecord.get("Subject"),
                "description": caseRecord.get("Description"),
                "priority": caseRecord.get("Priority"),
                "status": "Open",
                "reporter": caseRecord.get("Owner").get("id")
            };

            response = invokeurl
            [
                url: "https://bugtracker.zoho.com/api/v3/portal/" + portal_id + "/projects/" + project_id + "/bugs"
                type: POST
                parameters: bug_data.toString()
                connection: "zoho_oauth"
            ];

            if(response.get("bugs") != null) {
                bug_id = response.get("bugs").get(0).get("id");
                bug_key = response.get("bugs").get(0).get("key");

                // Update CRM case with bug ID
                update_map = Map();
                update_map.put("BugTracker_ID", bug_id);
                update_map.put("BugTracker_Key", bug_key);
                zoho.crm.updateRecord("Cases", caseRecord.get("id"), update_map);

                info "Created bug: " + bug_key + " for case: " + caseRecord.get("Case_Number");
            }
        }
    }
}
```

---

## Best Practices

### 1. Authentication & Security

**Store Tokens Securely**:
```javascript
// Good: Use environment variables
const config = {
  clientId: process.env.ZOHO_CLIENT_ID,
  clientSecret: process.env.ZOHO_CLIENT_SECRET,
  refreshToken: process.env.ZOHO_REFRESH_TOKEN
};
```

### 2. Error Handling

**Implement Comprehensive Error Handling**:
```javascript
const createBugSafely = async (accessToken, portalId, projectId, bugData) => {
  try {
    // Validate data first
    if (!bugData.title || bugData.title.trim() === '') {
      throw new Error('Bug title is required');
    }

    const response = await createBug(accessToken, portalId, projectId, bugData);
    return { success: true, data: response };

  } catch (error) {
    if (error.response) {
      // API error
      return {
        success: false,
        error: error.response.data.message,
        code: error.response.data.code
      };
    } else {
      // Network or other error
      return {
        success: false,
        error: error.message
      };
    }
  }
};
```

### 3. Data Validation

**Validate Before Sending**:
```javascript
const validateBugData = (bugData) => {
  const errors = [];

  if (!bugData.title) {
    errors.push('Title is required');
  }

  if (bugData.priority && !['Low', 'Medium', 'High', 'Critical'].includes(bugData.priority)) {
    errors.push('Invalid priority value');
  }

  if (bugData.severity && !['Minor', 'Major', 'Critical', 'Blocker'].includes(bugData.severity)) {
    errors.push('Invalid severity value');
  }

  if (errors.length > 0) {
    throw new Error(`Validation failed: ${errors.join(', ')}`);
  }

  return true;
};
```

### 4. Caching

**Cache Portal and Project Data**:
```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600 });

const getProjectWithCache = async (accessToken, portalId, projectId) => {
  const cacheKey = `project_${projectId}`;

  let project = cache.get(cacheKey);
  if (project) {
    return project;
  }

  const response = await axios.get(
    `https://bugtracker.zoho.com/api/v3/portal/${portalId}/projects/${projectId}`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );

  project = response.data.projects[0];
  cache.set(cacheKey, project);

  return project;
};
```

### 5. Pagination

**Handle Large Bug Lists**:
```python
def get_all_bugs(access_token, portal_id, project_id):
    all_bugs = []
    index = 1
    range_size = 100  # Max 100 per request

    while True:
        response = requests.get(
            f'https://bugtracker.zoho.com/api/v3/portal/{portal_id}/projects/{project_id}/bugs',
            headers={
                'Authorization': f'Zoho-oauthtoken {access_token}'
            },
            params={
                'index': index,
                'range': range_size
            }
        )

        data = response.json()
        bugs = data.get('bugs', [])
        all_bugs.extend(bugs)

        if len(bugs) < range_size:
            break

        index += range_size

    return all_bugs
```

---

## Additional Resources

- [Official Zoho BugTracker API Documentation](https://www.zoho.com/bugtracker/api/)
- [API Console](https://api-console.zoho.com/)
- [Zoho BugTracker Help](https://www.zoho.com/bugtracker/help/)
- [Developer Forums](https://help.zoho.com/portal/en/community/bugtracker)

---

**Last Updated**: December 2025
**API Version**: v3
