# Zoho Forms API Reference

## Overview

Zoho Forms is a powerful online form builder that enables you to create custom forms, collect responses, and integrate with various applications. The Forms API provides programmatic access to form creation, submission management, integrations, webhooks, and analytics.

**Current API Version**: v1
**Base URL**: `https://www.zohoapis.com/forms/api/v1/`
**Protocol**: REST
**Data Format**: JSON
**Authentication**: OAuth 2.0

---

## Quick Links

- [Authentication](#authentication)
- [Forms API](#forms-api)
- [Form Builder](#form-builder)
- [Submissions API](#submissions-api)
- [Webhooks](#webhooks)
- [Integrations](#integrations)
- [Analytics](#analytics)
- [Rate Limits](#rate-limits)
- [Error Codes](#error-codes)
- [Code Examples](#code-examples)

---

## Authentication

### OAuth 2.0 Setup

**Step 1: Register Your Application**
1. Go to [Zoho API Console](https://api-console.zoho.com/)
2. Create a new client
3. Note your `Client ID` and `Client Secret`
4. Set redirect URI

**Step 2: Authorization Code Flow**

```http
GET https://accounts.zoho.com/oauth/v2/auth?
  response_type=code&
  client_id={client_id}&
  scope=ZohoForms.forms.ALL,ZohoForms.responses.ALL&
  redirect_uri={redirect_uri}&
  access_type=offline
```

**Step 3: Exchange Code for Token**

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
  "access_token": "1000.xxx.xxx",
  "refresh_token": "1000.yyy.yyy",
  "api_domain": "https://www.zohoapis.com",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

**Available Scopes**:
- `ZohoForms.forms.ALL` - Full form management access
- `ZohoForms.forms.READ` - Read-only form access
- `ZohoForms.forms.CREATE` - Create forms
- `ZohoForms.forms.UPDATE` - Update forms
- `ZohoForms.forms.DELETE` - Delete forms
- `ZohoForms.responses.ALL` - Full response access
- `ZohoForms.responses.READ` - Read responses
- `ZohoForms.responses.CREATE` - Submit responses
- `ZohoForms.responses.UPDATE` - Update responses
- `ZohoForms.webhooks.ALL` - Webhook management
- `ZohoForms.integrations.ALL` - Integration management

---

## Forms API

### List Forms

Retrieve all forms from your Zoho Forms account.

**Endpoint**: `GET /forms`

**Query Parameters**:
- `page` (integer): Page number (default: 1)
- `per_page` (integer): Results per page, max 200 (default: 50)
- `sort_by` (string): Sort field - `name`, `created_time`, `modified_time`, `response_count`
- `sort_order` (string): `asc` or `desc`
- `status` (string): Filter by status - `active`, `inactive`, `archived`
- `search` (string): Search by name

**Request**:
```http
GET https://www.zohoapis.com/forms/api/v1/forms?page=1&per_page=50
Authorization: Zoho-oauthtoken {access_token}
```

**Response**:
```json
{
  "data": [
    {
      "form_id": "form_abc123xyz789",
      "form_name": "Contact Us",
      "form_link": "https://forms.zoho.com/myaccount/form/ContactUs",
      "created_time": "2025-01-15T10:30:00Z",
      "modified_time": "2025-01-16T14:20:00Z",
      "status": "active",
      "response_count": 245,
      "field_count": 8,
      "is_public": true,
      "owner": {
        "user_id": "12345",
        "email": "user@example.com",
        "name": "John Doe"
      },
      "thumbnail_url": "https://forms.zoho.com/thumbnails/form_abc123xyz789.png"
    }
  ],
  "info": {
    "page": 1,
    "per_page": 50,
    "count": 25,
    "total_count": 125,
    "more_records": true
  }
}
```

### Get Form

Retrieve details of a specific form.

**Endpoint**: `GET /forms/{form_id}`

**Request**:
```http
GET https://www.zohoapis.com/forms/api/v1/forms/form_abc123xyz789
Authorization: Zoho-oauthtoken {access_token}
```

**Response**:
```json
{
  "data": {
    "form_id": "form_abc123xyz789",
    "form_name": "Contact Us",
    "form_link": "https://forms.zoho.com/myaccount/form/ContactUs",
    "created_time": "2025-01-15T10:30:00Z",
    "modified_time": "2025-01-16T14:20:00Z",
    "status": "active",
    "response_count": 245,
    "fields": [
      {
        "field_id": "field_001",
        "field_name": "Name",
        "field_type": "text",
        "required": true,
        "max_length": 100
      },
      {
        "field_id": "field_002",
        "field_name": "Email",
        "field_type": "email",
        "required": true
      },
      {
        "field_id": "field_003",
        "field_name": "Phone",
        "field_type": "phone",
        "required": false
      },
      {
        "field_id": "field_004",
        "field_name": "Message",
        "field_type": "textarea",
        "required": true,
        "max_length": 1000
      }
    ],
    "settings": {
      "allow_multiple_submissions": false,
      "show_confirmation_message": true,
      "confirmation_message": "Thank you for contacting us!",
      "redirect_url": null,
      "enable_captcha": true,
      "email_notifications": true,
      "notification_emails": ["admin@example.com"]
    },
    "theme": {
      "primary_color": "#4CAF50",
      "button_color": "#2196F3",
      "background_color": "#FFFFFF"
    }
  }
}
```

### Create Form

Create a new form programmatically.

**Endpoint**: `POST /forms`

**Request Body**:
```json
{
  "form_name": "Event Registration",
  "description": "Register for our upcoming event",
  "fields": [
    {
      "field_name": "Full Name",
      "field_type": "text",
      "required": true,
      "max_length": 100,
      "placeholder": "Enter your full name"
    },
    {
      "field_name": "Email Address",
      "field_type": "email",
      "required": true,
      "placeholder": "you@example.com"
    },
    {
      "field_name": "Phone Number",
      "field_type": "phone",
      "required": false,
      "country_code": "US"
    },
    {
      "field_name": "Number of Attendees",
      "field_type": "number",
      "required": true,
      "min_value": 1,
      "max_value": 10
    },
    {
      "field_name": "Session Preference",
      "field_type": "dropdown",
      "required": true,
      "options": [
        "Morning Session",
        "Afternoon Session",
        "Evening Session"
      ]
    },
    {
      "field_name": "Dietary Restrictions",
      "field_type": "checkbox",
      "required": false,
      "options": [
        "Vegetarian",
        "Vegan",
        "Gluten-Free",
        "None"
      ]
    },
    {
      "field_name": "Additional Comments",
      "field_type": "textarea",
      "required": false,
      "max_length": 500
    }
  ],
  "settings": {
    "allow_multiple_submissions": false,
    "show_confirmation_message": true,
    "confirmation_message": "Thank you for registering!",
    "enable_captcha": true,
    "email_notifications": true,
    "notification_emails": ["events@example.com"]
  }
}
```

**Response**:
```json
{
  "data": {
    "form_id": "form_def456uvw123",
    "form_name": "Event Registration",
    "form_link": "https://forms.zoho.com/myaccount/form/EventRegistration",
    "created_time": "2025-01-17T09:15:00Z",
    "status": "active"
  },
  "message": "Form created successfully"
}
```

### Update Form

Update form metadata and settings.

**Endpoint**: `PUT /forms/{form_id}`

**Request Body**:
```json
{
  "form_name": "Event Registration 2025",
  "settings": {
    "enable_captcha": false,
    "redirect_url": "https://example.com/thank-you"
  }
}
```

**Response**:
```json
{
  "data": {
    "form_id": "form_abc123xyz789",
    "modified_time": "2025-01-17T10:30:00Z"
  },
  "message": "Form updated successfully"
}
```

### Delete Form

Move form to trash or permanently delete.

**Endpoint**: `DELETE /forms/{form_id}`

**Query Parameters**:
- `permanent` (boolean): Permanently delete (default: false)

**Request**:
```http
DELETE https://www.zohoapis.com/forms/api/v1/forms/form_abc123xyz789
Authorization: Zoho-oauthtoken {access_token}
```

**Response**:
```json
{
  "message": "Form moved to trash successfully"
}
```

### Duplicate Form

Create a copy of an existing form.

**Endpoint**: `POST /forms/{form_id}/duplicate`

**Request Body**:
```json
{
  "form_name": "Event Registration - Copy"
}
```

**Response**:
```json
{
  "data": {
    "form_id": "form_ghi789rst456",
    "form_name": "Event Registration - Copy",
    "form_link": "https://forms.zoho.com/myaccount/form/EventRegistrationCopy"
  }
}
```

### Get Form Embed Code

Get HTML embed code for form.

**Endpoint**: `GET /forms/{form_id}/embed`

**Query Parameters**:
- `type` (string): Embed type - `iframe`, `inline`, `popup`
- `width` (integer): Width in pixels (default: 600)
- `height` (integer): Height in pixels (default: 500)

**Response**:
```json
{
  "data": {
    "embed_code": "<iframe src='https://forms.zoho.com/myaccount/form/ContactUs' width='600' height='500' frameborder='0'></iframe>",
    "share_url": "https://forms.zoho.com/myaccount/form/ContactUs"
  }
}
```

---

## Form Builder

### Field Types

**Text Input**:
```json
{
  "field_name": "First Name",
  "field_type": "text",
  "required": true,
  "max_length": 50,
  "placeholder": "Enter first name",
  "default_value": ""
}
```

**Email**:
```json
{
  "field_name": "Email",
  "field_type": "email",
  "required": true,
  "validation": "strict",
  "placeholder": "you@example.com"
}
```

**Phone**:
```json
{
  "field_name": "Phone",
  "field_type": "phone",
  "required": false,
  "country_code": "US",
  "format": "(###) ###-####"
}
```

**Number**:
```json
{
  "field_name": "Age",
  "field_type": "number",
  "required": true,
  "min_value": 18,
  "max_value": 100,
  "decimal_places": 0
}
```

**Date**:
```json
{
  "field_name": "Birth Date",
  "field_type": "date",
  "required": true,
  "date_format": "MM/DD/YYYY",
  "min_date": "1920-01-01",
  "max_date": "2025-01-01"
}
```

**Dropdown**:
```json
{
  "field_name": "Country",
  "field_type": "dropdown",
  "required": true,
  "options": ["USA", "Canada", "UK", "Australia"],
  "allow_other": true
}
```

**Radio Button**:
```json
{
  "field_name": "Gender",
  "field_type": "radio",
  "required": true,
  "options": ["Male", "Female", "Other", "Prefer not to say"]
}
```

**Checkbox**:
```json
{
  "field_name": "Interests",
  "field_type": "checkbox",
  "required": false,
  "options": ["Technology", "Sports", "Music", "Travel"],
  "min_selections": 1,
  "max_selections": 3
}
```

**Textarea**:
```json
{
  "field_name": "Comments",
  "field_type": "textarea",
  "required": false,
  "max_length": 1000,
  "rows": 5,
  "placeholder": "Enter your comments here"
}
```

**File Upload**:
```json
{
  "field_name": "Resume",
  "field_type": "file",
  "required": true,
  "allowed_types": ["pdf", "doc", "docx"],
  "max_size_mb": 5,
  "multiple": false
}
```

**Address**:
```json
{
  "field_name": "Address",
  "field_type": "address",
  "required": true,
  "components": {
    "street": true,
    "city": true,
    "state": true,
    "zip": true,
    "country": true
  }
}
```

**Rating**:
```json
{
  "field_name": "Satisfaction Rating",
  "field_type": "rating",
  "required": true,
  "rating_type": "stars",
  "max_rating": 5
}
```

**Scale**:
```json
{
  "field_name": "Likelihood to Recommend",
  "field_type": "scale",
  "required": true,
  "min_value": 1,
  "max_value": 10,
  "min_label": "Not Likely",
  "max_label": "Very Likely"
}
```

### Add Field to Form

**Endpoint**: `POST /forms/{form_id}/fields`

**Request Body**:
```json
{
  "field_name": "Company Name",
  "field_type": "text",
  "required": true,
  "position": 3
}
```

**Response**:
```json
{
  "data": {
    "field_id": "field_005",
    "field_name": "Company Name",
    "position": 3
  },
  "message": "Field added successfully"
}
```

### Update Field

**Endpoint**: `PUT /forms/{form_id}/fields/{field_id}`

**Request Body**:
```json
{
  "field_name": "Company/Organization Name",
  "required": false
}
```

### Delete Field

**Endpoint**: `DELETE /forms/{form_id}/fields/{field_id}`

### Conditional Logic

Add conditional logic to show/hide fields.

**Endpoint**: `POST /forms/{form_id}/conditions`

**Request Body**:
```json
{
  "condition_name": "Show Company Field",
  "trigger_field": "field_002",
  "trigger_value": "Yes",
  "action": "show",
  "target_fields": ["field_005", "field_006"]
}
```

**Operators**:
- `equals`, `not_equals`
- `contains`, `not_contains`
- `greater_than`, `less_than`
- `is_filled`, `is_empty`

---

## Submissions API

### List Submissions

Retrieve all submissions for a form.

**Endpoint**: `GET /forms/{form_id}/submissions`

**Query Parameters**:
- `page` (integer): Page number (default: 1)
- `per_page` (integer): Results per page, max 200 (default: 50)
- `sort_by` (string): Sort field - `submitted_time`, `modified_time`
- `sort_order` (string): `asc` or `desc`
- `from_date` (string): Filter from date (ISO 8601)
- `to_date` (string): Filter to date (ISO 8601)
- `status` (string): Filter by status - `approved`, `pending`, `rejected`

**Request**:
```http
GET https://www.zohoapis.com/forms/api/v1/forms/form_abc123/submissions?page=1&per_page=50
Authorization: Zoho-oauthtoken {access_token}
```

**Response**:
```json
{
  "data": [
    {
      "submission_id": "sub_001",
      "submitted_time": "2025-01-17T14:30:00Z",
      "status": "approved",
      "ip_address": "192.168.1.1",
      "user_agent": "Mozilla/5.0...",
      "fields": {
        "field_001": "John Smith",
        "field_002": "john@example.com",
        "field_003": "+1234567890",
        "field_004": "I would like to schedule a demo"
      }
    }
  ],
  "info": {
    "page": 1,
    "per_page": 50,
    "count": 25,
    "total_count": 245,
    "more_records": true
  }
}
```

### Get Submission

Get details of a specific submission.

**Endpoint**: `GET /forms/{form_id}/submissions/{submission_id}`

**Response**:
```json
{
  "data": {
    "submission_id": "sub_001",
    "submitted_time": "2025-01-17T14:30:00Z",
    "modified_time": "2025-01-17T14:30:00Z",
    "status": "approved",
    "ip_address": "192.168.1.1",
    "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
    "referrer": "https://example.com/contact",
    "fields": {
      "field_001": {
        "field_name": "Name",
        "value": "John Smith"
      },
      "field_002": {
        "field_name": "Email",
        "value": "john@example.com"
      },
      "field_003": {
        "field_name": "Phone",
        "value": "+1234567890"
      },
      "field_004": {
        "field_name": "Message",
        "value": "I would like to schedule a demo"
      }
    },
    "attachments": [
      {
        "field_id": "field_005",
        "file_name": "resume.pdf",
        "file_size": 524288,
        "download_url": "https://forms.zoho.com/files/sub_001/resume.pdf"
      }
    ]
  }
}
```

### Submit Form Response

Submit a response programmatically.

**Endpoint**: `POST /forms/{form_id}/submissions`

**Request Body**:
```json
{
  "fields": {
    "field_001": "Jane Doe",
    "field_002": "jane@example.com",
    "field_003": "+1234567890",
    "field_004": "Thank you for this amazing product!"
  }
}
```

**Response**:
```json
{
  "data": {
    "submission_id": "sub_002",
    "submitted_time": "2025-01-17T15:00:00Z",
    "status": "approved"
  },
  "message": "Submission created successfully"
}
```

### Update Submission

Update existing submission.

**Endpoint**: `PUT /forms/{form_id}/submissions/{submission_id}`

**Request Body**:
```json
{
  "fields": {
    "field_004": "Updated message content"
  },
  "status": "approved"
}
```

**Response**:
```json
{
  "message": "Submission updated successfully"
}
```

### Delete Submission

**Endpoint**: `DELETE /forms/{form_id}/submissions/{submission_id}`

**Response**:
```json
{
  "message": "Submission deleted successfully"
}
```

### Export Submissions

Export submissions to various formats.

**Endpoint**: `GET /forms/{form_id}/submissions/export`

**Query Parameters**:
- `format` (string): Export format - `csv`, `xlsx`, `pdf`, `json`
- `from_date` (string): Filter from date
- `to_date` (string): Filter to date
- `fields` (string): Comma-separated field IDs to include

**Request**:
```http
GET https://www.zohoapis.com/forms/api/v1/forms/form_abc123/submissions/export?format=csv
Authorization: Zoho-oauthtoken {access_token}
```

**Response**: Binary file stream

### Bulk Operations

**Bulk Update Status**:
```http
PUT /forms/{form_id}/submissions/bulk-update
```

**Request Body**:
```json
{
  "submission_ids": ["sub_001", "sub_002", "sub_003"],
  "status": "approved"
}
```

**Bulk Delete**:
```http
DELETE /forms/{form_id}/submissions/bulk-delete
```

**Request Body**:
```json
{
  "submission_ids": ["sub_004", "sub_005"]
}
```

---

## Webhooks

### Create Webhook

Set up webhooks to receive real-time notifications.

**Endpoint**: `POST /forms/{form_id}/webhooks`

**Request Body**:
```json
{
  "webhook_name": "New Submission Alert",
  "webhook_url": "https://yourapp.com/api/webhook/forms",
  "events": ["submission.created", "submission.updated"],
  "active": true,
  "secret": "your_webhook_secret_key",
  "headers": {
    "X-Custom-Header": "value"
  }
}
```

**Available Events**:
- `submission.created` - New submission received
- `submission.updated` - Submission updated
- `submission.deleted` - Submission deleted
- `form.updated` - Form settings updated
- `form.deleted` - Form deleted

**Response**:
```json
{
  "data": {
    "webhook_id": "webhook_001",
    "webhook_name": "New Submission Alert",
    "webhook_url": "https://yourapp.com/api/webhook/forms",
    "created_time": "2025-01-17T10:00:00Z",
    "active": true
  },
  "message": "Webhook created successfully"
}
```

### Webhook Payload

When an event occurs, Zoho Forms sends a POST request:

**Headers**:
```http
Content-Type: application/json
X-Zoho-Forms-Event: submission.created
X-Zoho-Forms-Signature: sha256_hmac_signature
X-Zoho-Forms-Webhook-Id: webhook_001
```

**Payload**:
```json
{
  "event": "submission.created",
  "timestamp": "2025-01-17T14:30:00Z",
  "form": {
    "form_id": "form_abc123xyz789",
    "form_name": "Contact Us"
  },
  "submission": {
    "submission_id": "sub_003",
    "submitted_time": "2025-01-17T14:30:00Z",
    "status": "approved",
    "fields": {
      "field_001": "John Smith",
      "field_002": "john@example.com",
      "field_003": "+1234567890",
      "field_004": "Message content"
    }
  }
}
```

### Verify Webhook Signature

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(payload));
  const calculatedSignature = hmac.digest('hex');
  return calculatedSignature === signature;
}

// Usage
const isValid = verifyWebhookSignature(
  req.body,
  req.headers['x-zoho-forms-signature'],
  'your_webhook_secret_key'
);

if (!isValid) {
  return res.status(401).send('Invalid signature');
}

// Process webhook
console.log('Valid webhook received:', req.body);
```

### List Webhooks

**Endpoint**: `GET /forms/{form_id}/webhooks`

**Response**:
```json
{
  "data": [
    {
      "webhook_id": "webhook_001",
      "webhook_name": "New Submission Alert",
      "webhook_url": "https://yourapp.com/api/webhook/forms",
      "events": ["submission.created", "submission.updated"],
      "active": true,
      "created_time": "2025-01-17T10:00:00Z"
    }
  ]
}
```

### Update Webhook

**Endpoint**: `PUT /forms/{form_id}/webhooks/{webhook_id}`

**Request Body**:
```json
{
  "active": false
}
```

### Delete Webhook

**Endpoint**: `DELETE /forms/{form_id}/webhooks/{webhook_id}`

### Test Webhook

**Endpoint**: `POST /forms/{form_id}/webhooks/{webhook_id}/test`

Sends a test payload to verify webhook configuration.

**Response**:
```json
{
  "message": "Test webhook sent successfully",
  "status_code": 200
}
```

---

## Integrations

### Available Integrations

Zoho Forms supports integrations with various services:

- **Zoho CRM**: Automatically create leads/contacts
- **Zoho Campaigns**: Add subscribers to mailing lists
- **Zoho Desk**: Create support tickets
- **Zoho Sheet**: Save responses to spreadsheet
- **Google Sheets**: Export to Google Sheets
- **Mailchimp**: Add to mailing list
- **Slack**: Send notifications
- **Custom Webhooks**: Integration with any service

### Configure CRM Integration

**Endpoint**: `POST /forms/{form_id}/integrations/crm`

**Request Body**:
```json
{
  "integration_name": "CRM Lead Creation",
  "module": "Leads",
  "field_mapping": {
    "field_001": "Last_Name",
    "field_002": "Email",
    "field_003": "Phone",
    "field_004": "Description",
    "field_005": "Company"
  },
  "trigger": "on_submission",
  "active": true
}
```

**Response**:
```json
{
  "data": {
    "integration_id": "int_001",
    "integration_name": "CRM Lead Creation",
    "status": "active"
  }
}
```

### Configure Email Integration

**Endpoint**: `POST /forms/{form_id}/integrations/email`

**Request Body**:
```json
{
  "integration_name": "Email Notification",
  "to_emails": ["admin@example.com", "sales@example.com"],
  "subject": "New Form Submission: {{field_001}}",
  "body_template": "Name: {{field_001}}\nEmail: {{field_002}}\nMessage: {{field_004}}",
  "trigger": "on_submission",
  "active": true
}
```

### Configure Campaigns Integration

**Endpoint**: `POST /forms/{form_id}/integrations/campaigns`

**Request Body**:
```json
{
  "integration_name": "Newsletter Signup",
  "mailing_list_id": "list_123",
  "field_mapping": {
    "field_001": "FIRSTNAME",
    "field_002": "EMAIL",
    "field_003": "PHONE"
  },
  "double_opt_in": true,
  "active": true
}
```

### List Integrations

**Endpoint**: `GET /forms/{form_id}/integrations`

**Response**:
```json
{
  "data": [
    {
      "integration_id": "int_001",
      "integration_name": "CRM Lead Creation",
      "integration_type": "crm",
      "status": "active",
      "created_time": "2025-01-15T10:00:00Z"
    }
  ]
}
```

### Update Integration

**Endpoint**: `PUT /forms/{form_id}/integrations/{integration_id}`

**Request Body**:
```json
{
  "active": false
}
```

### Delete Integration

**Endpoint**: `DELETE /forms/{form_id}/integrations/{integration_id}`

---

## Analytics

### Get Form Analytics

**Endpoint**: `GET /forms/{form_id}/analytics`

**Query Parameters**:
- `from_date` (string): Start date (ISO 8601)
- `to_date` (string): End date (ISO 8601)
- `metrics` (string): Comma-separated metrics

**Request**:
```http
GET https://www.zohoapis.com/forms/api/v1/forms/form_abc123/analytics?from_date=2025-01-01&to_date=2025-01-31
Authorization: Zoho-oauthtoken {access_token}
```

**Response**:
```json
{
  "data": {
    "form_id": "form_abc123xyz789",
    "date_range": {
      "from": "2025-01-01T00:00:00Z",
      "to": "2025-01-31T23:59:59Z"
    },
    "metrics": {
      "total_views": 1250,
      "total_submissions": 245,
      "conversion_rate": 19.6,
      "average_completion_time": 135,
      "abandonment_rate": 32.5,
      "unique_visitors": 980
    },
    "submissions_by_day": [
      {
        "date": "2025-01-01",
        "count": 8
      },
      {
        "date": "2025-01-02",
        "count": 12
      }
    ],
    "field_analytics": [
      {
        "field_id": "field_001",
        "field_name": "Name",
        "completion_rate": 98.5,
        "average_time_spent": 8
      },
      {
        "field_id": "field_004",
        "field_name": "Message",
        "completion_rate": 87.2,
        "average_time_spent": 45
      }
    ],
    "traffic_sources": [
      {
        "source": "direct",
        "count": 120,
        "percentage": 49.0
      },
      {
        "source": "google",
        "count": 85,
        "percentage": 34.7
      },
      {
        "source": "social",
        "count": 40,
        "percentage": 16.3
      }
    ],
    "device_types": [
      {
        "type": "desktop",
        "count": 145,
        "percentage": 59.2
      },
      {
        "type": "mobile",
        "count": 75,
        "percentage": 30.6
      },
      {
        "type": "tablet",
        "count": 25,
        "percentage": 10.2
      }
    ]
  }
}
```

### Field-Level Analytics

**Endpoint**: `GET /forms/{form_id}/fields/{field_id}/analytics`

**Response**:
```json
{
  "data": {
    "field_id": "field_004",
    "field_name": "Satisfaction Rating",
    "field_type": "rating",
    "total_responses": 245,
    "statistics": {
      "average": 4.3,
      "median": 5,
      "mode": 5,
      "min": 1,
      "max": 5
    },
    "distribution": [
      {"value": 1, "count": 5, "percentage": 2.0},
      {"value": 2, "count": 12, "percentage": 4.9},
      {"value": 3, "count": 35, "percentage": 14.3},
      {"value": 4, "count": 78, "percentage": 31.8},
      {"value": 5, "count": 115, "percentage": 47.0}
    ]
  }
}
```

---

## Rate Limits

### API Rate Limits

| Tier | Requests per Minute | Daily Limit |
|------|---------------------|-------------|
| Free | 20 | 1,000 |
| Standard | 60 | 10,000 |
| Professional | 120 | 50,000 |
| Enterprise | 300 | 200,000 |

### Rate Limit Headers

```http
X-RateLimit-Limit: 120
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705587600
```

### Handling Rate Limits

**Response (429)**:
```json
{
  "code": "RATE_LIMIT_EXCEEDED",
  "message": "API rate limit exceeded",
  "details": {
    "retry_after": 45
  }
}
```

---

## Error Codes

### Common HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created |
| 204 | No Content | Request successful, no content |
| 400 | Bad Request | Invalid parameters |
| 401 | Unauthorized | Invalid access token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource conflict |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Error Response Format

```json
{
  "code": "FORM_NOT_FOUND",
  "message": "The form does not exist",
  "details": {
    "form_id": "form_invalid"
  }
}
```

### Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| INVALID_TOKEN | Invalid access token | Refresh token |
| FORM_NOT_FOUND | Form not found | Verify form ID |
| SUBMISSION_NOT_FOUND | Submission not found | Verify submission ID |
| FIELD_REQUIRED | Required field missing | Provide required field |
| INVALID_FIELD_TYPE | Invalid field type | Use valid field type |
| VALIDATION_ERROR | Data validation failed | Check validation rules |
| QUOTA_EXCEEDED | Submission quota exceeded | Upgrade plan |

---

## Code Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

class ZohoFormsClient {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseURL = 'https://www.zohoapis.com/forms/api/v1';
  }

  async request(method, endpoint, data = null) {
    const config = {
      method,
      url: `${this.baseURL}${endpoint}`,
      headers: {
        'Authorization': `Zoho-oauthtoken ${this.accessToken}`,
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      config.data = data;
    }

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      throw new Error(`API Error: ${error.response?.data?.message || error.message}`);
    }
  }

  async listForms(options = {}) {
    const params = new URLSearchParams(options).toString();
    const endpoint = params ? `/forms?${params}` : '/forms';
    return await this.request('GET', endpoint);
  }

  async createForm(formData) {
    return await this.request('POST', '/forms', formData);
  }

  async getForm(formId) {
    return await this.request('GET', `/forms/${formId}`);
  }

  async listSubmissions(formId, options = {}) {
    const params = new URLSearchParams(options).toString();
    const endpoint = `/forms/${formId}/submissions${params ? '?' + params : ''}`;
    return await this.request('GET', endpoint);
  }

  async submitForm(formId, fieldData) {
    return await this.request('POST', `/forms/${formId}/submissions`, {
      fields: fieldData
    });
  }

  async createWebhook(formId, webhookData) {
    return await this.request('POST', `/forms/${formId}/webhooks`, webhookData);
  }

  async getAnalytics(formId, fromDate, toDate) {
    return await this.request('GET',
      `/forms/${formId}/analytics?from_date=${fromDate}&to_date=${toDate}`
    );
  }
}

// Usage
const client = new ZohoFormsClient('1000.xxx.xxx');

// Create form
client.createForm({
  form_name: 'Event Registration',
  fields: [
    {
      field_name: 'Full Name',
      field_type: 'text',
      required: true
    },
    {
      field_name: 'Email',
      field_type: 'email',
      required: true
    }
  ]
})
  .then(response => {
    console.log('Form created:', response.data);
  });

// Submit form response
client.submitForm('form_abc123', {
  field_001: 'John Doe',
  field_002: 'john@example.com'
})
  .then(response => {
    console.log('Submission created:', response.data);
  });

// Setup webhook
client.createWebhook('form_abc123', {
  webhook_name: 'New Submission Alert',
  webhook_url: 'https://yourapp.com/api/webhook',
  events: ['submission.created'],
  active: true
})
  .then(response => {
    console.log('Webhook created:', response.data);
  });
```

### Python

```python
import requests

class ZohoFormsClient:
    def __init__(self, access_token):
        self.access_token = access_token
        self.base_url = 'https://www.zohoapis.com/forms/api/v1'
        self.headers = {
            'Authorization': f'Zoho-oauthtoken {access_token}',
            'Content-Type': 'application/json'
        }

    def request(self, method, endpoint, data=None):
        url = f'{self.base_url}{endpoint}'

        try:
            if method == 'GET':
                response = requests.get(url, headers=self.headers)
            elif method == 'POST':
                response = requests.post(url, headers=self.headers, json=data)
            elif method == 'PUT':
                response = requests.put(url, headers=self.headers, json=data)
            elif method == 'DELETE':
                response = requests.delete(url, headers=self.headers)

            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f'API Error: {str(e)}')

    def list_forms(self, **kwargs):
        params = '&'.join([f'{k}={v}' for k, v in kwargs.items()])
        endpoint = f'/forms?{params}' if params else '/forms'
        return self.request('GET', endpoint)

    def create_form(self, form_data):
        return self.request('POST', '/forms', form_data)

    def list_submissions(self, form_id, **kwargs):
        params = '&'.join([f'{k}={v}' for k, v in kwargs.items()])
        endpoint = f'/forms/{form_id}/submissions'
        if params:
            endpoint += f'?{params}'
        return self.request('GET', endpoint)

    def submit_form(self, form_id, field_data):
        return self.request('POST', f'/forms/{form_id}/submissions',
                          {'fields': field_data})

# Usage
client = ZohoFormsClient('1000.xxx.xxx')

# Create form
response = client.create_form({
    'form_name': 'Event Registration',
    'fields': [
        {
            'field_name': 'Full Name',
            'field_type': 'text',
            'required': True
        }
    ]
})
print('Form created:', response['data'])

# Submit response
response = client.submit_form('form_abc123', {
    'field_001': 'John Doe',
    'field_002': 'john@example.com'
})
print('Submission created:', response['data'])
```

### Deluge

```deluge
accessToken = "1000.xxx.xxx";

// Create form
formData = {
    "form_name": "Event Registration",
    "fields": [
        {
            "field_name": "Full Name",
            "field_type": "text",
            "required": true
        },
        {
            "field_name": "Email",
            "field_type": "email",
            "required": true
        }
    ]
};

response = invokeurl
[
    url: "https://www.zohoapis.com/forms/api/v1/forms"
    type: POST
    parameters: formData.toString()
    headers: {"Authorization": "Zoho-oauthtoken " + accessToken}
];

formId = response.get("data").get("form_id");
info "Created form: " + formId;

// Submit form response
submissionData = {
    "fields": {
        "field_001": "John Doe",
        "field_002": "john@example.com"
    }
};

response = invokeurl
[
    url: "https://www.zohoapis.com/forms/api/v1/forms/" + formId + "/submissions"
    type: POST
    parameters: submissionData.toString()
    headers: {"Authorization": "Zoho-oauthtoken " + accessToken}
];

info "Submission created: " + response.get("data").get("submission_id");

// List submissions
response = invokeurl
[
    url: "https://www.zohoapis.com/forms/api/v1/forms/" + formId + "/submissions?page=1&per_page=50"
    type: GET
    headers: {"Authorization": "Zoho-oauthtoken " + accessToken}
];

submissions = response.get("data");
for each submission in submissions
{
    info "Submission ID: " + submission.get("submission_id");
    info "Submitted: " + submission.get("submitted_time");
}
```

---

## Best Practices

1. **Field Validation**: Always validate data on client-side and server-side
2. **Webhook Security**: Verify webhook signatures to prevent spoofing
3. **Rate Limiting**: Implement exponential backoff for rate limits
4. **Error Handling**: Handle all error codes appropriately
5. **Data Privacy**: Follow GDPR and data protection regulations
6. **Pagination**: Always paginate large result sets
7. **Caching**: Cache form metadata to reduce API calls

---

## Support and Resources

- **API Documentation**: https://www.zoho.com/forms/help/api/
- **Developer Forum**: https://help.zoho.com/portal/community
- **API Console**: https://api-console.zoho.com/
- **Status Page**: https://status.zoho.com/

---

**Last Updated**: January 2025
**API Version**: v1
