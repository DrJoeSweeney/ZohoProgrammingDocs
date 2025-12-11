# Zoho Vault API Reference

## Overview

Zoho Vault is a secure password management solution for businesses and teams. The API provides programmatic access to passwords, secrets, chambers (password groups), user management, and secure sharing capabilities.

**Current API Version**: v1
**Base URL**: `https://vault.zoho.com/api/json/`
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

### 1. Secrets (Passwords)
**Purpose**: Manage passwords and secure credentials

**Endpoints**:
```http
GET    /secrets                           # List all secrets
GET    /secrets/{secret_id}               # Get secret details
POST   /secrets                           # Create secret
PUT    /secrets/{secret_id}               # Update secret
DELETE /secrets/{secret_id}               # Delete secret
GET    /secrets/{secret_id}/password      # Get password value
POST   /secrets/{secret_id}/share         # Share secret
GET    /secrets/search                    # Search secrets
```

**Secret Types**:
- Login (Website credentials)
- Server
- Database
- Document
- Note
- Credit Card
- Bank Account
- SSH Key
- Custom

**Secret Fields**:
- `secretname` - Name of the secret (required)
- `secreturl` - Associated URL
- `username` - Username/login
- `password` - Password value
- `notes` - Additional notes
- `customfields` - Custom field values
- `chamberid` - Chamber (folder) ID
- `secrettype` - Type of secret

