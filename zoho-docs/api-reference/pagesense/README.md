# Zoho PageSense API Reference

## Overview

Zoho PageSense is a comprehensive conversion optimization and website analytics platform. The API provides programmatic access to heatmaps, session recordings, A/B tests, funnel analytics, form analytics, polls, and conversion tracking.

**Current API Version**: v2
**Base URL**: `https://pagesense.zoho.com/api/v2/`
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

### 1. Websites
**Purpose**: Manage tracked websites and domains

**Endpoints**:
```http
GET    /websites                    # List all websites
GET    /websites/{website_id}       # Get website details
POST   /websites                    # Add website
PUT    /websites/{website_id}       # Update website
DELETE /websites/{website_id}       # Remove website
GET    /websites/{website_id}/stats # Get website statistics
```

**Example - Add Website**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const addWebsite = async (accessToken) => {
  const response = await axios.post(
    'https://pagesense.zoho.com/api/v2/websites',
    {
      name: 'Company Website',
      url: 'https://www.company.com',
      industry: 'Technology',
      timezone: 'America/New_York',
      currency: 'USD',
      settings: {
        track_subdomains: true,
        exclude_ips: ['192.168.1.1'],
        gdpr_compliance: true,
        cookie_consent: true
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

def add_website(access_token):
    url = 'https://pagesense.zoho.com/api/v2/websites'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'name': 'Company Website',
        'url': 'https://www.company.com',
        'industry': 'Technology',
        'timezone': 'America/New_York',
        'currency': 'USD',
        'settings': {
            'track_subdomains': True,
            'exclude_ips': ['192.168.1.1'],
            'gdpr_compliance': True,
            'cookie_consent': True
        }
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

```deluge
// Deluge
website_data = {
    "name": "Company Website",
    "url": "https://www.company.com",
    "industry": "Technology",
    "timezone": "America/New_York",
    "currency": "USD",
    "settings": {
        "track_subdomains": true,
        "exclude_ips": ["192.168.1.1"],
        "gdpr_compliance": true,
        "cookie_consent": true
    }
};

response = invokeurl
[
    url: "https://pagesense.zoho.com/api/v2/websites"
    type: POST
    parameters: website_data.toString()
    connection: "zoho_oauth"
];
info response;
```

**Response**:
```json
{
  "website": {
    "id": "123456000000234567",
    "name": "Company Website",
    "url": "https://www.company.com",
    "industry": "Technology",
    "timezone": "America/New_York",
    "currency": "USD",
    "tracking_code": "<script src=\"https://cdn.pagesense.io/js/companyname/abc123xyz.js\"></script>",
    "status": "active",
    "created_time": "2025-01-15T10:00:00Z"
  }
}
```

---

### 2. Heatmaps
**Purpose**: Create and analyze heatmaps (click, scroll, attention)

**Endpoints**:
```http
GET    /websites/{website_id}/heatmaps              # List heatmaps
GET    /websites/{website_id}/heatmaps/{heatmap_id} # Get heatmap data
POST   /websites/{website_id}/heatmaps              # Create heatmap
PUT    /websites/{website_id}/heatmaps/{heatmap_id} # Update heatmap
DELETE /websites/{website_id}/heatmaps/{heatmap_id} # Delete heatmap
GET    /websites/{website_id}/heatmaps/{heatmap_id}/data # Get heatmap data points
```

**Heatmap Types**:
- Click Heatmap - Track where users click
- Scroll Heatmap - Track scroll depth
- Attention Heatmap - Track where users spend time
- Move Heatmap - Track mouse movements

**Example - Create Heatmap**:
```javascript
// JavaScript/Node.js
const createHeatmap = async (accessToken, websiteId) => {
  const response = await axios.post(
    `https://pagesense.zoho.com/api/v2/websites/${websiteId}/heatmaps`,
    {
      name: 'Homepage Click Heatmap',
      type: 'click',
      url_match: {
        type: 'exact',
        value: 'https://www.company.com/'
      },
      device_types: ['desktop', 'mobile', 'tablet'],
      date_range: {
        from: '2025-01-01',
        to: '2025-01-31'
      },
      filters: {
        countries: ['US', 'UK', 'CA'],
        traffic_source: ['organic', 'direct', 'referral']
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
def create_heatmap(access_token, website_id):
    url = f'https://pagesense.zoho.com/api/v2/websites/{website_id}/heatmaps'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'name': 'Homepage Click Heatmap',
        'type': 'click',
        'url_match': {
            'type': 'exact',
            'value': 'https://www.company.com/'
        },
        'device_types': ['desktop', 'mobile', 'tablet'],
        'date_range': {
            'from': '2025-01-01',
            'to': '2025-01-31'
        },
        'filters': {
            'countries': ['US', 'UK', 'CA'],
            'traffic_source': ['organic', 'direct', 'referral']
        }
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

**Response**:
```json
{
  "heatmap": {
    "id": "123456000000345678",
    "name": "Homepage Click Heatmap",
    "type": "click",
    "url": "https://www.company.com/",
    "status": "active",
    "total_clicks": 15420,
    "unique_visitors": 3254,
    "data_points": 15420,
    "created_time": "2025-01-15T10:00:00Z",
    "last_updated": "2025-01-15T15:30:00Z"
  }
}
```

**Example - Get Heatmap Data**:
```javascript
// JavaScript/Node.js
const getHeatmapData = async (accessToken, websiteId, heatmapId) => {
  const response = await axios.get(
    `https://pagesense.zoho.com/api/v2/websites/${websiteId}/heatmaps/${heatmapId}/data`,
    {
      params: {
        device: 'desktop',
        resolution: '1920x1080'
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

### 3. Session Recordings
**Purpose**: Record and analyze user sessions

**Endpoints**:
```http
GET    /websites/{website_id}/recordings              # List recordings
GET    /websites/{website_id}/recordings/{recording_id} # Get recording
POST   /websites/{website_id}/recordings/config       # Configure recording
GET    /websites/{website_id}/recordings/{recording_id}/events # Get session events
DELETE /websites/{website_id}/recordings/{recording_id} # Delete recording
GET    /websites/{website_id}/recordings/search       # Search recordings
```

**Recording Filters**:
- Duration (min/max seconds)
- Device type
- Country
- Traffic source
- Conversion status
- Error occurred
- Rage clicks
- Dead clicks

**Example - Get Recordings**:
```javascript
// JavaScript/Node.js
const getRecordings = async (accessToken, websiteId) => {
  const response = await axios.get(
    `https://pagesense.zoho.com/api/v2/websites/${websiteId}/recordings`,
    {
      params: {
        from_date: '2025-01-01',
        to_date: '2025-01-15',
        device: 'mobile',
        min_duration: 30,
        has_errors: true,
        limit: 50,
        offset: 0
      },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data.recordings;
};
```

```python
# Python
def get_recordings(access_token, website_id):
    url = f'https://pagesense.zoho.com/api/v2/websites/{website_id}/recordings'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'from_date': '2025-01-01',
        'to_date': '2025-01-15',
        'device': 'mobile',
        'min_duration': 30,
        'has_errors': True,
        'limit': 50,
        'offset': 0
    }
    response = requests.get(url, headers=headers, params=params)
    return response.json()['recordings']
```

**Recording Response**:
```json
{
  "recordings": [
    {
      "id": "123456000000456789",
      "visitor_id": "vis_abc123xyz",
      "session_duration": 245,
      "page_views": 5,
      "device": "mobile",
      "browser": "Chrome",
      "os": "iOS 17",
      "country": "United States",
      "city": "New York",
      "traffic_source": "organic",
      "converted": false,
      "errors": [
        {
          "type": "JavaScript Error",
          "message": "Cannot read property 'value' of null",
          "timestamp": 120
        }
      ],
      "rage_clicks": 2,
      "dead_clicks": 3,
      "recording_url": "https://pagesense.zoho.com/view/recording/abc123xyz",
      "timestamp": "2025-01-15T14:30:00Z"
    }
  ],
  "pagination": {
    "total": 1247,
    "limit": 50,
    "offset": 0
  }
}
```

---

### 4. A/B Tests
**Purpose**: Create and manage A/B tests and experiments

**Endpoints**:
```http
GET    /websites/{website_id}/tests              # List A/B tests
GET    /websites/{website_id}/tests/{test_id}    # Get test details
POST   /websites/{website_id}/tests              # Create A/B test
PUT    /websites/{website_id}/tests/{test_id}    # Update test
DELETE /websites/{website_id}/tests/{test_id}    # Delete test
POST   /websites/{website_id}/tests/{test_id}/start # Start test
POST   /websites/{website_id}/tests/{test_id}/stop  # Stop test
GET    /websites/{website_id}/tests/{test_id}/results # Get test results
```

**Test Types**:
- A/B Test (2 variations)
- Multivariate Test (multiple variations)
- Split URL Test (different URLs)
- Redirect Test

**Example - Create A/B Test**:
```javascript
// JavaScript/Node.js
const createABTest = async (accessToken, websiteId) => {
  const response = await axios.post(
    `https://pagesense.zoho.com/api/v2/websites/${websiteId}/tests`,
    {
      name: 'Homepage CTA Button Test',
      description: 'Testing different CTA button colors and text',
      type: 'ab_test',
      url_targeting: {
        type: 'exact',
        url: 'https://www.company.com/'
      },
      audience: {
        traffic_allocation: 50, // percentage
        device_types: ['desktop', 'mobile'],
        countries: ['US', 'UK', 'CA']
      },
      variations: [
        {
          name: 'Original',
          type: 'original',
          traffic_split: 50
        },
        {
          name: 'Variation A - Green Button',
          type: 'variation',
          traffic_split: 50,
          changes: [
            {
              selector: '#cta-button',
              attribute: 'background-color',
              value: '#28a745'
            },
            {
              selector: '#cta-button',
              attribute: 'innerText',
              value: 'Start Free Trial'
            }
          ]
        }
      ],
      goal: {
        type: 'click',
        selector: '#cta-button',
        name: 'CTA Button Clicks'
      },
      secondary_goals: [
        {
          type: 'page_visit',
          url: 'https://www.company.com/signup',
          name: 'Signup Page Visit'
        }
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

```python
# Python
def create_ab_test(access_token, website_id):
    url = f'https://pagesense.zoho.com/api/v2/websites/{website_id}/tests'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'name': 'Homepage CTA Button Test',
        'description': 'Testing different CTA button colors and text',
        'type': 'ab_test',
        'url_targeting': {
            'type': 'exact',
            'url': 'https://www.company.com/'
        },
        'audience': {
            'traffic_allocation': 50,
            'device_types': ['desktop', 'mobile'],
            'countries': ['US', 'UK', 'CA']
        },
        'variations': [
            {
                'name': 'Original',
                'type': 'original',
                'traffic_split': 50
            },
            {
                'name': 'Variation A - Green Button',
                'type': 'variation',
                'traffic_split': 50,
                'changes': [
                    {
                        'selector': '#cta-button',
                        'attribute': 'background-color',
                        'value': '#28a745'
                    },
                    {
                        'selector': '#cta-button',
                        'attribute': 'innerText',
                        'value': 'Start Free Trial'
                    }
                ]
            }
        ],
        'goal': {
            'type': 'click',
            'selector': '#cta-button',
            'name': 'CTA Button Clicks'
        }
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

**Response**:
```json
{
  "test": {
    "id": "123456000000567890",
    "name": "Homepage CTA Button Test",
    "type": "ab_test",
    "status": "draft",
    "variations": [
      {
        "id": "var_original",
        "name": "Original",
        "traffic_split": 50
      },
      {
        "id": "var_001",
        "name": "Variation A - Green Button",
        "traffic_split": 50
      }
    ],
    "created_time": "2025-01-15T10:00:00Z",
    "url": "https://www.company.com/"
  }
}
```

**Example - Get Test Results**:
```javascript
// JavaScript/Node.js
const getTestResults = async (accessToken, websiteId, testId) => {
  const response = await axios.get(
    `https://pagesense.zoho.com/api/v2/websites/${websiteId}/tests/${testId}/results`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

**Test Results Response**:
```json
{
  "results": {
    "test_id": "123456000000567890",
    "status": "running",
    "duration_days": 14,
    "total_visitors": 5420,
    "confidence_level": 95.8,
    "winning_variation": "var_001",
    "variations": [
      {
        "id": "var_original",
        "name": "Original",
        "visitors": 2710,
        "conversions": 189,
        "conversion_rate": 6.97,
        "improvement": 0
      },
      {
        "id": "var_001",
        "name": "Variation A - Green Button",
        "visitors": 2710,
        "conversions": 243,
        "conversion_rate": 8.97,
        "improvement": 28.7,
        "statistical_significance": 95.8
      }
    ]
  }
}
```

---

### 5. Funnels
**Purpose**: Track and analyze conversion funnels

**Endpoints**:
```http
GET    /websites/{website_id}/funnels              # List funnels
GET    /websites/{website_id}/funnels/{funnel_id}  # Get funnel details
POST   /websites/{website_id}/funnels              # Create funnel
PUT    /websites/{website_id}/funnels/{funnel_id}  # Update funnel
DELETE /websites/{website_id}/funnels/{funnel_id}  # Delete funnel
GET    /websites/{website_id}/funnels/{funnel_id}/data # Get funnel data
```

**Example - Create Funnel**:
```javascript
// JavaScript/Node.js
const createFunnel = async (accessToken, websiteId) => {
  const response = await axios.post(
    `https://pagesense.zoho.com/api/v2/websites/${websiteId}/funnels`,
    {
      name: 'Purchase Funnel',
      description: 'Track user journey from homepage to purchase',
      steps: [
        {
          name: 'Homepage',
          type: 'page_visit',
          url: 'https://www.company.com/'
        },
        {
          name: 'Product Page',
          type: 'page_visit',
          url: 'https://www.company.com/products/*'
        },
        {
          name: 'Add to Cart',
          type: 'event',
          event_name: 'add_to_cart'
        },
        {
          name: 'Checkout',
          type: 'page_visit',
          url: 'https://www.company.com/checkout'
        },
        {
          name: 'Purchase Complete',
          type: 'event',
          event_name: 'purchase_complete'
        }
      ],
      date_range: {
        from: '2025-01-01',
        to: '2025-01-31'
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
def create_funnel(access_token, website_id):
    url = f'https://pagesense.zoho.com/api/v2/websites/{website_id}/funnels'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'name': 'Purchase Funnel',
        'description': 'Track user journey from homepage to purchase',
        'steps': [
            {
                'name': 'Homepage',
                'type': 'page_visit',
                'url': 'https://www.company.com/'
            },
            {
                'name': 'Product Page',
                'type': 'page_visit',
                'url': 'https://www.company.com/products/*'
            },
            {
                'name': 'Add to Cart',
                'type': 'event',
                'event_name': 'add_to_cart'
            },
            {
                'name': 'Checkout',
                'type': 'page_visit',
                'url': 'https://www.company.com/checkout'
            },
            {
                'name': 'Purchase Complete',
                'type': 'event',
                'event_name': 'purchase_complete'
            }
        ],
        'date_range': {
            'from': '2025-01-01',
            'to': '2025-01-31'
        }
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

**Funnel Data Response**:
```json
{
  "funnel": {
    "id": "123456000000678901",
    "name": "Purchase Funnel",
    "total_visitors": 10500,
    "completed_visitors": 735,
    "completion_rate": 7.0,
    "average_time": 1847,
    "steps": [
      {
        "step": 1,
        "name": "Homepage",
        "visitors": 10500,
        "drop_off": 0,
        "conversion_rate": 100,
        "average_time": 45
      },
      {
        "step": 2,
        "name": "Product Page",
        "visitors": 6825,
        "drop_off": 3675,
        "conversion_rate": 65.0,
        "average_time": 125
      },
      {
        "step": 3,
        "name": "Add to Cart",
        "visitors": 2940,
        "drop_off": 3885,
        "conversion_rate": 28.0,
        "average_time": 30
      },
      {
        "step": 4,
        "name": "Checkout",
        "visitors": 1470,
        "drop_off": 1470,
        "conversion_rate": 14.0,
        "average_time": 180
      },
      {
        "step": 5,
        "name": "Purchase Complete",
        "visitors": 735,
        "drop_off": 735,
        "conversion_rate": 7.0,
        "average_time": 120
      }
    ]
  }
}
```

---

### 6. Form Analytics
**Purpose**: Analyze form performance and abandonment

**Endpoints**:
```http
GET    /websites/{website_id}/forms              # List tracked forms
GET    /websites/{website_id}/forms/{form_id}    # Get form details
POST   /websites/{website_id}/forms              # Track new form
GET    /websites/{website_id}/forms/{form_id}/analytics # Get form analytics
GET    /websites/{website_id}/forms/{form_id}/field-analytics # Get field analytics
```

**Example - Get Form Analytics**:
```javascript
// JavaScript/Node.js
const getFormAnalytics = async (accessToken, websiteId, formId) => {
  const response = await axios.get(
    `https://pagesense.zoho.com/api/v2/websites/${websiteId}/forms/${formId}/analytics`,
    {
      params: {
        from_date: '2025-01-01',
        to_date: '2025-01-31'
      },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

**Form Analytics Response**:
```json
{
  "analytics": {
    "form_id": "form_signup",
    "form_name": "Signup Form",
    "views": 5420,
    "interactions": 3254,
    "submissions": 1847,
    "abandonment_rate": 43.2,
    "average_completion_time": 145,
    "conversion_rate": 34.1,
    "field_analytics": [
      {
        "field_name": "email",
        "interactions": 3254,
        "corrections": 542,
        "blank_submissions": 127,
        "average_time": 8.5
      },
      {
        "field_name": "password",
        "interactions": 2987,
        "corrections": 892,
        "blank_submissions": 234,
        "average_time": 12.3
      },
      {
        "field_name": "name",
        "interactions": 2745,
        "corrections": 245,
        "blank_submissions": 89,
        "average_time": 6.7
      }
    ],
    "drop_off_points": [
      {
        "field": "password",
        "drop_offs": 456,
        "drop_off_rate": 15.3
      },
      {
        "field": "phone",
        "drop_offs": 234,
        "drop_off_rate": 8.5
      }
    ]
  }
}
```

---

### 7. Polls
**Purpose**: Create and manage on-site polls

**Endpoints**:
```http
GET    /websites/{website_id}/polls              # List polls
GET    /websites/{website_id}/polls/{poll_id}    # Get poll details
POST   /websites/{website_id}/polls              # Create poll
PUT    /websites/{website_id}/polls/{poll_id}    # Update poll
DELETE /websites/{website_id}/polls/{poll_id}    # Delete poll
GET    /websites/{website_id}/polls/{poll_id}/responses # Get poll responses
```

**Poll Types**:
- Single Choice
- Multiple Choice
- Rating Scale
- Text Input
- NPS (Net Promoter Score)

**Example - Create Poll**:
```javascript
// JavaScript/Node.js
const createPoll = async (accessToken, websiteId) => {
  const response = await axios.post(
    `https://pagesense.zoho.com/api/v2/websites/${websiteId}/polls`,
    {
      name: 'Customer Satisfaction Poll',
      type: 'nps',
      question: 'How likely are you to recommend our product to a friend or colleague?',
      display: {
        position: 'bottom-right',
        delay: 5000, // milliseconds
        frequency: 'once_per_visitor'
      },
      targeting: {
        pages: ['https://www.company.com/dashboard'],
        devices: ['desktop', 'mobile'],
        visitor_type: 'returning'
      },
      schedule: {
        start_date: '2025-01-15',
        end_date: '2025-02-15'
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
def create_poll(access_token, website_id):
    url = f'https://pagesense.zoho.com/api/v2/websites/{website_id}/polls'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'name': 'Customer Satisfaction Poll',
        'type': 'nps',
        'question': 'How likely are you to recommend our product to a friend or colleague?',
        'display': {
            'position': 'bottom-right',
            'delay': 5000,
            'frequency': 'once_per_visitor'
        },
        'targeting': {
            'pages': ['https://www.company.com/dashboard'],
            'devices': ['desktop', 'mobile'],
            'visitor_type': 'returning'
        },
        'schedule': {
            'start_date': '2025-01-15',
            'end_date': '2025-02-15'
        }
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

---

### 8. Goals & Conversions
**Purpose**: Track custom goals and conversion events

**Endpoints**:
```http
GET    /websites/{website_id}/goals              # List goals
GET    /websites/{website_id}/goals/{goal_id}    # Get goal details
POST   /websites/{website_id}/goals              # Create goal
PUT    /websites/{website_id}/goals/{goal_id}    # Update goal
DELETE /websites/{website_id}/goals/{goal_id}    # Delete goal
GET    /websites/{website_id}/goals/{goal_id}/conversions # Get conversions
POST   /websites/{website_id}/goals/{goal_id}/track # Track conversion (server-side)
```

**Goal Types**:
- Page Visit
- Element Click
- Form Submission
- Custom Event
- Revenue

**Example - Create Goal**:
```javascript
// JavaScript/Node.js
const createGoal = async (accessToken, websiteId) => {
  const response = await axios.post(
    `https://pagesense.zoho.com/api/v2/websites/${websiteId}/goals`,
    {
      name: 'Newsletter Signup',
      type: 'form_submission',
      form_selector: '#newsletter-form',
      value: 5.00, // monetary value
      funnel_enabled: true
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

**Example - Track Conversion (Server-Side)**:
```javascript
// JavaScript/Node.js - Track server-side conversion
const trackConversion = async (accessToken, websiteId, goalId) => {
  const response = await axios.post(
    `https://pagesense.zoho.com/api/v2/websites/${websiteId}/goals/${goalId}/track`,
    {
      visitor_id: 'vis_abc123xyz', // From PageSense cookie
      value: 99.99,
      metadata: {
        product_id: 'PROD-123',
        category: 'Electronics'
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

### 9. Reports
**Purpose**: Generate and download custom reports

**Endpoints**:
```http
GET /websites/{website_id}/reports/overview      # Overview report
GET /websites/{website_id}/reports/traffic       # Traffic report
GET /websites/{website_id}/reports/conversions   # Conversions report
GET /websites/{website_id}/reports/behavior      # Behavior report
GET /websites/{website_id}/reports/custom        # Custom report
```

**Example - Get Traffic Report**:
```javascript
// JavaScript/Node.js
const getTrafficReport = async (accessToken, websiteId) => {
  const response = await axios.get(
    `https://pagesense.zoho.com/api/v2/websites/${websiteId}/reports/traffic`,
    {
      params: {
        from_date: '2025-01-01',
        to_date: '2025-01-31',
        metrics: ['visitors', 'page_views', 'bounce_rate', 'avg_session_duration'],
        dimensions: ['date', 'country', 'device', 'source'],
        format: 'json'
      },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

**Traffic Report Response**:
```json
{
  "report": {
    "period": {
      "from": "2025-01-01",
      "to": "2025-01-31"
    },
    "totals": {
      "visitors": 54200,
      "page_views": 187400,
      "bounce_rate": 42.5,
      "avg_session_duration": 185
    },
    "by_date": [
      {
        "date": "2025-01-15",
        "visitors": 1847,
        "page_views": 6420,
        "bounce_rate": 41.2,
        "avg_session_duration": 192
      }
    ],
    "by_country": [
      {
        "country": "United States",
        "visitors": 32520,
        "percentage": 60.0
      },
      {
        "country": "United Kingdom",
        "visitors": 8130,
        "percentage": 15.0
      }
    ],
    "by_device": [
      {
        "device": "Desktop",
        "visitors": 27100,
        "percentage": 50.0
      },
      {
        "device": "Mobile",
        "visitors": 21680,
        "percentage": 40.0
      },
      {
        "device": "Tablet",
        "visitors": 5420,
        "percentage": 10.0
      }
    ]
  }
}
```

---

### 10. Webhooks
**Purpose**: Receive real-time notifications for events

**Endpoints**:
```http
GET    /webhooks                     # List webhooks
POST   /webhooks                     # Create webhook
PUT    /webhooks/{webhook_id}        # Update webhook
DELETE /webhooks/{webhook_id}        # Delete webhook
POST   /webhooks/{webhook_id}/test   # Test webhook
```

**Webhook Events**:
- `goal.conversion` - Goal conversion occurred
- `test.started` - A/B test started
- `test.completed` - A/B test completed
- `form.submitted` - Form submitted
- `poll.responded` - Poll response received
- `recording.error` - Error detected in recording

**Example - Create Webhook**:
```javascript
// JavaScript/Node.js
const createWebhook = async (accessToken) => {
  const response = await axios.post(
    'https://pagesense.zoho.com/api/v2/webhooks',
    {
      url: 'https://api.yourcompany.com/webhooks/pagesense',
      events: [
        'goal.conversion',
        'test.completed',
        'form.submitted'
      ],
      website_id: '123456000000234567',
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
  scope=ZohoPageSense.websites.ALL,ZohoPageSense.analytics.READ&
  client_id={client_id}&
  response_type=code&
  access_type=offline&
  redirect_uri={redirect_uri}
```

**Available Scopes**:
- `ZohoPageSense.websites.ALL` - Full access to websites
- `ZohoPageSense.heatmaps.ALL` - Full access to heatmaps
- `ZohoPageSense.recordings.ALL` - Full access to recordings
- `ZohoPageSense.tests.ALL` - Full access to A/B tests
- `ZohoPageSense.funnels.ALL` - Full access to funnels
- `ZohoPageSense.forms.ALL` - Full access to form analytics
- `ZohoPageSense.polls.ALL` - Full access to polls
- `ZohoPageSense.goals.ALL` - Full access to goals
- `ZohoPageSense.analytics.READ` - Read analytics data

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

**Token Lifetime**:
- Access Token: 1 hour
- Refresh Token: Does not expire (store securely)

---

## Rate Limits

### API Call Limits

| Plan | API Calls per Day | API Calls per Minute |
|------|-------------------|----------------------|
| Free | 5,000 | 100 |
| Starter | 25,000 | 200 |
| Professional | 100,000 | 500 |
| Enterprise | 500,000 | 1000 |

### Rate Limit Headers

```http
X-RateLimit-Limit: 500
X-RateLimit-Remaining: 387
X-RateLimit-Reset: 1673827200
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

### PageSense Error Codes

| Code | Message | Description | Solution |
|------|---------|-------------|----------|
| 10001 | Invalid Website | Website ID is invalid | Verify website ID |
| 10002 | Test Running | Cannot modify running test | Stop test first |
| 10003 | Insufficient Data | Not enough data for results | Wait for more data |
| 10004 | URL Not Tracked | URL is not being tracked | Add tracking code |
| 10005 | Goal Not Found | Goal doesn't exist | Verify goal ID |
| 10006 | Invalid Selector | CSS selector is invalid | Check selector syntax |

---

## Best Practices

### 1. Use Segments for Better Insights

```javascript
const getSegmentedData = async (accessToken, websiteId) => {
  const response = await axios.get(
    `https://pagesense.zoho.com/api/v2/websites/${websiteId}/reports/traffic`,
    {
      params: {
        segment: {
          device: 'mobile',
          country: 'US',
          returning_visitor: true
        }
      },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

### 2. Test Statistical Significance

```javascript
const checkTestSignificance = (testResults) => {
  const winningVariation = testResults.variations.find(
    v => v.id === testResults.winning_variation
  );

  if (winningVariation.statistical_significance < 95) {
    console.warn('Test results not statistically significant. Continue test.');
    return false;
  }

  return true;
};
```

---

## Additional Resources

- [Official Zoho PageSense API Documentation](https://www.zoho.com/pagesense/api/)
- [API Console](https://api-console.zoho.com/)
- [Zoho PageSense Help](https://www.zoho.com/pagesense/help/)
- [CRO Best Practices](https://www.zoho.com/pagesense/cro-guide/)
- [Developer Forums](https://help.zoho.com/portal/en/community/pagesense)

---

**Last Updated**: December 2025
**API Version**: v2
