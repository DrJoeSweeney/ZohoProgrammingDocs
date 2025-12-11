# Zoho Backstage API Reference

## Overview

Zoho Backstage is a comprehensive event management platform that enables organizations to plan, manage, and execute successful events. The API provides programmatic access to event creation, registration management, ticketing, check-ins, and analytics.

**Current API Version**: v1
**Base URL**: `https://www.zohoapis.com/backstage/v1/`
**Protocol**: REST
**Data Format**: JSON
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

### 1. Events

**Purpose**: Create and manage events

**Endpoints**:
```http
GET    /backstage/v1/portal/{portal_id}/events          # List all events
GET    /backstage/v1/portal/{portal_id}/events/{event_id} # Get event details
POST   /backstage/v1/portal/{portal_id}/events          # Create event
PUT    /backstage/v1/portal/{portal_id}/events/{event_id} # Update event
DELETE /backstage/v1/portal/{portal_id}/events/{event_id} # Delete event
POST   /backstage/v1/portal/{portal_id}/events/{event_id}/publish # Publish event
POST   /backstage/v1/portal/{portal_id}/events/{event_id}/unpublish # Unpublish event
```

**Event Types**:
- Conference
- Trade Show
- Workshop
- Seminar
- Meetup
- Webinar
- Hybrid (In-person + Virtual)

