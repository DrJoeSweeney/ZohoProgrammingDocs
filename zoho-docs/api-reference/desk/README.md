---
type: api_reference
product: zoho_desk
api_version: v1
last_updated: 2025-01-15
complexity: intermediate
auth_required: OAuth 2.0
rate_limit_daily: 2000-50000
common_use_cases: ["ticket_management", "customer_support", "helpdesk_automation", "sla_tracking"]
quick_start_available: true
ai_optimized: true
requires_org_id: true
---

# Zoho Desk API Reference

## Overview

Zoho Desk is a comprehensive help desk and customer support platform that enables businesses to deliver exceptional customer service. The API provides full programmatic access to tickets, contacts, accounts, agents, and all support operations.

**Current API Version**: v1
**Base URL**: `https://desk.zoho.com/api/v1/`
**Protocol**: REST
**Data Format**: JSON
**Authentication**: OAuth 2.0

---

## ⚡ Quick Start

### Jump to Common Operations

| Operation | Time | Difficulty | Link |
|-----------|------|------------|------|
| Create Ticket | 3 min | ⚡ Easy | [→](#create-ticket) |
| Get Tickets | 2 min | ⚡ Easy | [→](#get-tickets) |
| Update Ticket | 2 min | ⚡ Easy | [→](#update-ticket) |
| Add Comment | 3 min | ⚡ Easy | [→](#add-comment) |
| Create Contact | 2 min | ⚡ Easy | [→](#create-contact) |
| Assign Ticket | 3 min | 🔧 Medium | [→](#assign-ticket) |
| Setup Webhook | 15 min | 🚀 Advanced | [→](#webhooks) |

### 60-Second Start

```javascript
// 1. Get access token from OAuth + your orgId
const accessToken = 'YOUR_ACCESS_TOKEN';
const orgId = 'YOUR_ORG_ID'; // Required for all Desk API calls

// 2. Create your first ticket
const axios = require('axios');
const response = await axios.post(
  'https://desk.zoho.com/api/v1/tickets',
  {
    contactId: 'CONTACT_ID',
    subject: 'Need help with login',
    description: 'Customer unable to access account',
    departmentId: 'DEPARTMENT_ID',
    priority: 'High',
    status: 'Open'
  },
  {
    params: { orgId },
    headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}` }
  }
);
console.log('Ticket created:', response.data.id);
```

[Need OAuth token? → 60-second OAuth setup](../../guides/authentication/README.md#self-client-quickest-for-scripts) | [More examples →](../../QUICK-START.md#7-create-desk-ticket-3-minutes)

### Related Documentation

- 🔐 [Authentication Guide](../../guides/authentication/README.md) - OAuth 2.0 complete setup
- ⚡ [Quick Start Guide](../../QUICK-START.md) - Copy-paste examples for all products
- 📊 [Rate Limits Guide](../../guides/rate-limits/README.md) - Desk: 2,000-50,000 calls/day
- 🔧 [Error Handling Guide](../../guides/error-handling/README.md) - Common errors and solutions
- 🔗 [Integration Patterns](../../guides/integration-patterns/README.md) - CRM + Desk integration
- 📘 [API Cheat Sheet](../../quick-reference/api-cheatsheet.md) - Quick syntax reference

---

## Quick Links

- [Authentication](#authentication)
- [Tickets API](#tickets-api)
- [Contacts API](#contacts-api)
- [Accounts API](#accounts-api)
- [Agents API](#agents-api)
- [Departments API](#departments-api)
- [Attachments](#attachments)
- [Comments and Conversations](#comments-and-conversations)
- [SLA Management](#sla-management)
- [Webhooks](#webhooks)
- [Rate Limits](#rate-limits)
- [Error Codes](#error-codes)
- [Code Examples](#code-examples)
- [Best Practices](#best-practices)

---

## REST API Principles

### HTTP Methods

Zoho Desk API follows standard REST conventions:

| Method | Purpose | Idempotent |
|--------|---------|------------|
| GET | Retrieve resources | Yes |
| POST | Create new resources | No |
| PATCH | Update existing resources | No |
| PUT | Replace resources | Yes |
| DELETE | Remove resources | Yes |

### Request Format

```http
GET /api/v1/tickets
Host: desk.zoho.com
Authorization: Zoho-oauthtoken {access_token}
orgId: {organization_id}
Content-Type: application/json
```

### Response Format

All API responses follow a consistent structure:

**Success Response**:
```json
{
  "data": {
    "id": "1234567890",
    "subject": "Cannot login to account",
    "status": "Open"
  }
}
```

**List Response**:
```json
{
  "data": [
    { "id": "1234567890", "subject": "Issue 1" },
    { "id": "1234567891", "subject": "Issue 2" }
  ],
  "count": 2,
  "isAscending": false
}
```

**Error Response**:
```json
{
  "errorCode": "INVALID_DATA",
  "message": "Invalid field value",
  "details": {
    "field": "status",
    "expectedValues": ["Open", "On Hold", "Escalated", "Closed"]
  }
}
```

---

## Authentication

### OAuth 2.0 Flow

Zoho Desk uses OAuth 2.0 for authentication. All API requests require a valid access token.

**Step 1: Register Your Application**
- Go to [Zoho API Console](https://api-console.zoho.com/)
- Create a new Client (Server-based or Self-client)
- Note your Client ID and Client Secret
- Set the authorized redirect URI

**Step 2: Generate Authorization Code**

```http
GET https://accounts.zoho.com/oauth/v2/auth?
  scope=Desk.tickets.ALL,Desk.contacts.READ,Desk.contacts.WRITE,Desk.search.READ&
  client_id={client_id}&
  response_type=code&
  access_type=offline&
  redirect_uri={redirect_uri}
```

**Available Scopes**:
- `Desk.tickets.ALL` - Full access to tickets
- `Desk.tickets.READ` - Read-only access to tickets
- `Desk.tickets.CREATE` - Create tickets
- `Desk.tickets.UPDATE` - Update tickets
- `Desk.tickets.DELETE` - Delete tickets
- `Desk.contacts.ALL` - Full access to contacts
- `Desk.contacts.READ` - Read contacts
- `Desk.contacts.WRITE` - Create/update contacts
- `Desk.accounts.ALL` - Full access to accounts
- `Desk.settings.ALL` - Access to settings and configuration
- `Desk.search.READ` - Search functionality
- `Desk.basic.READ` - Basic read access

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

**Organization ID**:
Every API request requires an `orgId` header. To get your organization ID:

```http
GET https://desk.zoho.com/api/v1/organizations
Authorization: Zoho-oauthtoken {access_token}
```

---

## Tickets API

The Tickets API is the core of Zoho Desk, enabling complete ticket lifecycle management.

### Ticket Object Structure

```json
{
  "id": "1234567890",
  "ticketNumber": "12345",
  "subject": "Cannot access my account",
  "description": "I'm unable to login to my account since yesterday",
  "status": "Open",
  "priority": "High",
  "classification": "Problem",
  "channel": "Email",
  "category": "Technical",
  "subCategory": "Login Issues",
  "email": "customer@example.com",
  "contactId": "9876543210",
  "accountId": "5432109876",
  "departmentId": "1111111111",
  "assigneeId": "2222222222",
  "teamId": "3333333333",
  "dueDate": "2025-12-15T18:00:00.000Z",
  "closedTime": null,
  "responseTime": "2025-12-12T14:30:00.000Z",
  "resolution": null,
  "createdTime": "2025-12-12T14:25:00.000Z",
  "modifiedTime": "2025-12-12T14:30:00.000Z",
  "customerResponseTime": "2025-12-12T14:27:00.000Z",
  "statusType": "Open",
  "isOverDue": false,
  "isTrashed": false,
  "cf": {
    "cf_custom_field_1": "Custom Value"
  }
}
```

### List Tickets

```http
GET /api/v1/tickets
Authorization: Zoho-oauthtoken {access_token}
orgId: {organization_id}
```

**Query Parameters**:
- `from` (integer) - Start index (default: 0)
- `limit` (integer) - Number of records (max: 100, default: 100)
- `sortBy` (string) - Field to sort by (e.g., "createdTime", "modifiedTime")
- `status` (string) - Filter by status
- `departmentId` (string) - Filter by department
- `assignee` (string) - Filter by assignee email
- `channel` (string) - Filter by channel (Email, Phone, Web, Chat, etc.)

**Example Request**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const listTickets = async (accessToken, orgId) => {
  const response = await axios.get(
    'https://desk.zoho.com/api/v1/tickets',
    {
      params: {
        limit: 50,
        sortBy: 'createdTime',
        status: 'Open'
      },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'orgId': orgId
      }
    }
  );
  return response.data;
};
```

```python
# Python
import requests

def list_tickets(access_token, org_id):
    url = 'https://desk.zoho.com/api/v1/tickets'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'orgId': org_id
    }
    params = {
        'limit': 50,
        'sortBy': 'createdTime',
        'status': 'Open'
    }
    response = requests.get(url, headers=headers, params=params)
    return response.json()
```

```deluge
// Deluge
tickets_map = Map();
tickets_map.put("limit", 50);
tickets_map.put("sortBy", "createdTime");
tickets_map.put("status", "Open");

response = zoho.desk.getRecords(org_id, "tickets", tickets_map);
info response;
```

### Get Ticket by ID

```http
GET /api/v1/tickets/{ticket_id}
Authorization: Zoho-oauthtoken {access_token}
orgId: {organization_id}
```

**Example**:
```javascript
const getTicket = async (accessToken, orgId, ticketId) => {
  const response = await axios.get(
    `https://desk.zoho.com/api/v1/tickets/${ticketId}`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'orgId': orgId
      }
    }
  );
  return response.data;
};
```

### Create Ticket

```http
POST /api/v1/tickets
Authorization: Zoho-oauthtoken {access_token}
orgId: {organization_id}
Content-Type: application/json

