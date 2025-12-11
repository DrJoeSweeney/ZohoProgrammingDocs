# Zoho Mail API Reference

## Overview

Zoho Mail is a secure, ad-free email hosting service with powerful features for businesses. The API enables programmatic access to email operations, folder management, and account administration.

**Current API Version**: v1
**Base URL**: `https://mail.zoho.com/api/`
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

**Token URL**:
```
https://accounts.zoho.com/oauth/v2/token
```

**Required Scopes**:
- `ZohoMail.messages.ALL` - Full access to messages
- `ZohoMail.messages.READ` - Read-only access to messages
- `ZohoMail.folders.ALL` - Manage folders
- `ZohoMail.accounts.READ` - Read account information

**Example Authorization Request**:
```http
GET https://accounts.zoho.com/oauth/v2/auth?
  response_type=code&
  client_id={client_id}&
  scope=ZohoMail.messages.ALL,ZohoMail.folders.ALL&
  redirect_uri={redirect_uri}&
  access_type=offline
```

---

## Rate Limits

- **API Calls**: 2,500 calls per day per user
- **Burst Limit**: 100 calls per minute
- **Send Email**: 500 emails per day (varies by plan)

**Rate Limit Headers**:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1704124800
```

---

## API Modules

### 1. Accounts

**Purpose**: Manage email accounts and settings

**Endpoints**:
```http
GET    /api/accounts                    # List all accounts
GET    /api/accounts/{accountId}        # Get account details
GET    /api/accounts/{accountId}/profile # Get account profile
```

**Example - Get All Accounts**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const getAccounts = async (accessToken) => {
  const response = await axios.get(
    'https://mail.zoho.com/api/accounts',
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
  "status": {
    "code": 200,
    "description": "success"
  },
  "data": [
    {
      "accountId": "123456000000012345",
      "accountName": "user@domain.com",
      "displayName": "John Doe",
      "emailAddress": "user@domain.com",
      "isDefault": true,
      "isPrimary": true
    }
  ]
}
```

---

### 2. Folders

**Purpose**: Manage email folders and labels

**Endpoints**:
```http
GET    /api/accounts/{accountId}/folders           # List folders
GET    /api/accounts/{accountId}/folders/{folderId} # Get folder details
POST   /api/accounts/{accountId}/folders           # Create folder
PUT    /api/accounts/{accountId}/folders/{folderId} # Update folder
DELETE /api/accounts/{accountId}/folders/{folderId} # Delete folder
```

**Built-in Folders**:
- `inbox` - Inbox
- `sent` - Sent Items
- `drafts` - Drafts
- `trash` - Trash
- `spam` - Spam/Junk

**Example - Create Folder**:
```python
# Python
import requests

def create_folder(access_token, account_id, folder_name):
    url = f'https://mail.zoho.com/api/accounts/{account_id}/folders'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'folderName': folder_name,
        'parentFolderId': None  # Root level
    }

    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

---

### 3. Messages

**Purpose**: Access and manage email messages

**Endpoints**:
```http
GET    /api/accounts/{accountId}/messages               # List messages
GET    /api/accounts/{accountId}/messages/{messageId}   # Get message
POST   /api/accounts/{accountId}/messages               # Send message
POST   /api/accounts/{accountId}/messages/drafts        # Create draft
PUT    /api/accounts/{accountId}/messages/{messageId}   # Update message
DELETE /api/accounts/{accountId}/messages/{messageId}   # Delete message
POST   /api/accounts/{accountId}/messages/{messageId}/move   # Move message
POST   /api/accounts/{accountId}/messages/{messageId}/copy   # Copy message
```

**Query Parameters**:
- `folderId` - Filter by folder
- `limit` - Number of messages (default: 50, max: 200)
- `start` - Pagination offset
- `sortBy` - Sort field (date, from, subject)
- `sortOrder` - ASC or DESC
- `searchKey` - Search query

**Example - List Messages**:
```javascript
// JavaScript/Node.js
const getMessages = async (accessToken, accountId, folderId = 'inbox') => {
  const response = await axios.get(
    `https://mail.zoho.com/api/accounts/${accountId}/messages`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      },
      params: {
        folderId: folderId,
        limit: 50,
        sortBy: 'date',
        sortOrder: 'DESC'
      }
    }
  );
  return response.data;
};
```

**Response**:
```json
{
  "status": {
    "code": 200,
    "description": "success"
  },
  "data": [
    {
      "messageId": "123456000000123456",
      "folderId": "inbox",
      "from": {
        "address": "sender@example.com",
        "name": "John Sender"
      },
      "to": [
        {
          "address": "recipient@domain.com",
          "name": "Jane Recipient"
        }
      ],
      "subject": "Meeting Tomorrow",
      "summary": "Quick reminder about our meeting...",
      "hasAttachment": true,
      "isRead": false,
      "receivedTime": 1704124800000,
      "size": 25600
    }
  ],
  "pagination": {
    "start": 0,
    "limit": 50,
    "total": 150,
    "hasMore": true
  }
}
```

**Example - Get Message Details**:
```python
# Python
def get_message(access_token, account_id, message_id):
    url = f'https://mail.zoho.com/api/accounts/{account_id}/messages/{message_id}'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }

    response = requests.get(url, headers=headers)
    return response.json()

