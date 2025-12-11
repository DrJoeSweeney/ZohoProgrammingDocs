# Zoho Sites API Reference

## Overview

Zoho Sites is a website builder platform that enables users to create professional websites without coding. The API provides programmatic access to site management, pages, content, forms, and domain operations.

**Current API Version**: v1
**Base URL**: `https://sites.zoho.com/api/v1/`
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
- `ZohoSites.site.ALL` - Full access to sites
- `ZohoSites.site.READ` - Read-only access
- `ZohoSites.pages.ALL` - Manage pages
- `ZohoSites.forms.ALL` - Manage forms

**Example Authorization Request**:
```http
GET https://accounts.zoho.com/oauth/v2/auth?
  response_type=code&
  client_id={client_id}&
  scope=ZohoSites.site.ALL,ZohoSites.pages.ALL&
  redirect_uri={redirect_uri}&
  access_type=offline
```

---

## Rate Limits

- **API Calls**: 2,000 calls per day per organization
- **Burst Limit**: 30 calls per minute
- **File Uploads**: 50 files per hour

**Rate Limit Headers**:
```http
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 25
X-RateLimit-Reset: 1704124800
```

---

## API Modules

### 1. Sites

**Purpose**: Manage websites

**Endpoints**:
```http
GET    /api/v1/sites                # List all sites
GET    /api/v1/sites/{siteId}       # Get site details
POST   /api/v1/sites                # Create site
PUT    /api/v1/sites/{siteId}       # Update site
DELETE /api/v1/sites/{siteId}       # Delete site
POST   /api/v1/sites/{siteId}/publish # Publish site
```

**Example - List Sites**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const listSites = async (accessToken) => {
  const response = await axios.get(
    'https://sites.zoho.com/api/v1/sites',
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
  "sites": [
    {
      "siteId": "1234567890",
      "siteName": "My Business Website",
      "domain": "mybusiness.zohosites.com",
      "customDomain": "www.mybusiness.com",
      "status": "published",
      "theme": "modern-business",
      "createdTime": "2025-01-15T10:30:00Z",
      "publishedTime": "2025-01-20T14:45:00Z",
      "pageCount": 8,
      "siteUrl": "https://mybusiness.zohosites.com"
    }
  ]
}
```

**Example - Create Site**:
```python
# Python
import requests

def create_site(access_token, site_data):
    url = 'https://sites.zoho.com/api/v1/sites'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'siteName': site_data['name'],
        'theme': site_data.get('theme', 'default'),
        'language': site_data.get('language', 'en')
    }

    response = requests.post(url, json=data, headers=headers)
    return response.json()

# Create new site
site = create_site(access_token, {
    'name': 'New Business Site',
    'theme': 'modern-business',
    'language': 'en'
})
```

---

### 2. Pages

**Purpose**: Manage website pages

**Endpoints**:
```http
GET    /api/v1/sites/{siteId}/pages              # List pages
GET    /api/v1/sites/{siteId}/pages/{pageId}     # Get page details
POST   /api/v1/sites/{siteId}/pages              # Create page
PUT    /api/v1/sites/{siteId}/pages/{pageId}     # Update page
DELETE /api/v1/sites/{siteId}/pages/{pageId}     # Delete page
POST   /api/v1/sites/{siteId}/pages/{pageId}/duplicate # Duplicate page
```

**Page Types**:
- `standard` - Regular page
- `blog` - Blog page
- `store` - E-commerce page
- `gallery` - Image gallery
- `contact` - Contact page

**Example - List Pages**:
```javascript
// JavaScript/Node.js
const listPages = async (accessToken, siteId) => {
  const response = await axios.get(
    `https://sites.zoho.com/api/v1/sites/${siteId}/pages`,
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
  "pages": [
    {
      "pageId": "111111",
      "pageName": "Home",
      "pageTitle": "Welcome to Our Business",
      "pageType": "standard",
      "url": "/",
      "isHomePage": true,
      "isPublished": true,
      "createdTime": "2025-01-15T10:30:00Z",
      "modifiedTime": "2025-01-20T14:45:00Z"
    },
    {
      "pageId": "222222",
      "pageName": "About Us",
      "pageTitle": "About Our Company",
      "pageType": "standard",
      "url": "/about",
      "isHomePage": false,
      "isPublished": true
    }
  ]
}
```

**Example - Create Page**:
```python
# Python
def create_page(access_token, site_id, page_data):
    url = f'https://sites.zoho.com/api/v1/sites/{site_id}/pages'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'pageName': page_data['name'],
        'pageTitle': page_data['title'],
        'pageType': page_data.get('type', 'standard'),
        'url': page_data['url'],
        'content': page_data.get('content', ''),
        'metaDescription': page_data.get('meta_description', '')
    }

    response = requests.post(url, json=data, headers=headers)
    return response.json()

