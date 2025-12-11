# Zoho Cliq API Reference

## Overview

Zoho Cliq is a team collaboration and communication platform that enables real-time messaging, video calls, and workflow automation. The REST API v2 provides comprehensive access to channels, messages, bots, webhooks, and integrations.

**Current API Version**: v2
**Base URL**: `https://cliq.zoho.com/api/v2/`
**Protocol**: REST
**Data Format**: JSON
**Authentication**: OAuth 2.0

---

## Quick Links

- [Authentication](#authentication)
- [Channels API](#channels-api)
- [Messages API](#messages-api)
- [Bots API](#bots-api)
- [Webhooks](#webhooks)
- [Users API](#users-api)
- [Organizations API](#organizations-api)
- [File Uploads](#file-uploads)
- [Integrations](#integrations)
- [Commands](#commands)
- [Rate Limits](#rate-limits)
- [Error Codes](#error-codes)
- [Code Examples](#code-examples)
- [Best Practices](#best-practices)

---

## REST API Principles

### HTTP Methods

Zoho Cliq API follows standard REST conventions:

| Method | Purpose | Idempotent |
|--------|---------|------------|
| GET | Retrieve resources | Yes |
| POST | Create new resources | No |
| PUT | Update resources | Yes |
| PATCH | Partial update | No |
| DELETE | Remove resources | Yes |

### Request Format

```http
GET /api/v2/channels
Host: cliq.zoho.com
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json
```

### Response Format

**Success Response**:
```json
{
  "data": {
    "id": "CT_1234567890",
    "name": "Development Team",
    "type": "channel"
  },
  "status": {
    "code": 200,
    "message": "success"
  }
}
```

**List Response**:
```json
{
  "data": [
    { "id": "CT_1234567890", "name": "Development" },
    { "id": "CT_1234567891", "name": "Marketing" }
  ],
  "list_info": {
    "has_more": true,
    "next_token": "abc123"
  },
  "status": {
    "code": 200,
    "message": "success"
  }
}
```

**Error Response**:
```json
{
  "error": {
    "code": "INVALID_CHANNEL",
    "message": "The specified channel does not exist"
  },
  "status": {
    "code": 404,
    "message": "error"
  }
}
```

---

## Authentication

### OAuth 2.0 Flow

Zoho Cliq uses OAuth 2.0 for authentication. All API requests require a valid access token.

**Step 1: Register Your Application**
- Go to [Zoho API Console](https://api-console.zoho.com/)
- Create a new Client (Server-based or Self-client)
- Note your Client ID and Client Secret
- Set the authorized redirect URI

**Step 2: Generate Authorization Code**

```http
GET https://accounts.zoho.com/oauth/v2/auth?
  scope=ZohoCliq.Channels.ALL,ZohoCliq.Messages.CREATE,ZohoCliq.Webhooks.CREATE&
  client_id={client_id}&
  response_type=code&
  access_type=offline&
  redirect_uri={redirect_uri}
```

**Available Scopes**:
- `ZohoCliq.Channels.ALL` - Full access to channels
- `ZohoCliq.Channels.READ` - Read-only access to channels
- `ZohoCliq.Messages.ALL` - Full access to messages
- `ZohoCliq.Messages.CREATE` - Send messages
- `ZohoCliq.Messages.READ` - Read messages
- `ZohoCliq.Bots.ALL` - Full access to bots
- `ZohoCliq.Bots.CREATE` - Create bots
- `ZohoCliq.Webhooks.ALL` - Full access to webhooks
- `ZohoCliq.Webhooks.CREATE` - Create webhooks
- `ZohoCliq.Organizations.READ` - Read organization info
- `ZohoCliq.Users.READ` - Read user info

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

## Channels API

Channels are group conversations where team members can collaborate.

### Channel Object Structure

```json
{
  "id": "CT_1234567890",
  "name": "Development Team",
  "description": "Channel for development team discussions",
  "type": "channel",
  "link": "https://cliq.zoho.com/company/channel/CT_1234567890",
  "is_private": false,
  "created_time": "2025-01-15T10:00:00Z",
  "modified_time": "2025-12-10T14:30:00Z",
  "creator_id": "9876543210",
  "creator_name": "John Doe",
  "member_count": 25,
  "organization_id": "123456"
}
```

### List Channels

```http
GET /api/v2/channels
Authorization: Zoho-oauthtoken {access_token}
```

**Query Parameters**:
- `limit` (integer) - Number of results (max: 50, default: 20)
- `next_token` (string) - Pagination token
- `type` (string) - Filter: "public", "private"

**Example**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const listChannels = async (accessToken) => {
  const response = await axios.get(
    'https://cliq.zoho.com/api/v2/channels',
    {
      params: {
        limit: 50
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

def list_channels(access_token):
    url = 'https://cliq.zoho.com/api/v2/channels'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'limit': 50
    }
    response = requests.get(url, headers=headers, params=params)
    return response.json()
```

```deluge
// Deluge
response = invokeurl
[
    url: "https://cliq.zoho.com/api/v2/channels"
    type: GET
    parameters: {"limit": 50}
    headers: {"Authorization": "Zoho-oauthtoken " + access_token}
];
info response;
```

### Get Channel by ID

```http
GET /api/v2/channels/{channel_id}
Authorization: Zoho-oauthtoken {access_token}
```

**Example**:
```javascript
const getChannel = async (accessToken, channelId) => {
  const response = await axios.get(
    `https://cliq.zoho.com/api/v2/channels/${channelId}`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

### Create Channel

```http
POST /api/v2/channels
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "name": "Project Phoenix",
  "description": "Discussion channel for Project Phoenix",
  "is_private": false,
  "members": ["user1@company.com", "user2@company.com"]
}
```

**Example**:
```javascript
const createChannel = async (accessToken, channelData) => {
  const response = await axios.post(
    'https://cliq.zoho.com/api/v2/channels',
    channelData,
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
const newChannel = {
  name: 'Project Phoenix',
  description: 'Discussion channel for Project Phoenix',
  is_private: false,
  members: ['user1@company.com', 'user2@company.com']
};

const channel = await createChannel(accessToken, newChannel);
```

```python
def create_channel(access_token, channel_data):
    url = 'https://cliq.zoho.com/api/v2/channels'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    response = requests.post(url, json=channel_data, headers=headers)
    return response.json()

# Usage
new_channel = {
    'name': 'Project Phoenix',
    'description': 'Discussion channel for Project Phoenix',
    'is_private': False,
    'members': ['user1@company.com', 'user2@company.com']
}

channel = create_channel(access_token, new_channel)
```

```deluge
// Deluge
channel_map = Map();
channel_map.put("name", "Project Phoenix");
channel_map.put("description", "Discussion channel for Project Phoenix");
channel_map.put("is_private", false);
channel_map.put("members", {"user1@company.com", "user2@company.com"});

response = invokeurl
[
    url: "https://cliq.zoho.com/api/v2/channels"
    type: POST
    parameters: channel_map.toString()
    headers: {"Authorization": "Zoho-oauthtoken " + access_token}
];
info response;
```

### Update Channel

```http
PUT /api/v2/channels/{channel_id}
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "name": "Project Phoenix - Updated",
  "description": "Updated description"
}
```

### Add Members to Channel

```http
POST /api/v2/channels/{channel_id}/members
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "members": ["user3@company.com", "user4@company.com"]
}
```

**Example**:
```javascript
const addChannelMembers = async (accessToken, channelId, members) => {
  const response = await axios.post(
    `https://cliq.zoho.com/api/v2/channels/${channelId}/members`,
    { members },
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

### Remove Member from Channel

```http
DELETE /api/v2/channels/{channel_id}/members/{user_id}
Authorization: Zoho-oauthtoken {access_token}
```

### Delete Channel

```http
DELETE /api/v2/channels/{channel_id}
Authorization: Zoho-oauthtoken {access_token}
```

---

## Messages API

Send and manage messages in channels and direct conversations.

### Message Object Structure

```json
{
  "id": "MSG_1234567890",
  "text": "Hello team! Ready for standup?",
  "sender": {
    "id": "9876543210",
    "name": "John Doe",
    "email": "john.doe@company.com"
  },
  "channel_id": "CT_1234567890",
  "time": "2025-12-12T15:30:00Z",
  "edited_time": null,
  "is_edited": false,
  "mentions": [],
  "attachments": [],
  "reactions": [
    {
      "emoji": "👍",
      "count": 3,
      "users": ["user1", "user2", "user3"]
    }
  ]
}
```

### Send Message to Channel

```http
POST /api/v2/channels/{channel_id}/messages
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "text": "Hello team! Meeting starts in 10 minutes."
}
```

**Example**:
```javascript
const sendMessage = async (accessToken, channelId, text) => {
  const response = await axios.post(
    `https://cliq.zoho.com/api/v2/channels/${channelId}/messages`,
    { text },
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
await sendMessage(accessToken, 'CT_1234567890', 'Hello team!');
```

```python
def send_message(access_token, channel_id, text):
    url = f'https://cliq.zoho.com/api/v2/channels/{channel_id}/messages'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {'text': text}
    response = requests.post(url, json=data, headers=headers)
    return response.json()

# Usage
send_message(access_token, 'CT_1234567890', 'Hello team!')
```

```deluge
// Deluge
message_map = Map();
message_map.put("text", "Hello team!");

response = invokeurl
[
    url: "https://cliq.zoho.com/api/v2/channels/" + channel_id + "/messages"
    type: POST
    parameters: message_map.toString()
    headers: {"Authorization": "Zoho-oauthtoken " + access_token}
];
info response;
```

### Send Rich Text Message

```http
POST /api/v2/channels/{channel_id}/messages
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "text": "Check out our deployment status",
  "card": {
    "title": "Deployment Status",
    "theme": "modern-inline",
    "thumbnail": "https://example.com/icon.png",
    "sections": [
      {
        "id": 1,
        "elements": [
          {
            "type": "text",
            "text": "Production deployment successful"
          },
          {
            "type": "text",
            "text": "**Version:** 2.5.0"
          },
          {
            "type": "text",
            "text": "**Status:** Live"
          }
        ]
      }
    ],
    "buttons": [
      {
        "label": "View Logs",
        "type": "open.url",
        "url": "https://logs.example.com"
      }
    ]
  }
}
```

**Example**:
```javascript
const sendRichMessage = async (accessToken, channelId) => {
  const response = await axios.post(
    `https://cliq.zoho.com/api/v2/channels/${channelId}/messages`,
    {
      text: 'Deployment notification',
      card: {
        title: 'Deployment Status',
        theme: 'modern-inline',
        sections: [
          {
            id: 1,
            elements: [
              {
                type: 'text',
                text: 'Production deployment successful'
              },
              {
                type: 'text',
                text: '**Version:** 2.5.0'
              }
            ]
          }
        ],
        buttons: [
          {
            label: 'View Details',
            type: 'open.url',
            url: 'https://example.com/deployment'
          }
        ]
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

### Send Direct Message

```http
POST /api/v2/users/{user_id}/messages
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "text": "Hi! Can we schedule a quick call?"
}
```

**Example**:
```javascript
const sendDirectMessage = async (accessToken, userId, text) => {
  const response = await axios.post(
    `https://cliq.zoho.com/api/v2/users/${userId}/messages`,
    { text },
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
def send_direct_message(access_token, user_id, text):
    url = f'https://cliq.zoho.com/api/v2/users/{user_id}/messages'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {'text': text}
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

### Get Channel Messages

```http
GET /api/v2/channels/{channel_id}/messages
Authorization: Zoho-oauthtoken {access_token}
```

**Query Parameters**:
- `limit` (integer) - Number of messages (max: 100, default: 20)
- `before` (string) - Get messages before this message ID
- `after` (string) - Get messages after this message ID

**Example**:
```javascript
const getChannelMessages = async (accessToken, channelId, limit = 50) => {
  const response = await axios.get(
    `https://cliq.zoho.com/api/v2/channels/${channelId}/messages`,
    {
      params: { limit },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

### Edit Message

```http
PUT /api/v2/messages/{message_id}
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "text": "Updated message content"
}
```

### Delete Message

```http
DELETE /api/v2/messages/{message_id}
Authorization: Zoho-oauthtoken {access_token}
```

### Add Reaction to Message

```http
POST /api/v2/messages/{message_id}/reactions
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "emoji": "👍"
}
```

**Example**:
```javascript
const addReaction = async (accessToken, messageId, emoji) => {
  const response = await axios.post(
    `https://cliq.zoho.com/api/v2/messages/${messageId}/reactions`,
    { emoji },
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

## Bots API

Bots are automated assistants that can respond to commands and perform actions.

### Bot Object Structure

```json
{
  "id": "BOT_1234567890",
  "name": "DeployBot",
  "description": "Bot for managing deployments",
  "webhook_url": "https://cliq.zoho.com/api/v2/bots/BOT_1234567890/incoming",
  "status": "active",
  "creator_id": "9876543210",
  "created_time": "2025-11-01T10:00:00Z",
  "modified_time": "2025-12-10T14:00:00Z"
}
```

### Create Bot

```http
POST /api/v2/bots
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "name": "NotificationBot",
  "description": "Bot for sending notifications",
  "photo_url": "https://example.com/bot-icon.png"
}
```

**Example**:
```javascript
const createBot = async (accessToken, botData) => {
  const response = await axios.post(
    'https://cliq.zoho.com/api/v2/bots',
    botData,
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
const newBot = {
  name: 'NotificationBot',
  description: 'Bot for sending notifications',
  photo_url: 'https://example.com/bot-icon.png'
};

const bot = await createBot(accessToken, newBot);
console.log('Bot webhook URL:', bot.data.webhook_url);
```

```python
def create_bot(access_token, bot_data):
    url = 'https://cliq.zoho.com/api/v2/bots'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    response = requests.post(url, json=bot_data, headers=headers)
    return response.json()

# Usage
new_bot = {
    'name': 'NotificationBot',
    'description': 'Bot for sending notifications'
}

bot = create_bot(access_token, new_bot)
print(f"Bot webhook URL: {bot['data']['webhook_url']}")
```

```deluge
// Deluge
bot_map = Map();
bot_map.put("name", "NotificationBot");
bot_map.put("description", "Bot for sending notifications");

response = invokeurl
[
    url: "https://cliq.zoho.com/api/v2/bots"
    type: POST
    parameters: bot_map.toString()
    headers: {"Authorization": "Zoho-oauthtoken " + access_token}
];
info response;
```

### Send Message via Bot

```http
POST {bot_webhook_url}
Content-Type: application/json

{
  "text": "Deployment completed successfully!",
  "bot": {
    "name": "DeployBot",
    "image": "https://example.com/deploy-icon.png"
  }
}
```

**Example**:
```javascript
const sendBotMessage = async (webhookUrl, message) => {
  const response = await axios.post(
    webhookUrl,
    {
      text: message,
      bot: {
        name: 'DeployBot'
      }
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

// Usage - No OAuth token needed for webhook URL
const webhookUrl = 'https://cliq.zoho.com/api/v2/bots/BOT_1234567890/incoming';
await sendBotMessage(webhookUrl, 'Deployment completed!');
```

### Send Interactive Bot Message

```http
POST {bot_webhook_url}
Content-Type: application/json

{
  "text": "New pull request needs review",
  "card": {
    "title": "Pull Request #234",
    "theme": "modern-inline",
    "sections": [
      {
        "id": 1,
        "elements": [
          {
            "type": "text",
            "text": "**Author:** John Doe"
          },
          {
            "type": "text",
            "text": "**Branch:** feature/oauth-integration"
          },
          {
            "type": "text",
            "text": "**Changes:** +234 -45"
          }
        ]
      }
    ],
    "buttons": [
      {
        "label": "Approve",
        "type": "invoke.function",
        "name": "approve_pr",
        "id": "1"
      },
      {
        "label": "Request Changes",
        "type": "invoke.function",
        "name": "request_changes",
        "id": "2"
      },
      {
        "label": "View PR",
        "type": "open.url",
        "url": "https://github.com/company/repo/pull/234"
      }
    ]
  }
}
```

**Example**:
```javascript
const sendInteractiveBotMessage = async (webhookUrl, prData) => {
  const response = await axios.post(
    webhookUrl,
    {
      text: 'New pull request needs review',
      card: {
        title: `Pull Request #${prData.number}`,
        theme: 'modern-inline',
        sections: [
          {
            id: 1,
            elements: [
              {
                type: 'text',
                text: `**Author:** ${prData.author}`
              },
              {
                type: 'text',
                text: `**Branch:** ${prData.branch}`
              },
              {
                type: 'text',
                text: `**Changes:** +${prData.additions} -${prData.deletions}`
              }
            ]
          }
        ],
        buttons: [
          {
            label: 'Approve',
            type: 'invoke.function',
            name: 'approve_pr',
            id: '1'
          },
          {
            label: 'View PR',
            type: 'open.url',
            url: prData.url
          }
        ]
      }
    }
  );
  return response.data;
};
```

```python
def send_interactive_bot_message(webhook_url, pr_data):
    payload = {
        'text': 'New pull request needs review',
        'card': {
            'title': f"Pull Request #{pr_data['number']}",
            'theme': 'modern-inline',
            'sections': [
                {
                    'id': 1,
                    'elements': [
                        {
                            'type': 'text',
                            'text': f"**Author:** {pr_data['author']}"
                        },
                        {
                            'type': 'text',
                            'text': f"**Branch:** {pr_data['branch']}"
                        }
                    ]
                }
            ],
            'buttons': [
                {
                    'label': 'View PR',
                    'type': 'open.url',
                    'url': pr_data['url']
                }
            ]
        }
    }
    response = requests.post(webhook_url, json=payload)
    return response.json()
```

### List Bots

```http
GET /api/v2/bots
Authorization: Zoho-oauthtoken {access_token}
```

### Update Bot

```http
PUT /api/v2/bots/{bot_id}
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "name": "Updated Bot Name",
  "description": "Updated description"
}
```

### Delete Bot

```http
DELETE /api/v2/bots/{bot_id}
Authorization: Zoho-oauthtoken {access_token}
```

---

## Webhooks

Webhooks enable real-time notifications when events occur in Cliq.

### Webhook Events

**Available Events**:
- `message.created` - New message posted
- `channel.created` - New channel created
- `channel.member.added` - Member added to channel
- `channel.member.removed` - Member removed from channel
- `mention` - User mentioned in message
- `bot.mention` - Bot mentioned in message

### Create Incoming Webhook

Incoming webhooks allow external services to post messages to Cliq.

```http
POST /api/v2/webhooks/incoming
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "name": "GitHub Notifications",
  "description": "Webhook for GitHub events",
  "channel_id": "CT_1234567890"
}
```

**Example**:
```javascript
const createIncomingWebhook = async (accessToken, webhookData) => {
  const response = await axios.post(
    'https://cliq.zoho.com/api/v2/webhooks/incoming',
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
const webhook = await createIncomingWebhook(accessToken, {
  name: 'GitHub Notifications',
  description: 'Webhook for GitHub events',
  channel_id: 'CT_1234567890'
});

console.log('Webhook URL:', webhook.data.url);
```

```python
def create_incoming_webhook(access_token, webhook_data):
    url = 'https://cliq.zoho.com/api/v2/webhooks/incoming'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    response = requests.post(url, json=webhook_data, headers=headers)
    return response.json()
```

### Send Message to Incoming Webhook

```http
POST {webhook_url}
Content-Type: application/json

{
  "text": "Build completed successfully!",
  "card": {
    "title": "CI/CD Build Status",
    "theme": "modern-inline",
    "sections": [
      {
        "id": 1,
        "elements": [
          {
            "type": "text",
            "text": "**Status:** Success ✅"
          },
          {
            "type": "text",
            "text": "**Duration:** 3m 42s"
          }
        ]
      }
    ]
  }
}
```

**Example**:
```javascript
const sendWebhookMessage = async (webhookUrl, message) => {
  const response = await axios.post(webhookUrl, message);
  return response.data;
};

// Usage - No authentication required for webhook URL
const webhookUrl = 'https://cliq.zoho.com/api/v2/channelsbynames/development/messages/webhook_token';
await sendWebhookMessage(webhookUrl, {
  text: 'Build completed!',
  card: {
    title: 'CI/CD Status',
    theme: 'modern-inline',
    sections: [
      {
        id: 1,
        elements: [
          { type: 'text', text: '**Status:** Success ✅' }
        ]
      }
    ]
  }
});
```

### Create Outgoing Webhook

Outgoing webhooks send events from Cliq to your external service.

```http
POST /api/v2/webhooks/outgoing
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "name": "External Service Integration",
  "url": "https://yourdomain.com/webhook/cliq",
  "events": ["message.created", "mention"],
  "channel_id": "CT_1234567890"
}
```

**Example**:
```javascript
const createOutgoingWebhook = async (accessToken, webhookData) => {
  const response = await axios.post(
    'https://cliq.zoho.com/api/v2/webhooks/outgoing',
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
```

### Webhook Payload Example

When an event occurs, Cliq sends a POST request to your webhook URL:

```json
{
  "event": "message.created",
  "timestamp": "2025-12-12T15:30:00Z",
  "data": {
    "message_id": "MSG_1234567890",
    "text": "Hello team!",
    "sender": {
      "id": "9876543210",
      "name": "John Doe",
      "email": "john.doe@company.com"
    },
    "channel": {
      "id": "CT_1234567890",
      "name": "Development"
    }
  }
}
```

### Handle Webhook in Your Application

```javascript
// Express.js webhook handler
const express = require('express');
const app = express();

app.post('/webhook/cliq', express.json(), (req, res) => {
  const { event, data } = req.body;

  switch(event) {
    case 'message.created':
      console.log('New message:', data.text);
      console.log('From:', data.sender.name);
      // Handle new message
      break;

    case 'mention':
      console.log('Mentioned in:', data.channel.name);
      // Handle mention
      break;

    case 'channel.member.added':
      console.log('New member added:', data.member.name);
      // Handle member added
      break;
  }

  res.status(200).json({ received: true });
});
```

```python
# Flask webhook handler
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/webhook/cliq', methods=['POST'])
def handle_webhook():
    data = request.json
    event = data.get('event')
    payload = data.get('data')

    if event == 'message.created':
        print(f"New message: {payload.get('text')}")
        print(f"From: {payload.get('sender', {}).get('name')}")
        # Handle new message

    elif event == 'mention':
        print(f"Mentioned in: {payload.get('channel', {}).get('name')}")
        # Handle mention

    return jsonify({'received': True}), 200
```

---

## Users API

Retrieve information about users in your organization.

### Get Current User

```http
GET /api/v2/users/me
Authorization: Zoho-oauthtoken {access_token}
```

**Response**:
```json
{
  "data": {
    "id": "9876543210",
    "email": "john.doe@company.com",
    "first_name": "John",
    "last_name": "Doe",
    "display_name": "John Doe",
    "status": "active",
    "timezone": "America/New_York",
    "organization_id": "123456"
  }
}
```

**Example**:
```javascript
const getCurrentUser = async (accessToken) => {
  const response = await axios.get(
    'https://cliq.zoho.com/api/v2/users/me',
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
def get_current_user(access_token):
    url = 'https://cliq.zoho.com/api/v2/users/me'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    response = requests.get(url, headers=headers)
    return response.json()
```

### Search Users

```http
GET /api/v2/users
Authorization: Zoho-oauthtoken {access_token}
```

**Query Parameters**:
- `query` (string) - Search term
- `limit` (integer) - Number of results

**Example**:
```javascript
const searchUsers = async (accessToken, query) => {
  const response = await axios.get(
    'https://cliq.zoho.com/api/v2/users',
    {
      params: { query, limit: 20 },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

### Get User by ID

```http
GET /api/v2/users/{user_id}
Authorization: Zoho-oauthtoken {access_token}
```

---

## Organizations API

Retrieve organization information.

### Get Organization Details

```http
GET /api/v2/organization
Authorization: Zoho-oauthtoken {access_token}
```

**Response**:
```json
{
  "data": {
    "id": "123456",
    "name": "Acme Corporation",
    "domain": "acmecorp",
    "created_time": "2024-01-01T00:00:00Z",
    "member_count": 150
  }
}
```

**Example**:
```javascript
const getOrganization = async (accessToken) => {
  const response = await axios.get(
    'https://cliq.zoho.com/api/v2/organization',
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
def get_organization(access_token):
    url = 'https://cliq.zoho.com/api/v2/organization'
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
    url: "https://cliq.zoho.com/api/v2/organization"
    type: GET
    headers: {"Authorization": "Zoho-oauthtoken " + access_token}
];
info response;
```

---

## File Uploads

Upload and share files in channels and conversations.

### Upload File

```http
POST /api/v2/files
Authorization: Zoho-oauthtoken {access_token}
Content-Type: multipart/form-data

file: [binary file data]
```

**Example**:
```javascript
const uploadFile = async (accessToken, filePath) => {
  const FormData = require('form-data');
  const fs = require('fs');

  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));

  const response = await axios.post(
    'https://cliq.zoho.com/api/v2/files',
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

```python
def upload_file(access_token, file_path):
    url = 'https://cliq.zoho.com/api/v2/files'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    with open(file_path, 'rb') as file:
        files = {'file': file}
        response = requests.post(url, headers=headers, files=files)
    return response.json()
```

### Send Message with File

```http
POST /api/v2/channels/{channel_id}/messages
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "text": "Please review the attached document",
  "attachments": [
    {
      "file_id": "FILE_1234567890",
      "name": "proposal.pdf"
    }
  ]
}
```

---

## Commands

Create custom slash commands for your team.

### Create Command

```http
POST /api/v2/commands
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "name": "deploy",
  "description": "Trigger deployment",
  "hint": "/deploy [environment]",
  "callback_url": "https://yourdomain.com/commands/deploy"
}
```

**Example**:
```javascript
const createCommand = async (accessToken, commandData) => {
  const response = await axios.post(
    'https://cliq.zoho.com/api/v2/commands',
    commandData,
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
const command = await createCommand(accessToken, {
  name: 'deploy',
  description: 'Trigger deployment',
  hint: '/deploy [environment]',
  callback_url: 'https://yourdomain.com/commands/deploy'
});
```

### Handle Command Callback

When a user executes your command, Cliq sends a POST request to your callback URL:

```json
{
  "command": "/deploy",
  "arguments": "production",
  "user": {
    "id": "9876543210",
    "name": "John Doe"
  },
  "channel": {
    "id": "CT_1234567890",
    "name": "Development"
  }
}
```

**Example Handler**:
```javascript
app.post('/commands/deploy', express.json(), async (req, res) => {
  const { arguments: args, user, channel } = req.body;

  // Process the deployment
  const environment = args.trim();

  if (!['staging', 'production'].includes(environment)) {
    return res.json({
      text: 'Invalid environment. Use: staging or production',
      bot: {
        name: 'DeployBot'
      }
    });
  }

  // Trigger deployment
  try {
    await triggerDeployment(environment);

    res.json({
      text: `Deployment to ${environment} initiated by ${user.name}`,
      card: {
        title: 'Deployment Started',
        theme: 'modern-inline',
        sections: [
          {
            id: 1,
            elements: [
              {
                type: 'text',
                text: `**Environment:** ${environment}`
              },
              {
                type: 'text',
                text: `**Initiated by:** ${user.name}`
              }
            ]
          }
        ]
      }
    });
  } catch (error) {
    res.json({
      text: `Deployment failed: ${error.message}`
    });
  }
});
```

---

## Integrations

### GitHub Integration Example

```javascript
// Send GitHub webhook events to Cliq
app.post('/github-webhook', express.json(), async (req, res) => {
  const { action, pull_request, repository } = req.body;

  if (action === 'opened' && pull_request) {
    const message = {
      text: 'New pull request opened',
      card: {
        title: pull_request.title,
        theme: 'modern-inline',
        sections: [
          {
            id: 1,
            elements: [
              {
                type: 'text',
                text: `**Author:** ${pull_request.user.login}`
              },
              {
                type: 'text',
                text: `**Repository:** ${repository.name}`
              },
              {
                type: 'text',
                text: `**Branch:** ${pull_request.head.ref}`
              }
            ]
          }
        ],
        buttons: [
          {
            label: 'View PR',
            type: 'open.url',
            url: pull_request.html_url
          }
        ]
      }
    };

    // Send to Cliq webhook
    await axios.post(process.env.CLIQ_WEBHOOK_URL, message);
  }

  res.status(200).send('OK');
});
```

### Jira Integration Example

```python
# Send Jira issue updates to Cliq
@app.route('/jira-webhook', methods=['POST'])
def jira_webhook():
    data = request.json
    issue = data.get('issue', {})
    webhook_type = data.get('webhookEvent')

    if webhook_type == 'jira:issue_created':
        message = {
            'text': 'New Jira issue created',
            'card': {
                'title': issue['fields']['summary'],
                'theme': 'modern-inline',
                'sections': [
                    {
                        'id': 1,
                        'elements': [
                            {
                                'type': 'text',
                                'text': f"**Issue:** {issue['key']}"
                            },
                            {
                                'type': 'text',
                                'text': f"**Priority:** {issue['fields']['priority']['name']}"
                            },
                            {
                                'type': 'text',
                                'text': f"**Assignee:** {issue['fields']['assignee']['displayName']}"
                            }
                        ]
                    }
                ],
                'buttons': [
                    {
                        'label': 'View Issue',
                        'type': 'open.url',
                        'url': f"{jira_url}/browse/{issue['key']}"
                    }
                ]
            }
        }

        # Send to Cliq webhook
        requests.post(os.getenv('CLIQ_WEBHOOK_URL'), json=message)

    return jsonify({'status': 'ok'}), 200
```

---

## Rate Limits

### API Call Limits

Zoho Cliq enforces rate limits:

| Plan | API Calls per Minute | API Calls per Hour |
|------|---------------------|-------------------|
| Free | 30 | 1,000 |
| Standard | 60 | 3,000 |
| Professional | 120 | 10,000 |
| Enterprise | 300 | 30,000 |

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
| 201 | Created | Resource created successfully |
| 204 | No Content | Successful deletion |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Invalid or expired access token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource does not exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |

### Common Error Codes

| Error Code | Description | Solution |
|------------|-------------|----------|
| INVALID_TOKEN | Access token is invalid or expired | Refresh the access token |
| INVALID_CHANNEL | Channel ID does not exist | Verify channel ID |
| PERMISSION_DENIED | User lacks required permissions | Grant appropriate permissions |
| MESSAGE_TOO_LONG | Message exceeds character limit | Reduce message length |
| INVALID_USER | User ID does not exist | Verify user ID |
| RATE_LIMIT_EXCEEDED | API rate limit exceeded | Implement rate limiting |
| CHANNEL_ARCHIVED | Cannot post to archived channel | Unarchive channel |
| BOT_NOT_FOUND | Bot ID does not exist | Verify bot ID |

---

## Code Examples

### Complete Bot Integration

```javascript
// Complete bot workflow with interactive messages
const completeBotWorkflow = async () => {
  try {
    // Step 1: Create bot
    const bot = await createBot(accessToken, {
      name: 'TaskBot',
      description: 'Bot for task management'
    });

    const webhookUrl = bot.data.webhook_url;
    console.log('Bot created:', webhookUrl);

    // Step 2: Send initial message
    await axios.post(webhookUrl, {
      text: 'TaskBot is now active!',
      card: {
        title: 'TaskBot Ready',
        theme: 'modern-inline',
        sections: [
          {
            id: 1,
            elements: [
              {
                type: 'text',
                text: 'I can help you manage tasks. Use /task to get started.'
              }
            ]
          }
        ]
      }
    });

    console.log('Bot workflow completed');

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};
```

### Notification System

```python
import requests
from typing import Dict, List

class CliqNotifier:
    def __init__(self, webhook_url: str):
        self.webhook_url = webhook_url

    def send_notification(self, title: str, message: str, urgency: str = 'normal'):
        """Send notification with urgency level"""

        theme_colors = {
            'low': 'modern-inline',
            'normal': 'modern-inline',
            'high': 'modern-inline',
            'critical': 'modern-inline'
        }

        payload = {
            'text': message,
            'card': {
                'title': title,
                'theme': theme_colors.get(urgency, 'modern-inline'),
                'sections': [
                    {
                        'id': 1,
                        'elements': [
                            {
                                'type': 'text',
                                'text': f"**Urgency:** {urgency.upper()}"
                            },
                            {
                                'type': 'text',
                                'text': message
                            }
                        ]
                    }
                ]
            }
        }

        response = requests.post(self.webhook_url, json=payload)
        return response.json()

    def send_alert(self, alert_data: Dict):
        """Send system alert"""
        return self.send_notification(
            title=f"🚨 {alert_data['title']}",
            message=alert_data['message'],
            urgency='critical'
        )

    def send_deployment_notification(self, deployment_data: Dict):
        """Send deployment notification"""
        status_emoji = '✅' if deployment_data['status'] == 'success' else '❌'

        payload = {
            'text': f"Deployment {deployment_data['status']}",
            'card': {
                'title': f"{status_emoji} Deployment {deployment_data['status'].upper()}",
                'theme': 'modern-inline',
                'sections': [
                    {
                        'id': 1,
                        'elements': [
                            {
                                'type': 'text',
                                'text': f"**Environment:** {deployment_data['environment']}"
                            },
                            {
                                'type': 'text',
                                'text': f"**Version:** {deployment_data['version']}"
                            },
                            {
                                'type': 'text',
                                'text': f"**Duration:** {deployment_data['duration']}"
                            }
                        ]
                    }
                ],
                'buttons': [
                    {
                        'label': 'View Logs',
                        'type': 'open.url',
                        'url': deployment_data['logs_url']
                    }
                ]
            }
        }

        response = requests.post(self.webhook_url, json=payload)
        return response.json()

# Usage
notifier = CliqNotifier('https://cliq.zoho.com/api/v2/...')

# Send deployment notification
notifier.send_deployment_notification({
    'status': 'success',
    'environment': 'production',
    'version': '2.5.0',
    'duration': '3m 42s',
    'logs_url': 'https://logs.example.com'
})

# Send critical alert
notifier.send_alert({
    'title': 'Database Connection Error',
    'message': 'Unable to connect to primary database. Failover initiated.'
})
```

---

## Best Practices

### 1. Message Formatting

**Use Rich Cards for Important Information**:
```javascript
// Good - Rich card with structured information
const goodMessage = {
  text: 'Build status update',
  card: {
    title: 'CI/CD Pipeline',
    theme: 'modern-inline',
    sections: [
      {
        id: 1,
        elements: [
          { type: 'text', text: '**Status:** Success' },
          { type: 'text', text: '**Duration:** 3m 42s' }
        ]
      }
    ]
  }
};

// Bad - Plain text for structured data
const badMessage = {
  text: 'Build status: Success, Duration: 3m 42s'
};
```

### 2. Error Handling

```javascript
const safeAPICall = async (apiFunction, ...args) => {
  try {
    return await apiFunction(...args);
  } catch (error) {
    if (error.response?.status === 401) {
      await refreshToken();
      return await apiFunction(...args);
    }

    if (error.response?.status === 429) {
      const resetTime = error.response.headers['x-ratelimit-reset'];
      await waitUntil(resetTime);
      return await apiFunction(...args);
    }

    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
};
```

### 3. Webhook Security

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

### 4. Rate Limiting

```javascript
// Implement queue for message sending
class MessageQueue {
  constructor(rateLimit = 60) {
    this.queue = [];
    this.rateLimit = rateLimit;
    this.interval = 60000; // 1 minute
  }

  async add(message) {
    this.queue.push(message);
    if (!this.processing) {
      this.process();
    }
  }

  async process() {
    this.processing = true;
    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, this.rateLimit);
      await Promise.all(batch.map(msg => this.send(msg)));
      if (this.queue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, this.interval));
      }
    }
    this.processing = false;
  }

  async send(message) {
    // Send message implementation
  }
}
```

---

## Data Centers

Zoho Cliq operates in multiple data centers:

| Data Center | Base URL |
|-------------|----------|
| US | https://cliq.zoho.com |
| EU | https://cliq.zoho.eu |
| IN | https://cliq.zoho.in |
| AU | https://cliq.zoho.com.au |

---

## Additional Resources

- [Official Zoho Cliq API Documentation](https://www.zoho.com/cliq/help/restapi/v2/)
- [Zoho API Console](https://api-console.zoho.com/)
- [Bot Development Guide](https://www.zoho.com/cliq/help/bots/)
- [Developer Community](https://help.zoho.com/portal/en/community/cliq)

---

**Last Updated**: December 2025
**API Version**: v2
