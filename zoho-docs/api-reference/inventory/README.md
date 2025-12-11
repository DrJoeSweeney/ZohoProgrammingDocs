# Zoho Inventory API Reference

## Overview

Zoho Inventory is a powerful cloud-based inventory management software that helps businesses track stock levels, manage orders, handle shipments, and maintain multiple warehouses. The API provides complete programmatic access to inventory operations, order management, and warehouse functionality.

**Current API Version**: v1
**Base URL**: `https://www.zohoapis.com/inventory/v1/`
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

### 1. Items
**Purpose**: Manage products, services, and inventory items

**Endpoints**:
```http
GET    /inventory/v1/items                      # List all items
GET    /inventory/v1/items/{item_id}            # Get item details
POST   /inventory/v1/items                      # Create item
PUT    /inventory/v1/items/{item_id}            # Update item
DELETE /inventory/v1/items/{item_id}            # Delete item
POST   /inventory/v1/items/{item_id}/active     # Activate item
POST   /inventory/v1/items/{item_id}/inactive   # Deactivate item
GET    /inventory/v1/items/{item_id}/stock      # Get stock details
POST   /inventory/v1/items/images/{item_id}     # Upload item image
DELETE /inventory/v1/items/images/{item_id}     # Delete item image
```

**Item Types**:
- Goods (inventory items)
- Services (non-inventory)
- Composite Items (bundles)
- Digital Goods

**Example - Create Item**:
```javascript
// JavaScript/Node.js
const axios = require('axios');

const createItem = async (accessToken, organizationId) => {
  const response = await axios.post(
    'https://www.zohoapis.com/inventory/v1/items',
    {
      name: 'Wireless Bluetooth Headphones',
      sku: 'WBH-001',
      unit: 'pcs',
      description: 'Premium wireless headphones with noise cancellation',
      rate: 79.99,
      purchase_rate: 45.00,
      tax_id: '12345000000456789',
      product_type: 'goods',
      is_taxable: true,
      track_inventory: true,
      initial_stock: 100,
      initial_stock_rate: 45.00,
      reorder_level: 20,
      hsn_or_sac: '8518',
      upc: '123456789012',
      ean: '1234567890123',
      isbn: '',
      part_number: 'WBH-MODEL-X',
      item_type: 'inventory',
      vendor_id: '12345000000234567',
      manufacturer: 'AudioTech Inc',
      brand: 'AudioTech',
      weight: 0.5,
      weight_unit: 'kg',
      dimensions: {
        length: 20,
        width: 18,
        height: 8,
        unit: 'cm'
      },
      custom_fields: [
        {
          label: 'Color',
          value: 'Black'
        },
        {
          label: 'Warranty',
          value: '1 Year'
        }
      ]
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      },
      params: {
        organization_id: organizationId
      }
    }
  );
  return response.data;
};
```

```python
# Python
import requests

def create_item(access_token, organization_id):
    url = 'https://www.zohoapis.com/inventory/v1/items'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    params = {
        'organization_id': organization_id
    }
    data = {
        'name': 'Wireless Bluetooth Headphones',
        'sku': 'WBH-001',
        'unit': 'pcs',
        'description': 'Premium wireless headphones with noise cancellation',
        'rate': 79.99,
        'purchase_rate': 45.00,
        'tax_id': '12345000000456789',
        'product_type': 'goods',
        'is_taxable': True,
        'track_inventory': True,
        'initial_stock': 100,
        'initial_stock_rate': 45.00,
        'reorder_level': 20,
        'hsn_or_sac': '8518',
        'upc': '123456789012',
        'ean': '1234567890123',
        'part_number': 'WBH-MODEL-X',
        'item_type': 'inventory',
        'vendor_id': '12345000000234567',
        'manufacturer': 'AudioTech Inc',
        'brand': 'AudioTech',
        'weight': 0.5,
        'weight_unit': 'kg',
        'dimensions': {
            'length': 20,
            'width': 18,
            'height': 8,
            'unit': 'cm'
        }
    }
    response = requests.post(url, json=data, headers=headers, params=params)
    return response.json()
```

```deluge
// Deluge
item_data = {
    "name": "Wireless Bluetooth Headphones",
    "sku": "WBH-001",
    "unit": "pcs",
    "description": "Premium wireless headphones with noise cancellation",
    "rate": 79.99,
    "purchase_rate": 45.00,
    "product_type": "goods",
    "is_taxable": true,
    "track_inventory": true,
    "initial_stock": 100,
    "initial_stock_rate": 45.00,
    "reorder_level": 20,
    "item_type": "inventory",
    "vendor_id": "12345000000234567",
    "manufacturer": "AudioTech Inc",
    "brand": "AudioTech",
    "weight": 0.5,
    "weight_unit": "kg"
};

response = zoho.inventory.createRecord("items", organization_id, item_data);
info response;
```

**Response**:
```json
{
  "code": 0,
  "message": "The item has been added.",
  "item": {
    "item_id": "12345000000567890",
    "name": "Wireless Bluetooth Headphones",
    "sku": "WBH-001",
    "unit": "pcs",
    "status": "active",
    "product_type": "goods",
    "rate": 79.99,
    "purchase_rate": 45.00,
    "available_stock": 100,
    "actual_available_stock": 100,
    "reorder_level": 20,
    "stock_on_hand": 100,
    "asset_value": 4500.00,
    "is_taxable": true,
    "tax_id": "12345000000456789",
    "tax_name": "Sales Tax",
    "tax_percentage": 8.5,
    "created_time": "2025-01-15T10:30:00-0800",
    "last_modified_time": "2025-01-15T10:30:00-0800"
  }
}
```

---

### 2. Sales Orders
**Purpose**: Create and manage customer sales orders

**Endpoints**:
```http
GET    /inventory/v1/salesorders                # List all sales orders
GET    /inventory/v1/salesorders/{so_id}        # Get sales order details
POST   /inventory/v1/salesorders                # Create sales order
PUT    /inventory/v1/salesorders/{so_id}        # Update sales order
DELETE /inventory/v1/salesorders/{so_id}        # Delete sales order
POST   /inventory/v1/salesorders/{so_id}/status/open      # Mark as open
POST   /inventory/v1/salesorders/{so_id}/status/confirmed # Confirm order
POST   /inventory/v1/salesorders/{so_id}/status/void      # Void order
POST   /inventory/v1/salesorders/{so_id}/email            # Email sales order
GET    /inventory/v1/salesorders/{so_id}/shipments        # List shipments
```

**Sales Order Statuses**:
- Draft
- Open
- Confirmed
- Packed
- Shipped
- Delivered
- Closed
- Void
- Cancelled

**Example - Create Sales Order**:
```javascript
// JavaScript/Node.js
const createSalesOrder = async (accessToken, organizationId) => {
  const response = await axios.post(
    'https://www.zohoapis.com/inventory/v1/salesorders',
    {
      customer_id: '12345000000234567',
      salesorder_number: 'SO-00001',
      reference_number: 'PO-CUST-123',
      date: '2025-01-15',
      shipment_date: '2025-01-20',
      salesorder_type: 'standard',
      priority: 'high',
      payment_terms: 15,
      payment_terms_label: 'Net 15',
      delivery_method: 'Express Shipping',
      salesperson_name: 'John Doe',
      custom_fields: [],
      line_items: [
        {
          item_id: '12345000000567890',
          name: 'Wireless Bluetooth Headphones',
          description: 'Black color, 1 year warranty',
          rate: 79.99,
          quantity: 25,
          discount: 5,
          discount_amount: 100.00,
          tax_id: '12345000000456789',
          warehouse_id: '12345000000678901'
        },
        {
          item_id: '12345000000567891',
          name: 'USB-C Charging Cable',
          description: '2 meter length',
          rate: 12.99,
          quantity: 50,
          discount: 0,
          tax_id: '12345000000456789',
          warehouse_id: '12345000000678901'
        }
      ],
      notes: 'Customer requested express shipping',
      terms: 'Payment due within 15 days',
      shipping_charge: 25.00,
      adjustment: -10.00,
      adjustment_description: 'Bulk order discount',
      billing_address: {
        address: '123 Business Street',
        street2: 'Suite 100',
        city: 'San Francisco',
        state: 'CA',
        zip: '94102',
        country: 'USA',
        fax: '555-0199'
      },
      shipping_address: {
        address: '456 Warehouse Road',
        street2: 'Loading Dock B',
        city: 'Oakland',
        state: 'CA',
        zip: '94601',
        country: 'USA',
        fax: ''
      }
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      },
      params: {
        organization_id: organizationId
      }
    }
  );
  return response.data;
};
```