{
  "subject": "Cannot access dashboard",
  "description": "Getting error 500 when trying to access the dashboard",
  "departmentId": "1111111111",
  "contactId": "9876543210",
  "priority": "High",
  "status": "Open",
  "classification": "Problem",
  "channel": "Email",
  "category": "Technical",
  "dueDate": "2025-12-15T18:00:00.000Z",
  "assigneeId": "2222222222"
}
```

**Example**:
```javascript
const createTicket = async (accessToken, orgId, ticketData) => {
  const response = await axios.post(
    'https://desk.zoho.com/api/v1/tickets',
    ticketData,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'orgId': orgId,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

// Usage
const newTicket = {
  subject: 'Cannot access dashboard',
  description: 'Getting error 500 when trying to access the dashboard',
  departmentId: '1111111111',
  contactId: '9876543210',
  priority: 'High',
  status: 'Open',
  channel: 'Email'
};

const result = await createTicket(accessToken, orgId, newTicket);
```

```python
def create_ticket(access_token, org_id, ticket_data):
    url = 'https://desk.zoho.com/api/v1/tickets'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'orgId': org_id,
        'Content-Type': 'application/json'
    }
    response = requests.post(url, json=ticket_data, headers=headers)
    return response.json()

# Usage
new_ticket = {
    'subject': 'Cannot access dashboard',
    'description': 'Getting error 500 when trying to access the dashboard',
    'departmentId': '1111111111',
    'contactId': '9876543210',
    'priority': 'High',
    'status': 'Open',
    'channel': 'Email'
}

result = create_ticket(access_token, org_id, new_ticket)
```

```deluge
// Deluge
ticket_map = Map();
ticket_map.put("subject", "Cannot access dashboard");
ticket_map.put("description", "Getting error 500 when trying to access the dashboard");
ticket_map.put("departmentId", "1111111111");
ticket_map.put("contactId", "9876543210");
ticket_map.put("priority", "High");
ticket_map.put("status", "Open");
ticket_map.put("channel", "Email");

response = zoho.desk.create(org_id, "tickets", ticket_map);
info response;
```

### Update Ticket

```http
PATCH /api/v1/tickets/{ticket_id}
Authorization: Zoho-oauthtoken {access_token}
orgId: {organization_id}
Content-Type: application/json

{
  "status": "In Progress",
  "priority": "Urgent",
  "assigneeId": "2222222222"
}
```

**Example**:
```javascript
const updateTicket = async (accessToken, orgId, ticketId, updates) => {
  const response = await axios.patch(
    `https://desk.zoho.com/api/v1/tickets/${ticketId}`,
    updates,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'orgId': orgId,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

// Usage - Update status and priority
await updateTicket(accessToken, orgId, '1234567890', {
  status: 'In Progress',
  priority: 'Urgent'
});
```

### Update Ticket Status

```http
PATCH /api/v1/tickets/{ticket_id}
Authorization: Zoho-oauthtoken {access_token}
orgId: {organization_id}
Content-Type: application/json

{
  "status": "Closed"
}
```

**Available Statuses**:
- `Open` - New or reopened ticket
- `On Hold` - Waiting for external dependency
- `Escalated` - Escalated to higher level
- `In Progress` - Being worked on
- `Closed` - Resolved and closed

**Example**:
```javascript
const closeTicket = async (accessToken, orgId, ticketId) => {
  const response = await axios.patch(
    `https://desk.zoho.com/api/v1/tickets/${ticketId}`,
    { status: 'Closed' },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'orgId': orgId,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};
```

```python
def close_ticket(access_token, org_id, ticket_id):
    url = f'https://desk.zoho.com/api/v1/tickets/{ticket_id}'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'orgId': org_id,
        'Content-Type': 'application/json'
    }
    data = {'status': 'Closed'}
    response = requests.patch(url, json=data, headers=headers)
    return response.json()
```

### Assign Ticket

```http
PATCH /api/v1/tickets/{ticket_id}
Authorization: Zoho-oauthtoken {access_token}
orgId: {organization_id}
Content-Type: application/json

{
  "assigneeId": "2222222222",
  "teamId": "3333333333"
}
```

**Example**:
```javascript
const assignTicket = async (accessToken, orgId, ticketId, assigneeId, teamId = null) => {
  const updates = { assigneeId };
  if (teamId) {
    updates.teamId = teamId;
  }

  const response = await axios.patch(
    `https://desk.zoho.com/api/v1/tickets/${ticketId}`,
    updates,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'orgId': orgId,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};
```

### Delete Ticket

```http
DELETE /api/v1/tickets/{ticket_id}
Authorization: Zoho-oauthtoken {access_token}
orgId: {organization_id}
```

**Example**:
```javascript
const deleteTicket = async (accessToken, orgId, ticketId) => {
  const response = await axios.delete(
    `https://desk.zoho.com/api/v1/tickets/${ticketId}`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'orgId': orgId
      }
    }
  );
  return response.data;
};
```

### Search Tickets

```http
GET /api/v1/tickets/search?email={email}
GET /api/v1/tickets/search?phone={phone}
Authorization: Zoho-oauthtoken {access_token}
orgId: {organization_id}
```

**Example**:
```javascript
const searchTicketsByEmail = async (accessToken, orgId, email) => {
  const response = await axios.get(
    'https://desk.zoho.com/api/v1/tickets/search',
    {
      params: { email },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'orgId': orgId
      }
    }
  );
  return response.data;
};
```

---

## Contacts API

Manage customer contacts who create and interact with tickets.

### Contact Object Structure

```json
{
  "id": "9876543210",
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@example.com",
  "phone": "+1-555-0123",
  "mobile": "+1-555-0124",
  "accountId": "5432109876",
  "description": "Primary contact for Acme Corp",
  "title": "IT Manager",
  "type": "Customer",
  "isSpam": false,
  "createdTime": "2025-01-10T09:00:00.000Z",
  "modifiedTime": "2025-12-12T10:30:00.000Z"
}
```

### List Contacts

```http
GET /api/v1/contacts
Authorization: Zoho-oauthtoken {access_token}
orgId: {organization_id}
```

**Query Parameters**:
- `from` (integer) - Start index
- `limit` (integer) - Number of records (max: 100)
- `sortBy` (string) - Field to sort by

**Example**:
```javascript
const listContacts = async (accessToken, orgId) => {
  const response = await axios.get(
    'https://desk.zoho.com/api/v1/contacts',
    {
      params: { limit: 100 },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'orgId': orgId
      }
    }
  );
  return response.data;
};
```

### Get Contact by ID

```http
GET /api/v1/contacts/{contact_id}
Authorization: Zoho-oauthtoken {access_token}
orgId: {organization_id}
```

### Create Contact

```http
POST /api/v1/contacts
Authorization: Zoho-oauthtoken {access_token}
orgId: {organization_id}
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@example.com",
  "phone": "+1-555-0123",
  "accountId": "5432109876",
  "title": "IT Manager"
}
```

**Example**:
```javascript
const createContact = async (accessToken, orgId, contactData) => {
  const response = await axios.post(
    'https://desk.zoho.com/api/v1/contacts',
    contactData,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'orgId': orgId,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};
```

```python
def create_contact(access_token, org_id, contact_data):
    url = 'https://desk.zoho.com/api/v1/contacts'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'orgId': org_id,
        'Content-Type': 'application/json'
    }
    response = requests.post(url, json=contact_data, headers=headers)
    return response.json()