**Example - Create Secret**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const createSecret = async (accessToken) => {
  const response = await axios.post(
    'https://vault.zoho.com/api/json/secrets',
    {
      operation: {
        name: 'ADD_SECRET'
      },
      data: {
        secretname: 'Production Database',
        secreturl: 'db.production.company.com',
        username: 'db_admin',
        password: 'SecureP@ssw0rd!123',
        notes: 'Main production database credentials',
        secrettype: 'Database',
        chamberid: '123456000000123456'
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

def create_secret(access_token):
    url = 'https://vault.zoho.com/api/json/secrets'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'operation': {
            'name': 'ADD_SECRET'
        },
        'data': {
            'secretname': 'Production Database',
            'secreturl': 'db.production.company.com',
            'username': 'db_admin',
            'password': 'SecureP@ssw0rd!123',
            'notes': 'Main production database credentials',
            'secrettype': 'Database',
            'chamberid': '123456000000123456'
        }
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

```deluge
// Deluge
secret_data = {
    "operation": {
        "name": "ADD_SECRET"
    },
    "data": {
        "secretname": "Production Database",
        "secreturl": "db.production.company.com",
        "username": "db_admin",
        "password": "SecureP@ssw0rd!123",
        "notes": "Main production database credentials",
        "secrettype": "Database",
        "chamberid": "123456000000123456"
    }
};

response = invokeurl
[
    url: "https://vault.zoho.com/api/json/secrets"
    type: POST
    parameters: secret_data.toString()
    connection: "zoho_oauth"
];
info response;
```

**Response**:
```json
{
  "operation": {
    "name": "ADD_SECRET",
    "result": {
      "status": "success"
    },
    "details": {
      "secretid": "123456000000234567",
      "secretname": "Production Database",
      "secreturl": "db.production.company.com",
      "username": "db_admin",
      "secrettype": "Database",
      "chamberid": "123456000000123456",
      "createdtime": "2025-01-15T10:30:00Z",
      "modifiedtime": "2025-01-15T10:30:00Z"
    }
  }
}
```

**Example - Get Secret Password**:
```javascript
// JavaScript/Node.js
const getSecretPassword = async (accessToken, secretId) => {
  const response = await axios.get(
    `https://vault.zoho.com/api/json/secrets/${secretId}/password`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data.operation.details.password;
};
```

**Example - Update Secret**:
```javascript
// JavaScript/Node.js
const updateSecret = async (accessToken, secretId) => {
  const response = await axios.put(
    `https://vault.zoho.com/api/json/secrets/${secretId}`,
    {
      operation: {
        name: 'UPDATE_SECRET'
      },
      data: {
        secretname: 'Production Database - Updated',
        password: 'NewSecureP@ssw0rd!456',
        notes: 'Password updated on 2025-01-15'
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

### 2. Chambers
**Purpose**: Organize secrets into folders/groups

**Endpoints**:
```http
GET    /chambers                    # List all chambers
GET    /chambers/{chamber_id}       # Get chamber details
POST   /chambers                    # Create chamber
PUT    /chambers/{chamber_id}       # Update chamber
DELETE /chambers/{chamber_id}       # Delete chamber
GET    /chambers/{chamber_id}/secrets # Get secrets in chamber
```

**Chamber Types**:
- Personal Chamber (default user chamber)
- Shared Chamber (team shared)
- Custom Chamber

**Example - Create Chamber**:
```javascript
// JavaScript/Node.js
const createChamber = async (accessToken) => {
  const response = await axios.post(
    'https://vault.zoho.com/api/json/chambers',
    {
      operation: {
        name: 'ADD_CHAMBER'
      },
      data: {
        chambername: 'Production Servers',
        chambertype: 'Shared',
        description: 'Credentials for all production servers'
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
def create_chamber(access_token):
    url = 'https://vault.zoho.com/api/json/chambers'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'operation': {
            'name': 'ADD_CHAMBER'
        },
        'data': {
            'chambername': 'Production Servers',
            'chambertype': 'Shared',
            'description': 'Credentials for all production servers'
        }
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

**Response**:
```json
{
  "operation": {
    "name": "ADD_CHAMBER",
    "result": {
      "status": "success"
    },
    "details": {
      "chamberid": "123456000000345678",
      "chambername": "Production Servers",
      "chambertype": "Shared",
      "description": "Credentials for all production servers",
      "createdtime": "2025-01-15T10:30:00Z"
    }
  }
}
```

**Example - Get Secrets in Chamber**:
```javascript
// JavaScript/Node.js
const getChamberSecrets = async (accessToken, chamberId) => {
  const response = await axios.get(
    `https://vault.zoho.com/api/json/chambers/${chamberId}/secrets`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data.operation.details;
};
```

---

### 3. Secret Sharing
**Purpose**: Share secrets securely with users and groups

**Endpoints**:
```http
POST   /secrets/{secret_id}/share         # Share secret
DELETE /secrets/{secret_id}/share         # Revoke sharing
GET    /secrets/{secret_id}/shareinfo     # Get sharing details
POST   /secrets/{secret_id}/transferownership # Transfer ownership
```

**Share Permissions**:
- `READ` - View secret details and password
- `WRITE` - Edit secret
- `SHARE` - Share with others
- `OWNER` - Full control

**Example - Share Secret**:
```javascript
// JavaScript/Node.js
const shareSecret = async (accessToken, secretId) => {
  const response = await axios.post(
    `https://vault.zoho.com/api/json/secrets/${secretId}/share`,
    {
      operation: {
        name: 'SHARE_SECRET'
      },
      data: {
        users: [
          {
            emailid: 'colleague@company.com',
            permissions: ['READ']
          },
          {
            emailid: 'manager@company.com',
            permissions: ['READ', 'WRITE', 'SHARE']
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

```python
# Python
def share_secret(access_token, secret_id):
    url = f'https://vault.zoho.com/api/json/secrets/{secret_id}/share'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'operation': {
            'name': 'SHARE_SECRET'
        },
        'data': {
            'users': [
                {
                    'emailid': 'colleague@company.com',
                    'permissions': ['READ']
                },
                {
                    'emailid': 'manager@company.com',
                    'permissions': ['READ', 'WRITE', 'SHARE']
                }
            ]
        }
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

**Example - Revoke Sharing**:
```javascript
// JavaScript/Node.js
const revokeSharing = async (accessToken, secretId, emailId) => {
  const response = await axios.delete(
    `https://vault.zoho.com/api/json/secrets/${secretId}/share`,
    {
      data: {
        operation: {
          name: 'REVOKE_SHARE'
        },
        data: {
          emailid: emailId
        }
      },
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

### 4. Users
**Purpose**: Manage Vault users and access

**Endpoints**:
```http
GET    /users                      # List all users
GET    /users/{user_id}            # Get user details
POST   /users                      # Add user
PUT    /users/{user_id}            # Update user
DELETE /users/{user_id}            # Remove user
GET    /users/current              # Get current user
```

**User Roles**:
- Administrator
- User
- Manager
- Read-Only

**Example - Get Current User**:
```javascript
// JavaScript/Node.js
const getCurrentUser = async (accessToken) => {
  const response = await axios.get(
    'https://vault.zoho.com/api/json/users/current',
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data.operation.details;
};
```

**Example - Add User to Vault**:
```python
# Python
def add_user(access_token):
    url = 'https://vault.zoho.com/api/json/users'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'operation': {
            'name': 'ADD_USER'
        },
        'data': {
            'emailid': 'newuser@company.com',
            'role': 'User',
            'firstname': 'John',
            'lastname': 'Doe'
        }
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

---

### 5. Groups
**Purpose**: Organize users into groups for easier sharing

**Endpoints**:
```http
GET    /groups                     # List all groups
GET    /groups/{group_id}          # Get group details
POST   /groups                     # Create group
PUT    /groups/{group_id}          # Update group
DELETE /groups/{group_id}          # Delete group
POST   /groups/{group_id}/users    # Add users to group
DELETE /groups/{group_id}/users    # Remove users from group
```

**Example - Create Group**:
```javascript
// JavaScript/Node.js
const createGroup = async (accessToken) => {
  const response = await axios.post(
    'https://vault.zoho.com/api/json/groups',
    {
      operation: {
        name: 'ADD_GROUP'
      },
      data: {
        groupname: 'DevOps Team',
        description: 'DevOps and infrastructure team members',
        members: [
          'devops1@company.com',
          'devops2@company.com',
          'devops3@company.com'
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

---

### 6. Password Generator
**Purpose**: Generate secure random passwords

**Endpoints**:
```http
GET /password/generate  # Generate password
```

**Query Parameters**:
- `length` - Password length (default: 12)
- `uppercase` - Include uppercase letters (true/false)
- `lowercase` - Include lowercase letters (true/false)
- `numbers` - Include numbers (true/false)
- `symbols` - Include special characters (true/false)

**Example - Generate Password**:
```javascript
// JavaScript/Node.js
const generatePassword = async (accessToken) => {
  const response = await axios.get(
    'https://vault.zoho.com/api/json/password/generate',
    {
      params: {
        length: 16,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true
      },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data.operation.details.password;
};
```

```python
# Python
def generate_password(access_token):
    url = 'https://vault.zoho.com/api/json/password/generate'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'length': 16,
        'uppercase': True,
        'lowercase': True,
        'numbers': True,
        'symbols': True
    }
    response = requests.get(url, headers=headers, params=params)
    return response.json()['operation']['details']['password']
```

---

### 7. Audit Trail
**Purpose**: Track secret access and modifications

**Endpoints**:
```http
GET /secrets/{secret_id}/audit  # Get secret audit log
GET /audit                       # Get all audit logs
```

**Audit Event Types**:
- Secret Created
- Secret Updated
- Secret Deleted
- Secret Accessed
- Secret Shared
- Secret Unshared
- Password Viewed
- Password Copied

**Example - Get Secret Audit Log**:
```javascript
// JavaScript/Node.js
const getSecretAudit = async (accessToken, secretId) => {
  const response = await axios.get(
    `https://vault.zoho.com/api/json/secrets/${secretId}/audit`,
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
  return response.data.operation.details.auditlogs;
};
```

---

### 8. Search
**Purpose**: Search for secrets across chambers

**Endpoints**:
```http
GET /secrets/search  # Search secrets
```

**Query Parameters**:
- `searchtext` - Text to search
- `secrettype` - Filter by secret type
- `chamberid` - Filter by chamber
- `username` - Filter by username
- `secreturl` - Filter by URL

**Example - Search Secrets**:
```javascript
// JavaScript/Node.js
const searchSecrets = async (accessToken, searchTerm) => {
  const response = await axios.get(
    'https://vault.zoho.com/api/json/secrets/search',
    {
      params: {
        searchtext: searchTerm,
        secrettype: 'Database'
      },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data.operation.details.secrets;
};
```

```python
# Python
def search_secrets(access_token, search_term):
    url = 'https://vault.zoho.com/api/json/secrets/search'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'searchtext': search_term,
        'secrettype': 'Database'
    }
    response = requests.get(url, headers=headers, params=params)
    return response.json()['operation']['details']['secrets']
```

---

### 9. Emergency Access
**Purpose**: Grant temporary emergency access to secrets

**Endpoints**:
```http
POST   /secrets/{secret_id}/emergency  # Grant emergency access
DELETE /secrets/{secret_id}/emergency  # Revoke emergency access
GET    /emergency/requests              # Get emergency access requests
```

**Example - Grant Emergency Access**:
```javascript
// JavaScript/Node.js
const grantEmergencyAccess = async (accessToken, secretId) => {
  const response = await axios.post(
    `https://vault.zoho.com/api/json/secrets/${secretId}/emergency`,
    {
      operation: {
        name: 'GRANT_EMERGENCY_ACCESS'
      },
      data: {
        emailid: 'emergency@company.com',
        duration: 24, // hours
        reason: 'Production outage - need immediate database access'
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

### 10. Backup & Export
**Purpose**: Export vault data for backup

**Endpoints**:
```http
GET /export/secrets  # Export all secrets (encrypted)
GET /export/audit    # Export audit logs
```

**Example - Export Secrets**:
```javascript
// JavaScript/Node.js
const exportSecrets = async (accessToken) => {
  const response = await axios.get(
    'https://vault.zoho.com/api/json/export/secrets',
    {
      params: {
        format: 'json',
        include_passwords: false // For security, passwords are not included by default
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
  scope=ZohoVault.secrets.ALL,ZohoVault.chambers.ALL&
  client_id={client_id}&
  response_type=code&
  access_type=offline&
  redirect_uri={redirect_uri}
```

**Available Scopes**:
- `ZohoVault.secrets.ALL` - Full access to secrets
- `ZohoVault.secrets.READ` - Read-only access to secrets
- `ZohoVault.secrets.CREATE` - Create secrets
- `ZohoVault.secrets.UPDATE` - Update secrets
- `ZohoVault.secrets.DELETE` - Delete secrets
- `ZohoVault.chambers.ALL` - Full access to chambers
- `ZohoVault.chambers.READ` - Read-only access to chambers
- `ZohoVault.users.ALL` - Manage users
- `ZohoVault.users.READ` - Read user information
- `ZohoVault.audit.READ` - Read audit logs

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

**JavaScript Token Refresh Example**:
```javascript
const refreshAccessToken = async (clientId, clientSecret, refreshToken) => {
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

**Python Token Refresh Example**:
```python
import requests

def refresh_access_token(client_id, client_secret, refresh_token):
    url = 'https://accounts.zoho.com/oauth/v2/token'
    params = {
        'grant_type': 'refresh_token',
        'client_id': client_id,
        'client_secret': client_secret,
        'refresh_token': refresh_token
    }
    response = requests.post(url, params=params)
    return response.json()['access_token']
```

**Token Lifetime**:
- Access Token: 1 hour
- Refresh Token: Does not expire (store securely)

---

## Rate Limits

### API Call Limits

| Plan | API Calls per Day | API Calls per Minute |
|------|-------------------|----------------------|
| Free | 2,500 | 50 |
| Standard | 10,000 | 100 |
| Professional | 25,000 | 200 |
| Enterprise | 100,000 | 500 |

### Rate Limit Details

**Per Minute Limit**:
- Varies by plan (50-500 calls/minute)
- Resets every 60 seconds

**Daily Limit**:
- Varies by plan (2,500-100,000 calls/day)
- Resets at midnight UTC

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1673827200
```

### Handling Rate Limits

**JavaScript Example**:
```javascript
const makeRequestWithRetry = async (url, options, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await axios(url, options);
      return response.data;
    } catch (error) {
      if (error.response?.status === 429) {
        const resetTime = error.response.headers['x-ratelimit-reset'];
        const waitTime = (resetTime * 1000) - Date.now();

        if (i < maxRetries - 1) {
          console.log(`Rate limit hit. Waiting ${waitTime}ms...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
      }
      throw error;
    }
  }
};
```

**Python Example**:
```python
import time
import requests

def make_request_with_retry(url, headers, max_retries=3):
    for i in range(max_retries):
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 429:
                reset_time = int(e.response.headers.get('X-RateLimit-Reset', 0))
                wait_time = reset_time - int(time.time())

                if i < max_retries - 1 and wait_time > 0:
                    print(f'Rate limit hit. Waiting {wait_time}s...')
                    time.sleep(wait_time)
                    continue
            raise
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
| 503 | Service Unavailable | Service temporarily unavailable |

### Zoho Vault Error Codes

| Code | Message | Description | Solution |
|------|---------|-------------|----------|
| 7001 | Invalid Request | Request format is invalid | Check JSON format |
| 7002 | Authentication Failed | Invalid access token | Refresh access token |
| 7003 | Access Denied | Insufficient permissions | Check OAuth scopes |
| 7004 | Resource Not Found | Secret/chamber doesn't exist | Verify resource ID |
| 7005 | Duplicate Entry | Resource already exists | Update existing resource |
| 7006 | Validation Failed | Required field missing | Check required fields |
| 7007 | Rate Limit Exceeded | Too many API calls | Implement rate limiting |
| 7008 | Chamber Access Denied | No access to chamber | Grant chamber permissions |
| 7009 | Secret Locked | Secret is locked by another user | Wait or unlock |
| 7010 | Weak Password | Password doesn't meet requirements | Use stronger password |

### Error Response Format

```json
{
  "operation": {
    "result": {
      "status": "error",
      "code": 7006,
      "message": "Validation Failed: secretname is required"
    }
  }
}
```

### Error Handling Example

**JavaScript**:
```javascript
const handleVaultError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    const result = data.operation?.result;

    switch (status) {
      case 401:
        console.error('Authentication failed. Refreshing token...');
        // Refresh token logic
        break;

      case 429:
        console.error('Rate limit exceeded.');
        // Wait logic
        break;

      case 400:
        console.error(`Bad request: ${result?.message}`);
        break;

      case 404:
        console.error('Resource not found');
        break;

      case 500:
      case 503:
        console.error('Server error. Retrying...');
        // Retry logic
        break;

      default:
        console.error(`Error ${status}: ${result?.message}`);
    }
  }
};
```

---

## Common Operations

### 1. Complete Secret Management Workflow

```javascript
// JavaScript/Node.js - Complete Secret Management Workflow
const completeSecretWorkflow = async (accessToken) => {
  try {
    // 1. Create chamber
    const chamber = await createChamber(accessToken);
    const chamberId = chamber.operation.details.chamberid;
    console.log('Chamber created:', chamberId);

    // 2. Create secret in chamber
    const secret = await axios.post(
      'https://vault.zoho.com/api/json/secrets',
      {
        operation: { name: 'ADD_SECRET' },
        data: {
          secretname: 'API Key',
          password: 'sk_live_51abc123xyz',
          chamberid: chamberId,
          secrettype: 'Note',
          notes: 'Production API key for payment gateway'
        }
      },
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    const secretId = secret.data.operation.details.secretid;
    console.log('Secret created:', secretId);

    // 3. Share with team member
    await shareSecret(accessToken, secretId);
    console.log('Secret shared');

    // 4. Get secret password
    const password = await getSecretPassword(accessToken, secretId);
    console.log('Password retrieved successfully');

    // 5. Get audit log
    const audit = await getSecretAudit(accessToken, secretId);
    console.log('Audit log retrieved:', audit.length, 'events');

    return { success: true, secret_id: secretId };

  } catch (error) {
    console.error('Workflow error:', error.response?.data || error.message);
    throw error;
  }
};
```

### 2. Bulk Import Secrets

```python
# Python - Bulk Import Secrets
import requests
import time

def bulk_import_secrets(access_token, chamber_id, secrets_data):
    results = {
        'successful': [],
        'failed': []
    }

    for secret_data in secrets_data:
        try:
            url = 'https://vault.zoho.com/api/json/secrets'
            headers = {
                'Authorization': f'Zoho-oauthtoken {access_token}',
                'Content-Type': 'application/json'
            }
            data = {
                'operation': {
                    'name': 'ADD_SECRET'
                },
                'data': {
                    **secret_data,
                    'chamberid': chamber_id
                }
            }
            response = requests.post(url, json=data, headers=headers)
            response.raise_for_status()

            result = response.json()
            secret_id = result['operation']['details']['secretid']
            results['successful'].append({
                'name': secret_data['secretname'],
                'secret_id': secret_id
            })

            print(f"Imported: {secret_data['secretname']}")

            # Rate limiting: wait 1.2 seconds (50/min)
            time.sleep(1.2)

        except Exception as e:
            results['failed'].append({
                'name': secret_data.get('secretname', 'Unknown'),
                'error': str(e)
            })
            print(f"Failed: {secret_data.get('secretname')} - {str(e)}")

    return results

# Usage
secrets_to_import = [
    {
        'secretname': 'AWS Access Key',
        'username': 'AKIAIOSFODNN7EXAMPLE',
        'password': 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
        'secrettype': 'Server'
    },
    {
        'secretname': 'Database Credentials',
        'username': 'db_admin',
        'password': 'SecurePassword123',
        'secreturl': 'db.example.com',
        'secrettype': 'Database'
    }
]

results = bulk_import_secrets(access_token, chamber_id, secrets_to_import)
print(f"Successful: {len(results['successful'])}")
print(f"Failed: {len(results['failed'])}")
```

### 3. Rotate Password

```javascript
// JavaScript/Node.js - Password Rotation
const rotatePassword = async (accessToken, secretId) => {
  try {
    // 1. Generate new strong password
    const newPassword = await generatePassword(accessToken);
    console.log('New password generated');

    // 2. Get current secret details
    const currentSecret = await axios.get(
      `https://vault.zoho.com/api/json/secrets/${secretId}`,
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`
        }
      }
    );

    const secretData = currentSecret.data.operation.details;

    // 3. Update secret with new password
    await axios.put(
      `https://vault.zoho.com/api/json/secrets/${secretId}`,
      {
        operation: {
          name: 'UPDATE_SECRET'
        },
        data: {
          password: newPassword,
          notes: `Password rotated on ${new Date().toISOString()}\n\n${secretData.notes || ''}`
        }
      },
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Password updated successfully');

    // 4. Notify shared users (via your notification system)
    // notifyUsers(secretData.shared_users, 'Password has been rotated');

    return {
      success: true,
      message: 'Password rotated successfully',
      secret_id: secretId
    };

  } catch (error) {
    console.error('Password rotation error:', error.response?.data || error.message);
    throw error;
  }
};
```

### 4. Sync with External Service

```deluge
// Deluge - Sync Vault Secrets with External Service
// This can be used to sync specific secrets with deployment systems

chamber_id = "123456000000123456";

// Get all secrets from chamber
response = invokeurl
[
    url: "https://vault.zoho.com/api/json/chambers/" + chamber_id + "/secrets"
    type: GET
    connection: "zoho_oauth"
];

secrets = response.get("operation").get("details").get("secrets");

// Filter secrets tagged for deployment
deployment_secrets = List();

for each secret in secrets {
    secret_details = invokeurl
    [
        url: "https://vault.zoho.com/api/json/secrets/" + secret.get("secretid")
        type: GET
        connection: "zoho_oauth"
    ];

    notes = secret_details.get("operation").get("details").get("notes");

    if(notes != null && notes.contains("[DEPLOY]")) {
        // Get password value
        password_response = invokeurl
        [
            url: "https://vault.zoho.com/api/json/secrets/" + secret.get("secretid") + "/password"
            type: GET
            connection: "zoho_oauth"
        ];

        password = password_response.get("operation").get("details").get("password");

        deployment_secret = Map();
        deployment_secret.put("name", secret.get("secretname"));
        deployment_secret.put("value", password);

        deployment_secrets.add(deployment_secret);
    }
}

// Push to external deployment system
if(deployment_secrets.size() > 0) {
    deploy_response = invokeurl
    [
        url: "https://api.deployment-system.com/secrets"
        type: POST
        parameters: deployment_secrets.toString()
        connection: "external_system_connection"
    ];

    info "Synced " + deployment_secrets.size() + " secrets to deployment system";
}
```

---

## Best Practices

### 1. Security

**Never Log Passwords**:
```javascript
// Good: Log only non-sensitive information
console.log('Secret created:', secretId, secretName);

// Bad: Never log passwords
console.log('Password:', password); // NEVER DO THIS
```

**Use Strong Password Policies**:
```javascript
const validatePassword = (password) => {
  const requirements = {
    minLength: 12,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const isValid = password.length >= requirements.minLength &&
                 requirements.hasUppercase &&
                 requirements.hasLowercase &&
                 requirements.hasNumber &&
                 requirements.hasSymbol;

  if (!isValid) {
    throw new Error('Password does not meet security requirements');
  }

  return true;
};
```

### 2. Access Control

**Implement Least Privilege**:
```javascript
const shareWithMinimalPermissions = async (accessToken, secretId, userEmail) => {
  // Only grant READ permission by default
  await shareSecret(accessToken, secretId, userEmail, ['READ']);

  // WRITE and SHARE permissions should be granted explicitly when needed
};
```

### 3. Audit Trail

**Track All Access**:
```javascript
const getAccessReport = async (accessToken, secretId, days = 30) => {
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);

  const audit = await getSecretAudit(accessToken, secretId);

  const report = {
    total_accesses: 0,
    password_views: 0,
    unique_users: new Set(),
    access_by_user: {}
  };

  audit.forEach(log => {
    report.total_accesses++;

    if (log.event === 'Password Viewed') {
      report.password_views++;
    }

    report.unique_users.add(log.user_email);

    if (!report.access_by_user[log.user_email]) {
      report.access_by_user[log.user_email] = 0;
    }
    report.access_by_user[log.user_email]++;
  });

  report.unique_users = report.unique_users.size;

  return report;
};
```

### 4. Encryption at Rest

**All secrets are encrypted by Zoho Vault using AES-256 encryption**:
- Encryption keys are managed by Zoho
- Data is encrypted before storage
- Decryption only occurs during authorized access
- Zero-knowledge architecture option available

### 5. Regular Password Rotation

**Implement Automated Rotation**:
```python
import requests
from datetime import datetime, timedelta

def check_and_rotate_passwords(access_token, chamber_id, rotation_days=90):
    # Get all secrets in chamber
    url = f'https://vault.zoho.com/api/json/chambers/{chamber_id}/secrets'
    headers = {'Authorization': f'Zoho-oauthtoken {access_token}'}
    response = requests.get(url, headers=headers)
    secrets = response.json()['operation']['details']['secrets']

    rotated = []
    for secret in secrets:
        # Get secret details including last modified time
        secret_url = f'https://vault.zoho.com/api/json/secrets/{secret["secretid"]}'
        secret_response = requests.get(secret_url, headers=headers)
        secret_data = secret_response.json()['operation']['details']

        modified_time = datetime.fromisoformat(secret_data['modifiedtime'].replace('Z', '+00:00'))
        days_since_modified = (datetime.now() - modified_time).days

        if days_since_modified >= rotation_days:
            # Rotate password
            new_password = generate_password(access_token)
            update_url = f'https://vault.zoho.com/api/json/secrets/{secret["secretid"]}'
            update_data = {
                'operation': {'name': 'UPDATE_SECRET'},
                'data': {
                    'password': new_password,
                    'notes': f'Password auto-rotated on {datetime.now().isoformat()}'
                }
            }
            requests.put(update_url, json=update_data, headers=headers)
            rotated.append(secret['secretname'])

    return rotated
```

---

## Additional Resources

- [Official Zoho Vault API Documentation](https://www.zoho.com/vault/help/api/)
- [API Console](https://api-console.zoho.com/)
- [Zoho Vault Help](https://www.zoho.com/vault/help/)
- [Security Best Practices](https://www.zoho.com/vault/security.html)
- [Developer Forums](https://help.zoho.com/portal/en/community/vault)

---

**Last Updated**: December 2025
**API Version**: v1
