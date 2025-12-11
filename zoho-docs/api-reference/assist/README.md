# Zoho Assist API Reference

## Overview

Zoho Assist is a remote support and remote access solution that enables IT teams to provide technical assistance. The API provides programmatic access to remote sessions, chat, file transfers, and support management.

**Current API Version**: v2
**Base URL**: `https://assist.zoho.com/api/v2/`
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
- `ZohoAssist.sessions.ALL` - Manage sessions
- `ZohoAssist.sessions.READ` - Read session data
- `ZohoAssist.customers.ALL` - Manage customers
- `ZohoAssist.technicians.READ` - Read technician info

---

## Rate Limits

- **API Calls**: 5,000 calls per day
- **Burst Limit**: 50 calls per minute
- **Concurrent Sessions**: Based on plan

---

## API Modules

### 1. Remote Sessions

**Endpoints**:
```http
GET    /api/v2/sessions              # List sessions
GET    /api/v2/sessions/{sessionId}  # Get session details
POST   /api/v2/sessions              # Create session
DELETE /api/v2/sessions/{sessionId}  # End session
GET    /api/v2/sessions/{sessionId}/details # Get session report
```

**Session Types**:
- `remote_support` - On-demand support
- `unattended_access` - Unattended remote access
- `scheduled_session` - Pre-scheduled session