# Response includes full message content
# {
#   "data": {
#     "messageId": "123456000000123456",
#     "from": {...},
#     "to": [...],
#     "cc": [...],
#     "subject": "Meeting Tomorrow",
#     "content": "<html>...</html>",
#     "textContent": "Plain text version...",
#     "attachments": [...]
#   }
# }
```

---

### 4. Send Email

**Purpose**: Send new emails or replies

**Endpoint**:
```http
POST /api/accounts/{accountId}/messages
```

**Example - Send Email**:
```javascript
// JavaScript/Node.js
const sendEmail = async (accessToken, accountId, emailData) => {
  const response = await axios.post(
    `https://mail.zoho.com/api/accounts/${accountId}/messages`,
    {
      fromAddress: emailData.from,
      toAddress: emailData.to.join(','),
      ccAddress: emailData.cc?.join(','),
      bccAddress: emailData.bcc?.join(','),
      subject: emailData.subject,
      content: emailData.htmlBody,
      mailFormat: 'html',
      askReceipt: 'no'
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
await sendEmail(accessToken, accountId, {
  from: 'sender@domain.com',
  to: ['recipient@example.com'],
  cc: ['cc@example.com'],
  subject: 'Test Email',
  htmlBody: '<h1>Hello</h1><p>This is a test email.</p>'
});
```

**Example - Send Email with Attachment**:
```python
# Python
def send_email_with_attachment(access_token, account_id, email_data, file_path):
    url = f'https://mail.zoho.com/api/accounts/{account_id}/messages'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }

    data = {
        'fromAddress': email_data['from'],
        'toAddress': ','.join(email_data['to']),
        'subject': email_data['subject'],
        'content': email_data['html_body'],
        'mailFormat': 'html'
    }

    files = {
        'attachments': open(file_path, 'rb')
    }

    response = requests.post(url, data=data, files=files, headers=headers)
    return response.json()
```

---

### 5. Attachments

**Purpose**: Manage email attachments

**Endpoints**:
```http
GET  /api/accounts/{accountId}/messages/{messageId}/attachments           # List attachments
GET  /api/accounts/{accountId}/messages/{messageId}/attachments/{attachId} # Download attachment
POST /api/accounts/{accountId}/messages/{messageId}/attachments           # Add attachment
```

**Example - Download Attachment**:
```javascript
// JavaScript/Node.js
const downloadAttachment = async (accessToken, accountId, messageId, attachId) => {
  const response = await axios.get(
    `https://mail.zoho.com/api/accounts/${accountId}/messages/${messageId}/attachments/${attachId}`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      },
      responseType: 'arraybuffer'
    }
  );
  return response.data;
};
```

---

### 6. Search

**Purpose**: Search emails across folders

**Endpoint**:
```http
GET /api/accounts/{accountId}/messages/search
```

**Query Parameters**:
- `searchKey` - Search query
- `folderId` - Limit to specific folder
- `fromDate` - Start date (timestamp)
- `toDate` - End date (timestamp)
- `hasAttachment` - true/false

**Search Operators**:
- `from:sender@example.com` - From specific sender
- `to:recipient@example.com` - To specific recipient
- `subject:meeting` - Subject contains
- `has:attachment` - Has attachments
- `is:unread` - Unread messages

**Example - Search Messages**:
```python
# Python
def search_messages(access_token, account_id, query):
    url = f'https://mail.zoho.com/api/accounts/{account_id}/messages/search'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'searchKey': query,
        'limit': 50
    }

    response = requests.get(url, params=params, headers=headers)
    return response.json()

