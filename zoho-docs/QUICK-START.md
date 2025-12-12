# ⚡ Zoho Quick Start Guide

**Get coding in 5 minutes** - Copy-paste ready examples for the most common Zoho operations.

---

## Prerequisites

- **OAuth Access Token** - [Get it in 60 seconds →](./guides/authentication/README.md#self-client-quickest-for-scripts)
- **Organization ID** (for Books, Desk, Inventory) - Found in Zoho product settings
- **API Domain** - `https://www.zohoapis.com` (US) or [your data center](./guides/authentication/README.md#data-centers)

---

## 🎯 Top 10 Operations

### 1. Get OAuth Access Token (60 seconds)

**Fastest Method: Self Client**

```bash
# Step 1: Visit https://api-console.zoho.com/ → Create Self Client
# Step 2: Copy the generated code (expires in 3 minutes)
# Step 3: Run this command:

curl -X POST "https://accounts.zoho.com/oauth/v2/token" \
  -d "grant_type=authorization_code" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "code=PASTE_CODE_HERE"

# Response includes access_token and refresh_token
# Save refresh_token - it never expires!
```

**Refresh Token** (use in production):
```javascript
const axios = require('axios');

async function getAccessToken() {
  const response = await axios.post('https://accounts.zoho.com/oauth/v2/token', null, {
    params: {
      refresh_token: 'YOUR_REFRESH_TOKEN',
      client_id: 'YOUR_CLIENT_ID',
      client_secret: 'YOUR_CLIENT_SECRET',
      grant_type: 'refresh_token'
    }
  });
  return response.data.access_token;
}
```

[Full OAuth Guide →](./guides/authentication/README.md)

---

### 2. Create CRM Lead (2 minutes)

**JavaScript:**
```javascript
const axios = require('axios');

async function createLead() {
  const response = await axios.post(
    'https://www.zohoapis.com/crm/v8/Leads',
    {
      data: [{
        Last_Name: 'Smith',
        First_Name: 'John',
        Company: 'Acme Corp',
        Email: 'john.smith@acme.com',
        Phone: '555-1234'
      }]
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data;
}
```

**Python:**
```python
import requests

def create_lead(access_token):
    response = requests.post(
        'https://www.zohoapis.com/crm/v8/Leads',
        json={
            'data': [{
                'Last_Name': 'Smith',
                'First_Name': 'John',
                'Company': 'Acme Corp',
                'Email': 'john.smith@acme.com'
            }]
        },
        headers={'Authorization': f'Zoho-oauthtoken {access_token}'}
    )
    return response.json()
```

**Deluge:**
```javascript
leadData = {
  "Last_Name": "Smith",
  "First_Name": "John",
  "Company": "Acme Corp",
  "Email": "john.smith@acme.com"
};

response = zoho.crm.createRecord("Leads", leadData);
info response;
```

**Required Scope:** `ZohoCRM.modules.leads.CREATE`

[Full CRM API →](./api-reference/crm/README.md) | [Error Codes →](./guides/error-handling/README.md)

---

### 3. Get CRM Records (2 minutes)

**JavaScript:**
```javascript
async function getLeads(page = 1, perPage = 200) {
  const response = await axios.get(
    `https://www.zohoapis.com/crm/v8/Leads`,
    {
      params: { page, per_page: perPage },
      headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}` }
    }
  );

  return response.data.data; // Array of leads
}

// Get all leads (auto-pagination)
async function* getAllLeads() {
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await axios.get(
      `https://www.zohoapis.com/crm/v8/Leads`,
      {
        params: { page, per_page: 200 },
        headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}` }
      }
    );

    yield response.data.data;
    hasMore = response.data.info.more_records;
    page++;
  }
}

// Usage:
for await (const batch of getAllLeads()) {
  console.log(`Got ${batch.length} leads`);
}
```

**Deluge:**
```javascript
// Get first 200 records
leads = zoho.crm.getRecords("Leads", 1, 200);

for each lead in leads {
  leadName = lead.get("Last_Name");
  leadEmail = lead.get("Email");
  info leadName + " - " + leadEmail;
}
```

[Full CRM API →](./api-reference/crm/README.md#get-records)

---

### 4. Update CRM Record (2 minutes)

**JavaScript:**
```javascript
async function updateLead(leadId, updates) {
  const response = await axios.put(
    `https://www.zohoapis.com/crm/v8/Leads/${leadId}`,
    { data: [updates] },
    { headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}` } }
  );

  return response.data;
}

// Example:
await updateLead('4150868000004361001', {
  Lead_Status: 'Qualified',
  Lead_Score: 85
});
```

**Deluge:**
```javascript
updateData = {
  "Lead_Status": "Qualified",
  "Lead_Score": 85
};

response = zoho.crm.updateRecord("Leads", leadId, updateData);
```

[Full CRM API →](./api-reference/crm/README.md#update-record)

---

### 5. Search CRM Records (3 minutes)

**JavaScript:**
```javascript
async function searchLeads(criteria) {
  const response = await axios.get(
    'https://www.zohoapis.com/crm/v8/Leads/search',
    {
      params: { criteria },
      headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}` }
    }
  );

  return response.data.data;
}

