# Zoho Sheet API Reference

## Overview

Zoho Sheet is a powerful online spreadsheet application that enables data organization, analysis, and visualization. The Sheet API provides programmatic access to spreadsheet operations, cell manipulation, formulas, data import/export, and collaboration features.

**Current API Version**: v1
**Base URL**: `https://www.zohoapis.com/sheet/api/v1/`
**Office Integrator URL**: `https://api.office-integrator.com/v1/`
**Protocol**: REST
**Data Format**: JSON
**Authentication**: OAuth 2.0

---

## Quick Links

- [Authentication](#authentication)
- [Workbooks API](#workbooks-api)
- [Worksheets API](#worksheets-api)
- [Cell Operations](#cell-operations)
- [Formulas and Functions](#formulas-and-functions)
- [Data Manipulation](#data-manipulation)
- [Office Integrator](#office-integrator)
- [Charts and Visualization](#charts-and-visualization)
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
  scope=ZohoSheet.dataAPI.ALL,ZohoSheet.spreadsheets.ALL&
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
- `ZohoSheet.spreadsheets.ALL` - Full spreadsheet access
- `ZohoSheet.spreadsheets.READ` - Read-only access
- `ZohoSheet.spreadsheets.CREATE` - Create spreadsheets
- `ZohoSheet.spreadsheets.UPDATE` - Update spreadsheets
- `ZohoSheet.spreadsheets.DELETE` - Delete spreadsheets
- `ZohoSheet.dataAPI.ALL` - Full data API access
- `ZohoSheet.dataAPI.READ` - Read cell data
- `ZohoSheet.dataAPI.UPDATE` - Update cell data

---

## Workbooks API

### List Workbooks

Retrieve all spreadsheets from your Zoho Sheet account.

**Endpoint**: `GET /workbooks`

**Query Parameters**:
- `page` (integer): Page number (default: 1)
- `per_page` (integer): Results per page, max 200 (default: 50)
- `sort_by` (string): Sort field - `name`, `created_time`, `modified_time`
- `sort_order` (string): `asc` or `desc`
- `folder_id` (string): Filter by folder ID
- `search` (string): Search by name

**Request**:
```http
GET https://www.zohoapis.com/sheet/api/v1/workbooks?page=1&per_page=50
Authorization: Zoho-oauthtoken {access_token}
```

**Response**:
```json
{
  "data": [
    {
      "workbook_id": "wb_abc123xyz789",
      "workbook_name": "Sales Data 2025.xlsx",
      "workbook_url": "https://sheet.zoho.com/sheet/open/wb_abc123xyz789",
      "created_time": "2025-01-15T10:30:00Z",
      "modified_time": "2025-01-16T14:20:00Z",
      "owner": {
        "user_id": "12345",
        "email": "user@example.com",
        "name": "John Doe"
      },
      "folder_id": "folder_001",
      "file_size": 524288,
      "worksheet_count": 3,
      "status": "active"
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

### Get Workbook

Retrieve details of a specific workbook.

**Endpoint**: `GET /workbooks/{workbook_id}`

**Request**:
```http
GET https://www.zohoapis.com/sheet/api/v1/workbooks/wb_abc123xyz789
Authorization: Zoho-oauthtoken {access_token}
```

**Response**:
```json
{
  "data": {
    "workbook_id": "wb_abc123xyz789",
    "workbook_name": "Sales Data 2025.xlsx",
    "workbook_url": "https://sheet.zoho.com/sheet/open/wb_abc123xyz789",
    "created_time": "2025-01-15T10:30:00Z",
    "modified_time": "2025-01-16T14:20:00Z",
    "owner": {
      "user_id": "12345",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "worksheets": [
      {
        "worksheet_id": "ws_001",
        "worksheet_name": "Q1 Sales",
        "index": 0,
        "row_count": 1000,
        "column_count": 26
      },
      {
        "worksheet_id": "ws_002",
        "worksheet_name": "Q2 Sales",
        "index": 1,
        "row_count": 1000,
        "column_count": 26
      }
    ],
    "shared_with": [
      {
        "user_id": "67890",
        "email": "collaborator@example.com",
        "permission": "edit"
      }
    ],
    "file_size": 524288
  }
}
```

### Create Workbook

Create a new spreadsheet.

**Endpoint**: `POST /workbooks`

**Request Body**:
```json
{
  "workbook_name": "New Spreadsheet.xlsx",
  "worksheets": [
    {
      "worksheet_name": "Sheet1",
      "row_count": 1000,
      "column_count": 26
    }
  ],
  "folder_id": "folder_001",
  "tags": ["finance", "2025"]
}
```

**Response**:
```json
{
  "data": {
    "workbook_id": "wb_def456uvw123",
    "workbook_name": "New Spreadsheet.xlsx",
    "workbook_url": "https://sheet.zoho.com/sheet/open/wb_def456uvw123",
    "created_time": "2025-01-17T09:15:00Z",
    "worksheets": [
      {
        "worksheet_id": "ws_003",
        "worksheet_name": "Sheet1",
        "index": 0
      }
    ]
  },
  "message": "Workbook created successfully"
}
```

### Update Workbook

Update workbook metadata.

**Endpoint**: `PUT /workbooks/{workbook_id}`

**Request Body**:
```json
{
  "workbook_name": "Sales Data 2025 - Updated.xlsx"
}
```

**Response**:
```json
{
  "data": {
    "workbook_id": "wb_abc123xyz789",
    "modified_time": "2025-01-17T10:30:00Z"
  },
  "message": "Workbook updated successfully"
}
```

### Delete Workbook

Move workbook to trash or permanently delete.

**Endpoint**: `DELETE /workbooks/{workbook_id}`

**Query Parameters**:
- `permanent` (boolean): Permanently delete (default: false)

**Request**:
```http
DELETE https://www.zohoapis.com/sheet/api/v1/workbooks/wb_abc123xyz789
Authorization: Zoho-oauthtoken {access_token}
```

**Response**:
```json
{
  "message": "Workbook moved to trash successfully"
}
```

### Download Workbook

Export workbook in various formats.

**Endpoint**: `GET /workbooks/{workbook_id}/download`

**Query Parameters**:
- `format` (string): Export format - `xlsx`, `csv`, `pdf`, `ods`, `html`

**Request**:
```http
GET https://www.zohoapis.com/sheet/api/v1/workbooks/wb_abc123xyz789/download?format=xlsx
Authorization: Zoho-oauthtoken {access_token}
```

**Response**: Binary file stream

### Upload Workbook

Upload a spreadsheet from local file.

**Endpoint**: `POST /workbooks/upload`

**Request**:
```http
POST https://www.zohoapis.com/sheet/api/v1/workbooks/upload
Authorization: Zoho-oauthtoken {access_token}
Content-Type: multipart/form-data

file={binary_data}
workbook_name=Sales Data.xlsx
folder_id=folder_001
```

**Response**:
```json
{
  "data": {
    "workbook_id": "wb_ghi789rst456",
    "workbook_name": "Sales Data.xlsx",
    "workbook_url": "https://sheet.zoho.com/sheet/open/wb_ghi789rst456",
    "created_time": "2025-01-17T11:00:00Z"
  },
  "message": "Workbook uploaded successfully"
}
```

---

## Worksheets API

### List Worksheets

Get all worksheets in a workbook.

**Endpoint**: `GET /workbooks/{workbook_id}/worksheets`

**Response**:
```json
{
  "data": [
    {
      "worksheet_id": "ws_001",
      "worksheet_name": "Q1 Sales",
      "index": 0,
      "row_count": 1000,
      "column_count": 26,
      "is_hidden": false,
      "tab_color": "#FF5733"
    },
    {
      "worksheet_id": "ws_002",
      "worksheet_name": "Q2 Sales",
      "index": 1,
      "row_count": 1000,
      "column_count": 26,
      "is_hidden": false
    }
  ]
}
```

### Get Worksheet

Get details of a specific worksheet.

**Endpoint**: `GET /workbooks/{workbook_id}/worksheets/{worksheet_id}`

**Response**:
```json
{
  "data": {
    "worksheet_id": "ws_001",
    "worksheet_name": "Q1 Sales",
    "index": 0,
    "row_count": 1000,
    "column_count": 26,
    "is_hidden": false,
    "grid_lines": true,
    "frozen_rows": 1,
    "frozen_columns": 0,
    "default_row_height": 20,
    "default_column_width": 100
  }
}
```

### Create Worksheet

Add a new worksheet to workbook.

**Endpoint**: `POST /workbooks/{workbook_id}/worksheets`

**Request Body**:
```json
{
  "worksheet_name": "Q3 Sales",
  "row_count": 1000,
  "column_count": 26,
  "index": 2
}
```

**Response**:
```json
{
  "data": {
    "worksheet_id": "ws_003",
    "worksheet_name": "Q3 Sales",
    "index": 2
  },
  "message": "Worksheet created successfully"
}
```

### Update Worksheet

Update worksheet properties.

**Endpoint**: `PUT /workbooks/{workbook_id}/worksheets/{worksheet_id}`

**Request Body**:
```json
{
  "worksheet_name": "Q1 Sales - Final",
  "is_hidden": false,
  "tab_color": "#4CAF50"
}
```

**Response**:
```json
{
  "message": "Worksheet updated successfully"
}
```

### Delete Worksheet

Delete a worksheet from workbook.

**Endpoint**: `DELETE /workbooks/{workbook_id}/worksheets/{worksheet_id}`

**Response**:
```json
{
  "message": "Worksheet deleted successfully"
}
```

### Copy Worksheet

Duplicate a worksheet within the same workbook or to another workbook.

**Endpoint**: `POST /workbooks/{workbook_id}/worksheets/{worksheet_id}/copy`

**Request Body**:
```json
{
  "new_name": "Q1 Sales - Copy",
  "target_workbook_id": "wb_abc123xyz789",
  "index": 3
}
```

**Response**:
```json
{
  "data": {
    "worksheet_id": "ws_004",
    "worksheet_name": "Q1 Sales - Copy"
  }
}
```

---

## Cell Operations

### Get Cell Data

Retrieve data from specific cells or ranges.

**Endpoint**: `GET /workbooks/{workbook_id}/worksheets/{worksheet_id}/data`

**Query Parameters**:
- `range` (string): Cell range in A1 notation (e.g., "A1:D10")

**Request**:
```http
GET https://www.zohoapis.com/sheet/api/v1/workbooks/wb_abc123/worksheets/ws_001/data?range=A1:D10
Authorization: Zoho-oauthtoken {access_token}
```

**Response**:
```json
{
  "data": {
    "range": "A1:D10",
    "values": [
      ["Product", "Price", "Quantity", "Total"],
      ["Widget A", 25.50, 100, 2550],
      ["Widget B", 30.00, 150, 4500],
      ["Widget C", 15.75, 200, 3150]
    ],
    "formats": [
      [{"bold": true}, {"bold": true}, {"bold": true}, {"bold": true}],
      [{}, {"number_format": "$#,##0.00"}, {}, {"number_format": "$#,##0.00"}]
    ]
  }
}
```

### Update Cell Data

Update data in specific cells or ranges.

**Endpoint**: `PUT /workbooks/{workbook_id}/worksheets/{worksheet_id}/data`

**Request Body**:
```json
{
  "range": "A1:D3",
  "values": [
    ["Product", "Price", "Quantity", "Total"],
    ["Widget A", 25.50, 100, "=B2*C2"],
    ["Widget B", 30.00, 150, "=B3*C3"]
  ]
}
```

**Response**:
```json
{
  "data": {
    "updated_range": "A1:D3",
    "updated_cells": 12
  },
  "message": "Data updated successfully"
}
```

### Append Data

Append rows to the end of a worksheet.

**Endpoint**: `POST /workbooks/{workbook_id}/worksheets/{worksheet_id}/data/append`

**Request Body**:
```json
{
  "values": [
    ["Widget D", 20.00, 175, "=B2*C2"],
    ["Widget E", 35.00, 90, "=B3*C3"]
  ]
}
```

**Response**:
```json
{
  "data": {
    "appended_range": "A5:D6",
    "appended_rows": 2
  },
  "message": "Data appended successfully"
}
```

### Clear Cell Data

Clear data from cells while preserving formatting.

**Endpoint**: `DELETE /workbooks/{workbook_id}/worksheets/{worksheet_id}/data`

**Query Parameters**:
- `range` (string): Cell range to clear

**Request**:
```http
DELETE https://www.zohoapis.com/sheet/api/v1/workbooks/wb_abc123/worksheets/ws_001/data?range=A1:D10
Authorization: Zoho-oauthtoken {access_token}
```

**Response**:
```json
{
  "message": "Data cleared successfully"
}
```

### Format Cells

Apply formatting to cells.

**Endpoint**: `PUT /workbooks/{workbook_id}/worksheets/{worksheet_id}/format`

**Request Body**:
```json
{
  "range": "A1:D1",
  "format": {
    "bold": true,
    "font_size": 14,
    "font_color": "#FFFFFF",
    "background_color": "#4CAF50",
    "horizontal_align": "center",
    "vertical_align": "middle"
  }
}
```

**Response**:
```json
{
  "message": "Format applied successfully"
}
```

### Merge Cells

Merge cell ranges.

**Endpoint**: `POST /workbooks/{workbook_id}/worksheets/{worksheet_id}/merge`

**Request Body**:
```json
{
  "range": "A1:D1",
  "merge_type": "all"
}
```

**Merge Types**:
- `all` - Merge all cells
- `horizontal` - Merge horizontally
- `vertical` - Merge vertically

**Response**:
```json
{
  "message": "Cells merged successfully"
}
```

### Insert Rows/Columns

**Endpoint**: `POST /workbooks/{workbook_id}/worksheets/{worksheet_id}/insert`

**Request Body**:
```json
{
  "dimension": "rows",
  "start_index": 5,
  "count": 3
}
```

**Parameters**:
- `dimension`: `rows` or `columns`
- `start_index`: Starting position (0-based)
- `count`: Number to insert

**Response**:
```json
{
  "message": "3 rows inserted at position 5"
}
```

### Delete Rows/Columns

**Endpoint**: `POST /workbooks/{workbook_id}/worksheets/{worksheet_id}/delete`

**Request Body**:
```json
{
  "dimension": "rows",
  "start_index": 5,
  "count": 3
}
```

**Response**:
```json
{
  "message": "3 rows deleted from position 5"
}
```

---

## Formulas and Functions

### Set Formula

**Request**:
```json
{
  "range": "D2",
  "values": [["=SUM(B2:C2)"]]
}
```

### Common Formula Examples

**Mathematical Operations**:
```json
{
  "range": "E2:E10",
  "values": [
    ["=B2*C2"],
    ["=SUM(B2:D2)"],
    ["=AVERAGE(B2:B10)"],
    ["=MAX(B2:B10)"],
    ["=MIN(B2:B10)"],
    ["=ROUND(B2, 2)"],
    ["=ABS(B2)"],
    ["=POWER(B2, 2)"],
    ["=SQRT(B2)"]
  ]
}
```

**Text Functions**:
```json
{
  "range": "F2:F6",
  "values": [
    ["=CONCATENATE(A2, \" \", B2)"],
    ["=UPPER(A2)"],
    ["=LOWER(A2)"],
    ["=TRIM(A2)"],
    ["=LEN(A2)"]
  ]
}
```

**Date Functions**:
```json
{
  "range": "G2:G5",
  "values": [
    ["=TODAY()"],
    ["=NOW()"],
    ["=DATE(2025, 1, 15)"],
    ["=DATEDIF(A2, B2, \"D\")"]
  ]
}
```

**Logical Functions**:
```json
{
  "range": "H2:H4",
  "values": [
    ["=IF(B2>100, \"High\", \"Low\")"],
    ["=AND(B2>50, C2<100)"],
    ["=OR(B2>100, C2>200)"]
  ]
}
```

**Lookup Functions**:
```json
{
  "range": "I2:I3",
  "values": [
    ["=VLOOKUP(A2, Data!A:D, 3, FALSE)"],
    ["=INDEX(Data!C:C, MATCH(A2, Data!A:A, 0))"]
  ]
}
```

### Named Ranges

**Create Named Range**:
```http
POST /workbooks/{workbook_id}/named-ranges
```

**Request Body**:
```json
{
  "name": "SalesData",
  "worksheet_id": "ws_001",
  "range": "A1:D100"
}
```

**Use Named Range in Formula**:
```json
{
  "range": "E2",
  "values": [["=SUM(SalesData)"]]
}
```

---

## Data Manipulation

### Sort Data

Sort data in a range.

**Endpoint**: `POST /workbooks/{workbook_id}/worksheets/{worksheet_id}/sort`

**Request Body**:
```json
{
  "range": "A2:D100",
  "sort_specs": [
    {
      "column": 1,
      "order": "desc"
    },
    {
      "column": 0,
      "order": "asc"
    }
  ],
  "has_headers": false
}
```

**Response**:
```json
{
  "message": "Data sorted successfully"
}
```

### Filter Data

Apply filters to data range.

**Endpoint**: `POST /workbooks/{workbook_id}/worksheets/{worksheet_id}/filter`

**Request Body**:
```json
{
  "range": "A1:D100",
  "filters": [
    {
      "column": 1,
      "condition": "greater_than",
      "value": 100
    },
    {
      "column": 0,
      "condition": "contains",
      "value": "Widget"
    }
  ]
}
```

**Filter Conditions**:
- `equals`, `not_equals`
- `greater_than`, `less_than`
- `greater_than_or_equal`, `less_than_or_equal`
- `contains`, `not_contains`
- `begins_with`, `ends_with`
- `is_empty`, `is_not_empty`

**Response**:
```json
{
  "data": {
    "filtered_range": "A1:D100",
    "visible_rows": 25
  }
}
```

### Pivot Tables

Create pivot table from data.

**Endpoint**: `POST /workbooks/{workbook_id}/worksheets/{worksheet_id}/pivot-tables`

**Request Body**:
```json
{
  "source_range": "A1:E100",
  "destination_worksheet_id": "ws_002",
  "destination_cell": "A1",
  "rows": ["Product", "Category"],
  "columns": ["Quarter"],
  "values": [
    {
      "field": "Sales",
      "function": "sum"
    }
  ]
}
```

**Response**:
```json
{
  "data": {
    "pivot_table_id": "pt_001",
    "destination_range": "ws_002!A1:F20"
  }
}
```

### Data Validation

Add validation rules to cells.

**Endpoint**: `POST /workbooks/{workbook_id}/worksheets/{worksheet_id}/validation`

**Request Body**:
```json
{
  "range": "B2:B100",
  "validation": {
    "type": "number",
    "condition": "between",
    "minimum": 0,
    "maximum": 1000,
    "show_dropdown": true,
    "error_message": "Value must be between 0 and 1000"
  }
}
```

**Validation Types**:
- `number` - Numeric validation
- `text` - Text validation
- `list` - Dropdown list
- `date` - Date validation
- `custom` - Custom formula

**List Validation Example**:
```json
{
  "range": "C2:C100",
  "validation": {
    "type": "list",
    "values": ["Red", "Green", "Blue", "Yellow"],
    "show_dropdown": true
  }
}
```

### Find and Replace

**Endpoint**: `POST /workbooks/{workbook_id}/worksheets/{worksheet_id}/find-replace`

**Request Body**:
```json
{
  "find": "Widget",
  "replace": "Product",
  "range": "A1:D100",
  "match_case": false,
  "match_entire_cell": false
}
```

**Response**:
```json
{
  "data": {
    "replacements": 15,
    "affected_cells": ["A2", "A5", "A8", "A12"]
  }
}
```

---

## Office Integrator

Office Integrator enables embedding Zoho Sheet editor in your application.

### Create Editor Session

**Endpoint**: `POST /sheet/workbook/create`

**Request**:
```http
POST https://api.office-integrator.com/v1/sheet/workbook/create
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "workbook": {
    "workbook_name": "Untitled Spreadsheet"
  },
  "editor_settings": {
    "language": "en",
    "toolbar": ["bold", "italic", "underline", "formula"],
    "show_formula_bar": true,
    "show_sheet_tabs": true
  },
  "permissions": {
    "workbook.edit": true,
    "workbook.export": true,
    "workbook.print": true,
    "comment.add": true,
    "sheet.add": true,
    "sheet.delete": true
  },
  "callback_settings": {
    "save_url": "https://yourapp.com/api/save",
    "save_format": "xlsx"
  }
}
```

**Response**:
```json
{
  "workbook_id": "wb_jkl012mno345",
  "session_id": "session_abc123",
  "session_url": "https://sheet.zoho.com/sheet/officeintegrator/wb_jkl012mno345?session_id=session_abc123",
  "session_delete_url": "https://api.office-integrator.com/v1/sheet/session/session_abc123",
  "workbook_delete_url": "https://api.office-integrator.com/v1/sheet/workbook/wb_jkl012mno345",
  "expires_in": 3600
}
```

### Edit Existing Workbook

**Endpoint**: `POST /sheet/workbook/edit`

**Request Body**:
```json
{
  "workbook": {
    "workbook_id": "wb_abc123xyz789",
    "mode": "edit"
  },
  "editor_settings": {
    "language": "en"
  },
  "permissions": {
    "workbook.edit": true,
    "workbook.export": true
  },
  "callback_settings": {
    "save_url": "https://yourapp.com/api/save"
  }
}
```

### View-Only Mode

**Request Body**:
```json
{
  "workbook": {
    "workbook_id": "wb_abc123xyz789",
    "mode": "view"
  },
  "permissions": {
    "workbook.edit": false,
    "workbook.export": true,
    "workbook.print": true
  }
}
```

### Co-Editing Session

**Request Body**:
```json
{
  "workbook": {
    "workbook_id": "wb_abc123xyz789"
  },
  "editor_settings": {
    "collaborative_editing": "enabled",
    "presence": "show"
  },
  "user": {
    "user_id": "user_123",
    "display_name": "Jane Smith",
    "email": "jane@example.com"
  },
  "permissions": {
    "workbook.edit": true,
    "comment.add": true
  }
}
```

---

## Charts and Visualization

### Create Chart

**Endpoint**: `POST /workbooks/{workbook_id}/worksheets/{worksheet_id}/charts`

**Request Body**:
```json
{
  "chart_type": "column",
  "data_range": "A1:D10",
  "position": {
    "worksheet_id": "ws_001",
    "cell": "F2"
  },
  "title": "Sales by Product",
  "x_axis_title": "Products",
  "y_axis_title": "Sales ($)",
  "legend_position": "bottom",
  "width": 600,
  "height": 400
}
```

**Chart Types**:
- `column`, `bar`, `line`, `area`
- `pie`, `doughnut`
- `scatter`, `bubble`
- `combo`

**Response**:
```json
{
  "data": {
    "chart_id": "chart_001",
    "position": "ws_001!F2"
  }
}
```

### Update Chart

**Endpoint**: `PUT /workbooks/{workbook_id}/worksheets/{worksheet_id}/charts/{chart_id}`

**Request Body**:
```json
{
  "title": "Updated Sales Chart",
  "chart_type": "bar"
}
```

### Delete Chart

**Endpoint**: `DELETE /workbooks/{workbook_id}/worksheets/{worksheet_id}/charts/{chart_id}`

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

### Handling Rate Limits

**Response (429)**:
```json
{
  "code": "RATE_LIMIT_EXCEEDED",
  "message": "API rate limit exceeded",
  "details": {
    "retry_after": 45
  }
}
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
| 409 | Conflict | Resource conflict |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Error Response Format

```json
{
  "code": "INVALID_RANGE",
  "message": "The specified range is invalid",
  "details": {
    "range": "A1:Z100000",
    "max_rows": 65536
  }
}
```

### Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| INVALID_TOKEN | Invalid access token | Refresh token |
| INVALID_RANGE | Invalid cell range | Check range format |
| PERMISSION_DENIED | Insufficient permissions | Check permissions |
| WORKBOOK_NOT_FOUND | Workbook not found | Verify workbook ID |
| WORKSHEET_NOT_FOUND | Worksheet not found | Verify worksheet ID |
| FORMULA_ERROR | Invalid formula | Check formula syntax |
| DATA_VALIDATION_ERROR | Data validation failed | Check validation rules |
| QUOTA_EXCEEDED | Storage quota exceeded | Upgrade or clean up |

---

## Code Examples

### JavaScript/Node.js

**Initialize Client**:
```javascript
const axios = require('axios');

class ZohoSheetClient {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseURL = 'https://www.zohoapis.com/sheet/api/v1';
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

  // List workbooks
  async listWorkbooks(options = {}) {
    const params = new URLSearchParams(options).toString();
    const endpoint = params ? `/workbooks?${params}` : '/workbooks';
    return await this.request('GET', endpoint);
  }

  // Create workbook
  async createWorkbook(workbookData) {
    return await this.request('POST', '/workbooks', workbookData);
  }

  // Get cell data
  async getCellData(workbookId, worksheetId, range) {
    return await this.request('GET',
      `/workbooks/${workbookId}/worksheets/${worksheetId}/data?range=${range}`
    );
  }

  // Update cell data
  async updateCellData(workbookId, worksheetId, range, values) {
    return await this.request('PUT',
      `/workbooks/${workbookId}/worksheets/${worksheetId}/data`,
      { range, values }
    );
  }

  // Append data
  async appendData(workbookId, worksheetId, values) {
    return await this.request('POST',
      `/workbooks/${workbookId}/worksheets/${worksheetId}/data/append`,
      { values }
    );
  }

  // Create worksheet
  async createWorksheet(workbookId, worksheetData) {
    return await this.request('POST',
      `/workbooks/${workbookId}/worksheets`,
      worksheetData
    );
  }

  // Sort data
  async sortData(workbookId, worksheetId, sortConfig) {
    return await this.request('POST',
      `/workbooks/${workbookId}/worksheets/${worksheetId}/sort`,
      sortConfig
    );
  }
}

// Usage
const client = new ZohoSheetClient('1000.xxx.xxx');

// Create workbook
client.createWorkbook({
  workbook_name: 'Sales Report.xlsx',
  worksheets: [
    {
      worksheet_name: 'Q1 Data',
      row_count: 1000,
      column_count: 26
    }
  ]
})
  .then(response => {
    console.log('Created workbook:', response.data.workbook_id);
  });

// Update cells with data
client.updateCellData('wb_abc123', 'ws_001', 'A1:D3', [
  ['Product', 'Price', 'Quantity', 'Total'],
  ['Widget A', 25.50, 100, '=B2*C2'],
  ['Widget B', 30.00, 150, '=B3*C3']
])
  .then(response => {
    console.log('Updated cells:', response.data.updated_cells);
  });

// Get cell data
client.getCellData('wb_abc123', 'ws_001', 'A1:D10')
  .then(response => {
    console.log('Cell data:', response.data.values);
  });

// Append rows
client.appendData('wb_abc123', 'ws_001', [
  ['Widget C', 20.00, 175, '=B2*C2'],
  ['Widget D', 35.00, 90, '=B3*C3']
])
  .then(response => {
    console.log('Appended rows:', response.data.appended_rows);
  });

// Sort data
client.sortData('wb_abc123', 'ws_001', {
  range: 'A2:D100',
  sort_specs: [
    { column: 3, order: 'desc' }
  ]
})
  .then(response => {
    console.log('Data sorted');
  });
```

### Python

```python
import requests
import json

class ZohoSheetClient:
    def __init__(self, access_token):
        self.access_token = access_token
        self.base_url = 'https://www.zohoapis.com/sheet/api/v1'
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

    def list_workbooks(self, **kwargs):
        params = '&'.join([f'{k}={v}' for k, v in kwargs.items()])
        endpoint = f'/workbooks?{params}' if params else '/workbooks'
        return self.request('GET', endpoint)

    def create_workbook(self, workbook_data):
        return self.request('POST', '/workbooks', workbook_data)

    def get_cell_data(self, workbook_id, worksheet_id, range):
        endpoint = f'/workbooks/{workbook_id}/worksheets/{worksheet_id}/data?range={range}'
        return self.request('GET', endpoint)

    def update_cell_data(self, workbook_id, worksheet_id, range, values):
        endpoint = f'/workbooks/{workbook_id}/worksheets/{worksheet_id}/data'
        return self.request('PUT', endpoint, {'range': range, 'values': values})

    def append_data(self, workbook_id, worksheet_id, values):
        endpoint = f'/workbooks/{workbook_id}/worksheets/{worksheet_id}/data/append'
        return self.request('POST', endpoint, {'values': values})

    def create_worksheet(self, workbook_id, worksheet_data):
        endpoint = f'/workbooks/{workbook_id}/worksheets'
        return self.request('POST', endpoint, worksheet_data)

# Usage
client = ZohoSheetClient('1000.xxx.xxx')

# Create workbook
response = client.create_workbook({
    'workbook_name': 'Sales Report.xlsx',
    'worksheets': [
        {
            'worksheet_name': 'Q1 Data',
            'row_count': 1000,
            'column_count': 26
        }
    ]
})
print('Created workbook:', response['data']['workbook_id'])

# Update cells
response = client.update_cell_data('wb_abc123', 'ws_001', 'A1:D3', [
    ['Product', 'Price', 'Quantity', 'Total'],
    ['Widget A', 25.50, 100, '=B2*C2'],
    ['Widget B', 30.00, 150, '=B3*C3']
])
print('Updated cells:', response['data']['updated_cells'])

# Get cell data
response = client.get_cell_data('wb_abc123', 'ws_001', 'A1:D10')
print('Cell data:', response['data']['values'])

# Append rows
response = client.append_data('wb_abc123', 'ws_001', [
    ['Widget C', 20.00, 175, '=B2*C2'],
    ['Widget D', 35.00, 90, '=B3*C3']
])
print('Appended rows:', response['data']['appended_rows'])
```

### Deluge

```deluge
// Get access token
accessToken = "1000.xxx.xxx";

// Create workbook
workbookData = {
    "workbook_name": "Sales Report.xlsx",
    "worksheets": [
        {
            "worksheet_name": "Q1 Data",
            "row_count": 1000,
            "column_count": 26
        }
    ]
};

response = invokeurl
[
    url: "https://www.zohoapis.com/sheet/api/v1/workbooks"
    type: POST
    parameters: workbookData.toString()
    headers: {"Authorization": "Zoho-oauthtoken " + accessToken}
];

workbookId = response.get("data").get("workbook_id");
worksheetId = response.get("data").get("worksheets").get(0).get("worksheet_id");
info "Created workbook: " + workbookId;

// Update cell data
cellData = {
    "range": "A1:D3",
    "values": [
        ["Product", "Price", "Quantity", "Total"],
        ["Widget A", 25.50, 100, "=B2*C2"],
        ["Widget B", 30.00, 150, "=B3*C3"]
    ]
};

response = invokeurl
[
    url: "https://www.zohoapis.com/sheet/api/v1/workbooks/" + workbookId + "/worksheets/" + worksheetId + "/data"
    type: PUT
    parameters: cellData.toString()
    headers: {"Authorization": "Zoho-oauthtoken " + accessToken}
];

info "Updated cells: " + response.get("data").get("updated_cells");

// Get cell data
response = invokeurl
[
    url: "https://www.zohoapis.com/sheet/api/v1/workbooks/" + workbookId + "/worksheets/" + worksheetId + "/data?range=A1:D10"
    type: GET
    headers: {"Authorization": "Zoho-oauthtoken " + accessToken}
];

values = response.get("data").get("values");
for each row in values
{
    info row;
}

// Append data
appendData = {
    "values": [
        ["Widget C", 20.00, 175, "=B2*C2"],
        ["Widget D", 35.00, 90, "=B3*C3"]
    ]
};

response = invokeurl
[
    url: "https://www.zohoapis.com/sheet/api/v1/workbooks/" + workbookId + "/worksheets/" + worksheetId + "/data/append"
    type: POST
    parameters: appendData.toString()
    headers: {"Authorization": "Zoho-oauthtoken " + accessToken}
];

info "Appended rows: " + response.get("data").get("appended_rows");

// Sort data
sortConfig = {
    "range": "A2:D100",
    "sort_specs": [
        {
            "column": 3,
            "order": "desc"
        }
    ]
};

response = invokeurl
[
    url: "https://www.zohoapis.com/sheet/api/v1/workbooks/" + workbookId + "/worksheets/" + worksheetId + "/sort"
    type: POST
    parameters: sortConfig.toString()
    headers: {"Authorization": "Zoho-oauthtoken " + accessToken}
];

info "Data sorted successfully";
```

---

## Best Practices

1. **Batch Operations**: Update multiple cells in single request
2. **Use Named Ranges**: Reference data ranges by name
3. **Optimize Formulas**: Avoid volatile functions in large datasets
4. **Pagination**: Always paginate large datasets
5. **Error Handling**: Implement retry logic for transient errors
6. **Caching**: Cache frequently accessed data
7. **Webhooks**: Use webhooks for real-time updates

---

## Support and Resources

- **API Documentation**: https://www.zoho.com/sheet/help/api/
- **Developer Forum**: https://help.zoho.com/portal/community
- **API Console**: https://api-console.zoho.com/
- **Status Page**: https://status.zoho.com/

---

**Last Updated**: January 2025
**API Version**: v1