# Create new page
page = create_page(access_token, site_id, {
    'name': 'Services',
    'title': 'Our Services',
    'url': '/services',
    'content': '<h1>Our Services</h1><p>We offer...</p>',
    'meta_description': 'Learn about our professional services'
})
```

---

### 3. Content Sections

**Purpose**: Manage page content sections

**Endpoints**:
```http
GET    /api/v1/sites/{siteId}/pages/{pageId}/sections           # List sections
GET    /api/v1/sites/{siteId}/pages/{pageId}/sections/{sectionId} # Get section
POST   /api/v1/sites/{siteId}/pages/{pageId}/sections           # Add section
PUT    /api/v1/sites/{siteId}/pages/{pageId}/sections/{sectionId} # Update section
DELETE /api/v1/sites/{siteId}/pages/{pageId}/sections/{sectionId} # Delete section
```

**Section Types**:
- `text` - Text content
- `image` - Image section
- `video` - Video embed
- `gallery` - Image gallery
- `form` - Form section
- `testimonial` - Customer testimonials
- `pricing` - Pricing tables
- `team` - Team members

**Example - Add Text Section**:
```javascript
// JavaScript/Node.js
const addSection = async (accessToken, siteId, pageId, sectionData) => {
  const response = await axios.post(
    `https://sites.zoho.com/api/v1/sites/${siteId}/pages/${pageId}/sections`,
    {
      sectionType: sectionData.type,
      content: sectionData.content,
      position: sectionData.position || 0,
      style: sectionData.style || {}
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

// Add hero section
await addSection(accessToken, siteId, pageId, {
  type: 'text',
  content: {
    heading: 'Welcome to Our Business',
    subheading: 'Professional Services Since 2020',
    body: '<p>We provide exceptional solutions...</p>'
  },
  style: {
    backgroundColor: '#f5f5f5',
    textAlign: 'center'
  }
});
```

---

### 4. Forms

**Purpose**: Manage website forms

**Endpoints**:
```http
GET    /api/v1/sites/{siteId}/forms              # List forms
GET    /api/v1/sites/{siteId}/forms/{formId}     # Get form details
POST   /api/v1/sites/{siteId}/forms              # Create form
PUT    /api/v1/sites/{siteId}/forms/{formId}     # Update form
DELETE /api/v1/sites/{siteId}/forms/{formId}     # Delete form
GET    /api/v1/sites/{siteId}/forms/{formId}/submissions # Get submissions
```

**Example - Create Contact Form**:
```python
# Python
def create_form(access_token, site_id, form_data):
    url = f'https://sites.zoho.com/api/v1/sites/{site_id}/forms'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'formName': form_data['name'],
        'fields': form_data['fields'],
        'submitButtonText': form_data.get('submit_text', 'Submit'),
        'successMessage': form_data.get('success_message', 'Thank you!'),
        'notificationEmail': form_data.get('notification_email')
    }

    response = requests.post(url, json=data, headers=headers)
    return response.json()

# Create contact form
form = create_form(access_token, site_id, {
    'name': 'Contact Us',
    'fields': [
        {
            'fieldType': 'text',
            'fieldName': 'name',
            'label': 'Your Name',
            'required': True
        },
        {
            'fieldType': 'email',
            'fieldName': 'email',
            'label': 'Email Address',
            'required': True
        },
        {
            'fieldType': 'textarea',
            'fieldName': 'message',
            'label': 'Message',
            'required': True
        }
    ],
    'submit_text': 'Send Message',
    'notification_email': 'admin@mybusiness.com'
})
```

**Example - Get Form Submissions**:
```javascript
// JavaScript/Node.js
const getFormSubmissions = async (accessToken, siteId, formId, options = {}) => {
  const response = await axios.get(
    `https://sites.zoho.com/api/v1/sites/${siteId}/forms/${formId}/submissions`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      },
      params: {
        from_date: options.fromDate,
        to_date: options.toDate,
        limit: options.limit || 50
      }
    }
  );
  return response.data;
};
```

---

### 5. Themes

**Purpose**: Manage site themes and templates

**Endpoints**:
```http
GET    /api/v1/themes                          # List available themes
GET    /api/v1/sites/{siteId}/theme            # Get current theme
PUT    /api/v1/sites/{siteId}/theme            # Change theme
GET    /api/v1/sites/{siteId}/theme/customize  # Get theme customization
PUT    /api/v1/sites/{siteId}/theme/customize  # Update customization
```

**Example - Change Theme**:
```javascript
// JavaScript/Node.js
const changeTheme = async (accessToken, siteId, themeId) => {
  const response = await axios.put(
    `https://sites.zoho.com/api/v1/sites/${siteId}/theme`,
    {
      themeId: themeId
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

**Example - Customize Theme Colors**:
```python
# Python
def customize_theme(access_token, site_id, customization):
    url = f'https://sites.zoho.com/api/v1/sites/{site_id}/theme/customize'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'primaryColor': customization.get('primary_color', '#007bff'),
        'secondaryColor': customization.get('secondary_color', '#6c757d'),
        'fontFamily': customization.get('font_family', 'Roboto'),
        'headerStyle': customization.get('header_style', 'fixed')
    }

    response = requests.put(url, json=data, headers=headers)
    return response.json()
```

---

### 6. Domains

**Purpose**: Manage custom domains

**Endpoints**:
```http
GET    /api/v1/sites/{siteId}/domains           # List domains
POST   /api/v1/sites/{siteId}/domains           # Add custom domain
DELETE /api/v1/sites/{siteId}/domains/{domain}  # Remove domain
GET    /api/v1/sites/{siteId}/domains/{domain}/verify # Verify domain
```

**Example - Add Custom Domain**:
```javascript
// JavaScript/Node.js
const addCustomDomain = async (accessToken, siteId, domain) => {
  const response = await axios.post(
    `https://sites.zoho.com/api/v1/sites/${siteId}/domains`,
    {
      domain: domain,
      isPrimary: true
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

// Add www.mybusiness.com
await addCustomDomain(accessToken, siteId, 'www.mybusiness.com');
```

---

### 7. Media Library

**Purpose**: Manage images and files

**Endpoints**:
```http
GET    /api/v1/sites/{siteId}/media            # List media files
POST   /api/v1/sites/{siteId}/media            # Upload file
DELETE /api/v1/sites/{siteId}/media/{mediaId}  # Delete file
GET    /api/v1/sites/{siteId}/media/{mediaId}  # Get file details
```

**Example - Upload Image**:
```python
# Python
def upload_image(access_token, site_id, file_path):
    url = f'https://sites.zoho.com/api/v1/sites/{site_id}/media'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }

    with open(file_path, 'rb') as f:
        files = {'file': f}
        response = requests.post(url, files=files, headers=headers)

    return response.json()

# Upload logo
result = upload_image(access_token, site_id, '/path/to/logo.png')
# Returns: {"mediaId": "12345", "url": "https://..."}
```

---

## Common Operations

### 1. Publish Site

```javascript
// JavaScript/Node.js
const publishSite = async (accessToken, siteId) => {
  const response = await axios.post(
    `https://sites.zoho.com/api/v1/sites/${siteId}/publish`,
    {},
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

### 2. Clone Site

```python
# Python
def clone_site(access_token, site_id, new_name):
    url = f'https://sites.zoho.com/api/v1/sites/{site_id}/clone'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'siteName': new_name
    }

    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

### 3. Update SEO Settings

```javascript
// JavaScript/Node.js
const updateSEO = async (accessToken, siteId, pageId, seoData) => {
  const response = await axios.put(
    `https://sites.zoho.com/api/v1/sites/${siteId}/pages/${pageId}/seo`,
    {
      metaTitle: seoData.title,
      metaDescription: seoData.description,
      metaKeywords: seoData.keywords,
      ogImage: seoData.ogImage
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

## Deluge Integration

### Create Site Page

```javascript
// Deluge Script
siteId = "1234567890";

pageData = {
  "pageName": "New Product Launch",
  "pageTitle": "Introducing Our New Product",
  "url": "/new-product",
  "content": "<h1>New Product</h1><p>Check out our latest offering!</p>"
};

response = invokeurl
[
  url: "https://sites.zoho.com/api/v1/sites/" + siteId + "/pages"
  type: POST
  parameters: pageData.toString()
  connection: "zoho_sites"
];

info "Created page: " + response.get("pageId");
```

### Get Form Submissions

```javascript
// Deluge Script
siteId = "1234567890";
formId = "111111";

response = invokeurl
[
  url: "https://sites.zoho.com/api/v1/sites/" + siteId + "/forms/" + formId + "/submissions"
  type: GET
  connection: "zoho_sites"
];

submissions = response.get("submissions");
for each submission in submissions
{
  name = submission.get("name");
  email = submission.get("email");
  message = submission.get("message");

  info "Submission from: " + name + " (" + email + ")";
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
| 404 | Not Found | Site or resource not found |
| 409 | Conflict | Resource already exists |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error occurred |

**Error Response Format**:
```json
{
  "error": {
    "code": "INVALID_SITE_ID",
    "message": "The specified site does not exist or has been deleted"
  }
}
```

---

## Best Practices

### 1. Content Management
- Use sections for modular page design
- Keep page URLs SEO-friendly
- Optimize images before uploading
- Regular backups via API

### 2. Performance
- Minimize API calls with batching
- Cache theme and media data
- Use webhooks for form submissions

### 3. SEO Optimization
- Set meta tags for all pages
- Use descriptive page URLs
- Add alt text to images
- Submit sitemap after publishing

---

## Data Centers

API endpoints vary by data center:

| Region | API Base URL |
|--------|-------------|
| US | `https://sites.zoho.com/api/v1/` |
| EU | `https://sites.zoho.eu/api/v1/` |
| IN | `https://sites.zoho.in/api/v1/` |
| AU | `https://sites.zoho.com.au/api/v1/` |

---

## Additional Resources

- **Official Documentation**: https://www.zoho.com/sites/help/api/
- **Developer Console**: https://api-console.zoho.com/
- **Community**: https://help.zoho.com/portal/en/community/zoho-sites
