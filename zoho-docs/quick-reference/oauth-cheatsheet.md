# OAuth 2.0 Quick Setup Guide

Quick reference for setting up OAuth authentication with Zoho APIs.

---

## Quick Start (5 Minutes)

### 1. Register Your Application

**URL**: https://api-console.zoho.com/

1. Click **Add Client**
2. Choose **Client Type**:
   - **Server-based Applications** - For web apps with backend
   - **Self Client** - For personal scripts/automation
3. Fill in details:
   - Client Name: Your app name
   - Homepage URL: Your app URL or `http://localhost`
   - Authorized Redirect URIs: Where users return after authorization

**Result**: You get `client_id` and `client_secret`

---

## Self Client (Quickest for Scripts)

### Step 1: Generate Self Client

```bash
# Go to: https://api-console.zoho.com/
# Click: Self Client -> Create
# Copy the code immediately (expires in 3 minutes)
```

### Step 2: Generate Tokens

```bash
curl -X POST "https://accounts.zoho.com/oauth/v2/token" \
  -d "code=YOUR_CODE" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "grant_type=authorization_code"
```

**Response**:
```json
{
  "access_token": "1000.abc123...",
  "refresh_token": "1000.def456...",
  "expires_in": 3600
}
```

### Step 3: Save Refresh Token

```javascript
// IMPORTANT: Save refresh_token securely
// It never expires (unless revoked)
const REFRESH_TOKEN = "1000.def456...";
```

---

## Token Refresh (Every Hour)

### JavaScript

```javascript
const axios = require('axios');

async function refreshAccessToken() {
  const response = await axios.post('https://accounts.zoho.com/oauth/v2/token', null, {
    params: {
      refresh_token: process.env.ZOHO_REFRESH_TOKEN,
      client_id: process.env.ZOHO_CLIENT_ID,
      client_secret: process.env.ZOHO_CLIENT_SECRET,
      grant_type: 'refresh_token'
    }
  });

  return response.data.access_token;
}

// Auto-refresh before expiry
class TokenManager {
  constructor() {
    this.accessToken = null;
    this.expiresAt = 0;
  }

  async getToken() {
    // Refresh 5 minutes before expiry
    if (Date.now() >= this.expiresAt - 300000) {
      this.accessToken = await refreshAccessToken();
      this.expiresAt = Date.now() + 3600000; // 1 hour
    }
    return this.accessToken;
  }
}

const tokenManager = new TokenManager();

// Use in API calls
const token = await tokenManager.getToken();
const leads = await axios.get('https://www.zohoapis.com/crm/v8/Leads', {
  headers: { 'Authorization': `Zoho-oauthtoken ${token}` }
});
```

### Python

```python
import requests
import time

class TokenManager:
    def __init__(self, client_id, client_secret, refresh_token):
        self.client_id = client_id
        self.client_secret = client_secret
        self.refresh_token = refresh_token
        self.access_token = None
        self.expires_at = 0

    def get_token(self):
        # Refresh 5 minutes before expiry
        if time.time() >= self.expires_at - 300:
            self.refresh()
        return self.access_token

    def refresh(self):
        response = requests.post(
            'https://accounts.zoho.com/oauth/v2/token',
            params={
                'refresh_token': self.refresh_token,
                'client_id': self.client_id,
                'client_secret': self.client_secret,
                'grant_type': 'refresh_token'
            }
        )

        data = response.json()
        self.access_token = data['access_token']
        self.expires_at = time.time() + data['expires_in']

# Usage
token_manager = TokenManager(
    client_id='YOUR_CLIENT_ID',
    client_secret='YOUR_CLIENT_SECRET',
    refresh_token='YOUR_REFRESH_TOKEN'
)

# Use in API calls
token = token_manager.get_token()
response = requests.get(
    'https://www.zohoapis.com/crm/v8/Leads',
    headers={'Authorization': f'Zoho-oauthtoken {token}'}
)
```

### Bash (Simple Script)

```bash
#!/bin/bash

CLIENT_ID="your_client_id"
CLIENT_SECRET="your_client_secret"
REFRESH_TOKEN="your_refresh_token"

# Get access token
TOKEN_RESPONSE=$(curl -s -X POST "https://accounts.zoho.com/oauth/v2/token" \
  -d "refresh_token=$REFRESH_TOKEN" \
  -d "client_id=$CLIENT_ID" \
  -d "client_secret=$CLIENT_SECRET" \
  -d "grant_type=refresh_token")

# Extract access token (requires jq)
ACCESS_TOKEN=$(echo $TOKEN_RESPONSE | jq -r '.access_token')

# Use in API call
curl -X GET "https://www.zohoapis.com/crm/v8/Leads" \
  -H "Authorization: Zoho-oauthtoken $ACCESS_TOKEN"
```

