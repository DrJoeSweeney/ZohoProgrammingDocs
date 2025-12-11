# Deluge Collections

Collections in Deluge allow you to store and manipulate groups of related data. This guide covers Lists, Maps, and Collection data types with comprehensive examples and iteration patterns.

## Table of Contents

- [Overview](#overview)
- [Lists](#lists)
  - [Creating Lists](#creating-lists)
  - [List Operations](#list-operations)
  - [List Iteration](#list-iteration)
- [Maps (Key-Value)](#maps-key-value)
  - [Creating Maps](#creating-maps)
  - [Map Operations](#map-operations)
  - [Map Iteration](#map-iteration)
- [Collection Data Type](#collection-data-type)
- [Iteration Patterns](#iteration-patterns)
- [Nested Collections](#nested-collections)
- [Common Use Cases](#common-use-cases)
- [Performance Considerations](#performance-considerations)
- [Best Practices](#best-practices)

## Overview

Deluge provides three main collection types:

| Type | Structure | Use Case |
|------|-----------|----------|
| **List** | Ordered, indexed elements | Sequential data, arrays |
| **Map** | Key-value pairs | Structured data, objects |
| **Collection** | Unified list/map interface | Generic collections |

### Key Differences

**Lists**:
- Zero-based indexing (0, 1, 2, ...)
- Ordered sequence
- Duplicate values allowed
- Access by numeric index

**Maps**:
- String keys
- Unordered key-value pairs
- Unique keys (duplicates overwrite)
- Access by key name

**Collections**:
- Can behave as either List or Map
- Unified interface
- More flexible but less common

## Lists

Lists store ordered sequences of elements accessible by zero-based index.

### Creating Lists

#### Empty List

```javascript
// Empty list
emptyList = {};
emptyList2 = List();

// Check size
count = emptyList.size();  // 0
```

#### List with Elements

```javascript
// List of strings
products = {"Zoho CRM", "Zoho Creator", "Zoho Books"};

// List of numbers
quantities = {10, 25, 50, 100};
prices = {29.99, 49.99, 99.99};

// List of dates
dates = {'01-Jan-2025', '15-Jan-2025', '31-Jan-2025'};

// Mixed types (not recommended)
mixedList = {"Text", 123, true, '15-Jan-2025'};

// Single element
singleItem = {"Only Element"};
```

#### Dynamic List Creation

```javascript
// Build list dynamically
monthList = {};
monthList.add("January");
monthList.add("February");
monthList.add("March");
// ... and so on

// Build from loop
numberList = {};
for each i in {1, 2, 3, 4, 5}
{
    numberList.add(i * 10);
}
// numberList = {10, 20, 30, 40, 50}
```

### List Operations

#### add() - Add Element

```javascript
// Add single element
fruits = {"Apple", "Banana"};
fruits.add("Orange");
// fruits = {"Apple", "Banana", "Orange"}

// Add to empty list
tags = {};
tags.add("Important");
tags.add("Urgent");
// tags = {"Important", "Urgent"}

// Add in loop
emailList = {};
contacts = zoho.crm.getRecords("Contacts", 1, 200);
for each contact in contacts
{
    email = contact.get("Email");
    if(email != null && email != "")
    {
        emailList.add(email);
    }
}
```

#### addAll() - Add Multiple Elements

```javascript
// Add multiple elements
fruits = {"Apple", "Banana"};
moreFruits = {"Orange", "Grape", "Mango"};
fruits.addAll(moreFruits);
// fruits = {"Apple", "Banana", "Orange", "Grape", "Mango"}

// Limit: Maximum 25,000 elements with addAll()
largeList = {};
batchData = generateBatchData();  // Returns list with items
largeList.addAll(batchData);

// Combine multiple lists
list1 = {"A", "B"};
list2 = {"C", "D"};
list3 = {"E", "F"};
combined = {};
combined.addAll(list1);
combined.addAll(list2);
combined.addAll(list3);
// combined = {"A", "B", "C", "D", "E", "F"}
```

#### get() - Get Element by Index

```javascript
// Access elements (zero-based)
products = {"Laptop", "Mouse", "Keyboard"};
firstProduct = products.get(0);   // "Laptop"
secondProduct = products.get(1);  // "Mouse"
thirdProduct = products.get(2);   // "Keyboard"

// Check bounds before accessing
if(products.size() > 0)
{
    firstItem = products.get(0);
}

// Get last element
lastIndex = products.size() - 1;
lastProduct = products.get(lastIndex);  // "Keyboard"

// Loop with index
for each i in {0, 1, 2}
{
    if(i < products.size())
    {
        product = products.get(i);
        info "Product " + i + ": " + product;
    }
}
```

#### remove() - Remove Element

```javascript
// Remove by value
fruits = {"Apple", "Banana", "Orange", "Banana"};
fruits.remove("Banana");
// Removes first occurrence: {"Apple", "Orange", "Banana"}

// Remove in loop (careful!)
numbers = {1, 2, 3, 4, 5};
toRemove = {2, 4};
for each num in toRemove
{
    numbers.remove(num);
}
// numbers = {1, 3, 5}

// Remove all occurrences
fruits = {"Apple", "Banana", "Orange", "Banana", "Grape"};
while(fruits.contains("Banana"))
{
    fruits.remove("Banana");
}
// fruits = {"Apple", "Orange", "Grape"}
```

#### contains() - Check if Element Exists

```javascript
// Check existence
fruits = {"Apple", "Banana", "Orange"};
hasApple = fruits.contains("Apple");   // true
hasMango = fruits.contains("Mango");   // false

// Conditional logic
allowedStatuses = {"Active", "Pending", "Approved"};
currentStatus = "Active";
if(allowedStatuses.contains(currentStatus))
{
    info "Status is valid";
}
else
{
    info "Invalid status";
}

// Validation
submittedTags = {"urgent", "important", "follow-up"};
validTags = {"urgent", "important", "low-priority", "follow-up"};
for each tag in submittedTags
{
    if(!validTags.contains(tag))
    {
        info "Invalid tag: " + tag;
    }
}
```

#### indexOf() - Get Element Index

```javascript
// Find index
colors = {"Red", "Green", "Blue", "Yellow"};
blueIndex = colors.indexOf("Blue");  // 2
redIndex = colors.indexOf("Red");    // 0
notFound = colors.indexOf("Purple"); // -1

// Check if exists and get position
searchColor = "Green";
index = colors.indexOf(searchColor);
if(index > -1)
{
    info searchColor + " found at position " + index;
}
else
{
    info searchColor + " not found";
}

// Find and replace
items = {"Item1", "Item2", "Item3"};
replaceItem = "Item2";
newItem = "Item2-Updated";
index = items.indexOf(replaceItem);
if(index > -1)
{
    items.remove(replaceItem);
    // Note: Deluge lists don't have direct set() method
    // Would need to rebuild list or use different approach
}
```

#### size() - Get Element Count

```javascript
// Get count
products = {"Laptop", "Mouse", "Keyboard"};
count = products.size();  // 3

// Check if empty
if(products.size() == 0)
{
    info "No products available";
}

// Alternative empty check
if(products.size() > 0)
{
    info "Products available: " + products.size();
}

// Iterate with size
for each i in {0, 1, 2, 3, 4}
{
    if(i < products.size())
    {
        product = products.get(i);
        processProduct(product);
    }
}

// Progress tracking
totalRecords = recordList.size();
processed = 0;
for each record in recordList
{
    processRecord(record);
    processed = processed + 1;
    progress = (processed / totalRecords) * 100;
    info "Progress: " + progress + "%";
}
```

#### clear() - Remove All Elements

```javascript
// Clear list
items = {"Item1", "Item2", "Item3"};
items.clear();
// items = {}
count = items.size();  // 0

// Reset list for reuse
tempList = {"A", "B", "C"};
// ... use tempList
tempList.clear();
// ... reuse tempList
tempList.add("X");
tempList.add("Y");
```

#### sort() - Sort List

```javascript
// Sort ascending
numbers = {5, 2, 8, 1, 9};
numbers.sort();
// numbers = {1, 2, 5, 8, 9}

// Sort strings alphabetically
names = {"John", "Alice", "Bob", "Charlie"};
names.sort();
// names = {"Alice", "Bob", "Charlie", "John"}

// Sort before processing
scores = {85, 92, 78, 95, 88};
scores.sort();
highestScore = scores.get(scores.size() - 1);  // 95
lowestScore = scores.get(0);  // 78

// Case-sensitive sorting
items = {"apple", "Banana", "Apple", "banana"};
items.sort();
// Capital letters come before lowercase in ASCII
```

#### reverse() - Reverse List Order

```javascript
// Reverse order
numbers = {1, 2, 3, 4, 5};
numbers.reverse();
// numbers = {5, 4, 3, 2, 1}

// Sort descending (sort then reverse)
scores = {85, 92, 78, 95, 88};
scores.sort();
scores.reverse();
// scores = {95, 92, 88, 85, 78}

// Reverse names
names = {"Alice", "Bob", "Charlie"};
names.reverse();
// names = {"Charlie", "Bob", "Alice"}
```

### List Iteration

#### Basic For Each Loop

```javascript
// Simple iteration
fruits = {"Apple", "Banana", "Orange"};
for each fruit in fruits
{
    info "Fruit: " + fruit;
}

// Process each element
prices = {29.99, 49.99, 99.99};
total = 0;
for each price in prices
{
    total = total + price;
}
info "Total: $" + total;  // $179.97
```

#### Iteration with Condition

```javascript
// Filter while iterating
numbers = {5, 12, 8, 15, 3, 20};
largeNumbers = {};
for each num in numbers
{
    if(num >= 10)
    {
        largeNumbers.add(num);
    }
}
// largeNumbers = {12, 15, 20}

// Find first match
searchTerm = "Item3";
found = false;
items = {"Item1", "Item2", "Item3", "Item4"};
for each item in items
{
    if(item == searchTerm)
    {
        info "Found: " + item;
        found = true;
        break;
    }
}
```

#### Iteration with Index Tracking

```javascript
// Track position
products = {"Laptop", "Mouse", "Keyboard"};
index = 0;
for each product in products
{
    info "Position " + index + ": " + product;
    index = index + 1;
}

// Process with line numbers
lines = {"First line", "Second line", "Third line"};
lineNumber = 1;
for each line in lines
{
    output = "Line " + lineNumber + ": " + line;
    info output;
    lineNumber = lineNumber + 1;
}
```

#### Nested List Iteration

```javascript
// Matrix / 2D array simulation
rows = {
    {"A1", "A2", "A3"},
    {"B1", "B2", "B3"},
    {"C1", "C2", "C3"}
};

for each row in rows
{
    for each cell in row
    {
        info cell;
    }
}

// Process grouped data
departments = {
    {"Engineering", "Alice", "Bob", "Charlie"},
    {"Sales", "David", "Eve"},
    {"Marketing", "Frank", "Grace", "Henry"}
};

for each dept in departments
{
    deptName = dept.get(0);
    info "Department: " + deptName;

    // Skip first element (department name)
    for each i in {1, 2, 3, 4, 5}
    {
        if(i < dept.size())
        {
            employee = dept.get(i);
            info "  - " + employee;
        }
    }
}
```

## Maps (Key-Value)

Maps store data as key-value pairs where each unique key maps to a value.

### Creating Maps

#### Empty Map

```javascript
// Empty map
emptyMap = Map();
emptyMap2 = {};  // Can be ambiguous, Map() is clearer

// Check size
count = emptyMap.size();  // 0
```

#### Map with Initial Data

```javascript
// Simple map
person = {
    "FirstName": "John",
    "LastName": "Smith",
    "Age": 30
};

// Contact information
contact = {
    "Name": "John Smith",
    "Email": "john@example.com",
    "Phone": "555-1234",
    "City": "San Francisco"
};

// Product details
product = {
    "Name": "Magic Mouse",
    "Price": 79.99,
    "InStock": true,
    "Quantity": 50,
    "Category": "Electronics"
};

// Configuration
config = {
    "api_url": "https://api.example.com",
    "timeout": 30,
    "retry_count": 3,
    "debug_mode": false
};
```

#### Nested Maps

```javascript
// Map with nested map
company = {
    "Name": "Zoho Corporation",
    "Founded": 1996,
    "Headquarters": {
        "City": "Austin",
        "State": "Texas",
        "Country": "USA"
    },
    "Employees": 15000
};

// Access nested values
hqCity = company.get("Headquarters").get("City");  // "Austin"

// Complex nested structure
order = {
    "OrderId": "ORD-12345",
    "Customer": {
        "Name": "John Smith",
        "Email": "john@example.com"
    },
    "Items": {
        "Item1": {"Name": "Laptop", "Price": 999.99, "Qty": 1},
        "Item2": {"Name": "Mouse", "Price": 29.99, "Qty": 2}
    },
    "Total": 1059.97
};
```

### Map Operations

#### put() - Add or Update Key-Value

```javascript
// Create and populate map
customer = Map();
customer.put("FirstName", "John");
customer.put("LastName", "Smith");
customer.put("Email", "john@example.com");

// Update existing key (overwrites)
customer.put("Email", "john.smith@example.com");

// Add multiple entries
customer.put("Phone", "555-1234");
customer.put("City", "Boston");
customer.put("State", "MA");

// Build from data
recordData = Map();
recordData.put("Status", "Active");
recordData.put("Priority", "High");
recordData.put("Assigned_To", "Sales Team");
```

#### get() - Get Value by Key

```javascript
// Access values
person = {
    "FirstName": "John",
    "LastName": "Smith",
    "Age": 30
};

firstName = person.get("FirstName");  // "John"
age = person.get("Age");              // 30

// Key not found returns null
middleName = person.get("MiddleName");  // null

// Safe access with null check
if(person.get("Email") != null)
{
    email = person.get("Email");
    sendEmail(email);
}

// With default value
email = ifNull(person.get("Email"), "no-email@example.com");
```

#### containsKey() - Check if Key Exists

```javascript
// Check key existence
product = {
    "Name": "Laptop",
    "Price": 999.99,
    "InStock": true
};

hasPrice = product.containsKey("Price");      // true
hasDiscount = product.containsKey("Discount"); // false

// Conditional logic
if(product.containsKey("Discount"))
{
    discount = product.get("Discount");
    finalPrice = product.get("Price") - discount;
}
else
{
    finalPrice = product.get("Price");
}

// Validation
requiredFields = {"Name", "Email", "Phone"};
formData = input.FormData;
allPresent = true;
for each field in requiredFields
{
    if(!formData.containsKey(field))
    {
        info "Missing field: " + field;
        allPresent = false;
    }
}
```

#### keys() - Get All Keys

```javascript
// Get all keys as list
person = {
    "FirstName": "John",
    "LastName": "Smith",
    "Email": "john@example.com"
};

allKeys = person.keys();
// allKeys = {"FirstName", "LastName", "Email"}

// Iterate through keys
for each key in allKeys
{
    value = person.get(key);
    info key + ": " + value;
}

// Check all keys
if(allKeys.contains("Email"))
{
    info "Email field present";
}

// Get key count
keyCount = allKeys.size();  // 3
```

#### values() - Get All Values

```javascript
// Get all values as list
scores = {
    "Math": 95,
    "English": 88,
    "Science": 92
};

allScores = scores.values();
// allScores = {95, 88, 92}

// Calculate from values
total = 0;
for each score in allScores
{
    total = total + score;
}
average = total / allScores.size();  // 91.67

// Check if value exists
if(allScores.contains(95))
{
    info "Perfect score found";
}
```

#### remove() - Remove Key-Value Pair

```javascript
// Remove entry
person = {
    "FirstName": "John",
    "LastName": "Smith",
    "Email": "john@example.com",
    "TempField": "temporary"
};

person.remove("TempField");
// person = {"FirstName": "John", "LastName": "Smith", "Email": "john@example.com"}

// Conditional removal
if(person.containsKey("MiddleName") && person.get("MiddleName") == "")
{
    person.remove("MiddleName");
}

// Remove multiple
fieldsToRemove = {"Field1", "Field2", "Field3"};
for each field in fieldsToRemove
{
    if(person.containsKey(field))
    {
        person.remove(field);
    }
}
```

#### size() - Get Key Count

```javascript
// Get number of keys
product = {
    "Name": "Laptop",
    "Price": 999.99,
    "InStock": true
};

count = product.size();  // 3

// Check if empty
if(product.size() == 0)
{
    info "Map is empty";
}

// Validate minimum fields
requiredFieldCount = 5;
if(formData.size() < requiredFieldCount)
{
    info "Incomplete data";
}
```

#### clear() - Remove All Entries

```javascript
// Clear map
data = {
    "Field1": "Value1",
    "Field2": "Value2",
    "Field3": "Value3"
};

data.clear();
// data = {}
count = data.size();  // 0

// Reset for reuse
tempMap = {"A": 1, "B": 2};
// ... use tempMap
tempMap.clear();
// ... reuse tempMap
tempMap.put("X", 10);
```

#### putAll() - Merge Maps

```javascript
// Merge two maps
baseMap = {
    "Name": "John Smith",
    "Email": "john@example.com"
};

additionalData = {
    "Phone": "555-1234",
    "City": "Boston"
};

baseMap.putAll(additionalData);
// baseMap = {"Name": "John Smith", "Email": "john@example.com", "Phone": "555-1234", "City": "Boston"}

// Duplicate keys get overwritten
map1 = {"A": 1, "B": 2};
map2 = {"B": 20, "C": 3};
map1.putAll(map2);
// map1 = {"A": 1, "B": 20, "C": 3}

// Build complex map
finalData = Map();
finalData.putAll(customerInfo);
finalData.putAll(orderInfo);
finalData.putAll(shippingInfo);
```

### Map Iteration

#### Iterate Through Keys

```javascript
// Iterate using keys()
customer = {
    "Name": "John Smith",
    "Email": "john@example.com",
    "Phone": "555-1234"
};

for each key in customer.keys()
{
    value = customer.get(key);
    info key + ": " + value;
}
// Output:
// Name: John Smith
// Email: john@example.com
// Phone: 555-1234
```

#### Conditional Iteration

```javascript
// Process specific keys
product = {
    "Name": "Laptop",
    "Price": 999.99,
    "InStock": true,
    "Quantity": 10,
    "Category": "Electronics"
};

// Process only certain fields
displayFields = {"Name", "Price", "Category"};
for each key in displayFields
{
    if(product.containsKey(key))
    {
        value = product.get(key);
        info key + ": " + value;
    }
}

// Skip certain fields
for each key in product.keys()
{
    if(key == "Internal_ID" || key == "TempData")
    {
        continue;
    }

    value = product.get(key);
    processField(key, value);
}
```

#### Build New Map from Iteration

```javascript
// Transform map
prices = {
    "ItemA": 10,
    "ItemB": 20,
    "ItemC": 30
};

// Apply discount
discountedPrices = Map();
for each key in prices.keys()
{
    originalPrice = prices.get(key);
    discountedPrice = originalPrice * 0.9;  // 10% off
    discountedPrices.put(key, discountedPrice);
}

// Filter map
activeUsers = Map();
allUsers = getAllUsers();  // Returns map
for each userId in allUsers.keys()
{
    user = allUsers.get(userId);
    if(user.get("Status") == "Active")
    {
        activeUsers.put(userId, user);
    }
}
```

#### Nested Map Iteration

```javascript
// Iterate nested structure
departments = {
    "Engineering": {
        "Manager": "Alice",
        "HeadCount": 50,
        "Budget": 500000
    },
    "Sales": {
        "Manager": "Bob",
        "HeadCount": 30,
        "Budget": 300000
    }
};

for each deptName in departments.keys()
{
    dept = departments.get(deptName);
    info "Department: " + deptName;

    for each field in dept.keys()
    {
        value = dept.get(field);
        info "  " + field + ": " + value;
    }
}
```

## Collection Data Type

The Collection type provides a unified interface for both list and map operations.

### Collection as List

```javascript
// Create collection as list
items = Collection("Item1", "Item2", "Item3");

// Access like list
firstItem = items.get(0);  // "Item1"
size = items.size();       // 3

// Add elements
items.insert("Item4");

// Iterate
for each item in items
{
    info item;
}
```

### Collection as Map

```javascript
// Create collection as map
settings = Collection();
settings.insert("theme", "dark");
settings.insert("language", "en");
settings.insert("notifications", true);

// Access like map
theme = settings.get("theme");  // "dark"

// Check size
count = settings.size();  // 3

// Iterate
for each key in settings.keys()
{
    value = settings.get(key);
    info key + ": " + value;
}
```

### Collection Limitations

```javascript
// Size limits:
// - Zoho Creator: 25,000 elements max
// - Other services: 50,000 elements max

// Cannot mix list and map behavior
myCollection = Collection();
myCollection.insert("key", "value");  // Map behavior
// myCollection.insert("value");  // Cannot switch to list behavior
```

## Iteration Patterns

### Pattern 1: Simple For Each

```javascript
// Basic iteration
items = {"A", "B", "C"};
for each item in items
{
    processItem(item);
}
```

### Pattern 2: For Each with Break

```javascript
// Exit early
items = {"A", "B", "C", "D", "E"};
for each item in items
{
    if(item == "C")
    {
        info "Found C, stopping";
        break;
    }
    processItem(item);
}
```

### Pattern 3: For Each with Continue

```javascript
// Skip certain items
numbers = {1, 2, 3, 4, 5, 6};
for each num in numbers
{
    if(num % 2 == 0)  // Skip even numbers
    {
        continue;
    }
    info "Odd number: " + num;
}
```

### Pattern 4: For Each with Counter

```javascript
// Track position
items = {"A", "B", "C"};
index = 0;
for each item in items
{
    info "Index " + index + ": " + item;
    index = index + 1;
}
```

### Pattern 5: Map Iteration

```javascript
// Iterate map keys
data = {"key1": "value1", "key2": "value2"};
for each key in data.keys()
{
    value = data.get(key);
    info key + " = " + value;
}
```

### Pattern 6: Build Collection in Loop

```javascript
// Accumulate results
sourceList = {1, 2, 3, 4, 5};
resultList = {};
for each num in sourceList
{
    doubled = num * 2;
    resultList.add(doubled);
}
// resultList = {2, 4, 6, 8, 10}
```

### Pattern 7: Nested Iteration

```javascript
// Process 2D structure
matrix = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

for each row in matrix
{
    for each cell in row
    {
        processCell(cell);
    }
}
```

### Pattern 8: Filter Pattern

```javascript
// Filter items
allItems = {1, 5, 12, 8, 15, 3, 20};
filtered = {};
for each item in allItems
{
    if(item >= 10)
    {
        filtered.add(item);
    }
}
// filtered = {12, 15, 20}
```

### Pattern 9: Map Pattern

```javascript
// Transform items
prices = {10, 20, 30};
discounted = {};
for each price in prices
{
    discountedPrice = price * 0.9;
    discounted.add(discountedPrice);
}
// discounted = {9, 18, 27}
```

### Pattern 10: Reduce Pattern

```javascript
// Aggregate values
numbers = {5, 10, 15, 20};
sum = 0;
for each num in numbers
{
    sum = sum + num;
}
// sum = 50

// Or with map
scores = {"Math": 90, "English": 85, "Science": 95};
total = 0;
for each subject in scores.keys()
{
    total = total + scores.get(subject);
}
average = total / scores.size();
```

## Nested Collections

### List of Lists

```javascript
// 2D array / Matrix
matrix = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

// Access elements
row0 = matrix.get(0);        // {1, 2, 3}
cell00 = row0.get(0);        // 1
cell12 = matrix.get(1).get(2);  // 6

// Iterate
for each row in matrix
{
    for each cell in row
    {
        info cell;
    }
}

// Grouped data
teams = {
    {"Team A", "Alice", "Bob", "Charlie"},
    {"Team B", "David", "Eve"},
    {"Team C", "Frank", "Grace", "Henry", "Iris"}
};

for each team in teams
{
    teamName = team.get(0);
    info "Team: " + teamName;
    memberCount = team.size() - 1;
    info "Members: " + memberCount;
}
```

### List of Maps

```javascript
// Array of objects
users = {
    {"name": "Alice", "age": 30, "role": "Manager"},
    {"name": "Bob", "age": 25, "role": "Developer"},
    {"name": "Charlie", "age": 28, "role": "Designer"}
};

// Access
firstUser = users.get(0);
firstName = firstUser.get("name");  // "Alice"

// Iterate
for each user in users
{
    name = user.get("name");
    age = user.get("age");
    role = user.get("role");
    info name + " (" + age + ") - " + role;
}

// Filter
developers = {};
for each user in users
{
    if(user.get("role") == "Developer")
    {
        developers.add(user);
    }
}

// CRM records example
leads = zoho.crm.getRecords("Leads", 1, 100);
for each lead in leads
{
    leadName = lead.get("Last_Name");
    leadEmail = lead.get("Email");
    leadStatus = lead.get("Lead_Status");

    if(leadStatus == "Qualified")
    {
        // Process qualified lead
        convertLead(lead);
    }
}
```

### Map of Lists

```javascript
// Grouped data
departmentEmployees = {
    "Engineering": {"Alice", "Bob", "Charlie"},
    "Sales": {"David", "Eve"},
    "Marketing": {"Frank", "Grace"}
};

// Access
engineeringTeam = departmentEmployees.get("Engineering");
firstEngineer = engineeringTeam.get(0);  // "Alice"

// Iterate
for each dept in departmentEmployees.keys()
{
    employees = departmentEmployees.get(dept);
    info "Department: " + dept + " (" + employees.size() + " employees)";

    for each emp in employees
    {
        info "  - " + emp;
    }
}

// Add to nested list
departmentEmployees.get("Engineering").add("Diana");
```

### Map of Maps

```javascript
// Nested objects
company = {
    "Info": {
        "Name": "Zoho",
        "Founded": 1996,
        "Industry": "Software"
    },
    "Headquarters": {
        "City": "Austin",
        "State": "Texas",
        "Country": "USA"
    },
    "Contacts": {
        "Email": "info@zoho.com",
        "Phone": "555-0100"
    }
};

// Access nested
companyName = company.get("Info").get("Name");  // "Zoho"
hqCity = company.get("Headquarters").get("City");  // "Austin"
email = company.get("Contacts").get("Email");

// Iterate all
for each section in company.keys()
{
    info "Section: " + section;
    sectionData = company.get(section);

    for each field in sectionData.keys()
    {
        value = sectionData.get(field);
        info "  " + field + ": " + value;
    }
}
```

## Common Use Cases

### Use Case 1: Building Email Lists

```javascript
// Collect emails from CRM
emailList = {};
contacts = zoho.crm.getRecords("Contacts", 1, 200);

for each contact in contacts
{
    email = contact.get("Email");
    isActive = contact.get("Active");

    if(email != null && email != "" && isActive == true)
    {
        emailList.add(email);
    }
}

// Send bulk email
if(emailList.size() > 0)
{
    for each email in emailList
    {
        sendmail
        [
            from: zoho.adminuserid
            to: email
            subject: "Newsletter"
            message: "Your monthly newsletter"
        ]
    }
}
```

### Use Case 2: Data Transformation

```javascript
// Transform CRM data to external format
leads = zoho.crm.getRecords("Leads", 1, 100);
exportData = {};

for each lead in leads
{
    leadRecord = Map();
    leadRecord.put("full_name", lead.get("First_Name") + " " + lead.get("Last_Name"));
    leadRecord.put("email_address", lead.get("Email"));
    leadRecord.put("company_name", lead.get("Company"));
    leadRecord.put("status", lead.get("Lead_Status"));

    exportData.add(leadRecord);
}

// Send to external API
sendToExternalSystem(exportData);
```

### Use Case 3: Aggregation and Reporting

```javascript
// Calculate statistics
deals = zoho.crm.getRecords("Deals", 1, 200);
totalValue = 0;
dealsByStage = Map();

for each deal in deals
{
    amount = deal.get("Amount");
    stage = deal.get("Stage");

    // Sum total
    if(amount != null)
    {
        totalValue = totalValue + amount;
    }

    // Count by stage
    if(dealsByStage.containsKey(stage))
    {
        count = dealsByStage.get(stage);
        dealsByStage.put(stage, count + 1);
    }
    else
    {
        dealsByStage.put(stage, 1);
    }
}

info "Total Deal Value: $" + totalValue;
for each stage in dealsByStage.keys()
{
    count = dealsByStage.get(stage);
    info stage + ": " + count + " deals";
}
```

### Use Case 4: Validation and Filtering

```javascript
// Validate and filter records
validRecords = {};
invalidRecords = {};
records = getAllRecords();

for each record in records
{
    isValid = true;
    errors = {};

    // Check required fields
    if(record.get("Email") == null || record.get("Email") == "")
    {
        errors.add("Email required");
        isValid = false;
    }

    if(record.get("Name") == null || record.get("Name") == "")
    {
        errors.add("Name required");
        isValid = false;
    }

    // Categorize
    if(isValid)
    {
        validRecords.add(record);
    }
    else
    {
        invalidEntry = Map();
        invalidEntry.put("record", record);
        invalidEntry.put("errors", errors);
        invalidRecords.add(invalidEntry);
    }
}

info "Valid: " + validRecords.size();
info "Invalid: " + invalidRecords.size();
```

### Use Case 5: Lookup and Matching

```javascript
// Create lookup map
products = zoho.crm.getRecords("Products", 1, 200);
productLookup = Map();

for each product in products
{
    productCode = product.get("Product_Code");
    productLookup.put(productCode, product);
}

// Use lookup for matching
orderItems = {"PROD-001", "PROD-042", "PROD-123"};
for each itemCode in orderItems
{
    if(productLookup.containsKey(itemCode))
    {
        product = productLookup.get(itemCode);
        productName = product.get("Product_Name");
        price = product.get("Unit_Price");
        info "Found: " + productName + " - $" + price;
    }
    else
    {
        info "Product not found: " + itemCode;
    }
}
```

## Performance Considerations

### 1. List vs Map Access Speed

```javascript
// List access by index: O(1) - Fast
myList = {"A", "B", "C", "D", "E"};
element = myList.get(2);  // Fast direct access

// List search by value: O(n) - Slower
hasElement = myList.contains("C");  // Must scan list

// Map access by key: O(1) - Fast
myMap = {"key1": "value1", "key2": "value2"};
value = myMap.get("key1");  // Fast hash lookup
```

### 2. Choose Right Collection Type

```javascript
// Use List when:
// - Order matters
// - Access by position
// - Duplicate values needed
orderedItems = {"First", "Second", "Third"};

// Use Map when:
// - Need key-based lookup
// - Unique keys
// - Structured data
userProfile = {"name": "John", "age": 30, "city": "Boston"};
```

### 3. Limit Collection Sizes

```javascript
// Be mindful of limits
// - addAll() limit: 25,000 elements
// - Collection size varies by service

// Process in batches if needed
allRecords = zoho.crm.getRecords("Leads", 1, 200);
batchSize = 50;
batchNum = 0;

currentBatch = {};
for each record in allRecords
{
    currentBatch.add(record);

    if(currentBatch.size() >= batchSize)
    {
        processBatch(currentBatch);
        currentBatch = {};  // Reset
        batchNum = batchNum + 1;
    }
}

// Process remaining
if(currentBatch.size() > 0)
{
    processBatch(currentBatch);
}
```

### 4. Avoid Unnecessary Iterations

```javascript
// Poor: Multiple passes
items = getLargeList();

// First pass
hasError = false;
for each item in items
{
    if(item.get("Error") != null)
    {
        hasError = true;
    }
}

// Second pass
total = 0;
for each item in items
{
    total = total + item.get("Amount");
}

// Better: Single pass
items = getLargeList();
hasError = false;
total = 0;
for each item in items
{
    if(item.get("Error") != null)
    {
        hasError = true;
    }
    total = total + item.get("Amount");
}
```

## Best Practices

### 1. Initialize Collections Properly

```javascript
// Good: Clear initialization
myList = {};
myMap = Map();

// Poor: Ambiguous
myCollection = {};  // List or Map?
```

### 2. Check Before Accessing

```javascript
// Good: Bounds check
if(myList.size() > 0)
{
    firstItem = myList.get(0);
}

// Good: Key check
if(myMap.containsKey("email"))
{
    email = myMap.get("email");
}

// Poor: No check
firstItem = myList.get(0);  // May fail if empty
```

### 3. Use Meaningful Names

```javascript
// Good: Descriptive names
customerEmails = {};
productPrices = Map();
validatedRecords = {};

// Poor: Generic names
list1 = {};
map2 = Map();
data = {};
```

### 4. Validate Data Types

```javascript
// Good: Type checking
userInput = input.Values;
if(userInput.isList())
{
    for each item in userInput
    {
        processItem(item);
    }
}

// Handle nested structures safely
if(data.containsKey("items") && data.get("items").isList())
{
    items = data.get("items");
    processItems(items);
}
```

### 5. Clean Up Large Collections

```javascript
// Clear when done with large collections
largeList = {};
// ... populate with many items
// ... use largeList
largeList.clear();  // Free memory

// Or let it go out of scope
void processData()
{
    tempList = {};
    // ... use tempList
    // Automatically freed when function ends
}
```

### 6. Use Null Checks with Maps

```javascript
// Good: Null-safe access
value = ifNull(myMap.get("key"), "default");

// Or
if(myMap.containsKey("key") && myMap.get("key") != null)
{
    value = myMap.get("key");
}
else
{
    value = "default";
}
```

### 7. Document Complex Structures

```javascript
// Document nested structures
/**
 * Order structure:
 * {
 *   "OrderId": string,
 *   "Customer": {
 *     "Name": string,
 *     "Email": string
 *   },
 *   "Items": [
 *     {"Name": string, "Price": decimal, "Qty": number}
 *   ]
 * }
 */
order = buildOrder();
```

### 8. Avoid Modifying While Iterating

```javascript
// Poor: Modifying during iteration
for each item in myList
{
    myList.remove(item);  // Can cause issues
}

// Better: Collect items to remove
itemsToRemove = {};
for each item in myList
{
    if(shouldRemove(item))
    {
        itemsToRemove.add(item);
    }
}
// Remove after iteration
for each item in itemsToRemove
{
    myList.remove(item);
}
```

## Summary

### Quick Reference

**Lists**:
- `{}` or `List()` - Create
- `add(element)` - Add element
- `get(index)` - Access by index
- `size()` - Get count
- `contains(element)` - Check existence
- `remove(element)` - Remove element
- `sort()` - Sort ascending
- `reverse()` - Reverse order

**Maps**:
- `Map()` or `{}` - Create
- `put(key, value)` - Add/update
- `get(key)` - Get value
- `containsKey(key)` - Check key
- `keys()` - Get all keys
- `values()` - Get all values
- `size()` - Get count
- `remove(key)` - Remove entry

**Iteration**:
- `for each item in list` - Iterate list
- `for each key in map.keys()` - Iterate map

## Additional Resources

- [Data Types](../data-types/README.md) - List and Map data types
- [Control Structures](../control-structures/README.md) - For each loops
- [Functions](../functions/README.md) - List and Map functions
- [Examples](../examples/README.md) - Real-world collection examples

## References

- [Zoho Deluge List Data Type](https://www.zoho.com/deluge/help/datatypes/list.html)
- [Zoho Deluge Map Operations](https://www.zoho.com/deluge/help/map-manipulations.html)
- [Collection Data Type](https://www.zoho.com/deluge/help/datatypes/collection.html)
