# Zoho Learn API Reference

## Overview

Zoho Learn is a learning management system (LMS) for creating and delivering online courses, training programs, and assessments. The API provides programmatic access to courses, modules, learners, and progress tracking.

**Current API Version**: v1
**Base URL**: `https://learn.zoho.com/api/v1/`
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
- `ZohoLearn.courses.ALL` - Manage courses
- `ZohoLearn.learners.ALL` - Manage learners
- `ZohoLearn.assessments.ALL` - Manage assessments

---

## Rate Limits

- **API Calls**: 5,000 calls per day
- **Burst Limit**: 60 calls per minute

---

## API Modules

### 1. Courses

**Endpoints**:
```http
GET    /api/v1/courses              # List courses
GET    /api/v1/courses/{courseId}   # Get course details
POST   /api/v1/courses              # Create course
PUT    /api/v1/courses/{courseId}   # Update course
DELETE /api/v1/courses/{courseId}   # Delete course
```

**Example - Create Course**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const createCourse = async (accessToken, courseData) => {
  const response = await axios.post(
    'https://learn.zoho.com/api/v1/courses',
    {
      title: courseData.title,
      description: courseData.description,
      category: courseData.category,
      difficulty: courseData.difficulty || 'intermediate',
      duration: courseData.duration,
      instructor: courseData.instructor,
      settings: {
        selfEnrollment: true,
        certificateEnabled: true,
        progressTracking: true
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

**Response**:
```json
{
  "courseId": "course_123",
  "title": "Advanced JavaScript",
  "description": "Master modern JavaScript",
  "category": "Programming",
  "difficulty": "advanced",
  "duration": 1200,
  "enrolledCount": 0,
  "completionRate": 0,
  "status": "draft"
}
```

---

### 2. Modules

**Endpoints**:
```http
GET    /api/v1/courses/{courseId}/modules              # List modules
POST   /api/v1/courses/{courseId}/modules              # Add module
PUT    /api/v1/courses/{courseId}/modules/{moduleId}   # Update module
DELETE /api/v1/courses/{courseId}/modules/{moduleId}   # Delete module
```

**Example - Add Module**:
```python
# Python
import requests

def add_module(access_token, course_id, module_data):
    url = f'https://learn.zoho.com/api/v1/courses/{course_id}/modules'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'title': module_data['title'],
        'description': module_data['description'],
        'order': module_data.get('order', 1),
        'content': module_data['content'],
        'contentType': module_data.get('content_type', 'text')
    }

    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

---

### 3. Learners

**Endpoints**:
```http
GET    /api/v1/learners                    # List learners
GET    /api/v1/learners/{learnerId}        # Get learner details
POST   /api/v1/learners                    # Add learner
POST   /api/v1/courses/{courseId}/enroll   # Enroll learner
```

**Example - Enroll Learner**:
```javascript
// JavaScript/Node.js
const enrollLearner = async (accessToken, courseId, learnerData) => {
  const response = await axios.post(
    `https://learn.zoho.com/api/v1/courses/${courseId}/enroll`,
    {
      email: learnerData.email,
      firstName: learnerData.firstName,
      lastName: learnerData.lastName,
      sendEmail: true
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

### 4. Assessments

**Endpoints**:
```http
GET    /api/v1/courses/{courseId}/assessments           # List assessments
POST   /api/v1/courses/{courseId}/assessments           # Create assessment
GET    /api/v1/assessments/{assessmentId}/submissions   # Get submissions
```

**Example - Create Assessment**:
```python
# Python
def create_assessment(access_token, course_id, assessment_data):
    url = f'https://learn.zoho.com/api/v1/courses/{course_id}/assessments'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'title': assessment_data['title'],
        'passingScore': assessment_data['passing_score'],
        'timeLimit': assessment_data['time_limit'],
        'questions': assessment_data['questions']
    }

    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

---

### 5. Progress Tracking

**Endpoints**:
```http
GET /api/v1/learners/{learnerId}/progress           # Get learner progress
GET /api/v1/courses/{courseId}/progress             # Get course progress
POST /api/v1/learners/{learnerId}/progress/update   # Update progress
```

**Example - Get Learner Progress**:
```javascript
// JavaScript/Node.js
const getLearnerProgress = async (accessToken, learnerId) => {
  const response = await axios.get(
    `https://learn.zoho.com/api/v1/learners/${learnerId}/progress`,
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

## Deluge Integration

```javascript
// Deluge Script
courseData = {
  "title": "Employee Onboarding",
  "description": "New employee training program",
  "category": "HR",
  "duration": 480
};

response = invokeurl
[
  url: "https://learn.zoho.com/api/v1/courses"
  type: POST
  parameters: courseData.toString()
  connection: "zoho_learn"
];

courseId = response.get("courseId");
info "Created course: " + courseId;
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
| US | `https://learn.zoho.com/api/v1/` |
| EU | `https://learn.zoho.eu/api/v1/` |
| IN | `https://learn.zoho.in/api/v1/` |

---

## Additional Resources

- **Official Documentation**: https://www.zoho.com/learn/help/api/
- **Developer Console**: https://api-console.zoho.com/