```python
# Python
def create_sales_order(access_token, organization_id):
    url = 'https://www.zohoapis.com/inventory/v1/salesorders'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    params = {
        'organization_id': organization_id
    }
    data = {
        'customer_id': '12345000000234567',
        'salesorder_number': 'SO-00001',
        'reference_number': 'PO-CUST-123',
        'date': '2025-01-15',
        'shipment_date': '2025-01-20',
        'salesorder_type': 'standard',
        'priority': 'high',
        'payment_terms': 15,
        'payment_terms_label': 'Net 15',
        'delivery_method': 'Express Shipping',
        'salesperson_name': 'John Doe',
        'line_items': [
            {
                'item_id': '12345000000567890',
                'name': 'Wireless Bluetooth Headphones',
                'rate': 79.99,
                'quantity': 25,
                'discount': 5,
                'tax_id': '12345000000456789',
                'warehouse_id': '12345000000678901'
            }
        ],
        'notes': 'Customer requested express shipping',
        'shipping_charge': 25.00,
        'adjustment': -10.00,
        'adjustment_description': 'Bulk order discount'
    }
    response = requests.post(url, json=data, headers=headers, params=params)
    return response.json()
```

```deluge
// Deluge
salesorder_data = {
    "customer_id": "12345000000234567",
    "salesorder_number": "SO-00001",
    "date": "2025-01-15",
    "shipment_date": "2025-01-20",
    "line_items": [
        {
            "item_id": "12345000000567890",
            "rate": 79.99,
            "quantity": 25,
            "tax_id": "12345000000456789",
            "warehouse_id": "12345000000678901"
        }
    ],
    "notes": "Customer requested express shipping",
    "shipping_charge": 25.00
};

response = zoho.inventory.createRecord("salesorders", organization_id, salesorder_data);
info response;
```

**Response**:
```json
{
  "code": 0,
  "message": "Sales Order has been created.",
  "salesorder": {
    "salesorder_id": "12345000000789012",
    "salesorder_number": "SO-00001",
    "reference_number": "PO-CUST-123",
    "date": "2025-01-15",
    "status": "draft",
    "shipment_date": "2025-01-20",
    "customer_id": "12345000000234567",
    "customer_name": "Acme Corporation",
    "line_items": [
      {
        "line_item_id": "12345000000890123",
        "item_id": "12345000000567890",
        "name": "Wireless Bluetooth Headphones",
        "rate": 79.99,
        "quantity": 25,
        "quantity_packed": 0,
        "quantity_shipped": 0,
        "quantity_invoiced": 0,
        "warehouse_id": "12345000000678901",
        "warehouse_name": "Main Warehouse",
        "item_total": 1999.75
      }
    ],
    "sub_total": 2649.25,
    "tax_total": 225.19,
    "shipping_charge": 25.00,
    "adjustment": -10.00,
    "total": 2889.44,
    "created_time": "2025-01-15T10:30:00-0800"
  }
}
```

---

### 3. Purchase Orders
**Purpose**: Create and manage vendor purchase orders

**Endpoints**:
```http
GET    /inventory/v1/purchaseorders             # List all purchase orders
GET    /inventory/v1/purchaseorders/{po_id}     # Get purchase order details
POST   /inventory/v1/purchaseorders             # Create purchase order
PUT    /inventory/v1/purchaseorders/{po_id}     # Update purchase order
DELETE /inventory/v1/purchaseorders/{po_id}     # Delete purchase order
POST   /inventory/v1/purchaseorders/{po_id}/status/issued # Issue PO
POST   /inventory/v1/purchaseorders/{po_id}/status/cancelled # Cancel PO
POST   /inventory/v1/purchaseorders/{po_id}/receive # Receive items
POST   /inventory/v1/purchaseorders/{po_id}/email   # Email PO
```

**Purchase Order Statuses**:
- Draft
- Issued
- Received (Partially/Fully)
- Billed (Partially/Fully)
- Closed
- Cancelled
- Void

**Example - Create Purchase Order**:
```javascript
// JavaScript/Node.js
const createPurchaseOrder = async (accessToken, organizationId) => {
  const response = await axios.post(
    'https://www.zohoapis.com/inventory/v1/purchaseorders',
    {
      vendor_id: '12345000000234567',
      purchaseorder_number: 'PO-00001',
      reference_number: 'REF-2025-001',
      date: '2025-01-15',
      delivery_date: '2025-02-01',
      expected_delivery_date: '2025-02-01',
      delivery_customer_id: '',
      attention: 'Purchasing Department',
      purchaseorder_type: 'regular',
      line_items: [
        {
          item_id: '12345000000567890',
          name: 'Wireless Bluetooth Headphones',
          description: 'Bulk order for stock replenishment',
          rate: 45.00,
          quantity: 200,
          discount: 2,
          tax_id: '12345000000456789',
          warehouse_id: '12345000000678901'
        }
      ],
      notes: 'Delivery to main warehouse loading dock',
      terms: 'Payment within 30 days of delivery',
      shipping_charge: 150.00,
      adjustment: -50.00,
      adjustment_description: 'Volume discount',
      delivery_address: {
        address: '789 Warehouse Boulevard',
        street2: 'Receiving Dock A',
        city: 'Oakland',
        state: 'CA',
        zip: '94601',
        country: 'USA'
      }
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      },
      params: {
        organization_id: organizationId
      }
    }
  );
  return response.data;
};
```

**Example - Receive Items**:
```javascript
// JavaScript/Node.js
const receiveItems = async (accessToken, organizationId, purchaseorderId) => {
  const response = await axios.post(
    `https://www.zohoapis.com/inventory/v1/purchaseorders/${purchaseorderId}/receive`,
    {
      receive_date: '2025-02-01',
      line_items: [
        {
          line_item_id: '12345000000890123',
          quantity_received: 200,
          warehouse_id: '12345000000678901'
        }
      ],
      notes: 'All items received in good condition'
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      },
      params: {
        organization_id: organizationId
      }
    }
  );
  return response.data;
};
```

---

### 4. Packages & Shipments
**Purpose**: Create packages and track shipments

**Endpoints**:
```http
GET    /inventory/v1/packages                   # List all packages
GET    /inventory/v1/packages/{package_id}      # Get package details
POST   /inventory/v1/packages                   # Create package
PUT    /inventory/v1/packages/{package_id}      # Update package
DELETE /inventory/v1/packages/{package_id}      # Delete package
POST   /inventory/v1/packages/{package_id}/ship # Ship package
POST   /inventory/v1/packages/{package_id}/deliver # Deliver package
GET    /inventory/v1/shipmentorders             # List shipment orders
POST   /inventory/v1/shipmentorders             # Create shipment order
```

**Package Statuses**:
- Draft
- Ready to Ship
- Shipped
- In Transit
- Out for Delivery
- Delivered
- Returned
- Cancelled

**Example - Create Package**:
```javascript
// JavaScript/Node.js
const createPackage = async (accessToken, organizationId) => {
  const response = await axios.post(
    'https://www.zohoapis.com/inventory/v1/packages',
    {
      salesorder_id: '12345000000789012',
      package_number: 'PKG-00001',
      date: '2025-01-18',
      shipment_date: '2025-01-20',
      carrier: 'FedEx',
      service_type: 'Express',
      tracking_number: '1Z999AA10123456784',
      line_items: [
        {
          so_line_item_id: '12345000000890123',
          quantity: 25,
          warehouse_id: '12345000000678901'
        }
      ],
      notes: 'Handle with care - fragile electronics',
      dimensions: {
        length: 50,
        width: 40,
        height: 30,
        unit: 'cm'
      },
      weight: 12.5,
      weight_unit: 'kg',
      shipping_charge: 25.00,
      package_custom_fields: []
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      },
      params: {
        organization_id: organizationId
      }
    }
  );
  return response.data;
};
```

```python
# Python
def create_package(access_token, organization_id):
    url = 'https://www.zohoapis.com/inventory/v1/packages'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    params = {
        'organization_id': organization_id
    }
    data = {
        'salesorder_id': '12345000000789012',
        'package_number': 'PKG-00001',
        'date': '2025-01-18',
        'shipment_date': '2025-01-20',
        'carrier': 'FedEx',
        'service_type': 'Express',
        'tracking_number': '1Z999AA10123456784',
        'line_items': [
            {
                'so_line_item_id': '12345000000890123',
                'quantity': 25,
                'warehouse_id': '12345000000678901'
            }
        ],
        'notes': 'Handle with care - fragile electronics',
        'weight': 12.5,
        'weight_unit': 'kg',
        'shipping_charge': 25.00
    }
    response = requests.post(url, json=data, headers=headers, params=params)
    return response.json()
```

```deluge
// Deluge
package_data = {
    "salesorder_id": "12345000000789012",
    "package_number": "PKG-00001",
    "date": "2025-01-18",
    "shipment_date": "2025-01-20",
    "carrier": "FedEx",
    "tracking_number": "1Z999AA10123456784",
    "line_items": [
        {
            "so_line_item_id": "12345000000890123",
            "quantity": 25,
            "warehouse_id": "12345000000678901"
        }
    ],
    "notes": "Handle with care - fragile electronics",
    "weight": 12.5,
    "shipping_charge": 25.00
};

