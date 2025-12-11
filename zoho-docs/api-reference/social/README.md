# Zoho Social API Reference

## Overview

Zoho Social is a comprehensive social media management platform that enables businesses to schedule posts, monitor engagement, analyze performance, and manage multiple social media accounts from a single dashboard. The API provides programmatic access to all core functionality.

**Current API Version**: v2
**Base URL**: `https://social.zoho.com/api/v2/`
**Protocol**: REST
**Data Format**: JSON
**Authentication**: OAuth 2.0

---

## Quick Links

- [Authentication](#authentication)
- [Brands & Channels](#brands--channels)
- [Posts API](#posts-api)
- [Scheduling API](#scheduling-api)
- [Monitoring API](#monitoring-api)
- [Analytics API](#analytics-api)
- [Engagement API](#engagement-api)
- [Media Library](#media-library)
- [Error Codes](#error-codes)
- [Rate Limits](#rate-limits)
- [Code Examples](#code-examples)

---

## API Categories

### 1. Brands & Channels

**Purpose**: Manage social media brands and connected channels (accounts)

**Endpoints**:
```http
GET    /api/v2/brands                          # List all brands
GET    /api/v2/brands/{brand_id}               # Get brand details
GET    /api/v2/brands/{brand_id}/channels      # List brand channels
GET    /api/v2/channels/{channel_id}           # Get channel details
```

**Supported Platforms**:
- Facebook (Pages & Groups)
- Instagram (Business & Creator)
- Twitter/X
- LinkedIn (Pages & Personal)
- Google Business Profile
- TikTok
- Pinterest
- YouTube

**Example - List Brands and Channels**:
```http
GET https://social.zoho.com/api/v2/brands
Authorization: Zoho-oauthtoken {access_token}
```

**Response**:
```json
{
  "data": [
    {
      "brand_id": "brand_123",
      "brand_name": "My Company",
      "created_time": "2024-01-15T10:30:00+00:00",
      "channels_count": 5,
      "team_members": 3
    }
  ]
}
```

**Example - Get Brand Channels**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const getBrandChannels = async (accessToken, brandId) => {
  const response = await axios.get(
    `https://social.zoho.com/api/v2/brands/${brandId}/channels`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

**Channel Object**:
```json
{
  "channel_id": "ch_456",
  "channel_name": "My Company Facebook",
  "platform": "facebook",
  "platform_type": "page",
  "username": "mycompany",
  "profile_image": "https://cdn.social.zoho.com/images/profile.jpg",
  "follower_count": 15420,
  "status": "active",
  "connected_time": "2024-01-15T10:30:00+00:00"
}
```

---

### 2. Posts API

**Purpose**: Create, schedule, publish, and manage social media posts

**Endpoints**:
```http
GET    /api/v2/posts                           # List all posts
GET    /api/v2/posts/{post_id}                 # Get post details
POST   /api/v2/posts                           # Create/schedule post
PUT    /api/v2/posts/{post_id}                 # Update post
DELETE /api/v2/posts/{post_id}                 # Delete post
POST   /api/v2/posts/{post_id}/publish         # Publish immediately
GET    /api/v2/posts/published                 # List published posts
GET    /api/v2/posts/scheduled                 # List scheduled posts
GET    /api/v2/posts/drafts                    # List draft posts
```

**Example - Create Scheduled Post**:
```javascript
const createScheduledPost = async (accessToken, brandId, postData) => {
  const response = await axios.post(
    'https://social.zoho.com/api/v2/posts',
    {
      brand_id: brandId,
      message: postData.message,
      channels: postData.channels, // Array of channel IDs
      scheduled_time: postData.scheduledTime, // ISO 8601 format
      media: postData.media, // Array of media IDs
      post_type: 'scheduled',
      settings: {
        facebook: {
          link: postData.link,
          call_to_action: 'LEARN_MORE'
        },
        twitter: {
          enable_thread: false
        },
        linkedin: {
          content_type: 'article'
        }
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

// Usage
const post = await createScheduledPost(accessToken, 'brand_123', {
  message: 'Excited to announce our new product launch! 🚀 #Innovation',
  channels: ['ch_facebook', 'ch_twitter', 'ch_linkedin'],
  scheduledTime: '2025-01-20T15:00:00Z',
  media: ['media_001', 'media_002'],
  link: 'https://example.com/product'
});
```

**Example - Create Multi-Platform Post with Python**:
```python
# Python
import requests
from datetime import datetime, timedelta

def create_multi_platform_post(access_token, brand_id, content):
    url = 'https://social.zoho.com/api/v2/posts'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }

    # Schedule for 2 hours from now
    scheduled_time = (datetime.utcnow() + timedelta(hours=2)).isoformat() + 'Z'

    data = {
        'brand_id': brand_id,
        'message': content['message'],
        'channels': content['channels'],
        'scheduled_time': scheduled_time,
        'media': content.get('media', []),
        'post_type': 'scheduled',
        'settings': {
            'facebook': {
                'link': content.get('link'),
                'link_title': content.get('link_title'),
                'link_description': content.get('link_description')
            },
            'instagram': {
                'first_comment': content.get('first_comment'),
                'location': content.get('location')
            },
            'twitter': {
                'enable_thread': False,
                'media_tagging': content.get('media_tags', [])
            }
        }
    }

    response = requests.post(url, json=data, headers=headers)
    return response.json()

# Usage
post_content = {
    'message': 'Check out our latest blog post on social media trends!',
    'channels': ['ch_fb_page', 'ch_twitter', 'ch_linkedin'],
    'media': ['media_123'],
    'link': 'https://blog.example.com/social-trends-2025',
    'link_title': '2025 Social Media Trends',
    'link_description': 'Discover the top trends shaping social media',
    'first_comment': 'What trends are you most excited about?'
}

result = create_multi_platform_post(access_token, 'brand_123', post_content)
```

**Example - Publish Immediately with Deluge**:
```deluge
// Deluge
post_data = {
    "brand_id": "brand_123",
    "message": "Breaking news! Our new feature is now live! 🎉",
    "channels": ["ch_facebook", "ch_twitter"],
    "post_type": "publish_now",
    "media": ["media_456"]
};

response = invokeurl
[
    url: "https://social.zoho.com/api/v2/posts"
    type: POST
    parameters: post_data.toString()
    headers: {"Authorization": "Zoho-oauthtoken " + zoho.oauth.getToken("zoho_social")}
    connection: "zoho_social"
];

if (response.get("status") == "success")
{
    post_id = response.get("data").get("post_id");
    info "Post published successfully: " + post_id;
}
else
{
    info "Error: " + response.get("message");
}
```

**Post Object**:
```json
{
  "post_id": "post_789",
  "brand_id": "brand_123",
  "message": "Excited to announce our new product launch!",
  "channels": [
    {
      "channel_id": "ch_facebook",
      "platform": "facebook",
      "status": "scheduled"
    },
    {
      "channel_id": "ch_twitter",
      "platform": "twitter",
      "status": "scheduled"
    }
  ],
  "media": [
    {
      "media_id": "media_001",
      "type": "image",
      "url": "https://cdn.social.zoho.com/media/image.jpg"
    }
  ],
  "scheduled_time": "2025-01-20T15:00:00Z",
  "post_type": "scheduled",
  "status": "scheduled",
  "created_time": "2025-01-15T10:30:00+00:00",
  "created_by": "user_001"
}
```

---

### 3. Scheduling API

**Purpose**: Manage posting schedules and optimal posting times

**Endpoints**:
```http
GET    /api/v2/schedules                       # Get brand schedules
POST   /api/v2/schedules                       # Create schedule
PUT    /api/v2/schedules/{schedule_id}         # Update schedule
DELETE /api/v2/schedules/{schedule_id}         # Delete schedule
GET    /api/v2/schedules/best-times            # Get optimal posting times
```

**Example - Get Best Posting Times**:
```javascript
const getBestPostingTimes = async (accessToken, brandId, channelId) => {
  const response = await axios.get(
    'https://social.zoho.com/api/v2/schedules/best-times',
    {
      params: {
        brand_id: brandId,
        channel_id: channelId,
        days: 30 // Analyze last 30 days
      },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

**Response - Best Times**:
```json
{
  "data": {
    "channel_id": "ch_facebook",
    "recommendations": [
      {
        "day": "Monday",
        "times": ["09:00", "13:00", "18:00"],
        "engagement_score": 8.5
      },
      {
        "day": "Wednesday",
        "times": ["10:00", "14:00", "19:00"],
        "engagement_score": 9.2
      }
    ],
    "overall_best_time": "Wednesday 14:00",
    "timezone": "America/New_York"
  }
}
```

**Example - Create Posting Schedule**:
```python
def create_posting_schedule(access_token, brand_id):
    url = 'https://social.zoho.com/api/v2/schedules'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'brand_id': brand_id,
        'schedule_name': 'Weekly Social Schedule',
        'timezone': 'America/New_York',
        'schedule': {
            'monday': ['09:00', '13:00', '17:00'],
            'tuesday': ['09:00', '13:00', '17:00'],
            'wednesday': ['09:00', '14:00', '19:00'],
            'thursday': ['09:00', '13:00', '17:00'],
            'friday': ['09:00', '12:00', '16:00']
        },
        'channels': ['ch_facebook', 'ch_twitter', 'ch_linkedin']
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

---

### 4. Monitoring API

**Purpose**: Monitor brand mentions, keywords, and social conversations

**Endpoints**:
```http
GET    /api/v2/monitoring/mentions             # Get brand mentions
GET    /api/v2/monitoring/keywords             # Get keyword mentions
POST   /api/v2/monitoring/columns              # Create monitoring column
GET    /api/v2/monitoring/columns              # List monitoring columns
PUT    /api/v2/monitoring/columns/{column_id}  # Update column
DELETE /api/v2/monitoring/columns/{column_id}  # Delete column
```

**Example - Get Brand Mentions**:
```javascript
const getBrandMentions = async (accessToken, brandId, filters = {}) => {
  const response = await axios.get(
    'https://social.zoho.com/api/v2/monitoring/mentions',
    {
      params: {
        brand_id: brandId,
        from_date: filters.fromDate || getLastWeek(),
        to_date: filters.toDate || new Date().toISOString(),
        platforms: filters.platforms || ['twitter', 'facebook'],
        sentiment: filters.sentiment, // positive, negative, neutral
        page: filters.page || 1,
        per_page: filters.perPage || 50
      },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};

function getLastWeek() {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date.toISOString();
}
```

**Mention Object**:
```json
{
  "mention_id": "mention_123",
  "platform": "twitter",
  "author": {
    "username": "john_doe",
    "display_name": "John Doe",
    "profile_image": "https://pbs.twimg.com/profile.jpg",
    "followers": 1520
  },
  "message": "@mycompany Your customer service is amazing! Thank you!",
  "created_time": "2025-01-15T10:30:00+00:00",
  "engagement": {
    "likes": 15,
    "comments": 3,
    "shares": 2
  },
  "sentiment": "positive",
  "sentiment_score": 0.85,
  "url": "https://twitter.com/john_doe/status/123456789"
}
```

**Example - Create Monitoring Column**:
```python
def create_monitoring_column(access_token, brand_id):
    url = 'https://social.zoho.com/api/v2/monitoring/columns'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'brand_id': brand_id,
        'column_name': 'Brand Mentions',
        'column_type': 'mentions',
        'filters': {
            'keywords': ['@mycompany', '#mycompany'],
            'platforms': ['twitter', 'facebook', 'instagram'],
            'languages': ['en'],
            'location': 'United States'
        },
        'alert_settings': {
            'enable_alerts': True,
            'alert_frequency': 'realtime',
            'alert_email': 'alerts@mycompany.com'
        }
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

---

### 5. Analytics API

**Purpose**: Retrieve performance metrics and insights

**Endpoints**:
```http
GET    /api/v2/analytics/overview              # Get overview stats
GET    /api/v2/analytics/posts                 # Get post analytics
GET    /api/v2/analytics/audience              # Get audience insights
GET    /api/v2/analytics/engagement            # Get engagement metrics
GET    /api/v2/analytics/reports               # Generate reports
GET    /api/v2/analytics/competitors           # Get competitor analysis
```

**Example - Get Post Analytics**:
```javascript
const getPostAnalytics = async (accessToken, postId) => {
  const response = await axios.get(
    `https://social.zoho.com/api/v2/analytics/posts/${postId}`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

**Post Analytics Object**:
```json
{
  "post_id": "post_789",
  "published_time": "2025-01-15T15:00:00+00:00",
  "platforms": [
    {
      "platform": "facebook",
      "metrics": {
        "impressions": 5420,
        "reach": 4230,
        "engagement": 342,
        "likes": 256,
        "comments": 45,
        "shares": 41,
        "clicks": 187,
        "engagement_rate": 8.08
      }
    },
    {
      "platform": "twitter",
      "metrics": {
        "impressions": 3210,
        "engagement": 198,
        "likes": 132,
        "retweets": 34,
        "replies": 32,
        "clicks": 89,
        "engagement_rate": 6.17
      }
    }
  ],
  "total_engagement": 540,
  "total_reach": 7440,
  "best_performing_platform": "facebook"
}
```

**Example - Get Brand Analytics Overview**:
```python
def get_brand_analytics(access_token, brand_id, date_range):
    url = 'https://social.zoho.com/api/v2/analytics/overview'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'brand_id': brand_id,
        'from_date': date_range['from'],
        'to_date': date_range['to'],
        'metrics': ['engagement', 'reach', 'impressions', 'follower_growth']
    }
    response = requests.get(url, params=params, headers=headers)
    return response.json()

# Usage
analytics = get_brand_analytics(
    access_token,
    'brand_123',
    {
        'from': '2025-01-01',
        'to': '2025-01-31'
    }
)
```

**Overview Analytics Response**:
```json
{
  "data": {
    "period": {
      "from": "2025-01-01",
      "to": "2025-01-31"
    },
    "summary": {
      "total_posts": 124,
      "total_engagement": 15420,
      "total_reach": 234500,
      "total_impressions": 456789,
      "average_engagement_rate": 6.58,
      "follower_growth": 342,
      "follower_growth_rate": 2.23
    },
    "by_platform": [
      {
        "platform": "facebook",
        "posts": 42,
        "engagement": 6234,
        "reach": 98765,
        "engagement_rate": 6.31
      },
      {
        "platform": "instagram",
        "posts": 38,
        "engagement": 5432,
        "reach": 76543,
        "engagement_rate": 7.10
      },
      {
        "platform": "twitter",
        "posts": 44,
        "engagement": 3754,
        "reach": 59192,
        "engagement_rate": 6.34
      }
    ],
    "top_posts": [
      {
        "post_id": "post_001",
        "message": "Excited to announce...",
        "engagement": 1234,
        "engagement_rate": 12.5
      }
    ]
  }
}
```

---

### 6. Engagement API

**Purpose**: Manage interactions with audience (replies, comments, messages)

**Endpoints**:
```http
GET    /api/v2/engagement/inbox                # Get inbox messages
GET    /api/v2/engagement/comments             # Get post comments
POST   /api/v2/engagement/comments/reply       # Reply to comment
POST   /api/v2/engagement/messages/reply       # Reply to message
PUT    /api/v2/engagement/comments/{id}/hide   # Hide comment
PUT    /api/v2/engagement/comments/{id}/like   # Like comment
```

**Example - Get and Reply to Comments**:
```javascript
const getAndReplyToComments = async (accessToken, postId) => {
  // Get comments
  const commentsResponse = await axios.get(
    `https://social.zoho.com/api/v2/engagement/comments`,
    {
      params: { post_id: postId },
      headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}` }
    }
  );

  const comments = commentsResponse.data.data;

  // Reply to unresponded comments
  const replies = [];
  for (const comment of comments) {
    if (!comment.replied) {
      const reply = await axios.post(
        'https://social.zoho.com/api/v2/engagement/comments/reply',
        {
          comment_id: comment.comment_id,
          message: 'Thank you for your feedback! We appreciate it.'
        },
        {
          headers: {
            'Authorization': `Zoho-oauthtoken ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      replies.push(reply.data);
    }
  }

  return replies;
};
```

---

### 7. Media Library

**Purpose**: Upload and manage media files for posts

**Endpoints**:
```http
GET    /api/v2/media                           # List media files
POST   /api/v2/media/upload                    # Upload media
DELETE /api/v2/media/{media_id}                # Delete media
GET    /api/v2/media/{media_id}                # Get media details
```

**Example - Upload Media**:
```javascript
const uploadMedia = async (accessToken, brandId, filePath) => {
  const FormData = require('form-data');
  const fs = require('fs');
  const form = new FormData();

  form.append('file', fs.createReadStream(filePath));
  form.append('brand_id', brandId);

  const response = await axios.post(
    'https://social.zoho.com/api/v2/media/upload',
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

**Example - Upload and Post with Python**:
```python
def upload_and_post(access_token, brand_id, image_path, message):
    # Upload media
    upload_url = 'https://social.zoho.com/api/v2/media/upload'
    headers = {'Authorization': f'Zoho-oauthtoken {access_token}'}

    with open(image_path, 'rb') as image_file:
        files = {'file': image_file}
        data = {'brand_id': brand_id}
        upload_response = requests.post(upload_url, files=files, data=data, headers=headers)

    media_id = upload_response.json()['data']['media_id']

    # Create post with media
    post_url = 'https://social.zoho.com/api/v2/posts'
    post_data = {
        'brand_id': brand_id,
        'message': message,
        'channels': ['ch_facebook', 'ch_instagram'],
        'media': [media_id],
        'post_type': 'publish_now'
    }
    headers['Content-Type'] = 'application/json'
    post_response = requests.post(post_url, json=post_data, headers=headers)

    return post_response.json()
```

---

## Authentication

### OAuth 2.0 Flow

**Step 1: Register Your Application**
- Go to [Zoho API Console](https://api-console.zoho.com/)
- Create application with redirect URI
- Note Client ID and Client Secret

**Step 2: Authorization URL**
```http
GET https://accounts.zoho.com/oauth/v2/auth?
  scope=ZohoSocial.posts.ALL,ZohoSocial.analytics.READ,ZohoSocial.monitoring.ALL&
  client_id={client_id}&
  response_type=code&
  access_type=offline&
  redirect_uri={redirect_uri}
```

**Available Scopes**:
- `ZohoSocial.posts.ALL` - Full access to posts
- `ZohoSocial.posts.READ` - Read-only access to posts
- `ZohoSocial.posts.CREATE` - Create and schedule posts
- `ZohoSocial.analytics.READ` - Access to analytics
- `ZohoSocial.monitoring.ALL` - Full monitoring access
- `ZohoSocial.engagement.ALL` - Manage engagement
- `ZohoSocial.fullaccess.ALL` - Full access to all features

**Step 3: Get Access Token**
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
  "api_domain": "https://social.zoho.com",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

**Step 4: Refresh Token**
```javascript
const refreshToken = async (clientId, clientSecret, refreshToken) => {
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

---

## Rate Limits

### API Call Limits

| Plan | Requests per Day | Requests per Minute | Burst Limit |
|------|------------------|---------------------|-------------|
| Free | 5,000 | 20 | 30 |
| Standard | 15,000 | 50 | 75 |
| Professional | 50,000 | 100 | 150 |
| Premium | 100,000 | 200 | 300 |

### Platform-Specific Limits

| Platform | Posts per Day | API Calls per Hour |
|----------|---------------|-------------------|
| Facebook | 50 per page | 200 |
| Instagram | 25 per account | 200 |
| Twitter | 300 per account | 300 |
| LinkedIn | 100 per page | 100 |

### Rate Limit Headers
```http
X-RateLimit-Limit: 50000
X-RateLimit-Remaining: 49750
X-RateLimit-Reset: 1642147200
X-RateLimit-Retry-After: 3600
```

### Rate Limit Handling
```python
import time

def api_call_with_rate_limit(url, headers, max_retries=3):
    for attempt in range(max_retries):
        response = requests.get(url, headers=headers)

        if response.status_code == 429:
            retry_after = int(response.headers.get('X-RateLimit-Retry-After', 60))
            print(f"Rate limited. Waiting {retry_after} seconds...")
            time.sleep(retry_after)
            continue

        remaining = response.headers.get('X-RateLimit-Remaining')
        if remaining and int(remaining) < 100:
            print(f"Warning: Only {remaining} API calls remaining")

        return response.json()

    raise Exception("Max retries exceeded")
```

---

## Error Codes

| HTTP Status | Error Code | Description | Solution |
|-------------|------------|-------------|----------|
| 400 | INVALID_REQUEST | Invalid request format | Check request parameters |
| 400 | INVALID_CHANNEL | Channel not found or inactive | Verify channel ID and status |
| 400 | INVALID_SCHEDULE_TIME | Invalid scheduling time | Use ISO 8601 format, future date |
| 401 | INVALID_TOKEN | Expired or invalid token | Refresh access token |
| 401 | INSUFFICIENT_SCOPE | Missing required scope | Update OAuth scopes |
| 403 | PERMISSION_DENIED | User lacks permission | Check user role and permissions |
| 404 | POST_NOT_FOUND | Post does not exist | Verify post ID |
| 404 | BRAND_NOT_FOUND | Brand does not exist | Verify brand ID |
| 409 | DUPLICATE_POST | Post already scheduled | Check for duplicates |
| 422 | MEDIA_UPLOAD_FAILED | Media upload error | Check file format and size |
| 422 | PLATFORM_ERROR | Platform API error | Check platform status |
| 429 | RATE_LIMIT_EXCEEDED | Too many requests | Implement rate limiting |
| 500 | INTERNAL_ERROR | Server error | Retry with exponential backoff |

**Error Response Format**:
```json
{
  "error": {
    "code": "INVALID_SCHEDULE_TIME",
    "message": "Schedule time must be in the future",
    "details": {
      "provided_time": "2025-01-14T10:00:00Z",
      "current_time": "2025-01-15T10:30:00Z"
    }
  }
}
```

---

## Code Examples

### Complete Social Media Management Example

```javascript
// JavaScript/Node.js - Social Media Management Class
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

class ZohoSocialManager {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseURL = 'https://social.zoho.com/api/v2';
  }

  async request(method, endpoint, data = null, isFormData = false) {
    const config = {
      method,
      url: `${this.baseURL}${endpoint}`,
      headers: {
        'Authorization': `Zoho-oauthtoken ${this.accessToken}`
      }
    };

    if (data) {
      if (isFormData) {
        config.headers = { ...config.headers, ...data.getHeaders() };
        config.data = data;
      } else {
        config.headers['Content-Type'] = 'application/json';
        config.data = data;
      }
    }

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      const { status, data } = error.response;
      console.error(`API Error ${status}:`, data.error);
      throw new Error(data.error.message);
    }
    throw error;
  }

  // Brands & Channels
  async getBrands() {
    return this.request('GET', '/brands');
  }

  async getBrandChannels(brandId) {
    return this.request('GET', `/brands/${brandId}/channels`);
  }

  // Posts
  async createPost(brandId, postData) {
    return this.request('POST', '/posts', {
      brand_id: brandId,
      ...postData
    });
  }

  async schedulePost(brandId, message, channels, scheduledTime, media = []) {
    return this.createPost(brandId, {
      message,
      channels,
      scheduled_time: scheduledTime,
      media,
      post_type: 'scheduled'
    });
  }

  async publishNow(brandId, message, channels, media = []) {
    return this.createPost(brandId, {
      message,
      channels,
      media,
      post_type: 'publish_now'
    });
  }

  async getScheduledPosts(brandId) {
    return this.request('GET', `/posts/scheduled?brand_id=${brandId}`);
  }

  async deletePost(postId) {
    return this.request('DELETE', `/posts/${postId}`);
  }

  // Media
  async uploadMedia(brandId, filePath) {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    form.append('brand_id', brandId);
    return this.request('POST', '/media/upload', form, true);
  }

  // Analytics
  async getPostAnalytics(postId) {
    return this.request('GET', `/analytics/posts/${postId}`);
  }

  async getBrandAnalytics(brandId, fromDate, toDate) {
    return this.request('GET', `/analytics/overview?brand_id=${brandId}&from_date=${fromDate}&to_date=${toDate}`);
  }

  // Monitoring
  async getBrandMentions(brandId, filters = {}) {
    const params = new URLSearchParams({
      brand_id: brandId,
      ...filters
    });
    return this.request('GET', `/monitoring/mentions?${params}`);
  }

  // Engagement
  async getComments(postId) {
    return this.request('GET', `/engagement/comments?post_id=${postId}`);
  }

  async replyToComment(commentId, message) {
    return this.request('POST', '/engagement/comments/reply', {
      comment_id: commentId,
      message
    });
  }

  // Scheduling
  async getBestPostingTimes(brandId, channelId) {
    return this.request('GET', `/schedules/best-times?brand_id=${brandId}&channel_id=${channelId}`);
  }
}

// Usage Example
(async () => {
  const manager = new ZohoSocialManager('your_access_token');

  // Get brands and channels
  const brands = await manager.getBrands();
  const brandId = brands.data[0].brand_id;
  const channels = await manager.getBrandChannels(brandId);
  const channelIds = channels.data.map(ch => ch.channel_id);

  // Upload media
  const media = await manager.uploadMedia(brandId, './image.jpg');
  const mediaId = media.data.media_id;

  // Schedule post
  const scheduledPost = await manager.schedulePost(
    brandId,
    'Check out our latest product! #Innovation',
    channelIds,
    '2025-01-20T15:00:00Z',
    [mediaId]
  );

  console.log('Post scheduled:', scheduledPost.data.post_id);

  // Get analytics
  setTimeout(async () => {
    const analytics = await manager.getPostAnalytics(scheduledPost.data.post_id);
    console.log('Post analytics:', analytics);
  }, 3600000); // Check after 1 hour
})();
```

### Python Complete Example

```python
# Python - Social Media Automation
import requests
from datetime import datetime, timedelta
from typing import List, Dict, Optional

class ZohoSocialClient:
    def __init__(self, access_token: str):
        self.access_token = access_token
        self.base_url = 'https://social.zoho.com/api/v2'
        self.headers = {
            'Authorization': f'Zoho-oauthtoken {access_token}'
        }

    def _request(self, method: str, endpoint: str, data: Optional[Dict] = None, files: Optional[Dict] = None) -> Dict:
        url = f'{self.base_url}{endpoint}'
        headers = self.headers.copy()

        if data and not files:
            headers['Content-Type'] = 'application/json'

        response = requests.request(
            method,
            url,
            json=data if data and not files else None,
            data=data if files else None,
            files=files,
            headers=headers
        )

        if response.status_code >= 400:
            error_data = response.json()
            raise Exception(f"API Error: {error_data.get('error', {}).get('message')}")

        return response.json()

    # Brands & Channels
    def get_brands(self) -> List[Dict]:
        return self._request('GET', '/brands')['data']

    def get_brand_channels(self, brand_id: str) -> List[Dict]:
        return self._request('GET', f'/brands/{brand_id}/channels')['data']

    # Posts
    def create_post(self, brand_id: str, message: str, channels: List[str],
                   post_type: str = 'publish_now', scheduled_time: str = None,
                   media: List[str] = None, settings: Dict = None) -> Dict:
        data = {
            'brand_id': brand_id,
            'message': message,
            'channels': channels,
            'post_type': post_type
        }

        if scheduled_time:
            data['scheduled_time'] = scheduled_time
        if media:
            data['media'] = media
        if settings:
            data['settings'] = settings

        return self._request('POST', '/posts', data)

    def schedule_post(self, brand_id: str, message: str, channels: List[str],
                     scheduled_time: str, media: List[str] = None) -> Dict:
        return self.create_post(brand_id, message, channels, 'scheduled', scheduled_time, media)

    def publish_now(self, brand_id: str, message: str, channels: List[str], media: List[str] = None) -> Dict:
        return self.create_post(brand_id, message, channels, 'publish_now', media=media)

    # Media
    def upload_media(self, brand_id: str, file_path: str) -> Dict:
        with open(file_path, 'rb') as file:
            files = {'file': file}
            data = {'brand_id': brand_id}
            return self._request('POST', '/media/upload', data=data, files=files)

    # Analytics
    def get_post_analytics(self, post_id: str) -> Dict:
        return self._request('GET', f'/analytics/posts/{post_id}')

    def get_brand_analytics(self, brand_id: str, from_date: str, to_date: str) -> Dict:
        endpoint = f'/analytics/overview?brand_id={brand_id}&from_date={from_date}&to_date={to_date}'
        return self._request('GET', endpoint)

    # Monitoring
    def get_brand_mentions(self, brand_id: str, from_date: str = None,
                          platforms: List[str] = None, sentiment: str = None) -> List[Dict]:
        params = f'brand_id={brand_id}'
        if from_date:
            params += f'&from_date={from_date}'
        if platforms:
            params += f'&platforms={",".join(platforms)}'
        if sentiment:
            params += f'&sentiment={sentiment}'

        return self._request('GET', f'/monitoring/mentions?{params}')['data']

    # Engagement
    def get_comments(self, post_id: str) -> List[Dict]:
        return self._request('GET', f'/engagement/comments?post_id={post_id}')['data']

    def reply_to_comment(self, comment_id: str, message: str) -> Dict:
        return self._request('POST', '/engagement/comments/reply', {
            'comment_id': comment_id,
            'message': message
        })

    # Automation
    def auto_respond_to_comments(self, post_id: str, response_template: str):
        """Automatically respond to new comments on a post"""
        comments = self.get_comments(post_id)

        for comment in comments:
            if not comment.get('replied'):
                # Personalize response
                author_name = comment['author']['display_name'].split()[0]
                personalized_message = response_template.replace('{name}', author_name)

                self.reply_to_comment(comment['comment_id'], personalized_message)
                print(f"Replied to {author_name}")

    def schedule_content_calendar(self, brand_id: str, channels: List[str], content_list: List[Dict]):
        """Schedule multiple posts from a content calendar"""
        results = []

        for content in content_list:
            # Upload media if provided
            media_ids = []
            if 'media_path' in content:
                media_response = self.upload_media(brand_id, content['media_path'])
                media_ids.append(media_response['data']['media_id'])

            # Schedule post
            post = self.schedule_post(
                brand_id,
                content['message'],
                channels,
                content['scheduled_time'],
                media_ids if media_ids else None
            )

            results.append({
                'content': content['message'][:50] + '...',
                'post_id': post['data']['post_id'],
                'scheduled_time': content['scheduled_time']
            })

        return results

# Usage Example
if __name__ == '__main__':
    client = ZohoSocialClient('your_access_token')

    # Get brands and channels
    brands = client.get_brands()
    brand_id = brands[0]['brand_id']
    channels = client.get_brand_channels(brand_id)
    channel_ids = [ch['channel_id'] for ch in channels if ch['platform'] in ['facebook', 'twitter']]

    # Content calendar
    content_calendar = [
        {
            'message': 'Monday motivation! Start your week strong. #MondayMotivation',
            'scheduled_time': '2025-01-20T09:00:00Z',
            'media_path': './images/monday.jpg'
        },
        {
            'message': 'Tip Tuesday: Here are our top productivity tips! #TipTuesday',
            'scheduled_time': '2025-01-21T10:00:00Z',
            'media_path': './images/tips.jpg'
        },
        {
            'message': 'Hump day! You are halfway through the week! #Wednesday',
            'scheduled_time': '2025-01-22T13:00:00Z'
        }
    ]

    # Schedule content
    scheduled_posts = client.schedule_content_calendar(brand_id, channel_ids, content_calendar)
    print(f"Scheduled {len(scheduled_posts)} posts")

    # Monitor mentions
    last_week = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
    mentions = client.get_brand_mentions(brand_id, from_date=last_week, sentiment='positive')
    print(f"Found {len(mentions)} positive mentions")

    # Get analytics
    analytics = client.get_brand_analytics(brand_id, last_week, datetime.now().strftime('%Y-%m-%d'))
    print(f"Total engagement: {analytics['data']['summary']['total_engagement']}")
```

### Deluge CRM Integration Example

```deluge
// Deluge - Integrate Zoho Social with Zoho CRM

// Function to post when Deal is Closed Won
void postDealClosedToSocial(string dealId)
{
    // Get deal details
    deal = zoho.crm.getRecordById("Deals", dealId);

    if (deal.get("Stage") == "Closed Won")
    {
        // Get brand and channels
        brand_response = invokeurl
        [
            url: "https://social.zoho.com/api/v2/brands"
            type: GET
            headers: {"Authorization": "Zoho-oauthtoken " + zoho.oauth.getToken("zoho_social")}
            connection: "zoho_social"
        ];

        brand_id = brand_response.get("data").get(0).get("brand_id");

        // Get channels
        channels_response = invokeurl
        [
            url: "https://social.zoho.com/api/v2/brands/" + brand_id + "/channels"
            type: GET
            headers: {"Authorization": "Zoho-oauthtoken " + zoho.oauth.getToken("zoho_social")}
            connection: "zoho_social"
        ];

        // Filter for Twitter and LinkedIn
        social_channels = List();
        for each channel in channels_response.get("data")
        {
            platform = channel.get("platform");
            if (platform == "twitter" || platform == "linkedin")
            {
                social_channels.add(channel.get("channel_id"));
            }
        }

        // Create social post
        post_message = "Excited to announce a new partnership with " + deal.get("Account_Name").get("name") + "! 🎉 #Partnership #Business";

        post_data = {
            "brand_id": brand_id,
            "message": post_message,
            "channels": social_channels,
            "post_type": "publish_now"
        };

        post_response = invokeurl
        [
            url: "https://social.zoho.com/api/v2/posts"
            type: POST
            parameters: post_data.toString()
            headers: {"Authorization": "Zoho-oauthtoken " + zoho.oauth.getToken("zoho_social")}
            connection: "zoho_social"
        ];

        if (post_response.get("status") == "success")
        {
            // Update Deal with social post ID
            update_map = {
                "Social_Post_ID": post_response.get("data").get("post_id"),
                "Posted_to_Social": true
            };
            zoho.crm.updateRecord("Deals", dealId, update_map);

            info "Deal shared on social media: " + post_response.get("data").get("post_id");
        }
    }
}

// Function to monitor brand mentions and create Leads
void monitorMentionsAndCreateLeads()
{
    // Get brand ID
    brand_response = invokeurl
    [
        url: "https://social.zoho.com/api/v2/brands"
        type: GET
        headers: {"Authorization": "Zoho-oauthtoken " + zoho.oauth.getToken("zoho_social")}
        connection: "zoho_social"
    ];

    brand_id = brand_response.get("data").get(0).get("brand_id");

    // Get recent mentions
    yesterday = zoho.currentdate.subDay(1).toString("yyyy-MM-dd");
    mentions_response = invokeurl
    [
        url: "https://social.zoho.com/api/v2/monitoring/mentions?brand_id=" + brand_id + "&from_date=" + yesterday + "&sentiment=positive"
        type: GET
        headers: {"Authorization": "Zoho-oauthtoken " + zoho.oauth.getToken("zoho_social")}
        connection: "zoho_social"
    ];

    // Process mentions
    for each mention in mentions_response.get("data")
    {
        author = mention.get("author");
        username = author.get("username");

        // Check if lead already exists
        search_result = zoho.crm.searchRecords("Leads", "(Twitter_Handle:equals:" + username + ")");

        if (search_result.size() == 0)
        {
            // Create new lead
            lead_data = {
                "Last_Name": author.get("display_name"),
                "Company": author.get("display_name") + " Social",
                "Lead_Source": "Social Media",
                "Twitter_Handle": username,
                "Description": "Positive mention: " + mention.get("message"),
                "Lead_Status": "Not Contacted"
            };

            lead_response = zoho.crm.createRecord("Leads", lead_data);
            info "Created lead from social mention: " + lead_response.get("id");
        }
    }
}

// Schedule weekly social media report
void sendWeeklyAnalyticsReport()
{
    // Get brand
    brand_response = invokeurl
    [
        url: "https://social.zoho.com/api/v2/brands"
        type: GET
        headers: {"Authorization": "Zoho-oauthtoken " + zoho.oauth.getToken("zoho_social")}
        connection: "zoho_social"
    ];

    brand_id = brand_response.get("data").get(0).get("brand_id");

    // Get last week's analytics
    today = zoho.currentdate.toString("yyyy-MM-dd");
    last_week = zoho.currentdate.subDay(7).toString("yyyy-MM-dd");

    analytics_response = invokeurl
    [
        url: "https://social.zoho.com/api/v2/analytics/overview?brand_id=" + brand_id + "&from_date=" + last_week + "&to_date=" + today
        type: GET
        headers: {"Authorization": "Zoho-oauthtoken " + zoho.oauth.getToken("zoho_social")}
        connection: "zoho_social"
    ];

    analytics = analytics_response.get("data");
    summary = analytics.get("summary");

    // Create email report
    email_body = "<h2>Weekly Social Media Report</h2>";
    email_body = email_body + "<p>Period: " + last_week + " to " + today + "</p>";
    email_body = email_body + "<h3>Summary</h3>";
    email_body = email_body + "<ul>";
    email_body = email_body + "<li>Total Posts: " + summary.get("total_posts") + "</li>";
    email_body = email_body + "<li>Total Engagement: " + summary.get("total_engagement") + "</li>";
    email_body = email_body + "<li>Total Reach: " + summary.get("total_reach") + "</li>";
    email_body = email_body + "<li>Avg Engagement Rate: " + summary.get("average_engagement_rate") + "%</li>";
    email_body = email_body + "<li>Follower Growth: " + summary.get("follower_growth") + "</li>";
    email_body = email_body + "</ul>";

    // Send email
    sendmail
    [
        from: zoho.loginuserid
        to: "marketing@company.com"
        subject: "Weekly Social Media Analytics Report"
        message: email_body
    ];

    info "Weekly analytics report sent";
}
```

---

## Best Practices

### 1. Content Strategy
- Schedule posts during optimal times for each platform
- Maintain consistent posting frequency
- Use platform-specific content formats
- Include hashtags strategically (2-3 for Twitter, 5-10 for Instagram)
- Add compelling call-to-actions

### 2. Multi-Platform Posting
- Customize messages for each platform
- Respect platform character limits
- Use appropriate media formats for each platform
- Consider platform-specific features (threads, stories, etc.)

### 3. Engagement Management
- Respond to comments within 24 hours
- Monitor brand mentions in real-time
- Use sentiment analysis to prioritize responses
- Implement automated responses for common questions

### 4. Analytics & Optimization
- Track key metrics: engagement rate, reach, impressions
- Analyze best performing content
- A/B test posting times and content formats
- Monitor competitor performance

### 5. Error Handling & Resilience
- Implement retry logic with exponential backoff
- Handle platform-specific errors gracefully
- Validate content before posting
- Monitor posting status and failures

### 6. Security
- Never expose access tokens in client code
- Implement token refresh before expiration
- Use secure storage for refresh tokens
- Implement rate limiting on client side

---

## Data Centers

| Data Center | Base URL |
|-------------|----------|
| US | https://social.zoho.com |
| EU | https://social.zoho.eu |
| IN | https://social.zoho.in |
| AU | https://social.zoho.com.au |
| JP | https://social.zoho.jp |

---

## Additional Resources

- [Official Zoho Social API Documentation](https://www.zoho.com/social/api/)
- [Social Media Best Practices](https://www.zoho.com/social/resources/)
- [API Postman Collection](https://www.postman.com/zoho)
- [Developer Community](https://help.zoho.com/portal/en/community/social)
- [Platform API Status](https://status.zoho.com)

---

**Last Updated**: December 2025
**API Version**: v2
