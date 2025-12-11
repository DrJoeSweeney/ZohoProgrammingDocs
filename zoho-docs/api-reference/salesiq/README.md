# Zoho SalesIQ API Reference

## Overview

Zoho SalesIQ is a live chat and visitor tracking platform that helps businesses engage with website visitors in real-time. The API provides comprehensive access to chat functionality, visitor tracking, operator management, lead generation, and analytics.

**Current API Version**: v2
**Base URL**: `https://salesiq.zoho.com/api/v2/`
**Protocol**: REST
**Data Format**: JSON
**Authentication**: OAuth 2.0

---

## Quick Links

- [Authentication](#authentication)
- [REST API v2](#rest-api-v2)
- [Live Chat APIs](#live-chat-apis)
- [Visitor Tracking](#visitor-tracking)
- [Operator Management](#operator-management)
- [Brand and App Management](#brand-and-app-management)
- [Push Notifications](#push-notifications)
- [Visitor Routing](#visitor-routing)
- [JavaScript APIs](#javascript-apis)
- [Webhooks](#webhooks)
- [Rate Limits](#rate-limits)
- [Error Codes](#error-codes)
- [Code Examples](#code-examples)
- [Best Practices](#best-practices)

---

## Authentication

### OAuth 2.0 Flow

Zoho SalesIQ uses OAuth 2.0 for authentication. All API requests require a valid access token.

**Step 1: Register Your Application**
- Go to [Zoho API Console](https://api-console.zoho.com/)
- Create a new Client (Server-based or Self-client)
- Note your Client ID and Client Secret
- Set the authorized redirect URI

**Step 2: Generate Authorization Code**

```http
GET https://accounts.zoho.com/oauth/v2/auth?
  scope=SalesIQ.operators.READ,SalesIQ.visitors.READ,SalesIQ.chats.READ,SalesIQ.settings.READ&
  client_id={client_id}&
  response_type=code&
  access_type=offline&
  redirect_uri={redirect_uri}
```

**Available Scopes**:
- `SalesIQ.operators.ALL` - Full access to operators
- `SalesIQ.operators.READ` - Read operator information
- `SalesIQ.operators.CREATE` - Create operators
- `SalesIQ.operators.UPDATE` - Update operators
- `SalesIQ.operators.DELETE` - Delete operators
- `SalesIQ.visitors.ALL` - Full access to visitor data
- `SalesIQ.visitors.READ` - Read visitor information
- `SalesIQ.chats.ALL` - Full access to chats
- `SalesIQ.chats.READ` - Read chat transcripts
- `SalesIQ.chats.CREATE` - Initiate chats
- `SalesIQ.chats.UPDATE` - Update chat status
- `SalesIQ.leads.ALL` - Full access to leads
- `SalesIQ.leads.READ` - Read lead data
- `SalesIQ.settings.ALL` - Access to settings and configuration
- `SalesIQ.settings.READ` - Read settings
- `SalesIQ.analytics.READ` - Access to analytics data

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

## REST API v2

### API Structure

All REST API endpoints follow this pattern:
```
https://salesiq.zoho.com/api/v2/{resource}
```

### HTTP Methods

| Method | Purpose | Idempotent |
|--------|---------|------------|
| GET | Retrieve resources | Yes |
| POST | Create new resources | No |
| PUT | Update/Replace resources | Yes |
| PATCH | Partial update | No |
| DELETE | Remove resources | Yes |

### Request Format

```http
GET /api/v2/visitors
Host: salesiq.zoho.com
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json
```

### Response Format

**Success Response**:
```json
{
  "status": "success",
  "data": {
    "id": "visitor123",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**List Response**:
```json
{
  "status": "success",
  "data": [
    { "id": "1", "name": "Visitor 1" },
    { "id": "2", "name": "Visitor 2" }
  ],
  "pagination": {
    "page": 1,
    "per_page": 50,
    "total": 150
  }
}
```

**Error Response**:
```json
{
  "status": "error",
  "code": "INVALID_TOKEN",
  "message": "Invalid or expired access token",
  "details": {}
}
```

---

## Live Chat APIs

### Chat Object Structure

```json
{
  "id": "chat123456789",
  "visitor_id": "visitor123",
  "operator_id": "operator456",
  "department_id": "dept789",
  "status": "active",
  "type": "live_chat",
  "started_at": "2025-12-12T14:30:00.000Z",
  "ended_at": null,
  "duration": 0,
  "rating": null,
  "feedback": null,
  "transcript": [
    {
      "id": "msg1",
      "sender_type": "visitor",
      "sender_id": "visitor123",
      "message": "Hello, I need help",
      "timestamp": "2025-12-12T14:30:15.000Z",
      "type": "text"
    },
    {
      "id": "msg2",
      "sender_type": "operator",
      "sender_id": "operator456",
      "message": "Hi! How can I assist you today?",
      "timestamp": "2025-12-12T14:30:30.000Z",
      "type": "text"
    }
  ],
  "visitor_info": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1-555-0123",
    "city": "San Francisco",
    "country": "United States",
    "browser": "Chrome",
    "platform": "Windows"
  },
  "tags": ["support", "pricing"],
  "custom_fields": {
    "product": "Enterprise Plan"
  }
}
```

### List Chats

```http
GET /api/v2/chats
Authorization: Zoho-oauthtoken {access_token}
```

**Query Parameters**:
- `page` (integer) - Page number (default: 1)
- `per_page` (integer) - Records per page (max: 100, default: 50)
- `status` (string) - Filter by status (active, waiting, ended, missed)
- `operator_id` (string) - Filter by operator
- `department_id` (string) - Filter by department
- `from_date` (string) - Start date (ISO 8601 format)
- `to_date` (string) - End date (ISO 8601 format)
- `visitor_id` (string) - Filter by visitor

**Example Request**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const listChats = async (accessToken, filters = {}) => {
  const response = await axios.get(
    'https://salesiq.zoho.com/api/v2/chats',
    {
      params: {
        per_page: 50,
        status: 'active',
        ...filters
      },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};

// Usage
const activeChats = await listChats(accessToken, { status: 'active' });
```

```python
# Python
import requests

def list_chats(access_token, filters=None):
    url = 'https://salesiq.zoho.com/api/v2/chats'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'per_page': 50,
        'status': 'active'
    }
    if filters:
        params.update(filters)

    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Usage
active_chats = list_chats(access_token, {'status': 'active'})
```

```deluge
// Deluge
params = Map();
params.put("per_page", 50);
params.put("status", "active");

response = zoho.salesiq.getRecords("chats", params);
info response;
```

### Get Chat by ID

```http
GET /api/v2/chats/{chat_id}
Authorization: Zoho-oauthtoken {access_token}
```

**Example**:
```javascript
const getChat = async (accessToken, chatId) => {
  const response = await axios.get(
    `https://salesiq.zoho.com/api/v2/chats/${chatId}`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

### Get Chat Transcript

```http
GET /api/v2/chats/{chat_id}/transcript
Authorization: Zoho-oauthtoken {access_token}
```

**Example**:
```javascript
const getChatTranscript = async (accessToken, chatId) => {
  const response = await axios.get(
    `https://salesiq.zoho.com/api/v2/chats/${chatId}/transcript`,
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
def get_chat_transcript(access_token, chat_id):
    url = f'https://salesiq.zoho.com/api/v2/chats/{chat_id}/transcript'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    response = requests.get(url, headers=headers)
    return response.json()
```

### Send Chat Message

```http
POST /api/v2/chats/{chat_id}/messages
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "message": "Thank you for contacting us. How can I help you?",
  "type": "text"
}
```

**Message Types**:
- `text` - Plain text message
- `html` - HTML formatted message
- `attachment` - File attachment
- `card` - Rich card with buttons
- `article` - Knowledge base article

**Example**:
```javascript
const sendChatMessage = async (accessToken, chatId, message) => {
  const response = await axios.post(
    `https://salesiq.zoho.com/api/v2/chats/${chatId}/messages`,
    {
      message: message,
      type: 'text'
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
await sendChatMessage(accessToken, 'chat123', 'How can I help you today?');
```

```python
def send_chat_message(access_token, chat_id, message):
    url = f'https://salesiq.zoho.com/api/v2/chats/{chat_id}/messages'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'message': message,
        'type': 'text'
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

```deluge
// Deluge
message_map = Map();
message_map.put("message", "How can I help you today?");
message_map.put("type", "text");

response = zoho.salesiq.create("chats", chat_id, "messages", message_map);
info response;
```

### Transfer Chat

```http
POST /api/v2/chats/{chat_id}/transfer
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "operator_id": "operator789",
  "message": "Transferring you to our technical specialist"
}
```

**Example**:
```javascript
const transferChat = async (accessToken, chatId, operatorId, message) => {
  const response = await axios.post(
    `https://salesiq.zoho.com/api/v2/chats/${chatId}/transfer`,
    {
      operator_id: operatorId,
      message: message
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

### End Chat

```http
POST /api/v2/chats/{chat_id}/end
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "message": "Thank you for chatting with us. Have a great day!"
}
```

**Example**:
```javascript
const endChat = async (accessToken, chatId, message = null) => {
  const response = await axios.post(
    `https://salesiq.zoho.com/api/v2/chats/${chatId}/end`,
    message ? { message } : {},
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
def end_chat(access_token, chat_id, message=None):
    url = f'https://salesiq.zoho.com/api/v2/chats/{chat_id}/end'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {'message': message} if message else {}
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

### Add Chat Rating

```http
POST /api/v2/chats/{chat_id}/rating
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "rating": 5,
  "feedback": "Excellent service! Very helpful."
}
```

**Example**:
```javascript
const addChatRating = async (accessToken, chatId, rating, feedback) => {
  const response = await axios.post(
    `https://salesiq.zoho.com/api/v2/chats/${chatId}/rating`,
    {
      rating: rating,
      feedback: feedback
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

## Visitor Tracking

### Visitor Object Structure

```json
{
  "id": "visitor123456789",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-555-0123",
  "company": "Acme Corp",
  "city": "San Francisco",
  "region": "California",
  "country": "United States",
  "country_code": "US",
  "ip_address": "192.168.1.1",
  "browser": "Chrome 120.0",
  "platform": "Windows 10",
  "device": "Desktop",
  "screen_resolution": "1920x1080",
  "language": "en-US",
  "timezone": "America/Los_Angeles",
  "referrer": "https://google.com/search?q=zoho",
  "landing_page": "https://example.com/products",
  "current_page": "https://example.com/pricing",
  "pages_visited": 5,
  "total_visits": 3,
  "first_visit": "2025-12-01T10:00:00.000Z",
  "last_visit": "2025-12-12T14:30:00.000Z",
  "status": "online",
  "chat_status": "available",
  "lead_score": 85,
  "tags": ["qualified", "enterprise"],
  "custom_fields": {
    "industry": "Technology",
    "employee_count": "500+"
  }
}
```

### List Visitors

```http
GET /api/v2/visitors
Authorization: Zoho-oauthtoken {access_token}
```

**Query Parameters**:
- `page` (integer) - Page number
- `per_page` (integer) - Records per page (max: 100)
- `status` (string) - Filter by status (online, offline, chatting)
- `from_date` (string) - Start date
- `to_date` (string) - End date
- `search` (string) - Search by name, email, or company

**Example**:
```javascript
const listVisitors = async (accessToken, filters = {}) => {
  const response = await axios.get(
    'https://salesiq.zoho.com/api/v2/visitors',
    {
      params: {
        per_page: 50,
        status: 'online',
        ...filters
      },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};

// Get online visitors
const onlineVisitors = await listVisitors(accessToken, { status: 'online' });
```

```python
def list_visitors(access_token, filters=None):
    url = 'https://salesiq.zoho.com/api/v2/visitors'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'per_page': 50,
        'status': 'online'
    }
    if filters:
        params.update(filters)

    response = requests.get(url, headers=headers, params=params)
    return response.json()
```

```deluge
// Deluge
params = Map();
params.put("per_page", 50);
params.put("status", "online");

response = zoho.salesiq.getRecords("visitors", params);
info response;
```

### Get Visitor by ID

```http
GET /api/v2/visitors/{visitor_id}
Authorization: Zoho-oauthtoken {access_token}
```

**Example**:
```javascript
const getVisitor = async (accessToken, visitorId) => {
  const response = await axios.get(
    `https://salesiq.zoho.com/api/v2/visitors/${visitorId}`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

### Update Visitor Information

```http
PATCH /api/v2/visitors/{visitor_id}
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-555-0123",
  "company": "Acme Corp",
  "custom_fields": {
    "industry": "Technology",
    "budget": "10000-50000"
  }
}
```

**Example**:
```javascript
const updateVisitor = async (accessToken, visitorId, updates) => {
  const response = await axios.patch(
    `https://salesiq.zoho.com/api/v2/visitors/${visitorId}`,
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

// Usage
await updateVisitor(accessToken, 'visitor123', {
  name: 'John Doe',
  email: 'john@example.com',
  company: 'Acme Corp'
});
```

```python
def update_visitor(access_token, visitor_id, updates):
    url = f'https://salesiq.zoho.com/api/v2/visitors/{visitor_id}'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    response = requests.patch(url, json=updates, headers=headers)
    return response.json()
```

### Get Visitor Activity

```http
GET /api/v2/visitors/{visitor_id}/activity
Authorization: Zoho-oauthtoken {access_token}
```

**Response**:
```json
{
  "status": "success",
  "data": {
    "visitor_id": "visitor123",
    "sessions": [
      {
        "session_id": "session1",
        "started_at": "2025-12-12T14:00:00.000Z",
        "ended_at": "2025-12-12T14:30:00.000Z",
        "duration": 1800,
        "pages": [
          {
            "url": "https://example.com/products",
            "title": "Products",
            "visited_at": "2025-12-12T14:00:00.000Z",
            "time_spent": 120
          },
          {
            "url": "https://example.com/pricing",
            "title": "Pricing",
            "visited_at": "2025-12-12T14:02:00.000Z",
            "time_spent": 300
          }
        ]
      }
    ],
    "chats": [
      {
        "chat_id": "chat123",
        "started_at": "2025-12-12T14:10:00.000Z",
        "status": "ended"
      }
    ]
  }
}
```

**Example**:
```javascript
const getVisitorActivity = async (accessToken, visitorId) => {
  const response = await axios.get(
    `https://salesiq.zoho.com/api/v2/visitors/${visitorId}/activity`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

### Tag Visitor

```http
POST /api/v2/visitors/{visitor_id}/tags
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "tags": ["qualified", "enterprise", "hot-lead"]
}
```

**Example**:
```javascript
const tagVisitor = async (accessToken, visitorId, tags) => {
  const response = await axios.post(
    `https://salesiq.zoho.com/api/v2/visitors/${visitorId}/tags`,
    { tags },
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
await tagVisitor(accessToken, 'visitor123', ['qualified', 'enterprise']);
```

---

## Operator Management

### Operator Object Structure

```json
{
  "id": "operator123456789",
  "name": "Sarah Johnson",
  "email": "sarah@company.com",
  "status": "online",
  "availability": "available",
  "role": "agent",
  "department_id": "dept789",
  "department_name": "Sales",
  "profile_picture": "https://example.com/avatar.jpg",
  "timezone": "America/New_York",
  "max_chats": 5,
  "active_chats": 2,
  "total_chats": 1250,
  "average_rating": 4.8,
  "languages": ["English", "Spanish"],
  "skills": ["Sales", "Technical Support"],
  "created_at": "2025-01-15T10:00:00.000Z",
  "last_active": "2025-12-12T14:30:00.000Z"
}
```

### List Operators

```http
GET /api/v2/operators
Authorization: Zoho-oauthtoken {access_token}
```

**Query Parameters**:
- `page` (integer) - Page number
- `per_page` (integer) - Records per page
- `status` (string) - Filter by status (online, offline, away, busy)
- `department_id` (string) - Filter by department
- `role` (string) - Filter by role (admin, agent, supervisor)

**Example**:
```javascript
const listOperators = async (accessToken, filters = {}) => {
  const response = await axios.get(
    'https://salesiq.zoho.com/api/v2/operators',
    {
      params: {
        per_page: 50,
        ...filters
      },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};

// Get online operators
const onlineOperators = await listOperators(accessToken, { status: 'online' });
```

```python
def list_operators(access_token, filters=None):
    url = 'https://salesiq.zoho.com/api/v2/operators'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {'per_page': 50}
    if filters:
        params.update(filters)

    response = requests.get(url, headers=headers, params=params)
    return response.json()
```

```deluge
// Deluge
params = Map();
params.put("per_page", 50);
params.put("status", "online");

response = zoho.salesiq.getRecords("operators", params);
info response;
```

### Get Operator by ID

```http
GET /api/v2/operators/{operator_id}
Authorization: Zoho-oauthtoken {access_token}
```

**Example**:
```javascript
const getOperator = async (accessToken, operatorId) => {
  const response = await axios.get(
    `https://salesiq.zoho.com/api/v2/operators/${operatorId}`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

### Create Operator

```http
POST /api/v2/operators
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "name": "Sarah Johnson",
  "email": "sarah@company.com",
  "role": "agent",
  "department_id": "dept789",
  "max_chats": 5,
  "languages": ["English", "Spanish"],
  "skills": ["Sales", "Technical Support"]
}
```

**Example**:
```javascript
const createOperator = async (accessToken, operatorData) => {
  const response = await axios.post(
    'https://salesiq.zoho.com/api/v2/operators',
    operatorData,
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
const newOperator = await createOperator(accessToken, {
  name: 'Sarah Johnson',
  email: 'sarah@company.com',
  role: 'agent',
  department_id: 'dept789',
  max_chats: 5
});
```

```python
def create_operator(access_token, operator_data):
    url = 'https://salesiq.zoho.com/api/v2/operators'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    response = requests.post(url, json=operator_data, headers=headers)
    return response.json()
```

```deluge
// Deluge
operator_map = Map();
operator_map.put("name", "Sarah Johnson");
operator_map.put("email", "sarah@company.com");
operator_map.put("role", "agent");
operator_map.put("department_id", "dept789");
operator_map.put("max_chats", 5);

response = zoho.salesiq.create("operators", operator_map);
info response;
```

### Update Operator

```http
PATCH /api/v2/operators/{operator_id}
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "status": "away",
  "max_chats": 3
}
```

**Example**:
```javascript
const updateOperator = async (accessToken, operatorId, updates) => {
  const response = await axios.patch(
    `https://salesiq.zoho.com/api/v2/operators/${operatorId}`,
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

// Set operator to away
await updateOperator(accessToken, 'operator123', { status: 'away' });
```

### Delete Operator

```http
DELETE /api/v2/operators/{operator_id}
Authorization: Zoho-oauthtoken {access_token}
```

**Example**:
```javascript
const deleteOperator = async (accessToken, operatorId) => {
  const response = await axios.delete(
    `https://salesiq.zoho.com/api/v2/operators/${operatorId}`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

### Get Operator Stats

```http
GET /api/v2/operators/{operator_id}/stats
Authorization: Zoho-oauthtoken {access_token}
```

**Query Parameters**:
- `from_date` (string) - Start date
- `to_date` (string) - End date

**Response**:
```json
{
  "status": "success",
  "data": {
    "operator_id": "operator123",
    "total_chats": 125,
    "completed_chats": 120,
    "missed_chats": 5,
    "average_response_time": 45,
    "average_chat_duration": 420,
    "average_rating": 4.8,
    "total_rating_count": 95,
    "ratings_breakdown": {
      "5": 75,
      "4": 15,
      "3": 3,
      "2": 1,
      "1": 1
    }
  }
}
```

**Example**:
```javascript
const getOperatorStats = async (accessToken, operatorId, fromDate, toDate) => {
  const response = await axios.get(
    `https://salesiq.zoho.com/api/v2/operators/${operatorId}/stats`,
    {
      params: {
        from_date: fromDate,
        to_date: toDate
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

## Brand and App Management

### Brand Object Structure

```json
{
  "id": "brand123456789",
  "name": "Acme Support",
  "website": "https://www.acme.com",
  "logo": "https://example.com/logo.png",
  "timezone": "America/Los_Angeles",
  "language": "en",
  "status": "active",
  "widget_settings": {
    "theme_color": "#007bff",
    "position": "bottom-right",
    "greeting_message": "Hello! How can we help you today?",
    "offline_message": "We're currently offline. Leave us a message!",
    "show_operators": true,
    "show_attachments": true,
    "show_emojis": true
  },
  "departments": [
    {
      "id": "dept789",
      "name": "Sales"
    },
    {
      "id": "dept790",
      "name": "Support"
    }
  ],
  "created_at": "2025-01-01T00:00:00.000Z"
}
```

### List Brands

```http
GET /api/v2/brands
Authorization: Zoho-oauthtoken {access_token}
```

**Example**:
```javascript
const listBrands = async (accessToken) => {
  const response = await axios.get(
    'https://salesiq.zoho.com/api/v2/brands',
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
def list_brands(access_token):
    url = 'https://salesiq.zoho.com/api/v2/brands'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    response = requests.get(url, headers=headers)
    return response.json()
```

```deluge
// Deluge
response = zoho.salesiq.getRecords("brands");
info response;
```

### Get Brand by ID

```http
GET /api/v2/brands/{brand_id}
Authorization: Zoho-oauthtoken {access_token}
```

**Example**:
```javascript
const getBrand = async (accessToken, brandId) => {
  const response = await axios.get(
    `https://salesiq.zoho.com/api/v2/brands/${brandId}`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

### Update Brand Settings

```http
PATCH /api/v2/brands/{brand_id}
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "widget_settings": {
    "theme_color": "#28a745",
    "greeting_message": "Welcome! Need any assistance?"
  }
}
```

**Example**:
```javascript
const updateBrandSettings = async (accessToken, brandId, settings) => {
  const response = await axios.patch(
    `https://salesiq.zoho.com/api/v2/brands/${brandId}`,
    settings,
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
await updateBrandSettings(accessToken, 'brand123', {
  widget_settings: {
    theme_color: '#28a745',
    greeting_message: 'Welcome! Need any assistance?'
  }
});
```

### List Departments

```http
GET /api/v2/brands/{brand_id}/departments
Authorization: Zoho-oauthtoken {access_token}
```

**Example**:
```javascript
const listDepartments = async (accessToken, brandId) => {
  const response = await axios.get(
    `https://salesiq.zoho.com/api/v2/brands/${brandId}/departments`,
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
def list_departments(access_token, brand_id):
    url = f'https://salesiq.zoho.com/api/v2/brands/{brand_id}/departments'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    response = requests.get(url, headers=headers)
    return response.json()
```

---

## Push Notifications

### Register Device for Push Notifications

```http
POST /api/v2/devices
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "device_token": "fcm_device_token_here",
  "platform": "android",
  "operator_id": "operator123"
}
```

**Platforms**:
- `android` - Android devices (FCM)
- `ios` - iOS devices (APNS)
- `web` - Web push notifications

**Example**:
```javascript
const registerDevice = async (accessToken, deviceToken, platform, operatorId) => {
  const response = await axios.post(
    'https://salesiq.zoho.com/api/v2/devices',
    {
      device_token: deviceToken,
      platform: platform,
      operator_id: operatorId
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
def register_device(access_token, device_token, platform, operator_id):
    url = 'https://salesiq.zoho.com/api/v2/devices'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'device_token': device_token,
        'platform': platform,
        'operator_id': operator_id
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

### Unregister Device

```http
DELETE /api/v2/devices/{device_id}
Authorization: Zoho-oauthtoken {access_token}
```

**Example**:
```javascript
const unregisterDevice = async (accessToken, deviceId) => {
  const response = await axios.delete(
    `https://salesiq.zoho.com/api/v2/devices/${deviceId}`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

### Send Custom Notification

```http
POST /api/v2/notifications
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "operator_id": "operator123",
  "title": "New High Priority Chat",
  "message": "A VIP customer is waiting",
  "data": {
    "chat_id": "chat123",
    "priority": "high"
  }
}
```

**Example**:
```javascript
const sendNotification = async (accessToken, operatorId, title, message, data = {}) => {
  const response = await axios.post(
    'https://salesiq.zoho.com/api/v2/notifications',
    {
      operator_id: operatorId,
      title: title,
      message: message,
      data: data
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

## Visitor Routing

### Routing Rules Object

```json
{
  "id": "rule123456789",
  "name": "Route VIP to Senior Agents",
  "priority": 1,
  "enabled": true,
  "conditions": [
    {
      "field": "visitor.tags",
      "operator": "contains",
      "value": "vip"
    },
    {
      "field": "visitor.lead_score",
      "operator": "greater_than",
      "value": 80
    }
  ],
  "actions": {
    "assign_to": "department",
    "department_id": "dept789",
    "operator_ids": ["operator456", "operator789"],
    "priority": "high"
  }
}
```

### List Routing Rules

```http
GET /api/v2/routing/rules
Authorization: Zoho-oauthtoken {access_token}
```

**Example**:
```javascript
const listRoutingRules = async (accessToken) => {
  const response = await axios.get(
    'https://salesiq.zoho.com/api/v2/routing/rules',
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
def list_routing_rules(access_token):
    url = 'https://salesiq.zoho.com/api/v2/routing/rules'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    response = requests.get(url, headers=headers)
    return response.json()
```

### Create Routing Rule

```http
POST /api/v2/routing/rules
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "name": "Route High Value Leads",
  "priority": 1,
  "enabled": true,
  "conditions": [
    {
      "field": "visitor.lead_score",
      "operator": "greater_than",
      "value": 75
    }
  ],
  "actions": {
    "assign_to": "operator",
    "operator_ids": ["operator456"]
  }
}
```

**Example**:
```javascript
const createRoutingRule = async (accessToken, ruleData) => {
  const response = await axios.post(
    'https://salesiq.zoho.com/api/v2/routing/rules',
    ruleData,
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
const rule = await createRoutingRule(accessToken, {
  name: 'Route High Value Leads',
  priority: 1,
  enabled: true,
  conditions: [
    {
      field: 'visitor.lead_score',
      operator: 'greater_than',
      value: 75
    }
  ],
  actions: {
    assign_to: 'operator',
    operator_ids: ['operator456']
  }
});
```

### Update Routing Rule

```http
PATCH /api/v2/routing/rules/{rule_id}
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "enabled": false
}
```

### Delete Routing Rule

```http
DELETE /api/v2/routing/rules/{rule_id}
Authorization: Zoho-oauthtoken {access_token}
```

---

## JavaScript APIs

### Widget Installation

Add the following code to your website before the closing `</body>` tag:

```html
<script type="text/javascript">
var $zoho=$zoho || {};
$zoho.salesiq = $zoho.salesiq || {
  widgetcode: "your_widget_code_here",
  values: {},
  ready: function(){}
};
var d=document;
s=d.createElement("script");
s.type="text/javascript";
s.id="zsiqscript";
s.defer=true;
s.src="https://salesiq.zoho.com/widget";
t=d.getElementsByTagName("script")[0];
t.parentNode.insertBefore(s,t);
</script>
```

### Initialize Widget

```javascript
$zoho.salesiq.ready = function() {
  // Widget is ready
  console.log('SalesIQ widget loaded');
};
```

### Set Visitor Information

```javascript
// Set visitor name
$zoho.salesiq.visitor.name("John Doe");

// Set visitor email
$zoho.salesiq.visitor.email("john@example.com");

// Set visitor phone
$zoho.salesiq.visitor.phone("+1-555-0123");

// Set visitor company
$zoho.salesiq.visitor.contactnumber("+1-555-0123");

// Set custom visitor info
$zoho.salesiq.visitor.info({
  "Company": "Acme Corp",
  "Industry": "Technology",
  "Budget": "$10,000-$50,000"
});
```

### Track Custom Events

```javascript
// Track page view
$zoho.salesiq.tracking.pageview("https://example.com/pricing");

// Track custom event
$zoho.salesiq.tracking.event("product_viewed", {
  product_id: "prod_123",
  product_name: "Enterprise Plan",
  price: 99.99
});

// Track conversion
$zoho.salesiq.tracking.conversion("signup_completed", {
  plan: "enterprise",
  value: 999
});
```

### Show/Hide Chat Widget

```javascript
// Show widget
$zoho.salesiq.floatwindow.visible("show");

// Hide widget
$zoho.salesiq.floatwindow.visible("hide");

// Toggle widget
$zoho.salesiq.floatwindow.visible("toggle");

// Open chat window
$zoho.salesiq.floatwindow.open();

// Close chat window
$zoho.salesiq.floatwindow.close();

// Minimize chat window
$zoho.salesiq.floatwindow.minimize();
```

### Set Chat Department

```javascript
// Route to specific department
$zoho.salesiq.chat.department("Sales");
```

### Customize Widget Appearance

```javascript
// Set widget theme color
$zoho.salesiq.theme.color("#007bff");

// Set widget position
$zoho.salesiq.floatbutton.position("bottomright"); // or "bottomleft"

// Set greeting message
$zoho.salesiq.greeting.message("Hello! How can we help you today?");

// Show/hide offline message
$zoho.salesiq.offlinemessage.visibility(true);
```

### Trigger Chat

```javascript
// Start chat with message
$zoho.salesiq.floatwindow.open({
  message: "I need help with pricing"
});

// Start chat with specific department
$zoho.salesiq.chat.start("Sales");
```

### Listen to Widget Events

```javascript
// Chat started event
$zoho.salesiq.on("chat.start", function(chatId) {
  console.log("Chat started:", chatId);
  // Track analytics
  gtag('event', 'chat_started', {
    'event_category': 'engagement',
    'event_label': chatId
  });
});

// Chat ended event
$zoho.salesiq.on("chat.end", function(chatId) {
  console.log("Chat ended:", chatId);
});

// Message received event
$zoho.salesiq.on("message.received", function(message) {
  console.log("New message:", message);
});

// Operator typing event
$zoho.salesiq.on("operator.typing", function(operatorName) {
  console.log(operatorName + " is typing...");
});

// Widget opened event
$zoho.salesiq.on("widget.opened", function() {
  console.log("Widget opened");
});

// Widget closed event
$zoho.salesiq.on("widget.closed", function() {
  console.log("Widget closed");
});
```

### Complete JavaScript Example

```javascript
// Complete widget initialization with all features
<script type="text/javascript">
var $zoho=$zoho || {};
$zoho.salesiq = $zoho.salesiq || {
  widgetcode: "your_widget_code_here",
  values: {},
  ready: function() {
    // Widget customization
    $zoho.salesiq.theme.color("#007bff");
    $zoho.salesiq.floatbutton.position("bottomright");

    // Set visitor information from logged-in user
    if (window.currentUser) {
      $zoho.salesiq.visitor.name(window.currentUser.name);
      $zoho.salesiq.visitor.email(window.currentUser.email);
      $zoho.salesiq.visitor.phone(window.currentUser.phone);
      $zoho.salesiq.visitor.info({
        "User ID": window.currentUser.id,
        "Plan": window.currentUser.plan,
        "Signup Date": window.currentUser.signupDate
      });
    }

    // Track page view
    $zoho.salesiq.tracking.pageview(window.location.href);

    // Listen to events
    $zoho.salesiq.on("chat.start", function(chatId) {
      console.log("Chat started:", chatId);
      // Send to analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'chat_started', {
          'event_category': 'engagement'
        });
      }
    });

    $zoho.salesiq.on("chat.end", function(chatId) {
      console.log("Chat ended:", chatId);
      // Show feedback form
      showFeedbackForm();
    });

    // Auto-open widget for high-value pages
    if (window.location.pathname === '/pricing' ||
        window.location.pathname === '/enterprise') {
      setTimeout(function() {
        $zoho.salesiq.floatwindow.open();
      }, 3000); // Open after 3 seconds
    }
  }
};

var d=document;
s=d.createElement("script");
s.type="text/javascript";
s.id="zsiqscript";
s.defer=true;
s.src="https://salesiq.zoho.com/widget";
t=d.getElementsByTagName("script")[0];
t.parentNode.insertBefore(s,t);
</script>
```

---

## Webhooks

### Webhook Events

**Available Events**:
- `chat.started` - New chat initiated
- `chat.ended` - Chat ended
- `chat.missed` - Chat missed by operators
- `chat.rating` - Chat rating submitted
- `message.received` - New message in chat
- `visitor.identified` - Visitor identified (email/name captured)
- `visitor.online` - Visitor came online
- `visitor.offline` - Visitor went offline
- `operator.status_changed` - Operator status changed
- `lead.created` - New lead created
- `trigger.executed` - Automation trigger executed

### Create Webhook

```http
POST /api/v2/webhooks
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "name": "Chat Events Webhook",
  "url": "https://yourdomain.com/webhook/salesiq",
  "events": ["chat.started", "chat.ended", "chat.rating"],
  "enabled": true,
  "secret": "your_webhook_secret_key"
}
```

**Example**:
```javascript
const createWebhook = async (accessToken, webhookData) => {
  const response = await axios.post(
    'https://salesiq.zoho.com/api/v2/webhooks',
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
const webhook = await createWebhook(accessToken, {
  name: 'Chat Events Webhook',
  url: 'https://yourdomain.com/webhook/salesiq',
  events: ['chat.started', 'chat.ended', 'chat.rating'],
  enabled: true,
  secret: 'your_webhook_secret_key'
});
```

```python
def create_webhook(access_token, webhook_data):
    url = 'https://salesiq.zoho.com/api/v2/webhooks'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    response = requests.post(url, json=webhook_data, headers=headers)
    return response.json()

# Usage
webhook = create_webhook(access_token, {
    'name': 'Chat Events Webhook',
    'url': 'https://yourdomain.com/webhook/salesiq',
    'events': ['chat.started', 'chat.ended', 'chat.rating'],
    'enabled': True,
    'secret': 'your_webhook_secret_key'
})
```

```deluge
// Deluge
webhook_map = Map();
webhook_map.put("name", "Chat Events Webhook");
webhook_map.put("url", "https://yourdomain.com/webhook/salesiq");
webhook_map.put("events", {"chat.started", "chat.ended", "chat.rating"});
webhook_map.put("enabled", true);

response = zoho.salesiq.create("webhooks", webhook_map);
info response;
```

### Webhook Payload Examples

**Chat Started Event**:
```json
{
  "event": "chat.started",
  "timestamp": "2025-12-12T14:30:00.000Z",
  "data": {
    "chat_id": "chat123456789",
    "visitor_id": "visitor123",
    "visitor_name": "John Doe",
    "visitor_email": "john@example.com",
    "operator_id": "operator456",
    "operator_name": "Sarah Johnson",
    "department_id": "dept789",
    "department_name": "Sales",
    "started_at": "2025-12-12T14:30:00.000Z"
  }
}
```

**Chat Ended Event**:
```json
{
  "event": "chat.ended",
  "timestamp": "2025-12-12T14:45:00.000Z",
  "data": {
    "chat_id": "chat123456789",
    "visitor_id": "visitor123",
    "operator_id": "operator456",
    "started_at": "2025-12-12T14:30:00.000Z",
    "ended_at": "2025-12-12T14:45:00.000Z",
    "duration": 900,
    "message_count": 15,
    "ended_by": "operator"
  }
}
```

**Chat Rating Event**:
```json
{
  "event": "chat.rating",
  "timestamp": "2025-12-12T14:46:00.000Z",
  "data": {
    "chat_id": "chat123456789",
    "visitor_id": "visitor123",
    "operator_id": "operator456",
    "rating": 5,
    "feedback": "Excellent service! Very helpful.",
    "submitted_at": "2025-12-12T14:46:00.000Z"
  }
}
```

**Visitor Identified Event**:
```json
{
  "event": "visitor.identified",
  "timestamp": "2025-12-12T14:25:00.000Z",
  "data": {
    "visitor_id": "visitor123",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1-555-0123",
    "company": "Acme Corp",
    "identified_at": "2025-12-12T14:25:00.000Z"
  }
}
```

### Handle Webhooks in Your Application

**Express.js Webhook Handler**:
```javascript
const express = require('express');
const crypto = require('crypto');
const app = express();

app.use(express.json());

// Webhook secret for verification
const WEBHOOK_SECRET = 'your_webhook_secret_key';

// Verify webhook signature
const verifyWebhookSignature = (payload, signature) => {
  const computedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(JSON.stringify(payload))
    .digest('hex');

  return computedSignature === signature;
};

app.post('/webhook/salesiq', (req, res) => {
  const signature = req.headers['x-salesiq-signature'];

  // Verify signature
  if (!verifyWebhookSignature(req.body, signature)) {
    console.error('Invalid webhook signature');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const { event, data } = req.body;

  // Handle different events
  switch(event) {
    case 'chat.started':
      console.log('New chat started:', data.chat_id);
      // Send notification to team
      notifyTeam('New chat started', data);
      // Update CRM
      updateCRM(data.visitor_id, { last_chat: data.chat_id });
      break;

    case 'chat.ended':
      console.log('Chat ended:', data.chat_id);
      // Save transcript
      saveTranscript(data.chat_id);
      // Calculate metrics
      updateMetrics(data);
      break;

    case 'chat.rating':
      console.log('Chat rating received:', data.rating);
      // Save rating
      saveRating(data);
      // Alert if low rating
      if (data.rating <= 2) {
        alertManager('Low chat rating', data);
      }
      break;

    case 'visitor.identified':
      console.log('Visitor identified:', data.email);
      // Sync to CRM
      syncVisitorToCRM(data);
      // Send to marketing automation
      sendToMarketingAutomation(data);
      break;

    case 'lead.created':
      console.log('New lead created:', data.lead_id);
      // Process lead
      processLead(data);
      break;
  }

  // Always respond with 200 to acknowledge receipt
  res.status(200).json({ received: true });
});

app.listen(3000, () => {
  console.log('Webhook server listening on port 3000');
});
```

**Flask Webhook Handler (Python)**:
```python
from flask import Flask, request, jsonify
import hmac
import hashlib
import json

app = Flask(__name__)

WEBHOOK_SECRET = 'your_webhook_secret_key'

def verify_webhook_signature(payload, signature):
    """Verify webhook signature"""
    computed_signature = hmac.new(
        WEBHOOK_SECRET.encode(),
        json.dumps(payload).encode(),
        hashlib.sha256
    ).hexdigest()

    return computed_signature == signature

@app.route('/webhook/salesiq', methods=['POST'])
def handle_webhook():
    signature = request.headers.get('X-Salesiq-Signature')

    # Verify signature
    if not verify_webhook_signature(request.json, signature):
        print('Invalid webhook signature')
        return jsonify({'error': 'Invalid signature'}), 401

    data = request.json
    event = data.get('event')
    payload = data.get('data')

    # Handle different events
    if event == 'chat.started':
        print(f"New chat started: {payload.get('chat_id')}")
        # Send notification to team
        notify_team('New chat started', payload)
        # Update CRM
        update_crm(payload.get('visitor_id'), {'last_chat': payload.get('chat_id')})

    elif event == 'chat.ended':
        print(f"Chat ended: {payload.get('chat_id')}")
        # Save transcript
        save_transcript(payload.get('chat_id'))
        # Calculate metrics
        update_metrics(payload)

    elif event == 'chat.rating':
        print(f"Chat rating received: {payload.get('rating')}")
        # Save rating
        save_rating(payload)
        # Alert if low rating
        if payload.get('rating', 0) <= 2:
            alert_manager('Low chat rating', payload)

    elif event == 'visitor.identified':
        print(f"Visitor identified: {payload.get('email')}")
        # Sync to CRM
        sync_visitor_to_crm(payload)
        # Send to marketing automation
        send_to_marketing_automation(payload)

    elif event == 'lead.created':
        print(f"New lead created: {payload.get('lead_id')}")
        # Process lead
        process_lead(payload)

    # Always respond with 200 to acknowledge receipt
    return jsonify({'received': True}), 200

if __name__ == '__main__':
    app.run(port=3000)
```

### List Webhooks

```http
GET /api/v2/webhooks
Authorization: Zoho-oauthtoken {access_token}
```

**Example**:
```javascript
const listWebhooks = async (accessToken) => {
  const response = await axios.get(
    'https://salesiq.zoho.com/api/v2/webhooks',
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

### Update Webhook

```http
PATCH /api/v2/webhooks/{webhook_id}
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "enabled": false
}
```

### Delete Webhook

```http
DELETE /api/v2/webhooks/{webhook_id}
Authorization: Zoho-oauthtoken {access_token}
```

**Example**:
```javascript
const deleteWebhook = async (accessToken, webhookId) => {
  const response = await axios.delete(
    `https://salesiq.zoho.com/api/v2/webhooks/${webhookId}`,
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

## Rate Limits

### API Call Limits

Zoho SalesIQ enforces rate limits to ensure fair usage and system stability.

| Plan | API Calls per Minute | API Calls per Day |
|------|---------------------|-------------------|
| Free | 10 | 1,000 |
| Basic | 20 | 5,000 |
| Professional | 50 | 20,000 |
| Enterprise | 100 | 50,000 |

### Rate Limit Headers

Every API response includes rate limit information:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1702396800
```

- `X-RateLimit-Limit` - Total requests allowed per minute
- `X-RateLimit-Remaining` - Requests remaining in current window
- `X-RateLimit-Reset` - Timestamp when the rate limit resets (Unix epoch)

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

// Usage
const visitors = await makeAPICallWithRetry(
  () => listVisitors(accessToken, { status: 'online' })
);
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

# Usage
visitors = make_api_call_with_retry(
    lambda: list_visitors(access_token, {'status': 'online'})
)
```

### Concurrent Request Limits

- Maximum 10 concurrent API requests per organization
- Exceeding this limit returns a 429 error

---

## Error Codes

### HTTP Status Codes

| Status Code | Meaning | Common Causes |
|-------------|---------|---------------|
| 200 | OK | Successful request |
| 201 | Created | Resource successfully created |
| 204 | No Content | Successful deletion |
| 400 | Bad Request | Invalid request parameters or body |
| 401 | Unauthorized | Invalid or expired access token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource does not exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |
| 503 | Service Unavailable | Service temporarily unavailable |

### Error Response Structure

```json
{
  "status": "error",
  "code": "INVALID_TOKEN",
  "message": "The access token is invalid or has expired",
  "details": {
    "token_expires_at": "2025-12-12T13:30:00.000Z"
  }
}
```

### Common Error Codes

| Error Code | Description | Solution |
|------------|-------------|----------|
| INVALID_TOKEN | Access token is invalid or expired | Refresh the access token |
| INVALID_OAUTH_SCOPE | Insufficient OAuth scope permissions | Update OAuth scopes and regenerate token |
| INVALID_REQUEST | Invalid request parameters | Check request format and parameters |
| REQUIRED_FIELD_MISSING | Required field not provided | Include all required fields |
| RESOURCE_NOT_FOUND | Resource ID does not exist | Verify the resource ID |
| DUPLICATE_RESOURCE | Duplicate resource detected | Check for existing resources |
| RATE_LIMIT_EXCEEDED | API rate limit exceeded | Implement rate limiting and retry logic |
| INTERNAL_ERROR | Server error | Retry with exponential backoff |
| PERMISSION_DENIED | User lacks required permissions | Grant appropriate permissions |
| INVALID_VISITOR_ID | Visitor ID is invalid | Verify visitor ID |
| CHAT_NOT_ACTIVE | Chat is not active | Check chat status |
| OPERATOR_OFFLINE | Operator is offline | Check operator availability |
| INVALID_DEPARTMENT | Department does not exist | Verify department ID |

### Error Handling Best Practices

```javascript
const handleAPIError = (error) => {
  if (error.response) {
    const { status, data } = error.response;

    switch (status) {
      case 400:
        console.error('Bad Request:', data.message);
        console.error('Details:', data.details);
        break;

      case 401:
        console.error('Unauthorized. Refreshing token...');
        // Trigger token refresh
        refreshAccessToken();
        break;

      case 403:
        console.error('Forbidden. Check permissions.');
        break;

      case 404:
        console.error('Resource not found:', data.message);
        break;

      case 429:
        console.error('Rate limit exceeded. Retry after:',
          error.response.headers['x-ratelimit-reset']);
        break;

      case 500:
      case 503:
        console.error('Server error. Retrying...');
        // Implement retry logic
        break;

      default:
        console.error('API Error:', status, data);
    }
  } else if (error.request) {
    console.error('No response received:', error.message);
  } else {
    console.error('Request setup error:', error.message);
  }
};

// Usage
try {
  const chat = await getChat(accessToken, chatId);
} catch (error) {
  handleAPIError(error);
}
```

---

## Code Examples

### Complete Chat Management Workflow

```javascript
// Complete workflow: Handle incoming chat, respond, get feedback
const handleChatWorkflow = async (accessToken, chatId) => {
  try {
    // Step 1: Get chat details
    const chat = await getChat(accessToken, chatId);
    console.log('Chat details:', chat);

    // Step 2: Get visitor information
    const visitor = await getVisitor(accessToken, chat.visitor_id);
    console.log('Visitor:', visitor.name, visitor.email);

    // Step 3: Send greeting message
    await sendChatMessage(
      accessToken,
      chatId,
      `Hi ${visitor.name}! How can I help you today?`
    );

    // Step 4: Wait for visitor response (in real app, use webhooks)
    // ... handle conversation ...

    // Step 5: Check if issue is resolved
    await sendChatMessage(
      accessToken,
      chatId,
      'Is there anything else I can help you with?'
    );

    // Step 6: End chat
    await endChat(
      accessToken,
      chatId,
      'Thank you for chatting with us. Have a great day!'
    );

    // Step 7: Update visitor tags
    await tagVisitor(accessToken, visitor.id, ['assisted', 'satisfied']);

    console.log('Chat workflow completed successfully');

  } catch (error) {
    handleAPIError(error);
  }
};
```

### Monitor Active Chats

```javascript
// Monitor and manage active chats
const monitorActiveChats = async (accessToken) => {
  try {
    // Get all active chats
    const response = await listChats(accessToken, { status: 'active' });
    const activeChats = response.data;

    console.log(`Monitoring ${activeChats.length} active chats...`);

    for (const chat of activeChats) {
      // Check chat duration
      const duration = Date.now() - new Date(chat.started_at).getTime();
      const minutes = Math.floor(duration / 60000);

      // Alert if chat is taking too long
      if (minutes > 30) {
        console.log(`Alert: Chat ${chat.id} has been active for ${minutes} minutes`);
        // Send notification to supervisor
        await sendNotification(
          accessToken,
          'supervisor_id',
          'Long Chat Alert',
          `Chat ${chat.id} has been active for ${minutes} minutes`,
          { chat_id: chat.id, duration: minutes }
        );
      }

      // Check if operator is still online
      const operator = await getOperator(accessToken, chat.operator_id);
      if (operator.status !== 'online') {
        console.log(`Alert: Operator ${operator.name} is ${operator.status} but has active chat`);
        // Transfer chat to available operator
        const availableOperators = await listOperators(
          accessToken,
          { status: 'online', availability: 'available' }
        );

        if (availableOperators.data.length > 0) {
          await transferChat(
            accessToken,
            chat.id,
            availableOperators.data[0].id,
            'Transferring you to another available agent'
          );
        }
      }
    }

  } catch (error) {
    handleAPIError(error);
  }
};

// Run monitoring every 5 minutes
setInterval(() => {
  monitorActiveChats(accessToken);
}, 5 * 60 * 1000);
```

### Sync Visitors to CRM

```python
import requests
from datetime import datetime, timedelta

def sync_visitors_to_crm(access_token, crm_access_token):
    """Sync identified visitors to Zoho CRM as leads"""

    # Get visitors from last 24 hours
    end_date = datetime.now()
    start_date = end_date - timedelta(days=1)

    visitors_response = list_visitors(access_token, {
        'from_date': start_date.isoformat(),
        'to_date': end_date.isoformat()
    })

    visitors = visitors_response.get('data', [])
    synced_count = 0

    for visitor in visitors:
        # Skip if no email
        if not visitor.get('email'):
            continue

        # Check if lead already exists in CRM
        search_url = 'https://www.zohoapis.com/crm/v8/Leads/search'
        search_params = {
            'criteria': f"(Email:equals:{visitor['email']})"
        }
        search_headers = {
            'Authorization': f'Zoho-oauthtoken {crm_access_token}'
        }

        search_response = requests.get(
            search_url,
            params=search_params,
            headers=search_headers
        )

        # Skip if lead already exists
        if search_response.status_code == 200 and search_response.json().get('data'):
            print(f"Lead already exists for {visitor['email']}")
            continue

        # Create lead in CRM
        lead_data = {
            'First_Name': visitor.get('name', '').split()[0] if visitor.get('name') else '',
            'Last_Name': visitor.get('name', '').split()[-1] if visitor.get('name') else 'Unknown',
            'Email': visitor['email'],
            'Phone': visitor.get('phone'),
            'Company': visitor.get('company'),
            'Lead_Source': 'Website Chat',
            'Lead_Status': 'New',
            'Description': f"Visitor ID: {visitor['id']}, Pages Visited: {visitor.get('pages_visited', 0)}",
            'City': visitor.get('city'),
            'State': visitor.get('region'),
            'Country': visitor.get('country')
        }

        # Add custom fields
        if visitor.get('custom_fields'):
            for key, value in visitor['custom_fields'].items():
                lead_data[f'Custom_Field_{key}'] = value

        crm_url = 'https://www.zohoapis.com/crm/v8/Leads'
        crm_headers = {
            'Authorization': f'Zoho-oauthtoken {crm_access_token}',
            'Content-Type': 'application/json'
        }
        crm_data = {'data': [lead_data]}

        crm_response = requests.post(
            crm_url,
            json=crm_data,
            headers=crm_headers
        )

        if crm_response.status_code == 201:
            print(f"Synced visitor {visitor['email']} to CRM")
            synced_count += 1
        else:
            print(f"Failed to sync {visitor['email']}: {crm_response.text}")

    print(f"Synced {synced_count} visitors to CRM")
    return synced_count

# Usage
synced = sync_visitors_to_crm(salesiq_access_token, crm_access_token)
```

### Generate Chat Analytics Report

```python
def generate_chat_analytics(access_token, days=30):
    """Generate comprehensive chat analytics report"""
    from datetime import datetime, timedelta
    from collections import defaultdict

    # Calculate date range
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)

    # Fetch all chats
    all_chats = []
    page = 1
    per_page = 100

    while True:
        response = list_chats(access_token, {
            'from_date': start_date.isoformat(),
            'to_date': end_date.isoformat(),
            'page': page,
            'per_page': per_page
        })

        if not response.get('data'):
            break

        all_chats.extend(response['data'])

        if len(response['data']) < per_page:
            break

        page += 1

    # Calculate metrics
    metrics = {
        'total_chats': len(all_chats),
        'by_status': defaultdict(int),
        'by_department': defaultdict(int),
        'by_operator': defaultdict(int),
        'by_rating': defaultdict(int),
        'avg_duration': 0,
        'avg_response_time': 0,
        'avg_rating': 0,
        'missed_chats': 0,
        'total_messages': 0
    }

    durations = []
    response_times = []
    ratings = []

    for chat in all_chats:
        # Count by status
        metrics['by_status'][chat['status']] += 1

        # Count by department
        if chat.get('department_id'):
            metrics['by_department'][chat['department_id']] += 1

        # Count by operator
        if chat.get('operator_id'):
            metrics['by_operator'][chat['operator_id']] += 1

        # Count by rating
        if chat.get('rating'):
            metrics['by_rating'][chat['rating']] += 1
            ratings.append(chat['rating'])

        # Track durations
        if chat.get('duration'):
            durations.append(chat['duration'])

        # Count missed chats
        if chat['status'] == 'missed':
            metrics['missed_chats'] += 1

        # Count messages
        if chat.get('transcript'):
            metrics['total_messages'] += len(chat['transcript'])

    # Calculate averages
    if durations:
        metrics['avg_duration'] = sum(durations) / len(durations)

    if ratings:
        metrics['avg_rating'] = sum(ratings) / len(ratings)

    # Print report
    print(f"\n===== Chat Analytics Report ({days} days) =====")
    print(f"Total Chats: {metrics['total_chats']}")
    print(f"\nBy Status:")
    for status, count in metrics['by_status'].items():
        print(f"  {status}: {count}")

    print(f"\nBy Rating:")
    for rating in sorted(metrics['by_rating'].keys(), reverse=True):
        count = metrics['by_rating'][rating]
        print(f"  {rating} stars: {count}")

    print(f"\nMetrics:")
    print(f"  Average Duration: {metrics['avg_duration']:.2f} seconds")
    print(f"  Average Rating: {metrics['avg_rating']:.2f}")
    print(f"  Missed Chats: {metrics['missed_chats']}")
    print(f"  Total Messages: {metrics['total_messages']}")

    return metrics

# Usage
analytics = generate_chat_analytics(access_token, days=30)
```

### Auto-Assign Chats Based on Skills

```javascript
// Intelligent chat routing based on visitor tags and operator skills
const autoAssignChat = async (accessToken, chatId) => {
  try {
    // Get chat details
    const chat = await getChat(accessToken, chatId);

    // Get visitor information
    const visitor = await getVisitor(accessToken, chat.visitor_id);

    // Determine required skills based on visitor tags and info
    let requiredSkills = [];

    if (visitor.tags.includes('technical')) {
      requiredSkills.push('Technical Support');
    }
    if (visitor.tags.includes('enterprise')) {
      requiredSkills.push('Sales');
    }
    if (visitor.lead_score > 75) {
      requiredSkills.push('Sales');
    }

    // If no specific skills needed, use general support
    if (requiredSkills.length === 0) {
      requiredSkills.push('General Support');
    }

    // Get available operators with required skills
    const operators = await listOperators(accessToken, {
      status: 'online',
      availability: 'available'
    });

    // Filter operators by skills
    let matchingOperators = operators.data.filter(op => {
      return requiredSkills.some(skill => op.skills.includes(skill));
    });

    // If no matching operators, use any available operator
    if (matchingOperators.length === 0) {
      matchingOperators = operators.data;
    }

    if (matchingOperators.length === 0) {
      console.log('No available operators');
      return null;
    }

    // Sort by active chats (load balancing)
    matchingOperators.sort((a, b) => a.active_chats - b.active_chats);

    // Assign to operator with least active chats
    const selectedOperator = matchingOperators[0];

    await transferChat(
      accessToken,
      chatId,
      selectedOperator.id,
      `Connecting you with ${selectedOperator.name}`
    );

    console.log(`Chat ${chatId} assigned to ${selectedOperator.name}`);

    return selectedOperator;

  } catch (error) {
    handleAPIError(error);
    return null;
  }
};
```

---

## Best Practices

### 1. Authentication and Security

**Store Credentials Securely**:
```javascript
// Bad - Never hardcode credentials
const clientId = '1000.ABCDEF123456';
const clientSecret = 'secret123';

// Good - Use environment variables
const clientId = process.env.ZOHO_CLIENT_ID;
const clientSecret = process.env.ZOHO_CLIENT_SECRET;
```

**Implement Token Refresh**:
- Always refresh tokens automatically before they expire
- Store refresh tokens securely (encrypted at rest)
- Never expose tokens in client-side code or logs

**Use Appropriate OAuth Scopes**:
- Request only the minimum scopes needed
- Use specific scopes (e.g., `SalesIQ.chats.READ`) instead of `.ALL` when possible

### 2. Error Handling

**Implement Robust Error Handling**:
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

    // Log and rethrow other errors
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
};
```

### 3. Performance Optimization

**Implement Caching**:
```javascript
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getCachedOperators = async (accessToken) => {
  const cacheKey = 'operators';
  const cached = cache.get(cacheKey);

  if (cached && cached.timestamp > Date.now() - CACHE_TTL) {
    return cached.data;
  }

  const operators = await listOperators(accessToken);
  cache.set(cacheKey, {
    data: operators,
    timestamp: Date.now()
  });

  return operators;
};
```

**Use Webhooks Instead of Polling**:
```javascript
// Bad - Polling for new chats
setInterval(async () => {
  const chats = await listChats(accessToken, { status: 'waiting' });
  // Process chats...
}, 5000);

// Good - Use webhooks for real-time updates
app.post('/webhook/salesiq', (req, res) => {
  const { event, data } = req.body;
  if (event === 'chat.started') {
    processNewChat(data);
  }
  res.status(200).json({ received: true });
});
```

### 4. Widget Integration

**Progressive Enhancement**:
```javascript
// Load widget asynchronously
$zoho.salesiq.ready = function() {
  // Set visitor info only if available
  if (window.currentUser) {
    $zoho.salesiq.visitor.name(window.currentUser.name);
    $zoho.salesiq.visitor.email(window.currentUser.email);
  }

  // Auto-open widget only on high-value pages
  if (isHighValuePage()) {
    setTimeout(() => {
      $zoho.salesiq.floatwindow.open();
    }, 3000);
  }
};
```

**Track Important Events**:
```javascript
// Track conversion events
$zoho.salesiq.tracking.conversion('signup_completed', {
  plan: 'enterprise',
  value: 999
});

// Track custom events
$zoho.salesiq.tracking.event('product_viewed', {
  product_id: 'prod_123',
  product_name: 'Enterprise Plan',
  price: 99.99
});
```

### 5. Monitoring and Analytics

**Track API Usage**:
```javascript
class APIMonitor {
  constructor() {
    this.calls = [];
  }

  logCall(endpoint, method, status, duration) {
    this.calls.push({
      endpoint,
      method,
      status,
      duration,
      timestamp: new Date()
    });
  }

  getStats() {
    return {
      totalCalls: this.calls.length,
      avgDuration: this.calls.reduce((sum, c) => sum + c.duration, 0) / this.calls.length,
      errorRate: this.calls.filter(c => c.status >= 400).length / this.calls.length
    };
  }
}
```

### 6. Webhook Best Practices

**Validate Webhook Signatures**:
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

**Implement Idempotency**:
```javascript
const processedWebhooks = new Set();

const processWebhook = (webhookData) => {
  const webhookId = `${webhookData.event}_${webhookData.data.chat_id}_${webhookData.timestamp}`;

  // Skip if already processed
  if (processedWebhooks.has(webhookId)) {
    console.log('Webhook already processed:', webhookId);
    return;
  }

  // Process webhook
  handleWebhookEvent(webhookData);

  // Mark as processed
  processedWebhooks.add(webhookId);
};
```

---

## Data Centers

Zoho SalesIQ operates in multiple data centers. Use the appropriate base URL for your region:

| Data Center | Base URL |
|-------------|----------|
| US | https://salesiq.zoho.com |
| EU | https://salesiq.zoho.eu |
| IN | https://salesiq.zoho.in |
| AU | https://salesiq.zoho.com.au |
| JP | https://salesiq.zoho.jp |
| CA | https://salesiq.zoho.ca |
| CN | https://salesiq.zoho.com.cn |

**Important**: The OAuth token domain must match your API domain. Check the `api_domain` in your OAuth token response.

---

## Additional Resources

- [Official Zoho SalesIQ API Documentation](https://www.zoho.com/salesiq/help/developer-section/)
- [Zoho SalesIQ Developer Portal](https://www.zoho.com/salesiq/developers/)
- [Zoho API Console](https://api-console.zoho.com/)
- [Developer Community Forums](https://help.zoho.com/portal/en/community/salesiq)
- [JavaScript API Reference](https://www.zoho.com/salesiq/help/developer-section/js-api.html)
- [Widget Customization Guide](https://www.zoho.com/salesiq/help/developer-section/customization.html)
- [Status Page](https://status.zoho.com/)

---

## SDK Support

While Zoho SalesIQ doesn't have official SDKs like Zoho CRM, you can use the REST API directly with any HTTP client library:

**Recommended Libraries**:
- **JavaScript/Node.js**: axios, node-fetch, got
- **Python**: requests, httpx, aiohttp
- **PHP**: Guzzle
- **Ruby**: httparty, faraday
- **Java**: OkHttp, Apache HttpClient
- **C#**: HttpClient, RestSharp

**Mobile SDKs**:
- **iOS**: Native iOS SDK available
- **Android**: Native Android SDK available

---

## Changelog

### v2 (Current)
- REST API v2 endpoints
- Enhanced visitor tracking
- Real-time chat APIs
- Webhook support for all events
- Operator management
- Push notification support
- Advanced routing rules
- JavaScript widget APIs
- Multi-brand support
- Department management
- Custom field support
- Lead scoring
- Analytics APIs

### v1 (Legacy)
- Basic chat APIs
- Visitor tracking
- Operator APIs
- Simple webhooks

---

**Last Updated**: December 2025
**API Version**: v2