response = zoho.inventory.createRecord("packages", organization_id, package_data);
info response;
```

**Example - Mark Package as Shipped**:
```javascript
// JavaScript/Node.js
const shipPackage = async (accessToken, organizationId, packageId) => {
  const response = await axios.post(
    `https://www.zohoapis.com/inventory/v1/packages/${packageId}/ship`,
    {
      shipment_date: '2025-01-20',
      tracking_number: '1Z999AA10123456784',
      carrier: 'FedEx',
      service_type: 'Express'
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      },
      params: {
        organization_id: organizationId
      }
    }
  );
  return response.data;
};
```

---

### 5. Warehouses
**Purpose**: Manage multiple warehouse locations

**Endpoints**:
```http
GET    /inventory/v1/warehouses                 # List all warehouses
GET    /inventory/v1/warehouses/{warehouse_id}  # Get warehouse details
POST   /inventory/v1/warehouses                 # Create warehouse
PUT    /inventory/v1/warehouses/{warehouse_id}  # Update warehouse
DELETE /inventory/v1/warehouses/{warehouse_id}  # Delete warehouse
POST   /inventory/v1/warehouses/{warehouse_id}/active   # Activate warehouse
POST   /inventory/v1/warehouses/{warehouse_id}/inactive # Deactivate warehouse
GET    /inventory/v1/warehouses/{warehouse_id}/items    # List items in warehouse
```

**Example - Create Warehouse**:
```javascript
// JavaScript/Node.js
const createWarehouse = async (accessToken, organizationId) => {
  const response = await axios.post(
    'https://www.zohoapis.com/inventory/v1/warehouses',
    {
      warehouse_name: 'West Coast Distribution Center',
      attention: 'Warehouse Manager',
      address: {
        address: '789 Warehouse Boulevard',
        street2: 'Building 3',
        city: 'Oakland',
        state: 'CA',
        zip: '94601',
        country: 'USA',
        phone: '555-0188',
        fax: ''
      },
      email: 'warehouse@company.com',
      phone: '555-0188',
      is_primary: false,
      custom_fields: []
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      },
      params: {
        organization_id: organizationId
      }
    }
  );
  return response.data;
};
```

```python
# Python
def create_warehouse(access_token, organization_id):
    url = 'https://www.zohoapis.com/inventory/v1/warehouses'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    params = {
        'organization_id': organization_id
    }
    data = {
        'warehouse_name': 'West Coast Distribution Center',
        'attention': 'Warehouse Manager',
        'address': {
            'address': '789 Warehouse Boulevard',
            'city': 'Oakland',
            'state': 'CA',
            'zip': '94601',
            'country': 'USA',
            'phone': '555-0188'
        },
        'email': 'warehouse@company.com',
        'phone': '555-0188',
        'is_primary': False
    }
    response = requests.post(url, json=data, headers=headers, params=params)
    return response.json()
```

**Response**:
```json
{
  "code": 0,
  "message": "Warehouse has been created.",
  "warehouse": {
    "warehouse_id": "12345000000678901",
    "warehouse_name": "West Coast Distribution Center",
    "status": "active",
    "is_primary": false,
    "email": "warehouse@company.com",
    "phone": "555-0188",
    "address": {
      "address": "789 Warehouse Boulevard",
      "street2": "Building 3",
      "city": "Oakland",
      "state": "CA",
      "zip": "94601",
      "country": "USA"
    },
    "created_time": "2025-01-15T10:30:00-0800"
  }
}
```

---

### 6. Stock Adjustments
**Purpose**: Adjust inventory stock levels manually

**Endpoints**:
```http
GET    /inventory/v1/inventoryadjustments       # List all adjustments
GET    /inventory/v1/inventoryadjustments/{adj_id} # Get adjustment details
POST   /inventory/v1/inventoryadjustments       # Create adjustment
PUT    /inventory/v1/inventoryadjustments/{adj_id} # Update adjustment
DELETE /inventory/v1/inventoryadjustments/{adj_id} # Delete adjustment
```

**Adjustment Types**:
- Quantity Adjustment
- Value Adjustment
- Damage
- Loss
- Theft
- Write-off
- Stock Count
- Returns

**Example - Create Stock Adjustment**:
```javascript
// JavaScript/Node.js
const createStockAdjustment = async (accessToken, organizationId) => {
  const response = await axios.post(
    'https://www.zohoapis.com/inventory/v1/inventoryadjustments',
    {
      date: '2025-01-15',
      adjustment_number: 'ADJ-00001',
      reference_number: 'INV-COUNT-Q1-2025',
      reason: 'Physical inventory count',
      description: 'Quarterly inventory count adjustment',
      adjustment_type: 'quantity',
      line_items: [
        {
          item_id: '12345000000567890',
          warehouse_id: '12345000000678901',
          quantity_adjusted: -5,
          adjust_quantity_by: 'decrease',
          description: 'Found 5 damaged units during count'
        },
        {
          item_id: '12345000000567891',
          warehouse_id: '12345000000678901',
          quantity_adjusted: 10,
          adjust_quantity_by: 'increase',
          description: 'Missing units found in secondary storage'
        }
      ]
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      },
      params: {
        organization_id: organizationId
      }
    }
  );
  return response.data;
};
```

```python
# Python
def create_stock_adjustment(access_token, organization_id):
    url = 'https://www.zohoapis.com/inventory/v1/inventoryadjustments'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    params = {
        'organization_id': organization_id
    }
    data = {
        'date': '2025-01-15',
        'adjustment_number': 'ADJ-00001',
        'reason': 'Physical inventory count',
        'adjustment_type': 'quantity',
        'line_items': [
            {
                'item_id': '12345000000567890',
                'warehouse_id': '12345000000678901',
                'quantity_adjusted': -5,
                'adjust_quantity_by': 'decrease',
                'description': 'Found 5 damaged units during count'
            }
        ]
    }
    response = requests.post(url, json=data, headers=headers, params=params)
    return response.json()
```

```deluge
// Deluge
adjustment_data = {
    "date": "2025-01-15",
    "adjustment_number": "ADJ-00001",
    "reason": "Physical inventory count",
    "adjustment_type": "quantity",
    "line_items": [
        {
            "item_id": "12345000000567890",
            "warehouse_id": "12345000000678901",
            "quantity_adjusted": -5,
            "adjust_quantity_by": "decrease",
            "description": "Found 5 damaged units during count"
        }
    ]
};

