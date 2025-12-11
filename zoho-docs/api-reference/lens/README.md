# Zoho Lens API Reference

## Overview

Zoho Lens is an augmented reality (AR) based remote assistance platform that enables technicians and experts to provide real-time visual guidance. The API provides programmatic access to sessions, annotations, recordings, and collaboration features.

**Current API Version**: v1
**Base URL**: `https://lens.zoho.com/api/v1/`
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
- [Best Practices](#best-practices)

---

## API Modules

### 1. Sessions
**Purpose**: Manage AR remote assistance sessions

**Endpoints**:
```http
GET    /sessions                      # List all sessions
GET    /sessions/{session_id}         # Get session details
POST   /sessions                      # Create/initiate session
PUT    /sessions/{session_id}         # Update session
DELETE /sessions/{session_id}         # End/delete session
GET    /sessions/active               # Get active sessions
GET    /sessions/{session_id}/participants # Get session participants
POST   /sessions/{session_id}/invite  # Invite participant
```

**Session States**:
- Initiated - Session created, waiting for participants
- Active - Session in progress
- Paused - Session temporarily paused
- Completed - Session ended normally
- Cancelled - Session cancelled
- Failed - Session failed due to error

**Session Types**:
- One-to-One - Direct session between two users
- Group - Multiple participants
- Scheduled - Pre-scheduled session
- Instant - On-demand session

**Example - Create Session**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const createSession = async (accessToken) => {
  const response = await axios.post(
    'https://lens.zoho.com/api/v1/sessions',
    {
      title: 'Factory Equipment Repair - Unit #A12',
      description: 'Remote assistance for hydraulic pump issue',
      type: 'One-to-One',
      scheduled_time: '2025-01-15T14:00:00Z',
      duration: 3600, // seconds
      participants: [
        {
          email: 'technician@company.com',
          role: 'technician'
        },
        {
          email: 'expert@company.com',
          role: 'expert'
        }
      ],
      settings: {
        recording_enabled: true,
        ar_annotations: true,
        screen_share: true,
        file_share: true
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
```

```python
# Python
import requests

def create_session(access_token):
    url = 'https://lens.zoho.com/api/v1/sessions'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'title': 'Factory Equipment Repair - Unit #A12',
        'description': 'Remote assistance for hydraulic pump issue',
        'type': 'One-to-One',
        'scheduled_time': '2025-01-15T14:00:00Z',
        'duration': 3600,
        'participants': [
            {
                'email': 'technician@company.com',
                'role': 'technician'
            },
            {
                'email': 'expert@company.com',
                'role': 'expert'
            }
        ],
        'settings': {
            'recording_enabled': True,
            'ar_annotations': True,
            'screen_share': True,
            'file_share': True
        }
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

```deluge
// Deluge
session_data = {
    "title": "Factory Equipment Repair - Unit #A12",
    "description": "Remote assistance for hydraulic pump issue",
    "type": "One-to-One",
    "scheduled_time": "2025-01-15T14:00:00Z",
    "duration": 3600,
    "participants": [
        {
            "email": "technician@company.com",
            "role": "technician"
        },
        {
            "email": "expert@company.com",
            "role": "expert"
        }
    ],
    "settings": {
        "recording_enabled": true,
        "ar_annotations": true,
        "screen_share": true,
        "file_share": true
    }
};

response = invokeurl
[
    url: "https://lens.zoho.com/api/v1/sessions"
    type: POST
    parameters: session_data.toString()
    connection: "zoho_oauth"
];
info response;
```

**Response**:
```json
{
  "session": {
    "id": "123456000000234567",
    "title": "Factory Equipment Repair - Unit #A12",
    "description": "Remote assistance for hydraulic pump issue",
    "type": "One-to-One",
    "state": "Initiated",
    "scheduled_time": "2025-01-15T14:00:00Z",
    "duration": 3600,
    "join_url": "https://lens.zoho.com/join/abc123xyz",
    "session_code": "ABC-123-XYZ",
    "participants": [
      {
        "id": "123456000000098765",
        "email": "technician@company.com",
        "role": "technician",
        "status": "invited"
      },
      {
        "id": "123456000000098766",
        "email": "expert@company.com",
        "role": "expert",
        "status": "invited"
      }
    ],
    "created_time": "2025-01-15T10:00:00Z",
    "created_by": {
      "id": "123456000000098767",
      "name": "Admin User",
      "email": "admin@company.com"
    }
  }
}
```

**Example - Get Active Sessions**:
```javascript
// JavaScript/Node.js
const getActiveSessions = async (accessToken) => {
  const response = await axios.get(
    'https://lens.zoho.com/api/v1/sessions/active',
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data.sessions;
};
```

**Example - End Session**:
```javascript
// JavaScript/Node.js
const endSession = async (accessToken, sessionId) => {
  const response = await axios.put(
    `https://lens.zoho.com/api/v1/sessions/${sessionId}`,
    {
      state: 'Completed',
      end_reason: 'Issue resolved successfully',
      resolution_notes: 'Replaced hydraulic fluid and checked all connections. Equipment is now operating normally.'
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

### 2. Annotations
**Purpose**: Create and manage AR annotations during sessions

**Endpoints**:
```http
GET    /sessions/{session_id}/annotations              # Get all annotations
GET    /sessions/{session_id}/annotations/{annotation_id} # Get annotation
POST   /sessions/{session_id}/annotations              # Create annotation
PUT    /sessions/{session_id}/annotations/{annotation_id} # Update annotation
DELETE /sessions/{session_id}/annotations/{annotation_id} # Delete annotation
```

**Annotation Types**:
- Arrow - Directional pointer
- Circle - Highlight circular area
- Rectangle - Highlight rectangular area
- Text - Text label
- Freehand - Free drawing
- Measurement - Distance/dimension measurement
- 3D Model - 3D object overlay
- Image - Image overlay

**Example - Create Annotation**:
```javascript
// JavaScript/Node.js
const createAnnotation = async (accessToken, sessionId) => {
  const response = await axios.post(
    `https://lens.zoho.com/api/v1/sessions/${sessionId}/annotations`,
    {
      type: 'Arrow',
      position: {
        x: 320,
        y: 480,
        z: 0
      },
      rotation: {
        x: 0,
        y: 0,
        z: 45
      },
      scale: 1.0,
      color: '#FF0000',
      label: 'Check this connection',
      duration: 30, // seconds, 0 = permanent
      created_by: 'expert@company.com'
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
def create_annotation(access_token, session_id):
    url = f'https://lens.zoho.com/api/v1/sessions/{session_id}/annotations'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'type': 'Arrow',
        'position': {
            'x': 320,
            'y': 480,
            'z': 0
        },
        'rotation': {
            'x': 0,
            'y': 0,
            'z': 45
        },
        'scale': 1.0,
        'color': '#FF0000',
        'label': 'Check this connection',
        'duration': 30,
        'created_by': 'expert@company.com'
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

**Response**:
```json
{
  "annotation": {
    "id": "123456000000345678",
    "session_id": "123456000000234567",
    "type": "Arrow",
    "position": {
      "x": 320,
      "y": 480,
      "z": 0
    },
    "rotation": {
      "x": 0,
      "y": 0,
      "z": 45
    },
    "scale": 1.0,
    "color": "#FF0000",
    "label": "Check this connection",
    "duration": 30,
    "created_time": "2025-01-15T14:15:30Z",
    "created_by": {
      "email": "expert@company.com",
      "name": "Expert User"
    },
    "expires_at": "2025-01-15T14:16:00Z"
  }
}
```

---

### 3. Recordings
**Purpose**: Access and manage session recordings

**Endpoints**:
```http
GET    /sessions/{session_id}/recordings       # Get session recordings
GET    /recordings/{recording_id}              # Get recording details
GET    /recordings/{recording_id}/download     # Download recording
DELETE /recordings/{recording_id}              # Delete recording
POST   /recordings/{recording_id}/share        # Share recording
GET    /recordings                             # List all recordings
```

**Recording Formats**:
- MP4 - Standard video format
- WebM - Web-optimized format
- Annotated - Video with AR annotations overlaid

**Example - Get Session Recordings**:
```javascript
// JavaScript/Node.js
const getSessionRecordings = async (accessToken, sessionId) => {
  const response = await axios.get(
    `https://lens.zoho.com/api/v1/sessions/${sessionId}/recordings`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data.recordings;
};
```

**Example - Download Recording**:
```javascript
// JavaScript/Node.js
const downloadRecording = async (accessToken, recordingId) => {
  const response = await axios.get(
    `https://lens.zoho.com/api/v1/recordings/${recordingId}/download`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      },
      responseType: 'stream'
    }
  );
  return response.data;
};
```

```python
# Python
def download_recording(access_token, recording_id, output_path):
    url = f'https://lens.zoho.com/api/v1/recordings/{recording_id}/download'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    response = requests.get(url, headers=headers, stream=True)

    with open(output_path, 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)

    return output_path
```

---

### 4. Participants
**Purpose**: Manage session participants

**Endpoints**:
```http
GET    /sessions/{session_id}/participants              # List participants
POST   /sessions/{session_id}/participants              # Add participant
DELETE /sessions/{session_id}/participants/{participant_id} # Remove participant
PUT    /sessions/{session_id}/participants/{participant_id} # Update participant role
```

**Participant Roles**:
- Expert - Remote expert providing guidance
- Technician - On-site technician receiving guidance
- Observer - View-only participant
- Moderator - Session moderator with admin controls

**Example - Add Participant**:
```javascript
// JavaScript/Node.js
const addParticipant = async (accessToken, sessionId) => {
  const response = await axios.post(
    `https://lens.zoho.com/api/v1/sessions/${sessionId}/participants`,
    {
      email: 'supervisor@company.com',
      role: 'Observer',
      notify: true
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

### 5. Files & Media
**Purpose**: Share files and media during sessions

**Endpoints**:
```http
GET    /sessions/{session_id}/files           # List shared files
POST   /sessions/{session_id}/files           # Upload file
GET    /sessions/{session_id}/files/{file_id} # Get file details
DELETE /sessions/{session_id}/files/{file_id} # Delete file
GET    /sessions/{session_id}/files/{file_id}/download # Download file
```

**Supported File Types**:
- Images (JPEG, PNG, GIF)
- PDFs
- Videos (MP4, WebM)
- 3D Models (OBJ, GLTF, FBX)
- Documents (DOC, DOCX, XLS, XLSX)

**Example - Upload File**:
```javascript
// JavaScript/Node.js
const FormData = require('form-data');
const fs = require('fs');

const uploadFile = async (accessToken, sessionId, filePath) => {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));
  formData.append('description', 'Equipment diagram');

  const response = await axios.post(
    `https://lens.zoho.com/api/v1/sessions/${sessionId}/files`,
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
def upload_file(access_token, session_id, file_path):
    url = f'https://lens.zoho.com/api/v1/sessions/{session_id}/files'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    files = {
        'file': open(file_path, 'rb')
    }
    data = {
        'description': 'Equipment diagram'
    }
    response = requests.post(url, headers=headers, files=files, data=data)
    return response.json()
```

---

### 6. Chat Messages
**Purpose**: Send and receive chat messages during sessions

**Endpoints**:
```http
GET    /sessions/{session_id}/messages        # Get chat messages
POST   /sessions/{session_id}/messages        # Send message
DELETE /sessions/{session_id}/messages/{message_id} # Delete message
```

**Example - Send Chat Message**:
```javascript
// JavaScript/Node.js
const sendMessage = async (accessToken, sessionId) => {
  const response = await axios.post(
    `https://lens.zoho.com/api/v1/sessions/${sessionId}/messages`,
    {
      message: 'Try tightening the valve on the left side',
      type: 'text',
      priority: 'normal'
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

### 7. Session Templates
**Purpose**: Create reusable session templates

**Endpoints**:
```http
GET    /templates                    # List templates
GET    /templates/{template_id}      # Get template details
POST   /templates                    # Create template
PUT    /templates/{template_id}      # Update template
DELETE /templates/{template_id}      # Delete template
POST   /sessions/from-template       # Create session from template
```

**Example - Create Template**:
```javascript
// JavaScript/Node.js
const createTemplate = async (accessToken) => {
  const response = await axios.post(
    'https://lens.zoho.com/api/v1/templates',
    {
      name: 'Equipment Maintenance Standard',
      description: 'Standard template for equipment maintenance sessions',
      default_duration: 3600,
      settings: {
        recording_enabled: true,
        ar_annotations: true,
        screen_share: true,
        file_share: true
      },
      checklist: [
        'Verify equipment model and serial number',
        'Document current state with photos',
        'Identify issue and root cause',
        'Implement solution',
        'Verify resolution',
        'Document solution for future reference'
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

### 8. Analytics
**Purpose**: Get session analytics and statistics

**Endpoints**:
```http
GET /analytics/sessions              # Session statistics
GET /analytics/users                 # User statistics
GET /analytics/duration              # Duration analytics
GET /analytics/resolution-time       # Resolution time analytics
GET /analytics/annotations           # Annotation usage statistics
```

**Example - Get Session Statistics**:
```javascript
// JavaScript/Node.js
const getSessionStatistics = async (accessToken) => {
  const response = await axios.get(
    'https://lens.zoho.com/api/v1/analytics/sessions',
    {
      params: {
        from_date: '2025-01-01',
        to_date: '2025-01-31',
        group_by: 'day'
      },
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
  "statistics": {
    "total_sessions": 245,
    "active_sessions": 12,
    "completed_sessions": 230,
    "cancelled_sessions": 3,
    "average_duration": 1847,
    "total_duration": 452515,
    "by_day": [
      {
        "date": "2025-01-15",
        "sessions": 8,
        "avg_duration": 1920,
        "total_duration": 15360
      }
    ],
    "by_user": [
      {
        "user_email": "expert@company.com",
        "sessions": 45,
        "avg_duration": 2100
      }
    ]
  }
}
```

---

### 9. Webhooks
**Purpose**: Receive real-time notifications for session events

**Endpoints**:
```http
GET    /webhooks                     # List webhooks
POST   /webhooks                     # Create webhook
PUT    /webhooks/{webhook_id}        # Update webhook
DELETE /webhooks/{webhook_id}        # Delete webhook
GET    /webhooks/{webhook_id}/test   # Test webhook
```

**Webhook Events**:
- `session.created` - Session created
- `session.started` - Session started
- `session.completed` - Session completed
- `session.cancelled` - Session cancelled
- `participant.joined` - Participant joined
- `participant.left` - Participant left
- `annotation.created` - Annotation created
- `recording.ready` - Recording ready for download

**Example - Create Webhook**:
```javascript
// JavaScript/Node.js
const createWebhook = async (accessToken) => {
  const response = await axios.post(
    'https://lens.zoho.com/api/v1/webhooks',
    {
      url: 'https://api.yourcompany.com/webhooks/lens',
      events: [
        'session.created',
        'session.completed',
        'recording.ready'
      ],
      active: true,
      secret: 'your-webhook-secret-key'
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
  "event": "session.completed",
  "timestamp": "2025-01-15T15:30:00Z",
  "data": {
    "session_id": "123456000000234567",
    "title": "Factory Equipment Repair - Unit #A12",
    "duration": 1847,
    "participants": 2,
    "annotations_count": 15,
    "recording_available": true
  }
}
```

---

### 10. Users
**Purpose**: Manage Lens users and permissions

**Endpoints**:
```http
GET    /users                       # List all users
GET    /users/{user_id}             # Get user details
POST   /users                       # Add user
PUT    /users/{user_id}             # Update user
DELETE /users/{user_id}             # Remove user
GET    /users/current               # Get current user
GET    /users/{user_id}/sessions    # Get user's sessions
```

**User Roles**:
- Administrator
- Expert
- Technician
- Viewer

**Example - Get Current User**:
```javascript
// JavaScript/Node.js
const getCurrentUser = async (accessToken) => {
  const response = await axios.get(
    'https://lens.zoho.com/api/v1/users/current',
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data.user;
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
  scope=ZohoLens.sessions.ALL,ZohoLens.recordings.READ&
  client_id={client_id}&
  response_type=code&
  access_type=offline&
  redirect_uri={redirect_uri}
```

**Available Scopes**:
- `ZohoLens.sessions.ALL` - Full access to sessions
- `ZohoLens.sessions.READ` - Read-only access to sessions
- `ZohoLens.sessions.CREATE` - Create sessions
- `ZohoLens.sessions.UPDATE` - Update sessions
- `ZohoLens.sessions.DELETE` - Delete sessions
- `ZohoLens.annotations.ALL` - Full access to annotations
- `ZohoLens.recordings.ALL` - Full access to recordings
- `ZohoLens.recordings.READ` - Read-only access to recordings
- `ZohoLens.users.ALL` - Manage users
- `ZohoLens.analytics.READ` - Read analytics data

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
| Professional | 25,000 | 250 |
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
X-RateLimit-Limit: 250
X-RateLimit-Remaining: 187
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
| 503 | Service Unavailable | Service temporarily unavailable |

### Zoho Lens Error Codes

| Code | Message | Description | Solution |
|------|---------|-------------|----------|
| 9001 | Invalid Request | Request format is invalid | Check JSON format |
| 9002 | Authentication Failed | Invalid access token | Refresh access token |
| 9003 | Access Denied | Insufficient permissions | Check OAuth scopes |
| 9004 | Session Not Found | Session doesn't exist | Verify session ID |
| 9005 | Session Limit Reached | Maximum concurrent sessions | Wait for session to end |
| 9006 | Participant Limit Reached | Maximum participants reached | Remove participants |
| 9007 | Recording Not Available | Recording not ready | Wait for processing |
| 9008 | Invalid Annotation | Annotation data is invalid | Check annotation format |
| 9009 | File Too Large | Uploaded file exceeds limit | Reduce file size |
| 9010 | Unsupported File Type | File type not supported | Use supported format |

### Error Response Format

```json
{
  "error": {
    "code": 9004,
    "message": "Session Not Found",
    "details": "The session ID 123456 does not exist or has been deleted"
  }
}
```

---

## Common Operations

### 1. Complete Session Workflow

```javascript
// JavaScript/Node.js - Complete Session Workflow
const completeSessionWorkflow = async (accessToken) => {
  try {
    // 1. Create session
    const session = await createSession(accessToken);
    const sessionId = session.session.id;
    console.log('Session created:', sessionId);
    console.log('Join URL:', session.session.join_url);

    // 2. Wait for session to start (simulate)
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 3. Create annotations during session
    await createAnnotation(accessToken, sessionId);
    console.log('Annotation created');

    // 4. Send chat message
    await sendMessage(accessToken, sessionId);
    console.log('Message sent');

    // 5. Upload reference file
    await uploadFile(accessToken, sessionId, './equipment_diagram.pdf');
    console.log('File uploaded');

    // 6. End session
    await endSession(accessToken, sessionId);
    console.log('Session ended');

    // 7. Wait for recording to process
    await new Promise(resolve => setTimeout(resolve, 60000));

    // 8. Download recording
    const recordings = await getSessionRecordings(accessToken, sessionId);
    if (recordings.length > 0) {
      await downloadRecording(accessToken, recordings[0].id);
      console.log('Recording downloaded');
    }

    return { success: true, session_id: sessionId };

  } catch (error) {
    console.error('Workflow error:', error.response?.data || error.message);
    throw error;
  }
};
```

### 2. Monitor Active Sessions

```python
# Python - Monitor Active Sessions
import requests
import time

def monitor_active_sessions(access_token, interval_seconds=60):
    while True:
        try:
            url = 'https://lens.zoho.com/api/v1/sessions/active'
            headers = {
                'Authorization': f'Zoho-oauthtoken {access_token}'
            }
            response = requests.get(url, headers=headers)
            sessions = response.json()['sessions']

            print(f'Active sessions: {len(sessions)}')

            for session in sessions:
                duration = int(time.time()) - int(session['start_time'])
                print(f"  {session['title']} - {duration}s - {len(session['participants'])} participants")

            time.sleep(interval_seconds)

        except Exception as e:
            print(f'Monitoring error: {str(e)}')
            time.sleep(interval_seconds)
```

### 3. Session Analytics Report

```javascript
// JavaScript/Node.js - Generate Session Analytics Report
const generateSessionReport = async (accessToken, startDate, endDate) => {
  try {
    // Get session statistics
    const stats = await axios.get(
      'https://lens.zoho.com/api/v1/analytics/sessions',
      {
        params: {
          from_date: startDate,
          to_date: endDate
        },
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`
        }
      }
    );

    // Get resolution time analytics
    const resolutionTime = await axios.get(
      'https://lens.zoho.com/api/v1/analytics/resolution-time',
      {
        params: {
          from_date: startDate,
          to_date: endDate
        },
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`
        }
      }
    );

    const report = {
      period: {
        from: startDate,
        to: endDate
      },
      summary: {
        total_sessions: stats.data.statistics.total_sessions,
        completed_sessions: stats.data.statistics.completed_sessions,
        cancelled_sessions: stats.data.statistics.cancelled_sessions,
        average_duration: Math.round(stats.data.statistics.average_duration / 60), // minutes
        average_resolution_time: Math.round(resolutionTime.data.average / 60) // minutes
      },
      top_experts: stats.data.statistics.by_user
        .sort((a, b) => b.sessions - a.sessions)
        .slice(0, 5),
      daily_breakdown: stats.data.statistics.by_day
    };

    return report;

  } catch (error) {
    console.error('Report generation error:', error.response?.data || error.message);
    throw error;
  }
};
```

### 4. Automated Session Recording Archive

```deluge
// Deluge - Archive Old Session Recordings
// This can be run as a scheduled function to archive old recordings

days_to_keep = 90;
cutoff_date = zoho.currentdate.subDay(days_to_keep).toString("yyyy-MM-dd");

// Get all recordings
response = invokeurl
[
    url: "https://lens.zoho.com/api/v1/recordings"
    type: GET
    connection: "zoho_oauth"
];

recordings = response.get("recordings");

archived_count = 0;
for each recording in recordings {
    recording_date = recording.get("created_time").toDate();

    if(recording_date < cutoff_date.toDate()) {
        // Download recording to external storage
        download_response = invokeurl
        [
            url: "https://lens.zoho.com/api/v1/recordings/" + recording.get("id") + "/download"
            type: GET
            connection: "zoho_oauth"
        ];

        // Upload to external storage (example: AWS S3)
        upload_response = invokeurl
        [
            url: "https://your-storage-service.com/upload"
            type: POST
            parameters: download_response
            connection: "external_storage_connection"
        ];

        if(upload_response.get("status") == "success") {
            // Delete from Lens
            delete_response = invokeurl
            [
                url: "https://lens.zoho.com/api/v1/recordings/" + recording.get("id")
                type: DELETE
                connection: "zoho_oauth"
            ];

            archived_count = archived_count + 1;
            info "Archived recording: " + recording.get("session_title");
        }
    }
}

info "Archived " + archived_count + " recordings";
```

---

## Best Practices

### 1. Session Management

**Pre-schedule Important Sessions**:
```javascript
const scheduleImportantSession = async (accessToken, scheduledTime) => {
  // Schedule 24 hours in advance with reminders
  const session = await createSession(accessToken, {
    scheduled_time: scheduledTime,
    send_reminders: true,
    reminder_intervals: [24 * 60, 60, 15] // hours before: 24h, 1h, 15min
  });

  return session;
};
```

### 2. Recording Management

**Always Enable Recording for Critical Sessions**:
```javascript
const createCriticalSession = async (accessToken, sessionData) => {
  return await createSession(accessToken, {
    ...sessionData,
    settings: {
      recording_enabled: true,
      recording_quality: 'high',
      auto_save: true
    }
  });
};
```

### 3. Annotation Best Practices

**Use Appropriate Annotation Types**:
```javascript
const addInstructionalAnnotation = async (accessToken, sessionId, instructionType) => {
  const annotationTypes = {
    'point': { type: 'Arrow', color: '#FF0000' },
    'area': { type: 'Circle', color: '#00FF00' },
    'measure': { type: 'Measurement', color: '#0000FF' },
    'note': { type: 'Text', color: '#FFFF00' }
  };

  const config = annotationTypes[instructionType] || annotationTypes['point'];

  return await createAnnotation(accessToken, sessionId, config);
};
```

### 4. Error Handling

**Implement Robust Error Handling**:
```javascript
const handleLensError = (error) => {
  if (error.response) {
    const { status, data } = error.response;

    switch (status) {
      case 404:
        console.error('Session not found. It may have been deleted.');
        break;

      case 9005:
        console.error('Session limit reached. Please wait for another session to end.');
        break;

      case 9009:
        console.error('File too large. Maximum size is 100MB.');
        break;

      default:
        console.error(`Error: ${data.error?.message}`);
    }
  }
};
```

---

## Additional Resources

- [Official Zoho Lens API Documentation](https://www.zoho.com/lens/api/)
- [API Console](https://api-console.zoho.com/)
- [Zoho Lens Help](https://www.zoho.com/lens/help/)
- [AR Best Practices Guide](https://www.zoho.com/lens/ar-guidelines/)
- [Developer Forums](https://help.zoho.com/portal/en/community/lens)

---

**Last Updated**: December 2025
**API Version**: v1
