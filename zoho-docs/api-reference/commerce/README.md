# Zoho Commerce API Reference

## Overview

Zoho Commerce is a comprehensive e-commerce platform that enables businesses to create, manage, and scale online stores. The API provides full programmatic access to stores, products, orders, customers, and inventory management.

**Current API Version**: v1
**Base URL**: `https://www.zohoapis.com/commerce/v1/`
**Protocol**: REST
**Data Format**: JSON
**Authentication**: OAuth 2.0

---

## Quick Links

- [Authentication](#authentication)
- [Store Management](#store-management)
- [Products API](#products-api)
- [Orders API](#orders-api)
- [Customers API](#customers-api)
- [Inventory API](#inventory-api)
- [Categories API](#categories-api)
- [Shipping API](#shipping-api)
- [Payment API](#payment-api)
- [Error Codes](#error-codes)
- [Rate Limits](#rate-limits)
- [Code Examples](#code-examples)

---

## API Categories

### 1. Store Management

**Purpose**: Manage store settings, configuration, and metadata

**Endpoints**:
```http
GET    /commerce/v1/stores                    # List all stores
GET    /commerce/v1/stores/{store_id}         # Get store details
PUT    /commerce/v1/stores/{store_id}         # Update store settings
GET    /commerce/v1/stores/{store_id}/settings # Get store configuration
```

**Example - Get Store Details**:
```http
GET https://www.zohoapis.com/commerce/v1/stores/12345
Authorization: Zoho-oauthtoken {access_token}
```

**Response**:
```json
{
  "store": {
    "store_id": "12345",
    "store_name": "MyStore",
    "store_url": "https://mystore.com",
    "email": "contact@mystore.com",
    "phone": "+1-555-0123",
    "currency": "USD",
    "timezone": "America/New_York",
    "status": "active",
    "created_time": "2024-01-15T10:30:00+00:00",
    "tax_settings": {
      "tax_enabled": true,
      "tax_inclusive": false
    }
  }
}
```

---

### 2. Products API

**Purpose**: Complete CRUD operations for product catalog management

**Endpoints**:
```http
GET    /commerce/v1/products                   # List all products
GET    /commerce/v1/products/{product_id}      # Get product details
POST   /commerce/v1/products                   # Create product
PUT    /commerce/v1/products/{product_id}      # Update product
DELETE /commerce/v1/products/{product_id}      # Delete product
GET    /commerce/v1/products/search            # Search products
POST   /commerce/v1/products/bulk              # Bulk create products
PUT    /commerce/v1/products/bulk              # Bulk update products
```

**Example - List Products with Pagination**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const getProducts = async (accessToken, page = 1, perPage = 50) => {
  const response = await axios.get(
    'https://www.zohoapis.com/commerce/v1/products',
    {
      params: {
        page: page,
        per_page: perPage,
        sort_by: 'created_time',
        sort_order: 'desc'
      },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

**Example - Create Product**:
```python
# Python
import requests

def create_product(access_token, product_data):
    url = 'https://www.zohoapis.com/commerce/v1/products'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'product': {
            'name': 'Wireless Headphones',
            'sku': 'WH-001',
            'description': 'Premium noise-canceling wireless headphones',
            'price': 199.99,
            'compare_at_price': 249.99,
            'cost_per_item': 120.00,
            'quantity': 100,
            'weight': 0.5,
            'weight_unit': 'kg',
            'category_id': '67890',
            'status': 'active',
            'track_inventory': True,
            'images': [
                {
                    'src': 'https://example.com/images/headphones-1.jpg',
                    'position': 1
                }
            ],
            'variants': [
                {
                    'name': 'Black',
                    'sku': 'WH-001-BLK',
                    'price': 199.99,
                    'quantity': 50
                },
                {
                    'name': 'White',
                    'sku': 'WH-001-WHT',
                    'price': 199.99,
                    'quantity': 50
                }
            ],
            'tags': ['electronics', 'audio', 'wireless']
        }
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

```deluge
// Deluge
product_data = {
    "name": "Wireless Headphones",
    "sku": "WH-001",
    "description": "Premium noise-canceling wireless headphones",
    "price": 199.99,
    "compare_at_price": 249.99,
    "quantity": 100,
    "category_id": "67890",
    "status": "active",
    "track_inventory": true,
    "tags": ["electronics", "audio", "wireless"]
};

response = invokeurl
[
    url: "https://www.zohoapis.com/commerce/v1/products"
    type: POST
    parameters: product_data.toString()
    headers: {"Authorization": "Zoho-oauthtoken " + access_token}
    connection: "zoho_commerce"
];

info response;
```

**Product Object**:
```json
{
  "product": {
    "product_id": "98765",
    "name": "Wireless Headphones",
    "sku": "WH-001",
    "description": "Premium noise-canceling wireless headphones",
    "price": 199.99,
    "compare_at_price": 249.99,
    "cost_per_item": 120.00,
    "quantity": 100,
    "status": "active",
    "track_inventory": true,
    "weight": 0.5,
    "weight_unit": "kg",
    "category": {
      "category_id": "67890",
      "name": "Audio Equipment"
    },
    "images": [
      {
        "image_id": "img_123",
        "src": "https://cdn.zohocommerce.com/images/headphones-1.jpg",
        "position": 1
      }
    ],
    "variants": [
      {
        "variant_id": "var_001",
        "name": "Black",
        "sku": "WH-001-BLK",
        "price": 199.99,
        "quantity": 50
      }
    ],
    "tags": ["electronics", "audio", "wireless"],
    "created_time": "2025-01-15T10:30:00+00:00",
    "updated_time": "2025-01-15T10:30:00+00:00"
  }
}
```

---

### 3. Orders API

**Purpose**: Manage customer orders, order fulfillment, and order tracking

**Endpoints**:
```http
GET    /commerce/v1/orders                     # List all orders
GET    /commerce/v1/orders/{order_id}          # Get order details
POST   /commerce/v1/orders                     # Create order
PUT    /commerce/v1/orders/{order_id}          # Update order
DELETE /commerce/v1/orders/{order_id}          # Cancel order
POST   /commerce/v1/orders/{order_id}/fulfill  # Fulfill order
POST   /commerce/v1/orders/{order_id}/refund   # Process refund
GET    /commerce/v1/orders/search              # Search orders
```

**Example - Get Orders with Filters**:
```javascript
const getOrders = async (accessToken, filters = {}) => {
  const response = await axios.get(
    'https://www.zohoapis.com/commerce/v1/orders',
    {
      params: {
        status: filters.status || 'all',
        payment_status: filters.paymentStatus,
        fulfillment_status: filters.fulfillmentStatus,
        date_from: filters.dateFrom,
        date_to: filters.dateTo,
        page: filters.page || 1,
        per_page: filters.perPage || 50
      },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data;
};
```

**Example - Create Order**:
```python
def create_order(access_token):
    url = 'https://www.zohoapis.com/commerce/v1/orders'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'order': {
            'customer_id': '54321',
            'email': 'customer@example.com',
            'line_items': [
                {
                    'product_id': '98765',
                    'variant_id': 'var_001',
                    'quantity': 2,
                    'price': 199.99
                }
            ],
            'shipping_address': {
                'first_name': 'John',
                'last_name': 'Doe',
                'address1': '123 Main St',
                'city': 'New York',
                'province': 'NY',
                'zip': '10001',
                'country': 'US',
                'phone': '+1-555-0123'
            },
            'billing_address': {
                'first_name': 'John',
                'last_name': 'Doe',
                'address1': '123 Main St',
                'city': 'New York',
                'province': 'NY',
                'zip': '10001',
                'country': 'US'
            },
            'shipping_lines': [
                {
                    'title': 'Standard Shipping',
                    'price': 10.00,
                    'code': 'STANDARD'
                }
            ],
            'tax_lines': [
                {
                    'title': 'Sales Tax',
                    'price': 40.00,
                    'rate': 0.08
                }
            ],
            'note': 'Gift wrap requested'
        }
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

**Order Object**:
```json
{
  "order": {
    "order_id": "ORD-12345",
    "order_number": "1001",
    "customer": {
      "customer_id": "54321",
      "email": "customer@example.com",
      "first_name": "John",
      "last_name": "Doe"
    },
    "line_items": [
      {
        "line_item_id": "li_001",
        "product_id": "98765",
        "variant_id": "var_001",
        "name": "Wireless Headphones - Black",
        "sku": "WH-001-BLK",
        "quantity": 2,
        "price": 199.99,
        "total": 399.98
      }
    ],
    "subtotal": 399.98,
    "tax_total": 40.00,
    "shipping_total": 10.00,
    "discount_total": 0.00,
    "total": 449.98,
    "currency": "USD",
    "payment_status": "paid",
    "fulfillment_status": "unfulfilled",
    "status": "processing",
    "created_time": "2025-01-15T10:30:00+00:00",
    "updated_time": "2025-01-15T10:30:00+00:00"
  }
}
```

---

### 4. Customers API

**Purpose**: Manage customer information, addresses, and purchase history

**Endpoints**:
```http
GET    /commerce/v1/customers                  # List all customers
GET    /commerce/v1/customers/{customer_id}    # Get customer details
POST   /commerce/v1/customers                  # Create customer
PUT    /commerce/v1/customers/{customer_id}    # Update customer
DELETE /commerce/v1/customers/{customer_id}    # Delete customer
GET    /commerce/v1/customers/{customer_id}/orders # Get customer orders
GET    /commerce/v1/customers/search           # Search customers
```

**Example - Get Customer with Orders**:
```javascript
const getCustomerDetails = async (accessToken, customerId) => {
  const [customer, orders] = await Promise.all([
    axios.get(
      `https://www.zohoapis.com/commerce/v1/customers/${customerId}`,
      {
        headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}` }
      }
    ),
    axios.get(
      `https://www.zohoapis.com/commerce/v1/customers/${customerId}/orders`,
      {
        headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}` }
      }
    )
  ]);

  return {
    customer: customer.data,
    orders: orders.data
  };
};
```

**Example - Create Customer**:
```deluge
// Deluge
customer_data = {
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane.smith@example.com",
    "phone": "+1-555-0456",
    "accepts_marketing": true,
    "addresses": [
        {
            "address1": "456 Oak Ave",
            "city": "Los Angeles",
            "province": "CA",
            "zip": "90001",
            "country": "US",
            "default": true
        }
    ],
    "tags": ["vip", "wholesale"]
};

response = invokeurl
[
    url: "https://www.zohoapis.com/commerce/v1/customers"
    type: POST
    parameters: customer_data.toString()
    headers: {"Authorization": "Zoho-oauthtoken " + access_token}
    connection: "zoho_commerce"
];

info response;
```

---

### 5. Inventory API

**Purpose**: Track and manage product inventory across locations

**Endpoints**:
```http
GET    /commerce/v1/inventory                  # Get inventory levels
GET    /commerce/v1/inventory/{product_id}     # Get product inventory
PUT    /commerce/v1/inventory/{product_id}     # Update inventory
POST   /commerce/v1/inventory/adjust           # Adjust inventory
GET    /commerce/v1/inventory/locations        # List locations
POST   /commerce/v1/inventory/transfer         # Transfer inventory
```

**Example - Update Inventory**:
```python
def update_inventory(access_token, product_id, adjustments):
    url = f'https://www.zohoapis.com/commerce/v1/inventory/{product_id}'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'inventory': {
            'quantity': 150,
            'location_id': 'loc_001',
            'reason': 'Restocking',
            'note': 'Received shipment from supplier'
        }
    }
    response = requests.put(url, json=data, headers=headers)
    return response.json()
```

**Example - Inventory Integration with Zoho Inventory**:
```javascript
// Sync inventory between Commerce and Inventory
const syncInventory = async (accessToken) => {
  // Get Commerce inventory
  const commerceInventory = await axios.get(
    'https://www.zohoapis.com/commerce/v1/inventory',
    {
      headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}` }
    }
  );

  // Get Inventory inventory
  const inventoryData = await axios.get(
    'https://www.zohoapis.com/inventory/v1/items',
    {
      headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}` }
    }
  );

  // Sync logic
  const updates = [];
  for (const item of commerceInventory.data.items) {
    const inventoryItem = inventoryData.data.items.find(
      i => i.sku === item.sku
    );
    if (inventoryItem && inventoryItem.stock !== item.quantity) {
      updates.push({
        product_id: item.product_id,
        quantity: inventoryItem.stock
      });
    }
  }

  // Bulk update
  if (updates.length > 0) {
    await axios.put(
      'https://www.zohoapis.com/commerce/v1/inventory/bulk',
      { updates },
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
  }

  return { synced: updates.length };
};
```

---

### 6. Categories API

**Purpose**: Organize products into categories and subcategories

**Endpoints**:
```http
GET    /commerce/v1/categories                 # List all categories
GET    /commerce/v1/categories/{category_id}   # Get category details
POST   /commerce/v1/categories                 # Create category
PUT    /commerce/v1/categories/{category_id}   # Update category
DELETE /commerce/v1/categories/{category_id}   # Delete category
```

**Example - Create Category Hierarchy**:
```python
def create_category_hierarchy(access_token):
    url = 'https://www.zohoapis.com/commerce/v1/categories'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }

    # Create parent category
    parent_data = {
        'category': {
            'name': 'Electronics',
            'description': 'Electronic devices and accessories',
            'status': 'active',
            'position': 1
        }
    }
    parent_response = requests.post(url, json=parent_data, headers=headers)
    parent_id = parent_response.json()['category']['category_id']

    # Create child category
    child_data = {
        'category': {
            'name': 'Audio Equipment',
            'description': 'Headphones, speakers, and audio accessories',
            'parent_id': parent_id,
            'status': 'active',
            'position': 1
        }
    }
    child_response = requests.post(url, json=child_data, headers=headers)

    return {
        'parent': parent_response.json(),
        'child': child_response.json()
    }
```

---

### 7. Shipping API

**Purpose**: Configure shipping methods, zones, and rates

**Endpoints**:
```http
GET    /commerce/v1/shipping/methods           # List shipping methods
POST   /commerce/v1/shipping/methods           # Create shipping method
PUT    /commerce/v1/shipping/methods/{id}      # Update shipping method
POST   /commerce/v1/shipping/calculate         # Calculate shipping rates
GET    /commerce/v1/shipping/zones             # List shipping zones
```

**Example - Calculate Shipping**:
```javascript
const calculateShipping = async (accessToken, orderData) => {
  const response = await axios.post(
    'https://www.zohoapis.com/commerce/v1/shipping/calculate',
    {
      destination: {
        country: 'US',
        province: 'CA',
        zip: '90001'
      },
      items: orderData.items,
      weight_total: orderData.totalWeight
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data.shipping_rates;
};
```

---

### 8. Payment API

**Purpose**: Process payments and manage payment methods

**Endpoints**:
```http
GET    /commerce/v1/payment/methods            # List payment methods
POST   /commerce/v1/payment/process            # Process payment
POST   /commerce/v1/payment/refund             # Process refund
GET    /commerce/v1/payment/transactions       # List transactions
```

**Example - Process Payment**:
```python
def process_payment(access_token, order_id, payment_details):
    url = 'https://www.zohoapis.com/commerce/v1/payment/process'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        'payment': {
            'order_id': order_id,
            'amount': payment_details['amount'],
            'currency': 'USD',
            'method': payment_details['method'],
            'card_details': {
                'token': payment_details['card_token']
            }
        }
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()
```

---

## Authentication

### OAuth 2.0 Flow

**Step 1: Register Your Application**
- Go to [Zoho API Console](https://api-console.zoho.com/)
- Register your application
- Note your Client ID and Client Secret

**Step 2: Authorization URL**
```http
GET https://accounts.zoho.com/oauth/v2/auth?
  scope=ZohoCommerce.products.ALL,ZohoCommerce.orders.ALL,ZohoCommerce.customers.ALL&
  client_id={client_id}&
  response_type=code&
  access_type=offline&
  redirect_uri={redirect_uri}
```

**Available Scopes**:
- `ZohoCommerce.products.ALL` - Full access to products
- `ZohoCommerce.products.READ` - Read-only access to products
- `ZohoCommerce.orders.ALL` - Full access to orders
- `ZohoCommerce.orders.READ` - Read-only access to orders
- `ZohoCommerce.customers.ALL` - Full access to customers
- `ZohoCommerce.inventory.ALL` - Full access to inventory
- `ZohoCommerce.fullaccess.ALL` - Full access to all resources

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
```javascript
const refreshAccessToken = async (clientId, clientSecret, refreshToken) => {
  const response = await axios.post(
    'https://accounts.zoho.com/oauth/v2/token',
    null,
    {
      params: {
        grant_type: 'refresh_token',
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken
      }
    }
  );
  return response.data.access_token;
};
```

---

## Rate Limits

### API Call Limits

| Plan | API Calls per Day | API Calls per Minute | Concurrent Requests |
|------|-------------------|----------------------|---------------------|
| Free | 2,500 | 10 | 3 |
| Starter | 10,000 | 30 | 5 |
| Professional | 25,000 | 60 | 10 |
| Enterprise | 100,000 | 120 | 20 |

### Rate Limit Headers
```http
X-RateLimit-Limit: 25000
X-RateLimit-Remaining: 24850
X-RateLimit-Reset: 1642147200
```

### Rate Limit Handling
```javascript
const makeApiCallWithRateLimit = async (url, options) => {
  try {
    const response = await axios(url, options);

    // Check rate limit headers
    const remaining = response.headers['x-ratelimit-remaining'];
    if (remaining < 100) {
      console.warn(`Rate limit warning: ${remaining} calls remaining`);
    }

    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      const resetTime = error.response.headers['x-ratelimit-reset'];
      const waitTime = (resetTime * 1000) - Date.now();
      console.log(`Rate limited. Waiting ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return makeApiCallWithRateLimit(url, options);
    }
    throw error;
  }
};
```

---

## Error Codes

| HTTP Status | Error Code | Description | Solution |
|-------------|------------|-------------|----------|
| 400 | INVALID_REQUEST | Invalid request parameters | Verify request format and parameters |
| 400 | VALIDATION_ERROR | Data validation failed | Check field requirements and formats |
| 401 | INVALID_TOKEN | Invalid or expired token | Refresh access token |
| 401 | OAUTH_SCOPE_MISMATCH | Insufficient permissions | Update OAuth scopes |
| 403 | FORBIDDEN | Access denied to resource | Verify user permissions |
| 404 | RESOURCE_NOT_FOUND | Resource does not exist | Verify resource ID |
| 409 | DUPLICATE_ENTRY | Duplicate SKU or identifier | Use unique identifiers |
| 422 | UNPROCESSABLE_ENTITY | Business logic validation failed | Review business rules |
| 429 | RATE_LIMIT_EXCEEDED | Too many requests | Implement rate limiting |
| 500 | INTERNAL_ERROR | Server error | Retry with exponential backoff |
| 503 | SERVICE_UNAVAILABLE | Service temporarily unavailable | Retry after delay |

**Error Response Format**:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Product name is required",
    "details": {
      "field": "name",
      "reason": "Field cannot be empty"
    }
  }
}
```

---

## Code Examples

### Complete Product Management Example

```javascript
// JavaScript/Node.js - Complete Product Lifecycle
const axios = require('axios');

class ZohoCommerceAPI {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseURL = 'https://www.zohoapis.com/commerce/v1';
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
      console.error(`API Error: ${error.response?.data?.error?.message}`);
      throw error;
    }
  }

  // Products
  async createProduct(productData) {
    return this.request('POST', '/products', { product: productData });
  }

  async getProduct(productId) {
    return this.request('GET', `/products/${productId}`);
  }

  async updateProduct(productId, updates) {
    return this.request('PUT', `/products/${productId}`, { product: updates });
  }

  async deleteProduct(productId) {
    return this.request('DELETE', `/products/${productId}`);
  }

  async listProducts(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request('GET', `/products?${queryParams}`);
  }

  // Orders
  async createOrder(orderData) {
    return this.request('POST', '/orders', { order: orderData });
  }

  async getOrder(orderId) {
    return this.request('GET', `/orders/${orderId}`);
  }

  async fulfillOrder(orderId, fulfillmentData) {
    return this.request('POST', `/orders/${orderId}/fulfill`, fulfillmentData);
  }

  // Customers
  async createCustomer(customerData) {
    return this.request('POST', '/customers', { customer: customerData });
  }

  async getCustomer(customerId) {
    return this.request('GET', `/customers/${customerId}`);
  }

  // Inventory
  async updateInventory(productId, inventoryData) {
    return this.request('PUT', `/inventory/${productId}`, { inventory: inventoryData });
  }
}

// Usage
const api = new ZohoCommerceAPI('your_access_token');

// Create product
const product = await api.createProduct({
  name: 'Premium Laptop',
  sku: 'LAPTOP-001',
  price: 1299.99,
  quantity: 50,
  description: 'High-performance laptop for professionals'
});

// Create order
const order = await api.createOrder({
  customer_id: '12345',
  line_items: [
    {
      product_id: product.product.product_id,
      quantity: 1,
      price: 1299.99
    }
  ]
});

// Fulfill order
await api.fulfillOrder(order.order.order_id, {
  tracking_number: 'TRACK123456',
  carrier: 'FedEx'
});
```

### Python Complete Example

```python
# Python - E-commerce Operations
import requests
from typing import Dict, List, Optional

class ZohoCommerceClient:
    def __init__(self, access_token: str):
        self.access_token = access_token
        self.base_url = 'https://www.zohoapis.com/commerce/v1'
        self.headers = {
            'Authorization': f'Zoho-oauthtoken {access_token}',
            'Content-Type': 'application/json'
        }

    def _request(self, method: str, endpoint: str, data: Optional[Dict] = None) -> Dict:
        url = f'{self.base_url}{endpoint}'
        response = requests.request(method, url, json=data, headers=self.headers)
        response.raise_for_status()
        return response.json()

    # Product Operations
    def create_product(self, product_data: Dict) -> Dict:
        return self._request('POST', '/products', {'product': product_data})

    def get_products(self, **filters) -> List[Dict]:
        params = '&'.join([f'{k}={v}' for k, v in filters.items()])
        return self._request('GET', f'/products?{params}')

    def update_product(self, product_id: str, updates: Dict) -> Dict:
        return self._request('PUT', f'/products/{product_id}', {'product': updates})

    # Order Operations
    def create_order(self, order_data: Dict) -> Dict:
        return self._request('POST', '/orders', {'order': order_data})

    def get_order(self, order_id: str) -> Dict:
        return self._request('GET', f'/orders/{order_id}')

    def process_refund(self, order_id: str, refund_data: Dict) -> Dict:
        return self._request('POST', f'/orders/{order_id}/refund', refund_data)

    # Customer Operations
    def create_customer(self, customer_data: Dict) -> Dict:
        return self._request('POST', '/customers', {'customer': customer_data})

    def get_customer_orders(self, customer_id: str) -> List[Dict]:
        return self._request('GET', f'/customers/{customer_id}/orders')

    # Inventory Operations
    def update_inventory(self, product_id: str, quantity: int, location_id: str = None) -> Dict:
        inventory_data = {
            'quantity': quantity,
            'location_id': location_id
        }
        return self._request('PUT', f'/inventory/{product_id}', {'inventory': inventory_data})

    def sync_inventory_with_zoho_inventory(self):
        """Sync Commerce inventory with Zoho Inventory"""
        # Get Commerce products
        commerce_products = self.get_products()

        # Get Inventory items (requires separate Inventory API client)
        inventory_url = 'https://www.zohoapis.com/inventory/v1/items'
        inventory_response = requests.get(inventory_url, headers=self.headers)
        inventory_items = inventory_response.json()['items']

        # Sync inventory levels
        updates = []
        for product in commerce_products['products']:
            inventory_item = next(
                (item for item in inventory_items if item['sku'] == product['sku']),
                None
            )
            if inventory_item and inventory_item['stock_on_hand'] != product['quantity']:
                self.update_inventory(
                    product['product_id'],
                    inventory_item['stock_on_hand']
                )
                updates.append(product['sku'])

        return updates

# Usage Example
client = ZohoCommerceClient('your_access_token')

# Create and manage product
product = client.create_product({
    'name': 'Wireless Mouse',
    'sku': 'MOUSE-001',
    'price': 29.99,
    'quantity': 200,
    'category_id': 'cat_123'
})

# Create order
order = client.create_order({
    'customer_id': 'cust_456',
    'line_items': [
        {
            'product_id': product['product']['product_id'],
            'quantity': 2,
            'price': 29.99
        }
    ]
})

# Update inventory
client.update_inventory(product['product']['product_id'], 198)
```

### Deluge Integration Example

```deluge
// Deluge - Zoho Commerce Integration

// Function to create product from CRM Deal
void createProductFromDeal(string dealId)
{
    // Get deal details from CRM
    deal = zoho.crm.getRecordById("Deals", dealId);

    // Prepare product data
    product_data = {
        "name": deal.get("Deal_Name"),
        "sku": "PROD-" + dealId,
        "price": deal.get("Amount"),
        "description": deal.get("Description"),
        "status": "active",
        "track_inventory": true,
        "quantity": 100
    };

    // Create product in Commerce
    response = invokeurl
    [
        url: "https://www.zohoapis.com/commerce/v1/products"
        type: POST
        parameters: product_data.toString()
        headers: {"Authorization": "Zoho-oauthtoken " + zoho.oauth.getToken("zoho_commerce")}
        connection: "zoho_commerce"
    ];

    if (response.get("product") != null)
    {
        product_id = response.get("product").get("product_id");

        // Update CRM Deal with Commerce Product ID
        update_map = {"Commerce_Product_ID": product_id};
        zoho.crm.updateRecord("Deals", dealId, update_map);

        info "Product created successfully: " + product_id;
    }
    else
    {
        info "Error creating product: " + response;
    }
}

// Function to sync order to CRM
void syncOrderToCRM(string orderId)
{
    // Get order from Commerce
    response = invokeurl
    [
        url: "https://www.zohoapis.com/commerce/v1/orders/" + orderId
        type: GET
        headers: {"Authorization": "Zoho-oauthtoken " + zoho.oauth.getToken("zoho_commerce")}
        connection: "zoho_commerce"
    ];

    order = response.get("order");

    // Create or update Contact in CRM
    customer = order.get("customer");
    contact_map = {
        "First_Name": customer.get("first_name"),
        "Last_Name": customer.get("last_name"),
        "Email": customer.get("email"),
        "Phone": customer.get("phone")
    };

    // Search for existing contact
    search_response = zoho.crm.searchRecords("Contacts", "(Email:equals:" + customer.get("email") + ")");

    if (search_response.size() > 0)
    {
        contact_id = search_response.get(0).get("id");
        zoho.crm.updateRecord("Contacts", contact_id, contact_map);
    }
    else
    {
        contact_response = zoho.crm.createRecord("Contacts", contact_map);
        contact_id = contact_response.get("id");
    }

    // Create Deal in CRM
    deal_map = {
        "Deal_Name": "Order " + order.get("order_number"),
        "Amount": order.get("total"),
        "Stage": "Closed Won",
        "Contact_Name": contact_id,
        "Commerce_Order_ID": orderId,
        "Closing_Date": zoho.currentdate
    };

    deal_response = zoho.crm.createRecord("Deals", deal_map);
    info "Order synced to CRM as Deal: " + deal_response.get("id");
}

// Workflow: Auto-create customer when order is placed
void onOrderCreate(string orderId)
{
    // Get order details
    order_response = invokeurl
    [
        url: "https://www.zohoapis.com/commerce/v1/orders/" + orderId
        type: GET
        headers: {"Authorization": "Zoho-oauthtoken " + zoho.oauth.getToken("zoho_commerce")}
        connection: "zoho_commerce"
    ];

    order = order_response.get("order");
    customer_email = order.get("email");

    // Check if customer exists
    customer_search = invokeurl
    [
        url: "https://www.zohoapis.com/commerce/v1/customers/search?email=" + customer_email
        type: GET
        headers: {"Authorization": "Zoho-oauthtoken " + zoho.oauth.getToken("zoho_commerce")}
        connection: "zoho_commerce"
    ];

    // Create customer if doesn't exist
    if (customer_search.get("customers").size() == 0)
    {
        shipping = order.get("shipping_address");
        customer_data = {
            "first_name": shipping.get("first_name"),
            "last_name": shipping.get("last_name"),
            "email": customer_email,
            "phone": shipping.get("phone"),
            "addresses": [
                {
                    "address1": shipping.get("address1"),
                    "city": shipping.get("city"),
                    "province": shipping.get("province"),
                    "zip": shipping.get("zip"),
                    "country": shipping.get("country"),
                    "default": true
                }
            ]
        };

        create_response = invokeurl
        [
            url: "https://www.zohoapis.com/commerce/v1/customers"
            type: POST
            parameters: customer_data.toString()
            headers: {"Authorization": "Zoho-oauthtoken " + zoho.oauth.getToken("zoho_commerce")}
            connection: "zoho_commerce"
        ];

        info "Customer created: " + create_response.get("customer").get("customer_id");
    }
}
```

---

## Best Practices

### 1. Authentication & Security
- Store refresh tokens securely (encrypted database or secure vault)
- Implement automatic token refresh before expiration
- Never expose access tokens in client-side code
- Use environment variables for credentials
- Implement token rotation for long-running processes

### 2. Error Handling
```javascript
const handleApiError = (error) => {
  if (error.response) {
    const status = error.response.status;
    const errorCode = error.response.data?.error?.code;

    switch (status) {
      case 400:
        console.error('Validation error:', error.response.data.error.details);
        // Handle validation errors
        break;
      case 401:
        console.error('Authentication failed - refresh token');
        // Trigger token refresh
        break;
      case 429:
        const retryAfter = error.response.headers['retry-after'] || 60;
        console.log(`Rate limited. Retry after ${retryAfter}s`);
        // Implement exponential backoff
        break;
      case 500:
        console.error('Server error - retry with backoff');
        // Implement retry logic
        break;
      default:
        console.error('API Error:', error.response.data);
    }
  }
};
```

### 3. Performance Optimization
- Use pagination for list endpoints (default: 50 items per page)
- Implement caching for frequently accessed data
- Use bulk operations for multiple records
- Minimize API calls by fetching related data in single requests
- Implement request queuing to stay within rate limits

```python
# Efficient bulk product creation
def create_products_bulk(client, products_list):
    # Batch products in groups of 100
    batch_size = 100
    results = []

    for i in range(0, len(products_list), batch_size):
        batch = products_list[i:i + batch_size]
        response = client._request('POST', '/products/bulk', {'products': batch})
        results.extend(response['products'])

        # Rate limit handling
        time.sleep(0.5)  # 2 requests per second

    return results
```

### 4. Data Integrity
- Validate product data before submission
- Use unique SKUs for all products and variants
- Implement idempotency for critical operations
- Handle duplicate detection gracefully
- Maintain audit logs for order changes

### 5. Inventory Management
- Implement real-time inventory sync
- Use webhooks for inventory updates
- Set low stock alerts
- Track inventory across multiple locations
- Integrate with Zoho Inventory for advanced management

### 6. Order Processing
- Validate order data before creation
- Implement order status webhooks
- Send email notifications for order updates
- Handle payment failures gracefully
- Implement fraud detection mechanisms

### 7. Testing
- Use sandbox environment for testing
- Test all error scenarios
- Validate webhook payloads
- Test rate limit handling
- Implement automated integration tests

---

## Webhooks

### Available Webhook Events

```json
{
  "events": [
    "product.created",
    "product.updated",
    "product.deleted",
    "order.created",
    "order.updated",
    "order.fulfilled",
    "order.cancelled",
    "customer.created",
    "customer.updated",
    "inventory.updated",
    "payment.completed",
    "payment.failed"
  ]
}
```

### Configure Webhook

```javascript
const setupWebhook = async (accessToken) => {
  const response = await axios.post(
    'https://www.zohoapis.com/commerce/v1/webhooks',
    {
      webhook: {
        url: 'https://yourdomain.com/webhooks/commerce',
        events: ['order.created', 'order.updated', 'payment.completed'],
        status: 'active'
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

### Webhook Payload Example

```json
{
  "event": "order.created",
  "timestamp": "2025-01-15T10:30:00+00:00",
  "data": {
    "order_id": "ORD-12345",
    "order_number": "1001",
    "customer_id": "54321",
    "total": 449.98,
    "status": "processing"
  }
}
```

---

## Data Centers

| Data Center | Base URL |
|-------------|----------|
| US | https://www.zohoapis.com |
| EU | https://www.zohoapis.eu |
| IN | https://www.zohoapis.in |
| AU | https://www.zohoapis.com.au |
| JP | https://www.zohoapis.jp |

---

## Additional Resources

- [Official Zoho Commerce API Documentation](https://www.zoho.com/commerce/api/)
- [Commerce Developer Portal](https://www.zoho.com/commerce/developers/)
- [API Postman Collection](https://www.postman.com/zoho)
- [Developer Community](https://help.zoho.com/portal/en/community/commerce)
- [Integration Examples](https://www.zoho.com/commerce/integrations/)

---

**Last Updated**: December 2025
**API Version**: v1
