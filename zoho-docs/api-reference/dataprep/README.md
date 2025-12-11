# Zoho DataPrep API Reference

## Overview

Zoho DataPrep is a self-service data preparation tool for cleaning, transforming, and enriching data. The REST API 2.0 provides programmatic access to ETL pipelines, data flows, jobs, and transformations.

**Current API Version**: 2.0
**Base URL**: `https://dataprep.zoho.com/api/v2/`
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
- `ZohoDataPrep.data.ALL` - Full data access
- `ZohoDataPrep.pipelines.ALL` - Manage pipelines
- `ZohoDataPrep.jobs.ALL` - Manage jobs

---

## Rate Limits

- **API Calls**: 10,000 calls per day
- **Burst Limit**: 120 calls per minute
- **Data Processing**: Based on plan

---

## API Modules

### 1. Datasets

**Endpoints**:
```http
GET    /api/v2/datasets              # List datasets
GET    /api/v2/datasets/{datasetId}  # Get dataset details
POST   /api/v2/datasets              # Import dataset
PUT    /api/v2/datasets/{datasetId}  # Update dataset
DELETE /api/v2/datasets/{datasetId}  # Delete dataset
```

**Example - Import Dataset**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const importDataset = async (accessToken, datasetData) => {
  const response = await axios.post(
    'https://dataprep.zoho.com/api/v2/datasets',
    {
      name: datasetData.name,
      sourceType: datasetData.sourceType,
      sourceConfig: {
        url: datasetData.url,
        format: datasetData.format,
        delimiter: datasetData.delimiter
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

// Import CSV from URL
const dataset = await importDataset(accessToken, {
  name: 'Sales Data Q1',
  sourceType: 'url',
  url: 'https://example.com/sales_data.csv',
  format: 'csv',
  delimiter: ','
});
```

**Response**:
```json
{
  "datasetId": "ds_123456",
  "name": "Sales Data Q1",
  "rowCount": 10000,
  "columnCount": 15,
  "size": 2048576,
  "status": "imported",
  "createdTime": "2025-01-15T10:30:00Z"
}
```

---

### 2. Pipelines

**Endpoints**:
```http
GET    /api/v2/pipelines              # List pipelines
GET    /api/v2/pipelines/{pipelineId} # Get pipeline details
POST   /api/v2/pipelines              # Create pipeline
PUT    /api/v2/pipelines/{pipelineId} # Update pipeline
DELETE /api/v2/pipelines/{pipelineId} # Delete pipeline
```

**Example - Create Pipeline**:
```python
# Python
import requests

def create_pipeline(access_token, pipeline_data):
    url = 'https://dataprep.zoho.com/api/v2/pipelines'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'name': pipeline_data['name'],
        'description': pipeline_data['description'],
        'sourceDatasetId': pipeline_data['source_dataset_id'],
        'transformations': pipeline_data['transformations'],
        'outputConfig': {
            'format': 'csv',
            'destination': 'zoho_analytics'
        }
    }

    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

---

### 3. Transformations

**Endpoints**:
```http
GET    /api/v2/pipelines/{pipelineId}/transformations              # List transformations
POST   /api/v2/pipelines/{pipelineId}/transformations              # Add transformation
PUT    /api/v2/pipelines/{pipelineId}/transformations/{transId}    # Update transformation
DELETE /api/v2/pipelines/{pipelineId}/transformations/{transId}    # Remove transformation
```

**Transformation Types**:
- `filter` - Filter rows
- `deduplicate` - Remove duplicates
- `merge` - Merge columns
- `split` - Split columns
- `replace` - Replace values
- `aggregate` - Aggregate data
- `join` - Join datasets
- `sort` - Sort data

**Example - Add Transformation**:
```javascript
// JavaScript/Node.js
const addTransformation = async (accessToken, pipelineId, transformation) => {
  const response = await axios.post(
    `https://dataprep.zoho.com/api/v2/pipelines/${pipelineId}/transformations`,
    {
      type: transformation.type,
      config: transformation.config,
      order: transformation.order
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

// Add filter transformation
await addTransformation(accessToken, pipelineId, {
  type: 'filter',
  config: {
    column: 'status',
    operator: 'equals',
    value: 'active'
  },
  order: 1
});

// Add deduplicate transformation
await addTransformation(accessToken, pipelineId, {
  type: 'deduplicate',
  config: {
    columns: ['email']
  },
  order: 2
});
```

---

### 4. Jobs

**Endpoints**:
```http
GET    /api/v2/jobs              # List jobs
GET    /api/v2/jobs/{jobId}      # Get job details
POST   /api/v2/jobs              # Run pipeline
DELETE /api/v2/jobs/{jobId}      # Cancel job
```

**Example - Run Pipeline**:
```python
# Python
def run_pipeline(access_token, pipeline_id, params=None):
    url = 'https://dataprep.zoho.com/api/v2/jobs'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'pipelineId': pipeline_id,
        'parameters': params or {}
    }

    response = requests.post(url, json=data, headers=headers)
    return response.json()

# Run pipeline
job = run_pipeline(access_token, 'pipeline_123')
# Returns: {"jobId": "job_456", "status": "running"}
```

**Example - Get Job Status**:
```javascript
// JavaScript/Node.js
const getJobStatus = async (accessToken, jobId) => {
  const response = await axios.get(
    `https://dataprep.zoho.com/api/v2/jobs/${jobId}`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

**Job Response**:
```json
{
  "jobId": "job_456",
  "pipelineId": "pipeline_123",
  "status": "completed",
  "startTime": "2025-01-15T10:30:00Z",
  "endTime": "2025-01-15T10:35:00Z",
  "duration": 300,
  "recordsProcessed": 10000,
  "recordsOutput": 8500,
  "errors": []
}
```

---

### 5. Data Quality

**Endpoints**:
```http
GET  /api/v2/datasets/{datasetId}/profile     # Get data profile
GET  /api/v2/datasets/{datasetId}/quality     # Get quality metrics
POST /api/v2/datasets/{datasetId}/validate    # Validate data
```

**Example - Get Data Profile**:
```javascript
// JavaScript/Node.js
const getDataProfile = async (accessToken, datasetId) => {
  const response = await axios.get(
    `https://dataprep.zoho.com/api/v2/datasets/${datasetId}/profile`,
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
  "datasetId": "ds_123456",
  "profile": {
    "totalRows": 10000,
    "totalColumns": 15,
    "nullValues": 250,
    "duplicates": 50,
    "columnStats": [
      {
        "columnName": "email",
        "dataType": "string",
        "uniqueValues": 9500,
        "nullCount": 100,
        "validEmailCount": 9400
      }
    ]
  }
}
```

---

### 6. Schedules

**Endpoints**:
```http
GET    /api/v2/schedules              # List schedules
POST   /api/v2/schedules              # Create schedule
PUT    /api/v2/schedules/{scheduleId} # Update schedule
DELETE /api/v2/schedules/{scheduleId} # Delete schedule
```

**Example - Schedule Pipeline**:
```python
# Python
def schedule_pipeline(access_token, schedule_data):
    url = 'https://dataprep.zoho.com/api/v2/schedules'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'pipelineId': schedule_data['pipeline_id'],
        'name': schedule_data['name'],
        'frequency': schedule_data['frequency'],
        'time': schedule_data['time'],
        'timezone': schedule_data['timezone'],
        'enabled': True
    }

    response = requests.post(url, json=data, headers=headers)
    return response.json()

# Schedule daily run
schedule_pipeline(access_token, {
    'pipeline_id': 'pipeline_123',
    'name': 'Daily ETL',
    'frequency': 'daily',
    'time': '02:00',
    'timezone': 'America/New_York'
})
```

---

## Common Operations

### 1. Complete ETL Workflow

```javascript
// JavaScript/Node.js
const runETLWorkflow = async (accessToken) => {
  // 1. Import dataset
  const dataset = await importDataset(accessToken, {
    name: 'Customer Data',
    sourceType: 'url',
    url: 'https://example.com/customers.csv',
    format: 'csv'
  });

  // 2. Create pipeline
  const pipeline = await createPipeline(accessToken, {
    name: 'Customer Cleanup',
    sourceDatasetId: dataset.datasetId,
    transformations: []
  });

  // 3. Add transformations
  await addTransformation(accessToken, pipeline.pipelineId, {
    type: 'deduplicate',
    config: { columns: ['email'] }
  });

  await addTransformation(accessToken, pipeline.pipelineId, {
    type: 'filter',
    config: { column: 'country', operator: 'equals', value: 'US' }
  });

  // 4. Run pipeline
  const job = await runPipeline(accessToken, pipeline.pipelineId);

  return job;
};
```

### 2. Monitor Job Progress

```python
# Python
import time

def monitor_job(access_token, job_id, poll_interval=5):
    while True:
        job = get_job_status(access_token, job_id)

        status = job['status']
        print(f"Job status: {status}")

        if status in ['completed', 'failed', 'cancelled']:
            return job

        time.sleep(poll_interval)
```

---

## Deluge Integration

```javascript
// Deluge Script
// Import and process data
datasetData = {
  "name": "CRM Export",
  "sourceType": "zoho_crm",
  "sourceConfig": {
    "module": "Contacts"
  }
};

// Import dataset
response = invokeurl
[
  url: "https://dataprep.zoho.com/api/v2/datasets"
  type: POST
  parameters: datasetData.toString()
  connection: "zoho_dataprep"
];

datasetId = response.get("datasetId");

// Create and run pipeline
pipelineData = {
  "name": "CRM Data Cleanup",
  "sourceDatasetId": datasetId,
  "transformations": [
    {
      "type": "deduplicate",
      "config": {"columns": ["Email"]}
    }
  ]
};

pipelineResponse = invokeurl
[
  url: "https://dataprep.zoho.com/api/v2/pipelines"
  type: POST
  parameters: pipelineData.toString()
  connection: "zoho_dataprep"
];

info "Pipeline created: " + pipelineResponse.get("pipelineId");
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
| 422 | Unprocessable Entity | Transformation error |
| 429 | Too Many Requests | Rate limit exceeded |

---

## Best Practices

### 1. Data Quality
- Profile data before transformations
- Validate after each step
- Monitor data quality metrics
- Handle null values appropriately

### 2. Pipeline Design
- Keep transformations modular
- Document transformation logic
- Test with sample data
- Version control pipelines

### 3. Performance
- Schedule jobs during off-peak hours
- Optimize transformation order
- Use incremental processing
- Monitor job execution times

---

## Data Centers

| Region | API Base URL |
|--------|-------------|
| US | `https://dataprep.zoho.com/api/v2/` |
| EU | `https://dataprep.zoho.eu/api/v2/` |
| IN | `https://dataprep.zoho.in/api/v2/` |

---

## Additional Resources

- **Official Documentation**: https://www.zoho.com/dataprep/help/api/
- **Developer Console**: https://api-console.zoho.com/
