# Zoho Subscriptions API Reference

## Overview

Zoho Subscriptions is a comprehensive recurring billing and subscription management platform designed for SaaS and subscription-based businesses. The API provides full programmatic access to subscriptions, billing cycles, payment gateways, customer management, and automated invoicing.

**Current API Version**: v1
**Base URL**: `https://www.zohoapis.com/billing/v1/`
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
**Purpose**: Manage customer accounts and billing information

**Endpoints**:
```http
GET    /customers                      # List all customers
GET    /customers/{customer_id}        # Get customer details
POST   /customers                      # Create customer
PUT    /customers/{customer_id}        # Update customer
DELETE /customers/{customer_id}        # Delete customer
POST   /customers/{customer_id}/markasactive # Activate customer
POST   /customers/{customer_id}/markasinactive # Deactivate customer
GET    /customers/{customer_id}/subscriptions # Get customer subscriptions
GET    /customers/{customer_id}/cards  # Get payment methods
```

**Example - Create Customer**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const createCustomer = async (accessToken, organizationId) => {
  const response = await axios.post(
    'https://www.zohoapis.com/billing/v1/customers',
    {
      display_name: 'Acme Corporation',
      salutation: 'Mr.',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@acme.com',
      company_name: 'Acme Corporation',
      phone: '+1-555-0123',
      mobile: '+1-555-0124',
      website: 'https://acme.com',
      currency_code: 'USD',
      payment_terms: 0,
      payment_terms_label: 'Due on Receipt',
      billing_address: {
        attention: 'John Doe',
        street: '123 Main Street',
        street2: 'Suite 100',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'USA',
        fax: '+1-555-0125'
      },
      shipping_address: {
        attention: 'John Doe',
        street: '123 Main Street',
        street2: 'Suite 100',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'USA'
      },
      notes: 'Premium customer - Enterprise plan',
      custom_fields: [
        {
          customfield_id: '12345000000567890',
          value: 'Enterprise-2025'
        }
      ]
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json',
        'X-com-zoho-subscriptions-organizationid': organizationId
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
    url = 'https://www.zohoapis.com/billing/v1/customers'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json',
        'X-com-zoho-subscriptions-organizationid': organization_id
    }
    data = {
        'display_name': 'Acme Corporation',
        'first_name': 'John',
        'last_name': 'Doe',
        'email': 'john.doe@acme.com',
        'company_name': 'Acme Corporation',
        'phone': '+1-555-0123',
        'currency_code': 'USD',
        'payment_terms': 0,
        'billing_address': {
            'attention': 'John Doe',
            'street': '123 Main Street',
            'city': 'New York',
            'state': 'NY',
            'zip': '10001',
            'country': 'USA'
        },
        'notes': 'Premium customer - Enterprise plan'
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

```deluge
// Deluge
customer_data = {
    "display_name": "Acme Corporation",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@acme.com",
    "company_name": "Acme Corporation",
    "phone": "+1-555-0123",
    "currency_code": "USD",
    "billing_address": {
        "attention": "John Doe",
        "street": "123 Main Street",
        "city": "New York",
        "state": "NY",
        "zip": "10001",
        "country": "USA"
    }
};

response = zoho.subscriptions.createRecord("customers", organization_id, customer_data);
info response;
```

**Response**:
```json
{
  "code": 0,
  "message": "The customer has been added.",
  "customer": {
    "customer_id": "12345000000234567",
    "display_name": "Acme Corporation",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@acme.com",
    "company_name": "Acme Corporation",
    "phone": "+1-555-0123",
    "status": "active",
    "currency_id": "12345000000000099",
    "currency_code": "USD",
    "currency_symbol": "$",
    "outstanding_receivable_amount": 0,
    "unused_credits_receivable_amount": 0,
    "created_time": "2025-01-15T10:30:00-0800",
    "last_modified_time": "2025-01-15T10:30:00-0800"
  }
}
```

---

### 2. Subscriptions
**Purpose**: Create and manage recurring subscriptions

**Endpoints**:
```http
GET    /subscriptions                      # List all subscriptions
GET    /subscriptions/{subscription_id}    # Get subscription details
POST   /subscriptions                      # Create subscription
PUT    /subscriptions/{subscription_id}    # Update subscription
DELETE /subscriptions/{subscription_id}    # Delete subscription
POST   /subscriptions/{subscription_id}/cancel # Cancel subscription
POST   /subscriptions/{subscription_id}/reactivate # Reactivate subscription
POST   /subscriptions/{subscription_id}/associate_addon # Add addon
POST   /subscriptions/{subscription_id}/addon/{addon_code}/update # Update addon
POST   /subscriptions/{subscription_id}/addon/{addon_code}/delete # Remove addon
GET    /subscriptions/{subscription_id}/invoices # Get subscription invoices
```

**Subscription Statuses**:
- Trial
- Live
- Future
- Unpaid
- Cancelled
- Expired
- Non-renewing

**Example - Create Subscription**:
```javascript
// JavaScript/Node.js
const createSubscription = async (accessToken, organizationId) => {
  const response = await axios.post(
    'https://www.zohoapis.com/billing/v1/subscriptions',
    {
      customer_id: '12345000000234567',
      plan_code: 'PLAN-ENTERPRISE',
      plan_description: 'Enterprise Plan - Annual',
      billing_cycles: -1,  // -1 for unlimited
      starts_at: '2025-01-20',
      trial_days: 14,
      coupon_code: 'WELCOME2025',
      addons: [
        {
          addon_code: 'ADDON-STORAGE',
          addon_description: 'Additional 100GB Storage',
          quantity: 2,
          price: 25.00
        },
        {
          addon_code: 'ADDON-USERS',
          addon_description: 'Additional 10 Users',
          quantity: 1,
          price: 50.00
        }
      ],
      auto_collect: true,
      payment_terms: 0,
      payment_terms_label: 'Due on Receipt',
      exchange_rate: 1.0,
      place_of_supply: 'NY',
      salesperson_name: 'Jane Smith',
      custom_fields: [
        {
          customfield_id: '12345000000678901',
          value: 'Q1-2025-Campaign'
        }
      ],
      reference_id: 'CRM-DEAL-12345',
      notes: 'Upgraded from Standard to Enterprise plan',
      terms: 'Service will be active after trial period ends.'
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json',
        'X-com-zoho-subscriptions-organizationid': organizationId
      }
    }
  );
  return response.data;
};
```

```python
# Python
def create_subscription(access_token, organization_id):
    url = 'https://www.zohoapis.com/billing/v1/subscriptions'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json',
        'X-com-zoho-subscriptions-organizationid': organization_id
    }
    data = {
        'customer_id': '12345000000234567',
        'plan_code': 'PLAN-ENTERPRISE',
        'plan_description': 'Enterprise Plan - Annual',
        'billing_cycles': -1,
        'starts_at': '2025-01-20',
        'trial_days': 14,
        'addons': [
            {
                'addon_code': 'ADDON-STORAGE',
                'addon_description': 'Additional 100GB Storage',
                'quantity': 2,
                'price': 25.00
            }
        ],
        'auto_collect': True,
        'payment_terms': 0,
        'reference_id': 'CRM-DEAL-12345',
        'notes': 'Upgraded from Standard to Enterprise plan'
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

**Response**:
```json
{
  "code": 0,
  "message": "The subscription has been created.",
  "subscription": {
    "subscription_id": "12345000000567890",
    "subscription_number": "SUB-00001",
    "name": "Acme Corporation - Enterprise Plan",
    "customer_id": "12345000000234567",
    "customer_name": "Acme Corporation",
    "status": "trial",
    "plan_id": "12345000000345678",
    "plan_code": "PLAN-ENTERPRISE",
    "plan_name": "Enterprise Plan",
    "plan_description": "Enterprise Plan - Annual",
    "interval": 1,
    "interval_unit": "years",
    "billing_mode": "automatic",
    "amount": 9999.00,
    "sub_total": 9999.00,
    "tax_total": 849.92,
    "total": 10848.92,
    "currency_id": "12345000000000099",
    "currency_code": "USD",
    "trial_starts_at": "2025-01-20",
    "trial_ends_at": "2025-02-03",
    "current_term_starts_at": "2025-02-04",
    "current_term_ends_at": "2026-02-04",
    "next_billing_at": "2025-02-04",
    "created_time": "2025-01-15T10:30:00-0800",
    "activated_at": "2025-01-20T00:00:00-0800",
    "addons": [
      {
        "addon_code": "ADDON-STORAGE",
        "addon_description": "Additional 100GB Storage",
        "quantity": 2,
        "price": 25.00,
        "amount": 50.00
      }
    ]
  }
}
```

---

### 3. Plans
**Purpose**: Define subscription plans and pricing

**Endpoints**:
```http
GET    /plans                         # List all plans
GET    /plans/{plan_code}             # Get plan details
POST   /plans                         # Create plan
PUT    /plans/{plan_code}             # Update plan
DELETE /plans/{plan_code}             # Delete plan
POST   /plans/{plan_code}/markasactive # Activate plan
POST   /plans/{plan_code}/markasinactive # Deactivate plan
```

**Billing Intervals**:
- Days
- Weeks
- Months
- Years

**Example - Create Plan**:
```javascript
// JavaScript/Node.js
const createPlan = async (accessToken, organizationId) => {
  const response = await axios.post(
    'https://www.zohoapis.com/billing/v1/plans',
    {
      plan_code: 'PLAN-PROFESSIONAL',
      name: 'Professional Plan',
      description: 'Perfect for growing businesses',
      recurring_price: 299.00,
      interval: 1,
      interval_unit: 'months',
      billing_cycles: -1,
      trial_period: 14,
      setup_fee: 99.00,
      setup_fee_account_id: '12345000000789012',
      tax_id: '12345000000456789',
      tax_exemption_id: null,
      tax_exemption_type: null,
      accounting_code: '4000',
      invoice_notes: 'Thank you for subscribing to our Professional Plan!',
      custom_fields: [
        {
          customfield_id: '12345000000567890',
          value: 'Professional-Tier'
        }
      ]
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json',
        'X-com-zoho-subscriptions-organizationid': organizationId
      }
    }
  );
  return response.data;
};
```

---

### 4. Addons
**Purpose**: Manage subscription add-ons and extras

**Endpoints**:
```http
GET    /addons                        # List all addons
GET    /addons/{addon_code}           # Get addon details
POST   /addons                        # Create addon
PUT    /addons/{addon_code}           # Update addon
DELETE /addons/{addon_code}           # Delete addon
```

**Addon Types**:
- One-time
- Recurring

**Example - Create Addon**:
```python
# Python
def create_addon(access_token, organization_id):
    url = 'https://www.zohoapis.com/billing/v1/addons'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json',
        'X-com-zoho-subscriptions-organizationid': organization_id
    }
    data = {
        'addon_code': 'ADDON-PREMIUM-SUPPORT',
        'name': 'Premium Support',
        'addon_type': 'recurring',
        'description': '24/7 premium support with dedicated account manager',
        'pricing_scheme': 'flat_fee',
        'price_brackets': [
            {
                'price': 199.00
            }
        ],
        'unit_name': 'license',
        'invoice_notes': 'Premium support subscription',
        'tax_id': '12345000000456789',
        'accounting_code': '4100'
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

---

### 5. Hosted Pages
**Purpose**: Create secure payment and subscription pages

**Endpoints**:
```http
POST   /hostedpages/newsubscription   # Create new subscription page
POST   /hostedpages/updatecard        # Create update card page
POST   /hostedpages/buyonetimeplans   # Create one-time purchase page
GET    /hostedpages/{hostedpage_id}   # Get hosted page details
```

**Example - Create Subscription Hosted Page**:
```javascript
// JavaScript/Node.js
const createHostedPage = async (accessToken, organizationId) => {
  const response = await axios.post(
    'https://www.zohoapis.com/billing/v1/hostedpages/newsubscription',
    {
      plan_code: 'PLAN-PROFESSIONAL',
      customer: {
        display_name: 'Acme Corporation',
        email: 'john.doe@acme.com',
        first_name: 'John',
        last_name: 'Doe',
        company_name: 'Acme Corporation'
      },
      addons: [
        {
          addon_code: 'ADDON-STORAGE',
          quantity: 2
        }
      ],
      coupon_code: 'WELCOME2025',
      redirect_url: 'https://yourdomain.com/subscription/success',
      custom_fields: [
        {
          customfield_id: '12345000000567890',
          value: 'WebSignup-2025'
        }
      ]
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json',
        'X-com-zoho-subscriptions-organizationid': organizationId
      }
    }
  );

  // Returns hostedpage_id and url
  console.log('Hosted Page URL:', response.data.hostedpage.url);
  return response.data;
};
```

---

### 6. Invoices
**Purpose**: Manage subscription invoices

**Endpoints**:
```http
GET    /invoices                      # List all invoices
GET    /invoices/{invoice_id}         # Get invoice details
POST   /invoices                      # Create invoice
PUT    /invoices/{invoice_id}         # Update invoice
DELETE /invoices/{invoice_id}         # Delete invoice
POST   /invoices/{invoice_id}/email   # Email invoice
POST   /invoices/{invoice_id}/void    # Void invoice
POST   /invoices/{invoice_id}/write_off # Write off invoice
POST   /invoices/{invoice_id}/collect # Collect payment
GET    /invoices/{invoice_id}/pdf     # Download PDF
```

**Invoice Statuses**:
- Draft
- Sent
- Viewed
- Overdue
- Paid
- Void
- Uncollectible
- Partially Paid

**Example - Email Invoice**:
```javascript
// JavaScript/Node.js
const emailInvoice = async (accessToken, organizationId, invoiceId) => {
  const response = await axios.post(
    `https://www.zohoapis.com/billing/v1/invoices/${invoiceId}/email`,
    {
      to_mail_ids: ['customer@example.com'],
      cc_mail_ids: ['accounting@company.com'],
      subject: 'Invoice for Your Subscription',
      body: 'Dear Customer,\n\nPlease find attached your invoice.\n\nThank you!'
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json',
        'X-com-zoho-subscriptions-organizationid': organizationId
      }
    }
  );
  return response.data;
};
```

---

### 7. Payments
**Purpose**: Record and manage payments

**Endpoints**:
```http
GET    /payments                      # List all payments
GET    /payments/{payment_id}         # Get payment details
POST   /payments                      # Record payment
PUT    /payments/{payment_id}         # Update payment
DELETE /payments/{payment_id}         # Delete payment
POST   /payments/{payment_id}/refund  # Refund payment
```

**Payment Gateways Supported**:
- Stripe
- PayPal
- Authorize.Net
- Braintree
- 2Checkout
- PayFlow Pro
- Forte
- WorldPay
- GoCardless
- Amazon Payments

**Example - Record Payment**:
```python
# Python
def record_payment(access_token, organization_id):
    url = 'https://www.zohoapis.com/billing/v1/payments'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json',
        'X-com-zoho-subscriptions-organizationid': organization_id
    }
    data = {
        'customer_id': '12345000000234567',
        'payment_mode': 'creditcard',
        'amount': 299.00,
        'date': '2025-01-20',
        'reference_number': 'TXN-2025-ABC123',
        'description': 'Payment for Professional Plan subscription',
        'invoices': [
            {
                'invoice_id': '12345000000789012',
                'amount_applied': 299.00
            }
        ],
        'exchange_rate': 1.0,
        'bank_charges': 0,
        'payment_gateway': 'stripe',
        'gateway_transaction_id': 'ch_3AbCdEfGhIjKlMnO'
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

---

### 8. Credit Notes
**Purpose**: Manage customer credits and refunds

**Endpoints**:
```http
GET    /creditnotes                   # List all credit notes
GET    /creditnotes/{creditnote_id}   # Get credit note details
POST   /creditnotes                   # Create credit note
PUT    /creditnotes/{creditnote_id}   # Update credit note
DELETE /creditnotes/{creditnote_id}   # Delete credit note
POST   /creditnotes/{creditnote_id}/void # Void credit note
POST   /creditnotes/{creditnote_id}/refunds # Issue refund
```

**Example - Create Credit Note**:
```javascript
// JavaScript/Node.js
const createCreditNote = async (accessToken, organizationId) => {
  const response = await axios.post(
    'https://www.zohoapis.com/billing/v1/creditnotes',
    {
      customer_id: '12345000000234567',
      creditnote_number: 'CN-00001',
      date: '2025-01-20',
      invoice_id: '12345000000789012',
      line_items: [
        {
          item_id: '12345000000345678',
          name: 'Service Credit',
          description: 'Credit for service downtime',
          rate: 99.00,
          quantity: 1,
          tax_id: '12345000000456789'
        }
      ],
      notes: 'Credit issued for service interruption on 2025-01-18',
      terms: 'Credit will be applied to next invoice'
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json',
        'X-com-zoho-subscriptions-organizationid': organizationId
      }
    }
  );
  return response.data;
};
```

---

### 9. Coupons
**Purpose**: Create and manage discount coupons

**Endpoints**:
```http
GET    /coupons                       # List all coupons
GET    /coupons/{coupon_code}         # Get coupon details
POST   /coupons                       # Create coupon
PUT    /coupons/{coupon_code}         # Update coupon
DELETE /coupons/{coupon_code}         # Delete coupon
POST   /coupons/{coupon_code}/markasactive # Activate coupon
POST   /coupons/{coupon_code}/markasinactive # Deactivate coupon
```

**Discount Types**:
- Fixed Amount
- Percentage

**Example - Create Coupon**:
```python
# Python
def create_coupon(access_token, organization_id):
    url = 'https://www.zohoapis.com/billing/v1/coupons'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json',
        'X-com-zoho-subscriptions-organizationid': organization_id
    }
    data = {
        'coupon_code': 'SUMMER2025',
        'coupon_name': 'Summer 2025 Promotion',
        'description': '20% off for first 3 months',
        'discount_type': 'percentage',
        'discount_value': 20.0,
        'apply_discount_on': 'invoice_amount',
        'duration_type': 'limited_months',
        'duration_months': 3,
        'max_redemptions': 100,
        'redemptions_per_customer': 1,
        'expiry_at': '2025-09-30',
        'applicable_plans': ['PLAN-PROFESSIONAL', 'PLAN-ENTERPRISE'],
        'notes': 'Valid for new customers only'
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

---

### 10. Webhooks
**Purpose**: Receive real-time subscription and billing events

**Supported Events**:
- subscription_created
- subscription_activated
- subscription_cancelled
- subscription_renewed
- subscription_expired
- payment_succeeded
- payment_failed
- invoice_created
- invoice_paid
- card_expiry_reminder
- subscription_trial_end_reminder

**Example - Configure Webhook**:
```javascript
// JavaScript/Node.js
const configureWebhook = async (accessToken, organizationId) => {
  const response = await axios.post(
    'https://www.zohoapis.com/billing/v1/webhooks',
    {
      url: 'https://yourdomain.com/webhook/zoho-subscriptions',
      events: [
        'subscription_created',
        'subscription_activated',
        'subscription_cancelled',
        'payment_succeeded',
        'payment_failed'
      ]
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json',
        'X-com-zoho-subscriptions-organizationid': organizationId
      }
    }
  );
  return response.data;
};
```

**Webhook Payload Example**:
```json
{
  "event": "subscription_activated",
  "timestamp": 1704067200000,
  "subscription": {
    "subscription_id": "12345000000567890",
    "subscription_number": "SUB-00001",
    "customer_id": "12345000000234567",
    "customer_name": "Acme Corporation",
    "customer_email": "john.doe@acme.com",
    "plan_code": "PLAN-PROFESSIONAL",
    "plan_name": "Professional Plan",
    "status": "live",
    "amount": 299.00,
    "interval": 1,
    "interval_unit": "months",
    "current_term_starts_at": "2025-01-20",
    "current_term_ends_at": "2025-02-20",
    "next_billing_at": "2025-02-20"
  }
}
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
  scope=ZohoSubscriptions.fullaccess.all&
  client_id={client_id}&
  response_type=code&
  access_type=offline&
  redirect_uri={redirect_uri}