# Search for unread messages from specific sender
results = search_messages(
    access_token,
    account_id,
    'from:john@example.com is:unread'
)
```

---

## Common Operations

### 1. Mark Message as Read/Unread

```javascript
// JavaScript/Node.js
const markAsRead = async (accessToken, accountId, messageId, isRead = true) => {
  const response = await axios.put(
    `https://mail.zoho.com/api/accounts/${accountId}/messages/${messageId}`,
    {
      mode: isRead ? 'READ' : 'UNREAD'
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

### 2. Move Message to Folder

```python
# Python
def move_message(access_token, account_id, message_id, target_folder_id):
    url = f'https://mail.zoho.com/api/accounts/{account_id}/messages/{message_id}/move'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'folderId': target_folder_id
    }

    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

### 3. Create Draft

```javascript
// JavaScript/Node.js
const createDraft = async (accessToken, accountId, draftData) => {
  const response = await axios.post(
    `https://mail.zoho.com/api/accounts/${accountId}/messages/drafts`,
    {
      toAddress: draftData.to.join(','),
      subject: draftData.subject,
      content: draftData.htmlBody,
      mailFormat: 'html'
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

### Send Email from Deluge

```javascript
// Deluge Script
response = invokeurl
[
  url: "https://mail.zoho.com/api/accounts/" + accountId + "/messages"
  type: POST
  parameters: {
    "fromAddress": "sender@domain.com",
    "toAddress": "recipient@example.com",
    "subject": "Automated Email",
    "content": "<p>This email was sent from Deluge script.</p>",
    "mailFormat": "html"
  }
  connection: "zoho_mail"
];

info response;
```

### Search Emails

```javascript
// Deluge Script
searchQuery = "from:client@example.com has:attachment";

response = invokeurl
[
  url: "https://mail.zoho.com/api/accounts/" + accountId + "/messages/search?searchKey=" + searchQuery
  type: GET
  connection: "zoho_mail"
];

messages = response.get("data");
for each message in messages
{
  info "Subject: " + message.get("subject");
  info "From: " + message.get("from").get("address");
}
```

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 200 | Success | Request completed successfully |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Invalid or expired access token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error occurred |
| 503 | Service Unavailable | Service temporarily unavailable |

**Error Response Format**:
```json
{
  "status": {
    "code": 400,
    "description": "Invalid folder ID"
  },
  "data": {
    "errorCode": "INVALID_FOLDER",
    "message": "The specified folder does not exist"
  }
}
```

---

## Best Practices

### 1. Pagination
Always use pagination for large message lists:
```javascript
let allMessages = [];
let start = 0;
const limit = 200;

do {
  const response = await getMessages(accessToken, accountId, {
    start: start,
    limit: limit
  });
  allMessages = allMessages.concat(response.data);
  start += limit;
} while (response.pagination.hasMore);
```

### 2. Efficient Searching
Use specific search criteria to reduce API calls:
```python
# Good - specific search
results = search_messages(access_token, account_id,
    'from:vendor@example.com subject:invoice has:attachment')

# Less efficient - broad search then filter
results = search_messages(access_token, account_id, 'invoice')
```

### 3. Batch Operations
When performing multiple operations, consider batching:
```javascript
// Move multiple messages to same folder
const messageIds = ['id1', 'id2', 'id3'];
const promises = messageIds.map(id =>
  moveMessage(accessToken, accountId, id, targetFolderId)
);
await Promise.all(promises);
```

### 4. Handle Attachments Efficiently
Stream large attachments instead of loading into memory:
```javascript
const response = await axios.get(attachmentUrl, {
  headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}` },
  responseType: 'stream'
});

response.data.pipe(fs.createWriteStream('attachment.pdf'));
```

---

## Data Centers

Zoho Mail API endpoints vary by data center:

| Region | API Base URL |
|--------|-------------|
| US | `https://mail.zoho.com/api/` |
| EU | `https://mail.zoho.eu/api/` |
| IN | `https://mail.zoho.in/api/` |
| AU | `https://mail.zoho.com.au/api/` |
| JP | `https://mail.zoho.jp/api/` |
| CN | `https://mail.zoho.com.cn/api/` |

---

## Webhooks

Zoho Mail supports webhooks for real-time notifications:

**Supported Events**:
- `message.received` - New message received
- `message.sent` - Message sent
- `message.read` - Message marked as read
- `message.deleted` - Message deleted

**Webhook Payload Example**:
```json
{
  "event": "message.received",
  "accountId": "123456000000012345",
  "messageId": "123456000000123456",
  "folderId": "inbox",
  "from": "sender@example.com",
  "subject": "New Message",
  "receivedTime": 1704124800000
}
```

---

## Additional Resources

- **Official Documentation**: https://www.zoho.com/mail/help/api/
- **Developer Console**: https://api-console.zoho.com/
- **Support**: https://help.zoho.com/portal/en/community/zoho-mail
- **Status Page**: https://status.zoho.com/