// Examples:
const results1 = await searchLeads('(Email:equals:john@acme.com)');
const results2 = await searchLeads('(Lead_Status:equals:Qualified)and(Annual_Revenue:greater_than:1000000)');
```

**Deluge:**
```javascript
criteria = "(Email:equals:john@acme.com)";
results = zoho.crm.searchRecords("Leads", criteria);

for each lead in results {
  info lead.get("Last_Name");
}
```

**Common Criteria Patterns:**
```
(Field:equals:Value)
(Field:starts_with:Value)
(Field:contains:Value)
(Field:greater_than:1000)
(Field1:equals:Value1)and(Field2:equals:Value2)
(Field1:equals:Value1)or(Field2:equals:Value2)
```

[Full Search Guide →](./api-reference/crm/README.md#search-records)

---

### 6. Create Books Invoice (3 minutes)

**JavaScript:**
```javascript
async function createInvoice(orgId) {
  const response = await axios.post(
    `https://www.zohoapis.com/books/v3/invoices`,
    {
      customer_id: '4150868000000079043',
      invoice_number: 'INV-001',
      date: '2025-01-15',
      line_items: [{
        item_id: '4150868000000075049',
        name: 'Web Design Services',
        description: 'Website redesign project',
        rate: 5000,
        quantity: 1
      }]
    },
    {
      params: { organization_id: orgId },
      headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}` }
    }
  );

  return response.data.invoice;
}
```

**Deluge:**
```javascript
invoiceData = {
  "customer_id": "4150868000000079043",
  "line_items": [
    {
      "item_id": "4150868000000075049",
      "quantity": 1,
      "rate": 5000
    }
  ]
};

response = zoho.books.createRecord("invoices", orgId, invoiceData);
```

**Required:** `organization_id` parameter in all Books API calls

[Full Books API →](./api-reference/books/README.md)

---

### 7. Create Desk Ticket (3 minutes)

**JavaScript:**
```javascript
async function createTicket(orgId) {
  const response = await axios.post(
    `https://desk.zoho.com/api/v1/tickets`,
    {
      contactId: '4150868000000091001',
      subject: 'Unable to login',
      description: 'Customer reports login issues after password reset',
      departmentId: '4150868000000006907',
      priority: 'High',
      status: 'Open'
    },
    {
      params: { orgId },
      headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}` }
    }
  );

  return response.data;
}
```

**Deluge:**
```javascript
ticketData = {
  "contactId": "4150868000000091001",
  "subject": "Unable to login",
  "description": "Customer reports login issues",
  "departmentId": "4150868000000006907",
  "status": "Open",
  "priority": "High"
};

response = zoho.desk.createRecord("tickets", orgId, ticketData);
```

[Full Desk API →](./api-reference/desk/README.md)

---

### 8. Creator: Add Record (3 minutes)

**JavaScript:**
```javascript
async function addCreatorRecord() {
  const response = await axios.post(
    'https://creator.zoho.com/api/v2/account_owner/app_link_name/form/form_link_name',
    {
      data: {
        Customer_Name: 'John Smith',
        Email: 'john@example.com',
        Phone: '555-1234',
        Status: 'Active'
      }
    },
    { headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}` } }
  );

  return response.data;
}
```

**Deluge:**
```javascript
recordData = {
  "Customer_Name": "John Smith",
  "Email": "john@example.com",
  "Phone": "555-1234",
  "Status": "Active"
};

response = zoho.creator.createRecord(
  "account_owner",
  "app_link_name",
  "form_link_name",
  recordData,
  "creator_connection"
);
```

[Full Creator API →](./api-reference/creator/README.md)

---

### 9. Creator: Query Records (ZCQL) (4 minutes)

**Deluge:**
```javascript
// Simple query
query = "SELECT Customer_Name, Email, Phone FROM Customers WHERE Status = 'Active'";
results = zoho.creator.query(query, "creator_connection");

for each row in results {
  customerName = row.get("Customer_Name");
  email = row.get("Email");
  info customerName + " - " + email;
}

