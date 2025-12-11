# Zoho Campaigns API Reference

## Overview

Zoho Campaigns is a comprehensive email marketing platform that enables businesses to create, send, and track email campaigns, manage mailing lists, and analyze campaign performance. The API provides full programmatic access to campaign management, contact lists, email templates, and analytics.

**Current API Version**: v1.1
**Base URL**: `https://campaigns.zoho.com/api/v1.1/`
**Protocol**: REST
**Data Format**: JSON/XML
**Authentication**: OAuth 2.0

---

## Quick Links

- [Authentication](#authentication)
- [Mailing Lists API](#mailing-lists-api)
- [Contacts API](#contacts-api)
- [Email Campaigns API](#email-campaigns-api)
- [Templates API](#templates-api)
- [Campaign Analytics](#campaign-analytics)
- [Scheduling Campaigns](#scheduling-campaigns)
- [Webhooks](#webhooks)
- [Rate Limits](#rate-limits)
- [Error Codes](#error-codes)
- [Code Examples](#code-examples)
- [Best Practices](#best-practices)

---

## REST API Principles

### HTTP Methods

Zoho Campaigns API follows standard REST conventions:

| Method | Purpose | Idempotent |
|--------|---------|------------|
| GET | Retrieve resources | Yes |
| POST | Create new resources | No |
| PUT | Update/replace resources | Yes |
| PATCH | Partial update | No |
| DELETE | Remove resources | Yes |

### Request Format

```http
GET /api/v1.1/getmailinglists
Host: campaigns.zoho.com
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json
```

### Response Format

All API responses follow a consistent structure:

**Success Response (JSON)**:
```json
{
  "status": "success",
  "message": "List retrieved successfully",
  "data": {
    "listkey": "abc123xyz",
    "listname": "Newsletter Subscribers",
    "count": 1500
  }
}
```

**Error Response**:
```json
{
  "status": "error",
  "code": "4001",
  "message": "Invalid list key provided"
}
```

---

## Authentication

### OAuth 2.0 Flow

Zoho Campaigns uses OAuth 2.0 for authentication. All API requests require a valid access token.

**Step 1: Register Your Application**
- Go to [Zoho API Console](https://api-console.zoho.com/)
- Create a new Client (Server-based or Self-client)
- Note your Client ID and Client Secret
- Set the authorized redirect URI

**Step 2: Generate Authorization Code**

```http
GET https://accounts.zoho.com/oauth/v2/auth?
  scope=ZohoCampaigns.contact.ALL,ZohoCampaigns.campaign.ALL&
  client_id={client_id}&
  response_type=code&
  access_type=offline&
  redirect_uri={redirect_uri}
```

**Available Scopes**:
- `ZohoCampaigns.contact.ALL` - Full access to contacts
- `ZohoCampaigns.contact.READ` - Read-only contact access
- `ZohoCampaigns.contact.CREATE` - Create contacts
- `ZohoCampaigns.contact.UPDATE` - Update contacts
- `ZohoCampaigns.contact.DELETE` - Delete contacts
- `ZohoCampaigns.campaign.ALL` - Full campaign access
- `ZohoCampaigns.campaign.READ` - Read campaigns
- `ZohoCampaigns.campaign.CREATE` - Create campaigns
- `ZohoCampaigns.campaign.UPDATE` - Update campaigns
- `ZohoCampaigns.list.ALL` - Full mailing list access
- `ZohoCampaigns.template.ALL` - Full template access
- `ZohoCampaigns.analytics.READ` - Access to analytics

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

## Rate Limits

### API Call Limits

Zoho Campaigns enforces strict rate limits to ensure platform stability:

**Standard Rate Limits**:
- **500 API calls per 5 minutes** (per organization)
- **30 minute cooldown period** after exceeding limit
- Limit applies across all API endpoints

**Best Practices**:
- Implement exponential backoff
- Cache frequently accessed data
- Batch operations when possible
- Monitor rate limit headers

### Rate Limit Headers

Every API response includes rate limit information:

```http
X-RateLimit-Limit: 500
X-RateLimit-Remaining: 432
X-RateLimit-Reset: 1702396800
X-RateLimit-Cooldown: 1800
```

- `X-RateLimit-Limit` - Total requests allowed in 5-minute window
- `X-RateLimit-Remaining` - Requests remaining in current window
- `X-RateLimit-Reset` - Timestamp when rate limit resets (Unix epoch)
- `X-RateLimit-Cooldown` - Cooldown period in seconds (1800 = 30 minutes)

### Handle Rate Limiting

```javascript
// JavaScript/Node.js
const axios = require('axios');

const makeAPICallWithRetry = async (apiCall, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await apiCall();
      return response;
    } catch (error) {
      if (error.response?.status === 429) {
        const resetTime = error.response.headers['x-ratelimit-reset'];
        const cooldown = error.response.headers['x-ratelimit-cooldown'];
        const waitTime = cooldown ? parseInt(cooldown) * 1000 : 60000;

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
# Python
import requests
import time

def make_api_call_with_retry(api_call, max_retries=3):
    for i in range(max_retries):
        try:
            return api_call()
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 429:
                cooldown = int(e.response.headers.get('X-RateLimit-Cooldown', 60))
                print(f"Rate limit exceeded. Waiting {cooldown}s...")
                time.sleep(cooldown)
                continue
            raise
    raise Exception('Max retries exceeded')
```

---

## Mailing Lists API

Mailing lists are containers for organizing contacts into groups for targeted campaigns.

### Mailing List Object Structure

```json
{
  "listkey": "abc123xyz",
  "listname": "Newsletter Subscribers",
  "listguid": "550e8400-e29b-41d4-a716-446655440000",
  "count": 1500,
  "bounce_count": 25,
  "unsubscribe_count": 10,
  "status": "Active",
  "createdtime": "2025-01-15 10:30:00",
  "modifiedtime": "2025-12-12 14:25:00"
}
```

### Get All Mailing Lists

```http
GET /api/v1.1/getmailinglists?resfmt=JSON
Authorization: Zoho-oauthtoken {access_token}
```

**Query Parameters**:
- `resfmt` (string) - Response format: `JSON` or `XML` (default: XML)
- `fromindex` (integer) - Starting index for pagination (default: 0)
- `range` (integer) - Number of records to return (max: 200, default: 20)

**Example Request**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const getMailingLists = async (accessToken) => {
  const response = await axios.get(
    'https://campaigns.zoho.com/api/v1.1/getmailinglists',
    {
      params: {
        resfmt: 'JSON',
        range: 100
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

def get_mailing_lists(access_token):
    url = 'https://campaigns.zoho.com/api/v1.1/getmailinglists'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'resfmt': 'JSON',
        'range': 100
    }
    response = requests.get(url, headers=headers, params=params)
    return response.json()
```

```deluge
// Deluge
params_map = Map();
params_map.put("resfmt", "JSON");
params_map.put("range", 100);

response = zoho.campaigns.getRecords("mailinglists", params_map);
info response;
```

**Response**:
```json
{
  "status": "success",
  "list_of_details": [
    {
      "listkey": "abc123xyz",
      "listname": "Newsletter Subscribers",
      "count": 1500,
      "status": "Active"
    },
    {
      "listkey": "def456uvw",
      "listname": "Product Updates",
      "count": 850,
      "status": "Active"
    }
  ]
}
```

### Create Mailing List

```http
POST /api/v1.1/createmailinglist?resfmt=JSON
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "listname": "VIP Customers"
}
```

**Example**:
```javascript
const createMailingList = async (accessToken, listName) => {
  const response = await axios.post(
    'https://campaigns.zoho.com/api/v1.1/createmailinglist',
    {
      listname: listName
    },
    {
      params: { resfmt: 'JSON' },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

// Usage
const newList = await createMailingList(accessToken, 'VIP Customers');
console.log('List created with key:', newList.listkey);
```

```python
def create_mailing_list(access_token, list_name):
    url = 'https://campaigns.zoho.com/api/v1.1/createmailinglist'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    params = {'resfmt': 'JSON'}
    data = {'listname': list_name}
    response = requests.post(url, json=data, headers=headers, params=params)
    return response.json()

# Usage
new_list = create_mailing_list(access_token, 'VIP Customers')
print(f"List created with key: {new_list['listkey']}")
```

```deluge
// Deluge
list_map = Map();
list_map.put("listname", "VIP Customers");

response = zoho.campaigns.create("mailinglist", list_map);
info "List created with key: " + response.get("listkey");
```

**Response**:
```json
{
  "status": "success",
  "message": "Mailing list created successfully",
  "listkey": "xyz789abc"
}
```

### Update Mailing List

```http
POST /api/v1.1/updatemailinglist?resfmt=JSON
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "listkey": "abc123xyz",
  "listname": "Premium Newsletter Subscribers"
}
```

**Example**:
```javascript
const updateMailingList = async (accessToken, listKey, newName) => {
  const response = await axios.post(
    'https://campaigns.zoho.com/api/v1.1/updatemailinglist',
    {
      listkey: listKey,
      listname: newName
    },
    {
      params: { resfmt: 'JSON' },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};
```

### Delete Mailing List

```http
POST /api/v1.1/deletemailinglist?resfmt=JSON
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "listkey": "abc123xyz"
}
```

**Example**:
```javascript
const deleteMailingList = async (accessToken, listKey) => {
  const response = await axios.post(
    'https://campaigns.zoho.com/api/v1.1/deletemailinglist',
    { listkey: listKey },
    {
      params: { resfmt: 'JSON' },
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

## Contacts API

Manage individual contacts within mailing lists.

### Contact Object Structure

```json
{
  "contact_email": "john.doe@example.com",
  "contact_name": "John Doe",
  "firstname": "John",
  "lastname": "Doe",
  "contact_mobile": "+1-555-0123",
  "company": "Acme Corporation",
  "jobtitle": "Marketing Director",
  "city": "New York",
  "state": "NY",
  "country": "United States",
  "zipcode": "10001",
  "status": "Active",
  "source": "API",
  "createdtime": "2025-01-15 10:30:00",
  "modifiedtime": "2025-12-12 14:25:00"
}
```

### Get All Contacts in List

```http
GET /api/v1.1/{listkey}/contacts?resfmt=JSON
Authorization: Zoho-oauthtoken {access_token}
```

**Query Parameters**:
- `resfmt` (string) - Response format: `JSON` or `XML`
- `fromindex` (integer) - Starting index (default: 0)
- `range` (integer) - Number of records (max: 200, default: 20)
- `status` (string) - Filter by status: `Active`, `Unsubscribed`, `Bounced`

**Example**:
```javascript
const getContacts = async (accessToken, listKey) => {
  const response = await axios.get(
    `https://campaigns.zoho.com/api/v1.1/${listKey}/contacts`,
    {
      params: {
        resfmt: 'JSON',
        range: 100,
        status: 'Active'
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
def get_contacts(access_token, list_key):
    url = f'https://campaigns.zoho.com/api/v1.1/{list_key}/contacts'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'resfmt': 'JSON',
        'range': 100,
        'status': 'Active'
    }
    response = requests.get(url, headers=headers, params=params)
    return response.json()
```

```deluge
// Deluge
params_map = Map();
params_map.put("resfmt", "JSON");
params_map.put("range", 100);
params_map.put("status", "Active");

response = zoho.campaigns.getContacts(list_key, params_map);
info response;
```

### Add Contact to List

```http
POST /api/v1.1/{listkey}/contacts/add?resfmt=JSON
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "contactinfo": {
    "contact_email": "jane.smith@example.com",
    "contact_name": "Jane Smith",
    "firstname": "Jane",
    "lastname": "Smith",
    "contact_mobile": "+1-555-0124",
    "company": "TechCo Inc",
    "jobtitle": "CEO"
  }
}
```

**Example**:
```javascript
const addContact = async (accessToken, listKey, contactInfo) => {
  const response = await axios.post(
    `https://campaigns.zoho.com/api/v1.1/${listKey}/contacts/add`,
    {
      contactinfo: contactInfo
    },
    {
      params: { resfmt: 'JSON' },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

// Usage
const newContact = {
  contact_email: 'jane.smith@example.com',
  contact_name: 'Jane Smith',
  firstname: 'Jane',
  lastname: 'Smith',
  contact_mobile: '+1-555-0124',
  company: 'TechCo Inc',
  jobtitle: 'CEO'
};

const result = await addContact(accessToken, listKey, newContact);
```

```python
def add_contact(access_token, list_key, contact_info):
    url = f'https://campaigns.zoho.com/api/v1.1/{list_key}/contacts/add'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    params = {'resfmt': 'JSON'}
    data = {'contactinfo': contact_info}
    response = requests.post(url, json=data, headers=headers, params=params)
    return response.json()

# Usage
new_contact = {
    'contact_email': 'jane.smith@example.com',
    'contact_name': 'Jane Smith',
    'firstname': 'Jane',
    'lastname': 'Smith',
    'company': 'TechCo Inc'
}

result = add_contact(access_token, list_key, new_contact)
```

```deluge
// Deluge
contact_map = Map();
contact_map.put("contact_email", "jane.smith@example.com");
contact_map.put("contact_name", "Jane Smith");
contact_map.put("firstname", "Jane");
contact_map.put("lastname", "Smith");
contact_map.put("company", "TechCo Inc");

contactinfo_map = Map();
contactinfo_map.put("contactinfo", contact_map);

response = zoho.campaigns.addContact(list_key, contactinfo_map);
info response;
```

**Response**:
```json
{
  "status": "success",
  "message": "Contact added successfully",
  "code": "201"
}
```

### Update Contact

```http
POST /api/v1.1/{listkey}/contacts/update?resfmt=JSON
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "contactinfo": {
    "contact_email": "jane.smith@example.com",
    "jobtitle": "Chief Executive Officer",
    "contact_mobile": "+1-555-9999"
  }
}
```

**Example**:
```javascript
const updateContact = async (accessToken, listKey, email, updates) => {
  const response = await axios.post(
    `https://campaigns.zoho.com/api/v1.1/${listKey}/contacts/update`,
    {
      contactinfo: {
        contact_email: email,
        ...updates
      }
    },
    {
      params: { resfmt: 'JSON' },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

// Usage - Update job title
await updateContact(accessToken, listKey, 'jane.smith@example.com', {
  jobtitle: 'Chief Executive Officer'
});
```

### Remove Contact from List

```http
POST /api/v1.1/{listkey}/contacts/remove?resfmt=JSON
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "contactinfo": {
    "contact_email": "jane.smith@example.com"
  }
}
```

**Example**:
```javascript
const removeContact = async (accessToken, listKey, email) => {
  const response = await axios.post(
    `https://campaigns.zoho.com/api/v1.1/${listKey}/contacts/remove`,
    {
      contactinfo: {
        contact_email: email
      }
    },
    {
      params: { resfmt: 'JSON' },
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
def remove_contact(access_token, list_key, email):
    url = f'https://campaigns.zoho.com/api/v1.1/{list_key}/contacts/remove'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    params = {'resfmt': 'JSON'}
    data = {
        'contactinfo': {
            'contact_email': email
        }
    }
    response = requests.post(url, json=data, headers=headers, params=params)
    return response.json()
```

### Bulk Add Contacts

```http
POST /api/v1.1/{listkey}/contacts/json?resfmt=JSON
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "contact_list": [
    {
      "contact_email": "user1@example.com",
      "contact_name": "User One",
      "firstname": "User",
      "lastname": "One"
    },
    {
      "contact_email": "user2@example.com",
      "contact_name": "User Two",
      "firstname": "User",
      "lastname": "Two"
    }
  ]
}
```

**Example**:
```javascript
const bulkAddContacts = async (accessToken, listKey, contacts) => {
  const response = await axios.post(
    `https://campaigns.zoho.com/api/v1.1/${listKey}/contacts/json`,
    {
      contact_list: contacts
    },
    {
      params: { resfmt: 'JSON' },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

// Usage - Add multiple contacts at once
const contactsToAdd = [
  {
    contact_email: 'user1@example.com',
    contact_name: 'User One',
    firstname: 'User',
    lastname: 'One'
  },
  {
    contact_email: 'user2@example.com',
    contact_name: 'User Two',
    firstname: 'User',
    lastname: 'Two'
  }
];

await bulkAddContacts(accessToken, listKey, contactsToAdd);
```

---

## Email Campaigns API

Create, manage, and send email campaigns.

### Campaign Object Structure

```json
{
  "campaign_key": "xyz123abc",
  "campaign_name": "Holiday Sale 2025",
  "campaign_subject": "Get 50% Off - Holiday Special!",
  "from_email": "sales@example.com",
  "from_name": "Example Company",
  "reply_to": "support@example.com",
  "status": "Scheduled",
  "sent_date": "2025-12-20 09:00:00",
  "total_recipients": 1500,
  "sent_count": 1500,
  "open_count": 450,
  "click_count": 120,
  "bounce_count": 15,
  "unsubscribe_count": 5,
  "created_time": "2025-12-15 10:00:00"
}
```

### Get All Campaigns

```http
GET /api/v1.1/getcampaigns?resfmt=JSON
Authorization: Zoho-oauthtoken {access_token}
```

**Query Parameters**:
- `resfmt` (string) - Response format: `JSON` or `XML`
- `status` (string) - Filter by status: `Sent`, `Scheduled`, `Draft`
- `fromindex` (integer) - Starting index
- `range` (integer) - Number of records (max: 200)

**Example**:
```javascript
const getCampaigns = async (accessToken, status = null) => {
  const params = { resfmt: 'JSON' };
  if (status) params.status = status;

  const response = await axios.get(
    'https://campaigns.zoho.com/api/v1.1/getcampaigns',
    {
      params,
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};

// Get all sent campaigns
const sentCampaigns = await getCampaigns(accessToken, 'Sent');
```

```python
def get_campaigns(access_token, status=None):
    url = 'https://campaigns.zoho.com/api/v1.1/getcampaigns'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {'resfmt': 'JSON'}
    if status:
        params['status'] = status

    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Get all scheduled campaigns
scheduled_campaigns = get_campaigns(access_token, 'Scheduled')
```

```deluge
// Deluge
params_map = Map();
params_map.put("resfmt", "JSON");
params_map.put("status", "Sent");

response = zoho.campaigns.getRecords("campaigns", params_map);
info response;
```

**Response**:
```json
{
  "status": "success",
  "campaigns": [
    {
      "campaign_key": "xyz123abc",
      "campaign_name": "Holiday Sale 2025",
      "status": "Scheduled",
      "sent_date": "2025-12-20 09:00:00"
    }
  ]
}
```

### Create Email Campaign

```http
POST /api/v1.1/createcampaign?resfmt=JSON
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "campaign_name": "New Product Launch",
  "campaign_subject": "Introducing Our Latest Innovation",
  "from_email": "marketing@example.com",
  "from_name": "Example Company",
  "reply_to": "support@example.com",
  "mail_list": "abc123xyz",
  "html_content": "<html><body><h1>New Product Launch</h1><p>Check out our latest innovation!</p></body></html>"
}
```

**Example**:
```javascript
const createCampaign = async (accessToken, campaignData) => {
  const response = await axios.post(
    'https://campaigns.zoho.com/api/v1.1/createcampaign',
    campaignData,
    {
      params: { resfmt: 'JSON' },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

// Usage
const newCampaign = {
  campaign_name: 'New Product Launch',
  campaign_subject: 'Introducing Our Latest Innovation',
  from_email: 'marketing@example.com',
  from_name: 'Example Company',
  reply_to: 'support@example.com',
  mail_list: 'abc123xyz',
  html_content: '<html><body><h1>New Product Launch</h1><p>Check out our latest innovation!</p></body></html>'
};

const campaign = await createCampaign(accessToken, newCampaign);
console.log('Campaign created with key:', campaign.campaign_key);
```

```python
def create_campaign(access_token, campaign_data):
    url = 'https://campaigns.zoho.com/api/v1.1/createcampaign'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    params = {'resfmt': 'JSON'}
    response = requests.post(url, json=campaign_data, headers=headers, params=params)
    return response.json()

# Usage
new_campaign = {
    'campaign_name': 'New Product Launch',
    'campaign_subject': 'Introducing Our Latest Innovation',
    'from_email': 'marketing@example.com',
    'from_name': 'Example Company',
    'mail_list': 'abc123xyz',
    'html_content': '<html><body><h1>Check out our latest product!</h1></body></html>'
}

campaign = create_campaign(access_token, new_campaign)
print(f"Campaign created with key: {campaign['campaign_key']}")
```

```deluge
// Deluge
campaign_map = Map();
campaign_map.put("campaign_name", "New Product Launch");
campaign_map.put("campaign_subject", "Introducing Our Latest Innovation");
campaign_map.put("from_email", "marketing@example.com");
campaign_map.put("from_name", "Example Company");
campaign_map.put("reply_to", "support@example.com");
campaign_map.put("mail_list", "abc123xyz");
campaign_map.put("html_content", "<html><body><h1>New Product!</h1></body></html>");

response = zoho.campaigns.create("campaign", campaign_map);
info "Campaign created with key: " + response.get("campaign_key");
```

**Response**:
```json
{
  "status": "success",
  "message": "Campaign created successfully",
  "campaign_key": "xyz789def"
}
```

### Update Campaign

```http
POST /api/v1.1/updatecampaign?resfmt=JSON
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "campaign_key": "xyz123abc",
  "campaign_subject": "Updated Subject Line - Don't Miss Out!",
  "html_content": "<html><body><h1>Updated Content</h1></body></html>"
}
```

**Example**:
```javascript
const updateCampaign = async (accessToken, campaignKey, updates) => {
  const response = await axios.post(
    'https://campaigns.zoho.com/api/v1.1/updatecampaign',
    {
      campaign_key: campaignKey,
      ...updates
    },
    {
      params: { resfmt: 'JSON' },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

// Update campaign subject
await updateCampaign(accessToken, 'xyz123abc', {
  campaign_subject: 'Updated Subject Line - Don\'t Miss Out!'
});
```

### Send Campaign Immediately

```http
POST /api/v1.1/sendcampaign?resfmt=JSON
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "campaign_key": "xyz123abc"
}
```

**Example**:
```javascript
const sendCampaign = async (accessToken, campaignKey) => {
  const response = await axios.post(
    'https://campaigns.zoho.com/api/v1.1/sendcampaign',
    {
      campaign_key: campaignKey
    },
    {
      params: { resfmt: 'JSON' },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

// Send campaign now
await sendCampaign(accessToken, 'xyz123abc');
```

```python
def send_campaign(access_token, campaign_key):
    url = 'https://campaigns.zoho.com/api/v1.1/sendcampaign'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    params = {'resfmt': 'JSON'}
    data = {'campaign_key': campaign_key}
    response = requests.post(url, json=data, headers=headers, params=params)
    return response.json()

# Send campaign
send_campaign(access_token, 'xyz123abc')
```

```deluge
// Deluge
campaign_map = Map();
campaign_map.put("campaign_key", "xyz123abc");

response = zoho.campaigns.invoke("sendcampaign", campaign_map);
info response;
```

### Delete Campaign

```http
POST /api/v1.1/deletecampaign?resfmt=JSON
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "campaign_key": "xyz123abc"
}
```

**Example**:
```javascript
const deleteCampaign = async (accessToken, campaignKey) => {
  const response = await axios.post(
    'https://campaigns.zoho.com/api/v1.1/deletecampaign',
    {
      campaign_key: campaignKey
    },
    {
      params: { resfmt: 'JSON' },
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

## Scheduling Campaigns

Schedule campaigns to be sent at a specific date and time.

### Schedule Campaign

```http
POST /api/v1.1/schedulecampaign?resfmt=JSON
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "campaign_key": "xyz123abc",
  "schedule_date": "12/20/2025",
  "schedule_time": "09:00"
}
```

**Date Format**: MM/DD/YYYY
**Time Format**: HH:MM (24-hour format)

**Example**:
```javascript
const scheduleCampaign = async (accessToken, campaignKey, date, time) => {
  const response = await axios.post(
    'https://campaigns.zoho.com/api/v1.1/schedulecampaign',
    {
      campaign_key: campaignKey,
      schedule_date: date,
      schedule_time: time
    },
    {
      params: { resfmt: 'JSON' },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

// Schedule for December 20, 2025 at 9:00 AM
await scheduleCampaign(accessToken, 'xyz123abc', '12/20/2025', '09:00');
```

```python
def schedule_campaign(access_token, campaign_key, date, time):
    """
    Schedule a campaign
    date: MM/DD/YYYY format
    time: HH:MM 24-hour format
    """
    url = 'https://campaigns.zoho.com/api/v1.1/schedulecampaign'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    params = {'resfmt': 'JSON'}
    data = {
        'campaign_key': campaign_key,
        'schedule_date': date,
        'schedule_time': time
    }
    response = requests.post(url, json=data, headers=headers, params=params)
    return response.json()

# Schedule for December 20, 2025 at 9:00 AM
schedule_campaign(access_token, 'xyz123abc', '12/20/2025', '09:00')
```

```deluge
// Deluge
schedule_map = Map();
schedule_map.put("campaign_key", "xyz123abc");
schedule_map.put("schedule_date", "12/20/2025");
schedule_map.put("schedule_time", "09:00");

response = zoho.campaigns.invoke("schedulecampaign", schedule_map);
info response;
```

**Response**:
```json
{
  "status": "success",
  "message": "Campaign scheduled successfully",
  "scheduled_time": "2025-12-20 09:00:00"
}
```

### Reschedule Campaign

```http
POST /api/v1.1/reschedulecampaign?resfmt=JSON
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "campaign_key": "xyz123abc",
  "schedule_date": "12/22/2025",
  "schedule_time": "14:00"
}
```

**Example**:
```javascript
const rescheduleCampaign = async (accessToken, campaignKey, newDate, newTime) => {
  const response = await axios.post(
    'https://campaigns.zoho.com/api/v1.1/reschedulecampaign',
    {
      campaign_key: campaignKey,
      schedule_date: newDate,
      schedule_time: newTime
    },
    {
      params: { resfmt: 'JSON' },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};
```

### Unschedule Campaign

```http
POST /api/v1.1/unschedulecampaign?resfmt=JSON
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "campaign_key": "xyz123abc"
}
```

**Example**:
```javascript
const unscheduleCampaign = async (accessToken, campaignKey) => {
  const response = await axios.post(
    'https://campaigns.zoho.com/api/v1.1/unschedulecampaign',
    {
      campaign_key: campaignKey
    },
    {
      params: { resfmt: 'JSON' },
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

## Templates API

Manage email templates for campaigns.

### Template Object Structure

```json
{
  "template_id": "temp123xyz",
  "template_name": "Holiday Sale Template",
  "template_type": "Custom",
  "created_time": "2025-11-01 10:00:00",
  "modified_time": "2025-12-10 14:30:00"
}
```

### Get All Templates

```http
GET /api/v1.1/gettemplates?resfmt=JSON
Authorization: Zoho-oauthtoken {access_token}
```

**Example**:
```javascript
const getTemplates = async (accessToken) => {
  const response = await axios.get(
    'https://campaigns.zoho.com/api/v1.1/gettemplates',
    {
      params: { resfmt: 'JSON' },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

```python
def get_templates(access_token):
    url = 'https://campaigns.zoho.com/api/v1.1/gettemplates'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {'resfmt': 'JSON'}
    response = requests.get(url, headers=headers, params=params)
    return response.json()
```

```deluge
// Deluge
params_map = Map();
params_map.put("resfmt", "JSON");

response = zoho.campaigns.getRecords("templates", params_map);
info response;
```

### Get Template Details

```http
GET /api/v1.1/gettemplatedetails?resfmt=JSON&template_id={template_id}
Authorization: Zoho-oauthtoken {access_token}
```

**Example**:
```javascript
const getTemplateDetails = async (accessToken, templateId) => {
  const response = await axios.get(
    'https://campaigns.zoho.com/api/v1.1/gettemplatedetails',
    {
      params: {
        resfmt: 'JSON',
        template_id: templateId
      },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

### Create Campaign from Template

```http
POST /api/v1.1/createcampaignfromtemplate?resfmt=JSON
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "template_id": "temp123xyz",
  "campaign_name": "Holiday Campaign",
  "campaign_subject": "Special Holiday Offer",
  "from_email": "marketing@example.com",
  "from_name": "Example Company",
  "mail_list": "abc123xyz"
}
```

**Example**:
```javascript
const createCampaignFromTemplate = async (accessToken, templateId, campaignData) => {
  const response = await axios.post(
    'https://campaigns.zoho.com/api/v1.1/createcampaignfromtemplate',
    {
      template_id: templateId,
      ...campaignData
    },
    {
      params: { resfmt: 'JSON' },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

// Usage
const campaignFromTemplate = await createCampaignFromTemplate(
  accessToken,
  'temp123xyz',
  {
    campaign_name: 'Holiday Campaign',
    campaign_subject: 'Special Holiday Offer',
    from_email: 'marketing@example.com',
    from_name: 'Example Company',
    mail_list: 'abc123xyz'
  }
);
```

---

## Campaign Analytics

Track campaign performance with detailed analytics.

### Get Campaign Report

```http
GET /api/v1.1/getcampaignreport?resfmt=JSON&campaign_key={campaign_key}
Authorization: Zoho-oauthtoken {access_token}
```

**Example**:
```javascript
const getCampaignReport = async (accessToken, campaignKey) => {
  const response = await axios.get(
    'https://campaigns.zoho.com/api/v1.1/getcampaignreport',
    {
      params: {
        resfmt: 'JSON',
        campaign_key: campaignKey
      },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};

// Get report
const report = await getCampaignReport(accessToken, 'xyz123abc');
console.log(`
  Campaign: ${report.campaign_name}
  Sent: ${report.sent_count}
  Opens: ${report.open_count} (${report.open_rate}%)
  Clicks: ${report.click_count} (${report.click_rate}%)
  Bounces: ${report.bounce_count}
  Unsubscribes: ${report.unsubscribe_count}
`);
```

```python
def get_campaign_report(access_token, campaign_key):
    url = 'https://campaigns.zoho.com/api/v1.1/getcampaignreport'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'resfmt': 'JSON',
        'campaign_key': campaign_key
    }
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Get and display report
report = get_campaign_report(access_token, 'xyz123abc')
print(f"""
Campaign: {report['campaign_name']}
Sent: {report['sent_count']}
Opens: {report['open_count']} ({report['open_rate']}%)
Clicks: {report['click_count']} ({report['click_rate']}%)
Bounces: {report['bounce_count']}
Unsubscribes: {report['unsubscribe_count']}
""")
```

```deluge
// Deluge
params_map = Map();
params_map.put("resfmt", "JSON");
params_map.put("campaign_key", "xyz123abc");

report = zoho.campaigns.invoke("getcampaignreport", params_map);
info "Campaign: " + report.get("campaign_name");
info "Sent: " + report.get("sent_count");
info "Opens: " + report.get("open_count") + " (" + report.get("open_rate") + "%)";
info "Clicks: " + report.get("click_count") + " (" + report.get("click_rate") + "%)";
```

**Response**:
```json
{
  "status": "success",
  "campaign_key": "xyz123abc",
  "campaign_name": "Holiday Sale 2025",
  "campaign_subject": "Get 50% Off - Holiday Special!",
  "sent_count": 1500,
  "open_count": 450,
  "open_rate": "30.00",
  "unique_opens": 380,
  "click_count": 120,
  "click_rate": "8.00",
  "unique_clicks": 95,
  "bounce_count": 15,
  "bounce_rate": "1.00",
  "unsubscribe_count": 5,
  "unsubscribe_rate": "0.33",
  "spam_count": 2,
  "sent_date": "2025-12-20 09:00:00"
}
```

### Get Link Click Details

```http
GET /api/v1.1/getlinkreport?resfmt=JSON&campaign_key={campaign_key}
Authorization: Zoho-oauthtoken {access_token}
```

**Example**:
```javascript
const getLinkReport = async (accessToken, campaignKey) => {
  const response = await axios.get(
    'https://campaigns.zoho.com/api/v1.1/getlinkreport',
    {
      params: {
        resfmt: 'JSON',
        campaign_key: campaignKey
      },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};

// Get link click details
const linkReport = await getLinkReport(accessToken, 'xyz123abc');
linkReport.links.forEach(link => {
  console.log(`${link.url}: ${link.click_count} clicks`);
});
```

**Response**:
```json
{
  "status": "success",
  "campaign_key": "xyz123abc",
  "links": [
    {
      "url": "https://example.com/holiday-sale",
      "click_count": 85,
      "unique_clicks": 70
    },
    {
      "url": "https://example.com/products",
      "click_count": 35,
      "unique_clicks": 25
    }
  ]
}
```

### Get Bounced Contacts

```http
GET /api/v1.1/getbouncedcontacts?resfmt=JSON&campaign_key={campaign_key}
Authorization: Zoho-oauthtoken {access_token}
```

**Example**:
```javascript
const getBouncedContacts = async (accessToken, campaignKey) => {
  const response = await axios.get(
    'https://campaigns.zoho.com/api/v1.1/getbouncedcontacts',
    {
      params: {
        resfmt: 'JSON',
        campaign_key: campaignKey
      },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

### Get Unsubscribed Contacts

```http
GET /api/v1.1/getunsubscribes?resfmt=JSON&campaign_key={campaign_key}
Authorization: Zoho-oauthtoken {access_token}
```

**Example**:
```javascript
const getUnsubscribedContacts = async (accessToken, campaignKey) => {
  const response = await axios.get(
    'https://campaigns.zoho.com/api/v1.1/getunsubscribes',
    {
      params: {
        resfmt: 'JSON',
        campaign_key: campaignKey
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

## Webhooks

Configure webhooks to receive real-time notifications for campaign events.

### Webhook Events

**Available Events**:
- `contact.subscribed` - New contact subscribed to list
- `contact.unsubscribed` - Contact unsubscribed from list
- `contact.bounced` - Email bounced
- `campaign.sent` - Campaign sent successfully
- `campaign.opened` - Campaign email opened
- `campaign.clicked` - Link in campaign clicked
- `campaign.bounced` - Campaign email bounced
- `campaign.unsubscribed` - Recipient unsubscribed via campaign

### Webhook Payload Example

When a campaign is opened:

```json
{
  "event": "campaign.opened",
  "timestamp": "2025-12-20T10:15:30Z",
  "data": {
    "campaign_key": "xyz123abc",
    "campaign_name": "Holiday Sale 2025",
    "contact_email": "john.doe@example.com",
    "list_key": "abc123xyz",
    "open_time": "2025-12-20T10:15:30Z",
    "ip_address": "192.168.1.1",
    "user_agent": "Mozilla/5.0..."
  }
}
```

### Handle Webhook in Your Application

```javascript
// Express.js webhook handler
const express = require('express');
const app = express();

app.post('/webhook/zoho-campaigns', express.json(), (req, res) => {
  const { event, data } = req.body;

  switch(event) {
    case 'campaign.opened':
      console.log(`Campaign ${data.campaign_name} opened by ${data.contact_email}`);
      // Track opens in your analytics
      break;

    case 'campaign.clicked':
      console.log(`Link clicked in ${data.campaign_name} by ${data.contact_email}`);
      // Track clicks
      break;

    case 'contact.unsubscribed':
      console.log(`Contact ${data.contact_email} unsubscribed from list`);
      // Update your CRM
      break;

    case 'contact.bounced':
      console.log(`Email bounced for ${data.contact_email}`);
      // Mark contact as invalid
      break;
  }

  // Always respond with 200 to acknowledge receipt
  res.status(200).json({ received: true });
});

app.listen(3000, () => {
  console.log('Webhook server listening on port 3000');
});
```

```python
# Flask webhook handler
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/webhook/zoho-campaigns', methods=['POST'])
def handle_webhook():
    data = request.json
    event = data.get('event')
    payload = data.get('data')

    if event == 'campaign.opened':
        print(f"Campaign {payload['campaign_name']} opened by {payload['contact_email']}")
        # Track opens

    elif event == 'campaign.clicked':
        print(f"Link clicked in {payload['campaign_name']} by {payload['contact_email']}")
        # Track clicks

    elif event == 'contact.unsubscribed':
        print(f"Contact {payload['contact_email']} unsubscribed")
        # Update CRM

    elif event == 'contact.bounced':
        print(f"Email bounced for {payload['contact_email']}")
        # Mark as invalid

    # Always respond with 200
    return jsonify({'received': True}), 200

if __name__ == '__main__':
    app.run(port=3000)
```

---

## Error Codes

### HTTP Status Codes

| Status Code | Meaning | Common Causes |
|-------------|---------|---------------|
| 200 | OK | Successful request |
| 201 | Created | Resource successfully created |
| 400 | Bad Request | Invalid parameters or malformed request |
| 401 | Unauthorized | Invalid or expired access token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource does not exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |

### Zoho Campaigns Error Codes

| Error Code | Description | Solution |
|------------|-------------|----------|
| 1001 | Invalid access token | Refresh the access token |
| 1002 | Access token expired | Refresh the access token |
| 2001 | Invalid list key | Verify the mailing list key |
| 2002 | List not found | Check if list exists |
| 2003 | List name already exists | Use a unique list name |
| 3001 | Invalid contact email | Provide valid email address |
| 3002 | Contact already exists | Use update instead of add |
| 3003 | Contact not found | Verify contact exists in list |
| 4001 | Invalid campaign key | Verify the campaign key |
| 4002 | Campaign not found | Check if campaign exists |
| 4003 | Campaign already sent | Cannot modify sent campaigns |
| 4004 | Invalid campaign content | Check HTML content format |
| 5001 | Invalid template ID | Verify template ID |
| 5002 | Template not found | Check if template exists |
| 6001 | Rate limit exceeded | Wait for cooldown period |
| 7001 | Invalid date format | Use MM/DD/YYYY format |
| 7002 | Invalid time format | Use HH:MM 24-hour format |
| 7003 | Schedule time in past | Use future date/time |
| 9999 | Internal server error | Retry with exponential backoff |

### Error Response Structure

```json
{
  "status": "error",
  "code": "2001",
  "message": "Invalid list key provided",
  "details": {
    "field": "listkey",
    "value": "invalid_key"
  }
}
```

### Error Handling Best Practices

```javascript
const handleCampaignsError = (error) => {
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
        break;

      case 403:
        console.error('Forbidden. Check OAuth scopes.');
        break;

      case 404:
        console.error('Resource not found:', data.message);
        break;

      case 429:
        const cooldown = error.response.headers['x-ratelimit-cooldown'];
        console.error(`Rate limit exceeded. Wait ${cooldown}s`);
        // Implement backoff
        break;

      case 500:
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
  const campaign = await createCampaign(accessToken, campaignData);
} catch (error) {
  handleCampaignsError(error);
}
```

---

## Code Examples

### Complete Campaign Workflow

```javascript
// Complete workflow: Create list, add contacts, create campaign, schedule, monitor
const completeCampaignWorkflow = async (accessToken) => {
  try {
    // Step 1: Create mailing list
    console.log('Creating mailing list...');
    const list = await createMailingList(accessToken, 'Q1 2025 Newsletter');
    console.log(`✓ List created: ${list.listkey}`);

    // Step 2: Add contacts to list
    console.log('Adding contacts...');
    const contacts = [
      {
        contact_email: 'customer1@example.com',
        contact_name: 'John Doe',
        firstname: 'John',
        lastname: 'Doe'
      },
      {
        contact_email: 'customer2@example.com',
        contact_name: 'Jane Smith',
        firstname: 'Jane',
        lastname: 'Smith'
      }
    ];

    await bulkAddContacts(accessToken, list.listkey, contacts);
    console.log(`✓ Added ${contacts.length} contacts`);

    // Step 3: Create campaign
    console.log('Creating campaign...');
    const campaign = await createCampaign(accessToken, {
      campaign_name: 'Q1 Newsletter',
      campaign_subject: 'Exciting Updates for Q1 2025',
      from_email: 'newsletter@example.com',
      from_name: 'Example Company',
      reply_to: 'support@example.com',
      mail_list: list.listkey,
      html_content: `
        <html>
          <body>
            <h1>Welcome to Q1 2025!</h1>
            <p>Check out our latest updates and offers.</p>
            <a href="https://example.com/q1-offers">View Offers</a>
          </body>
        </html>
      `
    });
    console.log(`✓ Campaign created: ${campaign.campaign_key}`);

    // Step 4: Schedule campaign
    console.log('Scheduling campaign...');
    const scheduleDate = new Date();
    scheduleDate.setDate(scheduleDate.getDate() + 7); // Schedule for 7 days from now

    const dateStr = `${scheduleDate.getMonth() + 1}/${scheduleDate.getDate()}/${scheduleDate.getFullYear()}`;
    await scheduleCampaign(accessToken, campaign.campaign_key, dateStr, '09:00');
    console.log(`✓ Campaign scheduled for ${dateStr} at 09:00`);

    // Step 5: Monitor campaign (after it's sent)
    console.log('\nWorkflow completed successfully!');
    console.log(`Campaign will be sent on ${dateStr}`);
    console.log('Use getCampaignReport() after sending to view analytics.');

    return {
      listKey: list.listkey,
      campaignKey: campaign.campaign_key,
      scheduledDate: dateStr
    };

  } catch (error) {
    handleCampaignsError(error);
    throw error;
  }
};

// Run the workflow
completeCampaignWorkflow(accessToken)
  .then(result => {
    console.log('\nWorkflow Result:', result);
  })
  .catch(error => {
    console.error('Workflow failed:', error.message);
  });
```

### Monitor Campaign Performance

```python
import requests
import time
from datetime import datetime

def monitor_campaign_performance(access_token, campaign_key, check_interval=300):
    """
    Monitor campaign performance in real-time
    check_interval: seconds between checks (default: 5 minutes)
    """

    print(f"Monitoring campaign: {campaign_key}")
    print("Press Ctrl+C to stop\n")

    previous_opens = 0
    previous_clicks = 0

    try:
        while True:
            # Get current report
            report = get_campaign_report(access_token, campaign_key)

            # Calculate new metrics
            new_opens = report['open_count'] - previous_opens
            new_clicks = report['click_count'] - previous_clicks

            # Display update
            timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            print(f"[{timestamp}] Campaign Status Update:")
            print(f"  Total Opens: {report['open_count']} (+{new_opens})")
            print(f"  Total Clicks: {report['click_count']} (+{new_clicks})")
            print(f"  Open Rate: {report['open_rate']}%")
            print(f"  Click Rate: {report['click_rate']}%")
            print(f"  Bounces: {report['bounce_count']}")
            print(f"  Unsubscribes: {report['unsubscribe_count']}")
            print("-" * 50)

            # Update counters
            previous_opens = report['open_count']
            previous_clicks = report['click_count']

            # Wait before next check
            time.sleep(check_interval)

    except KeyboardInterrupt:
        print("\nMonitoring stopped.")
    except Exception as e:
        print(f"Error monitoring campaign: {e}")

# Usage
monitor_campaign_performance(access_token, 'xyz123abc', check_interval=300)
```

### Sync Contacts from CRM to Campaigns

```javascript
const syncCRMToCampaigns = async (crmAccessToken, campaignsAccessToken, listKey) => {
  try {
    console.log('Starting CRM to Campaigns sync...');

    // Step 1: Get contacts from CRM
    console.log('Fetching contacts from Zoho CRM...');
    const crmResponse = await axios.get(
      'https://www.zohoapis.com/crm/v8/Contacts',
      {
        params: {
          fields: 'First_Name,Last_Name,Email,Phone,Account_Name'
        },
        headers: {
          'Authorization': `Zoho-oauthtoken ${crmAccessToken}`
        }
      }
    );

    const crmContacts = crmResponse.data.data;
    console.log(`✓ Found ${crmContacts.length} contacts in CRM`);

    // Step 2: Transform to Campaigns format
    const campaignsContacts = crmContacts.map(contact => ({
      contact_email: contact.Email,
      contact_name: `${contact.First_Name} ${contact.Last_Name}`,
      firstname: contact.First_Name,
      lastname: contact.Last_Name,
      contact_mobile: contact.Phone,
      company: contact.Account_Name?.name || ''
    })).filter(c => c.contact_email); // Only contacts with email

    console.log(`✓ Prepared ${campaignsContacts.length} contacts for sync`);

    // Step 3: Batch add to Campaigns (max 500 per request)
    const batchSize = 500;
    let synced = 0;

    for (let i = 0; i < campaignsContacts.length; i += batchSize) {
      const batch = campaignsContacts.slice(i, i + batchSize);

      await bulkAddContacts(campaignsAccessToken, listKey, batch);
      synced += batch.length;

      console.log(`✓ Synced ${synced}/${campaignsContacts.length} contacts`);

      // Respect rate limits - wait 1 second between batches
      if (i + batchSize < campaignsContacts.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`\n✓ Sync completed! ${synced} contacts synced to list ${listKey}`);
    return synced;

  } catch (error) {
    console.error('Sync failed:', error.message);
    throw error;
  }
};

// Usage
syncCRMToCampaigns(crmAccessToken, campaignsAccessToken, 'abc123xyz')
  .then(count => console.log(`Successfully synced ${count} contacts`))
  .catch(error => console.error('Sync error:', error));
```

### A/B Testing Campaigns

```javascript
const runABTest = async (accessToken, listKey, campaignData) => {
  try {
    console.log('Setting up A/B test...');

    // Split list into two segments (50/50)
    const allContacts = await getContacts(accessToken, listKey);
    const halfPoint = Math.floor(allContacts.data.length / 2);

    // Create two test lists
    const listA = await createMailingList(accessToken, `${campaignData.campaign_name} - Variant A`);
    const listB = await createMailingList(accessToken, `${campaignData.campaign_name} - Variant B`);

    // Add contacts to test lists
    const contactsA = allContacts.data.slice(0, halfPoint);
    const contactsB = allContacts.data.slice(halfPoint);

    await bulkAddContacts(accessToken, listA.listkey, contactsA);
    await bulkAddContacts(accessToken, listB.listkey, contactsB);

    console.log(`✓ Created test lists (${contactsA.length} vs ${contactsB.length} contacts)`);

    // Create Campaign A (original subject)
    const campaignA = await createCampaign(accessToken, {
      ...campaignData,
      campaign_name: `${campaignData.campaign_name} - Variant A`,
      mail_list: listA.listkey
    });

    // Create Campaign B (alternative subject)
    const campaignB = await createCampaign(accessToken, {
      ...campaignData,
      campaign_name: `${campaignData.campaign_name} - Variant B`,
      campaign_subject: campaignData.alternative_subject,
      mail_list: listB.listkey
    });

    console.log('✓ Created test campaigns');

    // Send both campaigns
    await sendCampaign(accessToken, campaignA.campaign_key);
    await sendCampaign(accessToken, campaignB.campaign_key);

    console.log('✓ Test campaigns sent!');
    console.log('\nWait 24 hours for results, then call analyzeABTest()');

    return {
      campaignA: campaignA.campaign_key,
      campaignB: campaignB.campaign_key
    };

  } catch (error) {
    handleCampaignsError(error);
    throw error;
  }
};

const analyzeABTest = async (accessToken, campaignAKey, campaignBKey) => {
  // Get reports for both campaigns
  const reportA = await getCampaignReport(accessToken, campaignAKey);
  const reportB = await getCampaignReport(accessToken, campaignBKey);

  console.log('\n=== A/B Test Results ===\n');

  console.log('Variant A:');
  console.log(`  Subject: ${reportA.campaign_subject}`);
  console.log(`  Opens: ${reportA.open_count} (${reportA.open_rate}%)`);
  console.log(`  Clicks: ${reportA.click_count} (${reportA.click_rate}%)`);

  console.log('\nVariant B:');
  console.log(`  Subject: ${reportB.campaign_subject}`);
  console.log(`  Opens: ${reportB.open_count} (${reportB.open_rate}%)`);
  console.log(`  Clicks: ${reportB.click_count} (${reportB.click_rate}%)`);

  // Determine winner
  const openRateA = parseFloat(reportA.open_rate);
  const openRateB = parseFloat(reportB.open_rate);
  const clickRateA = parseFloat(reportA.click_rate);
  const clickRateB = parseFloat(reportB.click_rate);

  console.log('\n=== Winner ===');
  if (openRateA > openRateB) {
    console.log(`Variant A wins! ${openRateA - openRateB}% higher open rate`);
  } else if (openRateB > openRateA) {
    console.log(`Variant B wins! ${openRateB - openRateA}% higher open rate`);
  } else {
    console.log('Tie on open rate');
  }

  return {
    variantA: { openRate: openRateA, clickRate: clickRateA },
    variantB: { openRate: openRateB, clickRate: clickRateB }
  };
};
```

### Token Management Class

```javascript
class ZohoCampaignsAuth {
  constructor(clientId, clientSecret, redirectUri) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;
  }

  async getAccessToken() {
    // Check if current token is still valid (with 5 min buffer)
    if (this.accessToken && this.tokenExpiry > Date.now() + 300000) {
      return this.accessToken;
    }

    // Refresh token if expired
    if (this.refreshToken) {
      await this.refreshAccessToken();
      return this.accessToken;
    }

    throw new Error('No valid token available. Please authenticate.');
  }

  async exchangeCodeForToken(authCode) {
    const response = await axios.post(
      'https://accounts.zoho.com/oauth/v2/token',
      null,
      {
        params: {
          grant_type: 'authorization_code',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          redirect_uri: this.redirectUri,
          code: authCode
        }
      }
    );

    this.accessToken = response.data.access_token;
    this.refreshToken = response.data.refresh_token;
    this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);

    // Store refresh token securely
    this.saveRefreshToken(this.refreshToken);

    return response.data;
  }

  async refreshAccessToken() {
    const response = await axios.post(
      'https://accounts.zoho.com/oauth/v2/token',
      null,
      {
        params: {
          grant_type: 'refresh_token',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: this.refreshToken
        }
      }
    );

    this.accessToken = response.data.access_token;
    this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);

    return response.data;
  }

  saveRefreshToken(refreshToken) {
    // Store refresh token securely (e.g., encrypted database)
    // Never store in plain text or expose to client
    console.log('Store refresh token securely');
  }

  loadRefreshToken() {
    // Load refresh token from secure storage
    // Return stored refresh token
  }
}

// Usage
const auth = new ZohoCampaignsAuth(
  process.env.ZOHO_CLIENT_ID,
  process.env.ZOHO_CLIENT_SECRET,
  process.env.ZOHO_REDIRECT_URI
);

// Initial authentication
const authCode = 'code_from_oauth_flow';
await auth.exchangeCodeForToken(authCode);

// Use in API calls
const accessToken = await auth.getAccessToken();
const lists = await getMailingLists(accessToken);
```

---

## Best Practices

### 1. Authentication and Security

**Store Credentials Securely**:
```javascript
// Bad - Never hardcode credentials
const clientId = '1000.ABCDEF123456';

// Good - Use environment variables
const clientId = process.env.ZOHO_CLIENT_ID;
const clientSecret = process.env.ZOHO_CLIENT_SECRET;
```

**Implement Token Refresh**:
- Refresh tokens automatically before expiry
- Store refresh tokens encrypted at rest
- Never expose tokens in logs or client-side code

### 2. Rate Limit Management

**Implement Request Throttling**:
```javascript
class RateLimiter {
  constructor(maxCalls = 500, windowMs = 300000) {
    this.maxCalls = maxCalls;
    this.windowMs = windowMs;
    this.calls = [];
  }

  async throttle() {
    const now = Date.now();

    // Remove old calls outside window
    this.calls = this.calls.filter(time => now - time < this.windowMs);

    // Check if at limit
    if (this.calls.length >= this.maxCalls) {
      const oldestCall = this.calls[0];
      const waitTime = this.windowMs - (now - oldestCall);

      console.log(`Rate limit reached. Waiting ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));

      // Recursively check again
      return this.throttle();
    }

    // Record this call
    this.calls.push(now);
  }
}

// Usage
const limiter = new RateLimiter(500, 300000); // 500 calls per 5 minutes

const makeThrottledRequest = async (apiCall) => {
  await limiter.throttle();
  return await apiCall();
};
```

**Monitor Rate Limit Headers**:
```javascript
const makeAPICall = async (url, options) => {
  const response = await axios(url, options);

  // Check rate limit headers
  const remaining = response.headers['x-ratelimit-remaining'];
  const limit = response.headers['x-ratelimit-limit'];

  if (remaining < limit * 0.1) { // Less than 10% remaining
    console.warn(`⚠️  Rate limit warning: ${remaining}/${limit} calls remaining`);
  }

  return response;
};
```

### 3. Email Best Practices

**Validate Email Content**:
```javascript
const validateCampaignContent = (htmlContent) => {
  // Check for required elements
  const hasUnsubscribeLink = htmlContent.includes('$[UNSUBSCRIBE]$') ||
                             htmlContent.includes('unsubscribe');

  if (!hasUnsubscribeLink) {
    throw new Error('Campaign must include unsubscribe link');
  }

  // Check for spam triggers
  const spamWords = ['free', 'click here', '!!!', 'urgent'];
  const lowerContent = htmlContent.toLowerCase();

  const foundSpamWords = spamWords.filter(word => lowerContent.includes(word));
  if (foundSpamWords.length > 0) {
    console.warn(`⚠️  Potential spam triggers found: ${foundSpamWords.join(', ')}`);
  }

  return true;
};
```

**Optimize Send Times**:
```javascript
const getOptimalSendTime = (timezone = 'America/New_York') => {
  const now = new Date();

  // Best send times: Tuesday-Thursday, 10 AM or 2 PM
  const daysUntilTuesday = (2 - now.getDay() + 7) % 7 || 7;
  const nextTuesday = new Date(now);
  nextTuesday.setDate(now.getDate() + daysUntilTuesday);
  nextTuesday.setHours(10, 0, 0, 0);

  return {
    date: `${nextTuesday.getMonth() + 1}/${nextTuesday.getDate()}/${nextTuesday.getFullYear()}`,
    time: '10:00'
  };
};

// Schedule campaign at optimal time
const optimalTime = getOptimalSendTime();
await scheduleCampaign(accessToken, campaignKey, optimalTime.date, optimalTime.time);
```

### 4. List Management

**Segment Lists Effectively**:
```javascript
const segmentListByEngagement = async (accessToken, listKey) => {
  // Get all contacts
  const contacts = await getContacts(accessToken, listKey);

  // Create engagement segments
  const highEngagement = await createMailingList(accessToken, 'High Engagement');
  const mediumEngagement = await createMailingList(accessToken, 'Medium Engagement');
  const lowEngagement = await createMailingList(accessToken, 'Low Engagement');

  // Categorize based on historical data
  // (This is simplified - you'd use actual engagement metrics)
  for (const contact of contacts.data) {
    if (contact.open_rate > 50) {
      await addContact(accessToken, highEngagement.listkey, contact);
    } else if (contact.open_rate > 20) {
      await addContact(accessToken, mediumEngagement.listkey, contact);
    } else {
      await addContact(accessToken, lowEngagement.listkey, contact);
    }
  }

  return {
    high: highEngagement.listkey,
    medium: mediumEngagement.listkey,
    low: lowEngagement.listkey
  };
};
```

**Clean Lists Regularly**:
```javascript
const cleanMailingList = async (accessToken, listKey) => {
  console.log('Cleaning mailing list...');

  // Get all contacts
  const contacts = await getContacts(accessToken, listKey);

  let removed = 0;

  for (const contact of contacts.data) {
    // Remove bounced contacts
    if (contact.status === 'Bounced') {
      await removeContact(accessToken, listKey, contact.contact_email);
      removed++;
      console.log(`Removed bounced: ${contact.contact_email}`);
    }

    // Remove long-term unengaged
    const daysSinceActivity = calculateDaysSince(contact.last_activity);
    if (daysSinceActivity > 180) { // 6 months
      await removeContact(accessToken, listKey, contact.contact_email);
      removed++;
      console.log(`Removed inactive: ${contact.contact_email}`);
    }
  }

  console.log(`✓ Removed ${removed} contacts from list`);
  return removed;
};
```

### 5. Analytics and Reporting

**Track Campaign Performance**:
```javascript
const trackCampaignKPIs = async (accessToken, campaignKey) => {
  const report = await getCampaignReport(accessToken, campaignKey);

  // Calculate key metrics
  const metrics = {
    deliveryRate: ((report.sent_count - report.bounce_count) / report.sent_count * 100).toFixed(2),
    openRate: parseFloat(report.open_rate),
    clickRate: parseFloat(report.click_rate),
    clickToOpenRate: (report.click_count / report.open_count * 100).toFixed(2),
    unsubscribeRate: parseFloat(report.unsubscribe_rate),
    roi: calculateROI(report) // Your custom ROI calculation
  };

  // Evaluate performance
  const evaluation = {
    delivery: metrics.deliveryRate > 95 ? '✓ Excellent' : '⚠️ Needs attention',
    opens: metrics.openRate > 20 ? '✓ Good' : '⚠️ Below average',
    clicks: metrics.clickRate > 2.5 ? '✓ Good' : '⚠️ Below average',
    unsubscribes: metrics.unsubscribeRate < 0.5 ? '✓ Good' : '⚠️ High'
  };

  console.log('\n=== Campaign Performance ===');
  console.log(`Delivery Rate: ${metrics.deliveryRate}% ${evaluation.delivery}`);
  console.log(`Open Rate: ${metrics.openRate}% ${evaluation.opens}`);
  console.log(`Click Rate: ${metrics.clickRate}% ${evaluation.clicks}`);
  console.log(`Click-to-Open: ${metrics.clickToOpenRate}%`);
  console.log(`Unsubscribe Rate: ${metrics.unsubscribeRate}% ${evaluation.unsubscribes}`);

  return { metrics, evaluation };
};
```

### 6. Error Handling and Logging

**Comprehensive Error Handling**:
```javascript
class CampaignsAPIClient {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.logger = console; // Use proper logger in production
  }

  async makeRequest(method, endpoint, data = null) {
    const maxRetries = 3;
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        this.logger.info(`${method} ${endpoint} (attempt ${attempt}/${maxRetries})`);

        const response = await axios({
          method,
          url: `https://campaigns.zoho.com/api/v1.1/${endpoint}`,
          data,
          params: { resfmt: 'JSON' },
          headers: {
            'Authorization': `Zoho-oauthtoken ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        this.logger.info(`✓ ${method} ${endpoint} succeeded`);
        return response.data;

      } catch (error) {
        lastError = error;

        if (error.response?.status === 429) {
          // Rate limit - wait and retry
          const cooldown = parseInt(error.response.headers['x-ratelimit-cooldown']) || 60;
          this.logger.warn(`Rate limited. Waiting ${cooldown}s...`);
          await new Promise(resolve => setTimeout(resolve, cooldown * 1000));
          continue;
        }

        if (error.response?.status === 401) {
          // Token expired - refresh
          this.logger.warn('Token expired. Refresh needed.');
          throw new Error('TOKEN_EXPIRED');
        }

        if (error.response?.status >= 500) {
          // Server error - retry with backoff
          const delay = Math.pow(2, attempt) * 1000;
          this.logger.warn(`Server error. Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Other errors - don't retry
        break;
      }
    }

    // All retries failed
    this.logger.error(`${method} ${endpoint} failed after ${maxRetries} attempts`, lastError);
    throw lastError;
  }

  // Wrapper methods
  async getMailingLists() {
    return this.makeRequest('GET', 'getmailinglists');
  }

  async createCampaign(campaignData) {
    return this.makeRequest('POST', 'createcampaign', campaignData);
  }
}

// Usage
const client = new CampaignsAPIClient(accessToken);
const lists = await client.getMailingLists();
```

---

## Data Centers

Zoho Campaigns operates in multiple data centers. Use the appropriate base URL for your region:

| Data Center | Base URL |
|-------------|----------|
| US | https://campaigns.zoho.com |
| EU | https://campaigns.zoho.eu |
| IN | https://campaigns.zoho.in |
| AU | https://campaigns.zoho.com.au |
| JP | https://campaigns.zoho.jp |
| CA | https://campaigns.zoho.ca |
| CN | https://campaigns.zoho.com.cn |

**Important**: The OAuth token domain must match your API domain. Check the `api_domain` in your OAuth token response.

---

## Additional Resources

- [Official Zoho Campaigns API Documentation](https://www.zoho.com/campaigns/help/developers/api/)
- [Zoho Campaigns Developer Portal](https://www.zoho.com/campaigns/help/developers/)
- [Zoho API Console](https://api-console.zoho.com/)
- [Developer Community Forums](https://help.zoho.com/portal/en/community/campaigns)
- [Email Marketing Best Practices](https://www.zoho.com/campaigns/email-marketing-guide.html)
- [CAN-SPAM Compliance](https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business)

---

## SDK Support

Zoho Campaigns doesn't have official SDKs, but you can use the REST API with any HTTP client library:

**Recommended Libraries**:
- **JavaScript/Node.js**: axios, node-fetch, got
- **Python**: requests, httpx, aiohttp
- **PHP**: Guzzle
- **Ruby**: httparty, faraday
- **Java**: OkHttp, Apache HttpClient
- **C#**: HttpClient, RestSharp

---

## Changelog

### v1.1 (Current)
- Email campaign creation and management
- Mailing list operations
- Contact management with bulk operations
- Template support
- Campaign scheduling
- Comprehensive analytics and reporting
- Webhook support for real-time events
- Rate limiting (500 calls per 5 minutes)
- JSON and XML response formats
- OAuth 2.0 authentication

---

**Last Updated**: December 2025
**API Version**: v1.1
