# Zoho Marketing Automation API Reference

## Overview

Zoho Marketing Automation (formerly MarketingHub) is a comprehensive marketing automation platform that enables businesses to automate marketing workflows, nurture leads, manage campaigns, and track customer engagement across multiple channels.

**Current API Version**: v1
**Base URL**: `https://www.zohoapis.com/marketing/v1/`
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

### 1. Leads

**Purpose**: Manage marketing leads and their lifecycle

**Endpoints**:
```http
GET    /marketing/v1/leads                       # List all leads
GET    /marketing/v1/leads/{lead_id}             # Get lead details
POST   /marketing/v1/leads                       # Create lead
PUT    /marketing/v1/leads/{lead_id}             # Update lead
DELETE /marketing/v1/leads/{lead_id}             # Delete lead
GET    /marketing/v1/leads/search                # Search leads
POST   /marketing/v1/leads/{lead_id}/score       # Update lead score
GET    /marketing/v1/leads/{lead_id}/activities  # Get lead activities
```

**Standard Fields**:
- Email (required)
- First_Name
- Last_Name
- Company
- Phone
- Mobile
- Lead_Source
- Lead_Status
- Lead_Score
- Industry
- Website
- Country
- State
- City
- Zip_Code
- Tags

**Example - Create Lead**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const createLead = async (accessToken, leadData) => {
  const response = await axios.post(
    'https://www.zohoapis.com/marketing/v1/leads',
    leadData,
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
const lead = {
  Email: 'john.doe@example.com',
  First_Name: 'John',
  Last_Name: 'Doe',
  Company: 'Acme Corporation',
  Phone: '555-0123',
  Lead_Source: 'Website',
  Lead_Status: 'New',
  Lead_Score: 50,
  Industry: 'Technology',
  Website: 'www.acme.com',
  Country: 'USA',
  State: 'California',
  City: 'San Francisco',
  Zip_Code: '94105',
  Tags: ['interested', 'enterprise']
};

const result = await createLead(accessToken, lead);
console.log('Lead created:', result);
```

```python
# Python
import requests

def create_lead(access_token, lead_data):
    url = 'https://www.zohoapis.com/marketing/v1/leads'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    response = requests.post(url, json=lead_data, headers=headers)
    return response.json()

# Usage
lead = {
    'Email': 'john.doe@example.com',
    'First_Name': 'John',
    'Last_Name': 'Doe',
    'Company': 'Acme Corporation',
    'Phone': '555-0123',
    'Lead_Source': 'Website',
    'Lead_Status': 'New',
    'Lead_Score': 50,
    'Industry': 'Technology',
    'Website': 'www.acme.com',
    'Country': 'USA',
    'State': 'California',
    'City': 'San Francisco',
    'Zip_Code': '94105',
    'Tags': ['interested', 'enterprise']
}

result = create_lead(access_token, lead)
print('Lead created:', result)
```

```deluge
// Deluge
lead_data = {
    "Email": "john.doe@example.com",
    "First_Name": "John",
    "Last_Name": "Doe",
    "Company": "Acme Corporation",
    "Phone": "555-0123",
    "Lead_Source": "Website",
    "Lead_Status": "New",
    "Lead_Score": 50,
    "Industry": "Technology",
    "Website": "www.acme.com",
    "Country": "USA",
    "State": "California",
    "City": "San Francisco",
    "Zip_Code": "94105",
    "Tags": ["interested", "enterprise"]
};

response = invokeurl
[
    url: "https://www.zohoapis.com/marketing/v1/leads"
    type: POST
    parameters: lead_data.toString()
    connection: "marketing_automation_connection"
];

info response;
```

**Response**:
```json
{
  "status": "success",
  "code": 201,
  "data": {
    "lead_id": "123456000000234567",
    "email": "john.doe@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "company": "Acme Corporation",
    "lead_score": 50,
    "lead_status": "New",
    "created_time": "2025-01-15T10:30:00Z",
    "modified_time": "2025-01-15T10:30:00Z"
  }
}
```

---

### 2. Contacts

**Purpose**: Manage marketing contacts (qualified leads)

**Endpoints**:
```http
GET    /marketing/v1/contacts                    # List all contacts
GET    /marketing/v1/contacts/{contact_id}       # Get contact details
POST   /marketing/v1/contacts                    # Create contact
PUT    /marketing/v1/contacts/{contact_id}       # Update contact
DELETE /marketing/v1/contacts/{contact_id}       # Delete contact
GET    /marketing/v1/contacts/search             # Search contacts
POST   /marketing/v1/contacts/{contact_id}/tags  # Add tags
POST   /marketing/v1/contacts/subscribe          # Subscribe to list
POST   /marketing/v1/contacts/unsubscribe        # Unsubscribe from list
```

**Example - Subscribe Contact to List**:
```javascript
// JavaScript/Node.js
const subscribeToList = async (accessToken, contactId, listId) => {
  const response = await axios.post(
    'https://www.zohoapis.com/marketing/v1/contacts/subscribe',
    {
      contact_id: contactId,
      list_id: listId,
      subscription_status: 'active'
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
const result = await subscribeToList(accessToken, '123456000000234567', '123456000000345678');
console.log('Subscribed to list:', result);
```

---

### 3. Lists

**Purpose**: Manage email lists and segmentation

**Endpoints**:
```http
GET    /marketing/v1/lists                       # List all lists
GET    /marketing/v1/lists/{list_id}             # Get list details
POST   /marketing/v1/lists                       # Create list
PUT    /marketing/v1/lists/{list_id}             # Update list
DELETE /marketing/v1/lists/{list_id}             # Delete list
GET    /marketing/v1/lists/{list_id}/contacts    # Get list contacts
POST   /marketing/v1/lists/{list_id}/contacts    # Add contacts to list
DELETE /marketing/v1/lists/{list_id}/contacts    # Remove contacts from list
```

**List Types**:
- Static - Manually managed
- Dynamic - Rule-based segmentation
- Imported - From external sources

**Example - Create Dynamic List**:
```javascript
// JavaScript/Node.js
const createDynamicList = async (accessToken, listData) => {
  const response = await axios.post(
    'https://www.zohoapis.com/marketing/v1/lists',
    listData,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

// Usage - Create list for high-scoring leads
const list = {
  name: 'High Value Leads',
  description: 'Leads with score above 70',
  type: 'dynamic',
  criteria: {
    field: 'Lead_Score',
    operator: 'greater_than',
    value: 70
  },
  tags: ['high-priority', 'sales-ready']
};

const result = await createDynamicList(accessToken, list);
console.log('List created:', result);
```

---

### 4. Campaigns

**Purpose**: Manage email marketing campaigns

**Endpoints**:
```http
GET    /marketing/v1/campaigns                   # List all campaigns
GET    /marketing/v1/campaigns/{campaign_id}     # Get campaign details
POST   /marketing/v1/campaigns                   # Create campaign
PUT    /marketing/v1/campaigns/{campaign_id}     # Update campaign
DELETE /marketing/v1/campaigns/{campaign_id}     # Delete campaign
POST   /marketing/v1/campaigns/{campaign_id}/send # Send campaign
POST   /marketing/v1/campaigns/{campaign_id}/schedule # Schedule campaign
GET    /marketing/v1/campaigns/{campaign_id}/stats # Get campaign statistics
```

**Campaign Types**:
- Regular - One-time email blast
- A/B Test - Split testing
- Automated - Triggered campaigns
- RSS - Auto-send from RSS feed

**Example - Create and Send Campaign**:
```javascript
// JavaScript/Node.js
const createCampaign = async (accessToken, campaignData) => {
  const response = await axios.post(
    'https://www.zohoapis.com/marketing/v1/campaigns',
    campaignData,
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
const campaign = {
  name: 'Q1 Product Launch',
  subject: 'Introducing Our Latest Innovation',
  from_name: 'Acme Marketing',
  from_email: 'marketing@acme.com',
  reply_to: 'support@acme.com',
  list_ids: ['123456000000345678', '123456000000345679'],
  content: {
    html: '<html><body><h1>New Product Launch!</h1><p>Check out our latest innovation...</p></body></html>',
    text: 'New Product Launch! Check out our latest innovation...'
  },
  tracking: {
    opens: true,
    clicks: true,
    google_analytics: true,
    utm_parameters: {
      source: 'email',
      medium: 'campaign',
      campaign: 'q1-launch'
    }
  }
};

const result = await createCampaign(accessToken, campaign);
const campaignId = result.data.campaign_id;

// Send immediately
await axios.post(
  `https://www.zohoapis.com/marketing/v1/campaigns/${campaignId}/send`,
  {},
  {
    headers: {
      'Authorization': `Zoho-oauthtoken ${accessToken}`
    }
  }
);
console.log('Campaign sent:', campaignId);
```

```python
# Python - Schedule campaign
def schedule_campaign(access_token, campaign_id, schedule_time):
    url = f'https://www.zohoapis.com/marketing/v1/campaigns/{campaign_id}/schedule'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'schedule_time': schedule_time,  # ISO 8601 format
        'timezone': 'America/New_York'
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()

# Usage
schedule_time = '2025-01-20T09:00:00Z'
result = schedule_campaign(access_token, campaign_id, schedule_time)
print('Campaign scheduled:', result)
```

**Example - Get Campaign Statistics**:
```javascript
// JavaScript/Node.js
const getCampaignStats = async (accessToken, campaignId) => {
  const response = await axios.get(
    `https://www.zohoapis.com/marketing/v1/campaigns/${campaignId}/stats`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};

// Usage
const stats = await getCampaignStats(accessToken, campaignId);
console.log('Campaign Performance:', {
  sent: stats.sent,
  delivered: stats.delivered,
  opens: stats.opens,
  clicks: stats.clicks,
  bounces: stats.bounces,
  unsubscribes: stats.unsubscribes,
  openRate: `${(stats.opens / stats.delivered * 100).toFixed(2)}%`,
  clickRate: `${(stats.clicks / stats.delivered * 100).toFixed(2)}%`
});
```

---

### 5. Journeys (Marketing Workflows)

**Purpose**: Create automated marketing workflows

**Endpoints**:
```http
GET    /marketing/v1/journeys                    # List all journeys
GET    /marketing/v1/journeys/{journey_id}       # Get journey details
POST   /marketing/v1/journeys                    # Create journey
PUT    /marketing/v1/journeys/{journey_id}       # Update journey
DELETE /marketing/v1/journeys/{journey_id}       # Delete journey
POST   /marketing/v1/journeys/{journey_id}/activate # Activate journey
POST   /marketing/v1/journeys/{journey_id}/deactivate # Deactivate journey
GET    /marketing/v1/journeys/{journey_id}/stats # Get journey statistics
```

**Journey Components**:
- Triggers - Entry points (form submit, tag added, score change)
- Actions - Send email, wait, add tag, update field
- Conditions - Decision branches based on criteria
- Goals - Success metrics

**Example - Create Welcome Email Journey**:
```javascript
// JavaScript/Node.js
const createJourney = async (accessToken, journeyData) => {
  const response = await axios.post(
    'https://www.zohoapis.com/marketing/v1/journeys',
    journeyData,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

// Usage - Welcome email series
const journey = {
  name: 'Welcome Email Series',
  description: 'Onboard new leads with 3-email sequence',
  trigger: {
    type: 'tag_added',
    tag: 'new_signup'
  },
  steps: [
    {
      type: 'send_email',
      template_id: '123456000000567890',
      subject: 'Welcome to Acme!',
      delay: 0  // Send immediately
    },
    {
      type: 'wait',
      duration: 2,
      unit: 'days'
    },
    {
      type: 'condition',
      criteria: {
        field: 'email_opened',
        operator: 'equals',
        value: true
      },
      if_true: [
        {
          type: 'send_email',
          template_id: '123456000000567891',
          subject: 'Getting Started Guide'
        }
      ],
      if_false: [
        {
          type: 'send_email',
          template_id: '123456000000567892',
          subject: 'Did you miss our welcome email?'
        }
      ]
    },
    {
      type: 'wait',
      duration: 3,
      unit: 'days'
    },
    {
      type: 'send_email',
      template_id: '123456000000567893',
      subject: 'Success Stories from Our Customers'
    },
    {
      type: 'add_tag',
      tag: 'onboarded'
    }
  ],
  goal: {
    type: 'tag_added',
    tag: 'converted',
    success_metric: 'conversion_rate'
  }
};

const result = await createJourney(accessToken, journey);
console.log('Journey created:', result);

// Activate the journey
await axios.post(
  `https://www.zohoapis.com/marketing/v1/journeys/${result.data.journey_id}/activate`,
  {},
  {
    headers: {
      'Authorization': `Zoho-oauthtoken ${accessToken}`
    }
  }
);
console.log('Journey activated');
```

---

### 6. Lead Scoring

**Purpose**: Manage lead scoring rules and criteria

**Endpoints**:
```http
GET    /marketing/v1/scoring/rules               # List scoring rules
GET    /marketing/v1/scoring/rules/{rule_id}     # Get rule details
POST   /marketing/v1/scoring/rules               # Create scoring rule
PUT    /marketing/v1/scoring/rules/{rule_id}     # Update scoring rule
DELETE /marketing/v1/scoring/rules/{rule_id}     # Delete scoring rule
POST   /marketing/v1/leads/{lead_id}/score       # Update lead score manually
GET    /marketing/v1/leads/top-scored            # Get top-scoring leads
```

**Scoring Rule Types**:
- Demographic - Based on profile data
- Behavioral - Based on activities
- Engagement - Based on email/web interactions
- Negative - Deduct points

**Example - Create Scoring Rules**:
```javascript
// JavaScript/Node.js
const createScoringRule = async (accessToken, ruleData) => {
  const response = await axios.post(
    'https://www.zohoapis.com/marketing/v1/scoring/rules',
    ruleData,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

// Usage - Multiple scoring rules
const rules = [
  {
    name: 'Email Opened',
    type: 'behavioral',
    event: 'email_opened',
    points: 5,
    frequency: 'per_occurrence'
  },
  {
    name: 'Link Clicked',
    type: 'behavioral',
    event: 'link_clicked',
    points: 10,
    frequency: 'per_occurrence'
  },
  {
    name: 'Form Submitted',
    type: 'behavioral',
    event: 'form_submitted',
    points: 25,
    frequency: 'once'
  },
  {
    name: 'Enterprise Company',
    type: 'demographic',
    criteria: {
      field: 'Company_Size',
      operator: 'greater_than',
      value: 500
    },
    points: 20,
    frequency: 'once'
  },
  {
    name: 'Unsubscribed',
    type: 'negative',
    event: 'unsubscribed',
    points: -50,
    frequency: 'once'
  }
];

for (const rule of rules) {
  await createScoringRule(accessToken, rule);
  console.log(`Created rule: ${rule.name}`);
}
```

```python
# Python - Get top-scoring leads
def get_top_scored_leads(access_token, limit=50, min_score=70):
    url = 'https://www.zohoapis.com/marketing/v1/leads/top-scored'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'limit': limit,
        'min_score': min_score,
        'sort_order': 'desc'
    }
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Usage
top_leads = get_top_scored_leads(access_token, limit=100, min_score=80)
print(f'Found {len(top_leads["data"])} high-scoring leads')

for lead in top_leads['data']:
    print(f"{lead['email']}: {lead['lead_score']} points")
```

---

### 7. Forms

**Purpose**: Manage web forms and landing pages

**Endpoints**:
```http
GET    /marketing/v1/forms                       # List all forms
GET    /marketing/v1/forms/{form_id}             # Get form details
POST   /marketing/v1/forms                       # Create form
PUT    /marketing/v1/forms/{form_id}             # Update form
DELETE /marketing/v1/forms/{form_id}             # Delete form
GET    /marketing/v1/forms/{form_id}/submissions # Get form submissions
POST   /marketing/v1/forms/{form_id}/submit      # Submit form data
```

**Form Types**:
- Lead Capture
- Survey
- Registration
- Contact
- Newsletter Signup

**Example - Create Form**:
```javascript
// JavaScript/Node.js
const createForm = async (accessToken, formData) => {
  const response = await axios.post(
    'https://www.zohoapis.com/marketing/v1/forms',
    formData,
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
const form = {
  name: 'Product Demo Request',
  type: 'lead_capture',
  fields: [
    {
      name: 'First_Name',
      label: 'First Name',
      type: 'text',
      required: true
    },
    {
      name: 'Last_Name',
      label: 'Last Name',
      type: 'text',
      required: true
    },
    {
      name: 'Email',
      label: 'Email Address',
      type: 'email',
      required: true
    },
    {
      name: 'Company',
      label: 'Company Name',
      type: 'text',
      required: true
    },
    {
      name: 'Phone',
      label: 'Phone Number',
      type: 'phone',
      required: false
    },
    {
      name: 'Interested_In',
      label: 'Interested In',
      type: 'select',
      options: ['Product A', 'Product B', 'Product C'],
      required: true
    }
  ],
  settings: {
    redirect_url: 'https://example.com/thank-you',
    notification_emails: ['sales@example.com'],
    auto_response: true,
    auto_response_template: '123456000000567890'
  },
  actions: [
    {
      type: 'add_to_list',
      list_id: '123456000000345678'
    },
    {
      type: 'add_tag',
      tag: 'demo_request'
    },
    {
      type: 'trigger_journey',
      journey_id: '123456000000678901'
    }
  ]
};

const result = await createForm(accessToken, form);
console.log('Form created:', result);
console.log('Embed code:', result.data.embed_code);
```

**Example - Submit Form Data (API submission)**:
```javascript
// JavaScript/Node.js - Submit form programmatically
const submitForm = async (formId, formData) => {
  const response = await axios.post(
    `https://www.zohoapis.com/marketing/v1/forms/${formId}/submit`,
    formData,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

// Usage
const submission = {
  First_Name: 'Jane',
  Last_Name: 'Smith',
  Email: 'jane@example.com',
  Company: 'Tech Corp',
  Phone: '555-9876',
  Interested_In: 'Product A'
};

const result = await submitForm('123456000000789012', submission);
console.log('Form submitted:', result);
```

---

### 8. Templates

**Purpose**: Manage email templates

**Endpoints**:
```http
GET    /marketing/v1/templates                   # List all templates
GET    /marketing/v1/templates/{template_id}     # Get template details
POST   /marketing/v1/templates                   # Create template
PUT    /marketing/v1/templates/{template_id}     # Update template
DELETE /marketing/v1/templates/{template_id}     # Delete template
POST   /marketing/v1/templates/{template_id}/clone # Clone template
```

**Template Types**:
- Basic
- Drag-and-Drop
- HTML
- Plain Text

**Example - Create Email Template**:
```javascript
// JavaScript/Node.js
const createTemplate = async (accessToken, templateData) => {
  const response = await axios.post(
    'https://www.zohoapis.com/marketing/v1/templates',
    templateData,
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
const template = {
  name: 'Monthly Newsletter',
  type: 'html',
  subject: 'Your Monthly Update from {Company_Name}',
  html_content: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; }
        .header { background-color: #0066cc; color: white; padding: 20px; }
        .content { padding: 20px; }
        .footer { background-color: #f5f5f5; padding: 10px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Monthly Newsletter</h1>
      </div>
      <div class="content">
        <p>Hi {First_Name},</p>
        <p>Here's what's new this month...</p>
        {Content_Block}
      </div>
      <div class="footer">
        <p><a href="{Unsubscribe_Link}">Unsubscribe</a></p>
      </div>
    </body>
    </html>
  `,
  text_content: 'Hi {First_Name}, Here\'s what\'s new this month...',
  category: 'Newsletter',
  tags: ['monthly', 'newsletter']
};

const result = await createTemplate(accessToken, template);
console.log('Template created:', result);
```

---

### 9. Webhooks

**Purpose**: Receive real-time notifications for events

**Endpoints**:
```http
GET    /marketing/v1/webhooks                    # List all webhooks
GET    /marketing/v1/webhooks/{webhook_id}       # Get webhook details
POST   /marketing/v1/webhooks                    # Create webhook
PUT    /marketing/v1/webhooks/{webhook_id}       # Update webhook
DELETE /marketing/v1/webhooks/{webhook_id}       # Delete webhook
```

**Event Types**:
- lead.created
- lead.updated
- lead.score_changed
- contact.subscribed
- contact.unsubscribed
- campaign.sent
- email.opened
- email.clicked
- email.bounced
- form.submitted
- journey.completed

**Example - Create Webhook**:
```javascript
// JavaScript/Node.js
const createWebhook = async (accessToken, webhookData) => {
  const response = await axios.post(
    'https://www.zohoapis.com/marketing/v1/webhooks',
    webhookData,
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
const webhook = {
  name: 'Lead Score Change Notification',
  url: 'https://myapp.example.com/webhooks/marketing-automation',
  events: [
    'lead.score_changed',
    'lead.created',
    'form.submitted'
  ],
  active: true,
  secret: 'my_webhook_secret_key_123'
};

const result = await createWebhook(accessToken, webhook);
console.log('Webhook created:', result);
```

**Webhook Payload Example**:
```json
{
  "event": "lead.score_changed",
  "timestamp": "2025-01-15T10:30:00Z",
  "data": {
    "lead_id": "123456000000234567",
    "email": "john@example.com",
    "old_score": 50,
    "new_score": 75,
    "score_change": 25,
    "trigger": "email_opened"
  }
}
```

---

### 10. Analytics & Reports

**Purpose**: Track marketing performance metrics

**Endpoints**:
```http
GET    /marketing/v1/analytics/overview          # Get overview metrics
GET    /marketing/v1/analytics/campaigns         # Campaign performance
GET    /marketing/v1/analytics/leads             # Lead analytics
GET    /marketing/v1/analytics/engagement        # Engagement metrics
GET    /marketing/v1/analytics/conversions       # Conversion tracking
GET    /marketing/v1/analytics/roi               # ROI calculations
```

**Example - Get Analytics**:
```javascript
// JavaScript/Node.js
const getAnalytics = async (accessToken, dateRange) => {
  const response = await axios.get(
    'https://www.zohoapis.com/marketing/v1/analytics/overview',
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      },
      params: {
        start_date: dateRange.start,
        end_date: dateRange.end
      }
    }
  );
  return response.data;
};

// Usage
const analytics = await getAnalytics(accessToken, {
  start: '2025-01-01',
  end: '2025-01-31'
});

console.log('Marketing Performance:', {
  totalLeads: analytics.total_leads,
  newLeads: analytics.new_leads,
  emailsSent: analytics.emails_sent,
  openRate: `${analytics.open_rate}%`,
  clickRate: `${analytics.click_rate}%`,
  conversions: analytics.conversions,
  conversionRate: `${analytics.conversion_rate}%`,
  revenue: `$${analytics.revenue}`
});
```

```python
# Python - Get campaign performance
def get_campaign_performance(access_token, start_date, end_date):
    url = 'https://www.zohoapis.com/marketing/v1/analytics/campaigns'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'start_date': start_date,
        'end_date': end_date,
        'sort_by': 'conversion_rate',
        'order': 'desc'
    }
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Usage
performance = get_campaign_performance(access_token, '2025-01-01', '2025-01-31')

for campaign in performance['data']:
    print(f"""
    Campaign: {campaign['name']}
    Sent: {campaign['sent']}
    Opens: {campaign['opens']} ({campaign['open_rate']}%)
    Clicks: {campaign['clicks']} ({campaign['click_rate']}%)
    Conversions: {campaign['conversions']} ({campaign['conversion_rate']}%)
    """)
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
  scope=ZohoMarketingAutomation.lead.ALL,ZohoMarketingAutomation.campaign.ALL&
  client_id={client_id}&
  response_type=code&
  access_type=offline&
  redirect_uri={redirect_uri}
```

**Available Scopes**:
- `ZohoMarketingAutomation.lead.ALL` - Full access to leads
- `ZohoMarketingAutomation.lead.READ` - Read-only access to leads
- `ZohoMarketingAutomation.contact.ALL` - Full access to contacts
- `ZohoMarketingAutomation.campaign.ALL` - Full access to campaigns
- `ZohoMarketingAutomation.journey.ALL` - Full access to journeys
- `ZohoMarketingAutomation.list.ALL` - Full access to lists
- `ZohoMarketingAutomation.form.ALL` - Full access to forms
- `ZohoMarketingAutomation.analytics.READ` - Read analytics data

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

## Rate Limits

### API Call Limits

| Plan | API Calls per Day | API Calls per Minute |
|------|-------------------|----------------------|
| Starter | 5,000 | 10 |
| Professional | 25,000 | 50 |
| Enterprise | 100,000 | 100 |

### Email Sending Limits

| Plan | Emails per Month | Contacts |
|------|------------------|----------|
| Starter | 10,000 | 1,000 |
| Professional | 100,000 | 10,000 |
| Enterprise | Custom | Custom |

### Rate Limit Headers

```http
X-RateLimit-Limit: 25000
X-RateLimit-Remaining: 24750
X-RateLimit-Reset: 1673827200
```

---

## Data Centers

Zoho Marketing Automation operates in multiple data centers. Use the appropriate base URL:

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
| 400 | Bad Request | Invalid parameters or request format |
| 401 | Unauthorized | Invalid or expired access token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource does not exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |

### Marketing Automation Error Codes

| Code | Message | Description | Solution |
|------|---------|-------------|----------|
| INVALID_EMAIL | Invalid email address | Email format is invalid | Validate email format |
| DUPLICATE_LEAD | Lead already exists | Lead with email exists | Update existing lead |
| LIST_NOT_FOUND | List does not exist | Invalid list ID | Verify list ID |
| CAMPAIGN_ALREADY_SENT | Campaign already sent | Cannot modify sent campaign | Clone and edit |
| JOURNEY_ACTIVE | Journey is active | Cannot edit active journey | Deactivate first |
| INVALID_TEMPLATE | Template not found | Invalid template ID | Verify template ID |
| SCORING_RULE_EXISTS | Rule already exists | Duplicate scoring rule | Update existing rule |
| WEBHOOK_VERIFICATION_FAILED | Webhook verification failed | Invalid secret | Check webhook secret |

---

## Best Practices

### 1. Lead Management

**Deduplication**:
```javascript
const createOrUpdateLead = async (client, leadData) => {
  // Check if lead exists
  const existing = await client.get('/leads/search', {
    email: leadData.Email
  });

  if (existing.data && existing.data.length > 0) {
    // Update existing lead
    const leadId = existing.data[0].lead_id;
    return await client.put(`/leads/${leadId}`, leadData);
  } else {
    // Create new lead
    return await client.post('/leads', leadData);
  }
};
```

### 2. Campaign Best Practices

**A/B Testing**:
```javascript
const createABTest = async (client, testData) => {
  const campaign = {
    name: testData.name,
    type: 'ab_test',
    list_ids: testData.list_ids,
    variants: [
      {
        name: 'Variant A',
        subject: testData.subjectA,
        content: testData.contentA,
        percentage: 50
      },
      {
        name: 'Variant B',
        subject: testData.subjectB,
        content: testData.contentB,
        percentage: 50
      }
    ],
    winning_criteria: 'open_rate',
    test_duration: 4,  // hours
    send_winner_after: true
  };

  return await client.post('/campaigns', campaign);
};
```

### 3. Journey Optimization

**Monitor Journey Performance**:
```javascript
const optimizeJourney = async (client, journeyId) => {
  const stats = await client.get(`/journeys/${journeyId}/stats`);

  console.log('Journey Performance:', {
    entered: stats.entered,
    active: stats.active,
    completed: stats.completed,
    goalAchieved: stats.goal_achieved,
    conversionRate: `${(stats.goal_achieved / stats.entered * 100).toFixed(2)}%`
  });

  // Identify bottlenecks
  for (const step of stats.steps) {
    if (step.drop_off_rate > 30) {
      console.log(`High drop-off at step: ${step.name} (${step.drop_off_rate}%)`);
    }
  }
};
```

---

## Code Examples

### Complete Marketing Automation Workflow

```javascript
// JavaScript/Node.js - Complete marketing workflow
class MarketingAutomation {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseURL = 'https://www.zohoapis.com/marketing/v1';
  }

  async captureWebsiteLead(formData) {
    // 1. Create lead
    const lead = await this.createLead({
      Email: formData.email,
      First_Name: formData.firstName,
      Last_Name: formData.lastName,
      Company: formData.company,
      Lead_Source: 'Website',
      Lead_Status: 'New'
    });

    const leadId = lead.data.lead_id;

    // 2. Add to nurture list
    await this.subscribeToList(leadId, 'nurture_list_id');

    // 3. Add tags
    await this.addTags(leadId, ['website', 'new_signup']);

    // 4. Trigger welcome journey
    await this.triggerJourney(leadId, 'welcome_journey_id');

    // 5. Score the lead
    await this.updateLeadScore(leadId, 10, 'Form submission');

    return leadId;
  }

  async handleEmailEngagement(event) {
    const { lead_id, event_type, campaign_id } = event;

    switch (event_type) {
      case 'opened':
        await this.updateLeadScore(lead_id, 5, 'Email opened');
        break;

      case 'clicked':
        await this.updateLeadScore(lead_id, 10, 'Link clicked');
        await this.addTags(lead_id, ['engaged']);
        break;

      case 'unsubscribed':
        await this.updateLeadScore(lead_id, -50, 'Unsubscribed');
        await this.updateLeadStatus(lead_id, 'Unsubscribed');
        break;
    }
  }

  async qualifyLead(leadId) {
    const lead = await this.getLead(leadId);

    // Check qualification criteria
    if (lead.lead_score >= 70 && lead.company && lead.phone) {
      // Convert to contact
      await this.convertToContact(leadId);

      // Add to sales-ready list
      await this.subscribeToList(leadId, 'sales_ready_list_id');

      // Notify sales team
      await this.sendNotification({
        type: 'slack',
        channel: '#sales',
        message: `New qualified lead: ${lead.first_name} ${lead.last_name} (${lead.email}) - Score: ${lead.lead_score}`
      });

      // Update in CRM
      await this.syncToCRM(lead);
    }
  }

  async runDripCampaign(listId, campaignName) {
    // Create email series
    const emails = [
      {
        day: 0,
        subject: 'Welcome to Our Community',
        template_id: 'welcome_template_id'
      },
      {
        day: 3,
        subject: 'Getting Started Guide',
        template_id: 'guide_template_id'
      },
      {
        day: 7,
        subject: 'Success Stories',
        template_id: 'stories_template_id'
      },
      {
        day: 14,
        subject: 'Special Offer Just for You',
        template_id: 'offer_template_id'
      }
    ];

    // Create journey
    const steps = [];
    for (const email of emails) {
      if (email.day > 0) {
        steps.push({
          type: 'wait',
          duration: email.day,
          unit: 'days'
        });
      }

      steps.push({
        type: 'send_email',
        subject: email.subject,
        template_id: email.template_id
      });
    }

    const journey = await this.createJourney({
      name: campaignName,
      trigger: {
        type: 'list_subscription',
        list_id: listId
      },
      steps: steps
    });

    await this.activateJourney(journey.data.journey_id);

    return journey;
  }

  // Helper methods
  async createLead(data) {
    return await this.post('/leads', data);
  }

  async getLead(leadId) {
    const response = await this.get(`/leads/${leadId}`);
    return response.data;
  }

  async updateLeadScore(leadId, points, reason) {
    return await this.post(`/leads/${leadId}/score`, {
      points: points,
      reason: reason
    });
  }

  async addTags(leadId, tags) {
    return await this.post(`/leads/${leadId}/tags`, {
      tags: tags
    });
  }

  async subscribeToList(leadId, listId) {
    return await this.post('/contacts/subscribe', {
      lead_id: leadId,
      list_id: listId
    });
  }

  async triggerJourney(leadId, journeyId) {
    return await this.post(`/journeys/${journeyId}/trigger`, {
      lead_id: leadId
    });
  }

  async createJourney(data) {
    return await this.post('/journeys', data);
  }

  async activateJourney(journeyId) {
    return await this.post(`/journeys/${journeyId}/activate`, {});
  }

  // HTTP methods
  async get(endpoint, params = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Zoho-oauthtoken ${this.accessToken}`
      },
      params
    });
    return response.data;
  }

  async post(endpoint, data) {
    const url = `${this.baseURL}${endpoint}`;
    const response = await axios.post(url, data, {
      headers: {
        'Authorization': `Zoho-oauthtoken ${this.accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }
}

// Usage
const marketing = new MarketingAutomation(accessToken);

// Capture new lead from website
const leadId = await marketing.captureWebsiteLead({
  email: 'prospect@example.com',
  firstName: 'Jane',
  lastName: 'Doe',
  company: 'Example Corp'
});

console.log('Lead captured and journey triggered:', leadId);
```

---

## Additional Resources

- [Official Marketing Automation Documentation](https://www.zoho.com/marketingautomation/api/)
- [Zoho API Console](https://api-console.zoho.com/)
- [Marketing Automation Help](https://help.zoho.com/portal/en/kb/marketingautomation)
- [Developer Forums](https://help.zoho.com/portal/en/community/marketingautomation)

---

**Last Updated**: December 2025
**API Version**: v1