// Advanced query with JOIN
query = "SELECT Orders.Order_ID, Customers.Customer_Name, Orders.Total_Amount " +
        "FROM Orders " +
        "JOIN Customers ON Orders.Customer_ID = Customers.ID " +
        "WHERE Orders.Status = 'Completed' " +
        "ORDER BY Orders.Total_Amount DESC " +
        "LIMIT 50";

results = zoho.creator.query(query, "creator_connection");
```

**JavaScript:**
```javascript
async function queryCreatorRecords() {
  const query = `
    SELECT Customer_Name, Email, Phone
    FROM Customers
    WHERE Status = 'Active'
    ORDER BY Customer_Name
    LIMIT 200
  `;

  const response = await axios.post(
    'https://creator.zoho.com/api/v2/account_owner/app_link_name/query',
    { query },
    { headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}` } }
  );

  return response.data.data;
}
```

[Full ZCQL Reference →](./api-reference/creator/README.md#zcql-queries)

---

### 10. Send Email via Deluge (2 minutes)

**Deluge:**
```javascript
// Simple email
sendmail
[
  from: zoho.adminuserid
  to: "customer@example.com"
  subject: "Welcome to our service!"
  message: "Thank you for signing up. We're excited to have you on board."
]

// Email with CC, BCC, and attachments
sendmail
[
  from: zoho.adminuserid
  to: "customer@example.com"
  cc: "sales@company.com"
  bcc: "archive@company.com"
  subject: "Your invoice is ready"
  message: "Please find your invoice attached."
  attachments: [file:invoiceId]
]

// HTML email
htmlContent = "<html><body>";
htmlContent = htmlContent + "<h1>Welcome!</h1>";
htmlContent = htmlContent + "<p>Thank you for signing up.</p>";
htmlContent = htmlContent + "</body></html>";

sendmail
[
  from: zoho.adminuserid
  to: "customer@example.com"
  subject: "Welcome"
  message: htmlContent
]
```

[Full Deluge Email Reference →](./deluge/api-integration/README.md#sending-emails)

---

## 🔧 Common Patterns

### Pattern 1: Auto-Refresh Token

**JavaScript:**
```javascript
class ZohoAPI {
  constructor(clientId, clientSecret, refreshToken) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.refreshToken = refreshToken;
    this.accessToken = null;
    this.expiresAt = 0;
  }

  async getAccessToken() {
    // Refresh 5 minutes before expiry
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

  async request(method, url, data = null) {
    const token = await this.getAccessToken();
    const config = {
      method,
      url,
      headers: { 'Authorization': `Zoho-oauthtoken ${token}` }
    };

    if (data) config.data = data;

    return axios(config);
  }
}

// Usage:
const zoho = new ZohoAPI(CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN);
const leads = await zoho.request('GET', 'https://www.zohoapis.com/crm/v8/Leads');
```

---

### Pattern 2: Bulk Operations

**JavaScript:**
```javascript
async function bulkCreateLeads(leadsArray) {
  // Zoho allows max 100 records per request
  const chunks = [];
  for (let i = 0; i < leadsArray.length; i += 100) {
    chunks.push(leadsArray.slice(i, i + 100));
  }

  const results = [];
  for (const chunk of chunks) {
    const response = await axios.post(
      'https://www.zohoapis.com/crm/v8/Leads',
      { data: chunk },
      { headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}` } }
    );
    results.push(...response.data.data);

    // Avoid rate limits: wait 100ms between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return results;
}
```

---

### Pattern 3: Error Handling

**JavaScript:**
```javascript
async function createLeadWithErrorHandling(leadData) {
  try {
    const response = await axios.post(
      'https://www.zohoapis.com/crm/v8/Leads',
      { data: [leadData] },
      { headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}` } }
    );

    return { success: true, data: response.data };

  } catch (error) {
    if (error.response) {
      const errorCode = error.response.data.code;
      const errorMessage = error.response.data.message;

      switch (errorCode) {
        case 'INVALID_TOKEN':
          // Token expired - refresh and retry
          accessToken = await refreshAccessToken();
          return createLeadWithErrorHandling(leadData); // Retry

        case 'MANDATORY_NOT_FOUND':
          return {
            success: false,
            error: 'Missing required field',
            details: error.response.data.details
          };

        case 'DUPLICATE_DATA':
          return {
            success: false,
            error: 'Lead already exists',
            message: errorMessage
          };

        case 'RATE_LIMIT_EXCEEDED':
          // Wait and retry
          await new Promise(resolve => setTimeout(resolve, 60000));
          return createLeadWithErrorHandling(leadData);

        default:
          return {
            success: false,
            error: errorCode,
            message: errorMessage
          };
      }
    } else {
      // Network error
      return {
        success: false,
        error: 'NETWORK_ERROR',
        message: error.message
      };
    }
  }
}
```

**Deluge:**
```javascript
try {
  response = zoho.crm.createRecord("Leads", leadData);
  info "Lead created: " + response.get("id");
} catch (e) {
  info "Error creating lead: " + e;

  // Log error for troubleshooting
  errorLog = Map();
  errorLog.put("error", e);
  errorLog.put("leadData", leadData);
  errorLog.put("timestamp", zoho.currenttime);

  // Could also send alert email or create task
}
```

---

## 📚 Next Steps

### Common Tasks by Product

**CRM:**
- [Create Lead →](./api-reference/crm/README.md#create-record)
- [Search Records →](./api-reference/crm/README.md#search-records)
- [Update Deal Stage →](./api-reference/crm/README.md#update-record)
- [Get Related Records →](./api-reference/crm/README.md#related-records)
- [Bulk Import →](./api-reference/crm/README.md#bulk-apis)

**Books:**
- [Create Invoice →](./api-reference/books/README.md#create-invoice)
- [Create Customer →](./api-reference/books/README.md#create-contact)
- [Record Payment →](./api-reference/books/README.md#record-payment)
- [Get Outstanding Invoices →](./api-reference/books/README.md#get-invoices)

**Desk:**
- [Create Ticket →](./api-reference/desk/README.md#create-ticket)
- [Assign Ticket →](./api-reference/desk/README.md#update-ticket)
- [Add Comment →](./api-reference/desk/README.md#add-comment)
- [Get Ticket History →](./api-reference/desk/README.md#get-ticket-history)

**Creator:**
- [Add Record →](./api-reference/creator/README.md#add-record)
- [Query Records (ZCQL) →](./api-reference/creator/README.md#zcql-queries)
- [Update Record →](./api-reference/creator/README.md#update-record)
- [Delete Record →](./api-reference/creator/README.md#delete-record)

**Projects:**
- [Create Task →](./api-reference/projects/README.md#create-task)
- [Create Milestone →](./api-reference/projects/README.md#create-milestone)
- [Log Time →](./api-reference/projects/README.md#log-time)
- [Add Comment →](./api-reference/projects/README.md#add-comment)

### Comprehensive Guides

- **[Authentication →](./guides/authentication/README.md)** - Complete OAuth 2.0 setup
- **[Rate Limits →](./guides/rate-limits/README.md)** - Handling API limits across all products
- **[Webhooks →](./guides/webhooks/README.md)** - Real-time event notifications
- **[Error Handling →](./guides/error-handling/README.md)** - Common errors and solutions
- **[Best Practices →](./guides/best-practices/README.md)** - Security, performance, testing
- **[Integration Patterns →](./guides/integration-patterns/README.md)** - Multi-product workflows

### Language References

- **[Deluge Complete Reference →](./deluge/README.md)** - Zoho's scripting language
- **[Deluge Examples →](./deluge/examples/README.md)** - 22 real-world scenarios
- **[API Cheat Sheet →](./quick-reference/api-cheatsheet.md)** - Quick syntax reference
- **[OAuth Cheat Sheet →](./quick-reference/oauth-cheatsheet.md)** - Authentication quick reference
- **[Endpoints Index →](./quick-reference/endpoints-index.md)** - All 500+ API endpoints

---

## ⚠️ Common Errors & Quick Fixes

| Error Code | Cause | Quick Fix |
|------------|-------|-----------|
| `INVALID_TOKEN` | Access token expired | Refresh token using refresh_token grant |
| `MANDATORY_NOT_FOUND` | Missing required field | Check API docs for required fields |
| `DUPLICATE_DATA` | Record already exists | Use update instead of create, or search first |
| `RATE_LIMIT_EXCEEDED` | Too many requests | Wait 60 seconds, implement rate limiting |
| `INVALID_MODULE` | Wrong module name | Check module API name (case-sensitive) |
| `OAUTH_SCOPE_MISMATCH` | Missing permission | Add required scope in OAuth setup |

[Full Error Reference →](./guides/error-handling/README.md)

---

## 🔗 Quick Links

- [All API References](./api-reference/) - 51 Zoho products
- [Deluge Language](./deluge/README.md) - Complete scripting reference
- [Integration Guides](./guides/) - Best practices and patterns
- [Quick Reference](./quick-reference/) - Cheat sheets and lookups

---

**Last Updated**: December 2025