```

**Available Scopes**:
- `ZohoSubscriptions.fullaccess.all` - Full access to all Subscriptions data
- `ZohoSubscriptions.subscriptions.READ` - Read subscriptions
- `ZohoSubscriptions.subscriptions.CREATE` - Create subscriptions
- `ZohoSubscriptions.subscriptions.UPDATE` - Update subscriptions
- `ZohoSubscriptions.subscriptions.DELETE` - Delete subscriptions
- Similar scopes for customers, plans, invoices, payments, etc.

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

## organization_id Requirement

**IMPORTANT**: All Zoho Subscriptions API requests require the organization_id in the request header.

**Header Format**:
```http
X-com-zoho-subscriptions-organizationid: {organization_id}
```

### Getting Organization ID

```javascript
// JavaScript/Node.js
const getOrganizations = async (accessToken) => {
  const response = await axios.get(
    'https://www.zohoapis.com/billing/v1/organizations',
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

| Plan | API Calls per Minute | API Calls per Day | Concurrent Calls |
|------|---------------------|-------------------|------------------|
| Basic | 60 | 2,000 | 5 |
| Standard | 100 | 5,000 | 10 |
| Professional | 150 | 10,000 | 15 |
| Enterprise | 200 | 25,000 | 20 |

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

### Zoho Subscriptions Error Codes

| Code | Message | Description | Solution |
|------|---------|-------------|----------|
| 0 | Success | Operation successful | N/A |
| 1001 | Invalid request | Missing/invalid parameters | Check parameters |
| 1002 | Authentication failed | Invalid token | Refresh access token |
| 1003 | Permission denied | Insufficient permissions | Check OAuth scopes |
| 1004 | Resource not found | Subscription/customer not found | Verify resource ID |
| 1005 | Invalid plan | Plan code doesn't exist | Verify plan code |
| 1006 | Duplicate subscription | Customer already has active subscription | Update existing subscription |
| 1007 | Payment failed | Payment gateway error | Check payment details |
| 1008 | Card expired | Payment card has expired | Update payment method |
| 1009 | Insufficient balance | Customer has insufficient balance | Add payment method |

---

## Common Operations

### 1. Complete Subscription Setup Workflow

```javascript
// JavaScript/Node.js
const completeSubscriptionSetup = async (accessToken, organizationId) => {
  try {
    // 1. Create customer
    const customer = await createCustomer(accessToken, organizationId);
    console.log('Customer created:', customer.customer.customer_id);

    // 2. Create plan (if not exists)
    const plan = await createPlan(accessToken, organizationId);
    console.log('Plan created:', plan.plan.plan_code);

    // 3. Create hosted page for subscription
    const hostedPage = await axios.post(
      'https://www.zohoapis.com/billing/v1/hostedpages/newsubscription',
      {
        plan_code: plan.plan.plan_code,
        customer_id: customer.customer.customer_id,
        redirect_url: 'https://yourdomain.com/success'
      },
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json',
          'X-com-zoho-subscriptions-organizationid': organizationId
        }
      }
    );

    console.log('Hosted page URL:', hostedPage.data.hostedpage.url);

    return {
      success: true,
      customer_id: customer.customer.customer_id,
      hosted_page_url: hostedPage.data.hostedpage.url
    };

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
};
```

### 2. Handle Subscription Upgrades/Downgrades

```python
# Python
def upgrade_subscription(access_token, organization_id, subscription_id, new_plan_code):
    url = f'https://www.zohoapis.com/billing/v1/subscriptions/{subscription_id}'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json',
        'X-com-zoho-subscriptions-organizationid': organization_id
    }
    data = {
        'plan': {
            'plan_code': new_plan_code
        },
        'proration': True,  # Prorate charges
        'end_of_term': False  # Apply immediately
    }
    response = requests.put(url, json=data, headers=headers)
    return response.json()
```

### 3. Process Recurring Billing

```javascript
// JavaScript/Node.js
const processRecurringBilling = async (accessToken, organizationId) => {
  // Get subscriptions due for renewal
  const response = await axios.get(
    'https://www.zohoapis.com/billing/v1/subscriptions',
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'X-com-zoho-subscriptions-organizationid': organizationId
      },
      params: {
        filter_by: 'Status.All',
        sort_column: 'next_billing_at',
        sort_order: 'A'
      }
    }
  );

  const today = new Date().toISOString().split('T')[0];
  const dueSubscriptions = response.data.subscriptions.filter(
    sub => sub.next_billing_at === today && sub.status === 'live'
  );

  for (const subscription of dueSubscriptions) {
    try {
      // Collect payment
      await axios.post(
        `https://www.zohoapis.com/billing/v1/subscriptions/${subscription.subscription_id}/collect`,
        {},
        {
          headers: {
            'Authorization': `Zoho-oauthtoken ${accessToken}`,
            'X-com-zoho-subscriptions-organizationid': organizationId
          }
        }
      );

      console.log(`Payment collected for: ${subscription.customer_name}`);

    } catch (error) {
      console.error(`Payment failed for: ${subscription.customer_name}`);
    }
  }
};
```

### 4. Generate Revenue Reports

```python
# Python
from datetime import datetime, timedelta

