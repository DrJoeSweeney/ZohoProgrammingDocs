# Zoho Books API Reference

## Overview

Zoho Books is a comprehensive cloud-based accounting software that helps businesses manage their finances, invoicing, expenses, and more. The API provides full programmatic access to accounting data and financial operations.

**Current API Version**: v3
**Base URL**: `https://www.zohoapis.com/books/v3/`
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

### 1. Contacts
**Purpose**: Manage customers, vendors, and contact persons

**Endpoints**:
```http
GET    /books/v3/contacts                      # List all contacts
GET    /books/v3/contacts/{contact_id}         # Get contact details
POST   /books/v3/contacts                      # Create contact
PUT    /books/v3/contacts/{contact_id}         # Update contact
DELETE /books/v3/contacts/{contact_id}         # Delete contact
GET    /books/v3/contacts/{contact_id}/comments # Get contact comments
POST   /books/v3/contacts/{contact_id}/comments # Add comment
```

**Contact Types**:
- Customer
- Vendor
- Both (Customer & Vendor)

**Example - Create Contact**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const createContact = async (accessToken, organizationId) => {
  const response = await axios.post(
    'https://www.zohoapis.com/books/v3/contacts',
    {
      contact_name: 'Acme Corporation',
      contact_type: 'customer',
      company_name: 'Acme Corporation',
      payment_terms: 15,
      payment_terms_label: 'Net 15',
      currency_id: '12345000000000099',
      billing_address: {
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'USA'
      },
      shipping_address: {
        address: '123 Main Street',
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
        is_primary_contact: true
      }]
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

def create_contact(access_token, organization_id):
    url = 'https://www.zohoapis.com/books/v3/contacts'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    params = {
        'organization_id': organization_id
    }
    data = {
        'contact_name': 'Acme Corporation',
        'contact_type': 'customer',
        'company_name': 'Acme Corporation',
        'payment_terms': 15,
        'payment_terms_label': 'Net 15',
        'currency_id': '12345000000000099',
        'billing_address': {
            'address': '123 Main Street',
            'city': 'New York',
            'state': 'NY',
            'zip': '10001',
            'country': 'USA'
        },
        'shipping_address': {
            'address': '123 Main Street',
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
        }]
    }
    response = requests.post(url, json=data, headers=headers, params=params)
    return response.json()
```

```deluge
// Deluge
contact_data = {
    "contact_name": "Acme Corporation",
    "contact_type": "customer",
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

response = zoho.books.createRecord("contacts", organization_id, contact_data);
info response;
```

**Response**:
```json
{
  "code": 0,
  "message": "The contact has been added.",
  "contact": {
    "contact_id": "12345000000234567",
    "contact_name": "Acme Corporation",
    "company_name": "Acme Corporation",
    "contact_type": "customer",
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
**Purpose**: Create, manage, and track sales invoices

**Endpoints**:
```http
GET    /books/v3/invoices                      # List all invoices
GET    /books/v3/invoices/{invoice_id}         # Get invoice details
POST   /books/v3/invoices                      # Create invoice
PUT    /books/v3/invoices/{invoice_id}         # Update invoice
DELETE /books/v3/invoices/{invoice_id}         # Delete invoice
POST   /books/v3/invoices/{invoice_id}/status/sent # Mark as sent
POST   /books/v3/invoices/{invoice_id}/email   # Email invoice
POST   /books/v3/invoices/{invoice_id}/void    # Void invoice
GET    /books/v3/invoices/{invoice_id}/payments # Get payments
POST   /books/v3/invoices/{invoice_id}/payments # Record payment
```

**Invoice Statuses**:
- Draft
- Sent
- Overdue
- Paid
- Void
- Partially Paid

**Example - Create Invoice**:
```javascript
// JavaScript/Node.js
const createInvoice = async (accessToken, organizationId) => {
  const response = await axios.post(
    'https://www.zohoapis.com/books/v3/invoices',
    {
      customer_id: '12345000000234567',
      invoice_number: 'INV-00001',
      date: '2025-01-15',
      due_date: '2025-01-30',
      payment_terms: 15,
      payment_terms_label: 'Net 15',
      line_items: [
        {
          item_id: '12345000000345678',
          name: 'Web Design Services',
          description: 'Homepage redesign and implementation',
          rate: 150.00,
          quantity: 40,
          tax_id: '12345000000456789'
        },
        {
          item_id: '12345000000345679',
          name: 'Monthly Hosting',
          description: 'Web hosting - January 2025',
          rate: 99.00,
          quantity: 1,
          tax_id: '12345000000456789'
        }
      ],
      notes: 'Thank you for your business!',
      terms: 'Payment is due within 15 days of invoice date.',
      discount: 0,
      is_discount_before_tax: true,
      discount_type: 'entity_level'
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
def create_invoice(access_token, organization_id):
    url = 'https://www.zohoapis.com/books/v3/invoices'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    params = {
        'organization_id': organization_id
    }
    data = {
        'customer_id': '12345000000234567',
        'invoice_number': 'INV-00001',
        'date': '2025-01-15',
        'due_date': '2025-01-30',
        'payment_terms': 15,
        'payment_terms_label': 'Net 15',
        'line_items': [
            {
                'item_id': '12345000000345678',
                'name': 'Web Design Services',
                'description': 'Homepage redesign and implementation',
                'rate': 150.00,
                'quantity': 40,
                'tax_id': '12345000000456789'
            },
            {
                'item_id': '12345000000345679',
                'name': 'Monthly Hosting',
                'description': 'Web hosting - January 2025',
                'rate': 99.00,
                'quantity': 1,
                'tax_id': '12345000000456789'
            }
        ],
        'notes': 'Thank you for your business!',
        'terms': 'Payment is due within 15 days of invoice date.',
        'discount': 0,
        'is_discount_before_tax': True,
        'discount_type': 'entity_level'
    }
    response = requests.post(url, json=data, headers=headers, params=params)
    return response.json()
```

```deluge
// Deluge
invoice_data = {
    "customer_id": "12345000000234567",
    "invoice_number": "INV-00001",
    "date": "2025-01-15",
    "due_date": "2025-01-30",
    "payment_terms": 15,
    "payment_terms_label": "Net 15",
    "line_items": [
        {
            "item_id": "12345000000345678",
            "name": "Web Design Services",
            "description": "Homepage redesign and implementation",
            "rate": 150.00,
            "quantity": 40,
            "tax_id": "12345000000456789"
        },
        {
            "item_id": "12345000000345679",
            "name": "Monthly Hosting",
            "description": "Web hosting - January 2025",
            "rate": 99.00,
            "quantity": 1,
            "tax_id": "12345000000456789"
        }
    ],
    "notes": "Thank you for your business!",
    "terms": "Payment is due within 15 days of invoice date."
};

response = zoho.books.createRecord("invoices", organization_id, invoice_data);
info response;
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
        "name": "Web Design Services",
        "description": "Homepage redesign and implementation",
        "rate": 150.00,
        "quantity": 40,
        "tax_id": "12345000000456789",
        "tax_name": "Sales Tax",
        "tax_percentage": 8.5,
        "item_total": 6000.00
      },
      {
        "line_item_id": "12345000000678902",
        "item_id": "12345000000345679",
        "name": "Monthly Hosting",
        "description": "Web hosting - January 2025",
        "rate": 99.00,
        "quantity": 1,
        "tax_id": "12345000000456789",
        "tax_name": "Sales Tax",
        "tax_percentage": 8.5,
        "item_total": 99.00
      }
    ],
    "sub_total": 6099.00,
    "tax_total": 518.42,
    "total": 6617.42,
    "balance": 6617.42,
    "created_time": "2025-01-15T10:30:00-0800",
    "last_modified_time": "2025-01-15T10:30:00-0800"
  }
}
```

---

### 3. Estimates
**Purpose**: Create and manage sales estimates/quotes

**Endpoints**:
```http
GET    /books/v3/estimates                     # List all estimates
GET    /books/v3/estimates/{estimate_id}       # Get estimate details
POST   /books/v3/estimates                     # Create estimate
PUT    /books/v3/estimates/{estimate_id}       # Update estimate
DELETE /books/v3/estimates/{estimate_id}       # Delete estimate
POST   /books/v3/estimates/{estimate_id}/status/sent # Mark as sent
POST   /books/v3/estimates/{estimate_id}/status/accepted # Mark as accepted
POST   /books/v3/estimates/{estimate_id}/status/declined # Mark as declined
POST   /books/v3/estimates/{estimate_id}/email # Email estimate
GET    /books/v3/estimates/{estimate_id}/invoices # Convert to invoice
```

**Estimate Statuses**:
- Draft
- Sent
- Accepted
- Declined
- Invoiced

**Example - Create Estimate**:
```javascript
// JavaScript/Node.js
const createEstimate = async (accessToken, organizationId) => {
  const response = await axios.post(
    'https://www.zohoapis.com/books/v3/estimates',
    {
      customer_id: '12345000000234567',
      estimate_number: 'EST-00001',
      reference_number: 'RFQ-2025-001',
      date: '2025-01-15',
      expiry_date: '2025-02-15',
      line_items: [
        {
          item_id: '12345000000345678',
          name: 'Website Development',
          description: 'Custom website with 5 pages',
          rate: 5000.00,
          quantity: 1,
          tax_id: '12345000000456789'
        }
      ],
      notes: 'This estimate is valid for 30 days.',
      terms: 'Payment terms: 50% upfront, 50% upon completion.',
      discount: 500,
      is_discount_before_tax: true,
      discount_type: 'entity_level'
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

### 4. Purchase Orders
**Purpose**: Create and manage purchase orders to vendors

**Endpoints**:
```http
GET    /books/v3/purchaseorders                # List all purchase orders
GET    /books/v3/purchaseorders/{po_id}        # Get PO details
POST   /books/v3/purchaseorders                # Create purchase order
PUT    /books/v3/purchaseorders/{po_id}        # Update purchase order
DELETE /books/v3/purchaseorders/{po_id}        # Delete purchase order
POST   /books/v3/purchaseorders/{po_id}/status/issued # Issue PO
POST   /books/v3/purchaseorders/{po_id}/email  # Email PO
POST   /books/v3/purchaseorders/{po_id}/bills  # Convert to bill
```

**PO Statuses**:
- Draft
- Issued
- Closed
- Cancelled
- Billed

**Example - Create Purchase Order**:
```javascript
// JavaScript/Node.js
const createPurchaseOrder = async (accessToken, organizationId) => {
  const response = await axios.post(
    'https://www.zohoapis.com/books/v3/purchaseorders',
    {
      vendor_id: '12345000000234567',
      purchaseorder_number: 'PO-00001',
      reference_number: 'REF-2025-001',
      date: '2025-01-15',
      delivery_date: '2025-01-30',
      line_items: [
        {
          item_id: '12345000000345678',
          name: 'Office Supplies',
          description: 'Paper, pens, folders',
          rate: 250.00,
          quantity: 10,
          tax_id: '12345000000456789'
        }
      ],
      notes: 'Please deliver to warehouse.',
      terms: 'Payment within 30 days of delivery.'
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

### 5. Bills
**Purpose**: Record and manage vendor bills

**Endpoints**:
```http
GET    /books/v3/bills                         # List all bills
GET    /books/v3/bills/{bill_id}               # Get bill details
POST   /books/v3/bills                         # Create bill
PUT    /books/v3/bills/{bill_id}               # Update bill
DELETE /books/v3/bills/{bill_id}               # Delete bill
POST   /books/v3/bills/{bill_id}/status/void   # Void bill
GET    /books/v3/bills/{bill_id}/payments      # Get payments
POST   /books/v3/bills/{bill_id}/payments      # Record payment
```

**Bill Statuses**:
- Draft
- Open
- Overdue
- Paid
- Void
- Partially Paid

**Example - Create Bill**:
```python
# Python
def create_bill(access_token, organization_id):
    url = 'https://www.zohoapis.com/books/v3/bills'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    params = {
        'organization_id': organization_id
    }
    data = {
        'vendor_id': '12345000000234567',
        'bill_number': 'BILL-00001',
        'reference_number': 'VENDOR-INV-123',
        'date': '2025-01-15',
        'due_date': '2025-02-15',
        'line_items': [
            {
                'account_id': '12345000000789012',
                'description': 'Office rent - January 2025',
                'rate': 2000.00,
                'quantity': 1,
                'tax_id': '12345000000456789'
            }
        ],
        'notes': 'Monthly office rent payment'
    }
    response = requests.post(url, json=data, headers=headers, params=params)
    return response.json()
```

---

### 6. Bank Management
**Purpose**: Manage bank accounts and transactions

**Endpoints**:
```http
GET    /books/v3/bankaccounts                  # List all bank accounts
GET    /books/v3/bankaccounts/{account_id}     # Get account details
POST   /books/v3/bankaccounts                  # Create bank account
PUT    /books/v3/bankaccounts/{account_id}     # Update bank account
DELETE /books/v3/bankaccounts/{account_id}     # Delete bank account
GET    /books/v3/banktransactions              # List transactions
POST   /books/v3/banktransactions              # Create transaction
PUT    /books/v3/banktransactions/{transaction_id} # Update transaction
DELETE /books/v3/banktransactions/{transaction_id} # Delete transaction
POST   /books/v3/banktransactions/{transaction_id}/match # Match transaction
```

**Transaction Types**:
- Deposit
- Withdrawal
- Transfer_fund
- Other_deposit
- Other_withdrawal

**Example - Create Bank Account**:
```javascript
// JavaScript/Node.js
const createBankAccount = async (accessToken, organizationId) => {
  const response = await axios.post(
    'https://www.zohoapis.com/books/v3/bankaccounts',
    {
      account_name: 'Business Checking',
      account_type: 'bank',
      account_number: '****1234',
      routing_number: '123456789',
      bank_name: 'First National Bank',
      currency_id: '12345000000000099',
      description: 'Primary business checking account',
      is_primary_account: true
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

**Example - Record Bank Transaction**:
```javascript
// JavaScript/Node.js
const recordTransaction = async (accessToken, organizationId) => {
  const response = await axios.post(
    'https://www.zohoapis.com/books/v3/banktransactions',
    {
      from_account_id: '12345000000890123',
      transaction_type: 'deposit',
      amount: 5000.00,
      date: '2025-01-15',
      description: 'Client payment received',
      reference_number: 'CHK-789',
      customer_id: '12345000000234567'
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

### 7. Chart of Accounts
**Purpose**: Manage accounting chart of accounts

**Endpoints**:
```http
GET    /books/v3/chartofaccounts               # List all accounts
GET    /books/v3/chartofaccounts/{account_id}  # Get account details
POST   /books/v3/chartofaccounts               # Create account
PUT    /books/v3/chartofaccounts/{account_id}  # Update account
DELETE /books/v3/chartofaccounts/{account_id}  # Delete account
POST   /books/v3/chartofaccounts/{account_id}/active # Activate account
POST   /books/v3/chartofaccounts/{account_id}/inactive # Deactivate account
```

**Account Types**:
- Other Current Asset
- Cash
- Bank
- Fixed Asset
- Other Asset
- Accounts Receivable
- Equity
- Expense
- Cost of Goods Sold
- Income
- Other Income
- Other Current Liability
- Credit Card
- Long Term Liability
- Other Liability
- Accounts Payable

**Example - Create Account**:
```javascript
// JavaScript/Node.js
const createAccount = async (accessToken, organizationId) => {
  const response = await axios.post(
    'https://www.zohoapis.com/books/v3/chartofaccounts',
    {
      account_name: 'Consulting Revenue',
      account_type: 'income',
      account_code: '4010',
      description: 'Revenue from consulting services',
      is_active: true
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

### 8. Projects
**Purpose**: Track time and expenses against projects

**Endpoints**:
```http
GET    /books/v3/projects                      # List all projects
GET    /books/v3/projects/{project_id}         # Get project details
POST   /books/v3/projects                      # Create project
PUT    /books/v3/projects/{project_id}         # Update project
DELETE /books/v3/projects/{project_id}         # Delete project
POST   /books/v3/projects/{project_id}/active  # Activate project
POST   /books/v3/projects/{project_id}/inactive # Deactivate project
GET    /books/v3/projects/{project_id}/tasks   # List tasks
POST   /books/v3/projects/{project_id}/tasks   # Create task
GET    /books/v3/projects/{project_id}/invoices # Get project invoices
```

**Project Types**:
- Fixed Cost
- Based on Project Hours
- Based on Task Hours
- Based on Staff Hours

**Example - Create Project**:
```javascript
// JavaScript/Node.js
const createProject = async (accessToken, organizationId) => {
  const response = await axios.post(
    'https://www.zohoapis.com/books/v3/projects',
    {
      project_name: 'Website Redesign - Acme Corp',
      customer_id: '12345000000234567',
      billing_type: 'based_on_project_hours',
      rate: 150.00,
      budget_type: 'total_project_cost',
      budget_value: 10000.00,
      description: 'Complete website redesign and implementation',
      start_date: '2025-01-15',
      end_date: '2025-03-15'
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

### 9. Items/Inventory
**Purpose**: Manage products and services

**Endpoints**:
```http
GET    /books/v3/items                         # List all items
GET    /books/v3/items/{item_id}               # Get item details
POST   /books/v3/items                         # Create item
PUT    /books/v3/items/{item_id}               # Update item
DELETE /books/v3/items/{item_id}               # Delete item
POST   /books/v3/items/{item_id}/active        # Activate item
POST   /books/v3/items/{item_id}/inactive      # Deactivate item
POST   /books/v3/inventoryadjustments          # Adjust inventory
GET    /books/v3/items/{item_id}/stock         # Get stock details
```

**Item Types**:
- Sales
- Purchases
- Inventory
- Service

**Example - Create Item**:
```python
# Python
def create_item(access_token, organization_id):
    url = 'https://www.zohoapis.com/books/v3/items'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    params = {
        'organization_id': organization_id
    }
    data = {
        'name': 'Web Design Services',
        'rate': 150.00,
        'description': 'Professional web design services',
        'item_type': 'service',
        'tax_id': '12345000000456789',
        'account_id': '12345000000789012',
        'sku': 'WEB-DESIGN-001',
        'unit': 'hrs',
        'is_taxable': True,
        'status': 'active'
    }
    response = requests.post(url, json=data, headers=headers, params=params)
    return response.json()
```

**Example - Adjust Inventory**:
```javascript
// JavaScript/Node.js
const adjustInventory = async (accessToken, organizationId) => {
  const response = await axios.post(
    'https://www.zohoapis.com/books/v3/inventoryadjustments',
    {
      date: '2025-01-15',
      reason: 'Damaged goods',
      adjustment_type: 'quantity',
      reference_number: 'ADJ-001',
      line_items: [
        {
          item_id: '12345000000345678',
          warehouse_id: '12345000000901234',
          quantity_adjusted: -5,
          description: 'Water damage during storage'
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

### 10. Reports
**Purpose**: Generate financial and accounting reports

**Available Reports**:
- Balance Sheet
- Profit and Loss
- Cash Flow Statement
- Trial Balance
- Accounts Receivable
- Accounts Payable
- Sales by Customer
- Sales by Item
- Purchase by Vendor
- Project Reports
- Tax Reports

**Endpoints**:
```http
GET    /books/v3/reports/profitandloss        # Profit and Loss
GET    /books/v3/reports/balancesheet         # Balance Sheet
GET    /books/v3/reports/cashflow             # Cash Flow Statement
GET    /books/v3/reports/trialbalance         # Trial Balance
GET    /books/v3/reports/accountreceivables   # AR Aging
GET    /books/v3/reports/accountpayables      # AP Aging
GET    /books/v3/reports/salesbyitem          # Sales by Item
GET    /books/v3/reports/salesbycustomer      # Sales by Customer
GET    /books/v3/reports/purchasebyvendor     # Purchase by Vendor
```

**Example - Get Profit and Loss Report**:
```javascript
// JavaScript/Node.js
const getProfitLossReport = async (accessToken, organizationId) => {
  const response = await axios.get(
    'https://www.zohoapis.com/books/v3/reports/profitandloss',
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      },
      params: {
        organization_id: organizationId,
        from_date: '2025-01-01',
        to_date: '2025-01-31',
        filter_by: 'Date.All'
      }
    }
  );
  return response.data;
};
```

**Example - Get Balance Sheet**:
```python
# Python
def get_balance_sheet(access_token, organization_id):
    url = 'https://www.zohoapis.com/books/v3/reports/balancesheet'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'organization_id': organization_id,
        'date': '2025-01-31',
        'report_basis': 'accrual'
    }
    response = requests.get(url, headers=headers, params=params)
    return response.json()
```

```deluge
// Deluge
// Get Profit and Loss Report
params = {
    "from_date": "2025-01-01",
    "to_date": "2025-01-31"
};

response = zoho.books.getRecords("reports/profitandloss", organization_id, params);
info response;
```

---

## Authentication

### OAuth 2.0 Flow

**Step 1: Register Your Application**
- Go to [Zoho API Console](https://api-console.zoho.com/)
- Create a new Client
- Client Type: Server-based Applications
- Note your Client ID and Client Secret
- Set authorized redirect URI

**Step 2: Generate Authorization Code**
```http
GET https://accounts.zoho.com/oauth/v2/auth?
  scope=ZohoBooks.fullaccess.all&
  client_id={client_id}&
  response_type=code&
  access_type=offline&
  redirect_uri={redirect_uri}
```

**Available Scopes**:
- `ZohoBooks.fullaccess.all` - Full access to all Books data
- `ZohoBooks.fullaccess.READ` - Read-only access
- `ZohoBooks.contacts.READ` - Read contacts
- `ZohoBooks.contacts.CREATE` - Create contacts
- `ZohoBooks.contacts.UPDATE` - Update contacts
- `ZohoBooks.contacts.DELETE` - Delete contacts
- `ZohoBooks.invoices.READ` - Read invoices
- `ZohoBooks.invoices.CREATE` - Create invoices
- `ZohoBooks.invoices.UPDATE` - Update invoices
- `ZohoBooks.invoices.DELETE` - Delete invoices
- Similar scopes for other modules

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

**Important Notes**:
- Store refresh tokens securely (encrypted database, secure vault)
- Never expose tokens in client-side code
- Implement automatic token refresh before expiration
- Each API request requires the organization_id parameter

---

## organization_id Requirement

**IMPORTANT**: All Zoho Books API requests require an `organization_id` parameter.

### Getting Organization ID

**Endpoint**:
```http
GET /books/v3/organizations
Authorization: Zoho-oauthtoken {access_token}
```

**Example**:
```javascript
// JavaScript/Node.js
const getOrganizations = async (accessToken) => {
  const response = await axios.get(
    'https://www.zohoapis.com/books/v3/organizations',
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data.organizations;
};
```

**Response**:
```json
{
  "code": 0,
  "message": "success",
  "organizations": [
    {
      "organization_id": "12345000000000099",
      "name": "Acme Corporation",
      "contact_name": "John Doe",
      "email": "john@acme.com",
      "is_default_org": true,
      "language_code": "en",
      "currency_id": "12345000000000100",
      "currency_code": "USD",
      "currency_symbol": "$",
      "time_zone": "PST",
      "date_format": "dd MMM yyyy",
      "fiscal_year_start_month": 1
    }
  ]
}
```

### Using organization_id in Requests

**As Query Parameter**:
```http
GET /books/v3/invoices?organization_id=12345000000000099
Authorization: Zoho-oauthtoken {access_token}
```

**In Code**:
```javascript
// Always include organization_id in params
const response = await axios.get(
  'https://www.zohoapis.com/books/v3/invoices',
  {
    headers: {
      'Authorization': `Zoho-oauthtoken ${accessToken}`
    },
    params: {
      organization_id: organizationId  // Required!
    }
  }
);
```

---

## Rate Limits

### API Call Limits

| Plan | API Calls per Minute | API Calls per Day | Concurrent Calls |
|------|---------------------|-------------------|------------------|
| Free | 100 | 2,500 | 5 |
| Standard | 100 | 5,000 | 10 |
| Professional | 100 | 10,000 | 15 |
| Premium | 100 | 25,000 | 20 |
| Elite | 100 | 50,000 | 25 |

### Rate Limit Details

**Per Minute Limit**:
- Maximum 100 API calls per minute per organization
- Applies to all plans
- Resets every 60 seconds

**Daily Limit**:
- Varies by plan (see table above)
- Resets at midnight UTC
- Includes all API operations (GET, POST, PUT, DELETE)

**Concurrent Calls**:
- Maximum simultaneous API requests
- Varies by plan (5-25 concurrent requests)
- Additional requests are queued or rejected

### Rate Limit Headers

```http
X-Rate-Limit-Limit: 100
X-Rate-Limit-Remaining: 87
X-Rate-Limit-Reset: 1673827200
X-Rate-Limit-Day-Limit: 10000
X-Rate-Limit-Day-Remaining: 9456
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
        const resetTime = error.response.headers['x-rate-limit-reset'];
        const waitTime = (resetTime * 1000) - Date.now();

        if (i < maxRetries - 1) {
          console.log(`Rate limit hit. Waiting ${waitTime}ms before retry...`);
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

def make_request_with_retry(url, headers, params, max_retries=3):
    for i in range(max_retries):
        try:
            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 429:
                reset_time = int(e.response.headers.get('X-Rate-Limit-Reset', 0))
                wait_time = reset_time - int(time.time())

                if i < max_retries - 1 and wait_time > 0:
                    print(f'Rate limit hit. Waiting {wait_time}s before retry...')
                    time.sleep(wait_time)
                    continue
            raise
```

**Best Practices**:
- Monitor rate limit headers in responses
- Implement exponential backoff for retries
- Cache frequently accessed data
- Use webhooks for real-time updates instead of polling
- Batch operations when possible
- Distribute API calls throughout the day

---

## Data Centers

Zoho Books operates in multiple data centers. Always use the base URL corresponding to your account's data center.

| Data Center | Base URL | Accounts URL |
|-------------|----------|--------------|
| US | https://www.zohoapis.com | https://accounts.zoho.com |
| EU | https://www.zohoapis.eu | https://accounts.zoho.eu |
| IN | https://www.zohoapis.in | https://accounts.zoho.in |
| AU | https://www.zohoapis.com.au | https://accounts.zoho.com.au |
| JP | https://www.zohoapis.jp | https://accounts.zoho.jp |
| CA | https://www.zohoapis.ca | https://accounts.zoho.ca |
| CN | https://www.zohoapis.com.cn | https://accounts.zoho.com.cn |
| SA | https://www.zohoapis.sa | https://accounts.zoho.sa |

### Determining Your Data Center

**Method 1: Check OAuth Response**
```json
{
  "access_token": "1000.xxx",
  "api_domain": "https://www.zohoapis.com",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

**Method 2: Check Your Zoho Books URL**
- US: books.zoho.com
- EU: books.zoho.eu
- IN: books.zoho.in
- AU: books.zoho.com.au
- JP: books.zoho.jp
- CA: books.zoho.ca
- CN: books.zoho.com.cn
- SA: books.zoho.sa

**Dynamic Base URL Configuration**:
```javascript
// JavaScript/Node.js
class ZohoBooksClient {
  constructor(accessToken, apiDomain = 'https://www.zohoapis.com') {
    this.accessToken = accessToken;
    this.apiDomain = apiDomain;
    this.baseURL = `${apiDomain}/books/v3`;
  }

  async get(endpoint, params = {}) {
    const response = await axios.get(
      `${this.baseURL}${endpoint}`,
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${this.accessToken}`
        },
        params
      }
    );
    return response.data;
  }
}

// Usage
const client = new ZohoBooksClient(accessToken, 'https://www.zohoapis.eu');
const invoices = await client.get('/invoices', { organization_id: orgId });
```

```python
# Python
class ZohoBooksClient:
    def __init__(self, access_token, api_domain='https://www.zohoapis.com'):
        self.access_token = access_token
        self.api_domain = api_domain
        self.base_url = f'{api_domain}/books/v3'

    def get(self, endpoint, params=None):
        headers = {
            'Authorization': f'Zoho-oauthtoken {self.access_token}'
        }
        response = requests.get(
            f'{self.base_url}{endpoint}',
            headers=headers,
            params=params
        )
        return response.json()

# Usage
client = ZohoBooksClient(access_token, 'https://www.zohoapis.eu')
invoices = client.get('/invoices', {'organization_id': org_id})
```

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
| 405 | Method Not Allowed | Invalid HTTP method |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |
| 503 | Service Unavailable | Service temporarily unavailable |

### Zoho Books Error Codes

| Code | Message | Description | Solution |
|------|---------|-------------|----------|
| 0 | Success | Operation completed successfully | N/A |
| 1 | Invalid arguments | Missing or invalid parameters | Check required parameters |
| 2 | Invalid organization ID | organization_id is invalid | Verify organization_id |
| 6 | Internal error | Server-side error occurred | Retry with exponential backoff |
| 57 | Invalid authentication token | Token expired or invalid | Refresh access token |
| 36 | Duplicate record | Record already exists | Update existing record instead |
| 41 | Resource not found | Requested resource doesn't exist | Verify resource ID |
| 48 | Rate limit exceeded | Too many API calls | Implement rate limiting |
| 4001 | Mandatory field missing | Required field not provided | Include all required fields |
| 4002 | Invalid field value | Field value is invalid | Validate field values |
| 4003 | Invalid date format | Date format is incorrect | Use YYYY-MM-DD format |
| 4004 | Contact not found | Contact ID doesn't exist | Verify contact ID |
| 4005 | Invoice not found | Invoice ID doesn't exist | Verify invoice ID |
| 4010 | Permission denied | User lacks permission | Grant necessary permissions |

### Error Response Format

```json
{
  "code": 4001,
  "message": "Mandatory field missing",
  "field": "customer_id",
  "details": "The customer_id field is required for creating an invoice."
}
```

### Error Handling Examples

**JavaScript**:
```javascript
const handleBooksError = (error) => {
  if (error.response) {
    const { status, data } = error.response;

    switch (status) {
      case 401:
        console.error('Authentication failed. Refreshing token...');
        // Refresh token logic
        break;

      case 429:
        console.error('Rate limit exceeded. Waiting...');
        const resetTime = error.response.headers['x-rate-limit-reset'];
        // Wait logic
        break;

      case 400:
        console.error(`Bad request: ${data.message}`);
        if (data.field) {
          console.error(`Problem with field: ${data.field}`);
        }
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
        console.error(`Error ${status}: ${data.message}`);
    }
  } else {
    console.error('Network error:', error.message);
  }
};

// Usage
try {
  const invoice = await createInvoice(accessToken, organizationId);
} catch (error) {
  handleBooksError(error);
}
```

**Python**:
```python
import requests
from requests.exceptions import HTTPError
import time

def handle_books_error(error):
    if isinstance(error, HTTPError):
        status = error.response.status_code
        data = error.response.json()

        if status == 401:
            print('Authentication failed. Refreshing token...')
            # Refresh token logic

        elif status == 429:
            print('Rate limit exceeded. Waiting...')
            reset_time = int(error.response.headers.get('X-Rate-Limit-Reset', 0))
            wait_time = reset_time - int(time.time())
            time.sleep(max(wait_time, 0))
            # Retry logic

        elif status == 400:
            print(f"Bad request: {data.get('message')}")
            if 'field' in data:
                print(f"Problem with field: {data['field']}")

        elif status == 404:
            print('Resource not found')

        elif status in [500, 503]:
            print('Server error. Retrying...')
            # Retry logic

        else:
            print(f"Error {status}: {data.get('message')}")
    else:
        print(f'Request error: {str(error)}')

# Usage
try:
    invoice = create_invoice(access_token, organization_id)
except HTTPError as e:
    handle_books_error(e)
```

---

## Common Operations

### 1. Get All Invoices with Filtering

```javascript
// JavaScript/Node.js
const getFilteredInvoices = async (accessToken, organizationId) => {
  const response = await axios.get(
    'https://www.zohoapis.com/books/v3/invoices',
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      },
      params: {
        organization_id: organizationId,
        status: 'sent',
        customer_name_contains: 'Acme',
        date_start: '2025-01-01',
        date_end: '2025-01-31',
        total_less_than: 10000,
        sort_column: 'date',
        sort_order: 'D',
        page: 1,
        per_page: 200
      }
    }
  );
  return response.data;
};
```

### 2. Record Invoice Payment

```javascript
// JavaScript/Node.js
const recordInvoicePayment = async (accessToken, organizationId, invoiceId) => {
  const response = await axios.post(
    `https://www.zohoapis.com/books/v3/invoices/${invoiceId}/payments`,
    {
      customer_id: '12345000000234567',
      payment_mode: 'check',
      amount: 5000.00,
      date: '2025-01-15',
      reference_number: 'CHK-1234',
      description: 'Payment received via check',
      invoice_id: invoiceId
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

### 3. Email Invoice to Customer

```python
# Python
def email_invoice(access_token, organization_id, invoice_id):
    url = f'https://www.zohoapis.com/books/v3/invoices/{invoice_id}/email'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    params = {
        'organization_id': organization_id
    }
    data = {
        'to_mail_ids': ['customer@example.com'],
        'cc_mail_ids': ['manager@mycompany.com'],
        'subject': 'Invoice INV-00001 from Acme Corp',
        'body': 'Dear Customer,\n\nPlease find attached invoice for your recent purchase.\n\nThank you!'
    }
    response = requests.post(url, json=data, headers=headers, params=params)
    return response.json()
```

### 4. Convert Estimate to Invoice

```javascript
// JavaScript/Node.js
const convertEstimateToInvoice = async (accessToken, organizationId, estimateId) => {
  const response = await axios.post(
    `https://www.zohoapis.com/books/v3/estimates/${estimateId}/invoices`,
    {},
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

### 5. Create Recurring Invoice

```javascript
// JavaScript/Node.js
const createRecurringInvoice = async (accessToken, organizationId) => {
  const response = await axios.post(
    'https://www.zohoapis.com/books/v3/recurringinvoices',
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
      notes: 'Thank you for your continued business!'
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

### 6. Apply Credits to Invoice

```python
# Python
def apply_credits(access_token, organization_id, invoice_id):
    url = f'https://www.zohoapis.com/books/v3/invoices/{invoice_id}/credits'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    params = {
        'organization_id': organization_id
    }
    data = {
        'invoice_payments': [
            {
                'creditnote_id': '12345000000567890',
                'amount_applied': 500.00
            }
        ]
    }
    response = requests.post(url, json=data, headers=headers, params=params)
    return response.json()
```

### 7. Bulk Export Records

```javascript
// JavaScript/Node.js
const bulkExportInvoices = async (accessToken, organizationId) => {
  const response = await axios.get(
    'https://www.zohoapis.com/books/v3/invoices',
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Accept': 'application/pdf'  // or 'application/json'
      },
      params: {
        organization_id: organizationId,
        status: 'All',
        per_page: 200
      },
      responseType: 'arraybuffer'
    }
  );
  return response.data;
};
```

### 8. Get Account Transactions

```python
# Python
def get_account_transactions(access_token, organization_id, account_id):
    url = f'https://www.zohoapis.com/books/v3/chartofaccounts/{account_id}/transactions'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'organization_id': organization_id,
        'date_start': '2025-01-01',
        'date_end': '2025-01-31'
    }
    response = requests.get(url, headers=headers, params=params)
    return response.json()
```

### 9. Create Journal Entry

```javascript
// JavaScript/Node.js
const createJournalEntry = async (accessToken, organizationId) => {
  const response = await axios.post(
    'https://www.zohoapis.com/books/v3/journals',
    {
      journal_date: '2025-01-15',
      reference_number: 'JE-001',
      notes: 'Month-end adjustment',
      line_items: [
        {
          account_id: '12345000000789012',
          description: 'Prepaid rent adjustment',
          debit_or_credit: 'debit',
          amount: 2000.00
        },
        {
          account_id: '12345000000789013',
          description: 'Rent expense',
          debit_or_credit: 'credit',
          amount: 2000.00
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

### 10. Reconcile Bank Transaction

```javascript
// JavaScript/Node.js
const reconcileTransaction = async (accessToken, organizationId, transactionId) => {
  const response = await axios.post(
    `https://www.zohoapis.com/books/v3/banktransactions/${transactionId}/match`,
    {
      transactions_to_be_matched: [
        {
          transaction_id: '12345000001234567',
          transaction_type: 'invoice'
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

## Code Examples

### Complete Invoice Workflow

```javascript
// JavaScript/Node.js - Complete Invoice Workflow
const completeInvoiceWorkflow = async (accessToken, organizationId) => {
  try {
    // 1. Create contact if doesn't exist
    const contact = await createContact(accessToken, organizationId);
    console.log('Contact created:', contact.contact.contact_id);

    // 2. Create invoice
    const invoiceData = {
      customer_id: contact.contact.contact_id,
      date: '2025-01-15',
      due_date: '2025-01-30',
      line_items: [
        {
          name: 'Consulting Services',
          rate: 150.00,
          quantity: 10
        }
      ]
    };

    const invoice = await axios.post(
      'https://www.zohoapis.com/books/v3/invoices',
      invoiceData,
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json'
        },
        params: { organization_id: organizationId }
      }
    );
    console.log('Invoice created:', invoice.data.invoice.invoice_id);

    // 3. Mark invoice as sent
    await axios.post(
      `https://www.zohoapis.com/books/v3/invoices/${invoice.data.invoice.invoice_id}/status/sent`,
      {},
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`
        },
        params: { organization_id: organizationId }
      }
    );
    console.log('Invoice marked as sent');

    // 4. Email invoice
    await axios.post(
      `https://www.zohoapis.com/books/v3/invoices/${invoice.data.invoice.invoice_id}/email`,
      {
        to_mail_ids: [contact.contact.email],
        subject: 'Invoice from Acme Corp',
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
    console.log('Invoice emailed');

    // 5. Record payment
    await axios.post(
      `https://www.zohoapis.com/books/v3/invoices/${invoice.data.invoice.invoice_id}/payments`,
      {
        customer_id: contact.contact.contact_id,
        payment_mode: 'cash',
        amount: invoice.data.invoice.total,
        date: '2025-01-20'
      },
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json'
        },
        params: { organization_id: organizationId }
      }
    );
    console.log('Payment recorded');

    return {
      success: true,
      invoice_id: invoice.data.invoice.invoice_id
    };

  } catch (error) {
    console.error('Workflow error:', error.response?.data || error.message);
    throw error;
  }
};
```

### Automated Monthly Reporting

```python
# Python - Automated Monthly Reporting
import requests
from datetime import datetime, timedelta
import json

class ZohoBooksReporter:
    def __init__(self, access_token, organization_id, api_domain='https://www.zohoapis.com'):
        self.access_token = access_token
        self.organization_id = organization_id
        self.base_url = f'{api_domain}/books/v3'
        self.headers = {
            'Authorization': f'Zoho-oauthtoken {access_token}',
            'Content-Type': 'application/json'
        }

    def get_monthly_summary(self, year, month):
        # Calculate date range
        start_date = f'{year}-{month:02d}-01'
        if month == 12:
            end_date = f'{year + 1}-01-01'
        else:
            end_date = f'{year}-{month + 1:02d}-01'

        summary = {}

        # Get Profit & Loss
        pl_response = requests.get(
            f'{self.base_url}/reports/profitandloss',
            headers=self.headers,
            params={
                'organization_id': self.organization_id,
                'from_date': start_date,
                'to_date': end_date
            }
        )
        summary['profit_loss'] = pl_response.json()

        # Get invoices
        invoices_response = requests.get(
            f'{self.base_url}/invoices',
            headers=self.headers,
            params={
                'organization_id': self.organization_id,
                'date_start': start_date,
                'date_end': end_date,
                'status': 'All'
            }
        )
        summary['invoices'] = invoices_response.json()

        # Get bills
        bills_response = requests.get(
            f'{self.base_url}/bills',
            headers=self.headers,
            params={
                'organization_id': self.organization_id,
                'date_start': start_date,
                'date_end': end_date
            }
        )
        summary['bills'] = bills_response.json()

        # Calculate metrics
        total_income = sum(inv['total'] for inv in summary['invoices'].get('invoices', []))
        total_expenses = sum(bill['total'] for bill in summary['bills'].get('bills', []))

        summary['metrics'] = {
            'total_income': total_income,
            'total_expenses': total_expenses,
            'net_profit': total_income - total_expenses,
            'invoice_count': len(summary['invoices'].get('invoices', [])),
            'bill_count': len(summary['bills'].get('bills', []))
        }

        return summary

    def get_aging_report(self):
        ar_response = requests.get(
            f'{self.base_url}/reports/accountreceivables',
            headers=self.headers,
            params={
                'organization_id': self.organization_id
            }
        )
        return ar_response.json()

    def export_to_json(self, data, filename):
        with open(filename, 'w') as f:
            json.dump(data, f, indent=2)
        print(f'Report exported to {filename}')

# Usage
reporter = ZohoBooksReporter(access_token, organization_id)
monthly_summary = reporter.get_monthly_summary(2025, 1)
reporter.export_to_json(monthly_summary, 'january_2025_summary.json')
```

### Bulk Operations with Error Handling

```javascript
// JavaScript/Node.js - Bulk Create Contacts with Error Handling
const bulkCreateContacts = async (accessToken, organizationId, contacts) => {
  const results = {
    successful: [],
    failed: []
  };

  for (const contact of contacts) {
    try {
      const response = await axios.post(
        'https://www.zohoapis.com/books/v3/contacts',
        contact,
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

      results.successful.push({
        contact_name: contact.contact_name,
        contact_id: response.data.contact.contact_id
      });

      console.log(`✓ Created: ${contact.contact_name}`);

      // Rate limiting: wait 0.6 seconds between requests (100/min = 1 per 0.6s)
      await new Promise(resolve => setTimeout(resolve, 600));

    } catch (error) {
      results.failed.push({
        contact_name: contact.contact_name,
        error: error.response?.data?.message || error.message
      });

      console.error(`✗ Failed: ${contact.contact_name} - ${error.response?.data?.message}`);

      // If rate limit hit, wait and retry
      if (error.response?.status === 429) {
        const resetTime = error.response.headers['x-rate-limit-reset'];
        const waitTime = (resetTime * 1000) - Date.now();
        console.log(`Rate limit hit. Waiting ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));

        // Retry the failed contact
        contacts.push(contact);
      }
    }
  }

  return results;
};

// Usage
const contactsToCreate = [
  {
    contact_name: 'ABC Company',
    contact_type: 'customer',
    email: 'contact@abc.com'
  },
  {
    contact_name: 'XYZ Corporation',
    contact_type: 'vendor',
    email: 'vendor@xyz.com'
  },
  // ... more contacts
];

const results = await bulkCreateContacts(accessToken, organizationId, contactsToCreate);
console.log(`\nSuccessful: ${results.successful.length}`);
console.log(`Failed: ${results.failed.length}`);
```

### Deluge Integration Examples

```deluge
// Deluge - Create Invoice from CRM Deal
// This can be used in Zoho CRM workflow or function

dealId = "12345000000567890";
organizationId = "12345000000000099";

// Get deal details from CRM
dealMap = zoho.crm.getRecordById("Deals", dealId);

// Get contact details
contactId = dealMap.get("Contact_Name").get("id");
contactMap = zoho.crm.getRecordById("Contacts", contactId);

// Create or get Books contact
booksContact = {
    "contact_name": contactMap.get("Full_Name"),
    "company_name": contactMap.get("Account_Name").get("name"),
    "email": contactMap.get("Email"),
    "phone": contactMap.get("Phone")
};

contactResponse = zoho.books.createRecord("contacts", organizationId, booksContact);
booksContactId = contactResponse.get("contact").get("contact_id");

// Get deal products
products = zoho.crm.getRelatedRecords("Products", "Deals", dealId);

// Build line items
lineItems = List();
for each product in products {
    item = {
        "name": product.get("Product_Name"),
        "rate": product.get("Unit_Price"),
        "quantity": product.get("Quantity"),
        "description": product.get("Description")
    };
    lineItems.add(item);
}

// Create invoice in Books
invoiceData = {
    "customer_id": booksContactId,
    "date": zoho.currentdate.toString("yyyy-MM-dd"),
    "due_date": zoho.currentdate.addDay(30).toString("yyyy-MM-dd"),
    "line_items": lineItems,
    "notes": "Invoice created from CRM Deal: " + dealMap.get("Deal_Name"),
    "reference_number": "CRM-" + dealId
};

invoiceResponse = zoho.books.createRecord("invoices", organizationId, invoiceData);
invoiceId = invoiceResponse.get("invoice").get("invoice_id");

// Update CRM deal with invoice link
updateMap = Map();
updateMap.put("Books_Invoice_ID", invoiceId);
updateMap.put("Invoice_Status", "Created");
zoho.crm.updateRecord("Deals", dealId, updateMap);

info "Invoice created: " + invoiceId;
```

```deluge
// Deluge - Sync Books Payments to CRM
// This can be run as scheduled function

organizationId = "12345000000000099";

// Get recent payments (last 7 days)
fromDate = zoho.currentdate.subDay(7).toString("yyyy-MM-dd");
toDate = zoho.currentdate.toString("yyyy-MM-dd");

params = {
    "date_start": fromDate,
    "date_end": toDate
};

paymentsResponse = zoho.books.getRecords("customerpayments", organizationId, params);
payments = paymentsResponse.get("customerpayments");

for each payment in payments {
    // Get invoice details
    invoiceId = payment.get("invoice_id");
    invoiceResponse = zoho.books.getRecordById("invoices", organizationId, invoiceId);
    invoice = invoiceResponse.get("invoice");

    // Find corresponding CRM deal by reference number
    if(invoice.get("reference_number").contains("CRM-")) {
        dealId = invoice.get("reference_number").replaceAll("CRM-", "");

        // Update deal in CRM
        updateMap = Map();
        updateMap.put("Payment_Received", payment.get("amount"));
        updateMap.put("Payment_Date", payment.get("date"));
        updateMap.put("Payment_Mode", payment.get("payment_mode"));
        updateMap.put("Invoice_Status", "Paid");

        zoho.crm.updateRecord("Deals", dealId, updateMap);
        info "Updated CRM Deal: " + dealId;
    }
}
```

---

## Best Practices

### 1. Authentication & Security

**Store Tokens Securely**:
```javascript
// Good: Use environment variables
const config = {
  clientId: process.env.ZOHO_CLIENT_ID,
  clientSecret: process.env.ZOHO_CLIENT_SECRET,
  refreshToken: process.env.ZOHO_REFRESH_TOKEN
};

// Bad: Hard-coded credentials
const config = {
  clientId: '1000.ABC123',
  clientSecret: 'secret123',
  refreshToken: '1000.XYZ789'
};
```

**Implement Token Refresh**:
```javascript
class ZohoBooksClient {
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

  async makeRequest(method, endpoint, data = null) {
    await this.ensureValidToken();

    const config = {
      method,
      url: `${this.config.apiDomain}/books/v3${endpoint}`,
      headers: {
        'Authorization': `Zoho-oauthtoken ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      params: {
        organization_id: this.config.organizationId
      }
    };

    if (data) {
      config.data = data;
    }

    return await axios(config);
  }
}
```

### 2. Rate Limiting

**Implement Request Queue**:
```javascript
class RateLimitedQueue {
  constructor(maxPerMinute = 100) {
    this.queue = [];
    this.processing = false;
    this.maxPerMinute = maxPerMinute;
    this.requestTimes = [];
  }

  async add(fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      this.process();
    });
  }

  async process() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0) {
      // Remove requests older than 1 minute
      const oneMinuteAgo = Date.now() - 60000;
      this.requestTimes = this.requestTimes.filter(time => time > oneMinuteAgo);

      // Wait if we've hit the limit
      if (this.requestTimes.length >= this.maxPerMinute) {
        const oldestRequest = Math.min(...this.requestTimes);
        const waitTime = 60000 - (Date.now() - oldestRequest) + 100;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }

      const { fn, resolve, reject } = this.queue.shift();
      this.requestTimes.push(Date.now());

      try {
        const result = await fn();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }

    this.processing = false;
  }
}

// Usage
const queue = new RateLimitedQueue(100);

const makeRateLimitedRequest = (url, options) => {
  return queue.add(() => axios(url, options));
};
```

### 3. Error Handling & Retries

**Exponential Backoff**:
```python
import time
import random

def make_request_with_backoff(fn, max_retries=3):
    for attempt in range(max_retries):
        try:
            return fn()
        except requests.exceptions.HTTPError as e:
            if e.response.status_code in [429, 500, 502, 503, 504]:
                if attempt < max_retries - 1:
                    wait_time = (2 ** attempt) + random.uniform(0, 1)
                    print(f'Retry {attempt + 1}/{max_retries} after {wait_time:.2f}s')
                    time.sleep(wait_time)
                    continue
            raise
    raise Exception(f'Failed after {max_retries} retries')
```

### 4. Data Validation

**Validate Before Sending**:
```javascript
const validateInvoiceData = (invoiceData) => {
  const errors = [];

  // Required fields
  if (!invoiceData.customer_id) {
    errors.push('customer_id is required');
  }

  // Date format validation
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (invoiceData.date && !dateRegex.test(invoiceData.date)) {
    errors.push('date must be in YYYY-MM-DD format');
  }

  // Amount validation
  if (invoiceData.line_items) {
    invoiceData.line_items.forEach((item, index) => {
      if (!item.rate || item.rate <= 0) {
        errors.push(`line_items[${index}].rate must be greater than 0`);
      }
      if (!item.quantity || item.quantity <= 0) {
        errors.push(`line_items[${index}].quantity must be greater than 0`);
      }
    });
  } else {
    errors.push('At least one line item is required');
  }

  if (errors.length > 0) {
    throw new Error(`Validation failed:\n${errors.join('\n')}`);
  }

  return true;
};

// Usage
try {
  validateInvoiceData(invoiceData);
  const response = await createInvoice(accessToken, organizationId, invoiceData);
} catch (error) {
  console.error('Validation error:', error.message);
}
```

### 5. Caching

**Cache Organization Data**:
```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour

const getOrganizationWithCache = async (accessToken) => {
  const cacheKey = 'organization_data';

  // Check cache first
  let orgData = cache.get(cacheKey);
  if (orgData) {
    console.log('Using cached organization data');
    return orgData;
  }

  // Fetch from API
  const response = await axios.get(
    'https://www.zohoapis.com/books/v3/organizations',
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );

  orgData = response.data.organizations[0];
  cache.set(cacheKey, orgData);

  return orgData;
};
```

### 6. Logging & Monitoring

**Comprehensive Logging**:
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

const makeTrackedRequest = async (method, url, data = null) => {
  const requestId = Date.now().toString();

  logger.info('API Request', {
    requestId,
    method,
    url,
    timestamp: new Date().toISOString()
  });

  try {
    const response = await axios({ method, url, data });

    logger.info('API Response', {
      requestId,
      status: response.status,
      timestamp: new Date().toISOString()
    });

    return response.data;
  } catch (error) {
    logger.error('API Error', {
      requestId,
      status: error.response?.status,
      error: error.response?.data || error.message,
      timestamp: new Date().toISOString()
    });

    throw error;
  }
};
```

### 7. Pagination

**Handle Large Datasets**:
```python
def get_all_invoices(access_token, organization_id):
    all_invoices = []
    page = 1
    per_page = 200  # Maximum allowed
    has_more = True

    while has_more:
        response = requests.get(
            'https://www.zohoapis.com/books/v3/invoices',
            headers={
                'Authorization': f'Zoho-oauthtoken {access_token}'
            },
            params={
                'organization_id': organization_id,
                'page': page,
                'per_page': per_page
            }
        )

        data = response.json()
        invoices = data.get('invoices', [])
        all_invoices.extend(invoices)

        # Check if there are more pages
        page_context = data.get('page_context', {})
        has_more = page_context.get('has_more_page', False)
        page += 1

        print(f'Fetched page {page - 1}, total invoices: {len(all_invoices)}')

    return all_invoices
```

### 8. Webhooks for Real-time Updates

**Setup Webhook Endpoint**:
```javascript
const express = require('express');
const crypto = require('crypto');
const app = express();

app.use(express.json());

// Verify webhook signature
const verifyWebhookSignature = (payload, signature, secret) => {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  return hash === signature;
};

app.post('/webhook/zoho-books', (req, res) => {
  const signature = req.headers['x-zoho-books-signature'];
  const webhookSecret = process.env.ZOHO_WEBHOOK_SECRET;

  // Verify signature
  if (!verifyWebhookSignature(req.body, signature, webhookSecret)) {
    return res.status(401).send('Invalid signature');
  }

  // Process webhook
  const { event_type, data } = req.body;

  switch (event_type) {
    case 'invoice_created':
      console.log('New invoice created:', data.invoice_id);
      // Handle invoice creation
      break;

    case 'invoice_paid':
      console.log('Invoice paid:', data.invoice_id);
      // Handle payment
      break;

    case 'payment_received':
      console.log('Payment received:', data.payment_id);
      // Handle payment
      break;

    default:
      console.log('Unhandled event type:', event_type);
  }

  res.status(200).send('OK');
});

app.listen(3000, () => {
  console.log('Webhook server listening on port 3000');
});
```

### 9. Idempotency

**Prevent Duplicate Operations**:
```javascript
const processedInvoices = new Set();

const createInvoiceOnce = async (accessToken, organizationId, invoiceData) => {
  // Use a unique identifier (e.g., reference_number)
  const idempotencyKey = invoiceData.reference_number;

  if (processedInvoices.has(idempotencyKey)) {
    console.log('Invoice already processed:', idempotencyKey);
    return null;
  }

  try {
    const response = await createInvoice(accessToken, organizationId, invoiceData);
    processedInvoices.add(idempotencyKey);
    return response;
  } catch (error) {
    if (error.response?.data?.code === 36) {
      // Duplicate error
      console.log('Invoice already exists:', idempotencyKey);
      processedInvoices.add(idempotencyKey);
      return null;
    }
    throw error;
  }
};
```

### 10. Testing

**Unit Test Example**:
```javascript
const assert = require('assert');
const nock = require('nock');

describe('Zoho Books API', () => {
  const accessToken = 'test_token';
  const organizationId = 'test_org_id';

  beforeEach(() => {
    // Mock API responses
    nock('https://www.zohoapis.com')
      .get('/books/v3/invoices')
      .query({ organization_id: organizationId })
      .reply(200, {
        code: 0,
        message: 'success',
        invoices: [
          { invoice_id: '123', customer_name: 'Test Customer' }
        ]
      });
  });

  it('should fetch invoices', async () => {
    const invoices = await getInvoices(accessToken, organizationId);
    assert.equal(invoices.length, 1);
    assert.equal(invoices[0].customer_name, 'Test Customer');
  });

  it('should handle errors', async () => {
    nock.cleanAll();
    nock('https://www.zohoapis.com')
      .get('/books/v3/invoices')
      .query({ organization_id: organizationId })
      .reply(401, { code: 57, message: 'Invalid authentication token' });

    try {
      await getInvoices(accessToken, organizationId);
      assert.fail('Should have thrown error');
    } catch (error) {
      assert.equal(error.response.status, 401);
    }
  });
});
```

---

## SDKs and Libraries

### Official SDKs

Zoho does not currently provide official SDKs for Zoho Books, but the API can be easily integrated using standard HTTP libraries.

### Recommended Libraries

**JavaScript/Node.js**:
- `axios` - HTTP client
- `node-cache` - Caching
- `winston` - Logging

```bash
npm install axios node-cache winston
```

**Python**:
- `requests` - HTTP client
- `cachetools` - Caching
- `python-dotenv` - Environment variables

```bash
pip install requests cachetools python-dotenv
```

---

## Additional Resources

- [Official Zoho Books API Documentation](https://www.zoho.com/books/api/v3/)
- [API Console](https://api-console.zoho.com/)
- [Zoho Books Help Documentation](https://www.zoho.com/books/help/)
- [Developer Forums](https://help.zoho.com/portal/en/community/books)
- [Status Page](https://status.zoho.com/)

---

## Changelog

### v3 (Current)
- Comprehensive REST API
- Support for all accounting modules
- Multi-currency support
- Project time tracking
- Advanced reporting
- Bank reconciliation
- Recurring transactions
- Multi-organization support

---

**Last Updated**: December 2025
**API Version**: v3
