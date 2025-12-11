# Zoho API Quick Reference

Quick reference for common API operations.

---

## Authentication

```bash
# Get access token
curl -X POST "https://accounts.zoho.com/oauth/v2/token" \
  -d "grant_type=refresh_token" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "refresh_token=YOUR_REFRESH_TOKEN"
```

```javascript
// JavaScript
headers: {
  'Authorization': `Zoho-oauthtoken ${accessToken}`
}
```

---

## CRUD Operations

### Create Record

```bash
# CRM
curl -X POST "https://www.zohoapis.com/crm/v8/Leads" \
  -H "Authorization: Zoho-oauthtoken TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"data":[{"First_Name":"John","Last_Name":"Doe","Email":"john@example.com"}]}'
```

```javascript
// JavaScript
await axios.post(`${API_DOMAIN}/crm/v8/Leads`, {
  data: [{ First_Name: 'John', Last_Name: 'Doe', Email: 'john@example.com' }]
}, { headers: { 'Authorization': `Zoho-oauthtoken ${token}` } });
```

```python
# Python
requests.post(f'{API_DOMAIN}/crm/v8/Leads',
  json={'data': [{'First_Name': 'John', 'Last_Name': 'Doe', 'Email': 'john@example.com'}]},
  headers={'Authorization': f'Zoho-oauthtoken {token}'})
```

```javascript
// Deluge
zoho.crm.createRecord("Leads", {"First_Name":"John","Last_Name":"Doe","Email":"john@example.com"});
```

### Read Record

```bash
# Get by ID
curl -X GET "https://www.zohoapis.com/crm/v8/Leads/RECORD_ID" \
  -H "Authorization: Zoho-oauthtoken TOKEN"

# Get all (paginated)
curl -X GET "https://www.zohoapis.com/crm/v8/Leads?page=1&per_page=200" \
  -H "Authorization: Zoho-oauthtoken TOKEN"
```

```javascript
// JavaScript - Get all with pagination
for await (const batch of getAllRecords('Leads')) {
  // Process batch
}
```

### Update Record

```bash
curl -X PUT "https://www.zohoapis.com/crm/v8/Leads/RECORD_ID" \
  -H "Authorization: Zoho-oauthtoken TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"data":[{"Lead_Status":"Qualified"}]}'
```

```javascript
// JavaScript
await axios.put(`${API_DOMAIN}/crm/v8/Leads/${id}`, {
  data: [{ Lead_Status: 'Qualified' }]
}, { headers: { 'Authorization': `Zoho-oauthtoken ${token}` } });
```

### Delete Record

```bash
curl -X DELETE "https://www.zohoapis.com/crm/v8/Leads/RECORD_ID" \
  -H "Authorization: Zoho-oauthtoken TOKEN"
```

---

## Search & Filter

### Search by Criteria

```bash
curl -X GET "https://www.zohoapis.com/crm/v8/Leads/search?criteria=(Email:equals:john@example.com)" \
  -H "Authorization: Zoho-oauthtoken TOKEN"
```

```javascript
// Multiple criteria
const criteria = '(Lead_Status:equals:Qualified)and(Annual_Revenue:greater_than:100000)';
await axios.get(`${API_DOMAIN}/crm/v8/Leads/search?criteria=${encodeURIComponent(criteria)}`);
```

### COQL Query

```bash
curl -X GET "https://www.zohoapis.com/crm/v8/coql?select_query=SELECT First_Name, Last_Name, Email FROM Leads WHERE Lead_Status = 'Qualified' LIMIT 50" \
  -H "Authorization: Zoho-oauthtoken TOKEN"
```

```javascript
// JavaScript
const query = `
  SELECT First_Name, Last_Name, Email
  FROM Leads
  WHERE Lead_Status = 'Qualified'
  ORDER BY Annual_Revenue DESC
  LIMIT 50
`;
await axios.get(`${API_DOMAIN}/crm/v8/coql`, {
  params: { select_query: query }
});
```

---

## Bulk Operations

### Bulk Create

```bash
curl -X POST "https://www.zohoapis.com/crm/v8/Leads" \
  -H "Authorization: Zoho-oauthtoken TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"data":[{"First_Name":"John","Last_Name":"Doe"},{"First_Name":"Jane","Last_Name":"Smith"}]}'
```

**Limits**: Max 100 records per request

### Bulk Update

```bash
curl -X PUT "https://www.zohoapis.com/crm/v8/Leads" \
  -H "Authorization: Zoho-oauthtoken TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"data":[{"id":"ID1","Lead_Status":"Qualified"},{"id":"ID2","Lead_Status":"Qualified"}]}'
```

### Bulk Delete

```bash
curl -X DELETE "https://www.zohoapis.com/crm/v8/Leads?ids=ID1,ID2,ID3" \
  -H "Authorization: Zoho-oauthtoken TOKEN"
```

---

## Common Products

### CRM
- **Base URL**: `https://www.zohoapis.com/crm/v8/`
- **Modules**: Leads, Contacts, Accounts, Deals, etc.
- **Rate Limit**: 5K-100K calls/day depending on plan

### Books
- **Base URL**: `https://www.zohoapis.com/books/v3/`
- **Requires**: `organization_id` parameter
- **Rate Limit**: 2.5K-50K calls/day, 100/min

### Desk
- **Base URL**: `https://desk.zoho.com/api/v1/`
- **Requires**: `orgId` in URL
- **Rate Limit**: 2K-50K calls/day

### Creator
- **Base URL**: `https://creator.zoho.com/api/v2/`
- **ZCQL**: SQL-like queries
- **Rate Limit**: 5K-100K calls/day

---

## Rate Limit Headers

```
X-RateLimit-Limit: 10000
X-RateLimit-Remaining: 9875
X-RateLimit-Reset: 1642147200
```

```javascript
// Check rate limit status
function checkRateLimit(response) {
  const remaining = response.headers['x-ratelimit-remaining'];
  const limit = response.headers['x-ratelimit-limit'];
  console.log(`${remaining}/${limit} calls remaining`);
}
```

---

## Common Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `page` | Page number | `page=1` |
| `per_page` | Records per page (max 200) | `per_page=200` |
| `fields` | Specific fields to return | `fields=First_Name,Last_Name,Email` |
| `sort_by` | Sort by field | `sort_by=Created_Time` |
| `sort_order` | Sort order | `sort_order=desc` |
| `criteria` | Search criteria | `criteria=(Email:equals:john@example.com)` |

---

## Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| `INVALID_TOKEN` | Token expired | Refresh token |
| `RATE_LIMIT_EXCEEDED` | Too many requests | Implement rate limiting |
| `MANDATORY_NOT_FOUND` | Missing required field | Add required fields |
| `DUPLICATE_DATA` | Record exists | Update existing record |
| `RECORD_NOT_FOUND` | Invalid ID | Verify record exists |

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 429 | Rate Limit Exceeded |
| 500 | Server Error |

---

## Data Centers

| Location | Base URL |
|----------|----------|
| US | https://www.zohoapis.com |
| EU | https://www.zohoapis.eu |
| IN | https://www.zohoapis.in |
| AU | https://www.zohoapis.com.au |
| JP | https://www.zohoapis.jp |
| CA | https://www.zohoapis.ca |

---

**Last Updated**: December 2025