---

## Scopes

### Common Scopes

```
ZohoCRM.modules.ALL
ZohoCRM.users.READ
ZohoCRM.settings.ALL
ZohoBooks.fullaccess.all
ZohoDesk.tickets.ALL
ZohoProjects.portals.ALL
ZohoCreator.data.ALL
```

### Scope Format

```
[Product].[Module/Resource].[Permission]
```

**Examples**:
- `ZohoCRM.modules.leads.READ` - Read leads only
- `ZohoCRM.modules.leads.ALL` - Full access to leads
- `ZohoCRM.modules.ALL` - All CRM modules
- `ZohoBooks.contacts.READ,ZohoBooks.invoices.CREATE` - Multiple scopes

### Scope Selection

```javascript
// Request minimum required scopes
const scopes = [
  'ZohoCRM.modules.leads.READ',
  'ZohoCRM.modules.contacts.CREATE',
  'ZohoCRM.modules.deals.UPDATE'
].join(',');

const authUrl = `https://accounts.zoho.com/oauth/v2/auth?` +
  `scope=${scopes}&` +
  `client_id=${CLIENT_ID}&` +
  `response_type=code&` +
  `redirect_uri=${REDIRECT_URI}&` +
  `access_type=offline`;
```

---

## Web-Based Authentication Flow

### Step 1: Redirect User to Authorization URL

```javascript
const authUrl =
  'https://accounts.zoho.com/oauth/v2/auth?' +
  `scope=ZohoCRM.modules.ALL&` +
  `client_id=${CLIENT_ID}&` +
  `response_type=code&` +
  `redirect_uri=${REDIRECT_URI}&` +
  `access_type=offline`;

// Redirect user to authUrl
window.location.href = authUrl;
```

### Step 2: Handle Callback

```javascript
// User returns to: https://yourapp.com/callback?code=1000.abc123...
app.get('/callback', async (req, res) => {
  const code = req.query.code;

  // Exchange code for tokens
  const response = await axios.post('https://accounts.zoho.com/oauth/v2/token', null, {
    params: {
      code: code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code'
    }
  });

  const { access_token, refresh_token } = response.data;

  // Save refresh_token to database
  await saveTokens(userId, access_token, refresh_token);

  res.send('Authorization successful!');
});
```

---

## Multi-Data Center Support

### Determine User's Data Center

```javascript
const DATA_CENTERS = {
  'accounts.zoho.com': 'https://www.zohoapis.com',      // US
  'accounts.zoho.eu': 'https://www.zohoapis.eu',        // EU
  'accounts.zoho.in': 'https://www.zohoapis.in',        // India
  'accounts.zoho.com.au': 'https://www.zohoapis.com.au', // Australia
  'accounts.zoho.jp': 'https://www.zohoapis.jp',        // Japan
  'accounts.zoho.ca': 'https://www.zohoapis.ca',        // Canada
  'accounts.zoho.com.cn': 'https://www.zohoapis.com.cn' // China
};

