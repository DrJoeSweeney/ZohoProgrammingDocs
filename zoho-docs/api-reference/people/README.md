# Zoho People API Reference

## Overview

Zoho People is a comprehensive cloud-based HR management system that streamlines workforce management, attendance tracking, leave management, performance appraisals, and employee records. The API provides full programmatic access to HR data and operations.

**Current API Version**: v2
**Base URL**: `https://people.zoho.com/people/api/`
**Protocol**: REST
**Data Format**: JSON, XML
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

### 1. Employee Records
**Purpose**: Manage employee information and organizational hierarchy

**Endpoints**:
```http
GET    /people/api/forms/employee/getRecords     # Get all employees
GET    /people/api/forms/employee/getRecords     # Get specific employee
POST   /people/api/forms/employee/insertRecord   # Create employee
POST   /people/api/forms/employee/updateRecord   # Update employee
POST   /people/api/forms/employee/deleteRecord   # Delete employee
GET    /people/api/forms/employee/getFieldInfo   # Get field metadata
```

**Employee Fields**:
- Personal Information (Name, DOB, Gender, etc.)
- Contact Details (Email, Phone, Address)
- Employment Details (Date of Joining, Employee ID, Department)
- Reporting Structure (Manager, Team)
- Compensation Information
- Custom Fields

