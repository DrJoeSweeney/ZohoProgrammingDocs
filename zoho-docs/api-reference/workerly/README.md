# Zoho Workerly API Reference

## Overview

Zoho Workerly is a workforce management platform for temporary staffing and contingent workforce management. The V2 API provides programmatic access to worker management, job assignments, timesheets, and payroll operations.

**Current API Version**: v2
**Base URL**: `https://workerly.zoho.com/api/v2/`
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
- `ZohoWorkerly.workers.ALL` - Manage workers
- `ZohoWorkerly.jobs.ALL` - Manage jobs
- `ZohoWorkerly.timesheets.ALL` - Manage timesheets

---

## Rate Limits

- **API Calls**: 5,000 calls per day
- **Burst Limit**: 100 calls per minute

---

## API Modules

### 1. Workers

**Endpoints**:
```http
GET    /api/v2/workers              # List workers
GET    /api/v2/workers/{workerId}   # Get worker details
POST   /api/v2/workers              # Add worker
PUT    /api/v2/workers/{workerId}   # Update worker
DELETE /api/v2/workers/{workerId}   # Remove worker
```

**Example - Add Worker**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const addWorker = async (accessToken, workerData) => {
  const response = await axios.post(
    'https://workerly.zoho.com/api/v2/workers',
    {
      firstName: workerData.firstName,
      lastName: workerData.lastName,
      email: workerData.email,
      phone: workerData.phone,
      skills: workerData.skills,
      availability: workerData.availability,
      payRate: workerData.payRate,
      employmentType: 'temporary'
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
  "workerId": "worker_123",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1-555-0100",
  "skills": ["Warehouse", "Forklift Certified"],
  "status": "active",
  "totalHoursWorked": 0,
  "rating": 0
}
```

---

### 2. Jobs

**Endpoints**:
```http
GET    /api/v2/jobs              # List jobs
GET    /api/v2/jobs/{jobId}      # Get job details
POST   /api/v2/jobs              # Create job
PUT    /api/v2/jobs/{jobId}      # Update job
DELETE /api/v2/jobs/{jobId}      # Delete job
POST   /api/v2/jobs/{jobId}/assign # Assign worker
```

**Example - Create Job**:
```python
# Python
import requests

def create_job(access_token, job_data):
    url = 'https://workerly.zoho.com/api/v2/jobs'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'title': job_data['title'],
        'description': job_data['description'],
        'location': job_data['location'],
        'startDate': job_data['start_date'],
        'endDate': job_data['end_date'],
        'requiredSkills': job_data['required_skills'],
        'payRate': job_data['pay_rate'],
        'numberOfWorkers': job_data['number_of_workers']
    }

    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

---

### 3. Timesheets

**Endpoints**:
```http
GET    /api/v2/timesheets              # List timesheets
GET    /api/v2/timesheets/{timesheetId} # Get timesheet
POST   /api/v2/timesheets              # Create timesheet
PUT    /api/v2/timesheets/{timesheetId} # Update timesheet
POST   /api/v2/timesheets/{timesheetId}/approve # Approve timesheet
```

**Example - Submit Timesheet**:
```javascript
// JavaScript/Node.js
const submitTimesheet = async (accessToken, timesheetData) => {
  const response = await axios.post(
    'https://workerly.zoho.com/api/v2/timesheets',
    {
      workerId: timesheetData.workerId,
      jobId: timesheetData.jobId,
      date: timesheetData.date,
      hoursWorked: timesheetData.hoursWorked,
      breakMinutes: timesheetData.breakMinutes,
      notes: timesheetData.notes
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

### 4. Assignments

**Endpoints**:
```http
GET    /api/v2/assignments              # List assignments
POST   /api/v2/assignments              # Create assignment
PUT    /api/v2/assignments/{assignmentId} # Update assignment
DELETE /api/v2/assignments/{assignmentId} # Cancel assignment
```

**Example - Assign Worker to Job**:
```python
# Python
def assign_worker(access_token, assignment_data):
    url = 'https://workerly.zoho.com/api/v2/assignments'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'workerId': assignment_data['worker_id'],
        'jobId': assignment_data['job_id'],
        'startDate': assignment_data['start_date'],
        'endDate': assignment_data['end_date'],
        'shiftDetails': assignment_data['shift_details']
    }

    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

---

### 5. Payroll

**Endpoints**:
```http
GET    /api/v2/payroll              # List payroll records
POST   /api/v2/payroll/process      # Process payroll
GET    /api/v2/payroll/{payrollId}  # Get payroll details
```

**Example - Get Payroll Summary**:
```javascript
// JavaScript/Node.js
const getPayrollSummary = async (accessToken, startDate, endDate) => {
  const response = await axios.get(
    'https://workerly.zoho.com/api/v2/payroll',
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      },
      params: {
        start_date: startDate,
        end_date: endDate
      }
    }
  );
  return response.data;
};
```

---

## Deluge Integration

```javascript
// Deluge Script
workerData = {
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "+1-555-0101",
  "skills": ["Customer Service", "Retail"],
  "payRate": 18.50
};

response = invokeurl
[
  url: "https://workerly.zoho.com/api/v2/workers"
  type: POST
  parameters: workerData.toString()
  connection: "zoho_workerly"
];

workerId = response.get("workerId");
info "Added worker: " + workerId;
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
| 429 | Too Many Requests | Rate limit exceeded |

---

## Data Centers

| Region | API Base URL |
|--------|-------------|
| US | `https://workerly.zoho.com/api/v2/` |
| EU | `https://workerly.zoho.eu/api/v2/` |
| IN | `https://workerly.zoho.in/api/v2/` |

---

## Additional Resources

- **Official Documentation**: https://www.zoho.com/workerly/help/api/
- **Developer Console**: https://api-console.zoho.com/
