# Deluge Quick Reference

Quick reference for Deluge syntax and functions.

---

## Variables

```javascript
// Declaration
leadName = "John Doe";
count = 10;
isActive = true;

// Data types
textVar = "Hello";              // Text
numberVar = 42;                 // Number
boolVar = true;                 // Boolean
dateVar = '01-Jan-2025';        // Date
listVar = [1, 2, 3];           // List
mapVar = {"key": "value"};     // Map
```

---

## Control Structures

### If-Else

```javascript
if(score > 90)
{
    grade = "A";
}
else if(score > 80)
{
    grade = "B";
}
else
{
    grade = "C";
}
```

### For Loop

```javascript
// For each in list
for each item in myList
{
    info item;
}

// Range loop
for i in range(1, 11)
{
    info "Number: " + i;
}
```

### While Loop

```javascript
count = 0;
while(count < 5)
{
    info count;
    count = count + 1;
}
```

---

## String Functions

```javascript
// Length
len = "Hello".length();                    // 5

// Substring
sub = "Hello World".subString(0, 5);       // "Hello"

// Index of
index = "Hello World".indexOf("World");    // 6

// Replace
replaced = "Hello".replaceAll("l", "L");   // "HeLLo"

// Split
parts = "a,b,c".split(",");               // ["a", "b", "c"]

// Trim
trimmed = "  Hello  ".trim();             // "Hello"

// Upper/Lower
upper = "hello".toUpperCase();            // "HELLO"
lower = "HELLO".toLowerCase();            // "hello"

// Contains
contains = "Hello World".contains("World"); // true
```

---

## List Functions

```javascript
// Create
myList = [1, 2, 3];

// Add
myList.add(4);                           // [1, 2, 3, 4]

// Get
value = myList.get(0);                   // 1

// Size
size = myList.size();                    // 4

// Remove
myList.remove(1);                        // Removes index 1

// Contains
exists = myList.contains(3);             // true

// Sort
myList.sort();                           // Ascending
myList.sort(false);                      // Descending

// Clear
myList.clear();                          // Empty list
```

---

## Map Functions

```javascript
// Create
myMap = {"name": "John", "age": 30};

// Get
name = myMap.get("name");                // "John"

// Put
myMap.put("email", "john@example.com");

// Keys
keys = myMap.keys();                     // ["name", "age", "email"]

// Values
values = myMap.values();                 // ["John", 30, "john@example.com"]

// Contains key
hasKey = myMap.containsKey("name");      // true

// Remove
myMap.remove("age");

// Size
size = myMap.size();                     // 2
```

---

## Date Functions

```javascript
// Current date
today = zoho.currentdate;                // Today
now = zoho.currenttime;                  // Current timestamp

// Create date
myDate = '15-Jan-2025';

// Add days
futureDate = myDate.addDay(7);           // 7 days later

// Subtract days
pastDate = myDate.subDay(7);             // 7 days ago

// Add months
nextMonth = myDate.addMonth(1);

// Format
formatted = myDate.toString("dd-MMM-yyyy"); // "15-Jan-2025"

// Get components
day = myDate.getDay();                   // 15
month = myDate.getMonth();               // 1
year = myDate.getYear();                 // 2025
```

---

## CRM Functions

```javascript
// Get records
leads = zoho.crm.getRecords("Leads", 1, 200);

// Get record by ID
lead = zoho.crm.getRecordById("Leads", leadId);

// Create record
leadData = {"First_Name": "John", "Last_Name": "Doe", "Email": "john@example.com"};
response = zoho.crm.createRecord("Leads", leadData);

// Update record
updateData = {"Lead_Status": "Qualified"};
response = zoho.crm.updateRecord("Leads", leadId, updateData);

// Delete record
response = zoho.crm.deleteRecord("Leads", leadId);

// Search records
criteria = "(Email:equals:john@example.com)";
results = zoho.crm.searchRecords("Leads", criteria);

// Get related records
contacts = zoho.crm.getRelatedRecords("Contacts", "Accounts", accountId);
```