**Example - Create Event**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const createEvent = async (accessToken, portalId, eventData) => {
  const response = await axios.post(
    `https://www.zohoapis.com/backstage/v1/portal/${portalId}/events`,
    eventData,
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
const event = {
  name: 'Tech Summit 2025',
  tagline: 'The Future of Technology',
  description: 'Join us for three days of innovation, networking, and learning from industry leaders.',
  type: 'conference',
  format: 'hybrid',  // in-person, virtual, or hybrid
  start_date: '2025-06-15T09:00:00Z',
  end_date: '2025-06-17T18:00:00Z',
  timezone: 'America/New_York',
  venue: {
    name: 'Grand Convention Center',
    address: '123 Conference Way',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'USA',
    capacity: 5000
  },
  virtual_venue: {
    platform: 'Zoom',
    meeting_url: 'https://zoom.us/j/123456789'
  },
  website: 'https://techsummit2025.com',
  social_media: {
    twitter: '@techsummit',
    facebook: 'techsummit2025',
    linkedin: 'company/techsummit'
  },
  branding: {
    logo_url: 'https://example.com/logo.png',
    banner_url: 'https://example.com/banner.jpg',
    primary_color: '#0066cc',
    secondary_color: '#ff6600'
  },
  registration_settings: {
    open_date: '2025-01-15T00:00:00Z',
    close_date: '2025-06-14T23:59:59Z',
    approval_required: false,
    waitlist_enabled: true
  }
};

const result = await createEvent(accessToken, portalId, event);
console.log('Event created:', result);
```

```python
# Python
import requests

def create_event(access_token, portal_id, event_data):
    url = f'https://www.zohoapis.com/backstage/v1/portal/{portal_id}/events'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    response = requests.post(url, json=event_data, headers=headers)
    return response.json()

# Usage
event = {
    'name': 'Tech Summit 2025',
    'tagline': 'The Future of Technology',
    'description': 'Join us for three days of innovation and learning.',
    'type': 'conference',
    'format': 'hybrid',
    'start_date': '2025-06-15T09:00:00Z',
    'end_date': '2025-06-17T18:00:00Z',
    'timezone': 'America/New_York',
    'venue': {
        'name': 'Grand Convention Center',
        'address': '123 Conference Way',
        'city': 'New York',
        'state': 'NY',
        'zip': '10001',
        'country': 'USA',
        'capacity': 5000
    }
}

result = create_event(access_token, portal_id, event)
print('Event created:', result)
```

```deluge
// Deluge
portal_id = "123456000000012345";

event_data = {
    "name": "Tech Summit 2025",
    "tagline": "The Future of Technology",
    "description": "Join us for three days of innovation and learning.",
    "type": "conference",
    "format": "hybrid",
    "start_date": "2025-06-15T09:00:00Z",
    "end_date": "2025-06-17T18:00:00Z",
    "timezone": "America/New_York",
    "venue": {
        "name": "Grand Convention Center",
        "address": "123 Conference Way",
        "city": "New York",
        "state": "NY",
        "zip": "10001",
        "country": "USA",
        "capacity": 5000
    }
};

response = invokeurl
[
    url: "https://www.zohoapis.com/backstage/v1/portal/" + portal_id + "/events"
    type: POST
    parameters: event_data.toString()
    connection: "backstage_connection"
];

info response;
```

**Response**:
```json
{
  "status": "success",
  "code": 201,
  "data": {
    "event_id": "123456000000234567",
    "name": "Tech Summit 2025",
    "slug": "tech-summit-2025",
    "status": "draft",
    "start_date": "2025-06-15T09:00:00Z",
    "end_date": "2025-06-17T18:00:00Z",
    "created_time": "2025-01-15T10:30:00Z",
    "event_url": "https://backstage.zoho.com/techsummit/events/tech-summit-2025"
  }
}
```

---

### 2. Registrations

**Purpose**: Manage event registrations and attendees

**Endpoints**:
```http
GET    /backstage/v1/portal/{portal_id}/events/{event_id}/registrations # List registrations
GET    /backstage/v1/portal/{portal_id}/events/{event_id}/registrations/{reg_id} # Get registration
POST   /backstage/v1/portal/{portal_id}/events/{event_id}/registrations # Create registration
PUT    /backstage/v1/portal/{portal_id}/events/{event_id}/registrations/{reg_id} # Update registration
DELETE /backstage/v1/portal/{portal_id}/events/{event_id}/registrations/{reg_id} # Cancel registration
POST   /backstage/v1/portal/{portal_id}/events/{event_id}/registrations/{reg_id}/approve # Approve
POST   /backstage/v1/portal/{portal_id}/events/{event_id}/registrations/{reg_id}/reject # Reject
POST   /backstage/v1/portal/{portal_id}/events/{event_id}/registrations/{reg_id}/resend # Resend confirmation
```

**Registration Status**:
- pending
- approved
- rejected
- cancelled
- waitlist
- checked_in

**Example - Create Registration**:
```javascript
// JavaScript/Node.js
const createRegistration = async (accessToken, portalId, eventId, registrationData) => {
  const response = await axios.post(
    `https://www.zohoapis.com/backstage/v1/portal/${portalId}/events/${eventId}/registrations`,
    registrationData,
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
const registration = {
  attendee: {
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane.smith@example.com',
    phone: '555-9876',
    company: 'Tech Innovations Inc',
    job_title: 'CTO',
    country: 'USA',
    state: 'California',
    city: 'San Francisco'
  },
  ticket_id: '123456000000345678',
  quantity: 1,
  custom_fields: {
    dietary_restrictions: 'Vegetarian',
    t_shirt_size: 'M',
    interests: ['AI', 'Cloud Computing', 'DevOps']
  },
  payment: {
    method: 'credit_card',
    transaction_id: 'TXN123456789',
    amount: 299.00,
    currency: 'USD'
  }
};

const result = await createRegistration(accessToken, portalId, eventId, registration);
console.log('Registration created:', result);
```

```python
# Python
def create_registration(access_token, portal_id, event_id, registration_data):
    url = f'https://www.zohoapis.com/backstage/v1/portal/{portal_id}/events/{event_id}/registrations'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    response = requests.post(url, json=registration_data, headers=headers)
    return response.json()

# Usage
registration = {
    'attendee': {
        'first_name': 'Jane',
        'last_name': 'Smith',
        'email': 'jane.smith@example.com',
        'phone': '555-9876',
        'company': 'Tech Innovations Inc',
        'job_title': 'CTO'
    },
    'ticket_id': '123456000000345678',
    'quantity': 1,
    'custom_fields': {
        'dietary_restrictions': 'Vegetarian',
        't_shirt_size': 'M'
    }
}

result = create_registration(access_token, portal_id, event_id, registration)
print('Registration created:', result)
```

**Response**:
```json
{
  "status": "success",
  "code": 201,
  "data": {
    "registration_id": "123456000000456789",
    "registration_number": "REG-2025-001234",
    "status": "approved",
    "attendee": {
      "first_name": "Jane",
      "last_name": "Smith",
      "email": "jane.smith@example.com"
    },
    "ticket": {
      "ticket_id": "123456000000345678",
      "ticket_name": "General Admission",
      "price": 299.00
    },
    "created_time": "2025-01-15T10:30:00Z",
    "confirmation_sent": true
  }
}
```

---

### 3. Tickets

**Purpose**: Manage ticket types and pricing

**Endpoints**:
```http
GET    /backstage/v1/portal/{portal_id}/events/{event_id}/tickets # List tickets
GET    /backstage/v1/portal/{portal_id}/events/{event_id}/tickets/{ticket_id} # Get ticket
POST   /backstage/v1/portal/{portal_id}/events/{event_id}/tickets # Create ticket
PUT    /backstage/v1/portal/{portal_id}/events/{event_id}/tickets/{ticket_id} # Update ticket
DELETE /backstage/v1/portal/{portal_id}/events/{event_id}/tickets/{ticket_id} # Delete ticket
```

**Ticket Types**:
- Free
- Paid
- Donation
- Tiered Pricing

**Example - Create Ticket Types**:
```javascript
// JavaScript/Node.js
const createTicket = async (accessToken, portalId, eventId, ticketData) => {
  const response = await axios.post(
    `https://www.zohoapis.com/backstage/v1/portal/${portalId}/events/${eventId}/tickets`,
    ticketData,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

// Usage - Create multiple ticket tiers
const tickets = [
  {
    name: 'Early Bird',
    description: 'Limited time early bird pricing',
    type: 'paid',
    price: 199.00,
    currency: 'USD',
    quantity: 100,
    sales_start: '2025-01-15T00:00:00Z',
    sales_end: '2025-03-31T23:59:59Z',
    visibility: 'public'
  },
  {
    name: 'General Admission',
    description: 'Standard conference pass',
    type: 'paid',
    price: 299.00,
    currency: 'USD',
    quantity: 500,
    sales_start: '2025-04-01T00:00:00Z',
    sales_end: '2025-06-14T23:59:59Z',
    visibility: 'public'
  },
  {
    name: 'VIP Pass',
    description: 'Includes exclusive networking events and premium seating',
    type: 'paid',
    price: 599.00,
    currency: 'USD',
    quantity: 50,
    sales_start: '2025-01-15T00:00:00Z',
    sales_end: '2025-06-14T23:59:59Z',
    visibility: 'public',
    perks: [
      'Priority seating',
      'VIP networking lounge access',
      'Exclusive speaker meet-and-greet',
      'Premium swag bag'
    ]
  },
  {
    name: 'Student/Non-Profit',
    description: 'Discounted rate for students and non-profit organizations',
    type: 'paid',
    price: 99.00,
    currency: 'USD',
    quantity: 200,
    sales_start: '2025-01-15T00:00:00Z',
    sales_end: '2025-06-14T23:59:59Z',
    visibility: 'public',
    requires_approval: true
  }
];

for (const ticket of tickets) {
  const result = await createTicket(accessToken, portalId, eventId, ticket);
  console.log(`Created ticket: ${ticket.name}`);
}
```

---

### 4. Sessions (Agenda)

**Purpose**: Manage event sessions and agenda

**Endpoints**:
```http
GET    /backstage/v1/portal/{portal_id}/events/{event_id}/sessions # List sessions
GET    /backstage/v1/portal/{portal_id}/events/{event_id}/sessions/{session_id} # Get session
POST   /backstage/v1/portal/{portal_id}/events/{event_id}/sessions # Create session
PUT    /backstage/v1/portal/{portal_id}/events/{event_id}/sessions/{session_id} # Update session
DELETE /backstage/v1/portal/{portal_id}/events/{event_id}/sessions/{session_id} # Delete session
```

**Session Types**:
- Keynote
- Workshop
- Panel Discussion
- Networking
- Break
- Meal
- Custom

**Example - Create Event Agenda**:
```javascript
// JavaScript/Node.js
const createSession = async (accessToken, portalId, eventId, sessionData) => {
  const response = await axios.post(
    `https://www.zohoapis.com/backstage/v1/portal/${portalId}/events/${eventId}/sessions`,
    sessionData,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

// Usage - Create day 1 agenda
const day1Sessions = [
  {
    name: 'Registration & Breakfast',
    type: 'meal',
    start_time: '2025-06-15T08:00:00Z',
    end_time: '2025-06-15T09:00:00Z',
    location: 'Main Lobby',
    description: 'Check-in and enjoy breakfast before the keynote'
  },
  {
    name: 'Opening Keynote: The Future of AI',
    type: 'keynote',
    start_time: '2025-06-15T09:00:00Z',
    end_time: '2025-06-15T10:00:00Z',
    location: 'Main Auditorium',
    description: 'Discover the latest trends and innovations in artificial intelligence',
    speakers: [
      {
        speaker_id: '123456000000567890',
        role: 'speaker'
      }
    ],
    capacity: 5000,
    track: 'Main Stage',
    tags: ['keynote', 'ai', 'featured']
  },
  {
    name: 'Coffee Break & Networking',
    type: 'break',
    start_time: '2025-06-15T10:00:00Z',
    end_time: '2025-06-15T10:30:00Z',
    location: 'Exhibition Hall',
    description: 'Network with fellow attendees and visit sponsor booths'
  },
  {
    name: 'Workshop: Building Scalable Cloud Applications',
    type: 'workshop',
    start_time: '2025-06-15T10:30:00Z',
    end_time: '2025-06-15T12:00:00Z',
    location: 'Workshop Room A',
    description: 'Hands-on workshop on building and deploying cloud-native applications',
    speakers: [
      {
        speaker_id: '123456000000567891',
        role: 'instructor'
      }
    ],
    capacity: 50,
    track: 'Technical Track',
    tags: ['workshop', 'cloud', 'hands-on'],
    requires_registration: true
  }
];

for (const session of day1Sessions) {
  const result = await createSession(accessToken, portalId, eventId, session);
  console.log(`Created session: ${session.name}`);
}
```

---

### 5. Speakers

**Purpose**: Manage event speakers and presenters

**Endpoints**:
```http
GET    /backstage/v1/portal/{portal_id}/events/{event_id}/speakers # List speakers
GET    /backstage/v1/portal/{portal_id}/events/{event_id}/speakers/{speaker_id} # Get speaker
POST   /backstage/v1/portal/{portal_id}/events/{event_id}/speakers # Create speaker
PUT    /backstage/v1/portal/{portal_id}/events/{event_id}/speakers/{speaker_id} # Update speaker
DELETE /backstage/v1/portal/{portal_id}/events/{event_id}/speakers/{speaker_id} # Delete speaker
```

**Example - Add Speakers**:
```javascript
// JavaScript/Node.js
const createSpeaker = async (accessToken, portalId, eventId, speakerData) => {
  const response = await axios.post(
    `https://www.zohoapis.com/backstage/v1/portal/${portalId}/events/${eventId}/speakers`,
    speakerData,
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
const speaker = {
  first_name: 'Dr. Sarah',
  last_name: 'Johnson',
  email: 'sarah.johnson@example.com',
  title: 'Chief AI Officer',
  company: 'Tech Innovations Inc',
  bio: 'Dr. Sarah Johnson is a leading expert in artificial intelligence with over 15 years of experience in machine learning and neural networks.',
  profile_photo_url: 'https://example.com/speakers/sarah-johnson.jpg',
  social_media: {
    twitter: '@drsarahjohnson',
    linkedin: 'drsarahjohnson',
    website: 'https://sarahjohnson.com'
  },
  featured: true,
  tags: ['keynote', 'ai-expert']
};

const result = await createSpeaker(accessToken, portalId, eventId, speaker);
console.log('Speaker added:', result);
```

---

### 6. Sponsors

**Purpose**: Manage event sponsors and exhibitors

**Endpoints**:
```http
GET    /backstage/v1/portal/{portal_id}/events/{event_id}/sponsors # List sponsors
GET    /backstage/v1/portal/{portal_id}/events/{event_id}/sponsors/{sponsor_id} # Get sponsor
POST   /backstage/v1/portal/{portal_id}/events/{event_id}/sponsors # Create sponsor
PUT    /backstage/v1/portal/{portal_id}/events/{event_id}/sponsors/{sponsor_id} # Update sponsor
DELETE /backstage/v1/portal/{portal_id}/events/{event_id}/sponsors/{sponsor_id} # Delete sponsor
```

**Sponsor Tiers**:
- Platinum
- Gold
- Silver
- Bronze
- Exhibitor

**Example - Add Sponsors**:
```javascript
// JavaScript/Node.js
const createSponsor = async (accessToken, portalId, eventId, sponsorData) => {
  const response = await axios.post(
    `https://www.zohoapis.com/backstage/v1/portal/${portalId}/events/${eventId}/sponsors`,
    sponsorData,
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
const sponsor = {
  company_name: 'CloudTech Solutions',
  tier: 'platinum',
  logo_url: 'https://example.com/sponsors/cloudtech-logo.png',
  website: 'https://cloudtech.com',
  description: 'CloudTech Solutions provides enterprise cloud infrastructure and services.',
  contact: {
    name: 'Michael Brown',
    email: 'michael@cloudtech.com',
    phone: '555-1234'
  },
  booth_number: 'A-101',
  booth_size: '10x10',
  benefits: [
    'Keynote speaking opportunity',
    'Premium booth location',
    'Logo on all event materials',
    '10 complimentary passes',
    'Lead scanning access'
  ],
  social_media: {
    twitter: '@cloudtech',
    linkedin: 'company/cloudtech'
  }
};

const result = await createSponsor(accessToken, portalId, eventId, sponsor);
console.log('Sponsor added:', result);
```

---

### 7. Check-ins

**Purpose**: Manage attendee check-ins

**Endpoints**:
```http
GET    /backstage/v1/portal/{portal_id}/events/{event_id}/checkins # List check-ins
POST   /backstage/v1/portal/{portal_id}/events/{event_id}/checkins # Check-in attendee
GET    /backstage/v1/portal/{portal_id}/events/{event_id}/checkins/stats # Get check-in statistics
POST   /backstage/v1/portal/{portal_id}/events/{event_id}/checkins/bulk # Bulk check-in
```

**Example - Check-in Attendee**:
```javascript
// JavaScript/Node.js
const checkInAttendee = async (accessToken, portalId, eventId, checkinData) => {
  const response = await axios.post(
    `https://www.zohoapis.com/backstage/v1/portal/${portalId}/events/${eventId}/checkins`,
    checkinData,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

// Usage - Check-in by registration ID
const checkin = {
  registration_id: '123456000000456789',
  check_in_time: new Date().toISOString(),
  check_in_location: 'Main Entrance',
  notes: 'Arrived early'
};

const result = await checkInAttendee(accessToken, portalId, eventId, checkin);
console.log('Attendee checked in:', result);

// Alternative - Check-in by QR code scan
const checkInByQR = async (accessToken, portalId, eventId, qrCode) => {
  const response = await axios.post(
    `https://www.zohoapis.com/backstage/v1/portal/${portalId}/events/${eventId}/checkins`,
    {
      qr_code: qrCode,
      check_in_time: new Date().toISOString(),
      check_in_location: 'Main Entrance'
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
# Python - Get check-in statistics
def get_checkin_stats(access_token, portal_id, event_id):
    url = f'https://www.zohoapis.com/backstage/v1/portal/{portal_id}/events/{event_id}/checkins/stats'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    response = requests.get(url, headers=headers)
    return response.json()

# Usage
stats = get_checkin_stats(access_token, portal_id, event_id)
print(f"""
Check-in Statistics:
Total Registered: {stats['total_registered']}
Checked In: {stats['checked_in']}
Not Checked In: {stats['not_checked_in']}
Check-in Rate: {stats['checkin_rate']}%
""")
```

---

### 8. Email Communications

**Purpose**: Send emails to attendees

**Endpoints**:
```http
GET    /backstage/v1/portal/{portal_id}/events/{event_id}/emails # List email campaigns
POST   /backstage/v1/portal/{portal_id}/events/{event_id}/emails # Send email
GET    /backstage/v1/portal/{portal_id}/events/{event_id}/emails/{email_id} # Get email details
GET    /backstage/v1/portal/{portal_id}/events/{event_id}/emails/{email_id}/stats # Email statistics
```

**Email Types**:
- Confirmation
- Reminder
- Update
- Thank You
- Survey
- Custom

**Example - Send Email Campaign**:
```javascript
// JavaScript/Node.js
const sendEmail = async (accessToken, portalId, eventId, emailData) => {
  const response = await axios.post(
    `https://www.zohoapis.com/backstage/v1/portal/${portalId}/events/${eventId}/emails`,
    emailData,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

// Usage - Send event reminder
const email = {
  name: 'Event Reminder - 1 Week',
  subject: 'Just 1 Week Until Tech Summit 2025!',
  from_name: 'Tech Summit Team',
  from_email: 'events@techsummit.com',
  reply_to: 'support@techsummit.com',
  recipients: {
    type: 'registered',  // all, registered, checked_in, ticket_type
    status: 'approved'
  },
  content: {
    html: `
      <html>
        <body>
          <h1>Hi {{First_Name}},</h1>
          <p>We're excited to see you at Tech Summit 2025 in just one week!</p>
          <h2>Event Details:</h2>
          <ul>
            <li><strong>Date:</strong> June 15-17, 2025</li>
            <li><strong>Location:</strong> Grand Convention Center, New York</li>
            <li><strong>Your Ticket:</strong> {{Ticket_Name}}</li>
            <li><strong>Registration Number:</strong> {{Registration_Number}}</li>
          </ul>
          <h2>What to Bring:</h2>
          <ul>
            <li>Your QR code (attached or on mobile)</li>
            <li>Photo ID</li>
            <li>Business cards for networking</li>
          </ul>
          <p><a href="{{Event_URL}}">View Full Agenda</a></p>
          <p>See you soon!</p>
        </body>
      </html>
    `,
    text: 'Hi {{First_Name}}, We\'re excited to see you at Tech Summit 2025 in just one week!'
  },
  schedule: {
    send_at: '2025-06-08T09:00:00Z',
    timezone: 'America/New_York'
  },
  tracking: {
    opens: true,
    clicks: true
  }
};

const result = await sendEmail(accessToken, portalId, eventId, email);
console.log('Email scheduled:', result);
```

---

### 9. Forms & Surveys

**Purpose**: Create registration forms and post-event surveys

**Endpoints**:
```http
GET    /backstage/v1/portal/{portal_id}/events/{event_id}/forms # List forms
GET    /backstage/v1/portal/{portal_id}/events/{event_id}/forms/{form_id} # Get form
POST   /backstage/v1/portal/{portal_id}/events/{event_id}/forms # Create form
PUT    /backstage/v1/portal/{portal_id}/events/{event_id}/forms/{form_id} # Update form
DELETE /backstage/v1/portal/{portal_id}/events/{event_id}/forms/{form_id} # Delete form
GET    /backstage/v1/portal/{portal_id}/events/{event_id}/forms/{form_id}/responses # Get responses
```

**Example - Create Post-Event Survey**:
```javascript
// JavaScript/Node.js
const createSurvey = async (accessToken, portalId, eventId, surveyData) => {
  const response = await axios.post(
    `https://www.zohoapis.com/backstage/v1/portal/${portalId}/events/${eventId}/forms`,
    surveyData,
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
const survey = {
  name: 'Post-Event Feedback Survey',
  type: 'survey',
  description: 'Help us improve future events by sharing your feedback',
  questions: [
    {
      question: 'How would you rate the overall event?',
      type: 'rating',
      scale: 5,
      required: true
    },
    {
      question: 'Which sessions did you find most valuable?',
      type: 'multiple_choice',
      options: [
        'Opening Keynote',
        'Cloud Workshop',
        'AI Panel Discussion',
        'DevOps Best Practices',
        'Networking Sessions'
      ],
      allow_multiple: true,
      required: true
    },
    {
      question: 'How likely are you to recommend this event to a colleague?',
      type: 'nps',  // Net Promoter Score (0-10)
      required: true
    },
    {
      question: 'What did you like most about the event?',
      type: 'text',
      max_length: 500,
      required: false
    },
    {
      question: 'What could we improve for next year?',
      type: 'text',
      max_length: 500,
      required: false
    }
  ],
  settings: {
    allow_anonymous: false,
    send_confirmation: true,
    redirect_url: 'https://techsummit.com/thank-you'
  }
};

const result = await createSurvey(accessToken, portalId, eventId, survey);
console.log('Survey created:', result);
```

---

### 10. Analytics & Reports

**Purpose**: Track event metrics and generate reports

**Endpoints**:
```http
GET    /backstage/v1/portal/{portal_id}/events/{event_id}/analytics/overview # Overview metrics
GET    /backstage/v1/portal/{portal_id}/events/{event_id}/analytics/registrations # Registration analytics
GET    /backstage/v1/portal/{portal_id}/events/{event_id}/analytics/revenue # Revenue analytics
GET    /backstage/v1/portal/{portal_id}/events/{event_id}/analytics/attendance # Attendance analytics
GET    /backstage/v1/portal/{portal_id}/events/{event_id}/analytics/engagement # Engagement metrics
POST   /backstage/v1/portal/{portal_id}/events/{event_id}/reports/export # Export report
```

**Example - Get Event Analytics**:
```javascript
// JavaScript/Node.js
const getEventAnalytics = async (accessToken, portalId, eventId) => {
  const overview = await axios.get(
    `https://www.zohoapis.com/backstage/v1/portal/${portalId}/events/${eventId}/analytics/overview`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );

  const registrations = await axios.get(
    `https://www.zohoapis.com/backstage/v1/portal/${portalId}/events/${eventId}/analytics/registrations`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );

  const revenue = await axios.get(
    `https://www.zohoapis.com/backstage/v1/portal/${portalId}/events/${eventId}/analytics/revenue`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );

  return {
    overview: overview.data,
    registrations: registrations.data,
    revenue: revenue.data
  };
};

// Usage
const analytics = await getEventAnalytics(accessToken, portalId, eventId);

console.log('Event Analytics:', {
  totalRegistrations: analytics.overview.total_registrations,
  approvedRegistrations: analytics.overview.approved_registrations,
  checkedIn: analytics.overview.checked_in,
  attendanceRate: `${(analytics.overview.checked_in / analytics.overview.approved_registrations * 100).toFixed(2)}%`,
  totalRevenue: `$${analytics.revenue.total_revenue}`,
  averageTicketPrice: `$${analytics.revenue.average_ticket_price}`,
  topSellingTicket: analytics.revenue.top_selling_ticket,
  registrationsByDay: analytics.registrations.by_day
});
```

```python
# Python - Export detailed report
def export_event_report(access_token, portal_id, event_id, report_type):
    url = f'https://www.zohoapis.com/backstage/v1/portal/{portal_id}/events/{event_id}/reports/export'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'report_type': report_type,  # registrations, revenue, attendance, sessions
        'format': 'csv',  # csv, xlsx, pdf
        'include_fields': [
            'registration_number',
            'name',
            'email',
            'ticket_type',
            'payment_status',
            'check_in_status',
            'check_in_time'
        ]
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()

# Usage
report = export_event_report(access_token, portal_id, event_id, 'registrations')
print(f'Report exported: {report["download_url"]}')
```

---

## Authentication

### OAuth 2.0 Flow

**Step 1: Register Your Application**
- Go to [Zoho API Console](https://api-console.zoho.com/)
- Create a new Client
- Client Type: Server-based Applications
- Note your Client ID and Client Secret

**Step 2: Generate Authorization Code**
```http
GET https://accounts.zoho.com/oauth/v2/auth?
  scope=ZohoBackstage.events.ALL,ZohoBackstage.registrations.ALL&
  client_id={client_id}&
  response_type=code&
  access_type=offline&
  redirect_uri={redirect_uri}
```

**Available Scopes**:
- `ZohoBackstage.events.ALL` - Full access to events
- `ZohoBackstage.events.READ` - Read-only access to events
- `ZohoBackstage.registrations.ALL` - Full access to registrations
- `ZohoBackstage.tickets.ALL` - Full access to tickets
- `ZohoBackstage.sessions.ALL` - Full access to sessions
- `ZohoBackstage.speakers.ALL` - Full access to speakers
- `ZohoBackstage.sponsors.ALL` - Full access to sponsors
- `ZohoBackstage.checkins.ALL` - Full access to check-ins
- `ZohoBackstage.analytics.READ` - Read analytics data

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

**Token Lifetime**:
- Access Token: 1 hour
- Refresh Token: Does not expire (store securely)

---

## Rate Limits

### API Call Limits

| Plan | API Calls per Day | API Calls per Minute |
|------|-------------------|----------------------|
| Free | 1,000 | 10 |
| Standard | 10,000 | 50 |
| Professional | 50,000 | 100 |
| Enterprise | 200,000 | 200 |

### Rate Limit Headers

```http
X-RateLimit-Limit: 10000
X-RateLimit-Remaining: 9850
X-RateLimit-Reset: 1673827200
```

---

## Data Centers

Zoho Backstage operates in multiple data centers. Use the appropriate base URL:

| Data Center | Base URL | Accounts URL |
|-------------|----------|--------------|
| US | https://www.zohoapis.com | https://accounts.zoho.com |
| EU | https://www.zohoapis.eu | https://accounts.zoho.eu |
| IN | https://www.zohoapis.in | https://accounts.zoho.in |
| AU | https://www.zohoapis.com.au | https://accounts.zoho.com.au |

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
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |

### Backstage Error Codes

| Code | Message | Description | Solution |
|------|---------|-------------|----------|
| EVENT_NOT_FOUND | Event does not exist | Invalid event ID | Verify event ID |
| EVENT_PUBLISHED | Event already published | Cannot modify published event | Unpublish first |
| REGISTRATION_CLOSED | Registration is closed | Registration period ended | Update registration dates |
| TICKET_SOLD_OUT | Ticket sold out | No tickets available | Increase quantity or waitlist |
| DUPLICATE_REGISTRATION | Attendee already registered | Email already registered | Update existing registration |
| INVALID_TICKET | Ticket not found | Invalid ticket ID | Verify ticket ID |
| CHECKIN_ALREADY_DONE | Already checked in | Attendee already checked in | Verify check-in status |
| INVALID_QR_CODE | QR code invalid | QR code not recognized | Verify QR code |

---

## Best Practices

### 1. Event Setup

**Complete Event Profile**:
```javascript
const setupCompleteEvent = async (client, portalId, eventData) => {
  // 1. Create event
  const event = await client.createEvent(portalId, eventData);
  const eventId = event.data.event_id;

  // 2. Create ticket types
  for (const ticket of eventData.tickets) {
    await client.createTicket(portalId, eventId, ticket);
  }

  // 3. Add speakers
  for (const speaker of eventData.speakers) {
    await client.createSpeaker(portalId, eventId, speaker);
  }

  // 4. Create agenda
  for (const session of eventData.sessions) {
    await client.createSession(portalId, eventId, session);
  }

  // 5. Add sponsors
  for (const sponsor of eventData.sponsors) {
    await client.createSponsor(portalId, eventId, sponsor);
  }

  // 6. Publish event
  await client.publishEvent(portalId, eventId);

  return eventId;
};
```

### 2. Registration Management

**Handle Registration Workflow**:
```javascript
const handleRegistration = async (client, portalId, eventId, registrationData) => {
  try {
    // Create registration
    const result = await client.createRegistration(portalId, eventId, registrationData);

    // Send confirmation email
    await client.sendConfirmationEmail(portalId, eventId, result.data.registration_id);

    // If payment required and successful, update payment status
    if (registrationData.payment && registrationData.payment.transaction_id) {
      await client.updatePaymentStatus(
        portalId,
        eventId,
        result.data.registration_id,
        'paid'
      );
    }

    return {
      success: true,
      registration_id: result.data.registration_id,
      registration_number: result.data.registration_number
    };

  } catch (error) {
    // Handle specific errors
    if (error.code === 'TICKET_SOLD_OUT') {
      // Add to waitlist
      await client.addToWaitlist(portalId, eventId, registrationData);
      return {
        success: false,
        waitlisted: true,
        message: 'Added to waitlist'
      };
    }

    throw error;
  }
};
```

### 3. Check-in Optimization

**Mobile Check-in App**:
```javascript
const mobileCheckin = async (client, portalId, eventId, qrCode) => {
  try {
    // Scan QR code and check-in
    const result = await client.checkInByQR(portalId, eventId, qrCode);

    // Get attendee details
    const registration = result.data.registration;

    return {
      success: true,
      attendee: {
        name: `${registration.first_name} ${registration.last_name}`,
        ticket: registration.ticket_name,
        company: registration.company,
        special_notes: registration.custom_fields.special_requirements
      }
    };

  } catch (error) {
    if (error.code === 'CHECKIN_ALREADY_DONE') {
      return {
        success: false,
        already_checked_in: true,
        check_in_time: error.details.check_in_time
      };
    }

    throw error;
  }
};
```

---

## Code Examples

### Complete Event Management System

```javascript
// JavaScript/Node.js - Complete event management
class BackstageManager {
  constructor(accessToken, portalId) {
    this.accessToken = accessToken;
    this.portalId = portalId;
    this.baseURL = 'https://www.zohoapis.com/backstage/v1';
  }

  async createCompleteEvent(eventData) {
    // Create event
    const event = await this.post(`/portal/${this.portalId}/events`, {
      name: eventData.name,
      start_date: eventData.start_date,
      end_date: eventData.end_date,
      venue: eventData.venue
    });

    const eventId = event.data.event_id;
    console.log(`Event created: ${eventId}`);

    // Setup tickets
    for (const ticket of eventData.tickets) {
      await this.post(`/portal/${this.portalId}/events/${eventId}/tickets`, ticket);
      console.log(`Ticket created: ${ticket.name}`);
    }

    // Add speakers
    for (const speaker of eventData.speakers) {
      await this.post(`/portal/${this.portalId}/events/${eventId}/speakers`, speaker);
      console.log(`Speaker added: ${speaker.first_name} ${speaker.last_name}`);
    }

    // Create agenda
    for (const session of eventData.sessions) {
      await this.post(`/portal/${this.portalId}/events/${eventId}/sessions`, session);
      console.log(`Session created: ${session.name}`);
    }

    // Publish event
    await this.post(`/portal/${this.portalId}/events/${eventId}/publish`, {});
    console.log('Event published');

    return eventId;
  }

  async generateEventReport(eventId) {
    const analytics = await this.get(`/portal/${this.portalId}/events/${eventId}/analytics/overview`);
    const registrations = await this.get(`/portal/${this.portalId}/events/${eventId}/analytics/registrations`);
    const revenue = await this.get(`/portal/${this.portalId}/events/${eventId}/analytics/revenue`);

    const report = {
      event_id: eventId,
      generated_at: new Date().toISOString(),
      summary: {
        total_registrations: analytics.data.total_registrations,
        approved: analytics.data.approved_registrations,
        checked_in: analytics.data.checked_in,
        attendance_rate: `${(analytics.data.checked_in / analytics.data.approved_registrations * 100).toFixed(2)}%`
      },
      revenue: {
        total: revenue.data.total_revenue,
        by_ticket_type: revenue.data.by_ticket_type,
        average_ticket_price: revenue.data.average_ticket_price
      },
      registration_timeline: registrations.data.by_day
    };

    return report;
  }

  // HTTP helper methods
  async get(endpoint, params = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Zoho-oauthtoken ${this.accessToken}`
      },
      params
    });
    return response.data;
  }

  async post(endpoint, data) {
    const url = `${this.baseURL}${endpoint}`;
    const response = await axios.post(url, data, {
      headers: {
        'Authorization': `Zoho-oauthtoken ${this.accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }
}

// Usage
const manager = new BackstageManager(accessToken, portalId);

// Create event
const eventId = await manager.createCompleteEvent({
  name: 'Tech Summit 2025',
  start_date: '2025-06-15T09:00:00Z',
  end_date: '2025-06-17T18:00:00Z',
  venue: {
    name: 'Grand Convention Center',
    address: '123 Conference Way',
    city: 'New York',
    state: 'NY'
  },
  tickets: [
    { name: 'Early Bird', price: 199, quantity: 100 },
    { name: 'General Admission', price: 299, quantity: 500 }
  ],
  speakers: [
    { first_name: 'Sarah', last_name: 'Johnson', title: 'Chief AI Officer' }
  ],
  sessions: [
    { name: 'Opening Keynote', type: 'keynote', start_time: '2025-06-15T09:00:00Z' }
  ]
});

// Generate report
const report = await manager.generateEventReport(eventId);
console.log('Event Report:', report);
```

---

## Additional Resources

- [Official Backstage API Documentation](https://www.zoho.com/backstage/api/)
- [Zoho API Console](https://api-console.zoho.com/)
- [Backstage Help Center](https://help.zoho.com/portal/en/kb/backstage)
- [Developer Forums](https://help.zoho.com/portal/en/community/backstage)

---

**Last Updated**: December 2025
**API Version**: v1
