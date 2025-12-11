# Zoho Show API Reference

## Overview

Zoho Show is a powerful online presentation application that allows you to create, edit, and present slideshows online. The Show API provides programmatic access to presentation creation, slide management, themes, collaboration features, and Office Integrator functionality.

**Current API Version**: v1
**Base URL**: `https://www.zohoapis.com/show/api/v1/`
**Office Integrator URL**: `https://api.office-integrator.com/v1/`
**Protocol**: REST
**Data Format**: JSON
**Authentication**: OAuth 2.0

---

## Quick Links

- [Authentication](#authentication)
- [Presentations API](#presentations-api)
- [Slides API](#slides-api)
- [Themes and Design](#themes-and-design)
- [Office Integrator](#office-integrator)
- [Collaboration](#collaboration)
- [Media Management](#media-management)
- [Rate Limits](#rate-limits)
- [Error Codes](#error-codes)
- [Code Examples](#code-examples)

---

## Authentication

### OAuth 2.0 Setup

**Step 1: Register Your Application**
1. Go to [Zoho API Console](https://api-console.zoho.com/)
2. Create a new client
3. Note your `Client ID` and `Client Secret`
4. Set redirect URI

**Step 2: Authorization Code Flow**

```http
GET https://accounts.zoho.com/oauth/v2/auth?
  response_type=code&
  client_id={client_id}&
  scope=ZohoShow.presentations.ALL,ZohoShow.collaboration.ALL&
  redirect_uri={redirect_uri}&
  access_type=offline
```

**Step 3: Exchange Code for Token**

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
  "access_token": "1000.xxx.xxx",
  "refresh_token": "1000.yyy.yyy",
  "api_domain": "https://www.zohoapis.com",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

**Available Scopes**:
- `ZohoShow.presentations.ALL` - Full presentation access
- `ZohoShow.presentations.READ` - Read-only access
- `ZohoShow.presentations.CREATE` - Create presentations
- `ZohoShow.presentations.UPDATE` - Update presentations
- `ZohoShow.presentations.DELETE` - Delete presentations
- `ZohoShow.collaboration.ALL` - Full collaboration access
- `ZohoShow.comments.ALL` - Comment management
- `ZohoShow.themes.READ` - Access themes

---

## Presentations API

### List Presentations

Retrieve all presentations from your Zoho Show account.

**Endpoint**: `GET /presentations`

**Query Parameters**:
- `page` (integer): Page number (default: 1)
- `per_page` (integer): Results per page, max 200 (default: 50)
- `sort_by` (string): Sort field - `name`, `created_time`, `modified_time`
- `sort_order` (string): `asc` or `desc`
- `folder_id` (string): Filter by folder ID
- `search` (string): Search by name

**Request**:
```http
GET https://www.zohoapis.com/show/api/v1/presentations?page=1&per_page=50
Authorization: Zoho-oauthtoken {access_token}
```

**Response**:
```json
{
  "data": [
    {
      "presentation_id": "pres_abc123xyz789",
      "presentation_name": "Q1 Business Review.zpw",
      "presentation_url": "https://show.zoho.com/show/open/pres_abc123xyz789",
      "created_time": "2025-01-15T10:30:00Z",
      "modified_time": "2025-01-16T14:20:00Z",
      "owner": {
        "user_id": "12345",
        "email": "user@example.com",
        "name": "John Doe"
      },
      "folder_id": "folder_001",
      "file_size": 2097152,
      "slide_count": 15,
      "status": "active",
      "thumbnail_url": "https://show.zoho.com/thumbnails/pres_abc123xyz789.png"
    }
  ],
  "info": {
    "page": 1,
    "per_page": 50,
    "count": 25,
    "total_count": 125,
    "more_records": true
  }
}
```

### Get Presentation

Retrieve details of a specific presentation.

**Endpoint**: `GET /presentations/{presentation_id}`

**Request**:
```http
GET https://www.zohoapis.com/show/api/v1/presentations/pres_abc123xyz789
Authorization: Zoho-oauthtoken {access_token}
```

**Response**:
```json
{
  "data": {
    "presentation_id": "pres_abc123xyz789",
    "presentation_name": "Q1 Business Review.zpw",
    "presentation_url": "https://show.zoho.com/show/open/pres_abc123xyz789",
    "created_time": "2025-01-15T10:30:00Z",
    "modified_time": "2025-01-16T14:20:00Z",
    "owner": {
      "user_id": "12345",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "slides": [
      {
        "slide_id": "slide_001",
        "slide_number": 1,
        "title": "Introduction",
        "layout": "title_slide"
      },
      {
        "slide_id": "slide_002",
        "slide_number": 2,
        "title": "Overview",
        "layout": "title_and_content"
      }
    ],
    "theme": {
      "theme_id": "theme_001",
      "theme_name": "Modern Blue"
    },
    "shared_with": [
      {
        "user_id": "67890",
        "email": "collaborator@example.com",
        "permission": "edit"
      }
    ],
    "file_size": 2097152,
    "slide_count": 15
  }
}
```

### Create Presentation

Create a new presentation.

**Endpoint**: `POST /presentations`

**Request Body**:
```json
{
  "presentation_name": "New Presentation.zpw",
  "theme_id": "theme_001",
  "slides": [
    {
      "layout": "title_slide",
      "elements": [
        {
          "type": "text",
          "content": "Welcome to Our Presentation",
          "placeholder": "title"
        },
        {
          "type": "text",
          "content": "Company Overview",
          "placeholder": "subtitle"
        }
      ]
    }
  ],
  "folder_id": "folder_001"
}
```

**Response**:
```json
{
  "data": {
    "presentation_id": "pres_def456uvw123",
    "presentation_name": "New Presentation.zpw",
    "presentation_url": "https://show.zoho.com/show/open/pres_def456uvw123",
    "created_time": "2025-01-17T09:15:00Z"
  },
  "message": "Presentation created successfully"
}
```

### Update Presentation

Update presentation metadata.

**Endpoint**: `PUT /presentations/{presentation_id}`

**Request Body**:
```json
{
  "presentation_name": "Q1 Business Review - Final.zpw"
}
```

**Response**:
```json
{
  "data": {
    "presentation_id": "pres_abc123xyz789",
    "modified_time": "2025-01-17T10:30:00Z"
  },
  "message": "Presentation updated successfully"
}
```

### Delete Presentation

Move presentation to trash or permanently delete.

**Endpoint**: `DELETE /presentations/{presentation_id}`

**Query Parameters**:
- `permanent` (boolean): Permanently delete (default: false)

**Request**:
```http
DELETE https://www.zohoapis.com/show/api/v1/presentations/pres_abc123xyz789
Authorization: Zoho-oauthtoken {access_token}
```

**Response**:
```json
{
  "message": "Presentation moved to trash successfully"
}
```

### Download Presentation

Export presentation in various formats.

**Endpoint**: `GET /presentations/{presentation_id}/download`

**Query Parameters**:
- `format` (string): Export format - `pptx`, `pdf`, `odp`, `html`, `jpg`, `png`
- `slide_range` (string): Specific slides (e.g., "1-5,7,9")

**Request**:
```http
GET https://www.zohoapis.com/show/api/v1/presentations/pres_abc123xyz789/download?format=pdf
Authorization: Zoho-oauthtoken {access_token}
```

**Response**: Binary file stream

### Upload Presentation

Upload a presentation from local file.

**Endpoint**: `POST /presentations/upload`

**Request**:
```http
POST https://www.zohoapis.com/show/api/v1/presentations/upload
Authorization: Zoho-oauthtoken {access_token}
Content-Type: multipart/form-data

file={binary_data}
presentation_name=Company Overview.pptx
folder_id=folder_001
```

**Response**:
```json
{
  "data": {
    "presentation_id": "pres_ghi789rst456",
    "presentation_name": "Company Overview.pptx",
    "presentation_url": "https://show.zoho.com/show/open/pres_ghi789rst456",
    "created_time": "2025-01-17T11:00:00Z",
    "slide_count": 12
  },
  "message": "Presentation uploaded successfully"
}
```

### Duplicate Presentation

Create a copy of an existing presentation.

**Endpoint**: `POST /presentations/{presentation_id}/duplicate`

**Request Body**:
```json
{
  "presentation_name": "Q1 Business Review - Copy",
  "folder_id": "folder_002"
}
```

**Response**:
```json
{
  "data": {
    "presentation_id": "pres_jkl012mno345",
    "presentation_name": "Q1 Business Review - Copy",
    "presentation_url": "https://show.zoho.com/show/open/pres_jkl012mno345"
  }
}
```

---

## Slides API

### List Slides

Get all slides in a presentation.

**Endpoint**: `GET /presentations/{presentation_id}/slides`

**Response**:
```json
{
  "data": [
    {
      "slide_id": "slide_001",
      "slide_number": 1,
      "title": "Introduction",
      "layout": "title_slide",
      "thumbnail_url": "https://show.zoho.com/thumbnails/slide_001.png",
      "elements": [
        {
          "element_id": "elem_001",
          "type": "text",
          "content": "Welcome",
          "position": {"x": 100, "y": 150},
          "size": {"width": 600, "height": 100}
        }
      ]
    },
    {
      "slide_id": "slide_002",
      "slide_number": 2,
      "title": "Overview",
      "layout": "title_and_content"
    }
  ]
}
```

### Get Slide

Get details of a specific slide.

**Endpoint**: `GET /presentations/{presentation_id}/slides/{slide_id}`

**Response**:
```json
{
  "data": {
    "slide_id": "slide_001",
    "slide_number": 1,
    "title": "Introduction",
    "layout": "title_slide",
    "background": {
      "type": "solid",
      "color": "#FFFFFF"
    },
    "elements": [
      {
        "element_id": "elem_001",
        "type": "text",
        "content": "Welcome to Our Presentation",
        "position": {"x": 100, "y": 150},
        "size": {"width": 600, "height": 100},
        "style": {
          "font_family": "Arial",
          "font_size": 44,
          "font_color": "#000000",
          "bold": true,
          "italic": false,
          "text_align": "center"
        }
      },
      {
        "element_id": "elem_002",
        "type": "image",
        "image_url": "https://example.com/logo.png",
        "position": {"x": 50, "y": 50},
        "size": {"width": 200, "height": 100}
      }
    ],
    "notes": "Welcome slide with company branding"
  }
}
```

### Create Slide

Add a new slide to presentation.

**Endpoint**: `POST /presentations/{presentation_id}/slides`

**Request Body**:
```json
{
  "layout": "title_and_content",
  "position": 2,
  "elements": [
    {
      "type": "text",
      "content": "Key Features",
      "placeholder": "title"
    },
    {
      "type": "text",
      "content": "• Feature 1\n• Feature 2\n• Feature 3",
      "placeholder": "content"
    }
  ]
}
```

**Available Layouts**:
- `blank` - Blank slide
- `title_slide` - Title slide
- `title_and_content` - Title and content
- `section_header` - Section header
- `two_content` - Two columns
- `comparison` - Comparison layout
- `title_only` - Title only
- `content_with_caption` - Content with caption
- `picture_with_caption` - Picture with caption

**Response**:
```json
{
  "data": {
    "slide_id": "slide_003",
    "slide_number": 2,
    "layout": "title_and_content"
  },
  "message": "Slide created successfully"
}
```

### Update Slide

Update slide content and properties.

**Endpoint**: `PUT /presentations/{presentation_id}/slides/{slide_id}`

**Request Body**:
```json
{
  "title": "Updated Title",
  "elements": [
    {
      "element_id": "elem_001",
      "content": "Updated content"
    }
  ],
  "background": {
    "type": "gradient",
    "gradient_type": "linear",
    "colors": ["#4CAF50", "#2196F3"]
  }
}
```

**Response**:
```json
{
  "message": "Slide updated successfully"
}
```

### Delete Slide

Remove a slide from presentation.

**Endpoint**: `DELETE /presentations/{presentation_id}/slides/{slide_id}`

**Response**:
```json
{
  "message": "Slide deleted successfully"
}
```

### Duplicate Slide

Create a copy of a slide within the same presentation.

**Endpoint**: `POST /presentations/{presentation_id}/slides/{slide_id}/duplicate`

**Request Body**:
```json
{
  "position": 3
}
```

**Response**:
```json
{
  "data": {
    "slide_id": "slide_004",
    "slide_number": 3
  }
}
```

### Reorder Slides

Change the order of slides.

**Endpoint**: `PUT /presentations/{presentation_id}/slides/reorder`

**Request Body**:
```json
{
  "slide_order": ["slide_003", "slide_001", "slide_002", "slide_004"]
}
```

**Response**:
```json
{
  "message": "Slides reordered successfully"
}
```

### Add Elements to Slide

Add various elements to a slide.

**Endpoint**: `POST /presentations/{presentation_id}/slides/{slide_id}/elements`

**Text Element**:
```json
{
  "type": "text",
  "content": "This is a text box",
  "position": {"x": 200, "y": 300},
  "size": {"width": 400, "height": 100},
  "style": {
    "font_family": "Arial",
    "font_size": 18,
    "font_color": "#333333",
    "bold": false,
    "italic": false,
    "text_align": "left"
  }
}
```

**Image Element**:
```json
{
  "type": "image",
  "image_url": "https://example.com/image.jpg",
  "position": {"x": 100, "y": 200},
  "size": {"width": 500, "height": 300}
}
```

**Shape Element**:
```json
{
  "type": "shape",
  "shape_type": "rectangle",
  "position": {"x": 150, "y": 250},
  "size": {"width": 300, "height": 200},
  "fill_color": "#4CAF50",
  "border_color": "#2E7D32",
  "border_width": 2
}
```

**Chart Element**:
```json
{
  "type": "chart",
  "chart_type": "column",
  "data": {
    "categories": ["Q1", "Q2", "Q3", "Q4"],
    "series": [
      {
        "name": "Sales",
        "values": [100, 150, 120, 180]
      }
    ]
  },
  "position": {"x": 100, "y": 150},
  "size": {"width": 600, "height": 400}
}
```

**Table Element**:
```json
{
  "type": "table",
  "rows": 4,
  "columns": 3,
  "data": [
    ["Header 1", "Header 2", "Header 3"],
    ["Data 1", "Data 2", "Data 3"],
    ["Data 4", "Data 5", "Data 6"],
    ["Data 7", "Data 8", "Data 9"]
  ],
  "position": {"x": 100, "y": 200},
  "size": {"width": 600, "height": 300}
}
```

**Response**:
```json
{
  "data": {
    "element_id": "elem_005",
    "type": "text"
  },
  "message": "Element added successfully"
}
```

### Update Element

**Endpoint**: `PUT /presentations/{presentation_id}/slides/{slide_id}/elements/{element_id}`

**Request Body**:
```json
{
  "content": "Updated text content",
  "style": {
    "font_size": 24,
    "bold": true
  }
}
```

### Delete Element

**Endpoint**: `DELETE /presentations/{presentation_id}/slides/{slide_id}/elements/{element_id}`

---

## Themes and Design

### List Themes

Get available themes.

**Endpoint**: `GET /themes`

**Response**:
```json
{
  "data": [
    {
      "theme_id": "theme_001",
      "theme_name": "Modern Blue",
      "category": "Business",
      "thumbnail_url": "https://show.zoho.com/themes/thumb/theme_001.png",
      "colors": {
        "primary": "#2196F3",
        "secondary": "#1976D2",
        "accent": "#FFC107"
      }
    },
    {
      "theme_id": "theme_002",
      "theme_name": "Corporate Green",
      "category": "Business"
    }
  ]
}
```

### Get Theme

**Endpoint**: `GET /themes/{theme_id}`

**Response**:
```json
{
  "data": {
    "theme_id": "theme_001",
    "theme_name": "Modern Blue",
    "category": "Business",
    "colors": {
      "primary": "#2196F3",
      "secondary": "#1976D2",
      "accent": "#FFC107",
      "background": "#FFFFFF",
      "text": "#333333"
    },
    "fonts": {
      "heading": "Arial",
      "body": "Helvetica"
    },
    "slide_layouts": [
      "title_slide",
      "title_and_content",
      "two_content",
      "comparison"
    ]
  }
}
```

### Apply Theme

Apply a theme to presentation.

**Endpoint**: `PUT /presentations/{presentation_id}/theme`

**Request Body**:
```json
{
  "theme_id": "theme_001"
}
```

**Response**:
```json
{
  "message": "Theme applied successfully"
}
```

### Custom Master Slides

**Endpoint**: `POST /presentations/{presentation_id}/master-slides`

**Request Body**:
```json
{
  "name": "Custom Layout",
  "background": {
    "type": "gradient",
    "gradient_type": "radial",
    "colors": ["#E3F2FD", "#BBDEFB"]
  },
  "elements": [
    {
      "type": "text",
      "placeholder": "title",
      "position": {"x": 100, "y": 50},
      "size": {"width": 700, "height": 80},
      "style": {
        "font_size": 36,
        "font_color": "#1976D2"
      }
    }
  ]
}
```

---

## Office Integrator

Office Integrator enables embedding Zoho Show editor in your application.

### Create Editor Session

**Endpoint**: `POST /show/presentation/create`

**Request**:
```http
POST https://api.office-integrator.com/v1/show/presentation/create
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "presentation": {
    "presentation_name": "Untitled Presentation"
  },
  "editor_settings": {
    "language": "en",
    "toolbar": ["bold", "italic", "underline", "insert_image"],
    "show_slide_panel": true
  },
  "permissions": {
    "presentation.edit": true,
    "presentation.export": true,
    "presentation.print": true,
    "presentation.download": true,
    "comment.add": true,
    "slide.add": true,
    "slide.delete": true
  },
  "callback_settings": {
    "save_url": "https://yourapp.com/api/save",
    "save_format": "zpw"
  }
}
```

**Response**:
```json
{
  "presentation_id": "pres_jkl012mno345",
  "session_id": "session_abc123",
  "session_url": "https://show.zoho.com/show/officeintegrator/pres_jkl012mno345?session_id=session_abc123",
  "session_delete_url": "https://api.office-integrator.com/v1/show/session/session_abc123",
  "presentation_delete_url": "https://api.office-integrator.com/v1/show/presentation/pres_jkl012mno345",
  "expires_in": 3600
}
```

### Edit Existing Presentation

**Endpoint**: `POST /show/presentation/edit`

**Request Body**:
```json
{
  "presentation": {
    "presentation_id": "pres_abc123xyz789",
    "mode": "edit"
  },
  "editor_settings": {
    "language": "en"
  },
  "permissions": {
    "presentation.edit": true,
    "presentation.export": true
  },
  "callback_settings": {
    "save_url": "https://yourapp.com/api/save"
  }
}
```

### Presentation Mode

**Endpoint**: `POST /show/presentation/present`

**Request Body**:
```json
{
  "presentation": {
    "presentation_id": "pres_abc123xyz789"
  },
  "presenter_settings": {
    "auto_play": false,
    "loop": false,
    "show_controls": true,
    "start_slide": 1
  },
  "user": {
    "user_id": "user_123",
    "display_name": "John Doe"
  }
}
```

**Response**:
```json
{
  "presentation_id": "pres_abc123xyz789",
  "presentation_url": "https://show.zoho.com/show/present/pres_abc123xyz789",
  "embed_url": "https://show.zoho.com/embed/pres_abc123xyz789"
}
```

### Co-Editing Session

**Request Body**:
```json
{
  "presentation": {
    "presentation_id": "pres_abc123xyz789"
  },
  "editor_settings": {
    "collaborative_editing": "enabled",
    "presence": "show"
  },
  "user": {
    "user_id": "user_123",
    "display_name": "Jane Smith",
    "email": "jane@example.com",
    "avatar_url": "https://example.com/avatar.jpg"
  },
  "permissions": {
    "presentation.edit": true,
    "comment.add": true
  }
}
```

---

## Collaboration

### Share Presentation

Share presentation with users or groups.

**Endpoint**: `POST /presentations/{presentation_id}/share`

**Request Body**:
```json
{
  "users": [
    {
      "email": "collaborator@example.com",
      "permission": "edit",
      "notify": true
    },
    {
      "email": "viewer@example.com",
      "permission": "view",
      "notify": true
    }
  ],
  "message": "Please review this presentation",
  "allow_download": true,
  "allow_print": true
}
```

**Permissions**:
- `view` - View only
- `edit` - Edit presentation
- `comment` - Add comments only

**Response**:
```json
{
  "data": [
    {
      "email": "collaborator@example.com",
      "permission": "edit",
      "share_id": "share_001",
      "status": "invited"
    }
  ],
  "message": "Presentation shared successfully"
}
```

### Public Link

Generate public sharing link.

**Endpoint**: `POST /presentations/{presentation_id}/public-link`

**Request Body**:
```json
{
  "permission": "view",
  "password": "secure123",
  "expiry_date": "2025-02-15T23:59:59Z",
  "allow_download": false
}
```

**Response**:
```json
{
  "data": {
    "public_url": "https://show.zoho.com/public/pres_abc123xyz789",
    "embed_url": "https://show.zoho.com/embed/pres_abc123xyz789",
    "link_id": "link_001",
    "expires_at": "2025-02-15T23:59:59Z"
  }
}
```

### Comments

**Add Comment**:
```http
POST /presentations/{presentation_id}/slides/{slide_id}/comments
```

**Request Body**:
```json
{
  "comment_text": "Great slide! Consider adding more data",
  "position": {
    "x": 250,
    "y": 300
  },
  "mention_users": ["user_456"]
}
```

**Response**:
```json
{
  "data": {
    "comment_id": "comment_001",
    "comment_text": "Great slide! Consider adding more data",
    "author": {
      "user_id": "user_123",
      "name": "John Doe"
    },
    "created_time": "2025-01-17T12:30:00Z"
  }
}
```

**List Comments**:
```http
GET /presentations/{presentation_id}/slides/{slide_id}/comments
```

**Delete Comment**:
```http
DELETE /presentations/{presentation_id}/slides/{slide_id}/comments/{comment_id}
```

---

## Media Management

### Upload Image

Upload image for use in presentation.

**Endpoint**: `POST /presentations/{presentation_id}/media/upload`

**Request**:
```http
POST https://www.zohoapis.com/show/api/v1/presentations/pres_abc123/media/upload
Authorization: Zoho-oauthtoken {access_token}
Content-Type: multipart/form-data

file={binary_data}
```

**Response**:
```json
{
  "data": {
    "media_id": "media_001",
    "media_url": "https://show.zoho.com/media/pres_abc123/media_001.jpg",
    "media_type": "image",
    "file_size": 524288,
    "dimensions": {
      "width": 1920,
      "height": 1080
    }
  }
}
```

### List Media

**Endpoint**: `GET /presentations/{presentation_id}/media`

**Response**:
```json
{
  "data": [
    {
      "media_id": "media_001",
      "media_url": "https://show.zoho.com/media/pres_abc123/media_001.jpg",
      "media_type": "image",
      "file_size": 524288
    }
  ]
}
```

### Delete Media

**Endpoint**: `DELETE /presentations/{presentation_id}/media/{media_id}`

---

## Rate Limits

### API Rate Limits

| Tier | Requests per Minute | Daily Limit |
|------|---------------------|-------------|
| Free | 20 | 1,000 |
| Standard | 60 | 10,000 |
| Professional | 120 | 50,000 |
| Enterprise | 300 | 200,000 |

### Rate Limit Headers

```http
X-RateLimit-Limit: 120
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705587600
```

---

## Error Codes

### Common HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created |
| 204 | No Content | Request successful, no content |
| 400 | Bad Request | Invalid parameters |
| 401 | Unauthorized | Invalid access token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Error Response Format

```json
{
  "code": "PRESENTATION_NOT_FOUND",
  "message": "The presentation does not exist",
  "details": {
    "presentation_id": "pres_invalid"
  }
}
```

### Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| INVALID_TOKEN | Invalid access token | Refresh token |
| PRESENTATION_NOT_FOUND | Presentation not found | Verify presentation ID |
| SLIDE_NOT_FOUND | Slide not found | Verify slide ID |
| PERMISSION_DENIED | Insufficient permissions | Check permissions |
| INVALID_LAYOUT | Invalid slide layout | Use valid layout |
| QUOTA_EXCEEDED | Storage quota exceeded | Upgrade or clean up |

---

## Code Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

class ZohoShowClient {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseURL = 'https://www.zohoapis.com/show/api/v1';
  }

  async request(method, endpoint, data = null) {
    const config = {
      method,
      url: `${this.baseURL}${endpoint}`,
      headers: {
        'Authorization': `Zoho-oauthtoken ${this.accessToken}`,
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      config.data = data;
    }

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      throw new Error(`API Error: ${error.response?.data?.message || error.message}`);
    }
  }

  async listPresentations(options = {}) {
    const params = new URLSearchParams(options).toString();
    const endpoint = params ? `/presentations?${params}` : '/presentations';
    return await this.request('GET', endpoint);
  }

  async createPresentation(presentationData) {
    return await this.request('POST', '/presentations', presentationData);
  }

  async getPresentation(presentationId) {
    return await this.request('GET', `/presentations/${presentationId}`);
  }

  async createSlide(presentationId, slideData) {
    return await this.request('POST', `/presentations/${presentationId}/slides`, slideData);
  }

  async addElement(presentationId, slideId, elementData) {
    return await this.request('POST',
      `/presentations/${presentationId}/slides/${slideId}/elements`,
      elementData
    );
  }

  async sharePresentation(presentationId, shareData) {
    return await this.request('POST',
      `/presentations/${presentationId}/share`,
      shareData
    );
  }
}

// Usage
const client = new ZohoShowClient('1000.xxx.xxx');

// Create presentation
client.createPresentation({
  presentation_name: 'Company Overview.zpw',
  theme_id: 'theme_001',
  slides: [
    {
      layout: 'title_slide',
      elements: [
        {
          type: 'text',
          content: 'Company Overview 2025',
          placeholder: 'title'
        }
      ]
    }
  ]
})
  .then(response => {
    console.log('Created:', response.data);
  });

// Add slide
client.createSlide('pres_abc123', {
  layout: 'title_and_content',
  elements: [
    {
      type: 'text',
      content: 'Key Features',
      placeholder: 'title'
    }
  ]
})
  .then(response => {
    console.log('Slide created:', response.data.slide_id);
  });
```

### Python

```python
import requests

class ZohoShowClient:
    def __init__(self, access_token):
        self.access_token = access_token
        self.base_url = 'https://www.zohoapis.com/show/api/v1'
        self.headers = {
            'Authorization': f'Zoho-oauthtoken {access_token}',
            'Content-Type': 'application/json'
        }

    def request(self, method, endpoint, data=None):
        url = f'{self.base_url}{endpoint}'

        try:
            if method == 'GET':
                response = requests.get(url, headers=self.headers)
            elif method == 'POST':
                response = requests.post(url, headers=self.headers, json=data)
            elif method == 'PUT':
                response = requests.put(url, headers=self.headers, json=data)
            elif method == 'DELETE':
                response = requests.delete(url, headers=self.headers)

            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f'API Error: {str(e)}')

    def list_presentations(self, **kwargs):
        params = '&'.join([f'{k}={v}' for k, v in kwargs.items()])
        endpoint = f'/presentations?{params}' if params else '/presentations'
        return self.request('GET', endpoint)

    def create_presentation(self, presentation_data):
        return self.request('POST', '/presentations', presentation_data)

# Usage
client = ZohoShowClient('1000.xxx.xxx')

response = client.create_presentation({
    'presentation_name': 'Company Overview.zpw',
    'theme_id': 'theme_001',
    'slides': [
        {
            'layout': 'title_slide',
            'elements': [
                {
                    'type': 'text',
                    'content': 'Company Overview 2025',
                    'placeholder': 'title'
                }
            ]
        }
    ]
})
print('Created:', response['data'])
```

### Deluge

```deluge
accessToken = "1000.xxx.xxx";

// Create presentation
presentationData = {
    "presentation_name": "Company Overview.zpw",
    "theme_id": "theme_001",
    "slides": [
        {
            "layout": "title_slide",
            "elements": [
                {
                    "type": "text",
                    "content": "Company Overview 2025",
                    "placeholder": "title"
                }
            ]
        }
    ]
};

response = invokeurl
[
    url: "https://www.zohoapis.com/show/api/v1/presentations"
    type: POST
    parameters: presentationData.toString()
    headers: {"Authorization": "Zoho-oauthtoken " + accessToken}
];

presentationId = response.get("data").get("presentation_id");
info "Created presentation: " + presentationId;

// Add slide
slideData = {
    "layout": "title_and_content",
    "elements": [
        {
            "type": "text",
            "content": "Key Features",
            "placeholder": "title"
        }
    ]
};

response = invokeurl
[
    url: "https://www.zohoapis.com/show/api/v1/presentations/" + presentationId + "/slides"
    type: POST
    parameters: slideData.toString()
    headers: {"Authorization": "Zoho-oauthtoken " + accessToken}
];

info "Slide created: " + response.get("data").get("slide_id");
```

---

## Best Practices

1. **Reuse Themes**: Use predefined themes for consistency
2. **Optimize Images**: Compress images before upload
3. **Batch Operations**: Create multiple slides in single request
4. **Cache Data**: Cache theme and layout information
5. **Webhooks**: Use webhooks for collaboration events

---

## Support and Resources

- **API Documentation**: https://www.zoho.com/show/help/api/
- **Developer Forum**: https://help.zoho.com/portal/community
- **API Console**: https://api-console.zoho.com/
- **Status Page**: https://status.zoho.com/

---

**Last Updated**: January 2025
**API Version**: v1
