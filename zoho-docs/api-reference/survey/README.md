# Zoho Survey API Reference

## Overview

Zoho Survey is an online survey platform for creating, distributing, and analyzing surveys. The API enables programmatic access to survey management, response collection, and analytics.

**Current API Version**: v2
**Base URL**: `https://survey.zoho.com/api/v2/`
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
- [Code Examples](#code-examples)

---

## Authentication

### OAuth 2.0 Setup

**Authorization URL**:
```
https://accounts.zoho.com/oauth/v2/auth
```

**Token URL**:
```
https://accounts.zoho.com/oauth/v2/token
```

**Required Scopes**:
- `ZohoSurvey.surveys.ALL` - Full access to surveys
- `ZohoSurvey.surveys.READ` - Read-only access
- `ZohoSurvey.responses.ALL` - Manage responses
- `ZohoSurvey.responses.READ` - Read responses

**Example Authorization Request**:
```http
GET https://accounts.zoho.com/oauth/v2/auth?
  response_type=code&
  client_id={client_id}&
  scope=ZohoSurvey.surveys.ALL,ZohoSurvey.responses.ALL&
  redirect_uri={redirect_uri}&
  access_type=offline
```

---

## Rate Limits

- **API Calls**: 5,000 calls per day per organization
- **Burst Limit**: 50 calls per minute
- **Response Retrieval**: 1,000 responses per request

**Rate Limit Headers**:
```http
X-RateLimit-Limit: 50
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1704124800
```

---

## API Modules

### 1. Surveys

**Purpose**: Create and manage surveys

**Endpoints**:
```http
GET    /api/v2/surveys                  # List all surveys
GET    /api/v2/surveys/{surveyId}       # Get survey details
POST   /api/v2/surveys                  # Create survey
PUT    /api/v2/surveys/{surveyId}       # Update survey
DELETE /api/v2/surveys/{surveyId}       # Delete survey
POST   /api/v2/surveys/{surveyId}/publish # Publish survey
POST   /api/v2/surveys/{surveyId}/close   # Close survey
```

**Example - List Surveys**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const listSurveys = async (accessToken) => {
  const response = await axios.get(
    'https://survey.zoho.com/api/v2/surveys',
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      },
      params: {
        page: 1,
        per_page: 50
      }
    }
  );
  return response.data;
};
```

**Response**:
```json
{
  "surveys": [
    {
      "surveyId": "1234567890",
      "surveyName": "Customer Satisfaction Survey",
      "surveyDescription": "Quarterly customer feedback",
      "status": "active",
      "createdTime": "2025-01-15T10:30:00Z",
      "modifiedTime": "2025-01-20T14:45:00Z",
      "responseCount": 245,
      "questionCount": 12,
      "surveyUrl": "https://survey.zoho.com/survey/1234567890"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 50,
    "total_count": 10
  }
}
```

**Example - Create Survey**:
```python
# Python
import requests

def create_survey(access_token, survey_data):
    url = 'https://survey.zoho.com/api/v2/surveys'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'surveyName': survey_data['name'],
        'surveyDescription': survey_data['description'],
        'surveyType': 'standard',
        'anonymous': survey_data.get('anonymous', False)
    }

    response = requests.post(url, json=data, headers=headers)
    return response.json()

# Usage
survey = create_survey(access_token, {
    'name': 'Employee Satisfaction 2025',
    'description': 'Annual employee feedback survey',
    'anonymous': True
})
```

---

### 2. Questions

**Purpose**: Manage survey questions

**Endpoints**:
```http
GET    /api/v2/surveys/{surveyId}/questions              # List questions
GET    /api/v2/surveys/{surveyId}/questions/{questionId} # Get question
POST   /api/v2/surveys/{surveyId}/questions              # Add question
PUT    /api/v2/surveys/{surveyId}/questions/{questionId} # Update question
DELETE /api/v2/surveys/{surveyId}/questions/{questionId} # Delete question
```

**Question Types**:
- `single_choice` - Single selection
- `multiple_choice` - Multiple selections
- `rating_scale` - Rating scale (1-5, 1-10, etc.)
- `matrix` - Matrix/grid question
- `text` - Short text answer
- `long_text` - Long text/paragraph
- `dropdown` - Dropdown selection
- `nps` - Net Promoter Score
- `date` - Date picker
- `email` - Email validation

**Example - Add Question**:
```javascript
// JavaScript/Node.js
const addQuestion = async (accessToken, surveyId, questionData) => {
  const response = await axios.post(
    `https://survey.zoho.com/api/v2/surveys/${surveyId}/questions`,
    {
      questionType: questionData.type,
      questionText: questionData.text,
      required: questionData.required || false,
      options: questionData.options,
      order: questionData.order
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

// Add multiple choice question
await addQuestion(accessToken, surveyId, {
  type: 'multiple_choice',
  text: 'Which features do you use most?',
  required: true,
  options: [
    { text: 'Email Marketing', value: 'email' },
    { text: 'CRM Integration', value: 'crm' },
    { text: 'Analytics', value: 'analytics' },
    { text: 'Automation', value: 'automation' }
  ],
  order: 1
});
```

**Example - Add Rating Question**:
```python
# Python
def add_rating_question(access_token, survey_id, question_text):
    url = f'https://survey.zoho.com/api/v2/surveys/{survey_id}/questions'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'questionType': 'rating_scale',
        'questionText': question_text,
        'required': True,
        'ratingScale': {
            'min': 1,
            'max': 5,
            'minLabel': 'Poor',
            'maxLabel': 'Excellent'
        }
    }

    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

---

### 3. Responses

**Purpose**: Collect and manage survey responses

**Endpoints**:
```http
GET    /api/v2/surveys/{surveyId}/responses              # List responses
GET    /api/v2/surveys/{surveyId}/responses/{responseId} # Get response
POST   /api/v2/surveys/{surveyId}/responses              # Submit response
DELETE /api/v2/surveys/{surveyId}/responses/{responseId} # Delete response
GET    /api/v2/surveys/{surveyId}/responses/export       # Export responses
```

**Example - Get Responses**:
```javascript
// JavaScript/Node.js
const getResponses = async (accessToken, surveyId, options = {}) => {
  const response = await axios.get(
    `https://survey.zoho.com/api/v2/surveys/${surveyId}/responses`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      },
      params: {
        page: options.page || 1,
        per_page: options.perPage || 100,
        from_date: options.fromDate,
        to_date: options.toDate,
        status: options.status || 'completed'
      }
    }
  );
  return response.data;
};

