# Zoho Payroll API Reference

## Overview

Zoho Payroll is a comprehensive payroll management solution for processing employee salaries, managing deductions, and handling tax compliance. The API provides programmatic access to employee management, payroll processing, and reporting.

**Current API Version**: v1
**Base URL**: `https://payroll.zoho.com/api/v1/`
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
- `ZohoPayroll.employees.ALL` - Manage employees
- `ZohoPayroll.payroll.ALL` - Process payroll
- `ZohoPayroll.reports.READ` - Access reports

---

## Rate Limits

- **API Calls**: 5,000 calls per day
- **Burst Limit**: 100 calls per minute

---

## API Modules

### 1. Employees

**Endpoints**:
```http
GET    /api/v1/employees              # List employees
GET    /api/v1/employees/{employeeId} # Get employee details
POST   /api/v1/employees              # Add employee
PUT    /api/v1/employees/{employeeId} # Update employee
DELETE /api/v1/employees/{employeeId} # Remove employee
```

**Example - Add Employee**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const addEmployee = async (accessToken, orgId, employeeData) => {
  const response = await axios.post(
    'https://payroll.zoho.com/api/v1/employees',
    {
      organization_id: orgId,
      first_name: employeeData.firstName,
      last_name: employeeData.lastName,
      email: employeeData.email,
      employee_number: employeeData.employeeNumber,
      joining_date: employeeData.joiningDate,
      department: employeeData.department,
      designation: employeeData.designation,
      employment_type: employeeData.employmentType,
      salary_details: employeeData.salaryDetails
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

// Add new employee
const employee = await addEmployee(accessToken, orgId, {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@company.com',
  employeeNumber: 'EMP001',
  joiningDate: '2025-01-15',
  department: 'Engineering',
  designation: 'Software Developer',
  employmentType: 'full-time',
  salaryDetails: {
    basic: 50000,
    allowances: {
      hra: 20000,
      transport: 1600,
      special: 10000
    }
  }
});
```

**Response**:
```json
{
  "employeeId": "emp_123456",
  "employeeNumber": "EMP001",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@company.com",
  "status": "active",
  "joiningDate": "2025-01-15",
  "department": "Engineering",
  "designation": "Software Developer"
}
```

---

### 2. Salary Components

**Endpoints**:
```http
GET    /api/v1/salary-components              # List components
POST   /api/v1/salary-components              # Create component
PUT    /api/v1/salary-components/{componentId} # Update component
GET    /api/v1/employees/{employeeId}/salary  # Get employee salary
```

**Example - Get Employee Salary Structure**:
```python
# Python
import requests

def get_employee_salary(access_token, org_id, employee_id):
    url = f'https://payroll.zoho.com/api/v1/employees/{employee_id}/salary'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'organization_id': org_id
    }

    response = requests.get(url, params=params, headers=headers)
    return response.json()
```

**Response**:
```json
{
  "employeeId": "emp_123456",
  "salaryStructure": {
    "earnings": {
      "basic": 50000,
      "hra": 20000,
      "transport": 1600,
      "special": 10000
    },
    "deductions": {
      "provident_fund": 6000,
      "professional_tax": 200,
      "tds": 8000
    },
    "grossSalary": 81600,
    "totalDeductions": 14200,
    "netSalary": 67400
  }
}
```

---

### 3. Payroll Processing

**Endpoints**:
```http
GET    /api/v1/payroll              # List payroll runs
POST   /api/v1/payroll              # Process payroll
GET    /api/v1/payroll/{payrollId}  # Get payroll details
POST   /api/v1/payroll/{payrollId}/approve # Approve payroll
```

**Example - Process Payroll**:
```javascript
// JavaScript/Node.js
const processPayroll = async (accessToken, orgId, payrollData) => {
  const response = await axios.post(
    'https://payroll.zoho.com/api/v1/payroll',
    {
      organization_id: orgId,
      pay_period: payrollData.payPeriod,
      payment_date: payrollData.paymentDate,
      employee_ids: payrollData.employeeIds
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

// Process monthly payroll
const payroll = await processPayroll(accessToken, orgId, {
  payPeriod: '2025-01',
  paymentDate: '2025-02-01',
  employeeIds: ['emp_123456', 'emp_234567']
});
```

**Response**:
```json
{
  "payrollId": "payroll_789012",
  "payPeriod": "2025-01",
  "paymentDate": "2025-02-01",
  "status": "processed",
  "employeesProcessed": 2,
  "totalGrossSalary": 163200,
  "totalDeductions": 28400,
  "totalNetSalary": 134800,
  "createdTime": "2025-01-31T10:30:00Z"
}
```

---

### 4. Attendance

**Endpoints**:
```http
GET    /api/v1/attendance              # List attendance records
POST   /api/v1/attendance              # Mark attendance
PUT    /api/v1/attendance/{attendanceId} # Update attendance
GET    /api/v1/employees/{employeeId}/attendance # Get employee attendance
```

**Example - Mark Attendance**:
```python
# Python
def mark_attendance(access_token, org_id, attendance_data):
    url = 'https://payroll.zoho.com/api/v1/attendance'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'organization_id': org_id,
        'employee_id': attendance_data['employee_id'],
        'date': attendance_data['date'],
        'status': attendance_data['status'],  # present, absent, half-day, leave
        'hours_worked': attendance_data.get('hours_worked'),
        'notes': attendance_data.get('notes')
    }

    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

---

### 5. Leave Management

**Endpoints**:
```http
GET    /api/v1/leaves              # List leave requests
POST   /api/v1/leaves              # Apply leave
PUT    /api/v1/leaves/{leaveId}    # Update leave
POST   /api/v1/leaves/{leaveId}/approve # Approve leave
GET    /api/v1/employees/{employeeId}/leave-balance # Get balance
```

**Example - Apply Leave**:
```javascript
// JavaScript/Node.js
const applyLeave = async (accessToken, orgId, leaveData) => {
  const response = await axios.post(
    'https://payroll.zoho.com/api/v1/leaves',
    {
      organization_id: orgId,
      employee_id: leaveData.employeeId,
      leave_type: leaveData.leaveType,
      from_date: leaveData.fromDate,
      to_date: leaveData.toDate,
      reason: leaveData.reason
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

### 6. Tax Reports

**Endpoints**:
```http
GET /api/v1/reports/tax              # Tax reports
GET /api/v1/reports/payslips         # Generate payslips
GET /api/v1/reports/form16          # Form 16 (India)
GET /api/v1/reports/w2              # W-2 (US)
```

**Example - Get Tax Report**:
```python
# Python
def get_tax_report(access_token, org_id, fiscal_year):
    url = 'https://payroll.zoho.com/api/v1/reports/tax'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'organization_id': org_id,
        'fiscal_year': fiscal_year
    }

    response = requests.get(url, params=params, headers=headers)
    return response.json()
```

---

### 7. Reimbursements

**Endpoints**:
```http
GET    /api/v1/reimbursements              # List reimbursements
POST   /api/v1/reimbursements              # Submit reimbursement
PUT    /api/v1/reimbursements/{reimbId}    # Update reimbursement
POST   /api/v1/reimbursements/{reimbId}/approve # Approve
```

**Example - Submit Reimbursement**:
```javascript
// JavaScript/Node.js
const submitReimbursement = async (accessToken, orgId, reimbData) => {
  const response = await axios.post(
    'https://payroll.zoho.com/api/v1/reimbursements',
    {
      organization_id: orgId,
      employee_id: reimbData.employeeId,
      category: reimbData.category,
      amount: reimbData.amount,
      date: reimbData.date,
      description: reimbData.description,
      receipt_url: reimbData.receiptUrl
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

## Common Operations

### 1. Generate Payslip

```javascript
// JavaScript/Node.js
const generatePayslip = async (accessToken, orgId, employeeId, payPeriod) => {
  const response = await axios.get(
    `https://payroll.zoho.com/api/v1/employees/${employeeId}/payslip`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      },
      params: {
        organization_id: orgId,
        pay_period: payPeriod,
        format: 'pdf'
      },
      responseType: 'arraybuffer'
    }
  );
  return response.data;
};
```

### 2. Update Salary Component

```python
# Python
def update_salary_component(access_token, org_id, employee_id, component_data):
    url = f'https://payroll.zoho.com/api/v1/employees/{employee_id}/salary'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'organization_id': org_id,
        'effective_from': component_data['effective_from'],
        'salary_components': component_data['components']
    }

    response = requests.put(url, json=data, headers=headers)
    return response.json()
```

---

## Deluge Integration

```javascript
// Deluge Script
// Add employee from CRM
contactId = input.contact_id;
contactData = zoho.crm.getRecordById("Contacts", contactId);

employeeData = {
  "organization_id": "org_123",
  "first_name": contactData.get("First_Name"),
  "last_name": contactData.get("Last_Name"),
  "email": contactData.get("Email"),
  "employee_number": "EMP" + zoho.currenttime.toString("yyyyMMddHHmm"),
  "joining_date": today.toString("yyyy-MM-dd"),
  "department": "Sales",
  "designation": "Sales Executive"
};

response = invokeurl
[
  url: "https://payroll.zoho.com/api/v1/employees"
  type: POST
  parameters: employeeData.toString()
  connection: "zoho_payroll"
];

info "Employee added: " + response.get("employeeId");
```

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 200 | Success | Request completed |
| 201 | Created | Employee/resource created |
| 400 | Bad Request | Invalid parameters |
| 401 | Unauthorized | Invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Employee not found |
| 409 | Conflict | Duplicate employee number |
| 429 | Too Many Requests | Rate limit exceeded |

---

## Best Practices

### 1. Payroll Processing
- Verify data before processing
- Regular backups
- Audit payroll runs
- Maintain compliance records

### 2. Security
- Limit API access
- Encrypt sensitive data
- Regular security audits
- Access logging

### 3. Data Management
- Regular data validation
- Archive old records
- Maintain audit trails
- Backup tax documents

---

## Data Centers

| Region | API Base URL |
|--------|-------------|
| US | `https://payroll.zoho.com/api/v1/` |
| EU | `https://payroll.zoho.eu/api/v1/` |
| IN | `https://payroll.zoho.in/api/v1/` |
| AU | `https://payroll.zoho.com.au/api/v1/` |

---

## Additional Resources

- **Official Documentation**: https://www.zoho.com/payroll/help/api/
- **Developer Console**: https://api-console.zoho.com/
- **Compliance Guide**: https://www.zoho.com/payroll/compliance/