response = zoho.inventory.createRecord("inventoryadjustments", organization_id, adjustment_data);
info response;
```

---

### 7. Composite Items
**Purpose**: Manage bundled products (kits)

**Endpoints**:
```http
GET    /inventory/v1/compositeitems             # List all composite items
GET    /inventory/v1/compositeitems/{item_id}   # Get composite item details
POST   /inventory/v1/compositeitems             # Create composite item
PUT    /inventory/v1/compositeitems/{item_id}   # Update composite item
DELETE /inventory/v1/compositeitems/{item_id}   # Delete composite item
```

**Example - Create Composite Item**:
```javascript
// JavaScript/Node.js
const createCompositeItem = async (accessToken, organizationId) => {
  const response = await axios.post(
    'https://www.zohoapis.com/inventory/v1/compositeitems',
    {
      name: 'Complete Home Audio System',
      sku: 'CHAS-BUNDLE-001',
      unit: 'set',
      description: 'Complete audio system bundle with speakers and amplifier',
      rate: 499.99,
      is_taxable: true,
      tax_id: '12345000000456789',
      mapped_items: [
        {
          item_id: '12345000000567890',
          quantity: 1,
          warehouse_id: '12345000000678901'
        },
        {
          item_id: '12345000000567892',
          quantity: 2,
          warehouse_id: '12345000000678901'
        },
        {
          item_id: '12345000000567893',
          quantity: 1,
          warehouse_id: '12345000000678901'
        }
      ],
      custom_fields: []
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      },
      params: {
        organization_id: organizationId
      }
    }
  );
  return response.data;
};
```

---

### 8. Transfers
**Purpose**: Transfer inventory between warehouses

**Endpoints**:
```http
GET    /inventory/v1/transfers                  # List all transfers
GET    /inventory/v1/transfers/{transfer_id}    # Get transfer details
POST   /inventory/v1/transfers                  # Create transfer
PUT    /inventory/v1/transfers/{transfer_id}    # Update transfer
DELETE /inventory/v1/transfers/{transfer_id}    # Delete transfer
POST   /inventory/v1/transfers/{transfer_id}/send # Send items
POST   /inventory/v1/transfers/{transfer_id}/receive # Receive items
```

**Transfer Statuses**:
- Draft
- In Transit
- Received
- Cancelled

**Example - Create Warehouse Transfer**:
```javascript
// JavaScript/Node.js
const createWarehouseTransfer = async (accessToken, organizationId) => {
  const response = await axios.post(
    'https://www.zohoapis.com/inventory/v1/transfers',
    {
      transfer_number: 'TRN-00001',
      date: '2025-01-15',
      from_warehouse_id: '12345000000678901',
      to_warehouse_id: '12345000000678902',
      expected_delivery_date: '2025-01-18',
      line_items: [
        {
          item_id: '12345000000567890',
          quantity: 50,
          description: 'Restocking east coast warehouse'
        }
      ],
      notes: 'Urgent transfer for upcoming sales event',
      shipping_charge: 75.00
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      },
      params: {
        organization_id: organizationId
      }
    }
  );
  return response.data;
};
```

---

### 9. Contacts (Customers & Vendors)
**Purpose**: Manage customers and vendors

**Endpoints**:
```http
GET    /inventory/v1/contacts                   # List all contacts
GET    /inventory/v1/contacts/{contact_id}      # Get contact details
POST   /inventory/v1/contacts                   # Create contact
PUT    /inventory/v1/contacts/{contact_id}      # Update contact
DELETE /inventory/v1/contacts/{contact_id}      # Delete contact
```

**Contact Types**:
- Customer
- Vendor
- Both

**Example - Create Contact**:
```javascript
// JavaScript/Node.js
const createContact = async (accessToken, organizationId) => {
  const response = await axios.post(
    'https://www.zohoapis.com/inventory/v1/contacts',
    {
      contact_name: 'Tech Solutions Inc',
      contact_type: 'customer',
      company_name: 'Tech Solutions Inc',
      payment_terms: 30,
      payment_terms_label: 'Net 30',
      currency_id: '12345000000000099',
      website: 'www.techsolutions.com',
      billing_address: {
        address: '456 Tech Avenue',
        street2: 'Floor 5',
        city: 'San Jose',
        state: 'CA',
        zip: '95113',
        country: 'USA',
        fax: ''
      },
      shipping_address: {
        address: '456 Tech Avenue',
        street2: 'Loading Dock',
        city: 'San Jose',
        state: 'CA',
        zip: '95113',
        country: 'USA',
        fax: ''
      },
      contact_persons: [
        {
          first_name: 'Sarah',
          last_name: 'Johnson',
          email: 'sarah.johnson@techsolutions.com',
          phone: '555-0156',
          mobile: '555-0157',
          is_primary_contact: true
        }
      ],
      custom_fields: []
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      },
      params: {
        organization_id: organizationId
      }
    }
  );
  return response.data;
};
```

---

### 10. Reports
**Purpose**: Generate inventory and sales reports

**Available Reports**:
- Inventory Summary
- Inventory Valuation
- Stock on Hand
- Low Stock Items
- Sales by Item
- Sales by Customer
- Purchase by Vendor
- Warehouse Summary
- Item Transaction History
- Aging Reports

**Endpoints**:
```http
GET    /inventory/v1/reports/inventorysummary   # Inventory summary
GET    /inventory/v1/reports/inventoryvaluation # Inventory valuation
GET    /inventory/v1/reports/stockonhand        # Stock on hand
GET    /inventory/v1/reports/lowstockitems      # Low stock items
GET    /inventory/v1/reports/salesbyitem        # Sales by item
GET    /inventory/v1/reports/salesbycustomer    # Sales by customer
```

**Example - Get Inventory Summary Report**:
```javascript
// JavaScript/Node.js
const getInventorySummary = async (accessToken, organizationId) => {
  const response = await axios.get(
    'https://www.zohoapis.com/inventory/v1/reports/inventorysummary',
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      },
      params: {
        organization_id: organizationId,
        warehouse_id: '12345000000678901'
      }
    }
  );
  return response.data;
};
```

```python
# Python
def get_low_stock_items(access_token, organization_id):
    url = 'https://www.zohoapis.com/inventory/v1/reports/lowstockitems'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'organization_id': organization_id
    }
    response = requests.get(url, headers=headers, params=params)
    return response.json()
```

```deluge
// Deluge
params = {
    "warehouse_id": "12345000000678901"
};

response = zoho.inventory.getRecords("reports/inventorysummary", organization_id, params);
info response;
```

---

## Authentication

### OAuth 2.0 Flow

**Step 1: Register Your Application**
- Go to [Zoho API Console](https://api-console.zoho.com/)
- Create a new Client
- Client Type: Server-based Applications
- Note your Client ID and Client Secret
- Set authorized redirect URI

**Step 2: Generate Authorization Code**
```http
GET https://accounts.zoho.com/oauth/v2/auth?
  scope=ZohoInventory.fullaccess.all&
  client_id={client_id}&
  response_type=code&
  access_type=offline&
  redirect_uri={redirect_uri}
```

**Available Scopes**:
- `ZohoInventory.fullaccess.all` - Full access to all Inventory data
- `ZohoInventory.fullaccess.READ` - Read-only access
- `ZohoInventory.items.READ` - Read items
- `ZohoInventory.items.CREATE` - Create items
- `ZohoInventory.items.UPDATE` - Update items
- `ZohoInventory.items.DELETE` - Delete items
- `ZohoInventory.salesorders.READ` - Read sales orders
- `ZohoInventory.salesorders.CREATE` - Create sales orders
- `ZohoInventory.salesorders.UPDATE` - Update sales orders
- `ZohoInventory.salesorders.DELETE` - Delete sales orders
- Similar scopes for other modules

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

**JavaScript Token Refresh Example**:
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

**Python Token Refresh Example**:
```python
import requests

def refresh_access_token(client_id, client_secret, refresh_token):
    url = 'https://accounts.zoho.com/oauth/v2/token'
    params = {
        'grant_type': 'refresh_token',
        'client_id': client_id,
        'client_secret': client_secret,
        'refresh_token': refresh_token
    }
    response = requests.post(url, params=params)
    return response.json()['access_token']