async function getApiDomain(accessToken) {
  // Check token against all data centers
  for (const [accountsDomain, apiDomain] of Object.entries(DATA_CENTERS)) {
    try {
      const response = await axios.get(`${apiDomain}/crm/v8/org`, {
        headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}` }
      });

      if (response.status === 200) {
        return apiDomain;
      }
    } catch (error) {
      continue;
    }
  }

  throw new Error('Unable to determine data center');
}
```

---

## Environment Variables

### .env File

```bash
# Zoho OAuth Credentials
ZOHO_CLIENT_ID=1000.ABC123XYZ789
ZOHO_CLIENT_SECRET=abc123def456ghi789jkl012
ZOHO_REFRESH_TOKEN=1000.xyz789abc123def456

# Data Center
ZOHO_API_DOMAIN=https://www.zohoapis.com

# Optional
ZOHO_REDIRECT_URI=http://localhost:3000/callback
```

### Load in Node.js

```javascript
require('dotenv').config();

const config = {
  clientId: process.env.ZOHO_CLIENT_ID,
  clientSecret: process.env.ZOHO_CLIENT_SECRET,
  refreshToken: process.env.ZOHO_REFRESH_TOKEN,
  apiDomain: process.env.ZOHO_API_DOMAIN || 'https://www.zohoapis.com'
};
```

---

## Complete Example (Node.js)

```javascript
const axios = require('axios');
require('dotenv').config();

class ZohoAPI {
  constructor() {
    this.clientId = process.env.ZOHO_CLIENT_ID;
    this.clientSecret = process.env.ZOHO_CLIENT_SECRET;
    this.refreshToken = process.env.ZOHO_REFRESH_TOKEN;
    this.apiDomain = process.env.ZOHO_API_DOMAIN || 'https://www.zohoapis.com';
    this.accessToken = null;
    this.expiresAt = 0;
  }

  async getAccessToken() {
    if (this.accessToken && Date.now() < this.expiresAt - 300000) {
      return this.accessToken;
    }

    const response = await axios.post(
      'https://accounts.zoho.com/oauth/v2/token',
      null,
      {
        params: {
          refresh_token: this.refreshToken,
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'refresh_token'
        }
      }
    );

    this.accessToken = response.data.access_token;
    this.expiresAt = Date.now() + (response.data.expires_in * 1000);

    return this.accessToken;
  }

  async request(method, endpoint, data = null) {
    const token = await this.getAccessToken();

    const config = {
      method,
      url: `${this.apiDomain}${endpoint}`,
      headers: {
        'Authorization': `Zoho-oauthtoken ${token}`,
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  }

  // Convenience methods
  async get(endpoint) {
    return this.request('GET', endpoint);
  }

  async post(endpoint, data) {
    return this.request('POST', endpoint, data);
  }

  async put(endpoint, data) {
    return this.request('PUT', endpoint, data);
  }

  async delete(endpoint) {
    return this.request('DELETE', endpoint);
  }
}

// Usage
const zoho = new ZohoAPI();

async function main() {
  // Get leads
  const leads = await zoho.get('/crm/v8/Leads?per_page=10');
  console.log('Leads:', leads.data);

  // Create contact
  const newContact = await zoho.post('/crm/v8/Contacts', {
    data: [{
      First_Name: 'John',
      Last_Name: 'Doe',
      Email: 'john@example.com'
    }]
  });
  console.log('New Contact:', newContact.data);
}

main().catch(console.error);
```

---

## Troubleshooting

### Invalid Token Error

```javascript
// Error: INVALID_TOKEN
// Solution: Refresh token

if (error.response?.data?.code === 'INVALID_TOKEN') {
  this.accessToken = null;
  this.expiresAt = 0;
  return this.request(method, endpoint, data); // Retry
}
```

### Scope Mismatch Error

```javascript
// Error: OAUTH_SCOPE_MISMATCH
// Solution: Check required scopes

if (error.response?.data?.code === 'OAUTH_SCOPE_MISMATCH') {
  console.error('Missing required scope:', error.response.data.message);
  // Re-authorize with correct scopes
}
```

### Refresh Token Expired

```
// Error: invalid_code
// Cause: Refresh token was revoked or expired
// Solution: Re-authorize application

// This happens when:
// 1. User revoked access
// 2. Password changed
// 3. Token manually revoked
// 4. Security policy change
```

---

## Security Best Practices

### 1. Never Expose Credentials

```javascript
// ❌ WRONG - Credentials in code
const CLIENT_SECRET = 'abc123def456';

// ✅ CORRECT - Environment variables
const CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
```

### 2. Store Refresh Token Securely

```javascript
// Encrypt before storing in database
const crypto = require('crypto');

function encryptToken(token) {
  const cipher = crypto.createCipher('aes-256-cbc', ENCRYPTION_KEY);
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decryptToken(encryptedToken) {
  const decipher = crypto.createDecipher('aes-256-cbc', ENCRYPTION_KEY);
  let decrypted = decipher.update(encryptedToken, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

### 3. Use HTTPS Only

```javascript
// Ensure redirect URI uses HTTPS in production
const REDIRECT_URI = process.env.NODE_ENV === 'production'
  ? 'https://yourapp.com/callback'
  : 'http://localhost:3000/callback';
```

---

## Quick Reference

### Generate Tokens

```bash
# 1. Get code from API console (Self Client)
https://api-console.zoho.com/

# 2. Exchange for tokens
curl -X POST "https://accounts.zoho.com/oauth/v2/token" \
  -d "code=CODE" \
  -d "client_id=CLIENT_ID" \
  -d "client_secret=CLIENT_SECRET" \
  -d "grant_type=authorization_code"
```

### Refresh Token

```bash
curl -X POST "https://accounts.zoho.com/oauth/v2/token" \
  -d "refresh_token=REFRESH_TOKEN" \
  -d "client_id=CLIENT_ID" \
  -d "client_secret=CLIENT_SECRET" \
  -d "grant_type=refresh_token"
```

### Use Token

```bash
curl -X GET "https://www.zohoapis.com/crm/v8/Leads" \
  -H "Authorization: Zoho-oauthtoken ACCESS_TOKEN"
```

### Revoke Token

```bash
curl -X POST "https://accounts.zoho.com/oauth/v2/token/revoke" \
  -d "token=REFRESH_TOKEN"
```

---

**Last Updated**: December 2025
