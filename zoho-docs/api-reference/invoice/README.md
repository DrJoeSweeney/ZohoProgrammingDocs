# Zoho Invoice API Reference

## Overview

Zoho Invoice is a streamlined invoicing solution designed for freelancers and small businesses. The API provides programmatic access to invoicing, payments, expenses, and customer management. It's similar to Zoho Books but focused specifically on invoicing operations.

**Current API Version**: v3
**Base URL**: `https://www.zohoapis.com/invoice/v3/`
**Protocol**: REST
**Data Format**: JSON
**Authentication**: OAuth 2.0

---

## Quick Links

- [Authentication](#authentication)
- [Rate Limits](#rate-limits)
- [Data Centers](#data-centers)
- [API Modules](#api-modules)
- [Common Operations](#common-operations)
- [Error Codes](#error-codes)
- [Best Practices](#best-practices)
- [Code Examples](#code-examples)

---

## API Modules

### 1. Customers
**Purpose**: Manage customer information and contacts

**Endpoints**:
```http
GET    /customers                      # List all customers
GET    /customers/{customer_id}        # Get customer details
POST   /customers                      # Create customer
PUT    /customers/{customer_id}        # Update customer
DELETE /customers/{customer_id}        # Delete customer
POST   /customers/{customer_id}/active # Activate customer
POST   /customers/{customer_id}/inactive # Deactivate customer
```

**Example - Create Customer**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const createCustomer = async (accessToken, organizationId) => {
  const response = await axios.post(
    'https://www.zohoapis.com/invoice/v3/customers',
    {
      contact_name: 'Acme Corporation',
      company_name: 'Acme Corporation',
      payment_terms: 15,
      payment_terms_label: 'Net 15',
      currency_id: '12345000000000099',
      billing_address: {
        address: '123 Main Street',
        street2: 'Suite 100',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'USA'
      },
      shipping_address: {
        address: '123 Main Street',
        street2: 'Suite 100',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'USA'
      },
      contact_persons: [{
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@acme.com',
        phone: '555-0123',
        mobile: '555-0124',
        is_primary_contact: true
      }],
      notes: 'Key customer - VIP service'
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      },
      params: {
        organization_id: organizationId
      }
    }
  );
  return response.data;
};
```

```python
# Python
import requests

def create_customer(access_token, organization_id):
    url = 'https://www.zohoapis.com/invoice/v3/customers'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    params = {
        'organization_id': organization_id
    }
    data = {
        'contact_name': 'Acme Corporation',
        'company_name': 'Acme Corporation',
        'payment_terms': 15,
        'payment_terms_label': 'Net 15',
        'currency_id': '12345000000000099',
        'billing_address': {
            'address': '123 Main Street',
            'street2': 'Suite 100',
            'city': 'New York',
            'state': 'NY',
            'zip': '10001',
            'country': 'USA'
        },
        'contact_persons': [{
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john.doe@acme.com',
            'phone': '555-0123',
            'is_primary_contact': True
        }],
        'notes': 'Key customer - VIP service'
    }
    response = requests.post(url, json=data, headers=headers, params=params)
    return response.json()
```

```deluge
// Deluge
customer_data = {
    "contact_name": "Acme Corporation",
    "company_name": "Acme Corporation",
    "payment_terms": 15,
    "payment_terms_label": "Net 15",
    "billing_address": {
        "address": "123 Main Street",
        "city": "New York",
        "state": "NY",
        "zip": "10001",
        "country": "USA"
    },
    "contact_persons": [
        {
            "first_name": "John",
            "last_name": "Doe",
            "email": "john.doe@acme.com",
            "phone": "555-0123",
            "is_primary_contact": true
        }
    ]
};

response = zoho.invoice.createRecord("customers", organization_id, customer_data);
info response;
```

**Response**:
```json
{
  "code": 0,
  "message": "The customer has been added.",
  "customer": {
    "customer_id": "12345000000234567",
    "contact_name": "Acme Corporation",
    "company_name": "Acme Corporation",
    "status": "active",
    "payment_terms": 15,
    "payment_terms_label": "Net 15",
    "currency_id": "12345000000000099",
    "currency_code": "USD",
    "outstanding_receivable_amount": 0,
    "unused_credits_receivable_amount": 0,
    "created_time": "2025-01-15T10:30:00-0800",
    "last_modified_time": "2025-01-15T10:30:00-0800"
  }
}
```

---

### 2. Invoices
**Purpose**: Create, manage, and track invoices

**Endpoints**:
```http
GET    /invoices                      # List all invoices
GET    /invoices/{invoice_id}         # Get invoice details
POST   /invoices                      # Create invoice
PUT    /invoices/{invoice_id}         # Update invoice
DELETE /invoices/{invoice_id}         # Delete invoice
POST   /invoices/{invoice_id}/status/sent # Mark as sent
POST   /invoices/{invoice_id}/email   # Email invoice
POST   /invoices/{invoice_id}/void    # Void invoice
GET    /invoices/{invoice_id}/payments # Get invoice payments
POST   /invoices/{invoice_id}/payments # Record payment
GET    /invoices/{invoice_id}/pdf     # Download PDF
```

**Invoice Statuses**:
- Draft
- Sent
- Viewed
- Overdue
- Paid
- Void
- Partially Paid

**Example - Create Invoice**:
```javascript
// JavaScript/Node.js
const createInvoice = async (accessToken, organizationId) => {
  const response = await axios.post(
    'https://www.zohoapis.com/invoice/v3/invoices',
    {
      customer_id: '12345000000234567',
      invoice_number: 'INV-00001',
      reference_number: 'PO-2025-001',
      date: '2025-01-15',
      due_date: '2025-01-30',
      payment_terms: 15,
      payment_terms_label: 'Net 15',
      line_items: [
        {
          item_id: '12345000000345678',
          name: 'Website Design',
          description: 'Custom website design and development',
          rate: 5000.00,
          quantity: 1,
          unit: 'project',
          tax_id: '12345000000456789',
          discount: 0
        },
        {
          item_id: '12345000000345679',
          name: 'SEO Optimization',
          description: 'Search engine optimization services',
          rate: 1500.00,
          quantity: 1,
          unit: 'service',
          tax_id: '12345000000456789'
        }
      ],
      discount: 0,
      is_discount_before_tax: true,
      discount_type: 'entity_level',
      shipping_charge: 0,
      adjustment: 0,
      adjustment_description: '',
      notes: 'Thank you for your business!',
      terms: 'Payment is due within 15 days of invoice date.',
      custom_fields: [
        {
          customfield_id: '12345000000567890',
          value: 'Project-2025-001'
        }
      ]
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      },
      params: {
        organization_id: organizationId,
        send: false  // Set to true to auto-send to customer
      }
    }
  );
  return response.data;
};
```

```python
# Python
def create_invoice(access_token, organization_id):
    url = 'https://www.zohoapis.com/invoice/v3/invoices'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    params = {
        'organization_id': organization_id,
        'send': False
    }
    data = {
        'customer_id': '12345000000234567',
        'invoice_number': 'INV-00001',
        'date': '2025-01-15',
        'due_date': '2025-01-30',
        'payment_terms': 15,
        'line_items': [
            {
                'item_id': '12345000000345678',
                'name': 'Website Design',
                'description': 'Custom website design and development',
                'rate': 5000.00,
                'quantity': 1,
                'tax_id': '12345000000456789'
            },
            {
                'item_id': '12345000000345679',
                'name': 'SEO Optimization',
                'description': 'Search engine optimization services',
                'rate': 1500.00,
                'quantity': 1,
                'tax_id': '12345000000456789'
            }
        ],
        'notes': 'Thank you for your business!',
        'terms': 'Payment is due within 15 days of invoice date.'
    }
    response = requests.post(url, json=data, headers=headers, params=params)
    return response.json()
```

**Response**:
```json
{
  "code": 0,
  "message": "The invoice has been created.",
  "invoice": {
    "invoice_id": "12345000000567890",
    "invoice_number": "INV-00001",
    "status": "draft",
    "customer_id": "12345000000234567",
    "customer_name": "Acme Corporation",
    "date": "2025-01-15",
    "due_date": "2025-01-30",
    "payment_terms": 15,
    "payment_terms_label": "Net 15",
    "currency_id": "12345000000000099",
    "currency_code": "USD",
    "line_items": [
      {
        "line_item_id": "12345000000678901",
        "item_id": "12345000000345678",
        "name": "Website Design",
        "description": "Custom website design and development",
        "rate": 5000.00,
        "quantity": 1,
        "tax_id": "12345000000456789",
        "tax_name": "Sales Tax",
        "tax_percentage": 8.5,
        "item_total": 5000.00
      },
      {
        "line_item_id": "12345000000678902",
        "item_id": "12345000000345679",
        "name": "SEO Optimization",
        "description": "Search engine optimization services",
        "rate": 1500.00,
        "quantity": 1,
        "tax_id": "12345000000456789",
        "tax_name": "Sales Tax",
        "tax_percentage": 8.5,
        "item_total": 1500.00
      }
    ],
    "sub_total": 6500.00,
    "tax_total": 552.50,
    "total": 7052.50,
    "balance": 7052.50,
    "created_time": "2025-01-15T10:30:00-0800",
    "last_modified_time": "2025-01-15T10:30:00-0800"
  }
}
```

---

### 3. Payments
**Purpose**: Record and manage customer payments

**Endpoints**:
```http
GET    /customerpayments                    # List all payments
GET    /customerpayments/{payment_id}       # Get payment details
POST   /customerpayments                    # Record payment
PUT    /customerpayments/{payment_id}       # Update payment
DELETE /customerpayments/{payment_id}       # Delete payment
```

**Payment Modes**:
- Cash
- Check
- Credit Card
- Bank Transfer
- PayPal
- Stripe
- Other

**Example - Record Payment**:
```javascript
// JavaScript/Node.js
const recordPayment = async (accessToken, organizationId) => {
  const response = await axios.post(
    'https://www.zohoapis.com/invoice/v3/customerpayments',
    {
      customer_id: '12345000000234567',
      payment_mode: 'check',
      amount: 7052.50,
      date: '2025-01-20',
      reference_number: 'CHK-1234',
      description: 'Payment received via check',
      invoices: [
        {
          invoice_id: '12345000000567890',
          amount_applied: 7052.50
        }
      ]
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      },
      params: {
        organization_id: organizationId
      }
    }
  );
  return response.data;
};
```

---

### 4. Estimates
**Purpose**: Create and manage sales estimates/quotes

**Endpoints**:
```http
GET    /estimates                         # List all estimates
GET    /estimates/{estimate_id}           # Get estimate details
POST   /estimates                         # Create estimate
PUT    /estimates/{estimate_id}           # Update estimate
DELETE /estimates/{estimate_id}           # Delete estimate
POST   /estimates/{estimate_id}/status/sent # Mark as sent
POST   /estimates/{estimate_id}/status/accepted # Mark as accepted
POST   /estimates/{estimate_id}/status/declined # Mark as declined
POST   /estimates/{estimate_id}/email     # Email estimate
POST   /estimates/{estimate_id}/converttoInvoice # Convert to invoice
```

**Estimate Statuses**:
- Draft
- Sent
- Accepted
- Declined
- Invoiced
- Expired

**Example - Create Estimate**:
```python
# Python
def create_estimate(access_token, organization_id):
    url = 'https://www.zohoapis.com/invoice/v3/estimates'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    params = {
        'organization_id': organization_id
    }
    data = {
        'customer_id': '12345000000234567',
        'estimate_number': 'EST-00001',
        'reference_number': 'RFQ-2025-001',
        'date': '2025-01-15',
        'expiry_date': '2025-02-15',
        'line_items': [
            {
                'item_id': '12345000000345678',
                'name': 'Mobile App Development',
                'description': 'iOS and Android mobile application',
                'rate': 15000.00,
                'quantity': 1,
                'tax_id': '12345000000456789'
            }
        ],
        'notes': 'This estimate is valid for 30 days.',
        'terms': 'Payment terms: 50% upfront, 50% upon completion.',
        'discount': 1500,
        'is_discount_before_tax': True,
        'discount_type': 'entity_level'
    }
    response = requests.post(url, json=data, headers=headers, params=params)
    return response.json()
```

**Example - Convert Estimate to Invoice**:
```javascript
// JavaScript/Node.js
const convertToInvoice = async (accessToken, organizationId, estimateId) => {
  const response = await axios.post(
    `https://www.zohoapis.com/invoice/v3/estimates/${estimateId}/converttoInvoice`,
    {},
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      },
      params: {
        organization_id: organizationId
      }
    }
  );
  return response.data;
};
```

---

### 5. Credit Notes
**Purpose**: Manage customer credits and refunds

**Endpoints**:
```http
GET    /creditnotes                       # List all credit notes
GET    /creditnotes/{creditnote_id}       # Get credit note details
POST   /creditnotes                       # Create credit note
PUT    /creditnotes/{creditnote_id}       # Update credit note
DELETE /creditnotes/{creditnote_id}       # Delete credit note
POST   /creditnotes/{creditnote_id}/email # Email credit note
POST   /creditnotes/{creditnote_id}/void  # Void credit note
POST   /creditnotes/{creditnote_id}/refunds # Issue refund
```

**Example - Create Credit Note**:
```javascript
// JavaScript/Node.js
const createCreditNote = async (accessToken, organizationId) => {
  const response = await axios.post(
    'https://www.zohoapis.com/invoice/v3/creditnotes',
    {
      customer_id: '12345000000234567',
      creditnote_number: 'CN-00001',
      date: '2025-01-20',
      reference_number: 'REF-REFUND-001',
      line_items: [
        {
          name: 'Refund - Website Design',
          description: 'Partial refund for service issues',
          rate: 1000.00,
          quantity: 1,
          tax_id: '12345000000456789'
        }
      ],
      notes: 'Credit issued for service issues'
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      },
      params: {
        organization_id: organizationId
      }
    }
  );
  return response.data;
};
```

---

### 6. Expenses
**Purpose**: Track business expenses

**Endpoints**:
```http
GET    /expenses                      # List all expenses
GET    /expenses/{expense_id}         # Get expense details
POST   /expenses                      # Create expense
PUT    /expenses/{expense_id}         # Update expense
DELETE /expenses/{expense_id}         # Delete expense
POST   /expenses/{expense_id}/receipt # Upload receipt
```

**Example - Create Expense**:
```python
# Python
def create_expense(access_token, organization_id):
    url = 'https://www.zohoapis.com/invoice/v3/expenses'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    params = {
        'organization_id': organization_id
    }
    data = {
        'account_id': '12345000000789012',
        'date': '2025-01-15',
        'amount': 250.00,
        'tax_id': '12345000000456789',
        'is_billable': True,
        'customer_id': '12345000000234567',
        'vendor_id': '12345000000876543',
        'description': 'Client dinner meeting',
        'reference_number': 'RCPT-1234',
        'expense_category': 'Meals and Entertainment'
    }
    response = requests.post(url, json=data, headers=headers, params=params)
    return response.json()
```

---

### 7. Items
**Purpose**: Manage products and services

**Endpoints**:
```http
GET    /items                         # List all items
GET    /items/{item_id}               # Get item details
POST   /items                         # Create item
PUT    /items/{item_id}               # Update item
DELETE /items/{item_id}               # Delete item
POST   /items/{item_id}/active        # Activate item
POST   /items/{item_id}/inactive      # Deactivate item
```

**Item Types**:
- Sales
- Service
- Digital

**Example - Create Item**:
```javascript
// JavaScript/Node.js
const createItem = async (accessToken, organizationId) => {
  const response = await axios.post(
    'https://www.zohoapis.com/invoice/v3/items',
    {
      name: 'Website Design Package',
      rate: 5000.00,
      description: 'Professional website design and development',
      item_type: 'service',
      tax_id: '12345000000456789',
      sku: 'WEB-DESIGN-001',
      unit: 'project',
      status: 'active'
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      },
      params: {
        organization_id: organizationId
      }
    }
  );
  return response.data;
};
```

---

### 8. Recurring Invoices
**Purpose**: Automate recurring billing

**Endpoints**:
```http
GET    /recurringinvoices                    # List recurring invoices
GET    /recurringinvoices/{recurring_id}     # Get details
POST   /recurringinvoices                    # Create recurring invoice
PUT    /recurringinvoices/{recurring_id}     # Update recurring invoice
DELETE /recurringinvoices/{recurring_id}     # Delete recurring invoice
POST   /recurringinvoices/{recurring_id}/status/active # Activate
POST   /recurringinvoices/{recurring_id}/status/stop   # Stop
```

**Recurrence Frequencies**:
- days
- weeks
- months
- years

**Example - Create Recurring Invoice**:
```javascript
// JavaScript/Node.js
const createRecurringInvoice = async (accessToken, organizationId) => {
  const response = await axios.post(
    'https://www.zohoapis.com/invoice/v3/recurringinvoices',
    {
      customer_id: '12345000000234567',
      recurrence_name: 'Monthly Subscription - Acme Corp',
      start_date: '2025-01-01',
      end_date: '2025-12-31',
      recurrence_frequency: 'months',
      repeat_every: 1,
      payment_terms: 15,
      payment_terms_label: 'Net 15',
      line_items: [
        {
          item_id: '12345000000345678',
          name: 'Monthly Subscription',
          rate: 299.00,
          quantity: 1,
          tax_id: '12345000000456789'
        }
      ],
      notes: 'Thank you for your continued business!',
      send_automatically: true
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      },
      params: {
        organization_id: organizationId
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
  scope=ZohoInvoice.fullaccess.all&
  client_id={client_id}&
  response_type=code&
  access_type=offline&
  redirect_uri={redirect_uri}
```

**Available Scopes**:
- `ZohoInvoice.fullaccess.all` - Full access to all Invoice data
- `ZohoInvoice.invoices.READ` - Read invoices
- `ZohoInvoice.invoices.CREATE` - Create invoices
- `ZohoInvoice.invoices.UPDATE` - Update invoices
- `ZohoInvoice.invoices.DELETE` - Delete invoices
- Similar scopes for customers, estimates, payments, etc.

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

## organization_id Requirement

**IMPORTANT**: All Zoho Invoice API requests require an `organization_id` parameter.

### Getting Organization ID

```javascript
// JavaScript/Node.js
const getOrganizations = async (accessToken) => {
  const response = await axios.get(
    'https://www.zohoapis.com/invoice/v3/organizations',
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data.organizations;
};
```

---

## Rate Limits

### API Call Limits

| Plan | API Calls per Minute | API Calls per Day |
|------|---------------------|-------------------|
| Free | 60 | 1,000 |
| Standard | 100 | 5,000 |
| Professional | 150 | 15,000 |
| Premium | 200 | 25,000 |

### Rate Limit Headers

```http
X-Rate-Limit-Limit: 100
X-Rate-Limit-Remaining: 87
X-Rate-Limit-Reset: 1673827200
```

---

## Data Centers

| Data Center | Base URL | Accounts URL |
|-------------|----------|--------------|
| US | https://www.zohoapis.com | https://accounts.zoho.com |
| EU | https://www.zohoapis.eu | https://accounts.zoho.eu |
| IN | https://www.zohoapis.in | https://accounts.zoho.in |
| AU | https://www.zohoapis.com.au | https://accounts.zoho.com.au |
| JP | https://www.zohoapis.jp | https://accounts.zoho.jp |

---

## Error Codes

### HTTP Status Codes

| Status | Meaning | Common Causes |
|--------|---------|---------------|
| 200 | Success | Request completed successfully |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid parameters |
| 401 | Unauthorized | Invalid access token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Zoho Invoice Error Codes

| Code | Message | Description | Solution |
|------|---------|-------------|----------|
| 0 | Success | Operation successful | N/A |
| 1 | Invalid arguments | Missing/invalid parameters | Check parameters |
| 2 | Invalid organization ID | Invalid organization_id | Verify organization_id |
| 57 | Invalid token | Token expired | Refresh access token |
| 4001 | Mandatory field missing | Required field not provided | Include required fields |
| 4005 | Invoice not found | Invoice doesn't exist | Verify invoice ID |

---

## Common Operations

### 1. Complete Invoice Workflow

```javascript
// JavaScript/Node.js
const completeInvoiceWorkflow = async (accessToken, organizationId) => {
  try {
    // 1. Create customer
    const customer = await createCustomer(accessToken, organizationId);
    console.log('Customer created:', customer.customer.customer_id);

    // 2. Create invoice
    const invoice = await createInvoice(accessToken, organizationId);
    console.log('Invoice created:', invoice.invoice.invoice_id);

    // 3. Mark as sent
    await axios.post(
      `https://www.zohoapis.com/invoice/v3/invoices/${invoice.invoice.invoice_id}/status/sent`,
      {},
      {
        headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}` },
        params: { organization_id: organizationId }
      }
    );

    // 4. Email invoice
    await axios.post(
      `https://www.zohoapis.com/invoice/v3/invoices/${invoice.invoice.invoice_id}/email`,
      {
        to_mail_ids: [customer.customer.email],
        subject: 'Invoice from Your Company',
        body: 'Please find attached your invoice.'
      },
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json'
        },
        params: { organization_id: organizationId }
      }
    );

    // 5. Record payment
    await recordPayment(accessToken, organizationId);

    return { success: true, invoice_id: invoice.invoice.invoice_id };

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
};
```

### 2. Monthly Reporting

```python
# Python
import requests
from datetime import datetime, timedelta

def get_monthly_revenue(access_token, organization_id, year, month):
    url = 'https://www.zohoapis.com/invoice/v3/invoices'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }

    start_date = f'{year}-{month:02d}-01'
    if month == 12:
        end_date = f'{year + 1}-01-01'
    else:
        end_date = f'{year}-{month + 1:02d}-01'

    params = {
        'organization_id': organization_id,
        'date_start': start_date,
        'date_end': end_date,
        'status': 'paid'
    }

    response = requests.get(url, headers=headers, params=params)
    invoices = response.json().get('invoices', [])

    total_revenue = sum(inv['total'] for inv in invoices)
    invoice_count = len(invoices)

    return {
        'total_revenue': total_revenue,
        'invoice_count': invoice_count,
        'month': f'{year}-{month:02d}'
    }
```

---

## Best Practices

### 1. Token Management

```javascript
// Implement automatic token refresh
class ZohoInvoiceClient {
  constructor(config) {
    this.config = config;
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
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          refresh_token: this.config.refreshToken
        }
      }
    );

    this.accessToken = response.data.access_token;
    this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
  }
}
```

### 2. Error Handling

```python
def make_request_with_retry(fn, max_retries=3):
    for attempt in range(max_retries):
        try:
            return fn()
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 429 and attempt < max_retries - 1:
                wait_time = (2 ** attempt) + random.uniform(0, 1)
                time.sleep(wait_time)
                continue
            raise
```

### 3. Data Validation

```javascript
const validateInvoiceData = (data) => {
  if (!data.customer_id) throw new Error('customer_id is required');
  if (!data.line_items || data.line_items.length === 0) {
    throw new Error('At least one line item is required');
  }
  return true;
};
```

---

## Additional Resources

- [Official Zoho Invoice API Documentation](https://www.zoho.com/invoice/api/v3/)
- [API Console](https://api-console.zoho.com/)
- [Zoho Invoice Help](https://www.zoho.com/invoice/help/)
- [Developer Forums](https://help.zoho.com/portal/en/community/invoice)

---

**Last Updated**: December 2025
**API Version**: v3
