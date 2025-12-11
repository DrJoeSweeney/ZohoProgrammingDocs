# Zoho Projects API Reference

## Overview

Zoho Projects is a comprehensive project management platform that enables teams to plan, track, and collaborate on projects. The API provides full programmatic access to project data, task management, time tracking, and resource allocation.

**Current API Version**: v3 (Mandatory)
**Migration Deadline**: December 31, 2025
**Base URL**: `https://projectsapi.zoho.com/restapi/`
**Protocol**: REST
**Data Format**: JSON
**Authentication**: OAuth 2.0

> **IMPORTANT**: API v2 will be deprecated on December 31, 2025. All applications must migrate to v3 before this deadline. See the [Migration Guide](#migration-guide-v2-to-v3) below.

---

## Quick Links

- [Authentication](#authentication)
- [Projects API](#projects-api)
- [Tasks API](#tasks-api)
- [Milestones API](#milestones-api)
- [Tasklists API](#tasklists-api)
- [Timesheets API](#timesheets-api)
- [Documents API](#documents-api)
- [Forums API](#forums-api)
- [Gantt Chart API](#gantt-chart-api)
- [Resource Management](#resource-management)
- [BugTracker Integration](#bugtracker-integration)
- [Error Codes](#error-codes)
- [Rate Limits](#rate-limits)
- [Migration Guide](#migration-guide-v2-to-v3)
- [Best Practices](#best-practices)

---

## API Categories

### Key Modules

1. **Projects** - Create and manage projects, project templates
2. **Tasks** - Task creation, assignment, status tracking
3. **Milestones** - Project milestone management
4. **Tasklists** - Group and organize tasks
5. **Timesheets** - Time tracking and reporting
6. **Documents** - File management and sharing
7. **Forums** - Team discussions and communication
8. **Resources** - User and team management
9. **Gantt Charts** - Timeline and dependency visualization

---

## Authentication

### OAuth 2.0 Flow

Zoho Projects uses OAuth 2.0 for authentication. All API requests require a valid access token.

**Step 1: Register Your Application**
- Go to [Zoho API Console](https://api-console.zoho.com/)
- Create a new client application
- Note your Client ID and Client Secret
- Configure redirect URI

**Step 2: Generate Authorization Code**
```http
GET https://accounts.zoho.com/oauth/v2/auth?
  scope=ZohoProjects.portals.ALL,ZohoProjects.projects.ALL,ZohoProjects.tasks.ALL,ZohoProjects.timesheets.ALL&
  client_id={client_id}&
  response_type=code&
  access_type=offline&
  redirect_uri={redirect_uri}
```

**Available Scopes**:
- `ZohoProjects.portals.ALL` - Access to portal data
- `ZohoProjects.projects.ALL` - Full project access
- `ZohoProjects.tasks.ALL` - Task management
- `ZohoProjects.timesheets.ALL` - Time tracking
- `ZohoProjects.milestones.ALL` - Milestone management
- `ZohoProjects.documents.ALL` - Document management
- `ZohoProjects.forums.ALL` - Forum access
- `ZohoProjects.users.ALL` - User management

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
  "api_domain": "https://projectsapi.zoho.com",
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

## Projects API

### Get All Projects

**Endpoint**:
```http
GET /restapi/portal/{portal_id}/projects/
Authorization: Zoho-oauthtoken {access_token}
```

**Response**:
```json
{
  "projects": [
    {
      "id": "12345000000123456",
      "name": "Website Redesign",
      "description": "Complete redesign of company website",
      "status": "active",
      "owner_name": "John Doe",
      "owner_id": "12345000000234567",
      "created_date": "2025-01-15",
      "start_date": "2025-01-20",
      "end_date": "2025-06-30",
      "completed_percentage": 45,
      "task_count": 125,
      "milestone_count": 8,
      "custom_status_id": "12345000000345678"
    }
  ]
}
```

### Create Project

**Endpoint**:
```http
POST /restapi/portal/{portal_id}/projects/
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Mobile App Development",
  "description": "iOS and Android app development",
  "start_date": "01-20-2025",
  "end_date": "12-31-2025",
  "owner": "12345000000234567",
  "template_id": "12345000000456789",
  "strict_project": "no",
  "layout": {
    "task_layout": "12345000000567890"
  }
}
```

**JavaScript Example**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const createProject = async (accessToken, portalId) => {
  const response = await axios.post(
    `https://projectsapi.zoho.com/restapi/portal/${portalId}/projects/`,
    {
      name: 'Mobile App Development',
      description: 'iOS and Android app development',
      start_date: '01-20-2025',
      end_date: '12-31-2025',
      owner: '12345000000234567',
      strict_project: 'no'
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

**Python Example**:
```python
# Python
import requests

def create_project(access_token, portal_id):
    url = f'https://projectsapi.zoho.com/restapi/portal/{portal_id}/projects/'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'name': 'Mobile App Development',
        'description': 'iOS and Android app development',
        'start_date': '01-20-2025',
        'end_date': '12-31-2025',
        'owner': '12345000000234567',
        'strict_project': 'no'
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

**Deluge Example**:
```deluge
// Deluge
project_data = {
    "name": "Mobile App Development",
    "description": "iOS and Android app development",
    "start_date": "01-20-2025",
    "end_date": "12-31-2025",
    "strict_project": "no"
};

response = invokeurl
[
    url: "https://projectsapi.zoho.com/restapi/portal/" + portal_id + "/projects/"
    type: POST
    parameters: project_data.toString()
    connection: "zoho_projects"
];
info response;
```

### Update Project

**Endpoint**:
```http
POST /restapi/portal/{portal_id}/projects/{project_id}/
Authorization: Zoho-oauthtoken {access_token}
```

**Request Body**:
```json
{
  "name": "Updated Project Name",
  "description": "Updated description",
  "status": "active"
}
```

### Delete Project

**Endpoint**:
```http
DELETE /restapi/portal/{portal_id}/projects/{project_id}/
Authorization: Zoho-oauthtoken {access_token}
```

---

## Tasks API

### Get All Tasks

**Endpoint**:
```http
GET /restapi/portal/{portal_id}/projects/{project_id}/tasks/
Authorization: Zoho-oauthtoken {access_token}
```

**Query Parameters**:
- `range` - Pagination (default: 200)
- `index` - Starting index (default: 1)
- `status` - Filter by status (open/closed)
- `flag` - Filter by priority (internal/external)

**Response**:
```json
{
  "tasks": [
    {
      "id": "12345000000123456",
      "name": "Design Homepage Mockup",
      "description": "Create initial design mockups",
      "status": {
        "name": "In Progress",
        "id": "12345000000234567",
        "type": "open"
      },
      "priority": "high",
      "created_time": "2025-01-15T10:30:00Z",
      "start_date": "2025-01-20",
      "end_date": "2025-01-25",
      "completed": false,
      "percent_complete": 60,
      "duration": "5d",
      "owners": [
        {
          "id": "12345000000345678",
          "name": "Jane Smith",
          "email": "jane@company.com"
        }
      ],
      "subtasks": [],
      "tasklist": {
        "id": "12345000000456789",
        "name": "Design Phase"
      },
      "milestone": {
        "id": "12345000000567890",
        "name": "Phase 1 Completion"
      }
    }
  ]
}
```

### Create Task

**Endpoint**:
```http
POST /restapi/portal/{portal_id}/projects/{project_id}/tasks/
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Implement User Authentication",
  "description": "Implement OAuth 2.0 authentication flow",
  "priority": "high",
  "start_date": "01-22-2025",
  "end_date": "01-28-2025",
  "duration": "5d",
  "tasklist_id": "12345000000456789",
  "milestone_id": "12345000000567890",
  "owners": "12345000000345678,12345000000345679"
}
```

**JavaScript Example**:
```javascript
const createTask = async (accessToken, portalId, projectId) => {
  const response = await axios.post(
    `https://projectsapi.zoho.com/restapi/portal/${portalId}/projects/${projectId}/tasks/`,
    {
      name: 'Implement User Authentication',
      description: 'Implement OAuth 2.0 authentication flow',
      priority: 'high',
      start_date: '01-22-2025',
      end_date: '01-28-2025',
      duration: '5d',
      owners: '12345000000345678'
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

**Python Example**:
```python
def create_task(access_token, portal_id, project_id):
    url = f'https://projectsapi.zoho.com/restapi/portal/{portal_id}/projects/{project_id}/tasks/'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'name': 'Implement User Authentication',
        'description': 'Implement OAuth 2.0 authentication flow',
        'priority': 'high',
        'start_date': '01-22-2025',
        'end_date': '01-28-2025',
        'duration': '5d',
        'owners': '12345000000345678'
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

**Deluge Example**:
```deluge
task_data = {
    "name": "Implement User Authentication",
    "description": "Implement OAuth 2.0 authentication flow",
    "priority": "high",
    "start_date": "01-22-2025",
    "end_date": "01-28-2025",
    "duration": "5d"
};

response = invokeurl
[
    url: "https://projectsapi.zoho.com/restapi/portal/" + portal_id + "/projects/" + project_id + "/tasks/"
    type: POST
    parameters: task_data.toString()
    connection: "zoho_projects"
];
info response;
```

### Update Task

**Endpoint**:
```http
POST /restapi/portal/{portal_id}/projects/{project_id}/tasks/{task_id}/
Authorization: Zoho-oauthtoken {access_token}
```

**Request Body**:
```json
{
  "name": "Updated Task Name",
  "status": "completed",
  "percent_complete": 100
}
```

### Assign Task

**Endpoint**:
```http
POST /restapi/portal/{portal_id}/projects/{project_id}/tasks/{task_id}/
Authorization: Zoho-oauthtoken {access_token}
```

**Request Body**:
```json
{
  "owners": "12345000000345678,12345000000345679"
}
```

### Get Task Details

**Endpoint**:
```http
GET /restapi/portal/{portal_id}/projects/{project_id}/tasks/{task_id}/
Authorization: Zoho-oauthtoken {access_token}
```

### Delete Task

**Endpoint**:
```http
DELETE /restapi/portal/{portal_id}/projects/{project_id}/tasks/{task_id}/
Authorization: Zoho-oauthtoken {access_token}
```

---

## Milestones API

### Get All Milestones

**Endpoint**:
```http
GET /restapi/portal/{portal_id}/projects/{project_id}/milestones/
Authorization: Zoho-oauthtoken {access_token}
```

**Query Parameters**:
- `flag` - Filter: completed/incomplete
- `display_type` - Display type: all/upcoming

**Response**:
```json
{
  "milestones": [
    {
      "id": "12345000000567890",
      "name": "Phase 1 Completion",
      "start_date": "2025-01-20",
      "end_date": "2025-03-15",
      "status": "open",
      "flag": "internal",
      "owner": {
        "id": "12345000000345678",
        "name": "Project Manager"
      },
      "completed_tasks": 12,
      "total_tasks": 25
    }
  ]
}
```

### Create Milestone

**Endpoint**:
```http
POST /restapi/portal/{portal_id}/projects/{project_id}/milestones/
Authorization: Zoho-oauthtoken {access_token}
```

**Request Body**:
```json
{
  "name": "MVP Release",
  "start_date": "03-01-2025",
  "end_date": "03-31-2025",
  "flag": "internal",
  "owner": "12345000000345678"
}
```

**JavaScript Example**:
```javascript
const createMilestone = async (accessToken, portalId, projectId) => {
  const response = await axios.post(
    `https://projectsapi.zoho.com/restapi/portal/${portalId}/projects/${projectId}/milestones/`,
    {
      name: 'MVP Release',
      start_date: '03-01-2025',
      end_date: '03-31-2025',
      flag: 'internal',
      owner: '12345000000345678'
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

### Update Milestone

**Endpoint**:
```http
POST /restapi/portal/{portal_id}/projects/{project_id}/milestones/{milestone_id}/
Authorization: Zoho-oauthtoken {access_token}
```

### Delete Milestone

**Endpoint**:
```http
DELETE /restapi/portal/{portal_id}/projects/{project_id}/milestones/{milestone_id}/
Authorization: Zoho-oauthtoken {access_token}
```

---

## Tasklists API

### Get All Tasklists

**Endpoint**:
```http
GET /restapi/portal/{portal_id}/projects/{project_id}/tasklists/
Authorization: Zoho-oauthtoken {access_token}
```

**Response**:
```json
{
  "tasklists": [
    {
      "id": "12345000000456789",
      "name": "Design Phase",
      "milestone": {
        "id": "12345000000567890",
        "name": "Phase 1"
      },
      "completed": false,
      "created_time": "2025-01-15T10:30:00Z",
      "sequence": 1
    }
  ]
}
```

### Create Tasklist

**Endpoint**:
```http
POST /restapi/portal/{portal_id}/projects/{project_id}/tasklists/
Authorization: Zoho-oauthtoken {access_token}
```

**Request Body**:
```json
{
  "name": "Development Phase",
  "milestone_id": "12345000000567890"
}
```

**JavaScript Example**:
```javascript
const createTasklist = async (accessToken, portalId, projectId) => {
  const response = await axios.post(
    `https://projectsapi.zoho.com/restapi/portal/${portalId}/projects/${projectId}/tasklists/`,
    {
      name: 'Development Phase',
      milestone_id: '12345000000567890'
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

### Update Tasklist

**Endpoint**:
```http
POST /restapi/portal/{portal_id}/projects/{project_id}/tasklists/{tasklist_id}/
Authorization: Zoho-oauthtoken {access_token}
```

### Delete Tasklist

**Endpoint**:
```http
DELETE /restapi/portal/{portal_id}/projects/{project_id}/tasklists/{tasklist_id}/
Authorization: Zoho-oauthtoken {access_token}
```

---

## Timesheets API

### Get Timesheet Logs

**Endpoint**:
```http
GET /restapi/portal/{portal_id}/projects/{project_id}/logs/
Authorization: Zoho-oauthtoken {access_token}
```

**Query Parameters**:
- `users_list` - Filter by user IDs
- `date` - Filter by date (MM-DD-YYYY)
- `bill_status` - Filter: billable/non-billable
- `component_type` - Filter: task/bug/issue

**Response**:
```json
{
  "timelogs": {
    "date_logs": [
      {
        "date": "2025-01-15",
        "logs": [
          {
            "id": "12345000000678901",
            "task_id": "12345000000123456",
            "task_name": "Design Homepage",
            "hours": "4h 30m",
            "hours_display": "04:30",
            "bill_status": "billable",
            "notes": "Completed initial mockup design",
            "owner_name": "Jane Smith",
            "owner_id": "12345000000345678",
            "created_time": "2025-01-15T14:30:00Z"
          }
        ]
      }
    ]
  }
}
```

### Add Time Log

**Endpoint**:
```http
POST /restapi/portal/{portal_id}/projects/{project_id}/logs/
Authorization: Zoho-oauthtoken {access_token}
```

**Request Body**:
```json
{
  "date": "01-15-2025",
  "bill_status": "billable",
  "hours": "4:30",
  "owner": "12345000000345678",
  "notes": "Worked on authentication module",
  "task_id": "12345000000123456"
}
```

**JavaScript Example**:
```javascript
const addTimeLog = async (accessToken, portalId, projectId) => {
  const response = await axios.post(
    `https://projectsapi.zoho.com/restapi/portal/${portalId}/projects/${projectId}/logs/`,
    {
      date: '01-15-2025',
      bill_status: 'billable',
      hours: '4:30',
      owner: '12345000000345678',
      notes: 'Worked on authentication module',
      task_id: '12345000000123456'
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

**Python Example**:
```python
def add_time_log(access_token, portal_id, project_id):
    url = f'https://projectsapi.zoho.com/restapi/portal/{portal_id}/projects/{project_id}/logs/'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'date': '01-15-2025',
        'bill_status': 'billable',
        'hours': '4:30',
        'owner': '12345000000345678',
        'notes': 'Worked on authentication module',
        'task_id': '12345000000123456'
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

**Deluge Example**:
```deluge
timelog_data = {
    "date": "01-15-2025",
    "bill_status": "billable",
    "hours": "4:30",
    "notes": "Worked on authentication module",
    "task_id": "12345000000123456"
};

response = invokeurl
[
    url: "https://projectsapi.zoho.com/restapi/portal/" + portal_id + "/projects/" + project_id + "/logs/"
    type: POST
    parameters: timelog_data.toString()
    connection: "zoho_projects"
];
info response;
```

### Update Time Log

**Endpoint**:
```http
POST /restapi/portal/{portal_id}/projects/{project_id}/logs/{log_id}/
Authorization: Zoho-oauthtoken {access_token}
```

### Delete Time Log

**Endpoint**:
```http
DELETE /restapi/portal/{portal_id}/projects/{project_id}/logs/{log_id}/
Authorization: Zoho-oauthtoken {access_token}
```

### Get Time Log Summary

**Endpoint**:
```http
GET /restapi/portal/{portal_id}/projects/{project_id}/logs/viewtype/
Authorization: Zoho-oauthtoken {access_token}
```

**Query Parameters**:
- `view_type` - users/task/date
- `date_range` - Date range filter
- `users_list` - Comma-separated user IDs

---

## Documents API

### Get All Documents

**Endpoint**:
```http
GET /restapi/portal/{portal_id}/projects/{project_id}/documents/
Authorization: Zoho-oauthtoken {access_token}
```

**Response**:
```json
{
  "documents": [
    {
      "id": "12345000000789012",
      "name": "Project Requirements.pdf",
      "uploaded_by": "John Doe",
      "uploaded_by_id": "12345000000345678",
      "uploaded_time": "2025-01-15T10:30:00Z",
      "file_size": "2.5 MB",
      "category_id": "12345000000890123",
      "category_name": "Specifications",
      "file_type": "pdf"
    }
  ]
}
```

### Upload Document

**Endpoint**:
```http
POST /restapi/portal/{portal_id}/projects/{project_id}/documents/
Authorization: Zoho-oauthtoken {access_token}
Content-Type: multipart/form-data
```

**Request Parameters**:
- `uploadFile` - File to upload
- `category_id` - Document category ID (optional)

**JavaScript Example**:
```javascript
const uploadDocument = async (accessToken, portalId, projectId, filePath) => {
  const FormData = require('form-data');
  const fs = require('fs');

  const form = new FormData();
  form.append('uploadFile', fs.createReadStream(filePath));
  form.append('category_id', '12345000000890123');

  const response = await axios.post(
    `https://projectsapi.zoho.com/restapi/portal/${portalId}/projects/${projectId}/documents/`,
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
```

**Python Example**:
```python
def upload_document(access_token, portal_id, project_id, file_path):
    url = f'https://projectsapi.zoho.com/restapi/portal/{portal_id}/projects/{project_id}/documents/'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    files = {
        'uploadFile': open(file_path, 'rb')
    }
    data = {
        'category_id': '12345000000890123'
    }
    response = requests.post(url, files=files, data=data, headers=headers)
    return response.json()
```

### Download Document

**Endpoint**:
```http
GET /restapi/portal/{portal_id}/projects/{project_id}/documents/{document_id}/download/
Authorization: Zoho-oauthtoken {access_token}
```

### Delete Document

**Endpoint**:
```http
DELETE /restapi/portal/{portal_id}/projects/{project_id}/documents/{document_id}/
Authorization: Zoho-oauthtoken {access_token}
```

---

## Forums API

### Get All Forums

**Endpoint**:
```http
GET /restapi/portal/{portal_id}/projects/{project_id}/forums/
Authorization: Zoho-oauthtoken {access_token}
```

**Response**:
```json
{
  "forums": [
    {
      "id": "12345000000901234",
      "name": "General Discussion",
      "content": "Team discussion forum",
      "posted_by": "John Doe",
      "posted_by_id": "12345000000345678",
      "posted_date": "2025-01-15",
      "posted_time": "10:30 AM",
      "comments_count": 15,
      "latest_comment": {
        "content": "Great discussion!",
        "posted_by": "Jane Smith",
        "posted_time": "2025-01-16T14:20:00Z"
      }
    }
  ]
}
```

### Create Forum

**Endpoint**:
```http
POST /restapi/portal/{portal_id}/projects/{project_id}/forums/
Authorization: Zoho-oauthtoken {access_token}
```

**Request Body**:
```json
{
  "name": "Sprint Planning",
  "content": "Discussion about Sprint 5 planning"
}
```

**JavaScript Example**:
```javascript
const createForum = async (accessToken, portalId, projectId) => {
  const response = await axios.post(
    `https://projectsapi.zoho.com/restapi/portal/${portalId}/projects/${projectId}/forums/`,
    {
      name: 'Sprint Planning',
      content: 'Discussion about Sprint 5 planning'
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

### Add Comment to Forum

**Endpoint**:
```http
POST /restapi/portal/{portal_id}/projects/{project_id}/forums/{forum_id}/comments/
Authorization: Zoho-oauthtoken {access_token}
```

**Request Body**:
```json
{
  "content": "I agree with the proposed timeline"
}
```

### Delete Forum

**Endpoint**:
```http
DELETE /restapi/portal/{portal_id}/projects/{project_id}/forums/{forum_id}/
Authorization: Zoho-oauthtoken {access_token}
```

---

## Gantt Chart API

### Get Gantt Chart Data

**Endpoint**:
```http
GET /restapi/portal/{portal_id}/projects/{project_id}/gantt/
Authorization: Zoho-oauthtoken {access_token}
```

**Query Parameters**:
- `range` - Number of records to fetch
- `index` - Starting index

**Response**:
```json
{
  "gantt_data": [
    {
      "id": "12345000000123456",
      "name": "Design Phase",
      "type": "milestone",
      "start_date": "2025-01-20",
      "end_date": "2025-02-28",
      "duration": "40d",
      "progress": 65,
      "dependencies": []
    },
    {
      "id": "12345000000234567",
      "name": "Create Wireframes",
      "type": "task",
      "start_date": "2025-01-20",
      "end_date": "2025-01-27",
      "duration": "7d",
      "progress": 100,
      "parent": "12345000000123456",
      "dependencies": []
    },
    {
      "id": "12345000000345678",
      "name": "Design Mockups",
      "type": "task",
      "start_date": "2025-01-28",
      "end_date": "2025-02-10",
      "duration": "14d",
      "progress": 80,
      "parent": "12345000000123456",
      "dependencies": ["12345000000234567"]
    }
  ]
}
```

**JavaScript Example**:
```javascript
const getGanttData = async (accessToken, portalId, projectId) => {
  const response = await axios.get(
    `https://projectsapi.zoho.com/restapi/portal/${portalId}/projects/${projectId}/gantt/`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

**Python Example**:
```python
def get_gantt_data(access_token, portal_id, project_id):
    url = f'https://projectsapi.zoho.com/restapi/portal/{portal_id}/projects/{project_id}/gantt/'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    response = requests.get(url, headers=headers)
    return response.json()
```

---

## Resource Management

### Get All Users

**Endpoint**:
```http
GET /restapi/portal/{portal_id}/users/
Authorization: Zoho-oauthtoken {access_token}
```

**Response**:
```json
{
  "users": [
    {
      "id": "12345000000345678",
      "name": "Jane Smith",
      "email": "jane@company.com",
      "role": "Manager",
      "zpuid": "12345678",
      "photo_url": "https://projectsapi.zoho.com/photo.png"
    }
  ]
}
```

### Get User Details

**Endpoint**:
```http
GET /restapi/portal/{portal_id}/users/{user_id}/
Authorization: Zoho-oauthtoken {access_token}
```

### Add User to Project

**Endpoint**:
```http
POST /restapi/portal/{portal_id}/projects/{project_id}/users/
Authorization: Zoho-oauthtoken {access_token}
```

**Request Body**:
```json
{
  "users": "user1@company.com,user2@company.com",
  "role": "Manager"
}
```

**JavaScript Example**:
```javascript
const addUserToProject = async (accessToken, portalId, projectId) => {
  const response = await axios.post(
    `https://projectsapi.zoho.com/restapi/portal/${portalId}/projects/${projectId}/users/`,
    {
      users: 'user1@company.com,user2@company.com',
      role: 'Manager'
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

### Get Resource Utilization

**Endpoint**:
```http
GET /restapi/portal/{portal_id}/resourceutilization/
Authorization: Zoho-oauthtoken {access_token}
```

**Query Parameters**:
- `users_list` - Comma-separated user IDs
- `range` - Date range
- `project_id` - Filter by project

**Response**:
```json
{
  "resource_utilization": [
    {
      "user_id": "12345000000345678",
      "user_name": "Jane Smith",
      "allocated_hours": "160h",
      "logged_hours": "145h",
      "available_hours": "15h",
      "utilization_percentage": 90.6,
      "projects": [
        {
          "project_id": "12345000000123456",
          "project_name": "Website Redesign",
          "allocated_hours": "80h",
          "logged_hours": "72h"
        }
      ]
    }
  ]
}
```

---

## BugTracker Integration

Zoho Projects integrates seamlessly with Zoho BugTracker for bug and issue management.

### Get All Bugs

**Endpoint**:
```http
GET /restapi/portal/{portal_id}/projects/{project_id}/bugs/
Authorization: Zoho-oauthtoken {access_token}
```

**Query Parameters**:
- `flag` - Filter: internal/external
- `status` - Filter by status
- `range` - Number of records
- `index` - Starting index

**Response**:
```json
{
  "bugs": [
    {
      "id": "12345000001012345",
      "title": "Login page not responsive",
      "description": "Login page doesn't work on mobile devices",
      "severity": "High",
      "status": {
        "name": "Open",
        "id": "12345000001023456"
      },
      "assignee": {
        "id": "12345000000345678",
        "name": "John Doe"
      },
      "created_time": "2025-01-15T10:30:00Z",
      "module": {
        "id": "12345000001034567",
        "name": "Authentication"
      },
      "classification": {
        "id": "12345000001045678",
        "name": "Bug"
      }
    }
  ]
}
```

### Create Bug

**Endpoint**:
```http
POST /restapi/portal/{portal_id}/projects/{project_id}/bugs/
Authorization: Zoho-oauthtoken {access_token}
```

**Request Body**:
```json
{
  "title": "Payment gateway timeout",
  "description": "Payment processing times out after 30 seconds",
  "severity": "High",
  "classification_id": "12345000001045678",
  "module_id": "12345000001034567",
  "assignee": "12345000000345678",
  "flag": "internal"
}
```

**JavaScript Example**:
```javascript
const createBug = async (accessToken, portalId, projectId) => {
  const response = await axios.post(
    `https://projectsapi.zoho.com/restapi/portal/${portalId}/projects/${projectId}/bugs/`,
    {
      title: 'Payment gateway timeout',
      description: 'Payment processing times out after 30 seconds',
      severity: 'High',
      classification_id: '12345000001045678',
      module_id: '12345000001034567',
      assignee: '12345000000345678',
      flag: 'internal'
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

**Python Example**:
```python
def create_bug(access_token, portal_id, project_id):
    url = f'https://projectsapi.zoho.com/restapi/portal/{portal_id}/projects/{project_id}/bugs/'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'title': 'Payment gateway timeout',
        'description': 'Payment processing times out after 30 seconds',
        'severity': 'High',
        'classification_id': '12345000001045678',
        'module_id': '12345000001034567',
        'assignee': '12345000000345678',
        'flag': 'internal'
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

**Deluge Example**:
```deluge
bug_data = {
    "title": "Payment gateway timeout",
    "description": "Payment processing times out after 30 seconds",
    "severity": "High",
    "flag": "internal"
};

response = invokeurl
[
    url: "https://projectsapi.zoho.com/restapi/portal/" + portal_id + "/projects/" + project_id + "/bugs/"
    type: POST
    parameters: bug_data.toString()
    connection: "zoho_projects"
];
info response;
```

### Update Bug

**Endpoint**:
```http
POST /restapi/portal/{portal_id}/projects/{project_id}/bugs/{bug_id}/
Authorization: Zoho-oauthtoken {access_token}
```

### Delete Bug

**Endpoint**:
```http
DELETE /restapi/portal/{portal_id}/projects/{project_id}/bugs/{bug_id}/
Authorization: Zoho-oauthtoken {access_token}
```

---

## Rate Limits

### API Call Limits

| Plan | API Calls per Day | API Calls per Minute |
|------|-------------------|----------------------|
| Free | 2,500 | 50 |
| Premium | 5,000 | 100 |
| Enterprise | 10,000 | 200 |

### Rate Limit Headers

All API responses include rate limit headers:

```http
X-RateLimit-Limit: 10000
X-RateLimit-Remaining: 9875
X-RateLimit-Reset: 1642147200
```

### Handling Rate Limits

**JavaScript Example**:
```javascript
const makeApiCall = async (accessToken, url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    });

    // Check rate limit headers
    const remaining = response.headers['x-ratelimit-remaining'];
    const reset = response.headers['x-ratelimit-reset'];

    console.log(`API calls remaining: ${remaining}`);
    console.log(`Rate limit resets at: ${new Date(reset * 1000)}`);

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      // Rate limit exceeded
      const retryAfter = error.response.headers['retry-after'];
      console.log(`Rate limit exceeded. Retry after ${retryAfter} seconds`);

      // Wait and retry
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      return makeApiCall(accessToken, url);
    }
    throw error;
  }
};
```

**Python Example with Retry**:
```python
import time
from requests.exceptions import HTTPError

def make_api_call_with_retry(access_token, url, max_retries=3):
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }

    for attempt in range(max_retries):
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()

            # Check rate limits
            remaining = response.headers.get('x-ratelimit-remaining')
            print(f'API calls remaining: {remaining}')

            return response.json()

        except HTTPError as e:
            if e.response.status_code == 429:
                retry_after = int(e.response.headers.get('retry-after', 60))
                print(f'Rate limited. Retrying after {retry_after} seconds...')
                time.sleep(retry_after)
            else:
                raise

    raise Exception('Max retries exceeded')
```

---

## Error Codes

### HTTP Status Codes

| HTTP Status | Error Code | Description | Solution |
|-------------|------------|-------------|----------|
| 400 | INVALID_DATA | Invalid request parameters | Check request format and required fields |
| 400 | MANDATORY_NOT_FOUND | Required field missing | Include all mandatory fields |
| 400 | INVALID_PROJECT_ID | Project ID is invalid | Verify project ID exists |
| 400 | INVALID_TASK_ID | Task ID is invalid | Verify task ID exists |
| 401 | INVALID_TOKEN | Invalid or expired access token | Refresh access token |
| 401 | UNAUTHORIZED | Authentication required | Provide valid OAuth token |
| 403 | NO_PERMISSION | Insufficient permissions | Check user role and permissions |
| 403 | PROJECT_INACTIVE | Project is archived/inactive | Activate project first |
| 404 | RECORD_NOT_FOUND | Resource not found | Verify resource ID |
| 404 | PROJECT_NOT_FOUND | Project does not exist | Check project ID |
| 404 | TASK_NOT_FOUND | Task does not exist | Check task ID |
| 429 | RATE_LIMIT_EXCEEDED | API rate limit exceeded | Implement rate limiting and retry logic |
| 500 | INTERNAL_ERROR | Server error | Retry with exponential backoff |
| 503 | SERVICE_UNAVAILABLE | Service temporarily unavailable | Retry after some time |

### Common Error Response Format

```json
{
  "error": {
    "code": "INVALID_DATA",
    "message": "Invalid data provided",
    "details": {
      "field": "start_date",
      "issue": "Date format should be MM-DD-YYYY"
    }
  }
}
```

### Error Handling Best Practices

**JavaScript Example**:
```javascript
const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;

    switch (status) {
      case 400:
        console.error('Invalid request:', data.error.message);
        // Handle validation errors
        break;
      case 401:
        console.error('Authentication failed. Refreshing token...');
        // Implement token refresh
        break;
      case 403:
        console.error('Permission denied:', data.error.message);
        break;
      case 404:
        console.error('Resource not found:', data.error.message);
        break;
      case 429:
        console.error('Rate limit exceeded. Retrying...');
        // Implement retry logic
        break;
      case 500:
      case 503:
        console.error('Server error. Retrying with backoff...');
        // Implement exponential backoff
        break;
      default:
        console.error('Unexpected error:', data);
    }
  }
};

// Usage
try {
  const result = await createTask(accessToken, portalId, projectId);
} catch (error) {
  handleApiError(error);
}
```

**Python Example**:
```python
class ZohoProjectsAPIError(Exception):
    def __init__(self, status_code, error_data):
        self.status_code = status_code
        self.error_data = error_data
        super().__init__(f"API Error {status_code}: {error_data}")

def handle_api_error(response):
    if response.status_code >= 400:
        error_data = response.json().get('error', {})

        if response.status_code == 401:
            # Refresh token
            print("Token expired, refreshing...")
            raise ZohoProjectsAPIError(401, error_data)
        elif response.status_code == 429:
            # Rate limited
            retry_after = response.headers.get('retry-after', 60)
            print(f"Rate limited, retry after {retry_after}s")
            raise ZohoProjectsAPIError(429, error_data)
        else:
            raise ZohoProjectsAPIError(response.status_code, error_data)

# Usage
try:
    response = requests.get(url, headers=headers)
    handle_api_error(response)
    return response.json()
except ZohoProjectsAPIError as e:
    print(f"API Error: {e}")
```

---

## Migration Guide: v2 to v3

### Critical Information

**Deadline**: December 31, 2025
**Status**: v2 APIs will be completely deprecated after this date

### Major Changes

#### 1. Base URL Change

**v2**:
```
https://projectsapi.zoho.com/restapi/portal/{portal_id}/projects/{project_id}/tasks/
```

**v3**:
```
https://projectsapi.zoho.com/restapi/portal/{portal_id}/projects/{project_id}/tasks/
```

Note: The base URL remains the same, but response formats and certain parameters have changed.

#### 2. Date Format Changes

**v2**: Multiple formats accepted
```json
{
  "start_date": "2025-01-15",
  "end_date": "15-01-2025"
}
```

**v3**: Standardized to MM-DD-YYYY
```json
{
  "start_date": "01-15-2025",
  "end_date": "01-31-2025"
}
```

#### 3. Response Structure Changes

**v2 Response**:
```json
{
  "tasks": [
    {
      "id_string": "12345000000123456",
      "name": "Task Name"
    }
  ]
}
```

**v3 Response**:
```json
{
  "tasks": [
    {
      "id": "12345000000123456",
      "name": "Task Name",
      "created_time": "2025-01-15T10:30:00Z"
    }
  ]
}
```

#### 4. Authentication Changes

**v2**: Authtoken parameter
```http
GET /restapi/portal/{portal_id}/projects/?authtoken={token}
```

**v3**: OAuth 2.0 header (mandatory)
```http
GET /restapi/portal/{portal_id}/projects/
Authorization: Zoho-oauthtoken {access_token}
```

#### 5. Deprecated Endpoints

The following v2 endpoints are deprecated:

- `/portal/{portal_id}/projects/status/` - Use project details API
- `/portal/{portal_id}/projects/{project_id}/tasks/template/` - Use tasklists API

#### 6. New Features in v3

- Enhanced error messages with detailed descriptions
- Improved rate limiting with predictable headers
- Better pagination support
- Webhook support for real-time notifications
- Bulk operations for tasks and time logs
- Advanced filtering options

### Migration Checklist

1. **Update Authentication**
   - [ ] Migrate from authtoken to OAuth 2.0
   - [ ] Implement token refresh logic
   - [ ] Update all API calls to use Authorization header

2. **Update Date Formats**
   - [ ] Change all dates to MM-DD-YYYY format
   - [ ] Update date parsing logic in your code
   - [ ] Test date handling in all API calls

3. **Update Response Handling**
   - [ ] Update response parsing for new structure
   - [ ] Handle new field names (id instead of id_string)
   - [ ] Update error handling for v3 error format

4. **Test All Endpoints**
   - [ ] Test project CRUD operations
   - [ ] Test task management
   - [ ] Test milestone operations
   - [ ] Test time logging
   - [ ] Test document uploads
   - [ ] Test user management

5. **Update Error Handling**
   - [ ] Implement new error code handling
   - [ ] Add rate limit handling
   - [ ] Update retry logic

6. **Performance Optimization**
   - [ ] Implement bulk operations where possible
   - [ ] Use pagination for large datasets
   - [ ] Add caching for frequently accessed data

### Migration Example: Task Creation

**v2 Code (JavaScript)**:
```javascript
// OLD - v2 (Deprecated)
const createTaskV2 = async (authtoken, portalId, projectId) => {
  const response = await axios.post(
    `https://projectsapi.zoho.com/restapi/portal/${portalId}/projects/${projectId}/tasks/?authtoken=${authtoken}`,
    {
      name: 'New Task',
      start_date: '2025-01-15',  // ISO format
      end_date: '2025-01-20'
    }
  );
  return response.data;
};
```

**v3 Code (JavaScript)**:
```javascript
// NEW - v3 (Required)
const createTaskV3 = async (accessToken, portalId, projectId) => {
  const response = await axios.post(
    `https://projectsapi.zoho.com/restapi/portal/${portalId}/projects/${projectId}/tasks/`,
    {
      name: 'New Task',
      start_date: '01-15-2025',  // MM-DD-YYYY format
      end_date: '01-20-2025'
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

**v2 Code (Python)**:
```python
# OLD - v2 (Deprecated)
def create_task_v2(authtoken, portal_id, project_id):
    url = f'https://projectsapi.zoho.com/restapi/portal/{portal_id}/projects/{project_id}/tasks/'
    params = {'authtoken': authtoken}
    data = {
        'name': 'New Task',
        'start_date': '2025-01-15',
        'end_date': '2025-01-20'
    }
    response = requests.post(url, params=params, json=data)
    return response.json()
```

**v3 Code (Python)**:
```python
# NEW - v3 (Required)
def create_task_v3(access_token, portal_id, project_id):
    url = f'https://projectsapi.zoho.com/restapi/portal/{portal_id}/projects/{project_id}/tasks/'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'name': 'New Task',
        'start_date': '01-15-2025',  # MM-DD-YYYY format
        'end_date': '01-20-2025'
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

### Testing Your Migration

1. **Create a Test Environment**
   - Set up a separate test portal
   - Import sample data
   - Test all API operations

2. **Run Parallel Tests**
   - Run v2 and v3 APIs side by side
   - Compare results
   - Validate data integrity

3. **Monitor Production**
   - Deploy v3 to a small percentage of users
   - Monitor error rates
   - Gradually increase rollout

---

## Best Practices

### 1. Authentication Management

**Store Tokens Securely**:
```javascript
// Use environment variables
const accessToken = process.env.ZOHO_ACCESS_TOKEN;
const refreshToken = process.env.ZOHO_REFRESH_TOKEN;

// Never hardcode tokens in source code
// ❌ BAD
const token = "1000.abc123...";

// ✅ GOOD
const token = process.env.ZOHO_ACCESS_TOKEN;
```

**Implement Token Refresh**:
```javascript
class ZohoProjectsClient {
  constructor(clientId, clientSecret, refreshToken) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.refreshToken = refreshToken;
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async ensureValidToken() {
    if (!this.accessToken || Date.now() >= this.tokenExpiry) {
      await this.refreshAccessToken();
    }
    return this.accessToken;
  }

  async refreshAccessToken() {
    const response = await axios.post(
      'https://accounts.zoho.com/oauth/v2/token',
      null,
      {
        params: {
          grant_type: 'refresh_token',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: this.refreshToken
        }
      }
    );

    this.accessToken = response.data.access_token;
    this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
  }

  async makeRequest(method, url, data = null) {
    const token = await this.ensureValidToken();
    return axios({
      method,
      url,
      data,
      headers: {
        'Authorization': `Zoho-oauthtoken ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }
}
```

### 2. Error Handling and Retry Logic

**Implement Exponential Backoff**:
```javascript
const exponentialBackoff = async (fn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.response && error.response.status >= 500) {
        const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
        console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
  throw new Error('Max retries exceeded');
};

// Usage
const result = await exponentialBackoff(() =>
  createTask(accessToken, portalId, projectId)
);
```

**Python Retry Decorator**:
```python
import time
from functools import wraps

def retry_with_backoff(max_retries=3, base_delay=1):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)
                except requests.exceptions.HTTPError as e:
                    if e.response.status_code >= 500:
                        if attempt < max_retries - 1:
                            delay = base_delay * (2 ** attempt)
                            print(f"Retry {attempt + 1}/{max_retries} after {delay}s")
                            time.sleep(delay)
                        else:
                            raise
                    else:
                        raise
        return wrapper
    return decorator

# Usage
@retry_with_backoff(max_retries=3)
def create_task(access_token, portal_id, project_id):
    url = f'https://projectsapi.zoho.com/restapi/portal/{portal_id}/projects/{project_id}/tasks/'
    headers = {'Authorization': f'Zoho-oauthtoken {access_token}'}
    response = requests.post(url, headers=headers)
    response.raise_for_status()
    return response.json()
```

### 3. Rate Limit Management

**Track and Respect Limits**:
```javascript
class RateLimiter {
  constructor(maxRequests, timeWindow) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
    this.requests = [];
  }

  async throttle() {
    const now = Date.now();
    this.requests = this.requests.filter(
      time => now - time < this.timeWindow
    );

    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.timeWindow - (now - oldestRequest);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return this.throttle();
    }

    this.requests.push(now);
  }
}

// Usage: 100 requests per minute
const rateLimiter = new RateLimiter(100, 60000);

const makeApiCall = async (url, token) => {
  await rateLimiter.throttle();
  return axios.get(url, {
    headers: { 'Authorization': `Zoho-oauthtoken ${token}` }
  });
};
```

### 4. Pagination Best Practices

**Fetch All Pages**:
```javascript
const getAllTasks = async (accessToken, portalId, projectId) => {
  const allTasks = [];
  let index = 1;
  const range = 200; // Max per page

  while (true) {
    const response = await axios.get(
      `https://projectsapi.zoho.com/restapi/portal/${portalId}/projects/${projectId}/tasks/`,
      {
        params: { range, index },
        headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}` }
      }
    );

    const tasks = response.data.tasks || [];
    allTasks.push(...tasks);

    if (tasks.length < range) {
      break; // No more pages
    }

    index += range;
  }

  return allTasks;
};
```

**Python Pagination**:
```python
def get_all_tasks(access_token, portal_id, project_id):
    all_tasks = []
    index = 1
    range_size = 200

    while True:
        url = f'https://projectsapi.zoho.com/restapi/portal/{portal_id}/projects/{project_id}/tasks/'
        params = {'range': range_size, 'index': index}
        headers = {'Authorization': f'Zoho-oauthtoken {access_token}'}

        response = requests.get(url, params=params, headers=headers)
        data = response.json()
        tasks = data.get('tasks', [])

        all_tasks.extend(tasks)

        if len(tasks) < range_size:
            break

        index += range_size

    return all_tasks
```

### 5. Data Validation

**Validate Before Sending**:
```javascript
const validateTaskData = (taskData) => {
  const errors = [];

  if (!taskData.name || taskData.name.trim() === '') {
    errors.push('Task name is required');
  }

  if (taskData.name && taskData.name.length > 500) {
    errors.push('Task name must be less than 500 characters');
  }

  if (taskData.start_date && taskData.end_date) {
    const start = new Date(taskData.start_date);
    const end = new Date(taskData.end_date);
    if (start > end) {
      errors.push('Start date must be before end date');
    }
  }

  if (taskData.priority && !['none', 'low', 'medium', 'high'].includes(taskData.priority)) {
    errors.push('Invalid priority value');
  }

  if (errors.length > 0) {
    throw new Error(`Validation failed: ${errors.join(', ')}`);
  }

  return true;
};

// Usage
const createValidatedTask = async (accessToken, portalId, projectId, taskData) => {
  validateTaskData(taskData);
  return createTask(accessToken, portalId, projectId, taskData);
};
```

### 6. Caching Strategy

**Cache Frequently Accessed Data**:
```javascript
class ZohoProjectsCache {
  constructor(ttl = 300000) { // 5 minutes default
    this.cache = new Map();
    this.ttl = ttl;
  }

  set(key, value) {
    this.cache.set(key, {
      value,
      expiry: Date.now() + this.ttl
    });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  clear() {
    this.cache.clear();
  }
}

// Usage
const cache = new ZohoProjectsCache();

const getProjectWithCache = async (accessToken, portalId, projectId) => {
  const cacheKey = `project_${projectId}`;
  const cached = cache.get(cacheKey);

  if (cached) {
    console.log('Returning cached data');
    return cached;
  }

  const project = await getProject(accessToken, portalId, projectId);
  cache.set(cacheKey, project);
  return project;
};
```

### 7. Webhook Integration

**Set Up Webhooks for Real-time Updates**:
```javascript
// Express.js webhook handler
const express = require('express');
const app = express();

app.post('/webhooks/zoho-projects', express.json(), (req, res) => {
  const event = req.body;

  console.log('Webhook received:', event.type);

  switch (event.type) {
    case 'task.created':
      handleTaskCreated(event.data);
      break;
    case 'task.updated':
      handleTaskUpdated(event.data);
      break;
    case 'task.completed':
      handleTaskCompleted(event.data);
      break;
    default:
      console.log('Unknown event type:', event.type);
  }

  res.status(200).send('Webhook received');
});

const handleTaskCreated = (taskData) => {
  console.log('New task created:', taskData.name);
  // Send notification, update database, etc.
};

const handleTaskUpdated = (taskData) => {
  console.log('Task updated:', taskData.name);
  // Update local cache, notify users, etc.
};

const handleTaskCompleted = (taskData) => {
  console.log('Task completed:', taskData.name);
  // Send completion notification, update reports, etc.
};
```

### 8. Bulk Operations

**Use Bulk APIs for Efficiency**:
```javascript
const createMultipleTasks = async (accessToken, portalId, projectId, tasks) => {
  // Instead of creating tasks one by one
  // Group them and create in batches
  const batchSize = 10;
  const results = [];

  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(task => createTask(accessToken, portalId, projectId, task))
    );
    results.push(...batchResults);

    // Add small delay between batches to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return results;
};
```

### 9. Logging and Monitoring

**Implement Comprehensive Logging**:
```javascript
const logger = {
  info: (message, data = {}) => {
    console.log(JSON.stringify({
      level: 'INFO',
      timestamp: new Date().toISOString(),
      message,
      ...data
    }));
  },

  error: (message, error, data = {}) => {
    console.error(JSON.stringify({
      level: 'ERROR',
      timestamp: new Date().toISOString(),
      message,
      error: error.message,
      stack: error.stack,
      ...data
    }));
  }
};

const createTaskWithLogging = async (accessToken, portalId, projectId, taskData) => {
  logger.info('Creating task', { projectId, taskName: taskData.name });

  try {
    const result = await createTask(accessToken, portalId, projectId, taskData);
    logger.info('Task created successfully', { taskId: result.id });
    return result;
  } catch (error) {
    logger.error('Failed to create task', error, { projectId, taskData });
    throw error;
  }
};
```

### 10. Testing

**Write Integration Tests**:
```javascript
// Jest example
describe('Zoho Projects API', () => {
  let accessToken;
  let testProjectId;

  beforeAll(async () => {
    accessToken = await getAccessToken();
    testProjectId = await createTestProject();
  });

  afterAll(async () => {
    await deleteTestProject(testProjectId);
  });

  test('should create a task', async () => {
    const taskData = {
      name: 'Test Task',
      start_date: '01-15-2025',
      end_date: '01-20-2025'
    };

    const result = await createTask(accessToken, portalId, testProjectId, taskData);

    expect(result.id).toBeDefined();
    expect(result.name).toBe('Test Task');
  });

  test('should handle invalid date format', async () => {
    const taskData = {
      name: 'Test Task',
      start_date: '2025-01-15' // Wrong format
    };

    await expect(
      createTask(accessToken, portalId, testProjectId, taskData)
    ).rejects.toThrow();
  });
});
```

---

## Data Centers

Zoho Projects operates in multiple data centers. Use the appropriate base URL:

| Data Center | Base URL |
|-------------|----------|
| US | https://projectsapi.zoho.com |
| EU | https://projectsapi.zoho.eu |
| IN | https://projectsapi.zoho.in |
| AU | https://projectsapi.zoho.com.au |
| JP | https://projectsapi.zoho.jp |
| CA | https://projectsapi.zoho.ca |
| CN | https://projectsapi.zoho.com.cn |

---

## SDKs and Libraries

### Official SDKs

- **Node.js**: Use axios or fetch API
- **Python**: requests library recommended
- **PHP**: Guzzle HTTP client
- **Ruby**: HTTParty or Faraday

### Community Libraries

Check [GitHub](https://github.com/topics/zoho-projects) for community-maintained libraries.

---

## Additional Resources

- [Official Zoho Projects API Documentation](https://www.zoho.com/projects/help/rest-api/zohoprojects-restapi.html)
- [Zoho Projects Developer Portal](https://www.zoho.com/projects/developer.html)
- [API Console](https://api-console.zoho.com/)
- [Developer Forums](https://help.zoho.com/portal/en/community/zoho-projects)
- [Postman Collection](https://www.postman.com/zoho/workspace/zoho-public-apis)
- [Change Log](https://www.zoho.com/projects/changelog.html)

---

## Support

For API support and questions:
- Email: support@zohoprojects.com
- Developer Forum: [Zoho Projects Community](https://help.zoho.com/portal/en/community/zoho-projects)
- Documentation: [API Help](https://www.zoho.com/projects/help/rest-api/)

---

**Last Updated**: December 2025
**API Version**: v3 (Mandatory)
**Migration Deadline**: December 31, 2025
