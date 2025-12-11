# Zoho Sprints API Reference

## Overview

Zoho Sprints is an agile project management tool designed for Scrum teams. The API provides comprehensive access to projects, sprints, user stories, tasks, epics, backlogs, and scrum boards, enabling complete integration with your agile workflow.

**Current API Version**: v2
**Base URL**: `https://sprintsapi.zoho.com/api/v2/`
**Protocol**: REST
**Data Format**: JSON
**Authentication**: OAuth 2.0

---

## Quick Links

- [Authentication](#authentication)
- [Projects API](#projects-api)
- [Sprints API](#sprints-api)
- [User Stories API](#user-stories-api)
- [Tasks API](#tasks-api)
- [Epics API](#epics-api)
- [Backlogs API](#backlogs-api)
- [Scrum Board API](#scrum-board-api)
- [Teams API](#teams-api)
- [Webhooks](#webhooks)
- [Rate Limits](#rate-limits)
- [Error Codes](#error-codes)
- [Code Examples](#code-examples)
- [Best Practices](#best-practices)

---

## REST API Principles

### HTTP Methods

Zoho Sprints API follows standard REST conventions:

| Method | Purpose | Idempotent |
|--------|---------|------------|
| GET | Retrieve resources | Yes |
| POST | Create new resources | No |
| PUT | Update/replace resources | Yes |
| PATCH | Partial update | No |
| DELETE | Remove resources | Yes |

### Request Format

```http
GET /api/v2/projects/{project_id}/sprints
Host: sprintsapi.zoho.com
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json
```

### Response Format

**Success Response**:
```json
{
  "status": "success",
  "data": {
    "id": "1234567890",
    "name": "Sprint 24",
    "status": "active"
  }
}
```

**List Response**:
```json
{
  "status": "success",
  "data": [
    { "id": "1234567890", "name": "Sprint 24" },
    { "id": "1234567891", "name": "Sprint 25" }
  ],
  "meta": {
    "page": 1,
    "per_page": 50,
    "total_count": 100
  }
}
```

**Error Response**:
```json
{
  "status": "error",
  "code": "INVALID_DATA",
  "message": "Sprint start date cannot be in the past",
  "details": {
    "field": "start_date"
  }
}
```

---

## Authentication

### OAuth 2.0 Flow

Zoho Sprints uses OAuth 2.0 for authentication. All API requests require a valid access token.

**Step 1: Register Your Application**
- Go to [Zoho API Console](https://api-console.zoho.com/)
- Create a new Client (Server-based or Self-client)
- Note your Client ID and Client Secret
- Set the authorized redirect URI

**Step 2: Generate Authorization Code**

```http
GET https://accounts.zoho.com/oauth/v2/auth?
  scope=ZohoSprints.projects.ALL,ZohoSprints.sprints.ALL,ZohoSprints.stories.ALL&
  client_id={client_id}&
  response_type=code&
  access_type=offline&
  redirect_uri={redirect_uri}
```

**Available Scopes**:
- `ZohoSprints.projects.ALL` - Full access to projects
- `ZohoSprints.projects.READ` - Read-only access to projects
- `ZohoSprints.sprints.ALL` - Full access to sprints
- `ZohoSprints.sprints.READ` - Read sprints
- `ZohoSprints.stories.ALL` - Full access to user stories
- `ZohoSprints.stories.READ` - Read user stories
- `ZohoSprints.tasks.ALL` - Full access to tasks
- `ZohoSprints.tasks.READ` - Read tasks
- `ZohoSprints.epics.ALL` - Full access to epics
- `ZohoSprints.teams.ALL` - Full access to teams

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
  "access_token": "1000.xxx.yyy",
  "refresh_token": "1000.zzz.aaa",
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

## Projects API

Projects are the top-level containers in Zoho Sprints that hold all sprints, user stories, and tasks.

### Project Object Structure

```json
{
  "id": "1234567890",
  "name": "Mobile App Redesign",
  "prefix": "MAR",
  "description": "Complete redesign of mobile application",
  "status": "active",
  "start_date": "2025-01-01",
  "end_date": "2025-12-31",
  "owner_id": "9876543210",
  "owner_name": "John Doe",
  "team_id": "5432109876",
  "team_name": "Development Team",
  "created_time": "2025-01-01T09:00:00Z",
  "modified_time": "2025-12-10T15:30:00Z",
  "is_active": true,
  "project_type": "scrum",
  "velocity": 45,
  "time_zone": "America/New_York"
}
```

### List Projects

```http
GET /api/v2/projects
Authorization: Zoho-oauthtoken {access_token}
```

**Query Parameters**:
- `page` (integer) - Page number (default: 1)
- `per_page` (integer) - Results per page (max: 100, default: 50)
- `status` (string) - Filter by status: "active", "completed", "archived"
- `sort_by` (string) - Sort field: "name", "created_time", "modified_time"
- `sort_order` (string) - "asc" or "desc"

**Example**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const listProjects = async (accessToken) => {
  const response = await axios.get(
    'https://sprintsapi.zoho.com/api/v2/projects',
    {
      params: {
        page: 1,
        per_page: 50,
        status: 'active'
      },
      headers: {
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

def list_projects(access_token):
    url = 'https://sprintsapi.zoho.com/api/v2/projects'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'page': 1,
        'per_page': 50,
        'status': 'active'
    }
    response = requests.get(url, headers=headers, params=params)
    return response.json()
```

```deluge
// Deluge
response = invokeurl
[
    url: "https://sprintsapi.zoho.com/api/v2/projects"
    type: GET
    parameters: {"page": 1, "per_page": 50, "status": "active"}
    headers: {"Authorization": "Zoho-oauthtoken " + access_token}
];
info response;
```

### Get Project by ID

```http
GET /api/v2/projects/{project_id}
Authorization: Zoho-oauthtoken {access_token}
```

**Example**:
```javascript
const getProject = async (accessToken, projectId) => {
  const response = await axios.get(
    `https://sprintsapi.zoho.com/api/v2/projects/${projectId}`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

### Create Project

```http
POST /api/v2/projects
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "name": "E-commerce Platform",
  "prefix": "ECP",
  "description": "New e-commerce platform development",
  "start_date": "2025-01-15",
  "end_date": "2025-12-31",
  "team_id": "5432109876",
  "project_type": "scrum"
}
```

**Example**:
```javascript
const createProject = async (accessToken, projectData) => {
  const response = await axios.post(
    'https://sprintsapi.zoho.com/api/v2/projects',
    projectData,
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
const newProject = {
  name: 'E-commerce Platform',
  prefix: 'ECP',
  description: 'New e-commerce platform development',
  start_date: '2025-01-15',
  end_date: '2025-12-31',
  team_id: '5432109876',
  project_type: 'scrum'
};

const project = await createProject(accessToken, newProject);
```

```python
def create_project(access_token, project_data):
    url = 'https://sprintsapi.zoho.com/api/v2/projects'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    response = requests.post(url, json=project_data, headers=headers)
    return response.json()

# Usage
new_project = {
    'name': 'E-commerce Platform',
    'prefix': 'ECP',
    'description': 'New e-commerce platform development',
    'start_date': '2025-01-15',
    'end_date': '2025-12-31',
    'team_id': '5432109876',
    'project_type': 'scrum'
}

project = create_project(access_token, new_project)
```

```deluge
// Deluge
project_map = Map();
project_map.put("name", "E-commerce Platform");
project_map.put("prefix", "ECP");
project_map.put("description", "New e-commerce platform development");
project_map.put("start_date", "2025-01-15");
project_map.put("end_date", "2025-12-31");
project_map.put("team_id", "5432109876");
project_map.put("project_type", "scrum");

response = invokeurl
[
    url: "https://sprintsapi.zoho.com/api/v2/projects"
    type: POST
    parameters: project_map.toString()
    headers: {"Authorization": "Zoho-oauthtoken " + access_token}
];
info response;
```

### Update Project

```http
PUT /api/v2/projects/{project_id}
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "name": "E-commerce Platform v2",
  "description": "Updated description",
  "status": "active"
}
```

### Delete Project

```http
DELETE /api/v2/projects/{project_id}
Authorization: Zoho-oauthtoken {access_token}
```

---

## Sprints API

Sprints are time-boxed iterations where work is completed.

### Sprint Object Structure

```json
{
  "id": "1234567890",
  "project_id": "9876543210",
  "name": "Sprint 24",
  "description": "Focus on user authentication features",
  "status": "active",
  "start_date": "2025-12-01",
  "end_date": "2025-12-14",
  "goal": "Complete authentication module with OAuth integration",
  "velocity": 42,
  "planned_points": 45,
  "completed_points": 38,
  "created_time": "2025-11-28T10:00:00Z",
  "started_time": "2025-12-01T09:00:00Z",
  "completed_time": null,
  "story_count": 12,
  "completed_story_count": 10,
  "is_active": true
}
```

### List Sprints in Project

```http
GET /api/v2/projects/{project_id}/sprints
Authorization: Zoho-oauthtoken {access_token}
```

**Query Parameters**:
- `page` (integer) - Page number
- `per_page` (integer) - Results per page (max: 100)
- `status` (string) - Filter: "active", "completed", "planned"

**Example**:
```javascript
const listSprints = async (accessToken, projectId) => {
  const response = await axios.get(
    `https://sprintsapi.zoho.com/api/v2/projects/${projectId}/sprints`,
    {
      params: {
        status: 'active',
        per_page: 50
      },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

```python
def list_sprints(access_token, project_id):
    url = f'https://sprintsapi.zoho.com/api/v2/projects/{project_id}/sprints'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'status': 'active',
        'per_page': 50
    }
    response = requests.get(url, headers=headers, params=params)
    return response.json()
```

```deluge
// Deluge
response = invokeurl
[
    url: "https://sprintsapi.zoho.com/api/v2/projects/" + project_id + "/sprints"
    type: GET
    parameters: {"status": "active", "per_page": 50}
    headers: {"Authorization": "Zoho-oauthtoken " + access_token}
];
info response;
```

### Get Sprint by ID

```http
GET /api/v2/projects/{project_id}/sprints/{sprint_id}
Authorization: Zoho-oauthtoken {access_token}
```

### Create Sprint

```http
POST /api/v2/projects/{project_id}/sprints
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "name": "Sprint 25",
  "description": "Focus on payment integration",
  "start_date": "2025-12-15",
  "end_date": "2025-12-28",
  "goal": "Complete payment gateway integration"
}
```

**Example**:
```javascript
const createSprint = async (accessToken, projectId, sprintData) => {
  const response = await axios.post(
    `https://sprintsapi.zoho.com/api/v2/projects/${projectId}/sprints`,
    sprintData,
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
const newSprint = {
  name: 'Sprint 25',
  description: 'Focus on payment integration',
  start_date: '2025-12-15',
  end_date: '2025-12-28',
  goal: 'Complete payment gateway integration'
};

const sprint = await createSprint(accessToken, projectId, newSprint);
```

### Start Sprint

```http
POST /api/v2/projects/{project_id}/sprints/{sprint_id}/start
Authorization: Zoho-oauthtoken {access_token}
```

**Example**:
```javascript
const startSprint = async (accessToken, projectId, sprintId) => {
  const response = await axios.post(
    `https://sprintsapi.zoho.com/api/v2/projects/${projectId}/sprints/${sprintId}/start`,
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

### Complete Sprint

```http
POST /api/v2/projects/{project_id}/sprints/{sprint_id}/complete
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "move_incomplete_items": true,
  "target_sprint_id": "9876543210"
}
```

**Example**:
```javascript
const completeSprint = async (accessToken, projectId, sprintId, targetSprintId = null) => {
  const response = await axios.post(
    `https://sprintsapi.zoho.com/api/v2/projects/${projectId}/sprints/${sprintId}/complete`,
    {
      move_incomplete_items: true,
      target_sprint_id: targetSprintId
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
def complete_sprint(access_token, project_id, sprint_id, target_sprint_id=None):
    url = f'https://sprintsapi.zoho.com/api/v2/projects/{project_id}/sprints/{sprint_id}/complete'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'move_incomplete_items': True,
        'target_sprint_id': target_sprint_id
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

### Update Sprint

```http
PUT /api/v2/projects/{project_id}/sprints/{sprint_id}
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "name": "Sprint 25 - Extended",
  "end_date": "2025-12-30"
}
```

### Delete Sprint

```http
DELETE /api/v2/projects/{project_id}/sprints/{sprint_id}
Authorization: Zoho-oauthtoken {access_token}
```

---

## User Stories API

User stories represent features or requirements from the user's perspective.

### User Story Object Structure

```json
{
  "id": "1234567890",
  "project_id": "9876543210",
  "sprint_id": "5432109876",
  "epic_id": "1111111111",
  "title": "User can login with social media accounts",
  "description": "As a user, I want to login using my Google or Facebook account so that I can access the platform quickly",
  "story_points": 5,
  "priority": "high",
  "status": "in_progress",
  "type": "story",
  "assignee_id": "2222222222",
  "assignee_name": "Jane Smith",
  "reporter_id": "3333333333",
  "reporter_name": "John Doe",
  "created_time": "2025-12-01T10:00:00Z",
  "modified_time": "2025-12-12T14:30:00Z",
  "acceptance_criteria": "1. Users can see Google login button\n2. OAuth flow works correctly\n3. User profile is created on first login",
  "tags": ["authentication", "oauth"],
  "custom_fields": {
    "business_value": "high"
  }
}
```

### List User Stories

```http
GET /api/v2/projects/{project_id}/stories
Authorization: Zoho-oauthtoken {access_token}
```

**Query Parameters**:
- `sprint_id` (string) - Filter by sprint
- `epic_id` (string) - Filter by epic
- `status` (string) - Filter: "todo", "in_progress", "completed"
- `assignee_id` (string) - Filter by assignee
- `priority` (string) - Filter: "low", "medium", "high", "critical"
- `page` (integer) - Page number
- `per_page` (integer) - Results per page

**Example**:
```javascript
const listUserStories = async (accessToken, projectId, filters = {}) => {
  const response = await axios.get(
    `https://sprintsapi.zoho.com/api/v2/projects/${projectId}/stories`,
    {
      params: {
        sprint_id: filters.sprintId,
        status: filters.status || 'in_progress',
        per_page: 50
      },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

```python
def list_user_stories(access_token, project_id, filters=None):
    url = f'https://sprintsapi.zoho.com/api/v2/projects/{project_id}/stories'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'per_page': 50
    }
    if filters:
        params.update(filters)
    response = requests.get(url, headers=headers, params=params)
    return response.json()
```

### Get User Story by ID

```http
GET /api/v2/projects/{project_id}/stories/{story_id}
Authorization: Zoho-oauthtoken {access_token}
```

### Create User Story

```http
POST /api/v2/projects/{project_id}/stories
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "title": "User can reset password",
  "description": "As a user, I want to reset my password if I forget it",
  "story_points": 3,
  "priority": "medium",
  "sprint_id": "5432109876",
  "epic_id": "1111111111",
  "assignee_id": "2222222222",
  "acceptance_criteria": "1. Reset link sent via email\n2. Link expires after 24 hours\n3. Password meets security requirements",
  "tags": ["authentication", "security"]
}
```

**Example**:
```javascript
const createUserStory = async (accessToken, projectId, storyData) => {
  const response = await axios.post(
    `https://sprintsapi.zoho.com/api/v2/projects/${projectId}/stories`,
    storyData,
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
const newStory = {
  title: 'User can reset password',
  description: 'As a user, I want to reset my password if I forget it',
  story_points: 3,
  priority: 'medium',
  sprint_id: '5432109876',
  assignee_id: '2222222222',
  tags: ['authentication', 'security']
};

const story = await createUserStory(accessToken, projectId, newStory);
```

```python
def create_user_story(access_token, project_id, story_data):
    url = f'https://sprintsapi.zoho.com/api/v2/projects/{project_id}/stories'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    response = requests.post(url, json=story_data, headers=headers)
    return response.json()
```

```deluge
// Deluge
story_map = Map();
story_map.put("title", "User can reset password");
story_map.put("description", "As a user, I want to reset my password if I forget it");
story_map.put("story_points", 3);
story_map.put("priority", "medium");
story_map.put("sprint_id", "5432109876");
story_map.put("assignee_id", "2222222222");

response = invokeurl
[
    url: "https://sprintsapi.zoho.com/api/v2/projects/" + project_id + "/stories"
    type: POST
    parameters: story_map.toString()
    headers: {"Authorization": "Zoho-oauthtoken " + access_token}
];
info response;
```

### Update User Story

```http
PUT /api/v2/projects/{project_id}/stories/{story_id}
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "status": "completed",
  "story_points": 5,
  "assignee_id": "3333333333"
}
```

**Example**:
```javascript
const updateUserStory = async (accessToken, projectId, storyId, updates) => {
  const response = await axios.put(
    `https://sprintsapi.zoho.com/api/v2/projects/${projectId}/stories/${storyId}`,
    updates,
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

### Move Story to Sprint

```http
POST /api/v2/projects/{project_id}/stories/{story_id}/move
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "sprint_id": "9876543210"
}
```

### Delete User Story

```http
DELETE /api/v2/projects/{project_id}/stories/{story_id}
Authorization: Zoho-oauthtoken {access_token}
```

---

## Tasks API

Tasks are work items that can be associated with user stories or exist independently.

### Task Object Structure

```json
{
  "id": "1234567890",
  "project_id": "9876543210",
  "story_id": "5432109876",
  "sprint_id": "1111111111",
  "title": "Implement OAuth Google integration",
  "description": "Set up Google OAuth client and callback handlers",
  "status": "in_progress",
  "priority": "high",
  "assignee_id": "2222222222",
  "assignee_name": "Jane Smith",
  "estimated_hours": 8,
  "logged_hours": 5.5,
  "due_date": "2025-12-15",
  "created_time": "2025-12-10T09:00:00Z",
  "modified_time": "2025-12-12T16:00:00Z",
  "completed_time": null,
  "tags": ["backend", "oauth"]
}
```

### List Tasks

```http
GET /api/v2/projects/{project_id}/tasks
Authorization: Zoho-oauthtoken {access_token}
```

**Query Parameters**:
- `story_id` (string) - Filter by story
- `sprint_id` (string) - Filter by sprint
- `status` (string) - Filter: "todo", "in_progress", "completed"
- `assignee_id` (string) - Filter by assignee
- `page` (integer) - Page number
- `per_page` (integer) - Results per page

**Example**:
```javascript
const listTasks = async (accessToken, projectId, filters = {}) => {
  const response = await axios.get(
    `https://sprintsapi.zoho.com/api/v2/projects/${projectId}/tasks`,
    {
      params: {
        sprint_id: filters.sprintId,
        status: filters.status,
        assignee_id: filters.assigneeId,
        per_page: 50
      },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

```python
def list_tasks(access_token, project_id, filters=None):
    url = f'https://sprintsapi.zoho.com/api/v2/projects/{project_id}/tasks'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {'per_page': 50}
    if filters:
        params.update(filters)
    response = requests.get(url, headers=headers, params=params)
    return response.json()
```

### Create Task

```http
POST /api/v2/projects/{project_id}/tasks
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "title": "Write unit tests for OAuth",
  "description": "Create comprehensive unit tests for OAuth integration",
  "story_id": "5432109876",
  "assignee_id": "2222222222",
  "estimated_hours": 4,
  "priority": "medium",
  "due_date": "2025-12-14"
}
```

**Example**:
```javascript
const createTask = async (accessToken, projectId, taskData) => {
  const response = await axios.post(
    `https://sprintsapi.zoho.com/api/v2/projects/${projectId}/tasks`,
    taskData,
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
def create_task(access_token, project_id, task_data):
    url = f'https://sprintsapi.zoho.com/api/v2/projects/{project_id}/tasks'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    response = requests.post(url, json=task_data, headers=headers)
    return response.json()
```

```deluge
// Deluge
task_map = Map();
task_map.put("title", "Write unit tests for OAuth");
task_map.put("description", "Create comprehensive unit tests");
task_map.put("story_id", "5432109876");
task_map.put("assignee_id", "2222222222");
task_map.put("estimated_hours", 4);
task_map.put("priority", "medium");

response = invokeurl
[
    url: "https://sprintsapi.zoho.com/api/v2/projects/" + project_id + "/tasks"
    type: POST
    parameters: task_map.toString()
    headers: {"Authorization": "Zoho-oauthtoken " + access_token}
];
info response;
```

### Update Task

```http
PUT /api/v2/projects/{project_id}/tasks/{task_id}
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "status": "completed",
  "logged_hours": 4.5
}
```

### Log Time on Task

```http
POST /api/v2/projects/{project_id}/tasks/{task_id}/logtime
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "hours": 2.5,
  "date": "2025-12-12",
  "description": "Implemented OAuth callback handler"
}
```

**Example**:
```javascript
const logTaskTime = async (accessToken, projectId, taskId, timeData) => {
  const response = await axios.post(
    `https://sprintsapi.zoho.com/api/v2/projects/${projectId}/tasks/${taskId}/logtime`,
    timeData,
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
await logTaskTime(accessToken, projectId, taskId, {
  hours: 2.5,
  date: '2025-12-12',
  description: 'Implemented OAuth callback handler'
});
```

### Delete Task

```http
DELETE /api/v2/projects/{project_id}/tasks/{task_id}
Authorization: Zoho-oauthtoken {access_token}
```

---

## Epics API

Epics are large bodies of work that can be broken down into multiple user stories.

### Epic Object Structure

```json
{
  "id": "1111111111",
  "project_id": "9876543210",
  "name": "User Authentication System",
  "description": "Complete authentication system with multiple login methods",
  "status": "in_progress",
  "owner_id": "2222222222",
  "owner_name": "John Doe",
  "start_date": "2025-12-01",
  "end_date": "2026-02-28",
  "story_count": 15,
  "completed_story_count": 8,
  "total_story_points": 65,
  "completed_story_points": 35,
  "progress": 53.8,
  "created_time": "2025-11-20T10:00:00Z",
  "modified_time": "2025-12-12T14:00:00Z"
}
```

### List Epics

```http
GET /api/v2/projects/{project_id}/epics
Authorization: Zoho-oauthtoken {access_token}
```

**Example**:
```javascript
const listEpics = async (accessToken, projectId) => {
  const response = await axios.get(
    `https://sprintsapi.zoho.com/api/v2/projects/${projectId}/epics`,
    {
      params: {
        per_page: 50
      },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

```python
def list_epics(access_token, project_id):
    url = f'https://sprintsapi.zoho.com/api/v2/projects/{project_id}/epics'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    response = requests.get(url, headers=headers)
    return response.json()
```

### Create Epic

```http
POST /api/v2/projects/{project_id}/epics
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "name": "Payment Processing System",
  "description": "Complete payment processing with multiple gateways",
  "start_date": "2026-01-01",
  "end_date": "2026-03-31",
  "owner_id": "2222222222"
}
```

**Example**:
```javascript
const createEpic = async (accessToken, projectId, epicData) => {
  const response = await axios.post(
    `https://sprintsapi.zoho.com/api/v2/projects/${projectId}/epics`,
    epicData,
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

### Update Epic

```http
PUT /api/v2/projects/{project_id}/epics/{epic_id}
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "status": "completed"
}
```

### Delete Epic

```http
DELETE /api/v2/projects/{project_id}/epics/{epic_id}
Authorization: Zoho-oauthtoken {access_token}
```

---

## Backlogs API

The backlog contains all user stories not yet assigned to a sprint.

### Get Backlog Items

```http
GET /api/v2/projects/{project_id}/backlog
Authorization: Zoho-oauthtoken {access_token}
```

**Query Parameters**:
- `priority` (string) - Filter by priority
- `assignee_id` (string) - Filter by assignee
- `page` (integer) - Page number
- `per_page` (integer) - Results per page

**Example**:
```javascript
const getBacklog = async (accessToken, projectId) => {
  const response = await axios.get(
    `https://sprintsapi.zoho.com/api/v2/projects/${projectId}/backlog`,
    {
      params: {
        per_page: 100
      },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

```python
def get_backlog(access_token, project_id):
    url = f'https://sprintsapi.zoho.com/api/v2/projects/{project_id}/backlog'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {'per_page': 100}
    response = requests.get(url, headers=headers, params=params)
    return response.json()
```

```deluge
// Deluge
response = invokeurl
[
    url: "https://sprintsapi.zoho.com/api/v2/projects/" + project_id + "/backlog"
    type: GET
    parameters: {"per_page": 100}
    headers: {"Authorization": "Zoho-oauthtoken " + access_token}
];
info response;
```

---

## Scrum Board API

The scrum board provides a visual representation of work in progress.

### Get Scrum Board

```http
GET /api/v2/projects/{project_id}/sprints/{sprint_id}/board
Authorization: Zoho-oauthtoken {access_token}
```

**Response**:
```json
{
  "status": "success",
  "data": {
    "sprint_id": "5432109876",
    "columns": [
      {
        "id": "todo",
        "name": "To Do",
        "story_count": 5,
        "stories": [
          {
            "id": "1234567890",
            "title": "User registration",
            "story_points": 3,
            "assignee_name": "Jane Smith"
          }
        ]
      },
      {
        "id": "in_progress",
        "name": "In Progress",
        "story_count": 3,
        "stories": []
      },
      {
        "id": "completed",
        "name": "Completed",
        "story_count": 8,
        "stories": []
      }
    ]
  }
}
```

**Example**:
```javascript
const getScrumBoard = async (accessToken, projectId, sprintId) => {
  const response = await axios.get(
    `https://sprintsapi.zoho.com/api/v2/projects/${projectId}/sprints/${sprintId}/board`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

```python
def get_scrum_board(access_token, project_id, sprint_id):
    url = f'https://sprintsapi.zoho.com/api/v2/projects/{project_id}/sprints/{sprint_id}/board'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    response = requests.get(url, headers=headers)
    return response.json()
```

---

## Teams API

Manage teams and team members.

### List Teams

```http
GET /api/v2/teams
Authorization: Zoho-oauthtoken {access_token}
```

### Get Team Members

```http
GET /api/v2/teams/{team_id}/members
Authorization: Zoho-oauthtoken {access_token}
```

**Example**:
```javascript
const getTeamMembers = async (accessToken, teamId) => {
  const response = await axios.get(
    `https://sprintsapi.zoho.com/api/v2/teams/${teamId}/members`,
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

## Webhooks

Set up real-time notifications for project events.

### Webhook Events

**Available Events**:
- `sprint.created` - New sprint created
- `sprint.started` - Sprint started
- `sprint.completed` - Sprint completed
- `story.created` - New user story created
- `story.updated` - User story updated
- `story.deleted` - User story deleted
- `task.created` - New task created
- `task.updated` - Task updated
- `task.completed` - Task completed

### Create Webhook

```http
POST /api/v2/webhooks
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "url": "https://yourdomain.com/webhook/zoho-sprints",
  "events": ["story.created", "story.updated", "sprint.completed"],
  "project_id": "9876543210",
  "is_active": true
}
```

**Example**:
```javascript
const createWebhook = async (accessToken, webhookData) => {
  const response = await axios.post(
    'https://sprintsapi.zoho.com/api/v2/webhooks',
    webhookData,
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
await createWebhook(accessToken, {
  url: 'https://yourdomain.com/webhook/zoho-sprints',
  events: ['story.created', 'story.updated'],
  project_id: '9876543210',
  is_active: true
});
```

```python
def create_webhook(access_token, webhook_data):
    url = 'https://sprintsapi.zoho.com/api/v2/webhooks'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    response = requests.post(url, json=webhook_data, headers=headers)
    return response.json()
```

### Webhook Payload Example

```json
{
  "event": "story.created",
  "timestamp": "2025-12-12T15:30:00Z",
  "project_id": "9876543210",
  "data": {
    "story_id": "1234567890",
    "title": "User can login with email",
    "sprint_id": "5432109876",
    "assignee_id": "2222222222",
    "story_points": 3,
    "priority": "high"
  }
}
```

### Handle Webhook in Your Application

```javascript
// Express.js webhook handler
const express = require('express');
const app = express();

app.post('/webhook/zoho-sprints', express.json(), (req, res) => {
  const { event, data } = req.body;

  switch(event) {
    case 'story.created':
      console.log('New story created:', data.title);
      // Handle new story
      break;

    case 'sprint.completed':
      console.log('Sprint completed:', data.sprint_id);
      // Handle sprint completion
      break;

    case 'task.completed':
      console.log('Task completed:', data.task_id);
      // Handle task completion
      break;
  }

  res.status(200).json({ received: true });
});
```

```python
# Flask webhook handler
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/webhook/zoho-sprints', methods=['POST'])
def handle_webhook():
    data = request.json
    event = data.get('event')
    payload = data.get('data')

    if event == 'story.created':
        print(f"New story created: {payload.get('title')}")
        # Handle new story

    elif event == 'sprint.completed':
        print(f"Sprint completed: {payload.get('sprint_id')}")
        # Handle sprint completion

    return jsonify({'received': True}), 200
```

---

## Rate Limits

### API Call Limits

Zoho Sprints enforces rate limits to ensure fair usage:

| Plan | API Calls per Minute | API Calls per Day |
|------|---------------------|-------------------|
| Free | 20 | 5,000 |
| Premium | 60 | 25,000 |
| Enterprise | 100 | 100,000 |

### Rate Limit Headers

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1702396800
```

- `X-RateLimit-Limit` - Total requests allowed per minute
- `X-RateLimit-Remaining` - Requests remaining in current window
- `X-RateLimit-Reset` - Timestamp when rate limit resets (Unix epoch)

### Handle Rate Limiting

```javascript
const makeAPICallWithRetry = async (apiCall, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await apiCall();
      return response;
    } catch (error) {
      if (error.response?.status === 429) {
        const resetTime = error.response.headers['x-ratelimit-reset'];
        const waitTime = (resetTime * 1000) - Date.now();

        console.log(`Rate limit exceeded. Waiting ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
};
```

```python
import time

def make_api_call_with_retry(api_call, max_retries=3):
    for i in range(max_retries):
        try:
            return api_call()
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 429:
                reset_time = int(e.response.headers.get('X-RateLimit-Reset', 0))
                wait_time = max(0, reset_time - int(time.time()))
                print(f"Rate limit exceeded. Waiting {wait_time}s...")
                time.sleep(wait_time)
                continue
            raise
    raise Exception('Max retries exceeded')
```

---

## Error Codes

### HTTP Status Codes

| Status Code | Meaning | Common Causes |
|-------------|---------|---------------|
| 200 | OK | Successful request |
| 201 | Created | Resource successfully created |
| 204 | No Content | Successful deletion |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Invalid or expired access token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource does not exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |

### Error Response Structure

```json
{
  "status": "error",
  "code": "INVALID_SPRINT_DATE",
  "message": "Sprint start date cannot be in the past",
  "details": {
    "field": "start_date",
    "value": "2024-01-01"
  }
}
```

### Common Error Codes

| Error Code | Description | Solution |
|------------|-------------|----------|
| INVALID_TOKEN | Access token is invalid or expired | Refresh the access token |
| INVALID_PROJECT_ID | Project ID does not exist | Verify project ID |
| INVALID_SPRINT_DATE | Invalid sprint date range | Check date format and range |
| STORY_POINTS_INVALID | Story points must be positive | Use positive integer |
| SPRINT_ACTIVE | Cannot modify active sprint | Complete sprint first |
| DUPLICATE_STORY | Story with same title exists | Use unique title |
| PERMISSION_DENIED | User lacks required permissions | Grant appropriate permissions |
| RATE_LIMIT_EXCEEDED | API rate limit exceeded | Implement rate limiting |

---

## Code Examples

### Complete Sprint Workflow

```javascript
// Complete workflow: Create sprint, add stories, start sprint, track progress
const completeSprintWorkflow = async (accessToken, projectId) => {
  try {
    // Step 1: Create new sprint
    const sprint = await createSprint(accessToken, projectId, {
      name: 'Sprint 26',
      description: 'Focus on user dashboard',
      start_date: '2025-12-15',
      end_date: '2025-12-28',
      goal: 'Complete user dashboard with analytics'
    });

    console.log('Sprint created:', sprint.data.id);

    // Step 2: Create user stories for the sprint
    const stories = [
      {
        title: 'User can view analytics dashboard',
        story_points: 5,
        priority: 'high',
        sprint_id: sprint.data.id
      },
      {
        title: 'User can customize dashboard widgets',
        story_points: 8,
        priority: 'medium',
        sprint_id: sprint.data.id
      },
      {
        title: 'User can export dashboard data',
        story_points: 3,
        priority: 'low',
        sprint_id: sprint.data.id
      }
    ];

    for (const storyData of stories) {
      const story = await createUserStory(accessToken, projectId, storyData);
      console.log('Story created:', story.data.title);
    }

    // Step 3: Start the sprint
    await startSprint(accessToken, projectId, sprint.data.id);
    console.log('Sprint started');

    // Step 4: Get scrum board to view progress
    const board = await getScrumBoard(accessToken, projectId, sprint.data.id);
    console.log('Board columns:', board.data.columns.length);

    console.log('Sprint workflow completed successfully');

  } catch (error) {
    console.error('Error in sprint workflow:', error.response?.data || error.message);
  }
};
```

### Generate Sprint Report

```python
import requests
from datetime import datetime

def generate_sprint_report(access_token, project_id, sprint_id):
    """Generate comprehensive sprint report"""

    # Get sprint details
    sprint_url = f'https://sprintsapi.zoho.com/api/v2/projects/{project_id}/sprints/{sprint_id}'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }

    sprint_response = requests.get(sprint_url, headers=headers)
    sprint = sprint_response.json()['data']

    # Get all stories in sprint
    stories_url = f'https://sprintsapi.zoho.com/api/v2/projects/{project_id}/stories'
    params = {'sprint_id': sprint_id, 'per_page': 100}
    stories_response = requests.get(stories_url, headers=headers, params=params)
    stories = stories_response.json()['data']

    # Calculate metrics
    total_stories = len(stories)
    completed_stories = len([s for s in stories if s['status'] == 'completed'])
    total_points = sum(s.get('story_points', 0) for s in stories)
    completed_points = sum(s.get('story_points', 0) for s in stories if s['status'] == 'completed')

    completion_rate = (completed_stories / total_stories * 100) if total_stories > 0 else 0
    points_completion = (completed_points / total_points * 100) if total_points > 0 else 0

    # Generate report
    report = {
        'sprint_name': sprint['name'],
        'sprint_goal': sprint.get('goal', 'N/A'),
        'start_date': sprint['start_date'],
        'end_date': sprint['end_date'],
        'status': sprint['status'],
        'metrics': {
            'total_stories': total_stories,
            'completed_stories': completed_stories,
            'completion_rate': f'{completion_rate:.1f}%',
            'total_story_points': total_points,
            'completed_story_points': completed_points,
            'points_completion_rate': f'{points_completion:.1f}%',
            'velocity': completed_points if sprint['status'] == 'completed' else 'In progress'
        },
        'stories_by_priority': {
            'high': len([s for s in stories if s.get('priority') == 'high']),
            'medium': len([s for s in stories if s.get('priority') == 'medium']),
            'low': len([s for s in stories if s.get('priority') == 'low'])
        }
    }

    return report

# Usage
report = generate_sprint_report(access_token, project_id, sprint_id)
print(f"Sprint: {report['sprint_name']}")
print(f"Completion Rate: {report['metrics']['completion_rate']}")
print(f"Story Points Completed: {report['metrics']['completed_story_points']}/{report['metrics']['total_story_points']}")
```

---

## Best Practices

### 1. Sprint Planning

**Create Realistic Sprints**:
```javascript
// Good - 2-week sprint with reasonable story points
const sprint = {
  name: 'Sprint 26',
  start_date: '2025-12-15',
  end_date: '2025-12-28',  // 2 weeks
  goal: 'Complete authentication module'
};

// Bad - Sprint too long or unrealistic goals
const badSprint = {
  name: 'Sprint 1',
  start_date: '2025-12-15',
  end_date: '2026-03-15',  // 3 months - too long!
  goal: 'Build entire application'
};
```

### 2. Story Point Estimation

**Use Consistent Scale**:
- 1 point: < 2 hours of work
- 3 points: 2-4 hours
- 5 points: 4-8 hours (half day)
- 8 points: 1-2 days
- 13 points: Story is too large, break it down

### 3. Error Handling

```javascript
const safeAPICall = async (apiFunction, ...args) => {
  try {
    return await apiFunction(...args);
  } catch (error) {
    if (error.response?.status === 401) {
      // Refresh token and retry
      await refreshToken();
      return await apiFunction(...args);
    }

    if (error.response?.status === 429) {
      // Handle rate limiting
      const resetTime = error.response.headers['x-ratelimit-reset'];
      await waitUntil(resetTime);
      return await apiFunction(...args);
    }

    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
};
```

### 4. Batch Operations

```javascript
// Process stories in batches
const batchSize = 10;
const stories = [...]; // Array of story data

for (let i = 0; i < stories.length; i += batchSize) {
  const batch = stories.slice(i, i + batchSize);
  await Promise.all(
    batch.map(data => createUserStory(accessToken, projectId, data))
  );
  // Delay between batches to respect rate limits
  await new Promise(resolve => setTimeout(resolve, 1000));
}
```

### 5. Webhook Security

```javascript
const crypto = require('crypto');

const validateWebhookSignature = (payload, signature, secret) => {
  const computedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');

  return computedSignature === signature;
};
```

---

## Data Centers

Zoho Sprints operates in multiple data centers:

| Data Center | Base URL |
|-------------|----------|
| US | https://sprintsapi.zoho.com |
| EU | https://sprintsapi.zoho.eu |
| IN | https://sprintsapi.zoho.in |
| AU | https://sprintsapi.zoho.com.au |

---

## Additional Resources

- [Official Zoho Sprints API Documentation](https://www.zoho.com/sprints/api/)
- [Zoho API Console](https://api-console.zoho.com/)
- [Developer Community](https://help.zoho.com/portal/en/community/sprints)
- [Status Page](https://status.zoho.com/)

---

**Last Updated**: December 2025
**API Version**: v2
