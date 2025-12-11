# Deluge Database Operations

Database operations in Deluge allow you to interact with Zoho CRM, Zoho Creator, and other Zoho applications' data stores. This guide covers CRUD operations, ZCQL queries, and data management patterns.

## Table of Contents

- [Overview](#overview)
- [Zoho CRM Database Operations](#zoho-crm-database-operations)
  - [Get Records](#get-records)
  - [Create Records](#create-records)
  - [Update Records](#update-records)
  - [Delete Records](#delete-records)
  - [Search Records](#search-records)
- [Zoho Creator Database Operations](#zoho-creator-database-operations)
  - [Fetch Records](#fetch-records)
  - [Insert Records](#insert-records)
  - [Update Records (Creator)](#update-records-creator)
  - [Delete Records (Creator)](#delete-records-creator)
- [ZCQL (Zoho Creator Query Language)](#zcql-zoho-creator-query-language)
- [Filtering and Sorting](#filtering-and-sorting)
- [Pagination](#pagination)
- [Bulk Operations](#bulk-operations)
- [Common Patterns](#common-patterns)
- [Best Practices](#best-practices)
- [Limitations](#limitations)

---

## Overview

Deluge provides built-in functions to interact with Zoho application databases:

- **Zoho CRM**: `zoho.crm.*` functions
- **Zoho Creator**: Direct table access, ZCQL queries
- **Other Zoho Apps**: App-specific functions

### Key Concepts

- **Module/Table**: Container for records (e.g., Leads, Contacts, Orders)
- **Record**: Individual data entry with fields
- **Field**: Specific data attribute (e.g., Email, Name, Amount)
- **Criteria**: Conditions for filtering records

---

## Zoho CRM Database Operations

### Get Records

Retrieve records from CRM modules.

#### zoho.crm.getRecords()

Fetch multiple records from a module.

```javascript
// Syntax
recordList = zoho.crm.getRecords(moduleName, [fromIndex], [toIndex], [params]);

// Basic Example - Get all leads
leads = zoho.crm.getRecords("Leads");
info leads;

// Get first 10 leads
leads = zoho.crm.getRecords("Leads", 1, 10);

// Get leads with specific fields
params = Map();
params.put("fields", "First_Name,Last_Name,Email,Company");
leads = zoho.crm.getRecords("Leads", 1, 200, params);

// Get leads sorted by creation time
params = Map();
params.put("sortBy", "Created_Time");
params.put("sortOrder", "desc");
leads = zoho.crm.getRecords("Leads", 1, 100, params);

// Process retrieved records
for each record in leads
{
    leadName = record.get("Last_Name");
    leadEmail = record.get("Email");
    info "Lead: " + leadName + " - " + leadEmail;
}
```

#### zoho.crm.getRecordById()

Retrieve a specific record by ID.

```javascript
// Syntax
record = zoho.crm.getRecordById(moduleName, recordId, [params]);

// Example - Get lead by ID
leadId = "12345000000123456";
lead = zoho.crm.getRecordById("Leads", leadId);

if(lead != null)
{
    firstName = lead.get("First_Name");
    lastName = lead.get("Last_Name");
    email = lead.get("Email");

    info "Lead Name: " + firstName + " " + lastName;
    info "Email: " + email;
}

// Get specific fields only
params = Map();
params.put("fields", "First_Name,Last_Name,Email,Phone");
lead = zoho.crm.getRecordById("Leads", leadId, params);
```

#### zoho.crm.getRelatedRecords()

Get related records (e.g., contacts of an account).

```javascript
// Syntax
relatedRecords = zoho.crm.getRelatedRecords(relatedListName, moduleName, recordId);

// Example - Get contacts for an account
accountId = "12345000000234567";
contacts = zoho.crm.getRelatedRecords("Contacts", "Accounts", accountId);

for each contact in contacts
{
    contactName = contact.get("Full_Name");
    contactEmail = contact.get("Email");
    info "Contact: " + contactName + " (" + contactEmail + ")";
}

// Get deals related to a contact
contactId = "12345000000345678";
deals = zoho.crm.getRelatedRecords("Deals", "Contacts", contactId);

for each deal in deals
{
    dealName = deal.get("Deal_Name");
    dealAmount = deal.get("Amount");
    info "Deal: " + dealName + " - $" + dealAmount;
}
```

---

### Create Records

Add new records to CRM modules.

#### zoho.crm.createRecord()

Create a single record.

```javascript
// Syntax
response = zoho.crm.createRecord(moduleName, recordMap, [params]);

// Example - Create a lead
leadData = Map();
leadData.put("Last_Name", "Johnson");
leadData.put("First_Name", "Sarah");
leadData.put("Company", "TechCorp");
leadData.put("Email", "sarah@techcorp.com");
leadData.put("Phone", "555-0123");
leadData.put("Lead_Source", "Website");
leadData.put("Lead_Status", "New");

response = zoho.crm.createRecord("Leads", leadData);
info response;

// Check if creation was successful
if(response.get("id") != null)
{
    newLeadId = response.get("id");
    info "Lead created successfully with ID: " + newLeadId;
}
else
{
    info "Lead creation failed";
    info response;
}

// Create contact with owner
contactData = Map();
contactData.put("Last_Name", "Smith");
contactData.put("First_Name", "John");
contactData.put("Email", "john@example.com");
contactData.put("Phone", "555-0456");

// Set owner
owner = Map();
owner.put("id", "12345000000123456");
contactData.put("Owner", owner);

// Set account
account = Map();
account.put("id", "12345000000234567");
contactData.put("Account_Name", account);

response = zoho.crm.createRecord("Contacts", contactData);
```

#### Bulk Create Records

Create multiple records at once.

```javascript
// Create multiple leads
leadList = List();

// Lead 1
lead1 = Map();
lead1.put("Last_Name", "Anderson");
lead1.put("First_Name", "Emma");
lead1.put("Company", "Anderson Inc");
lead1.put("Email", "emma@andersoninc.com");
leadList.add(lead1);

// Lead 2
lead2 = Map();
lead2.put("Last_Name", "Brown");
lead2.put("First_Name", "Michael");
lead2.put("Company", "Brown LLC");
lead2.put("Email", "michael@brownllc.com");
leadList.add(lead2);

// Lead 3
lead3 = Map();
lead3.put("Last_Name", "Davis");
lead3.put("First_Name", "Lisa");
lead3.put("Company", "Davis Corp");
lead3.put("Email", "lisa@daviscorp.com");
leadList.add(lead3);

// Create all leads
params = Map();
params.put("data", leadList);

response = zoho.crm.invokeUrl
(
    url: "https://www.zohoapis.com/crm/v2/Leads",
    type: POST,
    parameters: params.toString(),
    connection: "crm_connection"
);

info response;
```

---

### Update Records

Modify existing records.

#### zoho.crm.updateRecord()

Update a single record.

```javascript
// Syntax
response = zoho.crm.updateRecord(moduleName, recordId, updateMap, [params]);

// Example - Update lead status
leadId = "12345000000123456";
updateData = Map();
updateData.put("Lead_Status", "Qualified");
updateData.put("Rating", "Hot");

response = zoho.crm.updateRecord("Leads", leadId, updateData);
info response;

// Update with trigger workflow
params = Map();
params.put("trigger", "workflow");

updateData = Map();
updateData.put("Lead_Status", "Contacted");
updateData.put("Description", "Follow-up call completed");

response = zoho.crm.updateRecord("Leads", leadId, updateData, params);

// Update contact's account
contactId = "12345000000345678";
updateData = Map();

account = Map();
account.put("id", "12345000000234567");
updateData.put("Account_Name", account);

response = zoho.crm.updateRecord("Contacts", contactId, updateData);
```

#### Bulk Update

Update multiple records.

```javascript
// Update multiple leads
updateList = List();

// Update 1
update1 = Map();
update1.put("id", "12345000000123456");
update1.put("Lead_Status", "Qualified");
updateList.add(update1);

// Update 2
update2 = Map();
update2.put("id", "12345000000234567");
update2.put("Lead_Status", "Qualified");
updateList.add(update2);

// Perform bulk update
for each updateData in updateList
{
    recordId = updateData.get("id");
    response = zoho.crm.updateRecord("Leads", recordId, updateData);
    info "Updated: " + recordId + " - " + response;
}
```

---

### Delete Records

Remove records from CRM.

#### zoho.crm.deleteRecord()

Delete a single record.

```javascript
// Syntax
response = zoho.crm.deleteRecord(moduleName, recordId);

// Example - Delete a lead
leadId = "12345000000123456";
response = zoho.crm.deleteRecord("Leads", leadId);

if(response.get("status") == "success")
{
    info "Lead deleted successfully";
}
else
{
    info "Delete failed: " + response;
}
```

---

### Search Records

Find records based on criteria.

#### zoho.crm.searchRecords()

Search with criteria.

```javascript
// Syntax
records = zoho.crm.searchRecords(moduleName, searchCriteria, [fromIndex], [toIndex]);

// Example - Search leads by email
searchCriteria = "(Email:equals:sarah@techcorp.com)";
leads = zoho.crm.searchRecords("Leads", searchCriteria);

for each lead in leads
{
    info "Found lead: " + lead.get("Full_Name");
}

// Search with multiple criteria
searchCriteria = "(Lead_Status:equals:Qualified)and(Rating:equals:Hot)";
leads = zoho.crm.searchRecords("Leads", searchCriteria, 1, 50);

// Search by phone
searchCriteria = "(Phone:equals:555-0123)";
contacts = zoho.crm.searchRecords("Contacts", searchCriteria);

// Search deals by amount range
searchCriteria = "(Amount:greater_than:10000)and(Amount:less_than:50000)";
deals = zoho.crm.searchRecords("Deals", searchCriteria);

for each deal in deals
{
    dealName = deal.get("Deal_Name");
    amount = deal.get("Amount");
    info "Deal: " + dealName + " - $" + amount;
}
```

#### Search Operators

Common search operators:

- `equals` - Exact match
- `contains` - Partial match
- `starts_with` - Begins with
- `ends_with` - Ends with
- `greater_than` - Greater than
- `less_than` - Less than
- `greater_equal` - Greater than or equal
- `less_equal` - Less than or equal

---

## Zoho Creator Database Operations

### Fetch Records

Retrieve data from Creator applications.

```javascript
// Syntax
records = <ApplicationName>.<FormName>[<Criteria>];

// Example - Get all orders
orders = MyApp.Orders[ID > 0];

for each order in orders
{
    orderNum = order.Order_Number;
    total = order.Total_Amount;
    info "Order: " + orderNum + " - $" + total;
}

// Get records with specific criteria
highValueOrders = MyApp.Orders[Total_Amount > 1000];

// Get records sorted
recentOrders = MyApp.Orders[ID > 0] sort by Created_Time desc;

// Get single record by ID
order = MyApp.Orders[ID == 123456];
```

#### Using fetch statement

```javascript
// Fetch with criteria
orderList = MyApp.Orders[Status == "Pending"];

for each order in orderList
{
    customerName = order.Customer_Name;
    amount = order.Total_Amount;
    info "Pending Order: " + customerName + " - $" + amount;
}

// Fetch with complex criteria
activeCustomers = MyApp.Customers[Status == "Active" && Subscription_Date > "01-Jan-2024"];

// Fetch with limit
topOrders = MyApp.Orders[ID > 0] sort by Total_Amount desc limit 10;
```

---

### Insert Records

Add records to Creator tables.

```javascript
// Syntax
insert into <FormName>
[
    FieldName1 = value1,
    FieldName2 = value2
];

// Example - Insert customer
insert into MyApp.Customers
[
    Customer_Name = "John Smith",
    Email = "john@example.com",
    Phone = "555-0123",
    Status = "Active",
    Created_Date = today
];

// Insert with variable data
customerName = "Sarah Johnson";
customerEmail = "sarah@example.com";

insert into MyApp.Customers
[
    Customer_Name = customerName,
    Email = customerEmail,
    Phone = "555-0456",
    Subscription_Date = today,
    Status = "Trial"
];

// Insert order
insert into MyApp.Orders
[
    Order_Number = "ORD-" + zoho.currenttime.toString("yyyyMMddHHmmss"),
    Customer_ID = 12345,
    Total_Amount = 299.99,
    Status = "Pending",
    Order_Date = today
];
```

---

### Update Records (Creator)

Modify Creator records.

```javascript
// Syntax
for each record in <FormName>[<Criteria>]
{
    record.FieldName = newValue;
}

// Example - Update order status
for each order in MyApp.Orders[Order_Number == "ORD-001"]
{
    order.Status = "Shipped";
    order.Shipped_Date = today;
}

// Update multiple records
for each order in MyApp.Orders[Status == "Pending" && Order_Date < today - 30]
{
    order.Status = "Cancelled";
    order.Cancellation_Reason = "Order expired";
}

// Update with calculation
for each product in MyApp.Products[Category == "Electronics"]
{
    currentPrice = product.Price;
    product.Price = currentPrice * 1.10;  // 10% price increase
    product.Last_Updated = zoho.currenttime;
}
```

---

### Delete Records (Creator)

Remove records from Creator.

```javascript
// Syntax
delete from <FormName>[<Criteria>];

// Example - Delete old orders
delete from MyApp.Orders[Status == "Cancelled" && Order_Date < today - 365];

// Delete specific record
delete from MyApp.Customers[ID == 12345];

// Delete with multiple criteria
delete from MyApp.TempData[Status == "Processed" && Created_Date < today - 7];
```

---

## ZCQL (Zoho Creator Query Language)

ZCQL is SQL-like syntax for querying Creator data.

### Basic SELECT

```javascript
// Syntax
queryResult = zoho.creator.query(<query_string>, <connection>);

// Example - Select all customers
query = "SELECT * FROM Customers";
result = zoho.creator.query(query, "creator_connection");

for each row in result
{
    customerName = row.get("Customer_Name");
    email = row.get("Email");
    info "Customer: " + customerName + " - " + email;
}

// Select specific fields
query = "SELECT Customer_Name, Email, Phone FROM Customers WHERE Status = 'Active'";
result = zoho.creator.query(query, "creator_connection");

// Select with ORDER BY
query = "SELECT * FROM Orders ORDER BY Order_Date DESC LIMIT 10";
result = zoho.creator.query(query, "creator_connection");
```

### WHERE Clause

```javascript
// Simple WHERE
query = "SELECT * FROM Orders WHERE Status = 'Pending'";
result = zoho.creator.query(query, "creator_connection");

// Multiple conditions with AND
query = "SELECT * FROM Orders WHERE Status = 'Pending' AND Total_Amount > 100";
result = zoho.creator.query(query, "creator_connection");

// OR condition
query = "SELECT * FROM Customers WHERE Status = 'Active' OR Status = 'Trial'";
result = zoho.creator.query(query, "creator_connection");

// Date comparison
query = "SELECT * FROM Orders WHERE Order_Date >= '2024-01-01'";
result = zoho.creator.query(query, "creator_connection");

// LIKE for pattern matching
query = "SELECT * FROM Customers WHERE Email LIKE '%@example.com'";
result = zoho.creator.query(query, "creator_connection");

// IN clause
query = "SELECT * FROM Products WHERE Category IN ('Electronics', 'Computers', 'Accessories')";
result = zoho.creator.query(query, "creator_connection");
```

### Aggregate Functions

```javascript
// COUNT
query = "SELECT COUNT(*) AS total_orders FROM Orders";
result = zoho.creator.query(query, "creator_connection");
totalOrders = result.get(0).get("total_orders");
info "Total Orders: " + totalOrders;

// SUM
query = "SELECT SUM(Total_Amount) AS revenue FROM Orders WHERE Status = 'Completed'";
result = zoho.creator.query(query, "creator_connection");
totalRevenue = result.get(0).get("revenue");
info "Total Revenue: $" + totalRevenue;

// AVG
query = "SELECT AVG(Total_Amount) AS avg_order_value FROM Orders";
result = zoho.creator.query(query, "creator_connection");

// MAX and MIN
query = "SELECT MAX(Total_Amount) AS highest, MIN(Total_Amount) AS lowest FROM Orders";
result = zoho.creator.query(query, "creator_connection");

// GROUP BY
query = "SELECT Status, COUNT(*) AS count FROM Orders GROUP BY Status";
result = zoho.creator.query(query, "creator_connection");

for each row in result
{
    status = row.get("Status");
    count = row.get("count");
    info status + ": " + count + " orders";
}
```

### JOIN Operations

```javascript
// INNER JOIN
query = "SELECT o.Order_Number, o.Total_Amount, c.Customer_Name, c.Email " +
        "FROM Orders o INNER JOIN Customers c ON o.Customer_ID = c.ID " +
        "WHERE o.Status = 'Pending'";
result = zoho.creator.query(query, "creator_connection");

for each row in result
{
    orderNum = row.get("Order_Number");
    customerName = row.get("Customer_Name");
    amount = row.get("Total_Amount");
    info "Order " + orderNum + " - " + customerName + " - $" + amount;
}

// LEFT JOIN
query = "SELECT c.Customer_Name, COUNT(o.ID) AS order_count " +
        "FROM Customers c LEFT JOIN Orders o ON c.ID = o.Customer_ID " +
        "GROUP BY c.Customer_Name";
result = zoho.creator.query(query, "creator_connection");
```

---

## Filtering and Sorting

### CRM Filtering

```javascript
// Get records with parameter-based filtering
params = Map();
params.put("criteria", "(Lead_Status:equals:Qualified)");
params.put("fields", "First_Name,Last_Name,Email,Company");

leads = zoho.crm.getRecords("Leads", 1, 100, params);

// Complex criteria
criteria = "(Lead_Status:equals:Qualified)and((Rating:equals:Hot)or(Rating:equals:Warm))";
params = Map();
params.put("criteria", criteria);

leads = zoho.crm.getRecords("Leads", 1, 200, params);
```

### Creator Filtering

```javascript
// Simple filter
pendingOrders = MyApp.Orders[Status == "Pending"];

// Multiple conditions
highValueOrders = MyApp.Orders[Status == "Pending" && Total_Amount > 1000];

// Date filters
recentOrders = MyApp.Orders[Order_Date > today - 30];

// String matching
customers = MyApp.Customers[Email.contains("@example.com")];
```

### Sorting

```javascript
// CRM sorting
params = Map();
params.put("sort_by", "Created_Time");
params.put("sort_order", "desc");
leads = zoho.crm.getRecords("Leads", 1, 100, params);

// Creator sorting
recentOrders = MyApp.Orders[ID > 0] sort by Order_Date desc;

// ZCQL sorting
query = "SELECT * FROM Orders ORDER BY Total_Amount DESC, Order_Date DESC";
result = zoho.creator.query(query, "creator_connection");
```

---

## Pagination

### CRM Pagination

```javascript
// Paginate through all leads
pageSize = 200;
fromIndex = 1;
toIndex = pageSize;
hasMore = true;

while(hasMore)
{
    leads = zoho.crm.getRecords("Leads", fromIndex, toIndex);

    if(leads.size() > 0)
    {
        for each lead in leads
        {
            // Process each lead
            leadName = lead.get("Full_Name");
            info "Processing: " + leadName;
        }

        fromIndex = fromIndex + pageSize;
        toIndex = toIndex + pageSize;
    }
    else
    {
        hasMore = false;
    }
}
```

### Creator Pagination

```javascript
// Process records in batches
batchSize = 200;
offset = 0;

allOrders = MyApp.Orders[ID > 0];
totalRecords = allOrders.count();

while(offset < totalRecords)
{
    query = "SELECT * FROM Orders LIMIT " + batchSize + " OFFSET " + offset;
    batch = zoho.creator.query(query, "creator_connection");

    for each order in batch
    {
        // Process each order
        orderNum = order.get("Order_Number");
        info "Processing: " + orderNum;
    }

    offset = offset + batchSize;
}
```

---

## Bulk Operations

### Bulk Data Export

```javascript
// Export all leads to process
allLeads = List();
pageSize = 200;
page = 1;

hasMore = true;
while(hasMore)
{
    fromIndex = (page - 1) * pageSize + 1;
    toIndex = page * pageSize;

    leads = zoho.crm.getRecords("Leads", fromIndex, toIndex);

    if(leads.size() > 0)
    {
        allLeads.addAll(leads);
        page = page + 1;
    }
    else
    {
        hasMore = false;
    }
}

info "Total leads exported: " + allLeads.size();
```

### Bulk Data Import

```javascript
// Import data from external source
csvData = // ... fetch CSV data ...

for each row in csvData
{
    leadData = Map();
    leadData.put("Last_Name", row.get("LastName"));
    leadData.put("First_Name", row.get("FirstName"));
    leadData.put("Company", row.get("Company"));
    leadData.put("Email", row.get("Email"));

    try
    {
        response = zoho.crm.createRecord("Leads", leadData);
        info "Created lead: " + response.get("id");
    }
    catch (e)
    {
        info "Failed to create lead: " + e;
    }
}
```

---

## Common Patterns

### Pattern 1: Sync Data Between Modules

```javascript
// Sync contacts from leads
qualifiedLeads = zoho.crm.searchRecords("Leads", "(Lead_Status:equals:Qualified)");

for each lead in qualifiedLeads
{
    // Check if contact already exists
    email = lead.get("Email");
    searchCriteria = "(Email:equals:" + email + ")";
    existingContacts = zoho.crm.searchRecords("Contacts", searchCriteria);

    if(existingContacts.size() == 0)
    {
        // Create new contact
        contactData = Map();
        contactData.put("Last_Name", lead.get("Last_Name"));
        contactData.put("First_Name", lead.get("First_Name"));
        contactData.put("Email", email);
        contactData.put("Phone", lead.get("Phone"));

        response = zoho.crm.createRecord("Contacts", contactData);
        info "Created contact from lead: " + response.get("id");
    }
}
```

### Pattern 2: Aggregate Data

```javascript
// Calculate total deal value by stage
dealStages = {"Qualification", "Needs Analysis", "Proposal", "Negotiation", "Closed Won"};
stageMap = Map();

for each stage in dealStages
{
    searchCriteria = "(Stage:equals:" + stage + ")";
    deals = zoho.crm.searchRecords("Deals", searchCriteria, 1, 200);

    totalAmount = 0;
    for each deal in deals
    {
        amount = deal.get("Amount");
        if(amount != null)
        {
            totalAmount = totalAmount + amount;
        }
    }

    stageMap.put(stage, totalAmount);
}

// Report results
for each stage in stageMap.keys()
{
    amount = stageMap.get(stage);
    info stage + ": $" + amount;
}
```

### Pattern 3: Data Validation and Cleanup

```javascript
// Find and fix duplicate emails
allContacts = zoho.crm.getRecords("Contacts", 1, 200);
emailMap = Map();

for each contact in allContacts
{
    email = contact.get("Email");

    if(email != null && email != "")
    {
        if(emailMap.containsKey(email))
        {
            // Duplicate found
            info "Duplicate email: " + email;
            info "Contact 1: " + emailMap.get(email);
            info "Contact 2: " + contact.get("id");
        }
        else
        {
            emailMap.put(email, contact.get("id"));
        }
    }
}
```

---

## Best Practices

### 1. Use Batch Processing

```javascript
// Good - Process in batches
pageSize = 200;
for page from 1 to 10
{
    fromIndex = (page - 1) * pageSize + 1;
    toIndex = page * pageSize;
    records = zoho.crm.getRecords("Leads", fromIndex, toIndex);
    // Process records
}

// Avoid - Loading all records at once
allRecords = zoho.crm.getRecords("Leads", 1, 10000);  // May timeout
```

### 2. Check Record Existence Before Creating

```javascript
// Good - Check first
searchCriteria = "(Email:equals:" + email + ")";
existing = zoho.crm.searchRecords("Contacts", searchCriteria);

if(existing.size() == 0)
{
    // Create new record
    response = zoho.crm.createRecord("Contacts", contactData);
}
else
{
    // Update existing record
    contactId = existing.get(0).get("id");
    response = zoho.crm.updateRecord("Contacts", contactId, contactData);
}
```

### 3. Handle Null Values

```javascript
// Good - Check for null
amount = record.get("Amount");
if(amount != null && amount > 0)
{
    totalAmount = totalAmount + amount;
}

// Avoid - Direct arithmetic with potential null
totalAmount = totalAmount + record.get("Amount");  // May cause error
```

### 4. Use Specific Field Selection

```javascript
// Good - Select only needed fields
params = Map();
params.put("fields", "First_Name,Last_Name,Email");
records = zoho.crm.getRecords("Leads", 1, 200, params);

// Avoid - Fetching all fields when not needed
records = zoho.crm.getRecords("Leads", 1, 200);
```

### 5. Implement Error Handling

```javascript
// Good - Try-catch for operations
try
{
    response = zoho.crm.createRecord("Leads", leadData);
    info "Success: " + response.get("id");
}
catch (e)
{
    info "Error creating lead: " + e;
    // Log error details
    // Retry logic or fallback
}
```

---

## Limitations

### Execution Limits

- **Maximum 5000 statements** per script execution
- **Maximum 75 function calls** per execution
- **40-second timeout** for script execution

### API Limits

- **CRM API**: Rate limits vary by edition (5,000-100,000 calls/day)
- **Creator**: Connection limits apply
- **Pagination**: Maximum 200 records per API call

### Data Limits

- **Maximum field size**: 32,000 characters
- **Maximum records per bulk operation**: Varies by product (typically 100-200)

### ZCQL Limitations

- **No support for subqueries** in some contexts
- **Limited JOIN support** - Check Creator documentation
- **Aggregate function limitations** in certain queries

---

## Additional Resources

- [Zoho CRM API Documentation](https://www.zoho.com/crm/developer/docs/api/v2/)
- [Zoho Creator Deluge Guide](https://www.zoho.com/creator/help/script/deluge-overview.html)
- [ZCQL Documentation](https://www.zoho.com/creator/help/script/zcql.html)

---

**Last Updated**: December 2025
**Related**: [API Integration](../api-integration/README.md) | [Error Handling](../error-handling/README.md) | [Examples](../examples/README.md)