```

```deluge
// Deluge
contact_map = Map();
contact_map.put("firstName", "John");
contact_map.put("lastName", "Smith");
contact_map.put("email", "john.smith@example.com");
contact_map.put("phone", "+1-555-0123");

response = zoho.desk.create(org_id, "contacts", contact_map);
info response;
```

### Update Contact

```http
PATCH /api/v1/contacts/{contact_id}
Authorization: Zoho-oauthtoken {access_token}
orgId: {organization_id}
Content-Type: application/json

{
  "phone": "+1-555-9999",
  "title": "Senior IT Manager"
}
```

### Delete Contact

```http
DELETE /api/v1/contacts/{contact_id}
Authorization: Zoho-oauthtoken {access_token}
orgId: {organization_id}
```

### Search Contacts

```http
GET /api/v1/contacts/search?email={email}
Authorization: Zoho-oauthtoken {access_token}
orgId: {organization_id}
```

**Example**:
```javascript
const searchContactByEmail = async (accessToken, orgId, email) => {
  const response = await axios.get(
    'https://desk.zoho.com/api/v1/contacts/search',
    {
      params: { email },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'orgId': orgId
      }
    }
  );
  return response.data;
};
```

---

## Accounts API

Manage customer accounts (organizations/companies).

### Account Object Structure

```json
{
  "id": "5432109876",
  "accountName": "Acme Corporation",
  "email": "contact@acme.com",
  "phone": "+1-555-1000",
  "website": "https://www.acme.com",
  "description": "Leading provider of industrial products",
  "industry": "Manufacturing",
  "annualRevenue": 50000000,
  "numberOfEmployees": 500,
  "createdTime": "2025-01-05T08:00:00.000Z",
  "modifiedTime": "2025-12-01T15:00:00.000Z"
}
```

### List Accounts

```http
GET /api/v1/accounts
Authorization: Zoho-oauthtoken {access_token}
orgId: {organization_id}
```

**Example**:
```javascript
const listAccounts = async (accessToken, orgId) => {
  const response = await axios.get(
    'https://desk.zoho.com/api/v1/accounts',
    {
      params: { limit: 100 },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'orgId': orgId
      }
    }
  );
  return response.data;
};
```

### Get Account by ID

```http
GET /api/v1/accounts/{account_id}
Authorization: Zoho-oauthtoken {access_token}
orgId: {organization_id}
```

### Create Account

```http
POST /api/v1/accounts
Authorization: Zoho-oauthtoken {access_token}
orgId: {organization_id}
Content-Type: application/json

{
  "accountName": "Acme Corporation",
  "email": "contact@acme.com",
  "phone": "+1-555-1000",
  "website": "https://www.acme.com",
  "industry": "Manufacturing"
}
```

**Example**:
```javascript
const createAccount = async (accessToken, orgId, accountData) => {
  const response = await axios.post(
    'https://desk.zoho.com/api/v1/accounts',
    accountData,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'orgId': orgId,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};
```

```python
def create_account(access_token, org_id, account_data):
    url = 'https://desk.zoho.com/api/v1/accounts'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'orgId': org_id,
        'Content-Type': 'application/json'
    }
    response = requests.post(url, json=account_data, headers=headers)
    return response.json()
