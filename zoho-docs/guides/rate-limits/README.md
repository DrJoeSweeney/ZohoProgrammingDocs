# Rate Limits Guide for Zoho APIs

## Overview

This guide consolidates rate limit information for all Zoho products and provides strategies for handling rate limits effectively in your applications.

---

## Table of Contents

1. [Understanding Rate Limits](#understanding-rate-limits)
2. [Rate Limits by Product](#rate-limits-by-product)
3. [Rate Limit Headers](#rate-limit-headers)
4. [Handling Rate Limits](#handling-rate-limits)
5. [Best Practices](#best-practices)
6. [Code Examples](#code-examples)
7. [Monitoring](#monitoring)

---

## Understanding Rate Limits

### What are Rate Limits?

Rate limits control how many API requests you can make within a specific time period. They protect Zoho's infrastructure and ensure fair usage across all customers.

### Types of Rate Limits

1. **Requests Per Day**: Total API calls allowed in 24 hours
2. **Requests Per Minute**: API calls allowed per minute
3. **Concurrent Connections**: Simultaneous API requests allowed
4. **Bulk Operation Limits**: Records per bulk API call

### Common Patterns

- **Tier-Based**: Limits increase with higher subscription tiers
- **Org-Based**: Limits apply per organization, not per user
- **Endpoint-Specific**: Some endpoints have separate limits
- **Bulk vs Standard**: Bulk APIs often have higher limits

---

## Rate Limits by Product

### Sales & Marketing

#### Zoho CRM

| Edition | Calls/Day | Calls/Min | Concurrent | Notes |
|---------|-----------|-----------|------------|-------|
| Free | 5,000 | - | 10 | Basic tier |
| Standard | 10,000 | - | 10 | - |
| Professional | 25,000 | - | 10 | - |
| Enterprise | 50,000 | - | 10 | - |
| Ultimate | 100,000 | - | 10 | Highest tier |

**Bulk API Limits**:
- Maximum 200,000 records per bulk operation
- Maximum 25,000 records for bulk write per API call

**Special Limits**:
- COQL queries: Same as regular API limits
- Composite API: Max 5 API calls per composite request

#### Zoho Campaigns

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Free | 2,500 | 30 | Limited features |
| Standard | 5,000 | 60 | Standard access |
| Professional | 10,000 | 100 | Enhanced limits |
| Enterprise | 25,000 | 150 | Highest tier |

#### Zoho SalesIQ

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Free | 1,000 | 20 | Basic tier |
| Basic | 5,000 | 50 | - |
| Professional | 10,000 | 100 | - |
| Enterprise | 25,000 | 150 | Highest tier |

#### Zoho Social

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Free | 1,000 | 20 | Limited access |
| Standard | 5,000 | 50 | - |
| Professional | 10,000 | 100 | - |
| Premium | 20,000 | 150 | Highest tier |

#### Zoho Bigin

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Express | 2,500 | 30 | Small business |
| Premier | 5,000 | 60 | Enhanced |

#### Zoho Marketing Automation

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Standard | 5,000 | 50 | - |
| Professional | 10,000 | 100 | - |
| Enterprise | 25,000 | 150 | Highest tier |

#### Zoho PageSense

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Free | 1,000 | 20 | Basic |
| Premium | 5,000 | 50 | Enhanced |
| Enterprise | 15,000 | 100 | Highest tier |

---

### Analytics & Reporting

#### Zoho Analytics

| Edition | Calls/Day | Calls/Min | Notes |
|---------|-----------|-----------|-------|
| Basic | 10,000 | 100 | Small teams |
| Standard | 50,000 | 200 | Medium teams |
| Premium | 100,000 | 300 | Large teams |
| Enterprise | 500,000 | 500 | Enterprise grade |

**Export Limits**:
- Maximum 100,000 rows per export operation
- Large exports use job-based system

#### Zoho Lens

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Standard | 5,000 | 50 | - |
| Professional | 10,000 | 100 | - |
| Enterprise | 25,000 | 150 | Highest tier |

#### Zoho DataPrep

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Standard | 5,000 | 50 | - |
| Professional | 10,000 | 100 | - |
| Enterprise | 25,000 | 150 | Highest tier |

---

### Finance & Accounting

#### Zoho Books

| Plan | Calls/Day | Calls/Min | Concurrent | Notes |
|------|-----------|-----------|------------|-------|
| Free | 2,500 | 100 | 10 | Limited |
| Standard | 10,000 | 100 | 10 | - |
| Professional | 25,000 | 100 | 10 | - |
| Premium | 50,000 | 100 | 10 | Highest tier |

**Notes**:
- Requires organization_id in all requests
- 100 requests per minute across all API calls

#### Zoho Invoice

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Free | 2,500 | 100 | Basic |
| Standard | 10,000 | 100 | - |
| Professional | 25,000 | 100 | - |
| Premium | 50,000 | 100 | Highest tier |

#### Zoho Expense

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Standard | 5,000 | 100 | - |
| Premium | 15,000 | 100 | - |
| Enterprise | 30,000 | 100 | Highest tier |

#### Zoho Subscriptions

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Basic | 2,500 | 100 | Small business |
| Standard | 10,000 | 100 | - |
| Professional | 25,000 | 100 | - |
| Enterprise | 50,000 | 100 | Highest tier |

#### Zoho Finance Plus

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Standard | 25,000 | 100 | - |
| Professional | 50,000 | 100 | - |
| Enterprise | 100,000 | 150 | Highest tier |

#### Zoho Payroll

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Standard | 5,000 | 50 | - |
| Professional | 10,000 | 100 | - |
| Enterprise | 25,000 | 150 | Highest tier |

---

### E-Commerce & Inventory

#### Zoho Inventory

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Free | 2,500 | 100 | Limited |
| Standard | 10,000 | 100 | - |
| Professional | 25,000 | 100 | - |
| Premium | 50,000 | 100 | Highest tier |

#### Zoho Commerce

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Starter | 5,000 | 50 | Small store |
| Professional | 15,000 | 100 | - |
| Enterprise | 50,000 | 150 | Large store |

#### Zoho Bookings

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Basic | 2,500 | 50 | - |
| Premium | 10,000 | 100 | - |
| Enterprise | 25,000 | 150 | Highest tier |

---

### HR & Recruitment

#### Zoho People

| Edition | Calls/Day | Calls/Min | Notes |
|---------|-----------|-----------|-------|
| Essential | 5,000 | 50 | Basic |
| Professional | 15,000 | 100 | - |
| Premium | 30,000 | 150 | - |
| Enterprise | 50,000 | 200 | Highest tier |

#### Zoho Recruit

| Edition | Calls/Day | Calls/Min | Notes |
|---------|-----------|-----------|-------|
| Free | 2,500 | 30 | Limited |
| Standard | 10,000 | 60 | - |
| Professional | 25,000 | 100 | - |
| Enterprise | 50,000 | 150 | Highest tier |

#### Zoho Workerly

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Standard | 5,000 | 50 | - |
| Professional | 10,000 | 100 | - |
| Enterprise | 25,000 | 150 | Highest tier |

---

### Project Management

#### Zoho Projects

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Free | 2,500 | 50 | Limited |
| Premium | 10,000 | 100 | - |
| Enterprise | 25,000 | 150 | Highest tier |

**Notes**:
- v4 API (current): Enhanced rate limits
- v3 API (deprecated): Lower limits

#### Zoho Sprints

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Free | 2,500 | 50 | Limited |
| Premium | 10,000 | 100 | - |
| Enterprise | 25,000 | 150 | Highest tier |

#### Zoho Backstage

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Standard | 5,000 | 50 | - |
| Professional | 10,000 | 100 | - |
| Enterprise | 25,000 | 150 | Highest tier |

---

### Customer Support

#### Zoho Desk

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Free | 2,000 | 50 | Limited |
| Standard | 10,000 | 100 | - |
| Professional | 25,000 | 150 | - |
| Enterprise | 50,000 | 200 | Highest tier |

**Bulk Operations**:
- Maximum 100 records per bulk operation

#### Zoho Assist

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Standard | 5,000 | 50 | - |
| Professional | 10,000 | 100 | - |
| Enterprise | 25,000 | 150 | Highest tier |

---

### Productivity & Collaboration

#### Zoho Mail

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Free | 1,000 | 20 | Personal use |
| Mail Lite | 5,000 | 50 | - |
| Mail Premium | 15,000 | 100 | - |
| Workplace | 30,000 | 150 | Highest tier |

#### Zoho Meeting

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Free | 1,000 | 20 | Limited |
| Standard | 5,000 | 50 | - |
| Professional | 10,000 | 100 | - |
| Enterprise | 25,000 | 150 | Highest tier |

#### Zoho Cliq

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Free | 2,500 | 50 | Limited |
| Standard | 10,000 | 100 | - |
| Enterprise | 25,000 | 150 | Highest tier |

#### Zoho Connect

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Free | 2,500 | 50 | Limited |
| Premium | 10,000 | 100 | - |
| Enterprise | 25,000 | 150 | Highest tier |

#### Zoho Writer

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Free | 1,000 | 20 | Personal |
| Standard | 5,000 | 50 | - |
| Premium | 15,000 | 100 | Highest tier |

#### Zoho Sheet

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Free | 1,000 | 20 | Personal |
| Standard | 5,000 | 50 | - |
| Premium | 15,000 | 100 | Highest tier |

#### Zoho Show

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Free | 1,000 | 20 | Personal |
| Standard | 5,000 | 50 | - |
| Premium | 15,000 | 100 | Highest tier |

#### Zoho Notebook

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Free | 2,500 | 50 | Personal |
| Premium | 10,000 | 100 | Enhanced |

#### Zoho WorkDrive

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Starter | 5,000 | 50 | Small team |
| Team | 15,000 | 100 | - |
| Business | 30,000 | 150 | Large team |

---

### Forms & Surveys

#### Zoho Forms

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Basic | 2,500 | 50 | Limited |
| Standard | 10,000 | 100 | - |
| Professional | 25,000 | 150 | Highest tier |

#### Zoho Survey

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Free | 1,000 | 20 | Limited |
| Plus | 5,000 | 50 | - |
| Enterprise | 15,000 | 100 | Highest tier |

---

### Development & Integration

#### Zoho Creator

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Basic | 5,000 | 100 | - |
| Premium | 25,000 | 200 | - |
| Enterprise | 100,000 | 300 | Highest tier |

**ZCQL Limits**:
- 200 queries per minute
- 10,000 queries per day

#### Zoho Flow

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Free | 1,000 | 20 | Testing |
| Standard | 10,000 | 100 | - |
| Professional | 50,000 | 200 | - |
| Enterprise | 200,000 | 500 | Highest tier |

#### Zoho Catalyst

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Free | 10,000 | 100 | Development |
| Starter | 50,000 | 200 | - |
| Professional | 250,000 | 500 | - |
| Enterprise | 1,000,000 | 1,000 | Highest tier |

#### Zoho IoT

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Standard | 10,000 | 100 | - |
| Professional | 50,000 | 200 | - |
| Enterprise | 100,000 | 500 | Highest tier |

#### Zoho Office Integrator

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Free | 1,000 | 20 | Testing |
| Standard | 10,000 | 100 | - |
| Premium | 50,000 | 200 | Highest tier |

---

### Events & Learning

#### Zoho Webinar

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Free | 1,000 | 20 | Limited |
| Standard | 5,000 | 50 | - |
| Professional | 10,000 | 100 | - |
| Enterprise | 25,000 | 150 | Highest tier |

#### Zoho Learn

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Express | 2,500 | 50 | - |
| Professional | 10,000 | 100 | - |
| Enterprise | 25,000 | 150 | Highest tier |

#### Zoho Thrive

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Standard | 5,000 | 50 | - |
| Professional | 10,000 | 100 | - |
| Enterprise | 25,000 | 150 | Highest tier |

---

### Security & IT Management

#### Zoho Vault

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Standard | 5,000 | 50 | - |
| Professional | 10,000 | 100 | - |
| Enterprise | 25,000 | 150 | Highest tier |

#### Zoho Sites

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Free | 1,000 | 20 | Personal |
| Starter | 5,000 | 50 | - |
| Professional | 15,000 | 100 | Highest tier |

---

### Testing & Quality

#### Zoho BugTracker

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Free | 2,500 | 50 | Limited |
| Standard | 10,000 | 100 | - |
| Enterprise | 25,000 | 150 | Highest tier |

#### Zoho TestHub

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Standard | 5,000 | 50 | - |
| Professional | 10,000 | 100 | - |
| Enterprise | 25,000 | 150 | Highest tier |

---

### Document Management

#### Zoho Sign

| Plan | Calls/Day | Calls/Min | Notes |
|------|-----------|-----------|-------|
| Free | 1,000 | 20 | Limited |
| Standard | 5,000 | 50 | - |
| Professional | 15,000 | 100 | - |
| Enterprise | 30,000 | 150 | Highest tier |

---

## Rate Limit Headers

### Standard Headers

Zoho APIs return rate limit information in response headers:

```http
X-RateLimit-Limit: 10000
X-RateLimit-Remaining: 9875
X-RateLimit-Reset: 1642147200
```

**Header Definitions**:
- `X-RateLimit-Limit`: Total requests allowed in current window
- `X-RateLimit-Remaining`: Requests remaining in current window
- `X-RateLimit-Reset`: Unix timestamp when limit resets

### Reading Headers

```javascript
const response = await axios.get('https://www.zohoapis.com/crm/v8/Leads', {
  headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}` }
});

const limit = response.headers['x-ratelimit-limit'];
const remaining = response.headers['x-ratelimit-remaining'];
const reset = response.headers['x-ratelimit-reset'];

console.log(`Rate Limit: ${remaining}/${limit} remaining`);
console.log(`Resets at: ${new Date(reset * 1000).toLocaleString()}`);
```

### Rate Limit Exceeded Response

**HTTP Status**: 429 Too Many Requests

```json
{
  "code": "RATE_LIMIT_EXCEEDED",
  "details": {},
  "message": "The API request rate limit has been exceeded for this resource. Please try again after some time.",
  "status": "error"
}
```

---

## Handling Rate Limits

### Strategy 1: Exponential Backoff

Wait progressively longer periods between retries:

```javascript
async function makeRequestWithBackoff(url, options, maxRetries = 5) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios({
        url,
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Zoho-oauthtoken ${accessToken}`
        }
      });

      return response.data;
    } catch (error) {
      if (error.response?.status === 429 && attempt < maxRetries) {
        // Calculate exponential backoff: 2^attempt seconds
        const waitTime = Math.pow(2, attempt) * 1000;
        console.log(`Rate limit hit. Retrying in ${waitTime}ms...`);
        await sleep(waitTime);
        continue;
      }

      throw error;
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

### Strategy 2: Respect Reset Time

Wait until rate limit resets:

```javascript
async function makeRequestRespectingLimits(url, options) {
  try {
    const response = await axios({
      url,
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    });

    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      const resetTime = error.response.headers['x-ratelimit-reset'];

      if (resetTime) {
        const waitTime = (resetTime * 1000) - Date.now();
        console.log(`Rate limit exceeded. Waiting ${waitTime}ms until reset...`);
        await sleep(waitTime + 1000);  // Add 1 second buffer

        // Retry request
        return makeRequestRespectingLimits(url, options);
      }
    }

    throw error;
  }
}
```

### Strategy 3: Request Queue

Queue requests to control rate:

```javascript
class RateLimitedQueue {
  constructor(maxRequestsPerMinute) {
    this.maxRequestsPerMinute = maxRequestsPerMinute;
    this.queue = [];
    this.requestTimes = [];
    this.processing = false;
  }

  async enqueue(requestFn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ requestFn, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0) {
      // Remove request times older than 1 minute
      const oneMinuteAgo = Date.now() - 60000;
      this.requestTimes = this.requestTimes.filter(time => time > oneMinuteAgo);

      // Check if we can make a request
      if (this.requestTimes.length >= this.maxRequestsPerMinute) {
        // Wait until oldest request is 1 minute old
        const oldestRequest = this.requestTimes[0];
        const waitTime = 60000 - (Date.now() - oldestRequest);
        await sleep(waitTime + 100);  // Add small buffer
        continue;
      }

      // Make request
      const { requestFn, resolve, reject } = this.queue.shift();
      this.requestTimes.push(Date.now());

      try {
        const result = await requestFn();
        resolve(result);
      } catch (error) {
        reject(error);
      }

      // Small delay between requests
      await sleep(100);
    }

    this.processing = false;
  }
}

// Usage
const queue = new RateLimitedQueue(100);  // 100 requests per minute

// Enqueue multiple requests
const promises = leads.map(lead =>
  queue.enqueue(() => updateLead(lead.id, lead.updates))
);

const results = await Promise.all(promises);
```

### Strategy 4: Monitor and Throttle

Track usage and proactively throttle:

```javascript
class RateLimitMonitor {
  constructor(dailyLimit, minuteLimit) {
    this.dailyLimit = dailyLimit;
    this.minuteLimit = minuteLimit;
    this.dailyCount = 0;
    this.minuteCount = 0;
    this.dailyResetTime = this.getNextDayReset();
    this.minuteResetTime = this.getNextMinuteReset();
  }

  getNextDayReset() {
    const tomorrow = new Date();
    tomorrow.setHours(24, 0, 0, 0);
    return tomorrow.getTime();
  }

  getNextMinuteReset() {
    return Date.now() + 60000;
  }

  async checkAndWait() {
    // Reset counters if needed
    if (Date.now() >= this.dailyResetTime) {
      this.dailyCount = 0;
      this.dailyResetTime = this.getNextDayReset();
    }

    if (Date.now() >= this.minuteResetTime) {
      this.minuteCount = 0;
      this.minuteResetTime = this.getNextMinuteReset();
    }

    // Check daily limit
    if (this.dailyCount >= this.dailyLimit) {
      const waitTime = this.dailyResetTime - Date.now();
      console.log(`Daily limit reached. Waiting ${waitTime}ms...`);
      await sleep(waitTime + 1000);
      return this.checkAndWait();
    }

    // Check minute limit
    if (this.minuteCount >= this.minuteLimit) {
      const waitTime = this.minuteResetTime - Date.now();
      console.log(`Minute limit reached. Waiting ${waitTime}ms...`);
      await sleep(waitTime + 100);
      return this.checkAndWait();
    }

    // Increment counters
    this.dailyCount++;
    this.minuteCount++;
  }

  async makeRequest(requestFn) {
    await this.checkAndWait();

    try {
      return await requestFn();
    } catch (error) {
      if (error.response?.status === 429) {
        // If we still hit limit, wait and retry
        console.log('Unexpected rate limit. Waiting 60 seconds...');
        await sleep(60000);
        return this.makeRequest(requestFn);
      }

      throw error;
    }
  }
}

// Usage
const monitor = new RateLimitMonitor(10000, 100);  // 10k/day, 100/min

const response = await monitor.makeRequest(() =>
  axios.get('https://www.zohoapis.com/crm/v8/Leads', {
    headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}` }
  })
);
```

---

## Best Practices

### 1. Monitor Usage

Track your API usage to avoid surprises:

```javascript
class UsageTracker {
  constructor() {
    this.dailyCount = 0;
    this.resetTime = this.getNextReset();
  }

  getNextReset() {
    const tomorrow = new Date();
    tomorrow.setHours(24, 0, 0, 0);
    return tomorrow.getTime();
  }

  trackRequest(response) {
    if (Date.now() >= this.resetTime) {
      this.dailyCount = 0;
      this.resetTime = this.getNextReset();
    }

    this.dailyCount++;

    const remaining = response.headers['x-ratelimit-remaining'];
    const limit = response.headers['x-ratelimit-limit'];

    console.log(`API Usage: ${this.dailyCount} calls today | ${remaining}/${limit} remaining in window`);

    // Alert if approaching limit
    if (remaining < limit * 0.1) {  // 10% remaining
      console.warn('⚠️  WARNING: Approaching rate limit!');
    }
  }
}
```

### 2. Use Bulk APIs When Possible

Reduce API calls by batching operations:

```javascript
// ❌ BAD: 100 API calls
for (const lead of leads) {
  await createLead(lead);
}

// ✅ GOOD: 1 API call (up to 100 records)
await createLeadsBulk(leads);
```

### 3. Cache Data

Reduce API calls by caching frequently accessed data:

```javascript
class DataCache {
  constructor(ttl = 300000) {  // 5 minutes default TTL
    this.cache = new Map();
    this.ttl = ttl;
  }

  get(key) {
    const item = this.cache.get(key);

    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      expiry: Date.now() + this.ttl
    });
  }
}

// Usage
const cache = new DataCache();

async function getLeads() {
  const cached = cache.get('leads');
  if (cached) return cached;

  const leads = await fetchLeadsFromAPI();
  cache.set('leads', leads);
  return leads;
}
```

### 4. Optimize Query Patterns

Be specific in your queries to reduce data transfer:

```javascript
// ❌ BAD: Fetches all fields
const leads = await getLeads();

// ✅ GOOD: Fetch only needed fields
const leads = await getLeads({ fields: 'First_Name,Last_Name,Email,Phone' });
```

### 5. Implement Circuit Breaker

Prevent cascading failures:

```javascript
class CircuitBreaker {
  constructor(failureThreshold = 5, resetTimeout = 60000) {
    this.failureThreshold = failureThreshold;
    this.resetTimeout = resetTimeout;
    this.failures = 0;
    this.state = 'CLOSED';  // CLOSED, OPEN, HALF_OPEN
    this.nextAttempt = Date.now();
  }

  async execute(requestFn) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }

      this.state = 'HALF_OPEN';
    }

    try {
      const result = await requestFn();

      // Success - reset failures
      if (this.state === 'HALF_OPEN') {
        this.state = 'CLOSED';
        this.failures = 0;
      }

      return result;
    } catch (error) {
      this.failures++;

      if (this.failures >= this.failureThreshold) {
        this.state = 'OPEN';
        this.nextAttempt = Date.now() + this.resetTimeout;
        console.error('Circuit breaker opened!');
      }

      throw error;
    }
  }
}
```

---

## Code Examples

### Complete Rate Limit Handler (Node.js)

```javascript
const axios = require('axios');

class ZohoRateLimitHandler {
  constructor(config) {
    this.accessToken = config.accessToken;
    this.apiDomain = config.apiDomain;
    this.dailyLimit = config.dailyLimit || 10000;
    this.minuteLimit = config.minuteLimit || 100;

    this.dailyCount = 0;
    this.minuteCount = 0;
    this.queue = [];
    this.processing = false;
  }

  async makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        url,
        options,
        resolve,
        reject
      });

      this.processQueue();
    });
  }

  async processQueue() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0) {
      // Check if we should throttle
      await this.checkThrottling();

      const { url, options, resolve, reject } = this.queue.shift();

      try {
        const response = await axios({
          url: `${this.apiDomain}${url}`,
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Zoho-oauthtoken ${this.accessToken}`
          }
        });

        // Track usage
        this.dailyCount++;
        this.minuteCount++;

        // Log usage
        const remaining = response.headers['x-ratelimit-remaining'];
        console.log(`Request successful. ${remaining} calls remaining.`);

        resolve(response.data);
      } catch (error) {
        if (error.response?.status === 429) {
          // Rate limit hit - requeue request
          console.log('Rate limit hit. Requeueing request...');
          this.queue.unshift({ url, options, resolve, reject });
          await this.handleRateLimitError(error);
          continue;
        }

        reject(error);
      }

      // Small delay between requests
      await this.sleep(100);
    }

    this.processing = false;
  }

  async checkThrottling() {
    // Reset minute counter every minute
    if (!this.minuteResetTime) {
      this.minuteResetTime = Date.now() + 60000;
    }

    if (Date.now() >= this.minuteResetTime) {
      this.minuteCount = 0;
      this.minuteResetTime = Date.now() + 60000;
    }

    // Check minute limit
    if (this.minuteCount >= this.minuteLimit * 0.9) {  // 90% of limit
      const waitTime = this.minuteResetTime - Date.now();
      console.log(`Approaching minute limit. Waiting ${waitTime}ms...`);
      await this.sleep(waitTime + 100);
    }

    // Check daily limit
    if (this.dailyCount >= this.dailyLimit * 0.9) {  // 90% of limit
      console.warn('Approaching daily limit!');
    }
  }

  async handleRateLimitError(error) {
    const resetTime = error.response?.headers['x-ratelimit-reset'];

    if (resetTime) {
      const waitTime = (resetTime * 1000) - Date.now() + 1000;
      console.log(`Waiting ${waitTime}ms for rate limit reset...`);
      await this.sleep(waitTime);
    } else {
      // Default backoff: 60 seconds
      await this.sleep(60000);
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Usage
const handler = new ZohoRateLimitHandler({
  accessToken: process.env.ZOHO_ACCESS_TOKEN,
  apiDomain: 'https://www.zohoapis.com',
  dailyLimit: 10000,
  minuteLimit: 100
});

// Make requests
const leads = await handler.makeRequest('/crm/v8/Leads', { method: 'GET' });
const contacts = await handler.makeRequest('/crm/v8/Contacts', { method: 'GET' });
```

### Python Rate Limit Handler

```python
import time
import requests
from datetime import datetime, timedelta
from collections import deque

class ZohoRateLimitHandler:
    def __init__(self, access_token, api_domain, daily_limit=10000, minute_limit=100):
        self.access_token = access_token
        self.api_domain = api_domain
        self.daily_limit = daily_limit
        self.minute_limit = minute_limit

        self.daily_count = 0
        self.minute_requests = deque()
        self.daily_reset_time = datetime.now() + timedelta(days=1)

    def make_request(self, url, method='GET', **kwargs):
        # Check and wait if needed
        self._check_throttling()

        # Make request
        full_url = f'{self.api_domain}{url}'
        headers = kwargs.get('headers', {})
        headers['Authorization'] = f'Zoho-oauthtoken {self.access_token}'
        kwargs['headers'] = headers

        try:
            response = requests.request(method, full_url, **kwargs)

            # Track usage
            self.daily_count += 1
            self.minute_requests.append(time.time())

            # Log usage
            remaining = response.headers.get('X-RateLimit-Remaining')
            print(f'Request successful. {remaining} calls remaining.')

            if response.status_code == 429:
                # Rate limit hit
                print('Rate limit exceeded. Waiting...')
                self._handle_rate_limit(response)
                return self.make_request(url, method, **kwargs)

            response.raise_for_status()
            return response.json()

        except requests.exceptions.RequestException as e:
            print(f'Request failed: {e}')
            raise

    def _check_throttling(self):
        # Reset daily counter if needed
        if datetime.now() >= self.daily_reset_time:
            self.daily_count = 0
            self.daily_reset_time = datetime.now() + timedelta(days=1)

        # Clean up old minute requests
        one_minute_ago = time.time() - 60
        while self.minute_requests and self.minute_requests[0] < one_minute_ago:
            self.minute_requests.popleft()

        # Check minute limit
        if len(self.minute_requests) >= self.minute_limit * 0.9:
            oldest_request = self.minute_requests[0]
            wait_time = 60 - (time.time() - oldest_request) + 0.1
            if wait_time > 0:
                print(f'Approaching minute limit. Waiting {wait_time:.1f}s...')
                time.sleep(wait_time)

        # Check daily limit
        if self.daily_count >= self.daily_limit * 0.9:
            print('⚠️  WARNING: Approaching daily limit!')

    def _handle_rate_limit(self, response):
        reset_time = response.headers.get('X-RateLimit-Reset')

        if reset_time:
            wait_time = int(reset_time) - time.time() + 1
            print(f'Waiting {wait_time:.0f}s for rate limit reset...')
            time.sleep(wait_time)
        else:
            # Default: wait 60 seconds
            print('Waiting 60s...')
            time.sleep(60)

# Usage
handler = ZohoRateLimitHandler(
    access_token=os.getenv('ZOHO_ACCESS_TOKEN'),
    api_domain='https://www.zohoapis.com',
    daily_limit=10000,
    minute_limit=100
)

# Make requests
leads = handler.make_request('/crm/v8/Leads')
contacts = handler.make_request('/crm/v8/Contacts')
```

---

## Monitoring

### Track API Usage

```javascript
// Simple usage tracker
class UsageLogger {
  constructor(logFile) {
    this.logFile = logFile;
    this.stats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      rateLimitErrors: 0,
      bytesTransferred: 0
    };
  }

  logRequest(request, response, error) {
    this.stats.totalRequests++;

    if (error) {
      this.stats.failedRequests++;
      if (error.response?.status === 429) {
        this.stats.rateLimitErrors++;
      }
    } else {
      this.stats.successfulRequests++;
      this.stats.bytesTransferred += JSON.stringify(response.data).length;
    }

    // Log to file or monitoring service
    console.log(this.getStats());
  }

  getStats() {
    return {
      ...this.stats,
      successRate: (this.stats.successfulRequests / this.stats.totalRequests * 100).toFixed(2) + '%',
      rateLimitHitRate: (this.stats.rateLimitErrors / this.stats.totalRequests * 100).toFixed(2) + '%'
    };
  }
}
```

### Alert on High Usage

```javascript
function checkUsageAlerts(remaining, limit) {
  const percentRemaining = (remaining / limit) * 100;

  if (percentRemaining <= 10) {
    sendAlert('CRITICAL', `Only ${percentRemaining}% of rate limit remaining!`);
  } else if (percentRemaining <= 25) {
    sendAlert('WARNING', `${percentRemaining}% of rate limit remaining`);
  }
}

function sendAlert(level, message) {
  // Send to logging service, email, Slack, etc.
  console.log(`[${level}] ${message}`);
}
```

---

## Summary

- **Know Your Limits**: Check your subscription tier's rate limits
- **Monitor Usage**: Track API calls and remaining quota
- **Handle Gracefully**: Implement retry logic with exponential backoff
- **Use Bulk APIs**: Batch operations to reduce API calls
- **Cache Data**: Reduce redundant API calls
- **Queue Requests**: Control request rate proactively
- **Alert on High Usage**: Set up monitoring and alerts

---

**Last Updated**: December 2025
**Guide Version**: 1.0
