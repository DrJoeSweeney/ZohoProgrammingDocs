# Zoho Expense API Reference

## Overview

Zoho Expense is a comprehensive expense management solution that helps businesses track expenses, manage receipts, automate approval workflows, and process reimbursements. The API provides full programmatic access to expense reports, approvals, and reimbursement operations.

**Current API Version**: v1
**Base URL**: `https://expense.zoho.com/api/v1/`
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

### 1. Expenses
**Purpose**: Create and manage individual expenses

**Endpoints**:
```http
GET    /expenses                      # List all expenses
GET    /expenses/{expense_id}         # Get expense details
POST   /expenses                      # Create expense
PUT    /expenses/{expense_id}         # Update expense
DELETE /expenses/{expense_id}         # Delete expense
POST   /expenses/{expense_id}/receipt # Upload receipt
GET    /expenses/{expense_id}/receipt # Download receipt
POST   /expenses/{expense_id}/submit  # Submit for approval
```

**Expense Statuses**:
- Draft
- Submitted
- Approved
- Rejected
- Reimbursed
- Partially Reimbursed

**Example - Create Expense**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const createExpense = async (accessToken, organizationId) => {
  const response = await axios.post(
    'https://expense.zoho.com/api/v1/expenses',
    {
      account_id: '12345000000789012',
      date: '2025-01-15',
      amount: 125.50,
      currency_id: '12345000000000099',
      currency_code: 'USD',
      expense_type: 'Non-Billable',
      category_id: '12345000000234567',
      category_name: 'Meals and Entertainment',
      merchant: 'Restaurant ABC',
      description: 'Client dinner meeting',
      payment_mode: 'Cash',
      reference_number: 'RCPT-1234',
      is_billable: false,
      project_id: '12345000000345678',
      customer_id: '12345000000456789',
      tax_id: '12345000000567890',
      tax_amount: 10.04,
      sub_total: 115.46,
      total: 125.50,
      distance: null,
      distance_unit: null,
      mileage_rate: null,
      custom_fields: [
        {
          customfield_id: '12345000000678901',
          value: 'Marketing Campaign 2025'
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

```python
# Python
import requests

def create_expense(access_token, organization_id):
    url = 'https://expense.zoho.com/api/v1/expenses'
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
        'amount': 125.50,
        'currency_code': 'USD',
        'expense_type': 'Non-Billable',
        'category_id': '12345000000234567',
        'category_name': 'Meals and Entertainment',
        'merchant': 'Restaurant ABC',
        'description': 'Client dinner meeting',
        'payment_mode': 'Cash',
        'reference_number': 'RCPT-1234',
        'is_billable': False,
        'project_id': '12345000000345678',
        'tax_id': '12345000000567890',
        'tax_amount': 10.04,
        'sub_total': 115.46,
        'total': 125.50
    }
    response = requests.post(url, json=data, headers=headers, params=params)
    return response.json()
```

```deluge
// Deluge
expense_data = {
    "account_id": "12345000000789012",
    "date": "2025-01-15",
    "amount": 125.50,
    "currency_code": "USD",
    "expense_type": "Non-Billable",
    "category_id": "12345000000234567",
    "category_name": "Meals and Entertainment",
    "merchant": "Restaurant ABC",
    "description": "Client dinner meeting",
    "payment_mode": "Cash",
    "reference_number": "RCPT-1234",
    "is_billable": false,
    "tax_amount": 10.04,
    "sub_total": 115.46,
    "total": 125.50
};

response = zoho.expense.createRecord("expenses", organization_id, expense_data);
info response;
```

**Response**:
```json
{
  "code": 0,
  "message": "Expense has been created successfully.",
  "expense": {
    "expense_id": "12345000000890123",
    "account_id": "12345000000789012",
    "account_name": "Employee Cash Advances",
    "date": "2025-01-15",
    "amount": 125.50,
    "currency_id": "12345000000000099",
    "currency_code": "USD",
    "expense_type": "Non-Billable",
    "status": "draft",
    "category_id": "12345000000234567",
    "category_name": "Meals and Entertainment",
    "merchant": "Restaurant ABC",
    "description": "Client dinner meeting",
    "payment_mode": "Cash",
    "reference_number": "RCPT-1234",
    "is_billable": false,
    "project_id": "12345000000345678",
    "customer_id": "12345000000456789",
    "tax_id": "12345000000567890",
    "tax_amount": 10.04,
    "sub_total": 115.46,
    "total": 125.50,
    "created_time": "2025-01-15T10:30:00-0800",
    "last_modified_time": "2025-01-15T10:30:00-0800",
    "user_id": "12345000000987654",
    "user_name": "John Doe"
  }
}
```

---

### 2. Expense Reports
**Purpose**: Organize expenses into reports for approval and reimbursement

**Endpoints**:
```http
GET    /expensereports                     # List all expense reports
GET    /expensereports/{report_id}         # Get report details
POST   /expensereports                     # Create expense report
PUT    /expensereports/{report_id}         # Update expense report
DELETE /expensereports/{report_id}         # Delete expense report
POST   /expensereports/{report_id}/submit  # Submit for approval
POST   /expensereports/{report_id}/approve # Approve report
POST   /expensereports/{report_id}/reject  # Reject report
POST   /expensereports/{report_id}/reimburse # Process reimbursement
GET    /expensereports/{report_id}/pdf     # Download PDF
```

**Report Statuses**:
- Draft
- Submitted
- Approved
- Partially Approved
- Rejected
- Reimbursed
- Partially Reimbursed
- Closed

**Example - Create Expense Report**:
```javascript
// JavaScript/Node.js
const createExpenseReport = async (accessToken, organizationId) => {
  const response = await axios.post(
    'https://expense.zoho.com/api/v1/expensereports',
    {
      report_name: 'Business Trip - NYC',
      report_number: 'RPT-2025-001',
      description: 'Expenses incurred during NYC business trip',
      from_date: '2025-01-10',
      to_date: '2025-01-15',
      currency_id: '12345000000000099',
      currency_code: 'USD',
      user_id: '12345000000987654',
      approver_id: '12345000000876543',
      expense_ids: [
        '12345000000890123',
        '12345000000890124',
        '12345000000890125'
      ],
      notes: 'All expenses approved by client for project work.',
      purpose: 'Client meetings and project consultation',
      policy_id: '12345000000765432'
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
def create_expense_report(access_token, organization_id):
    url = 'https://expense.zoho.com/api/v1/expensereports'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    params = {
        'organization_id': organization_id
    }
    data = {
        'report_name': 'Business Trip - NYC',
        'report_number': 'RPT-2025-001',
        'description': 'Expenses incurred during NYC business trip',
        'from_date': '2025-01-10',
        'to_date': '2025-01-15',
        'currency_code': 'USD',
        'user_id': '12345000000987654',
        'approver_id': '12345000000876543',
        'expense_ids': [
            '12345000000890123',
            '12345000000890124',
            '12345000000890125'
        ],
        'notes': 'All expenses approved by client for project work.',
        'purpose': 'Client meetings and project consultation'
    }
    response = requests.post(url, json=data, headers=headers, params=params)
    return response.json()
```

**Response**:
```json
{
  "code": 0,
  "message": "Expense report has been created successfully.",
  "expensereport": {
    "report_id": "12345000001234567",
    "report_name": "Business Trip - NYC",
    "report_number": "RPT-2025-001",
    "status": "draft",
    "description": "Expenses incurred during NYC business trip",
    "from_date": "2025-01-10",
    "to_date": "2025-01-15",
    "currency_id": "12345000000000099",
    "currency_code": "USD",
    "user_id": "12345000000987654",
    "user_name": "John Doe",
    "approver_id": "12345000000876543",
    "approver_name": "Jane Smith",
    "total_amount": 1250.75,
    "approved_amount": 0,
    "reimbursed_amount": 0,
    "expense_count": 3,
    "created_time": "2025-01-15T10:30:00-0800",
    "last_modified_time": "2025-01-15T10:30:00-0800"
  }
}
```

---

### 3. Approvals
**Purpose**: Manage expense approval workflows

**Endpoints**:
```http
GET    /approvals                         # List pending approvals
GET    /approvals/{approval_id}           # Get approval details
POST   /approvals/{approval_id}/approve   # Approve expense/report
POST   /approvals/{approval_id}/reject    # Reject expense/report
POST   /approvals/{approval_id}/delegate  # Delegate approval
```

**Approval Levels**:
- Single Level Approval
- Multi-Level Approval
- Conditional Approval (based on amount, category, etc.)

**Example - Approve Report**:
```javascript
// JavaScript/Node.js
const approveReport = async (accessToken, organizationId, reportId) => {
  const response = await axios.post(
    `https://expense.zoho.com/api/v1/expensereports/${reportId}/approve`,
    {
      approver_notes: 'All expenses are reasonable and properly documented.',
      approved_amount: 1250.75
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

**Example - Reject Report**:
```python
# Python
def reject_report(access_token, organization_id, report_id):
    url = f'https://expense.zoho.com/api/v1/expensereports/{report_id}/reject'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    params = {
        'organization_id': organization_id
    }
    data = {
        'rejection_reason': 'Missing receipts for meals over $50. Please resubmit with proper documentation.'
    }
    response = requests.post(url, json=data, headers=headers, params=params)
    return response.json()
```

---

### 4. Reimbursements
**Purpose**: Process employee reimbursements

**Endpoints**:
```http
GET    /reimbursements                    # List all reimbursements
GET    /reimbursements/{reimbursement_id} # Get reimbursement details
POST   /reimbursements                    # Create reimbursement
PUT    /reimbursements/{reimbursement_id} # Update reimbursement
DELETE /reimbursements/{reimbursement_id} # Delete reimbursement
POST   /reimbursements/{reimbursement_id}/process # Process payment
```

**Reimbursement Methods**:
- Bank Transfer
- Check
- Cash
- Direct Deposit
- PayPal

**Example - Create Reimbursement**:
```javascript
// JavaScript/Node.js
const createReimbursement = async (accessToken, organizationId) => {
  const response = await axios.post(
    'https://expense.zoho.com/api/v1/reimbursements',
    {
      reimbursement_number: 'REIMB-2025-001',
      date: '2025-01-20',
      user_id: '12345000000987654',
      report_ids: [
        '12345000001234567',
        '12345000001234568'
      ],
      amount: 2500.50,
      currency_id: '12345000000000099',
      currency_code: 'USD',
      payment_mode: 'Bank Transfer',
      payment_account_id: '12345000000654321',
      reference_number: 'TXN-2025-ABC123',
      description: 'Reimbursement for January 2025 expenses',
      payment_date: '2025-01-25',
      notes: 'Processed via direct deposit'
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

### 5. Categories
**Purpose**: Manage expense categories

**Endpoints**:
```http
GET    /categories                    # List all categories
GET    /categories/{category_id}      # Get category details
POST   /categories                    # Create category
PUT    /categories/{category_id}      # Update category
DELETE /categories/{category_id}      # Delete category
```

**Default Categories**:
- Airfare
- Lodging
- Meals and Entertainment
- Car Rental
- Fuel/Mileage
- Office Supplies
- Training
- Communication
- Shipping
- Miscellaneous

**Example - Create Category**:
```python
# Python
def create_category(access_token, organization_id):
    url = 'https://expense.zoho.com/api/v1/categories'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    params = {
        'organization_id': organization_id
    }
    data = {
        'category_name': 'Software Subscriptions',
        'description': 'Monthly/annual software and SaaS subscriptions',
        'account_id': '12345000000789012',
        'is_enabled': True,
        'is_reimbursable': True,
        'gl_code': '5100',
        'approval_required': True,
        'receipt_required': True,
        'max_amount': 1000.00
    }
    response = requests.post(url, json=data, headers=headers, params=params)
    return response.json()
```

---

### 6. Trips
**Purpose**: Manage business trips and associated expenses

**Endpoints**:
```http
GET    /trips                         # List all trips
GET    /trips/{trip_id}               # Get trip details
POST   /trips                         # Create trip
PUT    /trips/{trip_id}               # Update trip
DELETE /trips/{trip_id}               # Delete trip
GET    /trips/{trip_id}/expenses      # Get trip expenses
```

**Example - Create Trip**:
```javascript
// JavaScript/Node.js
const createTrip = async (accessToken, organizationId) => {
  const response = await axios.post(
    'https://expense.zoho.com/api/v1/trips',
    {
      trip_name: 'Q1 Sales Conference - San Francisco',
      trip_number: 'TRP-2025-001',
      description: 'Annual Q1 sales conference attendance',
      from_date: '2025-03-10',
      to_date: '2025-03-15',
      destination: 'San Francisco, CA',
      purpose: 'Sales conference and client meetings',
      user_id: '12345000000987654',
      customer_id: '12345000000456789',
      project_id: '12345000000345678',
      estimated_budget: 3500.00,
      currency_id: '12345000000000099',
      currency_code: 'USD',
      advance_amount: 1000.00,
      notes: 'Hotel and conference registration pre-paid by company'
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

### 7. Receipts
**Purpose**: Upload and manage expense receipts

**Endpoints**:
```http
POST   /expenses/{expense_id}/receipt     # Upload receipt
GET    /expenses/{expense_id}/receipt     # Download receipt
DELETE /expenses/{expense_id}/receipt     # Delete receipt
POST   /receipts/scan                     # OCR scan receipt
```

**Supported Formats**:
- PDF
- JPEG
- PNG
- GIF
- Maximum file size: 5MB per receipt

**Example - Upload Receipt**:
```javascript
// JavaScript/Node.js
const FormData = require('form-data');
const fs = require('fs');

const uploadReceipt = async (accessToken, organizationId, expenseId, filePath) => {
  const form = new FormData();
  form.append('receipt', fs.createReadStream(filePath));

  const response = await axios.post(
    `https://expense.zoho.com/api/v1/expenses/${expenseId}/receipt`,
    form,
    {
      headers: {
        ...form.getHeaders(),
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

**Example - OCR Scan Receipt**:
```python
# Python
def scan_receipt(access_token, organization_id, file_path):
    url = 'https://expense.zoho.com/api/v1/receipts/scan'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'organization_id': organization_id
    }

    with open(file_path, 'rb') as f:
        files = {'receipt': f}
        response = requests.post(url, headers=headers, params=params, files=files)

    # Returns extracted data: merchant, date, amount, category
    return response.json()
```

---

### 8. Mileage
**Purpose**: Track and calculate mileage expenses

**Endpoints**:
```http
GET    /mileage                       # List mileage entries
GET    /mileage/{mileage_id}          # Get mileage details
POST   /mileage                       # Create mileage entry
PUT    /mileage/{mileage_id}          # Update mileage entry
DELETE /mileage/{mileage_id}          # Delete mileage entry
```

**Example - Create Mileage Entry**:
```javascript
// JavaScript/Node.js
const createMileage = async (accessToken, organizationId) => {
  const response = await axios.post(
    'https://expense.zoho.com/api/v1/mileage',
    {
      date: '2025-01-15',
      from_location: 'Office - 123 Main St',
      to_location: 'Client Site - 456 Oak Ave',
      distance: 45.5,
      distance_unit: 'mi',
      vehicle_type: 'Car',
      vehicle_id: '12345000000543210',
      mileage_rate: 0.67,  // IRS standard mileage rate
      amount: 30.49,  // 45.5 * 0.67
      purpose: 'Client meeting - Project kickoff',
      customer_id: '12345000000456789',
      project_id: '12345000000345678',
      is_billable: true,
      is_round_trip: true,
      category_id: '12345000000234567'
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

### 9. Advances
**Purpose**: Manage employee advances and settlements

**Endpoints**:
```http
GET    /advances                      # List all advances
GET    /advances/{advance_id}         # Get advance details
POST   /advances                      # Create advance
PUT    /advances/{advance_id}         # Update advance
DELETE /advances/{advance_id}         # Delete advance
POST   /advances/{advance_id}/settle  # Settle advance
```

**Example - Create Advance**:
```python
# Python
def create_advance(access_token, organization_id):
    url = 'https://expense.zoho.com/api/v1/advances'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    params = {
        'organization_id': organization_id
    }
    data = {
        'advance_number': 'ADV-2025-001',
        'date': '2025-01-10',
        'user_id': '12345000000987654',
        'amount': 1000.00,
        'currency_code': 'USD',
        'payment_mode': 'Bank Transfer',
        'reference_number': 'TXN-ADV-123',
        'description': 'Advance for NYC business trip',
        'trip_id': '12345000001111111',
        'payment_date': '2025-01-10',
        'notes': 'To be settled with expense report'
    }
    response = requests.post(url, json=data, headers=headers, params=params)
    return response.json()
```

---

## Authentication

### OAuth 2.0 Flow

**Step 1: Register Your Application**
- Go to [Zoho API Console](https://api-console.zoho.com/)
- Create a new Client
- Note your Client ID and Client Secret

**Step 2: Generate Authorization Code**
```http
GET https://accounts.zoho.com/oauth/v2/auth?
  scope=ZohoExpense.fullaccess.all&
  client_id={client_id}&
  response_type=code&
  access_type=offline&
  redirect_uri={redirect_uri}
```

**Available Scopes**:
- `ZohoExpense.fullaccess.all` - Full access to all Expense data
- `ZohoExpense.expenses.READ` - Read expenses
- `ZohoExpense.expenses.CREATE` - Create expenses
- `ZohoExpense.expenses.UPDATE` - Update expenses
- `ZohoExpense.expenses.DELETE` - Delete expenses
- `ZohoExpense.reports.ALL` - Full access to expense reports
- `ZohoExpense.approvals.ALL` - Full access to approvals
- `ZohoExpense.reimbursements.ALL` - Full access to reimbursements

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

**Token Lifetime**:
- Access Token: 1 hour
- Refresh Token: Does not expire (store securely)

---

## Rate Limits

### API Call Limits

| Plan | API Calls per Minute | API Calls per Day | Concurrent Calls |
|------|---------------------|-------------------|------------------|
| Free | 50 | 1,000 | 3 |
| Standard | 100 | 5,000 | 5 |
| Professional | 150 | 10,000 | 10 |
| Premium | 200 | 25,000 | 15 |
| Enterprise | 300 | 50,000 | 20 |

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
| US | https://expense.zoho.com | https://accounts.zoho.com |
| EU | https://expense.zoho.eu | https://accounts.zoho.eu |
| IN | https://expense.zoho.in | https://accounts.zoho.in |
| AU | https://expense.zoho.com.au | https://accounts.zoho.com.au |
| JP | https://expense.zoho.jp | https://accounts.zoho.jp |

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

### Zoho Expense Error Codes

| Code | Message | Description | Solution |
|------|---------|-------------|----------|
| 0 | Success | Operation successful | N/A |
| 5001 | Invalid request | Missing/invalid parameters | Check parameters |
| 5002 | Invalid organization ID | Invalid organization_id | Verify organization_id |
| 5003 | Authentication failed | Invalid token | Refresh access token |
| 5004 | Permission denied | Insufficient permissions | Check OAuth scopes |
| 5005 | Resource not found | Expense/report not found | Verify resource ID |
| 5006 | Invalid status | Cannot perform action in current status | Check status requirements |
| 5007 | Receipt required | Receipt must be attached | Upload receipt |
| 5008 | Approval pending | Cannot modify pending approval | Wait for approval |
| 5009 | Amount exceeds limit | Amount exceeds policy limit | Adjust amount or request exception |

---

## Common Operations

### 1. Complete Expense Submission Workflow

```javascript
// JavaScript/Node.js
const completeExpenseWorkflow = async (accessToken, organizationId) => {
  try {
    // 1. Create expense
    const expense = await createExpense(accessToken, organizationId);
    console.log('Expense created:', expense.expense.expense_id);

    // 2. Upload receipt
    await uploadReceipt(
      accessToken,
      organizationId,
      expense.expense.expense_id,
      'receipt.jpg'
    );
    console.log('Receipt uploaded');

    // 3. Create expense report
    const report = await axios.post(
      'https://expense.zoho.com/api/v1/expensereports',
      {
        report_name: 'January 2025 Expenses',
        from_date: '2025-01-01',
        to_date: '2025-01-31',
        expense_ids: [expense.expense.expense_id],
        approver_id: '12345000000876543',
        purpose: 'Monthly business expenses'
      },
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json'
        },
        params: { organization_id: organizationId }
      }
    );
    console.log('Report created:', report.data.expensereport.report_id);

    // 4. Submit for approval
    await axios.post(
      `https://expense.zoho.com/api/v1/expensereports/${report.data.expensereport.report_id}/submit`,
      {},
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`
        },
        params: { organization_id: organizationId }
      }
    );
    console.log('Report submitted for approval');

    return {
      success: true,
      report_id: report.data.expensereport.report_id
    };

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
};
```

### 2. Bulk Expense Import

```python
# Python
import csv
import time

def bulk_import_expenses(access_token, organization_id, csv_file):
    results = {
        'successful': [],
        'failed': []
    }

    with open(csv_file, 'r') as f:
        reader = csv.DictReader(f)

        for row in reader:
            try:
                response = requests.post(
                    'https://expense.zoho.com/api/v1/expenses',
                    headers={
                        'Authorization': f'Zoho-oauthtoken {access_token}',
                        'Content-Type': 'application/json'
                    },
                    params={
                        'organization_id': organization_id
                    },
                    json={
                        'date': row['date'],
                        'amount': float(row['amount']),
                        'merchant': row['merchant'],
                        'category_id': row['category_id'],
                        'description': row['description'],
                        'payment_mode': row['payment_mode']
                    }
                )

                expense_id = response.json()['expense']['expense_id']
                results['successful'].append({
                    'merchant': row['merchant'],
                    'amount': row['amount'],
                    'expense_id': expense_id
                })

                print(f"Created: {row['merchant']} - ${row['amount']}")

                # Rate limiting
                time.sleep(0.6)

            except Exception as e:
                results['failed'].append({
                    'merchant': row['merchant'],
                    'error': str(e)
                })
                print(f"Failed: {row['merchant']} - {str(e)}")

    return results
```

### 3. Automated Approval Workflow

```javascript
// JavaScript/Node.js
const automatedApprovalWorkflow = async (accessToken, organizationId) => {
  // Get pending approvals
  const response = await axios.get(
    'https://expense.zoho.com/api/v1/approvals',
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      },
      params: {
        organization_id: organizationId,
        status: 'pending'
      }
    }
  );

  const pendingApprovals = response.data.approvals;

  for (const approval of pendingApprovals) {
    const report = await axios.get(
      `https://expense.zoho.com/api/v1/expensereports/${approval.report_id}`,
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`
        },
        params: { organization_id: organizationId }
      }
    );

    const totalAmount = report.data.expensereport.total_amount;

    // Auto-approve if under $500 and all receipts attached
    if (totalAmount < 500 && report.data.expensereport.receipt_count === report.data.expensereport.expense_count) {
      await axios.post(
        `https://expense.zoho.com/api/v1/expensereports/${approval.report_id}/approve`,
        {
          approver_notes: 'Auto-approved: Under policy limit with all receipts'
        },
        {
          headers: {
            'Authorization': `Zoho-oauthtoken ${accessToken}`,
            'Content-Type': 'application/json'
          },
          params: { organization_id: organizationId }
        }
      );

      console.log(`Auto-approved report: ${approval.report_id}`);
    }
  }
};
```

---

## Best Practices

### 1. Receipt Management

```javascript
// Always upload receipts immediately after creating expenses
const createExpenseWithReceipt = async (accessToken, organizationId, expenseData, receiptPath) => {
  // Create expense
  const expense = await createExpense(accessToken, organizationId, expenseData);

  // Upload receipt
  await uploadReceipt(accessToken, organizationId, expense.expense.expense_id, receiptPath);

  return expense;
};
```

### 2. Policy Compliance

```python
# Validate expenses against company policy
def validate_expense_policy(expense_data, policy_limits):
    violations = []

    # Check amount limits
    category = expense_data['category_name']
    if category in policy_limits:
        if expense_data['amount'] > policy_limits[category]['max_amount']:
            violations.append(f"Amount exceeds policy limit for {category}")

        if policy_limits[category]['receipt_required'] and not expense_data.get('receipt'):
            violations.append(f"Receipt required for {category}")

    return violations
```

### 3. Error Handling

```javascript
const handleExpenseError = (error) => {
  if (error.response?.data?.code === 5007) {
    console.error('Receipt required - please upload receipt');
  } else if (error.response?.data?.code === 5009) {
    console.error('Amount exceeds policy limit');
  } else {
    console.error('Error:', error.response?.data?.message);
  }
};
```

---

## Code Examples

### Deluge Integration

```deluge
// Deluge - Auto-create expense from CRM activity
activityId = "12345000000567890";
organization_id = "12345000000000099";

// Get activity details from CRM
activityMap = zoho.crm.getRecordById("Events", activityId);

if(activityMap.get("Event_Type") == "Client Meeting") {
    // Create expense for client meeting
    expense_data = {
        "date": activityMap.get("Start_DateTime").toString("yyyy-MM-dd"),
        "amount": 75.00,
        "category_name": "Meals and Entertainment",
        "merchant": "Client Lunch",
        "description": "Client meeting - " + activityMap.get("Subject"),
        "payment_mode": "Cash",
        "is_billable": true,
        "project_id": activityMap.get("Related_Project").get("id")
    };

    response = zoho.expense.createRecord("expenses", organization_id, expense_data);

    if(response.get("code") == 0) {
        expense_id = response.get("expense").get("expense_id");

        // Update CRM activity
        updateMap = Map();
        updateMap.put("Expense_ID", expense_id);
        updateMap.put("Expense_Status", "Created");

        zoho.crm.updateRecord("Events", activityId, updateMap);

        info "Expense created: " + expense_id;
    }
}
```

---

## Additional Resources

- [Official Zoho Expense API Documentation](https://www.zoho.com/expense/api/v1/)
- [API Console](https://api-console.zoho.com/)
- [Zoho Expense Help](https://www.zoho.com/expense/help/)
- [Developer Forums](https://help.zoho.com/portal/en/community/expense)

---

**Last Updated**: December 2025
**API Version**: v1
