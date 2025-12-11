# Zoho TestHub API Reference

## Overview

Zoho TestHub is a test management platform for planning, executing, and tracking software testing activities. The API provides programmatic access to test cases, test runs, defects, and reporting.

**Current API Version**: v1
**Base URL**: `https://testhub.zoho.com/api/v1/`
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
- `ZohoTestHub.testcases.ALL` - Manage test cases
- `ZohoTestHub.testruns.ALL` - Manage test runs
- `ZohoTestHub.bugs.ALL` - Manage bugs

---

## Rate Limits

- **API Calls**: 5,000 calls per day
- **Burst Limit**: 100 calls per minute

---

## API Modules

### 1. Projects

**Endpoints**:
```http
GET    /api/v1/projects              # List projects
GET    /api/v1/projects/{projectId}  # Get project details
POST   /api/v1/projects              # Create project
PUT    /api/v1/projects/{projectId}  # Update project
```

**Example - List Projects**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const listProjects = async (accessToken) => {
  const response = await axios.get(
    'https://testhub.zoho.com/api/v1/projects',
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

### 2. Test Cases

**Endpoints**:
```http
GET    /api/v1/projects/{projectId}/testcases              # List test cases
GET    /api/v1/projects/{projectId}/testcases/{caseId}     # Get test case
POST   /api/v1/projects/{projectId}/testcases              # Create test case
PUT    /api/v1/projects/{projectId}/testcases/{caseId}     # Update test case
DELETE /api/v1/projects/{projectId}/testcases/{caseId}     # Delete test case
```

**Example - Create Test Case**:
```javascript
// JavaScript/Node.js
const createTestCase = async (accessToken, projectId, testCaseData) => {
  const response = await axios.post(
    `https://testhub.zoho.com/api/v1/projects/${projectId}/testcases`,
    {
      title: testCaseData.title,
      description: testCaseData.description,
      priority: testCaseData.priority || 'medium',
      type: testCaseData.type || 'functional',
      steps: testCaseData.steps,
      expectedResult: testCaseData.expectedResult,
      tags: testCaseData.tags || []
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

// Create test case
const testCase = await createTestCase(accessToken, projectId, {
  title: 'Login Functionality Test',
  description: 'Verify user can login with valid credentials',
  priority: 'high',
  type: 'functional',
  steps: [
    'Navigate to login page',
    'Enter valid username',
    'Enter valid password',
    'Click login button'
  ],
  expectedResult: 'User successfully logged in and redirected to dashboard',
  tags: ['authentication', 'login']
});
```

**Response**:
```json
{
  "testCaseId": "tc_123456",
  "projectId": "proj_789",
  "title": "Login Functionality Test",
  "description": "Verify user can login with valid credentials",
  "priority": "high",
  "type": "functional",
  "status": "active",
  "createdBy": "user_123",
  "createdTime": "2025-01-15T10:30:00Z"
}
```

---

### 3. Test Runs

**Endpoints**:
```http
GET    /api/v1/projects/{projectId}/testruns              # List test runs
GET    /api/v1/projects/{projectId}/testruns/{runId}      # Get test run
POST   /api/v1/projects/{projectId}/testruns              # Create test run
PUT    /api/v1/projects/{projectId}/testruns/{runId}      # Update test run
POST   /api/v1/projects/{projectId}/testruns/{runId}/execute # Execute test run
```

**Example - Create Test Run**:
```python
# Python
import requests

def create_test_run(access_token, project_id, run_data):
    url = f'https://testhub.zoho.com/api/v1/projects/{project_id}/testruns'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'name': run_data['name'],
        'description': run_data['description'],
        'testCaseIds': run_data['test_case_ids'],
        'assignedTo': run_data['assigned_to'],
        'dueDate': run_data['due_date'],
        'environment': run_data.get('environment', 'staging')
    }

    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

---

### 4. Test Execution

**Endpoints**:
```http
POST /api/v1/projects/{projectId}/testruns/{runId}/results  # Submit test result
GET  /api/v1/projects/{projectId}/testruns/{runId}/results  # Get results
PUT  /api/v1/projects/{projectId}/testruns/{runId}/results/{resultId} # Update result
```

**Example - Submit Test Result**:
```javascript
// JavaScript/Node.js
const submitTestResult = async (accessToken, projectId, runId, resultData) => {
  const response = await axios.post(
    `https://testhub.zoho.com/api/v1/projects/${projectId}/testruns/${runId}/results`,
    {
      testCaseId: resultData.testCaseId,
      status: resultData.status,  // passed, failed, blocked, skipped
      executedBy: resultData.executedBy,
      actualResult: resultData.actualResult,
      comments: resultData.comments,
      defectIds: resultData.defectIds || [],
      attachments: resultData.attachments || []
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

// Submit result
await submitTestResult(accessToken, projectId, runId, {
  testCaseId: 'tc_123456',
  status: 'failed',
  executedBy: 'user_456',
  actualResult: 'Login button not responding',
  comments: 'Button click event not working in Firefox',
  defectIds: ['bug_789']
});
```

---

### 5. Defects/Bugs

**Endpoints**:
```http
GET    /api/v1/projects/{projectId}/bugs              # List bugs
GET    /api/v1/projects/{projectId}/bugs/{bugId}      # Get bug details
POST   /api/v1/projects/{projectId}/bugs              # Create bug
PUT    /api/v1/projects/{projectId}/bugs/{bugId}      # Update bug
DELETE /api/v1/projects/{projectId}/bugs/{bugId}      # Delete bug
```

**Example - Create Bug**:
```python
# Python
def create_bug(access_token, project_id, bug_data):
    url = f'https://testhub.zoho.com/api/v1/projects/{project_id}/bugs'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'title': bug_data['title'],
        'description': bug_data['description'],
        'severity': bug_data['severity'],
        'priority': bug_data['priority'],
        'status': 'open',
        'assignedTo': bug_data['assigned_to'],
        'testCaseId': bug_data.get('test_case_id'),
        'steps_to_reproduce': bug_data['steps'],
        'environment': bug_data.get('environment')
    }

    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

**Response**:
```json
{
  "bugId": "bug_789012",
  "projectId": "proj_789",
  "title": "Login button unresponsive in Firefox",
  "severity": "high",
  "priority": "high",
  "status": "open",
  "assignedTo": "dev_123",
  "createdTime": "2025-01-15T10:30:00Z"
}
```

---

### 6. Test Suites

**Endpoints**:
```http
GET    /api/v1/projects/{projectId}/suites              # List test suites
POST   /api/v1/projects/{projectId}/suites              # Create test suite
PUT    /api/v1/projects/{projectId}/suites/{suiteId}    # Update test suite
POST   /api/v1/projects/{projectId}/suites/{suiteId}/testcases # Add test cases
```

**Example - Create Test Suite**:
```javascript
// JavaScript/Node.js
const createTestSuite = async (accessToken, projectId, suiteData) => {
  const response = await axios.post(
    `https://testhub.zoho.com/api/v1/projects/${projectId}/suites`,
    {
      name: suiteData.name,
      description: suiteData.description,
      testCaseIds: suiteData.testCaseIds
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

### 7. Reports

**Endpoints**:
```http
GET /api/v1/projects/{projectId}/reports/summary        # Test summary
GET /api/v1/projects/{projectId}/reports/execution     # Execution report
GET /api/v1/projects/{projectId}/reports/defects       # Defect report
GET /api/v1/projects/{projectId}/reports/coverage      # Test coverage
```

**Example - Get Test Summary**:
```python
# Python
def get_test_summary(access_token, project_id):
    url = f'https://testhub.zoho.com/api/v1/projects/{project_id}/reports/summary'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }

    response = requests.get(url, headers=headers)
    return response.json()
```

**Response**:
```json
{
  "projectId": "proj_789",
  "totalTestCases": 150,
  "totalTestRuns": 25,
  "executionStats": {
    "passed": 120,
    "failed": 15,
    "blocked": 5,
    "skipped": 10
  },
  "passRate": 80.0,
  "defectStats": {
    "open": 15,
    "inProgress": 8,
    "resolved": 42,
    "closed": 30
  },
  "coverage": 85.5
}
```

---

## Common Operations

### 1. Execute Complete Test Run

```javascript
// JavaScript/Node.js
const executeTestRun = async (accessToken, projectId, runId) => {
  // Get test cases in run
  const run = await axios.get(
    `https://testhub.zoho.com/api/v1/projects/${projectId}/testruns/${runId}`,
    {
      headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}` }
    }
  );

  // Submit results for each test case
  const results = [];
  for (const testCase of run.data.testCases) {
    const result = await submitTestResult(accessToken, projectId, runId, {
      testCaseId: testCase.testCaseId,
      status: 'passed',
      executedBy: 'user_123',
      actualResult: 'Test executed successfully'
    });
    results.push(result);
  }

  return results;
};
```

### 2. Link Bug to Test Case

```python
# Python
def link_bug_to_testcase(access_token, project_id, bug_id, test_case_id):
    url = f'https://testhub.zoho.com/api/v1/projects/{project_id}/bugs/{bug_id}'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'testCaseId': test_case_id
    }

    response = requests.put(url, json=data, headers=headers)
    return response.json()
```

---

## Deluge Integration

```javascript
// Deluge Script
projectId = "proj_789";

// Create test case from bug report
testCaseData = {
  "title": "Regression Test - " + bug_title,
  "description": "Test case to verify bug fix",
  "priority": "high",
  "type": "regression",
  "steps": [
    "Reproduce original bug scenario",
    "Verify fix is applied",
    "Test edge cases"
  ],
  "expectedResult": "Bug is fixed and no regression"
};

response = invokeurl
[
  url: "https://testhub.zoho.com/api/v1/projects/" + projectId + "/testcases"
  type: POST
  parameters: testCaseData.toString()
  connection: "zoho_testhub"
];

testCaseId = response.get("testCaseId");
info "Test case created: " + testCaseId;
```

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 200 | Success | Request completed |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid parameters |
| 401 | Unauthorized | Invalid token |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate test case |
| 429 | Too Many Requests | Rate limit exceeded |

---

## Best Practices

### 1. Test Case Management
- Use descriptive titles
- Maintain test case versioning
- Regular reviews and updates
- Tag for easy filtering

### 2. Test Execution
- Document all test results
- Link bugs to test cases
- Track test environment
- Regular regression testing

### 3. Reporting
- Generate reports regularly
- Track metrics over time
- Share with stakeholders
- Use for continuous improvement

---

## Data Centers

| Region | API Base URL |
|--------|-------------|
| US | `https://testhub.zoho.com/api/v1/` |
| EU | `https://testhub.zoho.eu/api/v1/` |
| IN | `https://testhub.zoho.in/api/v1/` |

---

## Additional Resources

- **Official Documentation**: https://www.zoho.com/testhub/help/api/
- **Developer Console**: https://api-console.zoho.com/