```

```deluge
// Deluge
account_map = Map();
account_map.put("accountName", "Acme Corporation");
account_map.put("email", "contact@acme.com");
account_map.put("phone", "+1-555-1000");
account_map.put("website", "https://www.acme.com");

response = zoho.desk.create(org_id, "accounts", account_map);
info response;
```

### Update Account

```http
PATCH /api/v1/accounts/{account_id}
Authorization: Zoho-oauthtoken {access_token}
orgId: {organization_id}
Content-Type: application/json

{
  "phone": "+1-555-2000",
  "numberOfEmployees": 550
}
```

### Delete Account

```http
DELETE /api/v1/accounts/{account_id}
Authorization: Zoho-oauthtoken {access_token}
orgId: {organization_id}
```

---

## Agents API

Manage support agents who handle tickets.

### Agent Object Structure

```json
{
  "id": "2222222222",
  "firstName": "Sarah",
  "lastName": "Johnson",
  "email": "sarah.johnson@company.com",
  "roleId": "4444444444",
  "roleName": "Support Agent",
  "profileId": "5555555555",
  "countryCode": "US",
  "timeZone": "America/New_York",
  "isConfirmed": true,
  "status": "ACTIVE",
  "createdTime": "2025-06-01T09:00:00.000Z"
}
```

### List Agents

```http
GET /api/v1/agents
Authorization: Zoho-oauthtoken {access_token}
orgId: {organization_id}
```

**Example**:
```javascript
const listAgents = async (accessToken, orgId) => {
  const response = await axios.get(
    'https://desk.zoho.com/api/v1/agents',
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'orgId': orgId
      }
    }
  );
  return response.data;
};
```

### Get Agent by ID

```http
GET /api/v1/agents/{agent_id}
Authorization: Zoho-oauthtoken {access_token}
orgId: {organization_id}
```

### Create Agent

```http
POST /api/v1/agents
Authorization: Zoho-oauthtoken {access_token}
orgId: {organization_id}
Content-Type: application/json

{
  "firstName": "Sarah",
  "lastName": "Johnson",
  "email": "sarah.johnson@company.com",
  "roleId": "4444444444",
  "profileId": "5555555555"
}
```

**Example**:
```javascript
const createAgent = async (accessToken, orgId, agentData) => {
  const response = await axios.post(
    'https://desk.zoho.com/api/v1/agents',
    agentData,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'orgId': orgId,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};
```

### Update Agent

```http
PATCH /api/v1/agents/{agent_id}
Authorization: Zoho-oauthtoken {access_token}
orgId: {organization_id}
Content-Type: application/json

{
  "status": "INACTIVE"
}
```

### Delete Agent

```http
DELETE /api/v1/agents/{agent_id}
Authorization: Zoho-oauthtoken {access_token}
orgId: {organization_id}
```

---

## Departments API

Manage support departments for organizing tickets and agents.

### Department Object Structure

```json
{
  "id": "1111111111",
  "name": "Technical Support",
  "description": "Handles all technical issues",
  "creatorId": "2222222222",
  "isEnabled": true,
  "createdTime": "2025-01-01T00:00:00.000Z"
}
```

### List Departments

```http
GET /api/v1/departments
Authorization: Zoho-oauthtoken {access_token}
orgId: {organization_id}
```

**Example**:
```javascript
const listDepartments = async (accessToken, orgId) => {
  const response = await axios.get(
    'https://desk.zoho.com/api/v1/departments',
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'orgId': orgId
      }
    }
  );
  return response.data;
};
```

```python
def list_departments(access_token, org_id):
    url = 'https://desk.zoho.com/api/v1/departments'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'orgId': org_id
    }
    response = requests.get(url, headers=headers)
    return response.json()
```

```deluge
// Deluge
response = zoho.desk.getRecords(org_id, "departments");
info response;
```

### Get Department by ID

```http
GET /api/v1/departments/{department_id}
Authorization: Zoho-oauthtoken {access_token}
orgId: {organization_id}
```

---

## Attachments

Handle file attachments on tickets.

### Upload Attachment to Ticket

```http
POST /api/v1/tickets/{ticket_id}/attachments
Authorization: Zoho-oauthtoken {access_token}
orgId: {organization_id}
Content-Type: multipart/form-data

file: [binary file data]
```

**Example**:
```javascript
const uploadAttachment = async (accessToken, orgId, ticketId, filePath) => {
  const FormData = require('form-data');
  const fs = require('fs');

  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));

  const response = await axios.post(
    `https://desk.zoho.com/api/v1/tickets/${ticketId}/attachments`,
    form,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'orgId': orgId,
        ...form.getHeaders()
      }
    }
  );
  return response.data;
};
```

```python
def upload_attachment(access_token, org_id, ticket_id, file_path):
    url = f'https://desk.zoho.com/api/v1/tickets/{ticket_id}/attachments'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'orgId': org_id
    }
    with open(file_path, 'rb') as file:
        files = {'file': file}
        response = requests.post(url, headers=headers, files=files)
    return response.json()
```

### List Attachments

```http
GET /api/v1/tickets/{ticket_id}/attachments
Authorization: Zoho-oauthtoken {access_token}
orgId: {organization_id}
```

**Example**:
```javascript
const listAttachments = async (accessToken, orgId, ticketId) => {
  const response = await axios.get(
    `https://desk.zoho.com/api/v1/tickets/${ticketId}/attachments`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'orgId': orgId
      }
    }
  );
  return response.data;
};
```

### Download Attachment

```http
GET /api/v1/tickets/{ticket_id}/attachments/{attachment_id}
Authorization: Zoho-oauthtoken {access_token}
orgId: {organization_id}
```

**Example**:
```javascript
const downloadAttachment = async (accessToken, orgId, ticketId, attachmentId) => {
  const response = await axios.get(
    `https://desk.zoho.com/api/v1/tickets/${ticketId}/attachments/${attachmentId}`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'orgId': orgId
      },
      responseType: 'stream'
    }
  );
  return response.data;
};
```

### Delete Attachment

```http
DELETE /api/v1/tickets/{ticket_id}/attachments/{attachment_id}
Authorization: Zoho-oauthtoken {access_token}
orgId: {organization_id}
```

---

## Comments and Conversations

Manage ticket comments and conversation threads.

### Thread Object Structure

```json
{
  "id": "7777777777",
  "direction": "out",
  "channel": "EMAIL",
  "from": "support@company.com",
  "to": "customer@example.com",
  "subject": "Re: Cannot access dashboard",
  "content": "<p>We have identified the issue and working on a fix.</p>",
  "contentType": "html",
  "summary": "We have identified the issue...",
  "isForward": false,
  "createdTime": "2025-12-12T15:00:00.000Z",
  "author": {
    "id": "2222222222",
    "type": "AGENT",
    "name": "Sarah Johnson"
  }
}
```

### Add Comment to Ticket

```http
POST /api/v1/tickets/{ticket_id}/comments
Authorization: Zoho-oauthtoken {access_token}
orgId: {organization_id}
Content-Type: application/json