def generate_mrr_report(access_token, organization_id):
    url = 'https://www.zohoapis.com/billing/v1/subscriptions'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'X-com-zoho-subscriptions-organizationid': organization_id
    }
    params = {
        'filter_by': 'Status.Live'
    }

    response = requests.get(url, headers=headers, params=params)
    subscriptions = response.json()['subscriptions']

    # Calculate Monthly Recurring Revenue
    mrr = 0
    for sub in subscriptions:
        if sub['interval_unit'] == 'months':
            mrr += sub['amount'] / sub['interval']
        elif sub['interval_unit'] == 'years':
            mrr += sub['amount'] / (sub['interval'] * 12)

    # Calculate Annual Recurring Revenue
    arr = mrr * 12

    # Calculate churn rate
    # ... add churn calculation logic

    return {
        'mrr': round(mrr, 2),
        'arr': round(arr, 2),
        'active_subscriptions': len(subscriptions)
    }
```

---

## Best Practices

### 1. Subscription Management

```javascript
// Implement retry logic for failed payments
const retryFailedPayment = async (accessToken, organizationId, subscriptionId, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await axios.post(
        `https://www.zohoapis.com/billing/v1/subscriptions/${subscriptionId}/collect`,
        {},
        {
          headers: {
            'Authorization': `Zoho-oauthtoken ${accessToken}`,
            'X-com-zoho-subscriptions-organizationid': organizationId
          }
        }
      );
      return { success: true, attempt: i + 1 };
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 86400000)); // Wait 24 hours
    }
  }
};
```

### 2. Webhook Security

```javascript
// Verify webhook authenticity
const crypto = require('crypto');