// Get completed responses from last 30 days
const responses = await getResponses(accessToken, surveyId, {
  fromDate: '2025-01-01',
  toDate: '2025-01-31',
  status: 'completed',
  perPage: 100
});
```

**Response Format**:
```json
{
  "responses": [
    {
      "responseId": "987654321",
      "surveyId": "1234567890",
      "respondentEmail": "user@example.com",
      "status": "completed",
      "submittedTime": "2025-01-15T10:30:00Z",
      "ipAddress": "192.168.1.1",
      "answers": [
        {
          "questionId": "111111",
          "questionText": "How satisfied are you?",
          "answer": "Very Satisfied"
        },
        {
          "questionId": "222222",
          "questionText": "Which features do you use?",
          "answer": ["Email Marketing", "CRM Integration"]
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 100,
    "total_count": 245
  }
}
```

**Example - Submit Response Programmatically**:
```python
# Python
def submit_response(access_token, survey_id, response_data):
    url = f'https://survey.zoho.com/api/v2/surveys/{survey_id}/responses'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'respondentEmail': response_data['email'],
        'answers': response_data['answers']
    }

    response = requests.post(url, json=data, headers=headers)
    return response.json()

# Submit a response
submit_response(access_token, survey_id, {
    'email': 'respondent@example.com',
    'answers': [
        {
            'questionId': '111111',
            'answer': 'Very Satisfied'
        },
        {
            'questionId': '222222',
            'answer': ['Email Marketing', 'CRM Integration']
        }
    ]
})
```

---

### 4. Analytics

**Purpose**: Get survey analytics and statistics

**Endpoints**:
```http
GET /api/v2/surveys/{surveyId}/analytics         # Overall analytics
GET /api/v2/surveys/{surveyId}/analytics/summary # Summary stats
GET /api/v2/surveys/{surveyId}/analytics/questions/{questionId} # Question analytics
```

**Example - Get Survey Analytics**:
```javascript
// JavaScript/Node.js
const getSurveyAnalytics = async (accessToken, surveyId) => {
  const response = await axios.get(
    `https://survey.zoho.com/api/v2/surveys/${surveyId}/analytics`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

**Analytics Response**:
```json
{
  "surveyId": "1234567890",
  "totalResponses": 245,
  "completedResponses": 238,
  "partialResponses": 7,
  "averageCompletionTime": 245,
  "completionRate": 97.14,
  "responseRate": 68.5,
  "npsScore": 42,
  "dateRange": {
    "from": "2025-01-01",
    "to": "2025-01-31"
  },
  "questionStats": [
    {
      "questionId": "111111",
      "questionType": "rating_scale",
      "averageRating": 4.2,
      "responses": 238
    }
  ]
}
```

**Example - Get Question Analytics**:
```python
# Python
def get_question_analytics(access_token, survey_id, question_id):
    url = f'https://survey.zoho.com/api/v2/surveys/{survey_id}/analytics/questions/{question_id}'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }

    response = requests.get(url, headers=headers)
    return response.json()

# Response includes answer distribution
# {
#   "questionId": "111111",
#   "questionText": "How satisfied are you?",
#   "totalResponses": 238,
#   "answerDistribution": [
#     { "answer": "Very Satisfied", "count": 95, "percentage": 39.9 },
#     { "answer": "Satisfied", "count": 108, "percentage": 45.4 },
#     { "answer": "Neutral", "count": 25, "percentage": 10.5 },
#     { "answer": "Dissatisfied", "count": 10, "percentage": 4.2 }
#   ]
# }
```

---

### 5. Distribution

**Purpose**: Manage survey distribution channels

**Endpoints**:
```http
POST /api/v2/surveys/{surveyId}/distribution/email    # Email distribution
POST /api/v2/surveys/{surveyId}/distribution/embed    # Get embed code
GET  /api/v2/surveys/{surveyId}/distribution/link     # Get survey link
POST /api/v2/surveys/{surveyId}/distribution/social   # Social media share
```

**Example - Email Distribution**:
```javascript
// JavaScript/Node.js
const sendSurveyEmail = async (accessToken, surveyId, emailData) => {
  const response = await axios.post(
    `https://survey.zoho.com/api/v2/surveys/${surveyId}/distribution/email`,
    {
      recipients: emailData.recipients,
      subject: emailData.subject,
      message: emailData.message,
      senderName: emailData.senderName,
      replyTo: emailData.replyTo
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

// Send survey to email list
await sendSurveyEmail(accessToken, surveyId, {
  recipients: ['user1@example.com', 'user2@example.com'],
  subject: 'We value your feedback!',
  message: 'Please take a moment to complete our survey.',
  senderName: 'Customer Success Team',
  replyTo: 'support@company.com'
});
```

---

## Common Operations

### 1. Clone Survey

```javascript
// JavaScript/Node.js
const cloneSurvey = async (accessToken, surveyId, newName) => {
  const response = await axios.post(
    `https://survey.zoho.com/api/v2/surveys/${surveyId}/clone`,
    {
      surveyName: newName
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

### 2. Export Responses

```python
# Python
def export_responses(access_token, survey_id, export_format='csv'):
    url = f'https://survey.zoho.com/api/v2/surveys/{survey_id}/responses/export'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'format': export_format,  # csv, xlsx, pdf
        'include_partial': False
    }

    response = requests.get(url, params=params, headers=headers)

    # Save to file
    with open(f'survey_responses.{export_format}', 'wb') as f:
        f.write(response.content)

    return f'Exported to survey_responses.{export_format}'
```

### 3. Add Logic/Branching

```javascript
// JavaScript/Node.js
const addQuestionLogic = async (accessToken, surveyId, questionId, logic) => {
  const response = await axios.post(
    `https://survey.zoho.com/api/v2/surveys/${surveyId}/questions/${questionId}/logic`,
    {
      logicType: 'skip',  // skip, branch, display
      conditions: logic.conditions,
      action: logic.action
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

// Skip to question 5 if answer is "Yes"
await addQuestionLogic(accessToken, surveyId, questionId, {
  conditions: [
    {
      operator: 'equals',
      value: 'Yes'
    }
  ],
  action: {
    type: 'skip_to',
    targetQuestionId: '555555'
  }
});
```

---

## Deluge Integration

### Create Survey from Deluge

```javascript
// Deluge Script
surveyData = {
  "surveyName": "Customer Feedback",
  "surveyDescription": "Monthly customer satisfaction survey",
  "anonymous": true
};

response = invokeurl
[
  url: "https://survey.zoho.com/api/v2/surveys"
  type: POST
  parameters: surveyData.toString()
  connection: "zoho_survey"
];

surveyId = response.get("surveyId");
info "Created survey: " + surveyId;
```

### Get Survey Responses

```javascript
// Deluge Script
surveyId = "1234567890";

response = invokeurl
[
  url: "https://survey.zoho.com/api/v2/surveys/" + surveyId + "/responses?per_page=100"
  type: GET
  connection: "zoho_survey"
];

responses = response.get("responses");
for each resp in responses
{
  respondentEmail = resp.get("respondentEmail");
  answers = resp.get("answers");

  info "Response from: " + respondentEmail;
  for each answer in answers
  {
    info answer.get("questionText") + ": " + answer.get("answer");
  }
}
```

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 200 | Success | Request completed successfully |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Invalid or expired access token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Survey or resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error occurred |

**Error Response Format**:
```json
{
  "error": {
    "code": "INVALID_SURVEY_ID",
    "message": "The specified survey does not exist or has been deleted"
  }
}
```

---

## Best Practices

### 1. Survey Design
- Keep surveys concise (10-15 questions max)
- Use required fields sparingly
- Add progress indicators for long surveys
- Test survey logic before distribution

### 2. Response Management
- Implement pagination for large response sets
- Export responses regularly for backup
- Use filters to analyze specific segments

### 3. Performance Optimization
- Cache survey structure data
- Batch response retrievals
- Use webhooks for real-time notifications

---

## Data Centers

API endpoints vary by data center:

| Region | API Base URL |
|--------|-------------|
| US | `https://survey.zoho.com/api/v2/` |
| EU | `https://survey.zoho.eu/api/v2/` |
| IN | `https://survey.zoho.in/api/v2/` |
| AU | `https://survey.zoho.com.au/api/v2/` |

---

## Additional Resources

- **Official Documentation**: https://www.zoho.com/survey/help/api/
- **Developer Console**: https://api-console.zoho.com/
- **Community**: https://help.zoho.com/portal/en/community/zoho-survey