{
  "content": "We are looking into this issue and will update you shortly.",
  "contentType": "plainText",
  "isPublic": true
}
```

**Example**:
```javascript
const addComment = async (accessToken, orgId, ticketId, content, isPublic = true) => {
  const response = await axios.post(
    `https://desk.zoho.com/api/v1/tickets/${ticketId}/comments`,
    {
      content,
      contentType: 'plainText',
      isPublic
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'orgId': orgId,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};
```

```python
def add_comment(access_token, org_id, ticket_id, content, is_public=True):
    url = f'https://desk.zoho.com/api/v1/tickets/{ticket_id}/comments'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'orgId': org_id,
        'Content-Type': 'application/json'
    }
    data = {
        'content': content,
        'contentType': 'plainText',
        'isPublic': is_public
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

```deluge
// Deluge
comment_map = Map();
comment_map.put("content", "We are looking into this issue");
comment_map.put("contentType", "plainText");
comment_map.put("isPublic", true);

response = zoho.desk.create(org_id, "tickets", ticket_id, "comments", comment_map);
info response;
```

### List Ticket Threads

```http
GET /api/v1/tickets/{ticket_id}/threads
Authorization: Zoho-oauthtoken {access_token}
orgId: {organization_id}
```

**Example**:
```javascript
const listThreads = async (accessToken, orgId, ticketId) => {
  const response = await axios.get(
    `https://desk.zoho.com/api/v1/tickets/${ticketId}/threads`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'orgId': orgId
      }
    }
  );
  return response.data;
};
```

### Reply to Ticket (Send Email)

```http
POST /api/v1/tickets/{ticket_id}/sendReply
Authorization: Zoho-oauthtoken {access_token}
orgId: {organization_id}
Content-Type: application/json

{
  "channel": "EMAIL",
  "to": "customer@example.com",
  "from": "support@company.com",
  "subject": "Re: Cannot access dashboard",
  "content": "<p>Your issue has been resolved. Please try again.</p>",
  "contentType": "html"
}
```

**Example**:
```javascript
const sendReply = async (accessToken, orgId, ticketId, replyData) => {
  const response = await axios.post(
    `https://desk.zoho.com/api/v1/tickets/${ticketId}/sendReply`,
    replyData,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'orgId': orgId,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

// Usage
await sendReply(accessToken, orgId, ticketId, {
  channel: 'EMAIL',
  to: 'customer@example.com',
  from: 'support@company.com',
  subject: 'Re: Cannot access dashboard',
  content: '<p>Your issue has been resolved. Please try again.</p>',
  contentType: 'html'
});
```

---

## SLA Management

Service Level Agreement (SLA) management for tracking response and resolution times.

### SLA Object Structure

```json
{
  "id": "8888888888",
  "name": "Standard Support SLA",
  "description": "24-hour response, 72-hour resolution",
  "isDefault": true,
  "responseTime": {
    "businessHours": 24,
    "calendarHours": null
  },
  "resolutionTime": {
    "businessHours": 72,
    "calendarHours": null
  }
}
```

### List SLAs

```http
GET /api/v1/sla
Authorization: Zoho-oauthtoken {access_token}
orgId: {organization_id}
```

**Example**:
```javascript
const listSLAs = async (accessToken, orgId) => {
  const response = await axios.get(
    'https://desk.zoho.com/api/v1/sla',
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'orgId': orgId
      }
    }
  );
  return response.data;
};
```

### Get Ticket SLA Status

```http
GET /api/v1/tickets/{ticket_id}/sla
Authorization: Zoho-oauthtoken {access_token}
orgId: {organization_id}
```

**Response**:
```json
{
  "slaId": "8888888888",
  "slaName": "Standard Support SLA",
  "responseTime": {
    "dueTime": "2025-12-13T14:25:00.000Z",
    "isOverdue": false,
    "remainingTime": 82800000
  },
  "resolutionTime": {
    "dueTime": "2025-12-15T14:25:00.000Z",
    "isOverdue": false,
    "remainingTime": 255600000
  }
}
```

**Example**:
```javascript
const getTicketSLA = async (accessToken, orgId, ticketId) => {
  const response = await axios.get(
    `https://desk.zoho.com/api/v1/tickets/${ticketId}/sla`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'orgId': orgId
      }
    }
  );
  return response.data;
};
```

---

## Webhooks

Set up real-time notifications for ticket events.

### Webhook Events

**Available Events**:
- `Ticket.Add` - New ticket created
- `Ticket.Update` - Ticket updated
- `Ticket.Delete` - Ticket deleted
- `Ticket.StatusChange` - Ticket status changed
- `Ticket.AssignmentChange` - Ticket reassigned
- `Ticket.CommentAdd` - Comment added to ticket
- `Contact.Add` - New contact created
- `Contact.Update` - Contact updated
- `Account.Add` - New account created
- `Account.Update` - Account updated

### Create Webhook

```http
POST /api/v1/events
Authorization: Zoho-oauthtoken {access_token}
orgId: {organization_id}
Content-Type: application/json

