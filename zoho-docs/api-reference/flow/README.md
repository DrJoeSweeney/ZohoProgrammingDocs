# Zoho Flow API Reference

## Overview

Zoho Flow is a workflow automation platform that connects your apps and automates business processes without code. The API enables programmatic access to flows, connections, and automation workflows, allowing you to build, manage, and monitor integrations across 1000+ apps.

**Current API Version**: v1
**Base URL**: `https://flow.zoho.com/api/v1/`
**Protocol**: REST
**Data Format**: JSON
**Authentication**: OAuth 2.0

---

## Quick Links

- [Authentication](#authentication)
- [Flow Management APIs](#flow-management-apis)
- [Trigger APIs](#trigger-apis)
- [Action APIs](#action-apis)
- [Connection APIs](#connection-apis)
- [Custom Functions](#custom-functions)
- [Webhooks](#webhooks)
- [Error Handling](#error-handling)
- [Code Examples](#code-examples)
- [Best Practices](#best-practices)

---

## API Categories

### 1. Flow Management APIs
**Purpose**: Create, manage, and control workflow automation flows

**Endpoints**:
```http
GET    /flows                    # List all flows
GET    /flows/{flow-id}          # Get flow details
POST   /flows                    # Create new flow
PUT    /flows/{flow-id}          # Update flow
DELETE /flows/{flow-id}          # Delete flow
POST   /flows/{flow-id}/enable   # Enable flow
POST   /flows/{flow-id}/disable  # Disable flow
GET    /flows/{flow-id}/history  # Get flow execution history
```

**Example - List All Flows**:
```http
GET https://flow.zoho.com/api/v1/flows
Authorization: Zoho-oauthtoken {access_token}
```

**Response**:
```json
{
  "status": "success",
  "data": {
    "flows": [
      {
        "flow_id": "12345000000123456",
        "flow_name": "CRM Lead to Campaign",
        "description": "Add new CRM leads to marketing campaign",
        "status": "active",
        "trigger_app": "zohocrm",
        "created_time": "2025-01-15T10:30:00Z",
        "modified_time": "2025-01-20T14:45:00Z",
        "execution_count": 1250,
        "success_count": 1240,
        "failure_count": 10
      },
      {
        "flow_id": "12345000000123457",
        "flow_name": "Invoice to Accounting",
        "description": "Sync invoices from CRM to Books",
        "status": "active",
        "trigger_app": "zohocrm",
        "created_time": "2025-01-10T09:15:00Z",
        "modified_time": "2025-01-22T11:30:00Z",
        "execution_count": 856,
        "success_count": 856,
        "failure_count": 0
      }
    ],
    "page": 1,
    "per_page": 20,
    "total_count": 2
  }
}
```

**Example - Get Flow Details**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const getFlowDetails = async (accessToken, flowId) => {
  const response = await axios.get(
    `https://flow.zoho.com/api/v1/flows/${flowId}`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

**Response**:
```json
{
  "status": "success",
  "data": {
    "flow_id": "12345000000123456",
    "flow_name": "CRM Lead to Campaign",
    "description": "Add new CRM leads to marketing campaign",
    "status": "active",
    "trigger": {
      "type": "webhook",
      "app": "zohocrm",
      "module": "Leads",
      "event": "create"
    },
    "actions": [
      {
        "action_id": "12345000000234567",
        "app": "zohocampaigns",
        "action": "add_contact",
        "config": {
          "list_key": "marketing_leads",
          "contact_email": "${trigger.Email}",
          "first_name": "${trigger.First_Name}",
          "last_name": "${trigger.Last_Name}"
        }
      }
    ],
    "created_by": "john.doe@company.com",
    "created_time": "2025-01-15T10:30:00Z"
  }
}
```

**Example - Create Flow**:
```javascript
const createFlow = async (accessToken, flowConfig) => {
  const response = await axios.post(
    'https://flow.zoho.com/api/v1/flows',
    {
      flow_name: flowConfig.name,
      description: flowConfig.description,
      trigger: {
        type: 'webhook',
        app: 'zohocrm',
        module: 'Leads',
        event: 'create'
      },
      actions: [
        {
          app: 'zohocampaigns',
          action: 'add_contact',
          config: {
            list_key: 'marketing_leads',
            contact_email: '${trigger.Email}',
            first_name: '${trigger.First_Name}',
            last_name: '${trigger.Last_Name}'
          }
        }
      ]
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

def create_flow(access_token, flow_config):
    url = 'https://flow.zoho.com/api/v1/flows'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'flow_name': flow_config['name'],
        'description': flow_config['description'],
        'trigger': {
            'type': 'webhook',
            'app': 'zohocrm',
            'module': 'Leads',
            'event': 'create'
        },
        'actions': [
            {
                'app': 'zohocampaigns',
                'action': 'add_contact',
                'config': {
                    'list_key': 'marketing_leads',
                    'contact_email': '${trigger.Email}',
                    'first_name': '${trigger.First_Name}',
                    'last_name': '${trigger.Last_Name}'
                }
            }
        ]
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

```deluge
// Deluge
flow_config = {
    "flow_name": "CRM Lead to Campaign",
    "description": "Add new CRM leads to marketing campaign",
    "trigger": {
        "type": "webhook",
        "app": "zohocrm",
        "module": "Leads",
        "event": "create"
    },
    "actions": [
        {
            "app": "zohocampaigns",
            "action": "add_contact",
            "config": {
                "list_key": "marketing_leads",
                "contact_email": "${trigger.Email}",
                "first_name": "${trigger.First_Name}",
                "last_name": "${trigger.Last_Name}"
            }
        }
    ]
};

response = invokeurl
[
    url: "https://flow.zoho.com/api/v1/flows"
    type: POST
    parameters: flow_config.toString()
    connection: "zoho_flow_connection"
];

info response;
```

---

### 2. Trigger APIs
**Purpose**: Configure and manage flow triggers (events that start workflows)

Zoho Flow supports multiple trigger types:
- **Webhooks**: Real-time triggers from app events
- **Polling APIs**: Periodic checks for new/updated records
- **Schedule**: Time-based triggers (cron-like)
- **Manual**: User-initiated triggers
- **Custom Webhooks**: Generic webhook endpoints

**Endpoints**:
```http
GET    /triggers                        # List available triggers
GET    /triggers/{trigger-id}           # Get trigger details
POST   /flows/{flow-id}/trigger         # Configure flow trigger
PUT    /flows/{flow-id}/trigger         # Update trigger configuration
GET    /flows/{flow-id}/trigger/test    # Test trigger
```

**Trigger Types Configuration**:

#### Webhook Trigger
```javascript
const webhookTrigger = {
  type: 'webhook',
  app: 'zohocrm',
  module: 'Leads',
  event: 'create', // create, update, delete
  filter: {
    field: 'Lead_Status',
    operator: 'equals',
    value: 'Qualified'
  }
};
```

#### Polling Trigger
```javascript
const pollingTrigger = {
  type: 'polling',
  app: 'zohocrm',
  module: 'Contacts',
  action: 'get_new_records',
  poll_interval: 15, // minutes (5, 10, 15, 30, 60)
  criteria: {
    field: 'Created_Time',
    operator: 'greater_than',
    value: '${last_poll_time}'
  }
};
```

#### Schedule Trigger
```javascript
const scheduleTrigger = {
  type: 'schedule',
  schedule: {
    frequency: 'daily', // once, hourly, daily, weekly, monthly
    time: '09:00',
    timezone: 'America/New_York',
    days: ['Monday', 'Wednesday', 'Friday'] // for weekly
  }
};
```

#### Custom Webhook Trigger
```javascript
const customWebhookTrigger = {
  type: 'custom_webhook',
  webhook_url: 'https://flow.zoho.com/webhook/12345000000123456/abcdef123456',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Custom-Header': 'value'
  }
};
```

**Example - Configure Webhook Trigger**:
```javascript
const configureWebhookTrigger = async (accessToken, flowId) => {
  const response = await axios.post(
    `https://flow.zoho.com/api/v1/flows/${flowId}/trigger`,
    {
      type: 'webhook',
      app: 'zohocrm',
      module: 'Leads',
      event: 'create',
      filter: {
        field: 'Lead_Status',
        operator: 'equals',
        value: 'Qualified'
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

**Example - Test Trigger**:
```python
def test_trigger(access_token, flow_id):
    url = f'https://flow.zoho.com/api/v1/flows/{flow_id}/trigger/test'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    response = requests.get(url, headers=headers)
    return response.json()
```

**Response**:
```json
{
  "status": "success",
  "data": {
    "test_result": "passed",
    "sample_data": {
      "First_Name": "John",
      "Last_Name": "Doe",
      "Email": "john.doe@example.com",
      "Lead_Status": "Qualified",
      "Company": "Acme Corp"
    },
    "execution_id": "12345000000345678"
  }
}
```

---

### 3. Action APIs
**Purpose**: Define actions to perform when flows are triggered

**Endpoints**:
```http
GET    /actions                              # List available actions
GET    /actions/{action-id}                  # Get action details
POST   /flows/{flow-id}/actions              # Add action to flow
PUT    /flows/{flow-id}/actions/{action-id}  # Update action
DELETE /flows/{flow-id}/actions/{action-id}  # Remove action
POST   /flows/{flow-id}/actions/test         # Test action
```

**Available Action Types**:
- **Create Record**: Create new records in apps
- **Update Record**: Update existing records
- **Search Record**: Find records by criteria
- **Delete Record**: Remove records
- **Send Email**: Send email notifications
- **HTTP Request**: Make custom API calls
- **Custom Function**: Execute JavaScript code
- **Conditional Logic**: If-then-else branching
- **Data Transformation**: Format and transform data

**Example - Add Create Record Action**:
```javascript
const addCreateRecordAction = async (accessToken, flowId) => {
  const response = await axios.post(
    `https://flow.zoho.com/api/v1/flows/${flowId}/actions`,
    {
      app: 'zohocampaigns',
      action: 'create_contact',
      config: {
        list_key: 'marketing_leads',
        contact_email: '${trigger.Email}',
        first_name: '${trigger.First_Name}',
        last_name: '${trigger.Last_Name}',
        company: '${trigger.Company}',
        custom_fields: {
          source: 'CRM Lead',
          lead_status: '${trigger.Lead_Status}'
        }
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

**Example - Add HTTP Request Action**:
```javascript
const addHttpAction = async (accessToken, flowId) => {
  const response = await axios.post(
    `https://flow.zoho.com/api/v1/flows/${flowId}/actions`,
    {
      app: 'custom',
      action: 'http_request',
      config: {
        method: 'POST',
        url: 'https://api.example.com/webhook',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_TOKEN'
        },
        body: {
          name: '${trigger.First_Name} ${trigger.Last_Name}',
          email: '${trigger.Email}',
          timestamp: '${execution.timestamp}'
        },
        timeout: 30000
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

**Example - Add Conditional Action**:
```python
def add_conditional_action(access_token, flow_id):
    url = f'https://flow.zoho.com/api/v1/flows/{flow_id}/actions'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'app': 'custom',
        'action': 'condition',
        'config': {
            'condition': {
                'field': '${trigger.Annual_Revenue}',
                'operator': 'greater_than',
                'value': 100000
            },
            'if_true': [
                {
                    'app': 'zohocrm',
                    'action': 'update_record',
                    'config': {
                        'module': 'Leads',
                        'record_id': '${trigger.id}',
                        'fields': {
                            'Lead_Status': 'Hot Lead',
                            'Priority': 'High'
                        }
                    }
                }
            ],
            'if_false': [
                {
                    'app': 'zohocrm',
                    'action': 'update_record',
                    'config': {
                        'module': 'Leads',
                        'record_id': '${trigger.id}',
                        'fields': {
                            'Lead_Status': 'Warm Lead',
                            'Priority': 'Medium'
                        }
                    }
                }
            ]
        }
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

---

### 4. Connection APIs
**Purpose**: Manage app connections and authentication

**Endpoints**:
```http
GET    /connections                      # List all connections
GET    /connections/{connection-id}      # Get connection details
POST   /connections                      # Create new connection
PUT    /connections/{connection-id}      # Update connection
DELETE /connections/{connection-id}      # Delete connection
POST   /connections/{connection-id}/test # Test connection
```

**Example - List Connections**:
```http
GET https://flow.zoho.com/api/v1/connections
Authorization: Zoho-oauthtoken {access_token}
```

**Response**:
```json
{
  "status": "success",
  "data": {
    "connections": [
      {
        "connection_id": "12345000000098765",
        "connection_name": "Zoho CRM Production",
        "app": "zohocrm",
        "auth_type": "oauth2",
        "status": "active",
        "created_time": "2025-01-10T08:00:00Z",
        "scopes": [
          "ZohoCRM.modules.ALL",
          "ZohoCRM.settings.ALL"
        ]
      },
      {
        "connection_id": "12345000000098766",
        "connection_name": "Gmail Account",
        "app": "gmail",
        "auth_type": "oauth2",
        "status": "active",
        "created_time": "2025-01-12T10:30:00Z",
        "email": "notifications@company.com"
      }
    ]
  }
}
```

**Example - Create Connection**:
```javascript
const createConnection = async (accessToken, connectionConfig) => {
  const response = await axios.post(
    'https://flow.zoho.com/api/v1/connections',
    {
      connection_name: connectionConfig.name,
      app: connectionConfig.app,
      auth_type: 'oauth2',
      config: {
        client_id: connectionConfig.clientId,
        client_secret: connectionConfig.clientSecret,
        redirect_uri: connectionConfig.redirectUri,
        scopes: connectionConfig.scopes
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

**Example - Test Connection**:
```python
def test_connection(access_token, connection_id):
    url = f'https://flow.zoho.com/api/v1/connections/{connection_id}/test'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    response = requests.post(url, headers=headers)
    return response.json()
```

---

### 5. Custom Functions
**Purpose**: Execute custom JavaScript code within flows for data transformation and logic

**Supported Languages**:
- JavaScript (ES6+)
- Deluge (Zoho's scripting language)

**Features**:
- Access to trigger data
- HTTP requests
- JSON manipulation
- String operations
- Date/time functions
- Math operations
- Regular expressions

**Example - Custom Function Action**:
```javascript
const addCustomFunction = async (accessToken, flowId) => {
  const response = await axios.post(
    `https://flow.zoho.com/api/v1/flows/${flowId}/actions`,
    {
      app: 'custom',
      action: 'custom_function',
      config: {
        language: 'javascript',
        code: `
          // Custom function to transform data
          function transformLead(triggerData) {
            // Calculate lead score
            let score = 0;

            if (triggerData.Annual_Revenue > 1000000) {
              score += 50;
            } else if (triggerData.Annual_Revenue > 100000) {
              score += 30;
            } else {
              score += 10;
            }

            if (triggerData.No_of_Employees > 100) {
              score += 30;
            } else if (triggerData.No_of_Employees > 10) {
              score += 20;
            }

            // Determine priority
            let priority = 'Low';
            if (score >= 70) {
              priority = 'High';
            } else if (score >= 40) {
              priority = 'Medium';
            }

            // Format full name
            const fullName = triggerData.First_Name + ' ' + triggerData.Last_Name;

            // Return transformed data
            return {
              full_name: fullName,
              lead_score: score,
              priority: priority,
              processed_date: new Date().toISOString(),
              source: 'Flow Automation'
            };
          }

          // Execute transformation
          return transformLead(trigger);
        `,
        input_variables: ['trigger'],
        timeout: 10000
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

**Example - Custom Function with HTTP Request**:
```javascript
const httpCustomFunction = {
  language: 'javascript',
  code: `
    async function enrichLeadData(email) {
      try {
        // Call external API to enrich lead data
        const response = await fetch('https://api.clearbit.com/v2/people/find?email=' + email, {
          headers: {
            'Authorization': 'Bearer YOUR_API_KEY'
          }
        });

        if (!response.ok) {
          return { error: 'API request failed' };
        }

        const data = await response.json();

        return {
          name: data.name.fullName,
          company: data.employment.name,
          title: data.employment.title,
          linkedin: data.linkedin.handle,
          twitter: data.twitter.handle,
          enriched: true
        };
      } catch (error) {
        return { error: error.message, enriched: false };
      }
    }

    return enrichLeadData(trigger.Email);
  `,
  input_variables: ['trigger'],
  timeout: 30000
};
```

**Example - Deluge Custom Function**:
```deluge
// Deluge custom function configuration
custom_function = {
    "language": "deluge",
    "code": "
        // Transform and validate lead data
        lead_data = trigger;

        // Validate email
        if(lead_data.get('Email').contains('@') && lead_data.get('Email').contains('.')) {
            email_valid = true;
        } else {
            email_valid = false;
        }

        // Calculate lead score
        score = 0;

        if(lead_data.get('Annual_Revenue') > 1000000) {
            score = score + 50;
        }

        if(lead_data.get('Lead_Source') == 'Website') {
            score = score + 20;
        }

        // Format phone number
        phone = lead_data.get('Phone').replaceAll('-', '').replaceAll('(', '').replaceAll(')', '').replaceAll(' ', '');

        // Return result
        result = {
            'email_valid': email_valid,
            'lead_score': score,
            'formatted_phone': phone,
            'processed_time': zoho.currenttime.toString('yyyy-MM-dd HH:mm:ss')
        };

        return result;
    ",
    "input_variables": ["trigger"],
    "timeout": 10000
};
```

---

### 6. Integration with 1000+ Apps

Zoho Flow supports integration with over 1000 applications across various categories:

**Popular Integrations**:

#### Zoho Products
- Zoho CRM
- Zoho Books
- Zoho Desk
- Zoho Campaigns
- Zoho Projects
- Zoho Recruit
- Zoho Inventory
- Zoho Analytics
- Zoho Sign
- Zoho Forms
- Zoho Survey
- Zoho Creator
- Zoho People
- Zoho Mail

#### CRM & Sales
- Salesforce
- HubSpot
- Pipedrive
- Freshsales
- Close.io

#### Marketing
- Mailchimp
- SendGrid
- ActiveCampaign
- Constant Contact
- GetResponse

#### Project Management
- Trello
- Asana
- Monday.com
- Basecamp
- Jira

#### Communication
- Slack
- Microsoft Teams
- Gmail
- Outlook
- Twilio

#### Accounting
- QuickBooks
- Xero
- FreshBooks
- Wave

#### E-commerce
- Shopify
- WooCommerce
- Magento
- BigCommerce

#### Cloud Storage
- Google Drive
- Dropbox
- OneDrive
- Box

#### Payment Gateways
- Stripe
- PayPal
- Square
- Razorpay

**Example - Multi-App Integration Flow**:
```javascript
const createMultiAppFlow = async (accessToken) => {
  const flowConfig = {
    flow_name: 'E-commerce Order Processing',
    description: 'Process new orders from Shopify',
    trigger: {
      type: 'webhook',
      app: 'shopify',
      event: 'order_created'
    },
    actions: [
      {
        // Step 1: Create invoice in Zoho Books
        app: 'zohobooks',
        action: 'create_invoice',
        config: {
          customer_name: '${trigger.customer.name}',
          email: '${trigger.customer.email}',
          line_items: '${trigger.line_items}',
          total: '${trigger.total_price}'
        }
      },
      {
        // Step 2: Create deal in Zoho CRM
        app: 'zohocrm',
        action: 'create_record',
        config: {
          module: 'Deals',
          fields: {
            Deal_Name: 'Order #${trigger.order_number}',
            Amount: '${trigger.total_price}',
            Stage: 'Closed Won',
            Contact_Name: '${trigger.customer.name}'
          }
        }
      },
      {
        // Step 3: Send notification to Slack
        app: 'slack',
        action: 'send_message',
        config: {
          channel: '#sales',
          text: 'New order received: $${trigger.total_price} from ${trigger.customer.name}'
        }
      },
      {
        // Step 4: Update inventory in Zoho Inventory
        app: 'zohoinventory',
        action: 'update_item_stock',
        config: {
          items: '${trigger.line_items}',
          operation: 'decrease'
        }
      },
      {
        // Step 5: Send confirmation email via Gmail
        app: 'gmail',
        action: 'send_email',
        config: {
          to: '${trigger.customer.email}',
          subject: 'Order Confirmation - #${trigger.order_number}',
          body: 'Thank you for your order! Your order #${trigger.order_number} has been confirmed.'
        }
      }
    ]
  };

  const response = await axios.post(
    'https://flow.zoho.com/api/v1/flows',
    flowConfig,
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

### 7. Webhooks

**Purpose**: Receive real-time notifications from apps and trigger flows

**Webhook Types**:
1. **App Webhooks**: Pre-configured webhooks for supported apps
2. **Custom Webhooks**: Generic webhook endpoints for any service

**Endpoints**:
```http
GET    /webhooks                     # List all webhooks
GET    /webhooks/{webhook-id}        # Get webhook details
POST   /webhooks                     # Create custom webhook
DELETE /webhooks/{webhook-id}        # Delete webhook
GET    /webhooks/{webhook-id}/logs   # View webhook logs
```

**Custom Webhook URL Format**:
```
https://flow.zoho.com/webhook/{org-id}/{webhook-key}
```

**Example - Create Custom Webhook**:
```javascript
const createCustomWebhook = async (accessToken, flowId) => {
  const response = await axios.post(
    'https://flow.zoho.com/api/v1/webhooks',
    {
      webhook_name: 'Payment Gateway Webhook',
      flow_id: flowId,
      method: 'POST',
      authentication: {
        type: 'header',
        key: 'X-Webhook-Secret',
        value: 'YOUR_SECRET_KEY'
      },
      response_format: 'json'
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

**Response**:
```json
{
  "status": "success",
  "data": {
    "webhook_id": "12345000000456789",
    "webhook_url": "https://flow.zoho.com/webhook/12345000000123456/abc123def456",
    "webhook_name": "Payment Gateway Webhook",
    "status": "active",
    "created_time": "2025-01-20T15:30:00Z"
  }
}
```

**Example - Webhook Payload Handling**:
```javascript
// Example webhook handler in Node.js
const express = require('express');
const app = express();

app.post('/webhook', express.json(), (req, res) => {
  const webhookData = req.body;

  // Verify webhook signature (if configured)
  const signature = req.headers['x-webhook-signature'];
  if (!verifySignature(webhookData, signature)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Process webhook data
  console.log('Received webhook:', webhookData);

  // Trigger Zoho Flow
  axios.post(
    'https://flow.zoho.com/webhook/12345000000123456/abc123def456',
    webhookData,
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Secret': 'YOUR_SECRET_KEY'
      }
    }
  ).then(response => {
    console.log('Flow triggered successfully');
  }).catch(error => {
    console.error('Flow trigger failed:', error);
  });

  // Return success response
  res.status(200).json({ status: 'received' });
});
```

**Webhook Security Best Practices**:
```javascript
const crypto = require('crypto');

// Verify webhook signature
function verifySignature(payload, signature, secret) {
  const computedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(computedSignature)
  );
}

// Implement IP whitelist
const ZOHO_FLOW_IPS = [
  '13.126.112.0/24',
  '18.217.101.0/24',
  '3.6.112.0/24'
];

function isZohoFlowIP(ip) {
  // Check if request IP is from Zoho Flow
  return ZOHO_FLOW_IPS.some(range => ipInRange(ip, range));
}
```

---

### 8. Execution History & Monitoring

**Endpoints**:
```http
GET /flows/{flow-id}/executions                    # List executions
GET /flows/{flow-id}/executions/{execution-id}     # Get execution details
GET /flows/{flow-id}/executions/stats              # Get execution statistics
POST /flows/{flow-id}/executions/{execution-id}/retry # Retry failed execution
```

**Example - Get Execution History**:
```javascript
const getExecutionHistory = async (accessToken, flowId, options = {}) => {
  const response = await axios.get(
    `https://flow.zoho.com/api/v1/flows/${flowId}/executions`,
    {
      params: {
        status: options.status, // 'success', 'failed', 'running'
        from_date: options.fromDate,
        to_date: options.toDate,
        page: options.page || 1,
        per_page: options.perPage || 50
      },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

**Response**:
```json
{
  "status": "success",
  "data": {
    "executions": [
      {
        "execution_id": "12345000000567890",
        "flow_id": "12345000000123456",
        "status": "success",
        "started_time": "2025-01-22T10:30:15Z",
        "completed_time": "2025-01-22T10:30:18Z",
        "duration_ms": 3250,
        "trigger_data": {
          "First_Name": "John",
          "Last_Name": "Doe",
          "Email": "john.doe@example.com"
        },
        "actions_executed": 3,
        "actions_successful": 3,
        "actions_failed": 0
      },
      {
        "execution_id": "12345000000567891",
        "flow_id": "12345000000123456",
        "status": "failed",
        "started_time": "2025-01-22T09:15:30Z",
        "completed_time": "2025-01-22T09:15:33Z",
        "duration_ms": 3100,
        "error": {
          "code": "ACTION_FAILED",
          "message": "Failed to create contact in Campaigns",
          "action_id": "12345000000234567",
          "details": "Invalid email format"
        }
      }
    ],
    "stats": {
      "total_executions": 1250,
      "successful": 1240,
      "failed": 10,
      "success_rate": 99.2
    }
  }
}
```

**Example - Get Execution Statistics**:
```python
def get_execution_stats(access_token, flow_id, period='last_30_days'):
    url = f'https://flow.zoho.com/api/v1/flows/{flow_id}/executions/stats'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {'period': period}
    response = requests.get(url, headers=headers, params=params)
    return response.json()
```

---

## Authentication

### OAuth 2.0 Flow

Zoho Flow uses OAuth 2.0 for secure API authentication.

**Step 1: Register Your Application**
- Go to [Zoho API Console](https://api-console.zoho.com/)
- Register your application
- Select the following scopes for Flow:
  - `ZohoFlow.flows.ALL`
  - `ZohoFlow.connections.ALL`
  - `ZohoFlow.actions.ALL`
- Note your Client ID and Client Secret

**Step 2: Generate Authorization Code**
```http
GET https://accounts.zoho.com/oauth/v2/auth?
  scope=ZohoFlow.flows.ALL,ZohoFlow.connections.ALL,ZohoFlow.actions.ALL&
  client_id={client_id}&
  response_type=code&
  access_type=offline&
  redirect_uri={redirect_uri}
```

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
  "access_token": "1000.xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "refresh_token": "1000.yyyyyyyyyyyyyyyyyyyyyyyyyyyy",
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

## Rate Limits

### API Call Limits

| Plan | API Calls per Day | API Calls per Minute | Max Flows | Max Executions per Month |
|------|-------------------|----------------------|-----------|--------------------------|
| Free | 1,000 | 10 | 5 | 1,000 |
| Standard | 10,000 | 30 | 25 | 10,000 |
| Professional | 50,000 | 60 | 100 | 50,000 |
| Enterprise | 200,000 | 120 | Unlimited | 200,000 |

### Flow Execution Limits

| Limit Type | Value |
|------------|-------|
| Max actions per flow | 50 |
| Max custom functions per flow | 10 |
| Custom function timeout | 30 seconds |
| Max webhook payload size | 10 MB |
| Max execution time per flow | 5 minutes |
| Max concurrent executions | 10 per flow |

### Rate Limit Headers

```http
X-RateLimit-Limit: 10000
X-RateLimit-Remaining: 9875
X-RateLimit-Reset: 1642147200
```

---

## Error Handling

### Common Error Codes

| HTTP Status | Error Code | Description | Solution |
|-------------|------------|-------------|----------|
| 400 | INVALID_REQUEST | Invalid request parameters | Check request format and required parameters |
| 401 | INVALID_TOKEN | Invalid or expired token | Refresh access token |
| 401 | OAUTH_SCOPE_MISMATCH | Insufficient permissions | Update OAuth scopes |
| 403 | NO_PERMISSION | User lacks flow access | Grant flow permissions |
| 404 | FLOW_NOT_FOUND | Flow ID does not exist | Verify flow ID |
| 404 | CONNECTION_NOT_FOUND | Connection ID does not exist | Verify connection ID |
| 429 | RATE_LIMIT_EXCEEDED | API rate limit exceeded | Implement rate limiting |
| 500 | INTERNAL_ERROR | Server error | Retry with exponential backoff |
| 503 | EXECUTION_FAILED | Flow execution failed | Check execution logs |

### Error Response Format

```json
{
  "status": "failure",
  "error": {
    "code": "FLOW_NOT_FOUND",
    "message": "The specified flow does not exist",
    "details": "Flow ID '12345' not found in your organization"
  }
}
```

### Error Handling Implementation

**JavaScript**:
```javascript
class ZohoFlowClient {
  async makeRequest(method, endpoint, data = null) {
    try {
      const config = {
        method: method,
        url: `https://flow.zoho.com/api/v1/${endpoint}`,
        headers: {
          'Authorization': `Zoho-oauthtoken ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      };

      if (data) {
        config.data = data;
      }

      const response = await axios(config);
      return response.data;

    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;

        switch (status) {
          case 401:
            // Token expired, refresh and retry
            await this.refreshToken();
            return this.makeRequest(method, endpoint, data);

          case 429:
            // Rate limit exceeded, wait and retry
            const retryAfter = error.response.headers['retry-after'] || 60;
            await this.sleep(retryAfter * 1000);
            return this.makeRequest(method, endpoint, data);

          case 500:
          case 503:
            // Server error, retry with exponential backoff
            return await this.retryWithBackoff(() =>
              this.makeRequest(method, endpoint, data)
            );

          default:
            throw new Error(`Flow API Error: ${errorData.error.message}`);
        }
      }
      throw error;
    }
  }

  async retryWithBackoff(fn, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        const delay = Math.pow(2, i) * 1000;
        await this.sleep(delay);
      }
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

**Python**:
```python
import time
import requests
from requests.exceptions import RequestException

class ZohoFlowClient:
    def __init__(self, access_token):
        self.access_token = access_token
        self.base_url = 'https://flow.zoho.com/api/v1'

    def make_request(self, method, endpoint, data=None, max_retries=3):
        url = f'{self.base_url}/{endpoint}'
        headers = {
            'Authorization': f'Zoho-oauthtoken {self.access_token}',
            'Content-Type': 'application/json'
        }

        for attempt in range(max_retries):
            try:
                if method == 'GET':
                    response = requests.get(url, headers=headers)
                elif method == 'POST':
                    response = requests.post(url, json=data, headers=headers)
                elif method == 'PUT':
                    response = requests.put(url, json=data, headers=headers)
                elif method == 'DELETE':
                    response = requests.delete(url, headers=headers)

                if response.status_code == 401:
                    self.refresh_token()
                    continue

                elif response.status_code == 429:
                    retry_after = int(response.headers.get('Retry-After', 60))
                    print(f'Rate limit exceeded. Waiting {retry_after} seconds')
                    time.sleep(retry_after)
                    continue

                elif response.status_code >= 500:
                    if attempt < max_retries - 1:
                        wait_time = (2 ** attempt)
                        print(f'Server error. Retrying in {wait_time} seconds')
                        time.sleep(wait_time)
                        continue

                response.raise_for_status()
                return response.json()

            except RequestException as e:
                if attempt == max_retries - 1:
                    raise Exception(f'API request failed: {str(e)}')
                time.sleep(2 ** attempt)

        raise Exception('Max retries exceeded')
```

---

## Code Examples

### Complete Workflow Examples

#### Example 1: Lead Management Automation

**Scenario**: Automatically process new CRM leads, score them, and route to appropriate team members.

```javascript
const createLeadManagementFlow = async (accessToken) => {
  const flowConfig = {
    flow_name: 'Intelligent Lead Routing',
    description: 'Score and route leads automatically',
    trigger: {
      type: 'webhook',
      app: 'zohocrm',
      module: 'Leads',
      event: 'create'
    },
    actions: [
      // Step 1: Calculate lead score with custom function
      {
        app: 'custom',
        action: 'custom_function',
        config: {
          language: 'javascript',
          code: `
            function calculateLeadScore(lead) {
              let score = 0;

              // Revenue scoring
              if (lead.Annual_Revenue > 1000000) score += 40;
              else if (lead.Annual_Revenue > 100000) score += 25;
              else score += 10;

              // Company size scoring
              if (lead.No_of_Employees > 500) score += 30;
              else if (lead.No_of_Employees > 50) score += 20;
              else score += 10;

              // Source scoring
              if (lead.Lead_Source === 'Referral') score += 20;
              else if (lead.Lead_Source === 'Website') score += 15;
              else score += 5;

              // Industry scoring
              const highValueIndustries = ['Technology', 'Finance', 'Healthcare'];
              if (highValueIndustries.includes(lead.Industry)) score += 10;

              return {
                score: score,
                grade: score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D'
              };
            }

            return calculateLeadScore(trigger);
          `
        }
      },

      // Step 2: Update lead with score
      {
        app: 'zohocrm',
        action: 'update_record',
        config: {
          module: 'Leads',
          record_id: '${trigger.id}',
          fields: {
            Lead_Score: '${customFunction1.score}',
            Lead_Grade: '${customFunction1.grade}'
          }
        }
      },

      // Step 3: Conditional routing based on score
      {
        app: 'custom',
        action: 'condition',
        config: {
          condition: {
            field: '${customFunction1.score}',
            operator: 'greater_than_or_equal',
            value: 80
          },
          if_true: [
            // High-value lead: Assign to senior sales rep
            {
              app: 'zohocrm',
              action: 'update_record',
              config: {
                module: 'Leads',
                record_id: '${trigger.id}',
                fields: {
                  Lead_Owner: 'senior.sales@company.com',
                  Lead_Status: 'Hot Lead',
                  Priority: 'High'
                }
              }
            },
            // Send Slack notification to senior team
            {
              app: 'slack',
              action: 'send_message',
              config: {
                channel: '#senior-sales',
                text: ':fire: High-value lead assigned! \nName: ${trigger.First_Name} ${trigger.Last_Name}\nCompany: ${trigger.Company}\nScore: ${customFunction1.score}'
              }
            }
          ],
          if_false: [
            // Regular lead: Assign via round-robin
            {
              app: 'zohocrm',
              action: 'assign_round_robin',
              config: {
                module: 'Leads',
                record_id: '${trigger.id}',
                team: 'sales_team'
              }
            }
          ]
        }
      },

      // Step 4: Add to marketing campaign
      {
        app: 'zohocampaigns',
        action: 'add_contact',
        config: {
          list_key: 'new_leads_nurture',
          contact_email: '${trigger.Email}',
          first_name: '${trigger.First_Name}',
          last_name: '${trigger.Last_Name}',
          custom_fields: {
            lead_score: '${customFunction1.score}',
            lead_grade: '${customFunction1.grade}',
            company: '${trigger.Company}'
          }
        }
      }
    ]
  };

  const response = await axios.post(
    'https://flow.zoho.com/api/v1/flows',
    flowConfig,
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

#### Example 2: Customer Support Ticket Automation

**Python Implementation**:
```python
def create_support_automation_flow(access_token):
    flow_config = {
        'flow_name': 'Smart Ticket Routing',
        'description': 'Automatically categorize and route support tickets',
        'trigger': {
            'type': 'webhook',
            'app': 'zohodesk',
            'event': 'ticket_created'
        },
        'actions': [
            # Step 1: Analyze ticket with NLP (custom function)
            {
                'app': 'custom',
                'action': 'custom_function',
                'config': {
                    'language': 'javascript',
                    'code': '''
                        async function analyzeTicket(ticket) {
                            const subject = ticket.subject.toLowerCase();
                            const description = ticket.description.toLowerCase();

                            // Keyword-based categorization
                            const categories = {
                                'billing': ['invoice', 'payment', 'charge', 'refund', 'billing'],
                                'technical': ['error', 'bug', 'crash', 'not working', 'broken'],
                                'account': ['login', 'password', 'access', 'account', 'reset'],
                                'feature': ['how to', 'tutorial', 'guide', 'help', 'question']
                            };

                            let category = 'general';
                            let priority = 'medium';

                            for (const [cat, keywords] of Object.entries(categories)) {
                                if (keywords.some(kw => subject.includes(kw) || description.includes(kw))) {
                                    category = cat;
                                    break;
                                }
                            }

                            // Determine priority
                            const urgentKeywords = ['urgent', 'critical', 'down', 'immediately', 'asap'];
                            if (urgentKeywords.some(kw => subject.includes(kw) || description.includes(kw))) {
                                priority = 'high';
                            }

                            return { category, priority };
                        }

                        return analyzeTicket(trigger);
                    '''
                }
            },

            # Step 2: Update ticket category and priority
            {
                'app': 'zohodesk',
                'action': 'update_ticket',
                'config': {
                    'ticket_id': '${trigger.id}',
                    'fields': {
                        'category': '${customFunction1.category}',
                        'priority': '${customFunction1.priority}'
                    }
                }
            },

            # Step 3: Route to appropriate department
            {
                'app': 'custom',
                'action': 'condition',
                'config': {
                    'condition': {
                        'field': '${customFunction1.category}',
                        'operator': 'equals',
                        'value': 'billing'
                    },
                    'if_true': [
                        {
                            'app': 'zohodesk',
                            'action': 'assign_ticket',
                            'config': {
                                'ticket_id': '${trigger.id}',
                                'department': 'billing',
                                'agent_email': 'billing@company.com'
                            }
                        }
                    ],
                    'if_false': [
                        {
                            'app': 'zohodesk',
                            'action': 'assign_ticket',
                            'config': {
                                'ticket_id': '${trigger.id}',
                                'department': '${customFunction1.category}',
                                'auto_assign': True
                            }
                        }
                    ]
                }
            },

            # Step 4: Create CRM task for high-priority tickets
            {
                'app': 'custom',
                'action': 'condition',
                'config': {
                    'condition': {
                        'field': '${customFunction1.priority}',
                        'operator': 'equals',
                        'value': 'high'
                    },
                    'if_true': [
                        {
                            'app': 'zohocrm',
                            'action': 'create_record',
                            'config': {
                                'module': 'Tasks',
                                'fields': {
                                    'Subject': 'URGENT: ${trigger.subject}',
                                    'Status': 'Not Started',
                                    'Priority': 'High',
                                    'Due_Date': '${today}',
                                    'Description': 'Support ticket #${trigger.ticket_number}\n${trigger.description}'
                                }
                            }
                        },
                        # Send urgent notification
                        {
                            'app': 'slack',
                            'action': 'send_message',
                            'config': {
                                'channel': '#support-urgent',
                                'text': ':rotating_light: High priority ticket: #${trigger.ticket_number}\nCategory: ${customFunction1.category}\nCustomer: ${trigger.contact_name}'
                            }
                        }
                    ]
                }
            },

            # Step 5: Send auto-response to customer
            {
                'app': 'zohodesk',
                'action': 'add_comment',
                'config': {
                    'ticket_id': '${trigger.id}',
                    'comment': 'Thank you for contacting us! Your ticket has been received and assigned to our ${customFunction1.category} team. We will respond within 24 hours.',
                    'is_public': True
                }
            }
        ]
    }

    url = 'https://flow.zoho.com/api/v1/flows'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }

    response = requests.post(url, json=flow_config, headers=headers)
    return response.json()
```

#### Example 3: E-commerce Order Fulfillment

**Deluge Implementation**:
```deluge
// Create comprehensive order fulfillment flow
flow_config = Map();

flow_config.put("flow_name", "E-commerce Order Fulfillment");
flow_config.put("description", "Automate order processing from Shopify to fulfillment");

// Configure webhook trigger
trigger_config = Map();
trigger_config.put("type", "webhook");
trigger_config.put("app", "shopify");
trigger_config.put("event", "order_created");
flow_config.put("trigger", trigger_config);

// Configure actions
actions = List();

// Action 1: Validate order details
action1 = Map();
action1.put("app", "custom");
action1.put("action", "custom_function");
function_config1 = Map();
function_config1.put("language", "deluge");
function_config1.put("code", "
    order = trigger;

    // Validate email
    email_valid = order.get('customer').get('email').contains('@');

    // Validate address
    shipping = order.get('shipping_address');
    address_valid = shipping.get('address1') != null && shipping.get('city') != null && shipping.get('zip') != null;

    // Calculate totals
    subtotal = 0;
    line_items = order.get('line_items');
    for each item in line_items {
        subtotal = subtotal + (item.get('price') * item.get('quantity'));
    }

    result = Map();
    result.put('email_valid', email_valid);
    result.put('address_valid', address_valid);
    result.put('subtotal', subtotal);
    result.put('is_valid', email_valid && address_valid);

    return result;
");
action1.put("config", function_config1);
actions.add(action1);

// Action 2: Create invoice in Zoho Books
action2 = Map();
action2.put("app", "zohobooks");
action2.put("action", "create_invoice");
invoice_config = Map();
invoice_config.put("customer_name", "${trigger.customer.first_name} ${trigger.customer.last_name}");
invoice_config.put("email", "${trigger.customer.email}");
invoice_config.put("line_items", "${trigger.line_items}");
invoice_config.put("total", "${trigger.total_price}");
invoice_config.put("order_number", "${trigger.order_number}");
action2.put("config", invoice_config);
actions.add(action2);

// Action 3: Update inventory
action3 = Map();
action3.put("app", "zohoinventory");
action3.put("action", "update_stock");
inventory_config = Map();
inventory_config.put("line_items", "${trigger.line_items}");
inventory_config.put("operation", "decrease");
inventory_config.put("warehouse", "main_warehouse");
action3.put("config", inventory_config);
actions.add(action3);

// Action 4: Create shipment
action4 = Map();
action4.put("app", "shipstation");
action4.put("action", "create_shipment");
shipment_config = Map();
shipment_config.put("order_number", "${trigger.order_number}");
shipment_config.put("shipping_address", "${trigger.shipping_address}");
shipment_config.put("items", "${trigger.line_items}");
shipment_config.put("service_code", "usps_priority_mail");
action4.put("config", shipment_config);
actions.add(action4);

// Action 5: Send confirmation email
action5 = Map();
action5.put("app", "gmail");
action5.put("action", "send_email");
email_config = Map();
email_config.put("to", "${trigger.customer.email}");
email_config.put("subject", "Order Confirmation - #${trigger.order_number}");
email_config.put("body", "Thank you for your order! Your order #${trigger.order_number} has been confirmed and will ship soon. Tracking information will be sent separately.");
action5.put("config", email_config);
actions.add(action5);

// Action 6: Create deal in CRM
action6 = Map();
action6.put("app", "zohocrm");
action6.put("action", "create_record");
crm_config = Map();
crm_config.put("module", "Deals");
deal_fields = Map();
deal_fields.put("Deal_Name", "Order #${trigger.order_number}");
deal_fields.put("Amount", "${trigger.total_price}");
deal_fields.put("Stage", "Closed Won");
deal_fields.put("Closing_Date", "${today}");
crm_config.put("fields", deal_fields);
action6.put("config", crm_config);
actions.add(action6);

// Action 7: Update dashboard
action7 = Map();
action7.put("app", "slack");
action7.put("action", "send_message");
slack_config = Map();
slack_config.put("channel", "#sales");
slack_config.put("text", "New order received! \nOrder #${trigger.order_number}\nCustomer: ${trigger.customer.first_name} ${trigger.customer.last_name}\nTotal: $${trigger.total_price}");
action7.put("config", slack_config);
actions.add(action7);

flow_config.put("actions", actions);

// Create flow
response = invokeurl
[
    url: "https://flow.zoho.com/api/v1/flows"
    type: POST
    parameters: flow_config.toString()
    connection: "zoho_flow_connection"
];

info response;
```

---

## Best Practices

### 1. Flow Design

**Keep Flows Simple and Focused**:
```javascript
// Good - Single purpose flow
const goodFlow = {
  flow_name: 'Lead to Campaign Sync',
  description: 'Sync new leads to marketing campaign',
  trigger: { /* ... */ },
  actions: [
    { /* Add to campaign */ }
  ]
};

// Bad - Multiple unrelated purposes
const badFlow = {
  flow_name: 'Everything Flow',
  description: 'Does everything',
  trigger: { /* ... */ },
  actions: [
    { /* Add to campaign */ },
    { /* Create invoice */ },
    { /* Send SMS */ },
    { /* Update inventory */ },
    // ... 20 more actions
  ]
};
```

**Use Descriptive Names**:
```javascript
// Good
const flowName = 'CRM Lead to Marketing Campaign - Qualified Only';

// Bad
const flowName = 'Flow 1';
```

### 2. Error Handling in Flows

**Implement Error Notifications**:
```javascript
const flowWithErrorHandling = {
  flow_name: 'Order Processing with Error Handling',
  trigger: { /* ... */ },
  actions: [
    {
      app: 'zohobooks',
      action: 'create_invoice',
      config: { /* ... */ },
      on_error: {
        action: 'slack',
        config: {
          channel: '#errors',
          text: 'Failed to create invoice for order ${trigger.order_number}: ${error.message}'
        }
      }
    }
  ]
};
```

### 3. Testing Flows

**Test Before Enabling**:
```javascript
const testFlow = async (accessToken, flowId) => {
  // Test trigger
  const triggerTest = await axios.get(
    `https://flow.zoho.com/api/v1/flows/${flowId}/trigger/test`,
    {
      headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}` }
    }
  );

  console.log('Trigger test:', triggerTest.data);

  // Test each action
  const actionTest = await axios.post(
    `https://flow.zoho.com/api/v1/flows/${flowId}/actions/test`,
    {
      sample_data: triggerTest.data.sample_data
    },
    {
      headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}` }
    }
  );

  console.log('Action test:', actionTest.data);

  // Only enable if tests pass
  if (triggerTest.data.test_result === 'passed' &&
      actionTest.data.test_result === 'passed') {
    await axios.post(
      `https://flow.zoho.com/api/v1/flows/${flowId}/enable`,
      {},
      {
        headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}` }
      }
    );
    console.log('Flow enabled successfully');
  }
};
```

### 4. Monitoring and Maintenance

**Regular Monitoring**:
```python
def monitor_flow_health(access_token, flow_ids):
    """Monitor flow execution health"""
    report = []

    for flow_id in flow_ids:
        # Get execution stats
        stats = get_execution_stats(access_token, flow_id, 'last_7_days')

        success_rate = stats['data']['stats']['success_rate']
        total_executions = stats['data']['stats']['total_executions']

        # Alert if success rate drops below 95%
        if success_rate < 95:
            report.append({
                'flow_id': flow_id,
                'status': 'warning',
                'success_rate': success_rate,
                'total_executions': total_executions,
                'action': 'investigate'
            })
        else:
            report.append({
                'flow_id': flow_id,
                'status': 'healthy',
                'success_rate': success_rate,
                'total_executions': total_executions
            })

    return report
```

### 5. Performance Optimization

**Use Filters to Reduce Executions**:
```javascript
// Good - Filter at trigger level
const optimizedTrigger = {
  type: 'webhook',
  app: 'zohocrm',
  module: 'Leads',
  event: 'create',
  filter: {
    field: 'Lead_Status',
    operator: 'equals',
    value: 'Qualified'
  }
};

// Bad - No filter, processes all records
const unoptimizedTrigger = {
  type: 'webhook',
  app: 'zohocrm',
  module: 'Leads',
  event: 'create'
};
```

**Batch Operations When Possible**:
```javascript
// Good - Batch update
const batchUpdate = {
  app: 'zohocrm',
  action: 'bulk_update',
  config: {
    module: 'Leads',
    records: '${trigger.records}' // Array of records
  }
};

// Bad - Individual updates in loop
// Avoid creating separate flow executions for each record
```

### 6. Security Best Practices

**Protect Sensitive Data**:
```javascript
// Good - Use environment variables
const secureConfig = {
  api_key: '${env.API_KEY}',
  secret: '${env.SECRET_KEY}'
};

// Bad - Hardcoded credentials
const insecureConfig = {
  api_key: 'abc123def456',
  secret: 'supersecret'
};
```

**Validate Webhook Sources**:
```javascript
// Implement webhook validation
const validateWebhook = (req, res, next) => {
  const signature = req.headers['x-zoho-signature'];
  const payload = JSON.stringify(req.body);

  const expectedSignature = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');

  if (signature !== expectedSignature) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  next();
};
```

### 7. Documentation

**Document Your Flows**:
```javascript
const wellDocumentedFlow = {
  flow_name: 'Lead Qualification and Routing',
  description: `
    Automatically qualifies and routes new CRM leads based on:
    - Annual revenue (> $100K)
    - Company size (> 50 employees)
    - Lead source (Referral weighted higher)

    High-scoring leads (>80) are assigned to senior sales team.
    Regular leads are distributed via round-robin.

    Notifications sent to Slack #sales channel.
    All leads added to marketing nurture campaign.
  `,
  trigger: { /* ... */ },
  actions: [ /* ... */ ]
};
```

### 8. Version Control

**Track Flow Changes**:
```javascript
const flowVersion = {
  flow_name: 'Lead Processing v2.1',
  description: 'Updated 2025-01-22: Added priority routing logic',
  metadata: {
    version: '2.1',
    last_updated: '2025-01-22',
    author: 'john.doe@company.com',
    changelog: 'Added high-priority customer identification'
  },
  trigger: { /* ... */ },
  actions: [ /* ... */ ]
};
```

---

## Data Centers

Zoho Flow operates in multiple data centers. Use the appropriate base URL:

| Data Center | Base URL |
|-------------|----------|
| US | https://flow.zoho.com |
| EU | https://flow.zoho.eu |
| IN | https://flow.zoho.in |
| AU | https://flow.zoho.com.au |
| JP | https://flow.zoho.jp |
| CA | https://flow.zoho.ca |

---

## Additional Resources

### Official Documentation
- [Zoho Flow Documentation](https://www.zoho.com/flow/help/)
- [Flow API Reference](https://www.zoho.com/flow/api/)
- [App Directory](https://www.zoho.com/flow/apps/)
- [Flow Templates](https://www.zoho.com/flow/templates/)

### Developer Tools
- [Flow Builder](https://flow.zoho.com/app/flows)
- [API Console](https://api-console.zoho.com/)
- [Connection Manager](https://flow.zoho.com/app/connections)

### Community & Support
- [Developer Forums](https://help.zoho.com/portal/en/community/flow)
- [Help Center](https://help.zoho.com/portal/en/kb/flow)
- [Video Tutorials](https://www.zoho.com/flow/videos/)

### Integration Guides
- [Zoho CRM Integration](https://www.zoho.com/flow/apps/crm/)
- [Slack Integration](https://www.zoho.com/flow/apps/slack/)
- [Gmail Integration](https://www.zoho.com/flow/apps/gmail/)
- [Custom App Integration](https://www.zoho.com/flow/help/custom-apps.html)

---

## Changelog

### v1.0 (Current)
- Complete flow management API
- Support for 1000+ app integrations
- Custom functions with JavaScript
- Webhook triggers and custom webhooks
- Polling and schedule triggers
- Conditional logic and branching
- Error handling and retry mechanisms
- Execution history and monitoring
- Multi-step workflows (up to 50 actions)

---

**Last Updated**: December 2025
**API Version**: v1
**Documentation Version**: 1.0
