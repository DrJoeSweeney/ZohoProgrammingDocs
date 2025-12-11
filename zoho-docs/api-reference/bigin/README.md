# Zoho Bigin API Reference

## Overview

Zoho Bigin is a simplified CRM solution designed specifically for small businesses. Built on the same foundation as Zoho CRM, Bigin provides streamlined pipeline management, contact tracking, and sales automation with an easy-to-use interface.

**Current API Version**: v2
**Base URL**: `https://www.zohoapis.com/bigin/v2/`
**Protocol**: REST
**Data Format**: JSON
**Authentication**: OAuth 2.0

---

## Quick Links

- [Authentication](#authentication)
- [Rate Limits](#rate-limits)
- [Data Centers](#data-centers)
- [Core APIs](#core-apis)
- [Common Operations](#common-operations)
- [Error Codes](#error-codes)
- [Best Practices](#best-practices)
- [Code Examples](#code-examples)

---

## Core APIs

### 1. Pipelines

**Purpose**: Manage sales pipelines and deal stages

**Endpoints**:
```http
GET    /bigin/v2/settings/pipelines              # List all pipelines
GET    /bigin/v2/settings/pipelines/{pipeline_id} # Get pipeline details
POST   /bigin/v2/settings/pipelines              # Create pipeline
PUT    /bigin/v2/settings/pipelines/{pipeline_id} # Update pipeline
DELETE /bigin/v2/settings/pipelines/{pipeline_id} # Delete pipeline
```

**Pipeline Structure**:
- Pipeline name
- Stages (ordered list)
- Probability per stage
- Default pipeline flag

**Example - Get All Pipelines**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const getPipelines = async (accessToken) => {
  const response = await axios.get(
    'https://www.zohoapis.com/bigin/v2/settings/pipelines',
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};

// Usage
const pipelines = await getPipelines(accessToken);
console.log('Pipelines:', pipelines);
```

```python
# Python
import requests

def get_pipelines(access_token):
    url = 'https://www.zohoapis.com/bigin/v2/settings/pipelines'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    response = requests.get(url, headers=headers)
    return response.json()

# Usage
pipelines = get_pipelines(access_token)
print('Pipelines:', pipelines)
```

```deluge
// Deluge
// Get all pipelines
response = invokeurl
[
    url: "https://www.zohoapis.com/bigin/v2/settings/pipelines"
    type: GET
    connection: "bigin_connection"
];

info response;
```

**Response**:
```json
{
  "pipelines": [
    {
      "id": "123456000000012345",
      "display_value": "Sales Pipeline",
      "maps": [
        {
          "display_value": "Qualification",
          "id": "123456000000012346",
          "sequence_number": 1,
          "probability": 10
        },
        {
          "display_value": "Needs Analysis",
          "id": "123456000000012347",
          "sequence_number": 2,
          "probability": 25
        },
        {
          "display_value": "Proposal",
          "id": "123456000000012348",
          "sequence_number": 3,
          "probability": 50
        },
        {
          "display_value": "Negotiation",
          "id": "123456000000012349",
          "sequence_number": 4,
          "probability": 75
        },
        {
          "display_value": "Closed Won",
          "id": "123456000000012350",
          "sequence_number": 5,
          "probability": 100
        }
      ],
      "default": true
    }
  ]
}
```

---

### 2. Contacts

**Purpose**: Manage customer and prospect contact information

**Endpoints**:
```http
GET    /bigin/v2/Contacts                        # List all contacts
GET    /bigin/v2/Contacts/{contact_id}           # Get contact details
POST   /bigin/v2/Contacts                        # Create contact
PUT    /bigin/v2/Contacts/{contact_id}           # Update contact
DELETE /bigin/v2/Contacts/{contact_id}           # Delete contact
GET    /bigin/v2/Contacts/search                 # Search contacts
POST   /bigin/v2/Contacts/upsert                 # Upsert contacts
```

**Standard Fields**:
- First_Name
- Last_Name
- Email
- Phone
- Mobile
- Company_Name
- Job_Title
- Address
- City
- State
- Zip_Code
- Country
- Description
- Tag (multi-select)

**Example - Create Contact**:
```javascript
// JavaScript/Node.js
const createContact = async (accessToken, contactData) => {
  const response = await axios.post(
    'https://www.zohoapis.com/bigin/v2/Contacts',
    {
      data: [contactData]
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
const contact = {
  First_Name: 'John',
  Last_Name: 'Doe',
  Email: 'john.doe@example.com',
  Phone: '555-0123',
  Mobile: '555-0124',
  Company_Name: 'Acme Corporation',
  Job_Title: 'CEO',
  Address: '123 Main Street',
  City: 'New York',
  State: 'NY',
  Zip_Code: '10001',
  Country: 'USA',
  Description: 'Key decision maker',
  Tag: ['VIP', 'Decision Maker']
};

const result = await createContact(accessToken, contact);
console.log('Contact created:', result);
```

```python
# Python
def create_contact(access_token, contact_data):
    url = 'https://www.zohoapis.com/bigin/v2/Contacts'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'data': [contact_data]
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()

# Usage
contact = {
    'First_Name': 'John',
    'Last_Name': 'Doe',
    'Email': 'john.doe@example.com',
    'Phone': '555-0123',
    'Mobile': '555-0124',
    'Company_Name': 'Acme Corporation',
    'Job_Title': 'CEO',
    'Address': '123 Main Street',
    'City': 'New York',
    'State': 'NY',
    'Zip_Code': '10001',
    'Country': 'USA',
    'Description': 'Key decision maker',
    'Tag': ['VIP', 'Decision Maker']
}

result = create_contact(access_token, contact)
print('Contact created:', result)
```

```deluge
// Deluge
contact_data = {
    "First_Name": "John",
    "Last_Name": "Doe",
    "Email": "john.doe@example.com",
    "Phone": "555-0123",
    "Mobile": "555-0124",
    "Company_Name": "Acme Corporation",
    "Job_Title": "CEO",
    "Address": "123 Main Street",
    "City": "New York",
    "State": "NY",
    "Zip_Code": "10001",
    "Country": "USA",
    "Description": "Key decision maker",
    "Tag": ["VIP", "Decision Maker"]
};

response = zoho.bigin.createRecord("Contacts", contact_data);
info response;
```

**Response**:
```json
{
  "data": [
    {
      "code": "SUCCESS",
      "details": {
        "id": "123456000000234567",
        "created_time": "2025-01-15T10:30:00+00:00",
        "modified_time": "2025-01-15T10:30:00+00:00",
        "created_by": {
          "id": "123456000000012340",
          "name": "Admin User"
        },
        "modified_by": {
          "id": "123456000000012340",
          "name": "Admin User"
        }
      },
      "message": "record added",
      "status": "success"
    }
  ]
}
```

---

### 3. Companies

**Purpose**: Manage company/account information

**Endpoints**:
```http
GET    /bigin/v2/Companies                       # List all companies
GET    /bigin/v2/Companies/{company_id}          # Get company details
POST   /bigin/v2/Companies                       # Create company
PUT    /bigin/v2/Companies/{company_id}          # Update company
DELETE /bigin/v2/Companies/{company_id}          # Delete company
GET    /bigin/v2/Companies/search                # Search companies
```

**Standard Fields**:
- Company_Name
- Email
- Phone
- Website
- Industry
- Annual_Revenue
- Number_of_Employees
- Address
- City
- State
- Zip_Code
- Country
- Description
- Tag

**Example - Create Company**:
```javascript
// JavaScript/Node.js
const createCompany = async (accessToken, companyData) => {
  const response = await axios.post(
    'https://www.zohoapis.com/bigin/v2/Companies',
    {
      data: [companyData]
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
const company = {
  Company_Name: 'TechCorp Inc',
  Email: 'info@techcorp.com',
  Phone: '555-1000',
  Website: 'www.techcorp.com',
  Industry: 'Technology',
  Annual_Revenue: 5000000,
  Number_of_Employees: 50,
  Address: '456 Tech Boulevard',
  City: 'San Francisco',
  State: 'CA',
  Zip_Code: '94105',
  Country: 'USA',
  Description: 'Leading tech solutions provider',
  Tag: ['Technology', 'B2B']
};

const result = await createCompany(accessToken, company);
console.log('Company created:', result);
```

---

### 4. Deals (Pipelines)

**Purpose**: Manage deals through sales pipelines

**Endpoints**:
```http
GET    /bigin/v2/Pipelines                       # List all deals
GET    /bigin/v2/Pipelines/{deal_id}             # Get deal details
POST   /bigin/v2/Pipelines                       # Create deal
PUT    /bigin/v2/Pipelines/{deal_id}             # Update deal
DELETE /bigin/v2/Pipelines/{deal_id}             # Delete deal
GET    /bigin/v2/Pipelines/search                # Search deals
```

**Standard Fields**:
- Deal_Name
- Amount
- Stage
- Pipeline
- Expected_Close_Date
- Contact_Name (lookup)
- Company_Name (lookup)
- Owner
- Description
- Probability
- Tag

**Example - Create Deal**:
```javascript
// JavaScript/Node.js
const createDeal = async (accessToken, dealData) => {
  const response = await axios.post(
    'https://www.zohoapis.com/bigin/v2/Pipelines',
    {
      data: [dealData]
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
const deal = {
  Deal_Name: 'Website Redesign Project',
  Amount: 25000,
  Stage: 'Proposal',
  Pipeline: {
    id: '123456000000012345'
  },
  Expected_Close_Date: '2025-02-28',
  Contact_Name: {
    id: '123456000000234567'
  },
  Company_Name: {
    id: '123456000000345678'
  },
  Description: 'Complete website redesign with modern UI/UX',
  Probability: 50,
  Tag: ['Website', 'Design']
};

const result = await createDeal(accessToken, deal);
console.log('Deal created:', result);
```

```python
# Python
def create_deal(access_token, deal_data):
    url = 'https://www.zohoapis.com/bigin/v2/Pipelines'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'data': [deal_data]
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()

# Usage
deal = {
    'Deal_Name': 'Website Redesign Project',
    'Amount': 25000,
    'Stage': 'Proposal',
    'Pipeline': {
        'id': '123456000000012345'
    },
    'Expected_Close_Date': '2025-02-28',
    'Contact_Name': {
        'id': '123456000000234567'
    },
    'Company_Name': {
        'id': '123456000000345678'
    },
    'Description': 'Complete website redesign with modern UI/UX',
    'Probability': 50,
    'Tag': ['Website', 'Design']
}

result = create_deal(access_token, deal)
print('Deal created:', result)
```

**Response**:
```json
{
  "data": [
    {
      "code": "SUCCESS",
      "details": {
        "id": "123456000000456789",
        "created_time": "2025-01-15T10:30:00+00:00",
        "modified_time": "2025-01-15T10:30:00+00:00"
      },
      "message": "record added",
      "status": "success"
    }
  ]
}
```

---

### 5. Tasks

**Purpose**: Manage tasks and to-dos

**Endpoints**:
```http
GET    /bigin/v2/Tasks                           # List all tasks
GET    /bigin/v2/Tasks/{task_id}                 # Get task details
POST   /bigin/v2/Tasks                           # Create task
PUT    /bigin/v2/Tasks/{task_id}                 # Update task
DELETE /bigin/v2/Tasks/{task_id}                 # Delete task
```

**Standard Fields**:
- Subject
- Due_Date
- Status (Not Started, In Progress, Completed, Deferred, Waiting)
- Priority (High, Normal, Low)
- Related_To (Contact, Company, Deal)
- Owner
- Description
- Reminder

**Example - Create Task**:
```javascript
// JavaScript/Node.js
const createTask = async (accessToken, taskData) => {
  const response = await axios.post(
    'https://www.zohoapis.com/bigin/v2/Tasks',
    {
      data: [taskData]
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
const task = {
  Subject: 'Follow up with client',
  Due_Date: '2025-01-20',
  Status: 'Not Started',
  Priority: 'High',
  Related_To: {
    module: 'Contacts',
    id: '123456000000234567'
  },
  Description: 'Call to discuss project timeline',
  Reminder: {
    type: 'email',
    time: '2025-01-20T09:00:00Z'
  }
};

const result = await createTask(accessToken, task);
console.log('Task created:', result);
```

---

### 6. Events

**Purpose**: Manage calendar events and meetings

**Endpoints**:
```http
GET    /bigin/v2/Events                          # List all events
GET    /bigin/v2/Events/{event_id}               # Get event details
POST   /bigin/v2/Events                          # Create event
PUT    /bigin/v2/Events/{event_id}               # Update event
DELETE /bigin/v2/Events/{event_id}               # Delete event
```

**Standard Fields**:
- Event_Title
- Start_DateTime
- End_DateTime
- Location
- Participants (Contacts)
- Related_To (Contact, Company, Deal)
- Owner
- Description
- Reminder

**Example - Create Event**:
```javascript
// JavaScript/Node.js
const createEvent = async (accessToken, eventData) => {
  const response = await axios.post(
    'https://www.zohoapis.com/bigin/v2/Events',
    {
      data: [eventData]
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
const event = {
  Event_Title: 'Client Meeting',
  Start_DateTime: '2025-01-20T14:00:00Z',
  End_DateTime: '2025-01-20T15:00:00Z',
  Location: 'Conference Room A',
  Participants: [
    {
      id: '123456000000234567'
    }
  ],
  Related_To: {
    module: 'Pipelines',
    id: '123456000000456789'
  },
  Description: 'Discuss project proposal and timeline',
  Reminder: {
    type: 'email',
    time: '2025-01-20T13:30:00Z'
  }
};

const result = await createEvent(accessToken, event);
console.log('Event created:', result);
```

---

### 7. Notes

**Purpose**: Add notes to records

**Endpoints**:
```http
GET    /bigin/v2/Notes                           # List all notes
GET    /bigin/v2/Notes/{note_id}                 # Get note details
POST   /bigin/v2/Notes                           # Create note
PUT    /bigin/v2/Notes/{note_id}                 # Update note
DELETE /bigin/v2/Notes/{note_id}                 # Delete note
```

**Standard Fields**:
- Note_Title
- Note_Content
- Parent_Id (related record)
- Owner

**Example - Create Note**:
```javascript
// JavaScript/Node.js
const createNote = async (accessToken, noteData) => {
  const response = await axios.post(
    'https://www.zohoapis.com/bigin/v2/Notes',
    {
      data: [noteData]
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

// Usage - Add note to a contact
const note = {
  Note_Title: 'Initial Call Notes',
  Note_Content: 'Client is interested in our services. Discussed pricing and timeline. Follow up next week.',
  Parent_Id: {
    module: 'Contacts',
    id: '123456000000234567'
  }
};

const result = await createNote(accessToken, note);
console.log('Note created:', result);
```

---

### 8. Products

**Purpose**: Manage product catalog

**Endpoints**:
```http
GET    /bigin/v2/Products                        # List all products
GET    /bigin/v2/Products/{product_id}           # Get product details
POST   /bigin/v2/Products                        # Create product
PUT    /bigin/v2/Products/{product_id}           # Update product
DELETE /bigin/v2/Products/{product_id}           # Delete product
```

**Standard Fields**:
- Product_Name
- Product_Code
- Unit_Price
- Description
- Product_Category
- Product_Active (boolean)
- Taxable (boolean)
- Tax_Percentage

**Example - Create Product**:
```javascript
// JavaScript/Node.js
const createProduct = async (accessToken, productData) => {
  const response = await axios.post(
    'https://www.zohoapis.com/bigin/v2/Products',
    {
      data: [productData]
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
const product = {
  Product_Name: 'Professional Website Package',
  Product_Code: 'WEB-PRO-001',
  Unit_Price: 5000,
  Description: 'Complete professional website with up to 10 pages',
  Product_Category: 'Web Services',
  Product_Active: true,
  Taxable: true,
  Tax_Percentage: 8.5
};

const result = await createProduct(accessToken, product);
console.log('Product created:', result);
```

---

### 9. Search API

**Purpose**: Search across all modules

**Endpoint**:
```http
GET    /bigin/v2/{module}/search
```

**Query Parameters**:
- `criteria` - Search criteria
- `email` - Search by email
- `phone` - Search by phone
- `word` - Full-text search

**Example - Search Contacts**:
```javascript
// JavaScript/Node.js
const searchContacts = async (accessToken, searchTerm) => {
  const response = await axios.get(
    'https://www.zohoapis.com/bigin/v2/Contacts/search',
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      },
      params: {
        criteria: `(Email:equals:${searchTerm})`
      }
    }
  );
  return response.data;
};

// Usage - Search by email
const contacts = await searchContacts(accessToken, 'john@example.com');
console.log('Found contacts:', contacts);

// Search by phone
const searchByPhone = async (accessToken, phone) => {
  const response = await axios.get(
    'https://www.zohoapis.com/bigin/v2/Contacts/search',
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      },
      params: {
        phone: phone
      }
    }
  );
  return response.data;
};

// Full-text search
const fullTextSearch = async (accessToken, keyword) => {
  const response = await axios.get(
    'https://www.zohoapis.com/bigin/v2/Contacts/search',
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      },
      params: {
        word: keyword
      }
    }
  );
  return response.data;
};
```

```python
# Python
def search_contacts(access_token, search_term):
    url = 'https://www.zohoapis.com/bigin/v2/Contacts/search'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'criteria': f'(Email:equals:{search_term})'
    }
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Usage
contacts = search_contacts(access_token, 'john@example.com')
print('Found contacts:', contacts)
```

---

### 10. Bulk Operations

**Purpose**: Perform bulk create, update, or upsert operations

**Endpoints**:
```http
POST   /bigin/v2/{module}                        # Bulk create (up to 100 records)
PUT    /bigin/v2/{module}                        # Bulk update (up to 100 records)
POST   /bigin/v2/{module}/upsert                 # Bulk upsert (up to 100 records)
```

**Example - Bulk Create Contacts**:
```javascript
// JavaScript/Node.js
const bulkCreateContacts = async (accessToken, contacts) => {
  const response = await axios.post(
    'https://www.zohoapis.com/bigin/v2/Contacts',
    {
      data: contacts
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

// Usage - Create multiple contacts at once
const contacts = [
  {
    First_Name: 'Alice',
    Last_Name: 'Johnson',
    Email: 'alice@example.com',
    Company_Name: 'ABC Inc'
  },
  {
    First_Name: 'Bob',
    Last_Name: 'Williams',
    Email: 'bob@example.com',
    Company_Name: 'XYZ Corp'
  },
  {
    First_Name: 'Carol',
    Last_Name: 'Davis',
    Email: 'carol@example.com',
    Company_Name: 'Tech Solutions'
  }
];

const result = await bulkCreateContacts(accessToken, contacts);
console.log('Bulk create result:', result);
```

```python
# Python - Bulk upsert
def bulk_upsert_contacts(access_token, contacts):
    url = 'https://www.zohoapis.com/bigin/v2/Contacts/upsert'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'data': contacts,
        'duplicate_check_fields': ['Email']
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()

# Usage
contacts = [
    {
        'First_Name': 'John',
        'Last_Name': 'Doe',
        'Email': 'john@example.com',
        'Phone': '555-0123'
    },
    # ... more contacts
]

result = bulk_upsert_contacts(access_token, contacts)
print('Upsert result:', result)
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
  scope=ZohoBigin.modules.ALL,ZohoBigin.settings.ALL&
  client_id={client_id}&
  response_type=code&
  access_type=offline&
  redirect_uri={redirect_uri}
```

**Available Scopes**:
- `ZohoBigin.modules.ALL` - Full access to all modules
- `ZohoBigin.modules.READ` - Read-only access to modules
- `ZohoBigin.modules.Contacts.ALL` - Full access to Contacts
- `ZohoBigin.modules.Companies.ALL` - Full access to Companies
- `ZohoBigin.modules.Pipelines.ALL` - Full access to Deals/Pipelines
- `ZohoBigin.modules.Tasks.ALL` - Full access to Tasks
- `ZohoBigin.modules.Events.ALL` - Full access to Events
- `ZohoBigin.modules.Products.ALL` - Full access to Products
- `ZohoBigin.settings.ALL` - Full access to settings

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

**JavaScript Token Management Example**:
```javascript
class BiginClient {
  constructor(clientId, clientSecret, refreshToken, apiDomain = 'https://www.zohoapis.com') {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.refreshToken = refreshToken;
    this.apiDomain = apiDomain;
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async ensureValidToken() {
    if (!this.accessToken || Date.now() >= this.tokenExpiry) {
      await this.refreshAccessToken();
    }
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
    this.tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000; // Refresh 1 min early
  }

  async get(endpoint, params = {}) {
    await this.ensureValidToken();

    const response = await axios.get(
      `${this.apiDomain}/bigin/v2${endpoint}`,
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${this.accessToken}`
        },
        params
      }
    );
    return response.data;
  }

  async post(endpoint, data) {
    await this.ensureValidToken();

    const response = await axios.post(
      `${this.apiDomain}/bigin/v2${endpoint}`,
      data,
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  }
}

// Usage
const client = new BiginClient(clientId, clientSecret, refreshToken);
const contacts = await client.get('/Contacts');
console.log('Contacts:', contacts);
```

**Token Lifetime**:
- Access Token: 1 hour
- Refresh Token: Does not expire (store securely)

---

## Rate Limits

### API Call Limits

| Edition | API Calls per Day | API Calls per Minute |
|---------|-------------------|----------------------|
| Express | 5,000 | 10 |
| Premier | 15,000 | 20 |
| Enterprise | 25,000 | 30 |

### Concurrent Connections
- Maximum 10 concurrent API calls per organization

### Bulk Operation Limits
- Maximum 100 records per bulk API call
- Maximum 10 bulk operations per minute

### Rate Limit Headers
```http
X-RateLimit-Limit: 15000
X-RateLimit-Remaining: 14850
X-RateLimit-Reset: 1642147200
```

### Handling Rate Limits

**JavaScript Example**:
```javascript
const makeRequestWithRetry = async (fn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
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

---

## Data Centers

Zoho Bigin operates in multiple data centers. Use the appropriate base URL:

| Data Center | Base URL | Accounts URL |
|-------------|----------|--------------|
| US | https://www.zohoapis.com | https://accounts.zoho.com |
| EU | https://www.zohoapis.eu | https://accounts.zoho.eu |
| IN | https://www.zohoapis.in | https://accounts.zoho.in |
| AU | https://www.zohoapis.com.au | https://accounts.zoho.com.au |
| JP | https://www.zohoapis.jp | https://accounts.zoho.jp |
| CA | https://www.zohoapis.ca | https://accounts.zoho.ca |

---

## Error Codes

### HTTP Status Codes

| Status | Meaning | Common Causes |
|--------|---------|---------------|
| 200 | Success | Request completed successfully |
| 201 | Created | Resource created successfully |
| 204 | No Content | Request successful, no data returned |
| 400 | Bad Request | Invalid parameters or request format |
| 401 | Unauthorized | Invalid or expired access token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource does not exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |

### Bigin Error Codes

| Code | Message | Description | Solution |
|------|---------|-------------|----------|
| INVALID_REQUEST_METHOD | Invalid HTTP method | Wrong HTTP verb used | Use correct method (GET, POST, PUT, DELETE) |
| INVALID_TOKEN | Invalid access token | Token expired or invalid | Refresh access token |
| OAUTH_SCOPE_MISMATCH | Insufficient permissions | Missing required scope | Update OAuth scopes |
| NO_PERMISSION | User lacks access | User doesn't have module permission | Grant appropriate permissions |
| RECORD_NOT_FOUND | Record ID doesn't exist | Invalid record ID | Verify record ID |
| MANDATORY_NOT_FOUND | Required field missing | Missing mandatory field | Include all required fields |
| INVALID_DATA | Invalid field value | Field value doesn't meet criteria | Validate field values |
| DUPLICATE_DATA | Duplicate record | Record with unique field exists | Update existing record or change unique field |
| RATE_LIMIT_EXCEEDED | API rate limit exceeded | Too many API calls | Implement rate limiting |

### Error Response Format

```json
{
  "code": "MANDATORY_NOT_FOUND",
  "details": {
    "api_name": "Last_Name"
  },
  "message": "required field not found",
  "status": "error"
}
```

---

## Common Operations

### 1. Complete Sales Workflow

```javascript
// JavaScript/Node.js - Complete sales workflow
const completeSalesWorkflow = async (client) => {
  try {
    // 1. Create Company
    const company = await client.post('/Companies', {
      data: [{
        Company_Name: 'New Tech Corp',
        Email: 'info@newtech.com',
        Phone: '555-2000',
        Industry: 'Technology'
      }]
    });
    const companyId = company.data[0].details.id;
    console.log('Company created:', companyId);

    // 2. Create Contact
    const contact = await client.post('/Contacts', {
      data: [{
        First_Name: 'Sarah',
        Last_Name: 'Johnson',
        Email: 'sarah@newtech.com',
        Phone: '555-2001',
        Company_Name: {
          id: companyId
        },
        Job_Title: 'CTO'
      }]
    });
    const contactId = contact.data[0].details.id;
    console.log('Contact created:', contactId);

    // 3. Create Deal
    const deal = await client.post('/Pipelines', {
      data: [{
        Deal_Name: 'Enterprise Software License',
        Amount: 50000,
        Stage: 'Qualification',
        Expected_Close_Date: '2025-03-31',
        Contact_Name: {
          id: contactId
        },
        Company_Name: {
          id: companyId
        }
      }]
    });
    const dealId = deal.data[0].details.id;
    console.log('Deal created:', dealId);

    // 4. Create Task
    await client.post('/Tasks', {
      data: [{
        Subject: 'Prepare proposal',
        Due_Date: '2025-01-25',
        Priority: 'High',
        Status: 'Not Started',
        Related_To: {
          module: 'Pipelines',
          id: dealId
        }
      }]
    });
    console.log('Task created');

    // 5. Schedule Meeting
    await client.post('/Events', {
      data: [{
        Event_Title: 'Demo Meeting',
        Start_DateTime: '2025-01-22T14:00:00Z',
        End_DateTime: '2025-01-22T15:00:00Z',
        Participants: [{
          id: contactId
        }],
        Related_To: {
          module: 'Pipelines',
          id: dealId
        }
      }]
    });
    console.log('Meeting scheduled');

    return {
      success: true,
      companyId,
      contactId,
      dealId
    };

  } catch (error) {
    console.error('Workflow error:', error.response?.data || error.message);
    throw error;
  }
};
```

### 2. Update Deal Stage

```javascript
// JavaScript/Node.js - Move deal through pipeline
const updateDealStage = async (client, dealId, newStage) => {
  const response = await client.put(`/Pipelines/${dealId}`, {
    data: [{
      Stage: newStage
    }]
  });
  return response;
};

// Usage
await updateDealStage(client, '123456000000456789', 'Proposal');
await updateDealStage(client, '123456000000456789', 'Negotiation');
await updateDealStage(client, '123456000000456789', 'Closed Won');
```

### 3. Export All Contacts

```python
# Python - Export all contacts with pagination
def export_all_contacts(access_token):
    all_contacts = []
    page = 1
    per_page = 200
    has_more = True

    while has_more:
        url = 'https://www.zohoapis.com/bigin/v2/Contacts'
        headers = {
            'Authorization': f'Zoho-oauthtoken {access_token}'
        }
        params = {
            'page': page,
            'per_page': per_page
        }

        response = requests.get(url, headers=headers, params=params)
        data = response.json()

        if 'data' in data:
            all_contacts.extend(data['data'])
            has_more = data.get('info', {}).get('more_records', False)
            page += 1
        else:
            has_more = False

        print(f'Fetched page {page - 1}, total contacts: {len(all_contacts)}')

    return all_contacts

# Usage
contacts = export_all_contacts(access_token)
print(f'Total contacts exported: {len(contacts)}')
```

### 4. Sync with External System

```deluge
// Deluge - Sync contacts from external system to Bigin
external_contacts = [
    {"name": "John Doe", "email": "john@example.com", "phone": "555-0001"},
    {"name": "Jane Smith", "email": "jane@example.com", "phone": "555-0002"}
];

synced_count = 0;
failed_count = 0;

for each contact in external_contacts {
    // Split name
    name_parts = contact.get("name").split(" ");
    first_name = name_parts.get(0);
    last_name = if(name_parts.size() > 1, name_parts.get(1), "");

    // Prepare Bigin contact data
    bigin_contact = {
        "First_Name": first_name,
        "Last_Name": last_name,
        "Email": contact.get("email"),
        "Phone": contact.get("phone")
    };

    try {
        // Upsert contact (create or update based on email)
        response = zoho.bigin.upsertRecord("Contacts", bigin_contact, {"Email"});
        synced_count = synced_count + 1;
        info "Synced: " + contact.get("email");
    } catch (e) {
        failed_count = failed_count + 1;
        info "Failed: " + contact.get("email") + " - " + e;
    }
}

info "Sync completed. Success: " + synced_count + ", Failed: " + failed_count;
```

---

## Best Practices

### 1. Data Validation

**Validate Before Creating**:
```javascript
const validateContact = (contact) => {
  const errors = [];

  if (!contact.Last_Name || contact.Last_Name.trim() === '') {
    errors.push('Last_Name is required');
  }

  if (contact.Email && !isValidEmail(contact.Email)) {
    errors.push('Email format is invalid');
  }

  if (contact.Phone && !isValidPhone(contact.Phone)) {
    errors.push('Phone format is invalid');
  }

  if (errors.length > 0) {
    throw new Error(`Validation failed: ${errors.join(', ')}`);
  }

  return true;
};

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPhone = (phone) => {
  return /^[\d\s\-\(\)]+$/.test(phone);
};
```

### 2. Error Handling

**Comprehensive Error Handling**:
```javascript
const createContactSafely = async (client, contactData) => {
  try {
    validateContact(contactData);
    const result = await client.post('/Contacts', {
      data: [contactData]
    });
    return {
      success: true,
      data: result.data[0]
    };
  } catch (error) {
    const errorDetails = error.response?.data;

    return {
      success: false,
      error: {
        code: errorDetails?.code || 'UNKNOWN_ERROR',
        message: errorDetails?.message || error.message,
        details: errorDetails?.details
      }
    };
  }
};
```

### 3. Batch Processing

**Process Records in Batches**:
```javascript
const processBatch = async (client, records, batchSize = 100) => {
  const results = [];

  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);

    try {
      const result = await client.post('/Contacts', {
        data: batch
      });
      results.push(...result.data);

      console.log(`Processed batch ${Math.floor(i / batchSize) + 1}: ${batch.length} records`);

      // Rate limiting: wait between batches
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Batch ${Math.floor(i / batchSize) + 1} failed:`, error.message);
    }
  }

  return results;
};
```

### 4. Deduplication

**Check for Duplicates**:
```javascript
const createOrUpdateContact = async (client, contactData) => {
  // Search for existing contact by email
  const existing = await client.get('/Contacts/search', {
    criteria: `(Email:equals:${contactData.Email})`
  });

  if (existing.data && existing.data.length > 0) {
    // Update existing contact
    const contactId = existing.data[0].id;
    return await client.put(`/Contacts/${contactId}`, {
      data: [contactData]
    });
  } else {
    // Create new contact
    return await client.post('/Contacts', {
      data: [contactData]
    });
  }
};
```

---

## Code Examples

### Complete Integration Example

```javascript
// JavaScript/Node.js - Complete Bigin Integration
const axios = require('axios');

class BiginIntegration {
  constructor(config) {
    this.client = new BiginClient(
      config.clientId,
      config.clientSecret,
      config.refreshToken,
      config.apiDomain
    );
  }

  async importLeads(leads) {
    const results = {
      successful: [],
      failed: []
    };

    for (const lead of leads) {
      try {
        // Create or update contact
        const contact = await this.createOrUpdateContact(lead);

        // Create company if provided
        let companyId = null;
        if (lead.companyName) {
          const company = await this.createOrUpdateCompany({
            Company_Name: lead.companyName,
            Email: lead.companyEmail,
            Phone: lead.companyPhone
          });
          companyId = company.id;
        }

        // Create deal if amount provided
        if (lead.dealAmount) {
          await this.createDeal({
            Deal_Name: `Opportunity - ${lead.firstName} ${lead.lastName}`,
            Amount: lead.dealAmount,
            Expected_Close_Date: lead.expectedCloseDate,
            Contact_Name: {
              id: contact.id
            },
            Company_Name: companyId ? {
              id: companyId
            } : null
          });
        }

        results.successful.push({
          email: lead.email,
          contactId: contact.id
        });

      } catch (error) {
        results.failed.push({
          email: lead.email,
          error: error.message
        });
      }
    }

    return results;
  }

  async createOrUpdateContact(data) {
    const contactData = {
      First_Name: data.firstName,
      Last_Name: data.lastName,
      Email: data.email,
      Phone: data.phone,
      Mobile: data.mobile,
      Job_Title: data.jobTitle,
      Company_Name: data.companyName
    };

    // Search for existing
    const existing = await this.client.get('/Contacts/search', {
      criteria: `(Email:equals:${data.email})`
    });

    if (existing.data && existing.data.length > 0) {
      const contactId = existing.data[0].id;
      const updated = await this.client.put(`/Contacts/${contactId}`, {
        data: [contactData]
      });
      return { id: contactId, action: 'updated' };
    } else {
      const created = await this.client.post('/Contacts', {
        data: [contactData]
      });
      return { id: created.data[0].details.id, action: 'created' };
    }
  }

  async createOrUpdateCompany(data) {
    const existing = await this.client.get('/Companies/search', {
      criteria: `(Company_Name:equals:${data.Company_Name})`
    });

    if (existing.data && existing.data.length > 0) {
      return { id: existing.data[0].id, action: 'existing' };
    } else {
      const created = await this.client.post('/Companies', {
        data: [data]
      });
      return { id: created.data[0].details.id, action: 'created' };
    }
  }

  async createDeal(data) {
    return await this.client.post('/Pipelines', {
      data: [data]
    });
  }

  async getDealsByStage(stage) {
    return await this.client.get('/Pipelines/search', {
      criteria: `(Stage:equals:${stage})`
    });
  }

  async getContactActivity(contactId) {
    const tasks = await this.client.get('/Tasks', {
      criteria: `(Related_To.id:equals:${contactId})`
    });

    const events = await this.client.get('/Events', {
      criteria: `(Related_To.id:equals:${contactId})`
    });

    const notes = await this.client.get('/Notes', {
      criteria: `(Parent_Id.id:equals:${contactId})`
    });

    return {
      tasks: tasks.data || [],
      events: events.data || [],
      notes: notes.data || []
    };
  }
}

// Usage
const config = {
  clientId: process.env.BIGIN_CLIENT_ID,
  clientSecret: process.env.BIGIN_CLIENT_SECRET,
  refreshToken: process.env.BIGIN_REFRESH_TOKEN,
  apiDomain: 'https://www.zohoapis.com'
};

const integration = new BiginIntegration(config);

// Import leads
const leads = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '555-0123',
    companyName: 'Acme Corp',
    dealAmount: 25000,
    expectedCloseDate: '2025-03-31'
  },
  // ... more leads
];

const results = await integration.importLeads(leads);
console.log(`Success: ${results.successful.length}, Failed: ${results.failed.length}`);
```

---

## Additional Resources

- [Official Bigin API Documentation](https://www.zoho.com/bigin/developer/api/)
- [Zoho API Console](https://api-console.zoho.com/)
- [Bigin Help Center](https://help.zoho.com/portal/en/kb/bigin)
- [Developer Forums](https://help.zoho.com/portal/en/community/bigin)

---

**Last Updated**: December 2025
**API Version**: v2