{
  "url": "https://yourdomain.com/webhook/zoho-desk",
  "eventType": "Ticket.Add",
  "actions": ["add"],
  "isActive": true
}
```

**Example**:
```javascript
const createWebhook = async (accessToken, orgId, webhookUrl, eventType) => {
  const response = await axios.post(
    'https://desk.zoho.com/api/v1/events',
    {
      url: webhookUrl,
      eventType: eventType,
      actions: ['add'],
      isActive: true
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'orgId': orgId,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

// Usage - Set up webhook for new tickets
await createWebhook(
  accessToken,
  orgId,
  'https://yourdomain.com/webhook/zoho-desk',
  'Ticket.Add'
);
```

```python
def create_webhook(access_token, org_id, webhook_url, event_type):
    url = 'https://desk.zoho.com/api/v1/events'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'orgId': org_id,
        'Content-Type': 'application/json'
    }
    data = {
        'url': webhook_url,
        'eventType': event_type,
        'actions': ['add'],
        'isActive': True
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

### Webhook Payload Example

When a ticket is created, Zoho Desk sends a POST request to your webhook URL:

```json
{
  "eventType": "Ticket.Add",
  "eventTime": "2025-12-12T15:30:00.000Z",
  "orgId": "123456789",
  "payload": {
    "id": "1234567890",
    "ticketNumber": "12345",
    "subject": "Cannot access dashboard",
    "status": "Open",
    "priority": "High",
    "contactId": "9876543210",
    "departmentId": "1111111111",
    "assigneeId": "2222222222",
    "createdTime": "2025-12-12T15:30:00.000Z"
  }
}
```

### Handle Webhook in Your Application

```javascript
// Express.js webhook handler
const express = require('express');
const app = express();

app.post('/webhook/zoho-desk', express.json(), (req, res) => {
  const { eventType, payload } = req.body;

  switch(eventType) {
    case 'Ticket.Add':
      console.log('New ticket created:', payload.ticketNumber);
      // Handle new ticket
      break;

    case 'Ticket.StatusChange':
      console.log('Ticket status changed:', payload.id, payload.status);
      // Handle status change
      break;

    case 'Ticket.CommentAdd':
      console.log('New comment added to ticket:', payload.ticketId);
      // Handle new comment
      break;
  }

  // Always respond with 200 to acknowledge receipt
  res.status(200).json({ received: true });
});
```

```python
# Flask webhook handler
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/webhook/zoho-desk', methods=['POST'])
def handle_webhook():
    data = request.json
    event_type = data.get('eventType')
    payload = data.get('payload')

    if event_type == 'Ticket.Add':
        print(f"New ticket created: {payload.get('ticketNumber')}")
        # Handle new ticket

    elif event_type == 'Ticket.StatusChange':
        print(f"Ticket status changed: {payload.get('id')} - {payload.get('status')}")
        # Handle status change

    elif event_type == 'Ticket.CommentAdd':
        print(f"New comment added to ticket: {payload.get('ticketId')}")
        # Handle new comment

    # Always respond with 200 to acknowledge receipt
    return jsonify({'received': True}), 200
```

### List Webhooks

```http
GET /api/v1/events
Authorization: Zoho-oauthtoken {access_token}
orgId: {organization_id}
```

### Delete Webhook

```http
DELETE /api/v1/events/{event_id}
Authorization: Zoho-oauthtoken {access_token}
orgId: {organization_id}
```

---

## Rate Limits

### API Call Limits

Zoho Desk enforces rate limits to ensure fair usage and system stability.

| Plan | API Calls per Minute | API Calls per Day |
|------|---------------------|-------------------|
| Free | 10 | 2,000 |
| Standard | 20 | 5,000 |
| Professional | 50 | 20,000 |
| Enterprise | 100 | 50,000 |

### Rate Limit Headers

Every API response includes rate limit information in headers:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1702396800
```

- `X-RateLimit-Limit` - Total requests allowed per minute
- `X-RateLimit-Remaining` - Requests remaining in current window
- `X-RateLimit-Reset` - Timestamp when the rate limit resets (Unix epoch)

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

// Usage
const tickets = await makeAPICallWithRetry(
  () => listTickets(accessToken, orgId)
);
```

```python
import time
from datetime import datetime

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

# Usage
tickets = make_api_call_with_retry(
    lambda: list_tickets(access_token, org_id)
)
```

### Concurrent Request Limits

- Maximum 10 concurrent API requests per organization
- Exceeding this limit returns a 429 error

---

## Error Codes

### HTTP Status Codes

| Status Code | Meaning | Common Causes |
|-------------|---------|---------------|
| 200 | OK | Successful request |
| 201 | Created | Resource successfully created |
| 204 | No Content | Successful deletion |
| 400 | Bad Request | Invalid request parameters or body |
| 401 | Unauthorized | Invalid or expired access token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource does not exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |
| 503 | Service Unavailable | Service temporarily unavailable |

### Error Response Structure

```json
{
  "errorCode": "INVALID_DATA",
  "message": "The input given for the field 'status' is invalid",
  "details": {
    "field": "status",
    "expectedValues": ["Open", "On Hold", "Escalated", "Closed"]
  }
}
```

### Common Error Codes

| Error Code | Description | Solution |
|------------|-------------|----------|
| INVALID_TOKEN | Access token is invalid or expired | Refresh the access token |
| INVALID_OAUTH_SCOPE | Insufficient OAuth scope permissions | Update OAuth scopes and regenerate token |
| INVALID_DATA | Invalid field value or format | Check field requirements and format |
| REQUIRED_FIELD_MISSING | Required field not provided | Include all required fields |
| INVALID_ORGID | Organization ID is invalid | Verify organization ID |
| RECORD_NOT_FOUND | Resource ID does not exist | Verify the record ID |
| DUPLICATE_RECORD | Duplicate record detected | Check for existing records |
| RATE_LIMIT_EXCEEDED | API rate limit exceeded | Implement rate limiting and retry logic |
| INTERNAL_ERROR | Server error | Retry with exponential backoff |
| PERMISSION_DENIED | User lacks required permissions | Grant appropriate permissions |
| FIELD_NOT_EDITABLE | Attempting to edit read-only field | Remove read-only fields from update |

### Error Handling Best Practices

```javascript
const handleAPIError = (error) => {
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
        console.error('Forbidden. Check permissions.');
        break;

      case 404:
        console.error('Resource not found:', data.message);
        break;

      case 429:
        console.error('Rate limit exceeded. Retry after:',
          error.response.headers['x-ratelimit-reset']);
        break;

      case 500:
      case 503:
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
```

---

## Code Examples

### Complete Ticket Management Workflow

```javascript
// Complete workflow: Create contact, create ticket, add comment, update status
const completeTicketWorkflow = async (accessToken, orgId) => {
  try {
    // Step 1: Create or find contact
    let contact;
    const existingContacts = await searchContactByEmail(
      accessToken,
      orgId,
      'customer@example.com'
    );

    if (existingContacts.data && existingContacts.data.length > 0) {
      contact = existingContacts.data[0];
    } else {
      contact = await createContact(accessToken, orgId, {
        firstName: 'John',
        lastName: 'Doe',
        email: 'customer@example.com',
        phone: '+1-555-0123'
      });
    }

    // Step 2: Create ticket
    const ticket = await createTicket(accessToken, orgId, {
      subject: 'Login issue - Account locked',
      description: 'Customer unable to login after 3 failed attempts',
      contactId: contact.id,
      departmentId: '1111111111',
      priority: 'High',
      status: 'Open',
      channel: 'Email'
    });

    console.log('Ticket created:', ticket.ticketNumber);

    // Step 3: Add internal comment
    await addComment(accessToken, orgId, ticket.id,
      'Checked user account. Password reset required.', false);

    // Step 4: Assign to agent
    await assignTicket(accessToken, orgId, ticket.id, '2222222222');

    // Step 5: Update status
    await updateTicket(accessToken, orgId, ticket.id, {
      status: 'In Progress'
    });

    // Step 6: Send reply to customer
    await sendReply(accessToken, orgId, ticket.id, {
      channel: 'EMAIL',
      to: contact.email,
      from: 'support@company.com',
      subject: `Re: ${ticket.subject}`,
      content: '<p>We have reset your password. Please check your email.</p>',
      contentType: 'html'
    });

    // Step 7: Close ticket
    await updateTicket(accessToken, orgId, ticket.id, {
      status: 'Closed'
    });

    console.log('Ticket workflow completed successfully');

  } catch (error) {
    handleAPIError(error);
  }
};
```

### Bulk Ticket Processing

```javascript
const processPendingTickets = async (accessToken, orgId) => {
  try {
    // Get all open tickets
    const response = await listTickets(accessToken, orgId);
    const openTickets = response.data.filter(t => t.status === 'Open');

    console.log(`Processing ${openTickets.length} open tickets...`);

    // Process each ticket
    for (const ticket of openTickets) {
      // Check if overdue
      if (ticket.isOverDue) {
        // Escalate overdue tickets
        await updateTicket(accessToken, orgId, ticket.id, {
          status: 'Escalated',
          priority: 'Urgent'
        });

        console.log(`Escalated overdue ticket: ${ticket.ticketNumber}`);
      }

      // Auto-assign unassigned tickets
      if (!ticket.assigneeId) {
        // Get available agents
        const agents = await listAgents(accessToken, orgId);
        const availableAgent = agents.data.find(a => a.status === 'ACTIVE');

        if (availableAgent) {
          await assignTicket(accessToken, orgId, ticket.id, availableAgent.id);
          console.log(`Assigned ticket ${ticket.ticketNumber} to ${availableAgent.email}`);
        }
      }

      // Add delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('Bulk processing completed');

  } catch (error) {
    handleAPIError(error);
  }
};
```

### Monitoring Ticket Metrics

```python
import requests
from datetime import datetime, timedelta
from collections import defaultdict

def get_ticket_metrics(access_token, org_id, days=7):
    """Get ticket metrics for the last N days"""

    # Calculate date range
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)

    # Fetch all tickets
    url = 'https://desk.zoho.com/api/v1/tickets'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'orgId': org_id
    }

    all_tickets = []
    from_index = 0
    limit = 100

    while True:
        params = {'from': from_index, 'limit': limit}
        response = requests.get(url, headers=headers, params=params)
        data = response.json()

        if 'data' not in data or len(data['data']) == 0:
            break

        all_tickets.extend(data['data'])
        from_index += limit

    # Calculate metrics
    metrics = {
        'total_tickets': len(all_tickets),
        'by_status': defaultdict(int),
        'by_priority': defaultdict(int),
        'by_channel': defaultdict(int),
        'avg_resolution_time': 0,
        'overdue_count': 0
    }

    resolution_times = []

    for ticket in all_tickets:
        # Count by status
        metrics['by_status'][ticket['status']] += 1

        # Count by priority
        metrics['by_priority'][ticket['priority']] += 1

        # Count by channel
        metrics['by_channel'][ticket['channel']] += 1

        # Track overdue tickets
        if ticket.get('isOverDue'):
            metrics['overdue_count'] += 1

        # Calculate resolution time for closed tickets
        if ticket['status'] == 'Closed' and ticket.get('closedTime'):
            created = datetime.fromisoformat(ticket['createdTime'].replace('Z', '+00:00'))
            closed = datetime.fromisoformat(ticket['closedTime'].replace('Z', '+00:00'))
            resolution_times.append((closed - created).total_seconds() / 3600)

    # Calculate average resolution time
    if resolution_times:
        metrics['avg_resolution_time'] = sum(resolution_times) / len(resolution_times)

    return metrics

# Usage
metrics = get_ticket_metrics(access_token, org_id, days=30)
print(f"Total Tickets: {metrics['total_tickets']}")
print(f"By Status: {dict(metrics['by_status'])}")
print(f"Average Resolution Time: {metrics['avg_resolution_time']:.2f} hours")
print(f"Overdue Tickets: {metrics['overdue_count']}")
```

### Token Management Class

```javascript
class ZohoDeskAuth {
  constructor(clientId, clientSecret, redirectUri) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;
  }

  async getAccessToken() {
    // Check if current token is still valid
    if (this.accessToken && this.tokenExpiry > Date.now()) {
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
}

// Usage
const auth = new ZohoDeskAuth(clientId, clientSecret, redirectUri);
const accessToken = await auth.getAccessToken();
```

---

## Best Practices

### 1. Authentication and Security

**Store Credentials Securely**:
```javascript
// Bad - Never hardcode credentials
const clientId = '1000.ABCDEF123456';
const clientSecret = 'secret123';

// Good - Use environment variables
const clientId = process.env.ZOHO_CLIENT_ID;
const clientSecret = process.env.ZOHO_CLIENT_SECRET;
```

**Implement Token Refresh**:
- Always refresh tokens automatically before they expire
- Store refresh tokens securely (encrypted at rest)
- Never expose tokens in client-side code or logs

**Use Appropriate OAuth Scopes**:
- Request only the minimum scopes needed
- Use specific scopes (e.g., `Desk.tickets.READ`) instead of `.ALL` when possible

### 2. Error Handling

**Implement Robust Error Handling**:
```javascript
const safeAPICall = async (apiFunction, ...args) => {
  try {
    return await apiFunction(...args);
  } catch (error) {
    if (error.response?.status === 401) {
      // Refresh token and retry
      await refreshToken();
      return await apiFunction(...args);
    }

    if (error.response?.status === 429) {
      // Handle rate limiting
      const resetTime = error.response.headers['x-ratelimit-reset'];
      await waitUntil(resetTime);
      return await apiFunction(...args);
    }

    // Log and rethrow other errors
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
};
```

**Use Exponential Backoff for Retries**:
```javascript
const exponentialBackoff = async (fn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      const delay = Math.pow(2, i) * 1000;
      console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};
```

### 3. Performance Optimization

**Batch Operations**:
```javascript
// Instead of creating tickets one by one
for (const ticketData of ticketsToCreate) {
  await createTicket(accessToken, orgId, ticketData);
}

// Process in batches to respect rate limits
const batchSize = 10;
for (let i = 0; i < ticketsToCreate.length; i += batchSize) {
  const batch = ticketsToCreate.slice(i, i + batchSize);
  await Promise.all(
    batch.map(data => createTicket(accessToken, orgId, data))
  );
  // Small delay between batches
  await new Promise(resolve => setTimeout(resolve, 1000));
}
```

**Implement Caching**:
```javascript
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getCachedDepartments = async (accessToken, orgId) => {
  const cacheKey = `departments_${orgId}`;
  const cached = cache.get(cacheKey);

  if (cached && cached.timestamp > Date.now() - CACHE_TTL) {
    return cached.data;
  }

  const departments = await listDepartments(accessToken, orgId);
  cache.set(cacheKey, {
    data: departments,
    timestamp: Date.now()
  });

  return departments;
};
```

**Pagination for Large Datasets**:
```javascript
const getAllTickets = async (accessToken, orgId) => {
  const allTickets = [];
  let fromIndex = 0;
  const limit = 100;

  while (true) {
    const response = await axios.get(
      'https://desk.zoho.com/api/v1/tickets',
      {
        params: { from: fromIndex, limit },
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`,
          'orgId': orgId
        }
      }
    );

    if (!response.data.data || response.data.data.length === 0) {
      break;
    }

    allTickets.push(...response.data.data);
    fromIndex += limit;
  }

  return allTickets;
};
```

### 4. Data Validation

**Validate Input Before API Calls**:
```javascript
const validateTicketData = (ticketData) => {
  const validStatuses = ['Open', 'On Hold', 'Escalated', 'Closed'];
  const validPriorities = ['Low', 'Medium', 'High', 'Urgent'];

  if (!ticketData.subject || ticketData.subject.length < 3) {
    throw new Error('Subject must be at least 3 characters');
  }

  if (ticketData.status && !validStatuses.includes(ticketData.status)) {
    throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  if (ticketData.priority && !validPriorities.includes(ticketData.priority)) {
    throw new Error(`Invalid priority. Must be one of: ${validPriorities.join(', ')}`);
  }

  return true;
};

// Use before creating tickets
const createValidatedTicket = async (accessToken, orgId, ticketData) => {
  validateTicketData(ticketData);
  return await createTicket(accessToken, orgId, ticketData);
};
```

### 5. Monitoring and Logging

**Track API Usage**:
```javascript
class APIMonitor {
  constructor() {
    this.calls = [];
  }

  logCall(endpoint, method, status, duration) {
    this.calls.push({
      endpoint,
      method,
      status,
      duration,
      timestamp: new Date()
    });
  }

  getStats() {
    return {
      totalCalls: this.calls.length,
      avgDuration: this.calls.reduce((sum, c) => sum + c.duration, 0) / this.calls.length,
      errorRate: this.calls.filter(c => c.status >= 400).length / this.calls.length,
      callsByEndpoint: this.calls.reduce((acc, c) => {
        acc[c.endpoint] = (acc[c.endpoint] || 0) + 1;
        return acc;
      }, {})
    };
  }
}
```

**Implement Comprehensive Logging**:
```javascript
const logger = {
  info: (message, data) => console.log(`[INFO] ${message}`, data),
  error: (message, error) => console.error(`[ERROR] ${message}`, error),
  warn: (message, data) => console.warn(`[WARN] ${message}`, data)
};

const createTicketWithLogging = async (accessToken, orgId, ticketData) => {
  logger.info('Creating ticket', { subject: ticketData.subject });

  try {
    const ticket = await createTicket(accessToken, orgId, ticketData);
    logger.info('Ticket created successfully', {
      ticketId: ticket.id,
      ticketNumber: ticket.ticketNumber
    });
    return ticket;
  } catch (error) {
    logger.error('Failed to create ticket', {
      error: error.message,
      ticketData
    });
    throw error;
  }
};
```

### 6. Webhook Best Practices

**Validate Webhook Signatures**:
```javascript
const crypto = require('crypto');

const validateWebhookSignature = (payload, signature, secret) => {
  const computedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');

  return computedSignature === signature;
};

// Use in webhook handler
app.post('/webhook/zoho-desk', (req, res) => {
  const signature = req.headers['x-zoho-signature'];

  if (!validateWebhookSignature(req.body, signature, webhookSecret)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Process webhook
  processWebhook(req.body);
  res.status(200).json({ received: true });
});
```

**Implement Idempotency**:
```javascript
const processedWebhooks = new Set();

const processWebhook = (webhookData) => {
  const webhookId = webhookData.id ||
    `${webhookData.eventType}_${webhookData.payload.id}_${webhookData.eventTime}`;

  // Skip if already processed
  if (processedWebhooks.has(webhookId)) {
    console.log('Webhook already processed:', webhookId);
    return;
  }

  // Process webhook
  handleWebhookEvent(webhookData);

  // Mark as processed
  processedWebhooks.add(webhookId);
};
```

### 7. Testing

**Write Integration Tests**:
```javascript
const assert = require('assert');

describe('Zoho Desk API Integration', () => {
  let testTicketId;

  it('should create a ticket', async () => {
    const ticket = await createTicket(accessToken, orgId, {
      subject: 'Test Ticket',
      description: 'Integration test',
      departmentId: testDepartmentId,
      contactId: testContactId,
      status: 'Open'
    });

    assert(ticket.id);
    assert.equal(ticket.subject, 'Test Ticket');
    testTicketId = ticket.id;
  });

  it('should update ticket status', async () => {
    const updated = await updateTicket(accessToken, orgId, testTicketId, {
      status: 'Closed'
    });

    assert.equal(updated.status, 'Closed');
  });

  it('should delete the ticket', async () => {
    await deleteTicket(accessToken, orgId, testTicketId);

    // Verify deletion
    try {
      await getTicket(accessToken, orgId, testTicketId);
      assert.fail('Ticket should not exist');
    } catch (error) {
      assert.equal(error.response.status, 404);
    }
  });
});
```

---

## Data Centers

Zoho Desk operates in multiple data centers. Use the appropriate base URL for your region:

| Data Center | Base URL |
|-------------|----------|
| US | https://desk.zoho.com |
| EU | https://desk.zoho.eu |
| IN | https://desk.zoho.in |
| AU | https://desk.zoho.com.au |
| JP | https://desk.zoho.jp |
| CA | https://desk.zoho.ca |
| CN | https://desk.zoho.com.cn |

**Important**: The OAuth token domain must match your API domain. Check the `api_domain` in your OAuth token response.

---

## Additional Resources

- [Official Zoho Desk API Documentation](https://desk.zoho.com/support/APIDocument.do)
- [Zoho Desk Developer Portal](https://www.zoho.com/desk/developers/)
- [Zoho API Console](https://api-console.zoho.com/)
- [Developer Community Forums](https://help.zoho.com/portal/en/community/desk)
- [Postman Collection](https://www.postman.com/zoho-desk)
- [Status Page](https://status.zoho.com/)

---

## SDK Support

While Zoho Desk doesn't have official SDKs like Zoho CRM, you can use the REST API directly with any HTTP client library:

**Recommended Libraries**:
- **JavaScript/Node.js**: axios, node-fetch, got
- **Python**: requests, httpx, aiohttp
- **PHP**: Guzzle
- **Ruby**: httparty, faraday
- **Java**: OkHttp, Apache HttpClient
- **C#**: HttpClient, RestSharp

---

## Changelog

### v1 (Current)
- Full CRUD operations for all modules
- Webhook support for real-time notifications
- SLA tracking and management
- Advanced search capabilities
- Attachment handling
- Multi-channel ticket support
- OAuth 2.0 authentication
- Comprehensive error handling

---

**Last Updated**: December 2025
**API Version**: v1
