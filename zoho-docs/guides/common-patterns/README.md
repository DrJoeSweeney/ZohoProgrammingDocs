# Common Patterns for Zoho APIs

## Overview

This guide provides reusable code patterns and templates for common operations across Zoho products. Use these as starting points for your integrations.

---

## Table of Contents

1. [CRUD Operations](#crud-operations)
2. [Search & Filter Patterns](#search--filter-patterns)
3. [Bulk Operations](#bulk-operations)
4. [Data Synchronization](#data-synchronization)
5. [Webhook Patterns](#webhook-patterns)
6. [Authentication Patterns](#authentication-patterns)
7. [Error Handling Patterns](#error-handling-patterns)
8. [Caching Patterns](#caching-patterns)

---

## CRUD Operations

### Create Record

**Pattern: Single Record Creation**

```javascript
async function createRecord(module, data) {
  try {
    const response = await axios.post(
      `${API_DOMAIN}/crm/v8/${module}`,
      { data: [data] },
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.data[0].code === 'SUCCESS') {
      return {
        success: true,
        id: response.data.data[0].details.id,
        data: response.data.data[0]
      };
    } else {
      return {
        success: false,
        error: response.data.data[0].message
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
}

// Usage
const lead = await createRecord('Leads', {
  First_Name: 'John',
  Last_Name: 'Doe',
  Email: 'john@example.com',
  Company: 'Acme Corp'
});
```

**Python Version**:

```python
async def create_record(module, data):
    try:
        response = requests.post(
            f'{API_DOMAIN}/crm/v8/{module}',
            json={'data': [data]},
            headers={
                'Authorization': f'Zoho-oauthtoken {access_token}',
                'Content-Type': 'application/json'
            }
        )

        result = response.json()['data'][0]

        if result['code'] == 'SUCCESS':
            return {
                'success': True,
                'id': result['details']['id'],
                'data': result
            }
        else:
            return {
                'success': False,
                'error': result['message']
            }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

# Usage
lead = await create_record('Leads', {
    'First_Name': 'John',
    'Last_Name': 'Doe',
    'Email': 'john@example.com',
    'Company': 'Acme Corp'
})
```

**Deluge Version**:

```javascript
leadData = {
    "First_Name": "John",
    "Last_Name": "Doe",
    "Email": "john@example.com",
    "Company": "Acme Corp"
};

response = zoho.crm.createRecord("Leads", leadData);

if(response.get("id") != null)
{
    info "Lead created successfully: " + response.get("id");
}
else
{
    info "Error creating lead: " + response;
}
```

### Read Record

**Pattern: Get Single Record by ID**

```javascript
async function getRecord(module, recordId, fields = []) {
  try {
    const params = fields.length > 0 ? { fields: fields.join(',') } : {};

    const response = await axios.get(
      `${API_DOMAIN}/crm/v8/${module}/${recordId}`,
      {
        params,
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`
        }
      }
    );

    return {
      success: true,
      data: response.data.data[0]
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
}

// Usage
const lead = await getRecord('Leads', '12345000000234567');
const leadWithFields = await getRecord('Leads', '12345000000234567', [
  'First_Name',
  'Last_Name',
  'Email',
  'Phone'
]);
```

**Pattern: Get All Records with Pagination**

```javascript
async function* getAllRecords(module, options = {}) {
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    try {
      const response = await axios.get(
        `${API_DOMAIN}/crm/v8/${module}`,
        {
          params: {
            page,
            per_page: options.per_page || 200,
            fields: options.fields?.join(','),
            sort_by: options.sort_by,
            sort_order: options.sort_order
          },
          headers: {
            'Authorization': `Zoho-oauthtoken ${accessToken}`
          }
        }
      );

      yield response.data.data;

      hasMore = response.data.info.more_records;
      page++;
    } catch (error) {
      console.error('Error fetching records:', error);
      break;
    }
  }
}

// Usage
for await (const leadsBatch of getAllRecords('Leads', { per_page: 200 })) {
  console.log(`Processing ${leadsBatch.length} leads`);
  await processLeads(leadsBatch);
}
```

### Update Record

**Pattern: Update Single Record**

```javascript
async function updateRecord(module, recordId, updates) {
  try {
    const response = await axios.put(
      `${API_DOMAIN}/crm/v8/${module}/${recordId}`,
      { data: [updates] },
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.data[0].code === 'SUCCESS') {
      return {
        success: true,
        data: response.data.data[0]
      };
    } else {
      return {
        success: false,
        error: response.data.data[0].message
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
}

// Usage
const updated = await updateRecord('Leads', '12345000000234567', {
  Lead_Status: 'Qualified',
  Rating: 'Hot'
});
```

### Delete Record

**Pattern: Delete Single Record**

```javascript
async function deleteRecord(module, recordId) {
  try {
    const response = await axios.delete(
      `${API_DOMAIN}/crm/v8/${module}/${recordId}`,
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`
        }
      }
    );

    if (response.data.data[0].code === 'SUCCESS') {
      return { success: true };
    } else {
      return {
        success: false,
        error: response.data.data[0].message
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
}

// Usage
const deleted = await deleteRecord('Leads', '12345000000234567');
```

---

## Search & Filter Patterns

### Search by Criteria

**Pattern: Search with Single Criterion**

```javascript
async function searchRecords(module, field, value) {
  try {
    const response = await axios.get(
      `${API_DOMAIN}/crm/v8/${module}/search`,
      {
        params: {
          criteria: `(${field}:equals:${value})`
        },
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`
        }
      }
    );

    return {
      success: true,
      data: response.data.data || [],
      count: response.data.info?.count || 0
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
}

// Usage
const results = await searchRecords('Leads', 'Email', 'john@example.com');
```

**Pattern: Search with Multiple Criteria**

```javascript
async function advancedSearch(module, criteria) {
  const criteriaString = criteria
    .map(c => `(${c.field}:${c.operator}:${c.value})`)
    .join('and');

  try {
    const response = await axios.get(
      `${API_DOMAIN}/crm/v8/${module}/search`,
      {
        params: { criteria: criteriaString },
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`
        }
      }
    );

    return {
      success: true,
      data: response.data.data || []
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
}

// Usage
const results = await advancedSearch('Leads', [
  { field: 'Lead_Status', operator: 'equals', value: 'Qualified' },
  { field: 'Annual_Revenue', operator: 'greater_than', value: '100000' }
]);
```

### COQL Query Pattern

**Pattern: Complex Query with COQL**

```javascript
async function executeQuery(query) {
  try {
    const response = await axios.get(
      `${API_DOMAIN}/crm/v8/coql`,
      {
        params: { select_query: query },
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`
        }
      }
    );

    return {
      success: true,
      data: response.data.data || [],
      info: response.data.info
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
}

// Usage - Get qualified leads with high revenue
const query = `
  SELECT First_Name, Last_Name, Email, Annual_Revenue, Company
  FROM Leads
  WHERE Lead_Status = 'Qualified'
    AND Annual_Revenue > 100000
  ORDER BY Annual_Revenue DESC
  LIMIT 50
`;

const results = await executeQuery(query);

// Usage - Join leads with related contacts
const joinQuery = `
  SELECT Leads.First_Name, Leads.Last_Name, Contacts.Email
  FROM Leads
  INNER JOIN Contacts ON Leads.id = Contacts.Lead_Id
  WHERE Leads.Lead_Status = 'Qualified'
`;

const joinResults = await executeQuery(joinQuery);
```

---

## Bulk Operations

### Bulk Create

**Pattern: Create Multiple Records**

```javascript
async function bulkCreate(module, records) {
  const batches = [];

  // Split into batches of 100
  for (let i = 0; i < records.length; i += 100) {
    batches.push(records.slice(i, i + 100));
  }

  const results = [];

  for (const batch of batches) {
    try {
      const response = await axios.post(
        `${API_DOMAIN}/crm/v8/${module}`,
        { data: batch },
        {
          headers: {
            'Authorization': `Zoho-oauthtoken ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      results.push(...response.data.data);
    } catch (error) {
      console.error('Batch create error:', error);
      results.push({
        success: false,
        error: error.message,
        batch
      });
    }

    // Rate limit delay
    await sleep(1000);
  }

  return results;
}

// Usage
const leads = [
  { First_Name: 'John', Last_Name: 'Doe', Email: 'john@example.com' },
  { First_Name: 'Jane', Last_Name: 'Smith', Email: 'jane@example.com' },
  // ... up to 10,000 records
];

const results = await bulkCreate('Leads', leads);
console.log(`Created ${results.filter(r => r.code === 'SUCCESS').length} records`);
```

### Bulk Update

**Pattern: Update Multiple Records**

```javascript
async function bulkUpdate(module, updates) {
  const batches = [];

  // Split into batches of 100
  for (let i = 0; i < updates.length; i += 100) {
    batches.push(updates.slice(i, i + 100));
  }

  const results = [];

  for (const batch of batches) {
    try {
      const response = await axios.put(
        `${API_DOMAIN}/crm/v8/${module}`,
        { data: batch },
        {
          headers: {
            'Authorization': `Zoho-oauthtoken ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      results.push(...response.data.data);
    } catch (error) {
      console.error('Batch update error:', error);
      results.push({
        success: false,
        error: error.message,
        batch
      });
    }

    await sleep(1000);
  }

  return results;
}

// Usage
const updates = [
  { id: '12345000000234567', Lead_Status: 'Qualified' },
  { id: '12345000000234568', Lead_Status: 'Qualified' },
  // ... up to 10,000 records
];

const results = await bulkUpdate('Leads', updates);
```

### Bulk Delete

**Pattern: Delete Multiple Records**

```javascript
async function bulkDelete(module, recordIds) {
  const batches = [];

  // Split into batches of 100
  for (let i = 0; i < recordIds.length; i += 100) {
    batches.push(recordIds.slice(i, i + 100));
  }

  const results = [];

  for (const batch of batches) {
    try {
      const response = await axios.delete(
        `${API_DOMAIN}/crm/v8/${module}`,
        {
          params: { ids: batch.join(',') },
          headers: {
            'Authorization': `Zoho-oauthtoken ${accessToken}`
          }
        }
      );

      results.push(...response.data.data);
    } catch (error) {
      console.error('Batch delete error:', error);
      results.push({
        success: false,
        error: error.message,
        batch
      });
    }

    await sleep(1000);
  }

  return results;
}

// Usage
const idsToDelete = ['12345000000234567', '12345000000234568', /* ... */];
const results = await bulkDelete('Leads', idsToDelete);
```

---

## Data Synchronization

### One-Way Sync (Source → Destination)

**Pattern: Sync Records from One System to Zoho**

```javascript
class OneWaySync {
  constructor(source, destination) {
    this.source = source;
    this.destination = destination;
  }

  async sync(module) {
    console.log(`Starting one-way sync for ${module}`);

    // Get records from source
    const sourceRecords = await this.source.getAllRecords(module);

    // Get existing records from destination
    const destRecords = await this.destination.getAllRecords(module);
    const destRecordsMap = new Map(destRecords.map(r => [r.external_id, r]));

    const toCreate = [];
    const toUpdate = [];

    for (const sourceRecord of sourceRecords) {
      const existingRecord = destRecordsMap.get(sourceRecord.id);

      if (!existingRecord) {
        // New record - create
        toCreate.push({
          ...sourceRecord,
          external_id: sourceRecord.id
        });
      } else if (this.hasChanged(sourceRecord, existingRecord)) {
        // Existing record changed - update
        toUpdate.push({
          id: existingRecord.id,
          ...sourceRecord
        });
      }
    }

    // Create new records
    if (toCreate.length > 0) {
      console.log(`Creating ${toCreate.length} new records`);
      await this.destination.bulkCreate(module, toCreate);
    }

    // Update existing records
    if (toUpdate.length > 0) {
      console.log(`Updating ${toUpdate.length} existing records`);
      await this.destination.bulkUpdate(module, toUpdate);
    }

    console.log(`Sync complete for ${module}`);
  }

  hasChanged(source, dest) {
    // Compare relevant fields to detect changes
    const fieldsToCompare = ['First_Name', 'Last_Name', 'Email', 'Phone', 'Company'];

    return fieldsToCompare.some(field =>
      source[field] !== dest[field]
    );
  }
}

// Usage
const sync = new OneWaySync(externalSystem, zohoAPI);
await sync.sync('Leads');
```

### Two-Way Sync (Bidirectional)

**Pattern: Bidirectional Sync with Conflict Resolution**

```javascript
class TwoWaySync {
  constructor(systemA, systemB) {
    this.systemA = systemA;
    this.systemB = systemB;
  }

  async sync(module) {
    console.log(`Starting two-way sync for ${module}`);

    const recordsA = await this.systemA.getAllRecords(module);
    const recordsB = await this.systemB.getAllRecords(module);

    const mapA = new Map(recordsA.map(r => [r.sync_id, r]));
    const mapB = new Map(recordsB.map(r => [r.sync_id, r]));

    const toCreateInA = [];
    const toCreateInB = [];
    const toUpdateInA = [];
    const toUpdateInB = [];

    // Find records to create/update in System A
    for (const [syncId, recordB] of mapB) {
      const recordA = mapA.get(syncId);

      if (!recordA) {
        toCreateInA.push(recordB);
      } else if (this.shouldUpdate(recordB, recordA)) {
        toUpdateInA.push(recordB);
      }
    }

    // Find records to create/update in System B
    for (const [syncId, recordA] of mapA) {
      const recordB = mapB.get(syncId);

      if (!recordB) {
        toCreateInB.push(recordA);
      } else if (this.shouldUpdate(recordA, recordB)) {
        toUpdateInB.push(recordA);
      }
    }

    // Execute sync operations
    await Promise.all([
      this.systemA.bulkCreate(module, toCreateInA),
      this.systemA.bulkUpdate(module, toUpdateInA),
      this.systemB.bulkCreate(module, toCreateInB),
      this.systemB.bulkUpdate(module, toUpdateInB)
    ]);

    console.log(`Two-way sync complete for ${module}`);
  }

  shouldUpdate(source, dest) {
    // Compare modified timestamps
    const sourceTime = new Date(source.Modified_Time);
    const destTime = new Date(dest.Modified_Time);

    return sourceTime > destTime;
  }
}

// Usage
const sync = new TwoWaySync(zohoCRM, externalCRM);
await sync.sync('Contacts');
```

### Incremental Sync Pattern

**Pattern: Sync Only Changed Records**

```javascript
class IncrementalSync {
  constructor(source, destination, stateManager) {
    this.source = source;
    this.destination = destination;
    this.stateManager = stateManager;
  }

  async sync(module) {
    // Get last sync timestamp
    const lastSync = await this.stateManager.getLastSync(module);

    console.log(`Syncing ${module} changes since ${lastSync}`);

    // Get records modified since last sync
    const modifiedRecords = await this.source.getModifiedRecords(
      module,
      lastSync
    );

    if (modifiedRecords.length === 0) {
      console.log('No changes to sync');
      return;
    }

    console.log(`Found ${modifiedRecords.length} modified records`);

    // Sync to destination
    await this.destination.upsertRecords(module, modifiedRecords);

    // Update last sync timestamp
    await this.stateManager.setLastSync(module, new Date());

    console.log(`Sync complete for ${module}`);
  }
}

// Usage
const stateManager = new StateManager();
const sync = new IncrementalSync(zohoCRM, externalSystem, stateManager);

// Run sync every hour
setInterval(() => sync.sync('Leads'), 3600000);
```

---

## Webhook Patterns

### Basic Webhook Handler

**Pattern: Express.js Webhook Endpoint**

```javascript
const express = require('express');
const app = express();

app.use(express.json());

app.post('/webhooks/zoho/:product', async (req, res) => {
  const product = req.params.product;
  const webhook = req.body;

  try {
    // Verify webhook (if token present)
    if (webhook.token && webhook.token !== WEBHOOK_TOKEN) {
      return res.status(401).send('Unauthorized');
    }

    // Add to processing queue
    await queue.add({ product, webhook });

    // Respond immediately
    res.status(200).send('OK');

    // Process webhook asynchronously
    await processWebhook(product, webhook);
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Error');
  }
});

async function processWebhook(product, webhook) {
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
  }
}

app.listen(3000, () => {
  console.log('Webhook server running on port 3000');
});
```

### Webhook with Retry Logic

**Pattern: Handle Failed Webhooks**

```javascript
const Queue = require('bull');
const webhookQueue = new Queue('webhooks');

webhookQueue.process(async (job) => {
  const { product, webhook } = job.data;
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await processWebhook(product, webhook);
      return;  // Success
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);

      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        await sleep(delay);
      } else {
        // All retries failed - log to dead letter queue
        await deadLetterQueue.add({ product, webhook, error: error.message });
        throw error;
      }
    }
  }
});
```

---

## Authentication Patterns

### OAuth Token Manager

**Pattern: Automatic Token Refresh**

```javascript
class OAuthTokenManager {
  constructor(config) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.refreshToken = config.refreshToken;
    this.accessToken = null;
    this.expiresAt = 0;
  }

  async getToken() {
    if (this.accessToken && Date.now() < this.expiresAt - 300000) {
      return this.accessToken;
    }

    return await this.refreshAccessToken();
  }

  async refreshAccessToken() {
    const response = await axios.post(
      'https://accounts.zoho.com/oauth/v2/token',
      null,
      {
        params: {
          grant_type: 'refresh_token',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: this.refreshToken
        }
      }
    );

    this.accessToken = response.data.access_token;
    this.expiresAt = Date.now() + (response.data.expires_in * 1000);

    return this.accessToken;
  }

  async makeAuthenticatedRequest(url, options = {}) {
    const token = await this.getToken();

    return axios({
      url,
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Zoho-oauthtoken ${token}`
      }
    });
  }
}

// Usage
const authManager = new OAuthTokenManager({
  clientId: process.env.ZOHO_CLIENT_ID,
  clientSecret: process.env.ZOHO_CLIENT_SECRET,
  refreshToken: process.env.ZOHO_REFRESH_TOKEN
});

const response = await authManager.makeAuthenticatedRequest(
  'https://www.zohoapis.com/crm/v8/Leads'
);
```

---

## Error Handling Patterns

### Retry with Exponential Backoff

**Pattern: Automatic Retry**

```javascript
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isLastAttempt = attempt === maxRetries;
      const isRetryable = [429, 500, 502, 503, 504].includes(
        error.response?.status
      );

      if (isLastAttempt || !isRetryable) {
        throw error;
      }

      const delay = Math.pow(2, attempt) * 1000;
      console.log(`Retry attempt ${attempt + 1} after ${delay}ms`);
      await sleep(delay);
    }
  }
}

// Usage
const lead = await retryWithBackoff(() =>
  zohoAPI.getRecord('Leads', leadId)
);
```

---

## Caching Patterns

### Redis Cache

**Pattern: Cache API Responses**

```javascript
const Redis = require('ioredis');
const redis = new Redis();

async function getWithCache(key, fetchFn, ttl = 300) {
  // Check cache
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached);
  }

  // Fetch from API
  const data = await fetchFn();

  // Store in cache
  await redis.setex(key, ttl, JSON.stringify(data));

  return data;
}

// Usage
const lead = await getWithCache(
  `lead_${leadId}`,
  () => zohoAPI.getRecord('Leads', leadId),
  300  // 5 minutes TTL
);
```

---

**Last Updated**: December 2025
**Guide Version**: 1.0
