# Zoho Meeting API Reference

## Overview

Zoho Meeting is a video conferencing and webinar platform that enables online meetings, screen sharing, and collaboration. The API provides comprehensive access to meeting scheduling, participant management, recordings, and analytics.

**Current API Version**: v2
**Base URL**: `https://meeting.zoho.com/api/v2/`
**Protocol**: REST
**Data Format**: JSON
**Authentication**: OAuth 2.0

---

## Quick Links

- [Authentication](#authentication)
- [Meetings API](#meetings-api)
- [Participants API](#participants-api)
- [Recordings API](#recordings-api)
- [Sessions API](#sessions-api)
- [Webinars API](#webinars-api)
- [Registrations API](#registrations-api)
- [Reports API](#reports-api)
- [Settings API](#settings-api)
- [Rate Limits](#rate-limits)
- [Error Codes](#error-codes)
- [Code Examples](#code-examples)
- [Best Practices](#best-practices)

---

## REST API Principles

### HTTP Methods

Zoho Meeting API follows standard REST conventions:

| Method | Purpose | Idempotent |
|--------|---------|------------|
| GET | Retrieve resources | Yes |
| POST | Create new resources | No |
| PUT | Update resources | Yes |
| PATCH | Partial update | No |
| DELETE | Remove resources | Yes |

### Request Format

```http
GET /api/v2/meetings
Host: meeting.zoho.com
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json
```

### Response Format

**Success Response**:
```json
{
  "status": "success",
  "data": {
    "meeting_key": "1234567890",
    "topic": "Product Review Meeting",
    "start_time": "2025-12-15T14:00:00Z"
  }
}
```

**List Response**:
```json
{
  "status": "success",
  "data": [
    { "meeting_key": "1234567890", "topic": "Product Review" },
    { "meeting_key": "1234567891", "topic": "Team Standup" }
  ],
  "pagination": {
    "page": 1,
    "per_page": 50,
    "total": 100,
    "has_more": true
  }
}
```

**Error Response**:
```json
{
  "status": "error",
  "error": {
    "code": "INVALID_MEETING_KEY",
    "message": "The specified meeting key does not exist"
  }
}
```

---

## Authentication

### OAuth 2.0 Flow

Zoho Meeting uses OAuth 2.0 for authentication. All API requests require a valid access token.

**Step 1: Register Your Application**
- Go to [Zoho API Console](https://api-console.zoho.com/)
- Create a new Client (Server-based or Self-client)
- Note your Client ID and Client Secret
- Set the authorized redirect URI

**Step 2: Generate Authorization Code**

```http
GET https://accounts.zoho.com/oauth/v2/auth?
  scope=ZohoMeeting.meeting.ALL,ZohoMeeting.recording.READ&
  client_id={client_id}&
  response_type=code&
  access_type=offline&
  redirect_uri={redirect_uri}
```

**Available Scopes**:
- `ZohoMeeting.meeting.ALL` - Full access to meetings
- `ZohoMeeting.meeting.CREATE` - Create meetings
- `ZohoMeeting.meeting.READ` - Read meetings
- `ZohoMeeting.meeting.UPDATE` - Update meetings
- `ZohoMeeting.meeting.DELETE` - Delete meetings
- `ZohoMeeting.recording.ALL` - Full access to recordings
- `ZohoMeeting.recording.READ` - Read recordings
- `ZohoMeeting.webinar.ALL` - Full access to webinars
- `ZohoMeeting.report.READ` - Read reports

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

## Meetings API

Create and manage online meetings.

### Meeting Object Structure

```json
{
  "meeting_key": "1234567890",
  "topic": "Q4 Planning Meeting",
  "agenda": "Discuss Q4 objectives and key results",
  "start_time": "2025-12-15T14:00:00Z",
  "duration": 60,
  "timezone": "America/New_York",
  "presenter": {
    "email": "john.doe@company.com",
    "name": "John Doe"
  },
  "meeting_url": "https://meeting.zoho.com/meeting/join/abc123xyz",
  "meeting_password": "secure123",
  "is_recurring": false,
  "recording_enabled": true,
  "participant_limit": 100,
  "settings": {
    "allow_participant_screen_share": true,
    "mute_participants_on_entry": false,
    "enable_waiting_room": true,
    "allow_recording": true
  },
  "status": "scheduled",
  "created_time": "2025-12-10T10:00:00Z",
  "modified_time": "2025-12-12T09:30:00Z"
}
```

### List Meetings

```http
GET /api/v2/meetings
Authorization: Zoho-oauthtoken {access_token}
```

**Query Parameters**:
- `page` (integer) - Page number (default: 1)
- `per_page` (integer) - Results per page (max: 100, default: 50)
- `status` (string) - Filter: "scheduled", "completed", "cancelled"
- `from_date` (string) - ISO 8601 date format
- `to_date` (string) - ISO 8601 date format

**Example**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const listMeetings = async (accessToken, filters = {}) => {
  const response = await axios.get(
    'https://meeting.zoho.com/api/v2/meetings',
    {
      params: {
        page: 1,
        per_page: 50,
        status: filters.status || 'scheduled',
        from_date: filters.fromDate,
        to_date: filters.toDate
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

def list_meetings(access_token, filters=None):
    url = 'https://meeting.zoho.com/api/v2/meetings'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'page': 1,
        'per_page': 50
    }
    if filters:
        params.update(filters)
    response = requests.get(url, headers=headers, params=params)
    return response.json()
```

```deluge
// Deluge
response = invokeurl
[
    url: "https://meeting.zoho.com/api/v2/meetings"
    type: GET
    parameters: {"page": 1, "per_page": 50, "status": "scheduled"}
    headers: {"Authorization": "Zoho-oauthtoken " + access_token}
];
info response;
```

### Get Meeting by Key

```http
GET /api/v2/meetings/{meeting_key}
Authorization: Zoho-oauthtoken {access_token}
```

**Example**:
```javascript
const getMeeting = async (accessToken, meetingKey) => {
  const response = await axios.get(
    `https://meeting.zoho.com/api/v2/meetings/${meetingKey}`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

### Schedule Meeting

```http
POST /api/v2/meetings
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "topic": "Product Demo",
  "agenda": "Demonstrate new features to client",
  "start_time": "2025-12-20T15:00:00Z",
  "duration": 45,
  "timezone": "America/New_York",
  "participants": [
    {
      "email": "client@example.com",
      "name": "Jane Smith"
    }
  ],
  "recording_enabled": true,
  "settings": {
    "allow_participant_screen_share": false,
    "mute_participants_on_entry": true,
    "enable_waiting_room": true
  }
}
```

**Example**:
```javascript
const scheduleMeeting = async (accessToken, meetingData) => {
  const response = await axios.post(
    'https://meeting.zoho.com/api/v2/meetings',
    meetingData,
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
const newMeeting = {
  topic: 'Product Demo',
  agenda: 'Demonstrate new features to client',
  start_time: '2025-12-20T15:00:00Z',
  duration: 45,
  timezone: 'America/New_York',
  participants: [
    {
      email: 'client@example.com',
      name: 'Jane Smith'
    }
  ],
  recording_enabled: true,
  settings: {
    enable_waiting_room: true,
    mute_participants_on_entry: true
  }
};

const meeting = await scheduleMeeting(accessToken, newMeeting);
console.log('Meeting URL:', meeting.data.meeting_url);
```

```python
def schedule_meeting(access_token, meeting_data):
    url = 'https://meeting.zoho.com/api/v2/meetings'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    response = requests.post(url, json=meeting_data, headers=headers)
    return response.json()

# Usage
new_meeting = {
    'topic': 'Product Demo',
    'agenda': 'Demonstrate new features to client',
    'start_time': '2025-12-20T15:00:00Z',
    'duration': 45,
    'timezone': 'America/New_York',
    'participants': [
        {
            'email': 'client@example.com',
            'name': 'Jane Smith'
        }
    ],
    'recording_enabled': True
}

meeting = schedule_meeting(access_token, new_meeting)
print(f"Meeting URL: {meeting['data']['meeting_url']}")
```

```deluge
// Deluge
meeting_map = Map();
meeting_map.put("topic", "Product Demo");
meeting_map.put("agenda", "Demonstrate new features");
meeting_map.put("start_time", "2025-12-20T15:00:00Z");
meeting_map.put("duration", 45);
meeting_map.put("timezone", "America/New_York");

participants_list = List();
participant_map = Map();
participant_map.put("email", "client@example.com");
participant_map.put("name", "Jane Smith");
participants_list.add(participant_map);
meeting_map.put("participants", participants_list);

response = invokeurl
[
    url: "https://meeting.zoho.com/api/v2/meetings"
    type: POST
    parameters: meeting_map.toString()
    headers: {"Authorization": "Zoho-oauthtoken " + access_token}
];
info response;
```

### Update Meeting

```http
PUT /api/v2/meetings/{meeting_key}
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "topic": "Updated Meeting Topic",
  "start_time": "2025-12-20T16:00:00Z",
  "duration": 60
}
```

**Example**:
```javascript
const updateMeeting = async (accessToken, meetingKey, updates) => {
  const response = await axios.put(
    `https://meeting.zoho.com/api/v2/meetings/${meetingKey}`,
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

### Cancel Meeting

```http
DELETE /api/v2/meetings/{meeting_key}
Authorization: Zoho-oauthtoken {access_token}
```

**Query Parameters**:
- `notify_participants` (boolean) - Send cancellation email to participants

**Example**:
```javascript
const cancelMeeting = async (accessToken, meetingKey, notifyParticipants = true) => {
  const response = await axios.delete(
    `https://meeting.zoho.com/api/v2/meetings/${meetingKey}`,
    {
      params: {
        notify_participants: notifyParticipants
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
def cancel_meeting(access_token, meeting_key, notify_participants=True):
    url = f'https://meeting.zoho.com/api/v2/meetings/{meeting_key}'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'notify_participants': notify_participants
    }
    response = requests.delete(url, headers=headers, params=params)
    return response.json()
```

### Schedule Recurring Meeting

```http
POST /api/v2/meetings
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "topic": "Weekly Team Standup",
  "start_time": "2025-12-16T09:00:00Z",
  "duration": 30,
  "timezone": "America/New_York",
  "is_recurring": true,
  "recurrence": {
    "type": "weekly",
    "repeat_interval": 1,
    "days_of_week": ["monday", "wednesday", "friday"],
    "end_date": "2026-03-31T23:59:59Z"
  }
}
```

**Example**:
```javascript
const scheduleRecurringMeeting = async (accessToken) => {
  const response = await axios.post(
    'https://meeting.zoho.com/api/v2/meetings',
    {
      topic: 'Weekly Team Standup',
      start_time: '2025-12-16T09:00:00Z',
      duration: 30,
      timezone: 'America/New_York',
      is_recurring: true,
      recurrence: {
        type: 'weekly',
        repeat_interval: 1,
        days_of_week: ['monday', 'wednesday', 'friday'],
        end_date: '2026-03-31T23:59:59Z'
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

---

## Participants API

Manage meeting participants and invitations.

### Participant Object Structure

```json
{
  "participant_id": "9876543210",
  "email": "john.doe@company.com",
  "name": "John Doe",
  "role": "presenter",
  "join_time": "2025-12-15T14:02:00Z",
  "leave_time": "2025-12-15T15:00:00Z",
  "duration": 58,
  "device": "desktop",
  "location": "New York, USA",
  "ip_address": "192.168.1.100",
  "status": "joined"
}
```

### Add Participants to Meeting

```http
POST /api/v2/meetings/{meeting_key}/participants
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "participants": [
    {
      "email": "user1@example.com",
      "name": "User One",
      "send_invitation": true
    },
    {
      "email": "user2@example.com",
      "name": "User Two",
      "send_invitation": true
    }
  ]
}
```

**Example**:
```javascript
const addParticipants = async (accessToken, meetingKey, participants) => {
  const response = await axios.post(
    `https://meeting.zoho.com/api/v2/meetings/${meetingKey}/participants`,
    { participants },
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
await addParticipants(accessToken, '1234567890', [
  {
    email: 'user1@example.com',
    name: 'User One',
    send_invitation: true
  },
  {
    email: 'user2@example.com',
    name: 'User Two',
    send_invitation: true
  }
]);
```

```python
def add_participants(access_token, meeting_key, participants):
    url = f'https://meeting.zoho.com/api/v2/meetings/{meeting_key}/participants'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {'participants': participants}
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

```deluge
// Deluge
participants_list = List();

participant1 = Map();
participant1.put("email", "user1@example.com");
participant1.put("name", "User One");
participant1.put("send_invitation", true);
participants_list.add(participant1);

participant2 = Map();
participant2.put("email", "user2@example.com");
participant2.put("name", "User Two");
participant2.put("send_invitation", true);
participants_list.add(participant2);

data_map = Map();
data_map.put("participants", participants_list);

response = invokeurl
[
    url: "https://meeting.zoho.com/api/v2/meetings/" + meeting_key + "/participants"
    type: POST
    parameters: data_map.toString()
    headers: {"Authorization": "Zoho-oauthtoken " + access_token}
];
info response;
```

### List Meeting Participants

```http
GET /api/v2/meetings/{meeting_key}/participants
Authorization: Zoho-oauthtoken {access_token}
```

**Example**:
```javascript
const getParticipants = async (accessToken, meetingKey) => {
  const response = await axios.get(
    `https://meeting.zoho.com/api/v2/meetings/${meetingKey}/participants`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

### Remove Participant

```http
DELETE /api/v2/meetings/{meeting_key}/participants/{participant_id}
Authorization: Zoho-oauthtoken {access_token}
```

---

## Recordings API

Access and manage meeting recordings.

### Recording Object Structure

```json
{
  "recording_id": "REC_1234567890",
  "meeting_key": "1234567890",
  "topic": "Product Demo",
  "start_time": "2025-12-15T14:00:00Z",
  "duration": 58,
  "file_size": 125000000,
  "download_url": "https://meeting.zoho.com/recordings/download/abc123xyz",
  "streaming_url": "https://meeting.zoho.com/recordings/play/abc123xyz",
  "password_protected": false,
  "status": "available",
  "created_time": "2025-12-15T15:05:00Z"
}
```

### List Recordings

```http
GET /api/v2/recordings
Authorization: Zoho-oauthtoken {access_token}
```

**Query Parameters**:
- `page` (integer) - Page number
- `per_page` (integer) - Results per page (max: 100)
- `from_date` (string) - ISO 8601 date
- `to_date` (string) - ISO 8601 date

**Example**:
```javascript
const listRecordings = async (accessToken, filters = {}) => {
  const response = await axios.get(
    'https://meeting.zoho.com/api/v2/recordings',
    {
      params: {
        page: 1,
        per_page: 50,
        from_date: filters.fromDate,
        to_date: filters.toDate
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
def list_recordings(access_token, filters=None):
    url = 'https://meeting.zoho.com/api/v2/recordings'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'page': 1,
        'per_page': 50
    }
    if filters:
        params.update(filters)
    response = requests.get(url, headers=headers, params=params)
    return response.json()
```

### Get Recording Details

```http
GET /api/v2/recordings/{recording_id}
Authorization: Zoho-oauthtoken {access_token}
```

**Example**:
```javascript
const getRecording = async (accessToken, recordingId) => {
  const response = await axios.get(
    `https://meeting.zoho.com/api/v2/recordings/${recordingId}`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

### Download Recording

```http
GET /api/v2/recordings/{recording_id}/download
Authorization: Zoho-oauthtoken {access_token}
```

**Example**:
```javascript
const downloadRecording = async (accessToken, recordingId, savePath) => {
  const response = await axios.get(
    `https://meeting.zoho.com/api/v2/recordings/${recordingId}/download`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      },
      responseType: 'stream'
    }
  );

  const fs = require('fs');
  const writer = fs.createWriteStream(savePath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};
```

```python
def download_recording(access_token, recording_id, save_path):
    url = f'https://meeting.zoho.com/api/v2/recordings/{recording_id}/download'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    response = requests.get(url, headers=headers, stream=True)

    with open(save_path, 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)

    return save_path
```

### Delete Recording

```http
DELETE /api/v2/recordings/{recording_id}
Authorization: Zoho-oauthtoken {access_token}
```

---

## Sessions API

Track individual meeting sessions and attendee details.

### Get Session Details

```http
GET /api/v2/meetings/{meeting_key}/sessions/{session_id}
Authorization: Zoho-oauthtoken {access_token}
```

**Response**:
```json
{
  "status": "success",
  "data": {
    "session_id": "SESSION_1234567890",
    "meeting_key": "1234567890",
    "start_time": "2025-12-15T14:00:00Z",
    "end_time": "2025-12-15T15:00:00Z",
    "duration": 60,
    "participants_count": 15,
    "max_concurrent_participants": 12,
    "recording_available": true
  }
}
```

### List Meeting Sessions

```http
GET /api/v2/meetings/{meeting_key}/sessions
Authorization: Zoho-oauthtoken {access_token}
```

**Example**:
```javascript
const getMeetingSessions = async (accessToken, meetingKey) => {
  const response = await axios.get(
    `https://meeting.zoho.com/api/v2/meetings/${meetingKey}/sessions`,
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
def get_meeting_sessions(access_token, meeting_key):
    url = f'https://meeting.zoho.com/api/v2/meetings/{meeting_key}/sessions'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    response = requests.get(url, headers=headers)
    return response.json()
```

---

## Webinars API

Create and manage webinars (large-scale online events).

### Create Webinar

```http
POST /api/v2/webinars
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "topic": "Product Launch Webinar",
  "description": "Introducing our latest product features",
  "start_time": "2026-01-15T18:00:00Z",
  "duration": 90,
  "timezone": "America/New_York",
  "max_attendees": 500,
  "registration_required": true,
  "settings": {
    "allow_questions": true,
    "allow_polls": true,
    "record_webinar": true
  }
}
```

**Example**:
```javascript
const createWebinar = async (accessToken, webinarData) => {
  const response = await axios.post(
    'https://meeting.zoho.com/api/v2/webinars',
    webinarData,
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
def create_webinar(access_token, webinar_data):
    url = 'https://meeting.zoho.com/api/v2/webinars'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    response = requests.post(url, json=webinar_data, headers=headers)
    return response.json()
```

---

## Registrations API

Manage webinar registrations.

### Get Registrations

```http
GET /api/v2/webinars/{webinar_key}/registrations
Authorization: Zoho-oauthtoken {access_token}
```

### Approve Registration

```http
PUT /api/v2/webinars/{webinar_key}/registrations/{registration_id}/approve
Authorization: Zoho-oauthtoken {access_token}
```

---

## Reports API

Generate reports for meetings and webinars.

### Get Meeting Report

```http
GET /api/v2/meetings/{meeting_key}/report
Authorization: Zoho-oauthtoken {access_token}
```

**Response**:
```json
{
  "status": "success",
  "data": {
    "meeting_key": "1234567890",
    "topic": "Product Demo",
    "total_sessions": 1,
    "total_participants": 15,
    "total_duration": 58,
    "average_attendance": 12,
    "participant_details": [
      {
        "name": "John Doe",
        "email": "john.doe@company.com",
        "join_time": "2025-12-15T14:02:00Z",
        "leave_time": "2025-12-15T15:00:00Z",
        "duration": 58
      }
    ]
  }
}
```

**Example**:
```javascript
const getMeetingReport = async (accessToken, meetingKey) => {
  const response = await axios.get(
    `https://meeting.zoho.com/api/v2/meetings/${meetingKey}/report`,
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
def get_meeting_report(access_token, meeting_key):
    url = f'https://meeting.zoho.com/api/v2/meetings/{meeting_key}/report'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    response = requests.get(url, headers=headers)
    return response.json()
```

```deluge
// Deluge
response = invokeurl
[
    url: "https://meeting.zoho.com/api/v2/meetings/" + meeting_key + "/report"
    type: GET
    headers: {"Authorization": "Zoho-oauthtoken " + access_token}
];
info response;
```

---

## Settings API

Manage meeting settings and preferences.

### Get User Settings

```http
GET /api/v2/settings
Authorization: Zoho-oauthtoken {access_token}
```

### Update User Settings

```http
PUT /api/v2/settings
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "default_meeting_duration": 60,
  "default_timezone": "America/New_York",
  "auto_recording": true,
  "waiting_room_enabled": true
}
```

---

## Rate Limits

### API Call Limits

Zoho Meeting enforces rate limits:

| Plan | API Calls per Minute | API Calls per Day |
|------|---------------------|-------------------|
| Free | 20 | 1,000 |
| Standard | 60 | 5,000 |
| Professional | 120 | 25,000 |
| Enterprise | 300 | 100,000 |

### Rate Limit Headers

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1702396800
```

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
| 201 | Created | Meeting created successfully |
| 204 | No Content | Successful deletion |
| 400 | Bad Request | Invalid parameters |
| 401 | Unauthorized | Invalid or expired token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Meeting not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Common Error Codes

| Error Code | Description | Solution |
|------------|-------------|----------|
| INVALID_TOKEN | Access token invalid or expired | Refresh access token |
| INVALID_MEETING_KEY | Meeting key does not exist | Verify meeting key |
| MEETING_PAST | Cannot modify past meeting | Check meeting time |
| PARTICIPANT_LIMIT_REACHED | Maximum participants reached | Upgrade plan or reduce participants |
| INVALID_DATE_FORMAT | Date format is incorrect | Use ISO 8601 format |
| RECORDING_NOT_AVAILABLE | Recording not yet available | Wait for processing to complete |

---

## Code Examples

### Complete Meeting Workflow

```javascript
// Schedule meeting, add participants, get details
const completeMeetingWorkflow = async (accessToken) => {
  try {
    // Step 1: Schedule meeting
    const meeting = await scheduleMeeting(accessToken, {
      topic: 'Product Review',
      start_time: '2025-12-20T14:00:00Z',
      duration: 60,
      timezone: 'America/New_York',
      recording_enabled: true
    });

    console.log('Meeting scheduled:', meeting.data.meeting_key);
    console.log('Meeting URL:', meeting.data.meeting_url);

    // Step 2: Add participants
    await addParticipants(accessToken, meeting.data.meeting_key, [
      { email: 'user1@example.com', name: 'User One', send_invitation: true },
      { email: 'user2@example.com', name: 'User Two', send_invitation: true }
    ]);

    console.log('Participants added');

    // Step 3: Get meeting details
    const details = await getMeeting(accessToken, meeting.data.meeting_key);
    console.log('Participants count:', details.data.participants.length);

    console.log('Workflow completed successfully');

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};
```

### Meeting Analytics

```python
import requests
from datetime import datetime, timedelta
from collections import defaultdict

class MeetingAnalytics:
    def __init__(self, access_token):
        self.access_token = access_token
        self.base_url = 'https://meeting.zoho.com/api/v2'

    def get_meeting_stats(self, days=30):
        """Get meeting statistics for the last N days"""

        # Calculate date range
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)

        # Fetch meetings
        url = f'{self.base_url}/meetings'
        headers = {
            'Authorization': f'Zoho-oauthtoken {self.access_token}'
        }
        params = {
            'from_date': start_date.isoformat(),
            'to_date': end_date.isoformat(),
            'per_page': 100
        }

        all_meetings = []
        page = 1

        while True:
            params['page'] = page
            response = requests.get(url, headers=headers, params=params)
            data = response.json()

            if 'data' not in data or len(data['data']) == 0:
                break

            all_meetings.extend(data['data'])

            if not data.get('pagination', {}).get('has_more'):
                break

            page += 1

        # Calculate statistics
        stats = {
            'total_meetings': len(all_meetings),
            'by_status': defaultdict(int),
            'total_duration': 0,
            'avg_duration': 0,
            'total_participants': 0,
            'recordings_count': 0
        }

        for meeting in all_meetings:
            stats['by_status'][meeting['status']] += 1
            stats['total_duration'] += meeting.get('duration', 0)

            if meeting.get('recording_enabled'):
                stats['recordings_count'] += 1

        if stats['total_meetings'] > 0:
            stats['avg_duration'] = stats['total_duration'] / stats['total_meetings']

        return stats

# Usage
analytics = MeetingAnalytics(access_token)
stats = analytics.get_meeting_stats(days=30)

print(f"Total Meetings: {stats['total_meetings']}")
print(f"By Status: {dict(stats['by_status'])}")
print(f"Average Duration: {stats['avg_duration']:.1f} minutes")
print(f"Recordings: {stats['recordings_count']}")
```

---

## Best Practices

### 1. Meeting Scheduling

**Use Appropriate Time Zones**:
```javascript
// Good - Specify timezone
const meeting = {
  topic: 'Team Meeting',
  start_time: '2025-12-20T14:00:00Z',
  timezone: 'America/New_York',
  duration: 60
};

// Bad - Missing timezone can cause confusion
const badMeeting = {
  topic: 'Team Meeting',
  start_time: '2025-12-20T14:00:00Z',
  duration: 60
};
```

### 2. Participant Management

```javascript
// Send invitations when adding participants
await addParticipants(accessToken, meetingKey, [
  {
    email: 'user@example.com',
    name: 'User Name',
    send_invitation: true  // Always specify
  }
]);
```

### 3. Error Handling

```javascript
const safeScheduleMeeting = async (accessToken, meetingData) => {
  try {
    return await scheduleMeeting(accessToken, meetingData);
  } catch (error) {
    if (error.response?.status === 401) {
      await refreshToken();
      return await scheduleMeeting(accessToken, meetingData);
    }

    if (error.response?.data?.error?.code === 'MEETING_PAST') {
      throw new Error('Cannot schedule meeting in the past');
    }

    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
};
```

### 4. Recording Management

```javascript
// Download recordings periodically
const downloadAllRecordings = async (accessToken, savePath) => {
  const recordings = await listRecordings(accessToken);

  for (const recording of recordings.data) {
    if (recording.status === 'available') {
      const filename = `${recording.meeting_key}_${recording.start_time}.mp4`;
      await downloadRecording(
        accessToken,
        recording.recording_id,
        `${savePath}/${filename}`
      );
      console.log(`Downloaded: ${filename}`);
    }
  }
};
```

---

## Data Centers

Zoho Meeting operates in multiple data centers:

| Data Center | Base URL |
|-------------|----------|
| US | https://meeting.zoho.com |
| EU | https://meeting.zoho.eu |
| IN | https://meeting.zoho.in |
| AU | https://meeting.zoho.com.au |

---

## Additional Resources

- [Official Zoho Meeting API Documentation](https://www.zoho.com/meeting/api/)
- [Zoho API Console](https://api-console.zoho.com/)
- [Developer Community](https://help.zoho.com/portal/en/community/meeting)
- [Status Page](https://status.zoho.com/)

---

**Last Updated**: December 2025
**API Version**: v2
