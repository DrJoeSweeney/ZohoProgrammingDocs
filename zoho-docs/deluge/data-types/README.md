# Deluge Data Types

Deluge supports multiple data types for storing and manipulating different kinds of information. The language uses **dynamic typing**, meaning you don't need to explicitly declare types.

## Table of Contents

- [Overview](#overview)
- [Text (String)](#text-string)
- [Number](#number)
- [Decimal](#decimal)
- [Boolean](#boolean)
- [Date-Time](#date-time)
- [Time](#time)
- [List](#list)
- [Map (Key-Value)](#map-key-value)
- [Collection](#collection)
- [File](#file)
- [Null](#null)
- [Type Conversion](#type-conversion)
- [Type Checking](#type-checking)

## Overview

Deluge has **five primary data types** and several **advanced data types**:

### Primary Data Types
- Text (String)
- Number (Integer)
- Decimal (Float)
- Boolean
- Date-Time

### Advanced Data Types
- Time
- List
- Key-Value (Map)
- Collection
- File

### Special Value
- Null

## Text (String)

Represents a sequence of characters. Text must be enclosed in **double quotes**.

### Syntax

```javascript
variableName = "text value";
```

### Examples

```javascript
// Simple text
companyName = "Zoho Corporation";
firstName = "John";
lastName = "Smith";

// Text with special characters
address = "123 Main St, Suite #456";
message = "Hello, World!";
email = "user@example.com";

// Text with numbers
phoneNumber = "555-1234";
zipCode = "94025";

// Empty text
emptyString = "";

// Text with quotes (escaped)
quote = "He said, \"Hello!\"";
```

### Use Cases
- Names, emails, addresses
- Descriptive text and messages
- IDs stored as text
- Any alphanumeric content

### Common Operations

```javascript
// Concatenation
fullName = firstName + " " + lastName;  // "John Smith"

// Length
nameLength = firstName.length();  // 4

// Conversion to uppercase/lowercase
upperName = firstName.toUpperCase();  // "JOHN"
lowerName = firstName.toLowerCase();  // "john"

// Check if contains substring
hasAt = email.contains("@");  // true

// Replace text
newEmail = email.replaceAll("example", "company");
```

## Number

Represents integer values (whole numbers without decimals).

### Syntax

```javascript
variableName = 123;
```

### Examples

```javascript
// Positive numbers
age = 30;
quantity = 100;
year = 2025;

// Negative numbers
temperature = -15;
balance = -500;

// Zero
count = 0;

// Large numbers
population = 1000000;
```

### Use Cases
- Counts and quantities
- Age values
- Year representations
- IDs and indexes
- Whole number calculations

### Operations

```javascript
// Arithmetic
total = 100 + 50;      // 150
difference = 100 - 30;  // 70
product = 10 * 5;       // 50
quotient = 100 / 4;     // 25 (results in 25.0 if decimal)
remainder = 100 % 3;    // 1

// Comparison
isGreater = 100 > 50;   // true
isEqual = 100 == 100;   // true
```

### Important Notes

- Operations with decimals will return decimal results
- Division always returns a decimal result
- No explicit size limit for integers in Deluge

## Decimal

Represents floating-point numbers (numbers with decimal places).

### Syntax

```javascript
variableName = 123.45;
```

### Examples

```javascript
// Currency values
price = 99.99;
tax = 8.5;
total = 108.49;

// Percentages
interestRate = 3.75;
discountPercent = 15.5;

// Measurements
weight = 72.5;
height = 5.11;
temperature = 98.6;

// Scientific notation (if supported)
smallNumber = 0.000001;
largeNumber = 1000000.99;
```

### Use Cases
- Currency and financial calculations
- Percentage values
- Precise measurements
- Statistical data
- Any value requiring decimal precision

### Operations

```javascript
// Arithmetic with decimals
itemPrice = 29.99;
quantity = 3;
subtotal = itemPrice * quantity;  // 89.97

taxRate = 0.08;
taxAmount = subtotal * taxRate;   // 7.1976

// Rounding (using built-in functions)
roundedTax = taxAmount.round(2);  // 7.20
```

### Precision

```javascript
// Be aware of floating-point precision
result = 0.1 + 0.2;  // May not be exactly 0.3
// Use rounding for display
displayResult = result.round(2);
```

## Boolean

Represents logical true/false values. Used for decision-making and conditions.

### Syntax

```javascript
variableName = true;
variableName = false;
```

### Examples

```javascript
// Explicit boolean values
isActive = true;
hasDiscount = false;
isVerified = true;

// Boolean expressions
isAdult = age >= 18;
hasStock = quantity > 0;
isValidEmail = email.contains("@") && email.contains(".");

// Comparison results
isEqual = (status == "Active");
isNotEqual = (status != "Inactive");
```

### Use Cases
- Conditional logic
- Status flags
- Validation results
- Feature toggles
- Access control

### Boolean Operations

```javascript
// Logical AND
canPurchase = isActive && hasStock;

// Logical OR
needsAttention = isOverdue || isPastDue;

// Logical NOT
isInactive = !isActive;

// Complex conditions
isEligible = (age >= 18) && (hasAccount == true) && (balance > 0);
```

### Case Insensitivity

Boolean values in Deluge are **case-insensitive**:

```javascript
isActive = true;   // Valid
isActive = True;   // Also valid
isActive = TRUE;   // Also valid
isActive = TrUe;   // Also valid (but not recommended)
```

## Date-Time

Represents date and time values in various formats. Enclosed in **single quotes**.

### Syntax

```javascript
variableName = 'DD-MMM-YYYY HH:mm:ss';
```

### Examples

```javascript
// Date with time
appointmentTime = '15-Jan-2025 14:30:00';
orderDate = '01-Dec-2024 09:00:00';

// Date without time (defaults to 00:00:00)
birthDate = '15-Mar-1990';
startDate = '01-Jan-2025';

// Current date-time
currentDateTime = now;
today = today;

// Different formats (based on application settings)
usFormat = '01/15/2025 2:30 PM';
isoFormat = '2025-01-15 14:30:00';
```

### Use Cases
- Event scheduling
- Timestamp tracking
- Date calculations
- Deadline management
- Historical records

### Date-Time Operations

```javascript
// Get current date-time
currentTime = now;

// Add days
futureDate = currentTime.addDay(7);  // 7 days from now

// Add months
nextMonth = currentTime.addMonth(1);

// Add years
nextYear = currentTime.addYear(1);

// Subtract days
pastDate = currentTime.subDay(30);  // 30 days ago

// Extract components
year = currentTime.getYear();
month = currentTime.getMonth();
day = currentTime.getDay();

// Format date
formattedDate = currentTime.toString("dd-MMM-yyyy");
```

### Date Comparison

```javascript
startDate = '01-Jan-2025';
endDate = '31-Dec-2025';

// Check if date is before
isBefore = startDate < endDate;  // true

// Check if date is after
isAfter = endDate > startDate;  // true

// Check if dates are equal
isSame = startDate == '01-Jan-2025';  // true
```

## Time

Represents time values independently from dates. Supports both 12-hour and 24-hour formats.

### Syntax

```javascript
variableName = 'HH:mm:ss';
```

### Examples

```javascript
// 24-hour format
morningTime = '09:30:00';
noonTime = '12:00:00';
eveningTime = '18:45:00';
midnightTime = '00:00:00';

// 12-hour format (if supported by application)
meetingTime = '2:30 PM';
breakfastTime = '8:00 AM';

// Time without seconds
lunchTime = '12:30';
```

### Use Cases
- Business hours
- Scheduled tasks
- Time-based triggers
- Duration calculations
- Meeting times

### Time Operations

```javascript
// Compare times
startTime = '09:00:00';
endTime = '17:00:00';
isWithinHours = currentTime >= startTime && currentTime <= endTime;

// Time calculations (using minutes/hours)
durationMinutes = 90;  // 1.5 hours
```

## List

A collection data type that holds multiple values. Elements are accessed by **zero-based index**.

### Syntax

```javascript
listName = {element1, element2, element3};
```

### Examples

```javascript
// List of strings
products = {"Zoho CRM", "Zoho Creator", "Zoho Books"};

// List of numbers
quantities = {10, 25, 50, 100};

// List of mixed types
mixedList = {"John", 30, true, '15-Jan-2025'};

// Empty list
emptyList = {};

// List with one element
singleItem = {"Only Item"};
```

### Use Cases
- Multiple values of same type
- Iterating through items
- Storing collections
- Menu options
- Tag lists

### List Operations

```javascript
// Create list
fruits = {"Apple", "Banana", "Orange"};

// Access by index (zero-based)
firstFruit = fruits.get(0);  // "Apple"
secondFruit = fruits.get(1);  // "Banana"

// Get list size
count = fruits.size();  // 3

// Add element
fruits.add("Mango");

// Add multiple elements
fruits.addAll({"Grape", "Pineapple"});

// Remove element
fruits.remove("Banana");

// Check if contains
hasApple = fruits.contains("Apple");  // true

// Get index of element
appleIndex = fruits.indexOf("Apple");  // 0

// Clear all elements
fruits.clear();

// Iterate through list
for each fruit in fruits
{
    info fruit;
}
```

### List Limitations

- Direct assignment: No limit
- Using `add()`: No limit (elements added individually)
- Using `addAll()`: Maximum **25,000 elements**

## Map (Key-Value)

Stores data as key-value pairs. Keys must be unique.

### Syntax

```javascript
mapName = {key1: value1, key2: value2};
```

### Examples

```javascript
// Simple map
person = {"Name": "John Smith", "Age": 30, "City": "San Francisco"};

// Map with mixed value types
product = {
    "Name": "Magic Mouse",
    "Price": 79.99,
    "InStock": true,
    "Quantity": 50
};

// Nested map
company = {
    "Name": "Zoho",
    "Founded": 1996,
    "Headquarters": {"City": "Austin", "State": "Texas"}
};

// Empty map
emptyMap = Map();
```

### Use Cases
- Structured data storage
- Configuration settings
- API responses
- Record representations
- Parameter passing

### Map Operations

```javascript
// Create map
customer = Map();

// Add key-value pairs
customer.put("FirstName", "John");
customer.put("LastName", "Smith");
customer.put("Email", "john@example.com");

// Alternative creation
customer = {"FirstName": "John", "LastName": "Smith", "Email": "john@example.com"};

// Get value by key
firstName = customer.get("FirstName");  // "John"

// Check if key exists
hasEmail = customer.containsKey("Email");  // true

// Get all keys
keys = customer.keys();  // {"FirstName", "LastName", "Email"}

// Get all values
values = customer.values();  // {"John", "Smith", "john@example.com"}

// Remove key-value pair
customer.remove("Email");

// Get size
size = customer.size();  // 2

// Update value (overwrites if key exists)
customer.put("FirstName", "Jane");

// Add multiple pairs
customerDetails = {"Phone": "555-1234", "City": "Boston"};
customer.putAll(customerDetails);

// Iterate through map
for each key in customer.keys()
{
    value = customer.get(key);
    info key + ": " + value;
}
```

### Important Notes

- Keys are **case-sensitive**: "Name" ≠ "name"
- Keys must be **unique** - adding a duplicate key overwrites the value
- Both keys and values can be any data type
- Date values default to `00:00:00` if time not specified

## Collection

A unified data type that can function as either a List OR a Map, but not both simultaneously.

### Syntax

```javascript
// As a list
collectionName = Collection(element1, element2, element3);

// As a map (key-value)
collectionName = Collection();
```

### Examples

```javascript
// Collection as List (index-value)
products = Collection("Phone", "Laptop", "Tablet");

// Collection as Map (key-value)
settings = Collection();
settings.insert("theme", "dark");
settings.insert("language", "en");

// Empty collection
emptyCollection = Collection();
```

### Collection vs. List/Map

Collections provide a **unified interface** for both list and map operations:

```javascript
// Can use consistent functions regardless of type
myCollection = Collection(1, 2, 3);
value = myCollection.get(0);  // Get by index

myCollection = Collection();
myCollection.insert("key", "value");
value = myCollection.get("key");  // Get by key
```

### Collection Operations

```javascript
// Create collection
items = Collection("Item1", "Item2", "Item3");

// Insert element/key-value
items.insert("Item4");  // List behavior
items.insert("key", "value");  // Map behavior

// Get element
firstItem = items.get(0);  // By index
value = items.get("key");  // By key

// Size
count = items.size();

// Iterate
for each item in items
{
    info item;
}
```

### Limitations

- **Zoho Creator**: Maximum 25,000 elements
- **Other Zoho Services**: Maximum 50,000 elements
- Cannot mix list and map behavior in same collection

## File

A special data type for file handling. Files must be fetched from web or cloud services.

### Syntax

```javascript
fileName = invokeurl [url: "file_url" type: GET];
```

### Examples

```javascript
// Fetch file from URL
imageFile = invokeurl
[
    url: "https://example.com/logo.png"
    type: GET
];

// File from cloud storage
documentFile = invokeurl
[
    url: "https://drive.zoho.com/file/12345"
    type: GET
    connection: "zohodrive"
];
```

### Use Cases
- File attachments
- Image processing
- Document uploads
- PDF generation
- Cloud file access

### File Operations

```javascript
// Get file from web
pdfFile = invokeurl
[
    url: "https://example.com/document.pdf"
    type: GET
];

// Attach to email
sendmail
[
    from: zoho.adminuserid
    to: "user@example.com"
    subject: "Your Document"
    message: "Please find attached"
    attachments: pdfFile
]

// Upload to Zoho service
// (varies by service)
```

### Important Notes

- Files cannot be created directly in Deluge
- Must fetch from external URL or cloud service
- File size limits apply (e.g., 15 MB for email attachments)
- Response size limit: 5 MB for invokeUrl

## Null

A special constant representing no value or undefined state.

### Syntax

```javascript
variableName = null;
```

### Examples

```javascript
// Explicit null assignment
middleName = null;
description = null;

// Checking for null
if(email == null)
{
    info "Email is not provided";
}

// Using ifNull operator
displayName = ifNull(nickName, fullName);  // Use fullName if nickName is null
```

### Null Checking

```javascript
// Check if variable is null
if(value == null)
{
    // Handle null case
    info "Value is null";
}

// Check if not null
if(value != null)
{
    // Safe to use value
    processValue(value);
}

// Check null before string operations
if(email != null && email != "")
{
    // Safe to process email
    isValid = email.contains("@");
}
```

### Common Null Scenarios

```javascript
// CRM field might be null
leadInfo = zoho.crm.getRecordById("Leads", leadId);
phone = leadInfo.get("Phone");

if(phone != null && phone != "")
{
    // Phone number exists
    sendSMS(phone, "Welcome!");
}
else
{
    info "No phone number available";
}

// API response might return null
response = invokeurl [url: apiUrl type: GET];
data = response.get("data");

if(data != null)
{
    processData(data);
}
```

### ifNull Operator

```javascript
// Use default value if null
username = ifNull(preferredName, "Guest");

// Chain with other expressions
displayEmail = ifNull(workEmail, ifNull(personalEmail, "No email"));

// In calculations
discount = ifNull(memberDiscount, 0);
total = subtotal - discount;
```

## Type Conversion

Deluge provides functions to convert between data types.

### To Text/String

```javascript
// Number to text
numValue = 42;
textValue = numValue.toString();  // "42"

// Boolean to text
boolValue = true;
textValue = boolValue.toString();  // "true"

// Date to text
dateValue = '15-Jan-2025';
textValue = dateValue.toString("dd-MMM-yyyy");  // "15-Jan-2025"
```

### To Number

```javascript
// Text to number
textValue = "123";
numValue = textValue.toNumber();  // 123

// Decimal to number (truncates)
decimalValue = 99.99;
numValue = decimalValue.toNumber();  // 99
```

### To Decimal

```javascript
// Text to decimal
textValue = "99.99";
decimalValue = textValue.toDecimal();  // 99.99

// Number to decimal
numValue = 100;
decimalValue = numValue.toDecimal();  // 100.0
```

### To Date

```javascript
// Text to date
textDate = "15-Jan-2025";
dateValue = textDate.toDate();

// With format specification
textDate = "2025-01-15";
dateValue = toDate(textDate, "yyyy-MM-dd");
```

### To Boolean

```javascript
// Text to boolean
textValue = "true";
boolValue = textValue.toBoolean();  // true

// Number to boolean (non-zero = true)
numValue = 1;
boolValue = numValue.toBoolean();  // true
```

## Type Checking

Check variable types using built-in functions.

### Check Functions

```javascript
// Check if text
isText = value.isText();

// Check if number
isNum = value.isNumber();

// Check if decimal
isDec = value.isDecimal();

// Check if boolean
isBool = value.isBoolean();

// Check if date
isDate = value.isDate();

// Check if list
isList = value.isList();

// Check if map
isMap = value.isMap();

// Check if null
isNull = value.isNull();
```

### Type Validation Example

```javascript
// Validate input type
userInput = input.Value;

if(userInput.isNumber())
{
    // Process as number
    result = userInput * 2;
}
else if(userInput.isText())
{
    // Process as text
    result = userInput.toUpperCase();
}
else
{
    // Handle unexpected type
    info "Invalid input type";
}
```

## Best Practices

### 1. Use Appropriate Types

```javascript
// Good: Use decimal for currency
price = 29.99;

// Bad: Using text for numeric calculations
price = "29.99";  // Will cause errors in calculations
```

### 2. Always Check for Null

```javascript
// Good: Null check before operations
if(email != null && email != "")
{
    sendEmail(email);
}

// Bad: No null check
sendEmail(email);  // May error if email is null
```

### 3. Use Type Conversion Safely

```javascript
// Good: Validate before conversion
if(input.isNumber())
{
    numValue = input.toNumber();
}

// Risky: Convert without validation
numValue = input.toNumber();  // May fail if input is not numeric
```

### 4. Choose Right Collection Type

```javascript
// Use List for ordered, indexed data
productNames = {"Product A", "Product B", "Product C"};

// Use Map for key-value associations
productDetails = {"name": "Product A", "price": 99.99, "stock": 50};
```

### 5. Format Dates Consistently

```javascript
// Good: Consistent format
orderDate = '15-Jan-2025 10:30:00';
shipDate = '20-Jan-2025 14:00:00';

// Risky: Mixed formats
orderDate = '01/15/2025';
shipDate = '2025-01-20';  // May cause comparison issues
```

## Summary

| Data Type | Syntax | Example | Use Case |
|-----------|--------|---------|----------|
| Text | `"value"` | `"Hello"` | Strings, names, text |
| Number | `123` | `42` | Integers, counts |
| Decimal | `123.45` | `99.99` | Currency, measurements |
| Boolean | `true/false` | `true` | Conditions, flags |
| Date-Time | `'DD-MMM-YYYY'` | `'15-Jan-2025'` | Dates, timestamps |
| Time | `'HH:mm:ss'` | `'14:30:00'` | Time values |
| List | `{val1, val2}` | `{"A", "B"}` | Collections |
| Map | `{key: value}` | `{"name": "John"}` | Key-value pairs |
| Collection | `Collection()` | `Collection(1,2,3)` | Unified list/map |
| File | Special | From URL/cloud | File handling |
| Null | `null` | `null` | Absence of value |

## Additional Resources

- [Collections](../collections/README.md) - Detailed guide on Lists, Maps, and Collections
- [Date-Time Operations](../date-time/README.md) - Date and time functions
- [String Manipulation](../strings/README.md) - Text/string operations
- [Type Conversion Functions](../functions/README.md) - Built-in conversion functions

## References

- [Zoho Deluge Data Types](https://www.zoho.com/deluge/help/datatypes.html)
- [List Data Type](https://www.zoho.com/deluge/help/datatypes/list.html)
- [Collection Data Type](https://www.zoho.com/deluge/help/datatypes/collection.html)
- [Create Map](https://www.zoho.com/deluge/help/map-manipulations/create-map.html)
