# Deluge String Manipulation

Strings (text) are one of the most commonly used data types in Deluge. This comprehensive guide covers all string functions, operations, and techniques for text manipulation.

## Table of Contents

- [Overview](#overview)
- [String Basics](#string-basics)
- [String Functions](#string-functions)
  - [Length and Size](#length-and-size)
  - [Extracting Substrings](#extracting-substrings)
  - [Finding and Searching](#finding-and-searching)
  - [Replacing Text](#replacing-text)
  - [Splitting and Joining](#splitting-and-joining)
  - [Trimming and Padding](#trimming-and-padding)
  - [Case Conversion](#case-conversion)
  - [String Comparison](#string-comparison)
  - [Pattern Matching](#pattern-matching)
- [String Concatenation](#string-concatenation)
- [String Formatting](#string-formatting)
- [Common String Tasks](#common-string-tasks)
- [Best Practices](#best-practices)

## Overview

In Deluge, strings are called "Text" data type and must be enclosed in **double quotes**.

### Key Characteristics

- **Immutable**: String operations return new strings
- **Zero-based**: Character positions start at 0
- **Case-sensitive**: "Hello" ≠ "hello"
- **Unicode support**: Supports international characters
- **Double quotes required**: Always use `"text"` not `'text'`

### String Syntax

```javascript
// Correct
message = "Hello World";
name = "John Smith";
email = "user@example.com";

// Note: Single quotes are for dates
date = '15-Jan-2025';  // Date, not string
```

## String Basics

### Creating Strings

```javascript
// Simple strings
greeting = "Hello";
name = "Zoho";
empty = "";

// Strings with numbers
phoneNumber = "555-1234";
zipCode = "94025";

// Strings with special characters
address = "123 Main St, Suite #456";
message = "Hello, World!";

// Strings with quotes (escaped)
quote = "He said, \"Hello!\"";
quote2 = "It's a beautiful day";  // Single quote inside double quotes

// Multi-word strings
sentence = "The quick brown fox jumps over the lazy dog";
paragraph = "This is a longer paragraph with multiple sentences. It can contain various punctuation marks!";
```

### String Properties

```javascript
text = "Hello World";

// Get length
length = text.length();  // 11

// Check if empty
if(text == "")
{
    info "String is empty";
}

// Check if null or empty
if(text == null || text == "")
{
    info "No text provided";
}
```

## String Functions

### Length and Size

#### length()

Returns the number of characters in a string.

```javascript
// Basic length
text = "Hello";
len = text.length();  // 5

email = "user@example.com";
emailLength = email.length();  // 17

// Empty string
empty = "";
emptyLength = empty.length();  // 0

// Validation
password = input.Password;
if(password.length() < 8)
{
    info "Password must be at least 8 characters";
}
else if(password.length() > 32)
{
    info "Password too long (max 32 characters)";
}
else
{
    info "Password length valid";
}

// Character limit
description = input.Description;
maxLength = 500;
if(description.length() > maxLength)
{
    truncated = description.substring(0, maxLength);
    info "Description truncated to " + maxLength + " characters";
}
```

### Extracting Substrings

#### substring()

Extracts a portion of a string between two indices.

```javascript
// Syntax: substring(startIndex, endIndex)
// startIndex: inclusive (0-based)
// endIndex: exclusive

// Basic examples
text = "Hello World";
hello = text.substring(0, 5);    // "Hello"
world = text.substring(6, 11);   // "World"

// Extract from position to end
text = "Hello World";
fromIndex = text.substring(6);   // "World" (if supported)

// Email username and domain
email = "john.smith@example.com";
atIndex = email.indexOf("@");
username = email.substring(0, atIndex);          // "john.smith"
domain = email.substring(atIndex + 1);           // "example.com"

// Get file extension
fileName = "document.pdf";
dotIndex = fileName.lastIndexOf(".");
extension = fileName.substring(dotIndex + 1);    // "pdf"

// Extract area code from phone
phone = "555-123-4567";
areaCode = phone.substring(0, 3);                // "555"

// First N characters
text = "This is a long description";
preview = text.substring(0, 20);                 // "This is a long descr"

// Middle portion
text = "ABCDEFGHIJ";
middle = text.substring(3, 7);                   // "DEFG"

// Validation before substring
text = "Hello";
startIdx = 0;
endIdx = 10;
if(endIdx <= text.length())
{
    sub = text.substring(startIdx, endIdx);
}
else
{
    sub = text.substring(startIdx, text.length());
}
```

### Finding and Searching

#### indexOf()

Returns the first occurrence position of a substring.

```javascript
// Syntax: indexOf("searchText")
// Returns -1 if not found

// Basic search
text = "Hello World";
pos = text.indexOf("World");     // 6
pos2 = text.indexOf("o");        // 4 (first 'o')
notFound = text.indexOf("xyz");  // -1

// Check if contains
email = "user@example.com";
if(email.indexOf("@") > -1)
{
    info "Valid email format (contains @)";
}

// Find and extract
url = "https://www.zoho.com/crm";
protocolEnd = url.indexOf("://");
protocol = url.substring(0, protocolEnd);  // "https"

// Find delimiter position
csv = "John,Smith,john@example.com";
firstComma = csv.indexOf(",");
firstName = csv.substring(0, firstComma);  // "John"

// Case-sensitive search
text = "Hello World";
pos1 = text.indexOf("world");    // -1 (not found, case-sensitive)
pos2 = text.indexOf("World");    // 6 (found)

// Search from position (if supported)
text = "Hello World, Hello Universe";
firstHello = text.indexOf("Hello");      // 0
// secondHello = text.indexOf("Hello", 1); // Would start search from position 1
```

#### lastIndexOf()

Returns the last occurrence position of a substring.

```javascript
// Syntax: lastIndexOf("searchText")

// Basic usage
text = "Hello World, Hello Universe";
lastHello = text.lastIndexOf("Hello");   // 13

email = "user.name@company.example.com";
lastDot = email.lastIndexOf(".");
tld = email.substring(lastDot + 1);      // "com"

// File path
path = "C:\\Users\\Documents\\file.txt";
lastSlash = path.lastIndexOf("\\");
fileName = path.substring(lastSlash + 1); // "file.txt"
directory = path.substring(0, lastSlash); // "C:\\Users\\Documents"

// URL parsing
url = "https://www.zoho.com/crm/index.html";
lastSlash = url.lastIndexOf("/");
page = url.substring(lastSlash + 1);      // "index.html"

// Find last occurrence
text = "apple, banana, apple, orange";
lastApple = text.lastIndexOf("apple");    // 16
```

#### contains()

Checks if a string contains a substring.

```javascript
// Syntax: contains("searchText")
// Returns true/false

// Basic check
text = "Hello World";
hasWorld = text.contains("World");   // true
hasUniverse = text.contains("Universe");  // false

// Email validation
email = "user@example.com";
if(email.contains("@") && email.contains("."))
{
    info "Email format looks valid";
}
else
{
    info "Invalid email format";
}

// Spam detection
message = input.Message;
spamWords = {"spam", "scam", "phishing", "urgent"};
isSpam = false;
for each word in spamWords
{
    if(message.toLowerCase().contains(word))
    {
        isSpam = true;
        info "Spam word detected: " + word;
        break;
    }
}

// Filter records
products = zoho.crm.getRecords("Products", 1, 200);
premiumProducts = {};
for each product in products
{
    productName = product.get("Product_Name");
    if(productName.contains("Premium") || productName.contains("Pro"))
    {
        premiumProducts.add(product);
    }
}

// Case-sensitive
text = "Hello World";
hasWorld = text.contains("world");   // false (case-sensitive)
hasWorld2 = text.contains("World");  // true
```

#### startsWith()

Checks if a string starts with a specified prefix.

```javascript
// Syntax: startsWith("prefix")
// Returns true/false

// Basic check
fileName = "invoice_2025_001.pdf";
isInvoice = fileName.startsWith("invoice");  // true
isReport = fileName.startsWith("report");    // false

// URL protocol
url = "https://www.zoho.com";
isSecure = url.startsWith("https");  // true
isHttp = url.startsWith("http");     // true (because "https" starts with "http")

// Phone number validation
phone = "+1-555-1234";
isUSNumber = phone.startsWith("+1");  // true

// Record ID prefix
recordId = "CRM_12345";
if(recordId.startsWith("CRM_"))
{
    source = "CRM";
    idNumber = recordId.substring(4);  // "12345"
}
else if(recordId.startsWith("BOOK_"))
{
    source = "Books";
    idNumber = recordId.substring(5);
}

// Filter by prefix
products = {"Pro-Mouse", "Pro-Keyboard", "Standard-Mouse", "Pro-Monitor"};
proProducts = {};
for each product in products
{
    if(product.startsWith("Pro-"))
    {
        proProducts.add(product);
    }
}
// proProducts = {"Pro-Mouse", "Pro-Keyboard", "Pro-Monitor"}

// Case-sensitive
text = "Hello World";
hasHello = text.startsWith("hello");  // false (case-sensitive)
hasHello2 = text.startsWith("Hello"); // true
```

#### endsWith()

Checks if a string ends with a specified suffix.

```javascript
// Syntax: endsWith("suffix")
// Returns true/false

// File extension check
fileName = "document.pdf";
isPDF = fileName.endsWith(".pdf");     // true
isDOC = fileName.endsWith(".doc");     // false

// Email domain
email = "user@zoho.com";
isZohoDomain = email.endsWith("@zoho.com");     // true
isGmailDomain = email.endsWith("@gmail.com");   // false

// URL validation
url = "https://api.zoho.com/crm/v2/Leads";
isAPIEndpoint = url.endsWith("/Leads");  // true

// File type validation
uploadedFile = input.FileName;
allowedExtensions = {".jpg", ".png", ".gif", ".pdf"};
isAllowed = false;
for each ext in allowedExtensions
{
    if(uploadedFile.endsWith(ext))
    {
        isAllowed = true;
        break;
    }
}

if(!isAllowed)
{
    info "File type not allowed";
}

// Domain checking
website = "www.example.com";
if(website.endsWith(".com") || website.endsWith(".org") || website.endsWith(".net"))
{
    topLevelDomain = "Common";
}
else
{
    topLevelDomain = "Other";
}

// Case-sensitive
text = "Hello World";
hasWorld = text.endsWith("world");  // false (case-sensitive)
hasWorld2 = text.endsWith("World"); // true
```

### Replacing Text

#### replace()

Replaces the first occurrence of a substring.

```javascript
// Syntax: replace("oldText", "newText")

// Replace first occurrence
text = "Hello World, Hello Universe";
replaced = text.replace("Hello", "Hi");
// "Hi World, Hello Universe" (only first "Hello")

// Simple replacement
email = "user@example.com";
updated = email.replace("example", "company");
// "user@company.com"

// Fix typo
message = "Teh quick brown fox";
fixed = message.replace("Teh", "The");
// "The quick brown fox"
```

#### replaceAll()

Replaces all occurrences of a substring.

```javascript
// Syntax: replaceAll("oldText", "newText")

// Replace all occurrences
text = "Hello World, Hello Universe";
replaced = text.replaceAll("Hello", "Hi");
// "Hi World, Hi Universe"

// Update prices
message = "Item costs $100. Total: $100 + $100 = $300";
updated = message.replaceAll("$100", "$99");
// "Item costs $99. Total: $99 + $99 = $300"

// Clean phone number
phone = "(555) 123-4567";
cleaned = phone.replaceAll("(", "")
              .replaceAll(")", "")
              .replaceAll("-", "")
              .replaceAll(" ", "");
// "5551234567"

// Remove unwanted characters
input = "Product#123@ABC!";
cleaned = input.replaceAll("#", "")
               .replaceAll("@", "")
               .replaceAll("!", "");
// "Product123ABC"

// Normalize whitespace
text = "Too    many     spaces";
normalized = text.replaceAll("    ", " ")
                 .replaceAll("   ", " ")
                 .replaceAll("  ", " ");
// "Too many spaces"

// Sanitize HTML
userInput = "Hello <script>alert('xss')</script>";
safe = userInput.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
// "Hello &lt;script&gt;alert('xss')&lt;/script&gt;"

// Replace line breaks
multiLine = "Line1\nLine2\nLine3";
singleLine = multiLine.replaceAll("\n", " ");
// "Line1 Line2 Line3"
```

### Splitting and Joining

#### split()

Splits a string into a list based on a delimiter.

```javascript
// Syntax: split("delimiter")
// Returns a list

// CSV parsing
csv = "John,Smith,john@example.com,555-1234";
parts = csv.split(",");
// parts = {"John", "Smith", "john@example.com", "555-1234"}
firstName = parts.get(0);   // "John"
lastName = parts.get(1);    // "Smith"
email = parts.get(2);       // "john@example.com"
phone = parts.get(3);       // "555-1234"

// Split by space
sentence = "The quick brown fox";
words = sentence.split(" ");
// words = {"The", "quick", "brown", "fox"}
wordCount = words.size();   // 4

// Split by newline
multiLine = "Line 1\nLine 2\nLine 3";
lines = multiLine.split("\n");
// lines = {"Line 1", "Line 2", "Line 3"}

// Parse tags
tags = "zoho,crm,automation,deluge";
tagList = tags.split(",");
// tagList = {"zoho", "crm", "automation", "deluge"}
for each tag in tagList
{
    info "Tag: " + tag;
}

// URL path segments
url = "https://www.zoho.com/crm/help/api";
afterProtocol = url.substring(8);  // Remove "https://"
segments = afterProtocol.split("/");
// segments = {"www.zoho.com", "crm", "help", "api"}
domain = segments.get(0);  // "www.zoho.com"

// Parse query parameters
queryString = "page=1&limit=50&sort=name";
params = queryString.split("&");
// params = {"page=1", "limit=50", "sort=name"}
paramMap = Map();
for each param in params
{
    keyValue = param.split("=");
    key = keyValue.get(0);
    value = keyValue.get(1);
    paramMap.put(key, value);
}
// paramMap = {"page": "1", "limit": "50", "sort": "name"}

// Split name
fullName = "John Michael Smith";
nameParts = fullName.split(" ");
if(nameParts.size() == 2)
{
    firstName = nameParts.get(0);
    lastName = nameParts.get(1);
}
else if(nameParts.size() == 3)
{
    firstName = nameParts.get(0);
    middleName = nameParts.get(1);
    lastName = nameParts.get(2);
}

// Handle empty parts
text = "A,,C";  // Empty middle element
parts = text.split(",");
// parts = {"A", "", "C"}
```

#### Joining (Concatenation)

While Deluge doesn't have a native `join()` function, you can build strings from lists:

```javascript
// Join list elements into string
words = {"The", "quick", "brown", "fox"};
sentence = "";
for each word in words
{
    if(sentence != "")
    {
        sentence = sentence + " ";
    }
    sentence = sentence + word;
}
// sentence = "The quick brown fox"

// Join with delimiter
items = {"Apple", "Banana", "Orange"};
result = "";
for each item in items
{
    if(result != "")
    {
        result = result + ", ";
    }
    result = result + item;
}
// result = "Apple, Banana, Orange"

// Build CSV
fields = {"John", "Smith", "john@example.com"};
csvLine = "";
for each field in fields
{
    if(csvLine != "")
    {
        csvLine = csvLine + ",";
    }
    csvLine = csvLine + field;
}
// csvLine = "John,Smith,john@example.com"

// Helper function for joining
string joinList(list items, string delimiter)
{
    result = "";
    for each item in items
    {
        if(result != "")
        {
            result = result + delimiter;
        }
        result = result + item;
    }
    return result;
}

// Usage
tags = {"urgent", "important", "follow-up"};
tagString = joinList(tags, ", ");
// "urgent, important, follow-up"
```

### Trimming and Padding

#### trim()

Removes leading and trailing whitespace.

```javascript
// Syntax: trim()

// Basic trimming
text = "  Hello World  ";
trimmed = text.trim();
// "Hello World"

// Form input cleanup
userName = input.UserName.trim();
email = input.Email.trim();
phone = input.Phone.trim();

// Remove extra spaces from ends
text = "   Zoho   Corporation   ";
trimmed = text.trim();
// "Zoho   Corporation" (only leading/trailing removed)

// Validation after trim
userInput = input.Value.trim();
if(userInput == "")
{
    info "Input cannot be empty";
}

// Clean multiline input
multiLine = "  Line 1  \n  Line 2  \n  Line 3  ";
lines = multiLine.split("\n");
cleanLines = {};
for each line in lines
{
    cleanLines.add(line.trim());
}
// cleanLines = {"Line 1", "Line 2", "Line 3"}

// Process form data
formFields = {"Name", "Email", "Phone", "Address"};
cleanData = Map();
for each field in formFields
{
    rawValue = input.get(field);
    if(rawValue != null)
    {
        cleanValue = rawValue.trim();
        cleanData.put(field, cleanValue);
    }
}
```

#### Padding (Manual Implementation)

Deluge doesn't have built-in padding functions, but you can implement them:

```javascript
// Left pad with zeros
string leftPad(string text, int totalLength, string padChar)
{
    while(text.length() < totalLength)
    {
        text = padChar + text;
    }
    return text;
}

// Usage
invoiceNum = "42";
paddedNum = leftPad(invoiceNum, 6, "0");
// "000042"

// Right pad
string rightPad(string text, int totalLength, string padChar)
{
    while(text.length() < totalLength)
    {
        text = text + padChar;
    }
    return text;
}

// Usage
code = "ABC";
paddedCode = rightPad(code, 6, "X");
// "ABCXXX"

// Format invoice number
invoiceId = 42;
invoiceNumber = "INV-" + leftPad(invoiceId.toString(), 6, "0");
// "INV-000042"
```

### Case Conversion

#### toUpperCase()

Converts all characters to uppercase.

```javascript
// Syntax: toUpperCase()

// Basic conversion
text = "hello world";
upper = text.toUpperCase();
// "HELLO WORLD"

// Case-insensitive comparison
userInput = "YES";
if(userInput.toUpperCase() == "YES")
{
    confirmed = true;
}

// Format product code
productCode = "abc-123-xyz";
formatted = productCode.toUpperCase();
// "ABC-123-XYZ"

// Normalize for comparison
email1 = "USER@EXAMPLE.COM";
email2 = "user@example.com";
if(email1.toUpperCase() == email2.toUpperCase())
{
    info "Emails match";
}

// State abbreviation
state = "california";
stateCode = state.toUpperCase().substring(0, 2);
// "CA"

// Process codes
codes = {"abc", "def", "ghi"};
upperCodes = {};
for each code in codes
{
    upperCodes.add(code.toUpperCase());
}
// upperCodes = {"ABC", "DEF", "GHI"}
```

#### toLowerCase()

Converts all characters to lowercase.

```javascript
// Syntax: toLowerCase()

// Basic conversion
text = "HELLO WORLD";
lower = text.toLowerCase();
// "hello world"

// Email normalization
email = "USER@EXAMPLE.COM";
normalized = email.toLowerCase();
// "user@example.com"

// Case-insensitive search
searchTerm = "ZOHO";
text = "Welcome to Zoho CRM";
if(text.toLowerCase().contains(searchTerm.toLowerCase()))
{
    info "Found: " + searchTerm;
}

// Username normalization
userName = input.UserName.toLowerCase();
// Store usernames in lowercase for consistency

// Domain comparison
domain1 = "EXAMPLE.COM";
domain2 = "example.com";
if(domain1.toLowerCase() == domain2.toLowerCase())
{
    info "Domains match";
}

// Convert list
names = {"JOHN", "MARY", "ROBERT"};
lowerNames = {};
for each name in names
{
    lowerNames.add(name.toLowerCase());
}
// lowerNames = {"john", "mary", "robert"}
```

#### Title Case (Manual Implementation)

```javascript
// Convert to title case (First Letter Capitalized)
string toTitleCase(string text)
{
    words = text.toLowerCase().split(" ");
    titleWords = {};

    for each word in words
    {
        if(word.length() > 0)
        {
            firstChar = word.substring(0, 1).toUpperCase();
            restOfWord = word.substring(1);
            titleWord = firstChar + restOfWord;
            titleWords.add(titleWord);
        }
    }

    // Join words
    result = "";
    for each word in titleWords
    {
        if(result != "")
        {
            result = result + " ";
        }
        result = result + word;
    }

    return result;
}

// Usage
input = "hello world from zoho";
titled = toTitleCase(input);
// "Hello World From Zoho"

input2 = "JOHN SMITH";
titled2 = toTitleCase(input2);
// "John Smith"
```

### String Comparison

#### Equality

```javascript
// Basic equality (case-sensitive)
text1 = "Hello";
text2 = "Hello";
text3 = "hello";

isEqual1 = (text1 == text2);   // true
isEqual2 = (text1 == text3);   // false (case-sensitive)

// Case-insensitive equality
if(text1.toLowerCase() == text3.toLowerCase())
{
    info "Strings match (case-insensitive)";
}

// Null-safe comparison
value1 = "Test";
value2 = null;

if(value1 != null && value2 != null && value1 == value2)
{
    info "Values match";
}
```

#### Comparison Operators

```javascript
// Lexicographic comparison
text1 = "Apple";
text2 = "Banana";

// Less than
isLess = text1 < text2;      // true ("Apple" comes before "Banana")

// Greater than
isGreater = text1 > text2;   // false

// Alphabetical sorting
names = {"Charlie", "Alice", "Bob"};
names.sort();
// names = {"Alice", "Bob", "Charlie"}

// Case matters in comparison
text1 = "apple";
text2 = "Apple";
// Uppercase comes before lowercase in ASCII
result = text2 < text1;  // true (depending on implementation)
```

### Pattern Matching

#### matches()

Checks if a string matches a regular expression pattern.

```javascript
// Syntax: matches("pattern")

// Email validation
email = "user@example.com";
emailPattern = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
isValid = email.matches(emailPattern);

// Phone number formats
phone = "555-123-4567";
phonePattern = "^[0-9]{3}-[0-9]{3}-[0-9]{4}$";
isValidPhone = phone.matches(phonePattern);

// Zip code
zipCode = "12345";
zipPattern = "^[0-9]{5}$";
isValidZip = zipCode.matches(zipPattern);

// Zip+4
zipPlus4 = "12345-6789";
zipPlus4Pattern = "^[0-9]{5}-[0-9]{4}$";
isValidZipPlus4 = zipPlus4.matches(zipPlus4Pattern);

// Alphanumeric only
code = "ABC123";
alphanumericPattern = "^[A-Za-z0-9]+$";
isAlphanumeric = code.matches(alphanumericPattern);

// Validation function
boolean isValidEmail(string email)
{
    if(email == null || email == "")
    {
        return false;
    }

    emailPattern = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
    return email.matches(emailPattern);
}

// Usage
userEmail = "test@example.com";
if(isValidEmail(userEmail))
{
    info "Email is valid";
}
else
{
    info "Invalid email format";
}
```

## String Concatenation

### Using + Operator

```javascript
// Simple concatenation
firstName = "John";
lastName = "Smith";
fullName = firstName + " " + lastName;
// "John Smith"

// Multiple concatenations
greeting = "Hello, " + firstName + " " + lastName + "!";
// "Hello, John Smith!"

// With numbers
age = 30;
message = "I am " + age + " years old";
// "I am 30 years old"

// Building URLs
baseUrl = "https://api.zoho.com";
endpoint = "/crm/v2/Leads";
url = baseUrl + endpoint;
// "https://api.zoho.com/crm/v2/Leads"

// Multi-line concatenation
address = "123 Main Street" + "\n" +
          "Suite 456" + "\n" +
          "Boston, MA 02101";
```

### Using concat()

```javascript
// Alternative to + operator
firstName = "John";
lastName = "Smith";
fullName = firstName.concat(" ").concat(lastName);
// "John Smith"

// Note: + operator is more commonly used
```

### Building Complex Strings

```javascript
// Build HTML
name = "John Smith";
email = "john@example.com";
html = "<div>" +
       "  <h2>" + name + "</h2>" +
       "  <p>Email: " + email + "</p>" +
       "</div>";

// Build SQL (if needed)
tableName = "Customers";
condition = "Status = 'Active'";
query = "SELECT * FROM " + tableName + " WHERE " + condition;

// Build CSV row
fields = {"John", "Smith", "john@example.com", "555-1234"};
csvLine = "";
for each field in fields
{
    if(csvLine != "")
    {
        csvLine = csvLine + ",";
    }
    csvLine = csvLine + field;
}
```

## String Formatting

### Formatting Numbers

```javascript
// Currency
amount = 1234.56;
formatted = "$" + amount.round(2);
// "$1234.56"

// With thousands separator (manual)
string formatCurrency(decimal amount)
{
    rounded = amount.round(2);
    text = rounded.toString();

    // Basic formatting (would need more complex logic for commas)
    return "$" + text;
}

// Percentage
rate = 0.0825;
percentage = (rate * 100).round(2) + "%";
// "8.25%"
```

### Formatting Dates

```javascript
// Date to string
currentDate = today;
formatted = currentDate.toString("MMM dd, yyyy");
// "Jan 15, 2025"

// Different formats
formatted1 = currentDate.toString("dd-MMM-yyyy");    // "15-Jan-2025"
formatted2 = currentDate.toString("MM/dd/yyyy");     // "01/15/2025"
formatted3 = currentDate.toString("yyyy-MM-dd");     // "2025-01-15"

// With time
currentTime = now;
formatted = currentTime.toString("MMM dd, yyyy hh:mm a");
// "Jan 15, 2025 02:30 PM"
```

### Building Templates

```javascript
// Email template
string buildEmailTemplate(map data)
{
    name = data.get("name");
    orderNumber = data.get("orderNumber");
    total = data.get("total");

    template = "Dear " + name + ",\n\n" +
               "Thank you for your order #" + orderNumber + ".\n" +
               "Order total: $" + total + "\n\n" +
               "Best regards,\n" +
               "Zoho Team";

    return template;
}

// Usage
emailData = {
    "name": "John Smith",
    "orderNumber": "ORD-12345",
    "total": "99.99"
};
emailBody = buildEmailTemplate(emailData);
```

## Common String Tasks

### Email Validation

```javascript
boolean isValidEmail(string email)
{
    if(email == null || email == "")
    {
        return false;
    }

    // Check for @
    if(!email.contains("@"))
    {
        return false;
    }

    // Check @ position
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

    // Check domain has content after dot
    lastDot = domain.lastIndexOf(".");
    if(lastDot == domain.length() - 1)
    {
        return false;
    }

    return true;
}

// Usage
email = "user@example.com";
if(isValidEmail(email))
{
    info "Valid email";
}
```

### URL Parsing

```javascript
// Parse URL components
url = "https://www.zoho.com:443/crm/help/api?page=1&sort=name#section2";

// Protocol
protocolEnd = url.indexOf("://");
protocol = url.substring(0, protocolEnd);  // "https"

// Domain and path
afterProtocol = url.substring(protocolEnd + 3);
slashPos = afterProtocol.indexOf("/");
domainAndPort = afterProtocol.substring(0, slashPos);  // "www.zoho.com:443"

// Remove port if present
colonPos = domainAndPort.indexOf(":");
if(colonPos > -1)
{
    domain = domainAndPort.substring(0, colonPos);  // "www.zoho.com"
    port = domainAndPort.substring(colonPos + 1);   // "443"
}
else
{
    domain = domainAndPort;
}

// Path
questionPos = afterProtocol.indexOf("?");
hashPos = afterProtocol.indexOf("#");
if(questionPos > -1)
{
    path = afterProtocol.substring(slashPos, questionPos);
}
else if(hashPos > -1)
{
    path = afterProtocol.substring(slashPos, hashPos);
}
else
{
    path = afterProtocol.substring(slashPos);
}
// path = "/crm/help/api"
```

### Phone Number Formatting

```javascript
// Format phone number
string formatPhoneNumber(string phone)
{
    // Remove all non-digits
    cleaned = phone.replaceAll("(", "")
                   .replaceAll(")", "")
                   .replaceAll("-", "")
                   .replaceAll(" ", "")
                   .replaceAll(".", "");

    // Check length
    if(cleaned.length() != 10)
    {
        return phone;  // Return original if invalid
    }

    // Format as (XXX) XXX-XXXX
    areaCode = cleaned.substring(0, 3);
    exchange = cleaned.substring(3, 6);
    number = cleaned.substring(6, 10);

    return "(" + areaCode + ") " + exchange + "-" + number;
}

// Usage
phone = "5551234567";
formatted = formatPhoneNumber(phone);
// "(555) 123-4567"
```

### Name Parsing

```javascript
// Parse full name
map parseName(string fullName)
{
    result = Map();
    trimmed = fullName.trim();

    if(trimmed == "")
    {
        return result;
    }

    parts = trimmed.split(" ");

    if(parts.size() == 1)
    {
        result.put("firstName", parts.get(0));
    }
    else if(parts.size() == 2)
    {
        result.put("firstName", parts.get(0));
        result.put("lastName", parts.get(1));
    }
    else if(parts.size() >= 3)
    {
        result.put("firstName", parts.get(0));
        result.put("middleName", parts.get(1));

        // Last name might be multiple words
        lastName = "";
        for each i in {2, 3, 4, 5}  // Assuming max 6-word name
        {
            if(i < parts.size())
            {
                if(lastName != "")
                {
                    lastName = lastName + " ";
                }
                lastName = lastName + parts.get(i);
            }
        }
        result.put("lastName", lastName);
    }

    return result;
}

// Usage
fullName = "John Michael Smith";
parsed = parseName(fullName);
firstName = parsed.get("firstName");   // "John"
middleName = parsed.get("middleName"); // "Michael"
lastName = parsed.get("lastName");     // "Smith"
```

### String Truncation

```javascript
// Truncate with ellipsis
string truncate(string text, int maxLength)
{
    if(text == null || text.length() <= maxLength)
    {
        return text;
    }

    return text.substring(0, maxLength - 3) + "...";
}

// Usage
description = "This is a very long description that needs to be truncated for display purposes";
short = truncate(description, 50);
// "This is a very long description that needs to..."

// Truncate at word boundary
string truncateAtWord(string text, int maxLength)
{
    if(text == null || text.length() <= maxLength)
    {
        return text;
    }

    truncated = text.substring(0, maxLength);
    lastSpace = truncated.lastIndexOf(" ");

    if(lastSpace > 0)
    {
        return truncated.substring(0, lastSpace) + "...";
    }
    else
    {
        return truncated + "...";
    }
}
```

### Slug Generation

```javascript
// Generate URL-friendly slug
string generateSlug(string text)
{
    // Convert to lowercase
    slug = text.toLowerCase();

    // Replace spaces with hyphens
    slug = slug.replaceAll(" ", "-");

    // Remove special characters (simplified)
    slug = slug.replaceAll("!", "")
             .replaceAll("@", "")
             .replaceAll("#", "")
             .replaceAll("$", "")
             .replaceAll("%", "")
             .replaceAll("&", "")
             .replaceAll("*", "")
             .replaceAll("(", "")
             .replaceAll(")", "")
             .replaceAll("[", "")
             .replaceAll("]", "")
             .replaceAll("{", "")
             .replaceAll("}", "");

    return slug;
}

// Usage
title = "Getting Started with Zoho CRM!";
slug = generateSlug(title);
// "getting-started-with-zoho-crm"
```

## Best Practices

### 1. Always Check for Null

```javascript
// Good: Null-safe
if(text != null && text != "")
{
    upper = text.toUpperCase();
}

// Poor: May error if null
upper = text.toUpperCase();
```

### 2. Validate Before String Operations

```javascript
// Good: Validate length
if(text.length() >= 10)
{
    sub = text.substring(0, 10);
}

// Poor: May error if text too short
sub = text.substring(0, 10);
```

### 3. Use Appropriate Functions

```javascript
// Good: Use contains() for checking
if(email.contains("@"))
{
    // Has @ symbol
}

// Poor: Use indexOf() unnecessarily
if(email.indexOf("@") > -1)
{
    // Has @ symbol
}
```

### 4. Be Case-Aware

```javascript
// Good: Case-insensitive comparison
if(input.toLowerCase() == "yes")
{
    confirmed = true;
}

// Poor: May miss valid inputs
if(input == "yes")  // Misses "YES", "Yes", etc.
{
    confirmed = true;
}
```

### 5. Trim User Input

```javascript
// Good: Trim input
userName = input.UserName.trim();
email = input.Email.trim();

// Poor: No trimming
userName = input.UserName;  // May have spaces
```

### 6. Build Complex Strings Efficiently

```javascript
// Good: Build once
parts = {"Hello", "World", "from", "Zoho"};
result = "";
for each part in parts
{
    if(result != "")
    {
        result = result + " ";
    }
    result = result + part;
}

// Poor: Inefficient multiple operations
result = "";
result = result + parts.get(0) + " ";
result = result + parts.get(1) + " ";
result = result + parts.get(2) + " ";
result = result + parts.get(3);
```

### 7. Use Constants for Magic Strings

```javascript
// Good: Use constants
STATUS_ACTIVE = "Active";
STATUS_PENDING = "Pending";
STATUS_CLOSED = "Closed";

if(status == STATUS_ACTIVE)
{
    processActiveRecord();
}

// Poor: Magic strings
if(status == "Active")
{
    processActiveRecord();
}
```

### 8. Document Complex Regex

```javascript
// Good: Documented pattern
/**
 * Email validation pattern:
 * - Allows letters, numbers, +, _, ., -
 * - Requires @ symbol
 * - Requires domain with at least one dot
 */
emailPattern = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
isValid = email.matches(emailPattern);

// Poor: Unexplained regex
isValid = email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
```

## Summary

### String Function Quick Reference

| Function | Purpose | Example |
|----------|---------|---------|
| `length()` | Get string length | `"Hello".length()` → 5 |
| `substring(start, end)` | Extract portion | `"Hello".substring(0, 3)` → "Hel" |
| `indexOf(text)` | Find first position | `"Hello".indexOf("l")` → 2 |
| `lastIndexOf(text)` | Find last position | `"Hello".lastIndexOf("l")` → 3 |
| `contains(text)` | Check if contains | `"Hello".contains("ell")` → true |
| `startsWith(text)` | Check prefix | `"Hello".startsWith("He")` → true |
| `endsWith(text)` | Check suffix | `"Hello".endsWith("lo")` → true |
| `replace(old, new)` | Replace first | `"Hi Hi".replace("Hi", "Bye")` → "Bye Hi" |
| `replaceAll(old, new)` | Replace all | `"Hi Hi".replaceAll("Hi", "Bye")` → "Bye Bye" |
| `split(delimiter)` | Split to list | `"A,B,C".split(",")` → {"A", "B", "C"} |
| `trim()` | Remove whitespace | `"  Hi  ".trim()` → "Hi" |
| `toUpperCase()` | To uppercase | `"hello".toUpperCase()` → "HELLO" |
| `toLowerCase()` | To lowercase | `"HELLO".toLowerCase()` → "hello" |
| `matches(pattern)` | Regex match | `"abc".matches("^[a-z]+$")` → true |

## Additional Resources

- [Data Types](../data-types/README.md) - Text data type details
- [Functions](../functions/README.md) - All string functions
- [Examples](../examples/README.md) - Real-world string examples

## References

- [Zoho Deluge String Functions](https://www.zoho.com/deluge/help/functions/string-functions.html)
- [Deluge Text Data Type](https://www.zoho.com/deluge/help/datatypes/text.html)
