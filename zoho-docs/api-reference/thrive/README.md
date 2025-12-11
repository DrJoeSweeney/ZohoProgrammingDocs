# Zoho Thrive API Reference

## Overview

Zoho Thrive is a referral marketing platform for managing customer advocates, campaigns, and rewards. The API provides programmatic access to advocate management, referral tracking, and campaign analytics.

**Current API Version**: v1
**Base URL**: `https://thrive.zoho.com/api/v1/`
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

**Required Scopes**:
- `ZohoThrive.advocates.ALL` - Manage advocates
- `ZohoThrive.campaigns.ALL` - Manage campaigns
- `ZohoThrive.referrals.READ` - Read referral data

---

## Rate Limits

- **API Calls**: 3,000 calls per day
- **Burst Limit**: 50 calls per minute

---

## API Modules

### 1. Advocates

**Endpoints**:
```http
GET    /api/v1/advocates              # List advocates
GET    /api/v1/advocates/{advocateId} # Get advocate details
POST   /api/v1/advocates              # Add advocate
PUT    /api/v1/advocates/{advocateId} # Update advocate
DELETE /api/v1/advocates/{advocateId} # Remove advocate
```

**Example - Add Advocate**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const addAdvocate = async (accessToken, advocateData) => {
  const response = await axios.post(
    'https://thrive.zoho.com/api/v1/advocates',
    {
      firstName: advocateData.firstName,
      lastName: advocateData.lastName,
      email: advocateData.email,
      phone: advocateData.phone,
      company: advocateData.company,
      tier: advocateData.tier || 'bronze',
      metadata: advocateData.metadata
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

**Response**:
```json
{
  "advocateId": "adv_123456",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "tier": "bronze",
  "referralCode": "JOHN123",
  "totalReferrals": 0,
  "successfulReferrals": 0,
  "totalRewards": 0,
  "joinedDate": "2025-01-15T10:30:00Z",
  "status": "active"
}
```

---

### 2. Campaigns

**Endpoints**:
```http
GET    /api/v1/campaigns              # List campaigns
GET    /api/v1/campaigns/{campaignId} # Get campaign details
POST   /api/v1/campaigns              # Create campaign
PUT    /api/v1/campaigns/{campaignId} # Update campaign
DELETE /api/v1/campaigns/{campaignId} # Delete campaign
```

**Example - Create Campaign**:
```python
# Python
import requests

def create_campaign(access_token, campaign_data):
    url = 'https://thrive.zoho.com/api/v1/campaigns'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'name': campaign_data['name'],
        'description': campaign_data['description'],
        'startDate': campaign_data['start_date'],
        'endDate': campaign_data['end_date'],
        'rewardType': campaign_data['reward_type'],
        'rewardAmount': campaign_data['reward_amount'],
        'conversionCriteria': campaign_data['conversion_criteria']
    }

    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

---

### 3. Referrals

**Endpoints**:
```http
GET    /api/v1/referrals              # List referrals
GET    /api/v1/referrals/{referralId} # Get referral details
POST   /api/v1/referrals              # Create referral
PUT    /api/v1/referrals/{referralId} # Update referral status
```

**Example - Track Referral**:
```javascript
// JavaScript/Node.js
const trackReferral = async (accessToken, referralData) => {
  const response = await axios.post(
    'https://thrive.zoho.com/api/v1/referrals',
    {
      advocateId: referralData.advocateId,
      referralCode: referralData.referralCode,
      referredEmail: referralData.referredEmail,
      referredName: referralData.referredName,
      campaignId: referralData.campaignId,
      metadata: referralData.metadata
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

**Response**:
```json
{
  "referralId": "ref_789012",
  "advocateId": "adv_123456",
  "referralCode": "JOHN123",
  "referredEmail": "newcustomer@example.com",
  "status": "pending",
  "createdDate": "2025-01-15T10:30:00Z",
  "conversionDate": null,
  "rewardStatus": "pending"
}
```

---

### 4. Rewards

**Endpoints**:
```http
GET    /api/v1/rewards              # List rewards
POST   /api/v1/rewards              # Issue reward
GET    /api/v1/advocates/{advocateId}/rewards # Get advocate rewards
```

**Example - Issue Reward**:
```python
# Python
def issue_reward(access_token, reward_data):
    url = 'https://thrive.zoho.com/api/v1/rewards'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'advocateId': reward_data['advocate_id'],
        'referralId': reward_data['referral_id'],
        'rewardType': reward_data['reward_type'],
        'rewardAmount': reward_data['reward_amount'],
        'reason': reward_data['reason']
    }

    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

---

### 5. Analytics

**Endpoints**:
```http
GET /api/v1/analytics/campaigns/{campaignId}  # Campaign analytics
GET /api/v1/analytics/advocates/{advocateId}  # Advocate performance
GET /api/v1/analytics/overview                # Overall metrics
```

**Example - Get Campaign Analytics**:
```javascript
// JavaScript/Node.js
const getCampaignAnalytics = async (accessToken, campaignId) => {
  const response = await axios.get(
    `https://thrive.zoho.com/api/v1/analytics/campaigns/${campaignId}`,
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
  "campaignId": "camp_456",
  "campaignName": "Q1 Referral Campaign",
  "totalAdvocates": 150,
  "totalReferrals": 320,
  "successfulConversions": 85,
  "conversionRate": 26.56,
  "totalRewardsIssued": 4250,
  "roi": 3.2
}
```

---

## Deluge Integration

```javascript
// Deluge Script
advocateData = {
  "firstName": customer_first_name,
  "lastName": customer_last_name,
  "email": customer_email,
  "tier": "gold"
};

response = invokeurl
[
  url: "https://thrive.zoho.com/api/v1/advocates"
  type: POST
  parameters: advocateData.toString()
  connection: "zoho_thrive"
];

advocateId = response.get("advocateId");
referralCode = response.get("referralCode");

info "Advocate enrolled: " + referralCode;
```

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 200 | Success | Request completed |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid parameters |
| 401 | Unauthorized | Invalid token |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |

---

## Data Centers

| Region | API Base URL |
|--------|-------------|
| US | `https://thrive.zoho.com/api/v1/` |
| EU | `https://thrive.zoho.eu/api/v1/` |

---

## Additional Resources

- **Official Documentation**: https://www.zoho.com/thrive/help/api/
- **Developer Console**: https://api-console.zoho.com/
