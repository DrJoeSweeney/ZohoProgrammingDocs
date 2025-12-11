# Zoho Bookings API Reference

## Overview

Zoho Bookings is an appointment scheduling platform that enables businesses to manage bookings, services, staff, and calendar integrations. The API provides comprehensive access to appointments, services, staff management, availability, and customer interactions.

**Current API Version**: v1
**Base URL**: `https://bookings.zoho.com/api/v1/`
**Protocol**: REST
**Data Format**: JSON
**Authentication**: OAuth 2.0

---

## Quick Links

- [Authentication](#authentication)
- [Appointments API](#appointments-api)
- [Services API](#services-api)
- [Staff API](#staff-api)
- [Availability API](#availability-api)
- [Customers API](#customers-api)
- [Workspaces API](#workspaces-api)
- [Calendar Integration](#calendar-integration)
- [Webhooks](#webhooks)
- [Rate Limits](#rate-limits)
- [Error Codes](#error-codes)
- [Code Examples](#code-examples)
- [Best Practices](#best-practices)

---

## REST API Principles

### HTTP Methods

Zoho Bookings API follows standard REST conventions:

| Method | Purpose | Idempotent |
|--------|---------|------------|
| GET | Retrieve resources | Yes |
| POST | Create new resources | No |
| PUT | Update resources | Yes |
| PATCH | Partial update | No |
| DELETE | Remove resources | Yes |

### Request Format

```http
GET /api/v1/appointments
Host: bookings.zoho.com
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json
```

### Response Format

**Success Response**:
```json
{
  "status": "success",
  "data": {
    "appointment_id": "1234567890",
    "service_name": "Hair Cut",
    "start_time": "2025-12-20T14:00:00Z"
  }
}
```

**List Response**:
```json
{
  "status": "success",
  "data": [
    { "appointment_id": "1234567890", "service_name": "Hair Cut" },
    { "appointment_id": "1234567891", "service_name": "Consultation" }
  ],
  "pagination": {
    "page": 1,
    "per_page": 50,
    "total": 100,
    "has_more": true
  }
}
```

**Error Response**:
```json
{
  "status": "error",
  "error": {
    "code": "INVALID_APPOINTMENT",
    "message": "The specified appointment does not exist",
    "details": {
      "field": "appointment_id"
    }
  }
}
```

---

## Authentication

### OAuth 2.0 Flow

Zoho Bookings uses OAuth 2.0 for authentication. All API requests require a valid access token.

**Step 1: Register Your Application**
- Go to [Zoho API Console](https://api-console.zoho.com/)
- Create a new Client (Server-based or Self-client)
- Note your Client ID and Client Secret
- Set the authorized redirect URI

**Step 2: Generate Authorization Code**

```http
GET https://accounts.zoho.com/oauth/v2/auth?
  scope=ZohoBookings.appointments.ALL,ZohoBookings.services.READ,ZohoBookings.staff.ALL&
  client_id={client_id}&
  response_type=code&
  access_type=offline&
  redirect_uri={redirect_uri}
```

**Available Scopes**:
- `ZohoBookings.appointments.ALL` - Full access to appointments
- `ZohoBookings.appointments.CREATE` - Create appointments
- `ZohoBookings.appointments.READ` - Read appointments
- `ZohoBookings.appointments.UPDATE` - Update appointments
- `ZohoBookings.appointments.DELETE` - Delete appointments
- `ZohoBookings.services.ALL` - Full access to services
- `ZohoBookings.services.READ` - Read services
- `ZohoBookings.staff.ALL` - Full access to staff
- `ZohoBookings.staff.READ` - Read staff information
- `ZohoBookings.customers.ALL` - Full access to customers
- `ZohoBookings.availability.READ` - Read availability

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

---

## Appointments API

Manage customer appointments and bookings.

### Appointment Object Structure

```json
{
  "appointment_id": "1234567890",
  "workspace_id": "WS_9876543210",
  "service_id": "SVC_5432109876",
  "service_name": "Hair Cut and Style",
  "staff_id": "STAFF_1111111111",
  "staff_name": "Jane Smith",
  "customer_id": "CUST_2222222222",
  "customer_name": "John Doe",
  "customer_email": "john.doe@example.com",
  "customer_phone": "+1-555-0123",
  "start_time": "2025-12-20T14:00:00Z",
  "end_time": "2025-12-20T15:00:00Z",
  "duration": 60,
  "timezone": "America/New_York",
  "status": "confirmed",
  "booking_date": "2025-12-15T10:30:00Z",
  "notes": "Customer prefers window seat",
  "price": 75.00,
  "currency": "USD",
  "payment_status": "paid",
  "reminder_sent": true,
  "cancellation_reason": null,
  "created_time": "2025-12-15T10:30:00Z",
  "modified_time": "2025-12-18T09:00:00Z"
}
```

### List Appointments

```http
GET /api/v1/appointments
Authorization: Zoho-oauthtoken {access_token}
```

**Query Parameters**:
- `workspace_id` (string) - Filter by workspace
- `service_id` (string) - Filter by service
- `staff_id` (string) - Filter by staff
- `status` (string) - Filter: "confirmed", "cancelled", "completed", "no_show"
- `from_date` (string) - ISO 8601 date format
- `to_date` (string) - ISO 8601 date format
- `page` (integer) - Page number (default: 1)
- `per_page` (integer) - Results per page (max: 100, default: 50)

**Example**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const listAppointments = async (accessToken, filters = {}) => {
  const response = await axios.get(
    'https://bookings.zoho.com/api/v1/appointments',
    {
      params: {
        workspace_id: filters.workspaceId,
        status: filters.status || 'confirmed',
        from_date: filters.fromDate,
        to_date: filters.toDate,
        page: 1,
        per_page: 50
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

def list_appointments(access_token, filters=None):
    url = 'https://bookings.zoho.com/api/v1/appointments'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'page': 1,
        'per_page': 50
    }
    if filters:
        params.update(filters)
    response = requests.get(url, headers=headers, params=params)
    return response.json()
```

```deluge
// Deluge
response = invokeurl
[
    url: "https://bookings.zoho.com/api/v1/appointments"
    type: GET
    parameters: {"workspace_id": workspace_id, "status": "confirmed", "per_page": 50}
    headers: {"Authorization": "Zoho-oauthtoken " + access_token}
];
info response;
```

### Get Appointment by ID

```http
GET /api/v1/appointments/{appointment_id}
Authorization: Zoho-oauthtoken {access_token}
```

**Example**:
```javascript
const getAppointment = async (accessToken, appointmentId) => {
  const response = await axios.get(
    `https://bookings.zoho.com/api/v1/appointments/${appointmentId}`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

### Create Appointment

```http
POST /api/v1/appointments
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "workspace_id": "WS_9876543210",
  "service_id": "SVC_5432109876",
  "staff_id": "STAFF_1111111111",
  "start_time": "2025-12-20T14:00:00Z",
  "timezone": "America/New_York",
  "customer": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-0123"
  },
  "notes": "First time customer",
  "send_confirmation": true
}
```

**Example**:
```javascript
const createAppointment = async (accessToken, appointmentData) => {
  const response = await axios.post(
    'https://bookings.zoho.com/api/v1/appointments',
    appointmentData,
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
const newAppointment = {
  workspace_id: 'WS_9876543210',
  service_id: 'SVC_5432109876',
  staff_id: 'STAFF_1111111111',
  start_time: '2025-12-20T14:00:00Z',
  timezone: 'America/New_York',
  customer: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1-555-0123'
  },
  notes: 'First time customer',
  send_confirmation: true
};

const appointment = await createAppointment(accessToken, newAppointment);
console.log('Appointment ID:', appointment.data.appointment_id);
```

```python
def create_appointment(access_token, appointment_data):
    url = 'https://bookings.zoho.com/api/v1/appointments'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    response = requests.post(url, json=appointment_data, headers=headers)
    return response.json()

# Usage
new_appointment = {
    'workspace_id': 'WS_9876543210',
    'service_id': 'SVC_5432109876',
    'staff_id': 'STAFF_1111111111',
    'start_time': '2025-12-20T14:00:00Z',
    'timezone': 'America/New_York',
    'customer': {
        'name': 'John Doe',
        'email': 'john.doe@example.com',
        'phone': '+1-555-0123'
    },
    'send_confirmation': True
}

appointment = create_appointment(access_token, new_appointment)
print(f"Appointment ID: {appointment['data']['appointment_id']}")
```

```deluge
// Deluge
appointment_map = Map();
appointment_map.put("workspace_id", "WS_9876543210");
appointment_map.put("service_id", "SVC_5432109876");
appointment_map.put("staff_id", "STAFF_1111111111");
appointment_map.put("start_time", "2025-12-20T14:00:00Z");
appointment_map.put("timezone", "America/New_York");

customer_map = Map();
customer_map.put("name", "John Doe");
customer_map.put("email", "john.doe@example.com");
customer_map.put("phone", "+1-555-0123");
appointment_map.put("customer", customer_map);

appointment_map.put("send_confirmation", true);

response = invokeurl
[
    url: "https://bookings.zoho.com/api/v1/appointments"
    type: POST
    parameters: appointment_map.toString()
    headers: {"Authorization": "Zoho-oauthtoken " + access_token}
];
info response;
```

### Update Appointment

```http
PUT /api/v1/appointments/{appointment_id}
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "start_time": "2025-12-20T15:00:00Z",
  "staff_id": "STAFF_3333333333",
  "notes": "Updated: Customer requested time change"
}
```

**Example**:
```javascript
const updateAppointment = async (accessToken, appointmentId, updates) => {
  const response = await axios.put(
    `https://bookings.zoho.com/api/v1/appointments/${appointmentId}`,
    updates,
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
await updateAppointment(accessToken, '1234567890', {
  start_time: '2025-12-20T15:00:00Z',
  notes: 'Customer requested time change'
});
```

### Reschedule Appointment

```http
POST /api/v1/appointments/{appointment_id}/reschedule
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "start_time": "2025-12-21T14:00:00Z",
  "send_notification": true
}
```

**Example**:
```javascript
const rescheduleAppointment = async (accessToken, appointmentId, newStartTime) => {
  const response = await axios.post(
    `https://bookings.zoho.com/api/v1/appointments/${appointmentId}/reschedule`,
    {
      start_time: newStartTime,
      send_notification: true
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
def reschedule_appointment(access_token, appointment_id, new_start_time):
    url = f'https://bookings.zoho.com/api/v1/appointments/{appointment_id}/reschedule'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'start_time': new_start_time,
        'send_notification': True
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

### Cancel Appointment

```http
POST /api/v1/appointments/{appointment_id}/cancel
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "reason": "Customer requested cancellation",
  "send_notification": true
}
```

**Example**:
```javascript
const cancelAppointment = async (accessToken, appointmentId, reason) => {
  const response = await axios.post(
    `https://bookings.zoho.com/api/v1/appointments/${appointmentId}/cancel`,
    {
      reason,
      send_notification: true
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
def cancel_appointment(access_token, appointment_id, reason):
    url = f'https://bookings.zoho.com/api/v1/appointments/{appointment_id}/cancel'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'reason': reason,
        'send_notification': True
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

```deluge
// Deluge
cancel_map = Map();
cancel_map.put("reason", "Customer requested cancellation");
cancel_map.put("send_notification", true);

response = invokeurl
[
    url: "https://bookings.zoho.com/api/v1/appointments/" + appointment_id + "/cancel"
    type: POST
    parameters: cancel_map.toString()
    headers: {"Authorization": "Zoho-oauthtoken " + access_token}
];
info response;
```

### Mark Appointment as Completed

```http
POST /api/v1/appointments/{appointment_id}/complete
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "notes": "Service completed successfully"
}
```

### Mark Appointment as No-Show

```http
POST /api/v1/appointments/{appointment_id}/noshow
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "reason": "Customer did not arrive"
}
```

---

## Services API

Manage bookable services offered by your business.

### Service Object Structure

```json
{
  "service_id": "SVC_5432109876",
  "workspace_id": "WS_9876543210",
  "name": "Hair Cut and Style",
  "description": "Professional hair cutting and styling service",
  "duration": 60,
  "price": 75.00,
  "currency": "USD",
  "category": "Hair Services",
  "is_active": true,
  "booking_url": "https://bookings.zoho.com/portal/acmesalon/haircut",
  "staff_members": ["STAFF_1111111111", "STAFF_2222222222"],
  "buffer_time_before": 10,
  "buffer_time_after": 10,
  "max_bookings_per_day": 20,
  "advance_booking_days": 30,
  "cancellation_policy": "24 hours notice required",
  "created_time": "2025-01-01T10:00:00Z",
  "modified_time": "2025-12-10T15:00:00Z"
}
```

### List Services

```http
GET /api/v1/services
Authorization: Zoho-oauthtoken {access_token}
```

**Query Parameters**:
- `workspace_id` (string) - Filter by workspace
- `category` (string) - Filter by category
- `is_active` (boolean) - Filter active/inactive services
- `page` (integer) - Page number
- `per_page` (integer) - Results per page

**Example**:
```javascript
const listServices = async (accessToken, workspaceId) => {
  const response = await axios.get(
    'https://bookings.zoho.com/api/v1/services',
    {
      params: {
        workspace_id: workspaceId,
        is_active: true,
        per_page: 50
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
def list_services(access_token, workspace_id):
    url = 'https://bookings.zoho.com/api/v1/services'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'workspace_id': workspace_id,
        'is_active': True,
        'per_page': 50
    }
    response = requests.get(url, headers=headers, params=params)
    return response.json()
```

```deluge
// Deluge
response = invokeurl
[
    url: "https://bookings.zoho.com/api/v1/services"
    type: GET
    parameters: {"workspace_id": workspace_id, "is_active": true, "per_page": 50}
    headers: {"Authorization": "Zoho-oauthtoken " + access_token}
];
info response;
```

### Get Service by ID

```http
GET /api/v1/services/{service_id}
Authorization: Zoho-oauthtoken {access_token}
```

### Create Service

```http
POST /api/v1/services
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "workspace_id": "WS_9876543210",
  "name": "Deep Tissue Massage",
  "description": "60-minute deep tissue massage",
  "duration": 60,
  "price": 120.00,
  "currency": "USD",
  "category": "Massage",
  "staff_members": ["STAFF_1111111111"],
  "buffer_time_before": 15,
  "buffer_time_after": 15
}
```

**Example**:
```javascript
const createService = async (accessToken, serviceData) => {
  const response = await axios.post(
    'https://bookings.zoho.com/api/v1/services',
    serviceData,
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
const newService = {
  workspace_id: 'WS_9876543210',
  name: 'Deep Tissue Massage',
  description: '60-minute deep tissue massage',
  duration: 60,
  price: 120.00,
  currency: 'USD',
  category: 'Massage',
  staff_members: ['STAFF_1111111111']
};

const service = await createService(accessToken, newService);
```

```python
def create_service(access_token, service_data):
    url = 'https://bookings.zoho.com/api/v1/services'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    response = requests.post(url, json=service_data, headers=headers)
    return response.json()
```

### Update Service

```http
PUT /api/v1/services/{service_id}
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "price": 130.00,
  "description": "Updated: 60-minute deep tissue massage with aromatherapy"
}
```

### Delete Service

```http
DELETE /api/v1/services/{service_id}
Authorization: Zoho-oauthtoken {access_token}
```

---

## Staff API

Manage staff members who provide services.

### Staff Object Structure

```json
{
  "staff_id": "STAFF_1111111111",
  "workspace_id": "WS_9876543210",
  "name": "Jane Smith",
  "email": "jane.smith@acmesalon.com",
  "phone": "+1-555-0456",
  "role": "Senior Stylist",
  "bio": "10 years of experience in hair styling",
  "photo_url": "https://example.com/jane.jpg",
  "is_active": true,
  "services": ["SVC_5432109876", "SVC_5432109877"],
  "working_hours": {
    "monday": { "start": "09:00", "end": "17:00" },
    "tuesday": { "start": "09:00", "end": "17:00" },
    "wednesday": { "start": "09:00", "end": "17:00" },
    "thursday": { "start": "09:00", "end": "17:00" },
    "friday": { "start": "09:00", "end": "17:00" },
    "saturday": { "start": "10:00", "end": "14:00" },
    "sunday": null
  },
  "created_time": "2025-01-01T10:00:00Z"
}
```

### List Staff Members

```http
GET /api/v1/staff
Authorization: Zoho-oauthtoken {access_token}
```

**Query Parameters**:
- `workspace_id` (string) - Filter by workspace
- `service_id` (string) - Filter by service
- `is_active` (boolean) - Filter active/inactive staff

**Example**:
```javascript
const listStaff = async (accessToken, workspaceId) => {
  const response = await axios.get(
    'https://bookings.zoho.com/api/v1/staff',
    {
      params: {
        workspace_id: workspaceId,
        is_active: true
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
def list_staff(access_token, workspace_id):
    url = 'https://bookings.zoho.com/api/v1/staff'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'workspace_id': workspace_id,
        'is_active': True
    }
    response = requests.get(url, headers=headers, params=params)
    return response.json()
```

```deluge
// Deluge
response = invokeurl
[
    url: "https://bookings.zoho.com/api/v1/staff"
    type: GET
    parameters: {"workspace_id": workspace_id, "is_active": true}
    headers: {"Authorization": "Zoho-oauthtoken " + access_token}
];
info response;
```

### Get Staff by ID

```http
GET /api/v1/staff/{staff_id}
Authorization: Zoho-oauthtoken {access_token}
```

### Create Staff Member

```http
POST /api/v1/staff
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "workspace_id": "WS_9876543210",
  "name": "Mike Johnson",
  "email": "mike.johnson@acmesalon.com",
  "phone": "+1-555-0789",
  "role": "Massage Therapist",
  "services": ["SVC_5432109877"],
  "working_hours": {
    "monday": { "start": "10:00", "end": "18:00" },
    "tuesday": { "start": "10:00", "end": "18:00" },
    "wednesday": { "start": "10:00", "end": "18:00" },
    "thursday": { "start": "10:00", "end": "18:00" },
    "friday": { "start": "10:00", "end": "18:00" }
  }
}
```

**Example**:
```javascript
const createStaff = async (accessToken, staffData) => {
  const response = await axios.post(
    'https://bookings.zoho.com/api/v1/staff',
    staffData,
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
def create_staff(access_token, staff_data):
    url = 'https://bookings.zoho.com/api/v1/staff'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    response = requests.post(url, json=staff_data, headers=headers)
    return response.json()
```

### Update Staff Member

```http
PUT /api/v1/staff/{staff_id}
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "role": "Lead Massage Therapist",
  "bio": "15 years of experience in therapeutic massage"
}
```

### Delete Staff Member

```http
DELETE /api/v1/staff/{staff_id}
Authorization: Zoho-oauthtoken {access_token}
```

---

## Availability API

Check staff and service availability for booking.

### Get Service Availability

```http
GET /api/v1/availability/service/{service_id}
Authorization: Zoho-oauthtoken {access_token}
```

**Query Parameters**:
- `date` (string) - Date to check (YYYY-MM-DD)
- `staff_id` (string) - Optional: Check specific staff member
- `timezone` (string) - Timezone for availability

**Response**:
```json
{
  "status": "success",
  "data": {
    "service_id": "SVC_5432109876",
    "date": "2025-12-20",
    "available_slots": [
      {
        "start_time": "2025-12-20T09:00:00Z",
        "end_time": "2025-12-20T10:00:00Z",
        "staff_id": "STAFF_1111111111",
        "staff_name": "Jane Smith"
      },
      {
        "start_time": "2025-12-20T10:00:00Z",
        "end_time": "2025-12-20T11:00:00Z",
        "staff_id": "STAFF_1111111111",
        "staff_name": "Jane Smith"
      },
      {
        "start_time": "2025-12-20T14:00:00Z",
        "end_time": "2025-12-20T15:00:00Z",
        "staff_id": "STAFF_2222222222",
        "staff_name": "Mike Johnson"
      }
    ]
  }
}
```

**Example**:
```javascript
const getServiceAvailability = async (accessToken, serviceId, date, timezone = 'America/New_York') => {
  const response = await axios.get(
    `https://bookings.zoho.com/api/v1/availability/service/${serviceId}`,
    {
      params: {
        date,
        timezone
      },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};

// Usage
const availability = await getServiceAvailability(
  accessToken,
  'SVC_5432109876',
  '2025-12-20'
);

console.log('Available slots:', availability.data.available_slots.length);
```

```python
def get_service_availability(access_token, service_id, date, timezone='America/New_York'):
    url = f'https://bookings.zoho.com/api/v1/availability/service/{service_id}'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'date': date,
        'timezone': timezone
    }
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Usage
availability = get_service_availability(access_token, 'SVC_5432109876', '2025-12-20')
print(f"Available slots: {len(availability['data']['available_slots'])}")
```

```deluge
// Deluge
response = invokeurl
[
    url: "https://bookings.zoho.com/api/v1/availability/service/" + service_id
    type: GET
    parameters: {"date": "2025-12-20", "timezone": "America/New_York"}
    headers: {"Authorization": "Zoho-oauthtoken " + access_token}
];
info response;
```

### Get Staff Availability

```http
GET /api/v1/availability/staff/{staff_id}
Authorization: Zoho-oauthtoken {access_token}
```

**Query Parameters**:
- `date` (string) - Date to check (YYYY-MM-DD)
- `timezone` (string) - Timezone for availability

**Example**:
```javascript
const getStaffAvailability = async (accessToken, staffId, date) => {
  const response = await axios.get(
    `https://bookings.zoho.com/api/v1/availability/staff/${staffId}`,
    {
      params: {
        date,
        timezone: 'America/New_York'
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
def get_staff_availability(access_token, staff_id, date):
    url = f'https://bookings.zoho.com/api/v1/availability/staff/{staff_id}'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'date': date,
        'timezone': 'America/New_York'
    }
    response = requests.get(url, headers=headers, params=params)
    return response.json()
```

---

## Customers API

Manage customer information and booking history.

### Customer Object Structure

```json
{
  "customer_id": "CUST_2222222222",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1-555-0123",
  "notes": "Prefers afternoon appointments",
  "total_bookings": 15,
  "total_spent": 1125.00,
  "currency": "USD",
  "first_booking_date": "2024-06-15T14:00:00Z",
  "last_booking_date": "2025-12-05T15:00:00Z",
  "created_time": "2024-06-10T10:00:00Z",
  "modified_time": "2025-12-05T15:30:00Z"
}
```

### List Customers

```http
GET /api/v1/customers
Authorization: Zoho-oauthtoken {access_token}
```

**Query Parameters**:
- `workspace_id` (string) - Filter by workspace
- `page` (integer) - Page number
- `per_page` (integer) - Results per page
- `search` (string) - Search by name, email, or phone

**Example**:
```javascript
const listCustomers = async (accessToken, workspaceId, search = '') => {
  const response = await axios.get(
    'https://bookings.zoho.com/api/v1/customers',
    {
      params: {
        workspace_id: workspaceId,
        search,
        per_page: 50
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
def list_customers(access_token, workspace_id, search=''):
    url = 'https://bookings.zoho.com/api/v1/customers'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'workspace_id': workspace_id,
        'search': search,
        'per_page': 50
    }
    response = requests.get(url, headers=headers, params=params)
    return response.json()
```

### Get Customer by ID

```http
GET /api/v1/customers/{customer_id}
Authorization: Zoho-oauthtoken {access_token}
```

### Get Customer Booking History

```http
GET /api/v1/customers/{customer_id}/bookings
Authorization: Zoho-oauthtoken {access_token}
```

**Example**:
```javascript
const getCustomerBookings = async (accessToken, customerId) => {
  const response = await axios.get(
    `https://bookings.zoho.com/api/v1/customers/${customerId}/bookings`,
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

## Workspaces API

Manage workspaces (locations or business units).

### List Workspaces

```http
GET /api/v1/workspaces
Authorization: Zoho-oauthtoken {access_token}
```

**Example**:
```javascript
const listWorkspaces = async (accessToken) => {
  const response = await axios.get(
    'https://bookings.zoho.com/api/v1/workspaces',
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

```python
def list_workspaces(access_token):
    url = 'https://bookings.zoho.com/api/v1/workspaces'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    response = requests.get(url, headers=headers)
    return response.json()
```

```deluge
// Deluge
response = invokeurl
[
    url: "https://bookings.zoho.com/api/v1/workspaces"
    type: GET
    headers: {"Authorization": "Zoho-oauthtoken " + access_token}
];
info response;
```

---

## Calendar Integration

Integrate with external calendar systems.

### Sync Appointments to Calendar

```http
POST /api/v1/calendar/sync
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "calendar_type": "google",
  "appointment_ids": ["1234567890", "1234567891"]
}
```

---

## Webhooks

Set up real-time notifications for booking events.

### Webhook Events

**Available Events**:
- `appointment.created` - New appointment booked
- `appointment.updated` - Appointment modified
- `appointment.cancelled` - Appointment cancelled
- `appointment.completed` - Appointment marked as completed
- `appointment.noshow` - Appointment marked as no-show
- `appointment.rescheduled` - Appointment rescheduled

### Create Webhook

```http
POST /api/v1/webhooks
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

{
  "url": "https://yourdomain.com/webhook/zoho-bookings",
  "events": ["appointment.created", "appointment.cancelled"],
  "workspace_id": "WS_9876543210"
}
```

**Example**:
```javascript
const createWebhook = async (accessToken, webhookData) => {
  const response = await axios.post(
    'https://bookings.zoho.com/api/v1/webhooks',
    webhookData,
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
await createWebhook(accessToken, {
  url: 'https://yourdomain.com/webhook/zoho-bookings',
  events: ['appointment.created', 'appointment.cancelled'],
  workspace_id: 'WS_9876543210'
});
```

```python
def create_webhook(access_token, webhook_data):
    url = 'https://bookings.zoho.com/api/v1/webhooks'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    response = requests.post(url, json=webhook_data, headers=headers)
    return response.json()
```

### Webhook Payload Example

```json
{
  "event": "appointment.created",
  "timestamp": "2025-12-15T10:30:00Z",
  "workspace_id": "WS_9876543210",
  "data": {
    "appointment_id": "1234567890",
    "service_name": "Hair Cut and Style",
    "staff_name": "Jane Smith",
    "customer_name": "John Doe",
    "customer_email": "john.doe@example.com",
    "start_time": "2025-12-20T14:00:00Z",
    "end_time": "2025-12-20T15:00:00Z",
    "status": "confirmed"
  }
}
```

### Handle Webhook in Your Application

```javascript
// Express.js webhook handler
const express = require('express');
const app = express();

app.post('/webhook/zoho-bookings', express.json(), (req, res) => {
  const { event, data } = req.body;

  switch(event) {
    case 'appointment.created':
      console.log('New appointment:', data.appointment_id);
      console.log('Customer:', data.customer_name);
      // Send confirmation SMS or email
      break;

    case 'appointment.cancelled':
      console.log('Appointment cancelled:', data.appointment_id);
      // Update availability
      break;

    case 'appointment.rescheduled':
      console.log('Appointment rescheduled:', data.appointment_id);
      // Send updated confirmation
      break;
  }

  res.status(200).json({ received: true });
});
```

```python
# Flask webhook handler
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/webhook/zoho-bookings', methods=['POST'])
def handle_webhook():
    data = request.json
    event = data.get('event')
    payload = data.get('data')

    if event == 'appointment.created':
        print(f"New appointment: {payload.get('appointment_id')}")
        print(f"Customer: {payload.get('customer_name')}")
        # Send confirmation

    elif event == 'appointment.cancelled':
        print(f"Appointment cancelled: {payload.get('appointment_id')}")
        # Update availability

    return jsonify({'received': True}), 200
```

---

## Rate Limits

### API Call Limits

Zoho Bookings enforces rate limits:

| Plan | API Calls per Minute | API Calls per Day |
|------|---------------------|-------------------|
| Free | 20 | 1,000 |
| Basic | 60 | 5,000 |
| Premium | 120 | 25,000 |
| Enterprise | 300 | 100,000 |

### Rate Limit Headers

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1702396800
```

---

## Error Codes

### HTTP Status Codes

| Status Code | Meaning | Common Causes |
|-------------|---------|---------------|
| 200 | OK | Successful request |
| 201 | Created | Appointment created |
| 204 | No Content | Successful deletion |
| 400 | Bad Request | Invalid parameters |
| 401 | Unauthorized | Invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Time slot already booked |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Common Error Codes

| Error Code | Description | Solution |
|------------|-------------|----------|
| INVALID_TOKEN | Token invalid or expired | Refresh access token |
| INVALID_APPOINTMENT | Appointment ID does not exist | Verify appointment ID |
| TIME_SLOT_UNAVAILABLE | Requested time slot is not available | Check availability first |
| STAFF_UNAVAILABLE | Staff member not available | Select different staff or time |
| INVALID_DATE_FORMAT | Date format is incorrect | Use ISO 8601 format |
| DUPLICATE_BOOKING | Customer already has booking at this time | Choose different time |
| PAST_DATE_BOOKING | Cannot book in the past | Use future date |

---

## Code Examples

### Complete Booking Workflow

```javascript
// Complete workflow: Check availability, create appointment
const completeBookingWorkflow = async (accessToken, workspaceId) => {
  try {
    // Step 1: List available services
    const services = await listServices(accessToken, workspaceId);
    const service = services.data[0];
    console.log('Service:', service.name);

    // Step 2: Check availability
    const availability = await getServiceAvailability(
      accessToken,
      service.service_id,
      '2025-12-20'
    );

    if (availability.data.available_slots.length === 0) {
      console.log('No available slots');
      return;
    }

    const slot = availability.data.available_slots[0];
    console.log('Available slot:', slot.start_time);

    // Step 3: Create appointment
    const appointment = await createAppointment(accessToken, {
      workspace_id: workspaceId,
      service_id: service.service_id,
      staff_id: slot.staff_id,
      start_time: slot.start_time,
      timezone: 'America/New_York',
      customer: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1-555-0123'
      },
      send_confirmation: true
    });

    console.log('Appointment created:', appointment.data.appointment_id);
    console.log('Workflow completed successfully');

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};
```

### Booking Analytics

```python
import requests
from datetime import datetime, timedelta
from collections import defaultdict

class BookingAnalytics:
    def __init__(self, access_token):
        self.access_token = access_token
        self.base_url = 'https://bookings.zoho.com/api/v1'

    def get_booking_stats(self, workspace_id, days=30):
        """Get booking statistics"""

        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)

        # Fetch appointments
        url = f'{self.base_url}/appointments'
        headers = {
            'Authorization': f'Zoho-oauthtoken {self.access_token}'
        }
        params = {
            'workspace_id': workspace_id,
            'from_date': start_date.isoformat(),
            'to_date': end_date.isoformat(),
            'per_page': 100
        }

        all_appointments = []
        page = 1

        while True:
            params['page'] = page
            response = requests.get(url, headers=headers, params=params)
            data = response.json()

            if 'data' not in data or len(data['data']) == 0:
                break

            all_appointments.extend(data['data'])

            if not data.get('pagination', {}).get('has_more'):
                break

            page += 1

        # Calculate statistics
        stats = {
            'total_appointments': len(all_appointments),
            'by_status': defaultdict(int),
            'by_service': defaultdict(int),
            'total_revenue': 0,
            'avg_appointment_value': 0,
            'no_show_rate': 0
        }

        for appt in all_appointments:
            stats['by_status'][appt['status']] += 1
            stats['by_service'][appt['service_name']] += 1
            stats['total_revenue'] += appt.get('price', 0)

        if stats['total_appointments'] > 0:
            stats['avg_appointment_value'] = stats['total_revenue'] / stats['total_appointments']
            no_shows = stats['by_status'].get('no_show', 0)
            stats['no_show_rate'] = (no_shows / stats['total_appointments']) * 100

        return stats

# Usage
analytics = BookingAnalytics(access_token)
stats = analytics.get_booking_stats('WS_9876543210', days=30)

print(f"Total Appointments: {stats['total_appointments']}")
print(f"Total Revenue: ${stats['total_revenue']:.2f}")
print(f"Average Appointment Value: ${stats['avg_appointment_value']:.2f}")
print(f"No-Show Rate: {stats['no_show_rate']:.1f}%")
```

---

## Best Practices

### 1. Availability Checking

Always check availability before creating appointments:

```javascript
// Good - Check availability first
const availability = await getServiceAvailability(accessToken, serviceId, date);
if (availability.data.available_slots.length > 0) {
  await createAppointment(accessToken, appointmentData);
}

// Bad - Create without checking
await createAppointment(accessToken, appointmentData);  // May fail
```

### 2. Time Zone Handling

Always specify time zones:

```javascript
const appointment = {
  start_time: '2025-12-20T14:00:00Z',
  timezone: 'America/New_York',  // Always specify
  duration: 60
};
```

### 3. Error Handling

```javascript
const safeCreateAppointment = async (accessToken, appointmentData) => {
  try {
    return await createAppointment(accessToken, appointmentData);
  } catch (error) {
    if (error.response?.data?.error?.code === 'TIME_SLOT_UNAVAILABLE') {
      throw new Error('Time slot is no longer available');
    }
    throw error;
  }
};
```

---

## Data Centers

Zoho Bookings operates in multiple data centers:

| Data Center | Base URL |
|-------------|----------|
| US | https://bookings.zoho.com |
| EU | https://bookings.zoho.eu |
| IN | https://bookings.zoho.in |
| AU | https://bookings.zoho.com.au |

---

## Additional Resources

- [Official Zoho Bookings API Documentation](https://www.zoho.com/bookings/api/)
- [Zoho API Console](https://api-console.zoho.com/)
- [Developer Community](https://help.zoho.com/portal/en/community/bookings)
- [Status Page](https://status.zoho.com/)

---

**Last Updated**: December 2025
**API Version**: v1