**Example - Create Remote Support Session**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const createSession = async (accessToken, sessionData) => {
  const response = await axios.post(
    'https://assist.zoho.com/api/v2/sessions',
    {
      sessionType: 'remote_support',
      customerName: sessionData.customerName,
      customerEmail: sessionData.customerEmail,
      sessionName: sessionData.sessionName,
      technicianId: sessionData.technicianId
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

// Create session
const session = await createSession(accessToken, {
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  sessionName: 'Software Installation Support',
  technicianId: 'tech_123'
});
```

**Response**:
```json
{
  "sessionId": "1234567890",
  "sessionKey": "123-456-789",
  "sessionUrl": "https://assist.zoho.com/join/123-456-789",
  "sessionType": "remote_support",
  "status": "waiting",
  "createdTime": "2025-01-15T10:30:00Z",
  "expiresIn": 3600
}
```

---

### 2. Technicians

**Endpoints**:
```http
GET    /api/v2/technicians           # List technicians
GET    /api/v2/technicians/{techId}  # Get technician details
POST   /api/v2/technicians           # Add technician
PUT    /api/v2/technicians/{techId}  # Update technician
DELETE /api/v2/technicians/{techId}  # Remove technician
```

**Example - List Technicians**:
```python
# Python
import requests

def list_technicians(access_token):
    url = 'https://assist.zoho.com/api/v2/technicians'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }

    response = requests.get(url, headers=headers)
    return response.json()
```

**Response**:
```json
{
  "technicians": [
    {
      "technicianId": "tech_123",
      "name": "Jane Smith",
      "email": "jane@company.com",
      "role": "admin",
      "status": "online",
      "activeSessions": 2,
      "totalSessions": 150
    }
  ]
}
```

---

### 3. Customers

**Endpoints**:
```http
GET    /api/v2/customers              # List customers
GET    /api/v2/customers/{customerId} # Get customer details
POST   /api/v2/customers              # Add customer
PUT    /api/v2/customers/{customerId} # Update customer
DELETE /api/v2/customers/{customerId} # Remove customer
```

**Example - Add Customer**:
```javascript
// JavaScript/Node.js
const addCustomer = async (accessToken, customerData) => {
  const response = await axios.post(
    'https://assist.zoho.com/api/v2/customers',
    {
      name: customerData.name,
      email: customerData.email,
      phone: customerData.phone,
      company: customerData.company,
      notes: customerData.notes
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

### 4. Unattended Computers

**Endpoints**:
```http
GET    /api/v2/computers              # List unattended computers
GET    /api/v2/computers/{computerId} # Get computer details
POST   /api/v2/computers/{computerId}/connect # Start unattended session
DELETE /api/v2/computers/{computerId} # Remove computer
```

**Example - List Unattended Computers**:
```python
# Python
def list_computers(access_token):
    url = 'https://assist.zoho.com/api/v2/computers'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }

    response = requests.get(url, headers=headers)
    return response.json()
```

**Example - Connect to Unattended Computer**:
```javascript
// JavaScript/Node.js
const connectToComputer = async (accessToken, computerId) => {
  const response = await axios.post(
    `https://assist.zoho.com/api/v2/computers/${computerId}/connect`,
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

---

### 5. Session Reports

**Endpoints**:
```http
GET /api/v2/reports/sessions          # Session reports
GET /api/v2/reports/technicians       # Technician performance
GET /api/v2/reports/customers         # Customer activity
```

**Query Parameters**:
- `from_date` - Start date (YYYY-MM-DD)
- `to_date` - End date (YYYY-MM-DD)
- `technicianId` - Filter by technician
- `status` - Filter by status

**Example - Get Session Reports**:
```javascript
// JavaScript/Node.js
const getSessionReports = async (accessToken, options) => {
  const response = await axios.get(
    'https://assist.zoho.com/api/v2/reports/sessions',
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      },
      params: {
        from_date: options.fromDate,
        to_date: options.toDate,
        technicianId: options.technicianId
      }
    }
  );
  return response.data;
};

// Get last 30 days reports
const reports = await getSessionReports(accessToken, {
  fromDate: '2025-01-01',
  toDate: '2025-01-31'
});
```

**Response**:
```json
{
  "sessions": [
    {
      "sessionId": "1234567890",
      "customerName": "John Doe",
      "technicianName": "Jane Smith",
      "startTime": "2025-01-15T10:30:00Z",
      "endTime": "2025-01-15T11:15:00Z",
      "duration": 2700,
      "sessionType": "remote_support",
      "status": "completed",
      "chatMessages": 25,
      "filesTransferred": 2
    }
  ],
  "summary": {
    "totalSessions": 150,
    "completedSessions": 145,
    "averageDuration": 1800,
    "totalDuration": 270000
  }
}
```

---

### 6. File Transfers

**Endpoints**:
```http
GET  /api/v2/sessions/{sessionId}/files     # List transferred files
POST /api/v2/sessions/{sessionId}/files     # Initiate file transfer
GET  /api/v2/sessions/{sessionId}/files/{fileId} # Download file
```

**Example - Get Session Files**:
```python
# Python
def get_session_files(access_token, session_id):
    url = f'https://assist.zoho.com/api/v2/sessions/{session_id}/files'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }

    response = requests.get(url, headers=headers)
    return response.json()
```

---

### 7. Chat History

**Endpoints**:
```http
GET /api/v2/sessions/{sessionId}/chat  # Get chat history
```

**Example - Get Chat History**:
```javascript
// JavaScript/Node.js
const getChatHistory = async (accessToken, sessionId) => {
  const response = await axios.get(
    `https://assist.zoho.com/api/v2/sessions/${sessionId}/chat`,
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
  "messages": [
    {
      "messageId": "msg_1",
      "sender": "technician",
      "senderName": "Jane Smith",
      "message": "Hello! How can I help you today?",
      "timestamp": "2025-01-15T10:30:15Z"
    },
    {
      "messageId": "msg_2",
      "sender": "customer",
      "senderName": "John Doe",
      "message": "I'm having trouble installing the software.",
      "timestamp": "2025-01-15T10:30:45Z"
    }
  ]
}
```

---

## Common Operations

### 1. Invite Customer to Session

```javascript
// JavaScript/Node.js
const inviteToSession = async (accessToken, sessionId, email) => {
  const response = await axios.post(
    `https://assist.zoho.com/api/v2/sessions/${sessionId}/invite`,
    {
      email: email,
      sendEmail: true
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

### 2. Transfer Session to Another Technician

```python
# Python
def transfer_session(access_token, session_id, target_technician_id):
    url = f'https://assist.zoho.com/api/v2/sessions/{session_id}/transfer'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'technicianId': target_technician_id
    }

    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

### 3. Schedule Remote Session

```javascript
// JavaScript/Node.js
const scheduleSession = async (accessToken, sessionData) => {
  const response = await axios.post(
    'https://assist.zoho.com/api/v2/sessions/schedule',
    {
      customerName: sessionData.customerName,
      customerEmail: sessionData.customerEmail,
      technicianId: sessionData.technicianId,
      scheduledTime: sessionData.scheduledTime,
      duration: sessionData.duration,
      sessionName: sessionData.sessionName
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

## Deluge Integration

### Create Support Session

```javascript
// Deluge Script
customerEmail = "customer@example.com";
technicianId = "tech_123";

sessionData = {
  "sessionType": "remote_support",
  "customerName": customer_name,
  "customerEmail": customerEmail,
  "sessionName": "Technical Support - Ticket #" + ticket_id,
  "technicianId": technicianId
};

response = invokeurl
[
  url: "https://assist.zoho.com/api/v2/sessions"
  type: POST
  parameters: sessionData.toString()
  connection: "zoho_assist"
];

sessionUrl = response.get("sessionUrl");
sessionKey = response.get("sessionKey");

info "Session created: " + sessionUrl;

// Send session link to customer
sendmail
[
  from: "support@company.com"
  to: customerEmail
  subject: "Remote Support Session"
  message: "Join session: " + sessionUrl + " (Session Key: " + sessionKey + ")"
]
```

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 200 | Success | Request completed |
| 201 | Created | Session created |
| 400 | Bad Request | Invalid parameters |
| 401 | Unauthorized | Invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Session not found |
| 409 | Conflict | Session limit reached |
| 429 | Too Many Requests | Rate limit exceeded |

---

## Best Practices

### 1. Session Management
- Set appropriate timeouts
- Clean up expired sessions
- Monitor concurrent sessions
- Log session activities

### 2. Security
- Use secure connections
- Implement access controls
- Regular audit logs
- Customer consent management

### 3. Performance
- Monitor technician availability
- Balance session loads
- Optimize file transfers
- Regular report analysis

---

## Data Centers

| Region | API Base URL |
|--------|-------------|
| US | `https://assist.zoho.com/api/v2/` |
| EU | `https://assist.zoho.eu/api/v2/` |
| IN | `https://assist.zoho.in/api/v2/` |
| AU | `https://assist.zoho.com.au/api/v2/` |

---

## Additional Resources

- **Official Documentation**: https://www.zoho.com/assist/help/api/
- **Developer Console**: https://api-console.zoho.com/