**Example - Get All Employees**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const getAllEmployees = async (accessToken) => {
  const response = await axios.get(
    'https://people.zoho.com/people/api/forms/employee/getRecords',
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      },
      params: {
        sIndex: 1,
        limit: 200
      }
    }
  );
  return response.data;
};
```

**Response**:
```json
{
  "response": {
    "result": [
      {
        "EmployeeID": "E12345",
        "EmailID": "john.doe@company.com",
        "FirstName": "John",
        "LastName": "Doe",
        "Employeemailingaddress": "123 Main St, New York, NY 10001",
        "Dateofbirth": "1990-05-15",
        "Dateofjoining": "2020-01-15",
        "Department": "Engineering",
        "Designation": "Senior Developer",
        "ReportingTo": "Jane Smith",
        "EmployeeStatus": "Active",
        "PhotoUrl": "https://people.zoho.com/photos/john_doe.jpg",
        "recordId": "1234567890123456789"
      }
    ],
    "message": "Records fetched successfully",
    "status": 0
  }
}
```

**Example - Create Employee**:
```javascript
// JavaScript/Node.js
const createEmployee = async (accessToken) => {
  const response = await axios.post(
    'https://people.zoho.com/people/api/forms/employee/insertRecord',
    {
      FirstName: 'Alice',
      LastName: 'Johnson',
      EmailID: 'alice.johnson@company.com',
      EmployeeID: 'E12346',
      Dateofjoining: '2025-01-15',
      Department: 'Marketing',
      Designation: 'Marketing Manager',
      ReportingTo: 'John Smith',
      Employeemailingaddress: '456 Oak Ave, Los Angeles, CA 90001',
      Dateofbirth: '1988-08-20',
      Gender: 'Female',
      PhoneNo: '555-0123'
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  return response.data;
};
```

```python
# Python
import requests

def create_employee(access_token):
    url = 'https://people.zoho.com/people/api/forms/employee/insertRecord'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    data = {
        'FirstName': 'Alice',
        'LastName': 'Johnson',
        'EmailID': 'alice.johnson@company.com',
        'EmployeeID': 'E12346',
        'Dateofjoining': '2025-01-15',
        'Department': 'Marketing',
        'Designation': 'Marketing Manager',
        'ReportingTo': 'John Smith',
        'Employeemailingaddress': '456 Oak Ave, Los Angeles, CA 90001',
        'Dateofbirth': '1988-08-20',
        'Gender': 'Female',
        'PhoneNo': '555-0123'
    }
    response = requests.post(url, data=data, headers=headers)
    return response.json()
```

```deluge
// Deluge
employee_data = {
    "FirstName": "Alice",
    "LastName": "Johnson",
    "EmailID": "alice.johnson@company.com",
    "EmployeeID": "E12346",
    "Dateofjoining": "2025-01-15",
    "Department": "Marketing",
    "Designation": "Marketing Manager",
    "ReportingTo": "John Smith",
    "Employeemailingaddress": "456 Oak Ave, Los Angeles, CA 90001",
    "Dateofbirth": "1988-08-20",
    "Gender": "Female",
    "PhoneNo": "555-0123"
};

response = zoho.people.insertRecord("employee", employee_data);
info response;
```

**Example - Update Employee**:
```javascript
// JavaScript/Node.js
const updateEmployee = async (accessToken, recordId) => {
  const response = await axios.post(
    'https://people.zoho.com/people/api/forms/employee/updateRecord',
    {
      recordId: recordId,
      Department: 'Product Management',
      Designation: 'Product Manager'
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  return response.data;
};
```

---

### 2. Attendance Tracking
**Purpose**: Manage employee check-in/check-out and attendance records

**Endpoints**:
```http
GET    /people/api/attendance/getAttendanceEntries  # Get attendance records
POST   /people/api/attendance/checkIn               # Check in
POST   /people/api/attendance/checkOut              # Check out
POST   /people/api/attendance/regularize            # Regularize attendance
GET    /people/api/attendance/getShifts             # Get shift information
GET    /people/api/attendance/getAttendanceReport   # Get attendance report
```

**Attendance Entry Types**:
- Check-in/Check-out
- Regular hours
- Overtime
- Break time
- Work from home
- On-site

**Example - Check In**:
```javascript
// JavaScript/Node.js
const checkIn = async (accessToken, emailId) => {
  const response = await axios.post(
    'https://people.zoho.com/people/api/attendance/checkIn',
    {
      emailId: emailId,
      dateFormat: 'MM/dd/yyyy',
      checkIn: '01/15/2025 09:00:00 AM'
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  return response.data;
};
```

**Response**:
```json
{
  "response": {
    "result": {
      "checkInTime": "09:00:00 AM",
      "checkInDate": "01/15/2025",
      "status": "Checked In",
      "message": "Check-in successful"
    },
    "status": 0
  }
}
```

**Example - Check Out**:
```javascript
// JavaScript/Node.js
const checkOut = async (accessToken, emailId) => {
  const response = await axios.post(
    'https://people.zoho.com/people/api/attendance/checkOut',
    {
      emailId: emailId,
      dateFormat: 'MM/dd/yyyy',
      checkOut: '01/15/2025 06:00:00 PM'
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  return response.data;
};
```

```python
# Python
def check_in(access_token, email_id):
    url = 'https://people.zoho.com/people/api/attendance/checkIn'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    data = {
        'emailId': email_id,
        'dateFormat': 'MM/dd/yyyy',
        'checkIn': '01/15/2025 09:00:00 AM'
    }
    response = requests.post(url, data=data, headers=headers)
    return response.json()

def check_out(access_token, email_id):
    url = 'https://people.zoho.com/people/api/attendance/checkOut'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    data = {
        'emailId': email_id,
        'dateFormat': 'MM/dd/yyyy',
        'checkOut': '01/15/2025 06:00:00 PM'
    }
    response = requests.post(url, data=data, headers=headers)
    return response.json()
```

**Example - Get Attendance Records**:
```javascript
// JavaScript/Node.js
const getAttendanceRecords = async (accessToken, emailId, fromDate, toDate) => {
  const response = await axios.get(
    'https://people.zoho.com/people/api/attendance/getAttendanceEntries',
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      },
      params: {
        emailId: emailId,
        fromDate: fromDate,  // MM/dd/yyyy
        toDate: toDate,      // MM/dd/yyyy
        dateFormat: 'MM/dd/yyyy'
      }
    }
  );
  return response.data;
};
```

**Example - Regularize Attendance**:
```javascript
// JavaScript/Node.js
const regularizeAttendance = async (accessToken, emailId, date) => {
  const response = await axios.post(
    'https://people.zoho.com/people/api/attendance/regularize',
    {
      emailId: emailId,
      attendanceDate: date,
      checkIn: '09:00:00 AM',
      checkOut: '06:00:00 PM',
      reason: 'Forgot to check in/out',
      dateFormat: 'MM/dd/yyyy'
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  return response.data;
};
```

```deluge
// Deluge
attendance_data = {
    "emailId": "john.doe@company.com",
    "attendanceDate": "01/15/2025",
    "checkIn": "09:00:00 AM",
    "checkOut": "06:00:00 PM",
    "reason": "Forgot to check in/out",
    "dateFormat": "MM/dd/yyyy"
};

response = zoho.people.regularize(attendance_data);
info response;
```

---

### 3. Leave Management
**Purpose**: Manage leave requests, balances, and approvals

**Endpoints**:
```http
GET    /people/api/leave/getLeaveTypeDetails       # Get leave types
GET    /people/api/leave/getLeaveBalances          # Get leave balances
POST   /people/api/leave/applyLeave                # Apply for leave
GET    /people/api/leave/getLeaveDetails           # Get leave details
POST   /people/api/leave/approveLeave              # Approve leave
POST   /people/api/leave/rejectLeave               # Reject leave
POST   /people/api/leave/cancelLeave               # Cancel leave
GET    /people/api/leave/getHolidays               # Get holidays
```

**Leave Types**:
- Annual Leave / Vacation
- Sick Leave
- Casual Leave
- Maternity/Paternity Leave
- Compensatory Off
- Work from Home
- Custom Leave Types

**Example - Get Leave Balances**:
```javascript
// JavaScript/Node.js
const getLeaveBalances = async (accessToken, emailId) => {
  const response = await axios.get(
    'https://people.zoho.com/people/api/leave/getLeaveBalances',
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      },
      params: {
        emailId: emailId
      }
    }
  );
  return response.data;
};
```

**Response**:
```json
{
  "response": {
    "result": [
      {
        "leaveType": "Annual Leave",
        "available": 15.0,
        "used": 5.0,
        "total": 20.0,
        "unit": "Days"
      },
      {
        "leaveType": "Sick Leave",
        "available": 10.0,
        "used": 2.0,
        "total": 12.0,
        "unit": "Days"
      },
      {
        "leaveType": "Casual Leave",
        "available": 6.0,
        "used": 0.0,
        "total": 6.0,
        "unit": "Days"
      }
    ],
    "status": 0
  }
}
```

**Example - Apply for Leave**:
```javascript
// JavaScript/Node.js
const applyLeave = async (accessToken, emailId) => {
  const response = await axios.post(
    'https://people.zoho.com/people/api/leave/applyLeave',
    {
      emailId: emailId,
      leaveType: 'Annual Leave',
      from: '01/20/2025',
      to: '01/22/2025',
      numberOfDays: 3,
      reason: 'Family vacation',
      dateFormat: 'MM/dd/yyyy'
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  return response.data;
};
```

```python
# Python
def apply_leave(access_token, email_id):
    url = 'https://people.zoho.com/people/api/leave/applyLeave'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    data = {
        'emailId': email_id,
        'leaveType': 'Annual Leave',
        'from': '01/20/2025',
        'to': '01/22/2025',
        'numberOfDays': 3,
        'reason': 'Family vacation',
        'dateFormat': 'MM/dd/yyyy'
    }
    response = requests.post(url, data=data, headers=headers)
    return response.json()
```

```deluge
// Deluge
leave_data = {
    "emailId": "john.doe@company.com",
    "leaveType": "Annual Leave",
    "from": "01/20/2025",
    "to": "01/22/2025",
    "numberOfDays": 3,
    "reason": "Family vacation",
    "dateFormat": "MM/dd/yyyy"
};

response = zoho.people.applyLeave(leave_data);
info response;
```

**Example - Approve Leave**:
```javascript
// JavaScript/Node.js
const approveLeave = async (accessToken, leaveId, approverEmail) => {
  const response = await axios.post(
    'https://people.zoho.com/people/api/leave/approveLeave',
    {
      leaveId: leaveId,
      approverEmailId: approverEmail,
      comments: 'Approved for the requested dates'
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  return response.data;
};
```

**Example - Get Holidays**:
```python
# Python
def get_holidays(access_token, year):
    url = 'https://people.zoho.com/people/api/leave/getHolidays'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'year': year
    }
    response = requests.get(url, headers=headers, params=params)
    return response.json()
```

---

### 4. Timesheet Management
**Purpose**: Track time spent on projects and tasks

**Endpoints**:
```http
GET    /people/api/timetracker/getjobs             # Get jobs/projects
GET    /people/api/timetracker/getTimeLogs         # Get time logs
POST   /people/api/timetracker/addTimeLog          # Add time entry
POST   /people/api/timetracker/updateTimeLog       # Update time entry
POST   /people/api/timetracker/deleteTimeLog       # Delete time entry
POST   /people/api/timetracker/submitTimesheet     # Submit timesheet
GET    /people/api/timetracker/getTimesheetStatus  # Get timesheet status
POST   /people/api/timetracker/approveTimesheet    # Approve timesheet
```

**Time Log Fields**:
- Employee
- Project/Job
- Date
- Hours worked
- Description
- Billable/Non-billable
- Status

**Example - Get Projects/Jobs**:
```javascript
// JavaScript/Node.js
const getJobs = async (accessToken) => {
  const response = await axios.get(
    'https://people.zoho.com/people/api/timetracker/getjobs',
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

**Response**:
```json
{
  "response": {
    "result": [
      {
        "jobId": "123456",
        "jobName": "Website Redesign",
        "clientName": "Acme Corp",
        "status": "Active",
        "billable": true
      },
      {
        "jobId": "123457",
        "jobName": "Mobile App Development",
        "clientName": "Tech Solutions",
        "status": "Active",
        "billable": true
      }
    ],
    "status": 0
  }
}
```

**Example - Add Time Log**:
```javascript
// JavaScript/Node.js
const addTimeLog = async (accessToken, emailId) => {
  const response = await axios.post(
    'https://people.zoho.com/people/api/timetracker/addTimeLog',
    {
      emailId: emailId,
      jobId: '123456',
      workDate: '01/15/2025',
      hours: 8.0,
      description: 'Working on homepage redesign',
      billable: true,
      dateFormat: 'MM/dd/yyyy'
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  return response.data;
};
```

```python
# Python
def add_time_log(access_token, email_id):
    url = 'https://people.zoho.com/people/api/timetracker/addTimeLog'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    data = {
        'emailId': email_id,
        'jobId': '123456',
        'workDate': '01/15/2025',
        'hours': 8.0,
        'description': 'Working on homepage redesign',
        'billable': True,
        'dateFormat': 'MM/dd/yyyy'
    }
    response = requests.post(url, data=data, headers=headers)
    return response.json()
```

```deluge
// Deluge
timelog_data = {
    "emailId": "john.doe@company.com",
    "jobId": "123456",
    "workDate": "01/15/2025",
    "hours": 8.0,
    "description": "Working on homepage redesign",
    "billable": true,
    "dateFormat": "MM/dd/yyyy"
};

response = zoho.people.addTimeLog(timelog_data);
info response;
```

**Example - Get Time Logs**:
```javascript
// JavaScript/Node.js
const getTimeLogs = async (accessToken, emailId, fromDate, toDate) => {
  const response = await axios.get(
    'https://people.zoho.com/people/api/timetracker/getTimeLogs',
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      },
      params: {
        emailId: emailId,
        fromDate: fromDate,  // MM/dd/yyyy
        toDate: toDate,      // MM/dd/yyyy
        dateFormat: 'MM/dd/yyyy'
      }
    }
  );
  return response.data;
};
```

**Example - Submit Timesheet**:
```javascript
// JavaScript/Node.js
const submitTimesheet = async (accessToken, emailId, weekDate) => {
  const response = await axios.post(
    'https://people.zoho.com/people/api/timetracker/submitTimesheet',
    {
      emailId: emailId,
      weekDate: weekDate,  // MM/dd/yyyy (any date in the week)
      dateFormat: 'MM/dd/yyyy'
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  return response.data;
};
```

---

### 5. Performance Appraisal
**Purpose**: Manage employee performance reviews and appraisals

**Endpoints**:
```http
GET    /people/api/appraisal/getAppraisals         # Get appraisals
POST   /people/api/appraisal/createAppraisal       # Create appraisal
POST   /people/api/appraisal/updateAppraisal       # Update appraisal
GET    /people/api/appraisal/getAppraisalStatus    # Get appraisal status
POST   /people/api/appraisal/submitAppraisal       # Submit appraisal
GET    /people/api/appraisal/getTemplates          # Get appraisal templates
POST   /people/api/appraisal/addFeedback           # Add feedback
GET    /people/api/goals/getGoals                  # Get goals
POST   /people/api/goals/createGoal                # Create goal
POST   /people/api/goals/updateGoal                # Update goal
```

**Appraisal Components**:
- Self appraisal
- Manager appraisal
- 360-degree feedback
- Goals and KPIs
- Competency ratings
- Overall rating
- Comments and feedback

**Example - Get Appraisals**:
```javascript
// JavaScript/Node.js
const getAppraisals = async (accessToken, emailId) => {
  const response = await axios.get(
    'https://people.zoho.com/people/api/appraisal/getAppraisals',
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      },
      params: {
        emailId: emailId,
        year: '2025'
      }
    }
  );
  return response.data;
};
```

**Response**:
```json
{
  "response": {
    "result": [
      {
        "appraisalId": "987654321",
        "employeeName": "John Doe",
        "appraisalCycle": "Annual 2025",
        "selfRating": 4.5,
        "managerRating": 4.0,
        "finalRating": 4.2,
        "status": "Completed",
        "startDate": "01/01/2025",
        "endDate": "12/31/2025"
      }
    ],
    "status": 0
  }
}
```

**Example - Create Goal**:
```javascript
// JavaScript/Node.js
const createGoal = async (accessToken, emailId) => {
  const response = await axios.post(
    'https://people.zoho.com/people/api/goals/createGoal',
    {
      emailId: emailId,
      goalTitle: 'Improve Code Quality',
      goalDescription: 'Reduce bugs by 30% and improve test coverage to 85%',
      startDate: '01/01/2025',
      endDate: '12/31/2025',
      weightage: 20,
      status: 'In Progress',
      dateFormat: 'MM/dd/yyyy'
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  return response.data;
};
```

```python
# Python
def create_goal(access_token, email_id):
    url = 'https://people.zoho.com/people/api/goals/createGoal'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    data = {
        'emailId': email_id,
        'goalTitle': 'Improve Code Quality',
        'goalDescription': 'Reduce bugs by 30% and improve test coverage to 85%',
        'startDate': '01/01/2025',
        'endDate': '12/31/2025',
        'weightage': 20,
        'status': 'In Progress',
        'dateFormat': 'MM/dd/yyyy'
    }
    response = requests.post(url, data=data, headers=headers)
    return response.json()
```

```deluge
// Deluge
goal_data = {
    "emailId": "john.doe@company.com",
    "goalTitle": "Improve Code Quality",
    "goalDescription": "Reduce bugs by 30% and improve test coverage to 85%",
    "startDate": "01/01/2025",
    "endDate": "12/31/2025",
    "weightage": 20,
    "status": "In Progress",
    "dateFormat": "MM/dd/yyyy"
};

response = zoho.people.createGoal(goal_data);
info response;
```

**Example - Add Feedback**:
```javascript
// JavaScript/Node.js
const addFeedback = async (accessToken, appraisalId) => {
  const response = await axios.post(
    'https://people.zoho.com/people/api/appraisal/addFeedback',
    {
      appraisalId: appraisalId,
      feedbackType: 'Manager',
      rating: 4.5,
      comments: 'Excellent performance throughout the year. Strong technical skills and great team collaboration.',
      strengths: 'Problem-solving, leadership, communication',
      areasOfImprovement: 'Time management, documentation'
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  return response.data;
};
```

---

### 6. Forms and Custom Fields
**Purpose**: Manage custom forms and fields

**Endpoints**:
```http
GET    /people/api/forms                           # Get all forms
GET    /people/api/forms/{formName}/getRecords     # Get form records
POST   /people/api/forms/{formName}/insertRecord   # Insert form record
POST   /people/api/forms/{formName}/updateRecord   # Update form record
POST   /people/api/forms/{formName}/deleteRecord   # Delete form record
GET    /people/api/forms/{formName}/getFieldInfo   # Get field information
```

**Common Forms**:
- employee (Employee Master)
- leave (Leave records)
- attendance (Attendance records)
- timetracker (Timesheet records)
- appraisal (Appraisal records)
- Custom forms

**Example - Get Form Fields**:
```javascript
// JavaScript/Node.js
const getFormFields = async (accessToken, formName) => {
  const response = await axios.get(
    `https://people.zoho.com/people/api/forms/${formName}/getFieldInfo`,
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

### 7. Reports
**Purpose**: Generate HR reports and analytics

**Endpoints**:
```http
GET    /people/api/reports/getAttendanceReport     # Attendance report
GET    /people/api/reports/getLeaveReport          # Leave report
GET    /people/api/reports/getTimesheetReport      # Timesheet report
GET    /people/api/reports/getEmployeeReport       # Employee report
GET    /people/api/reports/getAppraisalReport      # Appraisal report
```

**Report Types**:
- Employee Directory
- Attendance Summary
- Leave Balance
- Leave History
- Timesheet Summary
- Performance Reports
- Headcount Reports
- Custom Reports

**Example - Get Attendance Report**:
```javascript
// JavaScript/Node.js
const getAttendanceReport = async (accessToken, fromDate, toDate) => {
  const response = await axios.get(
    'https://people.zoho.com/people/api/reports/getAttendanceReport',
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      },
      params: {
        fromDate: fromDate,
        toDate: toDate,
        dateFormat: 'MM/dd/yyyy'
      }
    }
  );
  return response.data;
};
```

```python
# Python
def get_attendance_report(access_token, from_date, to_date):
    url = 'https://people.zoho.com/people/api/reports/getAttendanceReport'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'fromDate': from_date,
        'toDate': to_date,
        'dateFormat': 'MM/dd/yyyy'
    }
    response = requests.get(url, headers=headers, params=params)
    return response.json()
```

---

## Authentication

### OAuth 2.0 Flow

**Step 1: Register Your Application**
- Go to [Zoho API Console](https://api-console.zoho.com/)
- Create a new Client
- Client Type: Server-based Applications
- Note your Client ID and Client Secret
- Set authorized redirect URI

**Step 2: Generate Authorization Code**
```http
GET https://accounts.zoho.com/oauth/v2/auth?
  scope=ZohoPeople.forms.ALL,ZohoPeople.attendance.ALL,ZohoPeople.leave.ALL,ZohoPeople.timetracker.ALL&
  client_id={client_id}&
  response_type=code&
  access_type=offline&
  redirect_uri={redirect_uri}
```

**Available Scopes**:
- `ZohoPeople.forms.ALL` - Access to all forms and employee data
- `ZohoPeople.forms.READ` - Read-only access to forms
- `ZohoPeople.forms.CREATE` - Create records
- `ZohoPeople.forms.UPDATE` - Update records
- `ZohoPeople.forms.DELETE` - Delete records
- `ZohoPeople.attendance.ALL` - Full attendance access
- `ZohoPeople.attendance.READ` - Read attendance
- `ZohoPeople.attendance.CREATE` - Create attendance entries
- `ZohoPeople.leave.ALL` - Full leave management access
- `ZohoPeople.leave.READ` - Read leave data
- `ZohoPeople.leave.CREATE` - Apply for leave
- `ZohoPeople.leave.UPDATE` - Update leave records
- `ZohoPeople.timetracker.ALL` - Full timesheet access
- `ZohoPeople.timetracker.READ` - Read timesheet data
- `ZohoPeople.timetracker.CREATE` - Create time entries
- `ZohoPeople.appraisal.ALL` - Full appraisal access
- `ZohoPeople.appraisal.READ` - Read appraisal data

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

**JavaScript Token Management Example**:
```javascript
const axios = require('axios');

class ZohoPeopleClient {
  constructor(clientId, clientSecret, refreshToken) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.refreshToken = refreshToken;
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async ensureValidToken() {
    if (!this.accessToken || Date.now() >= this.tokenExpiry) {
      await this.refreshAccessToken();
    }
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
    this.tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000; // 1 min buffer
  }

  async makeRequest(method, endpoint, data = null) {
    await this.ensureValidToken();

    const config = {
      method,
      url: `https://people.zoho.com/people/api${endpoint}`,
      headers: {
        'Authorization': `Zoho-oauthtoken ${this.accessToken}`
      }
    };

    if (data) {
      config.data = data;
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    return await axios(config);
  }
}

// Usage
const client = new ZohoPeopleClient(clientId, clientSecret, refreshToken);
const employees = await client.makeRequest('GET', '/forms/employee/getRecords?sIndex=1&limit=200');
```

**Python Token Management Example**:
```python
import requests
import time

class ZohoPeopleClient:
    def __init__(self, client_id, client_secret, refresh_token):
        self.client_id = client_id
        self.client_secret = client_secret
        self.refresh_token = refresh_token
        self.access_token = None
        self.token_expiry = None

    def ensure_valid_token(self):
        if not self.access_token or time.time() >= self.token_expiry:
            self.refresh_access_token()

    def refresh_access_token(self):
        url = 'https://accounts.zoho.com/oauth/v2/token'
        params = {
            'grant_type': 'refresh_token',
            'client_id': self.client_id,
            'client_secret': self.client_secret,
            'refresh_token': self.refresh_token
        }
        response = requests.post(url, params=params)
        data = response.json()

        self.access_token = data['access_token']
        self.token_expiry = time.time() + data['expires_in'] - 60  # 1 min buffer

    def make_request(self, method, endpoint, data=None):
        self.ensure_valid_token()

        url = f'https://people.zoho.com/people/api{endpoint}'
        headers = {
            'Authorization': f'Zoho-oauthtoken {self.access_token}'
        }

        if method == 'GET':
            response = requests.get(url, headers=headers, params=data)
        else:
            response = requests.post(url, headers=headers, data=data)

        return response.json()

# Usage
client = ZohoPeopleClient(client_id, client_secret, refresh_token)
employees = client.make_request('GET', '/forms/employee/getRecords', {'sIndex': 1, 'limit': 200})
```

**Token Lifetime**:
- Access Token: 1 hour
- Refresh Token: Does not expire (store securely)

**Important Notes**:
- Store refresh tokens securely (encrypted database, secure vault)
- Never expose tokens in client-side code
- Implement automatic token refresh before expiration
- Each organization may have different data access permissions

---

## Rate Limits

### API Call Limits

| Plan | API Calls per Day | API Calls per Minute | Concurrent Calls |
|------|-------------------|----------------------|------------------|
| Free | 1,000 | 10 | 2 |
| Standard | 5,000 | 20 | 5 |
| Professional | 10,000 | 30 | 10 |
| Premium | 25,000 | 50 | 15 |
| Enterprise | 50,000 | 100 | 25 |

### Rate Limit Details

**Per Minute Limit**:
- Varies by plan (10-100 calls per minute)
- Resets every 60 seconds
- Applies across all API endpoints

**Daily Limit**:
- Varies by plan (see table above)
- Resets at midnight UTC
- Includes all API operations (GET, POST)

**Concurrent Calls**:
- Maximum simultaneous API requests
- Varies by plan (2-25 concurrent requests)
- Additional requests are queued or rejected

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1673827200
```

### Handling Rate Limits

**JavaScript Example with Retry**:
```javascript
const makeRequestWithRetry = async (fn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.response?.status === 429) {
        const resetTime = error.response.headers['x-ratelimit-reset'];
        const waitTime = resetTime ? (resetTime * 1000) - Date.now() : 60000;

        if (i < maxRetries - 1) {
          console.log(`Rate limit hit. Waiting ${waitTime}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
      }
      throw error;
    }
  }
};

// Usage
const employees = await makeRequestWithRetry(() =>
  getAllEmployees(accessToken)
);
```

**Python Example with Retry**:
```python
import time
import requests

def make_request_with_retry(fn, max_retries=3):
    for i in range(max_retries):
        try:
            return fn()
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 429:
                reset_time = int(e.response.headers.get('X-RateLimit-Reset', 0))
                wait_time = max(reset_time - int(time.time()), 60)

                if i < max_retries - 1:
                    print(f'Rate limit hit. Waiting {wait_time}s before retry...')
                    time.sleep(wait_time)
                    continue
            raise

# Usage
employees = make_request_with_retry(lambda: get_all_employees(access_token))
```

**Best Practices**:
- Monitor rate limit headers in responses
- Implement exponential backoff for retries
- Cache frequently accessed data
- Use webhooks for real-time updates instead of polling
- Batch operations when possible
- Distribute API calls throughout the day

---

## Data Centers

Zoho People operates in multiple data centers. Always use the base URL corresponding to your account's data center.

| Data Center | Base URL | Accounts URL |
|-------------|----------|--------------|
| US | https://people.zoho.com | https://accounts.zoho.com |
| EU | https://people.zoho.eu | https://accounts.zoho.eu |
| IN | https://people.zoho.in | https://accounts.zoho.in |
| AU | https://people.zoho.com.au | https://accounts.zoho.com.au |
| JP | https://people.zoho.jp | https://accounts.zoho.jp |
| CA | https://people.zoho.ca | https://accounts.zoho.ca |
| CN | https://people.zoho.com.cn | https://accounts.zoho.com.cn |

### Determining Your Data Center

**Method 1: Check OAuth Response**
```json
{
  "access_token": "1000.xxx",
  "api_domain": "https://www.zohoapis.com",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

**Method 2: Check Your Zoho People URL**
- US: people.zoho.com
- EU: people.zoho.eu
- IN: people.zoho.in
- AU: people.zoho.com.au
- JP: people.zoho.jp
- CA: people.zoho.ca
- CN: people.zoho.com.cn

**Dynamic Base URL Configuration**:
```javascript
// JavaScript/Node.js
class ZohoPeopleClient {
  constructor(accessToken, baseURL = 'https://people.zoho.com') {
    this.accessToken = accessToken;
    this.baseURL = baseURL;
  }

  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${this.baseURL}/people/api${endpoint}${queryString ? '?' + queryString : ''}`;

    const response = await axios.get(url, {
      headers: {
        'Authorization': `Zoho-oauthtoken ${this.accessToken}`
      }
    });
    return response.data;
  }
}

// Usage
const client = new ZohoPeopleClient(accessToken, 'https://people.zoho.eu');
const employees = await client.get('/forms/employee/getRecords', { sIndex: 1, limit: 200 });
```

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
| 405 | Method Not Allowed | Invalid HTTP method |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |
| 503 | Service Unavailable | Service temporarily unavailable |

### Zoho People Error Codes

| Code | Message | Description | Solution |
|------|---------|-------------|----------|
| 0 | Success | Operation completed successfully | N/A |
| 1001 | Invalid authentication | Token expired or invalid | Refresh access token |
| 1002 | Access denied | Insufficient permissions | Check OAuth scopes |
| 1003 | Invalid input | Missing or invalid parameters | Validate input parameters |
| 1004 | Record not found | Requested record doesn't exist | Verify record ID |
| 1005 | Duplicate record | Record already exists | Update existing record |
| 1006 | Invalid date format | Date format is incorrect | Use MM/dd/yyyy format |
| 1007 | Invalid email | Email format is incorrect | Validate email format |
| 1008 | Operation failed | Generic operation failure | Check logs and retry |
| 1009 | Rate limit exceeded | Too many API calls | Implement rate limiting |
| 1010 | Invalid form name | Form doesn't exist | Verify form name |

### Error Response Format

```json
{
  "response": {
    "message": "Invalid email address format",
    "errors": {
      "message": "The email address provided is not valid",
      "code": 1007
    },
    "status": 1
  }
}
```

### Error Handling Examples

**JavaScript**:
```javascript
const handlePeopleError = (error) => {
  if (error.response) {
    const { status, data } = error.response;

    switch (status) {
      case 401:
        console.error('Authentication failed. Refreshing token...');
        // Refresh token logic
        break;

      case 429:
        console.error('Rate limit exceeded. Waiting...');
        const resetTime = error.response.headers['x-ratelimit-reset'];
        // Wait logic
        break;

      case 400:
        console.error(`Bad request: ${data.response?.message}`);
        if (data.response?.errors) {
          console.error(`Error code: ${data.response.errors.code}`);
        }
        break;

      case 404:
        console.error('Resource not found');
        break;

      case 500:
      case 503:
        console.error('Server error. Retrying...');
        // Retry logic
        break;

      default:
        console.error(`Error ${status}: ${data.response?.message}`);
    }
  } else {
    console.error('Network error:', error.message);
  }
};

// Usage
try {
  const employee = await createEmployee(accessToken);
} catch (error) {
  handlePeopleError(error);
}
```

**Python**:
```python
def handle_people_error(error):
    if isinstance(error, requests.exceptions.HTTPError):
        status = error.response.status_code
        data = error.response.json()

        if status == 401:
            print('Authentication failed. Refreshing token...')
            # Refresh token logic

        elif status == 429:
            print('Rate limit exceeded. Waiting...')
            reset_time = int(error.response.headers.get('X-RateLimit-Reset', 0))
            wait_time = reset_time - int(time.time())
            time.sleep(max(wait_time, 0))
            # Retry logic

        elif status == 400:
            print(f"Bad request: {data.get('response', {}).get('message')}")
            errors = data.get('response', {}).get('errors', {})
            if errors:
                print(f"Error code: {errors.get('code')}")

        elif status == 404:
            print('Resource not found')

        elif status in [500, 503]:
            print('Server error. Retrying...')
            # Retry logic

        else:
            print(f"Error {status}: {data.get('response', {}).get('message')}")
    else:
        print(f'Request error: {str(error)}')

# Usage
try:
    employee = create_employee(access_token)
except requests.exceptions.HTTPError as e:
    handle_people_error(e)
```

---

## Common Operations

### 1. Employee Onboarding Workflow

```javascript
// JavaScript/Node.js - Complete Employee Onboarding
const onboardEmployee = async (accessToken, employeeData) => {
  try {
    // 1. Create employee record
    const employeeResponse = await axios.post(
      'https://people.zoho.com/people/api/forms/employee/insertRecord',
      employeeData,
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const emailId = employeeData.EmailID;
    console.log('Employee created:', emailId);

    // 2. Assign leave types and balances
    const leaveTypes = ['Annual Leave', 'Sick Leave', 'Casual Leave'];
    for (const leaveType of leaveTypes) {
      await axios.post(
        'https://people.zoho.com/people/api/leave/assignLeaveType',
        {
          emailId: emailId,
          leaveType: leaveType,
          balance: 20
        },
        {
          headers: {
            'Authorization': `Zoho-oauthtoken ${accessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
    }
    console.log('Leave types assigned');

    // 3. Set initial goals
    await axios.post(
      'https://people.zoho.com/people/api/goals/createGoal',
      {
        emailId: emailId,
        goalTitle: 'Complete Onboarding Training',
        goalDescription: 'Complete all mandatory training within 30 days',
        startDate: new Date().toLocaleDateString('en-US'),
        endDate: new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('en-US'),
        weightage: 100,
        status: 'Not Started',
        dateFormat: 'MM/dd/yyyy'
      },
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    console.log('Initial goals set');

    return {
      success: true,
      employeeId: employeeResponse.data.response.result.recordId,
      emailId: emailId
    };

  } catch (error) {
    console.error('Onboarding error:', error.response?.data || error.message);
    throw error;
  }
};
```

### 2. Daily Attendance Summary

```python
# Python - Generate Daily Attendance Summary
import requests
from datetime import datetime, timedelta

def get_daily_attendance_summary(access_token, date):
    url = 'https://people.zoho.com/people/api/attendance/getAttendanceEntries'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }

    # Get all employees
    employees_response = requests.get(
        'https://people.zoho.com/people/api/forms/employee/getRecords',
        headers=headers,
        params={'sIndex': 1, 'limit': 200}
    )
    employees = employees_response.json()['response']['result']

    summary = {
        'date': date,
        'total_employees': len(employees),
        'present': 0,
        'absent': 0,
        'on_leave': 0,
        'late': 0,
        'details': []
    }

    for employee in employees:
        email_id = employee.get('EmailID')
        if not email_id:
            continue

        # Get attendance for this employee
        attendance_response = requests.get(
            url,
            headers=headers,
            params={
                'emailId': email_id,
                'fromDate': date,
                'toDate': date,
                'dateFormat': 'MM/dd/yyyy'
            }
        )

        attendance_data = attendance_response.json()
        attendance = attendance_data.get('response', {}).get('result', [])

        if attendance:
            entry = attendance[0]
            summary['present'] += 1

            # Check if late (after 9:30 AM)
            check_in = entry.get('checkIn', '')
            if check_in:
                check_in_time = datetime.strptime(check_in, '%I:%M:%S %p')
                if check_in_time > datetime.strptime('09:30:00 AM', '%I:%M:%S %p'):
                    summary['late'] += 1

            summary['details'].append({
                'employee': f"{employee['FirstName']} {employee['LastName']}",
                'status': 'Present',
                'check_in': check_in,
                'check_out': entry.get('checkOut', '')
            })
        else:
            # Check if on leave
            leave_response = requests.get(
                'https://people.zoho.com/people/api/leave/getLeaveDetails',
                headers=headers,
                params={
                    'emailId': email_id,
                    'fromDate': date,
                    'toDate': date,
                    'dateFormat': 'MM/dd/yyyy'
                }
            )

            leave_data = leave_response.json()
            if leave_data.get('response', {}).get('result'):
                summary['on_leave'] += 1
                summary['details'].append({
                    'employee': f"{employee['FirstName']} {employee['LastName']}",
                    'status': 'On Leave'
                })
            else:
                summary['absent'] += 1
                summary['details'].append({
                    'employee': f"{employee['FirstName']} {employee['LastName']}",
                    'status': 'Absent'
                })

    return summary

# Usage
today = datetime.now().strftime('%m/%d/%Y')
summary = get_daily_attendance_summary(access_token, today)
print(f"Date: {summary['date']}")
print(f"Present: {summary['present']}/{summary['total_employees']}")
print(f"Absent: {summary['absent']}")
print(f"On Leave: {summary['on_leave']}")
print(f"Late: {summary['late']}")
```

### 3. Leave Request Approval Workflow

```javascript
// JavaScript/Node.js - Process Leave Requests
const processLeaveRequests = async (accessToken, managerId) => {
  try {
    // Get pending leave requests for approval
    const response = await axios.get(
      'https://people.zoho.com/people/api/leave/getPendingRequests',
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`
        },
        params: {
          managerId: managerId
        }
      }
    );

    const pendingRequests = response.data.response.result;
    const results = {
      approved: [],
      rejected: [],
      errors: []
    };

    for (const request of pendingRequests) {
      try {
        // Business logic for approval
        const shouldApprove = await evaluateLeaveRequest(request);

        if (shouldApprove) {
          await axios.post(
            'https://people.zoho.com/people/api/leave/approveLeave',
            {
              leaveId: request.leaveId,
              approverEmailId: managerId,
              comments: 'Approved automatically based on criteria'
            },
            {
              headers: {
                'Authorization': `Zoho-oauthtoken ${accessToken}`,
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }
          );
          results.approved.push(request);
        } else {
          await axios.post(
            'https://people.zoho.com/people/api/leave/rejectLeave',
            {
              leaveId: request.leaveId,
              approverEmailId: managerId,
              comments: 'Rejected due to business requirements'
            },
            {
              headers: {
                'Authorization': `Zoho-oauthtoken ${accessToken}`,
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }
          );
          results.rejected.push(request);
        }
      } catch (error) {
        results.errors.push({
          request: request,
          error: error.message
        });
      }
    }

    return results;
  } catch (error) {
    console.error('Error processing leave requests:', error);
    throw error;
  }
};

const evaluateLeaveRequest = async (request) => {
  // Custom business logic
  // Example: Auto-approve if less than 2 days and balance available
  return request.numberOfDays <= 2 && request.availableBalance >= request.numberOfDays;
};
```

### 4. Timesheet Reminder and Submission

```python
# Python - Automated Timesheet Reminder
import requests
from datetime import datetime, timedelta

def send_timesheet_reminders(access_token):
    url = 'https://people.zoho.com/people/api/forms/employee/getRecords'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }

    # Get all employees
    response = requests.get(url, headers=headers, params={'sIndex': 1, 'limit': 200})
    employees = response.json()['response']['result']

    # Get last week's date range
    today = datetime.now()
    last_week = today - timedelta(days=7)
    from_date = last_week.strftime('%m/%d/%Y')
    to_date = today.strftime('%m/%d/%Y')

    reminders_sent = []

    for employee in employees:
        email_id = employee.get('EmailID')
        if not email_id:
            continue

        # Check timesheet status
        status_response = requests.get(
            'https://people.zoho.com/people/api/timetracker/getTimesheetStatus',
            headers=headers,
            params={
                'emailId': email_id,
                'weekDate': from_date,
                'dateFormat': 'MM/dd/yyyy'
            }
        )

        status_data = status_response.json()
        timesheet_status = status_data.get('response', {}).get('result', {}).get('status')

        if timesheet_status != 'Submitted' and timesheet_status != 'Approved':
            # Send reminder (integrate with email service)
            print(f"Reminder needed for {employee['FirstName']} {employee['LastName']}")
            reminders_sent.append({
                'employee': f"{employee['FirstName']} {employee['LastName']}",
                'email': email_id,
                'status': timesheet_status or 'Not Started'
            })

    return reminders_sent

# Usage
reminders = send_timesheet_reminders(access_token)
print(f"Sent {len(reminders)} timesheet reminders")
```

### 5. Performance Review Reminder

```javascript
// JavaScript/Node.js - Performance Review Workflow
const managePerformanceReviews = async (accessToken, reviewCycle) => {
  try {
    // Get all employees
    const employeesResponse = await axios.get(
      'https://people.zoho.com/people/api/forms/employee/getRecords',
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`
        },
        params: {
          sIndex: 1,
          limit: 200
        }
      }
    );

    const employees = employeesResponse.data.response.result;
    const reviewStatus = {
      pending: [],
      completed: [],
      overdue: []
    };

    for (const employee of employees) {
      const emailId = employee.EmailID;
      if (!emailId) continue;

      // Get appraisal status
      const appraisalResponse = await axios.get(
        'https://people.zoho.com/people/api/appraisal/getAppraisalStatus',
        {
          headers: {
            'Authorization': `Zoho-oauthtoken ${accessToken}`
          },
          params: {
            emailId: emailId,
            cycle: reviewCycle
          }
        }
      );

      const appraisalData = appraisalResponse.data.response.result;

      if (!appraisalData || appraisalData.status === 'Not Started') {
        reviewStatus.pending.push({
          employee: `${employee.FirstName} ${employee.LastName}`,
          email: emailId,
          manager: employee.ReportingTo
        });
      } else if (appraisalData.status === 'Completed') {
        reviewStatus.completed.push({
          employee: `${employee.FirstName} ${employee.LastName}`,
          email: emailId
        });
      } else if (new Date(appraisalData.dueDate) < new Date()) {
        reviewStatus.overdue.push({
          employee: `${employee.FirstName} ${employee.LastName}`,
          email: emailId,
          dueDate: appraisalData.dueDate
        });
      }
    }

    return reviewStatus;
  } catch (error) {
    console.error('Error managing performance reviews:', error);
    throw error;
  }
};
```

### 6. Bulk Employee Update

```python
# Python - Bulk Update Employee Records
import requests
import time

def bulk_update_employees(access_token, updates):
    url = 'https://people.zoho.com/people/api/forms/employee/updateRecord'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }

    results = {
        'successful': [],
        'failed': []
    }

    for update in updates:
        try:
            response = requests.post(url, data=update, headers=headers)
            result = response.json()

            if result.get('response', {}).get('status') == 0:
                results['successful'].append({
                    'recordId': update.get('recordId'),
                    'email': update.get('EmailID')
                })
                print(f"Updated: {update.get('EmailID')}")
            else:
                results['failed'].append({
                    'recordId': update.get('recordId'),
                    'email': update.get('EmailID'),
                    'error': result.get('response', {}).get('message')
                })

            # Rate limiting: wait between requests
            time.sleep(0.5)

        except Exception as e:
            results['failed'].append({
                'recordId': update.get('recordId'),
                'email': update.get('EmailID'),
                'error': str(e)
            })

    return results

# Usage
updates = [
    {
        'recordId': '1234567890123456789',
        'EmailID': 'john.doe@company.com',
        'Department': 'Engineering',
        'Designation': 'Senior Engineer'
    },
    {
        'recordId': '1234567890123456790',
        'EmailID': 'jane.smith@company.com',
        'Department': 'Product',
        'Designation': 'Product Manager'
    }
]

results = bulk_update_employees(access_token, updates)
print(f"Successful: {len(results['successful'])}")
print(f"Failed: {len(results['failed'])}")
```

### 7. Export Employee Data

```javascript
// JavaScript/Node.js - Export All Employee Data
const exportEmployeeData = async (accessToken) => {
  let allEmployees = [];
  let sIndex = 1;
  const limit = 200;
  let hasMore = true;

  try {
    while (hasMore) {
      const response = await axios.get(
        'https://people.zoho.com/people/api/forms/employee/getRecords',
        {
          headers: {
            'Authorization': `Zoho-oauthtoken ${accessToken}`
          },
          params: {
            sIndex: sIndex,
            limit: limit
          }
        }
      );

      const employees = response.data.response.result;
      allEmployees = allEmployees.concat(employees);

      // Check if there are more records
      hasMore = employees.length === limit;
      sIndex += limit;

      console.log(`Fetched ${allEmployees.length} employees so far...`);
    }

    // Convert to CSV
    const csv = convertToCSV(allEmployees);
    return csv;

  } catch (error) {
    console.error('Error exporting employee data:', error);
    throw error;
  }
};

const convertToCSV = (data) => {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row =>
    Object.values(row).map(value =>
      typeof value === 'string' && value.includes(',') ? `"${value}"` : value
    ).join(',')
  );

  return [headers, ...rows].join('\n');
};
```

---

## Code Examples

### Complete HR Management Integration

```javascript
// JavaScript/Node.js - Complete HR Management System Integration
const ZohoPeopleIntegration = {

  // Initialize with authentication
  async initialize(clientId, clientSecret, refreshToken) {
    this.client = new ZohoPeopleClient(clientId, clientSecret, refreshToken);
    await this.client.ensureValidToken();
  },

  // Employee Management
  async getAllEmployees(filters = {}) {
    return await this.client.makeRequest(
      'GET',
      `/forms/employee/getRecords?sIndex=${filters.sIndex || 1}&limit=${filters.limit || 200}`
    );
  },

  async getEmployeeById(recordId) {
    return await this.client.makeRequest(
      'GET',
      `/forms/employee/getRecords?recordId=${recordId}`
    );
  },

  async createEmployee(employeeData) {
    return await this.client.makeRequest(
      'POST',
      '/forms/employee/insertRecord',
      employeeData
    );
  },

  async updateEmployee(recordId, updates) {
    return await this.client.makeRequest(
      'POST',
      '/forms/employee/updateRecord',
      { recordId, ...updates }
    );
  },

  // Attendance Management
  async checkIn(emailId, dateTime) {
    return await this.client.makeRequest(
      'POST',
      '/attendance/checkIn',
      {
        emailId,
        checkIn: dateTime,
        dateFormat: 'MM/dd/yyyy'
      }
    );
  },

  async checkOut(emailId, dateTime) {
    return await this.client.makeRequest(
      'POST',
      '/attendance/checkOut',
      {
        emailId,
        checkOut: dateTime,
        dateFormat: 'MM/dd/yyyy'
      }
    );
  },

  async getAttendance(emailId, fromDate, toDate) {
    return await this.client.makeRequest(
      'GET',
      `/attendance/getAttendanceEntries?emailId=${emailId}&fromDate=${fromDate}&toDate=${toDate}&dateFormat=MM/dd/yyyy`
    );
  },

  // Leave Management
  async getLeaveBalance(emailId) {
    return await this.client.makeRequest(
      'GET',
      `/leave/getLeaveBalances?emailId=${emailId}`
    );
  },

  async applyLeave(leaveData) {
    return await this.client.makeRequest(
      'POST',
      '/leave/applyLeave',
      leaveData
    );
  },

  async approveLeave(leaveId, approverEmail, comments) {
    return await this.client.makeRequest(
      'POST',
      '/leave/approveLeave',
      {
        leaveId,
        approverEmailId: approverEmail,
        comments
      }
    );
  },

  // Timesheet Management
  async addTimeLog(timeLogData) {
    return await this.client.makeRequest(
      'POST',
      '/timetracker/addTimeLog',
      timeLogData
    );
  },

  async getTimeLogs(emailId, fromDate, toDate) {
    return await this.client.makeRequest(
      'GET',
      `/timetracker/getTimeLogs?emailId=${emailId}&fromDate=${fromDate}&toDate=${toDate}&dateFormat=MM/dd/yyyy`
    );
  },

  async submitTimesheet(emailId, weekDate) {
    return await this.client.makeRequest(
      'POST',
      '/timetracker/submitTimesheet',
      {
        emailId,
        weekDate,
        dateFormat: 'MM/dd/yyyy'
      }
    );
  },

  // Performance Management
  async createGoal(goalData) {
    return await this.client.makeRequest(
      'POST',
      '/goals/createGoal',
      goalData
    );
  },

  async getGoals(emailId) {
    return await this.client.makeRequest(
      'GET',
      `/goals/getGoals?emailId=${emailId}`
    );
  },

  async addFeedback(appraisalId, feedbackData) {
    return await this.client.makeRequest(
      'POST',
      '/appraisal/addFeedback',
      {
        appraisalId,
        ...feedbackData
      }
    );
  }
};

// Usage Example
(async () => {
  await ZohoPeopleIntegration.initialize(clientId, clientSecret, refreshToken);

  // Get all employees
  const employees = await ZohoPeopleIntegration.getAllEmployees();
  console.log(`Total employees: ${employees.response.result.length}`);

  // Check in an employee
  await ZohoPeopleIntegration.checkIn(
    'john.doe@company.com',
    '01/15/2025 09:00:00 AM'
  );

  // Get leave balance
  const leaveBalance = await ZohoPeopleIntegration.getLeaveBalance(
    'john.doe@company.com'
  );
  console.log('Leave balance:', leaveBalance);

  // Add time log
  await ZohoPeopleIntegration.addTimeLog({
    emailId: 'john.doe@company.com',
    jobId: '123456',
    workDate: '01/15/2025',
    hours: 8.0,
    description: 'Working on project tasks',
    billable: true,
    dateFormat: 'MM/dd/yyyy'
  });
})();
```

### Deluge Integration Examples

```deluge
// Deluge - Sync CRM to People
// Create employee from CRM Contact when they become a customer

contactId = "12345000000567890";

// Get contact details from CRM
contactMap = zoho.crm.getRecordById("Contacts", contactId);

// Check if employee already exists
employeeCheck = zoho.people.getRecords("employee", {"EmailID": contactMap.get("Email")});

if(employeeCheck.size() == 0)
{
    // Create new employee in People
    employeeData = {
        "FirstName": contactMap.get("First_Name"),
        "LastName": contactMap.get("Last_Name"),
        "EmailID": contactMap.get("Email"),
        "PhoneNo": contactMap.get("Phone"),
        "Dateofjoining": zoho.currentdate.toString("MM/dd/yyyy"),
        "Department": "Sales",
        "Designation": "Sales Representative",
        "EmployeeStatus": "Active"
    };

    response = zoho.people.insertRecord("employee", employeeData);

    if(response.get("status") == 0)
    {
        // Update CRM with employee ID
        updateMap = Map();
        updateMap.put("People_Employee_ID", response.get("result").get("recordId"));
        zoho.crm.updateRecord("Contacts", contactId, updateMap);

        info "Employee created successfully";
    }
    else
    {
        info "Error creating employee: " + response.get("message");
    }
}
else
{
    info "Employee already exists";
}
```

```deluge
// Deluge - Automated Leave Approval
// Auto-approve leaves based on business rules

leaveId = "123456789";

// Get leave details
leaveDetails = zoho.people.getRecordById("leave", leaveId);

employeeEmail = leaveDetails.get("EmailID");
leaveType = leaveDetails.get("LeaveType");
numberOfDays = leaveDetails.get("NumberOfDays").toDecimal();

// Get employee's leave balance
balanceResponse = zoho.people.getLeaveBalance(employeeEmail);
availableBalance = 0;

for each balance in balanceResponse
{
    if(balance.get("leaveType") == leaveType)
    {
        availableBalance = balance.get("available").toDecimal();
    }
}

// Business rule: Auto-approve if <= 2 days and balance available
if(numberOfDays <= 2 && availableBalance >= numberOfDays)
{
    approvalData = {
        "leaveId": leaveId,
        "approverEmailId": "manager@company.com",
        "comments": "Auto-approved based on policy"
    };

    response = zoho.people.approveLeave(approvalData);

    if(response.get("status") == 0)
    {
        info "Leave auto-approved";

        // Send notification
        sendmail
        [
            from: "hr@company.com"
            to: employeeEmail
            subject: "Leave Request Approved"
            message: "Your leave request for " + numberOfDays + " days has been approved."
        ]
    }
}
else
{
    info "Leave requires manual approval";
}
```

```deluge
// Deluge - Weekly Timesheet Report
// Generate weekly timesheet summary for all employees

fromDate = zoho.currentdate.subDay(7).toString("MM/dd/yyyy");
toDate = zoho.currentdate.toString("MM/dd/yyyy");

// Get all employees
employees = zoho.people.getRecords("employee", {"sIndex": 1, "limit": 200});

reportData = List();

for each employee in employees
{
    emailId = employee.get("EmailID");

    // Get timesheet logs
    timeLogs = zoho.people.getTimeLogs(emailId, fromDate, toDate);

    totalHours = 0.0;
    billableHours = 0.0;

    if(timeLogs != null && timeLogs.size() > 0)
    {
        for each log in timeLogs
        {
            hours = log.get("hours").toDecimal();
            totalHours = totalHours + hours;

            if(log.get("billable") == true)
            {
                billableHours = billableHours + hours;
            }
        }
    }

    reportData.add({
        "Employee": employee.get("FirstName") + " " + employee.get("LastName"),
        "Email": emailId,
        "TotalHours": totalHours,
        "BillableHours": billableHours,
        "NonBillableHours": totalHours - billableHours
    });
}

// Send report via email
emailContent = "<table><tr><th>Employee</th><th>Total Hours</th><th>Billable</th><th>Non-Billable</th></tr>";

for each entry in reportData
{
    emailContent = emailContent + "<tr>";
    emailContent = emailContent + "<td>" + entry.get("Employee") + "</td>";
    emailContent = emailContent + "<td>" + entry.get("TotalHours") + "</td>";
    emailContent = emailContent + "<td>" + entry.get("BillableHours") + "</td>";
    emailContent = emailContent + "<td>" + entry.get("NonBillableHours") + "</td>";
    emailContent = emailContent + "</tr>";
}

emailContent = emailContent + "</table>";

sendmail
[
    from: "hr@company.com"
    to: "management@company.com"
    subject: "Weekly Timesheet Report - " + fromDate + " to " + toDate
    message: emailContent
]

info "Weekly timesheet report sent";
```

---

## Best Practices

### 1. Authentication & Security

**Store Tokens Securely**:
```javascript
// Good: Use environment variables
const config = {
  clientId: process.env.ZOHO_CLIENT_ID,
  clientSecret: process.env.ZOHO_CLIENT_SECRET,
  refreshToken: process.env.ZOHO_REFRESH_TOKEN
};

// Bad: Hard-coded credentials
const config = {
  clientId: '1000.ABC123',
  clientSecret: 'secret123',
  refreshToken: '1000.XYZ789'
};
```

### 2. Rate Limiting

**Implement Request Queue**:
```javascript
class RequestQueue {
  constructor(maxPerMinute = 30) {
    this.queue = [];
    this.processing = false;
    this.maxPerMinute = maxPerMinute;
    this.requestTimes = [];
  }

  async add(fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      this.process();
    });
  }

  async process() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0) {
      const oneMinuteAgo = Date.now() - 60000;
      this.requestTimes = this.requestTimes.filter(time => time > oneMinuteAgo);

      if (this.requestTimes.length >= this.maxPerMinute) {
        const oldestRequest = Math.min(...this.requestTimes);
        const waitTime = 60000 - (Date.now() - oldestRequest) + 100;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }

      const { fn, resolve, reject } = this.queue.shift();
      this.requestTimes.push(Date.now());

      try {
        const result = await fn();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }

    this.processing = false;
  }
}
```

### 3. Error Handling & Retries

**Exponential Backoff**:
```python
import time
import random

def make_request_with_backoff(fn, max_retries=3):
    for attempt in range(max_retries):
        try:
            return fn()
        except requests.exceptions.HTTPError as e:
            if e.response.status_code in [429, 500, 502, 503, 504]:
                if attempt < max_retries - 1:
                    wait_time = (2 ** attempt) + random.uniform(0, 1)
                    print(f'Retry {attempt + 1}/{max_retries} after {wait_time:.2f}s')
                    time.sleep(wait_time)
                    continue
            raise
    raise Exception(f'Failed after {max_retries} retries')
```

### 4. Data Validation

**Validate Date Formats**:
```javascript
const validateDateFormat = (dateString) => {
  const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
  if (!regex.test(dateString)) {
    throw new Error('Date must be in MM/dd/yyyy format');
  }
  return true;
};

const validateEmailFormat = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    throw new Error('Invalid email format');
  }
  return true;
};
```

### 5. Caching

**Cache Employee Data**:
```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour

const getEmployeeWithCache = async (accessToken, emailId) => {
  const cacheKey = `employee_${emailId}`;

  let employeeData = cache.get(cacheKey);
  if (employeeData) {
    console.log('Using cached employee data');
    return employeeData;
  }

  const response = await axios.get(
    'https://people.zoho.com/people/api/forms/employee/getRecords',
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      },
      params: {
        emailId: emailId
      }
    }
  );

  employeeData = response.data.response.result[0];
  cache.set(cacheKey, employeeData);

  return employeeData;
};
```

### 6. Pagination

**Handle Large Datasets**:
```python
def get_all_employees(access_token):
    all_employees = []
    s_index = 1
    limit = 200
    has_more = True

    while has_more:
        response = requests.get(
            'https://people.zoho.com/people/api/forms/employee/getRecords',
            headers={
                'Authorization': f'Zoho-oauthtoken {access_token}'
            },
            params={
                'sIndex': s_index,
                'limit': limit
            }
        )

        data = response.json()
        employees = data.get('response', {}).get('result', [])
        all_employees.extend(employees)

        has_more = len(employees) == limit
        s_index += limit

        print(f'Fetched {len(all_employees)} employees so far...')

    return all_employees
```

### 7. Testing

**Unit Test Example**:
```javascript
const assert = require('assert');
const nock = require('nock');

describe('Zoho People API', () => {
  const accessToken = 'test_token';

  beforeEach(() => {
    nock('https://people.zoho.com')
      .get('/people/api/forms/employee/getRecords')
      .query({ sIndex: 1, limit: 200 })
      .reply(200, {
        response: {
          result: [
            {
              EmailID: 'test@example.com',
              FirstName: 'Test',
              LastName: 'User'
            }
          ],
          status: 0
        }
      });
  });

  it('should fetch employees', async () => {
    const employees = await getAllEmployees(accessToken);
    assert.equal(employees.response.result.length, 1);
    assert.equal(employees.response.result[0].EmailID, 'test@example.com');
  });
});
```

---

## Additional Resources

- [Official Zoho People API Documentation](https://www.zoho.com/people/api/)
- [API Console](https://api-console.zoho.com/)
- [Zoho People Help Documentation](https://www.zoho.com/people/help/)
- [Developer Forums](https://help.zoho.com/portal/en/community/people)
- [Status Page](https://status.zoho.com/)

---

## Changelog

### v2 (Current)
- Comprehensive REST API
- Employee records management
- Attendance tracking with check-in/check-out
- Leave management system
- Timesheet and time tracking
- Performance appraisal APIs
- Custom forms support
- Multi-organization support
- Enhanced reporting

---

**Last Updated**: December 2025
**API Version**: v2
