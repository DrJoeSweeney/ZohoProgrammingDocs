# Webhooks Guide for Zoho APIs

## Overview

This guide covers webhook implementation across Zoho products. Webhooks provide real-time notifications when events occur in Zoho applications, eliminating the need for constant polling.

---

## Table of Contents

1. [What are Webhooks?](#what-are-webhooks)
2. [Webhook Support by Product](#webhook-support-by-product)
3. [Setting Up Webhooks](#setting-up-webhooks)
4. [Webhook Payload Structure](#webhook-payload-structure)
5. [Security & Verification](#security--verification)
6. [Handling Webhooks](#handling-webhooks)
7. [Best Practices](#best-practices)
8. [Code Examples](#code-examples)
9. [Troubleshooting](#troubleshooting)

---

## What are Webhooks?

### Concept

Webhooks are HTTP callbacks that send data to your specified URL when an event occurs. Instead of polling Zoho APIs repeatedly to check for changes, Zoho pushes updates to your application in real-time.

### Benefits

- **Real-time Updates**: Instant notifications when data changes
- **Reduced API Calls**: No need to poll APIs constantly
- **Lower Latency**: Faster response to events
- **Resource Efficient**: Less server load and API quota usage

### How Webhooks Work

```
1. Event Occurs (e.g., Lead Created in CRM)
         ↓
2. Zoho Sends HTTP POST to Your Webhook URL
         ↓
3. Your Server Receives & Processes Webhook
         ↓
4. Your Server Responds with 200 OK
         ↓
5. Zoho Marks Webhook as Delivered
```

---

## Webhook Support by Product

### Products with Full Webhook Support

#### Zoho CRM

**Events Available**:
- Module record events: Create, Update, Delete
- Field updates
- Workflow triggers
- Lead conversions
- Deal stage changes

**Event Examples**:
- `Leads.create`
- `Leads.update`
- `Leads.delete`
- `Contacts.create`
- `Deals.edit`
- `Deals.stage.change`

**Configuration**: Via Zoho CRM Settings → Developer Space → Actions → Webhooks

#### Zoho Desk

**Events Available**:
- Ticket events: Create, Update, Close, Delete
- Comment added
- Assignment changes
- Status changes

**Event Examples**:
- `Ticket.Create`
- `Ticket.Update`
- `Ticket.Close`
- `Ticket.Delete`
- `Ticket.Comment.Added`

**Configuration**: Via Desk Settings → Developer Space → Webhooks

#### Zoho Books

**Events Available**:
- Invoice events: Create, Update, Void, Delete
- Payment received
- Bill events
- Expense events

**Event Examples**:
- `invoice_created`
- `invoice_updated`
- `payment_received`
- `bill_created`
- `expense_created`

**Configuration**: Via Books Settings → Webhooks

#### Zoho Recruit

**Events Available**:
- Candidate events: Create, Update, Delete
- Application status changes
- Interview scheduled

**Event Examples**:
- `Candidates.create`
- `Candidates.update`
- `Candidates.delete`
- `Candidates.status.change`

**Configuration**: Via Recruit Settings → Developer Space → Webhooks

#### Zoho Creator

**Events Available**:
- Record events: Add, Edit, Delete
- Form submissions
- Workflow triggers

**Configuration**: Via Creator Application Settings → Integrations → Webhooks

#### Zoho Projects

**Events Available**:
- Task events: Create, Update, Complete, Delete
- Milestone events
- Timelog entries
- Bug reports

**Event Examples**:
- `task_created`
- `task_updated`
- `task_completed`
- `milestone_completed`

**Configuration**: Via Projects Settings → Webhooks

#### Zoho Forms

**Events Available**:
- Form submission
- Entry updated
- Entry deleted

**Configuration**: Via Form Settings → Integration → Webhooks

#### Zoho Survey

**Events Available**:
- Survey response submitted
- Survey completed

**Configuration**: Via Survey Settings → Integrations → Webhooks

#### Zoho Subscriptions

**Events Available**:
- Subscription events: Create, Update, Cancel, Renew
- Payment events
- Invoice events

**Event Examples**:
- `subscription_created`
- `subscription_renewed`
- `subscription_cancelled`
- `payment_success`
- `payment_failed`

**Configuration**: Via Subscriptions Settings → Webhooks

### Products with Notification APIs

Some products use "Notifications API" instead of traditional webhooks:

#### Zoho Analytics

**Mechanism**: Notification APIs for data updates
**Configuration**: Via Analytics API Settings

#### Zoho Campaigns

**Events**: Campaign sent, Opens, Clicks, Bounces, Unsubscribes
**Configuration**: Via Campaign Settings → Webhooks

### Products Without Direct Webhook Support

These products don't offer webhooks but can be integrated using:
- Zoho Flow (workflow automation)
- Polling APIs
- Deluge scripts in other Zoho apps

---

## Setting Up Webhooks

### General Setup Process

#### Step 1: Prepare Your Webhook Endpoint

Create an HTTP endpoint that can receive POST requests:

```javascript
// Express.js example
app.post('/webhooks/zoho/:product', (req, res) => {
  console.log('Webhook received:', req.body);

  // Process webhook
  processWebhook(req.params.product, req.body);

  // Respond immediately
  res.status(200).send('OK');
});
```

**Requirements**:
- Must be publicly accessible (HTTPS recommended)
- Must respond with HTTP 200 within 10 seconds
- Should handle requests asynchronously

#### Step 2: Configure Webhook in Zoho

**Example: Zoho CRM**

1. Go to CRM → Setup → Developer Space → Actions → Webhooks
2. Click "Configure Webhook"
3. Enter details:
   ```
   Module: Leads
   URL to Notify: https://yourapp.com/webhooks/zoho/crm
   Type: Instant
   Method: POST
   Events: Create, Update
   ```
4. Save configuration

#### Step 3: Handle Webhook Verification (if required)

Some Zoho products send a verification challenge on first setup:

```javascript
app.post('/webhooks/zoho/crm', (req, res) => {
  // Check for verification challenge
  if (req.body.challenge) {
    return res.json({ challenge: req.body.challenge });
  }

  // Process normal webhook
  processWebhook(req.body);
  res.status(200).send('OK');
});
```

---

## Webhook Payload Structure

### Zoho CRM Webhook Payload

```json
{
  "module": "Leads",
  "operation": "create",
  "resource_uri": "https://www.zohoapis.com/crm/v8/Leads/12345000000234567",
  "ids": ["12345000000234567"],
  "token": "YOUR_NOTIFICATION_TOKEN",
  "channel": {
    "id": "10000000068001",
    "expiry_time": "2026-01-15T10:30:00+00:00"
  },
  "data": {
    "Owner": {
      "name": "John Doe",
      "id": "12345000000123456"
    },
    "Company": "Acme Corp",
    "Email": "contact@acmecorp.com",
    "Last_Name": "Smith",
    "First_Name": "Jane",
    "Lead_Status": "New",
    "id": "12345000000234567",
    "Created_Time": "2025-01-15T10:30:00+00:00"
  }
}
```

**Fields**:
- `module`: Which CRM module (Leads, Contacts, etc.)
- `operation`: Type of operation (create, update, delete)
- `resource_uri`: API endpoint to fetch full record
- `ids`: Array of affected record IDs
- `token`: Your notification token for verification
- `data`: The actual record data

### Zoho Desk Webhook Payload

```json
{
  "event": "Ticket.Create",
  "orgId": "12345678",
  "ticketId": "12345000000234567",
  "ticket": {
    "ticketNumber": "12345",
    "subject": "Cannot login to account",
    "departmentId": "12345000000123456",
    "contactId": "12345000000345678",
    "email": "customer@example.com",
    "status": "Open",
    "priority": "High",
    "createdTime": "2025-01-15T10:30:00Z"
  }
}
```

### Zoho Books Webhook Payload

```json
{
  "event": "invoice_created",
  "organization_id": "12345678",
  "data": {
    "invoice_id": "12345000000234567",
    "invoice_number": "INV-00001",
    "customer_id": "12345000000345678",
    "customer_name": "Acme Corp",
    "total": 1250.00,
    "status": "draft",
    "date": "2025-01-15"
  }
}
```

### Zoho Subscriptions Webhook Payload

```json
{
  "event": "subscription_created",
  "subscription": {
    "subscription_id": "12345000000234567",
    "subscription_number": "SUB-00001",
    "customer_id": "12345000000345678",
    "plan_code": "PREMIUM-MONTHLY",
    "status": "live",
    "created_time": "2025-01-15T10:30:00Z",
    "next_billing_at": "2025-02-15"
  }
}
```

### Zoho Forms Webhook Payload

```json
{
  "form_link_name": "contact-us",
  "submission_id": "12345000000234567",
  "submitted_time": "2025-01-15T10:30:00Z",
  "fields": [
    {
      "field_name": "Name",
      "field_value": "John Doe"
    },
    {
      "field_name": "Email",
      "field_value": "john@example.com"
    },
    {
      "field_name": "Message",
      "field_value": "I would like to know more about your services."
    }
  ]
}
```

---

## Security & Verification

### 1. HTTPS Only

**Always use HTTPS** for webhook endpoints to encrypt data in transit:

```javascript
// ❌ INSECURE
const webhookUrl = 'http://yourapp.com/webhooks';

// ✅ SECURE
const webhookUrl = 'https://yourapp.com/webhooks';
```

### 2. Verify Webhook Source

#### Method 1: Token Verification

Some Zoho products include a token in webhook payloads:

```javascript
const WEBHOOK_TOKEN = process.env.ZOHO_WEBHOOK_TOKEN;

app.post('/webhooks/zoho/crm', (req, res) => {
  // Verify token
  if (req.body.token !== WEBHOOK_TOKEN) {
    return res.status(401).send('Unauthorized');
  }

  // Process webhook
  processWebhook(req.body);
  res.status(200).send('OK');
});
```

#### Method 2: IP Whitelist

Verify requests come from Zoho's IP ranges:

```javascript
const ZOHO_IP_RANGES = [
  '103.234.239.0/24',
  '203.115.111.0/24',
  // Add other Zoho IP ranges
];

function isZohoIP(ip) {
  // Implement IP range check
  return ZOHO_IP_RANGES.some(range => ipInRange(ip, range));
}

app.post('/webhooks/zoho/crm', (req, res) => {
  const clientIP = req.ip;

  if (!isZohoIP(clientIP)) {
    return res.status(403).send('Forbidden');
  }

  processWebhook(req.body);
  res.status(200).send('OK');
});
```

#### Method 3: Signature Verification (if supported)

Some products send a signature header:

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

app.post('/webhooks/zoho/crm', (req, res) => {
  const signature = req.headers['x-zoho-signature'];

  if (!verifyWebhookSignature(req.body, signature, WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }

  processWebhook(req.body);
  res.status(200).send('OK');
});
```

### 3. Implement Idempotency

Webhooks may be delivered multiple times. Use idempotency to prevent duplicate processing:

```javascript
const processedWebhooks = new Set();

async function processWebhook(webhook) {
  const webhookId = webhook.ids?.[0] || webhook.subscription_id;

  // Check if already processed
  if (processedWebhooks.has(webhookId)) {
    console.log('Webhook already processed:', webhookId);
    return;
  }

  // Process webhook
  await handleWebhookLogic(webhook);

  // Mark as processed
  processedWebhooks.add(webhookId);

  // Clean up old entries (e.g., after 24 hours)
  setTimeout(() => processedWebhooks.delete(webhookId), 86400000);
}
```

**Database-based idempotency**:

```javascript
async function processWebhook(webhook) {
  const webhookId = webhook.ids?.[0];

  // Check if already processed
  const exists = await db.query(
    'SELECT id FROM processed_webhooks WHERE webhook_id = ?',
    [webhookId]
  );

  if (exists.length > 0) {
    console.log('Webhook already processed:', webhookId);
    return;
  }

  // Process webhook
  await handleWebhookLogic(webhook);

  // Mark as processed
  await db.query(
    'INSERT INTO processed_webhooks (webhook_id, processed_at) VALUES (?, NOW())',
    [webhookId]
  );
}
```

---

## Handling Webhooks

### Async Processing

Always respond quickly and process webhooks asynchronously:

```javascript
const queue = require('bull');  // Or any job queue
const webhookQueue = new queue('webhooks');

// Webhook endpoint
app.post('/webhooks/zoho/crm', async (req, res) => {
  try {
    // Add to queue for async processing
    await webhookQueue.add(req.body);

    // Respond immediately
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error queuing webhook:', error);
    res.status(500).send('Error');
  }
});

// Worker process
webhookQueue.process(async (job) => {
  const webhook = job.data;

  try {
    await processWebhook(webhook);
  } catch (error) {
    console.error('Error processing webhook:', error);
    throw error;  // Retry
  }
});
```

### Retry Logic

Handle failures with retry logic:

```javascript
webhookQueue.process(async (job) => {
  const webhook = job.data;
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await processWebhook(webhook);
      return;  // Success
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);

      if (attempt < maxRetries) {
        // Exponential backoff
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        // All retries failed
        console.error('All retry attempts failed for webhook:', webhook);
        throw error;
      }
    }
  }
});
```

### Error Handling

Implement comprehensive error handling:

```javascript
async function processWebhook(webhook) {
  try {
    // Validate webhook structure
    if (!webhook.module || !webhook.operation) {
      throw new Error('Invalid webhook structure');
    }

    // Route to appropriate handler
    switch (webhook.module) {
      case 'Leads':
        await handleLeadWebhook(webhook);
        break;

      case 'Contacts':
        await handleContactWebhook(webhook);
        break;

      case 'Deals':
        await handleDealWebhook(webhook);
        break;

      default:
        console.log('Unhandled module:', webhook.module);
    }
  } catch (error) {
    console.error('Error processing webhook:', error);

    // Log to error tracking service
    await logWebhookError(webhook, error);

    throw error;
  }
}
```

---

## Best Practices

### 1. Respond Quickly

Zoho expects a response within 10 seconds. If no response, webhook is marked as failed.

```javascript
// ✅ GOOD: Respond immediately, process async
app.post('/webhook', async (req, res) => {
  await queue.add(req.body);
  res.status(200).send('OK');  // Respond quickly
});

// ❌ BAD: Long processing before response
app.post('/webhook', async (req, res) => {
  await longRunningProcess(req.body);  // Takes 30 seconds
  res.status(200).send('OK');  // Response too slow
});
```

### 2. Handle Retries Gracefully

Zoho retries failed webhooks. Implement idempotency to handle duplicates.

### 3. Monitor Webhook Health

Track webhook delivery and processing:

```javascript
const webhookStats = {
  received: 0,
  processed: 0,
  failed: 0,
  duplicates: 0
};

function trackWebhook(status) {
  webhookStats.received++;

  switch (status) {
    case 'processed':
      webhookStats.processed++;
      break;
    case 'failed':
      webhookStats.failed++;
      break;
    case 'duplicate':
      webhookStats.duplicates++;
      break;
  }

  // Log stats periodically
  console.log('Webhook Stats:', webhookStats);
}
```

### 4. Implement Webhook Logging

Log all webhooks for debugging:

```javascript
async function logWebhook(webhook, status) {
  await db.query(
    'INSERT INTO webhook_logs (webhook_id, module, operation, payload, status, received_at) VALUES (?, ?, ?, ?, ?, NOW())',
    [
      webhook.ids?.[0],
      webhook.module,
      webhook.operation,
      JSON.stringify(webhook),
      status
    ]
  );
}
```

### 5. Test Webhook Endpoints

Use tools like ngrok for local testing:

```bash
# Install ngrok
npm install -g ngrok

# Start your local server
node server.js

# Create tunnel
ngrok http 3000

# Use the HTTPS URL in Zoho webhook configuration
# https://abc123.ngrok.io/webhooks/zoho/crm
```

### 6. Handle Webhook Expiration

Some Zoho products require webhook renewal:

```javascript
async function renewWebhook(channelId) {
  const response = await axios.put(
    'https://www.zohoapis.com/crm/v8/actions/watch',
    {
      watch: [{
        channel_id: channelId,
        channel_expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()  // 30 days
      }]
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );

  console.log('Webhook renewed:', response.data);
}

// Renew webhook periodically (e.g., every 25 days)
setInterval(() => {
  renewWebhook(CHANNEL_ID);
}, 25 * 24 * 60 * 60 * 1000);
```

---

## Code Examples

### Complete Webhook Handler (Node.js/Express)

```javascript
const express = require('express');
const crypto = require('crypto');
const Queue = require('bull');

const app = express();
app.use(express.json());

const WEBHOOK_TOKEN = process.env.ZOHO_WEBHOOK_TOKEN;
const processedWebhooks = new Set();
const webhookQueue = new Queue('zoho-webhooks');

// Webhook endpoint
app.post('/webhooks/zoho/:product', async (req, res) => {
  const product = req.params.product;
  const webhook = req.body;

  try {
    // Handle verification challenge (if product sends one)
    if (webhook.challenge) {
      return res.json({ challenge: webhook.challenge });
    }

    // Verify token (if present)
    if (webhook.token && webhook.token !== WEBHOOK_TOKEN) {
      console.error('Invalid webhook token');
      return res.status(401).send('Unauthorized');
    }

    // Check idempotency
    const webhookId = getWebhookId(webhook);
    if (processedWebhooks.has(webhookId)) {
      console.log('Duplicate webhook:', webhookId);
      return res.status(200).send('OK');
    }

    // Add to processing queue
    await webhookQueue.add({
      product,
      webhook,
      webhookId,
      receivedAt: new Date()
    });

    // Mark as received
    processedWebhooks.add(webhookId);
    setTimeout(() => processedWebhooks.delete(webhookId), 86400000);  // Clean up after 24h

    // Respond immediately
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).send('Error');
  }
});

// Worker to process webhooks
webhookQueue.process(async (job) => {
  const { product, webhook, webhookId } = job.data;

  console.log(`Processing ${product} webhook:`, webhookId);

  try {
    switch (product) {
      case 'crm':
        await processCRMWebhook(webhook);
        break;

      case 'desk':
        await processDeskWebhook(webhook);
        break;

      case 'books':
        await processBooksWebhook(webhook);
        break;

      default:
        console.log('Unknown product:', product);
    }

    console.log('Webhook processed successfully:', webhookId);
  } catch (error) {
    console.error('Error processing webhook:', error);
    throw error;  // Will trigger retry
  }
});

// Product-specific handlers
async function processCRMWebhook(webhook) {
  const { module, operation, data } = webhook;

  console.log(`CRM ${module} ${operation}:`, data.id);

  switch (module) {
    case 'Leads':
      if (operation === 'create') {
        await handleNewLead(data);
      } else if (operation === 'update') {
        await handleLeadUpdate(data);
      }
      break;

    case 'Deals':
      if (operation === 'edit' && data.Stage) {
        await handleDealStageChange(data);
      }
      break;

    default:
      console.log('Unhandled CRM module:', module);
  }
}

async function processDeskWebhook(webhook) {
  const { event, ticket } = webhook;

  console.log(`Desk ${event}:`, ticket.ticketNumber);

  switch (event) {
    case 'Ticket.Create':
      await handleNewTicket(ticket);
      break;

    case 'Ticket.Update':
      await handleTicketUpdate(ticket);
      break;

    case 'Ticket.Close':
      await handleTicketClose(ticket);
      break;

    default:
      console.log('Unhandled Desk event:', event);
  }
}

async function processBooksWebhook(webhook) {
  const { event, data } = webhook;

  console.log(`Books ${event}:`, data.invoice_number || data.subscription_number);

  switch (event) {
    case 'invoice_created':
      await handleInvoiceCreated(data);
      break;

    case 'payment_received':
      await handlePaymentReceived(data);
      break;

    default:
      console.log('Unhandled Books event:', event);
  }
}

// Helper functions
function getWebhookId(webhook) {
  // Generate unique ID based on webhook content
  return webhook.ids?.[0] ||
         webhook.subscription_id ||
         webhook.invoice_id ||
         webhook.ticketId ||
         crypto.createHash('md5').update(JSON.stringify(webhook)).digest('hex');
}

async function handleNewLead(lead) {
  // Your business logic here
  console.log('New lead:', lead.First_Name, lead.Last_Name);
}

async function handleLeadUpdate(lead) {
  // Your business logic here
  console.log('Lead updated:', lead.id);
}

async function handleDealStageChange(deal) {
  // Your business logic here
  console.log('Deal stage changed:', deal.Stage);
}

async function handleNewTicket(ticket) {
  // Your business logic here
  console.log('New ticket:', ticket.subject);
}

async function handleTicketUpdate(ticket) {
  // Your business logic here
  console.log('Ticket updated:', ticket.ticketNumber);
}

async function handleTicketClose(ticket) {
  // Your business logic here
  console.log('Ticket closed:', ticket.ticketNumber);
}

async function handleInvoiceCreated(invoice) {
  // Your business logic here
  console.log('Invoice created:', invoice.invoice_number);
}

async function handlePaymentReceived(payment) {
  // Your business logic here
  console.log('Payment received:', payment.amount);
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook server running on port ${PORT}`);
  console.log(`Webhook URL: http://localhost:${PORT}/webhooks/zoho/:product`);
});
```

### Python/Flask Webhook Handler

```python
from flask import Flask, request, jsonify
import json
import hashlib
from datetime import datetime
from redis import Redis
from rq import Queue

app = Flask(__name__)
redis_conn = Redis()
webhook_queue = Queue(connection=redis_conn)

WEBHOOK_TOKEN = os.getenv('ZOHO_WEBHOOK_TOKEN')
processed_webhooks = set()

@app.route('/webhooks/zoho/<product>', methods=['POST'])
def handle_webhook(product):
    webhook = request.json

    try:
        # Handle verification challenge
        if 'challenge' in webhook:
            return jsonify({'challenge': webhook['challenge']})

        # Verify token
        if 'token' in webhook and webhook['token'] != WEBHOOK_TOKEN:
            return 'Unauthorized', 401

        # Check idempotency
        webhook_id = get_webhook_id(webhook)
        if webhook_id in processed_webhooks:
            print(f'Duplicate webhook: {webhook_id}')
            return 'OK', 200

        # Add to queue
        webhook_queue.enqueue(
            process_webhook,
            product,
            webhook,
            webhook_id
        )

        # Mark as received
        processed_webhooks.add(webhook_id)

        return 'OK', 200
    except Exception as e:
        print(f'Error handling webhook: {e}')
        return 'Error', 500

def process_webhook(product, webhook, webhook_id):
    print(f'Processing {product} webhook: {webhook_id}')

    try:
        if product == 'crm':
            process_crm_webhook(webhook)
        elif product == 'desk':
            process_desk_webhook(webhook)
        elif product == 'books':
            process_books_webhook(webhook)
        else:
            print(f'Unknown product: {product}')

        print(f'Webhook processed successfully: {webhook_id}')
    except Exception as e:
        print(f'Error processing webhook: {e}')
        raise

def process_crm_webhook(webhook):
    module = webhook.get('module')
    operation = webhook.get('operation')
    data = webhook.get('data', {})

    print(f"CRM {module} {operation}: {data.get('id')}")

    if module == 'Leads':
        if operation == 'create':
            handle_new_lead(data)
        elif operation == 'update':
            handle_lead_update(data)
    elif module == 'Deals':
        if operation == 'edit' and data.get('Stage'):
            handle_deal_stage_change(data)

def process_desk_webhook(webhook):
    event = webhook.get('event')
    ticket = webhook.get('ticket', {})

    print(f"Desk {event}: {ticket.get('ticketNumber')}")

    if event == 'Ticket.Create':
        handle_new_ticket(ticket)
    elif event == 'Ticket.Update':
        handle_ticket_update(ticket)
    elif event == 'Ticket.Close':
        handle_ticket_close(ticket)

def process_books_webhook(webhook):
    event = webhook.get('event')
    data = webhook.get('data', {})

    print(f"Books {event}: {data.get('invoice_number')}")

    if event == 'invoice_created':
        handle_invoice_created(data)
    elif event == 'payment_received':
        handle_payment_received(data)

def get_webhook_id(webhook):
    if 'ids' in webhook and webhook['ids']:
        return webhook['ids'][0]
    elif 'subscription_id' in webhook:
        return webhook['subscription_id']
    elif 'invoice_id' in webhook:
        return webhook['invoice_id']
    elif 'ticketId' in webhook:
        return webhook['ticketId']
    else:
        return hashlib.md5(json.dumps(webhook).encode()).hexdigest()

def handle_new_lead(lead):
    print(f"New lead: {lead.get('First_Name')} {lead.get('Last_Name')}")

def handle_lead_update(lead):
    print(f"Lead updated: {lead.get('id')}")

def handle_deal_stage_change(deal):
    print(f"Deal stage changed: {deal.get('Stage')}")

def handle_new_ticket(ticket):
    print(f"New ticket: {ticket.get('subject')}")

def handle_ticket_update(ticket):
    print(f"Ticket updated: {ticket.get('ticketNumber')}")

def handle_ticket_close(ticket):
    print(f"Ticket closed: {ticket.get('ticketNumber')}")

def handle_invoice_created(invoice):
    print(f"Invoice created: {invoice.get('invoice_number')}")

def handle_payment_received(payment):
    print(f"Payment received: {payment.get('amount')}")

if __name__ == '__main__':
    app.run(port=5000, debug=True)
```

---

## Troubleshooting

### Issue: Webhooks Not Being Received

**Possible Causes**:
1. Webhook URL not publicly accessible
2. Server not responding within 10 seconds
3. Firewall blocking Zoho IPs
4. SSL certificate issues

**Solutions**:
- Test URL with curl: `curl -X POST https://yourapp.com/webhook -d '{"test": "data"}'`
- Check server logs for errors
- Verify firewall/security group rules
- Ensure valid SSL certificate

### Issue: Duplicate Webhooks

**Cause**: Zoho retries on timeout or error

**Solution**: Implement idempotency (see examples above)

### Issue: Webhook Processing Too Slow

**Cause**: Long processing blocks response

**Solution**: Use async processing with job queues

### Issue: Missing Webhook Events

**Possible Causes**:
1. Webhook expired and needs renewal
2. Event not configured
3. Rate limiting on webhook endpoint

**Solutions**:
- Check webhook configuration in Zoho
- Renew webhook if expired
- Ensure all desired events are selected
- Check for rate limiting on your server

---

## Summary

- **Configure Carefully**: Set up webhooks in Zoho product settings
- **Secure Endpoints**: Use HTTPS, verify tokens/signatures
- **Respond Quickly**: Return 200 OK within 10 seconds
- **Process Async**: Use job queues for heavy processing
- **Handle Duplicates**: Implement idempotency
- **Monitor Health**: Track webhook delivery and processing
- **Test Thoroughly**: Use ngrok for local testing

---

**Last Updated**: December 2025
**Guide Version**: 1.0
