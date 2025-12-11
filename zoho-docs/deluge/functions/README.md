# Deluge Functions

Functions in Deluge allow you to organize code into reusable blocks, perform calculations, manipulate data, and interact with Zoho services. This comprehensive guide covers both built-in functions and custom function creation.

## Table of Contents

- [Overview](#overview)
- [Built-in Functions](#built-in-functions)
  - [Text Functions](#text-functions)
  - [Math Functions](#math-functions)
  - [Date Functions](#date-functions)
  - [List Functions](#list-functions)
  - [Map Functions](#map-functions)
  - [Conversion Functions](#conversion-functions)
  - [Type Checking Functions](#type-checking-functions)
- [Custom Functions](#custom-functions)
- [Function Parameters](#function-parameters)
- [Return Values](#return-values)
- [Function Scope](#function-scope)
- [Function Limitations](#function-limitations)
- [Best Practices](#best-practices)

## Overview

Deluge provides extensive built-in functions across multiple categories and allows you to create custom functions for reusable logic.

### Function Categories

1. **Text/String Functions** - String manipulation and formatting
2. **Math Functions** - Mathematical operations and calculations
3. **Date Functions** - Date/time manipulation and formatting
4. **List Functions** - List operations and transformations
5. **Map Functions** - Map/key-value operations
6. **Conversion Functions** - Type conversions
7. **Type Checking Functions** - Data type validation
8. **Zoho Service Functions** - CRM, Creator, and other service integrations

### Key Points

- **75 Function Call Limit**: Maximum 75 function calls per script execution
- **Case Sensitive**: Function names are case-sensitive
- **Dynamic Typing**: No need to declare parameter or return types (though syntax supports it)
- **No Overloading**: Cannot have multiple functions with same name

## Built-in Functions

### Text Functions

Functions for manipulating and analyzing text/strings.

#### length()

Returns the number of characters in a string.

```javascript
// Syntax
length = text.length();

// Examples
name = "Zoho Corporation";
nameLength = name.length();  // 17

email = "user@example.com";
if(email.length() > 0)
{
    info "Email provided";
}

// Validation
password = input.Password;
if(password.length() < 8)
{
    info "Password must be at least 8 characters";
}
```

#### substring()

Extracts a portion of a string.

```javascript
// Syntax
result = text.substring(startIndex, endIndex);  // Zero-based indexing

// Examples
text = "Hello World";
sub = text.substring(0, 5);  // "Hello"
sub2 = text.substring(6, 11);  // "World"

// Extract domain from email
email = "user@example.com";
atIndex = email.indexOf("@");
domain = email.substring(atIndex + 1);  // "example.com"

// Get first 50 characters
description = "This is a very long description that needs to be truncated...";
if(description.length() > 50)
{
    shortDesc = description.substring(0, 50) + "...";
}
```

#### indexOf()

Returns the index of first occurrence of a substring.

```javascript
// Syntax
index = text.indexOf("searchText");  // Returns -1 if not found

// Examples
email = "john.smith@example.com";
atIndex = email.indexOf("@");  // 10

text = "Hello World";
worldIndex = text.indexOf("World");  // 6
notFound = text.indexOf("xyz");  // -1

// Check if string contains substring
if(email.indexOf("@") > -1)
{
    info "Valid email format";
}

// Find position
fullName = "John Smith Jr.";
spaceIndex = fullName.indexOf(" ");
firstName = fullName.substring(0, spaceIndex);  // "John"
```

#### lastIndexOf()

Returns the index of last occurrence of a substring.

```javascript
// Syntax
index = text.lastIndexOf("searchText");

// Examples
path = "C:\\Users\\Documents\\file.txt";
lastSlash = path.lastIndexOf("\\");
fileName = path.substring(lastSlash + 1);  // "file.txt"

email = "user.name@company.example.com";
lastDot = email.lastIndexOf(".");
extension = email.substring(lastDot + 1);  // "com"
```

#### replace() / replaceAll()

Replaces occurrences of a substring.

```javascript
// Syntax
result = text.replace("oldText", "newText");  // First occurrence
result = text.replaceAll("oldText", "newText");  // All occurrences

// Examples
text = "Hello World";
newText = text.replace("World", "Zoho");  // "Hello Zoho"

// Replace all occurrences
message = "The price is $100. Pay $100 today.";
updated = message.replaceAll("$100", "$99");
// "The price is $99. Pay $99 today."

// Clean phone number
phone = "(555) 123-4567";
cleanPhone = phone.replaceAll("(", "").replaceAll(")", "").replaceAll("-", "").replaceAll(" ", "");
// "5551234567"

// Sanitize input
userInput = "John<script>alert('xss')</script>";
safe = userInput.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
```

#### split()

Splits a string into a list based on a delimiter.

```javascript
// Syntax
listResult = text.split("delimiter");

// Examples
csv = "John,Smith,john@example.com";
parts = csv.split(",");
// parts = {"John", "Smith", "john@example.com"}
firstName = parts.get(0);  // "John"
lastName = parts.get(1);   // "Smith"
email = parts.get(2);      // "john@example.com"

// Split by space
sentence = "The quick brown fox";
words = sentence.split(" ");
// words = {"The", "quick", "brown", "fox"}

// Process tags
tags = "zoho,crm,automation,deluge";
tagList = tags.split(",");
for each tag in tagList
{
    info "Tag: " + tag;
}

// Parse URL parameters
url = "page=1&limit=50&sort=name";
params = url.split("&");
for each param in params
{
    keyValue = param.split("=");
    key = keyValue.get(0);
    value = keyValue.get(1);
    info key + " = " + value;
}
```

#### trim()

Removes leading and trailing whitespace.

```javascript
// Syntax
result = text.trim();

// Examples
input = "  Hello World  ";
cleaned = input.trim();  // "Hello World"

// Form input cleanup
userName = input.UserName.trim();
email = input.Email.trim();

// Remove extra spaces
text = "   Zoho   Corporation   ";
trimmed = text.trim();  // "Zoho   Corporation"

// Validation
userInput = input.Value.trim();
if(userInput == "")
{
    info "Input cannot be empty";
}
```

#### toUpperCase()

Converts string to uppercase.

```javascript
// Syntax
result = text.toUpperCase();

// Examples
name = "john smith";
upper = name.toUpperCase();  // "JOHN SMITH"

// Case-insensitive comparison
input = "YES";
if(input.toUpperCase() == "YES")
{
    proceed = true;
}

// Format codes
productCode = "abc-123";
formatted = productCode.toUpperCase();  // "ABC-123"
```

#### toLowerCase()

Converts string to lowercase.

```javascript
// Syntax
result = text.toLowerCase();

// Examples
email = "USER@EXAMPLE.COM";
lower = email.toLowerCase();  // "user@example.com"

// Normalize input
userInput = input.Choice;
normalized = userInput.toLowerCase();
if(normalized == "yes" || normalized == "y")
{
    confirmed = true;
}

// Domain comparison
domain1 = "EXAMPLE.COM";
domain2 = "example.com";
if(domain1.toLowerCase() == domain2.toLowerCase())
{
    info "Domains match";
}
```

#### concat()

Concatenates strings (alternative to + operator).

```javascript
// Syntax
result = text1.concat(text2);

// Examples
firstName = "John";
lastName = "Smith";
fullName = firstName.concat(" ").concat(lastName);  // "John Smith"

// Alternative (using + operator is more common)
fullName = firstName + " " + lastName;  // "John Smith"
```

#### contains()

Checks if string contains a substring.

```javascript
// Syntax
result = text.contains("searchText");  // Returns true/false

// Examples
email = "user@example.com";
hasAt = email.contains("@");  // true
hasComDomain = email.contains(".com");  // true

// Validation
description = input.Description;
if(description.contains("spam") || description.contains("scam"))
{
    flagForReview = true;
}

// Filter records
products = zoho.crm.getRecords("Products");
for each product in products
{
    productName = product.get("Product_Name");
    if(productName.contains("Premium"))
    {
        applyPremiumPricing(product);
    }
}
```

#### startsWith()

Checks if string starts with specified text.

```javascript
// Syntax
result = text.startsWith("prefix");

// Examples
fileName = "invoice_2025_001.pdf";
isInvoice = fileName.startsWith("invoice");  // true

url = "https://www.zoho.com";
isSecure = url.startsWith("https");  // true

// Process by prefix
recordId = "CRM_12345";
if(recordId.startsWith("CRM_"))
{
    source = "CRM";
}
else if(recordId.startsWith("BOOK_"))
{
    source = "Books";
}
```

#### endsWith()

Checks if string ends with specified text.

```javascript
// Syntax
result = text.endsWith("suffix");

// Examples
fileName = "document.pdf";
isPDF = fileName.endsWith(".pdf");  // true

email = "user@zoho.com";
isZoho = email.endsWith("@zoho.com");  // true

// File type validation
uploadedFile = input.FileName;
if(uploadedFile.endsWith(".exe") || uploadedFile.endsWith(".bat"))
{
    info "Executable files not allowed";
    allowUpload = false;
}

// Domain checking
domain = "www.example.com";
if(domain.endsWith(".com") || domain.endsWith(".net"))
{
    topLevel = "Common TLD";
}
```

#### matches()

Checks if string matches a regular expression pattern.

```javascript
// Syntax
result = text.matches("pattern");

// Examples
email = "user@example.com";
emailPattern = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
isValidFormat = email.matches(emailPattern);

// Phone number validation
phone = "555-123-4567";
phonePattern = "^[0-9]{3}-[0-9]{3}-[0-9]{4}$";
isValidPhone = phone.matches(phonePattern);

// Zipcode validation
zipCode = "12345";
zipPattern = "^[0-9]{5}$";
isValidZip = zipCode.matches(zipPattern);
```

### Math Functions

Functions for mathematical operations and calculations.

#### abs()

Returns absolute value.

```javascript
// Syntax
result = abs(number);

// Examples
num = -10;
absolute = abs(num);  // 10

difference = 50 - 100;  // -50
distance = abs(difference);  // 50

// Calculate variance
actual = 95;
target = 100;
variance = abs(actual - target);  // 5
```

#### round()

Rounds a number to specified decimal places.

```javascript
// Syntax
result = number.round(decimalPlaces);

// Examples
price = 99.999;
rounded = price.round(2);  // 100.00

taxAmount = 12.3456;
finalTax = taxAmount.round(2);  // 12.35

// Currency rounding
subtotal = 99.99;
taxRate = 0.0875;
tax = subtotal * taxRate;  // 8.74825
displayTax = tax.round(2);  // 8.75
total = subtotal + displayTax;  // 108.74
```

#### ceil()

Rounds up to nearest integer.

```javascript
// Syntax
result = ceil(number);

// Examples
value = 4.2;
rounded = ceil(value);  // 5

// Calculate pages needed
totalItems = 47;
itemsPerPage = 10;
pagesNeeded = ceil(totalItems / itemsPerPage);  // 5

// Shipping boxes
totalWeight = 23.5;
maxWeightPerBox = 10;
boxesNeeded = ceil(totalWeight / maxWeightPerBox);  // 3
```

#### floor()

Rounds down to nearest integer.

```javascript
// Syntax
result = floor(number);

// Examples
value = 4.9;
rounded = floor(value);  // 4

// Calculate full years
days = 400;
years = floor(days / 365);  // 1

// Bulk pricing
quantity = 47;
bulkUnit = 10;
bulkQuantity = floor(quantity / bulkUnit);  // 4
discount = bulkQuantity * 5;  // $20 discount
```

#### sqrt()

Returns square root.

```javascript
// Syntax
result = sqrt(number);

// Examples
num = 16;
squareRoot = sqrt(num);  // 4.0

num2 = 25;
root = sqrt(num2);  // 5.0

// Calculate distance (Pythagorean theorem)
x = 3;
y = 4;
distance = sqrt((x * x) + (y * y));  // 5.0
```

#### pow()

Returns power (base raised to exponent).

```javascript
// Syntax
result = pow(base, exponent);

// Examples
base = 2;
exponent = 3;
result = pow(base, exponent);  // 8 (2^3)

// Calculate compound interest
principal = 1000;
rate = 0.05;  // 5%
years = 10;
amount = principal * pow(1 + rate, years);  // 1628.89

// Area of square
side = 5;
area = pow(side, 2);  // 25
```

#### max()

Returns the larger of two numbers.

```javascript
// Syntax
result = max(num1, num2);

// Examples
a = 10;
b = 20;
larger = max(a, b);  // 20

// Ensure minimum value
userInput = 5;
minAllowed = 10;
finalValue = max(userInput, minAllowed);  // 10

// Price comparison
regularPrice = 99.99;
salePrice = 79.99;
displayPrice = max(regularPrice, salePrice);
```

#### min()

Returns the smaller of two numbers.

```javascript
// Syntax
result = min(num1, num2);

// Examples
a = 10;
b = 20;
smaller = min(a, b);  // 10

// Enforce maximum
userQuantity = 100;
maxAllowed = 50;
finalQuantity = min(userQuantity, maxAllowed);  // 50

// Discount cap
calculatedDiscount = 25;
maxDiscount = 20;
appliedDiscount = min(calculatedDiscount, maxDiscount);  // 20
```

#### random()

Generates a random number.

```javascript
// Syntax
result = random();  // Returns decimal between 0 and 1
result = randomNumber(max);  // Returns integer between 0 and max-1

// Examples
randomDecimal = random();  // 0.0 to 1.0

// Random integer
randomInt = randomNumber(100);  // 0 to 99

// Random in range
min = 50;
max = 100;
randomInRange = randomNumber(max - min) + min;  // 50 to 99

// Generate random ID
randomId = randomNumber(1000000);  // 0 to 999999
formattedId = "ID-" + randomId;

// Random selection
options = {"Option A", "Option B", "Option C"};
randomIndex = randomNumber(options.size());
selectedOption = options.get(randomIndex);
```

### Date Functions

Functions for date and time manipulation.

#### today

Returns current date.

```javascript
// Syntax
currentDate = today;

// Examples
currentDate = today;
info "Today is: " + currentDate;

// Date comparison
appointmentDate = '25-Jan-2025';
if(appointmentDate < today)
{
    status = "Overdue";
}
else if(appointmentDate == today)
{
    status = "Today";
}
else
{
    status = "Upcoming";
}
```

#### now

Returns current date and time.

```javascript
// Syntax
currentDateTime = now;

// Examples
currentDateTime = now;
info "Current time: " + currentDateTime;

// Timestamp
recordCreatedTime = now;

// Time-based logic
businessHoursStart = '09:00:00';
businessHoursEnd = '17:00:00';
currentTime = now.toString("HH:mm:ss");
if(currentTime >= businessHoursStart && currentTime <= businessHoursEnd)
{
    duringBusinessHours = true;
}
```

#### addDay()

Adds days to a date.

```javascript
// Syntax
result = dateValue.addDay(numberOfDays);

// Examples
today = today;
tomorrow = today.addDay(1);
nextWeek = today.addDay(7);
yesterday = today.addDay(-1);  // Subtract by adding negative

// Due date calculation
orderDate = now;
dueDate = orderDate.addDay(30);

// Trial period
signupDate = '15-Jan-2025';
trialEndDate = signupDate.addDay(14);  // 14-day trial

// Deadline
currentDate = today;
deadline = currentDate.addDay(5);
updateMap = {"Deadline": deadline};
zoho.crm.updateRecord("Tasks", taskId, updateMap);
```

#### addMonth()

Adds months to a date.

```javascript
// Syntax
result = dateValue.addMonth(numberOfMonths);

// Examples
currentDate = today;
nextMonth = currentDate.addMonth(1);
threeMonthsAgo = currentDate.addMonth(-3);

// Subscription renewal
subscriptionStart = '01-Jan-2025';
renewalDate = subscriptionStart.addMonth(12);  // 1 year

// Quarterly reporting
reportDate = '31-Mar-2025';
nextQuarter = reportDate.addMonth(3);

// Payment schedule
firstPayment = today;
secondPayment = firstPayment.addMonth(1);
thirdPayment = firstPayment.addMonth(2);
```

#### addYear()

Adds years to a date.

```javascript
// Syntax
result = dateValue.addYear(numberOfYears);

// Examples
currentDate = today;
nextYear = currentDate.addYear(1);
fiveYearsAgo = currentDate.addYear(-5);

// Contract expiration
contractStart = '01-Jan-2025';
contractEnd = contractStart.addYear(3);  // 3-year contract

// Age calculation
birthDate = '15-Mar-1990';
checkDate = birthDate.addYear(18);  // 18th birthday

// License renewal
licenseIssued = today;
licenseExpires = licenseIssued.addYear(1);
```

#### getDay()

Returns day of month (1-31).

```javascript
// Syntax
day = dateValue.getDay();

// Examples
currentDate = '15-Jan-2025';
dayOfMonth = currentDate.getDay();  // 15

// Check if payment due
currentDay = today.getDay();
if(currentDay == 1)
{
    info "Monthly payment due today";
}

// End of month check
if(today.addDay(1).getDay() == 1)
{
    info "Last day of month";
    runMonthEndReports();
}
```

#### getMonth()

Returns month number (1-12).

```javascript
// Syntax
month = dateValue.getMonth();

// Examples
currentDate = '15-Jan-2025';
monthNum = currentDate.getMonth();  // 1 (January)

// Seasonal logic
currentMonth = today.getMonth();
if(currentMonth >= 6 && currentMonth <= 8)
{
    season = "Summer";
    applySeasonalPricing();
}

// Quarter calculation
quarter = ceil(currentMonth / 3);
info "Q" + quarter;
```

#### getYear()

Returns year.

```javascript
// Syntax
year = dateValue.getYear();

// Examples
currentDate = '15-Jan-2025';
yearNum = currentDate.getYear();  // 2025

// Age calculation
birthDate = '15-Mar-1990';
birthYear = birthDate.getYear();  // 1990
currentYear = today.getYear();    // 2025
age = currentYear - birthYear;    // 35

// Fiscal year
currentDate = today;
fiscalYear = currentDate.getYear();
if(currentDate.getMonth() < 4)  // Before April
{
    fiscalYear = fiscalYear - 1;
}
```

#### toString()

Formats date as string.

```javascript
// Syntax
result = dateValue.toString("format");

// Format patterns:
// dd - Day (01-31)
// MMM - Month abbreviation (Jan, Feb, etc.)
// MM - Month number (01-12)
// yyyy - Year (2025)
// HH - Hour 24-hour (00-23)
// hh - Hour 12-hour (01-12)
// mm - Minute (00-59)
// ss - Second (00-59)
// a - AM/PM

// Examples
currentDate = now;

// Common formats
formatted1 = currentDate.toString("dd-MMM-yyyy");  // "15-Jan-2025"
formatted2 = currentDate.toString("MM/dd/yyyy");   // "01/15/2025"
formatted3 = currentDate.toString("yyyy-MM-dd");   // "2025-01-15"

// With time
formatted4 = currentDate.toString("dd-MMM-yyyy HH:mm:ss");
// "15-Jan-2025 14:30:00"

formatted5 = currentDate.toString("MM/dd/yyyy hh:mm a");
// "01/15/2025 02:30 PM"

// Custom formats
formatted6 = currentDate.toString("MMM dd, yyyy");  // "Jan 15, 2025"
formatted7 = currentDate.toString("EEEE, MMM dd");  // "Wednesday, Jan 15"

// Display in email
sendmail
[
    from: zoho.adminuserid
    to: "user@example.com"
    subject: "Report for " + today.toString("MMM dd, yyyy")
    message: "Your daily report"
]
```

#### toDate()

Converts string to date.

```javascript
// Syntax
dateValue = textValue.toDate();
dateValue = toDate(textValue, "format");

// Examples
dateText = "15-Jan-2025";
dateValue = dateText.toDate();

// Parse with format
dateText2 = "2025-01-15";
dateValue2 = toDate(dateText2, "yyyy-MM-dd");

// From user input
userInput = "01/15/2025";
parsedDate = toDate(userInput, "MM/dd/yyyy");

// Validation
try
{
    inputDate = input.Date;
    validDate = toDate(inputDate, "dd-MMM-yyyy");
    info "Valid date: " + validDate;
}
catch(e)
{
    info "Invalid date format";
}
```

#### daysBetween()

Calculates days between two dates.

```javascript
// Syntax
days = (endDate - startDate).days();

// Examples
startDate = '01-Jan-2025';
endDate = '31-Jan-2025';
daysDiff = (endDate - startDate).days();  // 30

// Overdue calculation
dueDate = '10-Jan-2025';
currentDate = today;
if(currentDate > dueDate)
{
    daysOverdue = (currentDate - dueDate).days();
    info "Overdue by " + daysOverdue + " days";
}

// Trial remaining
trialStart = '01-Jan-2025';
trialEnd = trialStart.addDay(14);
daysRemaining = (trialEnd - today).days();

// Age in days
birthDate = '01-Jan-2000';
ageInDays = (today - birthDate).days();
```

### List Functions

Functions for manipulating lists (see [Collections](../collections/README.md) for detailed coverage).

```javascript
// Creating lists
myList = {"Item1", "Item2", "Item3"};
emptyList = {};

// add() - Add element
myList.add("Item4");

// addAll() - Add multiple elements
myList.addAll({"Item5", "Item6"});

// get() - Get element by index
firstItem = myList.get(0);

// remove() - Remove element
myList.remove("Item2");

// contains() - Check if contains
hasItem = myList.contains("Item1");  // true

// size() - Get count
count = myList.size();

// indexOf() - Get index
index = myList.indexOf("Item3");

// clear() - Remove all
myList.clear();

// sort() - Sort ascending
numbers = {5, 2, 8, 1, 9};
numbers.sort();  // {1, 2, 5, 8, 9}

// reverse() - Reverse order
numbers.reverse();  // {9, 8, 5, 2, 1}
```

### Map Functions

Functions for manipulating maps (see [Collections](../collections/README.md) for detailed coverage).

```javascript
// Creating maps
myMap = {"key1": "value1", "key2": "value2"};
emptyMap = Map();

// put() - Add/update key-value
myMap.put("key3", "value3");

// get() - Get value by key
value = myMap.get("key1");

// remove() - Remove key
myMap.remove("key2");

// containsKey() - Check if key exists
hasKey = myMap.containsKey("key1");  // true

// keys() - Get all keys
allKeys = myMap.keys();  // {"key1", "key2", "key3"}

// values() - Get all values
allValues = myMap.values();  // {"value1", "value2", "value3"}

// size() - Get count
count = myMap.size();

// clear() - Remove all
myMap.clear();

// putAll() - Merge maps
additionalData = {"key4": "value4", "key5": "value5"};
myMap.putAll(additionalData);
```

### Conversion Functions

Functions for converting between data types.

#### toString()

Converts any value to string.

```javascript
// Number to string
num = 42;
text = num.toString();  // "42"

// Boolean to string
flag = true;
text = flag.toString();  // "true"

// Date to string (with format)
date = today;
text = date.toString("dd-MMM-yyyy");

// For concatenation
age = 30;
message = "Your age is " + age.toString();
```

#### toNumber()

Converts string to integer.

```javascript
// String to number
text = "123";
num = text.toNumber();  // 123

// From user input
userInput = "50";
quantity = userInput.toNumber();
total = quantity * price;

// Decimal to integer (truncates)
decimal = 99.99;
integer = decimal.toNumber();  // 99

// Validation
try
{
    userValue = input.Value;
    numValue = userValue.toNumber();
    info "Valid number: " + numValue;
}
catch(e)
{
    info "Invalid number format";
}
```

#### toDecimal()

Converts string to decimal/float.

```javascript
// String to decimal
text = "99.99";
decimal = text.toDecimal();  // 99.99

// From user input
priceInput = "29.95";
price = priceInput.toDecimal();
tax = price * 0.08;

// Number to decimal
integer = 100;
decimal = integer.toDecimal();  // 100.0

// Financial calculations
amountText = "1234.56";
amount = amountText.toDecimal();
fee = amount * 0.025;
total = amount + fee;
```

#### toBoolean()

Converts value to boolean.

```javascript
// String to boolean
text = "true";
flag = text.toBoolean();  // true

text2 = "false";
flag2 = text2.toBoolean();  // false

// Number to boolean (non-zero = true)
num = 1;
flag = num.toBoolean();  // true

num2 = 0;
flag2 = num2.toBoolean();  // false

// From checkbox
checkboxValue = input.AgreeToTerms;  // "true" or "false"
agreed = checkboxValue.toBoolean();
```

### Type Checking Functions

Functions to check variable types.

```javascript
// Check if text/string
value = "Hello";
isText = value.isText();  // true

// Check if number
value = 42;
isNum = value.isNumber();  // true

// Check if decimal
value = 99.99;
isDec = value.isDecimal();  // true

// Check if boolean
value = true;
isBool = value.isBoolean();  // true

// Check if date
value = today;
isDate = value.isDate();  // true

// Check if list
value = {"a", "b", "c"};
isList = value.isList();  // true

// Check if map
value = {"key": "value"};
isMap = value.isMap();  // true

// Check if null
value = null;
isNull = value.isNull();  // true

// Type validation example
userInput = input.Value;
if(userInput.isNumber())
{
    processNumber(userInput);
}
else if(userInput.isText())
{
    processText(userInput);
}
else
{
    info "Unsupported type";
}
```

## Custom Functions

Create reusable functions for your custom logic.

### Basic Syntax

```javascript
// Syntax
returnType functionName(param1Type param1Name, param2Type param2Name)
{
    // Function body
    return value;
}

// Simplified syntax (types optional)
void functionName(param1, param2)
{
    // Function body
}
```

### Examples

#### Simple Function

```javascript
// Function with no parameters
void greetUser()
{
    info "Hello, User!";
}

// Call the function
greetUser();
```

#### Function with Parameters

```javascript
// Function with parameters
void greetByName(string name)
{
    info "Hello, " + name + "!";
}

// Call with argument
greetByName("John");  // "Hello, John!"
greetByName("Sarah");  // "Hello, Sarah!"
```

#### Function with Return Value

```javascript
// Calculate discount
decimal calculateDiscount(decimal amount, decimal percentage)
{
    discount = amount * (percentage / 100);
    return discount;
}

// Use the function
orderAmount = 100.00;
discountPercent = 10;
discount = calculateDiscount(orderAmount, discountPercent);
finalAmount = orderAmount - discount;
info "Final amount: $" + finalAmount;  // $90.00
```

#### Multiple Parameters

```javascript
// Format full name
string formatFullName(string firstName, string lastName, string title)
{
    if(title != null && title != "")
    {
        return title + " " + firstName + " " + lastName;
    }
    else
    {
        return firstName + " " + lastName;
    }
}

// Usage
name1 = formatFullName("John", "Smith", "Dr.");  // "Dr. John Smith"
name2 = formatFullName("Jane", "Doe", "");       // "Jane Doe"
```

#### Complex Business Logic

```javascript
// Calculate shipping cost
decimal calculateShipping(decimal orderTotal, string shippingMethod, boolean isPremiumMember)
{
    shippingCost = 0;

    // Free shipping for premium members on orders over $50
    if(isPremiumMember && orderTotal >= 50)
    {
        return 0;
    }

    // Shipping rates by method
    if(shippingMethod == "Standard")
    {
        if(orderTotal < 50)
        {
            shippingCost = 8.99;
        }
        else
        {
            shippingCost = 4.99;
        }
    }
    else if(shippingMethod == "Express")
    {
        shippingCost = 14.99;
    }
    else if(shippingMethod == "Overnight")
    {
        shippingCost = 24.99;
    }

    return shippingCost;
}

// Usage
orderTotal = 75.00;
shippingMethod = "Express";
isPremium = true;
shipping = calculateShipping(orderTotal, shippingMethod, isPremium);
grandTotal = orderTotal + shipping;
```

#### Data Validation Function

```javascript
// Validate email format
boolean isValidEmail(string email)
{
    if(email == null || email == "")
    {
        return false;
    }

    // Check for @ symbol
    if(!email.contains("@"))
    {
        return false;
    }

    // Check for domain
    atIndex = email.indexOf("@");
    if(atIndex == 0 || atIndex == email.length() - 1)
    {
        return false;
    }

    // Check for dot after @
    domain = email.substring(atIndex + 1);
    if(!domain.contains("."))
    {
        return false;
    }

    return true;
}

// Usage
userEmail = "user@example.com";
if(isValidEmail(userEmail))
{
    info "Email is valid";
    sendWelcomeEmail(userEmail);
}
else
{
    info "Invalid email format";
}
```

#### CRM Helper Function

```javascript
// Get contact full name from CRM
string getContactName(string contactId)
{
    contactRecord = zoho.crm.getRecordById("Contacts", contactId);

    firstName = contactRecord.get("First_Name");
    lastName = contactRecord.get("Last_Name");

    firstName = ifNull(firstName, "");
    lastName = ifNull(lastName, "");

    fullName = firstName + " " + lastName;
    return fullName.trim();
}

// Usage
contactId = "123456789";
contactName = getContactName(contactId);
info "Contact: " + contactName;
```

#### Error Handling Function

```javascript
// Safe API call with error handling
map callExternalAPI(string endpoint, string method, map params)
{
    result = Map();

    try
    {
        response = invokeurl
        [
            url: endpoint
            type: method
            parameters: params
        ];

        result.put("success", true);
        result.put("data", response);
    }
    catch(e)
    {
        result.put("success", false);
        result.put("error", e.toString());
        info "API Error: " + e;
    }

    return result;
}

// Usage
endpoint = "https://api.example.com/users";
params = {"userId": 12345};
apiResult = callExternalAPI(endpoint, "GET", params);

if(apiResult.get("success") == true)
{
    data = apiResult.get("data");
    processData(data);
}
else
{
    error = apiResult.get("error");
    info "Failed: " + error;
}
```

## Function Parameters

### Parameter Types

Parameters can have type declarations (optional in Deluge):

```javascript
// With types
void processUser(string name, int age, boolean isActive)
{
    info name + " is " + age + " years old";
}

// Without types (more common in Deluge)
void processUser(name, age, isActive)
{
    info name + " is " + age + " years old";
}
```

### Default Parameters

Deluge doesn't directly support default parameters, but you can use null checks:

```javascript
void greetUser(name, greeting)
{
    // Set default if not provided
    if(greeting == null || greeting == "")
    {
        greeting = "Hello";
    }

    info greeting + ", " + name + "!";
}

// Call with both parameters
greetUser("John", "Welcome");  // "Welcome, John!"

// Call with default
greetUser("Jane", "");  // "Hello, Jane!"
```

### Variable Number of Parameters

Use lists for variable parameters:

```javascript
// Accept list of items
decimal calculateTotal(list items)
{
    total = 0;
    for each item in items
    {
        total = total + item;
    }
    return total;
}

// Usage
prices = {29.99, 49.99, 19.99};
total = calculateTotal(prices);  // 99.97
```

### Passing Maps as Parameters

```javascript
void updateCustomerRecord(map customerData)
{
    customerId = customerData.get("id");
    updateMap = Map();

    if(customerData.containsKey("name"))
    {
        updateMap.put("Name", customerData.get("name"));
    }

    if(customerData.containsKey("email"))
    {
        updateMap.put("Email", customerData.get("email"));
    }

    if(updateMap.size() > 0)
    {
        zoho.crm.updateRecord("Contacts", customerId, updateMap);
    }
}

// Usage
customerData = {
    "id": "123456789",
    "name": "John Smith",
    "email": "john@example.com"
};
updateCustomerRecord(customerData);
```

## Return Values

### Single Return Value

```javascript
// Return string
string getGreeting(string name)
{
    return "Hello, " + name;
}

// Return number
int calculateAge(string birthYear)
{
    currentYear = today.getYear();
    age = currentYear - birthYear.toNumber();
    return age;
}

// Return boolean
boolean isEligible(int age, boolean hasAccount)
{
    return age >= 18 && hasAccount == true;
}
```

### Multiple Return Values (using Map)

```javascript
// Return multiple values in a map
map analyzeOrder(decimal orderTotal)
{
    result = Map();

    // Calculate tax
    taxRate = 0.08;
    tax = orderTotal * taxRate;

    // Calculate shipping
    shipping = 0;
    if(orderTotal < 50)
    {
        shipping = 8.99;
    }

    // Calculate total
    grandTotal = orderTotal + tax + shipping;

    // Return all values
    result.put("subtotal", orderTotal);
    result.put("tax", tax);
    result.put("shipping", shipping);
    result.put("total", grandTotal);

    return result;
}

// Usage
orderAmount = 100.00;
analysis = analyzeOrder(orderAmount);

subtotal = analysis.get("subtotal");  // 100.00
tax = analysis.get("tax");            // 8.00
shipping = analysis.get("shipping");  // 0.00
total = analysis.get("total");        // 108.00
```

### Early Return

```javascript
// Early return for validation
boolean processPayment(map paymentInfo)
{
    // Validate amount
    amount = paymentInfo.get("amount");
    if(amount == null || amount <= 0)
    {
        info "Invalid amount";
        return false;
    }

    // Validate payment method
    method = paymentInfo.get("method");
    if(method == null || method == "")
    {
        info "Payment method required";
        return false;
    }

    // Process payment
    result = chargePayment(paymentInfo);
    return result;
}
```

### Void Functions (No Return)

```javascript
// Function that doesn't return a value
void logActivity(string action, string details)
{
    timestamp = now;
    logEntry = timestamp + " - " + action + ": " + details;

    // Log to file or CRM
    info logEntry;

    // No return statement needed
}

// Usage
logActivity("User Login", "john@example.com");
logActivity("Record Created", "Contact ID: 123456");
```

## Function Scope

### Local Variables

Variables declared in a function are local to that function:

```javascript
void calculateTax()
{
    taxRate = 0.08;  // Local to this function
    amount = 100;    // Local to this function
    tax = amount * taxRate;
    info "Tax: " + tax;
}

calculateTax();
// taxRate and amount are not accessible here
```

### Script-Level Variables

Variables declared outside functions are accessible to all functions:

```javascript
// Script-level variable
globalTaxRate = 0.08;

decimal calculateTax(decimal amount)
{
    // Can access globalTaxRate
    return amount * globalTaxRate;
}

// Both functions can use globalTaxRate
tax1 = calculateTax(100);  // Uses 0.08
tax2 = calculateTax(200);  // Uses 0.08
```

### Parameter Scope

Parameters are only accessible within the function:

```javascript
void processOrder(orderId, customerName)
{
    // orderId and customerName only accessible here
    info "Processing order " + orderId + " for " + customerName;
}

processOrder("12345", "John Smith");
// orderId and customerName not accessible here
```

## Function Limitations

### 1. Function Call Limit

**Maximum 75 function calls per script execution**

```javascript
// This will fail if called too many times
void processRecord(recordId)
{
    // Process logic
}

records = zoho.crm.getRecords("Leads", 1, 200);
counter = 0;

for each record in records
{
    if(counter >= 75)
    {
        info "Reached function call limit";
        break;
    }

    processRecord(record.get("id"));
    counter = counter + 1;
}
```

### 2. No Function Overloading

Cannot have multiple functions with the same name:

```javascript
// NOT ALLOWED
void calculateTotal(decimal amount)
{
    return amount * 1.08;
}

void calculateTotal(decimal amount, decimal taxRate)
{
    return amount * (1 + taxRate);
}
// Second function will overwrite the first
```

### 3. No Anonymous Functions

Deluge doesn't support anonymous/lambda functions:

```javascript
// NOT SUPPORTED
callback = function(x) { return x * 2; };
```

### 4. Recursion Limits

Recursive functions count toward the 75 call limit:

```javascript
int factorial(int n)
{
    if(n <= 1)
    {
        return 1;
    }
    return n * factorial(n - 1);
}

// Be careful with recursion depth
result = factorial(10);  // 10 function calls
```

## Best Practices

### 1. Use Descriptive Names

```javascript
// Good: Clear purpose
decimal calculateMonthlyPayment(decimal principal, decimal rate, int months)
{
    monthlyRate = rate / 12;
    payment = principal * (monthlyRate / (1 - pow(1 + monthlyRate, -months)));
    return payment;
}

// Poor: Unclear
decimal calc(decimal p, decimal r, int m)
{
    mr = r / 12;
    pmt = p * (mr / (1 - pow(1 + mr, -m)));
    return pmt;
}
```

### 2. Keep Functions Focused

```javascript
// Good: Single responsibility
boolean isValidEmail(string email)
{
    return email != null && email.contains("@") && email.contains(".");
}

decimal calculateTax(decimal amount, decimal rate)
{
    return amount * rate;
}

// Poor: Multiple responsibilities
map processUserData(string email, decimal amount)
{
    // Validates email, calculates tax, updates record, sends email
    // Too many responsibilities
}
```

### 3. Validate Input Parameters

```javascript
// Good: Input validation
decimal calculateDiscount(decimal amount, decimal percentage)
{
    // Validate inputs
    if(amount == null || amount < 0)
    {
        info "Invalid amount";
        return 0;
    }

    if(percentage == null || percentage < 0 || percentage > 100)
    {
        info "Invalid percentage";
        return 0;
    }

    return amount * (percentage / 100);
}

// Poor: No validation
decimal calculateDiscount(decimal amount, decimal percentage)
{
    return amount * (percentage / 100);  // May produce unexpected results
}
```

### 4. Handle Errors Gracefully

```javascript
// Good: Error handling
map getRecordSafe(string module, string recordId)
{
    result = Map();

    try
    {
        record = zoho.crm.getRecordById(module, recordId);
        result.put("success", true);
        result.put("record", record);
    }
    catch(e)
    {
        result.put("success", false);
        result.put("error", e.toString());
        info "Error fetching record: " + e;
    }

    return result;
}

// Usage
recordResult = getRecordSafe("Contacts", contactId);
if(recordResult.get("success") == true)
{
    record = recordResult.get("record");
    processRecord(record);
}
```

### 5. Document Complex Functions

```javascript
// Good: Documented function
/**
 * Calculates the compound interest for an investment
 * @param principal - Initial investment amount
 * @param rate - Annual interest rate (as decimal, e.g., 0.05 for 5%)
 * @param years - Number of years
 * @param compoundFrequency - Times per year interest is compounded
 * @return Final amount including interest
 */
decimal calculateCompoundInterest(decimal principal, decimal rate, int years, int compoundFrequency)
{
    n = compoundFrequency;
    t = years;
    r = rate;
    p = principal;

    amount = p * pow(1 + (r / n), n * t);
    return amount;
}
```

### 6. Return Early for Validation

```javascript
// Good: Early returns
boolean canProcessOrder(map order)
{
    // Check customer
    if(order.get("customer_id") == null)
    {
        return false;
    }

    // Check items
    items = order.get("items");
    if(items == null || items.size() == 0)
    {
        return false;
    }

    // Check payment
    if(order.get("payment_method") == null)
    {
        return false;
    }

    return true;
}
```

### 7. Use Helper Functions

```javascript
// Break complex logic into helper functions
void processLead(map leadData)
{
    // Validate
    if(!isValidLead(leadData))
    {
        return;
    }

    // Enrich data
    enrichedData = enrichLeadData(leadData);

    // Create record
    leadId = createLeadRecord(enrichedData);

    // Send notifications
    sendNotifications(leadId, enrichedData);
}

boolean isValidLead(map leadData)
{
    // Validation logic
    return true;
}

map enrichLeadData(map leadData)
{
    // Enrichment logic
    return leadData;
}

string createLeadRecord(map leadData)
{
    // Creation logic
    return "12345";
}

void sendNotifications(string leadId, map leadData)
{
    // Notification logic
}
```

### 8. Avoid Global State Changes

```javascript
// Good: Return new value
decimal addTax(decimal amount, decimal taxRate)
{
    return amount * (1 + taxRate);
}

// Poor: Modifies global variable
void addTax()
{
    globalAmount = globalAmount * 1.08;  // Modifies global state
}
```

### 9. Limit Function Complexity

```javascript
// If a function is too complex, break it down
void processOrder(map orderData)
{
    // Instead of one large function
    validateOrder(orderData);
    calculatePricing(orderData);
    applyDiscounts(orderData);
    processPayment(orderData);
    updateInventory(orderData);
    sendConfirmation(orderData);
}
```

### 10. Test Edge Cases

```javascript
// Consider edge cases in functions
int safeDivide(int numerator, int denominator)
{
    // Handle division by zero
    if(denominator == 0)
    {
        info "Cannot divide by zero";
        return 0;
    }

    return numerator / denominator;
}

string getFirstWord(string text)
{
    // Handle null/empty
    if(text == null || text == "")
    {
        return "";
    }

    // Handle no spaces
    if(!text.contains(" "))
    {
        return text;
    }

    spaceIndex = text.indexOf(" ");
    return text.substring(0, spaceIndex);
}
```

## Summary

### Function Quick Reference

| Category | Common Functions | Purpose |
|----------|------------------|---------|
| Text | `length()`, `substring()`, `indexOf()`, `replace()`, `split()`, `trim()`, `toUpperCase()`, `toLowerCase()`, `contains()`, `startsWith()`, `endsWith()` | String manipulation |
| Math | `abs()`, `round()`, `ceil()`, `floor()`, `sqrt()`, `pow()`, `max()`, `min()`, `random()` | Mathematical operations |
| Date | `today`, `now`, `addDay()`, `addMonth()`, `addYear()`, `getDay()`, `getMonth()`, `getYear()`, `toString()`, `toDate()` | Date/time operations |
| List | `add()`, `get()`, `remove()`, `contains()`, `size()`, `indexOf()`, `clear()`, `sort()`, `reverse()` | List operations |
| Map | `put()`, `get()`, `remove()`, `containsKey()`, `keys()`, `values()`, `size()`, `clear()` | Map operations |
| Conversion | `toString()`, `toNumber()`, `toDecimal()`, `toBoolean()`, `toDate()` | Type conversions |
| Type Check | `isText()`, `isNumber()`, `isDecimal()`, `isBoolean()`, `isDate()`, `isList()`, `isMap()`, `isNull()` | Type validation |

### Custom Function Template

```javascript
// Function template
returnType functionName(param1Type param1, param2Type param2)
{
    // 1. Validate inputs
    if(param1 == null)
    {
        return defaultValue;
    }

    // 2. Declare variables
    result = 0;

    // 3. Process logic
    result = param1 + param2;

    // 4. Return result
    return result;
}
```

## Additional Resources

- [Data Types](../data-types/README.md) - Understanding Deluge data types
- [Collections](../collections/README.md) - Lists and Maps in detail
- [Strings](../strings/README.md) - String manipulation
- [Date-Time](../date-time/README.md) - Date operations
- [Examples](../examples/README.md) - Real-world function examples

## References

- [Zoho Deluge Built-in Functions](https://www.zoho.com/deluge/help/functions.html)
- [Deluge Script Functions](https://deluge.zoho.com/help/)
- [Custom Functions in Deluge](https://www.zoho.com/creator/help/script/custom-functions.html)
