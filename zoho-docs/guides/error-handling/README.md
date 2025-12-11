# Error Handling Guide for Zoho APIs

## Overview

This guide covers error handling strategies, common errors, and troubleshooting for Zoho APIs.

---

## Table of Contents

1. [Common Error Codes](#common-error-codes)
2. [HTTP Status Codes](#http-status-codes)
3. [Error Response Format](#error-response-format)
4. [Handling Specific Errors](#handling-specific-errors)
5. [Retry Strategies](#retry-strategies)
6. [Logging & Monitoring](#logging--monitoring)
7. [Troubleshooting Guide](#troubleshooting-guide)

---

## Common Error Codes

### Authentication Errors

| Error Code | Message | Cause | Solution |
|------------|---------|-------|----------|
| `INVALID_TOKEN` | Invalid access token | Token expired or invalid | Refresh access token |
| `AUTHENTICATION_FAILURE` | Authentication failed | Wrong credentials | Check client ID/secret |
| `OAUTH_SCOPE_MISMATCH` | Scope mismatch | Missing required scope | Update OAuth scopes |
| `INVALID_OAUTH_SCOPE` | Invalid OAuth scope | Unsupported scope | Use valid scopes |

### API Errors

| Error Code | Message | Cause | Solution |
|------------|---------|-------|----------|
| `INVALID_REQUEST_METHOD` | Invalid HTTP method | Wrong method used | Use correct method |
| `INVALID_MODULE` | Module not found | Wrong module name | Check module name |
| `RECORD_NOT_FOUND` | Record does not exist | Invalid record ID | Verify record ID exists |
| `MANDATORY_NOT_FOUND` | Required field missing | Missing required field | Include all required fields |
| `DUPLICATE_DATA` | Duplicate record | Record already exists | Update existing record |

### Rate Limit Errors

| Error Code | Message | Cause | Solution |
|------------|---------|-------|----------|
| `RATE_LIMIT_EXCEEDED` | API rate limit exceeded | Too many requests | Implement rate limiting |
| `CONCURRENT_LIMIT_EXCEEDED` | Concurrent connections exceeded | Too many simultaneous requests | Reduce concurrent requests |

### Validation Errors

| Error Code | Message | Cause | Solution |
|------------|---------|-------|----------|
| `INVALID_DATA` | Invalid field value | Wrong data type/format | Validate data before sending |
| `FIELD_NOT_FOUND` | Field does not exist | Invalid field name | Check field API names |
| `INVALID_URL` | Invalid URL format | Malformed URL | Verify URL format |

---

## HTTP Status Codes

### 2xx Success

| Status | Meaning | Description |
|--------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 202 | Accepted | Request accepted for processing |
| 204 | No Content | Successful with no response body |

### 4xx Client Errors

| Status | Meaning | Description |
|--------|---------|-------------|
| 400 | Bad Request | Invalid request format |
| 401 | Unauthorized | Authentication failed |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |

### 5xx Server Errors

| Status | Meaning | Description |
|--------|---------|-------------|
| 500 | Internal Server Error | Server-side error |
| 502 | Bad Gateway | Gateway error |
| 503 | Service Unavailable | Service temporarily unavailable |
| 504 | Gateway Timeout | Request timeout |

---

## Error Response Format

### Standard Error Response

```json
{
  "code": "INVALID_DATA",
  "details": {
    "api_name": "Email",
    "json_path": "$.data[0].Email"
  },
  "message": "invalid data",
  "status": "error"
}
```

### Bulk Operation Error Response

```json
{
  "data": [
    {
      "code": "SUCCESS",
      "details": {
        "id": "12345000000234567"
      },
      "message": "record added",
      "status": "success"
    },
    {
      "code": "DUPLICATE_DATA",
      "details": {},
      "message": "duplicate data",
      "status": "error"
    }
  ]
}
```

---

## Handling Specific Errors

### Token Expiration

```javascript
async function handleTokenExpiration(error, originalRequest) {
  if (error.response?.status === 401 &&
      error.response?.data?.code === 'INVALID_TOKEN') {
    console.log('Token expired, refreshing...');

    // Refresh token
    const newToken = await refreshAccessToken();

    // Retry original request with new token
    originalRequest.headers['Authorization'] = `Zoho-oauthtoken ${newToken}`;
    return await axios(originalRequest);
  }

  throw error;
}

// Usage with axios interceptor
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.config && !error.config.__isRetry) {
      error.config.__isRetry = true;
      return handleTokenExpiration(error, error.config);
    }
    return Promise.reject(error);
  }
);
```

### Rate Limiting

```javascript
async function handleRateLimitError(error) {
  if (error.response?.status === 429) {
    const resetTime = error.response.headers['x-ratelimit-reset'];

    if (resetTime) {
      const waitTime = (resetTime * 1000) - Date.now() + 1000;
      console.log(`Rate limit hit. Waiting ${waitTime}ms...`);
      await sleep(waitTime);

      // Retry request
      return await axios(error.config);
    }

    // Default wait: 60 seconds
    await sleep(60000);
    return await axios(error.config);
  }

  throw error;
}
```

### Validation Errors

```javascript
function handleValidationError(error) {
  if (error.response?.data?.code === 'INVALID_DATA') {
    const details = error.response.data.details;

    return {
      success: false,
      validationError: true,
      field: details.api_name,
      path: details.json_path,
      message: error.response.data.message
    };
  }

  throw error;
}

// Usage
try {
  await createLead(leadData);
} catch (error) {
  const result = handleValidationError(error);

  if (result.validationError) {
    console.error(`Validation error on field ${result.field}: ${result.message}`);
    // Show error to user
  }
}
```

### Network Errors

```javascript
function handleNetworkError(error) {
  if (!error.response) {
    // Network error - no response received
    return {
      success: false,
      networkError: true,
      message: 'Network error occurred. Please check your connection.'
    };
  }

  throw error;
}
```

---

## Retry Strategies

### Exponential Backoff

```javascript
async function retryWithExponentialBackoff(fn, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isLastAttempt = attempt === maxRetries;
      const isRetryable = isRetryableError(error);

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

function isRetryableError(error) {
  const status = error.response?.status;

  // Retry on rate limit, server errors, and timeouts
  return [429, 500, 502, 503, 504].includes(status) ||
         error.code === 'ECONNRESET' ||
         error.code === 'ETIMEDOUT';
}

// Usage
const lead = await retryWithExponentialBackoff(() =>
  zohoAPI.getRecord('Leads', leadId)
);
```

### Circuit Breaker

```javascript
class CircuitBreaker {
  constructor(failureThreshold = 5, resetTimeout = 60000) {
    this.failureThreshold = failureThreshold;
    this.resetTimeout = resetTimeout;
    this.failures = 0;
    this.state = 'CLOSED';  // CLOSED, OPEN, HALF_OPEN
    this.nextAttempt = Date.now();
  }

  async execute(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await fn();

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
const breaker = new CircuitBreaker();

try {
  const lead = await breaker.execute(() =>
    zohoAPI.getRecord('Leads', leadId)
  );
} catch (error) {
  if (error.message === 'Circuit breaker is OPEN') {
    console.log('Service temporarily unavailable');
  }
}
```

---

## Logging & Monitoring

### Structured Error Logging

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

function logAPIError(error, context = {}) {
  const errorData = {
    timestamp: new Date().toISOString(),
    message: error.message,
    statusCode: error.response?.status,
    errorCode: error.response?.data?.code,
    errorMessage: error.response?.data?.message,
    url: error.config?.url,
    method: error.config?.method,
    ...context
  };

  logger.error('API Error', errorData);

  return errorData;
}

// Usage
try {
  await zohoAPI.createRecord('Leads', leadData);
} catch (error) {
  logAPIError(error, {
    operation: 'createLead',
    leadData: leadData
  });
  throw error;
}
```

### Error Tracking with Sentry

```javascript
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});

function trackAPIError(error, context = {}) {
  Sentry.captureException(error, {
    tags: {
      api: 'zoho',
      errorCode: error.response?.data?.code,
      statusCode: error.response?.status
    },
    extra: {
      url: error.config?.url,
      method: error.config?.method,
      ...context
    }
  });
}

// Usage
try {
  await zohoAPI.createRecord('Leads', leadData);
} catch (error) {
  trackAPIError(error, { operation: 'createLead' });
  throw error;
}
```

---

## Troubleshooting Guide

### Issue: Authentication Failures

**Symptoms**: 401 Unauthorized errors

**Troubleshooting Steps**:

1. **Verify Token**:
```bash
# Test token with curl
curl -X GET "https://www.zohoapis.com/crm/v8/Leads?per_page=1" \
  -H "Authorization: Zoho-oauthtoken YOUR_ACCESS_TOKEN"
```

2. **Check Token Expiration**:
```javascript
// Decode token to check expiration
const tokenParts = accessToken.split('.');
const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
const expiresAt = payload.exp * 1000;

if (Date.now() >= expiresAt) {
  console.log('Token expired');
  // Refresh token
}
```

3. **Verify Scopes**:
```javascript
// Check if error is scope-related
if (error.response?.data?.code === 'OAUTH_SCOPE_MISMATCH') {
  console.error('Missing required scope:', error.response.data.message);
  // Update OAuth configuration with required scopes
}
```

### Issue: Rate Limit Errors

**Symptoms**: 429 Too Many Requests

**Troubleshooting Steps**:

1. **Check Current Usage**:
```javascript
function checkRateLimitStatus(response) {
  const limit = response.headers['x-ratelimit-limit'];
  const remaining = response.headers['x-ratelimit-remaining'];
  const reset = response.headers['x-ratelimit-reset'];

  console.log(`Rate Limit: ${remaining}/${limit} remaining`);
  console.log(`Resets at: ${new Date(reset * 1000).toLocaleString()}`);

  if (remaining < limit * 0.1) {
    console.warn('⚠️ Approaching rate limit!');
  }
}
```

2. **Implement Rate Limiting**:
```javascript
const Bottleneck = require('bottleneck');

const limiter = new Bottleneck({
  maxConcurrent: 5,
  minTime: 100  // Min 100ms between requests
});

const rateLimitedRequest = limiter.wrap(zohoAPI.makeRequest);
```

### Issue: Validation Errors

**Symptoms**: INVALID_DATA, MANDATORY_NOT_FOUND errors

**Troubleshooting Steps**:

1. **Validate Before Sending**:
```javascript
const Joi = require('joi');

const leadSchema = Joi.object({
  First_Name: Joi.string().max(100).required(),
  Last_Name: Joi.string().max(100).required(),
  Email: Joi.string().email().required(),
  Phone: Joi.string().pattern(/^[0-9\-\+\(\) ]+$/),
  Company: Joi.string().max(200)
});

function validateLead(data) {
  const { error, value } = leadSchema.validate(data);

  if (error) {
    throw new Error(`Validation failed: ${error.message}`);
  }

  return value;
}
```

2. **Check Field Names**:
```javascript
async function verifyFieldNames(module, data) {
  // Get module fields
  const fields = await zohoAPI.getFields(module);
  const validFieldNames = fields.map(f => f.api_name);

  // Check if all field names are valid
  const invalidFields = Object.keys(data).filter(
    key => !validFieldNames.includes(key)
  );

  if (invalidFields.length > 0) {
    console.error('Invalid field names:', invalidFields);
  }

  return invalidFields;
}
```

### Issue: Network Errors

**Symptoms**: ECONNRESET, ETIMEDOUT errors

**Troubleshooting Steps**:

1. **Test Connectivity**:
```bash
# Test network connection
ping www.zohoapis.com

# Test API endpoint
curl -I https://www.zohoapis.com/crm/v8/Leads
```

2. **Increase Timeout**:
```javascript
const axios = require('axios');

const apiClient = axios.create({
  timeout: 60000,  // 60 seconds
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true })
});
```

3. **Implement Retry Logic**:
```javascript
async function makeRequestWithRetry(fn, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
        if (attempt < maxRetries) {
          console.log(`Network error, retrying... (${attempt + 1}/${maxRetries})`);
          await sleep(2000);
          continue;
        }
      }

      throw error;
    }
  }
}
```

### Issue: Server Errors (5xx)

**Symptoms**: 500, 502, 503, 504 errors

**Troubleshooting Steps**:

1. **Check Zoho Status**:
   - Visit: https://status.zoho.com/
   - Check for ongoing incidents

2. **Implement Fallback**:
```javascript
async function makeRequestWithFallback(fn, fallbackFn) {
  try {
    return await fn();
  } catch (error) {
    if (error.response?.status >= 500) {
      console.log('Server error, using fallback');
      return await fallbackFn();
    }

    throw error;
  }
}

// Usage
const lead = await makeRequestWithFallback(
  () => zohoAPI.getRecord('Leads', leadId),
  () => getCachedLead(leadId)
);
```

---

**Last Updated**: December 2025
**Guide Version**: 1.0
