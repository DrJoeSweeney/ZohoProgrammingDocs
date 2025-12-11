# Zoho Finance Plus API Reference

## Overview

Zoho Finance Plus is a unified financial management suite combining accounting, procurement, inventory, and analytics. The API provides programmatic access to financial operations across multiple Zoho finance products.

**Current API Version**: v1
**Base URL**: `https://financeplus.zoho.com/api/v1/`
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
- `ZohoFinancePlus.financials.ALL` - Full financial access
- `ZohoFinancePlus.reports.READ` - Read financial reports
- `ZohoFinancePlus.transactions.ALL` - Manage transactions

---

## Rate Limits

- **API Calls**: 5,000 calls per day per organization
- **Burst Limit**: 100 calls per minute

---

## API Modules

### 1. Organizations

**Endpoints**:
```http
GET /api/v1/organizations     # List organizations
GET /api/v1/organizations/{orgId} # Get organization details
```

**Example - Get Organizations**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const getOrganizations = async (accessToken) => {
  const response = await axios.get(
    'https://financeplus.zoho.com/api/v1/organizations',
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

---

### 2. Financial Reports

**Endpoints**:
```http
GET /api/v1/reports/profit-loss       # Profit & Loss statement
GET /api/v1/reports/balance-sheet     # Balance Sheet
GET /api/v1/reports/cash-flow         # Cash Flow statement
GET /api/v1/reports/trial-balance     # Trial Balance
```

**Example - Get Profit & Loss**:
```python
# Python
import requests

def get_profit_loss(access_token, org_id, date_range):
    url = 'https://financeplus.zoho.com/api/v1/reports/profit-loss'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'organization_id': org_id,
        'from_date': date_range['from'],
        'to_date': date_range['to']
    }

    response = requests.get(url, params=params, headers=headers)
    return response.json()

# Get Q1 2025 P&L
report = get_profit_loss(access_token, org_id, {
    'from': '2025-01-01',
    'to': '2025-03-31'
})
```

**Response**:
```json
{
  "report": "profit_loss",
  "period": {
    "from": "2025-01-01",
    "to": "2025-03-31"
  },
  "currency": "USD",
  "income": {
    "total": 500000,
    "categories": [
      {
        "name": "Sales Revenue",
        "amount": 450000
      },
      {
        "name": "Service Revenue",
        "amount": 50000
      }
    ]
  },
  "expenses": {
    "total": 320000,
    "categories": [
      {
        "name": "Cost of Goods Sold",
        "amount": 180000
      },
      {
        "name": "Operating Expenses",
        "amount": 140000
      }
    ]
  },
  "netIncome": 180000
}
```

---

### 3. Transactions

**Endpoints**:
```http
GET    /api/v1/transactions              # List transactions
GET    /api/v1/transactions/{transactionId} # Get transaction
POST   /api/v1/transactions              # Create transaction
PUT    /api/v1/transactions/{transactionId} # Update transaction
DELETE /api/v1/transactions/{transactionId} # Delete transaction
```

**Example - Create Transaction**:
```javascript
// JavaScript/Node.js
const createTransaction = async (accessToken, orgId, transactionData) => {
  const response = await axios.post(
    'https://financeplus.zoho.com/api/v1/transactions',
    {
      organization_id: orgId,
      transaction_type: transactionData.type,
      date: transactionData.date,
      amount: transactionData.amount,
      currency: transactionData.currency,
      account_id: transactionData.accountId,
      category: transactionData.category,
      description: transactionData.description,
      reference: transactionData.reference
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

### 4. Budget Management

**Endpoints**:
```http
GET    /api/v1/budgets              # List budgets
POST   /api/v1/budgets              # Create budget
PUT    /api/v1/budgets/{budgetId}   # Update budget
GET    /api/v1/budgets/{budgetId}/variance # Get budget variance
```

**Example - Create Budget**:
```python
# Python
def create_budget(access_token, org_id, budget_data):
    url = 'https://financeplus.zoho.com/api/v1/budgets'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'organization_id': org_id,
        'name': budget_data['name'],
        'fiscal_year': budget_data['fiscal_year'],
        'budget_items': budget_data['items']
    }

    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

---

### 5. Consolidated Reports

**Endpoints**:
```http
GET /api/v1/consolidated/profit-loss     # Consolidated P&L
GET /api/v1/consolidated/balance-sheet   # Consolidated Balance Sheet
GET /api/v1/consolidated/cash-flow       # Consolidated Cash Flow
```

**Example - Get Consolidated Report**:
```javascript
// JavaScript/Node.js
const getConsolidatedPL = async (accessToken, orgIds, dateRange) => {
  const response = await axios.get(
    'https://financeplus.zoho.com/api/v1/consolidated/profit-loss',
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      },
      params: {
        organization_ids: orgIds.join(','),
        from_date: dateRange.from,
        to_date: dateRange.to
      }
    }
  );
  return response.data;
};
```

---

### 6. Inter-company Transactions

**Endpoints**:
```http
GET    /api/v1/intercompany/transactions              # List IC transactions
POST   /api/v1/intercompany/transactions              # Create IC transaction
POST   /api/v1/intercompany/transactions/{txnId}/reconcile # Reconcile
```

**Example - Create Inter-company Transaction**:
```python
# Python
def create_ic_transaction(access_token, transaction_data):
    url = 'https://financeplus.zoho.com/api/v1/intercompany/transactions'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'source_org_id': transaction_data['source_org'],
        'destination_org_id': transaction_data['dest_org'],
        'amount': transaction_data['amount'],
        'currency': transaction_data['currency'],
        'date': transaction_data['date'],
        'description': transaction_data['description']
    }

    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

---

## Common Operations

### 1. Get Financial Summary

```javascript
// JavaScript/Node.js
const getFinancialSummary = async (accessToken, orgId) => {
  const response = await axios.get(
    `https://financeplus.zoho.com/api/v1/organizations/${orgId}/summary`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

### 2. Export Financial Report

```python
# Python
def export_report(access_token, report_type, org_id, format='pdf'):
    url = f'https://financeplus.zoho.com/api/v1/reports/{report_type}/export'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'organization_id': org_id,
        'format': format  # pdf, xlsx, csv
    }

    response = requests.get(url, params=params, headers=headers)
    return response.content
```

---

## Deluge Integration

```javascript
// Deluge Script
// Get consolidated financial data
orgIds = ["org_123", "org_456", "org_789"];

response = invokeurl
[
  url: "https://financeplus.zoho.com/api/v1/consolidated/profit-loss?organization_ids=" + orgIds.toString(",") + "&from_date=2025-01-01&to_date=2025-03-31"
  type: GET
  connection: "zoho_finance_plus"
];

netIncome = response.get("netIncome");
info "Q1 Net Income: $" + netIncome;
```

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 200 | Success | Request completed |
| 400 | Bad Request | Invalid parameters |
| 401 | Unauthorized | Invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |

---

## Best Practices

### 1. Financial Reporting
- Schedule regular report generation
- Cache reports appropriately
- Use date ranges efficiently
- Export for compliance records

### 2. Multi-organization Management
- Implement proper access controls
- Use consolidated views
- Track inter-company transactions
- Regular reconciliation

### 3. Performance
- Batch transaction imports
- Use appropriate date filters
- Optimize report queries
- Monitor API usage

---

## Data Centers

| Region | API Base URL |
|--------|-------------|
| US | `https://financeplus.zoho.com/api/v1/` |
| EU | `https://financeplus.zoho.eu/api/v1/` |
| IN | `https://financeplus.zoho.in/api/v1/` |

---

## Additional Resources

- **Official Documentation**: https://www.zoho.com/finance/help/api/
- **Developer Console**: https://api-console.zoho.com/
