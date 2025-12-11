# Zoho Connect API Reference

## Overview

Zoho Connect is a team collaboration platform that combines social networking features with business communication tools. The API provides programmatic access to feeds, groups, channels, files, and team management.

**Current API Version**: v1
**Base URL**: `https://connect.zoho.com/api/v1/`
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
- `ZohoConnect.feeds.ALL` - Manage feeds
- `ZohoConnect.groups.ALL` - Manage groups
- `ZohoConnect.files.ALL` - Manage files
- `ZohoConnect.channels.ALL` - Manage channels

---

## Rate Limits

- **API Calls**: 5,000 calls per day
- **Burst Limit**: 100 calls per minute
- **File Upload**: 100 MB per file

---

## API Modules

### 1. Networks

**Endpoints**:
```http
GET /api/v1/networks              # List networks
GET /api/v1/networks/{networkId}  # Get network details
```

**Example - Get Networks**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const getNetworks = async (accessToken) => {
  const response = await axios.get(
    'https://connect.zoho.com/api/v1/networks',
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
  "networks": [
    {
      "networkId": "net_123456",
      "networkName": "Acme Corporation",
      "domain": "acme.connect.zoho.com",
      "memberCount": 150,
      "groupCount": 25,
      "createdTime": "2025-01-15T10:30:00Z"
    }
  ]
}
```

---

### 2. Feeds/Posts

**Endpoints**:
```http
GET    /api/v1/networks/{networkId}/feeds           # List feeds
GET    /api/v1/networks/{networkId}/feeds/{feedId}  # Get feed
POST   /api/v1/networks/{networkId}/feeds           # Create post
PUT    /api/v1/networks/{networkId}/feeds/{feedId}  # Update post
DELETE /api/v1/networks/{networkId}/feeds/{feedId}  # Delete post
POST   /api/v1/networks/{networkId}/feeds/{feedId}/like # Like post
POST   /api/v1/networks/{networkId}/feeds/{feedId}/comments # Add comment
```

**Example - Create Post**:
```javascript
// JavaScript/Node.js
const createPost = async (accessToken, networkId, postData) => {
  const response = await axios.post(
    `https://connect.zoho.com/api/v1/networks/${networkId}/feeds`,
    {
      content: postData.content,
      visibility: postData.visibility || 'network',
      mentions: postData.mentions || [],
      attachments: postData.attachments || [],
      groupId: postData.groupId
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

// Create post
const post = await createPost(accessToken, networkId, {
  content: 'Excited to announce our Q1 results! Great work team!',
  visibility: 'network',
  mentions: ['user_123', 'user_456']
});
```

**Response**:
```json
{
  "feedId": "feed_789012",
  "networkId": "net_123456",
  "authorId": "user_999",
  "authorName": "John Doe",
  "content": "Excited to announce our Q1 results! Great work team!",
  "visibility": "network",
  "likes": 0,
  "comments": 0,
  "createdTime": "2025-01-15T10:30:00Z"
}
```

**Example - Get Feed**:
```python
# Python
import requests

def get_feed(access_token, network_id, filters=None):
    url = f'https://connect.zoho.com/api/v1/networks/{network_id}/feeds'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {}

    if filters:
        if 'group_id' in filters:
            params['groupId'] = filters['group_id']
        if 'user_id' in filters:
            params['userId'] = filters['user_id']

    response = requests.get(url, params=params, headers=headers)
    return response.json()
```

---

### 3. Groups

**Endpoints**:
```http
GET    /api/v1/networks/{networkId}/groups              # List groups
GET    /api/v1/networks/{networkId}/groups/{groupId}    # Get group
POST   /api/v1/networks/{networkId}/groups              # Create group
PUT    /api/v1/networks/{networkId}/groups/{groupId}    # Update group
DELETE /api/v1/networks/{networkId}/groups/{groupId}    # Delete group
POST   /api/v1/networks/{networkId}/groups/{groupId}/members # Add member
DELETE /api/v1/networks/{networkId}/groups/{groupId}/members/{userId} # Remove member
```

**Example - Create Group**:
```javascript
// JavaScript/Node.js
const createGroup = async (accessToken, networkId, groupData) => {
  const response = await axios.post(
    `https://connect.zoho.com/api/v1/networks/${networkId}/groups`,
    {
      name: groupData.name,
      description: groupData.description,
      privacy: groupData.privacy || 'public',
      members: groupData.members || [],
      tags: groupData.tags || []
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

// Create project group
const group = await createGroup(accessToken, networkId, {
  name: 'Project Phoenix',
  description: 'Collaboration space for Project Phoenix team',
  privacy: 'private',
  members: ['user_123', 'user_456', 'user_789'],
  tags: ['project', 'development']
});
```

**Response**:
```json
{
  "groupId": "grp_345678",
  "networkId": "net_123456",
  "name": "Project Phoenix",
  "description": "Collaboration space for Project Phoenix team",
  "privacy": "private",
  "memberCount": 3,
  "createdBy": "user_999",
  "createdTime": "2025-01-15T10:30:00Z"
}
```

---

### 4. Channels

**Endpoints**:
```http
GET    /api/v1/networks/{networkId}/channels              # List channels
POST   /api/v1/networks/{networkId}/channels              # Create channel
GET    /api/v1/networks/{networkId}/channels/{channelId}  # Get channel
POST   /api/v1/networks/{networkId}/channels/{channelId}/messages # Send message
GET    /api/v1/networks/{networkId}/channels/{channelId}/messages # Get messages
```

**Example - Create Channel**:
```python
# Python
def create_channel(access_token, network_id, channel_data):
    url = f'https://connect.zoho.com/api/v1/networks/{network_id}/channels'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'name': channel_data['name'],
        'description': channel_data['description'],
        'members': channel_data['members'],
        'isPrivate': channel_data.get('is_private', False)
    }

    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

**Example - Send Channel Message**:
```javascript
// JavaScript/Node.js
const sendChannelMessage = async (accessToken, networkId, channelId, message) => {
  const response = await axios.post(
    `https://connect.zoho.com/api/v1/networks/${networkId}/channels/${channelId}/messages`,
    {
      content: message.content,
      mentions: message.mentions || [],
      attachments: message.attachments || []
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

### 5. Files

**Endpoints**:
```http
GET    /api/v1/networks/{networkId}/files              # List files
POST   /api/v1/networks/{networkId}/files              # Upload file
GET    /api/v1/networks/{networkId}/files/{fileId}     # Download file
DELETE /api/v1/networks/{networkId}/files/{fileId}     # Delete file
POST   /api/v1/networks/{networkId}/files/{fileId}/share # Share file
```

**Example - Upload File**:
```javascript
// JavaScript/Node.js
const FormData = require('form-data');
const fs = require('fs');

const uploadFile = async (accessToken, networkId, filePath, metadata) => {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));
  formData.append('title', metadata.title);
  formData.append('description', metadata.description || '');
  formData.append('groupId', metadata.groupId || '');

  const response = await axios.post(
    `https://connect.zoho.com/api/v1/networks/${networkId}/files`,
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

**Response**:
```json
{
  "fileId": "file_901234",
  "fileName": "Q1_Report.pdf",
  "fileSize": 2048576,
  "mimeType": "application/pdf",
  "uploadedBy": "user_999",
  "uploadedTime": "2025-01-15T10:30:00Z",
  "downloadUrl": "https://connect.zoho.com/api/v1/networks/net_123456/files/file_901234"
}
```

---

### 6. Members

**Endpoints**:
```http
GET    /api/v1/networks/{networkId}/members              # List members
GET    /api/v1/networks/{networkId}/members/{userId}     # Get member
POST   /api/v1/networks/{networkId}/members              # Invite member
DELETE /api/v1/networks/{networkId}/members/{userId}     # Remove member
```

**Example - Invite Member**:
```python
# Python
def invite_member(access_token, network_id, member_data):
    url = f'https://connect.zoho.com/api/v1/networks/{network_id}/members'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'email': member_data['email'],
        'firstName': member_data['first_name'],
        'lastName': member_data['last_name'],
        'role': member_data.get('role', 'member'),
        'sendInvite': True
    }

    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

---

### 7. Events

**Endpoints**:
```http
GET    /api/v1/networks/{networkId}/events              # List events
POST   /api/v1/networks/{networkId}/events              # Create event
GET    /api/v1/networks/{networkId}/events/{eventId}    # Get event
PUT    /api/v1/networks/{networkId}/events/{eventId}    # Update event
POST   /api/v1/networks/{networkId}/events/{eventId}/rsvp # RSVP to event
```

**Example - Create Event**:
```javascript
// JavaScript/Node.js
const createEvent = async (accessToken, networkId, eventData) => {
  const response = await axios.post(
    `https://connect.zoho.com/api/v1/networks/${networkId}/events`,
    {
      title: eventData.title,
      description: eventData.description,
      startTime: eventData.startTime,
      endTime: eventData.endTime,
      location: eventData.location,
      groupId: eventData.groupId,
      invitees: eventData.invitees || []
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

### 8. Search

**Endpoints**:
```http
GET /api/v1/networks/{networkId}/search  # Search across network
```

**Query Parameters**:
- `query` - Search query
- `type` - posts, files, groups, members
- `groupId` - Limit to specific group

**Example - Search**:
```python
# Python
def search_network(access_token, network_id, query, search_type=None):
    url = f'https://connect.zoho.com/api/v1/networks/{network_id}/search'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {'query': query}

    if search_type:
        params['type'] = search_type

    response = requests.get(url, params=params, headers=headers)
    return response.json()
```

---

## Common Operations

### 1. Post with Mentions and Attachments

```javascript
// JavaScript/Node.js
const createRichPost = async (accessToken, networkId, postData) => {
  // First upload attachments
  const attachmentIds = [];
  for (const file of postData.files) {
    const uploaded = await uploadFile(accessToken, networkId, file.path, {
      title: file.name
    });
    attachmentIds.push(uploaded.fileId);
  }

  // Create post with mentions and attachments
  return await createPost(accessToken, networkId, {
    content: postData.content,
    mentions: postData.mentions,
    attachments: attachmentIds,
    groupId: postData.groupId
  });
};
```

### 2. Get Group Activity

```python
# Python
def get_group_activity(access_token, network_id, group_id):
    # Get group posts
    feeds = get_feed(access_token, network_id, {'group_id': group_id})

    # Get group files
    files_url = f'https://connect.zoho.com/api/v1/networks/{network_id}/files'
    files_response = requests.get(
        files_url,
        params={'groupId': group_id},
        headers={'Authorization': f'Zoho-oauthtoken {access_token}'}
    )

    return {
        'posts': feeds,
        'files': files_response.json()
    }
```

---

## Deluge Integration

```javascript
// Deluge Script
networkId = "net_123456";

// Post announcement
postData = {
  "content": "Team meeting scheduled for tomorrow at 10 AM. Please join!",
  "visibility": "network",
  "mentions": ["user_123", "user_456"]
};

response = invokeurl
[
  url: "https://connect.zoho.com/api/v1/networks/" + networkId + "/feeds"
  type: POST
  parameters: postData.toString()
  connection: "zoho_connect"
];

feedId = response.get("feedId");
info "Post created: " + feedId;
```

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 200 | Success | Request completed |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid parameters |
| 401 | Unauthorized | Invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 413 | Payload Too Large | File too large |
| 429 | Too Many Requests | Rate limit exceeded |

---

## Best Practices

### 1. Engagement
- Use @mentions effectively
- Add relevant tags
- Encourage discussions
- Share files appropriately

### 2. Groups
- Create purpose-specific groups
- Set appropriate privacy levels
- Regular cleanup of inactive groups
- Use group channels for focused discussions

### 3. Content
- Keep posts concise
- Use rich media when helpful
- Respond to comments
- Archive old content

---

## Data Centers

| Region | API Base URL |
|--------|-------------|
| US | `https://connect.zoho.com/api/v1/` |
| EU | `https://connect.zoho.eu/api/v1/` |
| IN | `https://connect.zoho.in/api/v1/` |
| AU | `https://connect.zoho.com.au/api/v1/` |

---

## Webhooks

**Supported Events**:
- `post.created` - New post created
- `comment.added` - Comment added
- `member.joined` - New member joined
- `file.uploaded` - File uploaded

**Webhook Payload Example**:
```json
{
  "event": "post.created",
  "networkId": "net_123456",
  "feedId": "feed_789012",
  "authorId": "user_999",
  "content": "New post content",
  "timestamp": 1704124800000
}
```

---

## Additional Resources

- **Official Documentation**: https://www.zoho.com/connect/help/api/
- **Developer Console**: https://api-console.zoho.com/
- **Community**: https://help.zoho.com/portal/en/community/zoho-connect
