# Zoho Webinar API Reference

## Overview

Zoho Webinar (formerly Zoho Meeting) enables hosting online webinars and virtual events. The API provides programmatic access to webinar management, registrations, attendee tracking, and recordings.

**Current API Version**: v2
**Base URL**: `https://meeting.zoho.com/api/v2/`
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

---

## Authentication

### OAuth 2.0 Setup

**Authorization URL**:
```
https://accounts.zoho.com/oauth/v2/auth
```

**Required Scopes**:
- `ZohoMeeting.webinar.ALL` - Full webinar access
- `ZohoMeeting.webinar.READ` - Read-only access
- `ZohoMeeting.registrant.ALL` - Manage registrations

---

## Rate Limits

- **API Calls**: 5,000 calls per day
- **Burst Limit**: 100 calls per minute
- **Concurrent Webinars**: Based on plan

---

## API Modules

### 1. Webinars

**Endpoints**:
```http
GET    /api/v2/webinars               # List webinars
GET    /api/v2/webinars/{webinarKey}  # Get webinar details
POST   /api/v2/webinars               # Create webinar
PUT    /api/v2/webinars/{webinarKey}  # Update webinar
DELETE /api/v2/webinars/{webinarKey}  # Delete webinar
```

**Example - Create Webinar**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const createWebinar = async (accessToken, webinarData) => {
  const response = await axios.post(
    'https://meeting.zoho.com/api/v2/webinars',
    {
      topic: webinarData.topic,
      startTime: webinarData.startTime,
      duration: webinarData.duration,
      timezone: webinarData.timezone || 'America/New_York',
      description: webinarData.description,
      settings: {
        registration: true,
        recordWebinar: true,
        autoRecording: 'cloud',
        waitingRoom: true,
        allowQ&A: true,
        allowPolls: true
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

// Create webinar
const webinar = await createWebinar(accessToken, {
  topic: 'Product Launch Q1 2025',
  startTime: '2025-02-15T14:00:00Z',
  duration: 60,
  description: 'Join us for the launch of our new product line',
  timezone: 'America/New_York'
});
```

**Response**:
```json
{
  "webinarKey": "123456789",
  "topic": "Product Launch Q1 2025",
  "startTime": "2025-02-15T14:00:00Z",
  "duration": 60,
  "timezone": "America/New_York",
  "webinarUrl": "https://meeting.zoho.com/webinar/123456789",
  "registrationUrl": "https://meeting.zoho.com/webinar/register/123456789",
  "status": "scheduled",
  "hostId": "host_123"
}
```

**Example - List Webinars**:
```python
# Python
import requests

def list_webinars(access_token, filters=None):
    url = 'https://meeting.zoho.com/api/v2/webinars'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {}

    if filters:
        if 'from_date' in filters:
            params['fromDate'] = filters['from_date']
        if 'to_date' in filters:
            params['toDate'] = filters['to_date']
        if 'status' in filters:
            params['status'] = filters['status']

    response = requests.get(url, params=params, headers=headers)
    return response.json()
```

---

### 2. Registrations

**Endpoints**:
```http
GET    /api/v2/webinars/{webinarKey}/registrants  # List registrants
POST   /api/v2/webinars/{webinarKey}/registrants  # Add registrant
DELETE /api/v2/webinars/{webinarKey}/registrants/{registrantId} # Remove registrant
PUT    /api/v2/webinars/{webinarKey}/registrants/{registrantId} # Update registrant
```

**Example - Register Attendee**:
```javascript
// JavaScript/Node.js
const registerAttendee = async (accessToken, webinarKey, attendeeData) => {
  const response = await axios.post(
    `https://meeting.zoho.com/api/v2/webinars/${webinarKey}/registrants`,
    {
      firstName: attendeeData.firstName,
      lastName: attendeeData.lastName,
      email: attendeeData.email,
      phone: attendeeData.phone,
      company: attendeeData.company,
      jobTitle: attendeeData.jobTitle,
      customQuestions: attendeeData.customQuestions || []
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

// Register someone
const registration = await registerAttendee(accessToken, webinarKey, {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '+1-555-0100',
  company: 'Acme Corp',
  jobTitle: 'Product Manager'
});
```

**Response**:
```json
{
  "registrantId": "reg_987654",
  "joinUrl": "https://meeting.zoho.com/webinar/join/123456789?registrantId=reg_987654",
  "registrationTime": "2025-01-15T10:30:00Z",
  "status": "approved",
  "confirmationEmail": "sent"
}
```

**Example - List Registrants**:
```python
# Python
def get_registrants(access_token, webinar_key):
    url = f'https://meeting.zoho.com/api/v2/webinars/{webinar_key}/registrants'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }

    response = requests.get(url, headers=headers)
    return response.json()
```

---

### 3. Attendees

**Endpoints**:
```http
GET /api/v2/webinars/{webinarKey}/attendees  # List attendees
GET /api/v2/webinars/{webinarKey}/attendees/{attendeeId} # Get attendee details
```

**Example - Get Attendees**:
```javascript
// JavaScript/Node.js
const getAttendees = async (accessToken, webinarKey) => {
  const response = await axios.get(
    `https://meeting.zoho.com/api/v2/webinars/${webinarKey}/attendees`,
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
  "attendees": [
    {
      "attendeeId": "att_123",
      "name": "John Doe",
      "email": "john@example.com",
      "joinTime": "2025-02-15T14:02:00Z",
      "leaveTime": "2025-02-15T15:05:00Z",
      "duration": 3780,
      "attentiveMinutes": 58,
      "questionsAsked": 2,
      "pollsAnswered": 3
    }
  ],
  "summary": {
    "totalRegistrants": 150,
    "totalAttendees": 142,
    "attendanceRate": 94.67,
    "averageDuration": 3600
  }
}
```

---

### 4. Recordings

**Endpoints**:
```http
GET    /api/v2/webinars/{webinarKey}/recordings  # List recordings
GET    /api/v2/webinars/{webinarKey}/recordings/{recordingId} # Get recording
DELETE /api/v2/webinars/{webinarKey}/recordings/{recordingId} # Delete recording
```

**Example - Get Recordings**:
```python
# Python
def get_recordings(access_token, webinar_key):
    url = f'https://meeting.zoho.com/api/v2/webinars/{webinar_key}/recordings'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }

    response = requests.get(url, headers=headers)
    return response.json()
```

**Response**:
```json
{
  "recordings": [
    {
      "recordingId": "rec_456",
      "startTime": "2025-02-15T14:00:00Z",
      "duration": 3720,
      "fileSize": 524288000,
      "format": "mp4",
      "downloadUrl": "https://meeting.zoho.com/recordings/download/rec_456",
      "playUrl": "https://meeting.zoho.com/recordings/play/rec_456",
      "status": "available"
    }
  ]
}
```

---

### 5. Polls & Q&A

**Endpoints**:
```http
GET  /api/v2/webinars/{webinarKey}/polls      # List polls
POST /api/v2/webinars/{webinarKey}/polls      # Create poll
GET  /api/v2/webinars/{webinarKey}/polls/{pollId}/results # Get results
GET  /api/v2/webinars/{webinarKey}/questions  # Get Q&A
```

**Example - Create Poll**:
```javascript
// JavaScript/Node.js
const createPoll = async (accessToken, webinarKey, pollData) => {
  const response = await axios.post(
    `https://meeting.zoho.com/api/v2/webinars/${webinarKey}/polls`,
    {
      question: pollData.question,
      options: pollData.options,
      allowMultiple: pollData.allowMultiple || false
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

// Create poll
await createPoll(accessToken, webinarKey, {
  question: 'Which feature are you most excited about?',
  options: [
    'AI Integration',
    'Mobile App',
    'Advanced Analytics',
    'API Enhancements'
  ],
  allowMultiple: false
});
```

---

### 6. Reports

**Endpoints**:
```http
GET /api/v2/webinars/{webinarKey}/report     # Webinar report
GET /api/v2/reports/webinars                 # All webinars report
GET /api/v2/reports/attendance               # Attendance report
```

**Example - Get Webinar Report**:
```python
# Python
def get_webinar_report(access_token, webinar_key):
    url = f'https://meeting.zoho.com/api/v2/webinars/{webinar_key}/report'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }

    response = requests.get(url, headers=headers)
    return response.json()
```

**Response**:
```json
{
  "webinarKey": "123456789",
  "topic": "Product Launch Q1 2025",
  "startTime": "2025-02-15T14:00:00Z",
  "endTime": "2025-02-15T15:02:00Z",
  "actualDuration": 62,
  "registrants": 150,
  "attendees": 142,
  "attendanceRate": 94.67,
  "peakAttendance": 138,
  "averageAttentiveness": 92.5,
  "questionsAsked": 45,
  "pollsCreated": 5,
  "pollParticipation": 88.7
}
```

---

## Common Operations

### 1. Send Reminder Emails

```javascript
// JavaScript/Node.js
const sendReminder = async (accessToken, webinarKey) => {
  const response = await axios.post(
    `https://meeting.zoho.com/api/v2/webinars/${webinarKey}/reminder`,
    {
      recipients: 'all',  // all, not_attended
      reminderTime: 'before_1_hour'
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

### 2. Start Webinar

```python
# Python
def start_webinar(access_token, webinar_key):
    url = f'https://meeting.zoho.com/api/v2/webinars/{webinar_key}/start'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }

    response = requests.post(url, headers=headers)
    return response.json()
```

### 3. Export Attendee Data

```javascript
// JavaScript/Node.js
const exportAttendees = async (accessToken, webinarKey, format = 'csv') => {
  const response = await axios.get(
    `https://meeting.zoho.com/api/v2/webinars/${webinarKey}/attendees/export`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      },
      params: {
        format: format  // csv, xlsx
      },
      responseType: 'arraybuffer'
    }
  );
  return response.data;
};
```

---

## Deluge Integration

### Create and Schedule Webinar

```javascript
// Deluge Script
webinarData = {
  "topic": "Monthly Product Update",
  "startTime": zoho.currenttime.addMonth(1).toString("yyyy-MM-dd'T'HH:mm:ss'Z'"),
  "duration": 45,
  "timezone": "America/New_York",
  "description": "Monthly update on new features and roadmap",
  "settings": {
    "registration": true,
    "recordWebinar": true
  }
};

response = invokeurl
[
  url: "https://meeting.zoho.com/api/v2/webinars"
  type: POST
  parameters: webinarData.toString()
  connection: "zoho_webinar"
];

webinarKey = response.get("webinarKey");
registrationUrl = response.get("registrationUrl");

info "Webinar created: " + webinarKey;
info "Registration URL: " + registrationUrl;
```

### Register Multiple Attendees

```javascript
// Deluge Script
webinarKey = "123456789";
attendeeList = zoho.crm.getRecords("Contacts", 1, 100);

for each contact in attendeeList
{
  attendeeData = {
    "firstName": contact.get("First_Name"),
    "lastName": contact.get("Last_Name"),
    "email": contact.get("Email"),
    "company": contact.get("Account_Name").get("name")
  };

  registerResponse = invokeurl
  [
    url: "https://meeting.zoho.com/api/v2/webinars/" + webinarKey + "/registrants"
    type: POST
    parameters: attendeeData.toString()
    connection: "zoho_webinar"
  ];

  info "Registered: " + contact.get("Email");
}
```

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 200 | Success | Request completed |
| 201 | Created | Webinar created |
| 400 | Bad Request | Invalid parameters |
| 401 | Unauthorized | Invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Webinar not found |
| 409 | Conflict | Time slot conflict |
| 429 | Too Many Requests | Rate limit exceeded |

---

## Best Practices

### 1. Registration Management
- Enable double opt-in
- Send confirmation emails
- Automated reminders
- Custom registration fields

### 2. Engagement
- Use polls and Q&A
- Enable chat
- Record sessions
- Follow-up emails

### 3. Analytics
- Track attendance patterns
- Monitor engagement metrics
- Export data regularly
- Post-webinar surveys

---

## Data Centers

| Region | API Base URL |
|--------|-------------|
| US | `https://meeting.zoho.com/api/v2/` |
| EU | `https://meeting.zoho.eu/api/v2/` |
| IN | `https://meeting.zoho.in/api/v2/` |
| AU | `https://meeting.zoho.com.au/api/v2/` |

---

## Additional Resources

- **Official Documentation**: https://www.zoho.com/meeting/help/api/
- **Developer Console**: https://api-console.zoho.com/
