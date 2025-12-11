# Zoho IoT API Reference

## Overview

Zoho IoT is an Internet of Things platform for connecting, managing, and monitoring IoT devices. The API provides programmatic access to device management, data streams, alerts, and analytics.

**Current API Version**: v1
**Base URL**: `https://iot.zoho.com/api/v1/`
**Protocol**: REST/MQTT
**Data Format**: JSON
**Authentication**: OAuth 2.0 / API Key

---

## Quick Links

- [Authentication](#authentication)
- [Rate Limits](#rate-limits)
- [API Modules](#api-modules)
- [MQTT Integration](#mqtt-integration)
- [Common Operations](#common-operations)
- [Error Codes](#error-codes)

---

## Authentication

### OAuth 2.0 Setup

**Required Scopes**:
- `ZohoIoT.devices.ALL` - Manage devices
- `ZohoIoT.data.ALL` - Access data streams
- `ZohoIoT.alerts.ALL` - Manage alerts

---

## Rate Limits

- **API Calls**: 10,000 calls per day
- **Data Points**: 1M data points per day (based on plan)
- **Burst Limit**: 100 calls per minute

---

## API Modules

### 1. Devices

**Endpoints**:
```http
GET    /api/v1/devices              # List devices
GET    /api/v1/devices/{deviceId}   # Get device details
POST   /api/v1/devices              # Register device
PUT    /api/v1/devices/{deviceId}   # Update device
DELETE /api/v1/devices/{deviceId}   # Remove device
```

**Example - Register Device**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const registerDevice = async (accessToken, deviceData) => {
  const response = await axios.post(
    'https://iot.zoho.com/api/v1/devices',
    {
      deviceId: deviceData.deviceId,
      deviceName: deviceData.name,
      deviceType: deviceData.type,
      location: deviceData.location,
      metadata: {
        manufacturer: deviceData.manufacturer,
        model: deviceData.model,
        firmwareVersion: deviceData.firmwareVersion
      },
      dataPoints: deviceData.dataPoints
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

// Register temperature sensor
const device = await registerDevice(accessToken, {
  deviceId: 'TEMP_SENSOR_001',
  name: 'Warehouse Temperature Sensor',
  type: 'temperature_sensor',
  location: 'Warehouse A',
  manufacturer: 'SensorCo',
  model: 'TS-2000',
  firmwareVersion: '2.1.0',
  dataPoints: ['temperature', 'humidity', 'battery']
});
```

**Response**:
```json
{
  "deviceId": "TEMP_SENSOR_001",
  "deviceName": "Warehouse Temperature Sensor",
  "deviceType": "temperature_sensor",
  "status": "active",
  "registeredTime": "2025-01-15T10:30:00Z",
  "lastSeen": null,
  "apiKey": "device_api_key_abc123"
}
```

---

### 2. Data Streams

**Endpoints**:
```http
POST /api/v1/devices/{deviceId}/data     # Send data
GET  /api/v1/devices/{deviceId}/data     # Get data history
GET  /api/v1/devices/{deviceId}/data/latest # Get latest data
```

**Example - Send Device Data**:
```python
# Python
import requests

def send_device_data(api_key, device_id, data_points):
    url = f'https://iot.zoho.com/api/v1/devices/{device_id}/data'
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    data = {
        'timestamp': '2025-01-15T10:30:00Z',
        'dataPoints': data_points
    }

    response = requests.post(url, json=data, headers=headers)
    return response.json()

# Send sensor readings
send_device_data(device_api_key, 'TEMP_SENSOR_001', {
    'temperature': 22.5,
    'humidity': 65.2,
    'battery': 87
})
```

**Example - Get Data History**:
```javascript
// JavaScript/Node.js
const getDeviceData = async (accessToken, deviceId, options) => {
  const response = await axios.get(
    `https://iot.zoho.com/api/v1/devices/${deviceId}/data`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      },
      params: {
        from: options.from,
        to: options.to,
        dataPoint: options.dataPoint,
        aggregation: options.aggregation || 'raw'
      }
    }
  );
  return response.data;
};

// Get last 24 hours of temperature data
const data = await getDeviceData(accessToken, 'TEMP_SENSOR_001', {
  from: '2025-01-14T10:00:00Z',
  to: '2025-01-15T10:00:00Z',
  dataPoint: 'temperature',
  aggregation: 'avg'
});
```

**Response**:
```json
{
  "deviceId": "TEMP_SENSOR_001",
  "dataPoint": "temperature",
  "aggregation": "avg",
  "data": [
    {
      "timestamp": "2025-01-14T10:00:00Z",
      "value": 22.1
    },
    {
      "timestamp": "2025-01-14T11:00:00Z",
      "value": 22.8
    }
  ]
}
```

---

### 3. Alerts

**Endpoints**:
```http
GET    /api/v1/alerts              # List alerts
POST   /api/v1/alerts              # Create alert rule
PUT    /api/v1/alerts/{alertId}    # Update alert
DELETE /api/v1/alerts/{alertId}    # Delete alert
GET    /api/v1/alerts/history      # Get alert history
```

**Example - Create Alert Rule**:
```javascript
// JavaScript/Node.js
const createAlert = async (accessToken, alertData) => {
  const response = await axios.post(
    'https://iot.zoho.com/api/v1/alerts',
    {
      name: alertData.name,
      deviceId: alertData.deviceId,
      dataPoint: alertData.dataPoint,
      condition: {
        operator: alertData.operator,
        threshold: alertData.threshold
      },
      actions: alertData.actions,
      enabled: true
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

// Create high temperature alert
await createAlert(accessToken, {
  name: 'High Temperature Alert',
  deviceId: 'TEMP_SENSOR_001',
  dataPoint: 'temperature',
  operator: 'greater_than',
  threshold: 30,
  actions: [
    {
      type: 'email',
      recipients: ['admin@company.com']
    },
    {
      type: 'webhook',
      url: 'https://myapp.com/api/alerts'
    }
  ]
});
```

---

### 4. Device Groups

**Endpoints**:
```http
GET    /api/v1/groups              # List groups
POST   /api/v1/groups              # Create group
POST   /api/v1/groups/{groupId}/devices # Add devices to group
DELETE /api/v1/groups/{groupId}/devices/{deviceId} # Remove device
```

**Example - Create Device Group**:
```python
# Python
def create_device_group(access_token, group_data):
    url = 'https://iot.zoho.com/api/v1/groups'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'name': group_data['name'],
        'description': group_data['description'],
        'deviceIds': group_data['device_ids']
    }

    response = requests.post(url, json=data, headers=headers)
    return response.json()

# Create warehouse sensors group
create_device_group(access_token, {
    'name': 'Warehouse Sensors',
    'description': 'All sensors in Warehouse A',
    'device_ids': ['TEMP_SENSOR_001', 'TEMP_SENSOR_002']
})
```

---

### 5. Commands

**Endpoints**:
```http
POST /api/v1/devices/{deviceId}/commands     # Send command
GET  /api/v1/devices/{deviceId}/commands     # Get command history
```

**Example - Send Command to Device**:
```javascript
// JavaScript/Node.js
const sendCommand = async (accessToken, deviceId, command) => {
  const response = await axios.post(
    `https://iot.zoho.com/api/v1/devices/${deviceId}/commands`,
    {
      command: command.name,
      parameters: command.parameters
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

// Send reboot command
await sendCommand(accessToken, 'TEMP_SENSOR_001', {
  name: 'reboot',
  parameters: {}
});
```

---

## MQTT Integration

### MQTT Connection

**MQTT Broker**:
```
mqtts://mqtt.zoho.com:8883
```

**Client Authentication**:
- Username: `{deviceId}`
- Password: `{device_api_key}`

**Example - Connect and Publish**:
```javascript
// JavaScript/Node.js with MQTT.js
const mqtt = require('mqtt');

const connectMQTT = (deviceId, apiKey) => {
  const client = mqtt.connect('mqtts://mqtt.zoho.com:8883', {
    username: deviceId,
    password: apiKey,
    clientId: deviceId
  });

  client.on('connect', () => {
    console.log('Connected to Zoho IoT MQTT broker');

    // Publish data
    const topic = `devices/${deviceId}/data`;
    const payload = JSON.stringify({
      temperature: 22.5,
      humidity: 65.2,
      timestamp: new Date().toISOString()
    });

    client.publish(topic, payload);
  });

  // Subscribe to commands
  client.subscribe(`devices/${deviceId}/commands`);

  client.on('message', (topic, message) => {
    console.log('Received command:', message.toString());
  });

  return client;
};
```

---

## Deluge Integration

```javascript
// Deluge Script
deviceData = {
  "deviceId": "DEVICE_" + zoho.currenttime.toString("yyyyMMddHHmmss"),
  "deviceName": "New Sensor",
  "deviceType": "temperature_sensor",
  "location": "Office",
  "dataPoints": ["temperature", "humidity"]
};

response = invokeurl
[
  url: "https://iot.zoho.com/api/v1/devices"
  type: POST
  parameters: deviceData.toString()
  connection: "zoho_iot"
];

deviceId = response.get("deviceId");
apiKey = response.get("apiKey");

info "Device registered: " + deviceId;
```

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 200 | Success | Request completed |
| 201 | Created | Device/resource created |
| 400 | Bad Request | Invalid parameters |
| 401 | Unauthorized | Invalid credentials |
| 404 | Not Found | Device not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 507 | Insufficient Storage | Data quota exceeded |

---

## Best Practices

### 1. Device Management
- Use meaningful device IDs
- Keep firmware updated
- Monitor device health
- Implement reconnection logic

### 2. Data Transmission
- Batch data when possible
- Use appropriate sampling rates
- Compress data for bandwidth
- Handle offline scenarios

### 3. Security
- Rotate API keys regularly
- Use TLS/SSL for connections
- Implement access controls
- Monitor for anomalies

---

## Data Centers

| Region | API Base URL |
|--------|-------------|
| US | `https://iot.zoho.com/api/v1/` |
| EU | `https://iot.zoho.eu/api/v1/` |
| IN | `https://iot.zoho.in/api/v1/` |

---

## Additional Resources

- **Official Documentation**: https://www.zoho.com/iot/help/api/
- **Developer Console**: https://api-console.zoho.com/
- **MQTT Guide**: https://www.zoho.com/iot/help/mqtt/
