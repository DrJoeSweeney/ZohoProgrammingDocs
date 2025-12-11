# Zoho Recruit API Reference

## Overview

Zoho Recruit is a comprehensive applicant tracking system (ATS) that helps businesses streamline their recruitment process. The API provides full programmatic access to candidate management, job openings, interviews, resume parsing, and all recruitment operations.

**Current API Version**: v2
**Base URL**: `https://recruit.zoho.com/recruit/v2/`
**Protocol**: REST
**Data Format**: JSON
**Authentication**: OAuth 2.0

---

## Quick Links

- [Authentication](#authentication)
- [Candidates API](#candidates-api)
- [Job Openings API](#job-openings-api)
- [Interviews API](#interviews-api)
- [Resume Parsing](#resume-parsing)
- [Bulk APIs](#bulk-apis)
- [Search and Query](#search-and-query)
- [Attachments](#attachments)
- [Notes and Activities](#notes-and-activities)
- [Webhooks](#webhooks)
- [Rate Limits](#rate-limits)
- [Error Codes](#error-codes)
- [Code Examples](#code-examples)
- [Best Practices](#best-practices)

---

## REST API Principles

### HTTP Methods

Zoho Recruit API follows standard REST conventions:

| Method | Purpose | Idempotent |
|--------|---------|------------|
| GET | Retrieve resources | Yes |
| POST | Create new resources | No |
| PUT | Update/replace resources | Yes |
| DELETE | Remove resources | Yes |

### Request Format

```http
GET /recruit/v2/Candidates
Host: recruit.zoho.com
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json
```

### Response Format

All API responses follow a consistent structure:

**Success Response**:
```json
{
  "data": [
    {
      "id": "123456000000123456",
      "First_Name": "John",
      "Last_Name": "Doe",
      "Email": "john.doe@example.com",
      "Candidate_Status": "Active"
    }
  ],
  "info": {
    "per_page": 200,
    "count": 1,
    "page": 1,
    "more_records": false
  }
}
```

**Error Response**:
```json
{
  "code": "INVALID_DATA",
  "details": {
    "api_name": "Email"
  },
  "message": "invalid email address",
  "status": "error"
}
```

---

## Authentication

### OAuth 2.0 Flow

Zoho Recruit uses OAuth 2.0 for authentication. All API requests require a valid access token.

**Step 1: Register Your Application**
- Go to [Zoho API Console](https://api-console.zoho.com/)
- Create a new Client (Server-based Applications)
- Note your Client ID and Client Secret
- Set authorized redirect URI

**Step 2: Generate Authorization Code**

```http
GET https://accounts.zoho.com/oauth/v2/auth?
  scope=ZohoRecruit.modules.ALL,ZohoRecruit.settings.ALL&
  client_id={client_id}&
  response_type=code&
  access_type=offline&
  redirect_uri={redirect_uri}
```

**Available Scopes**:
- `ZohoRecruit.modules.ALL` - Full access to all modules
- `ZohoRecruit.modules.READ` - Read-only access to modules
- `ZohoRecruit.modules.CREATE` - Create records
- `ZohoRecruit.modules.UPDATE` - Update records
- `ZohoRecruit.modules.DELETE` - Delete records
- `ZohoRecruit.settings.ALL` - Access to settings and metadata
- `ZohoRecruit.settings.READ` - Read-only settings access
- `ZohoRecruit.bulk.READ` - Bulk read operations
- `ZohoRecruit.bulk.CREATE` - Bulk create/update operations

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
  "access_token": "1000.xxx.yyy",
  "refresh_token": "1000.zzz.aaa",
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

**Token Lifetime**:
- Access Token: 1 hour
- Refresh Token: Does not expire (store securely)

**JavaScript Token Refresh Example**:
```javascript
const axios = require('axios');

const refreshAccessToken = async (clientId, clientSecret, refreshToken) => {
  const response = await axios.post(
    'https://accounts.zoho.com/oauth/v2/token',
    null,
    {
      params: {
        grant_type: 'refresh_token',
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken
      }
    }
  );
  return response.data.access_token;
};
```

**Python Token Refresh Example**:
```python
import requests

def refresh_access_token(client_id, client_secret, refresh_token):
    url = 'https://accounts.zoho.com/oauth/v2/token'
    params = {
        'grant_type': 'refresh_token',
        'client_id': client_id,
        'client_secret': client_secret,
        'refresh_token': refresh_token
    }
    response = requests.post(url, params=params)
    return response.json()['access_token']
```

---

## Candidates API

The Candidates API is the core of Zoho Recruit, enabling complete candidate lifecycle management.

### Candidate Object Structure

```json
{
  "id": "123456000000123456",
  "First_Name": "John",
  "Last_Name": "Doe",
  "Full_Name": "John Doe",
  "Email": "john.doe@example.com",
  "Phone": "+1-555-0123",
  "Mobile": "+1-555-0124",
  "Current_Job_Title": "Senior Software Engineer",
  "Current_Employer": "Tech Corp",
  "Experience_in_Years": 5,
  "Skill_Set": "JavaScript, Python, React, Node.js",
  "Highest_Qualification_Held": "Bachelor of Science",
  "Candidate_Status": "Active",
  "Candidate_Source": "LinkedIn",
  "Street": "123 Main St",
  "City": "San Francisco",
  "State": "California",
  "Zip_Code": "94102",
  "Country": "USA",
  "Current_Salary": 120000,
  "Expected_Salary": 140000,
  "Availability": "Immediate",
  "Rating": 4,
  "Created_Time": "2025-01-15T10:30:00-08:00",
  "Modified_Time": "2025-12-12T14:25:00-08:00",
  "Owner": {
    "name": "Recruiter Name",
    "id": "123456000000234567",
    "email": "recruiter@company.com"
  }
}
```

### List Candidates

```http
GET /recruit/v2/Candidates
Authorization: Zoho-oauthtoken {access_token}
```

**Query Parameters**:
- `page` (integer) - Page number (default: 1)
- `per_page` (integer) - Records per page (max: 200, default: 200)
- `sort_by` (string) - Field to sort by
- `sort_order` (string) - "asc" or "desc"
- `fields` (string) - Comma-separated list of fields to retrieve

**Example Request**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const listCandidates = async (accessToken) => {
  const response = await axios.get(
    'https://recruit.zoho.com/recruit/v2/Candidates',
    {
      params: {
        page: 1,
        per_page: 200,
        sort_by: 'Created_Time',
        sort_order: 'desc'
      },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

```python
# Python
import requests

def list_candidates(access_token):
    url = 'https://recruit.zoho.com/recruit/v2/Candidates'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'page': 1,
        'per_page': 200,
        'sort_by': 'Created_Time',
        'sort_order': 'desc'
    }
    response = requests.get(url, headers=headers, params=params)
    return response.json()
```

```deluge
// Deluge
response = zoho.recruit.getRecords("Candidates", 1, 200);
info response;
```

### Get Candidate by ID

```http
GET /recruit/v2/Candidates/{candidate_id}
Authorization: Zoho-oauthtoken {access_token}
```

**Example**:
```javascript
const getCandidate = async (accessToken, candidateId) => {
  const response = await axios.get(
    `https://recruit.zoho.com/recruit/v2/Candidates/${candidateId}`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

### Create Candidate

```http
POST /recruit/v2/Candidates
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "data": [
    {
      "First_Name": "Jane",
      "Last_Name": "Smith",
      "Email": "jane.smith@example.com",
      "Phone": "+1-555-1234",
      "Current_Job_Title": "Product Manager",
      "Current_Employer": "Innovation Inc",
      "Experience_in_Years": 3,
      "Skill_Set": "Product Management, Agile, Data Analysis",
      "Highest_Qualification_Held": "Master of Business Administration",
      "Current_Salary": 95000,
      "Expected_Salary": 115000,
      "Candidate_Status": "Active",
      "Candidate_Source": "Referral"
    }
  ]
}
```

**Example**:
```javascript
const createCandidate = async (accessToken, candidateData) => {
  const response = await axios.post(
    'https://recruit.zoho.com/recruit/v2/Candidates',
    {
      data: [candidateData]
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

// Usage
const newCandidate = {
  First_Name: 'Jane',
  Last_Name: 'Smith',
  Email: 'jane.smith@example.com',
  Phone: '+1-555-1234',
  Current_Job_Title: 'Product Manager',
  Skill_Set: 'Product Management, Agile, Data Analysis',
  Candidate_Status: 'Active'
};

const result = await createCandidate(accessToken, newCandidate);
```

```python
# Python
def create_candidate(access_token, candidate_data):
    url = 'https://recruit.zoho.com/recruit/v2/Candidates'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'data': [candidate_data]
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()

# Usage
new_candidate = {
    'First_Name': 'Jane',
    'Last_Name': 'Smith',
    'Email': 'jane.smith@example.com',
    'Phone': '+1-555-1234',
    'Current_Job_Title': 'Product Manager',
    'Skill_Set': 'Product Management, Agile, Data Analysis',
    'Candidate_Status': 'Active'
}

result = create_candidate(access_token, new_candidate)
```

```deluge
// Deluge
candidate_map = Map();
candidate_map.put("First_Name", "Jane");
candidate_map.put("Last_Name", "Smith");
candidate_map.put("Email", "jane.smith@example.com");
candidate_map.put("Phone", "+1-555-1234");
candidate_map.put("Current_Job_Title", "Product Manager");
candidate_map.put("Skill_Set", "Product Management, Agile, Data Analysis");
candidate_map.put("Candidate_Status", "Active");

response = zoho.recruit.createRecord("Candidates", candidate_map);
info response;
```

### Update Candidate

```http
PUT /recruit/v2/Candidates/{candidate_id}
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "data": [
    {
      "Candidate_Status": "Submitted to Client",
      "Rating": 5,
      "Expected_Salary": 120000
    }
  ]
}
```

**Example**:
```javascript
const updateCandidate = async (accessToken, candidateId, updates) => {
  const response = await axios.put(
    `https://recruit.zoho.com/recruit/v2/Candidates/${candidateId}`,
    {
      data: [updates]
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

// Usage - Update candidate status
await updateCandidate(accessToken, candidateId, {
  Candidate_Status: 'Interview Scheduled',
  Rating: 4
});
```

### Delete Candidate

```http
DELETE /recruit/v2/Candidates/{candidate_id}
Authorization: Zoho-oauthtoken {access_token}
```

**Example**:
```javascript
const deleteCandidate = async (accessToken, candidateId) => {
  const response = await axios.delete(
    `https://recruit.zoho.com/recruit/v2/Candidates/${candidateId}`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

### Search Candidates

```http
GET /recruit/v2/Candidates/search?email={email}
GET /recruit/v2/Candidates/search?phone={phone}
GET /recruit/v2/Candidates/search?criteria=(Skill_Set:contains:Python)
Authorization: Zoho-oauthtoken {access_token}
```

**Search Criteria Operators**:
- `equals` - Exact match
- `contains` - Contains substring
- `starts_with` - Starts with prefix
- `ends_with` - Ends with suffix
- `less_than` - Numeric less than
- `greater_than` - Numeric greater than
- `between` - Value in range

**Example**:
```javascript
const searchCandidatesBySkill = async (accessToken, skill) => {
  const criteria = `(Skill_Set:contains:${skill})`;
  const response = await axios.get(
    'https://recruit.zoho.com/recruit/v2/Candidates/search',
    {
      params: { criteria },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};

// Search for candidates with Python skills
const pythonDevs = await searchCandidatesBySkill(accessToken, 'Python');
```

```python
def search_candidates_by_skill(access_token, skill):
    url = 'https://recruit.zoho.com/recruit/v2/Candidates/search'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'criteria': f'(Skill_Set:contains:{skill})'
    }
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Search for candidates with Python skills
python_devs = search_candidates_by_skill(access_token, 'Python')
```

---

## Job Openings API

Manage job postings and requisitions.

### Job Opening Object Structure

```json
{
  "id": "123456000000234567",
  "Posting_Title": "Senior Software Engineer",
  "Job_Opening_Name": "Senior Software Engineer - Backend",
  "Job_Opening_Status": "In-progress",
  "Number_of_Positions": 2,
  "Job_Type": "Full-time",
  "Work_Experience": "5+ years",
  "Required_Skills": "Python, Django, PostgreSQL, Docker, AWS",
  "Salary": "$120,000 - $150,000",
  "City": "San Francisco",
  "State": "California",
  "Country": "USA",
  "Remote_Job": true,
  "Job_Description": "We are seeking an experienced Backend Engineer...",
  "Department": "Engineering",
  "Assigned_Recruiter": {
    "name": "Jane Recruiter",
    "id": "123456000000345678",
    "email": "jane.recruiter@company.com"
  },
  "Target_Date": "2025-03-01",
  "Date_Opened": "2025-01-15",
  "Created_Time": "2025-01-15T09:00:00-08:00",
  "Modified_Time": "2025-12-12T10:00:00-08:00"
}
```

### List Job Openings

```http
GET /recruit/v2/JobOpenings
Authorization: Zoho-oauthtoken {access_token}
```

**Example**:
```javascript
const listJobOpenings = async (accessToken) => {
  const response = await axios.get(
    'https://recruit.zoho.com/recruit/v2/JobOpenings',
    {
      params: {
        page: 1,
        per_page: 200,
        sort_by: 'Date_Opened',
        sort_order: 'desc'
      },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

```python
def list_job_openings(access_token):
    url = 'https://recruit.zoho.com/recruit/v2/JobOpenings'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'page': 1,
        'per_page': 200,
        'sort_by': 'Date_Opened',
        'sort_order': 'desc'
    }
    response = requests.get(url, headers=headers, params=params)
    return response.json()
```

```deluge
// Deluge
response = zoho.recruit.getRecords("JobOpenings", 1, 200);
info response;
```

### Get Job Opening by ID

```http
GET /recruit/v2/JobOpenings/{job_opening_id}
Authorization: Zoho-oauthtoken {access_token}
```

### Create Job Opening

```http
POST /recruit/v2/JobOpenings
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "data": [
    {
      "Posting_Title": "Full Stack Developer",
      "Job_Opening_Name": "Full Stack Developer - React/Node",
      "Job_Opening_Status": "In-progress",
      "Number_of_Positions": 3,
      "Job_Type": "Full-time",
      "Work_Experience": "3+ years",
      "Required_Skills": "React, Node.js, TypeScript, MongoDB",
      "Salary": "$90,000 - $120,000",
      "Remote_Job": true,
      "Job_Description": "Join our team as a Full Stack Developer...",
      "Target_Date": "2025-04-01"
    }
  ]
}
```

**Example**:
```javascript
const createJobOpening = async (accessToken, jobData) => {
  const response = await axios.post(
    'https://recruit.zoho.com/recruit/v2/JobOpenings',
    {
      data: [jobData]
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

// Usage
const newJob = {
  Posting_Title: 'Full Stack Developer',
  Job_Opening_Name: 'Full Stack Developer - React/Node',
  Job_Opening_Status: 'In-progress',
  Number_of_Positions: 3,
  Job_Type: 'Full-time',
  Required_Skills: 'React, Node.js, TypeScript, MongoDB',
  Remote_Job: true
};

const result = await createJobOpening(accessToken, newJob);
```

```python
def create_job_opening(access_token, job_data):
    url = 'https://recruit.zoho.com/recruit/v2/JobOpenings'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'data': [job_data]
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

```deluge
// Deluge
job_map = Map();
job_map.put("Posting_Title", "Full Stack Developer");
job_map.put("Job_Opening_Name", "Full Stack Developer - React/Node");
job_map.put("Job_Opening_Status", "In-progress");
job_map.put("Number_of_Positions", 3);
job_map.put("Job_Type", "Full-time");
job_map.put("Required_Skills", "React, Node.js, TypeScript, MongoDB");
job_map.put("Remote_Job", true);

response = zoho.recruit.createRecord("JobOpenings", job_map);
info response;
```

### Update Job Opening

```http
PUT /recruit/v2/JobOpenings/{job_opening_id}
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "data": [
    {
      "Job_Opening_Status": "Filled",
      "Number_of_Positions": 2
    }
  ]
}
```

### Associate Candidate with Job Opening

```http
POST /recruit/v2/Candidates/{candidate_id}/Actions/Associate_Candidate_to_Job_Opening
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "data": [
    {
      "Job_Opening": "123456000000234567"
    }
  ]
}
```

**Example**:
```javascript
const associateCandidateToJob = async (accessToken, candidateId, jobOpeningId) => {
  const response = await axios.post(
    `https://recruit.zoho.com/recruit/v2/Candidates/${candidateId}/Actions/Associate_Candidate_to_Job_Opening`,
    {
      data: [
        {
          Job_Opening: jobOpeningId
        }
      ]
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

## Interviews API

Schedule and manage candidate interviews.

### Interview Object Structure

```json
{
  "id": "123456000000456789",
  "Interview_Name": "Technical Round - John Doe",
  "Candidate_Name": {
    "name": "John Doe",
    "id": "123456000000123456"
  },
  "Job_Opening": {
    "name": "Senior Software Engineer",
    "id": "123456000000234567"
  },
  "Scheduled_On": "2025-12-15T14:00:00-08:00",
  "Interview_Type": "Technical",
  "Interview_Status": "Scheduled",
  "Interviewer": {
    "name": "Tech Lead",
    "id": "123456000000567890",
    "email": "techlead@company.com"
  },
  "Duration": "60 minutes",
  "Location": "Office - Conference Room A",
  "Video_Call_Link": "https://zoom.us/j/123456789",
  "Comments": "Technical assessment focusing on backend skills",
  "Created_Time": "2025-12-12T10:00:00-08:00",
  "Modified_Time": "2025-12-12T10:00:00-08:00"
}
```

### List Interviews

```http
GET /recruit/v2/Interviews
Authorization: Zoho-oauthtoken {access_token}
```

**Example**:
```javascript
const listInterviews = async (accessToken) => {
  const response = await axios.get(
    'https://recruit.zoho.com/recruit/v2/Interviews',
    {
      params: {
        page: 1,
        per_page: 200,
        sort_by: 'Scheduled_On',
        sort_order: 'asc'
      },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

```python
def list_interviews(access_token):
    url = 'https://recruit.zoho.com/recruit/v2/Interviews'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'page': 1,
        'per_page': 200,
        'sort_by': 'Scheduled_On',
        'sort_order': 'asc'
    }
    response = requests.get(url, headers=headers, params=params)
    return response.json()
```

```deluge
// Deluge
response = zoho.recruit.getRecords("Interviews", 1, 200);
info response;
```

### Get Interview by ID

```http
GET /recruit/v2/Interviews/{interview_id}
Authorization: Zoho-oauthtoken {access_token}
```

### Schedule Interview

```http
POST /recruit/v2/Interviews
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "data": [
    {
      "Interview_Name": "Technical Round - Jane Smith",
      "Candidate_Name": "123456000000123456",
      "Job_Opening": "123456000000234567",
      "Scheduled_On": "2025-12-20T15:00:00-08:00",
      "Interview_Type": "Technical",
      "Interview_Status": "Scheduled",
      "Interviewer": "123456000000567890",
      "Duration": "60 minutes",
      "Video_Call_Link": "https://zoom.us/j/987654321",
      "Comments": "Focus on React and Node.js experience"
    }
  ]
}
```

**Example**:
```javascript
const scheduleInterview = async (accessToken, interviewData) => {
  const response = await axios.post(
    'https://recruit.zoho.com/recruit/v2/Interviews',
    {
      data: [interviewData]
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

// Usage
const newInterview = {
  Interview_Name: 'Technical Round - Jane Smith',
  Candidate_Name: '123456000000123456',
  Job_Opening: '123456000000234567',
  Scheduled_On: '2025-12-20T15:00:00-08:00',
  Interview_Type: 'Technical',
  Interview_Status: 'Scheduled',
  Interviewer: '123456000000567890',
  Duration: '60 minutes',
  Video_Call_Link: 'https://zoom.us/j/987654321'
};

const result = await scheduleInterview(accessToken, newInterview);
```

```python
def schedule_interview(access_token, interview_data):
    url = 'https://recruit.zoho.com/recruit/v2/Interviews'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'data': [interview_data]
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

```deluge
// Deluge
interview_map = Map();
interview_map.put("Interview_Name", "Technical Round - Jane Smith");
interview_map.put("Candidate_Name", "123456000000123456");
interview_map.put("Job_Opening", "123456000000234567");
interview_map.put("Scheduled_On", "2025-12-20T15:00:00-08:00");
interview_map.put("Interview_Type", "Technical");
interview_map.put("Interview_Status", "Scheduled");
interview_map.put("Interviewer", "123456000000567890");

response = zoho.recruit.createRecord("Interviews", interview_map);
info response;
```

### Update Interview

```http
PUT /recruit/v2/Interviews/{interview_id}
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "data": [
    {
      "Interview_Status": "Completed",
      "Comments": "Candidate performed well. Recommended for next round."
    }
  ]
}
```

**Example**:
```javascript
const updateInterview = async (accessToken, interviewId, updates) => {
  const response = await axios.put(
    `https://recruit.zoho.com/recruit/v2/Interviews/${interviewId}`,
    {
      data: [updates]
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

// Mark interview as completed
await updateInterview(accessToken, interviewId, {
  Interview_Status: 'Completed',
  Comments: 'Strong technical skills. Recommended for hire.'
});
```

### Cancel Interview

```http
PUT /recruit/v2/Interviews/{interview_id}
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "data": [
    {
      "Interview_Status": "Cancelled",
      "Comments": "Candidate accepted another offer"
    }
  ]
}
```

---

## Resume Parsing

Parse resumes and automatically create candidate records.

### Parse Resume

```http
POST /recruit/v2/Candidates/actions/parse
Authorization: Zoho-oauthtoken {access_token}
Content-Type: multipart/form-data

file: [resume file binary]
```

**Supported File Formats**:
- PDF (.pdf)
- Microsoft Word (.doc, .docx)
- Text (.txt)
- Rich Text Format (.rtf)
- HTML (.html, .htm)

**Example**:
```javascript
const FormData = require('form-data');
const fs = require('fs');

const parseResume = async (accessToken, resumeFilePath) => {
  const form = new FormData();
  form.append('file', fs.createReadStream(resumeFilePath));

  const response = await axios.post(
    'https://recruit.zoho.com/recruit/v2/Candidates/actions/parse',
    form,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        ...form.getHeaders()
      }
    }
  );
  return response.data;
};

// Usage
const parsedData = await parseResume(accessToken, './resumes/john_doe_resume.pdf');
console.log('Parsed Candidate Data:', parsedData);
```

```python
def parse_resume(access_token, resume_file_path):
    url = 'https://recruit.zoho.com/recruit/v2/Candidates/actions/parse'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    with open(resume_file_path, 'rb') as file:
        files = {'file': file}
        response = requests.post(url, headers=headers, files=files)
    return response.json()

# Usage
parsed_data = parse_resume(access_token, './resumes/john_doe_resume.pdf')
print('Parsed Candidate Data:', parsed_data)
```

**Response**:
```json
{
  "data": [
    {
      "First_Name": "John",
      "Last_Name": "Doe",
      "Email": "john.doe@example.com",
      "Phone": "+1-555-0123",
      "Current_Job_Title": "Software Engineer",
      "Current_Employer": "Tech Company",
      "Experience_in_Years": 5,
      "Skill_Set": "JavaScript, Python, React, Node.js, Docker",
      "Highest_Qualification_Held": "Bachelor of Science in Computer Science",
      "Street": "123 Main St",
      "City": "San Francisco",
      "State": "CA",
      "Zip_Code": "94102"
    }
  ],
  "info": {
    "status": "success"
  }
}
```

### Parse and Create Candidate

After parsing, you can create a candidate record with the parsed data:

```javascript
const parseAndCreateCandidate = async (accessToken, resumeFilePath) => {
  // Step 1: Parse resume
  const parsedData = await parseResume(accessToken, resumeFilePath);

  if (parsedData.data && parsedData.data.length > 0) {
    const candidateData = parsedData.data[0];

    // Step 2: Create candidate with parsed data
    const result = await createCandidate(accessToken, candidateData);
    console.log('Candidate created:', result.data[0].details.id);

    return result;
  }
};
```

```python
def parse_and_create_candidate(access_token, resume_file_path):
    # Step 1: Parse resume
    parsed_data = parse_resume(access_token, resume_file_path)

    if parsed_data.get('data') and len(parsed_data['data']) > 0:
        candidate_data = parsed_data['data'][0]

        # Step 2: Create candidate with parsed data
        result = create_candidate(access_token, candidate_data)
        print('Candidate created:', result['data'][0]['details']['id'])

        return result
```

---

## Bulk APIs

Perform bulk operations for large-scale data processing.

### Bulk Read

Export large amounts of data asynchronously.

```http
POST /recruit/v2/bulk/read
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "query": {
    "module": {
      "api_name": "Candidates"
    },
    "fields": [
      "First_Name",
      "Last_Name",
      "Email",
      "Phone",
      "Skill_Set",
      "Candidate_Status"
    ],
    "criteria": {
      "group": [
        {
          "field": {
            "api_name": "Candidate_Status"
          },
          "comparator": "equal",
          "value": "Active"
        }
      ]
    },
    "page": 1
  }
}
```

**Response**:
```json
{
  "data": [
    {
      "status": "queued",
      "operation": "read",
      "id": "123456000000789012",
      "created_by": {
        "id": "123456000000234567",
        "name": "Recruiter Name"
      },
      "created_time": "2025-12-12T14:30:00-08:00"
    }
  ],
  "info": {}
}
```

**Example**:
```javascript
const bulkReadCandidates = async (accessToken) => {
  const response = await axios.post(
    'https://recruit.zoho.com/recruit/v2/bulk/read',
    {
      query: {
        module: {
          api_name: 'Candidates'
        },
        fields: [
          'First_Name',
          'Last_Name',
          'Email',
          'Phone',
          'Skill_Set',
          'Candidate_Status'
        ],
        criteria: {
          group: [
            {
              field: {
                api_name: 'Candidate_Status'
              },
              comparator: 'equal',
              value: 'Active'
            }
          ]
        },
        page: 1
      }
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

### Check Bulk Read Job Status

```http
GET /recruit/v2/bulk/read/{job_id}
Authorization: Zoho-oauthtoken {access_token}
```

**Example**:
```javascript
const checkBulkJobStatus = async (accessToken, jobId) => {
  const response = await axios.get(
    `https://recruit.zoho.com/recruit/v2/bulk/read/${jobId}`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

### Download Bulk Read Result

```http
GET /recruit/v2/bulk/read/{job_id}/result
Authorization: Zoho-oauthtoken {access_token}
```

**Example**:
```javascript
const downloadBulkResult = async (accessToken, jobId) => {
  const response = await axios.get(
    `https://recruit.zoho.com/recruit/v2/bulk/read/${jobId}/result`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      },
      responseType: 'stream'
    }
  );

  // Save to file
  const fs = require('fs');
  const writer = fs.createWriteStream('candidates_export.zip');
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};
```

```python
def download_bulk_result(access_token, job_id):
    url = f'https://recruit.zoho.com/recruit/v2/bulk/read/{job_id}/result'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    response = requests.get(url, headers=headers, stream=True)

    # Save to file
    with open('candidates_export.zip', 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)

    return 'candidates_export.zip'
```

### Bulk Write

Create or update multiple records in a single operation.

```http
POST /recruit/v2/bulk/write
Authorization: Zoho-oauthtoken {access_token}
Content-Type: multipart/form-data

file: [CSV file]
```

**CSV Format Example** (candidates.csv):
```csv
First_Name,Last_Name,Email,Phone,Skill_Set,Candidate_Status
Alice,Johnson,alice@example.com,+1-555-1111,Java|Python|AWS,Active
Bob,Williams,bob@example.com,+1-555-2222,JavaScript|React|Node.js,Active
Carol,Brown,carol@example.com,+1-555-3333,Product Management|Agile,Active
```

**Example**:
```javascript
const bulkWriteCandidates = async (accessToken, csvFilePath) => {
  const FormData = require('form-data');
  const fs = require('fs');

  const form = new FormData();
  form.append('file', fs.createReadStream(csvFilePath));
  form.append('module', 'Candidates');
  form.append('operation', 'insert');

  const response = await axios.post(
    'https://recruit.zoho.com/recruit/v2/bulk/write',
    form,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        ...form.getHeaders()
      }
    }
  );
  return response.data;
};
```

```python
def bulk_write_candidates(access_token, csv_file_path):
    url = 'https://recruit.zoho.com/recruit/v2/bulk/write'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }

    with open(csv_file_path, 'rb') as file:
        files = {'file': file}
        data = {
            'module': 'Candidates',
            'operation': 'insert'
        }
        response = requests.post(url, headers=headers, files=files, data=data)

    return response.json()
```

### Check Bulk Write Job Status

```http
GET /recruit/v2/bulk/write/{job_id}
Authorization: Zoho-oauthtoken {access_token}
```

---

## Search and Query

Advanced search capabilities for finding records.

### COQL (Common Object Query Language)

SQL-like queries for complex data retrieval.

```http
POST /recruit/v2/coql
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "select_query": "SELECT First_Name, Last_Name, Email, Skill_Set, Experience_in_Years FROM Candidates WHERE Candidate_Status = 'Active' AND Experience_in_Years > 3 ORDER BY Experience_in_Years DESC LIMIT 50"
}
```

**Example**:
```javascript
const searchCandidatesCOQL = async (accessToken) => {
  const query = `
    SELECT First_Name, Last_Name, Email, Skill_Set, Experience_in_Years
    FROM Candidates
    WHERE Candidate_Status = 'Active'
      AND Experience_in_Years > 3
      AND Skill_Set LIKE '%Python%'
    ORDER BY Experience_in_Years DESC
    LIMIT 50
  `;

  const response = await axios.post(
    'https://recruit.zoho.com/recruit/v2/coql',
    {
      select_query: query.trim()
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

```python
def search_candidates_coql(access_token):
    url = 'https://recruit.zoho.com/recruit/v2/coql'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    query = """
        SELECT First_Name, Last_Name, Email, Skill_Set, Experience_in_Years
        FROM Candidates
        WHERE Candidate_Status = 'Active'
          AND Experience_in_Years > 3
          AND Skill_Set LIKE '%Python%'
        ORDER BY Experience_in_Years DESC
        LIMIT 50
    """
    data = {
        'select_query': query.strip()
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

```deluge
// Deluge
coql_query = "SELECT First_Name, Last_Name, Email FROM Candidates WHERE Candidate_Status = 'Active' AND Experience_in_Years > 3";
response = zoho.recruit.searchRecords("Candidates", coql_query);
info response;
```

**COQL Operators**:
- `=, !=` - Equal, Not equal
- `>, <, >=, <=` - Comparison operators
- `LIKE` - Pattern matching (use % as wildcard)
- `IN, NOT IN` - Check value in list
- `BETWEEN` - Range check
- `IS NULL, IS NOT NULL` - Null checks
- `AND, OR` - Logical operators

---

## Attachments

Manage file attachments for candidates and other records.

### Upload Attachment

```http
POST /recruit/v2/Candidates/{candidate_id}/Attachments
Authorization: Zoho-oauthtoken {access_token}
Content-Type: multipart/form-data

file: [binary file data]
```

**Example**:
```javascript
const uploadAttachment = async (accessToken, candidateId, filePath) => {
  const FormData = require('form-data');
  const fs = require('fs');

  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));

  const response = await axios.post(
    `https://recruit.zoho.com/recruit/v2/Candidates/${candidateId}/Attachments`,
    form,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        ...form.getHeaders()
      }
    }
  );
  return response.data;
};

// Upload candidate's resume
await uploadAttachment(accessToken, candidateId, './resumes/john_doe_resume.pdf');
```

```python
def upload_attachment(access_token, candidate_id, file_path):
    url = f'https://recruit.zoho.com/recruit/v2/Candidates/{candidate_id}/Attachments'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    with open(file_path, 'rb') as file:
        files = {'file': file}
        response = requests.post(url, headers=headers, files=files)
    return response.json()

# Upload candidate's resume
result = upload_attachment(access_token, candidate_id, './resumes/john_doe_resume.pdf')
```

### List Attachments

```http
GET /recruit/v2/Candidates/{candidate_id}/Attachments
Authorization: Zoho-oauthtoken {access_token}
```

**Example**:
```javascript
const listAttachments = async (accessToken, candidateId) => {
  const response = await axios.get(
    `https://recruit.zoho.com/recruit/v2/Candidates/${candidateId}/Attachments`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

### Download Attachment

```http
GET /recruit/v2/Candidates/{candidate_id}/Attachments/{attachment_id}
Authorization: Zoho-oauthtoken {access_token}
```

**Example**:
```javascript
const downloadAttachment = async (accessToken, candidateId, attachmentId) => {
  const response = await axios.get(
    `https://recruit.zoho.com/recruit/v2/Candidates/${candidateId}/Attachments/${attachmentId}`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      },
      responseType: 'stream'
    }
  );

  // Save to file
  const fs = require('fs');
  const writer = fs.createWriteStream('downloaded_attachment.pdf');
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};
```

### Delete Attachment

```http
DELETE /recruit/v2/Candidates/{candidate_id}/Attachments/{attachment_id}
Authorization: Zoho-oauthtoken {access_token}
```

---

## Notes and Activities

Track notes, activities, and communications.

### Add Note

```http
POST /recruit/v2/Candidates/{candidate_id}/Notes
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "data": [
    {
      "Note_Title": "Phone Screen Feedback",
      "Note_Content": "Candidate has strong communication skills. Recommended for technical interview."
    }
  ]
}
```

**Example**:
```javascript
const addNote = async (accessToken, candidateId, title, content) => {
  const response = await axios.post(
    `https://recruit.zoho.com/recruit/v2/Candidates/${candidateId}/Notes`,
    {
      data: [
        {
          Note_Title: title,
          Note_Content: content
        }
      ]
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

// Add a note
await addNote(
  accessToken,
  candidateId,
  'Technical Assessment Results',
  'Candidate scored 85/100 on coding challenge. Strong problem-solving skills.'
);
```

```python
def add_note(access_token, candidate_id, title, content):
    url = f'https://recruit.zoho.com/recruit/v2/Candidates/{candidate_id}/Notes'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'data': [
            {
                'Note_Title': title,
                'Note_Content': content
            }
        ]
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

```deluge
// Deluge
note_map = Map();
note_map.put("Note_Title", "Phone Screen Feedback");
note_map.put("Note_Content", "Candidate has strong communication skills.");

response = zoho.recruit.createRecord("Notes", candidate_id, note_map);
info response;
```

### List Notes

```http
GET /recruit/v2/Candidates/{candidate_id}/Notes
Authorization: Zoho-oauthtoken {access_token}
```

### Add Task

```http
POST /recruit/v2/Tasks
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "data": [
    {
      "Subject": "Follow up with candidate",
      "Who_Id": "123456000000123456",
      "Due_Date": "2025-12-15",
      "Status": "Not Started",
      "Priority": "High",
      "Description": "Follow up regarding job offer acceptance"
    }
  ]
}
```

**Example**:
```javascript
const createTask = async (accessToken, taskData) => {
  const response = await axios.post(
    'https://recruit.zoho.com/recruit/v2/Tasks',
    {
      data: [taskData]
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

// Create a follow-up task
const task = {
  Subject: 'Schedule second interview',
  Who_Id: candidateId,
  Due_Date: '2025-12-20',
  Status: 'Not Started',
  Priority: 'High'
};

await createTask(accessToken, task);
```

---

## Webhooks

Set up real-time notifications for recruitment events.

### Webhook Events

**Available Events**:
- `Candidates.create` - New candidate added
- `Candidates.update` - Candidate updated
- `Candidates.delete` - Candidate deleted
- `JobOpenings.create` - New job opening created
- `JobOpenings.update` - Job opening updated
- `Interviews.create` - New interview scheduled
- `Interviews.update` - Interview updated

### Configure Webhook

```http
POST /recruit/v2/settings/actions/watch
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "watch": [
    {
      "channel_id": "10000000068001",
      "events": ["Candidates.create", "Candidates.update"],
      "channel_expiry": "2026-12-31T23:59:59+00:00",
      "token": "your_verification_token",
      "notify_url": "https://yourdomain.com/webhook/zoho-recruit"
    }
  ]
}
```

**Example**:
```javascript
const setupWebhook = async (accessToken, webhookUrl, events) => {
  const response = await axios.post(
    'https://recruit.zoho.com/recruit/v2/settings/actions/watch',
    {
      watch: [
        {
          channel_id: Date.now().toString(),
          events: events,
          channel_expiry: '2026-12-31T23:59:59+00:00',
          token: 'your_verification_token',
          notify_url: webhookUrl
        }
      ]
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

// Setup webhook for candidate events
await setupWebhook(
  accessToken,
  'https://yourdomain.com/webhook/zoho-recruit',
  ['Candidates.create', 'Candidates.update', 'Interviews.create']
);
```

```python
def setup_webhook(access_token, webhook_url, events):
    url = 'https://recruit.zoho.com/recruit/v2/settings/actions/watch'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'watch': [
            {
                'channel_id': str(int(time.time() * 1000)),
                'events': events,
                'channel_expiry': '2026-12-31T23:59:59+00:00',
                'token': 'your_verification_token',
                'notify_url': webhook_url
            }
        ]
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

### Webhook Payload Example

When a candidate is created, Zoho Recruit sends a POST request to your webhook URL:

```json
{
  "module": "Candidates",
  "operation": "create",
  "resource_uri": "https://recruit.zoho.com/recruit/v2/Candidates/123456000000123456",
  "ids": ["123456000000123456"],
  "channel_id": "10000000068001",
  "channel_expiry": "2026-12-31T23:59:59+00:00",
  "token": "your_verification_token",
  "user_name": "recruiter@company.com"
}
```

### Handle Webhook in Your Application

```javascript
// Express.js webhook handler
const express = require('express');
const app = express();

app.use(express.json());

app.post('/webhook/zoho-recruit', async (req, res) => {
  const { module, operation, ids, token } = req.body;

  // Verify token
  if (token !== 'your_verification_token') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  console.log(`Webhook received: ${operation} on ${module}`);
  console.log('Record IDs:', ids);

  // Process webhook based on event
  if (module === 'Candidates' && operation === 'create') {
    // Fetch full candidate details
    for (const candidateId of ids) {
      const candidate = await getCandidate(accessToken, candidateId);
      console.log('New candidate:', candidate.data[0].Full_Name);

      // Perform custom actions (e.g., send notification, update external system)
      // ...
    }
  }

  // Always respond with 200 to acknowledge receipt
  res.status(200).json({ received: true });
});

app.listen(3000, () => {
  console.log('Webhook server running on port 3000');
});
```

```python
# Flask webhook handler
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/webhook/zoho-recruit', methods=['POST'])
def handle_webhook():
    data = request.json
    module = data.get('module')
    operation = data.get('operation')
    ids = data.get('ids', [])
    token = data.get('token')

    # Verify token
    if token != 'your_verification_token':
        return jsonify({'error': 'Invalid token'}), 401

    print(f"Webhook received: {operation} on {module}")
    print(f"Record IDs: {ids}")

    # Process webhook based on event
    if module == 'Candidates' and operation == 'create':
        # Fetch full candidate details
        for candidate_id in ids:
            candidate = get_candidate(access_token, candidate_id)
            print(f"New candidate: {candidate['data'][0]['Full_Name']}")

            # Perform custom actions
            # ...

    # Always respond with 200 to acknowledge receipt
    return jsonify({'received': True}), 200

if __name__ == '__main__':
    app.run(port=3000)
```

---

## Rate Limits

### API Call Limits

Zoho Recruit enforces rate limits to ensure fair usage and system stability.

| Edition | API Calls per Day | API Calls per Minute | Concurrent Calls |
|---------|-------------------|----------------------|------------------|
| Free | 5,000 | N/A | 5 |
| Standard | 10,000 | N/A | 10 |
| Professional | 25,000 | N/A | 15 |
| Enterprise | 50,000 | N/A | 20 |
| Ultimate | 100,000 | N/A | 25 |

### Rate Limit Details

**Daily Limit**:
- Resets at midnight UTC
- Includes all API operations (GET, POST, PUT, DELETE)

**Concurrent Calls**:
- Maximum simultaneous API requests
- Additional requests are queued or rejected with 429 error

### Rate Limit Headers

Every API response includes rate limit information:

```http
X-RateLimit-Limit: 50000
X-RateLimit-Remaining: 49875
X-RateLimit-Reset: 1702396800
```

- `X-RateLimit-Limit` - Total requests allowed per day
- `X-RateLimit-Remaining` - Requests remaining in current window
- `X-RateLimit-Reset` - Timestamp when rate limit resets (Unix epoch)

### Handle Rate Limiting

```javascript
const makeAPICallWithRetry = async (apiCall, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await apiCall();
      return response;
    } catch (error) {
      if (error.response?.status === 429) {
        const resetTime = error.response.headers['x-ratelimit-reset'];
        const waitTime = (resetTime * 1000) - Date.now();

        if (i < maxRetries - 1) {
          console.log(`Rate limit exceeded. Waiting ${waitTime}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, Math.max(waitTime, 1000)));
          continue;
        }
      }
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
};

// Usage
const candidates = await makeAPICallWithRetry(
  () => listCandidates(accessToken)
);
```

```python
import time

def make_api_call_with_retry(api_call, max_retries=3):
    for i in range(max_retries):
        try:
            return api_call()
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 429:
                reset_time = int(e.response.headers.get('X-RateLimit-Reset', 0))
                wait_time = max(0, reset_time - int(time.time()))

                if i < max_retries - 1:
                    print(f'Rate limit exceeded. Waiting {wait_time}s before retry...')
                    time.sleep(max(wait_time, 1))
                    continue
            raise
    raise Exception('Max retries exceeded')

# Usage
candidates = make_api_call_with_retry(
    lambda: list_candidates(access_token)
)
```

**Best Practices**:
- Monitor rate limit headers in responses
- Implement exponential backoff for retries
- Cache frequently accessed data
- Use webhooks for real-time updates instead of polling
- Use bulk APIs for large operations
- Distribute API calls throughout the day

---

## Error Codes

### HTTP Status Codes

| Status Code | Meaning | Common Causes |
|-------------|---------|---------------|
| 200 | OK | Successful request |
| 201 | Created | Resource successfully created |
| 204 | No Content | Successful deletion |
| 400 | Bad Request | Invalid request parameters or body |
| 401 | Unauthorized | Invalid or expired access token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource does not exist |
| 405 | Method Not Allowed | Invalid HTTP method |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |
| 503 | Service Unavailable | Service temporarily unavailable |

### Zoho Recruit Error Codes

| Error Code | Description | Solution |
|------------|-------------|----------|
| INVALID_TOKEN | Access token is invalid or expired | Refresh the access token |
| OAUTH_SCOPE_MISMATCH | Insufficient OAuth scope permissions | Update OAuth scopes |
| INVALID_REQUEST_METHOD | Invalid HTTP method | Use correct method (GET, POST, PUT, DELETE) |
| INVALID_DATA | Invalid field value or format | Check field requirements and format |
| MANDATORY_NOT_FOUND | Required field not provided | Include all required fields |
| DUPLICATE_DATA | Duplicate record detected | Check for existing records |
| RECORD_NOT_FOUND | Record ID does not exist | Verify record ID |
| NO_PERMISSION | User lacks module access | Grant module permissions |
| RATE_LIMIT_EXCEEDED | API rate limit exceeded | Implement rate limiting |
| INTERNAL_ERROR | Server error | Retry with exponential backoff |
| INVALID_MODULE | Module name is invalid | Check module API name |
| FIELD_NOT_FOUND | Field API name is invalid | Verify field API name |

### Error Response Format

```json
{
  "code": "INVALID_DATA",
  "details": {
    "api_name": "Email",
    "expected_data_type": "email"
  },
  "message": "invalid email address",
  "status": "error"
}
```

### Error Handling Examples

```javascript
const handleRecruitError = (error) => {
  if (error.response) {
    const { status, data } = error.response;

    switch (status) {
      case 400:
        console.error('Bad Request:', data.message);
        console.error('Details:', data.details);
        break;

      case 401:
        console.error('Unauthorized. Refreshing token...');
        // Trigger token refresh
        break;

      case 403:
        console.error('Forbidden. Check permissions.');
        break;

      case 404:
        console.error('Resource not found:', data.message);
        break;

      case 429:
        console.error('Rate limit exceeded. Retry after:',
          error.response.headers['x-ratelimit-reset']);
        break;

      case 500:
      case 503:
        console.error('Server error. Retrying...');
        // Implement retry logic
        break;

      default:
        console.error('API Error:', status, data);
    }
  } else if (error.request) {
    console.error('No response received:', error.message);
  } else {
    console.error('Request setup error:', error.message);
  }
};

// Usage
try {
  const candidate = await createCandidate(accessToken, candidateData);
} catch (error) {
  handleRecruitError(error);
}
```

```python
def handle_recruit_error(error):
    if isinstance(error, requests.exceptions.HTTPError):
        status = error.response.status_code
        data = error.response.json()

        if status == 400:
            print(f"Bad Request: {data.get('message')}")
            print(f"Details: {data.get('details')}")
        elif status == 401:
            print('Unauthorized. Refreshing token...')
            # Trigger token refresh
        elif status == 403:
            print('Forbidden. Check permissions.')
        elif status == 404:
            print(f"Resource not found: {data.get('message')}")
        elif status == 429:
            print('Rate limit exceeded. Retry after:',
                  error.response.headers.get('X-RateLimit-Reset'))
        elif status in [500, 503]:
            print('Server error. Retrying...')
            # Implement retry logic
        else:
            print(f"API Error: {status} - {data}")
    else:
        print(f"Request error: {str(error)}")

# Usage
try:
    candidate = create_candidate(access_token, candidate_data)
except requests.exceptions.HTTPError as e:
    handle_recruit_error(e)
```

---

## Code Examples

### Complete Recruitment Workflow

```javascript
// Complete workflow: Parse resume, create candidate, associate with job, schedule interview
const completeRecruitmentWorkflow = async (accessToken, resumeFilePath, jobOpeningId) => {
  try {
    // Step 1: Parse resume
    console.log('Parsing resume...');
    const parsedData = await parseResume(accessToken, resumeFilePath);

    if (!parsedData.data || parsedData.data.length === 0) {
      throw new Error('Failed to parse resume');
    }

    const candidateData = parsedData.data[0];
    console.log('Resume parsed:', candidateData.First_Name, candidateData.Last_Name);

    // Step 2: Check for duplicate candidate
    const existingCandidates = await axios.get(
      'https://recruit.zoho.com/recruit/v2/Candidates/search',
      {
        params: {
          email: candidateData.Email
        },
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`
        }
      }
    );

    let candidateId;
    if (existingCandidates.data.data && existingCandidates.data.data.length > 0) {
      // Update existing candidate
      candidateId = existingCandidates.data.data[0].id;
      await updateCandidate(accessToken, candidateId, {
        Candidate_Status: 'Active',
        Skill_Set: candidateData.Skill_Set
      });
      console.log('Updated existing candidate:', candidateId);
    } else {
      // Create new candidate
      const result = await createCandidate(accessToken, {
        ...candidateData,
        Candidate_Status: 'Active',
        Candidate_Source: 'Resume Upload'
      });
      candidateId = result.data[0].details.id;
      console.log('Created new candidate:', candidateId);
    }

    // Step 3: Upload resume as attachment
    await uploadAttachment(accessToken, candidateId, resumeFilePath);
    console.log('Resume uploaded as attachment');

    // Step 4: Associate candidate with job opening
    await associateCandidateToJob(accessToken, candidateId, jobOpeningId);
    console.log('Candidate associated with job opening');

    // Step 5: Add initial note
    await addNote(
      accessToken,
      candidateId,
      'Application Received',
      'Resume submitted via automated workflow. Ready for initial screening.'
    );

    // Step 6: Schedule phone screen interview
    const interviewDate = new Date();
    interviewDate.setDate(interviewDate.getDate() + 3); // 3 days from now

    const interview = await scheduleInterview(accessToken, {
      Interview_Name: `Phone Screen - ${candidateData.First_Name} ${candidateData.Last_Name}`,
      Candidate_Name: candidateId,
      Job_Opening: jobOpeningId,
      Scheduled_On: interviewDate.toISOString(),
      Interview_Type: 'Phone Screen',
      Interview_Status: 'Scheduled',
      Duration: '30 minutes'
    });
    console.log('Interview scheduled:', interview.data[0].details.id);

    console.log('Recruitment workflow completed successfully!');
    return {
      candidateId,
      interviewId: interview.data[0].details.id
    };

  } catch (error) {
    console.error('Workflow error:', error.response?.data || error.message);
    throw error;
  }
};

// Usage
const result = await completeRecruitmentWorkflow(
  accessToken,
  './resumes/john_doe_resume.pdf',
  jobOpeningId
);
```

### Bulk Candidate Import from CSV

```python
import csv
import time

def bulk_import_candidates(access_token, csv_file_path):
    """Import candidates from CSV file with rate limiting"""

    candidates_created = []
    candidates_failed = []

    with open(csv_file_path, 'r') as file:
        reader = csv.DictReader(file)

        for row in reader:
            try:
                # Prepare candidate data
                candidate_data = {
                    'First_Name': row['First_Name'],
                    'Last_Name': row['Last_Name'],
                    'Email': row['Email'],
                    'Phone': row.get('Phone', ''),
                    'Current_Job_Title': row.get('Current_Job_Title', ''),
                    'Skill_Set': row.get('Skill_Set', ''),
                    'Experience_in_Years': int(row.get('Experience_in_Years', 0)),
                    'Candidate_Status': 'Active',
                    'Candidate_Source': 'CSV Import'
                }

                # Create candidate
                result = create_candidate(access_token, candidate_data)
                candidate_id = result['data'][0]['details']['id']

                candidates_created.append({
                    'name': f"{row['First_Name']} {row['Last_Name']}",
                    'id': candidate_id
                })

                print(f"Created: {row['First_Name']} {row['Last_Name']}")

                # Rate limiting: wait between requests
                time.sleep(0.1)

            except Exception as e:
                candidates_failed.append({
                    'name': f"{row['First_Name']} {row['Last_Name']}",
                    'error': str(e)
                })
                print(f"Failed: {row['First_Name']} {row['Last_Name']} - {str(e)}")

    # Summary
    print(f"\n=== Import Summary ===")
    print(f"Successfully created: {len(candidates_created)}")
    print(f"Failed: {len(candidates_failed)}")

    return {
        'created': candidates_created,
        'failed': candidates_failed
    }

# Usage
result = bulk_import_candidates(access_token, 'candidates.csv')
```

### Candidate Matching System

```javascript
// Match candidates to job openings based on skills
const matchCandidatesToJobs = async (accessToken) => {
  try {
    // Get all active job openings
    const jobsResponse = await axios.get(
      'https://recruit.zoho.com/recruit/v2/JobOpenings',
      {
        params: {
          fields: 'id,Posting_Title,Required_Skills,Work_Experience'
        },
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`
        }
      }
    );

    const jobs = jobsResponse.data.data.filter(
      job => job.Job_Opening_Status === 'In-progress'
    );

    const matches = [];

    for (const job of jobs) {
      console.log(`\nMatching candidates for: ${job.Posting_Title}`);

      // Extract required skills
      const requiredSkills = job.Required_Skills
        ? job.Required_Skills.split(',').map(s => s.trim().toLowerCase())
        : [];

      if (requiredSkills.length === 0) continue;

      // Search for candidates with matching skills using COQL
      const skillQuery = requiredSkills
        .map(skill => `Skill_Set LIKE '%${skill}%'`)
        .join(' OR ');

      const coqlQuery = `
        SELECT id, First_Name, Last_Name, Email, Skill_Set, Experience_in_Years
        FROM Candidates
        WHERE Candidate_Status = 'Active'
          AND (${skillQuery})
        ORDER BY Experience_in_Years DESC
        LIMIT 10
      `;

      const candidatesResponse = await axios.post(
        'https://recruit.zoho.com/recruit/v2/coql',
        {
          select_query: coqlQuery.trim()
        },
        {
          headers: {
            'Authorization': `Zoho-oauthtoken ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (candidatesResponse.data.data && candidatesResponse.data.data.length > 0) {
        const matchedCandidates = candidatesResponse.data.data.map(candidate => {
          // Calculate skill match percentage
          const candidateSkills = candidate.Skill_Set
            ? candidate.Skill_Set.toLowerCase().split(',').map(s => s.trim())
            : [];

          const matchedSkills = requiredSkills.filter(
            skill => candidateSkills.some(cs => cs.includes(skill))
          );

          const matchPercentage = (matchedSkills.length / requiredSkills.length) * 100;

          return {
            ...candidate,
            matchPercentage: Math.round(matchPercentage)
          };
        });

        // Sort by match percentage
        matchedCandidates.sort((a, b) => b.matchPercentage - a.matchPercentage);

        matches.push({
          job: job.Posting_Title,
          jobId: job.id,
          candidates: matchedCandidates.slice(0, 5) // Top 5 matches
        });

        console.log(`Found ${matchedCandidates.length} matching candidates`);
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    return matches;

  } catch (error) {
    console.error('Matching error:', error.response?.data || error.message);
    throw error;
  }
};

// Usage
const matches = await matchCandidatesToJobs(accessToken);
matches.forEach(match => {
  console.log(`\n${match.job}:`);
  match.candidates.forEach((candidate, index) => {
    console.log(`  ${index + 1}. ${candidate.First_Name} ${candidate.Last_Name} - ${candidate.matchPercentage}% match`);
  });
});
```

### Interview Reminder System

```python
from datetime import datetime, timedelta
import smtplib
from email.mime.text import MIMEText

def send_interview_reminders(access_token):
    """Send reminder emails for interviews scheduled in next 24 hours"""

    # Get interviews scheduled for tomorrow
    tomorrow = datetime.now() + timedelta(days=1)
    tomorrow_start = tomorrow.replace(hour=0, minute=0, second=0, microsecond=0)
    tomorrow_end = tomorrow.replace(hour=23, minute=59, second=59, microsecond=999999)

    # Search for upcoming interviews
    query = f"""
        SELECT id, Interview_Name, Candidate_Name, Job_Opening, Scheduled_On,
               Interviewer, Video_Call_Link, Location
        FROM Interviews
        WHERE Interview_Status = 'Scheduled'
          AND Scheduled_On >= '{tomorrow_start.isoformat()}'
          AND Scheduled_On <= '{tomorrow_end.isoformat()}'
    """

    url = 'https://recruit.zoho.com/recruit/v2/coql'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }

    response = requests.post(url, json={'select_query': query.strip()}, headers=headers)
    interviews = response.json().get('data', [])

    print(f"Found {len(interviews)} interviews for tomorrow")

    for interview in interviews:
        # Get candidate details
        candidate_url = f"https://recruit.zoho.com/recruit/v2/Candidates/{interview['Candidate_Name']}"
        candidate_response = requests.get(candidate_url, headers=headers)
        candidate = candidate_response.json()['data'][0]

        # Get interviewer details
        interviewer_url = f"https://recruit.zoho.com/recruit/v2/users/{interview['Interviewer']}"
        interviewer_response = requests.get(interviewer_url, headers=headers)
        interviewer = interviewer_response.json()['users'][0]

        # Prepare reminder email
        scheduled_time = datetime.fromisoformat(interview['Scheduled_On'].replace('Z', '+00:00'))

        # Send to candidate
        send_email(
            to=candidate['Email'],
            subject=f"Interview Reminder: {interview['Interview_Name']}",
            body=f"""
            Hi {candidate['First_Name']},

            This is a reminder for your interview scheduled tomorrow:

            Interview: {interview['Interview_Name']}
            Date & Time: {scheduled_time.strftime('%B %d, %Y at %I:%M %p')}
            Interviewer: {interviewer['full_name']}
            Location: {interview.get('Location', 'N/A')}
            Video Call: {interview.get('Video_Call_Link', 'N/A')}

            Please be ready 5 minutes before the scheduled time.

            Best regards,
            Recruitment Team
            """
        )

        # Send to interviewer
        send_email(
            to=interviewer['email'],
            subject=f"Interview Reminder: {interview['Interview_Name']}",
            body=f"""
            Hi {interviewer['first_name']},

            This is a reminder for the interview you're conducting tomorrow:

            Candidate: {candidate['Full_Name']}
            Interview: {interview['Interview_Name']}
            Date & Time: {scheduled_time.strftime('%B %d, %Y at %I:%M %p')}
            Location: {interview.get('Location', 'N/A')}
            Video Call: {interview.get('Video_Call_Link', 'N/A')}

            Candidate Profile: https://recruit.zoho.com/recruit/ShowCandidateDetails.do?id={candidate['id']}

            Best regards,
            Recruitment Team
            """
        )

        print(f"Sent reminders for: {interview['Interview_Name']}")

def send_email(to, subject, body):
    """Helper function to send emails"""
    # Configure your SMTP settings
    # This is a placeholder - implement actual email sending
    print(f"Email sent to {to}: {subject}")

# Usage
send_interview_reminders(access_token)
```

### Recruitment Analytics Dashboard

```deluge
// Deluge - Generate recruitment metrics report
// Can be used in Zoho Recruit custom functions or scheduled tasks

// Get date range (last 30 days)
from_date = zoho.currentdate.subDay(30);
to_date = zoho.currentdate;

// Initialize metrics
metrics = Map();

// 1. Total candidates added
candidates_response = zoho.recruit.getRecords("Candidates", 1, 200);
total_candidates = candidates_response.size();
metrics.put("total_candidates", total_candidates);

// 2. Candidates by status
status_count = Map();
for each  candidate in candidates_response
{
	status = candidate.get("Candidate_Status");
	if(status_count.containsKey(status))
	{
		count = status_count.get(status);
		status_count.put(status, count + 1);
	}
	else
	{
		status_count.put(status, 1);
	}
}
metrics.put("candidates_by_status", status_count);

// 3. Job openings statistics
jobs_response = zoho.recruit.getRecords("JobOpenings", 1, 200);
total_jobs = jobs_response.size();
active_jobs = 0;
filled_jobs = 0;
for each  job in jobs_response
{
	job_status = job.get("Job_Opening_Status");
	if(job_status == "In-progress")
	{
		active_jobs = active_jobs + 1;
	}
	else if(job_status == "Filled")
	{
		filled_jobs = filled_jobs + 1;
	}
}
metrics.put("total_jobs", total_jobs);
metrics.put("active_jobs", active_jobs);
metrics.put("filled_jobs", filled_jobs);

// 4. Interviews statistics
interviews_response = zoho.recruit.getRecords("Interviews", 1, 200);
total_interviews = interviews_response.size();
scheduled_interviews = 0;
completed_interviews = 0;
for each  interview in interviews_response
{
	interview_status = interview.get("Interview_Status");
	if(interview_status == "Scheduled")
	{
		scheduled_interviews = scheduled_interviews + 1;
	}
	else if(interview_status == "Completed")
	{
		completed_interviews = completed_interviews + 1;
	}
}
metrics.put("total_interviews", total_interviews);
metrics.put("scheduled_interviews", scheduled_interviews);
metrics.put("completed_interviews", completed_interviews);

// 5. Time to hire (average days from candidate creation to hire)
// This is a simplified calculation
total_days = 0;
hired_count = 0;
for each  candidate in candidates_response
{
	if(candidate.get("Candidate_Status") == "Hired")
	{
		created = candidate.get("Created_Time").toDate();
		modified = candidate.get("Modified_Time").toDate();
		days_diff = modified.daysBetween(created);
		total_days = total_days + days_diff;
		hired_count = hired_count + 1;
	}
}
if(hired_count > 0)
{
	avg_time_to_hire = total_days / hired_count;
	metrics.put("average_time_to_hire_days", avg_time_to_hire);
}

// 6. Top candidate sources
source_count = Map();
for each  candidate in candidates_response
{
	source = candidate.get("Candidate_Source");
	if(source != null && source != "")
	{
		if(source_count.containsKey(source))
		{
			count = source_count.get(source);
			source_count.put(source, count + 1);
		}
		else
		{
			source_count.put(source, 1);
		}
	}
}
metrics.put("candidates_by_source", source_count);

// Output report
info "=== Recruitment Metrics Report ===";
info "Report Date: " + zoho.currentdate.toString("MMM dd, yyyy");
info "";
info "Candidates:";
info "- Total: " + metrics.get("total_candidates");
info "- By Status: " + metrics.get("candidates_by_status");
info "";
info "Job Openings:";
info "- Total: " + metrics.get("total_jobs");
info "- Active: " + metrics.get("active_jobs");
info "- Filled: " + metrics.get("filled_jobs");
info "";
info "Interviews:";
info "- Total: " + metrics.get("total_interviews");
info "- Scheduled: " + metrics.get("scheduled_interviews");
info "- Completed: " + metrics.get("completed_interviews");
info "";
if(hired_count > 0)
{
	info "Average Time to Hire: " + metrics.get("average_time_to_hire_days") + " days";
}
info "";
info "Top Candidate Sources: " + metrics.get("candidates_by_source");

return metrics;
```

---

## Best Practices

### 1. Authentication and Security

**Store Credentials Securely**:
```javascript
// Bad - Never hardcode credentials
const clientId = '1000.ABCDEF123456';
const clientSecret = 'secret123';

// Good - Use environment variables
const clientId = process.env.ZOHO_CLIENT_ID;
const clientSecret = process.env.ZOHO_CLIENT_SECRET;
const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
```

**Implement Automatic Token Refresh**:
```javascript
class ZohoRecruitAuth {
  constructor(clientId, clientSecret, refreshToken) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.refreshToken = refreshToken;
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async getValidToken() {
    if (!this.accessToken || Date.now() >= this.tokenExpiry) {
      await this.refreshAccessToken();
    }
    return this.accessToken;
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
    this.tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000; // Refresh 1 min before expiry
  }
}
```

### 2. Error Handling

**Implement Comprehensive Error Handling**:
```javascript
const safeAPICall = async (apiFunction, ...args) => {
  const maxRetries = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiFunction(...args);
    } catch (error) {
      lastError = error;

      if (error.response?.status === 401) {
        // Token expired - refresh and retry
        await auth.refreshAccessToken();
        continue;
      }

      if (error.response?.status === 429) {
        // Rate limit - wait and retry
        const resetTime = error.response.headers['x-ratelimit-reset'];
        const waitTime = (resetTime * 1000) - Date.now();
        await new Promise(resolve => setTimeout(resolve, Math.max(waitTime, 1000)));
        continue;
      }

      if (error.response?.status >= 500 && attempt < maxRetries) {
        // Server error - exponential backoff
        const backoff = Math.pow(2, attempt) * 1000;
        console.log(`Server error. Retrying in ${backoff}ms...`);
        await new Promise(resolve => setTimeout(resolve, backoff));
        continue;
      }

      // Non-retryable error
      throw error;
    }
  }

  throw lastError;
};
```

### 3. Data Validation

**Validate Before API Calls**:
```javascript
const validateCandidateData = (candidateData) => {
  const errors = [];

  // Required fields
  if (!candidateData.First_Name || candidateData.First_Name.trim() === '') {
    errors.push('First_Name is required');
  }

  if (!candidateData.Last_Name || candidateData.Last_Name.trim() === '') {
    errors.push('Last_Name is required');
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (candidateData.Email && !emailRegex.test(candidateData.Email)) {
    errors.push('Invalid email format');
  }

  // Phone validation (basic)
  if (candidateData.Phone && candidateData.Phone.length < 10) {
    errors.push('Phone number must be at least 10 digits');
  }

  // Experience validation
  if (candidateData.Experience_in_Years !== undefined) {
    const experience = parseInt(candidateData.Experience_in_Years);
    if (isNaN(experience) || experience < 0 || experience > 50) {
      errors.push('Experience must be between 0 and 50 years');
    }
  }

  if (errors.length > 0) {
    throw new Error(`Validation failed:\n${errors.join('\n')}`);
  }

  return true;
};

// Usage
try {
  validateCandidateData(candidateData);
  const result = await createCandidate(accessToken, candidateData);
} catch (error) {
  console.error('Validation error:', error.message);
}
```

### 4. Performance Optimization

**Use Bulk APIs for Large Operations**:
```javascript
// Instead of creating candidates one by one
for (const candidate of candidates) {
  await createCandidate(accessToken, candidate);
}

// Use bulk write for better performance
await bulkWriteCandidates(accessToken, 'candidates.csv');
```

**Implement Pagination for Large Datasets**:
```javascript
const getAllCandidates = async (accessToken) => {
  const allCandidates = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await axios.get(
      'https://recruit.zoho.com/recruit/v2/Candidates',
      {
        params: {
          page: page,
          per_page: 200
        },
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`
        }
      }
    );

    if (response.data.data && response.data.data.length > 0) {
      allCandidates.push(...response.data.data);
      hasMore = response.data.info.more_records;
      page++;
    } else {
      hasMore = false;
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return allCandidates;
};
```

**Cache Frequently Accessed Data**:
```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour

const getJobOpeningsWithCache = async (accessToken) => {
  const cacheKey = 'active_job_openings';

  // Check cache first
  let jobs = cache.get(cacheKey);
  if (jobs) {
    console.log('Using cached job openings');
    return jobs;
  }

  // Fetch from API
  const response = await listJobOpenings(accessToken);
  jobs = response.data;

  // Cache result
  cache.set(cacheKey, jobs);

  return jobs;
};
```

### 5. Webhook Best Practices

**Implement Idempotency**:
```javascript
const processedWebhooks = new Set();

const processWebhook = (webhookData) => {
  const webhookId = `${webhookData.module}_${webhookData.operation}_${webhookData.ids.join('_')}`;

  // Skip if already processed
  if (processedWebhooks.has(webhookId)) {
    console.log('Webhook already processed:', webhookId);
    return;
  }

  // Process webhook
  handleWebhookEvent(webhookData);

  // Mark as processed
  processedWebhooks.add(webhookId);

  // Clean up old entries (keep last 1000)
  if (processedWebhooks.size > 1000) {
    const oldestId = processedWebhooks.values().next().value;
    processedWebhooks.delete(oldestId);
  }
};
```

### 6. Resume Parsing Optimization

**Batch Process Resumes**:
```javascript
const batchProcessResumes = async (accessToken, resumeFiles) => {
  const results = {
    success: [],
    failed: []
  };

  for (const file of resumeFiles) {
    try {
      // Parse resume
      const parsed = await parseResume(accessToken, file);

      if (parsed.data && parsed.data.length > 0) {
        const candidateData = parsed.data[0];

        // Create candidate
        const result = await createCandidate(accessToken, {
          ...candidateData,
          Candidate_Status: 'Active',
          Candidate_Source: 'Batch Resume Upload'
        });

        const candidateId = result.data[0].details.id;

        // Upload original resume as attachment
        await uploadAttachment(accessToken, candidateId, file);

        results.success.push({
          file: file,
          candidateId: candidateId,
          name: candidateData.Full_Name || `${candidateData.First_Name} ${candidateData.Last_Name}`
        });

        console.log(`Processed: ${file}`);
      }
    } catch (error) {
      results.failed.push({
        file: file,
        error: error.message
      });
      console.error(`Failed: ${file} - ${error.message}`);
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return results;
};
```

### 7. Monitoring and Logging

**Track API Usage**:
```javascript
class APIMonitor {
  constructor() {
    this.calls = [];
    this.dailyLimit = 50000;
  }

  logCall(endpoint, method, status, duration) {
    this.calls.push({
      endpoint,
      method,
      status,
      duration,
      timestamp: new Date()
    });
  }

  getStats() {
    const today = new Date().toDateString();
    const todayCalls = this.calls.filter(
      call => call.timestamp.toDateString() === today
    );

    return {
      totalCallsToday: todayCalls.length,
      remainingCalls: this.dailyLimit - todayCalls.length,
      avgDuration: todayCalls.reduce((sum, c) => sum + c.duration, 0) / todayCalls.length,
      errorRate: todayCalls.filter(c => c.status >= 400).length / todayCalls.length,
      callsByEndpoint: todayCalls.reduce((acc, c) => {
        acc[c.endpoint] = (acc[c.endpoint] || 0) + 1;
        return acc;
      }, {})
    };
  }

  checkRateLimit() {
    const stats = this.getStats();
    if (stats.remainingCalls < 1000) {
      console.warn(`Warning: Only ${stats.remainingCalls} API calls remaining today!`);
    }
  }
}
```

---

## Data Centers

Zoho Recruit operates in multiple data centers. Use the appropriate base URL for your region:

| Data Center | Base URL | Accounts URL |
|-------------|----------|--------------|
| US | https://recruit.zoho.com | https://accounts.zoho.com |
| EU | https://recruit.zoho.eu | https://accounts.zoho.eu |
| IN | https://recruit.zoho.in | https://accounts.zoho.in |
| AU | https://recruit.zoho.com.au | https://accounts.zoho.com.au |
| JP | https://recruit.zoho.jp | https://accounts.zoho.jp |
| CA | https://recruit.zoho.ca | https://accounts.zoho.ca |
| CN | https://recruit.zoho.com.cn | https://accounts.zoho.com.cn |

**Important**: The OAuth token domain must match your API domain. Check the `api_domain` in your OAuth token response.

---

## SDKs Available

Official SDKs:
- **Java**: `com.zoho.recruit`
- **PHP**: `zohocrm/php-sdk`
- **Python**: `zohocrmsdk`
- **Node.js**: `@zohocrm/nodejs-sdk`
- **C#**: `ZohoCRM`

**Installation Examples**:

```bash
# Node.js
npm install @zohocrm/nodejs-sdk-2.1

# Python
pip install zohocrmsdk2_1

# PHP
composer require zohocrm/php-sdk-2.1
```

---

## Additional Resources

- [Official Zoho Recruit API Documentation](https://www.zoho.com/recruit/developer-guide/apiv2/)
- [Zoho API Console](https://api-console.zoho.com/)
- [Zoho Recruit Developer Portal](https://www.zoho.com/recruit/developers/)
- [Developer Community Forums](https://help.zoho.com/portal/en/community/recruit)
- [Postman Collection](https://www.postman.com/zoho-recruit)
- [Status Page](https://status.zoho.com/)
- [Zoho Marketplace](https://marketplace.zoho.com/home/recruit)

---

## Changelog

### v2 (Current)
- COQL support for advanced queries
- Bulk API operations (read/write)
- Resume parsing API
- Enhanced search capabilities
- Webhook support
- Improved error messages
- Better rate limiting
- Interview scheduling APIs
- Comprehensive attachment handling

---

**Last Updated**: December 2025
**API Version**: v2
