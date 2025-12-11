# Authentication Guide for Zoho APIs

## Overview

This guide provides comprehensive information on authenticating with Zoho APIs across all products. All Zoho products use OAuth 2.0 for authentication, with some variations based on your use case.

---

## Table of Contents

1. [OAuth 2.0 Fundamentals](#oauth-20-fundamentals)
2. [Registration & Setup](#registration--setup)
3. [Authentication Flows](#authentication-flows)
4. [Token Management](#token-management)
5. [Data Centers](#data-centers)
6. [Scopes Reference](#scopes-reference)
7. [Code Examples](#code-examples)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

---

## OAuth 2.0 Fundamentals

### What is OAuth 2.0?

OAuth 2.0 is an authorization framework that enables applications to obtain limited access to user accounts on Zoho services without exposing credentials.

### Key Concepts

**Client ID**: Unique identifier for your application
**Client Secret**: Secret key for your application (keep secure!)
**Authorization Code**: Temporary code exchanged for access token
**Access Token**: Token used to make API requests (expires after 1 hour)
**Refresh Token**: Long-lived token used to obtain new access tokens
**Scope**: Permissions your application requests
**Redirect URI**: URL where user is redirected after authorization

### OAuth 2.0 Flow Overview

```
1. Register Application → Obtain Client ID & Secret
         ↓
2. Request Authorization → User grants permissions
         ↓
3. Exchange Code → Receive Access Token & Refresh Token
         ↓
4. Make API Requests → Use Access Token
         ↓
5. Token Expires → Use Refresh Token to get new Access Token
```

---

## Registration & Setup

### Step 1: Register Your Application

1. Visit [Zoho API Console](https://api-console.zoho.com/)
2. Sign in with your Zoho account
3. Click "Add Client" or "GET STARTED"
4. Choose client type:
   - **Server-based Applications**: For web applications running on a server
   - **Self Client**: For server-side scripts, testing, or personal use
   - **Client-based Applications**: For mobile/desktop apps (rarely used)

### Step 2: Configure Client Details

**For Server-based Applications**:
```
Client Name: Your Application Name
Homepage URL: https://yourapp.com
Authorized Redirect URIs: https://yourapp.com/oauth/callback
```

**For Self Client**:
```
Client Name: My Integration Script
Time Duration: Choose validity period (3 mins to 10 mins)
Scope: Select required permissions
```

### Step 3: Save Credentials

After registration, you'll receive:
- **Client ID**: e.g., `1000.ABCDEFG123456`
- **Client Secret**: e.g., `abcdef1234567890abcdef1234567890`

**⚠️ IMPORTANT**: Store these securely! Never commit to version control.

```javascript
// ❌ NEVER DO THIS
const CLIENT_SECRET = 'abcdef1234567890';  // Hardcoded secret

// ✅ DO THIS INSTEAD
const CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;  // From environment
```

---

## Authentication Flows

### Flow 1: Server-Based Application (Web Apps)

**Use Case**: Web applications that run on a server with a backend

**Flow Diagram**:
```
User → Your App → Zoho Auth → User Approves → Redirect with Code
→ Your App exchanges Code → Receives Tokens → Makes API Calls
```

#### Step 1: Generate Authorization URL

```javascript
const authorizationUrl = `https://accounts.zoho.com/oauth/v2/auth?` +
  `scope=${encodeURIComponent(scope)}&` +
  `client_id=${CLIENT_ID}&` +
  `response_type=code&` +
  `access_type=offline&` +
  `redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

// Redirect user to authorizationUrl
```

**Parameters**:
- `scope`: Comma-separated list of permissions (e.g., `ZohoCRM.modules.ALL`)
- `client_id`: Your application's client ID
- `response_type`: Always `code` for server-based apps
- `access_type`: Use `offline` to receive refresh token
- `redirect_uri`: Must match registered redirect URI

**Example**:
```
https://accounts.zoho.com/oauth/v2/auth?
  scope=ZohoCRM.modules.ALL,ZohoCRM.users.READ&
  client_id=1000.ABCDEFG123456&
  response_type=code&
  access_type=offline&
  redirect_uri=https://yourapp.com/oauth/callback
```

#### Step 2: Handle Redirect & Extract Code

After user approves, Zoho redirects to your redirect_uri with code:
```
https://yourapp.com/oauth/callback?code=1000.abc123def456...&location=us&accounts-server=https://accounts.zoho.com
```

Extract the `code` parameter:

```javascript
// Express.js example
app.get('/oauth/callback', (req, res) => {
  const authCode = req.query.code;
  const location = req.query.location;  // Data center (us, eu, in, etc.)

  // Exchange code for tokens
  exchangeCodeForTokens(authCode, location);
});
```

#### Step 3: Exchange Code for Tokens

```javascript
const axios = require('axios');

async function exchangeCodeForTokens(code, location) {
  // Determine accounts server based on location
  const accountsServer = location === 'us'
    ? 'https://accounts.zoho.com'
    : `https://accounts.zoho.${location}`;

  const response = await axios.post(
    `${accountsServer}/oauth/v2/token`,
    null,
    {
      params: {
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code: code
      }
    }
  );

  const { access_token, refresh_token, api_domain, expires_in } = response.data;

  // Store tokens securely
  storeTokens({
    accessToken: access_token,
    refreshToken: refresh_token,
    apiDomain: api_domain,
    expiresIn: expires_in,
    expiresAt: Date.now() + (expires_in * 1000)
  });

  return response.data;
}
```

**Response**:
```json
{
  "access_token": "1000.xxxx.yyyy",
  "refresh_token": "1000.aaaa.bbbb",
  "api_domain": "https://www.zohoapis.com",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

### Flow 2: Self Client (Server Scripts)

**Use Case**: Server-side scripts, automation, testing, personal integrations

**Benefits**:
- Simplified flow - no user interaction needed
- Faster setup for development/testing
- Good for personal automation scripts

**Limitations**:
- Shorter validity (3-10 minutes for initial code)
- Must specify scopes upfront
- Not suitable for multi-user applications

#### Step 1: Generate Self Client Code

1. Go to [Zoho API Console](https://api-console.zoho.com/)
2. Create "Self Client"
3. Set time duration (3-10 minutes)
4. Select scopes
5. Click "Create"
6. Copy the generated code immediately (expires quickly!)

#### Step 2: Exchange Code for Tokens

```javascript
async function getSelfClientTokens(code) {
  const response = await axios.post(
    'https://accounts.zoho.com/oauth/v2/token',
    null,
    {
      params: {
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code
      }
    }
  );

  return response.data;
}
```

**Python Example**:
```python
import requests

def get_self_client_tokens(code, client_id, client_secret):
    url = 'https://accounts.zoho.com/oauth/v2/token'
    params = {
        'grant_type': 'authorization_code',
        'client_id': client_id,
        'client_secret': client_secret,
        'code': code
    }
    response = requests.post(url, params=params)
    return response.json()
```

### Flow 3: Refresh Token (Token Renewal)

**Use Case**: Renewing expired access tokens

**Important**: Access tokens expire after 1 hour. Use refresh token to get new access token.

```javascript
async function refreshAccessToken(refreshToken) {
  const response = await axios.post(
    'https://accounts.zoho.com/oauth/v2/token',
    null,
    {
      params: {
        grant_type: 'refresh_token',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: refreshToken
      }
    }
  );

  const { access_token, api_domain, expires_in } = response.data;

  // Update stored access token
  updateAccessToken({
    accessToken: access_token,
    apiDomain: api_domain,
    expiresIn: expires_in,
    expiresAt: Date.now() + (expires_in * 1000)
  });

  return access_token;
}
```

**Python Example**:
```python
def refresh_access_token(refresh_token, client_id, client_secret):
    url = 'https://accounts.zoho.com/oauth/v2/token'
    params = {
        'grant_type': 'refresh_token',
        'client_id': client_id,
        'client_secret': client_secret,
        'refresh_token': refresh_token
    }
    response = requests.post(url, params=params)
    tokens = response.json()
    return tokens['access_token']
```

**Response**:
```json
{
  "access_token": "1000.new_token_here",
  "api_domain": "https://www.zohoapis.com",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

**⚠️ Note**: Refresh token is NOT returned in refresh response. Store the original refresh token - it doesn't expire.

---

## Token Management

### Token Lifecycle

```
Access Token:  ⏰ Expires after 1 hour
Refresh Token: ♾️ Never expires (store securely!)
```

### Secure Token Storage

#### Database Storage (Recommended)

```javascript
// Example schema
CREATE TABLE oauth_tokens (
  user_id VARCHAR(255) PRIMARY KEY,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  api_domain VARCHAR(255) NOT NULL,
  expires_at BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

```javascript
// Store tokens
async function storeTokens(userId, tokens) {
  await db.query(
    'INSERT INTO oauth_tokens (user_id, access_token, refresh_token, api_domain, expires_at) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE access_token = ?, expires_at = ?, updated_at = NOW()',
    [userId, tokens.accessToken, tokens.refreshToken, tokens.apiDomain, tokens.expiresAt, tokens.accessToken, tokens.expiresAt]
  );
}

// Retrieve tokens
async function getTokens(userId) {
  const [rows] = await db.query(
    'SELECT * FROM oauth_tokens WHERE user_id = ?',
    [userId]
  );
  return rows[0];
}
```

#### Environment Variables (For Development)

```bash
# .env file
ZOHO_CLIENT_ID=1000.ABCDEFG123456
ZOHO_CLIENT_SECRET=abcdef1234567890abcdef1234567890
ZOHO_REFRESH_TOKEN=1000.refresh_token_here
ZOHO_API_DOMAIN=https://www.zohoapis.com
```

```javascript
require('dotenv').config();

const config = {
  clientId: process.env.ZOHO_CLIENT_ID,
  clientSecret: process.env.ZOHO_CLIENT_SECRET,
  refreshToken: process.env.ZOHO_REFRESH_TOKEN,
  apiDomain: process.env.ZOHO_API_DOMAIN
};
```

#### Encryption (Additional Security)

```javascript
const crypto = require('crypto');

function encryptToken(token, secretKey) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decryptToken(encryptedToken, secretKey) {
  const parts = encryptedToken.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

### Automatic Token Refresh

```javascript
class ZohoAuthManager {
  constructor(clientId, clientSecret, refreshToken) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.refreshToken = refreshToken;
    this.accessToken = null;
    this.expiresAt = 0;
  }

  async getAccessToken() {
    // Check if current token is valid
    if (this.accessToken && Date.now() < this.expiresAt - 300000) {  // 5 min buffer
      return this.accessToken;
    }

    // Refresh token
    const tokens = await this.refreshAccessToken();
    this.accessToken = tokens.access_token;
    this.expiresAt = Date.now() + (tokens.expires_in * 1000);

    return this.accessToken;
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

    return response.data;
  }

  async makeAuthenticatedRequest(url, options = {}) {
    const accessToken = await this.getAccessToken();

    return axios({
      url,
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    });
  }
}

// Usage
const authManager = new ZohoAuthManager(CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN);

// Automatically handles token refresh
const leads = await authManager.makeAuthenticatedRequest(
  'https://www.zohoapis.com/crm/v8/Leads'
);
```

**Python Example**:
```python
import time
import requests

class ZohoAuthManager:
    def __init__(self, client_id, client_secret, refresh_token):
        self.client_id = client_id
        self.client_secret = client_secret
        self.refresh_token = refresh_token
        self.access_token = None
        self.expires_at = 0

    def get_access_token(self):
        # Check if current token is valid (with 5 min buffer)
        if self.access_token and time.time() < (self.expires_at - 300):
            return self.access_token

        # Refresh token
        tokens = self.refresh_access_token()
        self.access_token = tokens['access_token']
        self.expires_at = time.time() + tokens['expires_in']

        return self.access_token

    def refresh_access_token(self):
        url = 'https://accounts.zoho.com/oauth/v2/token'
        params = {
            'grant_type': 'refresh_token',
            'client_id': self.client_id,
            'client_secret': self.client_secret,
            'refresh_token': self.refresh_token
        }
        response = requests.post(url, params=params)
        return response.json()

    def make_authenticated_request(self, url, method='GET', **kwargs):
        access_token = self.get_access_token()

        headers = kwargs.get('headers', {})
        headers['Authorization'] = f'Zoho-oauthtoken {access_token}'
        kwargs['headers'] = headers

        return requests.request(method, url, **kwargs)

# Usage
auth_manager = ZohoAuthManager(CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN)

# Automatically handles token refresh
response = auth_manager.make_authenticated_request(
    'https://www.zohoapis.com/crm/v8/Leads'
)
leads = response.json()
```

---

## Data Centers

Zoho operates in multiple data centers. Use the correct base URL for your account's data center.

### Data Center URLs

| Data Center | Location | Accounts Server | API Base URL |
|-------------|----------|-----------------|--------------|
| **US** | United States | https://accounts.zoho.com | https://www.zohoapis.com |
| **EU** | Europe | https://accounts.zoho.eu | https://www.zohoapis.eu |
| **IN** | India | https://accounts.zoho.in | https://www.zohoapis.in |
| **AU** | Australia | https://accounts.zoho.com.au | https://www.zohoapis.com.au |
| **JP** | Japan | https://accounts.zoho.jp | https://www.zohoapis.jp |
| **CA** | Canada | https://accounts.zohocloud.ca | https://www.zohoapis.ca |
| **CN** | China | https://accounts.zoho.com.cn | https://www.zohoapis.com.cn |
| **SA** | Saudi Arabia | https://accounts.zoho.sa | https://www.zohoapis.sa |

### Determining Data Center

The `api_domain` is returned in the token response:

```json
{
  "access_token": "1000.xxxx.yyyy",
  "api_domain": "https://www.zohoapis.eu",  // Use this for API calls
  "...": "..."
}
```

**Always use the returned `api_domain`** for API requests.

### Multi-Data Center Support

```javascript
class MultiDataCenterAuthManager {
  constructor(clientId, clientSecret) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.userTokens = new Map();  // userId -> tokens
  }

  async authenticateUser(userId, authCode, location) {
    const accountsServer = this.getAccountsServer(location);

    const response = await axios.post(
      `${accountsServer}/oauth/v2/token`,
      null,
      {
        params: {
          grant_type: 'authorization_code',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code: authCode,
          redirect_uri: REDIRECT_URI
        }
      }
    );

    this.userTokens.set(userId, {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      apiDomain: response.data.api_domain,
      accountsServer: accountsServer,
      expiresAt: Date.now() + (response.data.expires_in * 1000)
    });

    return response.data;
  }

  getAccountsServer(location) {
    const servers = {
      'us': 'https://accounts.zoho.com',
      'eu': 'https://accounts.zoho.eu',
      'in': 'https://accounts.zoho.in',
      'au': 'https://accounts.zoho.com.au',
      'jp': 'https://accounts.zoho.jp',
      'ca': 'https://accounts.zohocloud.ca',
      'cn': 'https://accounts.zoho.com.cn',
      'sa': 'https://accounts.zoho.sa'
    };
    return servers[location] || servers['us'];
  }

  async getAccessToken(userId) {
    const tokens = this.userTokens.get(userId);
    if (!tokens) throw new Error('User not authenticated');

    // Check if token needs refresh
    if (Date.now() >= tokens.expiresAt - 300000) {
      await this.refreshUserToken(userId);
    }

    return this.userTokens.get(userId).accessToken;
  }

  async refreshUserToken(userId) {
    const tokens = this.userTokens.get(userId);

    const response = await axios.post(
      `${tokens.accountsServer}/oauth/v2/token`,
      null,
      {
        params: {
          grant_type: 'refresh_token',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: tokens.refreshToken
        }
      }
    );

    tokens.accessToken = response.data.access_token;
    tokens.expiresAt = Date.now() + (response.data.expires_in * 1000);
    this.userTokens.set(userId, tokens);
  }
}
```

---

## Scopes Reference

### Common Scopes Across Products

| Scope | Description | Products |
|-------|-------------|----------|
| `{Product}.modules.ALL` | Full access to all modules | CRM, Recruit, etc. |
| `{Product}.modules.READ` | Read-only access to modules | CRM, Recruit, etc. |
| `{Product}.modules.CREATE` | Create records | CRM, Recruit, etc. |
| `{Product}.modules.UPDATE` | Update records | CRM, Recruit, etc. |
| `{Product}.modules.DELETE` | Delete records | CRM, Recruit, etc. |
| `{Product}.settings.ALL` | Access to settings | CRM, Desk, etc. |
| `{Product}.users.READ` | Read user information | Most products |
| `{Product}.files.READ` | Read files/attachments | CRM, Desk, Creator |

### Product-Specific Scopes

#### Zoho CRM
```
ZohoCRM.modules.ALL              // Full access to all modules
ZohoCRM.modules.leads.ALL        // Full access to Leads module
ZohoCRM.modules.contacts.READ    // Read-only access to Contacts
ZohoCRM.modules.deals.CREATE     // Create Deals
ZohoCRM.settings.ALL             // Access to settings
ZohoCRM.users.READ               // Read user info
ZohoCRM.org.READ                 // Read org info
ZohoCRM.coql.READ                // Execute COQL queries
ZohoCRM.bulk.READ                // Bulk read operations
ZohoCRM.bulk.CREATE              // Bulk create operations
ZohoCRM.notifications.ALL        // Webhook notifications
```

#### Zoho Books
```
ZohoBooks.fullaccess.all         // Full access
ZohoBooks.contacts.READ          // Read contacts
ZohoBooks.contacts.CREATE        // Create contacts
ZohoBooks.invoices.ALL           // Full invoice access
ZohoBooks.bills.READ             // Read bills
ZohoBooks.banking.READ           // Read banking data
```

#### Zoho Desk
```
Desk.tickets.ALL                 // Full ticket access
Desk.tickets.READ                // Read tickets
Desk.tickets.CREATE              // Create tickets
Desk.contacts.ALL                // Full contact access
Desk.basic.READ                  // Basic read access
Desk.search.READ                 // Search tickets
```

#### Zoho Creator
```
ZohoCreator.report.READ          // Read reports
ZohoCreator.report.CREATE        // Create records
ZohoCreator.report.UPDATE        // Update records
ZohoCreator.report.DELETE        // Delete records
ZohoCreator.meta.application.READ  // Read app metadata
```

### Scope Best Practices

1. **Principle of Least Privilege**: Request only the scopes you need
   ```javascript
   // ❌ Too broad
   const scope = 'ZohoCRM.modules.ALL';

   // ✅ Specific to needs
   const scope = 'ZohoCRM.modules.leads.READ,ZohoCRM.modules.leads.CREATE';
   ```

2. **Separate Read/Write Scopes**: If you only read data, don't request write access

3. **Product-Specific Scopes**: Some products use different naming (e.g., `ZohoBooks.fullaccess.all` vs `ZohoCRM.modules.ALL`)

4. **Comma-Separated**: Multiple scopes are comma-separated
   ```javascript
   const scope = 'ZohoCRM.modules.leads.ALL,ZohoCRM.modules.contacts.READ,ZohoCRM.users.READ';
   ```

---

## Code Examples

### Complete Authentication Implementation (Node.js)

```javascript
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();

const CLIENT_ID = process.env.ZOHO_CLIENT_ID;
const CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/oauth/callback';
const SCOPE = 'ZohoCRM.modules.ALL,ZohoCRM.users.READ';

// In-memory token storage (use database in production!)
let tokens = null;

// Step 1: Initiate OAuth flow
app.get('/auth', (req, res) => {
  const authUrl = `https://accounts.zoho.com/oauth/v2/auth?` +
    `scope=${encodeURIComponent(SCOPE)}&` +
    `client_id=${CLIENT_ID}&` +
    `response_type=code&` +
    `access_type=offline&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

  res.redirect(authUrl);
});

// Step 2: Handle OAuth callback
app.get('/oauth/callback', async (req, res) => {
  const { code, location } = req.query;

  if (!code) {
    return res.status(400).send('Authorization code not received');
  }

  try {
    // Exchange code for tokens
    const accountsServer = location === 'us'
      ? 'https://accounts.zoho.com'
      : `https://accounts.zoho.${location}`;

    const response = await axios.post(
      `${accountsServer}/oauth/v2/token`,
      null,
      {
        params: {
          grant_type: 'authorization_code',
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          redirect_uri: REDIRECT_URI,
          code: code
        }
      }
    );

    tokens = {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      apiDomain: response.data.api_domain,
      expiresAt: Date.now() + (response.data.expires_in * 1000)
    };

    res.send('Authentication successful! You can now make API calls.');
  } catch (error) {
    console.error('Error exchanging code:', error.response?.data || error.message);
    res.status(500).send('Authentication failed');
  }
});

// Step 3: Make API request
app.get('/leads', async (req, res) => {
  if (!tokens) {
    return res.status(401).send('Not authenticated. Visit /auth to authenticate.');
  }

  try {
    // Check if token needs refresh
    if (Date.now() >= tokens.expiresAt - 300000) {
      await refreshAccessToken();
    }

    // Make API request
    const response = await axios.get(
      `${tokens.apiDomain}/crm/v8/Leads`,
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${tokens.accessToken}`
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching leads:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// Helper: Refresh access token
async function refreshAccessToken() {
  const response = await axios.post(
    'https://accounts.zoho.com/oauth/v2/token',
    null,
    {
      params: {
        grant_type: 'refresh_token',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: tokens.refreshToken
      }
    }
  );

  tokens.accessToken = response.data.access_token;
  tokens.expiresAt = Date.now() + (response.data.expires_in * 1000);
}

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
  console.log('Visit http://localhost:3000/auth to authenticate');
});
```

### Complete Authentication Implementation (Python/Flask)

```python
from flask import Flask, request, redirect, jsonify
import requests
import time
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

CLIENT_ID = os.getenv('ZOHO_CLIENT_ID')
CLIENT_SECRET = os.getenv('ZOHO_CLIENT_SECRET')
REDIRECT_URI = 'http://localhost:5000/oauth/callback'
SCOPE = 'ZohoCRM.modules.ALL,ZohoCRM.users.READ'

# In-memory token storage (use database in production!)
tokens = None

# Step 1: Initiate OAuth flow
@app.route('/auth')
def auth():
    auth_url = f'https://accounts.zoho.com/oauth/v2/auth?' \
               f'scope={SCOPE}&' \
               f'client_id={CLIENT_ID}&' \
               f'response_type=code&' \
               f'access_type=offline&' \
               f'redirect_uri={REDIRECT_URI}'
    return redirect(auth_url)

# Step 2: Handle OAuth callback
@app.route('/oauth/callback')
def oauth_callback():
    global tokens

    code = request.args.get('code')
    location = request.args.get('location', 'us')

    if not code:
        return 'Authorization code not received', 400

    try:
        # Exchange code for tokens
        accounts_server = 'https://accounts.zoho.com' if location == 'us' \
                         else f'https://accounts.zoho.{location}'

        response = requests.post(
            f'{accounts_server}/oauth/v2/token',
            params={
                'grant_type': 'authorization_code',
                'client_id': CLIENT_ID,
                'client_secret': CLIENT_SECRET,
                'redirect_uri': REDIRECT_URI,
                'code': code
            }
        )

        data = response.json()

        tokens = {
            'access_token': data['access_token'],
            'refresh_token': data['refresh_token'],
            'api_domain': data['api_domain'],
            'expires_at': time.time() + data['expires_in']
        }

        return 'Authentication successful! You can now make API calls.'
    except Exception as e:
        print(f'Error exchanging code: {e}')
        return 'Authentication failed', 500

# Step 3: Make API request
@app.route('/leads')
def get_leads():
    if not tokens:
        return 'Not authenticated. Visit /auth to authenticate.', 401

    try:
        # Check if token needs refresh
        if time.time() >= (tokens['expires_at'] - 300):
            refresh_access_token()

        # Make API request
        response = requests.get(
            f"{tokens['api_domain']}/crm/v8/Leads",
            headers={
                'Authorization': f"Zoho-oauthtoken {tokens['access_token']}"
            }
        )

        return jsonify(response.json())
    except Exception as e:
        print(f'Error fetching leads: {e}')
        return jsonify({'error': 'Failed to fetch leads'}), 500

# Helper: Refresh access token
def refresh_access_token():
    global tokens

    response = requests.post(
        'https://accounts.zoho.com/oauth/v2/token',
        params={
            'grant_type': 'refresh_token',
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
            'refresh_token': tokens['refresh_token']
        }
    )

    data = response.json()
    tokens['access_token'] = data['access_token']
    tokens['expires_at'] = time.time() + data['expires_in']

if __name__ == '__main__':
    print('Server running on http://localhost:5000')
    print('Visit http://localhost:5000/auth to authenticate')
    app.run(port=5000, debug=True)
```

### Deluge Authentication

Deluge handles authentication automatically when you configure connections:

```javascript
// No explicit OAuth needed - Deluge handles it

// Create connection in Zoho Creator/CRM
// Then use zoho.crm.* or zoho.books.* functions

// Example: Get CRM leads
leads = zoho.crm.getRecords("Leads", 1, 200);

for each lead in leads
{
    info lead.get("First_Name") + " " + lead.get("Last_Name");
}

// Example: Create Books invoice
invoiceData = {
    "customer_id": "12345000000123456",
    "line_items": [
        {
            "item_id": "12345000000234567",
            "quantity": 2
        }
    ]
};

response = zoho.books.createRecord("Invoices", "YOUR_ORG_ID", invoiceData);
info response;
```

---

## Best Practices

### 1. Security

**Never Hardcode Credentials**:
```javascript
// ❌ NEVER
const CLIENT_SECRET = 'abcdef1234567890';

// ✅ DO THIS
const CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
```

**Use Environment Variables**:
```bash
# .env
ZOHO_CLIENT_ID=your_client_id
ZOHO_CLIENT_SECRET=your_client_secret
ZOHO_REFRESH_TOKEN=your_refresh_token
```

**Encrypt Tokens at Rest**:
- Use database encryption
- Consider application-level encryption for sensitive tokens

**Use HTTPS Only**:
- Always use HTTPS for redirect URIs
- Never transmit tokens over HTTP

### 2. Token Management

**Implement Automatic Refresh**:
- Don't wait for 401 errors
- Refresh proactively before expiration
- Use 5-minute buffer before actual expiration

**Store Refresh Token Securely**:
- Never expose to client-side code
- Store in secure database with encryption
- Never log refresh tokens

**Handle Token Expiration Gracefully**:
```javascript
async function makeAuthenticatedRequest(url, options) {
  try {
    return await axios({
      url,
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Zoho-oauthtoken ${await getAccessToken()}`
      }
    });
  } catch (error) {
    if (error.response?.status === 401) {
      // Token expired, refresh and retry
      await refreshAccessToken();
      return makeAuthenticatedRequest(url, options);
    }
    throw error;
  }
}
```

### 3. Error Handling

**Handle Common OAuth Errors**:
```javascript
try {
  const tokens = await exchangeCodeForTokens(code);
} catch (error) {
  if (error.response) {
    const { error: errorCode, error_description } = error.response.data;

    switch (errorCode) {
      case 'invalid_code':
        // Code expired or already used
        // Restart OAuth flow
        break;

      case 'invalid_client':
        // Wrong client ID or secret
        // Check credentials
        break;

      case 'invalid_grant':
        // Refresh token revoked
        // User needs to re-authorize
        break;

      default:
        console.error('OAuth error:', errorCode, error_description);
    }
  }
}
```

### 4. Multi-User Applications

**Separate Tokens Per User**:
```javascript
// Store tokens per user
const userTokens = new Map();

async function getUserAccessToken(userId) {
  const tokens = userTokens.get(userId);
  if (!tokens) {
    throw new Error('User not authenticated');
  }

  // Check expiration and refresh if needed
  if (Date.now() >= tokens.expiresAt - 300000) {
    await refreshUserToken(userId);
  }

  return userTokens.get(userId).accessToken;
}
```

**Handle Data Center Differences**:
```javascript
// Store API domain per user
const user1Tokens = {
  apiDomain: 'https://www.zohoapis.com',  // US
  // ...
};

const user2Tokens = {
  apiDomain: 'https://www.zohoapis.eu',  // EU
  // ...
};
```

### 5. Testing

**Use Self Client for Development**:
- Faster setup
- No browser interaction needed
- Good for automated tests

**Separate Development/Production Clients**:
- Use different OAuth clients for dev/prod
- Prevents accidental production data access

---

## Troubleshooting

### Common Errors

#### Error: `invalid_code`

**Cause**: Authorization code expired or already used

**Solution**: Authorization codes expire quickly (usually within 3-10 minutes). Generate a new code and exchange immediately.

#### Error: `invalid_client`

**Cause**: Wrong client ID or client secret

**Solution**: Verify credentials match those in API Console. Check for extra spaces or incorrect copy/paste.

#### Error: `invalid_grant`

**Cause**: Refresh token revoked or expired (for self-client)

**Solution**: User needs to re-authorize. Re-initiate OAuth flow.

#### Error: `redirect_uri_mismatch`

**Cause**: Redirect URI in request doesn't match registered URI

**Solution**: Ensure exact match including protocol (http vs https), port, and path.

```javascript
// ❌ Mismatch
Registered: https://yourapp.com/callback
Used:       https://yourapp.com/oauth/callback

// ✅ Must match exactly
Registered: https://yourapp.com/oauth/callback
Used:       https://yourapp.com/oauth/callback
```

#### Error: `access_denied`

**Cause**: User denied authorization

**Solution**: Handle gracefully in your app. Allow user to retry or provide alternative flow.

### Debugging Tips

**Log OAuth Responses** (without sensitive data):
```javascript
const response = await exchangeCodeForTokens(code);
console.log('Token exchange successful:', {
  expiresIn: response.expires_in,
  apiDomain: response.api_domain,
  hasAccessToken: !!response.access_token,
  hasRefreshToken: !!response.refresh_token
});
```

**Test with Postman**:
- Create Postman collection for OAuth flow
- Test token exchange manually
- Verify scopes and permissions

**Check API Console**:
- Verify client configuration
- Check redirect URIs
- Verify scopes are enabled

**Use curl for Testing**:
```bash
# Test token refresh
curl -X POST "https://accounts.zoho.com/oauth/v2/token" \
  -d "grant_type=refresh_token" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "refresh_token=YOUR_REFRESH_TOKEN"
```

---

## Additional Resources

- [Zoho OAuth Documentation](https://www.zoho.com/accounts/protocol/oauth.html)
- [Zoho API Console](https://api-console.zoho.com/)
- [Zoho Developer Forums](https://help.zoho.com/portal/en/community/)

---

**Last Updated**: December 2025
**Guide Version**: 1.0