---

## API Integration

```javascript
// GET request
response = invokeurl
[
    url: "https://api.example.com/data"
    type: GET
    headers: {"Authorization": "Bearer TOKEN"}
];

// POST request
payload = {"name": "John", "email": "john@example.com"};
response = invokeurl
[
    url: "https://api.example.com/users"
    type: POST
    parameters: payload.toString()
    headers: {"Content-Type": "application/json"}
];

// With OAuth
response = invokeurl
[
    url: "https://api.example.com/data"
    type: GET
    connection: "my_oauth_connection"
];
```

---

## Email

```javascript
// Send email
sendmail
[
    from: zoho.adminuserid
    to: "recipient@example.com"
    subject: "Hello from Deluge"
    message: "This is the email body."
];

// With attachments
sendmail
[
    from: zoho.adminuserid
    to: "recipient@example.com"
    subject: "Document attached"
    message: "Please find the document attached."
    attachments: [file:documentId]
];
```

---

## Error Handling

```javascript
try
{
    result = zoho.crm.createRecord("Leads", leadData);
}
catch (e)
{
    info "Error: " + e;
    // Handle error
}
```

---

## Logging

```javascript
// Info (visible in logs)
info "Processing lead: " + leadId;

// Debug
info "Debug: " + variableValue;
```

---

## Common Patterns

### Check if record exists

```javascript
criteria = "(Email:equals:" + email + ")";
results = zoho.crm.searchRecords("Leads", criteria);

if(results.size() > 0)
{
    info "Lead exists";
    existingLead = results.get(0);
}
else
{
    info "Lead not found";
}
```

### Loop through CRM records

```javascript
leads = zoho.crm.getRecords("Leads", 1, 200);

for each lead in leads
{
    leadName = lead.get("Last_Name");
    leadEmail = lead.get("Email");

    info "Processing: " + leadName;

    // Process lead
}
```

### Update multiple records

```javascript
leads = zoho.crm.getRecords("Leads", 1, 200);

for each lead in leads
{
    if(lead.get("Lead_Status") == "New")
    {
        updateData = {"Lead_Status": "Working"};
        response = zoho.crm.updateRecord("Leads", lead.get("id"), updateData);
    }
}
```

### Calculate score

```javascript
score = 0;

if(lead.get("Annual_Revenue") > 1000000)
{
    score = score + 30;
}

if(lead.get("No_of_Employees") > 100)
{
    score = score + 20;
}

if(lead.get("Lead_Source") == "Website")
{
    score = score + 10;
}

info "Lead score: " + score;
```

---

## Type Conversions

```javascript
// String to number
num = "123".toNumber();

// Number to string
str = 123.toString();

// Date to string
dateStr = myDate.toString("dd-MMM-yyyy");

// String to date
myDate = "15-Jan-2025".toDate();

// JSON to map
jsonStr = '{"name":"John","age":30}';
myMap = jsonStr.toMap();

// Map to JSON
myMap = {"name": "John", "age": 30};
jsonStr = myMap.toString();
```

---

## Operators

### Arithmetic
```javascript
result = 10 + 5;    // 15
result = 10 - 5;    // 5
result = 10 * 5;    // 50
result = 10 / 5;    // 2
result = 10 % 3;    // 1 (modulo)
```

### Comparison
```javascript
10 == 10    // true
10 != 5     // true
10 > 5      // true
10 < 15     // true
10 >= 10    // true
10 <= 15    // true
```

### Logical
```javascript
true && false    // false (AND)
true || false    // true (OR)
!true           // false (NOT)
```

---

## Limitations

- Maximum execution time: 10 minutes
- Maximum API calls per script: 200
- Maximum records per CRM operation: 200
- Maximum file size: 20 MB
- No recursion support
- Limited external API access (requires connections)

---

**Last Updated**: December 2025