```

**Token Lifetime**:
- Access Token: 1 hour
- Refresh Token: Does not expire (store securely)

**Important Notes**:
- Store refresh tokens securely (encrypted database, secure vault)
- Never expose tokens in client-side code
- Implement automatic token refresh before expiration
- Each API request requires the organization_id parameter

---

## organization_id Requirement

**IMPORTANT**: All Zoho Inventory API requests require an `organization_id` parameter.

### Getting Organization ID

**Endpoint**:
```http
GET /inventory/v1/organizations
Authorization: Zoho-oauthtoken {access_token}
```

**Example**:
```javascript
// JavaScript/Node.js
const getOrganizations = async (accessToken) => {
  const response = await axios.get(
    'https://www.zohoapis.com/inventory/v1/organizations',
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    }
  );
  return response.data.organizations;
};
```

**Response**:
```json
{
  "code": 0,
  "message": "success",
  "organizations": [
    {
      "organization_id": "12345000000000099",
      "name": "Acme Corporation",
      "contact_name": "John Doe",
      "email": "john@acme.com",
      "is_default_org": true,
      "language_code": "en",
      "currency_id": "12345000000000100",
      "currency_code": "USD",
      "currency_symbol": "$",
      "time_zone": "PST",
      "date_format": "dd MMM yyyy",
      "field_separator": "comma",
      "fiscal_year_start_month": 1
    }
  ]
}
```

### Using organization_id in Requests

**As Query Parameter**:
```http
GET /inventory/v1/items?organization_id=12345000000000099
Authorization: Zoho-oauthtoken {access_token}
```

**In Code**:
```javascript
// Always include organization_id in params
const response = await axios.get(
  'https://www.zohoapis.com/inventory/v1/items',
  {
    headers: {
      'Authorization': `Zoho-oauthtoken ${accessToken}`
    },
    params: {
      organization_id: organizationId  // Required!
    }
  }
);
```

---

## Rate Limits

### API Call Limits

| Plan | API Calls per Minute | API Calls per Day | Concurrent Calls |
|------|---------------------|-------------------|------------------|
| Free | 100 | 2,500 | 5 |
| Standard | 100 | 5,000 | 10 |
| Professional | 100 | 10,000 | 15 |
| Premium | 100 | 25,000 | 20 |
| Enterprise | 100 | 50,000 | 25 |

### Rate Limit Details

**Per Minute Limit**:
- Maximum 100 API calls per minute per organization
- Applies to all plans
- Resets every 60 seconds

**Daily Limit**:
- Varies by plan (see table above)
- Resets at midnight UTC
- Includes all API operations (GET, POST, PUT, DELETE)

**Concurrent Calls**:
- Maximum simultaneous API requests
- Varies by plan (5-25 concurrent requests)
- Additional requests are queued or rejected

### Rate Limit Headers

```http
X-Rate-Limit-Limit: 100
X-Rate-Limit-Remaining: 87
X-Rate-Limit-Reset: 1673827200
X-Rate-Limit-Day-Limit: 10000
X-Rate-Limit-Day-Remaining: 9456
```

### Handling Rate Limits

**JavaScript Example**:
```javascript
const makeRequestWithRetry = async (url, options, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await axios(url, options);
      return response.data;
    } catch (error) {
      if (error.response?.status === 429) {
        const resetTime = error.response.headers['x-rate-limit-reset'];
        const waitTime = (resetTime * 1000) - Date.now();

        if (i < maxRetries - 1) {
          console.log(`Rate limit hit. Waiting ${waitTime}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
      }
      throw error;
    }
  }
};
```

**Python Example**:
```python
import time
import requests

def make_request_with_retry(url, headers, params, max_retries=3):
    for i in range(max_retries):
        try:
            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 429:
                reset_time = int(e.response.headers.get('X-Rate-Limit-Reset', 0))
                wait_time = reset_time - int(time.time())

                if i < max_retries - 1 and wait_time > 0:
                    print(f'Rate limit hit. Waiting {wait_time}s before retry...')
                    time.sleep(wait_time)
                    continue
            raise
```

**Best Practices**:
- Monitor rate limit headers in responses
- Implement exponential backoff for retries
- Cache frequently accessed data
- Use webhooks for real-time updates instead of polling
- Batch operations when possible
- Distribute API calls throughout the day

---

## Data Centers

Zoho Inventory operates in multiple data centers. Always use the base URL corresponding to your account's data center.

| Data Center | Base URL | Accounts URL |
|-------------|----------|--------------|
| US | https://www.zohoapis.com | https://accounts.zoho.com |
| EU | https://www.zohoapis.eu | https://accounts.zoho.eu |
| IN | https://www.zohoapis.in | https://accounts.zoho.in |
| AU | https://www.zohoapis.com.au | https://accounts.zoho.com.au |
| JP | https://www.zohoapis.jp | https://accounts.zoho.jp |
| CA | https://www.zohoapis.ca | https://accounts.zoho.ca |
| CN | https://www.zohoapis.com.cn | https://accounts.zoho.com.cn |

### Determining Your Data Center

**Method 1: Check OAuth Response**
```json
{
  "access_token": "1000.xxx",
  "api_domain": "https://www.zohoapis.com",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

**Method 2: Check Your Zoho Inventory URL**
- US: inventory.zoho.com
- EU: inventory.zoho.eu
- IN: inventory.zoho.in
- AU: inventory.zoho.com.au
- JP: inventory.zoho.jp
- CA: inventory.zoho.ca
- CN: inventory.zoho.com.cn

**Dynamic Base URL Configuration**:
```javascript
// JavaScript/Node.js
class ZohoInventoryClient {
  constructor(accessToken, apiDomain = 'https://www.zohoapis.com') {
    this.accessToken = accessToken;
    this.apiDomain = apiDomain;
    this.baseURL = `${apiDomain}/inventory/v1`;
  }

  async get(endpoint, params = {}) {
    const response = await axios.get(
      `${this.baseURL}${endpoint}`,
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${this.accessToken}`
        },
        params
      }
    );
    return response.data;
  }
}

// Usage
const client = new ZohoInventoryClient(accessToken, 'https://www.zohoapis.eu');
const items = await client.get('/items', { organization_id: orgId });
```

```python
# Python
class ZohoInventoryClient:
    def __init__(self, access_token, api_domain='https://www.zohoapis.com'):
        self.access_token = access_token
        self.api_domain = api_domain
        self.base_url = f'{api_domain}/inventory/v1'

    def get(self, endpoint, params=None):
        headers = {
            'Authorization': f'Zoho-oauthtoken {self.access_token}'
        }
        response = requests.get(
            f'{self.base_url}{endpoint}',
            headers=headers,
            params=params
        )
        return response.json()

# Usage
client = ZohoInventoryClient(access_token, 'https://www.zohoapis.eu')
items = client.get('/items', {'organization_id': org_id})
```

---

## Error Codes

### HTTP Status Codes

| Status | Meaning | Common Causes |
|--------|---------|---------------|
| 200 | Success | Request completed successfully |
| 201 | Created | Resource created successfully |
| 204 | No Content | Request successful, no data returned |
| 400 | Bad Request | Invalid parameters or request format |
| 401 | Unauthorized | Invalid or expired access token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource does not exist |
| 405 | Method Not Allowed | Invalid HTTP method |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |
| 503 | Service Unavailable | Service temporarily unavailable |

### Zoho Inventory Error Codes

| Code | Message | Description | Solution |
|------|---------|-------------|----------|
| 0 | Success | Operation completed successfully | N/A |
| 1 | Invalid arguments | Missing or invalid parameters | Check required parameters |
| 2 | Invalid organization ID | organization_id is invalid | Verify organization_id |
| 6 | Internal error | Server-side error occurred | Retry with exponential backoff |
| 36 | Duplicate record | Record already exists | Update existing record instead |
| 41 | Resource not found | Requested resource doesn't exist | Verify resource ID |
| 48 | Rate limit exceeded | Too many API calls | Implement rate limiting |
| 57 | Invalid authentication token | Token expired or invalid | Refresh access token |
| 1001 | Mandatory field missing | Required field not provided | Include all required fields |
| 1002 | Invalid field value | Field value is invalid | Validate field values |
| 1003 | Insufficient stock | Not enough stock available | Check stock before creating order |
| 1004 | Item not found | Item ID doesn't exist | Verify item ID |
| 1005 | Warehouse not found | Warehouse ID doesn't exist | Verify warehouse ID |
| 1010 | Permission denied | User lacks permission | Grant necessary permissions |

### Error Response Format

```json
{
  "code": 1001,
  "message": "Mandatory field missing",
  "field": "customer_id",
  "details": "The customer_id field is required for creating a sales order."
}
```

### Error Handling Examples

**JavaScript**:
```javascript
const handleInventoryError = (error) => {
  if (error.response) {
    const { status, data } = error.response;

    switch (status) {
      case 401:
        console.error('Authentication failed. Refreshing token...');
        // Refresh token logic
        break;

      case 429:
        console.error('Rate limit exceeded. Waiting...');
        const resetTime = error.response.headers['x-rate-limit-reset'];
        // Wait logic
        break;

      case 400:
        console.error(`Bad request: ${data.message}`);
        if (data.field) {
          console.error(`Problem with field: ${data.field}`);
        }
        break;

      case 404:
        console.error('Resource not found');
        break;

      case 500:
      case 503:
        console.error('Server error. Retrying...');
        // Retry logic
        break;

      default:
        console.error(`Error ${status}: ${data.message}`);
    }
  } else {
    console.error('Network error:', error.message);
  }
};

// Usage
try {
  const item = await createItem(accessToken, organizationId);
} catch (error) {
  handleInventoryError(error);
}
```

**Python**:
```python
import requests
from requests.exceptions import HTTPError
import time

def handle_inventory_error(error):
    if isinstance(error, HTTPError):
        status = error.response.status_code
        data = error.response.json()

        if status == 401:
            print('Authentication failed. Refreshing token...')
            # Refresh token logic

        elif status == 429:
            print('Rate limit exceeded. Waiting...')
            reset_time = int(error.response.headers.get('X-Rate-Limit-Reset', 0))
            wait_time = reset_time - int(time.time())
            time.sleep(max(wait_time, 0))
            # Retry logic

        elif status == 400:
            print(f"Bad request: {data.get('message')}")
            if 'field' in data:
                print(f"Problem with field: {data['field']}")

        elif status == 404:
            print('Resource not found')

        elif status in [500, 503]:
            print('Server error. Retrying...')
            # Retry logic

        else:
            print(f"Error {status}: {data.get('message')}")
    else:
        print(f'Request error: {str(error)}')

# Usage
try:
    item = create_item(access_token, organization_id)
except HTTPError as e:
    handle_inventory_error(e)
```

---

## Common Operations

### 1. Check Stock Availability

```javascript
// JavaScript/Node.js
const checkStockAvailability = async (accessToken, organizationId, itemId) => {
  const response = await axios.get(
    `https://www.zohoapis.com/inventory/v1/items/${itemId}`,
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      },
      params: {
        organization_id: organizationId
      }
    }
  );

  const item = response.data.item;
  return {
    item_name: item.name,
    sku: item.sku,
    available_stock: item.available_stock,
    committed_stock: item.committed_stock,
    actual_available_stock: item.actual_available_stock,
    reorder_level: item.reorder_level,
    needs_reorder: item.available_stock <= item.reorder_level
  };
};
```

### 2. Process Complete Order Workflow

```javascript
// JavaScript/Node.js
const processCompleteOrder = async (accessToken, organizationId) => {
  try {
    // 1. Create sales order
    const salesOrder = await createSalesOrder(accessToken, organizationId);
    console.log('Sales order created:', salesOrder.salesorder.salesorder_id);

    // 2. Confirm sales order
    await axios.post(
      `https://www.zohoapis.com/inventory/v1/salesorders/${salesOrder.salesorder.salesorder_id}/status/confirmed`,
      {},
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`
        },
        params: { organization_id: organizationId }
      }
    );
    console.log('Sales order confirmed');

    // 3. Create package
    const pkg = await createPackage(accessToken, organizationId);
    console.log('Package created:', pkg.package.package_id);

    // 4. Ship package
    await shipPackage(accessToken, organizationId, pkg.package.package_id);
    console.log('Package shipped');

    // 5. Create invoice (assuming Zoho Books integration)
    // This would typically be done through Zoho Books API

    return {
      success: true,
      salesorder_id: salesOrder.salesorder.salesorder_id,
      package_id: pkg.package.package_id
    };

  } catch (error) {
    console.error('Order processing error:', error.response?.data || error.message);
    throw error;
  }
};
```

### 3. Bulk Stock Update

```python
# Python
def bulk_update_stock(access_token, organization_id, stock_updates):
    """
    stock_updates format:
    [
        {'item_id': 'xxx', 'warehouse_id': 'yyy', 'quantity': 100},
        {'item_id': 'zzz', 'warehouse_id': 'yyy', 'quantity': 50}
    ]
    """
    results = {
        'successful': [],
        'failed': []
    }

    # Create single inventory adjustment
    line_items = []
    for update in stock_updates:
        line_items.append({
            'item_id': update['item_id'],
            'warehouse_id': update['warehouse_id'],
            'quantity_adjusted': update['quantity'],
            'adjust_quantity_by': 'set_to',
            'description': 'Bulk stock update'
        })

    url = 'https://www.zohoapis.com/inventory/v1/inventoryadjustments'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    params = {
        'organization_id': organization_id
    }
    data = {
        'date': datetime.now().strftime('%Y-%m-%d'),
        'reason': 'Bulk stock update',
        'adjustment_type': 'quantity',
        'line_items': line_items
    }

    try:
        response = requests.post(url, json=data, headers=headers, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as e:
        print(f'Error updating stock: {e.response.json()}')
        raise
```

### 4. Get Low Stock Items Report

```javascript
// JavaScript/Node.js
const getLowStockItems = async (accessToken, organizationId) => {
  const response = await axios.get(
    'https://www.zohoapis.com/inventory/v1/reports/lowstockitems',
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      },
      params: {
        organization_id: organizationId
      }
    }
  );

  const lowStockItems = response.data.items || [];

  // Generate purchase order suggestions
  const suggestions = lowStockItems.map(item => ({
    item_id: item.item_id,
    item_name: item.name,
    current_stock: item.stock_on_hand,
    reorder_level: item.reorder_level,
    suggested_order_quantity: item.reorder_level * 2 - item.stock_on_hand
  }));

  return suggestions;
};
```

### 5. Transfer Stock Between Warehouses

```python
# Python
def transfer_stock_between_warehouses(access_token, organization_id, from_warehouse, to_warehouse, items):
    url = 'https://www.zohoapis.com/inventory/v1/transfers'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json'
    }
    params = {
        'organization_id': organization_id
    }

    line_items = []
    for item in items:
        line_items.append({
            'item_id': item['item_id'],
            'quantity': item['quantity'],
            'description': item.get('description', '')
        })

    data = {
        'date': datetime.now().strftime('%Y-%m-%d'),
        'from_warehouse_id': from_warehouse,
        'to_warehouse_id': to_warehouse,
        'line_items': line_items,
        'notes': 'Warehouse transfer'
    }

    response = requests.post(url, json=data, headers=headers, params=params)
    return response.json()
```

### 6. Update Sales Order Status

```javascript
// JavaScript/Node.js
const updateSalesOrderStatus = async (accessToken, organizationId, salesorderId, status) => {
  // Valid statuses: open, confirmed, void
  const response = await axios.post(
    `https://www.zohoapis.com/inventory/v1/salesorders/${salesorderId}/status/${status}`,
    {},
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      },
      params: {
        organization_id: organizationId
      }
    }
  );
  return response.data;
};
```

### 7. Get Item Transaction History

```python
# Python
def get_item_transaction_history(access_token, organization_id, item_id, start_date, end_date):
    url = f'https://www.zohoapis.com/inventory/v1/items/{item_id}/transactionhistory'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}'
    }
    params = {
        'organization_id': organization_id,
        'date_start': start_date,
        'date_end': end_date
    }
    response = requests.get(url, headers=headers, params=params)
    return response.json()