const verifyWebhook = (payload, signature, secret) => {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  return hash === signature;
};

app.post('/webhook/zoho-subscriptions', (req, res) => {
  const signature = req.headers['x-zoho-webhook-signature'];

  if (!verifyWebhook(req.body, signature, WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }

  const { event, subscription } = req.body;

  switch (event) {
    case 'subscription_activated':
      // Handle activation
      break;
    case 'payment_failed':
      // Handle payment failure
      break;
    default:
      console.log('Unhandled event:', event);
  }

  res.status(200).send('OK');
});
```

### 3. Dunning Management

```python
# Implement dunning strategy for failed payments
def handle_payment_failure(access_token, organization_id, subscription_id, attempt):
    if attempt == 1:
        # First attempt: Send reminder email
        send_payment_reminder(subscription_id)
    elif attempt == 2:
        # Second attempt: Update payment method
        send_payment_method_update_link(subscription_id)
    elif attempt == 3:
        # Third attempt: Suspend service
        suspend_subscription(access_token, organization_id, subscription_id)
    elif attempt >= 4:
        # Fourth attempt: Cancel subscription
        cancel_subscription(access_token, organization_id, subscription_id)
```

---

## Code Examples

### Deluge Integration

```deluge
// Deluge - Create subscription from CRM deal
dealId = "12345000000567890";
organization_id = "12345000000000099";

// Get deal details
dealMap = zoho.crm.getRecordById("Deals", dealId);

// Get contact details
contactId = dealMap.get("Contact_Name").get("id");
contactMap = zoho.crm.getRecordById("Contacts", contactId);

// Create customer in Subscriptions
customer_data = {
    "display_name": contactMap.get("Full_Name"),
    "email": contactMap.get("Email"),
    "company_name": dealMap.get("Account_Name").get("name"),
    "phone": contactMap.get("Phone")
};

customer_response = zoho.subscriptions.createRecord("customers", organization_id, customer_data);
customer_id = customer_response.get("customer").get("customer_id");

// Create subscription
subscription_data = {
    "customer_id": customer_id,
    "plan_code": dealMap.get("Product_Details").get(0).get("product").get("Product_Code"),
    "starts_at": zoho.currentdate.toString("yyyy-MM-dd"),
    "auto_collect": true,
    "reference_id": "CRM-DEAL-" + dealId
};

subscription_response = zoho.subscriptions.createRecord("subscriptions", organization_id, subscription_data);

if(subscription_response.get("code") == 0) {
    subscription_id = subscription_response.get("subscription").get("subscription_id");

    // Update CRM deal
    updateMap = Map();
    updateMap.put("Subscription_ID", subscription_id);
    updateMap.put("Subscription_Status", "Active");

    zoho.crm.updateRecord("Deals", dealId, updateMap);

    info "Subscription created: " + subscription_id;
}
```

---

## Additional Resources

- [Official Zoho Subscriptions API Documentation](https://www.zoho.com/subscriptions/api/v1/)
- [API Console](https://api-console.zoho.com/)
- [Zoho Subscriptions Help](https://www.zoho.com/subscriptions/help/)
- [Developer Forums](https://help.zoho.com/portal/en/community/subscriptions)
- [Webhook Documentation](https://www.zoho.com/subscriptions/api/v1/webhooks/)

---

**Last Updated**: December 2025
**API Version**: v1
