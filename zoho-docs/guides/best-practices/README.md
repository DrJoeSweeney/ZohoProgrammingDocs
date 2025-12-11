# Best Practices for Zoho APIs

## Overview

This guide covers best practices for working with Zoho APIs, including security, performance optimization, error handling, testing, and monitoring strategies.

---

## Table of Contents

1. [Security Best Practices](#security-best-practices)
2. [Performance Optimization](#performance-optimization)
3. [Error Handling](#error-handling)
4. [API Design Patterns](#api-design-patterns)
5. [Testing Strategies](#testing-strategies)
6. [Monitoring & Logging](#monitoring--logging)
7. [Data Management](#data-management)
8. [Code Organization](#code-organization)

---

## Security Best Practices

### 1. Credential Management

**Never Hardcode Credentials**:

```javascript
// ❌ NEVER DO THIS
const CLIENT_SECRET = 'abcdef1234567890';
const REFRESH_TOKEN = '1000.xxxx.yyyy';

// ✅ DO THIS
const CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN;
```

**Use Environment Variables**:

```bash
# .env file
ZOHO_CLIENT_ID=1000.ABCDEFG123456
ZOHO_CLIENT_SECRET=your_secret_here
ZOHO_REFRESH_TOKEN=1000.refresh_token_here
ZOHO_API_DOMAIN=https://www.zohoapis.com
```

```javascript
require('dotenv').config();

const config = {
  clientId: process.env.ZOHO_CLIENT_ID,
  clientSecret: process.env.ZOHO_CLIENT_SECRET,
  refreshToken: process.env.ZOHO_REFRESH_TOKEN
};
```

**Encrypt Sensitive Data at Rest**:

```javascript
const crypto = require('crypto');

class SecureTokenStorage {
  constructor(encryptionKey) {
    this.algorithm = 'aes-256-gcm';
    this.key = Buffer.from(encryptionKey, 'hex');
  }

  encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  decrypt(encrypted, iv, authTag) {
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.key,
      Buffer.from(iv, 'hex')
    );

    decipher.setAuthTag(Buffer.from(authTag, 'hex'));

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}

// Usage
const storage = new SecureTokenStorage(process.env.ENCRYPTION_KEY);
const encrypted = storage.encrypt(refreshToken);
// Store encrypted.encrypted, encrypted.iv, encrypted.authTag in database
```

### 2. OAuth Security

**Use PKCE for Public Clients**:

```javascript
const crypto = require('crypto');

function generateCodeVerifier() {
  return crypto.randomBytes(32).toString('base64url');
}

function generateCodeChallenge(verifier) {
  return crypto
    .createHash('sha256')
    .update(verifier)
    .digest('base64url');
}

const codeVerifier = generateCodeVerifier();
const codeChallenge = generateCodeChallenge(codeVerifier);

// Use in authorization request
const authUrl = `https://accounts.zoho.com/oauth/v2/auth?` +
  `client_id=${CLIENT_ID}&` +
  `code_challenge=${codeChallenge}&` +
  `code_challenge_method=S256&` +
  `response_type=code`;
```

**Implement Token Rotation**:

```javascript
class TokenManager {
  constructor(config) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.refreshToken = config.refreshToken;
    this.accessToken = null;
    this.expiresAt = 0;
  }

  async getValidToken() {
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

    // Store updated token securely
    await this.storeTokenSecurely(this.accessToken);

    return this.accessToken;
  }
}
```

**Validate Redirect URIs**:

```javascript
const ALLOWED_REDIRECT_URIS = [
  'https://yourapp.com/oauth/callback',
  'https://staging.yourapp.com/oauth/callback'
];

function validateRedirectUri(uri) {
  return ALLOWED_REDIRECT_URIS.includes(uri);
}

app.get('/oauth/callback', (req, res) => {
  const redirectUri = req.query.redirect_uri;

  if (!validateRedirectUri(redirectUri)) {
    return res.status(400).send('Invalid redirect URI');
  }

  // Continue OAuth flow
});
```

### 3. API Request Security

**Validate Input Data**:

```javascript
const Joi = require('joi');

const leadSchema = Joi.object({
  First_Name: Joi.string().max(100).required(),
  Last_Name: Joi.string().max(100).required(),
  Email: Joi.string().email().required(),
  Phone: Joi.string().pattern(/^[0-9\-\+\(\) ]+$/),
  Company: Joi.string().max(200)
});

async function createLead(data) {
  // Validate input
  const { error, value } = leadSchema.validate(data);

  if (error) {
    throw new Error(`Invalid lead data: ${error.message}`);
  }

  // Create lead with validated data
  return await zohoAPI.createRecord('Leads', value);
}
```

**Sanitize Output**:

```javascript
function sanitizeLeadData(lead) {
  // Remove sensitive fields
  const sanitized = { ...lead };
  delete sanitized.Social_Security_Number;
  delete sanitized.Tax_ID;
  delete sanitized.Bank_Account;

  return sanitized;
}

app.get('/api/leads/:id', async (req, res) => {
  const lead = await getLeadFromZoho(req.params.id);
  const sanitized = sanitizeLeadData(lead);
  res.json(sanitized);
});
```

**Implement Rate Limiting**:

```javascript
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,  // Limit each IP to 100 requests per window
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', apiLimiter);
```

### 4. Webhook Security

**Verify Webhook Signatures**:

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

app.post('/webhooks/zoho', (req, res) => {
  const signature = req.headers['x-zoho-signature'];
  const payload = req.body;

  if (!verifyWebhookSignature(payload, signature, WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }

  // Process webhook
  processWebhook(payload);
  res.status(200).send('OK');
});
```

**Use HTTPS Only**:

```javascript
// Redirect HTTP to HTTPS
app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https' && process.env.NODE_ENV === 'production') {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});
```

---

## Performance Optimization

### 1. Use Bulk APIs

**Batch Operations**:

```javascript
// ❌ BAD: 100 API calls
async function createLeads(leads) {
  const results = [];
  for (const lead of leads) {
    const result = await createLead(lead);
    results.push(result);
  }
  return results;
}

// ✅ GOOD: 1-2 API calls (max 100 records per call)
async function createLeadsBulk(leads) {
  const batches = [];

  // Split into batches of 100
  for (let i = 0; i < leads.length; i += 100) {
    batches.push(leads.slice(i, i + 100));
  }

  // Create all batches
  const results = await Promise.all(
    batches.map(batch =>
      zohoAPI.createRecords('Leads', batch)
    )
  );

  return results.flat();
}
```

### 2. Implement Caching

**Cache Frequently Accessed Data**:

```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 });  // 5 minutes

async function getLeadWithCache(leadId) {
  const cacheKey = `lead_${leadId}`;

  // Check cache
  const cached = cache.get(cacheKey);
  if (cached) {
    console.log('Cache hit:', cacheKey);
    return cached;
  }

  // Fetch from API
  const lead = await zohoAPI.getRecord('Leads', leadId);

  // Store in cache
  cache.set(cacheKey, lead);

  return lead;
}

// Invalidate cache on updates
async function updateLead(leadId, updates) {
  const result = await zohoAPI.updateRecord('Leads', leadId, updates);

  // Invalidate cache
  cache.del(`lead_${leadId}`);

  return result;
}
```

**Cache Metadata**:

```javascript
class MetadataCache {
  constructor() {
    this.cache = new Map();
    this.ttl = 3600000;  // 1 hour
  }

  async getModuleFields(module) {
    const cacheKey = `fields_${module}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() < cached.expiry) {
      return cached.data;
    }

    // Fetch from API
    const fields = await zohoAPI.getFields(module);

    // Cache
    this.cache.set(cacheKey, {
      data: fields,
      expiry: Date.now() + this.ttl
    });

    return fields;
  }
}
```

### 3. Optimize Query Patterns

**Request Only Needed Fields**:

```javascript
// ❌ BAD: Fetches all fields
const leads = await zohoAPI.getRecords('Leads');

// ✅ GOOD: Fetch only needed fields
const leads = await zohoAPI.getRecords('Leads', {
  fields: ['First_Name', 'Last_Name', 'Email', 'Phone', 'Company']
});
```

**Use COQL for Complex Queries**:

```javascript
// ❌ BAD: Multiple API calls to filter
const allLeads = await zohoAPI.getRecords('Leads');
const qualifiedLeads = allLeads.filter(lead =>
  lead.Lead_Status === 'Qualified' &&
  lead.Annual_Revenue > 100000
);

// ✅ GOOD: Single COQL query
const coql = `
  SELECT First_Name, Last_Name, Email, Annual_Revenue
  FROM Leads
  WHERE Lead_Status = 'Qualified'
    AND Annual_Revenue > 100000
  LIMIT 200
`;

const qualifiedLeads = await zohoAPI.executeQuery(coql);
```

### 4. Connection Pooling

**Reuse HTTP Connections**:

```javascript
const axios = require('axios');
const http = require('http');
const https = require('https');

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

const apiClient = axios.create({
  httpAgent,
  httpsAgent,
  timeout: 30000
});

// Use apiClient for all requests
async function makeAPIRequest(url, options) {
  return await apiClient({
    url,
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Zoho-oauthtoken ${accessToken}`
    }
  });
}
```

### 5. Parallel Processing

**Process Independent Operations in Parallel**:

```javascript
// ❌ SEQUENTIAL: Takes 3 seconds total
const leads = await getLeads();        // 1 second
const contacts = await getContacts();  // 1 second
const deals = await getDeals();        // 1 second

// ✅ PARALLEL: Takes 1 second total
const [leads, contacts, deals] = await Promise.all([
  getLeads(),
  getContacts(),
  getDeals()
]);
```

**Limit Concurrency for Large Operations**:

```javascript
const pLimit = require('p-limit');

async function processLeadsWithLimit(leadIds, limit = 10) {
  const limiter = pLimit(limit);  // Max 10 concurrent requests

  const tasks = leadIds.map(id =>
    limiter(() => processLead(id))
  );

  return await Promise.all(tasks);
}
```

---

## Error Handling

### 1. Comprehensive Error Handling

**Wrap API Calls in Try-Catch**:

```javascript
async function createLead(leadData) {
  try {
    const result = await zohoAPI.createRecord('Leads', leadData);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error creating lead:', error);

    if (error.response) {
      // API returned error response
      return {
        success: false,
        error: {
          code: error.response.data.code,
          message: error.response.data.message,
          status: error.response.status
        }
      };
    } else if (error.request) {
      // Request made but no response
      return {
        success: false,
        error: {
          code: 'NO_RESPONSE',
          message: 'No response from Zoho API'
        }
      };
    } else {
      // Error setting up request
      return {
        success: false,
        error: {
          code: 'REQUEST_ERROR',
          message: error.message
        }
      };
    }
  }
}
```

### 2. Retry Logic

**Exponential Backoff**:

```javascript
async function makeRequestWithRetry(requestFn, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      const isLastAttempt = attempt === maxRetries;
      const isRetryable = [429, 500, 502, 503, 504].includes(error.response?.status);

      if (isLastAttempt || !isRetryable) {
        throw error;
      }

      // Exponential backoff: 2^attempt seconds
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`Retry attempt ${attempt + 1} after ${delay}ms`);
      await sleep(delay);
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Usage
const result = await makeRequestWithRetry(() =>
  zohoAPI.getRecord('Leads', leadId)
);
```

### 3. Circuit Breaker

**Prevent Cascading Failures**:

```javascript
class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeout = options.resetTimeout || 60000;
    this.failures = 0;
    this.state = 'CLOSED';
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
        console.error(`Circuit breaker opened after ${this.failures} failures`);
      }

      throw error;
    }
  }
}

// Usage
const breaker = new CircuitBreaker({
  failureThreshold: 5,
  resetTimeout: 60000
});

const result = await breaker.execute(() =>
  zohoAPI.getRecord('Leads', leadId)
);
```

### 4. Graceful Degradation

**Provide Fallback Functionality**:

```javascript
async function getLeadData(leadId) {
  try {
    // Try to get fresh data from API
    return await zohoAPI.getRecord('Leads', leadId);
  } catch (error) {
    console.error('API request failed, using cached data');

    // Fallback to cached data
    const cached = await getCachedLead(leadId);
    if (cached) {
      return {
        ...cached,
        _fromCache: true,
        _cacheAge: Date.now() - cached.cachedAt
      };
    }

    // No cache available
    throw error;
  }
}
```

---

## API Design Patterns

### 1. Repository Pattern

**Separate Data Access Logic**:

```javascript
class LeadRepository {
  constructor(zohoAPI) {
    this.api = zohoAPI;
  }

  async findById(id) {
    return await this.api.getRecord('Leads', id);
  }

  async findAll(options = {}) {
    return await this.api.getRecords('Leads', options);
  }

  async findByEmail(email) {
    const coql = `SELECT * FROM Leads WHERE Email = '${email}'`;
    const results = await this.api.executeQuery(coql);
    return results[0] || null;
  }

  async create(leadData) {
    return await this.api.createRecord('Leads', leadData);
  }

  async update(id, updates) {
    return await this.api.updateRecord('Leads', id, updates);
  }

  async delete(id) {
    return await this.api.deleteRecord('Leads', id);
  }

  async findQualified() {
    const coql = `SELECT * FROM Leads WHERE Lead_Status = 'Qualified'`;
    return await this.api.executeQuery(coql);
  }
}

// Usage
const leadRepo = new LeadRepository(zohoAPI);
const lead = await leadRepo.findByEmail('john@example.com');
```

### 2. Factory Pattern

**Create Objects Consistently**:

```javascript
class ZohoClientFactory {
  static create(product, config) {
    switch (product) {
      case 'crm':
        return new ZohoCRMClient(config);
      case 'books':
        return new ZohoBooksClient(config);
      case 'desk':
        return new ZohoDeskClient(config);
      default:
        throw new Error(`Unknown product: ${product}`);
    }
  }
}

// Usage
const crmClient = ZohoClientFactory.create('crm', config);
const booksClient = ZohoClientFactory.create('books', config);
```

### 3. Builder Pattern

**Construct Complex Requests**:

```javascript
class COQLQueryBuilder {
  constructor() {
    this.selectFields = [];
    this.whereConditions = [];
    this.orderByFields = [];
    this.limitValue = null;
  }

  select(...fields) {
    this.selectFields.push(...fields);
    return this;
  }

  from(module) {
    this.module = module;
    return this;
  }

  where(condition) {
    this.whereConditions.push(condition);
    return this;
  }

  orderBy(field, direction = 'ASC') {
    this.orderByFields.push(`${field} ${direction}`);
    return this;
  }

  limit(value) {
    this.limitValue = value;
    return this;
  }

  build() {
    let query = `SELECT ${this.selectFields.join(', ')} FROM ${this.module}`;

    if (this.whereConditions.length > 0) {
      query += ` WHERE ${this.whereConditions.join(' AND ')}`;
    }

    if (this.orderByFields.length > 0) {
      query += ` ORDER BY ${this.orderByFields.join(', ')}`;
    }

    if (this.limitValue) {
      query += ` LIMIT ${this.limitValue}`;
    }

    return query;
  }
}

// Usage
const query = new COQLQueryBuilder()
  .select('First_Name', 'Last_Name', 'Email', 'Annual_Revenue')
  .from('Leads')
  .where("Lead_Status = 'Qualified'")
  .where('Annual_Revenue > 100000')
  .orderBy('Annual_Revenue', 'DESC')
  .limit(50)
  .build();

const results = await zohoAPI.executeQuery(query);
```

---

## Testing Strategies

### 1. Unit Testing

**Test Individual Functions**:

```javascript
const { expect } = require('chai');
const sinon = require('sinon');

describe('LeadRepository', () => {
  let leadRepo;
  let zohoAPI;

  beforeEach(() => {
    zohoAPI = {
      getRecord: sinon.stub(),
      createRecord: sinon.stub(),
      updateRecord: sinon.stub()
    };
    leadRepo = new LeadRepository(zohoAPI);
  });

  describe('findById', () => {
    it('should return lead by ID', async () => {
      const mockLead = { id: '123', First_Name: 'John' };
      zohoAPI.getRecord.resolves(mockLead);

      const result = await leadRepo.findById('123');

      expect(zohoAPI.getRecord.calledWith('Leads', '123')).to.be.true;
      expect(result).to.deep.equal(mockLead);
    });
  });

  describe('create', () => {
    it('should create new lead', async () => {
      const leadData = { First_Name: 'John', Last_Name: 'Doe' };
      const mockResponse = { id: '123', ...leadData };
      zohoAPI.createRecord.resolves(mockResponse);

      const result = await leadRepo.create(leadData);

      expect(zohoAPI.createRecord.calledWith('Leads', leadData)).to.be.true;
      expect(result).to.deep.equal(mockResponse);
    });
  });
});
```

### 2. Integration Testing

**Test API Integration**:

```javascript
describe('Zoho CRM Integration', () => {
  let crmClient;

  before(() => {
    crmClient = new ZohoCRMClient({
      accessToken: process.env.TEST_ACCESS_TOKEN,
      apiDomain: 'https://sandbox.zohoapis.com'  // Use sandbox
    });
  });

  it('should create and retrieve lead', async () => {
    // Create lead
    const leadData = {
      First_Name: 'Test',
      Last_Name: 'User',
      Email: `test-${Date.now()}@example.com`,
      Company: 'Test Corp'
    };

    const createResult = await crmClient.createRecord('Leads', leadData);
    expect(createResult.id).to.exist;

    const leadId = createResult.id;

    // Retrieve lead
    const lead = await crmClient.getRecord('Leads', leadId);
    expect(lead.First_Name).to.equal('Test');
    expect(lead.Last_Name).to.equal('User');

    // Cleanup
    await crmClient.deleteRecord('Leads', leadId);
  });
});
```

### 3. Mocking APIs

**Use Nock for HTTP Mocking**:

```javascript
const nock = require('nock');

describe('Zoho API Client', () => {
  beforeEach(() => {
    nock('https://www.zohoapis.com')
      .get('/crm/v8/Leads/123')
      .reply(200, {
        data: [{
          id: '123',
          First_Name: 'John',
          Last_Name: 'Doe'
        }]
      });
  });

  it('should fetch lead', async () => {
    const lead = await zohoAPI.getRecord('Leads', '123');
    expect(lead.First_Name).to.equal('John');
  });

  afterEach(() => {
    nock.cleanAll();
  });
});
```

---

## Monitoring & Logging

### 1. Structured Logging

**Use Consistent Log Format**:

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Log API requests
async function makeAPIRequest(method, url, data) {
  const requestId = generateRequestId();

  logger.info('API request started', {
    requestId,
    method,
    url,
    timestamp: Date.now()
  });

  try {
    const response = await axios({ method, url, data });

    logger.info('API request successful', {
      requestId,
      method,
      url,
      status: response.status,
      duration: Date.now() - startTime
    });

    return response.data;
  } catch (error) {
    logger.error('API request failed', {
      requestId,
      method,
      url,
      error: error.message,
      status: error.response?.status
    });

    throw error;
  }
}
```

### 2. Performance Monitoring

**Track API Performance**:

```javascript
class PerformanceMonitor {
  constructor() {
    this.metrics = [];
  }

  async trackRequest(requestFn, name) {
    const startTime = Date.now();

    try {
      const result = await requestFn();
      const duration = Date.now() - startTime;

      this.metrics.push({
        name,
        duration,
        success: true,
        timestamp: Date.now()
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      this.metrics.push({
        name,
        duration,
        success: false,
        error: error.message,
        timestamp: Date.now()
      });

      throw error;
    }
  }

  getStats() {
    const successful = this.metrics.filter(m => m.success);
    const failed = this.metrics.filter(m => !m.success);

    return {
      totalRequests: this.metrics.length,
      successfulRequests: successful.length,
      failedRequests: failed.length,
      averageDuration: successful.reduce((sum, m) => sum + m.duration, 0) / successful.length,
      successRate: (successful.length / this.metrics.length * 100).toFixed(2) + '%'
    };
  }
}

// Usage
const monitor = new PerformanceMonitor();

const lead = await monitor.trackRequest(
  () => zohoAPI.getRecord('Leads', '123'),
  'getRecord'
);

console.log(monitor.getStats());
```

### 3. Error Tracking

**Integrate with Error Tracking Services**:

```javascript
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});

async function makeAPIRequest(url, options) {
  try {
    return await axios({ url, ...options });
  } catch (error) {
    // Log to Sentry
    Sentry.captureException(error, {
      tags: {
        api: 'zoho',
        endpoint: url,
        method: options.method
      },
      extra: {
        requestOptions: options,
        responseStatus: error.response?.status,
        responseData: error.response?.data
      }
    });

    throw error;
  }
}
```

---

## Data Management

### 1. Data Validation

**Validate Before Sending to API**:

```javascript
const Joi = require('joi');

const schemas = {
  lead: Joi.object({
    First_Name: Joi.string().max(100).required(),
    Last_Name: Joi.string().max(100).required(),
    Email: Joi.string().email().required(),
    Phone: Joi.string().pattern(/^[0-9\-\+\(\) ]+$/),
    Company: Joi.string().max(200),
    Annual_Revenue: Joi.number().positive(),
    Lead_Status: Joi.string().valid('New', 'Contacted', 'Qualified', 'Lost')
  })
};

function validateData(type, data) {
  const schema = schemas[type];
  if (!schema) {
    throw new Error(`No schema defined for type: ${type}`);
  }

  const { error, value } = schema.validate(data, { abortEarly: false });

  if (error) {
    const errors = error.details.map(d => d.message);
    throw new Error(`Validation failed: ${errors.join(', ')}`);
  }

  return value;
}

// Usage
const leadData = {
  First_Name: 'John',
  Last_Name: 'Doe',
  Email: 'john@example.com'
};

const validatedData = validateData('lead', leadData);
await zohoAPI.createRecord('Leads', validatedData);
```

### 2. Data Transformation

**Transform Data Between Formats**:

```javascript
class DataTransformer {
  static toZohoFormat(localData) {
    return {
      First_Name: localData.firstName,
      Last_Name: localData.lastName,
      Email: localData.email,
      Phone: localData.phone,
      Company: localData.company,
      Lead_Status: localData.status
    };
  }

  static fromZohoFormat(zohoData) {
    return {
      id: zohoData.id,
      firstName: zohoData.First_Name,
      lastName: zohoData.Last_Name,
      email: zohoData.Email,
      phone: zohoData.Phone,
      company: zohoData.Company,
      status: zohoData.Lead_Status,
      createdAt: zohoData.Created_Time
    };
  }
}

// Usage
const localLead = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com'
};

const zohoData = DataTransformer.toZohoFormat(localLead);
const result = await zohoAPI.createRecord('Leads', zohoData);
const localResult = DataTransformer.fromZohoFormat(result);
```

### 3. Handle Large Datasets

**Paginate Through Results**:

```javascript
async function* getAllLeadsPaginated() {
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await zohoAPI.getRecords('Leads', {
      page,
      per_page: 200
    });

    yield response.data;

    hasMore = response.info.more_records;
    page++;
  }
}

// Usage
for await (const leadsBatch of getAllLeadsPaginated()) {
  console.log(`Processing ${leadsBatch.length} leads`);
  await processLeadsBatch(leadsBatch);
}
```

---

## Code Organization

### 1. Modular Structure

**Organize Code by Feature**:

```
src/
  ├── config/
  │   ├── zoho.js          # Zoho configuration
  │   └── database.js      # Database configuration
  ├── services/
  │   ├── zoho/
  │   │   ├── auth.js      # Authentication service
  │   │   ├── crm.js       # CRM service
  │   │   └── books.js     # Books service
  │   └── cache.js         # Cache service
  ├── repositories/
  │   ├── lead.js          # Lead repository
  │   └── contact.js       # Contact repository
  ├── utils/
  │   ├── logger.js        # Logging utility
  │   ├── retry.js         # Retry utility
  │   └── validation.js    # Validation utility
  └── app.js              # Main application
```

### 2. Configuration Management

**Centralize Configuration**:

```javascript
// config/zoho.js
module.exports = {
  auth: {
    clientId: process.env.ZOHO_CLIENT_ID,
    clientSecret: process.env.ZOHO_CLIENT_SECRET,
    refreshToken: process.env.ZOHO_REFRESH_TOKEN
  },
  api: {
    domain: process.env.ZOHO_API_DOMAIN || 'https://www.zohoapis.com',
    timeout: parseInt(process.env.API_TIMEOUT) || 30000,
    maxRetries: parseInt(process.env.API_MAX_RETRIES) || 3
  },
  rateLimit: {
    dailyLimit: parseInt(process.env.RATE_LIMIT_DAILY) || 10000,
    minuteLimit: parseInt(process.env.RATE_LIMIT_MINUTE) || 100
  }
};
```

### 3. Dependency Injection

**Use Dependency Injection**:

```javascript
class LeadService {
  constructor(repository, cache, logger) {
    this.repository = repository;
    this.cache = cache;
    this.logger = logger;
  }

  async getLead(id) {
    // Check cache
    const cached = await this.cache.get(`lead_${id}`);
    if (cached) {
      this.logger.info('Cache hit', { leadId: id });
      return cached;
    }

    // Fetch from repository
    const lead = await this.repository.findById(id);

    // Store in cache
    await this.cache.set(`lead_${id}`, lead);

    return lead;
  }
}

// Dependency injection
const leadService = new LeadService(
  new LeadRepository(zohoAPI),
  new CacheService(),
  new LoggerService()
);
```

---

## Summary

### Security Checklist
- ✅ Never hardcode credentials
- ✅ Use environment variables
- ✅ Encrypt sensitive data at rest
- ✅ Implement token rotation
- ✅ Validate all input data
- ✅ Verify webhook signatures
- ✅ Use HTTPS only

### Performance Checklist
- ✅ Use bulk APIs for batch operations
- ✅ Implement caching for frequently accessed data
- ✅ Request only needed fields
- ✅ Use connection pooling
- ✅ Process operations in parallel when possible
- ✅ Use COQL for complex queries

### Reliability Checklist
- ✅ Implement comprehensive error handling
- ✅ Use retry logic with exponential backoff
- ✅ Implement circuit breaker pattern
- ✅ Provide graceful degradation
- ✅ Handle rate limits appropriately
- ✅ Monitor API health and performance

### Code Quality Checklist
- ✅ Use design patterns (Repository, Factory, Builder)
- ✅ Write unit and integration tests
- ✅ Implement structured logging
- ✅ Organize code modularly
- ✅ Use dependency injection
- ✅ Document code and APIs

---

**Last Updated**: December 2025
**Guide Version**: 1.0