```

### 8. Create Bundle/Kit Item

```javascript
// JavaScript/Node.js
const createBundleItem = async (accessToken, organizationId, bundleData) => {
  const response = await axios.post(
    'https://www.zohoapis.com/inventory/v1/compositeitems',
    {
      name: bundleData.name,
      sku: bundleData.sku,
      description: bundleData.description,
      rate: bundleData.rate,
      is_taxable: bundleData.is_taxable,
      tax_id: bundleData.tax_id,
      mapped_items: bundleData.mapped_items.map(item => ({
        item_id: item.item_id,
        quantity: item.quantity,
        warehouse_id: item.warehouse_id
      }))
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      },
      params: {
        organization_id: organizationId
      }
    }
  );
  return response.data;
};
```

### 9. Search Items by SKU or Name

```javascript
// JavaScript/Node.js
const searchItems = async (accessToken, organizationId, searchTerm) => {
  const response = await axios.get(
    'https://www.zohoapis.com/inventory/v1/items',
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      },
      params: {
        organization_id: organizationId,
        search_text: searchTerm,
        filter_by: 'Status.All'
      }
    }
  );
  return response.data.items;
};
```

### 10. Generate Packing Slip

```python
# Python
def generate_packing_slip(access_token, organization_id, package_id):
    url = f'https://www.zohoapis.com/inventory/v1/packages/{package_id}'
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Accept': 'application/pdf'
    }
    params = {
        'organization_id': organization_id
    }
    response = requests.get(url, headers=headers, params=params)

    # Save PDF
    with open(f'packing_slip_{package_id}.pdf', 'wb') as f:
        f.write(response.content)

    return f'packing_slip_{package_id}.pdf'
```

---

## Code Examples

### Complete Inventory Management System

```javascript
// JavaScript/Node.js - Complete Inventory Management System
class InventoryManager {
  constructor(accessToken, organizationId, apiDomain = 'https://www.zohoapis.com') {
    this.accessToken = accessToken;
    this.organizationId = organizationId;
    this.baseURL = `${apiDomain}/inventory/v1`;
  }

  async makeRequest(method, endpoint, data = null) {
    const config = {
      method,
      url: `${this.baseURL}${endpoint}`,
      headers: {
        'Authorization': `Zoho-oauthtoken ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      params: {
        organization_id: this.organizationId
      }
    };

    if (data) {
      config.data = data;
    }

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Item Management
  async createItem(itemData) {
    return await this.makeRequest('POST', '/items', itemData);
  }

  async getItem(itemId) {
    return await this.makeRequest('GET', `/items/${itemId}`);
  }

  async updateItem(itemId, itemData) {
    return await this.makeRequest('PUT', `/items/${itemId}`, itemData);
  }

  async deleteItem(itemId) {
    return await this.makeRequest('DELETE', `/items/${itemId}`);
  }

  async listItems(filters = {}) {
    const response = await axios.get(
      `${this.baseURL}/items`,
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${this.accessToken}`
        },
        params: {
          organization_id: this.organizationId,
          ...filters
        }
      }
    );
    return response.data.items;
  }

  // Sales Order Management
  async createSalesOrder(orderData) {
    return await this.makeRequest('POST', '/salesorders', orderData);
  }

  async getSalesOrder(orderId) {
    return await this.makeRequest('GET', `/salesorders/${orderId}`);
  }

  async confirmSalesOrder(orderId) {
    return await this.makeRequest('POST', `/salesorders/${orderId}/status/confirmed`);
  }

  // Purchase Order Management
  async createPurchaseOrder(poData) {
    return await this.makeRequest('POST', '/purchaseorders', poData);
  }

  async issuePurchaseOrder(poId) {
    return await this.makeRequest('POST', `/purchaseorders/${poId}/status/issued`);
  }

  async receiveItems(poId, receiveData) {
    return await this.makeRequest('POST', `/purchaseorders/${poId}/receive`, receiveData);
  }

  // Package Management
  async createPackage(packageData) {
    return await this.makeRequest('POST', '/packages', packageData);
  }

  async shipPackage(packageId, shipmentData) {
    return await this.makeRequest('POST', `/packages/${packageId}/ship`, shipmentData);
  }

  // Warehouse Management
  async createWarehouse(warehouseData) {
    return await this.makeRequest('POST', '/warehouses', warehouseData);
  }

  async listWarehouses() {
    const response = await axios.get(
      `${this.baseURL}/warehouses`,
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${this.accessToken}`
        },
        params: {
          organization_id: this.organizationId
        }
      }
    );
    return response.data.warehouses;
  }

  // Stock Adjustment
  async adjustStock(adjustmentData) {
    return await this.makeRequest('POST', '/inventoryadjustments', adjustmentData);
  }

  // Transfer Management
  async transferStock(transferData) {
    return await this.makeRequest('POST', '/transfers', transferData);
  }

  // Reporting
  async getInventorySummary(warehouseId = null) {
    const params = { organization_id: this.organizationId };
    if (warehouseId) {
      params.warehouse_id = warehouseId;
    }

    const response = await axios.get(
      `${this.baseURL}/reports/inventorysummary`,
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${this.accessToken}`
        },
        params
      }
    );
    return response.data;
  }

  async getLowStockItems() {
    const response = await axios.get(
      `${this.baseURL}/reports/lowstockitems`,
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${this.accessToken}`
        },
        params: {
          organization_id: this.organizationId
        }
      }
    );
    return response.data.items;
  }

  // Utility Methods
  async checkStockAvailability(itemId, warehouseId = null) {
    const item = await this.getItem(itemId);
    if (warehouseId) {
      // Filter by specific warehouse
      const warehouseStock = item.item.warehouses?.find(
        w => w.warehouse_id === warehouseId
      );
      return warehouseStock?.warehouse_available_stock || 0;
    }
    return item.item.available_stock;
  }
}

// Usage Example
const manager = new InventoryManager(accessToken, organizationId);

// Create item
const newItem = await manager.createItem({
  name: 'Wireless Mouse',
  sku: 'WM-001',
  rate: 29.99,
  initial_stock: 100,
  reorder_level: 20
});

// Create sales order
const salesOrder = await manager.createSalesOrder({
  customer_id: customerId,
  line_items: [
    { item_id: newItem.item.item_id, quantity: 5 }
  ]
});

// Confirm order
await manager.confirmSalesOrder(salesOrder.salesorder.salesorder_id);

// Get low stock items
const lowStockItems = await manager.getLowStockItems();
console.log('Items needing reorder:', lowStockItems);
```

### Python Inventory Automation

```python
# Python - Automated Inventory Management
import requests
from datetime import datetime, timedelta
from typing import List, Dict, Optional

class ZohoInventoryManager:
    def __init__(self, access_token: str, organization_id: str, api_domain: str = 'https://www.zohoapis.com'):
        self.access_token = access_token
        self.organization_id = organization_id
        self.base_url = f'{api_domain}/inventory/v1'
        self.headers = {
            'Authorization': f'Zoho-oauthtoken {access_token}',
            'Content-Type': 'application/json'
        }

    def _make_request(self, method: str, endpoint: str, data: Optional[Dict] = None, extra_params: Optional[Dict] = None):
        url = f'{self.base_url}{endpoint}'
        params = {'organization_id': self.organization_id}
        if extra_params:
            params.update(extra_params)

        try:
            if method == 'GET':
                response = requests.get(url, headers=self.headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=self.headers, params=params)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=self.headers, params=params)
            elif method == 'DELETE':
                response = requests.delete(url, headers=self.headers, params=params)

            response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError as e:
            print(f'API Error: {e.response.json()}')
            raise

    # Item Operations
    def create_item(self, item_data: Dict):
        return self._make_request('POST', '/items', item_data)

    def get_item(self, item_id: str):
        return self._make_request('GET', f'/items/{item_id}')

    def list_items(self, filters: Optional[Dict] = None):
        return self._make_request('GET', '/items', extra_params=filters)

    # Sales Order Operations
    def create_sales_order(self, order_data: Dict):
        return self._make_request('POST', '/salesorders', order_data)

    def get_sales_order(self, order_id: str):
        return self._make_request('GET', f'/salesorders/{order_id}')

    # Stock Management
    def adjust_stock(self, adjustment_data: Dict):
        return self._make_request('POST', '/inventoryadjustments', adjustment_data)

    def transfer_stock(self, transfer_data: Dict):
        return self._make_request('POST', '/transfers', transfer_data)

    # Reporting
    def get_inventory_summary(self, warehouse_id: Optional[str] = None):
        params = {}
        if warehouse_id:
            params['warehouse_id'] = warehouse_id
        return self._make_request('GET', '/reports/inventorysummary', extra_params=params)

    def get_low_stock_items(self):
        result = self._make_request('GET', '/reports/lowstockitems')
        return result.get('items', [])

    # Automated Workflows
    def auto_reorder_low_stock(self, default_vendor_id: str):
        """Automatically create purchase orders for low stock items"""
        low_stock_items = self.get_low_stock_items()

        if not low_stock_items:
            print('No low stock items found')
            return []

        # Group by vendor
        vendor_items = {}
        for item in low_stock_items:
            vendor_id = item.get('vendor_id', default_vendor_id)
            if vendor_id not in vendor_items:
                vendor_items[vendor_id] = []

            reorder_qty = max(item['reorder_level'] * 2 - item['stock_on_hand'], item['reorder_level'])
            vendor_items[vendor_id].append({
                'item_id': item['item_id'],
                'quantity': reorder_qty,
                'rate': item['purchase_rate']
            })

        # Create purchase orders
        purchase_orders = []
        for vendor_id, items in vendor_items.items():
            po_data = {
                'vendor_id': vendor_id,
                'date': datetime.now().strftime('%Y-%m-%d'),
                'line_items': [
                    {
                        'item_id': item['item_id'],
                        'quantity': item['quantity'],
                        'rate': item['rate']
                    }
                    for item in items
                ]
            }
            po = self.create_purchase_order(po_data)
            purchase_orders.append(po)
            print(f"Created PO for vendor {vendor_id}: {po['purchaseorder']['purchaseorder_id']}")

        return purchase_orders

    def create_purchase_order(self, po_data: Dict):
        return self._make_request('POST', '/purchaseorders', po_data)

    def generate_daily_report(self, output_file: str = 'inventory_report.txt'):
        """Generate daily inventory status report"""
        summary = self.get_inventory_summary()
        low_stock = self.get_low_stock_items()

        with open(output_file, 'w') as f:
            f.write(f'Inventory Report - {datetime.now().strftime("%Y-%m-%d")}\n')
            f.write('=' * 60 + '\n\n')

            f.write('Inventory Summary:\n')
            f.write(f'Total SKUs: {summary.get("total_items", 0)}\n')
            f.write(f'Total Value: ${summary.get("total_value", 0):,.2f}\n\n')

            f.write('Low Stock Items:\n')
            f.write('-' * 60 + '\n')
            for item in low_stock:
                f.write(f'{item["name"]} (SKU: {item["sku"]})\n')
                f.write(f'  Current Stock: {item["stock_on_hand"]}\n')
                f.write(f'  Reorder Level: {item["reorder_level"]}\n\n')

        print(f'Report generated: {output_file}')

# Usage
manager = ZohoInventoryManager(access_token, organization_id)

# Auto-reorder low stock items
manager.auto_reorder_low_stock(default_vendor_id='12345000000234567')

# Generate daily report
manager.generate_daily_report()
```

### Deluge Integration Examples

```deluge
// Deluge - Sync Inventory from CRM Deal
// Triggered when a deal is won in Zoho CRM

dealId = "12345000000567890";
organizationId = "12345000000000099";

// Get deal details
dealInfo = zoho.crm.getRecordById("Deals", dealId);
contactId = dealInfo.get("Contact_Name").get("id");
contactInfo = zoho.crm.getRecordById("Contacts", contactId);

// Get products from deal
products = zoho.crm.getRelatedRecords("Products", "Deals", dealId);

// Build line items
lineItems = List();
for each product in products {
    // Check inventory availability
    itemParams = {"search_text": product.get("Product_Code")};
    itemSearch = zoho.inventory.getRecords("items", organizationId, itemParams);

    if(itemSearch.get("items").size() > 0) {
        inventoryItem = itemSearch.get("items").get(0);
        itemId = inventoryItem.get("item_id");

        // Check stock
        availableStock = inventoryItem.get("available_stock");
        requiredQty = product.get("Quantity");

        if(availableStock >= requiredQty) {
            lineItem = {
                "item_id": itemId,
                "quantity": requiredQty,
                "rate": product.get("Unit_Price"),
                "warehouse_id": "12345000000678901"
            };
            lineItems.add(lineItem);
        } else {
            // Log insufficient stock
            info "Insufficient stock for " + product.get("Product_Name");
            info "Available: " + availableStock + ", Required: " + requiredQty;
        }
    }
}

// Create sales order if items available
if(lineItems.size() > 0) {
    // Get or create inventory contact
    contactParams = {"search_text": contactInfo.get("Email")};
    invContactSearch = zoho.inventory.getRecords("contacts", organizationId, contactParams);

    if(invContactSearch.get("contacts").size() > 0) {
        invContactId = invContactSearch.get("contacts").get(0).get("contact_id");
    } else {
        // Create contact in Inventory
        invContactData = {
            "contact_name": contactInfo.get("Full_Name"),
            "company_name": contactInfo.get("Account_Name").get("name"),
            "contact_type": "customer",
            "email": contactInfo.get("Email"),
            "phone": contactInfo.get("Phone")
        };
        invContactResp = zoho.inventory.createRecord("contacts", organizationId, invContactData);
        invContactId = invContactResp.get("contact").get("contact_id");
    }

    // Create sales order
    salesOrderData = {
        "customer_id": invContactId,
        "date": zoho.currentdate.toString("yyyy-MM-dd"),
        "shipment_date": zoho.currentdate.addDay(7).toString("yyyy-MM-dd"),
        "reference_number": "CRM-DEAL-" + dealId,
        "line_items": lineItems,
        "notes": "Order created from CRM Deal: " + dealInfo.get("Deal_Name")
    };

    soResponse = zoho.inventory.createRecord("salesorders", organizationId, salesOrderData);
    salesOrderId = soResponse.get("salesorder").get("salesorder_id");

    // Update CRM deal
    updateMap = Map();
    updateMap.put("Inventory_SO_ID", salesOrderId);
    updateMap.put("Inventory_Status", "Sales Order Created");
    zoho.crm.updateRecord("Deals", dealId, updateMap);

    info "Sales Order created: " + salesOrderId;
} else {
    info "No items available to create sales order";
}
```

```deluge
// Deluge - Automated Stock Alerts
// Scheduled function to check low stock and send alerts

organizationId = "12345000000000099";

// Get low stock items
lowStockResp = zoho.inventory.getRecords("reports/lowstockitems", organizationId, {});
lowStockItems = lowStockResp.get("items");

if(lowStockItems != null && lowStockItems.size() > 0) {
    // Build email content
    emailBody = "<h2>Low Stock Alert</h2>";
    emailBody = emailBody + "<p>The following items need to be reordered:</p>";
    emailBody = emailBody + "<table border='1' cellpadding='5'>";
    emailBody = emailBody + "<tr><th>Item Name</th><th>SKU</th><th>Current Stock</th><th>Reorder Level</th><th>Suggested Order</th></tr>";

    for each item in lowStockItems {
        currentStock = item.get("stock_on_hand");
        reorderLevel = item.get("reorder_level");
        suggestedOrder = (reorderLevel * 2) - currentStock;

        emailBody = emailBody + "<tr>";
        emailBody = emailBody + "<td>" + item.get("name") + "</td>";
        emailBody = emailBody + "<td>" + item.get("sku") + "</td>";
        emailBody = emailBody + "<td>" + currentStock + "</td>";
        emailBody = emailBody + "<td>" + reorderLevel + "</td>";
        emailBody = emailBody + "<td>" + suggestedOrder + "</td>";
        emailBody = emailBody + "</tr>";
    }

    emailBody = emailBody + "</table>";

    // Send email
    sendmail[
        from: zoho.adminuserid
        to: "inventory@company.com"
        subject: "Low Stock Alert - " + zoho.currentdate.toString("yyyy-MM-dd")
        message: emailBody
    ];

    info "Low stock alert sent for " + lowStockItems.size() + " items";
} else {
    info "No low stock items found";
}
```

---

## Best Practices

### 1. Authentication & Security

**Store Tokens Securely**:
```javascript
// Good: Use environment variables
const config = {
  clientId: process.env.ZOHO_CLIENT_ID,
  clientSecret: process.env.ZOHO_CLIENT_SECRET,
  refreshToken: process.env.ZOHO_REFRESH_TOKEN
};

// Bad: Hard-coded credentials
const config = {
  clientId: '1000.ABC123',
  clientSecret: 'secret123',
  refreshToken: '1000.XYZ789'
};
```

### 2. Stock Management

**Always Check Stock Before Creating Orders**:
```javascript
const validateStockBeforeOrder = async (manager, lineItems) => {
  for (const item of lineItems) {
    const availableStock = await manager.checkStockAvailability(
      item.item_id,
      item.warehouse_id
    );

    if (availableStock < item.quantity) {
      throw new Error(
        `Insufficient stock for item ${item.item_id}. ` +
        `Available: ${availableStock}, Required: ${item.quantity}`
      );
    }
  }
  return true;
};
```

### 3. Error Handling

**Implement Comprehensive Error Handling**:
```python
def safe_api_call(fn, *args, **kwargs):
    max_retries = 3
    for attempt in range(max_retries):
        try:
            return fn(*args, **kwargs)
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 429:
                # Rate limit
                wait_time = 60
                print(f'Rate limit hit. Waiting {wait_time}s...')
                time.sleep(wait_time)
            elif e.response.status_code in [500, 502, 503]:
                # Server error - retry with backoff
                wait_time = (2 ** attempt) + random.uniform(0, 1)
                print(f'Server error. Retrying in {wait_time:.2f}s...')
                time.sleep(wait_time)
            else:
                raise
    raise Exception(f'Failed after {max_retries} attempts')
```

### 4. Batch Operations

**Process Items in Batches**:
```javascript
const processBatch = async (items, batchSize, processFn) => {
  const results = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);

    for (const item of batch) {
      try {
        const result = await processFn(item);
        results.push({ success: true, data: result });
      } catch (error) {
        results.push({ success: false, error: error.message, item });
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    // Longer pause between batches
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  return results;
};
```

### 5. Caching

**Cache Frequently Accessed Data**:
```javascript
const cache = new Map();
const CACHE_TTL = 3600000; // 1 hour

const getCachedData = async (key, fetchFn) => {
  const cached = cache.get(key);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const data = await fetchFn();
  cache.set(key, { data, timestamp: Date.now() });

  return data;
};

// Usage
const warehouses = await getCachedData(
  'warehouses',
  () => manager.listWarehouses()
);
```

### 6. Monitoring & Alerts

**Set Up Automated Monitoring**:
```python
class InventoryMonitor:
    def __init__(self, manager):
        self.manager = manager
        self.alert_email = 'alerts@company.com'

    def check_low_stock(self):
        low_stock_items = self.manager.get_low_stock_items()
        if low_stock_items:
            self.send_alert('Low Stock Alert', low_stock_items)

    def check_pending_orders(self):
        # Check for orders pending too long
        pass

    def send_alert(self, subject, data):
        # Send email/SMS alert
        pass

    def run_all_checks(self):
        self.check_low_stock()
        self.check_pending_orders()
```

### 7. Data Validation

**Validate Data Before Sending**:
```javascript
const validateItemData = (itemData) => {
  const required = ['name', 'sku', 'rate'];
  const missing = required.filter(field => !itemData[field]);

  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }

  if (itemData.rate <= 0) {
    throw new Error('Rate must be greater than 0');
  }

  if (itemData.track_inventory && !itemData.initial_stock) {
    throw new Error('Initial stock required for tracked items');
  }

  return true;
};
```

### 8. Pagination

**Handle Large Datasets**:
```python
def get_all_items(manager):
    all_items = []
    page = 1
    per_page = 200

    while True:
        response = manager.list_items({
            'page': page,
            'per_page': per_page
        })

        items = response.get('items', [])
        all_items.extend(items)

        page_context = response.get('page_context', {})
        if not page_context.get('has_more_page', False):
            break

        page += 1
        print(f'Fetched page {page}, total items: {len(all_items)}')

    return all_items
```

### 9. Webhook Integration

**Set Up Webhooks for Real-time Updates**:
```javascript
const express = require('express');
const app = express();

app.use(express.json());

app.post('/webhook/inventory', async (req, res) => {
  const { event_type, data } = req.body;

  try {
    switch (event_type) {
      case 'item.created':
        await handleItemCreated(data);
        break;

      case 'item.updated':
        await handleItemUpdated(data);
        break;

      case 'salesorder.created':
        await handleSalesOrderCreated(data);
        break;

      case 'stock.low':
        await handleLowStock(data);
        break;

      default:
        console.log('Unhandled event:', event_type);
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Error processing webhook');
  }
});

app.listen(3000);
```

### 10. Testing

**Write Tests for Critical Operations**:
```javascript
const assert = require('assert');

describe('Inventory Manager', () => {
  let manager;

  beforeEach(() => {
    manager = new InventoryManager(testToken, testOrgId);
  });

  it('should create item successfully', async () => {
    const itemData = {
      name: 'Test Item',
      sku: 'TEST-001',
      rate: 10.00
    };

    const result = await manager.createItem(itemData);
    assert.ok(result.item.item_id);
    assert.equal(result.item.name, 'Test Item');
  });

  it('should check stock availability', async () => {
    const stock = await manager.checkStockAvailability(testItemId);
    assert.ok(typeof stock === 'number');
  });

  it('should handle insufficient stock error', async () => {
    try {
      await validateStockBeforeOrder(manager, [
        { item_id: 'test', quantity: 1000000 }
      ]);
      assert.fail('Should have thrown error');
    } catch (error) {
      assert.ok(error.message.includes('Insufficient stock'));
    }
  });
});
```

---

## Additional Resources

- [Official Zoho Inventory API Documentation](https://www.zoho.com/inventory/api/v1/)
- [API Console](https://api-console.zoho.com/)
- [Zoho Inventory Help Documentation](https://www.zoho.com/inventory/help/)
- [Developer Forums](https://help.zoho.com/portal/en/community/inventory)
- [Status Page](https://status.zoho.com/)
- [Integration Guides](https://www.zoho.com/inventory/integrations/)

---

## Changelog

### v1 (Current)
- Complete REST API for inventory management
- Multi-warehouse support
- Sales order and purchase order management
- Package and shipment tracking
- Composite items (bundles/kits)
- Stock transfers between warehouses
- Inventory adjustments
- Comprehensive reporting
- Multi-currency support
- Custom fields support
- Barcode scanning support
- Serial and batch tracking

---

**Last Updated**: December 2025
**API Version**: v1
